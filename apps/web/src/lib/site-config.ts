export const siteConfig = {
  name: "ash-tra.com",
  shortName: "ash-tra",
  motto: "Overcoming challenges. Pursuing goals.",
  tagline: "Design-led website transformation for premium service businesses.",
  description:
    "Premium websites and client portals for service businesses that need clearer messaging, stronger SEO foundations, better accessibility, multilingual readiness, and a smoother client journey.",
  longDescription:
    "ash-tra.com redesigns websites and client portals for serious service businesses, improving clarity, trust, SEO, accessibility, multilingual usability, and the overall client journey from first visit to final handoff.",
  defaultPath: "/",
  supportEmail: "team.ashtra.ai@gmail.com",
  whatsappHref: "https://api.whatsapp.com/send/?phone=5543991324028",
  ogImagePath: "/brand/ash-tra-social-lockup.png",
  iconPath: "/brand/favicon-32.png",
  socialLockupPath: "/brand/ash-tra-social-lockup.png",
  navItems: [
    { href: "/services", label: "Services" },
    { href: "/process", label: "How It Works" },
    { href: "/consultation", label: "Consultation" },
  ],
  keywords: [
    "premium website redesign",
    "design-led website transformation",
    "premium website design for service businesses",
    "client dashboard experience",
    "technical SEO relaunch",
    "website migration service",
    "website accessibility",
    "multilingual website design",
  ],
} as const;

export function getSiteUrl() {
  const fallback = "https://ash-tra.com";
  const candidate = process.env.NEXT_PUBLIC_APP_URL || fallback;

  try {
    return new URL(candidate);
  } catch {
    return new URL(fallback);
  }
}

export function getAbsoluteUrl(path = "/") {
  const url = new URL(path, getSiteUrl());
  return url.toString();
}
