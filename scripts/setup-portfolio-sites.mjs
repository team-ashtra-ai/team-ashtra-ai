import { cp, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const portfolioRoot = path.join(repoRoot, "portfolio-sites");
const projectsRoot = path.join(repoRoot, "storage", "optimise-ai", "projects");

const portfolioProjects = [
  {
    id: "federico-righi-atelier-8c189a9b",
    originalTarget: "federico-righi-original-static",
    optimizedTarget: "federico-righi-optimized-static",
  },
  {
    id: "rotata-consulting-preview-6935113a",
    originalTarget: "rotata-original-static",
    optimizedTarget: "rotata-optimized-static",
  },
];

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDirectory(targetPath) {
  await mkdir(targetPath, { recursive: true });
}

async function copyOriginalSite(sourceId, targetName) {
  const sourcePath = path.join(projectsRoot, sourceId, "original");
  const targetPath = path.join(portfolioRoot, targetName);

  if (!(await pathExists(sourcePath))) {
    console.warn(`Skipping ${targetName}: source project "${sourceId}" was not found.`);
    return;
  }

  if (await pathExists(targetPath)) {
    console.log(`Keeping existing original copy: ${targetName}`);
    return;
  }

  await cp(sourcePath, targetPath, { recursive: true });
  console.log(`Copied original project into ${targetName}`);
}

async function scaffoldOptimizedSite(targetName) {
  const targetPath = path.join(portfolioRoot, targetName);

  await ensureDirectory(targetPath);
  await ensureDirectory(path.join(targetPath, "assets"));
  await ensureDirectory(path.join(targetPath, "assets", "images"));
  console.log(`Ensured optimized workspace exists: ${targetName}`);
}

async function main() {
  await ensureDirectory(portfolioRoot);

  for (const project of portfolioProjects) {
    await copyOriginalSite(project.id, project.originalTarget);
    await scaffoldOptimizedSite(project.optimizedTarget);
  }

  console.log("");
  console.log("Local portfolio folders are ready.");
  console.log(`They live in ${portfolioRoot} and stay out of Git by default.`);
}

await main();
