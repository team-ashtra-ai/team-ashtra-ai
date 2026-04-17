import "server-only";

import { load, type Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";

import type { AutomationBlueprint, IntakeSelections } from "@/lib/types";

/**
 * Optimize HTML using blueprint suggestions
 */
export function optimizeHtmlWithBlueprint(
  html: string,
  blueprint: AutomationBlueprint,
  intake: IntakeSelections,
  previewNotes = "",
): string {
  const $ = load(html);
  const selectedVariation =
    blueprint.designVariations.find((variation) => variation.id === intake.styleDirection) ||
    blueprint.designVariations[0];
  const experienceNotes = buildInfluenceNotes(intake, previewNotes);
  const preferredCtaLabel = getPreferredCtaLabel(
    intake,
    selectedVariation?.ctaLabel || "Get Started",
  );

  // 1. Update meta tags with SEO recommendations
  updateMetaTags($, blueprint, intake, selectedVariation?.headline || blueprint.summary);

  // 2. Enhance headings and structure
  enhanceHeadingStructure(
    $,
    blueprint,
    intake,
    selectedVariation?.headline || blueprint.summary,
  );

  // 3. Add conversion-focused CTAs
  addConversionCtas($, blueprint, intake, preferredCtaLabel, experienceNotes);

  // 4. Improve accessibility
  improveAccessibility($, blueprint);

  // 5. Add structured data for better SEO
  addStructuredData($, intake, blueprint);

  // 6. Optimize for mobile (viewport and responsive)
  optimizeForMobile($);

  // 7. Add performance hints
  addPerformanceHints($);

  return $.html();
}

function updateMetaTags(
  $: ReturnType<typeof load>,
  blueprint: AutomationBlueprint,
  intake: IntakeSelections,
  headline: string,
): void {
  // Update or create meta description
  const metaDesc = $('meta[name="description"]');
  const summary = escapeHtml(blueprint.summary);
  if (!metaDesc.length) {
    $("head").append(`<meta name="description" content="${summary}">`);
  } else {
    metaDesc.attr("content", blueprint.summary);
  }

  const metaKeywords = [...intake.goals, ...intake.marketingPriorities]
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10)
    .join(", ");

  if (metaKeywords) {
    const keywordTag = $('meta[name="keywords"]');
    if (!keywordTag.length) {
      $("head").append(`<meta name="keywords" content="${escapeHtml(metaKeywords)}">`);
    } else {
      keywordTag.attr("content", metaKeywords);
    }
  }

  // Add Open Graph tags
  $("head").append(`
    <meta property="og:title" content="${escapeHtml(headline.slice(0, 60))}" />
    <meta property="og:description" content="${summary}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="ash-tra.com" />
  `);
}

function enhanceHeadingStructure(
  $: ReturnType<typeof load>,
  blueprint: AutomationBlueprint,
  intake: IntakeSelections,
  headline: string,
): void {
  // Ensure proper heading hierarchy
  // Update or create main H1
  const h1 = $("h1").first();
  if (h1.length) {
    h1.text(headline);
  } else {
    $("body").prepend(`<h1 style="margin: 2rem 0; font-size: 2.5rem; font-weight: bold;">${escapeHtml(headline)}</h1>`);
  }

  // Add subheadings for quick wins
  const quickWinsSection = $("body > section").eq(0);
  if (quickWinsSection.length) {
    let quickWinsHtml = `<h2 style="margin: 2rem 0 1rem 0; font-size: 1.8rem; font-weight: 600;">Quick Wins</h2><ul style="margin: 1rem 0; padding-left: 2rem;">`;
    blueprint.quickWins.forEach((win) => {
      quickWinsHtml += `<li style="margin: 0.5rem 0; color: #333;">${escapeHtml(win)}</li>`;
    });
    quickWinsHtml += `</ul>`;
    const directionNotes = [
      buildDirectionLine("Ideal client", getDiscoveryValue(intake, "ideal_client")),
      buildDirectionLine("Primary action", getDiscoveryValue(intake, "visitor_action")),
      buildDirectionLine("Brand feel", getDiscoveryValue(intake, "brand_feel") || intake.tone),
      buildDirectionLine("Visual style", getDiscoveryValue(intake, "visual_style")),
      buildDirectionLine("AI inspiration", intake.aiInspiration),
    ]
      .filter(Boolean)
      .join("");

    if (directionNotes) {
      quickWinsHtml += `<div style="margin: 1.5rem 0 0; padding: 1.25rem; border: 1px solid #e4d7ca; border-radius: 18px; background: #fffaf4;">
        <h3 style="margin: 0 0 0.75rem; font-size: 1.15rem; font-weight: 600;">Client direction</h3>
        <div style="display: grid; gap: 0.5rem;">${directionNotes}</div>
      </div>`;
    }
    quickWinsSection.after(quickWinsHtml);
  }
}

