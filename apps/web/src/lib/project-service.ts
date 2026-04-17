import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { sendProjectEventNotifications } from "@/lib/notifications";
import { generateJsonFromOllama } from "@/lib/ollama";
import { createStripeCheckoutSession } from "@/lib/payments";
import { buildProjectMediaSuggestions } from "@/lib/pixabay";
import { buildProjectQuote, getConsultationTypeLabel, syncProjectPricing } from "@/lib/pricing";
import { captureSiteSnapshot, downloadSiteAssets } from "@/lib/site-analysis";
import { regenerateProjectOutputs } from "@/lib/project-outputs";
import {
  findProjectById,
  getProjectDirectory,
  listProjects,
  listProjectsForUser,
  saveProject,
  saveUpload,
} from "@/lib/storage";
import type {
  AutomationBlueprint,
  CommunicationReceipt,
  DiscoveryAnswer,
  DesignVariation,
  IntakeSelections,
  ProjectRecord,
  SiteCaptureSelection,
  SiteSnapshot,
  UserRecord,
} from "@/lib/types";
import { normalizeSourceUrl, slugify } from "@/lib/utils";

const blueprintSchema = z.object({
  summary: z.string(),
  likelyAudience: z.string(),
  quickWins: z.array(z.string()).min(3).max(6),
  seoIssues: z.array(z.string()).min(3).max(6),
  conversionOpportunities: z.array(z.string()).min(3).max(6),
  buildRoadmap: z.array(z.string()).min(4).max(8),
  deliverables: z.array(z.string()).min(4).max(8),
  designVariations: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        positioning: z.string(),
        headline: z.string(),
        ctaLabel: z.string(),
        notes: z.string(),
        sectionOrder: z.array(z.string()).min(4).max(8),
      }),
    )
    .length(4),
});

function fallbackVariations(
  companyName: string,
  primaryAction: string,
  brandFeel: string,
  visualStyle: string,
): DesignVariation[] {
  return [
    {
      id: "corporate-trust",
      name: "Authority editorial",
      positioning: `High-trust presentation with a ${brandFeel.toLowerCase()} tone and proof before polish.`,
      headline: `${companyName}, reframed for trust and qualified demand`,
      ctaLabel: primaryAction,
      notes: "Use case studies, partner credibility, and a calmer editorial rhythm.",
      sectionOrder: [
        "Hero",
        "Trusted by / partners",
        "Core services",
        "Proof and outcomes",
        "Insights",
        "CTA footer",
      ],
    },
    {
      id: "modern-minimal",
      name: "Product minimal",
      positioning: `Sharper ${visualStyle.toLowerCase()} styling with editorial spacing and product-grade clarity.`,
      headline: `A cleaner, faster ${companyName} experience`,
      ctaLabel: primaryAction,
      notes: "Lean on typography, space, and a tighter product-grade interface.",
      sectionOrder: [
        "Hero",
        "Value proposition",
        "Service cards",
        "Selected articles",
        "FAQs",
        "Contact block",
      ],
    },
    {
      id: "bold-conversion",
      name: "Campaign momentum",
      positioning: "Campaign energy with stronger offer framing.",
      headline: `Turn ${companyName} into a conversion machine`,
      ctaLabel: primaryAction,
      notes: "Higher contrast, stronger CTA rhythm, and quick proof blocks.",
      sectionOrder: [
        "Hero",
        "Problem / solution split",
        "Offer stack",
        "Lead magnets",
        "Testimonials",
        "Contact CTA",
      ],
    },
    {
      id: "premium-editorial",
      name: "Premium narrative",
      positioning: "Thought-leadership forward, premium and insight-heavy.",
      headline: `${companyName} with more depth, clarity, and perceived value`,
      ctaLabel: primaryAction,
      notes: "Use richer storytelling and insight-led section rhythm.",
      sectionOrder: [
        "Hero",
        "Editorial intro",
        "Services narrative",
        "Partner credibility",
        "Thought leadership",
        "Contact",
      ],
    },
  ];
}

function getDiscoveryAnswer(intake: IntakeSelections, id: string) {
  return intake.discoveryAnswers.find((answer) => answer.id === id)?.answer.trim() || "";
}

