(function () {
  const config = window.AshtraConfig || {};
  const page = document.body.dataset.page || "home";
  const contactFormEndpoint = config.contactFormEndpoint || "https://formspree.io/f/mbdqovoj";
  const consultationFormEndpoint = config.consultationFormEndpoint || "https://formspree.io/f/xaqaogoo";

  const navItems = [
    { href: "/services/", label: "Services", match: "/services/" },
    { href: "/process/", label: "Process", match: "/process/" },
    { href: "/examples/", label: "Portfolio", match: "/examples/" },
    { href: "/about/", label: "About", match: "/about/" },
    { href: "/contact/", label: "Contact", match: "/contact/" }
  ];

  const footerAtlasLinks = [
    { title: "Home", url: "/" },
    { title: "Services", url: "/services/" },
    { title: "Process", url: "/process/" },
    { title: "Portfolio", url: "/examples/" },
    { title: "About", url: "/about/" },
    { title: "Contact", url: "/contact/" },
    { title: "Start a Project", url: "/start-project/" },
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
      title: "Services",
      url: "/services/",
      description: "Website redesigns, rebuilds, brand polish, SEO foundations, and clearer structure for growth.",
      keywords: ["services", "design", "redesign", "build", "motion", "seo", "performance"]
    },
    {
      title: "Process",
      url: "/process/",
      description: "How the project moves from problem to direction to build to final polish.",
      keywords: ["process", "steps", "timeline", "workflow", "launch", "delivery"]
    },
    {
      title: "Portfolio",
      url: "/examples/",
      description: "Direction studies that show the level, the visual standard, and the sharper presence ASH-TRA builds.",
      keywords: ["portfolio", "studies", "industries", "gallery", "direction", "private"]
    },
    {
      title: "About",
      url: "/about/",
      description: "What ASH-TRA stands for, who the work is for, and why stronger design changes how the business is read.",
      keywords: ["about", "studio", "brand", "positioning", "fit", "story"]
    },
    {
      title: "Contact",
      url: "/contact/",
      description: "The fast route for project enquiries, next-step questions, and a clearer conversation.",
      keywords: ["contact", "enquiry", "form", "message", "reach", "talk"]
    },
    {
      title: "Start",
      url: "/start-project/",
      description: "A short project brief for businesses that know the current site no longer fits.",
      keywords: ["start", "consultation", "brief", "quote", "kickoff", "discovery"]
    },
    {
      title: "Discovery",
      url: "/discovery/",
      description: "A deeper consultation page with guided choices and written notes for the fuller brief.",
      keywords: ["discovery", "consultation", "brief", "strategy", "planning", "intake"]
    },
    {
      title: "FAQ",
      url: "/faq/",
      description: "Short answers about fit, timing, motion, mobile, SEO, and how projects start.",
      keywords: ["faq", "questions", "answers", "seo", "mobile", "fit", "discovery"]
    }
  ];

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
          action="${consultationFormEndpoint}"
          method="POST"
          name="discovery-consultation"
          data-enquiry-form
          data-form-kind="discovery"
          data-success-copy="The discovery brief was sent. The consultation inbox should now have the full brief."
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
            <img class="brand-lockup__mark" src="/brand/ash-tra-favicon.svg" alt="ASH-TRA mark" />
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
                <span>Launch a rebuild</span>
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
                <img src="/brand/ash-tra-favicon.svg" alt="ASH-TRA mark" />
                <div>
                  <p class="footer-brand__title">ASH-TRA</p>
                  <p class="footer-brand__tag">BUILT FOR GROWTH. DESIGNED TO STAND OUT.</p>
                </div>
              </div>
              <p class="footer-brand__text">
                ASH-TRA helps ambitious businesses look sharper, build trust faster, and grow with
                more confidence through modern websites that make a stronger impression.
              </p>
              <div class="footer-brand__actions">
                <a class="button button--primary" href="/start-project/" data-track="start_project_click">Start a project</a>
                <a class="button button--secondary" href="/contact/" data-track="contact_click">Talk to ASH-TRA</a>
              </div>
            </section>

            <section class="footer-sitemap" data-reveal aria-label="Site Atlas">
              <div class="footer-sitemap__head">
                <strong>Site Atlas</strong>
                <p>Everything in the system, mapped in one place.</p>
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
                <strong>Portfolio</strong>
                <a href="/examples/">Direction studies</a>
                <a href="/services/">Services</a>
              </section>
              <section class="footer-column" data-reveal>
                <strong>Connect</strong>
                <a href="/contact/">Contact</a>
                <a href="/start-project/">Start a project</a>
                <a href="/discovery/">Discovery</a>
              </section>
              <section class="footer-column" data-reveal>
                <strong>Standards</strong>
                <a href="/about/">About</a>
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
              <h2>Subtle help, faster routing.</h2>
              <p>Ask about services, process, portfolio, discovery, or the cleanest next step.</p>
            </div>
            <button class="command-panel__close" type="button" aria-label="Close Orbot help" data-command-close>
              ${icon("close")}
            </button>
          </div>
          <div class="command-panel__body">
            <div class="command-panel__suggestions">
              <button type="button" class="command-panel__suggestion" data-command-suggestion="Show me the services">Services</button>
              <button type="button" class="command-panel__suggestion" data-command-suggestion="How does the process work?">Process</button>
              <button type="button" class="command-panel__suggestion" data-command-suggestion="Where is the portfolio?">Portfolio</button>
              <button type="button" class="command-panel__suggestion" data-command-suggestion="Where can I send the full discovery brief?">Discovery</button>
            </div>
            <form class="command-panel__form" data-command-form>
              <label class="sr-only" for="command-input">Ask Orbot about the site</label>
              <div class="command-panel__field">
                ${icon("search")}
                <input id="command-input" name="query" type="text" autocomplete="off" placeholder="Ask Orbot about services, process, or the right next page..." />
              </div>
              <button class="button button--primary" type="submit">
                ${icon("arrow")}
                <span>Send</span>
              </button>
            </form>
            <div class="command-panel__log" data-command-log aria-live="polite"></div>
          </div>
          <div class="command-panel__footer">
            <p>The contact form handles project enquiries. The Discovery page handles the deeper consultation brief.</p>
          </div>
        </section>
      </div>
    `;
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

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
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

        const endpoint = form.getAttribute("action");
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
        answer: "ASH-TRA plans, designs, and builds cinematic website systems with stronger art direction, motion, and technical discipline.",
        results: siteIndex.filter(function (item) {
          return item.url === "/services/" || item.url === "/examples/";
        })
      },
      {
        match: ["who is", "fit", "best for", "ideal client"],
        answer: "The work is best for ambitious founders, consultants, agencies, AI and tech-adjacent brands, and premium service teams that care how the site reads immediately.",
        results: siteIndex.filter(function (item) {
          return item.url === "/about/" || item.url === "/services/";
        })
      },
      {
        match: ["process", "timeline", "steps", "launch"],
        answer: "Projects move through audit, direction, design, build, and launch with a calm production rhythm.",
        results: siteIndex.filter(function (item) {
          return item.url === "/process/" || item.url === "/start-project/";
        })
      },
      {
        match: ["portfolio", "private", "examples", "case study", "industries"],
        answer: "The public portfolio stays curated as direction studies. It is there to prove the standard without turning private work into filler.",
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
        answer: "The quickest route is the Start page for a direct consultation or the Discovery page if you want to send the fuller brief right now.",
        results: siteIndex.filter(function (item) {
          return item.url === "/start-project/" || item.url === "/discovery/";
        })
      },
      {
        match: ["contact", "email", "whatsapp", "message", "discovery"],
        answer: "Use the contact form for a project enquiry, the Discovery page for a deeper consultation brief, or WhatsApp for a fast human reply.",
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
      answer: "I could not map that cleanly, but the contact page, Start page, or Discovery page should get you to the right next step.",
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
          "Ask about services, process, portfolio, discovery, or the cleanest page to open next.",
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
    decorateStage();
    setupTrackedClicks();
    setupNav();
    setupHeaderState();
    setupReveal();
    setupTiltCards();
    setupSceneMotion();
    setupBackToTop();
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
