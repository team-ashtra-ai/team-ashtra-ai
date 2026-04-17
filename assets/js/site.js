(function () {
  const config = window.AshtraConfig || {};
  const page = document.body.dataset.page || "home";
  const navItems = [
    { href: "/services/", label: "Services", match: "/services/" },
    { href: "/process/", label: "Process", match: "/process/" },
    { href: "/examples/", label: "Examples", match: "/examples/" },
    { href: "/about/", label: "About", match: "/about/" },
    { href: "/contact/", label: "Contact", match: "/contact/" }
  ];
  const siteIndex = [
    {
      title: "Services",
      url: "/services/",
      description: "Premium redesigns, full rebuilds, cinematic motion, SEO-aware structure, and mobile-first front-end polish.",
      keywords: ["service", "services", "redesign", "rebuild", "motion", "seo", "mobile", "accessibility"]
    },
    {
      title: "Process",
      url: "/process/",
      description: "Discovery, direction, design, build, refine, and launch with calm checkpoints.",
      keywords: ["process", "timeline", "steps", "how", "workflow", "delivery", "launch"]
    },
    {
      title: "Examples",
      url: "/examples/",
      description: "Public direction studies that show the taste level while private client work stays selective.",
      keywords: ["examples", "portfolio", "case study", "showcase", "work", "private", "direction"]
    },
    {
      title: "About",
      url: "/about/",
      description: "What ASH-TRA stands for, who it is for, and why the work is built around momentum.",
      keywords: ["about", "studio", "brand", "philosophy", "who", "fit"]
    },
    {
      title: "Contact",
      url: "/contact/",
      description: "Email, WhatsApp, or a short enquiry for brands ready to talk about the next version of the site.",
      keywords: ["contact", "email", "whatsapp", "call", "message", "talk", "reach"]
    },
    {
      title: "Start a Project",
      url: "/start-project/",
      description: "Share the current problem, the level you want to reach, and the direction you want the site to move toward.",
      keywords: ["start", "project", "brief", "quote", "budget", "enquiry", "kickoff"]
    },
    {
      title: "FAQ",
      url: "/faq/",
      description: "Short answers about fit, process, mobile, SEO, motion, and private work.",
      keywords: ["faq", "questions", "answers", "seo", "mobile", "pricing", "fit"]
    }
  ];

  function icon(name) {
    const icons = {
      arrow:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h12M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"/></svg>',
      chevronUp:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9"/></svg>',
      search:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l5 5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/></svg>',
      chat:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v6A3.5 3.5 0 0 1 15.5 16H11l-4 4v-4.4A3.5 3.5 0 0 1 5 12.5v-6z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.8"/></svg>',
      close:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"/></svg>',
      email:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 7l7.5 6 7.5-6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
      whatsapp:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2a8.6 8.6 0 0 0-7.4 13l-1.2 4.6 4.7-1.2A8.6 8.6 0 1 0 12 3.2zm4.8 12.2c-.2.6-1.3 1.1-1.9 1.2-.5.1-1.1.2-3.4-.8-2.8-1.2-4.5-4-4.7-4.2-.2-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1.1.2.1.4 0 .6-.1.2-.2.4-.4.6l-.5.5c-.2.2-.3.3-.1.6.2.4.9 1.5 2 2.4 1.4 1.2 2.5 1.5 2.9 1.7.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.3.7-.2.3.1 1.9.9 2.2 1 .3.2.6.3.7.5.1.1.1.7-.2 1.3z" fill="currentColor"/></svg>'
    };

    return icons[name] || "";
  }

  function pathName() {
    const path = window.location.pathname;
    if (path === "/" || path === "/index.html") {
      return "/";
    }
    return path.endsWith("/") ? path : `${path}/`;
  }

  function isActive(match) {
    const current = pathName();
    if (match === "/") {
      return current === "/";
    }
    return current.startsWith(match);
  }

  function headerMarkup() {
    return `
      <header class="site-header">
        <div class="site-header__inner">
          <a class="brand-link" href="/" aria-label="ASH-TRA home">
            <img class="brand-link__mark" src="/brand/ash-tra-logo.png" alt="ASH-TRA emblem" />
            <span class="brand-link__text">
              <span class="brand-link__name">ASH-TRA</span>
              <span class="brand-link__tagline">Where ambition meets momentum.</span>
            </span>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open navigation">
            <span></span>
            <span></span>
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
              <a class="button button--ghost" href="/contact/" data-track="contact_click">${icon("email")}<span>Get in touch</span></a>
              <a class="button button--primary" href="/start-project/" data-track="start_project_click">${icon("arrow")}<span>Start a project</span></a>
            </div>
          </nav>
        </div>
      </header>
    `;
  }

  function footerMarkup() {
    return `
      <footer class="site-footer">
        <div class="site-footer__glow"></div>
        <div class="site-footer__inner">
          <div class="footer-brand">
            <div class="footer-brand__lockup">
              <img src="/brand/ash-tra-logo.png" alt="ASH-TRA emblem" />
              <div>
                <p class="footer-brand__name">ASH-TRA</p>
                <p class="footer-brand__tagline">Where ambition meets momentum.</p>
              </div>
            </div>
            <p class="footer-brand__statement">ASH-TRA is where ambition meets momentum - bold design, smart strategy, cinematic visuals, high-performance websites, SEO, accessibility, and digital experiences built to move brands forward.</p>
          </div>
          <div class="footer-columns">
            <div>
              <p class="footer-title">Explore</p>
              <a href="/services/">Services</a>
              <a href="/process/">Process</a>
              <a href="/examples/">Examples</a>
              <a href="/about/">About</a>
            </div>
            <div>
              <p class="footer-title">Connect</p>
              <a href="/start-project/" data-track="start_project_click">Start a project</a>
              <a href="/contact/" data-track="contact_click">Contact</a>
              <a href="mailto:${config.formEmail || "team.ashtra.ai@gmail.com"}" data-track="email_click">team.ashtra.ai@gmail.com</a>
              <a href="${config.whatsappUrl || "#"}" target="_blank" rel="noreferrer" data-track="whatsapp_click">WhatsApp</a>
            </div>
            <div>
              <p class="footer-title">Support</p>
              <a href="/faq/">FAQ</a>
              <a href="/privacy/">Privacy</a>
              <a href="/terms/">Terms</a>
              <a href="/cookies/">Cookies</a>
              <a href="/accessibility/">Accessibility</a>
            </div>
          </div>
        </div>
        <div class="site-footer__bottom">
          <p>&copy; 2026 www.ash-tra.com</p>
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
        <button
          class="floating-action floating-action--chat"
          type="button"
          aria-expanded="false"
          aria-controls="site-chatbot"
          aria-label="Open ASH-TRA assistant"
          data-chat-toggle
        >
          ${icon("chat")}
          <span class="floating-action__label">Ask</span>
        </button>
        <button
          class="floating-action floating-action--top"
          type="button"
          aria-label="Back to top"
          data-back-to-top
          hidden
        >
          ${icon("chevronUp")}
          <span class="floating-action__label">Top</span>
        </button>
      </div>
      <section class="site-chatbot" id="site-chatbot" data-site-chatbot hidden>
        <div class="site-chatbot__panel">
          <div class="site-chatbot__header">
            <div>
              <p class="site-chatbot__eyebrow">ASH-TRA assistant</p>
              <h2>Quick answers. Straight to the point.</h2>
            </div>
            <button class="site-chatbot__close" type="button" data-chat-close aria-label="Close assistant">
              ${icon("close")}
            </button>
          </div>
          <p class="site-chatbot__intro">Ask about services, timelines, examples, SEO, or search the site. Fastest real reply: WhatsApp.</p>
          <div class="site-chatbot__suggestions">
            <button type="button" class="site-chatbot__suggestion" data-chat-suggestion="What does ASH-TRA do?">What does ASH-TRA do?</button>
            <button type="button" class="site-chatbot__suggestion" data-chat-suggestion="Are portfolios private?">Are portfolios private?</button>
            <button type="button" class="site-chatbot__suggestion" data-chat-suggestion="How do I start a project?">How do I start a project?</button>
          </div>
          <div class="site-chatbot__log" data-chat-log aria-live="polite"></div>
          <form class="site-chatbot__form" data-chatbot-form>
            <label class="sr-only" for="site-chatbot-input">Search the site or ask a question</label>
            <div class="site-chatbot__field">
              ${icon("search")}
              <input id="site-chatbot-input" name="query" type="text" placeholder="Ask a question or search the site..." autocomplete="off" />
            </div>
            <button class="button button--primary button--compact" type="submit">
              ${icon("arrow")}
              <span>Ask</span>
            </button>
          </form>
        </div>
      </section>
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

  function setupNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
      document.body.classList.toggle("has-nav-open", !expanded);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("has-nav-open");
      });
    });
  }

  function trackEvent(name, detail = {}) {
    const payload = {
      event: name,
      page,
      ...detail
    };
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
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  function setupParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layeredItems = document.querySelectorAll("[data-depth]");
    if (!layeredItems.length) return;

    const apply = () => {
      const offset = window.scrollY;
      layeredItems.forEach((item) => {
        const depth = Number(item.getAttribute("data-depth")) || 0.08;
        item.style.transform = `translate3d(0, ${offset * depth}px, 0)`;
      });
    };

    window.addEventListener("scroll", apply, { passive: true });
    apply();
  }

  function setupFaq() {
    document.querySelectorAll("details[data-faq]").forEach((item) => {
      item.addEventListener("toggle", function () {
        if (item.open) {
          trackEvent("faq_expand", {
            label: item.querySelector("summary")?.textContent.trim() || "FAQ"
          });
        }
      });
    });
  }

  function buildMailtoPayload(form) {
    const data = new FormData(form);
    const subject = form.dataset.subject || "ASH-TRA project enquiry";
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
    document.querySelectorAll("[data-enquiry-form]").forEach((form) => {
      const success = form.parentElement.querySelector("[data-form-success]");
      let started = false;

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        trackEvent("contact_form_submitted", {
          form: form.getAttribute("name") || "enquiry"
        });
        if (success) {
          success.hidden = false;
        }
        window.location.href = buildMailtoPayload(form);
      });

      form.querySelectorAll("input, textarea, select").forEach((field) => {
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

  function setupHeaderState() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function setupBackToTop() {
    const button = document.querySelector("[data-back-to-top]");
    if (!button) return;

    const update = () => {
      button.hidden = window.scrollY < 420;
    };

    button.addEventListener("click", function () {
      trackEvent("back_to_top_click");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", update, { passive: true });
    update();
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

  function renderResultLinks(results) {
    if (!results?.length) return "";
    return `
      <div class="site-chatbot__results">
        ${results
          .map(
            (result) => `
              <a class="site-chatbot__result" href="${result.url}" data-track="chatbot_result_click" data-track-label="${escapeHtml(result.title)}">
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

  function searchSite(query) {
    const q = normalize(query);
    if (!q) return [];

    return siteIndex
      .map((entry) => {
        let score = 0;
        if (normalize(entry.title).includes(q)) score += 5;
        if (normalize(entry.description).includes(q)) score += 2;
        entry.keywords.forEach((keyword) => {
          const token = normalize(keyword);
          if (q.includes(token) || token.includes(q)) {
            score += 3;
          }
        });
        return { entry, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.entry);
  }

  function resolveAssistantReply(query) {
    const q = normalize(query);
    const rules = [
      {
        match: ["whatsapp", "phone", "message", "contact"],
        answer: "WhatsApp is the fastest route if you want a quick human reply.",
        results: siteIndex.filter((item) => item.url === "/contact/" || item.url === "/start-project/")
      },
      {
        match: ["price", "pricing", "cost", "budget", "quote"],
        answer: "Projects are quoted around the scope, ambition, and level of polish. Best next step: send the brief or use WhatsApp.",
        results: siteIndex.filter((item) => item.url === "/start-project/" || item.url === "/contact/")
      },
      {
        match: ["service", "services", "offer", "redesign", "rebuild"],
        answer: "ASH-TRA focuses on premium redesigns, full rebuilds, motion-rich front-end polish, and search-ready structure.",
        results: siteIndex.filter((item) => item.url === "/services/" || item.url === "/process/")
      },
      {
        match: ["portfolio", "case study", "private", "examples", "work"],
        answer: "Public examples stay as direction studies. Approved client work can be discussed selectively in private.",
        results: siteIndex.filter((item) => item.url === "/examples/" || item.url === "/contact/")
      },
      {
        match: ["timeline", "process", "how long", "steps", "launch"],
        answer: "The process is discovery, direction, design, build, refine, and launch. Timelines depend on scope and how quickly feedback moves.",
        results: siteIndex.filter((item) => item.url === "/process/" || item.url === "/start-project/")
      },
      {
        match: ["seo", "performance", "mobile", "accessibility"],
        answer: "Those are built into the quality bar. The goal is a site that looks expensive and still holds up technically.",
        results: siteIndex.filter((item) => item.url === "/services/" || item.url === "/faq/")
      },
      {
        match: ["start", "brief", "project", "kickoff"],
        answer: "Start with what feels weak in the current site and how you want the new one to feel. Short is fine.",
        results: siteIndex.filter((item) => item.url === "/start-project/" || item.url === "/contact/")
      }
    ];

    const matched = rules.find((rule) => rule.match.some((token) => q.includes(token)));
    if (matched) return matched;

    const searchResults = searchSite(query);
    if (searchResults.length) {
      return {
        answer: "Best match on the site:",
        results: searchResults
      };
    }

    return {
      answer: "I can point you to Services, Process, Examples, FAQ, or Contact. Fastest real reply: WhatsApp.",
      results: siteIndex.filter((item) => item.url === "/services/" || item.url === "/contact/" || item.url === "/faq/")
    };
  }

  function appendChatMessage(log, role, html) {
    const item = document.createElement("div");
    item.className = `site-chatbot__message site-chatbot__message--${role}`;
    item.innerHTML = html;
    log.appendChild(item);
    log.scrollTop = log.scrollHeight;
  }

  function askAssistant(log, query) {
    const trimmed = String(query || "").trim();
    if (!trimmed) return;
    appendChatMessage(log, "user", `<p>${escapeHtml(trimmed)}</p>`);
    const reply = resolveAssistantReply(trimmed);
    appendChatMessage(
      log,
      "bot",
      `<p>${escapeHtml(reply.answer)}</p>${renderResultLinks(reply.results)}`
    );
  }

  function setupChatbot() {
    const panel = document.querySelector("[data-site-chatbot]");
    const toggle = document.querySelector("[data-chat-toggle]");
    const close = document.querySelector("[data-chat-close]");
    const log = document.querySelector("[data-chat-log]");
    const form = document.querySelector("[data-chatbot-form]");
    const input = document.querySelector("#site-chatbot-input");
    if (!panel || !toggle || !close || !log || !form || !input) return;

    let seeded = false;

    const open = () => {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add("is-open"));
      toggle.setAttribute("aria-expanded", "true");
      if (!seeded) {
        appendChatMessage(
          log,
          "bot",
          "<p>Ask anything about the site. Short answers here. Fastest next step is WhatsApp.</p>"
        );
        seeded = true;
      }
      input.focus();
      trackEvent("chatbot_open");
    };

    const closePanel = () => {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      window.setTimeout(() => {
        if (!panel.classList.contains("is-open")) {
          panel.hidden = true;
        }
      }, 220);
    };

    toggle.addEventListener("click", function () {
      if (panel.hidden || !panel.classList.contains("is-open")) {
        open();
      } else {
        closePanel();
      }
    });

    close.addEventListener("click", closePanel);

    panel.querySelectorAll("[data-chat-suggestion]").forEach((button) => {
      button.addEventListener("click", function () {
        const query = button.getAttribute("data-chat-suggestion") || "";
        if (!panel.classList.contains("is-open")) {
          open();
        }
        askAssistant(log, query);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const query = input.value.trim();
      if (!query) return;
      askAssistant(log, query);
      input.value = "";
    });
  }

  function loadAnalytics() {
    if (window.__ashtraAnalyticsLoaded) return;
    window.__ashtraAnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];

    if (config.gtmId) {
      window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${config.gtmId}`;
      document.head.appendChild(script);
    }

    if (config.googleAnalyticsId) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`;
      document.head.appendChild(script);

      window.gtag = function () {
        window.dataLayer.push(arguments);
      };

      window.gtag("js", new Date());
      window.gtag("config", config.googleAnalyticsId, {
        anonymize_ip: true
      });
    }
  }

  loadAnalytics();

  document.addEventListener("DOMContentLoaded", function () {
    injectShell();
    setupNav();
    setupHeaderState();
    setupTrackedClicks();
    setupReveal();
    setupParallax();
    setupFaq();
    setupForms();
    setupBackToTop();
    setupChatbot();
    trackEvent("page_view", { page });
  });
})();
