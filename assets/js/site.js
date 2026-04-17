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

  function pathName() {
    const path = window.location.pathname;
    if (path === "/" || path === "/index.html") {
      return "/";
    }
    return path.endsWith("/") ? path : path + "/";
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
            <img src="/brand/ash-tra-logo.png" alt="ASH-TRA logo" />
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
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
              <a class="button button--ghost" href="/contact/" data-track="contact_click">Get in touch</a>
              <a class="button button--primary" href="/start-project/" data-track="start_project_click">Start a project</a>
            </div>
          </nav>
        </div>
      </header>
    `;
  }

  function footerMarkup() {
    const year = new Date().getFullYear();
    return `
      <footer class="site-footer">
        <div class="site-footer__glow"></div>
        <div class="site-footer__inner">
          <div class="footer-brand">
            <img src="/brand/ash-tra-logo.png" alt="ASH-TRA logo" />
            <p>Overcoming challenges. Pursuing goals.</p>
            <p>Premium cinematic websites for ambitious brands that want a sharper, more modern digital presence.</p>
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
              <p class="footer-title">Contact</p>
              <a href="/start-project/" data-track="start_project_click">Start a project</a>
              <a href="/contact/" data-track="contact_click">Contact</a>
              <a href="mailto:${config.formEmail || "team.ashtra.ai@gmail.com"}" data-track="email_click">Email</a>
              <a href="${config.whatsappUrl || "#"}" target="_blank" rel="noreferrer" data-track="whatsapp_click">WhatsApp</a>
            </div>
            <div>
              <p class="footer-title">Legal</p>
              <a href="/faq/">FAQ</a>
              <a href="/privacy/">Privacy</a>
              <a href="/terms/">Terms</a>
              <a href="/cookies/">Cookies</a>
              <a href="/accessibility/">Accessibility</a>
            </div>
          </div>
        </div>
        <div class="site-footer__bottom">
          <p>&copy; ${year} ASH-TRA. Built for brands that want a more premium digital presence.</p>
        </div>
      </footer>
    `;
  }

  function injectShell() {
    const headerTarget = document.querySelector("[data-site-header]");
    const footerTarget = document.querySelector("[data-site-footer]");
    if (headerTarget) headerTarget.innerHTML = headerMarkup();
    if (footerTarget) footerTarget.innerHTML = footerMarkup();
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

  function trackEvent(name, detail) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: name,
      page,
      ...detail
    });
  }

  function setupTrackedClicks() {
    document.querySelectorAll("[data-track]").forEach(function (element) {
      element.addEventListener("click", function () {
        trackEvent(element.getAttribute("data-track"), {
          label: element.textContent.trim()
        });
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
        field.addEventListener("focus", function () {
          trackEvent("contact_form_started", {
            form: form.getAttribute("name") || "enquiry"
          });
        }, { once: true });
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

  function loadAnalytics() {
    if (config.gtmId) {
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
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", config.googleAnalyticsId);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectShell();
    setupNav();
    setupHeaderState();
    setupTrackedClicks();
    setupReveal();
    setupParallax();
    setupFaq();
    setupForms();
    loadAnalytics();
    trackEvent("page_view", { page });
  });
})();
