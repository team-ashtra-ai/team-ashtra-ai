import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { findProjectById, getLegacyProjectDirectory, getProjectDirectory } from "@/lib/storage";

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getProjectBaseDirectories(projectId: string) {
  return [getProjectDirectory(projectId), getLegacyProjectDirectory(projectId)];
}

async function resolvePreviewPath(
  projectId: string,
  variant: string,
  slug: string[],
): Promise<string | null> {
  const relativePath =
    !slug.length || !path.extname(slug[slug.length - 1])
      ? path.join(...slug, "index.html")
      : path.join(...slug);

  for (const baseDirectory of getProjectBaseDirectories(projectId)) {
    const variantDirectory = path.resolve(baseDirectory, variant);
    const absoluteCandidate = path.resolve(variantDirectory, relativePath || "index.html");

    if (!absoluteCandidate.startsWith(variantDirectory)) {
      continue;
    }

    try {
      await access(absoluteCandidate);
      return absoluteCandidate;
    } catch {
      continue;
    }
  }

  return null;
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string; variant: string; slug?: string[] }>;
  },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { projectId, variant, slug = [] } = await params;
  const project = await findProjectById(projectId);

  if (!project || (user.role !== "admin" && project.userId !== user.id)) {
    return new Response("Project not found", { status: 404 });
  }

  if (variant !== "original" && variant !== "optimized") {
    return new Response("Unknown preview variant", { status: 404 });
  }

  const filePath = await resolvePreviewPath(projectId, variant, slug);
  if (!filePath) {
    return new Response("Preview file not found", { status: 404 });
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] || "application/octet-stream";
  const file = await readFile(filePath);

  return new Response(file, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