function getPrimaryActionLabel(intake: IntakeSelections) {
  return (
    getDiscoveryAnswer(intake, "visitor_action") ||
    getDiscoveryAnswer(intake, "call_to_action") ||
    "Book a consultation"
  );
}

function buildFallbackBlueprint(
  intake: IntakeSelections,
  snapshot: SiteSnapshot,
): AutomationBlueprint {
  const businessGoal =
    getDiscoveryAnswer(intake, "business_goal") || intake.goals[0] || "more qualified demand";
  const idealClient =
    getDiscoveryAnswer(intake, "ideal_client") ||
    "buyers looking for a more trustworthy and commercially clear service brand";
  const currentProblem =
    getDiscoveryAnswer(intake, "current_problem") ||
    "the current site does not communicate the value clearly enough";
  const visitorAction = getPrimaryActionLabel(intake);
  const brandFeel = getDiscoveryAnswer(intake, "brand_feel") || intake.tone || "Clear and credible";
  const visualStyle =
    getDiscoveryAnswer(intake, "visual_style") || "Editorial, premium, and easy to scan";
  const aiInspiration = intake.aiInspiration || intake.personalizationNotes;

  return {
    summary:
      snapshot.fetchStatus === "ok"
        ? `${intake.companyName} already has visible market credibility, but the site can tell a tighter story around ${businessGoal.toLowerCase()}, remove friction caused by ${currentProblem.toLowerCase()}, and turn the current experience into a clearer lead-generation system.`
        : `${intake.companyName} needs a practical rebuild plan that can proceed even if the current site is partially unavailable during intake, with the strategy anchored in the discovery brief instead of a live crawl.`,
    likelyAudience: `${idealClient} who need a ${brandFeel.toLowerCase()} website experience and a clear next step.`,
    quickWins: [
      "Rewrite the hero to state the offer, audience, and commercial outcome in one sentence.",
      `Consolidate primary CTAs around "${visitorAction}".`,
      "Reduce heavy media and decorative scripts that slow the first impression.",
      "Move proof, partners, and case-study signals higher on the page.",
    ],
    seoIssues: [
      "Tighten title and description logic per page instead of relying on inherited defaults.",
      "Improve heading hierarchy so every page has a single job and clear topic signal.",
      "Expand internal linking between services, blog content, and conversion pages.",
      "Ship structured data for organization, service, article, and breadcrumbs.",
    ],
    conversionOpportunities: [
      `Offer one primary CTA built around "${visitorAction}" and one secondary proof CTA across templates.`,
      "Add richer intake forms with CRM-ready field mapping.",
      "Show capabilities and partner proof before the blog feed.",
      "Build dedicated landing pages for campaign traffic and high-intent services.",
    ],
    buildRoadmap: [
      "Capture the current site and normalize its information architecture.",
      "Create a multilingual content model separated from presentation.",
      `Rebuild the public pages in Next.js with ${visualStyle.toLowerCase()} styling and clearer CTAs.`,
      "Wire analytics, tag manager, and CRM-ready forms behind a consent-aware layer.",
      "Prepare a WordPress return-path map from the structured content.",
    ],
    deliverables: [
      "Local codebase ready for deployment",
      "Before vs after migration report",
      "SEO and schema baseline",
      "CRM-ready form configuration",
      "Marketing event map",
      "WordPress handoff notes",
      aiInspiration ? `Creative direction note: ${aiInspiration}` : "Creative direction note set from discovery answers",
    ],
    designVariations: fallbackVariations(
      intake.companyName,
      visitorAction,
      brandFeel,
      visualStyle,
    ),
  };
}

