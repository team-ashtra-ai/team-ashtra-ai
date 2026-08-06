
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
