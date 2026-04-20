(function () {
  const config = window.AshtraConfig || {};
  const page = document.body.dataset.page || "home";
  const contactFormEndpoint = config.contactFormEndpoint || "https://formspree.io/f/mbdqovoj";
  const consultationFormEndpoint = config.consultationFormEndpoint || "https://formspree.io/f/xaqaogoo";
  const discoveryFormEndpoint =
    config.discoveryFormEndpoint || consultationFormEndpoint || "https://formspree.io/f/xaqaogoo";

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

  const discoveryQuestions = [
    {
      step: "01",
      title: "Business",
      prompt: "What kind of business are we building around?",
      choiceName: "Business mode",
      noteName: "Business notes",
      options: ["Service-led", "Product-led", "Consulting", "Hybrid"],
      placeholder: "What do you sell, who buys it, and why does this moment matter?"
    },
    {
      step: "02",
      title: "Urgency",
      prompt: "Why does the next version need to happen now?",
      choiceName: "Urgency lane",
      noteName: "Urgency notes",
      options: ["Launch", "Rebrand", "Underperforming", "Expansion"],
      placeholder: "Explain the trigger, pressure, or opportunity behind the rebuild."
    },
    {
      step: "03",
      title: "Audience",
      prompt: "Who needs to trust the site fastest?",
      choiceName: "Audience priority",
      noteName: "Audience notes",
      options: ["B2B buyers", "Premium clients", "Investors", "Partners"],
      placeholder: "Describe the exact people you want the site to attract and convince."
    },
    {
      step: "04",
      title: "Mood",
      prompt: "What should the brand feel like on first contact?",
      choiceName: "Brand mood",
      noteName: "Brand mood notes",
      options: ["Cinematic", "Technical", "Minimal", "Editorial"],
      placeholder: "What should visitors feel immediately, and what should the brand never feel like?"
    },
    {
      step: "05",
      title: "Goal",
      prompt: "What is the primary job of the site?",
      choiceName: "Primary site goal",
      noteName: "Primary site goal notes",
      options: ["Leads", "Authority", "Bookings", "Applications"],
      placeholder: "What is the one action or understanding the site must create quickly?"
    },
    {
      step: "06",
      title: "Visuals",
      prompt: "What balance feels right for the new system?",
      choiceName: "Visual balance",
      noteName: "Visual balance notes",
      options: ["Image-led", "Type-led", "Motion-led", "Balanced"],
      placeholder: "Share references, visual cues, colors, motion ideas, or examples you admire."
    },
    {
      step: "07",
      title: "Content",
      prompt: "How ready is the content layer today?",
      choiceName: "Content readiness",
      noteName: "Content readiness notes",
      options: ["Ready", "Partial", "Needs help", "Starting fresh"],
      placeholder: "What copy, imagery, proof, testimonials, or assets already exist?"
    },
    {
      step: "08",
      title: "Tech",
      prompt: "What technical support should the build include?",
      choiceName: "Technical needs",
      noteName: "Technical needs notes",
      options: ["CMS", "Integrations", "Multilingual", "Low maintenance"],
      placeholder: "List the must-have features, integrations, or technical constraints."
    },
    {
      step: "09",
      title: "Timing",
      prompt: "How quickly do you want to move if the fit is right?",
      choiceName: "Project timing",
      noteName: "Project timing notes",
      options: ["Two weeks", "Thirty days", "This quarter", "Flexible"],
      placeholder: "Add any launch dates, deadlines, budget context, or decision windows."
    }
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

  function renderDiscoveryQuestion(question, questionIndex) {
    return `
      <article class="discovery-question" data-reveal>
        <div class="discovery-question__head">
          <span class="discovery-question__step">${question.step}</span>
          <div>
            <h3>${question.title}</h3>
            <p>${question.prompt}</p>
          </div>
        </div>
        <fieldset class="choice-fieldset">
          <legend class="sr-only">${question.prompt}</legend>
          <div class="choice-grid">
            ${question.options
              .map(
                (option, optionIndex) => `
                  <label class="choice-chip">
                    <input
                      type="radio"
                      name="${question.choiceName}"
                      value="${option}"
                      ${optionIndex === 0 ? "required" : ""}
                    />
                    <span>${option}</span>
                  </label>
                `
              )
              .join("")}
          </div>
        </fieldset>
        <div class="field field--note">
          <label for="discovery-note-${questionIndex}">${question.title} notes</label>
          <textarea
            id="discovery-note-${questionIndex}"
            name="${question.noteName}"
            placeholder="${question.placeholder}"
          ></textarea>
        </div>
      </article>
    `;
  }

  function discoveryFormMarkup() {
    return `
      <section class="footer-discovery" id="discovery">
        <div class="footer-discovery__intro" data-reveal>
          <div>
            <span class="eyebrow">Discovery</span>
            <h2 class="section-title">Build the consultation brief with a guided discovery flow.</h2>
          </div>
          <p class="section-text">
            Choose the closest answer for each question, then add detail in the note field beside
            it. The full packet goes to the consultation inbox with your contact details attached.
          </p>
        </div>
        <form
          class="discovery-form"
          action="${discoveryFormEndpoint}"
          method="POST"
          name="discovery-consultation"
          data-enquiry-form
          data-form-kind="discovery"
          data-success-copy="The discovery brief was sent. The connected discovery inbox should now have the full brief."
        >
          <input type="hidden" name="_subject" value="ASH-TRA discovery consultation" />
          <div class="discovery-form__identity">
            <div class="field">
              <label for="discovery-name">Name</label>
              <input id="discovery-name" name="Name" type="text" required />
            </div>
            <div class="field">
              <label for="discovery-email">Email</label>
              <input id="discovery-email" name="Email" type="email" required />
            </div>
            <div class="field">
              <label for="discovery-brand">Brand</label>
              <input id="discovery-brand" name="Brand" type="text" required />
            </div>
            <div class="field">
              <label for="discovery-site">Website</label>
              <input id="discovery-site" name="Website" type="url" placeholder="https://..." />
            </div>
          </div>
          <div class="discovery-form__grid">
            ${discoveryQuestions.map(renderDiscoveryQuestion).join("")}
          </div>
          <div class="discovery-form__actions">
            <button class="button button--primary" type="submit">Send discovery</button>
            <p class="form-note">This goes to the consultation form with every answer labeled and grouped.</p>
          </div>
        </form>
        <p class="success-note" hidden data-form-success></p>
        <p class="error-note" hidden data-form-error>
          The send did not complete. Please try again, or use the contact page while we retry.
        </p>
      </section>
    `;
  }

  function footerDiscoveryMarkup() {
    return `
      <section class="footer-discovery" data-reveal>
        <div class="footer-discovery__intro">
          <div>
            <span class="eyebrow">Discovery</span>
            <h2 class="section-title">Need a deeper consultation route?</h2>
          </div>
          <p class="section-text">
            The dedicated Discovery page keeps the footer clean while still giving the longer
            consultation path a proper place to live.
          </p>
        </div>
        <div class="footer-discovery__route">
          <div class="footer-discovery__meta">
            <p class="footer-discovery__label">What it covers</p>
            <ul class="footer-discovery__list">
              <li>Business model and audience</li>
              <li>Brand mood and visual direction</li>
              <li>Content, timing, and technical needs</li>
            </ul>
          </div>
          <div class="footer-discovery__card">
            <p class="footer-discovery__label">Separate page</p>
            <h3>Open Discovery.</h3>
            <p>Brand direction, strategic context, and the fuller consultation path all live in one calmer route.</p>
            <a class="button button--primary" href="/discovery/">Discovery</a>
          </div>
        </div>
      </section>
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
    return `
      <div class="floating-rail" data-site-utilities>
        <a
          class="floating-action floating-action--whatsapp"
          href="${config.whatsappUrl || "#"}"
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with ASH-TRA on WhatsApp"
          data-track="whatsapp_click"
        >
          ${icon("whatsapp")}
          <span class="floating-action__label">WhatsApp</span>
        </a>
        <button class="floating-action floating-action--bot" type="button" data-command-open aria-label="Open Orbot help">
          <img class="floating-action__avatar" src="/brand/orbot-avatar.svg" alt="" aria-hidden="true" />
          <span class="floating-action__label">Orbot</span>
        </button>
        <button class="floating-action floating-action--top" type="button" data-back-to-top aria-label="Back to top" hidden>
          ${icon("top")}
          <span class="floating-action__label">Top</span>
        </button>
      </div>
      <div class="command-root" data-command-root hidden>
        <button class="command-root__backdrop" type="button" aria-label="Close Orbot help" data-command-close></button>
        <section class="command-panel" aria-label="Orbot help">
          <div class="command-panel__header">
            <div class="command-panel__avatar">
              <img src="/brand/orbot-avatar.svg" alt="" aria-hidden="true" />
            </div>
            <div>
              <span class="eyebrow">Orbot</span>
              <h2>Clear routes, faster starts.</h2>
              <p>Ask about services, process, work, discovery, or the cleanest next step.</p>
            </div>
            <button class="command-panel__close" type="button" aria-label="Close Orbot help" data-command-close>
              ${icon("close")}
            </button>
          </div>
          <div class="command-panel__body">
            <div class="command-panel__suggestions">
              <button type="button" class="command-panel__suggestion" data-command-suggestion="Show me the services">Services</button>
              <button type="button" class="command-panel__suggestion" data-command-suggestion="How does the process work?">Process</button>
              <button type="button" class="command-panel__suggestion" data-command-suggestion="Show me the work">Work</button>
              <button type="button" class="command-panel__suggestion" data-command-suggestion="How do I start with discovery?">Discovery</button>
            </div>
            <form class="command-panel__form" data-command-form>
              <label class="sr-only" for="command-input">Ask Orbot about the site</label>
              <div class="command-panel__field">
                ${icon("search")}
                <input id="command-input" name="query" type="text" autocomplete="off" placeholder="Ask Orbot about services, work, process, or the cleanest next step..." />
              </div>
              <button class="button button--primary" type="submit">
                ${icon("arrow")}
                <span>Send</span>
              </button>
            </form>
            <div class="command-panel__log" data-command-log aria-live="polite"></div>
          </div>
          <div class="command-panel__footer">
            <p>Use Launch Site when the work is clear, Pay Consultation for strategy first, or Discovery for a lighter start.</p>
          </div>
        </section>
      </div>
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
    document.querySelectorAll("[data-discovery-form]").forEach(function (target) {
      target.innerHTML = discoveryFormMarkup();
    });
    if (!document.querySelector("[data-site-utilities]")) {
      document.body.insertAdjacentHTML("beforeend", utilityMarkup());
    }
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
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!revealItems.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = `${Math.min(index * 40, 320)}ms`;
    });

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        revealItems.forEach(function (item) {
          item.classList.add("is-visible");
        });
      });
    });
  }

  function setupTiltCards() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
          card.style.transform = `perspective(1200px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
        });
      });

      card.addEventListener("pointerleave", reset);
      card.addEventListener("pointercancel", reset);
    });
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

  function normalize(text) {
    return String(text || "").trim().toLowerCase();
  }

  function searchSite(query) {
    const q = normalize(query);
    if (!q) return [];

    return siteIndex
      .map(function (entry) {
        let score = 0;
        if (normalize(entry.title).includes(q)) score += 5;
        if (normalize(entry.description).includes(q)) score += 2;
        entry.keywords.forEach(function (keyword) {
          const token = normalize(keyword);
          if (q.includes(token) || token.includes(q)) score += 3;
        });
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

  function resolveReply(query) {
    const q = normalize(query);
    const rules = [
      {
        match: ["what does", "services", "offer", "redesign", "rebuild"],
        answer: "ASH-TRA helps companies launch, rebuild, refine, and optimise digital presence so they look sharper, feel more credible, and move with more force.",
        results: siteIndex.filter(function (item) {
          return item.url === "/services/" || item.url === "/examples/";
        })
      },
      {
        match: ["who is", "fit", "best for", "ideal client"],
        answer: "The work is built for ambitious companies, founders, consultants, agencies, and service brands that care how the business is read online.",
        results: siteIndex.filter(function (item) {
          return item.url === "/about/" || item.url === "/services/";
        })
      },
      {
        match: ["pay", "payment", "stripe", "paypal", "pix"],
        answer: "Use Pay Consultation to choose the paid strategy route, request the payment method that fits best, and move into scheduling once payment is confirmed.",
        results: siteIndex.filter(function (item) {
          return item.url === "/pay-consultation/" || item.url === "/schedule-meeting/" || item.url === "/discovery/";
        })
      },
      {
        match: ["schedule", "calendly", "meeting", "slot", "book a time"],
        answer: "Use Schedule Meeting to lock the consultation slot once the paid consultation has been handled.",
        results: siteIndex.filter(function (item) {
          return item.url === "/schedule-meeting/" || item.url === "/pay-consultation/" || item.url === "/discovery/";
        })
      },
      {
        match: ["process", "timeline", "steps", "launch"],
        answer: "Projects move through discovery, direction, build, refinement, optimisation, and support with a clear commercial rhythm.",
        results: siteIndex.filter(function (item) {
          return item.url === "/process/" || item.url === "/start-project/";
        })
      },
      {
        match: ["portfolio", "private", "examples", "case study", "industries"],
        answer: "The public work page stays curated and contextual. It is there to prove the standard without turning private projects into filler.",
        results: siteIndex.filter(function (item) {
          return item.url === "/examples/" || item.url === "/contact/";
        })
      },
      {
        match: ["seo", "mobile", "performance", "accessibility", "motion"],
        answer: "Those are part of the quality bar. The site is designed to feel expensive without getting bloated or fragile.",
        results: siteIndex.filter(function (item) {
          return item.url === "/services/" || item.url === "/faq/";
        })
      },
      {
        match: ["start", "brief", "project", "quote", "budget", "consultation"],
        answer: "Use Launch Site for the direct project form, Pay Consultation for the paid strategy route, or Discovery if you want the fuller questionnaire first.",
        results: siteIndex.filter(function (item) {
          return item.url === "/start-project/" || item.url === "/pay-consultation/" || item.url === "/discovery/";
        })
      },
      {
        match: ["contact", "email", "whatsapp", "message", "discovery"],
        answer: "Use Contact for a fast project enquiry, Discovery for the deeper intake, or WhatsApp for a quick human reply.",
        results: siteIndex.filter(function (item) {
          return item.url === "/contact/" || item.url === "/discovery/" || item.url === "/start-project/";
        })
      }
    ];

    const matched = rules.find(function (rule) {
      return rule.match.some(function (item) {
        return q.includes(item);
      });
    });

    if (matched) return matched;

    const results = searchSite(query);
    if (results.length) {
      return {
        answer: "These are the closest matching pages in the site structure.",
        results: results
      };
    }

    return {
      answer: "I could not map that cleanly, but Contact, Launch Site, or Discovery should get you to the right next step.",
      results: siteIndex.filter(function (item) {
        return item.url === "/contact/" || item.url === "/start-project/" || item.url === "/discovery/";
      })
    };
  }

  function renderResults(results) {
    if (!results?.length) return "";
    return `
      <div class="command-results">
        ${results
          .map(
            (result) => `
              <a href="${result.url}" data-track="navigator_result_click" data-track-label="${escapeHtml(result.title)}">
                <span>
                  <strong>${escapeHtml(result.title)}</strong>
                  <small>${escapeHtml(result.description)}</small>
                </span>
                ${icon("arrow")}
              </a>
            `
          )
          .join("")}
      </div>
    `;
  }

  function setupCommandPalette() {
    const root = document.querySelector("[data-command-root]");
    const log = document.querySelector("[data-command-log]");
    const form = document.querySelector("[data-command-form]");
    const input = document.querySelector("#command-input");
    if (!root || !log || !form || !input) return;

    function addEntry(role, text, results) {
      const label = role === "assistant" ? "Orbot" : "You";
      log.insertAdjacentHTML(
        "beforeend",
        `
          <div class="command-entry command-entry--${role}">
            <span class="command-entry__label">${label}</span>
            <span class="command-entry__text">${escapeHtml(text)}</span>
            ${role === "assistant" ? renderResults(results) : ""}
          </div>
        `
      );
      log.scrollTop = log.scrollHeight;
    }

    function openPalette() {
      root.hidden = false;
      document.body.style.overflow = "hidden";
      if (!log.childElementCount) {
        addEntry(
          "assistant",
          "Ask about services, process, work, discovery, or the right route to start.",
          siteIndex.filter(function (item) {
            return item.url === "/services/" || item.url === "/start-project/" || item.url === "/discovery/" || item.url === "/examples/";
          })
        );
      }
      window.setTimeout(function () {
        input.focus();
      }, 30);
    }

    function closePalette() {
      root.hidden = true;
      document.body.style.overflow = "";
    }

    function submitQuery(query) {
      const value = String(query || "").trim();
      if (!value) return;
      addEntry("user", value);
      const reply = resolveReply(value);
      addEntry("assistant", reply.answer, reply.results);
      trackEvent("navigator_query", { label: value.slice(0, 80) });
      input.value = "";
    }

    document.querySelectorAll("[data-command-open]").forEach(function (button) {
      button.addEventListener("click", openPalette);
    });

    document.querySelectorAll("[data-command-close]").forEach(function (button) {
      button.addEventListener("click", closePalette);
    });

    document.querySelectorAll("[data-command-suggestion]").forEach(function (button) {
      button.addEventListener("click", function () {
        submitQuery(button.getAttribute("data-command-suggestion"));
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitQuery(input.value);
    });

    root.addEventListener("click", function (event) {
      if (event.target.closest(".command-results a")) {
        closePalette();
      }
    });

    document.addEventListener("keydown", function (event) {
      const active = document.activeElement;
      const inField =
        active &&
        (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT");

      if (event.key === "/" && !inField) {
        event.preventDefault();
        openPalette();
      }

      if (event.key === "Escape" && !root.hidden) {
        closePalette();
      }
    });
  }

  function init() {
  injectShell();
  setupSeo();
  decorateStage();
    setupTrackedClicks();
    setupNav();
    setupHeaderState();
    setupReveal();
    setupTiltCards();
    setupSceneMotion();
    setupBackToTop();
    setupLayoutScaffold();
    setupPaymentPrefill();
    setupForms();
    setupFaq();
    setupCommandPalette();
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