async function buildBlueprint(intake: IntakeSelections, snapshot: SiteSnapshot) {
  const fallback = buildFallbackBlueprint(intake, snapshot);
  const prompt = `
You are creating a practical website migration brief for a local website relaunch studio called ash-tra.com.

Return strict JSON matching this structure:
{
  "summary": string,
  "likelyAudience": string,
  "quickWins": string[],
  "seoIssues": string[],
  "conversionOpportunities": string[],
  "buildRoadmap": string[],
  "deliverables": string[],
  "designVariations": [
    {
      "id": string,
      "name": string,
      "positioning": string,
      "headline": string,
      "ctaLabel": string,
      "notes": string,
      "sectionOrder": string[]
    }
  ]
}

Company: ${intake.companyName}
Source URL: ${intake.sourceUrl}
Engagement type: ${intake.engagementType}
Consultation type: ${getConsultationTypeLabel(intake.consultationType)}
Project approach: ${intake.projectApproach}
Industry: ${intake.industry}
Tone: ${intake.tone}
Goals: ${intake.goals.join(", ")}
Marketing priorities: ${intake.marketingPriorities.join(", ")}
Desired integrations: ${intake.desiredIntegrations.join(", ")}
Locales: ${intake.locales.join(", ")}
Style direction picked by client: ${intake.styleDirection}
Hosting preference: ${intake.hostingPreference}
Domain status: ${intake.domainStatus}
Maintenance preference: ${intake.maintenancePreference}
Consultation focus: ${intake.consultationFocus}
AI inspiration: ${intake.aiInspiration}
Personalization notes: ${intake.personalizationNotes}
Discovery answers:
${intake.discoveryAnswers.map((answer) => `- ${answer.label}: ${answer.answer}`).join("\n")}
Reference examples:
${intake.referenceExamples.join(" | ")}

Observed source-site snapshot:
- Fetch status: ${snapshot.fetchStatus}
- Title: ${snapshot.title}
- Description: ${snapshot.description}
- Primary heading: ${snapshot.primaryHeading}
- Headings: ${snapshot.headingOutline.join(" | ")}
- Internal links: ${snapshot.internalLinks.join(" | ")}
- Image count: ${snapshot.imageCount}
- Word estimate: ${snapshot.wordEstimate}
- Discovered pages: ${snapshot.pageCount}
- Selected pages: ${snapshot.selectedPageUrls.join(" | ")}
- Tech signals: ${snapshot.techSignals.join(", ")}

The response should stay practical, sales-aware, and suitable for immediate fulfillment after checkout.
Treat the clicked options, the discovery answers, and the AI inspiration text as hard steering inputs.
They must directly influence the summary, CTA language, design variation headlines, notes, and roadmap.
`;

  return generateJsonFromOllama({
    prompt,
    schema: blueprintSchema,
    fallback,
  });
}

function parseSiteCaptureSelection(formData: FormData): SiteCaptureSelection {
  const mode = String(formData.get("siteCaptureMode") || "all");
  const pageLimit = Number.parseInt(String(formData.get("siteCapturePageLimit") || "24"), 10);

  return {
    mode:
      mode === "all" || mode === "custom" || mode === "primary_navigation"
        ? mode
        : "all",
    selectedUrls: formData.getAll("selectedPageUrls").map(String).filter(Boolean),
    pageLimit: Number.isFinite(pageLimit) ? Math.min(Math.max(pageLimit, 1), 60) : 24,
  };
}

function pushDiscoveryAnswer(
  answers: DiscoveryAnswer[],
  id: string,
  label: string,
  answer: FormDataEntryValue | null,
  group: string,
) {
  const value = String(answer || "").trim();
  if (!value) {
    return;
  }

  answers.push({
    id,
    label,
    answer: value,
    group,
  });
}

