#!/usr/bin/env python3
"""Interactively capture website pages, viewports, and page elements with Playwright.

Run from the repository root:
    python3 scripts/screenshot_manager.py
"""

from __future__ import annotations

import json
import os
import re
import socket
import subprocess
import sys
import tempfile
import zipfile
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_ROOT = ROOT / "screenshots" / "interactive"
STANDARD_VIEWPORTS = {
    "mobile-320": {"width": 320, "height": 740, "isMobile": True},
    "mobile-390": {"width": 390, "height": 844, "isMobile": True},
    "mobile-430": {"width": 430, "height": 900, "isMobile": True},
    "tablet-768": {"width": 768, "height": 1024, "isMobile": False},
    "desktop-1024": {"width": 1024, "height": 900, "isMobile": False},
    "desktop-1280": {"width": 1280, "height": 960, "isMobile": False},
    "desktop-1440": {"width": 1440, "height": 1200, "isMobile": False},
    "desktop-1600": {"width": 1600, "height": 1000, "isMobile": False},
    "desktop-1920": {"width": 1920, "height": 1080, "isMobile": False},
    "ultrawide-3440": {"width": 3440, "height": 1440, "isMobile": False},
}


def prompt_choice(title: str, choices: list[str]) -> int:
    print(f"\n{title}")
    for index, choice in enumerate(choices, 1):
        print(f"  {index}. {choice}")
    while True:
        value = input("Choose a number: ").strip()
        if value.isdigit() and 1 <= int(value) <= len(choices):
            return int(value) - 1
        print(f"Please enter a number from 1 to {len(choices)}.")


def prompt_indices(items: list[str], label: str, multiple: bool) -> list[str]:
    print()
    for index, item in enumerate(items, 1):
        print(f"  {index:>2}. {item}")
    instruction = "number" if not multiple else "comma-separated numbers (for example 1,3-5)"
    while True:
        raw = input(f"Choose {label} ({instruction}): ").strip()
        try:
            chosen: list[int] = []
            for part in raw.split(","):
                start, *end = part.strip().split("-", 1)
                if not start.isdigit():
                    raise ValueError
                values = range(int(start), int(end[0]) + 1) if end and end[0].isdigit() else [int(start)]
                chosen.extend(values)
            if not chosen or any(value < 1 or value > len(items) for value in chosen):
                raise ValueError
            if not multiple and len(chosen) != 1:
                raise ValueError
            return [items[value - 1] for value in dict.fromkeys(chosen)]
        except ValueError:
            print("Use valid listed numbers, optionally with ranges such as 2-4.")


EXCLUDED_PAGE_DIRECTORIES = {".git", "docs", "node_modules", "partials", "screenshots", "scripts"}


def public_pages() -> list[str]:
    """Return every published route in the current educational-site layout."""
    pages = []
    for path in ROOT.rglob("*.html"):
        relative = path.relative_to(ROOT)
        if EXCLUDED_PAGE_DIRECTORIES.intersection(relative.parts):
            continue
        if path.name == "index.html":
            route = "/" if relative.parent == Path(".") else f"/{relative.parent.as_posix()}/"
        else:
            route = f"/{relative.as_posix()}"
        pages.append(route)
    return sorted(pages)


def page_groups(pages: list[str]) -> dict[str, list[str]]:
    """Offer useful groups for programme pages and the editorial library."""
    blog_articles = [page for page in pages if page.startswith("/blog/") and "/category/" not in page and page != "/blog/"]
    return {
        "Core programme pages": [page for page in pages if not page.startswith("/blog/")],
        "Blog hub and categories": [page for page in pages if page == "/blog/" or page.startswith("/blog/category/")],
        "Blog articles": blog_articles,
        "All public pages": pages,
    }


def local_path_for_route(route: str) -> Path:
    """Map a local URL route to its corresponding source HTML file."""
    clean_route = route.strip("/")
    if not clean_route:
        return ROOT / "index.html"
    if clean_route.endswith(".html"):
        return ROOT / clean_route
    return ROOT / clean_route / "index.html"


