window.AshtraConfig = {
  siteUrl: "https://ash-tra.com",
  contactFormEndpoint: "https://formspree.io/f/mbdqovoj",
  consultationFormEndpoint: "https://formspree.io/f/xaqaogoo",
  discoveryFormEndpoint: "https://formspree.io/f/xaqaogoo",
  whatsappUrl: "https://api.whatsapp.com/send/?phone=5543991324028",
  googleAnalyticsId: "G-SQTQKJBKFK",
  gtmId: "",
  orbot: {
    enabled: true,
    excludePages: ["404"],
    primaryCtaPriority: "start-project",
    languageMode: "en_with_pt_fallback",
    maxQueryLength: 280,
    shortcutKey: "/",
    orbit: {
      enabled: false,
      pulseDurationMs: 3600,
      idleDelayMs: 18000,
      idleRepeatMs: 32000,
      heroThreshold: 0.08
    }
  }
};