function parseDiscoveryAnswers(formData: FormData): DiscoveryAnswer[] {
  const answers: DiscoveryAnswer[] = [];

  pushDiscoveryAnswer(
    answers,
    "business_stage",
    "Business stage",
    formData.get("discoveryBusinessStage"),
    "Business",
  );
  pushDiscoveryAnswer(
    answers,
    "business_goal",
    "Main business goal",
    formData.get("discoveryBusinessGoal"),
    "Business",
  );
  pushDiscoveryAnswer(
    answers,
    "business_basics",
    "Business basics",
    formData.get("discoveryBusinessBasics"),
    "Business",
  );
  pushDiscoveryAnswer(
    answers,
    "current_problem",
    "What is not working",
    formData.get("discoveryCurrentProblem"),
    "Business",
  );
  pushDiscoveryAnswer(
    answers,
    "differentiator",
    "What makes the business different",
    formData.get("discoveryDifferentiator"),
    "Business",
  );
  pushDiscoveryAnswer(
    answers,
    "ideal_client",
    "Ideal client",
    formData.get("discoveryIdealClient"),
    "Audience",
  );
  pushDiscoveryAnswer(
    answers,
    "customer_objection",
    "Main customer objection",
    formData.get("discoveryCustomerObjection"),
    "Audience",
  );
  pushDiscoveryAnswer(
    answers,
    "brand_feel",
    "Brand feel",
    formData.get("discoveryBrandFeel"),
    "Brand",
  );
  pushDiscoveryAnswer(
    answers,
    "visual_style",
    "Visual style",
    formData.get("discoveryVisualStyle"),
    "Brand",
  );
  pushDiscoveryAnswer(
    answers,
    "decision_pace",
    "Review and approval pace",
    formData.get("discoveryDecisionPace"),
    "Process",
  );
  pushDiscoveryAnswer(
    answers,
    "must_have_pages",
    "Must-have pages or features",
    formData.get("discoveryMustHavePages"),
    "Website",
  );
  pushDiscoveryAnswer(
    answers,
    "visitor_action",
    "Primary visitor action",
    formData.get("discoveryVisitorAction"),
    "Website",
  );
  pushDiscoveryAnswer(
    answers,
    "integrations_and_ops",
    "Operational integrations or workflows",
    formData.get("discoveryIntegrations"),
    "Technical",
  );
  pushDiscoveryAnswer(
    answers,
    "seo_priority",
    "SEO or content priority",
    formData.get("discoverySeoPriority"),
    "SEO",
  );
  pushDiscoveryAnswer(
    answers,
    "success_metric",
    "Success metric",
    formData.get("discoverySuccessMetric"),
    "Analytics",
  );
  pushDiscoveryAnswer(
    answers,
    "decision_makers",
    "Decision-makers and approvals",
    formData.get("discoveryDecisionMakers"),
    "Project",
  );
  pushDiscoveryAnswer(
    answers,
    "launch_constraints",
    "Launch dates, risks, or constraints",
    formData.get("discoveryLaunchConstraints"),
    "Project",
  );

  return answers;
}

