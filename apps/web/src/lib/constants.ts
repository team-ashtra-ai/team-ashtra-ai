export const goalOptions = [
  "Full rebuild",
  "SEO recovery",
  "Speed upgrade",
  "Lead generation",
  "Blog migration",
  "Multilingual relaunch",
  "Premium repositioning",
];

export const marketingPriorityOptions = [
  "HubSpot CRM",
  "GA4 analytics",
  "Google Tag Manager",
  "Google Ads conversion tracking",
  "Schema markup",
  "Accessibility cleanup",
  "High-converting forms",
  "Email capture flows",
  "Case-study credibility blocks",
];

export const integrationOptions = [
  "HubSpot",
  "Formspree",
  "Google Analytics 4",
  "Google Tag Manager",
  "Google Ads",
  "Meta Pixel",
  "LinkedIn Insight Tag",
];

export const localeOptions = ["English", "Spanish", "French", "Portuguese"];

export const timelineOptions = [
  "ASAP",
  "2-4 weeks",
  "1-2 months",
  "Quarterly refresh",
];

export const engagementTypeOptions = [
  {
    id: "full_optimization",
    label: "Ready to optimize",
    summary:
      "For clients who already know what they want and want the crawl, preview, and optimization workflow immediately.",
  },
  {
    id: "guided_consultation",
    label: "Guided consultation",
    summary:
      "For clients who want discovery help first, a paid consultation, and a Calendly booking after payment.",
  },
  {
    id: "new_site_direction",
    label: "New site direction",
    summary:
      "For clients who want a stronger new-site concept or partial reset before committing to the final build path.",
  },
] as const;

export const projectApproachOptions = [
  {
    id: "optimize_current_site",
    label: "Optimize current site",
    summary: "Capture and improve the live website the business already relies on.",
  },
  {
    id: "hybrid_refresh",
    label: "Hybrid refresh",
    summary: "Keep the useful structure, but reshape the pages, proof, and conversions more aggressively.",
  },
  {
    id: "new_site",
    label: "Start a new site",
    summary: "Use the consultation answers to generate a new direction even if the current site is weak or missing.",
  },
] as const;

export const siteCaptureModeOptions = [
  {
    id: "primary_navigation",
    label: "Header, footer, homepage",
    summary:
      "Best for quick scoping: homepage plus the main navigation and footer-linked pages.",
  },
  {
    id: "all",
    label: "All discovered pages",
    summary: "Capture every internal page the crawler can discover within the selected page limit.",
  },
  {
    id: "custom",
    label: "Choose pages manually",
    summary: "Let the client tick the exact pages they want included in the optimization package.",
  },
] as const;

export const hostingPreferenceOptions = [
  "Keep the current hosting",
  "Move to a simpler managed host",
  "Need recommendations",
  "Want ash-tra to handle hosting setup",
];

export const domainStatusOptions = [
  "Have an active domain",
  "Need help connecting the domain",
  "Want to buy a new domain",
  "Not sure yet",
];

export const maintenancePreferenceOptions = [
  "One-time project only",
  "Need ongoing edits and support",
  "Need maintenance and monitoring",
  "Want a monthly growth retainer",
];

export const styleDirectionOptions = [
  {
    id: "corporate-trust",
    label: "Authority editorial",
    summary:
      "High-trust structure, calm authority, and stronger proof framing for serious service brands.",
  },
  {
    id: "modern-minimal",
    label: "Product minimal",
    summary:
      "Cleaner surfaces, sharper spacing, and a restrained product-grade interface.",
  },
  {
    id: "bold-conversion",
    label: "Campaign momentum",
    summary:
      "Higher contrast, clearer offers, and harder-working CTA framing for demand capture.",
  },
  {
    id: "premium-editorial",
    label: "Premium narrative",
    summary:
      "More storytelling, richer hierarchy, and a higher-value editorial presentation.",
  },
];
