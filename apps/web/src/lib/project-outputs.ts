import "server-only";

import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { optimizeHtmlWithBlueprint } from "@/lib/html-optimizer";
import { generateDeploymentConfigs } from "@/lib/deployment-config";
import { generateWordPressExport } from "@/lib/wordpress-exporter";
import { getProjectDirectory } from "@/lib/storage";
import type { ProjectRecord } from "@/lib/types";

export async function regenerateProjectOutputs(project: ProjectRecord) {
  const projectDir = getProjectDirectory(project.id);
  const originalDir = path.join(projectDir, "original");
  const optimizedDir = path.join(projectDir, "optimized");

  await mkdir(projectDir, { recursive: true });
  await rm(optimizedDir, { recursive: true, force: true });
  await cp(originalDir, optimizedDir, { recursive: true });

  const htmlFiles = await collectHtmlFiles(optimizedDir);
  const latestFeedback = project.preview?.feedbackEntries?.[0];
  const previewNotes = latestFeedback
    ? [latestFeedback.summary, latestFeedback.requestedChanges].filter(Boolean).join(" ")
    : "";
  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, "utf-8");
    const optimizedHtml = optimizeHtmlWithBlueprint(
      html,
      project.blueprint,
      project.intake,
      previewNotes,
    );
    await writeFile(htmlFile, optimizedHtml);
  }

  const homepagePath = path.join(optimizedDir, "index.html");
  try {
    const homepageHtml = await readFile(homepagePath, "utf-8");
    await generateWordPressExport(homepageHtml, projectDir, project.intake);
  } catch {
    // If the homepage is not available yet, the site package can still continue.
  }

  await generateDeploymentConfigs(projectDir, project.intake);
}

async function collectHtmlFiles(rootDir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    const nextPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(nextPath)));
      continue;
    }

    if (entry.isFile() && nextPath.endsWith(".html")) {
      files.push(nextPath);
    }
  }

  return files;
}
