import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Compass,
  Search,
  Workflow,
} from "lucide-react";

import { MediaFigure } from "@/components/marketing/media-figure";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { getAbsoluteUrl } from "@/lib/site-config";

const tracks = [
  {
    title: "Ready to move",
    description:
      "Start the project, choose the pages that matter, and move straight into the multi-page preview workflow.",
  },
  {
    title: "Need help deciding",
    description:
      "Use the guided consultation if you want help shaping the message, the page priorities, and the visual direction first.",
  },
  {
    title: "Want to test the direction",
    description:
      "Review the preview, request changes, and approve the direction once it feels commercially right.",
  },
];

const outcomes = [
  "A clearer brief built from business goals, audience needs, and practical constraints.",
  "A better page scope so the work can improve more than just the homepage.",
  "A preview that lets the client react before the final direction is accepted.",
  "Clear decisions around hosting, domain, integrations, accessibility, multilingual needs, and support.",
];

export const metadata = buildMetadata({
  title: "Consultation",
  description:
    "Guided discovery for service businesses that need help defining the message, page priorities, and website direction before the full transformation moves ahead.",
  path: "/consultation",
  keywords: [
    "website consultation",
    "client discovery",
    "website strategy session",
    "preview before approval",
  ],
});

export default function ConsultationPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Website discovery consultation",
    provider: {
      "@type": "Organization",
      name: "ash-tra.com",
      url: getAbsoluteUrl("/"),
    },
    url: getAbsoluteUrl("/consultation"),
    description:
      "A guided consultation for service businesses that need help clarifying the message, page scope, and website direction before the build moves ahead.",
  };

  return (
    <div className="page-shell">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-16 pt-6 md:gap-10 md:pb-24">
        <JsonLd data={jsonLd} />

        <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <article className="surface-card section-shell reveal">
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent" variant="trust" icon={Compass}>
                Discovery consultation
              </Badge>
              <Badge tone="cyan" variant="feature" icon={CalendarClock}>
                Guided help before the direction is locked
              </Badge>
            </div>

            <h1 className="mt-6 type-display-2">
              For clients who need help deciding what the new site should say, show, and prioritize.
            </h1>
            <p className="mt-6 text-measure-lg type-lead">
              Some clients already know what they want. Others need help defining the message,
              the visual direction, the page priorities, and the technical needs first. The
              consultation flow makes those choices clearer before the full transformation moves ahead.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className={buttonStyles({ variant: "primary" })}>
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/process" className={buttonStyles({ variant: "secondary" })}>
                See How It Works
              </Link>
            </div>
          </article>

          <div className="surface-card section-shell reveal reveal-delay-1">
            <MediaFigure
              mediaId="services-strategy"
              eyebrow="Consultation image"
              title="The discovery step should feel collaborative, clear, and easy to react to."
            />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {tracks.map((track) => (
            <article key={track.title} className="surface-card section-shell reveal">
              <Badge tone="gold" variant="metric">
                Path
              </Badge>
              <h2 className="mt-5 type-h3">{track.title}</h2>
              <p className="mt-4 type-body-sm">{track.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <article className="surface-card section-shell reveal">
            <Badge tone="accent" variant="trust" icon={Workflow}>
              What the consultation covers
            </Badge>
            <div className="mt-6 grid gap-3">
              {outcomes.map((item) => (
                <div key={item} className="feature-panel flex gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--color-cyan-deep)]" aria-hidden="true" />
                  <p className="type-body-sm">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card section-shell reveal reveal-delay-1">
            <Badge tone="cyan" variant="trust" icon={Search}>
              Why it matters
            </Badge>
            <h2 className="mt-5 type-h2">
              The best projects start with clearer decisions, not bigger blocks of jargon.
            </h2>
            <p className="mt-5 type-body">
              The consultation helps turn rough preferences into a practical brief. That
              makes the preview stronger, the project easier to manage, and the final site
              much more likely to feel right for the business.
            </p>
          </article>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