def choose_pages() -> list[str]:
    pages = public_pages()
    groups = page_groups(pages)
    labels = list(groups)
    mode = prompt_choice("Pages to capture", [
        *[f"{label} ({len(group_pages)} pages)" for label, group_pages in groups.items()],
        "One specific page", "Several selected pages", "A custom URL or local route",
    ])
    if mode < len(labels):
        return groups[labels[mode]]
    if mode == len(labels):
        return prompt_indices(pages, "a page", False)
    if mode == len(labels) + 1:
        return prompt_indices(pages, "pages", True)
    while True:
        route = input("Enter a full URL or a local route (for example /about.html): ").strip()
        if route:
            return [route]
        print("A URL or route is required.")


def choose_viewports() -> dict[str, dict[str, Any]]:
    names = list(STANDARD_VIEWPORTS)
    mode = prompt_choice("Viewport sizes", [
        "All standard viewport sizes", "One viewport size", "Several selected viewport sizes", "A custom viewport size",
    ])
    if mode == 0:
        return STANDARD_VIEWPORTS
    if mode == 1:
        selected = prompt_indices(names, "a viewport", False)
        return {selected[0]: STANDARD_VIEWPORTS[selected[0]]}
    if mode == 2:
        selected = prompt_indices(names, "viewports", True)
        return {name: STANDARD_VIEWPORTS[name] for name in selected}
    while True:
        raw = input("Enter width x height (for example 1536x960): ").strip().lower().replace(" ", "")
        match = re.fullmatch(r"(\d{2,5})x(\d{2,5})", raw)
        if match:
            width, height = map(int, match.groups())
            return {f"custom-{width}x{height}": {"width": width, "height": height, "isMobile": width < 600}}
        print("Use WIDTHxHEIGHT, for example 390x844.")


def print_sections(pages: list[str]) -> None:
    local = next((local_path_for_route(page) for page in pages if not page.startswith(("http://", "https://"))), None)
    if not local or not local.is_file():
        return
    html = local.read_text(encoding="utf-8", errors="ignore")
    found = re.findall(r'<section\b([^>]*)>', html, re.I)
    if found:
        descriptions = []
        for number, attributes in enumerate(found, 1):
            identifier = re.search(r'\bid=["\']([^"\']+)', attributes)
            class_name = re.search(r'\bclass=["\']([^"\']+)', attributes)
            label = identifier.group(1) if identifier else class_name.group(1).split()[0] if class_name else "section"
            descriptions.append(f"{number} ({label})")
        print("\nSections found on " + local.relative_to(ROOT).as_posix() + ": " + ", ".join(descriptions))


def choose_target(pages: list[str]) -> dict[str, Any]:
    mode = prompt_choice("What should each screenshot contain?", [
        "Complete full-page screenshot", "Only the visible viewport", "One specific numbered section",
        "Several selected numbered sections", "Every numbered section on a page", "A custom CSS selector",
        "A particular element by ID", "Hero only", "Main content only", "Final CTA only", "Footer only",
        "Every scroll position (overlapping viewport screenshots)",
    ])
    if mode in (2, 3):
        print_sections(pages)
        while True:
            raw = input("Enter section number(s), for example 1 or 2,4-6: ").strip()
            if re.fullmatch(r"\d+(?:\s*,\s*\d+(?:\s*-\s*\d+)?)*", raw):
                numbers: list[int] = []
                for part in raw.split(","):
                    values = [int(value.strip()) for value in part.split("-")]
                    numbers.extend(range(values[0], values[-1] + 1))
                return {"kind": "selectors", "selectors": [{"name": f"section-{number}", "selector": f"main > section:nth-of-type({number})"} for number in dict.fromkeys(numbers)]}
            print("Use section numbers, such as 1 or 1,3-5.")
    if mode == 4:
        return {"kind": "numbered_sections"}
    if mode == 5:
        selector = input("Enter CSS selector: ").strip()
        return {"kind": "selectors", "selectors": [{"name": "custom-selector", "selector": selector}]}
    if mode == 6:
        element_id = input("Enter the element ID (without #): ").strip().lstrip("#")
        return {"kind": "selectors", "selectors": [{"name": element_id or "element", "selector": f"#{element_id}"}]}
    if mode == 11:
        return {"kind": "scroll_slices", "overlap": 160}
    simple = {
        0: {"kind": "page", "fullPage": True}, 1: {"kind": "page", "fullPage": False},
        7: {"kind": "selectors", "selectors": [{"name": "hero", "selector": ".hero, main > section:first-of-type"}]},
        8: {"kind": "selectors", "selectors": [{"name": "main", "selector": "main"}]},
        9: {"kind": "selectors", "selectors": [{"name": "final-cta", "selector": ".final-cta, main > section:last-of-type"}]},
        10: {"kind": "selectors", "selectors": [{"name": "footer", "selector": "footer"}]},
    }
    return simple[mode]


