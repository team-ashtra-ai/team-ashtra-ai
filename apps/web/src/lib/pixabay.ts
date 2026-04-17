import "server-only";

import type { IntakeSelections, ProjectMediaSuggestion } from "@/lib/types";

export interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export async function searchPixabayImages(
  query: string,
  limit: number = 5
): Promise<PixabayImage[]> {
  const apiKey = process.env.PIXABAY_API_KEY?.trim();
  if (!apiKey) {
    return [];
  }

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${limit}&safesearch=true`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (!response.ok) {
      console.error("Pixabay API error:", response.status);
      return [];
    }

    const data = (await response.json()) as { hits: PixabayImage[] };
    return data.hits || [];
  } catch (error) {
    console.error("Failed to search Pixabay:", error);
    return [];
  }
}

export async function downloadPixabayImage(
  imageUrl: string,
  filename: string
): Promise<Buffer | null> {
  try {
    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) return null;

    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error(`Failed to download image ${filename}:`, error);
    return null;
  }
}

export function generateSeoImageName(query: string, index: number): string {
  const sanitized = query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${sanitized}-image-${index + 1}`;
}

export async function buildProjectMediaSuggestions(
  intake: IntakeSelections,
  limit: number = 3,
): Promise<ProjectMediaSuggestion[]> {
  const queries = buildProjectImageQueries(intake).slice(0, limit);
  if (!queries.length) {
    return [];
  }

  const results = await Promise.all(
    queries.map(async (query, index) => {
      const [image] = await searchPixabayImages(query, 1);
      if (!image) {
        return null;
      }

      return {
        id: `pixabay-${image.id}`,
        alt: `${intake.companyName} inspiration image for ${query}`,
        photographer: image.user,
        photographerProfile: image.userImageURL || image.pageURL,
        query,
        seoFilename: `${generateSeoImageName(`${intake.companyName} ${query}`, index)}.jpg`,
        sourcePageUrl: image.pageURL,
        src: image.largeImageURL || image.webformatURL,
      } satisfies ProjectMediaSuggestion;
    }),
  );

  return results.filter((item): item is ProjectMediaSuggestion => Boolean(item));
}

function buildProjectImageQueries(intake: IntakeSelections) {
  const answerMap = new Map(
    intake.discoveryAnswers.map((answer) => [answer.id, answer.answer.toLowerCase()]),
  );
  const industry = intake.industry.trim();
  const brandFeel = answerMap.get("brand_feel") || intake.tone.toLowerCase();
  const visualStyle = answerMap.get("visual_style") || "premium website";
  const audience = answerMap.get("ideal_client") || "service business";
  const inspiration = intake.aiInspiration.trim();

  return [
    [industry, brandFeel, "workspace"].filter(Boolean).join(" "),
    [industry, visualStyle, "website"].filter(Boolean).join(" "),
    [audience, inspiration || "professional team", "office"].filter(Boolean).join(" "),
  ]
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, all) => all.indexOf(item) === index);
}
