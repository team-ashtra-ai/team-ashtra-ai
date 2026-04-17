import type {
  ConsultationType,
  IntakeSelections,
  PriceQuote,
  ProjectRecord,
  QuoteLineItem,
  SiteSnapshot,
} from "@/lib/types";

export interface PricingMaster {
  currency: string;
  baseOptimizeCurrentSite: number;
  baseHybridRefresh: number;
  baseNewSite: number;
  sourceAnalysis: number;
  additionalPage: number;
  discoveryConsultation: number;
  followUpConsultation: number;
  maintenanceConsultation: number;
  newSiteDirection: number;
  multilingualLocale: number;
  crmIntegration: number;
  trackingImplementation: number;
  adsConversionSupport: number;
  referenceAssetReview: number;
  monthlyGrowthRetainerPlanning: number;
}

export const pricingMaster: PricingMaster = {
  currency: process.env.STRIPE_CURRENCY || "EUR",
  baseOptimizeCurrentSite: 2400,
  baseHybridRefresh: 2600,
  baseNewSite: 2800,
  sourceAnalysis: 450,
  additionalPage: 90,
  discoveryConsultation: 350,
  followUpConsultation: 250,
  maintenanceConsultation: 220,
  newSiteDirection: 420,
  multilingualLocale: 300,
  crmIntegration: 450,
  trackingImplementation: 280,
  adsConversionSupport: 220,
  referenceAssetReview: 120,
  monthlyGrowthRetainerPlanning: 180,
};

export function getConsultationTypeLabel(type: ConsultationType) {
  if (type === "follow_up_consultation") {
    return "Follow-up consultation";
  }

  if (type === "maintenance_consultation") {
    return "Maintenance consultation";
  }

  return "Discovery consultation";
}

export function buildProjectQuote(
  intake: IntakeSelections,
  snapshot: SiteSnapshot,
  master: PricingMaster = pricingMaster,
): PriceQuote {
  const selectedPageCount = snapshot.selectedPageUrls.length || 1;
  const lineItems: QuoteLineItem[] = [
    {
      label: getBaseBuildLabel(intake.projectApproach),
      amount: getBaseBuildAmount(intake.projectApproach, master),
      detail: getBaseBuildDetail(intake.projectApproach),
    },
    {
      label: "Source analysis and migration planning",
      amount: master.sourceAnalysis,
      detail:
        snapshot.fetchStatus === "ok"
          ? "Audit, content extraction, page discovery, and architecture mapping."
          : "Intake-first strategy and fallback analysis because the source site needs manual review.",
    },
  ];

  if (selectedPageCount > 1) {
    lineItems.push({
      label: "Multi-page capture and optimization scope",
      amount: Math.max(master.additionalPage * 2, (selectedPageCount - 1) * master.additionalPage),
      detail: `${selectedPageCount} selected pages will be packaged, previewed, and optimized together.`,
    });
  }

  if (intake.engagementType === "guided_consultation") {
    lineItems.push({
      label: getConsultationTypeLabel(intake.consultationType),
      amount: getConsultationTypeAmount(intake.consultationType, master),
      detail:
        intake.consultationType === "maintenance_consultation"
          ? "Keeps the project aligned with ongoing support, changes, and optimization priorities."
          : intake.consultationType === "follow_up_consultation"
            ? "Focused review session to refine direction, feedback, and rollout decisions."
            : "Includes a guided discovery call, live preference review, and post-payment booking access.",
    });
  }

  if (intake.engagementType === "new_site_direction") {
    lineItems.push({
      label: "Concept-first website direction",
      amount: master.newSiteDirection,
      detail: "Strategy support for clients who want a stronger new-site concept before locking the build direction.",
    });
  }

  if (intake.locales.length > 1) {
    lineItems.push({
      label: "Multilingual support",
      amount: master.multilingualLocale * (intake.locales.length - 1),
      detail: `Additional locale handling for ${intake.locales.slice(1).join(", ")}.`,
    });
  }

  if (
    intake.marketingPriorities.includes("HubSpot CRM") ||
    intake.desiredIntegrations.includes("HubSpot")
  ) {
    lineItems.push({
      label: "CRM integration",
      amount: master.crmIntegration,
      detail: "HubSpot-ready forms, lead fields, and service handoff structure.",
    });
  }

  if (
    intake.marketingPriorities.includes("GA4 analytics") ||
    intake.marketingPriorities.includes("Google Tag Manager") ||
    intake.desiredIntegrations.includes("Google Analytics 4") ||
    intake.desiredIntegrations.includes("Google Tag Manager")
  ) {
    lineItems.push({
      label: "Tracking implementation",
      amount: master.trackingImplementation,
      detail: "GA4, GTM, and event planning for core conversion paths.",
    });
  }

  if (
    intake.marketingPriorities.includes("Google Ads conversion tracking") ||
    intake.desiredIntegrations.includes("Google Ads")
  ) {
    lineItems.push({
      label: "Ads conversion support",
      amount: master.adsConversionSupport,
      detail: "Campaign-friendly goal events and paid landing page support.",
    });
  }

  if (intake.uploadedFiles.length > 0) {
    lineItems.push({
      label: "Reference asset review",
      amount: master.referenceAssetReview,
      detail: "Review of uploaded documents, screenshots, brand assets, or creative references.",
    });
  }

  if (intake.maintenancePreference === "Want a monthly growth retainer") {
    lineItems.push({
      label: "Growth retainer planning",
      amount: master.monthlyGrowthRetainerPlanning,
      detail: "Prepares the project for ongoing monthly optimization, reporting, and support.",
    });
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);

  return {
    currency: master.currency,
    subtotal,
    deposit:
      intake.engagementType === "guided_consultation"
        ? Math.round(Math.min(subtotal, 900))
        : Math.round(subtotal * 0.5),
    lineItems,
    note:
      intake.engagementType === "guided_consultation"
        ? `${getConsultationTypeLabel(intake.consultationType)} payment unlocks the captured brief, the working preview, and the booking link.`
        : "The deposit starts the build and triggers the confirmation and fulfillment email with all captured requirements.",
  };
}

