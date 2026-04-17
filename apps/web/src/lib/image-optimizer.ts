import "server-only";

import { writeFile } from "fs/promises";
import { join } from "path";
import { load } from "cheerio";

export interface OptimizedImage {
  url: string;
  filename: string;
  alt: string;
  size?: number;
}

/**
 * Download images from HTML and replace with optimized versions
 */
export async function downloadAndOptimizeImages(
  html: string,
  projectDir: string,
  maxImages: number = 20
): Promise<{ html: string; images: OptimizedImage[] }> {
  const $ = load(html);
  const images: OptimizedImage[] = [];
  const imageMap = new Map<string, string>();

  // Find all images
  const imgElements = $("img").slice(0, maxImages);

  for (let i = 0; i < imgElements.length; i++) {
    const $img = $(imgElements[i]);
    const src = $img.attr("src");
    const alt = $img.attr("alt")?.trim() || buildDescriptiveAlt($img.attr("src"), i + 1);

    if (!src) continue;

    try {
      // Skip data URIs
      if (src.startsWith("data:")) continue;

      // Fetch the image
      const url = new URL(src, "https://example.com").toString();
      const response = await fetch(url, {
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) continue;

      const buffer = await response.arrayBuffer();
      const ext = getImageExtension(response.headers.get("content-type") || "image/jpeg");
      const filename = `image-${i + 1}-${sanitizeFilename(alt)}.${ext}`;
      const filepath = join(projectDir, filename);

      await writeFile(filepath, Buffer.from(buffer));

      imageMap.set(src, filename);
      images.push({
        url: src,
        filename,
        alt,
        size: buffer.byteLength,
      });
    } catch (error) {
      console.log(`Failed to download image ${src}:`, error);
    }
  }

  // Replace image sources in HTML
  let optimizedHtml = html;
  imageMap.forEach((filename, originalSrc) => {
    optimizedHtml = optimizedHtml.replace(new RegExp(originalSrc, "g"), `./${filename}`);
  });

  return { html: optimizedHtml, images };
}

function getImageExtension(contentType: string): string {
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  return "jpg";
}

function sanitizeFilename(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 30);
}

function buildDescriptiveAlt(src: string | undefined, index: number) {
  const filename = src?.split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") || `image ${index}`;
  return humanizeKeyword(filename);
}

function humanizeKeyword(keyword: string) {
  return keyword
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
