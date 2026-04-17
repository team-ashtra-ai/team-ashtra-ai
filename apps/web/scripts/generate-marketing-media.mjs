import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const selectionsPath = path.join(appRoot, "src", "content", "pixabay-media-selections.json");
const outputDirectory = path.join(appRoot, "public", "media", "marketing");
const generatedModulePath = path.join(appRoot, "src", "lib", "marketing-media.generated.ts");
const publicManifestPath = path.join(outputDirectory, "manifest.json");

async function main() {
  const selections = JSON.parse(await readFile(selectionsPath, "utf8"));
  await mkdir(outputDirectory, { recursive: true });
  const apiKey = await readPixabayApiKey();

  const generatedEntries = {};

  for (const selection of selections) {
    const hit = await resolvePixabaySelection(selection, apiKey);
    const extension = getExtension(hit.sourceImageUrl, "jpg");
    const outputFilename = `${selection.filename}.${extension}`;
    const outputPath = path.join(outputDirectory, outputFilename);
    const imageBuffer = await downloadBuffer(hit.sourceImageUrl);

    await writeFile(outputPath, imageBuffer);

    generatedEntries[selection.id] = {
      id: selection.id,
      src: `/media/marketing/${outputFilename}`,
      width: hit.width,
      height: hit.height,
      alt: selection.alt,
      caption: selection.caption,
      ownerNote: selection.ownerNote,
      photographer: hit.user,
      photographerProfile: hit.photographerProfile,
      sourcePageUrl: hit.pageURL,
      pixabayId: hit.id,
      tags: hit.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      license: "Pixabay Content License",
    };
  }

  await writeFile(publicManifestPath, JSON.stringify(generatedEntries, null, 2));
  await writeFile(generatedModulePath, buildGeneratedModule(generatedEntries));

  console.log(`Generated ${Object.keys(generatedEntries).length} marketing assets.`);
}

async function readPixabayApiKey() {
  if (process.env.PIXABAY_API_KEY) {
    return process.env.PIXABAY_API_KEY;
  }

  for (const relativePath of [".env.local", ".env"]) {
    const fullPath = path.join(appRoot, relativePath);

    try {
      const contents = await readFile(fullPath, "utf8");
      const line = contents
        .split(/\r?\n/)
        .find((entry) => entry.startsWith("PIXABAY_API_KEY="));

      if (line) {
        return line.slice("PIXABAY_API_KEY=".length).trim();
      }
    } catch {
      // Ignore missing env files.
    }
  }

  return "";
}

async function resolvePixabaySelection(selection, apiKey) {
  if (selection.sourceImageUrl) {
    return {
      id: selection.pixabayId ?? selection.id,
      pageURL: selection.sourcePageUrl ?? "",
      sourceImageUrl: selection.sourceImageUrl,
      width: selection.width,
      height: selection.height,
      user: selection.photographer ?? "Pixabay contributor",
      photographerProfile: selection.photographerProfile ?? selection.sourcePageUrl ?? "",
      tags: selection.query,
    };
  }

  if (!apiKey) {
    throw new Error(
      `PIXABAY_API_KEY is required to search for "${selection.id}" because no sourceImageUrl is pinned yet.`,
    );
  }

  const hit = await fetchPixabayHit(apiKey, selection);

  return {
    id: hit.id,
    pageURL: hit.pageURL,
    sourceImageUrl: hit.largeImageURL,
    width: hit.imageWidth,
    height: hit.imageHeight,
    user: hit.user,
    photographerProfile: hit.pageURL,
    tags: hit.tags,
  };
}

async function fetchPixabayHit(apiKey, selection) {
  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", selection.query);
  url.searchParams.set("image_type", "photo");
  url.searchParams.set("orientation", "horizontal");
  url.searchParams.set("safesearch", "true");
  url.searchParams.set("editors_choice", "true");
  url.searchParams.set("per_page", "6");

  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Pixabay search failed for "${selection.id}" with status ${response.status}: ${message.slice(0, 180)}`,
    );
  }

  const payload = await response.json();
  const hits = Array.isArray(payload.hits) ? payload.hits : [];
  const hit = hits[selection.candidateIndex || 0];

  if (!hit) {
    throw new Error(`No Pixabay results found for "${selection.id}" (${selection.query}).`);
  }

  return hit;
}

async function downloadBuffer(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) {
    throw new Error(`Failed to download Pixabay asset: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function getExtension(url, fallback) {
  const pathname = new URL(url).pathname;
  const extension = path.extname(pathname).replace(".", "").toLowerCase();
  return extension || fallback;
}

function buildGeneratedModule(entries) {
  return `export const marketingMedia = ${JSON.stringify(entries, null, 2)} as const;

export type MarketingMediaId = keyof typeof marketingMedia;
`;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
