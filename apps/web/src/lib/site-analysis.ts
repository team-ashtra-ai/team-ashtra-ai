import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { load } from "cheerio";

import { getProjectDirectory } from "@/lib/storage";
import type {
  CaptureSourceTag,
  CapturedPageRecord,
  SiteCaptureSelection,
  SiteDiscoveryPage,
  SiteSnapshot,
} from "@/lib/types";
import { normalizeSourceUrl, slugify } from "@/lib/utils";

const DEFAULT_PAGE_LIMIT = 24;
const FETCH_TIMEOUT_MS = 8000;
const DISCOVERY_TIME_BUDGET_MS = 12000;
const FETCH_HEADERS = {
  "user-agent": "ash-tra.com full-site capture assistant",
};

interface PageAnalysis {
  url: string;
  title: string;
  description: string;
  primaryHeading: string;
  headingOutline: string[];
  internalLinks: string[];
  imageCount: number;
  wordEstimate: number;
  techSignals: string[];
  html: string;
  sourceLinks: Array<{ url: string; sourceTags: CaptureSourceTag[] }>;
}

interface DiscoveryResult {
  normalizedUrl: string;
  pages: SiteDiscoveryPage[];
  pageDetails: Map<string, PageAnalysis>;
}

interface AssetContext {
  originalDir: string;
  assetMap: Map<string, string>;
}

export async function discoverSitePages(
  sourceUrl: string,
  pageLimit = DEFAULT_PAGE_LIMIT,
): Promise<SiteDiscoveryPage[]> {
  if (!sourceUrl) {
    return [];
  }

  const discovery = await discoverSiteStructure(sourceUrl, pageLimit);
  return discovery.pages;
}

