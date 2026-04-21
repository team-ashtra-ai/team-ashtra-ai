(function () {
  const config = window.AshtraConfig || {};
  const page = document.body.dataset.page || "home";
  const contactFormEndpoint = config.contactFormEndpoint || "https://formspree.io/f/mbdqovoj";
  const consultationFormEndpoint = config.consultationFormEndpoint || "https://formspree.io/f/xaqaogoo";
  const discoveryFormEndpoint =
    config.discoveryFormEndpoint || consultationFormEndpoint || "https://formspree.io/f/xaqaogoo";
  const orbotConfig = resolveOrbotConfig(config.orbot);

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
          : "start-project",
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

  const navItems = [
    { href: "/", label: "Home", match: "/" },
    { href: "/about/", label: "About", match: "/about/" },
    { href: "/services/", label: "Services", match: "/services/" },
    { href: "/process/", label: "Process", match: "/process/" },
    { href: "/examples/", label: "Portfolio", match: "/examples/" },
    { href: "/discovery/", label: "Discovery", match: "/discovery/" },
    { href: "/contact/", label: "Contact", match: "/contact/" }
  ];

  const footerAtlasLinks = [
    { title: "Home", url: "/" },
    { title: "About", url: "/about/" },
    { title: "Services", url: "/services/" },
    { title: "Process", url: "/process/" },
    { title: "Portfolio", url: "/examples/" },
    { title: "Discovery", url: "/discovery/" },
    { title: "Contact", url: "/contact/" },
    { title: "Launch Site", url: "/start-project/" },
    { title: "Pay Consultation", url: "/pay-consultation/" },
    { title: "Schedule Meeting", url: "/schedule-meeting/" },
    { title: "FAQ", url: "/faq/" },
    { title: "Privacy", url: "/privacy/" },
    { title: "Terms", url: "/terms/" },
    { title: "Cookies", url: "/cookies/" },
    { title: "Accessibility", url: "/accessibility/" }
  ];

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
      title: "Launch Site",
      url: "/start-project/",
      description: "The direct project intake form for businesses ready to launch, rebuild, or upgrade key pages.",
      keywords: ["start", "project", "consultation", "brief", "quote", "kickoff"]
    },
    {
      title: "Discovery",
      url: "/discovery/",
      description: "The two-route discovery page with a paid consultation option and the full project questionnaire.",
      keywords: ["discovery", "consultation", "brief", "strategy", "planning", "questionnaire"]
    },
    {
      title: "Pay Consultation",
      url: "/pay-consultation/",
      description: "The paid consultation page with coverage, payment routes, and the sharper strategy-first path.",
      keywords: ["book", "call", "payment", "consultation", "stripe", "paypal", "pix", "strategy"]
    },
    {
      title: "Schedule Meeting",
      url: "/schedule-meeting/",
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

  const pageSeo = {
    home: {
      title: "ASH-TRA | Modern websites for ambitious businesses",
      description:
        "ASH-TRA builds modern websites and sharper digital presence for ambitious businesses that want more trust, more pull, and more momentum.",
      path: "/",
      ogAlt: "ASH-TRA homepage social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ASH-TRA",
          url: "https://ash-tra.com/",
          logo: "https://ash-tra.com/brand/ash-tra-logo.png",
          image: "https://ash-tra.com/brand/ash-tra-social-lockup.png",
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
      title: "About ASH-TRA | Built for companies that are done looking behind",
      description:
        "Learn what ASH-TRA stands for, who it helps, and how stronger digital presence changes trust, positioning, and momentum.",
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
    services: {
      title: "Services | ASH-TRA",
      description:
        "Explore ASH-TRA services for strategy, message, website launches, redesigns, full rebuilds, SEO foundations, systems, performance, and support.",
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
    process: {
      title: "Process | ASH-TRA",
      description:
        "See the ASH-TRA process from discovery and direction through build, refinement, optimisation, and support.",
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
      title: "Discovery | ASH-TRA",
      description:
        "Choose the ASH-TRA discovery route that fits: paid consultation for real strategy or the questionnaire for an approximate offer within 48 hours excluding weekends.",
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
    "pay-consultation": {
      title: "Pay Consultation | ASH-TRA",
      description:
        "Choose the paid consultation route, request Stripe, PayPal, or Pix, and start your project with real strategic direction.",
      path: "/pay-consultation/",
      ogAlt: "ASH-TRA paid consultation page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "ASH-TRA Paid Consultation",
          serviceType: "Discovery consultation",
          provider: { "@type": "Organization", name: "ASH-TRA", url: "https://ash-tra.com/" },
          url: "https://ash-tra.com/pay-consultation/",
          description:
            "A paid consultation for founders and teams who want sharper direction before the build begins."
        }
      ]
    },
    "schedule-meeting": {
      title: "Schedule Meeting | ASH-TRA",
      description:
        "Book your paid ASH-TRA consultation slot, prepare properly, and move into the strongest next direction for the project.",
      path: "/schedule-meeting/",
      ogAlt: "ASH-TRA schedule meeting page social preview",
      schemas: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Schedule Meeting",
          url: "https://ash-tra.com/schedule-meeting/",
          description:
            "Choose your consultation slot and come ready with the context that matters."
        }
      ]
    },
    faq: {
      title: "FAQ | ASH-TRA",
      description:
        "Read clear answers about ASH-TRA services, paid consultations, discovery, SEO, analytics, performance, support, and fit.",
      path: "/faq/",
      ogAlt: "ASH-TRA FAQ page social preview",
      schemas: []
    },
    terms: {
      title: "Terms of Service | ASH-TRA",
      description:
        "Read the ASH-TRA terms covering consultations, project scope, payments, revisions, ownership, and general site use.",
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
        "Read how cookies and similar technologies may be used on ash-tra.com for functionality, measurement, and performance improvement.",
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
    }
  };

  function icon(name) {
    const icons = {
      arrow:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h12M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>',
      menu:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.9"/></svg>',
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

  function pathName() {
    const path = window.location.pathname;
    if (path === "/" || path === "/index.html") return "/";
    return path.endsWith("/") ? path : `${path}/`;
  }

  function isActive(match) {
    const current = pathName();
    if (match === "/") return current === "/";
    return current.startsWith(match);
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

  function headerMarkup() {
    return `
      <header class="site-header">
        <div class="site-header__inner">
          <a class="brand-lockup" href="/" aria-label="ASH-TRA home">
            <img class="brand-lockup__mark" src="/brand/ash-tra-logo.png" alt="ASH-TRA logo mark" />
            <span class="brand-lockup__meta">
              <span class="brand-lockup__title">ASH-TRA</span>
              <span class="brand-lockup__tag">Where ambition meets momentum.</span>
            </span>
          </a>
          <button class="site-header__toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open navigation">
            ${icon("menu")}
          </button>
          <nav class="site-nav" id="site-nav" aria-label="Primary">
            <div class="site-nav__links">
              ${navItems
                .map(
                  (item) =>
                    `<a href="${item.href}" class="${isActive(item.match) ? "is-active" : ""}">${item.label}</a>`
                )
                .join("")}
            </div>
            <div class="site-nav__cta">
              <a class="button button--primary" href="/start-project/" data-track="start_project_click">
                ${icon("arrow")}
                <span>Launch Site</span>
              </a>
            </div>
          </nav>
        </div>
      </header>
    `;
  }

  function footerMarkup() {
    return `
      <footer class="site-footer">
        <div class="site-footer__inner">
          <div class="site-footer__main surface footer-mega">
            <section class="footer-brand" data-reveal>
              <div class="footer-brand__lockup">
                <img src="/brand/ash-tra-logo.png" alt="ASH-TRA logo mark" />
                <div>
                  <p class="footer-brand__title">ASH-TRA</p>
                  <p class="footer-brand__tag">LOOK LIKE THE BUSINESS YOU ARE BECOMING.</p>
                </div>
              </div>
              <p class="footer-brand__text">
                ASH-TRA builds modern digital presence for ambitious companies that want more
                trust, more pull, and more momentum.
              </p>
              <div class="footer-brand__actions">
                <a class="button button--primary" href="/start-project/" data-track="start_project_click">Launch Site</a>
                <a class="button button--secondary" href="/discovery/" data-track="discovery_view">Discover your voice</a>
              </div>
            </section>

            <section class="footer-sitemap" data-reveal aria-label="Site Atlas">
              <div class="footer-sitemap__head">
                <strong>Site Atlas</strong>
                <p>Clear signal. Strong routes. No dead ends.</p>
              </div>
              <div class="footer-sitemap__grid">
                ${footerAtlasLinks
                  .map(
                    (item) => `
                      <a class="footer-sitemap__link" href="${item.url}">
                        <span>${item.title}</span>
                        ${icon("arrow")}
                      </a>
                    `
                  )
                  .join("")}
              </div>
            </section>

            <div class="site-footer__columns">
              <section class="footer-column" data-reveal>
                <strong>Explore</strong>
                <a href="/about/">About</a>
                <a href="/services/">Services</a>
                <a href="/process/">Process</a>
              </section>
              <section class="footer-column" data-reveal>
                <strong>Start</strong>
                <a href="/start-project/">Launch Site</a>
                <a href="/pay-consultation/">Pay Consultation</a>
                <a href="/schedule-meeting/">Schedule Meeting</a>
                <a href="/discovery/">Discovery</a>
                <a href="/contact/">Contact</a>
              </section>
              <section class="footer-column" data-reveal>
                <strong>Reference</strong>
                <a href="/examples/">Portfolio</a>
                <a href="/faq/">FAQ</a>
                <a href="/accessibility/">Accessibility</a>
              </section>
            </div>
          </div>
          <div class="site-footer__bottom">
            <p>&copy; ${new Date().getFullYear()} ash-tra.com</p>
          </div>
        </div>
      </footer>
    `;
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
              <img src="/brand/orbot-avatar.svg" alt="" />
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
          <img class="floating-action__avatar orbot-launcher__avatar" src="/brand/orbot-avatar.svg" alt="" aria-hidden="true" />
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

  function setLink(rel, href) {
    if (!href) return;
    let tag = document.head.querySelector(`link[rel="${rel}"]`);
    if (!tag) {
      tag = document.createElement("link");
      tag.setAttribute("rel", rel);
      document.head.appendChild(tag);
    }
    tag.setAttribute("href", href);
  }

  function setupSeo() {
    const seo = pageSeo[page];
    if (!seo) return;

    document.title = seo.title;
    setMeta("description", seo.description);
    setMeta("robots", "index,follow,max-image-preview:large");
    setMeta("theme-color", "#090d16");
    setMeta("og:title", seo.title, "property");
    setMeta("og:description", seo.description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:site_name", "ASH-TRA", "property");
    setMeta("og:url", `https://ash-tra.com${seo.path}`, "property");
    setMeta("og:image", "https://ash-tra.com/brand/ash-tra-social-lockup.png", "property");
    setMeta("og:image:alt", seo.ogAlt, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
    setMeta("twitter:image", "https://ash-tra.com/brand/ash-tra-social-lockup.png");
    setMeta("twitter:image:alt", seo.ogAlt);
    setLink("canonical", `https://ash-tra.com${seo.path}`);
    setLink("icon", "/brand/favicon-32.png");
    setLink("apple-touch-icon", "/brand/apple-touch-icon.png");
    setLink("manifest", "/site.webmanifest");

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

  function injectShell() {
    const headerTarget = document.querySelector("[data-site-header]");
    const footerTarget = document.querySelector("[data-site-footer]");
    if (headerTarget) headerTarget.innerHTML = headerMarkup();
    if (footerTarget) footerTarget.innerHTML = footerMarkup();
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

    const hero = main.querySelector(".hero-mast, .hero-cinema, .hero, .policy-hero");
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
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 6}s`;
      star.style.animationDuration = `${4 + Math.random() * 6}s`;
      star.style.opacity = (0.28 + Math.random() * 0.72).toFixed(2);
      star.style.transform = `scale(${0.55 + Math.random() * 1.4})`;
      starLayer.appendChild(star);
    }

    const cometLayer = document.createElement("div");
    cometLayer.className = "site-stage__comets";
    cometLayer.innerHTML = '<span class="site-stage__comet"></span><span class="site-stage__comet site-stage__comet--alt"></span>';

    stage.appendChild(starLayer);
    stage.appendChild(cometLayer);
  }

  function trackEvent(name, detail) {
    const payload = { event: name, page, ...(detail || {}) };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    if (typeof window.gtag === "function" && name !== "page_view") {
      window.gtag("event", name, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        ...(detail || {})
      });
    }
  }

  function setupTrackedClicks() {
    document.addEventListener("click", function (event) {
      const element = event.target.closest("[data-track]");
      if (!element) return;
      trackEvent(element.getAttribute("data-track"), {
        label: element.getAttribute("data-track-label") || element.textContent.trim()
      });
    });
  }

  function setupNav() {
    const toggle = document.querySelector(".site-header__toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    function setOpen(isOpen) {
      toggle.setAttribute("aria-expanded", String(isOpen));
      nav.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("has-nav-open", isOpen);
      toggle.innerHTML = isOpen ? icon("close") : icon("menu");
      toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll("a, button").forEach(function (item) {
      item.addEventListener("click", function () {
        if (window.matchMedia("(min-width: 960px)").matches) return;
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 960px)").matches) {
        setOpen(false);
      }
    });
  }

  function setupHeaderState() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const update = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 18);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

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
      item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
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
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 960px)").matches) {
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
        if (targetId) setActive(targetId);
      });
    });

    setActive(sections[0].id);
  }

  function setupSceneMotion() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

  function setupHeroMediaLayers() {
    const heroManifest = {
      home: {
        src: "/assets/media/heroes/home-hero-orbital-launch-business-growth.svg",
        alt: "Cinematic orbital launch scene representing premium website design and business growth for ambitious brands.",
        label: "Launch stronger",
        route: "Trajectory locked",
        ticker: "LOOK SHARPER • LAND HARDER • GROW WITH MORE PULL • ",
        blurb: "A stronger front door changes the first read before you ever speak.",
        chips: ["Premium website design", "Sharper signal", "Business growth"],
        stats: [
          ["Focus", "Front-door authority"],
          ["Direction", "Orbit to action"]
        ]
      },
      about: {
        src: "/assets/media/heroes/about-hero-deep-space-brand-positioning.svg",
        alt: "Deep-space horizon with orbital rings representing stronger brand positioning and a higher-level public read.",
        label: "Stronger read",
        route: "Larger trajectory",
        ticker: "LOOK STRONGER • READ STRONGER • HARDER TO IGNORE • ",
        blurb: "The company gets judged at the level the surface suggests. Raise the read.",
        chips: ["Brand positioning", "Public read", "Momentum"],
        stats: [
          ["Bias", "Clear signal"],
          ["Fit", "Ambitious businesses"]
        ]
      },
      services: {
        src: "/assets/media/heroes/services-hero-satellite-network-website-services.svg",
        alt: "Dark satellite network over a blue orbital body representing connected website services, SEO systems, and digital momentum.",
        label: "Connected services",
        route: "Strategy to systems",
        ticker: "STRATEGY • BUILD • SYSTEMS • MOMENTUM • ",
        blurb: "Different jobs. Same standard. Every lane should move the company forward.",
        chips: ["Strategy", "Build", "SEO systems"],
        stats: [
          ["Signal", "Technical depth"],
          ["Outcome", "Harder to ignore"]
        ]
      },
      process: {
        src: "/assets/media/heroes/process-hero-flight-path-web-design-process.svg",
        alt: "Flight-path route diagram representing a clear website design process from discovery through support.",
        label: "No drift",
        route: "Discovery to support",
        ticker: "DISCOVERY • DIRECTION • BUILD • SUPPORT • ",
        blurb: "Clear stages keep the work moving without bloated loops or weak handoffs.",
        chips: ["Discovery", "Direction", "Build", "Support"],
        stats: [
          ["System", "Clear milestones"],
          ["Movement", "Forward only"]
        ]
      },
      contact: {
        src: "/assets/media/heroes/contact-hero-beacon-route-project-enquiry.svg",
        alt: "Beacon-style space route visual representing a clear contact path for businesses ready to start a website project.",
        label: "Choose a route",
        route: "Fastest next step",
        ticker: "START PROJECT • BOOK CALL • SEND THE BRIEF • ",
        blurb: "Pick the route that matches the level of clarity you already have.",
        chips: ["Start project", "Book call", "Discovery form"],
        stats: [
          ["Signal", "Route matched"],
          ["Speed", "Less friction"]
        ]
      },
      "start-project": {
        src: "/assets/media/heroes/start-project-hero-launch-control-website-projects.svg",
        alt: "Launch-control scene representing direct website project intake for businesses ready to start.",
        label: "Direct intake",
        route: "Launch route ready",
        ticker: "LAUNCH • REBUILD • HIGH-VALUE PAGES • ",
        blurb: "If the job is clear, skip the drag and move straight into review.",
        chips: ["Launch", "Rebuild", "High-value pages"],
        stats: [
          ["Use case", "Ready-to-move teams"],
          ["State", "Project scope clear"]
        ]
      },
      "schedule-meeting": {
        src: "/assets/media/heroes/schedule-meeting-hero-docking-window-consultation-booking.svg",
        alt: "Docking-window style scene representing consultation booking, scheduling precision, and a clear next step.",
        label: "Window open",
        route: "Book the slot",
        ticker: "BOOKED • FOCUSED • MOVING • ",
        blurb: "Lock the time, show up ready, and move straight into what matters.",
        chips: ["Time locked", "Prepared call", "Clear next step"],
        stats: [
          ["Mode", "Precision booking"],
          ["Rhythm", "Booked. Focused."]
        ]
      },
      "pay-consultation": {
        src: "/assets/media/heroes/pay-consultation-hero-strategic-briefing-website-consultation.svg",
        alt: "Strategic briefing scene representing paid website consultation, clarity, and direction before the build begins.",
        label: "Briefing route",
        route: "Clarity first",
        ticker: "CLEAR FIRST • BUILD SECOND • LOWER RISK • ",
        blurb: "Start with the sharper outside read before the build commits in the wrong direction.",
        chips: ["Consultation", "Direction", "Lower risk"],
        stats: [
          ["Goal", "Reduce guesswork"],
          ["Result", "Stronger starting point"]
        ]
      },
      faq: {
        src: "/assets/media/heroes/faq-hero-knowledge-atlas-business-questions.svg",
        alt: "Atlas-style space map representing business questions, clear answers, and decision guidance.",
        label: "Question atlas",
        route: "Move by topic",
        ticker: "QUESTIONS • ANSWERS • CLEAR SIGNAL • ",
        blurb: "Short answers. Clear signal. No endless scroll through noise.",
        chips: ["Offer", "Discovery", "Systems", "Support"],
        stats: [
          ["Read", "Clear answers"],
          ["Flow", "Mapped topics"]
        ]
      },
      privacy: {
        src: "/assets/media/heroes/privacy-hero-secure-data-grid-business-privacy.svg",
        alt: "Secure data grid representing business privacy, controlled information handling, and clear protection standards.",
        label: "Handled properly",
        route: "Secure by design",
        ticker: "COLLECTED CAREFULLY • USED DELIBERATELY • ",
        blurb: "Professional handling should read clearly before anyone sends a detail.",
        chips: ["Collection", "Use", "Retention"],
        stats: [
          ["Policy", "Controlled handling"],
          ["Trust", "Not sold"]
        ]
      },
      terms: {
        src: "/assets/media/heroes/terms-hero-command-grid-commercial-clarity.svg",
        alt: "Command-grid visual representing commercial clarity, scope control, and clear service expectations.",
        label: "Scope matters",
        route: "Commercial clarity",
        ticker: "SCOPE • FEES • OWNERSHIP • EXPECTATIONS • ",
        blurb: "Clear commercial terms remove friction before the real work starts.",
        chips: ["Scope", "Fees", "Ownership"],
        stats: [
          ["Policy", "Clear expectations"],
          ["Read", "Compressed terms"]
        ]
      },
      cookies: {
        src: "/assets/media/heroes/cookies-hero-settings-signal-control-cookie-preferences.svg",
        alt: "Settings control scene representing cookie preferences, consent choices, and site functionality.",
        label: "Preference control",
        route: "Settings and choice",
        ticker: "ESSENTIAL • ANALYTICS • PREFERENCES • CHOICE • ",
        blurb: "Clean settings. Clear choice. No vague language doing too much work.",
        chips: ["Essential", "Analytics", "Preferences"],
        stats: [
          ["Policy", "Functional clarity"],
          ["Signal", "Consent aware"]
        ]
      },
      accessibility: {
        src: "/assets/media/heroes/accessibility-hero-clear-navigation-inclusive-web-usability.svg",
        alt: "Clear navigation scene representing inclusive web usability, readable interfaces, and stronger accessibility standards.",
        label: "Usability first",
        route: "Clear navigation",
        ticker: "READABLE • NAVIGABLE • RESPONSIVE • ",
        blurb: "Clarity should hold up across devices, interactions, and real people using the site.",
        chips: ["Readable", "Navigable", "Responsive"],
        stats: [
          ["Baseline", "Practical accessibility"],
          ["Direction", "Continuous improvement"]
        ]
      },
      examples: {
        src: "/assets/media/heroes/examples-hero-editorial-space-direction-premium-websites.svg",
        alt: "Editorial space horizon representing premium website directions, structured case studies, and stronger creative standards.",
        label: "Selected directions",
        route: "Premium context",
        ticker: "DIRECTION • PACING • CONTRAST • IMPACT • ",
        blurb: "The work should prove the shift, not just throw mood at the page.",
        chips: ["Case direction", "Story pacing", "Visual standard"],
        stats: [
          ["Lens", "Context first"],
          ["Result", "Sharper examples"]
        ]
      }
    };

    const media = heroManifest[page];

    document.querySelectorAll(".hero-mast__stage").forEach(function (stage, index) {
      if (page === "discovery") {
        stage.dataset.heroMode = "discovery";
        return;
      }

      if (!media || index > 0) return;

      stage.dataset.heroMode = "cinematic";
      stage.dataset.heroVariant = page;
      stage.innerHTML = `
        <div class="hero-mast__backdrop" aria-hidden="true"></div>
        <div class="hero-mast__visual" data-scene>
          <div class="hero-mast__media hero-mast__media--cinematic">
            <img src="${media.src}" alt="${media.alt}" loading="eager" />
          </div>
          <div class="hero-mast__overlay hero-mast__overlay--grid" data-depth="0.5"></div>
          <div class="hero-mast__overlay hero-mast__overlay--glow" data-depth="1.2"></div>
          <div class="hero-mast__brand-panel" data-depth="0.4">
            <span class="hero-mast__brand-mark"><img src="/brand/ash-tra-mark.svg" alt="" loading="eager" /></span>
            <p>${media.blurb}</p>
          </div>
          <div class="hero-mast__route-line" data-depth="0.85"><span>${media.route}</span></div>
          <div class="hero-mast__badge hero-mast__badge--primary" data-depth="0.6">${media.label}</div>
          <div class="hero-mast__chip-row hero-mast__chip-row--hero" data-depth="0.8">
            ${media.chips.map(function (chip) { return `<span class="hero-mast__chip">${chip}</span>`; }).join("")}
          </div>
          <div class="hero-mast__stats" data-depth="0.7">
            ${media.stats.map(function (item) { return `<div class="hero-mast__stat-card"><strong>${item[0]}</strong><span>${item[1]}</span></div>`; }).join("")}
          </div>
          <div class="hero-mast__ticker" aria-hidden="true">
            <span>${media.ticker}${media.ticker}${media.ticker}</span>
          </div>
        </div>
      `;
    });
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
      "start-project": "/assets/media/heroes/start-project-hero-launch-control-website-projects.svg",
      "schedule-meeting": "/assets/media/heroes/schedule-meeting-hero-docking-window-consultation-booking.svg",
      "pay-consultation": "/assets/media/heroes/pay-consultation-hero-strategic-briefing-website-consultation.svg",
      faq: "/assets/media/heroes/faq-hero-knowledge-atlas-business-questions.svg",
      privacy: "/assets/media/sections/legal-atlas-systems-business-clarity.svg",
      terms: "/assets/media/sections/legal-atlas-systems-business-clarity.svg",
      cookies: "/assets/media/heroes/cookies-hero-settings-signal-control-cookie-preferences.svg",
      accessibility: "/assets/media/heroes/accessibility-hero-clear-navigation-inclusive-web-usability.svg",
      about: "/assets/media/heroes/about-hero-deep-space-brand-positioning.svg"
    };

    const src = pageVisuals[page];
    if (!src) return;

    document
      .querySelectorAll(".route-card, .service-detail, .faq-shell, .policy-card, .study-card, .card")
      .forEach(function (node, index) {
        if (node.querySelector(".section-visual")) return;

        const label = node.querySelector(".route-card__label, .service-detail__index, .card__icon");
        const visual = document.createElement("div");
        visual.className = "section-visual";
        visual.innerHTML = `
          <img src="${src}" alt="" loading="lazy" />
          <span class="section-visual__mark"><img src="/brand/ash-tra-mark.svg" alt="" loading="lazy" /></span>
          <span class="section-visual__label">${label ? label.textContent.trim() : "Route " + String(index + 1).padStart(2, "0")}</span>
        `;
        node.insertBefore(visual, node.firstChild);

        const arrow = document.createElement("div");
        arrow.className = "surface-arrow";
        arrow.innerHTML = '<img src="/assets/media/overlays/route-arrow-overlay.svg" alt="" loading="lazy" />';
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
        line: "Weak signal creates drag."
      },
      {
        selector: 'body[data-page="about"] .about-band--fit .section-heading--panel',
        src: "/assets/media/sections/about-fit-brand-trajectory-authority.svg",
        alt: "Trajectory and authority scene representing businesses ready for a stronger public read.",
        kicker: "Read at the right level",
        line: "A better surface changes the read."
      },
      {
        selector: 'body[data-page="home"] .home-band--offers .section-heading--panel',
        src: "/assets/media/sections/home-offers-launch-optimise-growth.svg",
        alt: "Launch and optimisation scene representing core website offers for growth-focused businesses.",
        kicker: "Launch. Reset. Optimise.",
        line: "Build the layer that carries the weight."
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
            <span class="section-heading__rail-mark"><img src="/brand/ash-tra-logo.png" alt="ASH-TRA logo mark" loading="lazy" /></span>
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

  // Add simple sequence classes to the handwritten body sections so the CSS can
  // alternate depth and keep long pages from feeling visually repetitive.
  function setupLayoutScaffold() {
    document.querySelectorAll("[data-layout-sequence]").forEach(function (section, index) {
      section.dataset.layoutIndex = String(index + 1);
      section.classList.toggle("is-even", index % 2 === 1);
      section.classList.toggle("is-odd", index % 2 === 0);
    });
  }

  function setupPaymentPrefill() {
    const field = document.querySelector("[data-payment-method-field]");
    if (!field) return;

    document.querySelectorAll("[data-payment-prefill]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        field.value = trigger.getAttribute("data-payment-prefill") || "";
      });
    });
  }

  function resolveFormEndpoint(key) {
    if (key === "contact") return contactFormEndpoint;
    if (key === "consultation") return consultationFormEndpoint;
    if (key === "discovery") return discoveryFormEndpoint;
    return "";
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

        const endpoint =
          form.getAttribute("action") || resolveFormEndpoint(form.getAttribute("data-form-endpoint"));
        if (!endpoint) {
          if (error) error.hidden = false;
          return;
        }

        const formName = form.getAttribute("name") || form.dataset.formKind || "enquiry";
        const payload = new FormData(form);
        payload.set("Page", window.location.href);
        payload.set("Page title", document.title);

        if (submit) {
          submit.disabled = true;
          submit.dataset.originalLabel = submit.dataset.originalLabel || submit.textContent.trim();
          submit.textContent = "Sending...";
        }

        form.setAttribute("aria-busy", "true");

        try {
          const response = await fetch(endpoint, {
            method: (form.getAttribute("method") || "POST").toUpperCase(),
            body: payload,
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
              result?.errors?.map(function (item) {
                return item.message;
              }).join(" ") || "The form could not be sent right now.";
            throw new Error(message);
          }

          form.reset();
          if (success) {
            success.textContent =
              form.dataset.successCopy || "Your form was sent successfully. We will review it and reply from the inbox connected to this form.";
            success.hidden = false;
          }
          trackEvent("contact_form_submitted", { form: formName });
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
    });
  }

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
      routes: ["/discovery/", "/pay-consultation/"],
      reply: {
        en: "Best page: Discovery. Use this when you need strategy before build.",
        pt: "Melhor pagina: Discovery. Use quando quiser estrategia antes da execucao."
      }
    },
    {
      id: "start_project",
      phrases: ["start project", "launch site", "iniciar projeto", "site novo", "quote request"],
      tokens: ["start", "launch", "project", "quote", "budget", "projeto", "orcamento", "iniciar"],
      routes: ["/start-project/", "/contact/", "/discovery/"],
      reply: {
        en: "Best page: Launch Site. This is the direct intake when you are ready to start now.",
        pt: "Melhor pagina: Launch Site. Entrada direta para iniciar agora."
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
      routes: ["/pay-consultation/", "/schedule-meeting/", "/discovery/"],
      reply: {
        en: "Best page: Pay Consultation. After payment, continue to Schedule Meeting.",
        pt: "Melhor pagina: Pay Consultation. Depois do pagamento, siga para Schedule Meeting."
      }
    },
    {
      id: "schedule",
      phrases: ["book meeting", "schedule call", "agendar reuniao", "marcar horario"],
      tokens: ["schedule", "meeting", "book", "slot", "calendly", "agendar", "reuniao", "horario"],
      routes: ["/schedule-meeting/", "/pay-consultation/"],
      reply: {
        en: "Best page: Schedule Meeting. Use it to lock your consultation slot.",
        pt: "Melhor pagina: Schedule Meeting. Use para travar seu horario."
      }
    }
  ];

  const orbotSiteByUrl = siteIndex.reduce(function (collection, entry) {
    collection[entry.url] = entry;
    return collection;
  }, {});

  function resolvePriorityRoutePath() {
    const trimmed = String(orbotConfig.primaryCtaPriority || "start-project")
      .trim()
      .replace(/^\/+|\/+$/g, "");
    return trimmed ? `/${trimmed}/` : "/start-project/";
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
        if (tokenSet.has("launch") && entry.url === "/start-project/") score += 3;
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
                href="${result.url}"
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
      document.body.style.overflow = "hidden";
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
      document.body.style.overflow = "";
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

  function init() {
    injectShell();
    setupSeo();
    setupPageStructure();
    decorateStage();
    setupTrackedClicks();
    setupNav();
    setupHeaderState();
    setupReveal();
    setupTiltCards();
    setupHeroMediaLayers();
    setupSectionVisuals();
    setupSectionIntroRails();
    setupContentSequencing();
    setupSceneMotion();
    setupBackToTop();
    setupOrbotAssistant();
    setupLayoutScaffold();
    setupBriefNav();
    setupPaymentPrefill();
    setupForms();
    setupFaq();
    trackEvent("page_view", {
      title: document.title,
      path: window.location.pathname
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
