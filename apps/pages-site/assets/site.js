const supportTopics = {
  website: {
    title: "Need a stronger website?",
    body:
      "Start with a consultation if you want help shaping the message, page priorities, and visual direction. If you already know what needs to change, start the project directly.",
    primaryHref: "/consultation/",
    primaryLabel: "Book a consultation",
  },
  enquiries: {
    title: "Want more clarity and better enquiries?",
    body:
      "The fastest wins usually come from clearer positioning, stronger calls to action, and a page structure that makes it obvious what to do next.",
    primaryHref: "/services/",
    primaryLabel: "See what we improve",
  },
  portal: {
    title: "Need a cleaner client experience?",
    body:
      "ash-tra can bring the same premium feel into the delivery side too, with project updates, files, payment, and handoff kept in one client-facing flow.",
    primaryHref: "/process/",
    primaryLabel: "See the process",
  },
  unsure: {
    title: "Not sure where to start?",
    body:
      "Email the team or send a WhatsApp message and explain what feels off about the current site. We can point you to the right next step quickly.",
    primaryHref: "mailto:team.ashtra.ai@gmail.com",
    primaryLabel: "Email ash-tra",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = new Date().getFullYear().toString();
  });

  const root = document.getElementById("support-dock-root");
  if (!root) {
    return;
  }

  root.innerHTML = `
    <div class="support-dock">
      <button
        class="support-toggle"
        type="button"
        aria-expanded="false"
        aria-controls="support-panel"
        data-support-toggle
      >
        <span class="support-toggle__mark">
          <img src="/brand/ash-tra-mark-gold.png" alt="" width="48" height="48" loading="lazy" decoding="async" />
        </span>
        <span class="support-toggle__copy">
          <strong>Need help?</strong>
          <span>Ask the site guide</span>
        </span>
      </button>

      <a
        class="whatsapp-float"
        href="https://api.whatsapp.com/send/?phone=5543991324028"
        target="_blank"
        rel="noreferrer"
        aria-label="Message ash-tra on WhatsApp"
      >
        WhatsApp
      </a>

      <section class="support-panel" id="support-panel" hidden>
        <div class="support-panel__header">
          <div>
            <p class="support-panel__eyebrow">ash-tra guide</p>
            <h2>Choose the easiest next step</h2>
          </div>
          <button class="support-close" type="button" aria-label="Close help panel" data-support-close>
            Close
          </button>
        </div>

        <div class="support-topic-grid" role="tablist" aria-label="Help topics">
          <button class="support-topic is-active" type="button" data-support-topic="website">Website</button>
          <button class="support-topic" type="button" data-support-topic="enquiries">Enquiries</button>
          <button class="support-topic" type="button" data-support-topic="portal">Portal</button>
          <button class="support-topic" type="button" data-support-topic="unsure">Unsure</button>
        </div>

        <div class="support-answer">
          <h3 data-support-title></h3>
          <p data-support-body></p>
        </div>

        <div class="support-actions">
          <a class="button button-primary button-compact" data-support-primary href="/consultation/"></a>
          <a class="button button-secondary button-compact" href="mailto:team.ashtra.ai@gmail.com">Email us</a>
          <a
            class="button button-ghost button-compact"
            href="https://api.whatsapp.com/send/?phone=5543991324028"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </section>
    </div>
  `;

  const toggle = root.querySelector("[data-support-toggle]");
  const panel = root.querySelector(".support-panel");
  const closeButton = root.querySelector("[data-support-close]");
  const title = root.querySelector("[data-support-title]");
  const body = root.querySelector("[data-support-body]");
  const primary = root.querySelector("[data-support-primary]");
  const topicButtons = Array.from(root.querySelectorAll("[data-support-topic]"));

  const setTopic = (key) => {
    const topic = supportTopics[key];
    if (!topic) {
      return;
    }

    topicButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.supportTopic === key);
    });

    title.textContent = topic.title;
    body.textContent = topic.body;
    primary.textContent = topic.primaryLabel;
    primary.setAttribute("href", topic.primaryHref);
  };

  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    root.classList.toggle("support-dock--open", open);
  };

  setTopic("website");

  toggle.addEventListener("click", () => setOpen(panel.hidden));
  closeButton.addEventListener("click", () => setOpen(false));

  topicButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setTopic(button.dataset.supportTopic);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });
});