def find_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def start_server(port: int) -> ThreadingHTTPServer:
    class QuietHandler(SimpleHTTPRequestHandler):
        def log_message(self, format: str, *args: object) -> None:  # noqa: A002
            return
    server = ThreadingHTTPServer(("127.0.0.1", port), QuietHandler)
    Thread(target=server.serve_forever, daemon=True).start()
    return server


def create_archive(output_dir: Path) -> Path:
    """Create or refresh the ZIP beside the flat image files."""
    archive = output_dir / "screenshots.zip"
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as bundle:
        for file in sorted(output_dir.iterdir()):
            if file.is_file() and file != archive:
                bundle.write(file, arcname=file.name)
    return archive


RUNNER = r'''
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const [baseUrl, outputDir, pagesJson, viewportsJson, targetJson] = process.argv.slice(2);
const pages = JSON.parse(pagesJson), viewports = JSON.parse(viewportsJson), target = JSON.parse(targetJson);
const safe = value => String(value).replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "") || "capture";
const pageName = value => safe(value.replace(/^https?:\/\//, "").replace(/\.html([?#].*)?$/, "").replace(/[/?#]/g, "-"));
const urlFor = value => /^https?:\/\//i.test(value) ? value : `${baseUrl}/${value.replace(/^\//, "")}`;
const viewportLabel = viewport => `${viewport.isMobile ? "mobile" : "desktop"}-${String(viewport.height).padStart(5, "0")}h-${String(viewport.width).padStart(5, "0")}w`;
async function captureFullPageWithFixedBackground(page, file) {
  // A full-page browser capture expands the viewport, which is not how a
  // visitor sees fixed artwork and tools. Capture every real viewport instead
  // and join the frames into a scroll-strip: repeated fixed UI is intentional
  // because it represents the page at each actual scroll position.
  const sharp = require("sharp");
  const { width, height } = page.viewportSize();
  const fullHeight = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  const frames = [];
  try {
    for (let top = 0; top < fullHeight; top += height) {
      const visibleHeight = Math.min(height, fullHeight - top);
      const scrollTop = Math.min(top, Math.max(0, fullHeight - height));
      await page.evaluate(y => scrollTo(0, y), scrollTop);
      await page.waitForTimeout(100);
      const image = await page.screenshot();
      frames.push({ image, top, visibleHeight, cropTop: top === scrollTop ? 0 : height - visibleHeight });
    }
    const composites = await Promise.all(frames.map(async frame => ({
      input: await sharp(frame.image)
        .extract({ left: 0, top: frame.cropTop, width, height: frame.visibleHeight })
        .png()
        .toBuffer(),
      top: frame.top,
      left: 0,
    })));
    await sharp({ create: { width, height: fullHeight, channels: 4, background: "#fffdf9" } })
      .composite(composites)
      .png()
      .toFile(file);
  } finally {
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(80);
  }
}
async function settle(page) {
  await page.waitForTimeout(250);
  await page.evaluate(async () => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    // A full-page screenshot does not reliably trigger native lazy loading for
    // off-screen images. Promote and re-request those assets before capture so
    // the review image reflects the real page rather than empty placeholders.
    document.querySelectorAll('img[loading="lazy"]').forEach(image => {
      image.loading = 'eager';
      if (!image.complete) image.src = image.currentSrc || image.src;
    });
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(180, Math.floor(innerHeight * .4))) { scrollTo(0, y); await delay(25); }
    await Promise.race([
      Promise.all([...document.images].map(async image => {
        if (!image.complete) await new Promise(resolve => image.addEventListener('load', resolve, {once:true}));
        if (image.complete && image.naturalWidth) await image.decode().catch(() => {});
      })),
      delay(15000),
    ]);
    // The accessibility skip link is intentionally visible only while it has
    // keyboard focus. Clear incidental browser focus before the visual capture.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    scrollTo(0, 0); await delay(80);
  });
}
(async () => {
  fs.mkdirSync(outputDir, {recursive:true});
  // Prefer an explicitly configured browser, then common system locations, and
  // finally the Chromium bundled with Playwright. This keeps the manager
  // working after a system Chrome update changes its launcher path.
  const configuredBrowser = process.env.SCREENSHOT_BROWSER;
  const candidates = configuredBrowser
    ? [configuredBrowser]
    : [
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        chromium.executablePath(),
      ];
  const executablePath = candidates.find(candidate => candidate && fs.existsSync(candidate));
  if (!executablePath) {
    throw new Error(
      configuredBrowser
        ? `SCREENSHOT_BROWSER does not exist: ${configuredBrowser}`
        : "No Chromium browser was found. Install Chrome/Chromium, run `npx playwright install chromium`, or set SCREENSHOT_BROWSER to its executable path.",
    );
  }
  const browser = await chromium.launch({headless:true, executablePath, args:["--disable-dev-shm-usage", "--no-sandbox"]}); const captures=[];
  const orderedViewports = Object.entries(viewports).sort(([, a], [, b]) =>
    Number(a.isMobile) - Number(b.isMobile) || a.height - b.height || a.width - b.width
  );
  for (const [viewportName, viewport] of orderedViewports) {
    const context = await browser.newContext({viewport:{width:viewport.width,height:viewport.height}, isMobile:viewport.isMobile, deviceScaleFactor:1});
    await context.addInitScript(() => localStorage.setItem("sofiati_cookie_preferences_v3", JSON.stringify({essential:true,preferences:false,analytics:false,externalMedia:false})));
    for (const pagePath of pages) {
      const page = await context.newPage(); const url = urlFor(pagePath); const filePrefix = `${pageName(pagePath)}--${viewportLabel(viewport)}`;
      try {
        await page.goto(url, {waitUntil:"load", timeout:45000}); await settle(page);
        if (target.kind === "scroll_slices") {
          const { height } = page.viewportSize();
          const fullHeight = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
          const overlap = Math.min(Math.max(Number(target.overlap) || 0, 0), height - 1);
          const step = height - overlap;
          const positions = [];
          for (let top = 0; top < fullHeight; top += step) positions.push(Math.min(top, Math.max(0, fullHeight - height)));
          for (const [index, top] of [...new Set(positions)].entries()) {
            await page.evaluate(y => scrollTo(0, y), top); await page.waitForTimeout(100);
            const file = path.join(outputDir, `${filePrefix}--scroll-${String(index + 1).padStart(2, "0")}.png`);
            await page.screenshot({path:file});
            captures.push({page:pagePath,viewport:viewportName,target:`scroll-${index + 1}`,status:"captured",file:path.relative(outputDir,file)});
          }
          await page.evaluate(() => scrollTo(0, 0));
          continue;
        }
        let jobs = target.kind === "page" ? [{name: target.fullPage ? "full-page" : "viewport", page: true}] : target.kind === "numbered_sections" ? await page.locator("main > section").evaluateAll(nodes => nodes.map((node, i) => ({name:`section-${i + 1}-${node.id || (node.className || "section").toString().split(/\\s+/)[0]}`, selector: `main > section:nth-of-type(${i + 1})`}))) : target.selectors;
        for (const job of jobs) {
          const file = path.join(outputDir, `${filePrefix}--${safe(job.name)}.png`);
          if (job.page) {
            if (target.fullPage) await captureFullPageWithFixedBackground(page, file);
            else await page.screenshot({path:file});
          }
          else { const locator = page.locator(job.selector).first(); if (await locator.count() === 0) { captures.push({page:pagePath,viewport:viewportName,target:job.name,status:"skipped",reason:`No match for ${job.selector}`}); continue; } await locator.scrollIntoViewIfNeeded(); await locator.screenshot({path:file}); }
          captures.push({page:pagePath,viewport:viewportName,target:job.name,status:"captured",file:path.relative(outputDir,file)});
        }
      } catch (error) { captures.push({page:pagePath,viewport:viewportName,status:"failed",reason:error.message}); }
      await page.close();
    } await context.close();
  } await browser.close(); console.log(JSON.stringify({captures}, null, 2));
})().catch(error => { console.error(error.stack || error); process.exit(1); });
'''


