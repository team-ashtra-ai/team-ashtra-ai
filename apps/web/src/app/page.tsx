import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Globe2,
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
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const pillars = [
  {
    icon: Compass,
    tone: "accent" as const,
    title: "Messaging and positioning",
    description:
      "Clarify what the business does, who it is for, and why the right buyer should trust it.",
  },
  {
    icon: Search,
    tone: "cyan" as const,
    title: "SEO foundations",
    description:
      "Build page structure, metadata, schema, headings, internal linking, and search intent into the site from the start.",
  },
  {
    icon: Workflow,
    tone: "gold" as const,
    title: "Client portal and delivery flow",
    description:
      "Keep project updates, files, payment, and handoff organized in a client portal that feels as polished as the public site.",
  },
];

const trustSignals = [
  "Clearer messaging and first-impression trust",
  "Accessibility-minded design and cleaner mobile usability",
  "Multilingual readiness for businesses serving more than one audience",
  "A smoother path from first visit to final handoff",
];

const outcomes = [
  "Easier to understand",
  "Easier to trust",
  "Easier to find in search",
  "Easier to navigate",
  "Easier to buy from",
  "Easier to manage after the sale",
];

const portalNotes = [
  "Project updates stay visible instead of disappearing into email threads.",
  "Files, payment status, preview feedback, and delivery notes live in one place.",
  "The premium promise continues after sign-up instead of falling into a generic workflow.",
];

export const metadata = buildMetadata({
  title: "Premium Websites And Client Portals",
  description:
    "ash-tra redesigns websites and client portals for premium service businesses that need clearer messaging, stronger SEO foundations, better accessibility, multilingual readiness, and a smoother client journey.",
  path: "/",
  keywords: [
    "premium website design",
    "website transformation for service businesses",
    "client portal design",
    "seo foundations",
    "website accessibility",
    "multilingual website redesign",
  ],
});

