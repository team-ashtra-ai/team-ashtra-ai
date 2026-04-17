import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

import * as cheerio from "cheerio";

const execFileAsync = promisify(execFile);

const appDir = process.cwd();
const repoRoot = path.resolve(appDir, "../..");
const docsDir = path.join(repoRoot, "docs");
const tempDir = path.join(appDir, ".review-captures");
const outputPath = path.join(docsDir, "public-facing-review.html");
const baseUrl = (process.env.REVIEW_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

const desktopViewport = "1440,960";

const pages = [
  {
    slug: "home",
    title: "Home",
    route: "/",
    summary:
      "The homepage should immediately tell a serious service business who ash-tra helps, what improves, why it matters commercially, and what to do next.",
    proposal: {
      nav: ["Services", "How It Works", "Consultation", "Client Login", "Start a Project"],
      sections: [
        {
          label: "Hero",
          heading: "Websites that explain your value clearly and help the right clients say yes.",
          body:
            "We redesign websites and client portals for service businesses that need clearer messaging, stronger SEO foundations, better accessibility, multilingual readiness, and a smoother client experience from first click to final handoff.",
          bullets: [
            "Clearer positioning for premium buyers",
            "SEO structure built into the pages from day one",
            "Accessibility, multilingual readiness, and a client portal that feel designed in from the start",
          ],
          ctas: ["Start a project", "See services"],
        },
        {
          label: "Why It Works",
          heading: "What changes when the site is doing its job",
          body:
            "Visitors should understand who you help, what makes your offer different, and what to do next within a few seconds. The redesign should make that path obvious.",
          bullets: [
            "The message becomes easier to understand",
            "Trust signals appear earlier in the page",
            "The next step feels clear instead of forced",
          ],
        },
        {
          label: "Core Services",
          heading: "Three areas we improve together",
          body:
            "We treat messaging, search visibility, accessibility, multilingual usability, and client delivery as one customer journey instead of separate clean-up tasks.",
          bullets: [
            "Messaging and page structure",
            "Website SEO and content foundations",
            "Client portal, onboarding, and delivery flow",
          ],
        },
        {
          label: "Client Experience",
          heading: "The experience should stay premium after the proposal is signed.",
          body:
            "A strong website should lead into a strong delivery experience. That means intake, files, status updates, and handoff all feel organized and on-brand.",
          bullets: [
            "One place for project details and files",
            "Clear project status and payment visibility",
            "A smoother handoff for both client and team",
          ],
        },
        {
          label: "Closing CTA",
          heading: "If the work is premium, the website and client journey should feel premium too.",
          body:
            "Use the site to make the business easier to understand, easier to trust, and easier to buy from.",
          ctas: ["Start a project"],
        },
      ],
    },
  },
  {
    slug: "services",
    title: "Services",
    route: "/services",
    summary:
      "The services page should explain what improves for the client's business in plain language rather than describing internal architecture or process language.",
    proposal: {
      nav: ["Services", "How It Works", "Consultation", "Client Login", "Start a Project"],
      sections: [
        {
          label: "Hero",
          heading: "Services for businesses that need a clearer website and a smoother client journey.",
          body:
            "We help service brands improve how they present their offer, how they show up in search, and how clients move through the project after the sale.",
        },
        {
          label: "Service 1",
          heading: "Messaging and positioning",
          body:
            "Clarify what you do, who it is for, and why a buyer should trust you. This usually starts with the homepage, offer pages, proof blocks, and calls to action.",
          bullets: [
            "Homepage and page hierarchy",
            "Offer framing and service structure",
            "Testimonials, proof, and calls to action",
          ],
        },
        {
          label: "Service 2",
          heading: "Website SEO foundations",
          body:
            "SEO should be built into the page structure while the site is being shaped, with accessibility and multilingual readiness handled as part of modern website quality rather than rushed add-ons.",
          bullets: [
            "Metadata and schema",
            "Heading structure and internal linking",
            "Search-aware copy, page intent, accessibility, and multilingual planning",
          ],
        },
        {
          label: "Service 3",
          heading: "Client portal and delivery flow",
          body:
            "The portal should help clients feel confident after they sign. It should make intake, file sharing, quotes, and project status easy to follow.",
          bullets: [
            "Project intake and reference collection",
            "Quote, payment, and progress visibility",
            "Organized asset delivery and handoff",
          ],
        },
        {
          label: "Deliverables",
          heading: "What clients actually get",
          body:
            "A stronger website, clearer page structure, a better SEO base, more usable page design, and a client workspace that supports the service instead of weakening it.",
          bullets: [
            "Core public-facing pages",
            "Shared design system and content direction",
            "Client workspace screens and delivery flow",
          ],
        },
        {
          label: "Closing CTA",
          heading: "If the current site undersells the work, we fix the message, the structure, and the client flow together.",
          body: "That creates a site that is easier to trust and easier to use.",
          ctas: ["Start a project"],
        },
      ],
    },
  },
  {
    slug: "process",
    title: "How It Works",
    route: "/process",
    summary:
      "The process page should describe the visible client journey in a simple sequence: review, clarify, build, and connect the work to the client experience.",
    proposal: {
      nav: ["Services", "How It Works", "Consultation", "Client Login", "Start a Project"],
      sections: [
        {
          label: "Hero",
          heading: "A clear process from audit to launch.",
          body:
            "We start with the current site, identify what is helping or hurting trust, then rebuild the public pages and client flow around a clearer message and cleaner structure.",
        },
        {
          label: "Step 1",
          heading: "Review the current site and business context",
          body:
            "We look at the current website, the offer, the proof, and the friction points that are making the business harder to understand or harder to buy from.",
        },
        {
          label: "Step 2",
          heading: "Clarify the message and page structure",
          body:
            "We simplify the story so the audience, value, and next step are clear. This shapes the homepage, service pages, proof sections, and calls to action.",
        },
        {
          label: "Step 3",
          heading: "Build the SEO-ready page system",
          body:
            "We create pages that are easier to scan for people and easier to understand for search engines, with cleaner metadata, headings, and content structure.",
        },
        {
          label: "Step 4",
          heading: "Connect it to the client delivery experience",
          body:
            "The signed-in experience should carry the same quality as the public site, with clearer status, files, and handoff steps.",
        },
        {
          label: "Principles",
          heading: "How we keep the work practical",
          body:
            "The process should stay simple, visible, and useful under real delivery pressure. Clients should know what is happening. Teams should know what comes next.",
          bullets: [
            "Clear page structure",
            "Search-ready templates",
            "Organized delivery and handoff",
          ],
        },
        {
          label: "Closing CTA",
          heading: "A better process produces a better website and a better client experience.",
          body:
            "If the current site already has some trust or traffic, improving the structure can create value quickly.",
          ctas: ["Start a project"],
        },
      ],
    },
  },
  {
    slug: "consultation",
    title: "Consultation",
    route: "/consultation",
    summary:
      "The consultation page should explain how the discovery session clarifies the message, page priorities, and visual direction before the optimized site is generated.",
    proposal: {
      nav: ["Services", "How It Works", "Consultation", "Client Login", "Start a Project"],
      sections: [
        {
          label: "Hero",
          heading: "Use the consultation when the business needs clarity before the final build direction is locked.",
          body:
            "The consultation should turn rough ideas into a focused discovery brief so the optimized site has a stronger message, clearer page priorities, and more confident visual direction.",
        },
        {
          label: "Why It Helps",
          heading: "What the consultation should clarify",
          body:
            "This page should explain that the session covers business context, audience, brand feel, website scope, and decision-making constraints before the final execution starts.",
          bullets: [
            "Business goals and current friction",
            "Audience, objections, and next-step priorities",
            "Visual direction, references, and page scope",
          ],
        },
        {
          label: "Delivery",
          heading: "What the client receives",
          body:
            "The output should feel concrete: a discovery brief, stronger website direction, and a clearer path into preview, payment, and delivery.",
          bullets: [
            "A captured discovery brief",
            "Priority pages and integrations",
            "AI-ready inspiration and visual preferences",
            "A smoother handoff into the client workspace",
          ],
        },
        {
          label: "Why It Matters",
          heading: "This is a strategy step, not a vague chat.",
          body:
            "The consultation should make the next build stage faster and better because the choices were made deliberately instead of guessed later.",
        },
        {
          label: "Closing CTA",
          heading: "If the business needs clarity first, the consultation should make the next move obvious.",
          body:
            "The public page should explain the value clearly. The private workspace should capture the answers and move the project forward cleanly.",
          ctas: ["Book consultation", "Start a project"],
        },
      ],
    },
  },
  {
    slug: "login",
    title: "Client Login",
    route: "/login",
    summary:
      "The login page should be direct, reassuring, and task-focused. It exists to help users sign in confidently, not to restate the brand manifesto.",
    proposal: {
      nav: ["Services", "How It Works", "Consultation", "Client Login", "Start a Project"],
      sections: [
        {
          label: "Intro",
          heading: "Client portal login",
          body:
            "Sign in to view project updates, files, payment status, and delivery notes in one place.",
          bullets: [
            "Check project progress",
            "Review files and deliverables",
            "See payment and handoff details",
          ],
        },
        {
          label: "Form",
          heading: "Sign in",
          body: "Use the email and password connected to your workspace.",
          bullets: ["Email", "Password", "Sign in"],
        },
        {
          label: "Secondary CTA",
          heading: "Need access?",
          body: "Create an account to start a new project or contact the team if you expected access already.",
          ctas: ["Create account"],
        },
      ],
    },
  },
  {
    slug: "register",
    title: "Start A Project",
    route: "/register",
    summary:
      "The register page should feel like the beginning of a project, with clear language around the brief, references, and the client portal rather than internal product terms.",
    proposal: {
      nav: ["Services", "How It Works", "Consultation", "Client Login", "Start a Project"],
      sections: [
        {
          label: "Intro",
          heading: "Start a project",
          body:
            "Create your account to submit the brief, share references, and keep the project organized from the start.",
          bullets: [
            "Tell us about the current site and goals",
            "Upload references and brand material",
            "Track the project in one client portal",
          ],
        },
        {
          label: "Form",
          heading: "Create your account",
          body:
            "Once the account is ready, you can add project details, upload assets, and move into the planning phase.",
          bullets: ["Full name", "Email", "Password", "Create account"],
        },
        {
          label: "Secondary CTA",
          heading: "Already have access?",
          body: "Sign in to return to your project workspace.",
          ctas: ["Sign in"],
        },
      ],
    },
  },
];

function cleanText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function isHiddenAtDesktop(className = "") {
  const tokens = className.split(/\s+/).filter(Boolean);
  const hiddenByBreakpoint = tokens.some((token) => /^(lg|xl|2xl):hidden$/.test(token));
  if (hiddenByBreakpoint) {
    return true;
  }

  if (!tokens.includes("hidden")) {
    return false;
  }

  const visibleAtDesktop = tokens.some((token) =>
    /^(lg|xl|2xl):(block|flex|inline|inline-flex|grid|table|inline-block)$/.test(token),
  );

  return !visibleAtDesktop;
}

function removeHiddenForDesktop($scope, $) {
  $scope.find("[class]").each((_, element) => {
    if (isHiddenAtDesktop($(element).attr("class") || "")) {
      $(element).remove();
    }
  });
}

function collectVisibleTexts($, rootElement) {
  const texts = [];

  const visit = (node) => {
    if (!node) {
      return;
    }

    if (node.type === "text") {
      const text = cleanText(node.data || "");
      if (text) {
        texts.push(text);
      }
      return;
    }

    if (node.type !== "tag") {
      return;
    }

    const tag = (node.tagName || "").toLowerCase();
    if (["script", "style", "svg", "path", "img", "noscript"].includes(tag)) {
      return;
    }

    const attribs = node.attribs || {};
    if (attribs["aria-hidden"] === "true") {
      return;
    }

    if (isHiddenAtDesktop(attribs.class || "")) {
      return;
    }

    for (const child of node.children || []) {
      visit(child);
    }
  };

  visit(rootElement);

  const deduped = [];
  const seen = new Set();

  for (const text of texts) {
    if (seen.has(text)) {
      continue;
    }
    seen.add(text);
    deduped.push(text);
  }

  return deduped;
}

function getSectionTitle($, sectionElement, fallbackLabel) {
  const heading = cleanText($(sectionElement).find("h1, h2, h3").first().text());
  if (heading) {
    return heading;
  }

  const firstText = collectVisibleTexts($, sectionElement)[0];
  if (firstText) {
    return firstText;
  }

  return fallbackLabel;
}

async function extractPageContent(page) {
  const response = await fetch(`${baseUrl}${page.route}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${page.route}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const shell = $(".page-shell").first();

  if (!shell.length) {
    throw new Error(`Could not find .page-shell in ${page.route}`);
  }

  removeHiddenForDesktop(shell, $);

  const sections = [];
  const header = shell.find("header").first();
  if (header.length) {
    sections.push({
      label: "Global Header",
      title: "Global Header",
      texts: collectVisibleTexts($, header[0]),
    });
  }

  shell.find("main").children("section").each((index, element) => {
    sections.push({
      label: `Section ${index + 1}`,
      title: getSectionTitle($, element, `Section ${index + 1}`),
      texts: collectVisibleTexts($, element),
    });
  });

  const footer = shell.find("footer").first();
  if (footer.length) {
    sections.push({
      label: "Global Footer",
      title: "Global Footer",
      texts: collectVisibleTexts($, footer[0]),
    });
  }

  return sections;
}

async function captureScreenshot(page) {
  const targetPath = path.join(tempDir, `${page.slug}.jpeg`);
  await execFileAsync(
    "npx",
    [
      "--yes",
      "playwright",
      "screenshot",
      "--full-page",
      "--browser",
      "chromium",
      "--wait-for-selector",
      "main",
      "--wait-for-timeout",
      "1500",
      "--color-scheme",
      "light",
      "--viewport-size",
      desktopViewport,
      `${baseUrl}${page.route}`,
      targetPath,
    ],
    { cwd: repoRoot },
  );

  const imageBuffer = await fs.readFile(targetPath);
  return `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTextList(items) {
  if (!items?.length) {
    return "<p class=\"muted\">No customer-visible text found.</p>";
  }

  return `<ul class="text-list">${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function renderProposalSection(section) {
  return `
    <section class="proposal-block">
      <h4>${escapeHtml(section.label)}</h4>
      <p class="proposal-heading">${escapeHtml(section.heading)}</p>
      <p>${escapeHtml(section.body)}</p>
      ${section.bullets?.length ? renderTextList(section.bullets) : ""}
      ${section.ctas?.length ? `<p><strong>Suggested CTAs:</strong> ${escapeHtml(section.ctas.join(" | "))}</p>` : ""}
    </section>
  `;
}

function renderPage(page, currentSections, imageDataUrl) {
  return `
    <article class="page-card" id="${escapeHtml(page.slug)}">
      <header class="page-card-header">
        <div>
          <p class="eyebrow">${escapeHtml(page.title)}</p>
          <h2>${escapeHtml(page.route)}</h2>
          <p class="summary">${escapeHtml(page.summary)}</p>
        </div>
      </header>

      <div class="shot-wrap">
        <img src="${imageDataUrl}" alt="${escapeHtml(`${page.title} page screenshot`)}" />
      </div>

      <div class="two-col">
        <section class="panel">
          <h3>Current customer-visible copy</h3>
          ${currentSections
            .map(
              (section) => `
                <details class="section-detail" open>
                  <summary>${escapeHtml(section.title)}</summary>
                  ${renderTextList(section.texts)}
                </details>
              `,
            )
            .join("")}
        </section>

        <section class="panel proposal-panel">
          <h3>Proposed client-readable rewrite</h3>
          <p class="muted"><strong>Suggested nav:</strong> ${escapeHtml(page.proposal.nav.join(" | "))}</p>
          ${page.proposal.sections.map(renderProposalSection).join("")}
        </section>
      </div>
    </article>
  `;
}

function renderDocument(renderedPages) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Public-Facing Review</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f4efe8;
        --surface: #fffaf5;
        --surface-strong: #ffffff;
        --line: #dfd5cb;
        --ink: #122032;
        --muted: #5f6b78;
        --accent: #d25b2d;
        --accent-soft: #f7e0d3;
        --cyan: #0f7980;
        --shadow: 0 20px 50px rgba(18, 32, 50, 0.08);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: linear-gradient(180deg, #fbf7f2 0%, var(--bg) 100%);
        color: var(--ink);
      }

      main {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 24px 64px;
      }

      .intro {
        background: rgba(255, 250, 245, 0.9);
        border: 1px solid var(--line);
        border-radius: 28px;
        padding: 28px;
        box-shadow: var(--shadow);
      }

      .intro h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 4vw, 3.25rem);
        line-height: 1;
      }

      .intro p {
        max-width: 900px;
        margin: 10px 0 0;
        color: var(--muted);
        line-height: 1.6;
      }

      .highlights {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 14px;
        margin-top: 20px;
      }

      .intro-bar {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 16px;
      }

      .print-button {
        border: 1px solid var(--accent);
        background: linear-gradient(135deg, #e06a3d 0%, var(--accent) 100%);
        color: white;
        border-radius: 999px;
        padding: 12px 18px;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 12px 28px rgba(210, 91, 45, 0.24);
      }

      .print-button:hover {
        filter: brightness(1.03);
      }

      .highlight {
        padding: 16px 18px;
        border-radius: 18px;
        border: 1px solid var(--line);
        background: var(--surface);
      }

      .page-card {
        margin-top: 28px;
        padding: 24px;
        border-radius: 28px;
        border: 1px solid var(--line);
        background: rgba(255, 250, 245, 0.92);
        box-shadow: var(--shadow);
      }

      .page-card-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: start;
        margin-bottom: 18px;
      }

      .page-card-header h2 {
        margin: 6px 0 10px;
        font-size: 2rem;
      }

      .eyebrow {
        margin: 0;
        color: var(--accent);
        font-size: 0.86rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .summary {
        margin: 0;
        color: var(--muted);
        line-height: 1.65;
        max-width: 920px;
      }

      .shot-wrap {
        margin: 18px 0 26px;
        border-radius: 22px;
        overflow: hidden;
        border: 1px solid var(--line);
        background: white;
      }

      .shot-wrap img {
        display: block;
        width: 100%;
        height: auto;
      }

      .two-col {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 20px;
      }

      .panel {
        background: var(--surface-strong);
        border: 1px solid var(--line);
        border-radius: 22px;
        padding: 20px;
      }

      .panel h3 {
        margin-top: 0;
        margin-bottom: 14px;
        font-size: 1.2rem;
      }

      .muted {
        color: var(--muted);
        line-height: 1.6;
      }

      .section-detail {
        border-top: 1px solid var(--line);
        padding-top: 12px;
        margin-top: 12px;
      }

      .section-detail:first-of-type {
        border-top: 0;
        padding-top: 0;
        margin-top: 0;
      }

      .section-detail summary {
        cursor: pointer;
        font-weight: 700;
        color: var(--ink);
      }

      .text-list {
        margin: 12px 0 0;
        padding-left: 20px;
      }

      .text-list li {
        margin: 0 0 8px;
        line-height: 1.55;
      }

      .proposal-panel {
        background: linear-gradient(180deg, #fffaf7 0%, #fff 100%);
      }

      .proposal-block {
        margin-top: 16px;
        padding: 16px;
        border-radius: 18px;
        border: 1px solid var(--line);
        background: #fffdfa;
      }

      .proposal-block:first-of-type {
        margin-top: 0;
      }

      .proposal-block h4 {
        margin: 0 0 8px;
        color: var(--cyan);
        font-size: 0.94rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .proposal-block p {
        margin: 0 0 10px;
        line-height: 1.6;
      }

      .proposal-heading {
        font-size: 1.14rem;
        font-weight: 700;
        color: var(--ink);
      }

      @media (max-width: 980px) {
        main {
          padding: 24px 14px 56px;
        }

        .intro-bar {
          flex-direction: column;
        }

        .page-card {
          padding: 16px;
        }

        .two-col {
          grid-template-columns: 1fr;
        }
      }

      @media print {
        body {
          background: white;
        }

        main {
          max-width: none;
          padding: 0;
        }

        .print-button {
          display: none;
        }

        .page-card,
        .intro,
        .panel,
        .proposal-block,
        .highlight {
          box-shadow: none;
        }

        .page-card,
        .intro {
          break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="intro">
        <div class="intro-bar">
          <div>
            <p class="eyebrow">Public-Facing Review</p>
            <h1>Current screenshots, customer-visible copy, and clearer rewrite proposals</h1>
          </div>
          <button class="print-button" type="button" onclick="window.print()">Print / Save as PDF</button>
        </div>
        <p>
          This file captures the pages a public visitor can reach on the current site: the four marketing
          pages plus the public login and registration flows. Screenshots are full-page desktop captures from
          the live local app. The copy lists are extracted from the rendered HTML so you can review what a
          customer actually reads today, then compare it with a simpler client-facing rewrite.
        </p>
        <div class="highlights">
          <div class="highlight"><strong>Main issue:</strong><br />The site often describes the system instead of the client problem.</div>
          <div class="highlight"><strong>Rewrite goal:</strong><br />Replace internal jargon with outcomes, audience clarity, and concrete deliverables.</div>
          <div class="highlight"><strong>Best next move:</strong><br />Use these proposed sections as a draft structure before rewriting page-by-page in the app.</div>
        </div>
      </section>
      ${renderedPages.join("")}
    </main>
  </body>
</html>`;
}

async function main() {
  await fs.mkdir(tempDir, { recursive: true });
  await fs.mkdir(docsDir, { recursive: true });

  const renderedPages = [];

  for (const page of pages) {
    const [currentSections, screenshotDataUrl] = await Promise.all([
      extractPageContent(page),
      captureScreenshot(page),
    ]);

    renderedPages.push(renderPage(page, currentSections, screenshotDataUrl));
  }

  await fs.writeFile(outputPath, renderDocument(renderedPages), "utf8");
  await fs.rm(tempDir, { recursive: true, force: true });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