export async function captureSiteSnapshot(
  sourceUrl: string,
  selection?: SiteCaptureSelection,
): Promise<SiteSnapshot> {
  const normalizedUrl = normalizeSourceUrl(sourceUrl);

  if (!normalizedUrl) {
    return buildEmptySnapshot("", "No source URL provided.");
  }

  try {
    const discovery = await discoverSiteStructure(
      normalizedUrl,
      selection?.pageLimit || DEFAULT_PAGE_LIMIT,
    );
    const selectedPageUrls = resolveSelectedPageUrls(
      discovery.pages,
      selection,
      discovery.normalizedUrl,
    );
    const selectedAnalyses = selectedPageUrls
      .map((url) => discovery.pageDetails.get(url))
      .filter((analysis): analysis is PageAnalysis => Boolean(analysis));

    const homepage =
      discovery.pageDetails.get(discovery.normalizedUrl) || selectedAnalyses[0] || null;
    const techSignals = Array.from(
      new Set(selectedAnalyses.flatMap((analysis) => analysis.techSignals)),
    );

    if (!homepage) {
      return buildEmptySnapshot(normalizedUrl, "The source site could not be analyzed.");
    }

    return {
      url: normalizedUrl,
      fetchStatus: "ok",
      title: homepage.title,
      description: homepage.description,
      primaryHeading: homepage.primaryHeading,
      headingOutline: homepage.headingOutline,
      internalLinks: homepage.internalLinks.slice(0, 10),
      imageCount: selectedAnalyses.reduce((sum, analysis) => sum + analysis.imageCount, 0),
      wordEstimate: selectedAnalyses.reduce((sum, analysis) => sum + analysis.wordEstimate, 0),
      techSignals,
      pageCount: discovery.pages.length,
      assetCount: 0,
      discoveredPages: discovery.pages,
      capturedPages: [],
      selectedPageUrls,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown fetch error";
    return buildEmptySnapshot(normalizedUrl, message);
  }
}

export async function downloadSiteAssets(
  sourceUrl: string,
  projectId: string,
  selection?: SiteCaptureSelection,
  existingSnapshot?: SiteSnapshot,
): Promise<CapturedPageRecord[]> {
  const normalizedUrl = normalizeSourceUrl(sourceUrl);
  if (!normalizedUrl) {
    return [];
  }

  const discovery = await discoverSiteStructure(
    normalizedUrl,
    selection?.pageLimit || existingSnapshot?.pageCount || DEFAULT_PAGE_LIMIT,
  );
  const selectedPageUrls =
    existingSnapshot?.selectedPageUrls?.length
      ? existingSnapshot.selectedPageUrls
      : resolveSelectedPageUrls(discovery.pages, selection, discovery.normalizedUrl);

  const projectDir = getProjectDirectory(projectId);
  const originalDir = path.join(projectDir, "original");
  await mkdir(originalDir, { recursive: true });

  const capturedPages: CapturedPageRecord[] = [];

  for (const pageUrl of selectedPageUrls) {
    const sourcePage =
      discovery.pageDetails.get(pageUrl) || (await analyzePage(pageUrl, discovery.normalizedUrl));

    if (!sourcePage) {
      capturedPages.push({
        url: pageUrl,
        path: buildPublicPagePath(pageUrl, normalizedUrl),
        title: buildPageTitleFromUrl(pageUrl),
        storedPath: buildStoredPagePath(pageUrl, normalizedUrl),
        optimizedPath: buildStoredPagePath(pageUrl, normalizedUrl),
        sourceTags: discovery.pages.find((page) => page.url === pageUrl)?.sourceTags || [
          "crawl",
        ],
        assetCount: 0,
        fetchStatus: "error",
        error: "Page could not be downloaded.",
      });
      continue;
    }

    const storedPath = buildStoredPagePath(pageUrl, normalizedUrl);
    const absoluteStoredPath = path.join(originalDir, ...storedPath.split("/"));
    await mkdir(path.dirname(absoluteStoredPath), { recursive: true });
    await writeFile(absoluteStoredPath, sourcePage.html);

    capturedPages.push({
      url: pageUrl,
      path: buildPublicPagePath(pageUrl, normalizedUrl),
      title: sourcePage.title || buildPageTitleFromUrl(pageUrl),
      storedPath,
      optimizedPath: storedPath,
      sourceTags: discovery.pages.find((page) => page.url === pageUrl)?.sourceTags || [
        "crawl",
      ],
      assetCount: 0,
      fetchStatus: "ok",
    });
  }

  return capturedPages;
}

function buildEmptySnapshot(url: string, error: string): SiteSnapshot {
  return {
    url,
    fetchStatus: "error",
    title: "",
    description: "",
    primaryHeading: "",
    headingOutline: [],
    internalLinks: [],
    imageCount: 0,
    wordEstimate: 0,
    techSignals: [],
    pageCount: 0,
    assetCount: 0,
    discoveredPages: [],
    capturedPages: [],
    selectedPageUrls: [],
    error,
  };
}

async function discoverSiteStructure(
  sourceUrl: string,
  pageLimit = DEFAULT_PAGE_LIMIT,
): Promise<DiscoveryResult> {
  const startedAt = Date.now();
  const normalizedUrl = normalizeSourceUrl(sourceUrl);
  const pending = [
    {
      url: normalizePageUrl(normalizedUrl, normalizedUrl),
      depth: 0,
      sourceTags: ["homepage"] as CaptureSourceTag[],
    },
  ];
  const seen = new Set<string>();
  const pageMap = new Map<string, SiteDiscoveryPage>();
  const pageDetails = new Map<string, PageAnalysis>();

  while (pending.length && pageMap.size < pageLimit) {
    if (Date.now() - startedAt >= DISCOVERY_TIME_BUDGET_MS) {
      break;
    }

    const current = pending.shift();
    if (!current?.url || seen.has(current.url)) {
      continue;
    }

    seen.add(current.url);
    const analysis = await analyzePage(current.url, normalizedUrl);
    if (!analysis) {
      if (current.depth === 0) {
        break;
      }
      continue;
    }

    const existing = pageMap.get(current.url);
    pageMap.set(current.url, {
      url: current.url,
      path: buildPublicPagePath(current.url, normalizedUrl),
      title: analysis.title || buildPageTitleFromUrl(current.url),
      description: analysis.description,
      sourceTags: mergeTags(existing?.sourceTags || [], current.sourceTags),
      depth: current.depth,
    });
    pageDetails.set(current.url, analysis);

    const outboundLinks =
      current.depth === 0
        ? analysis.sourceLinks
        : analysis.internalLinks.map((url) => ({
            url,
            sourceTags: ["crawl"] as CaptureSourceTag[],
          }));

    for (const link of outboundLinks) {
      if (!isLikelyHtmlUrl(link.url)) {
        continue;
      }

      const normalizedLink = normalizePageUrl(link.url, normalizedUrl);
      if (!normalizedLink) {
        continue;
      }

      const discovered = pageMap.get(normalizedLink);
      if (discovered) {
        discovered.sourceTags = mergeTags(discovered.sourceTags, link.sourceTags);
        continue;
      }

      const queued = pending.find((item) => item.url === normalizedLink);
      if (queued) {
        queued.sourceTags = mergeTags(queued.sourceTags, link.sourceTags);
        queued.depth = Math.min(queued.depth, current.depth + 1);
        continue;
      }

      if (pending.length + pageMap.size >= pageLimit * 2) {
        continue;
      }

      pending.push({
        url: normalizedLink,
        depth: current.depth + 1,
        sourceTags: link.sourceTags.length ? link.sourceTags : ["crawl"],
      });
    }
  }

  const pages = Array.from(pageMap.values()).sort((left, right) => {
    if (left.depth !== right.depth) {
      return left.depth - right.depth;
    }

    return left.path.localeCompare(right.path);
  });

  return {
    normalizedUrl: normalizePageUrl(normalizedUrl, normalizedUrl) || normalizedUrl,
    pages,
    pageDetails,
  };
}

async function analyzePage(
  pageUrl: string,
  sourceUrl: string,
): Promise<PageAnalysis | null> {
  try {
    const response = await fetch(pageUrl, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const $ = load(html);
    const origin = new URL(sourceUrl).origin;
    const title = $("title").first().text().trim();
    const description =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim() ||
      "";
    const primaryHeading = $("h1").first().text().trim();
    const headingOutline = $("h1, h2, h3")
      .slice(0, 12)
      .map((_, element) => $(element).text().trim())
      .get()
      .filter(Boolean);
    const internalLinks = collectInternalLinks($, origin);
    const taggedLinks = collectTaggedLinks($, origin);
    const lowerHtml = html.toLowerCase();
    const techSignals = [
      lowerHtml.includes("wp-content") ? "WordPress" : null,
      lowerHtml.includes("yoast") ? "Yoast SEO" : null,
      lowerHtml.includes("js.hs-scripts") || lowerHtml.includes("hubspot")
        ? "HubSpot"
        : null,
      lowerHtml.includes("googletagmanager") || lowerHtml.includes("gtag")
        ? "Google Analytics / GTM"
        : null,
      lowerHtml.includes("linkedin") ? "LinkedIn tracking" : null,
      lowerHtml.includes("viewport") || /@media\s*\(/i.test(html) ? "Responsive" : null,
    ].filter((value): value is string => Boolean(value));
    const textContent = $("body").text().replace(/\s+/g, " ").trim();

    return {
      url: pageUrl,
      title,
      description,
      primaryHeading,
      headingOutline,
      internalLinks,
      imageCount: $("img").length,
      wordEstimate: textContent ? textContent.split(" ").length : 0,
      techSignals,
      html,
      sourceLinks: taggedLinks,
    };
  } catch {
    return null;
  }
}

function collectInternalLinks($: ReturnType<typeof load>, origin: string) {
  return $("a[href]")
    .map((_, element) => normalizePageUrl($(element).attr("href")?.trim() || "", origin))
    .get()
    .filter((href): href is string => Boolean(href && href.startsWith(origin)))
    .filter((href) => isLikelyHtmlUrl(href))
    .filter((href, index, all) => all.indexOf(href) === index)
    .slice(0, 24);
}

function collectTaggedLinks($: ReturnType<typeof load>, origin: string) {
  const grouped = new Map<string, Set<CaptureSourceTag>>();
  const addLinks = (selector: string, sourceTag: CaptureSourceTag) => {
    $(selector).each((_, element) => {
      const href = normalizePageUrl($(element).attr("href")?.trim() || "", origin);
      if (!href || !isLikelyHtmlUrl(href)) {
        return;
      }

      const nextTags = grouped.get(href) || new Set<CaptureSourceTag>();
      nextTags.add(sourceTag);
      grouped.set(href, nextTags);
    });
  };

  addLinks("header a[href], nav a[href]", "header");
  addLinks("footer a[href]", "footer");
  addLinks("main a[href], body a[href]", "homepage");

  return Array.from(grouped.entries()).map(([url, sourceTags]) => ({
    url,
    sourceTags: Array.from(sourceTags),
  }));
}

function resolveSelectedPageUrls(
  pages: SiteDiscoveryPage[],
  selection: SiteCaptureSelection | undefined,
  normalizedUrl: string,
) {
  if (!pages.length) {
    return normalizedUrl ? [normalizedUrl] : [];
  }

  const primaryUrls = pages
    .filter(
      (page) =>
        page.url === normalizedUrl ||
        page.sourceTags.includes("homepage") ||
        page.sourceTags.includes("header") ||
        page.sourceTags.includes("footer"),
    )
    .map((page) => page.url);

  if (!selection) {
    return Array.from(new Set(primaryUrls.length ? primaryUrls : [normalizedUrl]));
  }

  if (selection.mode === "all") {
    return pages.map((page) => page.url);
  }

  if (selection.mode === "custom" && selection.selectedUrls.length) {
    const allowed = new Set(pages.map((page) => page.url));
    const selected = selection.selectedUrls.filter((url) => allowed.has(url));
    return Array.from(new Set(selected.length ? selected : primaryUrls));
  }

  return Array.from(new Set(primaryUrls.length ? primaryUrls : [normalizedUrl]));
}

async function localizeHtmlDocument(
  html: string,
  pageUrl: string,
  currentStoredPath: string,
  normalizedUrl: string,
  selectedPages: Map<string, string>,
  assetContext: AssetContext,
) {
  const $ = load(html);
  let assetCount = 0;

  const rewritePageLink = (value: string | undefined) => {
    if (!value) {
      return null;
    }

    const normalized = normalizePageUrl(value, pageUrl);
    if (!normalized) {
      return null;
    }

    const storedTarget = selectedPages.get(normalized);
    if (!storedTarget) {
      return normalized;
    }

    return buildRelativeBrowserPath(currentStoredPath, storedTarget);
  };

  const rewriteAssetAttribute = async (
    elementSelector: string,
    attribute: string,
    options?: { asPageLink?: boolean },
  ) => {
    const elements = $(elementSelector).toArray();
    for (const element of elements) {
      const currentValue = $(element).attr(attribute);
      if (!currentValue) {
        continue;
      }

      if (options?.asPageLink) {
        const nextValue = rewritePageLink(currentValue);
        if (nextValue) {
          $(element).attr(attribute, nextValue);
        }
        continue;
      }

      const nextValue = await rewriteAssetReference(
        currentValue,
        pageUrl,
        currentStoredPath,
        assetContext,
      );
      if (nextValue) {
        $(element).attr(attribute, nextValue);
        assetCount += 1;
      }
    }
  };

  await rewriteAssetAttribute("a[href]", "href", { asPageLink: true });
  await rewriteAssetAttribute(
    'link[href][rel="stylesheet"], link[href][rel="icon"], link[href][rel="shortcut icon"], link[href][rel="apple-touch-icon"], link[href][rel="preload"], link[href][rel="modulepreload"], link[href][rel="prefetch"]',
    "href",
  );
  await rewriteAssetAttribute("script[src]", "src");
  await rewriteAssetAttribute("img[src]", "src");
  await rewriteAssetAttribute("img[data-src]", "data-src");
  await rewriteAssetAttribute("source[src]", "src");
  await rewriteAssetAttribute("video[src]", "src");
  await rewriteAssetAttribute("audio[src]", "src");
  await rewriteAssetAttribute("iframe[src]", "src");
  await rewriteAssetAttribute("form[action]", "action", { asPageLink: true });

  const srcsetElements = $("img[srcset], source[srcset]").toArray();
  for (const element of srcsetElements) {
    const srcset = $(element).attr("srcset");
    if (!srcset) {
      continue;
    }

    const rewritten = await rewriteSrcSet(
      srcset,
      pageUrl,
      currentStoredPath,
      assetContext,
    );
    if (rewritten !== srcset) {
      $(element).attr("srcset", rewritten);
      assetCount += 1;
    }
  }

  const inlineStyles = $("style").toArray();
  for (const element of inlineStyles) {
    const css = $(element).html();
    if (!css) {
      continue;
    }

    const localizedCss = await localizeCssReferences(
      css,
      pageUrl,
      currentStoredPath,
      assetContext,
    );
    $(element).html(localizedCss);
  }

  const styledElements = $("[style]").toArray();
  for (const element of styledElements) {
    const inlineStyle = $(element).attr("style");
    if (!inlineStyle) {
      continue;
    }

    const localizedStyle = await localizeCssReferences(
      inlineStyle,
      pageUrl,
      currentStoredPath,
      assetContext,
    );
    $(element).attr("style", localizedStyle);
  }

  const canonical = $('link[rel="canonical"]');
  if (canonical.length) {
    canonical.attr("href", "./");
  }

  $('meta[property="og:url"]').attr("content", pageUrl === normalizedUrl ? "./" : "./");

  return {
    html: $.html(),
    assetCount,
  };
}

async function rewriteAssetReference(
  rawValue: string,
  baseUrl: string,
  currentStoredPath: string,
  assetContext: AssetContext,
) {
  const normalizedAssetUrl = normalizeAssetUrl(rawValue, baseUrl);
  if (!normalizedAssetUrl) {
    return null;
  }

  try {
    const storedAssetPath = await downloadAsset(
      normalizedAssetUrl,
      assetContext,
      currentStoredPath,
    );
    return buildRelativeBrowserPath(currentStoredPath, storedAssetPath);
  } catch {
    return rawValue;
  }
}

async function rewriteSrcSet(
  rawSrcSet: string,
  baseUrl: string,
  currentStoredPath: string,
  assetContext: AssetContext,
) {
  const parts = rawSrcSet
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const rewrittenParts = [];
  for (const part of parts) {
    const [candidateUrl, descriptor] = part.split(/\s+/, 2);
    if (!candidateUrl) {
      continue;
    }

    const rewritten = await rewriteAssetReference(
      candidateUrl,
      baseUrl,
      currentStoredPath,
      assetContext,
    );
    rewrittenParts.push(descriptor ? `${rewritten} ${descriptor}` : rewritten);
  }

  return rewrittenParts.join(", ");
}

async function localizeCssReferences(
  css: string,
  cssUrl: string,
  currentStoredPath: string,
  assetContext: AssetContext,
) {
  const matches = Array.from(css.matchAll(/url\(([^)]+)\)/gi));
  let localizedCss = css;

  for (const match of matches) {
    const original = match[0];
    const candidate = match[1]?.trim().replace(/^['"]|['"]$/g, "");
    if (!candidate || candidate.startsWith("data:") || candidate.startsWith("#")) {
      continue;
    }

    const rewritten = await rewriteAssetReference(
      candidate,
      cssUrl,
      currentStoredPath,
      assetContext,
    );
    if (!rewritten) {
      continue;
    }

    localizedCss = localizedCss.replace(original, `url("${rewritten}")`);
  }

  return localizedCss;
}

async function downloadAsset(
  assetUrl: string,
  assetContext: AssetContext,
  currentStoredPath: string,
) {
  const assetKey = `${currentStoredPath}::${assetUrl}`;
  const existing = assetContext.assetMap.get(assetKey);
  if (existing) {
    return existing;
  }

  const response = await fetch(assetUrl, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch asset: ${assetUrl}`);
  }

  const storedAssetPath = buildAssetStoragePath(assetUrl, currentStoredPath);
  const absolutePath = path.join(assetContext.originalDir, ...storedAssetPath.split("/"));
  await mkdir(path.dirname(absolutePath), { recursive: true });

  if (isCssAsset(assetUrl, response.headers.get("content-type") || "")) {
    const css = await response.text();
    const localizedCss = await localizeCssReferences(
      css,
      assetUrl,
      storedAssetPath,
      assetContext,
    );
    await writeFile(absolutePath, localizedCss);
  } else {
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(absolutePath, buffer);
  }

  assetContext.assetMap.set(assetKey, storedAssetPath);
  return storedAssetPath;
}

function normalizePageUrl(value: string, baseUrl: string) {
  if (!value || value.startsWith("#")) {
    return null;
  }

  try {
    const url = new URL(value, baseUrl);
    if (!/^https?:$/i.test(url.protocol)) {
      return null;
    }

    url.hash = "";
    url.search = "";
    url.pathname = normalizePathname(url.pathname);
    return url.toString();
  } catch {
    return null;
  }
}

function normalizeAssetUrl(value: string, baseUrl: string) {
  if (
    !value ||
    value.startsWith("#") ||
    value.startsWith("data:") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("javascript:")
  ) {
    return null;
  }

  try {
    const url = new URL(value, baseUrl);
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  const trimmed = pathname.replace(/\/+/g, "/").replace(/\/$/, "");
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function isLikelyHtmlUrl(candidateUrl: string) {
  try {
    const url = new URL(candidateUrl);
    const extension = path.extname(url.pathname).toLowerCase();
    const disallowedExtensions = new Set([
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".svg",
      ".webp",
      ".css",
      ".js",
      ".json",
      ".xml",
      ".pdf",
      ".zip",
      ".mp4",
      ".mp3",
      ".woff",
      ".woff2",
      ".ttf",
      ".eot",
      ".ico",
    ]);

    return !disallowedExtensions.has(extension);
  } catch {
    return false;
  }
}

function isCssAsset(assetUrl: string, contentType: string) {
  return contentType.includes("text/css") || new URL(assetUrl).pathname.endsWith(".css");
}

function buildStoredPagePath(pageUrl: string, sourceUrl: string) {
  const url = new URL(pageUrl);
  const source = new URL(sourceUrl);
  const relativePath = url.pathname === source.pathname ? "/" : url.pathname;
  const trimmed = relativePath.replace(/^\/+|\/+$/g, "");

  if (!trimmed) {
    return "index.html";
  }

  if (path.posix.extname(trimmed)) {
    return trimmed;
  }

  return `${trimmed}/index.html`;
}

function buildPublicPagePath(pageUrl: string, sourceUrl: string) {
  const storedPath = buildStoredPagePath(pageUrl, sourceUrl);
  if (storedPath === "index.html") {
    return "/";
  }

  if (storedPath.endsWith("/index.html")) {
    return `/${storedPath.slice(0, -"/index.html".length)}/`;
  }

  return `/${storedPath}`;
}

function buildAssetStoragePath(assetUrl: string, currentStoredPath: string) {
  const url = new URL(assetUrl);
  const hostname = slugify(url.hostname) || url.hostname.replace(/\./g, "-");
  const parsed = path.posix.parse(url.pathname);
  const directory = parsed.dir.replace(/^\/+/, "");
  const filenameBase = slugify(parsed.name) || "asset";
  const pageScope = buildPageAssetScope(currentStoredPath);
  const searchSuffix = url.search
    ? `-${slugify(url.search.slice(1)) || Buffer.from(url.search).toString("hex").slice(0, 8)}`
    : "";
  const extension = parsed.ext || ".bin";

  return path.posix.join(
    "_assets",
    "pages",
    pageScope,
    hostname,
    directory,
    `${pageScope}-${filenameBase}${searchSuffix}${extension}`,
  );
}

function buildPageAssetScope(currentStoredPath: string) {
  const trimmed = currentStoredPath
    .replace(/^_assets\//, "")
    .replace(/\/index\.html$/i, "")
    .replace(/\.html$/i, "")
    .replace(/\/+$/g, "");

  if (!trimmed || trimmed === "index") {
    return "home";
  }

  return slugify(trimmed.replace(/\//g, " ")) || "page";
}

function buildRelativeBrowserPath(fromPath: string, toPath: string) {
  const relative = path.posix.relative(path.posix.dirname(fromPath), toPath) || toPath;
  if (relative.startsWith(".")) {
    return relative;
  }

  return `./${relative}`;
}

function mergeTags(
  current: CaptureSourceTag[],
  next: CaptureSourceTag[],
): CaptureSourceTag[] {
  return Array.from(new Set([...current, ...next]));
}

function buildPageTitleFromUrl(pageUrl: string) {
  try {
    const url = new URL(pageUrl);
    const lastSegment =
      url.pathname
        .split("/")
        .filter(Boolean)
        .pop() || "Home";
    return lastSegment
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  } catch {
    return "Captured page";
  }
}