export default function HomePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: getAbsoluteUrl("/"),
      description: siteConfig.longDescription,
      slogan: siteConfig.tagline,
      logo: getAbsoluteUrl("/brand/ash-tra-logo-horizontal.svg"),
      image: getAbsoluteUrl(siteConfig.socialLockupPath),
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Design-led website transformation and client portal design",
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
        url: getAbsoluteUrl("/"),
      },
      areaServed: "Worldwide",
      audience: {
        "@type": "Audience",
        audienceType: "Premium service businesses, consultancies, agencies, and expert-led firms",
      },
      description:
        "ash-tra redesigns websites and client portals to improve clarity, trust, SEO, accessibility, multilingual usability, and the overall client journey.",
    },
  ];

  return (
    <div className="page-shell">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-16 pt-6 md:gap-10 md:pb-24">
        <JsonLd data={jsonLd} />

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <article className="surface-card section-shell reveal">
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent" variant="trust" icon={Sparkles}>
                Premium website transformation
              </Badge>
              <Badge tone="cyan" variant="feature" icon={ShieldCheck}>
                Design, SEO, accessibility, and client journey together
              </Badge>
            </div>

            <h1 className="type-display-1 mt-6 max-w-5xl">
              Premium websites and client portals for service businesses that need a stronger digital presence.
            </h1>
            <p className="mt-6 text-measure-lg type-lead">
              ash-tra redesigns websites and client portals for serious service businesses
              that need clearer messaging, stronger SEO foundations, better accessibility,
              multilingual readiness, and a smoother client journey from first visit to final handoff.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className={buttonStyles({ variant: "primary" })}>
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/services" className={buttonStyles({ variant: "secondary" })}>
                See Services
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="metric-panel">
                <p className="type-meta text-[var(--color-accent-strong)]">Clarity</p>
                <p className="mt-3 type-h4">Explain the offer faster and reduce confusion for the right buyer.</p>
              </div>
              <div className="metric-panel">
                <p className="type-meta text-[var(--color-cyan-deep)]">Trust</p>
                <p className="mt-3 type-h4">Make the business look as capable, current, and premium as it really is.</p>
              </div>
              <div className="metric-panel">
                <p className="type-meta text-[var(--color-gold-deep)]">Journey</p>
                <p className="mt-3 type-h4">Carry the same quality through enquiry, delivery, and handoff.</p>
              </div>
            </div>
          </article>

          <aside className="surface-card section-shell reveal reveal-delay-1">
            <MediaFigure
              mediaId="hero-studio"
              eyebrow="Homepage image"
              title="A premium website should feel calm, current, and commercially serious from the first screen."
              priority
            />

            <div className="mt-6 grid gap-3">
              {trustSignals.map((item) => (
                <div key={item} className="feature-panel flex gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--color-cyan-deep)]" aria-hidden="true" />
                  <p className="type-body-sm">{item}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="surface-dark rounded-[2rem] px-8 py-10 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <Badge tone="accent" variant="trust">
                What improves
              </Badge>
              <h2 className="mt-5 type-h2 text-[var(--color-cloud)]">
                The result should feel like a full digital upgrade to the business, not just a nicer homepage.
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {outcomes.map((item) => (
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

        <section className="grid gap-6">
          <div className="max-w-3xl reveal">
            <Badge tone="gold" variant="trust">
              Services
            </Badge>
            <h2 className="mt-5 type-h2">
              Three areas we improve together so the whole site works harder for the business.
            </h2>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {pillars.map(({ icon, tone, title, description }) => (
              <article key={title} className="surface-card section-shell reveal">
                <IconFrame icon={icon} tone={tone} />
                <h3 className="mt-5 type-h3">{title}</h3>
                <p className="mt-4 type-body-sm">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <article className="surface-card section-shell reveal">
            <div className="flex flex-wrap gap-2">
              <Badge tone="cyan" variant="trust" icon={Globe2}>
                Accessibility and multilingual readiness
              </Badge>
            </div>
            <h2 className="mt-5 type-h2">
              A modern premium website should be easier to use for more people, across more contexts.
            </h2>
            <p className="mt-5 text-measure type-body">
              That means sensible structure, readable contrast, clear forms, strong mobile
              usability, and language systems that feel deliberate rather than bolted on.
              Accessibility and multilingual clarity are part of website quality, not extras.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/process" className={buttonStyles({ variant: "secondary" })}>
                See How It Works
              </Link>
              <Link href="/consultation" className={buttonStyles({ variant: "ghost" })}>
                View Consultation
              </Link>
            </div>
          </article>

          <div className="surface-card section-shell reveal reveal-delay-1">
            <MediaFigure
              mediaId="process-interface"
              eyebrow="Process image"
              title="Good design, technical quality, and client usability should reinforce one another."
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="surface-card section-shell reveal">
            <Badge tone="accent" variant="trust" icon={Workflow}>
              Client portal
            </Badge>
            <h2 className="mt-5 type-h2">
              The premium experience should continue after the client signs.
            </h2>
            <p className="mt-5 text-measure type-body">
              The client portal is where project updates, files, payment, preview feedback,
              and handoff stay organized. That continuity matters because a premium public site
              should not lead into a confusing internal experience.
            </p>

            <div className="mt-6 grid gap-3">
              {portalNotes.map((item) => (
                <div key={item} className="feature-panel flex gap-3">
                  <Workflow className="mt-1 h-5 w-5 shrink-0 text-[var(--color-accent-strong)]" aria-hidden="true" />
                  <p className="type-body-sm">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <div className="surface-card section-shell reveal reveal-delay-1">
            <MediaFigure
              mediaId="dashboard-client"
              eyebrow="Client portal image"
              title="The post-sale experience should feel ordered, reassuring, and easy to follow."
            />
          </div>
        </section>

        <section className="surface-card section-shell reveal">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge tone="gold" variant="trust">
                Start
              </Badge>
              <h2 className="mt-5 type-h2">
                If the business is stronger than the website, the next step is a clearer, more credible digital presence.
              </h2>
              <p className="mt-4 type-body">
                Start the project, share the current site and references, and we will shape
                a website and client experience that feels more modern, more premium, and more commercially effective.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/register" className={buttonStyles({ variant: "primary" })}>
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/login" className={buttonStyles({ variant: "secondary" })}>
                Client Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