def main() -> int:
    try:
        subprocess.run(["node", "-e", "require('playwright-core')"], cwd=ROOT, check=True, capture_output=True)
        pages, viewports = choose_pages(), choose_viewports()
        target = choose_target(pages)
        if not pages:
            print("No pages were selected. Choose a page or check the site language directories.")
            return 1
    except KeyboardInterrupt:
        print("\nCancelled.")
        return 130
    stamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S-%f")
    output_dir = OUTPUT_ROOT / stamp
    port = find_free_port()
    previous_cwd = Path.cwd()
    os.chdir(ROOT)
    server = start_server(port)
    print(f"Capturing {len(pages)} page(s) across {len(viewports)} viewport(s). Images are written to {output_dir.relative_to(ROOT)} as they complete.")
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".cjs", dir=ROOT, delete=False, encoding="utf-8") as temp:
            temp.write(RUNNER)
            runner_path = Path(temp.name)
        try:
            result = subprocess.run(["node", str(runner_path), f"http://127.0.0.1:{port}", str(output_dir), json.dumps(pages), json.dumps(viewports), json.dumps(target)], cwd=ROOT, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        except KeyboardInterrupt:
            archive = create_archive(output_dir)
            print(f"\nCapture cancelled. Completed images were packaged in {archive.relative_to(ROOT)}.")
            return 130
    finally:
        os.chdir(previous_cwd)
        server.shutdown()
        runner_path.unlink(missing_ok=True) if "runner_path" in locals() else None
    if result.returncode:
        archive = create_archive(output_dir)
        print(result.stdout)
        print(f"Completed images were packaged in {archive.relative_to(ROOT)}.")
        return result.returncode
    manifest = json.loads(result.stdout)
    manifest.update({"capturedAt": datetime.now().isoformat(timespec="seconds"), "pages": pages, "viewports": viewports, "target": target})
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    archive = create_archive(output_dir)
    captured = sum(item["status"] == "captured" for item in manifest["captures"])
    skipped = sum(item["status"] == "skipped" for item in manifest["captures"])
    failed = sum(item["status"] == "failed" for item in manifest["captures"])
    print(f"\nCaptured {captured} screenshot(s). Skipped: {skipped}. Failed: {failed}.")
    print(f"Output: {output_dir.relative_to(ROOT)}")
    print(f"Manifest: {(output_dir / 'manifest.json').relative_to(ROOT)}")
    print(f"ZIP: {archive.relative_to(ROOT)}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
