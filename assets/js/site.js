(function () {
  // ==========================================================================
  // JS Section: Runtime Configuration And Brand Constants
  // Reads optional values from site-config.js, defines the active page, and
  // centralizes brand assets, form endpoints, and assistant defaults.
  // ==========================================================================
  const config = window.AshtraConfig || {};
  const page = document.body.dataset.page || "home";
  const pageRuntimePrefix = page === "home" || page === "404" ? "./" : "../";
  const isLocalPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const contactFormEndpoint = config.contactFormEndpoint || "https://formspree.io/f/mbdqovoj";
  const consultationFormEndpoint = config.consultationFormEndpoint || "https://formspree.io/f/xaqaogoo";
  const discoveryFormEndpoint = config.discoveryFormEndpoint || "https://formspree.io/f/mqewqvqb";
  const discoveryFormFallbackEndpoint =
    config.discoveryFormFallbackEndpoint || consultationFormEndpoint || "";
  const trackingConfig = resolveTrackingConfig(config.tracking);
  const trackingIds = {
    googleAnalyticsMeasurementId: readConfigString(config.googleAnalyticsMeasurementId),
    googleTagManagerId: readConfigString(config.googleTagManagerId),
    googleTagId: readConfigString(config.googleTagId),
    googleAdsId: readConfigString(config.googleAdsId),
    metaPixelId: readConfigString(config.metaPixelId),
    linkedinPartnerId: readConfigString(config.linkedinPartnerId),
    clarityProjectId: readConfigString(config.clarityProjectId),
    hotjarSiteId: readConfigString(config.hotjarSiteId),
    hubspotPortalId: readConfigString(config.hubspotPortalId),
    hubspotEventWebhook: readConfigString(config.hubspotEventWebhook)
  };
  const googleTagGatewayConfig = resolveGoogleTagGatewayConfig(config.googleTagGateway);
  const orbotConfig = resolveOrbotConfig(config.orbot);
  const trackingConsentKey = "ashtra_tracking_consent_v1";
  const trackingConsentCategories = ["analytics", "marketing", "behavior"];
  const hubspotKeyEvents = new Set([
    "page_view",
    "contact_form_started",
    "contact_form_submitted",
    "contact_form_error",
    "discovery_brief_step",
    "orbot_cta_click",
    "orbot_query",
    "payment_option_click",
    "schedule_click",
    "whatsapp_click"
  ]);
  const metaStandardEvents = {
    contact_form_submitted: "Lead",
    page_view: "PageView",
    payment_option_click: "InitiateCheckout",
    schedule_click: "Schedule",
    whatsapp_click: "Contact"
  };
  const passiveConsentScrollThreshold = 3;
  let trackingConsent = null;
  let passiveConsentScrollCount = 0;
  let passiveConsentLastScrollY = 0;
  const brandAppName = "ASH-TRA";
  const brandChromeColor = "#090d16";
  const brandAssetBase = runtimeUrl("/assets/brand");
  const brandAssetOrigin = "https://ash-tra.com/assets/brand";
  const socialImageByPage = {
    "404": "ash-tra-404-page-not-found-social-preview.png",
    "about": "ash-tra-about-story-standards-signal-social-preview.png",
    "accessibility": "ash-tra-accessibility-statement-usable-website-social-preview.png",
    "contact": "ash-tra-contact-project-enquiry-social-preview.png",
    "cookies": "ash-tra-cookie-policy-consent-analytics-social-preview.png",
    "discovery": "ash-tra-discovery-consultation-price-range-social-preview.png",
    "examples": "ash-tra-portfolio-website-work-examples-social-preview.png",
    "faq": "ash-tra-faq-services-seo-support-social-preview.png",
    "home": "ash-tra-home-modern-websites-social-preview.png",
    "invest": "ash-tra-investment-foundation-growth-partnership-social-preview.png",
    "launch": "ash-tra-launch-project-intake-social-preview.png",
    "payments": "ash-tra-payments-consultation-stripe-paypal-pix-social-preview.png",
    "privacy": "ash-tra-privacy-policy-data-usage-social-preview.png",
    "process": "ash-tra-process-discovery-build-support-social-preview.png",
    "schedule": "ash-tra-schedule-consultation-booking-social-preview.png",
    "services": "ash-tra-services-strategy-rebuild-seo-social-preview.png",
    "terms": "ash-tra-terms-service-commercial-scope-social-preview.png"
  };
  // Shared shell pieces now live as handwritten HTML partials so the header and
  // footer can be edited without digging through JavaScript template strings.
  const partialPaths = {
    "site-header": runtimeUrl("/partials/site-header/index.html"),
    "site-footer": runtimeUrl("/partials/site-footer/index.html")
  };
  const partialMarkupCache = new Map();

  // ==========================================================================
  // JS Section: URL, Config, And Small Utility Helpers
  // Keeps root-relative links working from nested static pages, sanitizes copy
  // before injecting strings, and normalizes configurable assistant values.
  // ==========================================================================
  function runtimeUrl(input) {
    const value = String(input || "");
    if (!value) return value;
    if (value.startsWith("//") || value.startsWith("#")) return value;
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
    if (!value.startsWith("/")) return value;
    return value === "/" ? pageRuntimePrefix : `${pageRuntimePrefix}${value.slice(1)}`;
  }

  function readConfigString(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function readConfigBoolean(value, fallback) {
    return typeof value === "boolean" ? value : fallback;
  }

  function resolveTrackingConfig(value) {
    const source = value && typeof value === "object" ? value : {};

    return {
      enabled: readConfigBoolean(source.enabled, true),
      requireConsent: readConfigBoolean(source.requireConsent, true),
      trackScrollDepth: readConfigBoolean(source.trackScrollDepth, true),
      trackOutboundLinks: readConfigBoolean(source.trackOutboundLinks, true),
      trackFormFocus: readConfigBoolean(source.trackFormFocus, true),
      trackVideoEngagement: readConfigBoolean(source.trackVideoEngagement, true)
    };
  }

  function resolveGoogleTagGatewayConfig(value) {
    const source = value && typeof value === "object" ? value : {};
    const measurementPath = readConfigString(source.measurementPath || source.endpoint);
    const isSafePath = /^\/[a-z0-9]+$/i.test(measurementPath);
    const isProductionHost = /(^|\.)ash-tra\.com$/i.test(window.location.hostname);

    return {
      enabled: readConfigBoolean(source.enabled, false) && isSafePath && isProductionHost,
      measurementPath: isSafePath ? measurementPath.replace(/\/+$/, "") : "",
      tagId: readConfigString(source.tagId || source.measurementId)
    };
  }

  function rewriteRootRelativeUrls(root) {
    if (!root || typeof root.querySelectorAll !== "function") return;

    [
      ["a[href]", "href"],
      ["img[src]", "src"],
      ["source[src]", "src"],
      ["audio[src]", "src"],
      ["video[poster]", "poster"],
      ["form[action]", "action"],
      ["use[href]", "href"],
      ["image[href]", "href"]
    ].forEach(function (entry) {
      const selector = entry[0];
      const attribute = entry[1];
      root.querySelectorAll(selector).forEach(function (node) {
        const current = node.getAttribute(attribute);
        const next = runtimeUrl(current);
        if (next !== current) {
          node.setAttribute(attribute, next);
        }
      });
    });
  }

  function clampNumber(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
  }

  function resolveOrbotConfig(input) {
    const source = input && typeof input === "object" ? input : {};
    return {
      enabled: source.enabled !== false,
      excludePages: Array.isArray(source.excludePages) ? source.excludePages.map(String) : ["404"],
      primaryCtaPriority:
        typeof source.primaryCtaPriority === "string" && source.primaryCtaPriority.trim()
          ? source.primaryCtaPriority.trim()
          : "launch",
      maxQueryLength: clampNumber(source.maxQueryLength, 280, 80, 420),
      shortcutKey:
        typeof source.shortcutKey === "string" && source.shortcutKey.trim()
          ? source.shortcutKey.trim().slice(0, 1)
          : "/"
    };
  }

  function shouldEnableOrbot() {
    return orbotConfig.enabled && !orbotConfig.excludePages.includes(page);
  }

  function getSocialImageUrl(pageName) {
    const slug =
      typeof pageName === "string" && pageName.trim() ? pageName.trim().toLowerCase() : "home";
    return `${brandAssetOrigin}/${socialImageByPage[slug] || "ash-tra-brand-website-social-preview.png"}`;
  }

  const infoStripItems = [
    "Where ambition meets momentum.",
    "Clear signal. Sharp strategy.",
    "Design that lifts and lands.",
    "Built to rank and resonate.",
    "Stronger presence. Deeper trust.",
    "Built to win attention.",
    "Give your brand gravity.",
    "More traction. Less drag.",
    "Better reach. Bigger trajectory.",
    "Launch stronger. Scale smarter."
  ];

  // ==========================================================================
  // JS Section: Site Index
  // Searchable page registry used by Orbot and route suggestions.
  // ==========================================================================
  const siteIndex = [
    {
      title: "Home",
      url: "/",
      description: "The cinematic homepage with the core positioning, values, and launch routes.",
      keywords: ["home", "overview", "hero", "ashtra", "website", "momentum"]
    },
    {
      title: "Services",
      url: "/services/",
      description: "Strategy, launch builds, full resets, SEO foundations, systems connection, and momentum support.",
      keywords: ["services", "design", "redesign", "build", "seo", "support", "growth"]
    },
    {
      title: "Process",
      url: "/process/",
      description: "The four-phase process from diagnosis through launch.",
      keywords: ["process", "steps", "timeline", "workflow", "launch", "delivery"]
    },
    {
      title: "Work",
      url: "/examples/",
      description: "Selected work directions showing the structure, pacing, and premium standard ASH-TRA builds.",
      keywords: ["work", "studies", "examples", "gallery", "direction", "private"]
    },
    {
      title: "About",
      url: "/about/",
      description: "What ASH-TRA stands for, who it is for, and why perception changes business outcomes.",
      keywords: ["about", "studio", "brand", "positioning", "fit", "story"]
    },
    {
      title: "Contact",
      url: "/contact/",
      description: "The fast route for project enquiries, fit questions, and direct contact.",
      keywords: ["contact", "enquiry", "form", "message", "reach", "talk"]
    },
    {
      title: "Launch",
      url: "/launch/",
      description: "The direct project intake form for businesses ready to launch, rebuild, or upgrade key pages.",
      keywords: ["start", "project", "consultation", "brief", "quote", "kickoff"]
    },
    {
      title: "Discovery",
      url: "/discovery/",
      description: "Choose between the paid consultation route and the free price-range brief, then send the full discovery questionnaire.",
      keywords: ["discovery", "consultation", "brief", "strategy", "planning", "questionnaire"]
    },
    {
      title: "Invest",
      url: "/invest/",
      description: "Compare the Foundation, Growth System, and Orbital Partnership investment levels.",
      keywords: ["invest", "pricing", "investment", "foundation", "growth", "partnership"]
    },
    {
      title: "Payments",
      url: "/payments/",
      description: "The paid consultation page with coverage, payment routes, and the sharper strategy-first path.",
      keywords: ["book", "call", "payment", "consultation", "stripe", "paypal", "pix", "strategy"]
    },
    {
      title: "Schedule",
      url: "/schedule/",
      description: "The scheduling page with the Calendly booking route and what to prepare before the session.",
      keywords: ["schedule", "meeting", "book", "calendly", "slot", "consultation"]
    },
    {
      title: "FAQ",
      url: "/faq/",
      description: "Short answers about fit, timing, motion, mobile, SEO, and how projects start.",
      keywords: ["faq", "questions", "answers", "seo", "mobile", "fit", "discovery"]
    },
    {
      title: "Privacy",
      url: "/privacy/",
      description: "The privacy page covering what may be collected, why it is used, and how requests can be sent.",
      keywords: ["privacy", "data", "information", "rights", "security", "policy"]
    },
    {
      title: "Terms",
      url: "/terms/",
      description: "The terms page covering scope, payments, ownership, liability, and commercial expectations.",
      keywords: ["terms", "payments", "scope", "ownership", "liability", "commercial"]
    },
    {
      title: "Cookies",
      url: "/cookies/",
      description: "The cookies page covering essential, analytics, preference, and choice-related cookie use.",
      keywords: ["cookies", "analytics", "preferences", "tracking", "choice", "policy"]
    },
    {
      title: "Accessibility",
      url: "/accessibility/",
      description: "The accessibility page covering readability, navigation, responsiveness, and ongoing improvement.",
      keywords: ["accessibility", "usable", "responsive", "readable", "navigation", "a11y"]
    }
  ];

  // ==========================================================================
  // JS Section: SEO Registry
  // Per-page titles, descriptions, canonical paths, social previews, and JSON-LD
  // payloads that are synced into the document head on load.
  // ==========================================================================
  const pageSeo = {
    home: {
      title: "ASH-TRA | Modern Websites for Ambitious Businesses",
      description:
        "ASH-TRA builds modern websites, sharper messaging, and stronger digital presence for ambitious businesses that want more trust, more pull, and more momentum.",
      path: "/",
      ogAlt: "ASH-TRA homepage social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: brandAppName,
          url: "https://ash-tra.com/",
          logo: `${brandAssetOrigin}/ash-tra-logo.png`,
          image: getSocialImageUrl("home"),
          description:
            "ASH-TRA builds modern digital presence for ambitious companies that want more trust, more pull, and more momentum.",
          sameAs: ["https://ash-tra.com/"],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            url: "https://ash-tra.com/contact/"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ASH-TRA",
          url: "https://ash-tra.com/"
        }
      ]
    },
    about: {
      title: "About ASH-TRA | Story, Standards, and the Signal Behind the Site",
      description:
        "Read the story behind ASH-TRA, what it stands for, who it fits, and why the studio builds websites to feel clear, credible, and ready for momentum.",
      path: "/about/",
      ogAlt: "ASH-TRA about page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About ASH-TRA",
          url: "https://ash-tra.com/about/",
          description:
            "ASH-TRA helps ambitious companies build digital presence that earns trust faster and supports real growth.",
          isPartOf: { "@type": "WebSite", name: "ASH-TRA", url: "https://ash-tra.com/" }
        }
      ]
    },
    contact: {
      title: "Contact ASH-TRA | Project Enquiry, Launch, or Discovery Route",
      description:
        "Contact ASH-TRA through the route that fits best: direct project launch, paid call, or discovery form for a lighter first step.",
      path: "/contact/",
      ogAlt: "ASH-TRA contact page social preview",
      schemas: []
    },
    services: {
      title: "Services | Strategy, Rebuilds, SEO, and Support | ASH-TRA",
      description:
        "Explore ASH-TRA services for strategy, messaging, website launches, redesigns, full rebuilds, SEO foundations, analytics, systems, and ongoing support.",
      path: "/services/",
      ogAlt: "ASH-TRA services page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "ASH-TRA Services",
          url: "https://ash-tra.com/services/",
          description:
            "Services built to make ambitious companies look sharper, feel more credible, and move with more momentum.",
          hasPart: [
            { "@type": "Service", name: "Direction Session" },
            { "@type": "Service", name: "Message and Position" },
            { "@type": "Service", name: "Launch Build" },
            { "@type": "Service", name: "Presence Upgrade" },
            { "@type": "Service", name: "Full Reset" },
            { "@type": "Service", name: "Pages That Sell" },
            { "@type": "Service", name: "Search Lift" },
            { "@type": "Service", name: "Insight Setup" },
            { "@type": "Service", name: "Systems Connection" },
            { "@type": "Service", name: "Performance Polish" },
            { "@type": "Service", name: "Global Reach" },
            { "@type": "Service", name: "Momentum Support" }
          ]
        }
      ]
    },
    examples: {
      title: "Website Work Examples | Premium Portfolio Directions | ASH-TRA",
      description:
        "Explore ASH-TRA website work examples and portfolio directions that show how structure, pacing, and message change by business type.",
      path: "/examples/",
      ogAlt: "ASH-TRA portfolio page social preview",
      schemas: []
    },
    process: {
      title: "Website Process | Discovery, Build, Refinement, and Support | ASH-TRA",
      description:
        "See the ASH-TRA process from discovery and direction through build, refinement, optimisation, and support for a stronger website launch.",
      path: "/process/",
      ogAlt: "ASH-TRA process page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "ASH-TRA Process",
          url: "https://ash-tra.com/process/",
          description:
            "A clear process built to create trust, traction, and momentum from the ground up."
        }
      ]
    },
    discovery: {
      title: "Discovery | Paid Consultation or Free Website Brief | ASH-TRA",
      description:
        "Choose the ASH-TRA discovery route that fits: paid consultation for live strategic input or a free website brief for an approximate price range.",
      path: "/discovery/",
      ogAlt: "ASH-TRA discovery page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "ASH-TRA Discovery",
          url: "https://ash-tra.com/discovery/",
          description:
            "Start with a paid consultation or a detailed discovery brief and receive clearer direction on the right next move."
        }
      ]
    },
    launch: {
      title: "Launch Your Project | Website Intake Form | ASH-TRA",
      description:
        "Use the ASH-TRA launch intake to start a new website, rebuild, redesign, or focused page project with a cleaner first step.",
      path: "/launch/",
      ogAlt: "ASH-TRA launch page social preview",
      schemas: []
    },
    invest: {
      title: "Website Investment Levels | Foundation, Growth, or Partnership | ASH-TRA",
      description:
        "Compare the ASH-TRA investment levels and choose between Foundation, Growth System, and Orbital Partnership based on the level of performance and support you need.",
      path: "/invest/",
      ogAlt: "ASH-TRA investment page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "ASH-TRA Investment Levels",
          url: "https://ash-tra.com/invest/",
          description:
            "Three levels of website investment covering foundation presence, content-led growth, and ongoing partnership."
        }
      ]
    },
    "payments": {
      title: "Consultation Payments | Stripe, PayPal, or Pix | ASH-TRA",
      description:
        "Choose the paid consultation route, request Stripe, PayPal, or Pix, and start your website project with a stronger strategic direction.",
      path: "/payments/",
      ogAlt: "ASH-TRA payments page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "ASH-TRA Payments",
          serviceType: "Discovery consultation",
          provider: { "@type": "Organization", name: "ASH-TRA", url: "https://ash-tra.com/" },
          url: "https://ash-tra.com/payments/",
          description:
            "A paid consultation for founders and teams who want sharper direction before the build begins."
        }
      ]
    },
    "schedule": {
      title: "Schedule Your Consultation | Book the ASH-TRA Call",
      description:
        "Book your paid ASH-TRA consultation slot, prepare properly, and move into the next clear direction for the website project.",
      path: "/schedule/",
      ogAlt: "ASH-TRA schedule page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Schedule",
          url: "https://ash-tra.com/schedule/",
          description:
            "Choose your consultation slot and come ready with the context that matters."
        }
      ]
    },
    faq: {
      title: "ASH-TRA FAQ | Services, Discovery, SEO, Analytics, and Support",
      description:
        "Read clear answers about ASH-TRA services, paid consultations, discovery, SEO, analytics, performance, support, and fit.",
      path: "/faq/",
      ogAlt: "ASH-TRA FAQ page social preview",
      schemas: []
    },
    terms: {
      title: "Terms of Service | ASH-TRA",
      description:
        "Read the ASH-TRA terms covering consultations, project scope, payments, ownership, revisions, liability, and general site use.",
      path: "/terms/",
      ogAlt: "ASH-TRA terms of service page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Terms of Service",
          url: "https://ash-tra.com/terms/"
        }
      ]
    },
    privacy: {
      title: "Privacy Policy | ASH-TRA",
      description:
        "Read how ASH-TRA collects, uses, stores, and protects information submitted through the website, forms, scheduling, and payment routes.",
      path: "/privacy/",
      ogAlt: "ASH-TRA privacy policy page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Privacy Policy",
          url: "https://ash-tra.com/privacy/"
        }
      ]
    },
    cookies: {
      title: "Cookie Policy | ASH-TRA",
      description:
        "Read how cookies and similar technologies may be used on ash-tra.com for site functionality, analytics, preferences, and performance improvement.",
      path: "/cookies/",
      ogAlt: "ASH-TRA cookie policy page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Cookie Policy",
          url: "https://ash-tra.com/cookies/"
        }
      ]
    },
    accessibility: {
      title: "Accessibility Statement | ASH-TRA",
      description:
        "Read the ASH-TRA accessibility approach, ongoing improvements, third-party tool notes, and ways to report access issues.",
      path: "/accessibility/",
      ogAlt: "ASH-TRA accessibility statement page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Accessibility Statement",
          url: "https://ash-tra.com/accessibility/"
        }
      ]
    },
    "404": {
      title: "Page Not Found | ASH-TRA",
      description:
        "The page you tried to open is not available. Use the homepage, launch route, discovery route, or contact page instead.",
      path: "/404.html",
      ogAlt: "ASH-TRA not found page social preview",
      robots: "noindex,follow",
      schemas: []
    }
  };

  // ==========================================================================
  // JS Section: Markup And Partial Helpers
  // Builds inline SVG snippets, reusable UI strings, and injected header/footer
  // partials while keeping partial scripts executable after fetch insertion.
  // ==========================================================================
  function icon(name) {
    const icons = {
      arrow:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h12M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>',
      close:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.9"/></svg>',
      search:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l5 5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/></svg>',
      whatsapp:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2a8.6 8.6 0 0 0-7.4 13l-1.2 4.6 4.7-1.2A8.6 8.6 0 1 0 12 3.2zm4.8 12.2c-.2.6-1.3 1.1-1.9 1.2-.5.1-1.1.2-3.4-.8-2.8-1.2-4.5-4-4.7-4.2-.2-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2.1.4 0 .6-.1.2-.2.4-.4.6l-.5.5c-.2.2-.3.3-.1.6.2.4.9 1.5 2 2.4 1.4 1.2 2.5 1.5 2.9 1.7.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.3.7-.2.3.1 1.9.9 2.2 1 .3.2.6.3.7.5.1.1.1.7-.2 1.3z" fill="currentColor"/></svg>',
      top:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 18V6M6 12l6-6 6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>'
    };

    return icons[name] || "";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function infoStripMarkup(extraClass) {
    const items = infoStripItems.concat(infoStripItems.slice(0, 4));
    return `
      <div class="info-strip surface ${extraClass || ""}" aria-label="ASH-TRA promise lines">
        <div class="info-strip__track">
          ${items.map((item) => `<span class="info-strip__item">${item}</span>`).join("")}
        </div>
      </div>
    `;
  }

  function resolveSitePartialName(target) {
    if (!(target instanceof HTMLElement)) return "";
    if (target.dataset.sitePartial) return target.dataset.sitePartial;
    if (target.hasAttribute("data-site-header")) return "site-header";
    if (target.hasAttribute("data-site-footer")) return "site-footer";
    return "";
  }

  function resolveSitePartialPath(name) {
    return partialPaths[name] || "";
  }

  async function fetchSitePartialMarkup(name) {
    if (!name) throw new Error("Missing partial name.");
    if (window.location.protocol === "file:") {
      throw new Error(
        'Shared partials cannot be loaded from a file:// preview. Serve the project root with "npm start" or another local web server.'
      );
    }
    if (partialMarkupCache.has(name)) return partialMarkupCache.get(name);

    const partialPromise = fetch(resolveSitePartialPath(name), {
      // Keep local preview responsive to edits, but let production use normal
      // browser caching so header/footer fetches do not add unnecessary drag.
      cache: isLocalPreview ? "no-store" : "default",
      headers: { Accept: "text/html" }
    })
      .then(async function (response) {
        if (!response.ok) {
          throw new Error(`Could not load partial "${name}" (${response.status}).`);
        }
        return response.text();
      })
      .catch(function (error) {
        partialMarkupCache.delete(name);
        throw error;
      });

    partialMarkupCache.set(name, partialPromise);
    return partialPromise;
  }

  function runPartialScripts(target, name) {
    target.querySelectorAll("script").forEach(function (scriptTag, index) {
      const executable = document.createElement("script");
      Array.from(scriptTag.attributes).forEach(function (attribute) {
        executable.setAttribute(attribute.name, attribute.value);
      });
      executable.dataset.sitePartialScript = `${name}-${index}`;
      if (scriptTag.src) {
        executable.src = scriptTag.src;
      } else {
        executable.textContent = scriptTag.textContent;
      }
      scriptTag.replaceWith(executable);
    });
  }

  async function injectSitePartial(target) {
    const name = resolveSitePartialName(target);
    if (!name) return;

    const markup = await fetchSitePartialMarkup(name);
    target.dataset.sitePartial = name;
    target.dataset.partialRoot = name;
    target.innerHTML = markup;
    rewriteRootRelativeUrls(target);
    runPartialScripts(target, name);
    target.dataset.sitePartialStatus = "loaded";
  }

  function utilityMarkup() {
    let whatsappHref = config.whatsappUrl || "#";
    if (whatsappHref !== "#") {
      try {
        const url = new URL(whatsappHref);
        if (!url.searchParams.get("text")) {
          url.searchParams.set(
            "text",
            "Hi ASH-TRA, I found you through ash-tra.com and I want to talk about a website project."
          );
        }
        whatsappHref = url.toString();
      } catch (error) {
        whatsappHref = config.whatsappUrl || "#";
      }
    }

    const orbotEnabled = shouldEnableOrbot();
    const orbotMarkup = orbotEnabled
      ? `
      <div class="orbot" data-orbot-root data-orbot-state="closed" hidden>
        <button class="orbot__backdrop" type="button" aria-label="Close Orbot help" data-orbot-close></button>
        <section
          class="orbot__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="orbot-title"
          aria-describedby="orbot-subtitle"
          tabindex="-1"
        >
          <header class="orbot__header">
            <div class="orbot__avatar-shell" aria-hidden="true">
              <img src="/assets/brand/orbot-avatar.svg" alt="" />
            </div>
            <div class="orbot__intro">
              <span class="orbot__eyebrow">Orbot</span>
              <h2 id="orbot-title">Pick a goal. Get the right page.</h2>
              <p id="orbot-subtitle">I send you to the exact page: Launch, Discovery, Services, Process, Contact, Payment, or Schedule.</p>
            </div>
            <button class="orbot__close" type="button" aria-label="Close Orbot help" data-orbot-close>
              ${icon("close")}
            </button>
          </header>
          <div class="orbot__body">
            <div class="orbot__suggestions">
              <button type="button" class="orbot__suggestion" data-orbot-suggestion="Show me the best launch page">Launch</button>
              <button type="button" class="orbot__suggestion" data-orbot-suggestion="How does your process work?">Process</button>
              <button type="button" class="orbot__suggestion" data-orbot-suggestion="What services are available?">Services</button>
            </div>
            <form class="orbot__form" data-orbot-form>
              <label class="sr-only" for="orbot-input">Ask Orbot for the best page</label>
              <div class="orbot__field">
                ${icon("search")}
                <input
                  id="orbot-input"
                  name="query"
                  type="text"
                  autocomplete="off"
                  maxlength="${Math.trunc(orbotConfig.maxQueryLength)}"
                  placeholder="Ask Orbot where to start and it will map the best page..."
                  data-orbot-input
                />
              </div>
              <button class="button button--primary orbot__send" type="submit" data-orbot-submit>
                ${icon("arrow")}
                <span>Send</span>
              </button>
            </form>
            <p class="orbot__status" data-orbot-status hidden>Routing...</p>
            <div class="orbot__log" data-orbot-log aria-live="polite"></div>
          </div>
        </section>
      </div>
    `
      : "";

    return `
      <div class="floating-rail" data-site-utilities>
        <a
          class="floating-action floating-action--whatsapp"
          href="${whatsappHref}"
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with ASH-TRA on WhatsApp"
          data-track="whatsapp_click"
        >
          ${icon("whatsapp")}
          <span class="floating-action__label">WhatsApp</span>
        </a>
        ${
          orbotEnabled
            ? `
        <button
          class="floating-action floating-action--bot orbot-launcher"
          type="button"
          data-orbot-launcher
          aria-label="Open Orbot assistant"
          aria-haspopup="dialog"
          aria-expanded="false"
        >
          <span class="orbot-launcher__halo" aria-hidden="true"></span>
          <img class="floating-action__avatar orbot-launcher__avatar" src="/assets/brand/orbot-avatar.svg" alt="" aria-hidden="true" />
          <span class="floating-action__label">Orbot</span>
        </button>
        `
            : ""
        }
        <button class="floating-action floating-action--top" type="button" data-back-to-top aria-label="Back to top" hidden>
          ${icon("top")}
          <span class="floating-action__label">Top</span>
        </button>
      </div>
      ${orbotMarkup}
    `;
  }

  // ==========================================================================
  // JS Section: Head Metadata, Consent, And Analytics
  // Updates SEO/social tags, canonical links, favicon/app metadata, structured
  // data, cookie consent, and optional third-party measurement tools.
  // ==========================================================================
  function setMeta(name, content, attribute) {
    if (!content) return;
    const attr = attribute || "name";
    let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attr, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  }

  function setLink(rel, href, attributes) {
    if (!href) return;
    const entries = Object.entries(attributes || {}).filter(function (entry) {
      return entry[1] !== undefined && entry[1] !== null && entry[1] !== "";
    });
    const selector =
      `link[rel="${rel}"]` +
      entries
        .map(function (entry) {
          return `[${entry[0]}="${String(entry[1]).replace(/"/g, '\\"')}"]`;
        })
        .join("");

    let tag = document.head.querySelector(selector);
    if (!tag) {
      tag = document.createElement("link");
      tag.setAttribute("rel", rel);
      document.head.appendChild(tag);
    }
    entries.forEach(function (entry) {
      tag.setAttribute(entry[0], entry[1]);
    });
    tag.setAttribute("href", href);
  }

  function syncBrandHeadAssets(pageName) {
    setMeta("application-name", brandAppName);
    setMeta("theme-color", brandChromeColor);
    setMeta("msapplication-TileColor", brandChromeColor);
    setMeta("msapplication-TileImage", `${brandAssetBase}/ash-tra-icon-192.png`);
    setMeta("color-scheme", "dark");
    setMeta("apple-mobile-web-app-capable", "yes");
    setMeta("apple-mobile-web-app-title", brandAppName);
    setMeta("apple-mobile-web-app-status-bar-style", "black-translucent");

    setLink("icon", `${brandAssetBase}/ash-tra-favicon.svg`, { type: "image/svg+xml" });
    setLink("icon", `${brandAssetBase}/favicon-16.png`, { sizes: "16x16", type: "image/png" });
    setLink("icon", `${brandAssetBase}/favicon-32.png`, { sizes: "32x32", type: "image/png" });
    setLink("icon", `${brandAssetBase}/favicon-64.png`, { sizes: "64x64", type: "image/png" });
    setLink("shortcut icon", `${brandAssetBase}/favicon-32.png`, { type: "image/png" });
    setLink("apple-touch-icon", `${brandAssetBase}/apple-touch-icon.png`, { sizes: "180x180" });
    setLink("manifest", runtimeUrl("/site.webmanifest"));

    return getSocialImageUrl(pageName);
  }

  function setupSeo() {
    const seo = pageSeo[page];
    if (!seo) return;
    const socialImageUrl = syncBrandHeadAssets(page);

    document.title = seo.title;
    setMeta("description", seo.description);
    setMeta(
      "robots",
      seo.robots || "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
    );
    setMeta("og:title", seo.title, "property");
    setMeta("og:description", seo.description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:site_name", "ASH-TRA", "property");
    setMeta("og:url", `https://ash-tra.com${seo.path}`, "property");
    setMeta("og:image", socialImageUrl, "property");
    setMeta("og:image:secure_url", socialImageUrl, "property");
    setMeta("og:image:type", "image/png", "property");
    setMeta("og:image:width", "1200", "property");
    setMeta("og:image:height", "630", "property");
    setMeta("og:image:alt", seo.ogAlt, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
    setMeta("twitter:image", socialImageUrl);
    setMeta("twitter:image:alt", seo.ogAlt);
    setLink("canonical", `https://ash-tra.com${seo.path}`);

    if (!document.head.querySelector('script[data-seo-schema="page"]')) {
      document.querySelectorAll('script[data-seo-schema="dynamic"]').forEach(function (tag) {
        tag.remove();
      });

      const schemas = Array.isArray(seo.schemas) ? seo.schemas.slice() : [];

      if (page === "faq") {
        const entities = Array.from(document.querySelectorAll(".faq-list details[data-faq]"))
          .map(function (item) {
            const question = item.querySelector("summary")?.textContent.trim();
            const answer = item.querySelector("p")?.textContent.trim();
            if (!question || !answer) return null;
            return {
              "@type": "Question",
              name: question.replace(/^\d+\.\s*/, ""),
              acceptedAnswer: { "@type": "Answer", text: answer }
            };
          })
          .filter(Boolean);

        if (entities.length) {
          schemas.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: entities
          });
        }
      }

      schemas.forEach(function (schema) {
        const tag = document.createElement("script");
        tag.type = "application/ld+json";
        tag.dataset.seoSchema = "dynamic";
        tag.textContent = JSON.stringify(schema);
        document.head.appendChild(tag);
      });
    }
  }

  function ensureGoogleDataLayer() {
    window.dataLayer = window.dataLayer || [];

    if (typeof window.gtag !== "function") {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
    }
  }

  function createTrackingConsent(categories) {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      categories: trackingConsentCategories.reduce(function (result, category) {
        result[category] = Boolean(categories && categories[category]);
        return result;
      }, {})
    };
  }

  function sanitizeTrackingConsent(value) {
    if (!value || typeof value !== "object" || !value.categories) return null;
    return createTrackingConsent(value.categories);
  }

  function loadStoredTrackingConsent() {
    try {
      return sanitizeTrackingConsent(JSON.parse(window.localStorage.getItem(trackingConsentKey)));
    } catch (error) {
      return null;
    }
  }

  function saveTrackingConsent(value) {
    try {
      window.localStorage.setItem(trackingConsentKey, JSON.stringify(value));
    } catch (error) {
      // Consent still applies for this page view when storage is unavailable.
    }
  }

  function summarizeTrackingConsent(value) {
    if (!value || !value.categories) return "pending";
    const accepted = trackingConsentCategories.filter(function (category) {
      return value.categories[category];
    });
    return accepted.length ? accepted.join("-") : "essential";
  }

  function updateTrackingConsentState() {
    document.documentElement.dataset.trackingConsent = summarizeTrackingConsent(trackingConsent);
  }

  function hasTrackingConsent(category) {
    if (!trackingConfig.enabled) return false;
    if (!trackingConfig.requireConsent) return true;
    return Boolean(trackingConsent?.categories?.[category]);
  }

  function hasAnyTrackingConsent() {
    return trackingConsentCategories.some(function (category) {
      return hasTrackingConsent(category);
    });
  }

  function buildGoogleConsentState() {
    const analyticsAllowed = hasTrackingConsent("analytics");
    const marketingAllowed = hasTrackingConsent("marketing");
    const behaviorAllowed = hasTrackingConsent("behavior");

    return {
      ad_personalization: marketingAllowed ? "granted" : "denied",
      ad_storage: marketingAllowed ? "granted" : "denied",
      ad_user_data: marketingAllowed ? "granted" : "denied",
      analytics_storage: analyticsAllowed ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: behaviorAllowed ? "granted" : "denied",
      security_storage: "granted"
    };
  }

  function applyGoogleConsent(command) {
    ensureGoogleDataLayer();
    window.gtag("consent", command, {
      ...buildGoogleConsentState(),
      wait_for_update: command === "default" ? 500 : undefined
    });
  }

  function removeTrackingConsentBanner() {
    document.querySelector("[data-consent-banner]")?.remove();
    window.removeEventListener("scroll", handlePassiveConsentScroll);
  }

  function setTrackingConsent(categories, source) {
    trackingConsent = createTrackingConsent(categories);
    saveTrackingConsent(trackingConsent);
    updateTrackingConsentState();
    applyGoogleConsent("update");
    removeTrackingConsentBanner();
    setupAnalytics();
    trackEvent("tracking_consent_update", {
      source: source || "manual",
      consent: summarizeTrackingConsent(trackingConsent)
    });
    trackPageView();
  }

  function renderTrackingConsentBanner() {
    if (document.querySelector("[data-consent-banner]")) return;
    passiveConsentScrollCount = 0;
    passiveConsentLastScrollY = window.scrollY;

    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <section class="consent-banner" data-consent-banner aria-label="Cookie and tracking consent">
          <div class="consent-banner__content">
            <p class="consent-banner__copy"><strong>Cookies</strong> We use essential cookies plus optional analytics to improve ASH-TRA.</p>
            <div class="consent-banner__options" data-consent-options hidden>
              <label class="consent-banner__option">
                <input type="checkbox" data-consent-option="analytics" checked />
                <span>Analytics</span>
              </label>
              <label class="consent-banner__option">
                <input type="checkbox" data-consent-option="behavior" />
                <span>Behaviour tools</span>
              </label>
              <label class="consent-banner__option">
                <input type="checkbox" data-consent-option="marketing" />
                <span>Marketing pixels</span>
              </label>
            </div>
            <div class="consent-banner__actions">
              <button class="consent-banner__accept" type="button" data-consent-accept>Accept</button>
              <button class="consent-banner__manage" type="button" data-consent-manage aria-expanded="false">Options</button>
              <button class="consent-banner__essential" type="button" data-consent-essential>Essential</button>
              <button class="consent-banner__save" type="button" data-consent-save hidden>Save</button>
              <a class="consent-banner__link" href="/cookies/">Policy</a>
            </div>
          </div>
        </section>
      `
    );

    const banner = document.querySelector("[data-consent-banner]");
    const options = banner?.querySelector("[data-consent-options]");
    const manage = banner?.querySelector("[data-consent-manage]");
    const save = banner?.querySelector("[data-consent-save]");

    banner?.querySelector("[data-consent-accept]")?.addEventListener("click", function () {
      setTrackingConsent({ analytics: true, behavior: true, marketing: true }, "accept_all");
    });

    banner?.querySelector("[data-consent-essential]")?.addEventListener("click", function () {
      setTrackingConsent({ analytics: false, behavior: false, marketing: false }, "essential_only");
    });

    manage?.addEventListener("click", function () {
      const isOpen = options?.hidden === false;
      if (options) options.hidden = isOpen;
      if (save) save.hidden = isOpen;
      manage.setAttribute("aria-expanded", String(!isOpen));
    });

    save?.addEventListener("click", function () {
      const choices = {};
      banner?.querySelectorAll("[data-consent-option]").forEach(function (input) {
        choices[input.getAttribute("data-consent-option")] = input.checked;
      });
      setTrackingConsent(choices, "custom");
    });

    window.addEventListener("scroll", handlePassiveConsentScroll, { passive: true });
  }

  function handlePassiveConsentScroll() {
    if (trackingConsent || !document.querySelector("[data-consent-banner]")) {
      window.removeEventListener("scroll", handlePassiveConsentScroll);
      return;
    }

    const movement = Math.abs(window.scrollY - passiveConsentLastScrollY);
    if (movement < Math.min(window.innerHeight * 0.35, 260)) return;

    passiveConsentScrollCount += 1;
    passiveConsentLastScrollY = window.scrollY;

    if (passiveConsentScrollCount >= passiveConsentScrollThreshold) {
      setTrackingConsent({ analytics: true, behavior: true, marketing: true }, "passive_scroll");
    }
  }

  function setupTrackingConsent() {
    ensureGoogleDataLayer();
    applyGoogleConsent("default");

    if (!trackingConfig.enabled) {
      document.documentElement.dataset.trackingConsent = "disabled";
      return;
    }

    if (!trackingConfig.requireConsent) {
      trackingConsent = createTrackingConsent({ analytics: true, behavior: true, marketing: true });
      updateTrackingConsentState();
      applyGoogleConsent("update");
      return;
    }

    trackingConsent = loadStoredTrackingConsent();
    updateTrackingConsentState();

    if (trackingConsent) {
      applyGoogleConsent("update");
      return;
    }

    renderTrackingConsentBanner();
  }

  function googleTagScriptSources(path, params) {
    const query = new URLSearchParams(params || {}).toString();
    const suffix = query ? `?${query}` : "";
    const direct = `https://www.googletagmanager.com/${path}${suffix}`;

    if (!googleTagGatewayConfig.enabled) return [direct];
    return [`${googleTagGatewayConfig.measurementPath}/${path}${suffix}`, direct];
  }

  function loadScriptOnce(key, sources, attributes) {
    const sourceList = Array.isArray(sources) ? sources.filter(Boolean) : [sources].filter(Boolean);
    if (!sourceList.length || document.head.querySelector(`script[data-tracking-loader="${key}"]`)) {
      return;
    }

    const loadSource = function (index) {
      const tag = document.createElement("script");
      tag.async = true;
      tag.dataset.trackingLoader = key;

      Object.entries(attributes || {}).forEach(function (entry) {
        tag.setAttribute(entry[0], entry[1]);
      });

      tag.onerror = function () {
        tag.remove();
        if (sourceList[index + 1]) loadSource(index + 1);
      };

      tag.src = sourceList[index];
      document.head.appendChild(tag);
    };

    loadSource(0);
  }

  function setupGoogleTag() {
    if (!hasTrackingConsent("analytics") && !hasTrackingConsent("marketing")) return;

    const loaderId =
      trackingIds.googleTagId ||
      googleTagGatewayConfig.tagId ||
      trackingIds.googleAnalyticsMeasurementId ||
      trackingIds.googleAdsId;
    if (!loaderId) return;

    ensureGoogleDataLayer();

    if (!window.__ashtraGoogleTagStarted) {
      window.gtag("js", new Date());
      window.__ashtraGoogleTagStarted = true;
    }

    window.__ashtraConfiguredGoogleTags = window.__ashtraConfiguredGoogleTags || {};

    if (
      hasTrackingConsent("analytics") &&
      trackingIds.googleAnalyticsMeasurementId &&
      !window.__ashtraConfiguredGoogleTags[trackingIds.googleAnalyticsMeasurementId]
    ) {
      window.gtag("config", trackingIds.googleAnalyticsMeasurementId, {
        anonymize_ip: true,
        send_page_view: false,
        transport_type: "beacon"
      });
      window.__ashtraConfiguredGoogleTags[trackingIds.googleAnalyticsMeasurementId] = true;
    }

    if (
      hasTrackingConsent("marketing") &&
      trackingIds.googleAdsId &&
      !window.__ashtraConfiguredGoogleTags[trackingIds.googleAdsId]
    ) {
      window.gtag("config", trackingIds.googleAdsId, { send_page_view: false });
      window.__ashtraConfiguredGoogleTags[trackingIds.googleAdsId] = true;
    }

    loadScriptOnce("google-tag", googleTagScriptSources("gtag/js", { id: loaderId }));
  }

  function setupGoogleTagManager() {
    if (
      !trackingIds.googleTagManagerId ||
      (!hasTrackingConsent("analytics") && !hasTrackingConsent("marketing"))
    ) {
      return;
    }
    ensureGoogleDataLayer();

    if (!window.__ashtraGtmStarted) {
      window.dataLayer.push({
        event: "gtm.js",
        "gtm.start": new Date().getTime()
      });
      window.__ashtraGtmStarted = true;
    }

    loadScriptOnce("google-tag-manager", googleTagScriptSources("gtm.js", {
      id: trackingIds.googleTagManagerId
    }));
  }

  function setupMetaPixel() {
    if (!trackingIds.metaPixelId || !hasTrackingConsent("marketing")) return;

    if (typeof window.fbq !== "function") {
      const queue = function () {
        queue.callMethod ? queue.callMethod.apply(queue, arguments) : queue.queue.push(arguments);
      };
      queue.queue = [];
      queue.loaded = true;
      queue.version = "2.0";
      window.fbq = queue;
      window._fbq = queue;
    }

    window.__ashtraMetaPixels = window.__ashtraMetaPixels || {};
    if (!window.__ashtraMetaPixels[trackingIds.metaPixelId]) {
      window.fbq("init", trackingIds.metaPixelId);
      window.__ashtraMetaPixels[trackingIds.metaPixelId] = true;
    }

    loadScriptOnce("meta-pixel", "https://connect.facebook.net/en_US/fbevents.js");
  }

  function setupLinkedInInsight() {
    if (!trackingIds.linkedinPartnerId || !hasTrackingConsent("marketing")) return;

    window._linkedin_partner_id = trackingIds.linkedinPartnerId;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    if (!window._linkedin_data_partner_ids.includes(trackingIds.linkedinPartnerId)) {
      window._linkedin_data_partner_ids.push(trackingIds.linkedinPartnerId);
    }

    loadScriptOnce("linkedin-insight", "https://snap.licdn.com/li.lms-analytics/insight.min.js");
  }

  function setupClarity() {
    if (!trackingIds.clarityProjectId || !hasTrackingConsent("behavior")) return;

    if (typeof window.clarity !== "function") {
      window.clarity = function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };
    }

    loadScriptOnce("microsoft-clarity", `https://www.clarity.ms/tag/${encodeURIComponent(trackingIds.clarityProjectId)}`);
  }

  function setupHotjar() {
    if (!trackingIds.hotjarSiteId || !hasTrackingConsent("behavior")) return;
    const hotjarId = Number(trackingIds.hotjarSiteId);
    if (!Number.isFinite(hotjarId) || hotjarId <= 0) return;

    window.hj =
      window.hj ||
      function () {
        (window.hj.q = window.hj.q || []).push(arguments);
      };
    window._hjSettings = { hjid: hotjarId, hjsv: 6 };

    loadScriptOnce("hotjar", `https://static.hotjar.com/c/hotjar-${hotjarId}.js?sv=6`);
  }

  function setupHubSpotTracking() {
    if (!trackingIds.hubspotPortalId || !hasTrackingConsent("marketing")) return;
    loadScriptOnce(
      "hubspot",
      `https://js.hs-scripts.com/${encodeURIComponent(trackingIds.hubspotPortalId)}.js`,
      { defer: "defer", id: "hs-script-loader" }
    );
  }

  function setupAnalytics() {
    if (!trackingConfig.enabled || !hasAnyTrackingConsent()) return;
    setupGoogleTag();
    setupGoogleTagManager();
    setupMetaPixel();
    setupLinkedInInsight();
    setupClarity();
    setupHotjar();
    setupHubSpotTracking();
  }

  // ==========================================================================
  // JS Section: Shell Injection And Global Utilities
  // Loads shared partials, adds floating actions, prepares page scaffolding, and
  // decorates the global stage with CSS-driven stars/comets.
  // ==========================================================================
  async function injectShell() {
    // Load the handwritten shell partials before the rest of the page behavior
    // runs so nav state, tracking hooks, and footer enhancements see real DOM.
    const shellTargets = Array.from(
      document.querySelectorAll("[data-site-partial], [data-site-header], [data-site-footer]")
    );

    await Promise.all(
      shellTargets.map(async function (target) {
        try {
          await injectSitePartial(target);
        } catch (error) {
          target.dataset.sitePartialStatus = "error";
          console.error(error);
        }
      })
    );

    if (!document.querySelector("[data-site-utilities]")) {
      document.body.insertAdjacentHTML("beforeend", utilityMarkup());
    }
  }

  function setupPageStructure() {
    const main = document.querySelector("main");
    if (main) {
      main.classList.add("layout-page");
    }

    if (page === "home") return;
    if (!main || main.querySelector(".page-info-strip")) return;

    const hero = main.querySelector(".hero-cinema, .hero, .policy-hero");
    if (!hero) return;

    hero.insertAdjacentHTML(
      "afterend",
      `
        <section class="section section--flush page-info-strip">
          <div class="shell">
            ${infoStripMarkup("info-strip--site")}
          </div>
        </section>
      `
    );
  }

  function decorateStage() {
    const stage = document.querySelector(".site-stage");
    if (!stage || stage.querySelector(".site-stage__stars")) return;

    const starLayer = document.createElement("div");
    starLayer.className = "site-stage__stars";
    for (let index = 0; index < 56; index += 1) {
      const star = document.createElement("span");
      star.className = "site-stage__star";
      starLayer.appendChild(star);
    }

    const cometLayer = document.createElement("div");
    cometLayer.className = "site-stage__comets";
    cometLayer.innerHTML =
      '<span class="site-stage__comet"></span><span class="site-stage__comet site-stage__comet--alt"></span>';

    stage.appendChild(starLayer);
    stage.appendChild(cometLayer);
  }

  function sendMarketingPixelEvent(name, detail) {
    if (!hasTrackingConsent("marketing")) return;

    if (typeof window.fbq === "function") {
      const standardEvent = metaStandardEvents[name];
      if (standardEvent) {
        window.fbq("track", standardEvent, detail || {});
      } else {
        window.fbq("trackCustom", name, detail || {});
      }
    }
  }

  function sendBehaviorToolEvent(name) {
    if (!hasTrackingConsent("behavior")) return;
    if (typeof window.clarity === "function") window.clarity("event", name);
    if (typeof window.hj === "function") window.hj("event", name);
  }

  function sendHubSpotWebhookEvent(name, detail) {
    if (!trackingIds.hubspotEventWebhook || !hasTrackingConsent("marketing")) return;
    if (!hubspotKeyEvents.has(name)) return;

    const payload = JSON.stringify({
      event: name,
      page,
      title: document.title,
      url: window.location.href,
      path: window.location.pathname,
      detail: detail || {},
      occurredAt: new Date().toISOString()
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(trackingIds.hubspotEventWebhook, new Blob([payload], {
        type: "application/json"
      }));
      return;
    }

    fetch(trackingIds.hubspotEventWebhook, {
      body: payload,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      method: "POST"
    }).catch(function () {
      // Tracking webhooks must never block the user journey.
    });
  }

  function trackEvent(name, detail) {
    if (!trackingConfig.enabled) return false;

    const analyticsAllowed = hasTrackingConsent("analytics");
    const marketingAllowed = hasTrackingConsent("marketing");
    const behaviorAllowed = hasTrackingConsent("behavior");
    if (!analyticsAllowed && !marketingAllowed && !behaviorAllowed) return false;

    const eventDetail = detail || {};
    const payload = { event: name, page, ...eventDetail };

    if (analyticsAllowed || marketingAllowed) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
    }

    if (analyticsAllowed && typeof window.gtag === "function") {
      window.gtag("event", name, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        ...eventDetail
      });
    }

    sendMarketingPixelEvent(name, eventDetail);
    sendBehaviorToolEvent(name);
    sendHubSpotWebhookEvent(name, eventDetail);
    return true;
  }

  function trackPageView() {
    if (window.__ashtraPageViewTracked) return;
    const tracked = trackEvent("page_view", {
      path: window.location.pathname,
      title: document.title
    });
    if (tracked) window.__ashtraPageViewTracked = true;
  }

  function setupTrackedClicks() {
    document.addEventListener("click", function (event) {
      const element = event.target.closest("[data-track]");
      if (element) {
        trackEvent(element.getAttribute("data-track"), {
          label: element.getAttribute("data-track-label") || element.textContent.trim()
        });
      }

      if (!trackingConfig.trackOutboundLinks) return;
      const link = event.target.closest("a[href]");
      if (!link) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin) return;

      if (url.hostname.includes("calendly.com")) {
        trackEvent("schedule_click", { url: url.href });
      }

      trackEvent("outbound_link_click", {
        label: link.textContent.trim() || url.hostname,
        url: url.href
      });
    });
  }

  function setupScrollDepthTracking() {
    if (!trackingConfig.trackScrollDepth) return;

    const marks = [25, 50, 75, 90];
    const sent = new Set();

    const update = function () {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const percent = Math.round((window.scrollY / scrollable) * 100);
      marks.forEach(function (mark) {
        if (percent < mark || sent.has(mark)) return;
        if (trackEvent("scroll_depth", { percent: mark })) sent.add(mark);
      });

      if (sent.size === marks.length) {
        window.removeEventListener("scroll", update);
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function setupVideoEngagementTracking() {
    if (!trackingConfig.trackVideoEngagement) return;

    document.querySelectorAll("video").forEach(function (video, index) {
      if (video.dataset.videoTrackingReady) return;
      video.dataset.videoTrackingReady = "true";
      const label = video.getAttribute("aria-label") || video.currentSrc || `video-${index + 1}`;
      const progressMarks = [25, 50, 75, 100];
      const sentProgress = new Set();

      video.addEventListener("play", function () {
        trackEvent("video_play", { label });
      });

      video.addEventListener("ended", function () {
        trackEvent("video_complete", { label });
      });

      video.addEventListener("timeupdate", function () {
        if (!video.duration || !Number.isFinite(video.duration)) return;
        const percent = Math.round((video.currentTime / video.duration) * 100);

        progressMarks.forEach(function (mark) {
          if (percent < mark || sentProgress.has(mark)) return;
          if (trackEvent("video_progress", { label, percent: mark })) {
            sentProgress.add(mark);
          }
        });
      });
    });
  }

  // ==========================================================================
  // JS Section: Motion And Reveal Effects
  // Progressive enhancements for reveal-on-scroll, hover tilt, and depth-based
  // scene motion. These all respect reduced-motion and pointer capability.
  // ==========================================================================
  function setupReveal() {
    const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!revealItems.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    revealItems.forEach(function (item) {
      const siblings = Array.from(item.parentElement?.children || []).filter(function (candidate) {
        return candidate instanceof HTMLElement && candidate.hasAttribute("data-reveal");
      });
      const index = Math.max(0, siblings.indexOf(item));
      item.dataset.revealDelay = String(Math.min(index, 4));
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -12% 0px"
      }
    );

    window.requestAnimationFrame(function () {
      revealItems.forEach(function (item) {
        observer.observe(item);
      });
    });

    window.setTimeout(function () {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      observer.disconnect();
    }, 2200);
  }

  function setupTiltCards() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1180px)").matches) {
      document.querySelectorAll("[data-tilt]").forEach(function (card) {
        card.style.transform = "";
      });
      return;
    }

    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      let raf = 0;

      function reset() {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          card.style.transform = "";
        });
      }

      card.addEventListener("pointermove", function (event) {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          card.style.transform = `perspective(1200px) rotateX(${(-y * 2.1).toFixed(2)}deg) rotateY(${(x * 2.8).toFixed(2)}deg) translateY(-1.5px)`;
        });
      });

      card.addEventListener("pointerleave", reset);
      card.addEventListener("pointercancel", reset);
    });
  }

  // ==========================================================================
  // JS Section: Discovery Brief Experience
  // Turns the long questionnaire into guided accordion sections with required
  // tags, active section state, hash support, and mobile-friendly scrolling.
  // ==========================================================================
  function setupDiscoveryBrief() {
    if (page !== "discovery") return;

    const sections = Array.from(document.querySelectorAll(".brief-section"));
    if (!sections.length) return;

    document.body.classList.add("discovery-brief--enhanced");

    const openFirstButton = document.querySelector("[data-discovery-open-first]");
    const openAllButton = document.querySelector("[data-discovery-open-all]");
    const closeAllButton = document.querySelector("[data-discovery-close-all]");
    const phaseThresholds = [
      { end: 4, label: "Essentials" },
      { end: 10, label: "Direction" },
      { end: 16, label: "Scope" },
      { end: 21, label: "Finish" }
    ];

    function phaseLabel(index) {
      const number = index + 1;
      const match = phaseThresholds.find(function (item) {
        return number <= item.end;
      });
      return match ? match.label : "Section";
    }

    function setCurrent(section) {
      sections.forEach(function (item) {
        item.classList.toggle("is-current", item === section);
      });
    }

    function updateButtons() {
      sections.forEach(function (section) {
        const button = section.querySelector(".brief-section__toggle");
        if (!button) return;
        const isOpen = section.classList.contains("is-open");
        button.setAttribute("aria-expanded", isOpen ? "true" : "false");
        const text = button.querySelector(".brief-section__toggle-text");
        if (text) text.textContent = isOpen ? "Close" : "Open";
      });
    }

    function openSection(section, options) {
      const config = options && typeof options === "object" ? options : {};
      if (!section) return;

      if (config.exclusive !== false) {
        sections.forEach(function (item) {
          item.classList.toggle("is-open", item === section);
        });
      } else {
        section.classList.add("is-open");
      }

      setCurrent(section);
      updateButtons();

      if (config.scroll) {
        section.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start"
        });
      }
    }

    function closeAll() {
      sections.forEach(function (section) {
        section.classList.remove("is-open", "is-current");
      });
      updateButtons();
    }

    function openAll() {
      sections.forEach(function (section) {
        section.classList.add("is-open");
      });
      setCurrent(sections[0] || null);
      updateButtons();
    }

    sections.forEach(function (section, index) {
      const id = section.id || `brief-${String(index + 1).padStart(2, "0")}`;
      const head = section.querySelector(".brief-section__head");
      const copy = head?.querySelector("div");
      const grid = section.querySelector(".brief-section__grid");
      section.id = id;

      if (!head || !copy || !grid) return;

      copy.classList.add("brief-section__head-copy");

      if (!copy.querySelector(".brief-section__meta")) {
        const meta = document.createElement("div");
        meta.className = "brief-section__meta";

        const phase = document.createElement("span");
        phase.className = "brief-section__phase";
        phase.textContent = phaseLabel(index);
        meta.appendChild(phase);

        if (index === 0 || section.querySelector("[required]")) {
          const tag = document.createElement("span");
          tag.className = "brief-section__tag";
          tag.textContent = "Required";
          meta.appendChild(tag);
        }

        copy.insertBefore(meta, copy.firstChild);
      }

      const panelId = `${id}-panel`;
      grid.id = panelId;

      if (!head.querySelector(".brief-section__toggle")) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "brief-section__toggle";
        button.setAttribute("aria-controls", panelId);
        button.innerHTML =
          '<span class="brief-section__toggle-text">Open</span><span class="brief-section__toggle-icon" aria-hidden="true"></span>';
        button.addEventListener("click", function () {
          if (section.classList.contains("is-open")) {
            section.classList.remove("is-open", "is-current");
            if (!sections.some(function (item) {
              return item.classList.contains("is-open");
            })) {
              setCurrent(null);
            } else {
              setCurrent(
                sections.find(function (item) {
                  return item.classList.contains("is-open");
                }) || null
              );
            }
            updateButtons();
            return;
          }

          openSection(section, {
            exclusive: true,
            scroll: window.matchMedia("(max-width: 959px)").matches
          });
        });
        head.appendChild(button);
      }

      section.addEventListener("focusin", function () {
        if (!section.classList.contains("is-open")) {
          openSection(section, { exclusive: true });
        }
      });
    });

    if (openFirstButton) {
      openFirstButton.addEventListener("click", function () {
        openSection(sections[0], { exclusive: true, scroll: true });
      });
    }

    if (openAllButton) {
      openAllButton.addEventListener("click", openAll);
    }

    if (closeAllButton) {
      closeAllButton.addEventListener("click", closeAll);
    }

    function sectionFromHash() {
      const hash = window.location.hash ? window.location.hash.slice(1) : "";
      const target = hash ? document.getElementById(hash) : null;
      return target && sections.includes(target) ? target : null;
    }

    const initialSection = sectionFromHash() || sections[0];
    openSection(initialSection, { exclusive: true });

    window.__ashtraDiscoveryOpenSection = function (section, options) {
      if (!section || !sections.includes(section)) return;
      openSection(section, options);
    };

    window.addEventListener("hashchange", function () {
      const target = sectionFromHash();
      if (target) openSection(target, { exclusive: true });
    });
  }

  // ==========================================================================
  // JS Section: Discovery Brief Navigation
  // Builds the sticky section navigator and keeps it synced with visible
  // questionnaire sections.
  // ==========================================================================
  function setupBriefNav() {
    const nav = document.querySelector("[data-brief-nav]");
    const sections = Array.from(document.querySelectorAll(".brief-section"));
    if (!nav || !sections.length) return;

    nav.innerHTML = sections
      .map(function (section, index) {
        const id = section.id || `brief-${String(index + 1).padStart(2, "0")}`;
        const label =
          section.querySelector(".brief-section__number")?.textContent.trim() ||
          String(index + 1).padStart(2, "0");
        const title = section.querySelector("h3")?.textContent.trim() || `Section ${label}`;
        section.id = id;
        return `<a href="#${id}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(title)}</strong></a>`;
      })
      .join("");

    const links = Array.from(nav.querySelectorAll("a"));
    if (!links.length || !("IntersectionObserver" in window)) return;

    function setActive(id) {
      links.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    }

    const observer = new IntersectionObserver(
      function (entries) {
        const visible = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (left, right) {
            return right.intersectionRatio - left.intersectionRatio;
          })[0];

        if (visible) {
          setActive(visible.target.id);
        }
      },
      {
        threshold: [0.2, 0.4, 0.65],
        rootMargin: "-18% 0px -55% 0px"
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        const targetId = link.getAttribute("href")?.slice(1);
        if (targetId) {
          const targetSection = document.getElementById(targetId);
          if (page === "discovery" && typeof window.__ashtraDiscoveryOpenSection === "function") {
            window.__ashtraDiscoveryOpenSection(targetSection, { exclusive: true });
          }
          setActive(targetId);
        }
      });
    });

    setActive(sections[0].id);
  }

  // ==========================================================================
  // JS Section: Media, Motion, And Visual Decoration
  // Handles scene parallax, media performance defaults, back-to-top behavior,
  // and decorative visual cards/rails inserted around body content.
  // ==========================================================================
  function setupSceneMotion() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1040px)").matches) {
      document.querySelectorAll("[data-scene] [data-depth]").forEach(function (layer) {
        layer.style.transform = "";
      });
      return;
    }

    document.querySelectorAll("[data-scene]").forEach(function (scene) {
      const layers = scene.querySelectorAll("[data-depth]");
      if (!layers.length) return;
      let raf = 0;

      function reset() {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          layers.forEach(function (layer) {
            layer.style.transform = "";
          });
        });
      }

      scene.addEventListener("pointermove", function (event) {
        const rect = scene.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          layers.forEach(function (layer) {
            const depth = Number(layer.getAttribute("data-depth")) || 0.8;
            const moveX = x * depth * 28;
            const moveY = y * depth * 22;
            layer.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0)`;
          });
        });
      });

      scene.addEventListener("pointerleave", reset);
      scene.addEventListener("pointercancel", reset);
    });
  }

  function setupMediaPerformance() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll("img").forEach(function (image) {
      if (!image.hasAttribute("decoding")) {
        image.setAttribute("decoding", "async");
      }
    });

    document.querySelectorAll("video").forEach(function (video) {
      if (!video.hasAttribute("playsinline")) {
        video.setAttribute("playsinline", "");
      }
      if (!video.hasAttribute("preload") || video.getAttribute("preload") === "auto") {
        video.setAttribute("preload", "metadata");
      }
      if (reduceMotion) {
        video.removeAttribute("autoplay");
        video.pause();
      }
    });
  }

  function setupBackToTop() {
    const button = document.querySelector("[data-back-to-top]");
    if (!button) return;

    const update = function () {
      button.hidden = window.scrollY < 440;
    };

    button.addEventListener("click", function () {
      trackEvent("back_to_top_click");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function setupSectionVisuals() {
    const replacements = [
      {
        selector: 'body[data-page="home"] .home-band--premise .media-frame img',
        src: "/assets/media/sections/home-premise-signal-shift-brand-gravity.svg",
        alt: "Signal-shift scene representing stronger brand gravity and a more credible first impression."
      },
      {
        selector: 'body[data-page="process"] .process-band--summary .image-frame img',
        src: "/assets/media/sections/process-summary-route-diagram-web-build.svg",
        alt: "Route diagram representing the journey from discovery to build and support on a modern business website."
      },
      {
        selector: 'body[data-page="examples"] .examples-band--premise .media-frame img',
        src: "/assets/media/sections/examples-editorial-direction-premium-websites.svg",
        alt: "Editorial space composition representing premium website direction and stronger visual hierarchy."
      },
      {
        selector: 'body[data-page="discovery"] .discovery-band--why .story-grid__media img',
        src: "/assets/media/sections/discovery-routes-navigation-space-brief.svg",
        alt: "Navigation route visual representing discovery choices, project briefing, and a clearer starting point."
      },
      {
        selector: 'body[data-page="about"] .about-band--method .image-frame img',
        src: "/assets/media/sections/about-method-execution-orbit-momentum.svg",
        alt: "Orbital execution scene representing controlled process, cleaner build decisions, and long-term momentum."
      },
      {
        selector: 'body[data-page="home"] .home-band--examples .story-grid__media img',
        src: "/assets/media/sections/home-examples-premium-direction-orbit.svg",
        alt: "Premium orbit scene representing stronger website direction, contrast, and editorial pacing."
      }
    ];

    replacements.forEach(function (item) {
      document.querySelectorAll(item.selector).forEach(function (image) {
        image.setAttribute("src", item.src);
        image.setAttribute("alt", item.alt);
      });
    });

    const pageVisuals = {
      home: "/assets/media/sections/home-premise-signal-shift-brand-gravity.svg",
      services: "/assets/media/heroes/services-hero-satellite-network-website-services.svg",
      process: "/assets/media/sections/process-summary-route-diagram-web-build.svg",
      examples: "/assets/media/sections/examples-editorial-direction-premium-websites.svg",
      discovery: "/assets/media/sections/discovery-routes-navigation-space-brief.svg",
      contact: "/assets/media/sections/contact-route-network-project-enquiry.svg",
      "launch": "/assets/media/heroes/start-project-hero-launch-control-website-projects.svg",
      "schedule": "/assets/media/heroes/schedule-meeting-hero-docking-window-consultation-booking.svg",
      "payments": "/assets/media/heroes/pay-consultation-hero-strategic-briefing-website-consultation.svg",
      faq: "/assets/media/heroes/faq-hero-knowledge-atlas-business-questions.svg",
      privacy: "/assets/media/sections/legal-atlas-systems-business-clarity.svg",
      terms: "/assets/media/sections/legal-atlas-systems-business-clarity.svg",
      cookies: "/assets/media/heroes/cookies-hero-settings-signal-control-cookie-preferences.svg",
      accessibility: "/assets/media/heroes/accessibility-hero-clear-navigation-inclusive-web-usability.svg",
      about: "/assets/media/heroes/about-hero-deep-space-brand-positioning.svg"
    };

    const src = pageVisuals[page];
    if (!src || page === "about") return;

    document
      .querySelectorAll(".route-card, .service-detail, .faq-shell, .policy-card, .study-card, .card")
      .forEach(function (node, index) {
        if (node.querySelector(".section-visual")) return;

        const label = node.querySelector(".route-card__label, .service-detail__index, .card__icon");
        const visual = document.createElement("div");
        visual.className = "section-visual";
        visual.innerHTML = `
          <img src="${src}" alt="" loading="lazy" />
          <span class="section-visual__mark"><img src="/assets/brand/ash-tra-mark.svg" alt="" loading="lazy" /></span>
          <span class="section-visual__label">${label ? label.textContent.trim() : "Route " + String(index + 1).padStart(2, "0")}</span>
        `;
        node.insertBefore(visual, node.firstChild);

        const arrow = document.createElement("div");
        arrow.className = "surface-arrow";
        arrow.innerHTML = '<img src="/assets/media/overlays/site-route-arrow-neon-service-overlay.svg" alt="" loading="lazy" />';
        node.appendChild(arrow);
      });
  }

  function setupSectionIntroRails() {
    const rails = [
      {
        selector: 'body[data-page="home"] .home-band--fit .section-heading--panel',
        src: "/assets/media/sections/home-fit-brand-trajectory-signal.svg",
        alt: "Signal trajectory scene representing ambitious businesses building stronger digital presence.",
        kicker: "Built for trajectory",
        line: " "
      },
      {
        selector: 'body[data-page="about"] .about-band--fit .section-heading--panel',
        src: "/assets/media/sections/about-fit-brand-trajectory-authority.svg",
        alt: "Trajectory and authority scene representing businesses ready for a stronger public read.",
        kicker: "Read at the right level",
        line: " "
      },
      {
        selector: 'body[data-page="home"] .home-band--offers .section-heading--panel',
        src: "/assets/media/sections/home-offers-launch-optimise-growth.svg",
        alt: "Launch and optimisation scene representing core website offers for growth-focused businesses.",
        kicker: "Launch. Reset. Optimise.",
        line: " "
      }
    ];

    rails.forEach(function (item) {
      document.querySelectorAll(item.selector).forEach(function (panel) {
        if (panel.querySelector(".section-heading__rail")) return;
        panel.classList.add("section-heading--with-rail");
        const rail = document.createElement("aside");
        rail.className = "section-heading__rail";
        rail.innerHTML = `
          <div class="section-heading__rail-media">
            <img src="${item.src}" alt="${item.alt}" loading="lazy" />
            <span class="section-heading__rail-mark"><img src="/assets/brand/ash-tra-logo.png" alt="ASH-TRA logo mark" loading="lazy" /></span>
          </div>
          <div class="section-heading__rail-copy">
            <span class="section-heading__rail-kicker">${item.kicker}</span>
            <p>${item.line}</p>
          </div>
        `;
        panel.appendChild(rail);
      });
    });
  }

  function setupContentSequencing() {
    const gridSelectors = [
      ".card-grid",
      ".contact-grid",
      ".crosslink-grid",
      ".layout-category-grid",
      ".layout-metric-grid",
      ".layout-panel-grid",
      ".layout-panel-grid--offset",
      ".layout-service-mosaic",
      ".layout-step-grid",
      ".route-grid",
      ".service-category-grid",
      ".service-detail-grid",
      ".study-grid",
      ".values-grid"
    ];

    document.querySelectorAll(gridSelectors.join(",")).forEach(function (grid) {
      Array.from(grid.children).forEach(function (item, index) {
        if (!(item instanceof HTMLElement)) return;
        if (
          item.querySelector(
            ".route-card__label, .service-detail__index, .layout-panel__index, .layout-timeline__step, .card__icon, .process-step__number, .brief-section__number"
          )
        ) {
          return;
        }
        item.dataset.cardSeq = String(index + 1).padStart(2, "0");
      });
    });
  }

  // ==========================================================================
  // JS Section: Layout Sequencing
  // Adds simple sequence data/classes so CSS can alternate depth and keep long
  // pages from feeling visually repetitive.
  // ==========================================================================
  function setupLayoutScaffold() {
    document.querySelectorAll("[data-layout-sequence]").forEach(function (section, index) {
      section.dataset.layoutIndex = String(index + 1);
      section.classList.toggle("is-even", index % 2 === 1);
      section.classList.toggle("is-odd", index % 2 === 0);
    });
  }

  // ==========================================================================
  // JS Section: Payments And Forms
  // Handles payment-method prefill, endpoint resolution, Formspree submission,
  // success/error states, analytics events, and optional redirects.
  // ==========================================================================
  function setupPaymentPrefill() {
    const field = document.querySelector("[data-payment-method-field]");
    if (!field) return;

    document.querySelectorAll("[data-payment-prefill]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        field.value = trigger.getAttribute("data-payment-prefill") || "";
        trackEvent("payment_option_click", { method: field.value || "unknown" });
      });
    });
  }

  function resolveFormEndpoint(key) {
    if (key === "contact") return contactFormEndpoint;
    if (key === "consultation") return consultationFormEndpoint;
    if (key === "discovery") return discoveryFormEndpoint;
    return "";
  }

  function buildFormDataFromEntries(entries) {
    const data = new FormData();
    (entries || []).forEach(function (entry) {
      data.append(entry[0], entry[1]);
    });
    return data;
  }

  async function submitFormPayload(endpoint, method, entries) {
    const response = await fetch(endpoint, {
      method: method,
      body: buildFormDataFromEntries(entries),
      headers: { Accept: "application/json" }
    });

    const result = await response
      .clone()
      .json()
      .catch(function () {
        return {};
      });

    if (!response.ok) {
      const message =
        result?.errors
          ?.map(function (item) {
            return item.message;
          })
          .join(" ") || result?.error || "The form could not be sent right now.";
      throw new Error(message);
    }

    return result;
  }

  function setupForms() {
    document.querySelectorAll("[data-enquiry-form]").forEach(function (form) {
      const success = form.parentElement.querySelector("[data-form-success]");
      const error = form.parentElement.querySelector("[data-form-error]");
      const submit = form.querySelector('[type="submit"]');
      let started = false;

      function clearFeedback() {
        if (success) success.hidden = true;
        if (error) error.hidden = true;
      }

      form.addEventListener("submit", async function (event) {
        event.preventDefault();
        clearFeedback();

        const endpointKey = form.getAttribute("data-form-endpoint");
        const endpoint = runtimeUrl(
          form.getAttribute("action") || resolveFormEndpoint(endpointKey)
        );
        const fallbackEndpoint = runtimeUrl(
          form.getAttribute("data-form-fallback-endpoint") ||
            (endpointKey === "discovery" ? discoveryFormFallbackEndpoint : "")
        );
        if (!endpoint) {
          if (error) error.hidden = false;
          return;
        }

        const formName = form.getAttribute("name") || form.dataset.formKind || "enquiry";
        const payload = new FormData(form);
        payload.set("Page", window.location.href);
        payload.set("Page title", document.title);
        const payloadEntries = Array.from(payload.entries());

        if (submit) {
          submit.disabled = true;
          submit.dataset.originalLabel = submit.dataset.originalLabel || submit.textContent.trim();
          submit.textContent = "Sending...";
        }

        form.setAttribute("aria-busy", "true");

        try {
          const method = (form.getAttribute("method") || "POST").toUpperCase();

          try {
            await submitFormPayload(endpoint, method, payloadEntries);
          } catch (primaryError) {
            if (!fallbackEndpoint || fallbackEndpoint === endpoint) {
              throw primaryError;
            }
            await submitFormPayload(fallbackEndpoint, method, payloadEntries);
          }

          form.reset();
          if (success) {
            success.textContent =
              form.dataset.successCopy || "Your form was sent successfully. We will review it and reply from the inbox connected to this form.";
            success.hidden = false;
          }
          trackEvent("contact_form_submitted", { form: formName });

          if (form.dataset.successRedirect) {
            const redirectDelay = clampNumber(form.dataset.successDelay, 350, 0, 4000);
            window.setTimeout(function () {
              window.location.assign(runtimeUrl(form.dataset.successRedirect));
            }, redirectDelay);
          }
        } catch (submissionError) {
          if (error) {
            error.textContent = submissionError.message || "The form could not be sent right now.";
            error.hidden = false;
          }
          trackEvent("contact_form_error", {
            form: formName,
            label: (submissionError.message || "error").slice(0, 80)
          });
        } finally {
          if (submit) {
            submit.disabled = false;
            submit.textContent = submit.dataset.originalLabel || "Send";
          }
          form.setAttribute("aria-busy", "false");
        }
      });

      if (trackingConfig.trackFormFocus) {
        form.querySelectorAll("input, textarea, select").forEach(function (field) {
          if (field.type === "hidden") return;
          field.addEventListener(
            "focus",
            function () {
              if (started) return;
              started = true;
              trackEvent("contact_form_started", {
                form: form.getAttribute("name") || form.dataset.formKind || "enquiry"
              });
            },
            { once: true }
          );
        });
      }
    });
  }

  // ==========================================================================
  // JS Section: FAQ Behavior
  // Tracks opened FAQ items so analytics can show which answers are useful.
  // ==========================================================================
  function setupFaq() {
    document.querySelectorAll("details[data-faq]").forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (!item.open) return;
        trackEvent("faq_expand", {
          label: item.querySelector("summary")?.textContent.trim() || "FAQ"
        });
      });
    });
  }

  // ==========================================================================
  // JS Section: Orbot Routing Data
  // Typo fixes, intent definitions, and helper functions that map plain-language
  // visitor goals to the best site routes.
  // ==========================================================================
  const orbotTypos = {
    servces: "services",
    proccess: "process",
    procress: "process",
    discovert: "discovery",
    paymant: "payment",
    schedul: "schedule",
    calender: "calendly",
    whatsap: "whatsapp",
    projeto: "projeto",
    orcamento: "orcamento",
    consultoriaa: "consultoria",
    descobreta: "descoberta"
  };

  const orbotIntents = [
    {
      id: "services",
      phrases: ["what services", "show services", "servicos", "servicos voce oferece", "service options"],
      tokens: ["services", "service", "design", "redesign", "rebuild", "servicos", "servico", "site"],
      routes: ["/services/", "/examples/"],
      reply: {
        en: "Best page: Services. Open Portfolio after that if you want proof of style and quality.",
        pt: "Melhor pagina: Services. Depois abra Portfolio para ver qualidade e direcao."
      }
    },
    {
      id: "process",
      phrases: ["how process works", "como funciona o processo", "project timeline", "etapas do projeto"],
      tokens: ["process", "timeline", "steps", "workflow", "processo", "etapas", "prazo"],
      routes: ["/process/", "/discovery/"],
      reply: {
        en: "Best page: Process. It shows each phase and what happens next.",
        pt: "Melhor pagina: Process. Mostra fases e proximos passos."
      }
    },
    {
      id: "work",
      phrases: ["show work", "show portfolio", "mostrar portfolio", "case studies", "trabalhos"],
      tokens: ["work", "portfolio", "examples", "case", "trabalhos", "portfolio", "exemplos"],
      routes: ["/examples/", "/services/"],
      reply: {
        en: "Best page: Portfolio. Use Services next if you want exact deliverables.",
        pt: "Melhor pagina: Portfolio. Depois use Services para ver entregaveis."
      }
    },
    {
      id: "discovery",
      phrases: ["start discovery", "discovery route", "rota de descoberta", "descoberta", "discovery questionnaire"],
      tokens: ["discovery", "questionnaire", "brief", "descoberta", "questionario", "estrategia"],
      routes: ["/discovery/", "/payments/"],
      reply: {
        en: "Best page: Discovery. Use this when you need strategy before build.",
        pt: "Melhor pagina: Discovery. Use quando quiser estrategia antes da execucao."
      }
    },
    {
      id: "launch",
      phrases: ["start project", "launch site", "iniciar projeto", "site novo", "quote request"],
      tokens: ["start", "launch", "project", "quote", "budget", "projeto", "orcamento", "iniciar"],
      routes: ["/launch/", "/contact/", "/discovery/"],
      reply: {
        en: "Best page: Launch. This is the direct intake when you are ready to start now.",
        pt: "Melhor pagina: Launch. Entrada direta para iniciar agora."
      }
    },
    {
      id: "contact",
      phrases: ["contact route", "talk to someone", "falar com voces", "mandar mensagem"],
      tokens: ["contact", "email", "whatsapp", "message", "contato", "mensagem", "falar"],
      routes: ["/contact/", "/discovery/"],
      reply: {
        en: "Best page: Contact. Fast human page for quick alignment.",
        pt: "Melhor pagina: Contact. Pagina humana rapida para alinhar contexto."
      }
    },
    {
      id: "payments",
      phrases: ["how to pay", "payment options", "forma de pagamento", "stripe paypal pix"],
      tokens: ["payment", "pay", "stripe", "paypal", "pix", "pagamento", "pagar", "consultoria"],
      routes: ["/payments/", "/schedule/", "/discovery/"],
      reply: {
        en: "Best page: Payments. After payment, continue to Schedule.",
        pt: "Melhor pagina: Payments. Depois do pagamento, siga para Schedule."
      }
    },
    {
      id: "schedule",
      phrases: ["book meeting", "schedule call", "agendar reuniao", "marcar horario"],
      tokens: ["schedule", "meeting", "book", "slot", "calendly", "agendar", "reuniao", "horario"],
      routes: ["/schedule/", "/payments/"],
      reply: {
        en: "Best page: Schedule. Use it to lock your consultation slot.",
        pt: "Melhor pagina: Schedule. Use para travar seu horario."
      }
    }
  ];

  const orbotSiteByUrl = siteIndex.reduce(function (collection, entry) {
    collection[entry.url] = entry;
    return collection;
  }, {});

  function resolvePriorityRoutePath() {
    const trimmed = String(orbotConfig.primaryCtaPriority || "launch")
      .trim()
      .replace(/^\/+|\/+$/g, "");
    return trimmed ? `/${trimmed}/` : "/launch/";
  }

  const orbotPrimaryRoute = resolvePriorityRoutePath();

  function normalizeOrbotText(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s/-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenizeOrbotQuery(normalizedText) {
    return normalizedText
      .split(" ")
      .map(function (token) {
        return token.trim();
      })
      .filter(Boolean)
      .map(function (token) {
        return orbotTypos[token] || token;
      });
  }

  function detectOrbotLanguage() {
    const siteLang = String(document.documentElement.getAttribute("lang") || "en")
      .toLowerCase()
      .trim();
    if (siteLang.startsWith("pt")) return "pt";
    return "en";
  }

  function scoreOrbotIntent(intent, normalizedText, tokens, tokenSet) {
    let score = 0;
    intent.phrases.forEach(function (phrase) {
      if (normalizedText.includes(phrase)) score += 7;
    });
    intent.tokens.forEach(function (token) {
      if (tokenSet.has(token)) {
        score += 4;
      } else if (token.length > 4) {
        const stem = token.slice(0, 4);
        if (tokens.some(function (word) { return word.startsWith(stem); })) score += 2;
      }
    });
    if (tokens.length <= 2 && intent.tokens.some(function (token) { return token === normalizedText; })) {
      score += 3;
    }
    return score;
  }

  function searchSiteIndex(query) {
    const normalizedText = normalizeOrbotText(query);
    const tokens = tokenizeOrbotQuery(normalizedText);
    const tokenSet = new Set(tokens);
    if (!tokens.length) return [];

    return siteIndex
      .map(function (entry) {
        const title = normalizeOrbotText(entry.title);
        const description = normalizeOrbotText(entry.description);
        const keywords = entry.keywords.map(normalizeOrbotText);
        let score = 0;

        if (title.includes(normalizedText)) score += 8;
        if (description.includes(normalizedText)) score += 4;
        tokens.forEach(function (token) {
          if (title.includes(token)) score += 4;
          if (description.includes(token)) score += 2;
          keywords.forEach(function (keyword) {
            if (keyword === token) score += 4;
            if (keyword.includes(token) || token.includes(keyword)) score += 2;
          });
        });
        if (tokenSet.has("launch") && entry.url === "/launch/") score += 3;
        return { entry, score };
      })
      .filter(function (item) {
        return item.score > 0;
      })
      .sort(function (left, right) {
        return right.score - left.score;
      })
      .slice(0, 4)
      .map(function (item) {
        return item.entry;
      });
  }

  function buildOrbotResults(urls, fallbackQuery) {
    const mergedUrls = [orbotPrimaryRoute].concat(urls || []);
    const searchMatches = searchSiteIndex(fallbackQuery || "").map(function (entry) {
      return entry.url;
    });
    mergedUrls.push.apply(mergedUrls, searchMatches);

    const seen = new Set();
    const entries = [];
    mergedUrls.forEach(function (url) {
      if (!orbotSiteByUrl[url] || seen.has(url)) return;
      seen.add(url);
      entries.push(orbotSiteByUrl[url]);
    });

    return entries.slice(0, 3);
  }

  function resolveOrbotReply(query) {
    const normalizedText = normalizeOrbotText(query);
    const tokens = tokenizeOrbotQuery(normalizedText);
    const tokenSet = new Set(tokens);
    const language = detectOrbotLanguage();

    if (!tokens.length) {
      return {
        intent: "fallback",
        state: "fallback",
        confidence: "low",
        language: language,
        message:
          language === "pt"
            ? "Diga seu objetivo em uma frase e eu envio a pagina certa."
            : "Tell me your goal in one sentence and I will send the right page.",
        results: buildOrbotResults(["/discovery/", "/contact/"], normalizedText)
      };
    }

    let winner = null;
    let winnerScore = 0;
    orbotIntents.forEach(function (intent) {
      const score = scoreOrbotIntent(intent, normalizedText, tokens, tokenSet);
      if (score > winnerScore) {
        winner = intent;
        winnerScore = score;
      }
    });

    if (!winner || winnerScore < 6) {
      return {
        intent: "fallback",
        state: "fallback",
        confidence: "low",
        language: language,
        message:
          language === "pt"
            ? "Nao ficou claro ainda. Use uma destas paginas seguras."
            : "Not clear yet. Use one of these safe pages.",
        results: buildOrbotResults(["/discovery/", "/contact/"], normalizedText)
      };
    }

    return {
      intent: winner.id,
      state: "resolved",
      confidence: winnerScore >= 14 ? "high" : winnerScore >= 9 ? "medium" : "low",
      language: language,
      message: winner.reply[language] || winner.reply.en,
      results: buildOrbotResults(winner.routes, normalizedText)
    };
  }

  function renderOrbotResults(intent, results) {
    if (!results?.length) return "";
    return `
      <div class="orbot-results">
        ${results
          .map(function (result) {
            return `
              <a
                class="orbot-results__item"
                href="${runtimeUrl(result.url)}"
                data-track="orbot_cta_click"
                data-track-label="${escapeHtml(`${intent}:${result.title}`)}"
              >
                <span>
                  <strong>${escapeHtml(result.title)}</strong>
                  <small>Open page</small>
                </span>
                ${icon("arrow")}
              </a>
            `;
          })
          .join("")}
      </div>
    `;
  }

  // ==========================================================================
  // JS Section: Orbot Assistant UI Controller
  // Opens/closes the assistant, validates input, renders replies/results, and
  // preserves keyboard focus without changing the rest of the page.
  // ==========================================================================
  function setupOrbotAssistant() {
    const launcher = document.querySelector("[data-orbot-launcher]");
    const root = document.querySelector("[data-orbot-root]");
    const panel = root?.querySelector(".orbot__panel");
    const log = root?.querySelector("[data-orbot-log]");
    const form = root?.querySelector("[data-orbot-form]");
    const input = root?.querySelector("[data-orbot-input]");
    const submit = root?.querySelector("[data-orbot-submit]");
    const status = root?.querySelector("[data-orbot-status]");
    if (!launcher || !root || !panel || !log || !form || !input || !submit || !status) return;

    const shortcut = orbotConfig.shortcutKey || "/";
    let isOpen = false;
    let replyTimer = 0;
    let previousFocus = null;

    function getFocusableNodes() {
      return Array.from(
        panel.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(function (node) {
        return !node.hasAttribute("hidden") && node.offsetParent !== null;
      });
    }

    function setState(state) {
      root.dataset.orbotState = state;
      launcher.dataset.orbotState = state;
    }

    function resetSession() {
      window.clearTimeout(replyTimer);
      log.innerHTML = "";
      input.value = "";
      submit.disabled = false;
      status.hidden = true;
      status.textContent = "";
      setState("closed");
    }

    function addEntry(role, text, intent, results) {
      const label = role === "assistant" ? "Orbot" : "You";
      log.insertAdjacentHTML(
        "beforeend",
        `
          <article class="orbot-entry orbot-entry--${role}">
            <span class="orbot-entry__label">${label}</span>
            <p class="orbot-entry__text">${escapeHtml(text)}</p>
            ${role === "assistant" ? renderOrbotResults(intent || "page", results) : ""}
          </article>
        `
      );
      log.scrollTop = log.scrollHeight;
    }

    function addWelcome() {
      addEntry(
        "assistant",
        "Tell me your goal. I will send you to the right page.",
        "welcome",
        buildOrbotResults(["/discovery/", "/services/"], "welcome")
      );
    }

    function openPanel(source) {
      if (isOpen) return;
      isOpen = true;
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      root.hidden = false;
      launcher.setAttribute("aria-expanded", "true");
      document.body.classList.add("has-orbot-open");
      setState("open");
      if (!log.childElementCount) addWelcome();
      window.setTimeout(function () {
        input.focus();
      }, 24);
      trackEvent("orbot_open", { label: source || "launcher" });
    }

    function closePanel(reason) {
      if (!isOpen) return;
      isOpen = false;
      root.hidden = true;
      launcher.setAttribute("aria-expanded", "false");
      document.body.classList.remove("has-orbot-open");
      resetSession();
      trackEvent("orbot_close", { label: reason || "dismiss" });
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      } else {
        launcher.focus();
      }
    }

    function submitQuery(rawValue, source) {
      const value = String(rawValue || "").trim();
      if (!value || submit.disabled) return;

      const limited = value.slice(0, orbotConfig.maxQueryLength);
      addEntry("user", limited);
      input.value = "";
      status.hidden = false;
      status.textContent = "Routing...";
      submit.disabled = true;
      setState("processing");
      trackEvent("orbot_query", { label: limited.slice(0, 80), source: source || "input" });

      replyTimer = window.setTimeout(function () {
        const reply = resolveOrbotReply(limited);
        addEntry("assistant", reply.message, reply.intent, reply.results);
        submit.disabled = false;
        status.hidden = true;
        status.textContent = "";
        setState(reply.state === "fallback" ? "fallback" : "resolved");
        trackEvent("orbot_intent", {
          label: reply.intent,
          confidence: reply.confidence,
          language: reply.language
        });
        if (reply.state === "fallback") {
          trackEvent("orbot_fallback", { label: limited.slice(0, 80) });
        }
      }, 260);
    }

    launcher.addEventListener("click", function () {
      openPanel("launcher");
    });

    root.querySelectorAll("[data-orbot-close]").forEach(function (control) {
      control.addEventListener("click", function () {
        closePanel("close_control");
      });
    });

    root.querySelectorAll("[data-orbot-suggestion]").forEach(function (button) {
      button.addEventListener("click", function () {
        submitQuery(button.getAttribute("data-orbot-suggestion"), "suggestion");
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitQuery(input.value, "input");
    });

    root.addEventListener("click", function (event) {
      if (event.target.closest(".orbot-results__item")) {
        closePanel("result_click");
      }
    });

    document.addEventListener("keydown", function (event) {
      const active = document.activeElement;
      const inField =
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.tagName === "SELECT" ||
          active.isContentEditable);

      if (event.key === shortcut && !inField) {
        event.preventDefault();
        openPanel("shortcut");
      }

      if (!isOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel("escape");
        return;
      }

      if (event.key !== "Tab") return;
      const nodes = getFocusableNodes();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  // ==========================================================================
  // JS Section: Initialization Order
  // Runs head setup first, loads partials, then enables progressive interaction
  // enhancements once the shared shell exists in the DOM.
  // ==========================================================================
  async function init() {
    rewriteRootRelativeUrls(document.body);
    await injectShell();
    setupSeo();
    setupTrackingConsent();
    setupAnalytics();
    setupPageStructure();
    decorateStage();
    setupTrackedClicks();
    setupScrollDepthTracking();
    setupReveal();
    setupTiltCards();
    setupSectionVisuals();
    setupSectionIntroRails();
    setupContentSequencing();
    setupSceneMotion();
    setupMediaPerformance();
    setupVideoEngagementTracking();
    setupBackToTop();
    setupOrbotAssistant();
    setupLayoutScaffold();
    setupDiscoveryBrief();
    setupBriefNav();
    setupPaymentPrefill();
    setupForms();
    setupFaq();
    rewriteRootRelativeUrls(document.body);
    trackPageView();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init().catch(function (error) {
        console.error(error);
      });
    });
  } else {
    init().catch(function (error) {
      console.error(error);
    });
  }
})();
