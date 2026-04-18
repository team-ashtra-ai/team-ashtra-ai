(function () {
  const config = window.AshtraConfig || {};
  const page = document.body.dataset.page || "home";

  const navItems = [
    { href: "/services/", label: "Services", match: "/services/" },
    { href: "/process/", label: "Process", match: "/process/" },
    { href: "/examples/", label: "Portfolio", match: "/examples/" },
    { href: "/about/", label: "About", match: "/about/" },
    { href: "/contact/", label: "Contact", match: "/contact/" }
  ];

  const supportPages = [
    { title: "Privacy", url: "/privacy/" },
    { title: "Terms", url: "/terms/" },
    { title: "Cookies", url: "/cookies/" },
    { title: "Accessibility", url: "/accessibility/" }
  ];

  const siteIndex = [
    {
      title: "Services",
      url: "/services/",
      description: "Strategy, redesign, front-end build, motion, performance, and SEO-ready structure.",
      keywords: ["service", "services", "design", "redesign", "build", "motion", "seo", "performance"]
    },
    {
      title: "Process",
      url: "/process/",
      description: "Audit, direction, design, build, and launch with a clear production rhythm.",
      keywords: ["process", "steps", "timeline", "how", "workflow", "launch"]
    },
    {
      title: "Portfolio",
      url: "/examples/",
      description: "Portfolio direction studies that show ASH-TRA's visual standard without turning client work into filler.",
      keywords: ["examples", "portfolio", "study", "direction", "gallery", "private"]
    },
    {
      title: "About",
      url: "/about/",
      description: "ASH-TRA's positioning, standards, and the kind of brands the work is built for.",
      keywords: ["about", "studio", "brand", "positioning", "fit"]
    },
    {
      title: "Contact",
      url: "/contact/",
      description: "Direct contact options and a shorter enquiry form for brands ready to talk.",
      keywords: ["contact", "email", "whatsapp", "reach", "talk", "message"]
    },
    {
      title: "Start a Project",
      url: "/start-project/",
      description: "Project intake for brands that know the current site no longer matches the business.",
      keywords: ["start", "project", "brief", "quote", "kickoff", "enquiry"]
    },
    {
      title: "FAQ",
      url: "/faq/",
      description: "Answers about fit, motion, mobile, SEO, private work, and the design process.",
      keywords: ["faq", "questions", "answers", "seo", "mobile", "fit", "pricing"]
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
      email:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 7l7.5 6 7.5-6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
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

  function headerMarkup() {
    return `
      <header class="site-header">
        <div class="site-header__inner">
          <a class="brand-lockup" href="/" aria-label="ASH-TRA home">
            <img class="brand-lockup__mark" src="/brand/ash-tra-favicon.svg" alt="ASH-TRA mark" />
            <span class="brand-lockup__meta">
              <span class="brand-lockup__title">ASH-TRA</span>
              <span class="brand-lockup__tag">Orbital websites for ambitious brands.</span>
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
              <button class="button button--subtle button--bot" type="button" data-command-open>
                ${icon("search")}
                <span>Ask Astra</span>
              </button>
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
    const atlasLinks = [
      { title: "Home", url: "/" },
      ...siteIndex.map((item) => ({ title: item.title, url: item.url })),
      ...supportPages
    ];

    return `
      <footer class="site-footer">
        <div class="site-footer__inner">
          <div class="site-footer__main surface footer-mega">
            <div class="footer-brand">
              <div class="footer-brand__lockup">
                <img src="/brand/ash-tra-mark.svg" alt="ASH-TRA mark" />
                <div>
                  <p class="footer-brand__title">ASH-TRA</p>
                  <p class="footer-brand__tag">Sci-fi polish. Real business momentum.</p>
                </div>
              </div>
              <p class="footer-brand__text">
                Design-led websites for ambitious brands that want to feel more advanced, more cinematic, and more unmistakably premium online.
              </p>
              <div class="footer-brand__actions">
                <a class="button button--primary" href="/start-project/" data-track="start_project_click">Start a project</a>
                <a class="button button--secondary" href="/contact/" data-track="contact_click">Talk to ASH-TRA</a>
              </div>
            </div>

            <div class="footer-sitemap">
              <div class="footer-sitemap__head">
                <strong>Site atlas</strong>
                <p>Everything in the system, mapped in one place.</p>
              </div>
              <div class="footer-sitemap__grid">
                ${atlasLinks
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
            </div>

            <div class="site-footer__columns">
              <div class="footer-column">
                <strong>Portfolio</strong>
                <a href="/examples/">Direction studies</a>
                <a href="/services/">Services</a>
                <a href="/process/">Process</a>
              </div>
              <div class="footer-column">
                <strong>Connect</strong>
                <a href="/contact/" data-track="contact_click">Contact</a>
                <a href="/start-project/" data-track="start_project_click">Start a project</a>
                <a href="mailto:${config.formEmail || "team.ashtra.ai@gmail.com"}" data-track="email_click">${config.formEmail || "team.ashtra.ai@gmail.com"}</a>
                <a href="${config.whatsappUrl || "#"}" target="_blank" rel="noreferrer" data-track="whatsapp_click">WhatsApp</a>
              </div>
              <div class="footer-column">
                <strong>Standards</strong>
                <a href="/about/">About</a>
                <a href="/faq/">FAQ</a>
                <a href="/accessibility/">Accessibility</a>
              </div>
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
        <button class="floating-action floating-action--bot" type="button" data-command-open aria-label="Open site navigator">
          <img class="floating-action__avatar" src="/brand/ash-tra-bot.svg" alt="" aria-hidden="true" />
          <span class="floating-action__label">Astra Bot</span>
        </button>
        <button class="floating-action" type="button" data-back-to-top aria-label="Back to top" hidden>
          ${icon("top")}
          <span class="floating-action__label">Top</span>
        </button>
      </div>
      <div class="command-root" data-command-root hidden>
        <button class="command-root__backdrop" type="button" aria-label="Close site navigator" data-command-close></button>
        <section class="command-panel" aria-label="Site navigator">
          <div class="command-panel__header">
            <div class="command-panel__avatar">
              <img src="/brand/ash-tra-bot.svg" alt="" aria-hidden="true" />
            </div>
            <div>
              <span class="eyebrow">Astra navigator</span>
              <h2>Talk to the little orbital bot.</h2>
              <p>Ask about portfolio, fit, services, process, or jump straight to the right page.</p>
            </div>
            <button class="command-panel__close" type="button" aria-label="Close site navigator" data-command-close>
              ${icon("close")}
            </button>
          </div>
          <div class="command-panel__body">
            <div class="command-panel__suggestions">
              <button type="button" class="command-panel__suggestion" data-command-suggestion="What does ASH-TRA do?">What does ASH-TRA do?</button>
              <button type="button" class="command-panel__suggestion" data-command-suggestion="Show me the portfolio direction">Show me the portfolio</button>
              <button type="button" class="command-panel__suggestion" data-command-suggestion="Who is this for?">Who is this for?</button>
              <button type="button" class="command-panel__suggestion" data-command-suggestion="How does the process work?">How does the process work?</button>
              <button type="button" class="command-panel__suggestion" data-command-suggestion="How do I start a project?">How do I start?</button>
            </div>
            <form class="command-panel__form" data-command-form>
              <label class="sr-only" for="command-input">Search the site or ask a question</label>
              <div class="command-panel__field">
                ${icon("search")}
                <input id="command-input" name="query" type="text" autocomplete="off" placeholder="Ask Astra about the site..." />
              </div>
              <button class="button button--primary" type="submit">
                ${icon("arrow")}
                <span>Send</span>
              </button>
            </form>
            <div class="command-panel__log" data-command-log aria-live="polite"></div>
          </div>
          <div class="command-panel__footer">
            <p>Fastest human reply still comes from WhatsApp or a direct email.</p>
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

  function trackEvent(name, detail = {}) {
    const payload = { event: name, page, ...detail };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    if (typeof window.gtag === "function" && name !== "page_view") {
      window.gtag("event", name, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        ...detail
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
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 18);
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function setupReveal() {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!revealItems.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
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

    revealItems.forEach((item) => observer.observe(item));
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

    const update = () => {
      button.hidden = window.scrollY < 440;
    };

    button.addEventListener("click", function () {
      trackEvent("back_to_top_click");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function buildMailtoPayload(form) {
    const data = new FormData(form);
    const subject = form.dataset.subject || "ASH-TRA enquiry";
    const lines = [];
    data.forEach((value, key) => {
      lines.push(`${key}: ${String(value).trim()}`);
    });
    const body = lines.join("\n");
    return `mailto:${config.formEmail || "team.ashtra.ai@gmail.com"}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  function setupForms() {
    document.querySelectorAll("[data-enquiry-form]").forEach(function (form) {
      const success = form.parentElement.querySelector("[data-form-success]");
      let started = false;

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        trackEvent("contact_form_submitted", {
          form: form.getAttribute("name") || "enquiry"
        });
        if (success) success.hidden = false;
        window.location.href = buildMailtoPayload(form);
      });

      form.querySelectorAll("input, textarea, select").forEach(function (field) {
        field.addEventListener(
          "focus",
          function () {
            if (started) return;
            started = true;
            trackEvent("contact_form_started", {
              form: form.getAttribute("name") || "enquiry"
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

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function searchSite(query) {
    const q = normalize(query);
    if (!q) return [];

    return siteIndex
      .map((entry) => {
        let score = 0;
        if (normalize(entry.title).includes(q)) score += 5;
        if (normalize(entry.description).includes(q)) score += 2;
        entry.keywords.forEach(function (keyword) {
          const token = normalize(keyword);
          if (q.includes(token) || token.includes(q)) score += 3;
        });
        return { entry, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.entry);
  }

  function resolveReply(query) {
    const q = normalize(query);
    const rules = [
      {
        match: ["what does", "services", "offer", "redesign", "rebuild"],
        answer: "ASH-TRA plans, designs, and builds premium website systems with strong art direction, motion, and technical discipline.",
        results: siteIndex.filter((item) => item.url === "/services/" || item.url === "/examples/")
      },
      {
        match: ["who is", "fit", "best for", "ideal client"],
        answer: "The work is best for ambitious founders, consultants, agencies, AI and tech-adjacent brands, and service businesses that care about digital taste.",
        results: siteIndex.filter((item) => item.url === "/about/" || item.url === "/services/")
      },
      {
        match: ["process", "timeline", "steps", "launch"],
        answer: "Projects move through audit, direction, design, build, and launch with a calm production rhythm.",
        results: siteIndex.filter((item) => item.url === "/process/" || item.url === "/start-project/")
      },
      {
        match: ["portfolio", "private", "examples", "case study"],
        answer: "The public portfolio stays as direction studies. Approved client work can be discussed privately when it helps the brief.",
        results: siteIndex.filter((item) => item.url === "/examples/" || item.url === "/contact/")
      },
      {
        match: ["seo", "mobile", "performance", "accessibility", "motion"],
        answer: "Those are built into the quality bar. The site is designed to feel expensive without getting bloated or fragile.",
        results: siteIndex.filter((item) => item.url === "/services/" || item.url === "/faq/")
      },
      {
        match: ["start", "brief", "project", "quote", "budget"],
        answer: "The easiest next move is the project intake page or a direct WhatsApp message if you want a faster conversation first.",
        results: siteIndex.filter((item) => item.url === "/start-project/" || item.url === "/contact/")
      },
      {
        match: ["contact", "email", "whatsapp", "message"],
        answer: "Email and WhatsApp are both available, and WhatsApp is usually the fastest route for a human reply.",
        results: siteIndex.filter((item) => item.url === "/contact/" || item.url === "/start-project/")
      }
    ];

    const matched = rules.find((rule) => rule.match.some((item) => q.includes(item)));
    if (matched) return matched;

    const results = searchSite(query);
    if (results.length) {
      return {
        answer: "These are the closest matching pages in the site structure.",
        results
      };
    }

    return {
      answer: "I could not map that cleanly, but the contact page or project intake page should get you to the right next step.",
      results: siteIndex.filter((item) => item.url === "/contact/" || item.url === "/start-project/")
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
      const label = role === "assistant" ? "Astra Bot" : "You";
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
          "Ask about the portfolio, fit, services, process, or where to go next in the site atlas.",
          siteIndex.filter((item) => item.url === "/services/" || item.url === "/start-project/" || item.url === "/examples/")
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
