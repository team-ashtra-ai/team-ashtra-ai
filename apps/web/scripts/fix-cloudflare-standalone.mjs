import { cp, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const standaloneRoot = path.join(projectRoot, ".next", "standalone");
const nestedNextRoot = path.join(standaloneRoot, "apps", "web", ".next");
const expectedNextRoot = path.join(standaloneRoot, ".next");

async function exists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

if (await exists(nestedNextRoot)) {
  await mkdir(expectedNextRoot, { recursive: true });
  await cp(nestedNextRoot, expectedNextRoot, {
    recursive: true,
    force: true,
  });
}
