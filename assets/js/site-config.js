// ==========================================================================
// Site Configuration
// Edit these values when external services change. The main runtime in
// site.js reads this object and falls back to safe defaults when keys are blank.
// ==========================================================================
window.AshtraConfig = {
  // CORE ANALYTICS: Google Analytics 4 and Google Tag Manager.
  googleAnalyticsMeasurementId: "G-SQTQKJBKFK",
  googleTagManagerId: "GTM-PW59J3J5",
  googleTagId: "GT-WFFL7CQS",

  // GOOGLE TAG GATEWAY: Cloudflare first-party tag route for Google scripts.
  googleTagGateway: {
    enabled: true,
    measurementPath: "/metrics",
    tagId: "GT-WFFL7CQS"
  },

  // AD / RETARGETING PIXELS: Add IDs here when each account is ready.
  metaPixelId: "",
  linkedinPartnerId: "",
  googleAdsId: "",

  // USER BEHAVIOUR TOOLS: Add IDs here when each account is ready.
  clarityProjectId: "",
  hotjarSiteId: "",

  // CRM / HUBSPOT: Add the portal ID to load HubSpot and optionally a webhook.
  hubspotPortalId: "",
  hubspotEventWebhook: "",

  // FORMS: Formspree endpoints used by contact, consultation/payment, and discovery forms.
  contactFormEndpoint: "https://formspree.io/f/mbdqovoj",
  consultationFormEndpoint: "https://formspree.io/f/xaqaogoo",
  discoveryFormEndpoint: "https://formspree.io/f/mqewqvqb",
  discoveryFormFallbackEndpoint: "https://formspree.io/f/xaqaogoo",

  // CONTACT LINKS: Floating WhatsApp action. site.js appends a default message if one is missing.
  whatsappUrl: "https://api.whatsapp.com/send/?phone=5543991324028",

  // TRACKING CONTROLS: Non-essential tools only load after consent is granted.
  tracking: {
    enabled: true,
    requireConsent: true,
    trackScrollDepth: true,
    trackOutboundLinks: true,
    trackFormFocus: true,
    trackVideoEngagement: true
  },

  // ORBOT: Floating site-routing assistant.
  orbot: {
    enabled: true,
    excludePages: ["404"],
    primaryCtaPriority: "launch",
    maxQueryLength: 280,
    shortcutKey: "/"
  }
};
