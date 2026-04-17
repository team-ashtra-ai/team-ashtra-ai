import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

async function collectFiles(rootDir: string, currentDir = rootDir): Promise<string[]> {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const nextPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(rootDir, nextPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(nextPath);
    }
  }

  return files;
}

export async function createZipFromDirectory(sourceDir: string): Promise<Buffer> {
  const jsZip = await import("jszip").then((module) => module.default);
  const zip = new jsZip();
  const files = await collectFiles(sourceDir);

  for (const filePath of files) {
    const relativePath = path.relative(sourceDir, filePath).split(path.sep).join("/");
    const content = await readFile(filePath);
    zip.file(relativePath, content);
  }

  const buffer = await zip.generateAsync({ type: "arraybuffer" });
  return Buffer.from(buffer);
}