export function syncProjectPricing(
  project: ProjectRecord,
  master: PricingMaster = pricingMaster,
) {
  if (project.payment.status === "paid") {
    return { changed: false, project };
  }

  const quote = buildProjectQuote(project.intake, project.siteSnapshot, master);
  const changed =
    JSON.stringify(project.quote) !== JSON.stringify(quote) ||
    project.payment.amount !== quote.deposit ||
    project.payment.currency !== quote.currency;

  if (!changed) {
    return { changed: false, project };
  }

  const nextProject: ProjectRecord = {
    ...project,
    updatedAt: new Date().toISOString(),
    quote,
    status: project.status === "payment_pending" ? "quoted" : project.status,
    payment: {
      ...project.payment,
      amount: quote.deposit,
      currency: quote.currency,
      checkoutUrl: null,
      mode: "manual",
      status: project.payment.status === "pending" ? "unpaid" : project.payment.status,
    },
  };

  return {
    changed: true,
    project: nextProject,
  };
}

function getBaseBuildAmount(
  projectApproach: IntakeSelections["projectApproach"],
  master: PricingMaster,
) {
  if (projectApproach === "new_site") {
    return master.baseNewSite;
  }

  if (projectApproach === "hybrid_refresh") {
    return master.baseHybridRefresh;
  }

  return master.baseOptimizeCurrentSite;
}

function getBaseBuildLabel(projectApproach: IntakeSelections["projectApproach"]) {
  if (projectApproach === "new_site") {
    return "New site direction and build system";
  }

  if (projectApproach === "hybrid_refresh") {
    return "Hybrid refresh and restructuring system";
  }

  return "Base rebuild system";
}

function getBaseBuildDetail(projectApproach: IntakeSelections["projectApproach"]) {
  if (projectApproach === "new_site") {
    return "New narrative direction, sitemap, design system, and page build foundation.";
  }

  if (projectApproach === "hybrid_refresh") {
    return "Keeps the useful structure while reshaping page hierarchy, proof, and conversion paths.";
  }

  return "App structure, design system, and page rebuild foundation.";
}

function getConsultationTypeAmount(
  consultationType: ConsultationType,
  master: PricingMaster,
) {
  if (consultationType === "follow_up_consultation") {
    return master.followUpConsultation;
  }

  if (consultationType === "maintenance_consultation") {
    return master.maintenanceConsultation;
  }

  return master.discoveryConsultation;
}
