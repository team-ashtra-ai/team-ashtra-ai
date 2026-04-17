import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const targetPath = path.join(
  process.cwd(),
  "node_modules",
  "@opennextjs",
  "cloudflare",
  "dist",
  "cli",
  "build",
  "patches",
  "ast",
  "patch-vercel-og-library.js",
);

const originalSnippet = `            if (matches.length > 0) {
                const fontFileName = matches[0].getMatch("PATH").text();
                renameSync(path.join(outputDir, fontFileName), path.join(outputDir, \`\${fontFileName}.bin\`));
            }`;

const patchedSnippet = `            if (matches.length > 0) {
                const fontFileName = matches[0].getMatch("PATH").text();
                const fontPath = path.join(outputDir, fontFileName);
                if (existsSync(fontPath)) {
                    renameSync(fontPath, path.join(outputDir, \`\${fontFileName}.bin\`));
                }
            }`;

try {
  const source = await readFile(targetPath, "utf8");
  if (!source.includes(originalSnippet) || source.includes("const fontPath = path.join(outputDir, fontFileName);")) {
    process.exit(0);
  }

  await writeFile(targetPath, source.replace(originalSnippet, patchedSnippet), "utf8");
} catch {
  process.exit(0);
}
