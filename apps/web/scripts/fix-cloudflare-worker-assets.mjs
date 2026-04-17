import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const defaultFunctionRoot = path.join(
  projectRoot,
  ".open-next",
  "server-functions",
  "default",
);
const ogDir = path.join(
  defaultFunctionRoot,
  "node_modules",
  "next",
  "dist",
  "compiled",
  "@vercel",
  "og",
);
const sourceOgDir = path.join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "compiled",
  "@vercel",
  "og",
);
const handlerPath = path.join(defaultFunctionRoot, "handler.mjs");

async function exists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureCopy(sourcePath, targetPath) {
  if (!(await exists(sourcePath))) {
    return;
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
}

for (const assetName of ["Geist-Regular.ttf", "Geist-Regular.ttf.bin", "resvg.wasm", "yoga.wasm"]) {
  const targetAssetPath = path.join(ogDir, assetName);
  const sourceAssetPath =
    assetName === "Geist-Regular.ttf.bin"
      ? path.join(sourceOgDir, "Geist-Regular.ttf")
      : path.join(sourceOgDir, assetName);

  if (!(await exists(targetAssetPath)) && (await exists(sourceAssetPath))) {
    await ensureCopy(sourceAssetPath, targetAssetPath);
  }
}

if (await exists(handlerPath)) {
  const handler = await readFile(handlerPath, "utf8");
  const absoluteAssetPaths = [
    ...handler.matchAll(new RegExp(`${projectRoot.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}[^"'\\s]+`, "g")),
  ]
    .map((match) => match[0])
    .filter((value) => value.includes("/.open-next/server-functions/default/"))
    .filter((value) => !value.endsWith("/handler.mjs"));

  for (const assetPath of new Set(absoluteAssetPaths)) {
    const normalizedAssetPath = assetPath.replace(/\\.bin(?=["'])?$/, ".bin");
    const relativeAssetPath = normalizedAssetPath.startsWith("/")
      ? normalizedAssetPath.slice(1)
      : normalizedAssetPath;
    const duplicatedAssetPath = path.join(defaultFunctionRoot, relativeAssetPath);
    await ensureCopy(normalizedAssetPath, duplicatedAssetPath);
  }

  const normalizedDefaultFunctionRoot = defaultFunctionRoot.replaceAll("\\", "/");
  const normalizedProjectRoot = projectRoot.replaceAll("\\", "/");
  const patchedHandler = handler
    .replaceAll(normalizedDefaultFunctionRoot, ".")
    .replaceAll(normalizedProjectRoot, ".");

  await writeFile(handlerPath, patchedHandler, "utf8");
}
