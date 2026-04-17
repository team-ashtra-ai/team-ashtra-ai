import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "apps", "pages-site");
const publicDir = path.join(root, "apps", "web", "public");
const outputDir = path.join(root, ".pages-dist");

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

await cp(sourceDir, outputDir, { recursive: true });
await cp(path.join(publicDir, "brand"), path.join(outputDir, "brand"), { recursive: true });
await cp(path.join(publicDir, "media"), path.join(outputDir, "media"), { recursive: true });