function addConversionCtas(
  $: ReturnType<typeof load>,
  blueprint: AutomationBlueprint,
  intake: IntakeSelections,
  ctaLabel: string,
  supportingNotes: string,
): void {
  const ctaHtml = `
    <div style="margin: 2rem auto; text-align: center; padding: 2rem; background: linear-gradient(135deg, #10212b 0%, #224260 100%); border-radius: 18px; max-width: 640px;">
      <h3 style="color: white; margin: 0 0 1rem 0; font-size: 1.5rem; font-weight: bold;">${escapeHtml(ctaLabel)}</h3>
      <p style="color: rgba(255,255,255,0.9); margin: 0 0 1.5rem 0;">${escapeHtml(supportingNotes || intake.personalizationNotes || "Transform your business today")}</p>
      <a href="#contact" style="display: inline-block; padding: 12px 32px; background: #f46036; color: #fffaf3; text-decoration: none; border-radius: 999px; font-weight: 600; transition: all 0.3s ease;">
        ${escapeHtml(ctaLabel)}
      </a>
    </div>
  `;

  // Add CTA before footer or at end
  const footer = $("footer");
  if (footer.length) {
    footer.before(ctaHtml);
  } else {
    $("body").append(ctaHtml);
  }
}

function improveAccessibility(
  $: ReturnType<typeof load>,
  blueprint: AutomationBlueprint,
): void {
  const fallbackTopic =
    blueprint.designVariations[0]?.headline || blueprint.summary || "the page content";

  // Add language attribute if missing
  if (!$("html").attr("lang")) {
    $("html").attr("lang", "en");
  }

  // Ensure all images have alt text
  $("img").each((_, el) => {
    const $img = $(el);
    if (!$img.attr("alt")?.trim()) {
      $img.attr("alt", buildImageAltText($img, fallbackTopic));
    }
  });

  // Add ARIA labels to buttons without text
  $("button, a[role='button']").each((_, el) => {
    const $el = $(el);
    if (!$el.text().trim() && !$el.attr("aria-label")) {
      $el.attr("aria-label", "Call to action");
    }
  });
}

function addStructuredData(
  $: ReturnType<typeof load>,
  intake: IntakeSelections,
  blueprint: AutomationBlueprint
): void {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: intake.companyName,
    description: blueprint.summary,
    url: intake.sourceUrl,
    knowsAbout: [...intake.goals, ...intake.marketingPriorities].slice(0, 10),
    sameAs: [],
  };

  const script = $("<script>").attr("type", "application/ld+json").text(JSON.stringify(structuredData));
  $("head").append(script);
}

function getDiscoveryValue(intake: IntakeSelections, id: string) {
  return intake.discoveryAnswers.find((answer) => answer.id === id)?.answer.trim() || "";
}

function buildInfluenceNotes(intake: IntakeSelections, previewNotes: string) {
  return [
    intake.aiInspiration,
    intake.consultationFocus,
    intake.personalizationNotes,
    getDiscoveryValue(intake, "current_problem"),
    getDiscoveryValue(intake, "success_metric"),
    previewNotes,
  ]
    .map((item) => item.trim())
    .filter(Boolean)
    .join(" ");
}

function getPreferredCtaLabel(intake: IntakeSelections, fallback: string) {
  return getDiscoveryValue(intake, "visitor_action") || fallback;
}

function buildDirectionLine(label: string, value: string) {
  if (!value.trim()) {
    return "";
  }

  return `<div style="color: #334155; font-size: 0.98rem; line-height: 1.5;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</div>`;
}

function optimizeForMobile($: ReturnType<typeof load>): void {
  // Ensure viewport meta tag
  const viewport = $('meta[name="viewport"]');
  if (!viewport.length) {
    $("head").append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">');
  } else {
    viewport.attr("content", "width=device-width, initial-scale=1, maximum-scale=5");
  }

  // Add CSS for mobile responsiveness if no style exists
  if (!$("style").length) {
    $("head").append(`
      <style>
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        img { max-width: 100%; height: auto; display: block; }
        button, a { cursor: pointer; }
        @media (max-width: 768px) {
          body { font-size: 16px; }
          h1 { font-size: 1.5rem; }
          h2 { font-size: 1.25rem; }
        }
      </style>
    `);
  }
}

function addPerformanceHints($: ReturnType<typeof load>): void {
  // Add preconnect for external fonts/resources
  $("head").prepend(`
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  `);

  // Add DNS prefetch if needed
  // Note: services like analytics, payment processors
}

function buildImageAltText($img: Cheerio<AnyNode>, fallbackTopic: string) {
  const title = $img.attr("title")?.trim();
  if (title) {
    return title;
  }

  const figcaption = $img.closest("figure").find("figcaption").first().text().trim();
  if (figcaption) {
    return trimToWords(figcaption, 16);
  }

  const ariaLabel = $img.attr("aria-label")?.trim();
  if (ariaLabel) {
    return ariaLabel;
  }

  const src = $img.attr("src") || "";
  const filenameHint = src
    .split("/")
    .pop()
    ?.replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();

  if (filenameHint) {
    return trimToWords(`Illustration related to ${filenameHint}`, 16);
  }

  return trimToWords(`Supporting visual for ${fallbackTopic}`, 16);
}

function trimToWords(text: string, maxWords: number) {
  return text.split(/\s+/).filter(Boolean).slice(0, maxWords).join(" ");
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
