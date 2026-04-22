import fs from "node:fs/promises";
import path from "node:path";

const outputDir = "/home/ash/nacho/assets/media/overlays/generated";

const overlaySpecs = [
  ["home-premium-website-design-neon-hero-overlay.svg", "home", 0],
  ["home-premium-website-growth-neon-section-overlay.svg", "home", 1],
  ["about-brand-positioning-neon-atlas-hero-overlay.svg", "about", 2],
  ["about-business-perception-neon-manifesto-section-overlay.svg", "about", 3],
  ["services-website-services-neon-system-hero-overlay.svg", "services", 4],
  ["services-digital-growth-neon-panel-section-overlay.svg", "services", 5],
  ["process-web-design-route-neon-hero-overlay.svg", "process", 6],
  ["process-project-timeline-neon-section-overlay.svg", "process", 7],
  ["contact-project-enquiry-neon-route-hero-overlay.svg", "contact", 8],
  ["contact-consultation-path-neon-section-overlay.svg", "contact", 9],
  ["launch-website-project-intake-neon-hero-overlay.svg", "launch", 10],
  ["launch-fast-lane-neon-section-overlay.svg", "launch", 11],
  ["discovery-consultation-choice-neon-hero-overlay.svg", "discovery", 12],
  ["discovery-project-questionnaire-neon-section-overlay.svg", "discovery", 13],
  ["payments-strategy-consultation-neon-hero-overlay.svg", "payments", 14],
  ["payments-project-clarity-neon-section-overlay.svg", "payments", 15],
  ["schedule-consultation-booking-neon-hero-overlay.svg", "schedule", 16],
  ["schedule-time-slot-neon-section-overlay.svg", "schedule", 17],
  ["examples-website-portfolio-neon-hero-overlay.svg", "examples", 18],
  ["examples-case-study-gallery-neon-section-overlay.svg", "examples", 19],
  ["faq-website-questions-neon-hero-overlay.svg", "faq", 20],
  ["faq-support-topics-neon-section-overlay.svg", "faq", 21],
  ["privacy-data-policy-neon-hero-overlay.svg", "privacy", 22],
  ["privacy-information-handling-neon-section-overlay.svg", "privacy", 23],
  ["terms-service-agreement-neon-hero-overlay.svg", "terms", 24],
  ["terms-commercial-scope-neon-section-overlay.svg", "terms", 25],
  ["cookies-policy-preferences-neon-hero-overlay.svg", "cookies", 26],
  ["cookies-consent-choice-neon-section-overlay.svg", "cookies", 27],
  ["accessibility-web-usability-neon-hero-overlay.svg", "accessibility", 28],
  ["accessibility-inclusive-navigation-neon-section-overlay.svg", "accessibility", 29]
];

function buildOverlay(page, seed) {
  const orbitX = 960 + (seed % 5) * 74;
  const orbitY = 230 + (seed % 4) * 38;
  const orbitR = 160 + (seed % 6) * 30;
  const arcOffset = 90 + seed * 7;
  const accentOpacity = (0.12 + (seed % 7) * 0.02).toFixed(2);
  const dashA = 8 + (seed % 4) * 3;
  const dashB = 14 + (seed % 5) * 3;
  const label = page.toUpperCase();

  return `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="beam-${seed}" x1="1460" y1="${120 + seed * 3}" x2="820" y2="${760 - seed * 4}" gradientUnits="userSpaceOnUse">
      <stop stop-color="#AEF7FF" stop-opacity="0.62"/>
      <stop offset="0.46" stop-color="#59B8FF" stop-opacity="0.24"/>
      <stop offset="1" stop-color="#071120" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glow-${seed}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${orbitX} ${orbitY}) rotate(128) scale(440 360)">
      <stop stop-color="#7DEFFF" stop-opacity="0.34"/>
      <stop offset="0.46" stop-color="#328FFF" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#050D18" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#glow-${seed})"/>
  <g opacity="${accentOpacity}">
    <path d="M0 ${160 + arcOffset}H1600" stroke="#7DEBFF" stroke-width="1"/>
    <path d="M0 ${320 + arcOffset}H1600" stroke="#7DEBFF" stroke-width="1"/>
    <path d="M0 ${480 + arcOffset}H1600" stroke="#7DEBFF" stroke-width="1"/>
    <path d="M0 ${640 + arcOffset}H1600" stroke="#7DEBFF" stroke-width="1"/>
    <path d="M180 0V1000" stroke="#7DEBFF" stroke-width="1"/>
    <path d="M470 0V1000" stroke="#7DEBFF" stroke-width="1"/>
    <path d="M760 0V1000" stroke="#7DEBFF" stroke-width="1"/>
    <path d="M1050 0V1000" stroke="#7DEBFF" stroke-width="1"/>
    <path d="M1340 0V1000" stroke="#7DEBFF" stroke-width="1"/>
  </g>
  <g opacity="0.46">
    <circle cx="${orbitX}" cy="${orbitY}" r="${orbitR}" stroke="#85F2FF" stroke-opacity="0.34" stroke-width="1.4"/>
    <circle cx="${orbitX}" cy="${orbitY}" r="${orbitR + 72}" stroke="#5ABEFF" stroke-opacity="0.22" stroke-width="1.1"/>
    <circle cx="${orbitX}" cy="${orbitY}" r="${orbitR + 154}" stroke="#8FF7FF" stroke-opacity="0.12" stroke-width="1"/>
    <path d="M${720 - seed * 6} ${730 - seed * 2}C${940 - seed * 2} ${650 - seed * 3} ${1090 + seed * 5} ${520 - seed * 2} ${1420 - seed * 2} ${360 + seed * 4}" stroke="url(#beam-${seed})" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M${680 - seed * 4} ${810 - seed * 3}C${860 - seed * 2} ${700 - seed * 2} ${1030 + seed * 5} ${580 - seed * 3} ${1380 - seed * 2} ${420 + seed * 4}" stroke="#7DEBFF" stroke-opacity="0.18" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="${dashA} ${dashB}"/>
    <circle cx="${1140 + seed * 4}" cy="${328 + seed * 5}" r="${5 + (seed % 4)}" fill="#8FF5FF" fill-opacity="0.48"/>
    <circle cx="${1260 + seed * 2}" cy="${510 + seed * 3}" r="${4 + (seed % 3)}" fill="#5CC0FF" fill-opacity="0.34"/>
    <circle cx="${950 + seed * 3}" cy="${286 + seed * 4}" r="${3 + (seed % 3)}" fill="#9AF9FF" fill-opacity="0.34"/>
  </g>
  <text x="88" y="900" fill="#8EDFFF" fill-opacity="0.24" font-family="IBM Plex Mono, monospace" font-size="28" letter-spacing="6">${label}</text>
</svg>
`;
}

await fs.mkdir(outputDir, { recursive: true });

await Promise.all(
  overlaySpecs.map(async ([filename, page, seed]) => {
    const filepath = path.join(outputDir, filename);
    await fs.writeFile(filepath, buildOverlay(page, seed), "utf8");
  })
);

console.log(`Generated ${overlaySpecs.length} overlays in ${outputDir}`);
