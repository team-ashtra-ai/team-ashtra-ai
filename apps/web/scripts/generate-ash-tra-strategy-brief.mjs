import { promises as fs } from "node:fs";
import path from "node:path";

import data from "./ash-tra-strategy-brief.data.mjs";

const appDir = process.cwd();
const repoRoot = path.resolve(appDir, "../..");
const outputPath = path.join(repoRoot, "docs", "ash-tra-strategy-brief.html");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderList(items, className = "bullet-list") {
  return `<ul class="${className}">${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function renderKeyValueRows(rows) {
  return `<div class="kv-grid">${rows
    .map(
      ([label, value]) => `
        <div class="kv-card">
          <p class="kv-label">${escapeHtml(label)}</p>
          <p class="kv-value">${escapeHtml(value)}</p>
        </div>
      `,
    )
    .join("")}</div>`;
}

function renderSectionTitle(eyebrow, title, body = "") {
  return `
    <div class="section-head">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h2>${escapeHtml(title)}</h2>
      ${body ? `<p class="section-body">${escapeHtml(body)}</p>` : ""}
    </div>
  `;
}

function renderQaTable(group) {
  return `
    <section class="qa-group">
      <h3>${escapeHtml(group.title)}</h3>
      <div class="qa-table">
        ${group.items
          .map(
            (item) => `
              <div class="qa-row">
                <div class="qa-q">${escapeHtml(item.q)}</div>
                <div class="qa-a">${escapeHtml(item.a)}</div>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderDocument() {
  const generatedAt = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(data.meta.title)}</title>
    <style>
      :root {
        color-scheme: light;
        --paper: #f6f0e8;
        --paper-strong: #fffaf5;
        --panel: rgba(255, 251, 246, 0.92);
        --line: rgba(26, 37, 52, 0.12);
        --line-strong: rgba(26, 37, 52, 0.2);
        --ink: #122033;
        --ink-soft: #4f5c6d;
        --ink-faint: #738091;
        --accent: #c76034;
        --accent-soft: rgba(199, 96, 52, 0.12);
        --cyan: #0f6f77;
        --gold: #9b6d2d;
        --navy: #162435;
        --shadow: 0 30px 80px rgba(18, 32, 51, 0.08);
        --radius-xl: 30px;
        --radius-lg: 22px;
        --radius-md: 16px;
      }

      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        font-family: "Sora", "Avenir Next", "Segoe UI", sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(199, 96, 52, 0.08), transparent 26%),
          radial-gradient(circle at top right, rgba(15, 111, 119, 0.08), transparent 24%),
          linear-gradient(180deg, #fcf8f3 0%, var(--paper) 100%);
      }

      main {
        width: min(1400px, calc(100% - 32px));
        margin: 0 auto;
        padding: 28px 0 72px;
      }

      .cover {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 36px;
        background:
          linear-gradient(145deg, rgba(255, 250, 245, 0.98), rgba(247, 239, 231, 0.94)),
          var(--paper-strong);
        box-shadow: var(--shadow);
        padding: 32px;
      }

      .cover::before {
        content: "";
        position: absolute;
        inset: auto -80px -120px auto;
        width: 320px;
        height: 320px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(15, 111, 119, 0.14), transparent 68%);
        pointer-events: none;
      }

      .cover::after {
        content: "";
        position: absolute;
        inset: -90px auto auto -60px;
        width: 260px;
        height: 260px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(199, 96, 52, 0.14), transparent 68%);
        pointer-events: none;
      }

      .cover-top {
        position: relative;
        display: flex;
        justify-content: space-between;
        gap: 20px;
        align-items: start;
      }

      .eyebrow {
        margin: 0;
        font-size: 0.82rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--accent);
      }

      h1, h2, h3, h4 {
        font-family: "Fraunces", "Iowan Old Style", "Palatino Linotype", serif;
        letter-spacing: -0.04em;
      }

      h1 {
        margin: 14px 0 16px;
        max-width: 900px;
        font-size: clamp(2.6rem, 6vw, 5rem);
        line-height: 0.92;
      }

      .subtitle {
        max-width: 920px;
        margin: 0;
        font-size: 1.14rem;
        line-height: 1.65;
        color: var(--ink-soft);
      }

      .note {
        margin-top: 22px;
        padding: 16px 18px;
        border-radius: var(--radius-md);
        border: 1px solid rgba(15, 111, 119, 0.18);
        background: rgba(15, 111, 119, 0.08);
        color: var(--navy);
        line-height: 1.6;
      }

      .actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: end;
      }

      .action-btn {
        appearance: none;
        border: 1px solid transparent;
        border-radius: 999px;
        padding: 12px 18px;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
        text-decoration: none;
      }

      .action-btn.primary {
        color: white;
        background: linear-gradient(135deg, #dc7348, var(--accent));
        box-shadow: 0 14px 30px rgba(199, 96, 52, 0.22);
      }

      .action-btn.secondary {
        color: var(--ink);
        background: rgba(255, 255, 255, 0.72);
        border-color: var(--line);
      }

      .hero-stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 14px;
        margin-top: 28px;
      }

      .hero-stat,
      .card,
      .persona,
      .timeline-card,
      .appendix,
      .qa-group,
      .callout {
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        background: var(--panel);
        box-shadow: var(--shadow);
      }

      .hero-stat {
        padding: 18px;
      }

      .hero-stat-label {
        margin: 0;
        font-size: 0.76rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--ink-faint);
      }

      .hero-stat-value {
        margin: 10px 0 0;
        font-size: 1rem;
        line-height: 1.5;
        color: var(--ink);
      }

      .section {
        margin-top: 22px;
      }

      .section-head {
        margin-bottom: 16px;
      }

      .section-head h2 {
        margin: 8px 0 8px;
        font-size: clamp(2rem, 4vw, 3.2rem);
        line-height: 0.98;
      }

      .section-body {
        max-width: 850px;
        margin: 0;
        color: var(--ink-soft);
        line-height: 1.7;
      }

      .grid-2 {
        display: grid;
        grid-template-columns: 1.05fr 0.95fr;
        gap: 18px;
      }

      .grid-3 {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }

      .grid-4 {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 16px;
      }

      .card {
        padding: 22px;
      }

      .card h3,
      .persona h3,
      .timeline-card h3 {
        margin: 0 0 10px;
        font-size: 1.5rem;
      }

      .card p,
      .persona p,
      .timeline-card p,
      .appendix p {
        margin: 0;
        color: var(--ink-soft);
        line-height: 1.7;
      }

      .kv-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
      }

      .kv-card {
        padding: 18px;
        border-radius: var(--radius-md);
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.7);
      }

      .kv-label {
        margin: 0 0 8px;
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--ink-faint);
      }

      .kv-value {
        margin: 0;
        line-height: 1.58;
      }

      .bullet-list {
        margin: 12px 0 0;
        padding-left: 18px;
      }

      .bullet-list li {
        margin: 0 0 8px;
        line-height: 1.55;
        color: var(--ink-soft);
      }

      .persona {
        padding: 22px;
      }

      .mini-label {
        margin: 18px 0 8px;
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--cyan);
      }

      .message-stack > div {
        padding: 18px;
        border-radius: var(--radius-md);
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.66);
      }

      .message-stack {
        display: grid;
        gap: 14px;
      }

      .quote {
        font-size: 1.35rem;
        line-height: 1.55;
        color: var(--navy);
      }

      .intent-map {
        display: grid;
        gap: 12px;
      }

      .intent-row {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 14px;
        padding: 16px;
        border-radius: var(--radius-md);
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.68);
      }

      .intent-row strong {
        color: var(--navy);
      }

      .callout {
        padding: 24px;
        background: linear-gradient(140deg, rgba(22, 36, 53, 0.98), rgba(20, 45, 61, 0.96));
        color: white;
      }

      .callout h3,
      .callout p,
      .callout li {
        color: white;
      }

      .timeline {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 14px;
      }

      .timeline-card {
        padding: 20px;
      }

      .appendix {
        margin-top: 22px;
        padding: 22px;
      }

      .qa-group {
        margin-top: 16px;
        padding: 20px;
        break-inside: avoid;
      }

      .qa-group h3 {
        margin: 0 0 12px;
        font-size: 1.45rem;
      }

      .qa-table {
        display: grid;
        gap: 10px;
      }

      .qa-row {
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: 14px;
        padding: 14px;
        border-radius: var(--radius-md);
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(26, 37, 52, 0.08);
      }

      .qa-q {
        font-weight: 700;
        line-height: 1.5;
      }

      .qa-a {
        color: var(--ink-soft);
        line-height: 1.65;
      }

      .footer-note {
        margin-top: 20px;
        color: var(--ink-faint);
        font-size: 0.95rem;
      }

      @media (max-width: 1120px) {
        .grid-2,
        .grid-3,
        .grid-4,
        .hero-stats,
        .timeline,
        .kv-grid {
          grid-template-columns: 1fr 1fr;
        }

        .cover-top {
          flex-direction: column;
        }
      }

      @media (max-width: 760px) {
        main {
          width: min(100% - 20px, 1400px);
          padding-top: 14px;
        }

        .cover,
        .card,
        .persona,
        .timeline-card,
        .appendix,
        .qa-group {
          padding: 18px;
        }

        .grid-2,
        .grid-3,
        .grid-4,
        .hero-stats,
        .timeline,
        .kv-grid {
          grid-template-columns: 1fr;
        }

        .intent-row,
        .qa-row {
          grid-template-columns: 1fr;
        }

        h1 {
          font-size: 2.6rem;
        }
      }

      @media print {
        body {
          background: white;
        }

        main {
          width: 100%;
          padding: 0;
        }

        .cover,
        .hero-stat,
        .card,
        .persona,
        .timeline-card,
        .appendix,
        .qa-group,
        .callout,
        .kv-card,
        .intent-row,
        .message-stack > div,
        .qa-row {
          box-shadow: none;
          background: white;
        }

        .action-btn {
          display: none;
        }

        .cover,
        .section,
        .appendix {
          break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="cover">
        <div class="cover-top">
          <div>
            <p class="eyebrow">Strategic Design Brief</p>
            <h1>${escapeHtml(data.meta.title)}</h1>
            <p class="subtitle">${escapeHtml(data.meta.subtitle)}</p>
          </div>
          <div class="actions">
            <button class="action-btn primary" type="button" onclick="window.print()">Print / Save as PDF</button>
            <a class="action-btn secondary" href="#appendix">Jump to Consultation Answers</a>
          </div>
        </div>
        <div class="note">
          <strong>Working note:</strong> ${escapeHtml(data.meta.note)}
          <br />
          <strong>Generated:</strong> ${escapeHtml(generatedAt)}
          <br />
          <strong>Update path:</strong> edit <code>apps/web/scripts/ash-tra-strategy-brief.data.mjs</code> and rerun <code>npm run brief:ash-tra</code>.
        </div>
        <div class="hero-stats">
          ${data.heroStats
            .map(
              (stat) => `
                <article class="hero-stat">
                  <p class="hero-stat-label">${escapeHtml(stat.label)}</p>
                  <p class="hero-stat-value">${escapeHtml(stat.value)}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="section">
        ${renderSectionTitle("Executive Summary", "What ash-tra is really selling")}
        <div class="grid-2">
          <article class="card">
            <h3>Business pitch</h3>
            ${data.executiveSummary.map((paragraph) => `<p style="margin-top:12px;">${escapeHtml(paragraph)}</p>`).join("")}
          </article>
          <aside class="callout">
            <h3>Design-team translation</h3>
            <p>
              The visual system should communicate strategic intelligence, premium trust, and organized delivery.
              This is not a playful startup brand and not a cold enterprise portal. It should feel like a
              boutique operator with product-level rigor.
            </p>
            ${renderList([
              "Lead with clarity, not abstraction.",
              "Use editorial hierarchy to make the promise legible fast.",
              "Make the dashboard feel like the inside of the same premium product.",
              "Let proof and process do as much work as aesthetics.",
            ])}
          </aside>
        </div>
      </section>

      <section class="section">
        ${renderSectionTitle("Brief Summary", "AI-drafted client brief summary")}
        ${renderKeyValueRows(data.briefSummary)}
      </section>

      <section class="section">
        ${renderSectionTitle("Offer Architecture", "The commercial pillars ash-tra should own")}
        <div class="grid-4">
          ${data.offerPillars
            .map(
              (pillar) => `
                <article class="card">
                  <h3>${escapeHtml(pillar.title)}</h3>
                  <p>${escapeHtml(pillar.text)}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="section">
        ${renderSectionTitle("Audience", "Primary personas, motivations, and objections")}
        <div class="grid-3">
          ${data.personas
            .map(
              (persona) => `
                <article class="persona">
                  <h3>${escapeHtml(persona.name)}</h3>
                  <p>${escapeHtml(persona.snapshot)}</p>
                  <p class="mini-label">Goals</p>
                  ${renderList(persona.goals)}
                  <p class="mini-label">Pains</p>
                  ${renderList(persona.pains)}
                  <p class="mini-label">Trust triggers</p>
                  <p>${escapeHtml(persona.triggers)}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="section">
        ${renderSectionTitle("Intent Map", "How the buyer thinks before they ever start a project")}
        <div class="intent-map">
          ${data.intentMap
            .map(
              ([label, value]) => `
                <div class="intent-row">
                  <strong>${escapeHtml(label)}</strong>
                  <div>${escapeHtml(value)}</div>
                </div>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="section">
        ${renderSectionTitle("Positioning", "Message house, promise, and reasons to believe")}
        <div class="grid-2">
          <article class="card message-stack">
            <div>
              <p class="mini-label">One-line positioning</p>
              <p class="quote">${escapeHtml(data.positioning.oneLiner)}</p>
            </div>
            <div>
              <p class="mini-label">Core promise</p>
              <p>${escapeHtml(data.positioning.promise)}</p>
            </div>
            <div>
              <p class="mini-label">Different because</p>
              ${renderList(data.positioning.differentiators)}
            </div>
          </article>
          <article class="card">
            <p class="mini-label">Reasons to believe</p>
            ${renderList(data.positioning.reasonsToBelieve)}
            <p class="mini-label">Do not position as</p>
            ${renderList(data.positioning.notThis)}
          </article>
        </div>
      </section>

      <section class="section">
        ${renderSectionTitle("Brand Direction", "The taste, mood, and visual decisions the design team should work from")}
        <div class="grid-2">
          <article class="card">
            <h3>Forced-choice direction</h3>
            ${renderKeyValueRows(data.brandDirection.choices)}
          </article>
          <article class="card">
            <h3>Visual system guidance</h3>
            <p class="mini-label">Adjectives</p>
            ${renderList(data.brandDirection.adjectives)}
            <p class="mini-label">Palette direction</p>
            ${renderList(data.brandDirection.palette)}
            <p class="mini-label">Typography direction</p>
            ${renderList(data.brandDirection.typography)}
            <p class="mini-label">Imagery direction</p>
            ${renderList(data.brandDirection.imagery)}
            <p class="mini-label">Avoid</p>
            ${renderList(data.brandDirection.shouldAvoid)}
          </article>
        </div>
      </section>

      <section class="section">
        ${renderSectionTitle("Website Strategy", "What the site should communicate and how the structure should work")}
        <div class="grid-2">
          <article class="card">
            <h3>First impression brief</h3>
            <p>${escapeHtml(data.websiteStrategy.firstFiveSeconds)}</p>
            <p class="mini-label">Must communicate</p>
            ${renderList(data.websiteStrategy.mustCommunicate)}
            <p class="mini-label">Recommended pages</p>
            ${renderList(data.websiteStrategy.recommendedPages)}
            <p class="mini-label">Optional expansion</p>
            ${renderList(data.websiteStrategy.optionalPages)}
          </article>
          <article class="card">
            <h3>Page jobs</h3>
            ${renderKeyValueRows(data.websiteStrategy.pageGoals)}
          </article>
        </div>
      </section>

      <section class="section">
        ${renderSectionTitle("UX / UI Direction", "Principles for flow, forms, trust, and clarity")}
        <div class="grid-3">
          <article class="card">
            <h3>Principles</h3>
            ${renderList(data.uxUiDirection.principles)}
          </article>
          <article class="card">
            <h3>Friction to reduce</h3>
            ${renderList(data.uxUiDirection.frictionToReduce)}
          </article>
          <article class="card">
            <h3>Trust signals</h3>
            ${renderList(data.uxUiDirection.trustSignals)}
          </article>
        </div>
      </section>

      <section class="section">
        ${renderSectionTitle("Technical, Content, Ops, and Measurement", "The system logic behind the brand")}
        <div class="grid-2">
          <article class="card">
            <h3>Technical view</h3>
            <p class="mini-label">Current stack</p>
            ${renderList(data.technicalView.currentStack)}
            <p class="mini-label">Current strengths</p>
            ${renderList(data.technicalView.currentStrengths)}
            <p class="mini-label">Likely next needs</p>
            ${renderList(data.technicalView.likelyNextNeeds)}
          </article>
          <article class="card">
            <h3>SEO and content</h3>
            <p class="mini-label">Priority themes</p>
            ${renderList(data.seoContent.priorityThemes)}
            <p class="mini-label">Content pillars</p>
            ${renderList(data.seoContent.contentPillars)}
            <p class="mini-label">Tone</p>
            <p>${escapeHtml(data.seoContent.tone)}</p>
          </article>
        </div>
        <div class="grid-2" style="margin-top:16px;">
          <article class="card">
            <h3>Sales and operations</h3>
            <p class="mini-label">Lead handling flow</p>
            ${renderList(data.salesOps.leadHandling)}
            <p class="mini-label">High-quality lead profile</p>
            ${renderList(data.salesOps.highQualityLead)}
            <p class="mini-label">Operational wins</p>
            ${renderList(data.salesOps.operationalWins)}
          </article>
          <article class="card">
            <h3>Analytics</h3>
            <p class="mini-label">Core KPIs</p>
            ${renderList(data.analytics.kpis)}
            <p class="mini-label">Platform needs</p>
            ${renderList(data.analytics.platformNeeds)}
          </article>
        </div>
      </section>

      <section class="section">
        ${renderSectionTitle("Roadmap", "A sensible phased rollout")}
        <div class="timeline">
          ${data.roadmap
            .map(
              (entry) => `
                <article class="timeline-card">
                  <p class="eyebrow">${escapeHtml(entry.phase)}</p>
                  <h3>${escapeHtml(entry.title)}</h3>
                  <p>${escapeHtml(entry.body)}</p>
                  ${entry.bullets?.length ? renderList(entry.bullets) : ""}
                </article>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="section">
        ${renderSectionTitle("Key Risks", "What the team must protect against")}
        <div class="grid-2">
          <article class="card">
            <h3>Primary risks</h3>
            ${renderList(data.risks)}
          </article>
          <article class="callout">
            <h3>North-star outcome</h3>
            <p>
              The finished experience should leave people thinking:
              “This company understands high-value service businesses, has taste, has structure, and will
              run my project like a premium operator from first impression to final delivery.”
            </p>
          </article>
        </div>
      </section>

      <section class="appendix" id="appendix">
        ${renderSectionTitle("Consultation Answers Appendix", "AI-drafted answers to the discovery questions, written as a working consultation brief.")}
        ${data.qaGroups.map(renderQaTable).join("")}
        <p class="footer-note">
          The reusable questionnaire template is saved separately at
          <code>docs/client-discovery-questionnaire-template.md</code>.
        </p>
      </section>
    </main>
  </body>
</html>`;
}

async function main() {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, renderDocument(), "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