function parseReferenceExamples(formData: FormData) {
  return String(formData.get("referenceExamples") || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function buildBlankSnapshot(sourceUrl: string): SiteSnapshot {
  return {
    url: sourceUrl,
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
    error: sourceUrl ? "The source site could not be analyzed." : "No source URL provided.",
  };
}

function mergeCommunicationReceipts(
  current: CommunicationReceipt[],
  next: CommunicationReceipt[],
) {
  return [...next, ...current].slice(0, 24);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function ensureFallbackOriginalPackage(project: ProjectRecord) {
  if (project.siteSnapshot.capturedPages.length) {
    return;
  }

  const projectDir = getProjectDirectory(project.id);
  const originalDir = path.join(projectDir, "original");
  const headline =
    project.blueprint.designVariations.find(
      (variation) => variation.id === project.intake.styleDirection,
    )?.headline || project.blueprint.summary;
  const highlights = project.blueprint.quickWins.slice(0, 4);
  const detailCards = [
    ["Business", project.intake.industry],
    ["Primary goal", project.intake.goals[0] || "Clarify the offer"],
    ["Tone", project.intake.tone],
    ["Consultation", getConsultationTypeLabel(project.intake.consultationType)],
  ].filter(([, value]) => Boolean(value));
  const originalHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(project.intake.companyName)} brief preview</title>
    <meta
      name="description"
      content="${escapeHtml(project.blueprint.summary.slice(0, 160))}"
    />
    <style>
      :root {
        color-scheme: light;
        --bg: #f5efe8;
        --surface: rgba(255,255,255,0.92);
        --text: #16202b;
        --muted: #5f6975;
        --accent: #f26a3b;
        --line: rgba(22,32,43,0.12);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Sora", ui-sans-serif, system-ui, sans-serif;
        background: radial-gradient(circle at top, rgba(242,106,59,0.12), transparent 34%), var(--bg);
        color: var(--text);
      }
      main {
        width: min(1100px, calc(100% - 32px));
        margin: 0 auto;
        padding: 56px 0 72px;
      }
      .card {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 28px;
        padding: 28px;
        box-shadow: 0 20px 60px rgba(22,32,43,0.08);
      }
      .eyebrow {
        display: inline-block;
        padding: 10px 14px;
        border-radius: 999px;
        background: rgba(242,106,59,0.12);
        color: #b44d28;
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
      h1 { font-size: clamp(2.4rem, 4vw, 4.6rem); line-height: 0.95; margin: 18px 0; }
      p { line-height: 1.65; color: var(--muted); }
      ul { padding-left: 18px; color: var(--muted); }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-top: 20px;
      }
      .panel {
        border: 1px solid var(--line);
        border-radius: 22px;
        padding: 18px;
        background: rgba(255,255,255,0.78);
      }
      .panel strong {
        display: block;
        margin-bottom: 8px;
        color: var(--text);
      }
    </style>
  </head>
  <body>
    <main>
      <section class="card">
        <span class="eyebrow">Fallback brief preview</span>
        <h1>${escapeHtml(headline)}</h1>
        <p>${escapeHtml(project.blueprint.summary)}</p>
        <p>
          The original site could not be captured during intake, so this preview package was generated
          from the written discovery brief and strategy blueprint instead.
        </p>
      </section>

      <section class="grid">
        ${detailCards
          .map(
            ([label, value]) =>
              `<article class="panel"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(
                value,
              )}</span></article>`,
          )
          .join("")}
      </section>

      <section class="card" style="margin-top: 20px;">
        <strong>Quick wins</strong>
        <ul>${highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
    </main>
  </body>
</html>`;

  await mkdir(originalDir, { recursive: true });
  await writeFile(path.join(originalDir, "index.html"), originalHtml);
  project.siteSnapshot.capturedPages = [
    {
      url: project.intake.sourceUrl || `${project.id}-fallback`,
      path: "/",
      title: `${project.intake.companyName} brief preview`,
      storedPath: "index.html",
      optimizedPath: "index.html",
      sourceTags: ["homepage"],
      assetCount: 0,
      fetchStatus: "ok",
    },
  ];
  project.siteSnapshot.selectedPageUrls = [project.intake.sourceUrl || `${project.id}-fallback`];
}

function buildOwnerNotificationFromReceipts(receipts: CommunicationReceipt[]) {
  const ownerReceipt = receipts.find((entry) => entry.audience === "owner");
  if (!ownerReceipt) {
    return {
      status: "not_sent" as const,
      channel: "log" as const,
      subject: "",
      preview: "",
    };
  }

  return {
    status: ownerReceipt.channel === "smtp" ? ("emailed" as const) : ("logged" as const),
    channel: ownerReceipt.channel,
    sentAt: ownerReceipt.sentAt,
    subject: ownerReceipt.subject,
    preview: ownerReceipt.preview,
  };
}

async function syncProjectWithCurrentPricing(project: ProjectRecord) {
  const synced = syncProjectPricing(project);
  if (synced.changed) {
    await saveProject(synced.project);
  }

  return synced.project;
}

async function syncProjectsWithCurrentPricing(projects: ProjectRecord[]) {
  const nextProjects: ProjectRecord[] = [];

  for (const project of projects) {
    nextProjects.push(await syncProjectWithCurrentPricing(project));
  }

  return nextProjects;
}

async function createProjectRecord(
  user: UserRecord,
  intake: IntakeSelections,
  forcedId?: string,
): Promise<ProjectRecord> {
  const now = new Date().toISOString();
  const id =
    forcedId || `${slugify(intake.companyName) || "project"}-${randomUUID().slice(0, 8)}`;
  const siteSnapshot = intake.sourceUrl
    ? await captureSiteSnapshot(intake.sourceUrl, intake.siteCapture)
    : buildBlankSnapshot("");
  const capturedPages = intake.sourceUrl
    && siteSnapshot.fetchStatus === "ok"
    ? await downloadSiteAssets(intake.sourceUrl, id, intake.siteCapture, siteSnapshot)
    : [];
  siteSnapshot.capturedPages = capturedPages;
  siteSnapshot.assetCount = capturedPages.reduce((sum, page) => sum + page.assetCount, 0);
  if (!siteSnapshot.selectedPageUrls.length && capturedPages.length) {
    siteSnapshot.selectedPageUrls = capturedPages.map((page) => page.url);
  }
  const quote = buildProjectQuote(intake, siteSnapshot);
  const blueprint = await buildBlueprint(intake, siteSnapshot);
  const mediaSuggestions = await buildProjectMediaSuggestions(intake);

  const project: ProjectRecord = {
    id,
    userId: user.id,
    createdAt: now,
    updatedAt: now,
    status: "quoted",
    intake,
    siteSnapshot,
    quote,
    payment: {
      mode: "manual",
      status: "unpaid",
      amount: quote.deposit,
      currency: quote.currency,
      invoiceReference: `ASH-${id.slice(0, 8).toUpperCase()}`,
      checkoutUrl: null,
    },
    blueprint,
    ownerNotification: {
      status: "not_sent",
      channel: "log",
      subject: "",
      preview: "",
    },
    automation: {
      status: "analyzed",
      generatedAt: now,
      model: process.env.OLLAMA_MODEL || "qwen2.5:7b",
    },
    preview: {
      status: "ready",
      updatedAt: now,
      feedbackEntries: [],
    },
    communications: [],
    mediaSuggestions,
  };

  await saveProject(project);

  try {
    const orderReceipts = await sendProjectEventNotifications(project, "order_confirmation");
    if (orderReceipts.length) {
      project.communications = mergeCommunicationReceipts(project.communications, orderReceipts);
      await saveProject(project);
    }
  } catch (error) {
    console.log("Error logging order confirmation:", error);
  }

  await ensureFallbackOriginalPackage(project);

  if (project.siteSnapshot.capturedPages.length > 0) {
    try {
      await regenerateProjectOutputs(project);
      await saveProject(project);
    } catch (error) {
      console.log("Error generating optimized outputs:", error);
    }
  }

  return project;
}

export async function createProjectFromForm(user: UserRecord, formData: FormData) {
  const sourceUrl = normalizeSourceUrl(String(formData.get("sourceUrl") || ""));
  const companyName = String(formData.get("companyName") || "").trim();
  const projectApproach = String(formData.get("projectApproach") || "optimize_current_site");

  if (!companyName) {
    throw new Error("Company name is required.");
  }

  if (!sourceUrl && projectApproach !== "new_site") {
    throw new Error("An existing website URL is required unless this is a net-new site direction.");
  }

  const projectId = `${slugify(companyName) || "project"}-${randomUUID().slice(0, 8)}`;
  const files = formData
    .getAll("referenceFiles")
    .filter((item): item is File => item instanceof File && item.size > 0);

  const uploadedFiles = await Promise.all(
    files.map((file) => saveUpload(projectId, file)),
  );

  const intake: IntakeSelections = {
    companyName,
    sourceUrl,
    engagementType: String(formData.get("engagementType") || "full_optimization") as
      | "full_optimization"
      | "guided_consultation"
      | "new_site_direction",
    consultationType: String(
      formData.get("consultationType") || "discovery_consultation",
    ) as IntakeSelections["consultationType"],
    projectApproach:
      projectApproach === "new_site" || projectApproach === "hybrid_refresh"
        ? projectApproach
        : "optimize_current_site",
    industry: String(formData.get("industry") || "").trim(),
    tone: String(formData.get("tone") || "").trim(),
    timeline: String(formData.get("timeline") || "").trim(),
    budgetRange: String(formData.get("budgetRange") || "").trim(),
    locales: formData.getAll("locales").map(String),
    goals: formData.getAll("goals").map(String),
    marketingPriorities: formData.getAll("marketingPriorities").map(String),
    desiredIntegrations: formData.getAll("desiredIntegrations").map(String),
    styleDirection: String(formData.get("styleDirection") || "corporate-trust"),
    siteCapture: parseSiteCaptureSelection(formData),
    discoveryAnswers: parseDiscoveryAnswers(formData),
    referenceExamples: parseReferenceExamples(formData),
    consultationFocus: String(formData.get("consultationFocus") || "").trim(),
    hostingPreference: String(formData.get("hostingPreference") || "").trim(),
    domainStatus: String(formData.get("domainStatus") || "").trim(),
    maintenancePreference: String(formData.get("maintenancePreference") || "").trim(),
    aiInspiration: String(formData.get("aiInspiration") || "").trim(),
    personalizationNotes: String(formData.get("personalizationNotes") || "").trim(),
    uploadedFiles,
  };

  return createProjectRecord(user, intake, projectId);
}

export async function getProjectsForViewer(user: UserRecord) {
  const projects = user.role === "admin" ? await listProjects() : await listProjectsForUser(user.id);
  return syncProjectsWithCurrentPricing(projects);
}

export async function getProjectForViewer(projectId: string, user: UserRecord) {
  const project = await findProjectById(projectId);
  if (!project) {
    throw new Error("Project not found.");
  }

  if (user.role !== "admin" && project.userId !== user.id) {
    throw new Error("You do not have access to that project.");
  }

  return syncProjectWithCurrentPricing(project);
}

export async function startCheckout(projectId: string, user: UserRecord) {
  const project = await getProjectForViewer(projectId, user);
  const checkoutUrl = await createStripeCheckoutSession(project);

  project.updatedAt = new Date().toISOString();
  project.status = "payment_pending";
  project.payment.status = "pending";

  if (checkoutUrl) {
    project.payment.mode = "stripe";
    project.payment.checkoutUrl = checkoutUrl;
  } else {
    project.payment.mode = "manual";
    project.payment.checkoutUrl = null;
  }

  await saveProject(project);
  return project;
}

export async function markProjectPaid(projectId: string, user: UserRecord) {
  const project = await getProjectForViewer(projectId, user);
  return markProjectPaidById(project.id);
}

export async function markProjectPaidById(projectId: string) {
  const project = await findProjectById(projectId);
  if (!project) {
    throw new Error("Project not found.");
  }

  if (project.payment.status === "paid") {
    return project;
  }

  const now = new Date().toISOString();
  project.updatedAt = now;
  project.status = "build_ready";
  project.payment.status = "paid";
  project.payment.paidAt = now;
  project.automation.status = "build_ready";
  project.automation.generatedAt = now;

  const paymentReceipts = await sendProjectEventNotifications(project, "payment_confirmation");
  project.communications = mergeCommunicationReceipts(project.communications, paymentReceipts);
  project.ownerNotification = buildOwnerNotificationFromReceipts(paymentReceipts);

  if (project.intake.engagementType === "guided_consultation") {
    const consultationReceipts = await sendProjectEventNotifications(
      project,
      "consultation_confirmation",
    );
    project.communications = mergeCommunicationReceipts(
      project.communications,
      consultationReceipts,
    );
  }

  await saveProject(project);
  return project;
}

export async function saveProjectPreviewFeedback(
  projectId: string,
  user: UserRecord,
  input: {
    requestedChanges: string;
    selectedDirection: string;
    summary: string;
  },
) {
  const project = await getProjectForViewer(projectId, user);
  const now = new Date().toISOString();
  const requestedChanges = input.requestedChanges.trim();
  const summary = input.summary.trim();
  const selectedDirection = input.selectedDirection.trim() || project.intake.styleDirection;

  if (!requestedChanges && !summary && selectedDirection === project.intake.styleDirection) {
    throw new Error("Add some preview feedback or choose a different direction.");
  }

  project.updatedAt = now;
  project.intake.styleDirection = selectedDirection;
  project.preview = {
    ...project.preview,
    status: "changes_requested",
    updatedAt: now,
    approvedAt: undefined,
    feedbackEntries: [
      {
        id: randomUUID(),
        createdAt: now,
        summary: summary || "Client requested preview updates.",
        requestedChanges,
        selectedDirection,
        approved: false,
      },
      ...(project.preview?.feedbackEntries || []),
    ],
  };

  await saveProject(project);

  if ((project.siteSnapshot.capturedPages?.length || 0) > 0) {
    await regenerateProjectOutputs(project);
  }

  return project;
}

export async function approveProjectPreview(projectId: string, user: UserRecord) {
  const project = await getProjectForViewer(projectId, user);
  const now = new Date().toISOString();

  project.updatedAt = now;
  project.preview = {
    ...project.preview,
    status: "approved",
    updatedAt: now,
    approvedAt: now,
    feedbackEntries: [
      {
        id: randomUUID(),
        createdAt: now,
        summary: "Client approved the preview.",
        requestedChanges: "",
        selectedDirection: project.intake.styleDirection,
        approved: true,
      },
      ...(project.preview?.feedbackEntries || []),
    ],
  };

  await saveProject(project);
  return project;
}
