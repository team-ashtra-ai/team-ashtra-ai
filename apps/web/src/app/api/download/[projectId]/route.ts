import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import {
  findProjectById,
  getLegacyProjectDirectory,
  getProjectDirectory,
} from "@/lib/storage";
import { createZipFromDirectory } from "@/lib/zip-creator";
import {
  generateWordPressExport,
  generateNetlifyConfig,
  generateCloudflareConfig,
  generateDockerfile,
  generateEnvTemplate,
} from "@/lib/export";
import { optimizeHtmlWithBlueprint } from "@/lib/html-optimizer";
import type { ProjectRecord } from "@/lib/types";

function getProjectBaseDirectories(projectId: string) {
  return [getProjectDirectory(projectId), getLegacyProjectDirectory(projectId)];
}

async function readProjectTextFile(projectId: string, ...segments: string[]) {
  for (const baseDirectory of getProjectBaseDirectories(projectId)) {
    try {
      return await readFile(path.join(baseDirectory, ...segments), "utf-8");
    } catch {
      continue;
    }
  }

  return null;
}

function buildDownloadResponse(body: string, contentType: string, filename: string) {
  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

async function createDirectoryZip(
  projectId: string,
  directoryName: "original" | "optimized" | "wordpress-theme",
  filename: string,
): Promise<Response> {
  for (const baseDirectory of getProjectBaseDirectories(projectId)) {
    const directoryPath = path.join(baseDirectory, directoryName);
    try {
      const zipBuffer = await createZipFromDirectory(directoryPath);
      return new Response(new Uint8Array(zipBuffer), {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } catch {
      continue;
    }
  }

  return new Response("Requested package not found", { status: 404 });
}

async function downloadOriginalSite(projectId: string): Promise<Response> {
  return createDirectoryZip(projectId, "original", "original-site-package.zip");
}

async function downloadOptimizedSite(project: ProjectRecord): Promise<Response> {
  return createDirectoryZip(project.id, "optimized", "optimized-site-package.zip");
}

async function downloadWordPressExport(project: ProjectRecord): Promise<Response> {
  for (const baseDirectory of getProjectBaseDirectories(project.id)) {
    try {
      const zipBuffer = await createZipFromDirectory(path.join(baseDirectory, "wordpress-theme"));
      return new Response(new Uint8Array(zipBuffer), {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": 'attachment; filename="wordpress-theme-package.zip"',
        },
      });
    } catch {
      continue;
    }
  }

  try {
    const storedOptimizedHtml = await readProjectTextFile(
      project.id,
      "optimized",
      "index.html",
    );
    const originalHtml = storedOptimizedHtml
      ? null
      : await readProjectTextFile(project.id, "original", "index.html");
    const html = storedOptimizedHtml || originalHtml;

    if (!html) {
      return new Response("WordPress source HTML not found", { status: 404 });
    }

    const optimizedHtml =
      storedOptimizedHtml ||
      optimizeHtmlWithBlueprint(
        html,
        project.blueprint,
        project.intake,
        project.preview?.feedbackEntries?.[0]
          ? [
              project.preview.feedbackEntries[0].summary,
              project.preview.feedbackEntries[0].requestedChanges,
            ]
              .filter(Boolean)
              .join(" ")
          : "",
      );
    const wpXml = generateWordPressExport(optimizedHtml, project.id, project.intake.companyName);

    return buildDownloadResponse(
      wpXml,
      "application/xml; charset=utf-8",
      "wordpress-export.xml",
    );
  } catch (error) {
    console.error("Failed to generate WordPress export:", error);
    return new Response("WordPress export failed", { status: 500 });
  }
}

async function downloadDeploymentConfigs(project: ProjectRecord): Promise<Response> {
  try {
    const config = {
      netlify:
        (await readProjectTextFile(project.id, "netlify.toml")) || generateNetlifyConfig(),
      cloudflare: generateCloudflareConfig(project.intake.companyName),
      dockerfile:
        (await readProjectTextFile(project.id, "Dockerfile")) || generateDockerfile(),
      dockerCompose: await readProjectTextFile(project.id, "docker-compose.yml"),
      env:
        (await readProjectTextFile(project.id, ".env.template")) || generateEnvTemplate(),
      vercel: await readProjectTextFile(project.id, "vercel.json"),
      githubActions: await readProjectTextFile(project.id, ".github_workflows_deploy.yml"),
    };

    return buildDownloadResponse(
      JSON.stringify(config, null, 2),
      "application/json; charset=utf-8",
      "deployment-configs.json",
    );
  } catch (error) {
    console.error("Failed to generate deployment configs:", error);
    return new Response("Config generation failed", { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    const project = await findProjectById(projectId);

    if (!project || (user.role !== "admin" && project.userId !== user.id)) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isTest = request.nextUrl.searchParams.get("test") === "true";
    const format = request.nextUrl.searchParams.get("format") || "original";

    if (project.payment.status !== "paid" && !isTest) {
      return NextResponse.json({ error: "Payment required" }, { status: 403 });
    }

    switch (format) {
      case "optimized":
        return downloadOptimizedSite(project);
      case "wordpress":
        return downloadWordPressExport(project);
      case "deployment-configs":
        return downloadDeploymentConfigs(project);
      case "original":
      default:
        return downloadOriginalSite(project.id);
    }
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
