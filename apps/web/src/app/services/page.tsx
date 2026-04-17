import Link from "next/link";
import {
  ArrowRight,
  Compass,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { MediaFigure } from "@/components/marketing/media-figure";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { IconFrame } from "@/components/ui/icon-frame";
import { buttonStyles } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { getAbsoluteUrl } from "@/lib/site-config";

const serviceTracks = [
  {
    icon: Compass,
    tone: "accent" as const,
    title: "Messaging and positioning",
    summary:
      "Clarify what the business does, who it is for, and why the right buyer should trust it.",
    bullets: [
      "Homepage and service-page hierarchy",
      "Offer framing and clearer calls to action",
      "Proof placement that supports trust instead of hiding it",
    ],
  },
  {
    icon: Search,
    tone: "cyan" as const,
    title: "Website SEO foundations",
    summary:
      "Build SEO into the page structure from the start so the site is easier for search engines and users to understand.",
    bullets: [
      "Metadata, schema, heading structure, and internal linking",
      "Search-aware page intent and semantic content structure",
      "Performance, accessibility, and crawl-friendly foundations",
    ],
  },
  {
    icon: LayoutDashboard,
    tone: "gold" as const,
    title: "Client portal and delivery flow",
    summary:
      "Make the post-sale experience feel organized, premium, and easy to follow for both client and team.",
    bullets: [
      "Project updates, files, payment, and handoff in one portal",
      "Clearer onboarding and lower-friction communication",
      "A client journey that supports the value of the work after sign-up",
    ],
  },
];

const benefits = [
  "A clearer offer and stronger first impression",
  "A more modern, premium visual direction",
  "Better search foundations and content structure",
  "Accessibility-minded design choices from the start",
  "Multilingual readiness where the business needs it",
  "A smoother client journey after the sale",
];

export const metadata = buildMetadata({
  title: "Services",
  description:
    "ash-tra helps premium service businesses improve messaging, SEO foundations, accessibility, multilingual readiness, and the client portal experience.",
  path: "/services",
  keywords: [
    "website transformation services",
    "messaging and positioning",
    "website SEO foundations",
    "client portal design",
  ],
});

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Premium website and client portal transformation",
    provider: {
      "@type": "Organization",
      name: "ash-tra.com",
      url: getAbsoluteUrl("/"),
    },
    url: getAbsoluteUrl("/services"),
    description:
      "Messaging, SEO foundations, accessibility-minded design, multilingual readiness, and client portal delivery for premium service businesses.",
  };

  return (
    <div className="page-shell">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-16 pt-6 md:gap-10 md:pb-24">
        <JsonLd data={jsonLd} />

        <section className="surface-card section-shell reveal">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent" variant="trust" icon={Sparkles}>
              Services
            </Badge>
            <Badge tone="cyan" variant="feature" icon={ShieldCheck}>
              What improves for the business
            </Badge>
          </div>

          <h1 className="type-display-2 mt-6 max-w-5xl">
            Services for premium service businesses whose digital presence no longer reflects the quality of their work.
          </h1>
          <p className="mt-6 text-measure-lg type-lead">
            ash-tra improves the message, the structure, the search foundations,
            and the client experience around the site so the business feels easier to
            understand, easier to trust, and easier to buy from.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          {serviceTracks.map(({ icon, tone, title, summary, bullets }) => (
            <article key={title} className="surface-card section-shell reveal">
              <IconFrame icon={icon} tone={tone} />
              <h2 className="mt-5 type-h3">{title}</h2>
              <p className="mt-4 type-body-sm">{summary}</p>
              <div className="mt-5 grid gap-3">
                {bullets.map((item) => (
                  <div key={item} className="feature-panel flex gap-3">
                    <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent-strong)]" aria-hidden="true" />
                    <p className="type-body-sm">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
          <article className="surface-card section-shell reveal">
            <Badge tone="gold" variant="trust" icon={Workflow}>
              What clients receive
            </Badge>
            <h2 className="mt-5 type-h2">
              The outcome is a stronger website system, not just a cosmetic refresh.
            </h2>
            <div className="mt-6 grid gap-3">
              {benefits.map((item) => (
                <div key={item} className="feature-panel flex gap-3">
                  <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[var(--color-cyan-deep)]" aria-hidden="true" />
                  <p className="type-body-sm">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <div className="surface-card section-shell reveal reveal-delay-1">
            <MediaFigure
              mediaId="services-strategy"
              eyebrow="Services image"
              title="The work should feel commercially useful, visually refined, and technically credible."
            />
          </div>
        </section>

        <section className="surface-dark rounded-[2rem] px-8 py-10 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <Badge tone="accent" variant="trust">
                Why it matters
              </Badge>
              <h2 className="mt-5 type-h2 text-[var(--color-cloud)]">
                A stronger site should improve how the business is perceived before and after the sale.
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "The offer becomes easier to understand quickly.",
                "Trust cues move closer to the promise.",
                "SEO and accessibility are built into the work, not added late.",
                "The client portal reinforces the premium feel of the service.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border border-white/10 bg-white/8 px-4 py-4 type-body-sm text-white/78"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-card section-shell reveal">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge tone="accent" variant="trust">
                Next step
              </Badge>
              <h2 className="mt-5 type-h2">
                If the current site undersells the business, we improve the message, the structure, and the client journey together.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className={buttonStyles({ variant: "primary" })}>
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/process" className={buttonStyles({ variant: "secondary" })}>
                See How It Works
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
