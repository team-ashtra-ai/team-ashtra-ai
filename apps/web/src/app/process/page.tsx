import Link from "next/link";
import { ArrowRight, CheckCircle2, Search, ShieldCheck, Workflow } from "lucide-react";

import { MediaFigure } from "@/components/marketing/media-figure";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { getAbsoluteUrl } from "@/lib/site-config";

const steps = [
  {
    label: "01",
    title: "Review the current site and business context",
    description:
      "We look at the current website, the offer, the audience, the trust gaps, and the pages that matter most so the work starts from the real business problem.",
  },
  {
    label: "02",
    title: "Clarify the message and page structure",
    description:
      "We reshape the page hierarchy so visitors can understand who the business helps, why it matters, and what to do next without decoding internal language.",
  },
  {
    label: "03",
    title: "Build the SEO-ready page system",
    description:
      "We design the site with cleaner headings, metadata, schema, internal linking, accessibility, and multilingual readiness built into the structure from the start.",
  },
  {
    label: "04",
    title: "Connect it to the client delivery experience",
    description:
      "We make the client portal feel clear and premium too, with visible progress, files, payment details, preview feedback, and organized handoff.",
  },
];

const principles = [
  "Keep the process clear enough for the client to picture from the first conversation.",
  "Build the message, design, SEO, accessibility, and client journey as one coherent transformation.",
  "Make the public pages and the client portal feel like parts of the same premium experience.",
];

export const metadata = buildMetadata({
  title: "How It Works",
  description:
    "See how ash-tra reviews the current site, clarifies the message, builds SEO-ready pages, and connects the work to a premium client portal experience.",
  path: "/process",
  keywords: [
    "how it works",
    "website transformation process",
    "seo-ready website process",
    "client portal process",
  ],
});

export default function ProcessPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Website transformation process",
    provider: {
      "@type": "Organization",
      name: "ash-tra.com",
      url: getAbsoluteUrl("/"),
    },
    url: getAbsoluteUrl("/process"),
    description:
      "A clear process for reviewing the current site, clarifying the message, building the SEO-ready page system, and connecting the work to the client portal experience.",
  };

  return (
    <div className="page-shell">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-16 pt-6 md:gap-10 md:pb-24">
        <JsonLd data={jsonLd} />

        <section className="surface-card section-shell reveal">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent" variant="trust" icon={Workflow}>
              How it works
            </Badge>
            <Badge tone="cyan" variant="feature" icon={Search}>
              A visible process from review to handoff
            </Badge>
          </div>
          <h1 className="type-display-2 mt-6 max-w-5xl">
            A clear process from current-site review to a stronger website and client portal experience.
          </h1>
          <p className="mt-6 text-measure-lg type-lead">
            The process should feel simple, visible, and commercially grounded. Clients
            should be able to understand what happens next and why each step matters to the final result.
          </p>
        </section>

        <section className="grid gap-4">
          {steps.map((step, index) => (
            <article
              key={step.label}
              className={`surface-card section-shell reveal ${index > 0 ? `reveal-delay-${Math.min(index, 3)}` : ""}`}
            >
              <div className="grid gap-4 lg:grid-cols-[120px_1fr]">
                <div>
                  <Badge tone="gold" variant="process">
                    Step {step.label}
                  </Badge>
                </div>
                <div>
                  <h2 className="type-h3">{step.title}</h2>
                  <p className="mt-4 text-measure-lg type-body-sm">{step.description}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
          <article className="surface-card section-shell reveal">
            <Badge tone="accent" variant="trust" icon={ShieldCheck}>
              Process principles
            </Badge>
            <h2 className="mt-5 type-h2">
              The work should feel calm, clear, and easy to trust while it is moving.
            </h2>
            <div className="mt-6 grid gap-3">
              {principles.map((item) => (
                <div key={item} className="feature-panel flex gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--color-cyan-deep)]" aria-hidden="true" />
                  <p className="type-body-sm">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <div className="surface-card section-shell reveal reveal-delay-1">
            <MediaFigure
              mediaId="process-interface"
              eyebrow="Process image"
              title="The visible process should make the transformation feel organized rather than abstract."
            />
          </div>
        </section>

        <section className="surface-dark rounded-[2rem] px-8 py-10 md:px-10">
          <div className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-end">
            <div>
              <Badge tone="accent" variant="trust" icon={ShieldCheck}>
                Outcome
              </Badge>
              <h2 className="mt-5 type-h2 text-[var(--color-cloud)]">
                The client should feel guided, informed, and well handled from the first brief to the final delivery.
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "Clearer decisions around what changes and why",
                "Cleaner SEO, accessibility, and multilingual foundations",
                "A lower-friction journey from enquiry to handoff",
                "A client portal that reinforces the quality of the public site",
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
              <Badge tone="gold" variant="trust">
                Start
              </Badge>
              <h2 className="mt-5 type-h2">
                If the current site already has trust or traffic, a clearer structure can create value quickly.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className={buttonStyles({ variant: "primary" })}>
                Start a Project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/consultation" className={buttonStyles({ variant: "secondary" })}>
                View Consultation
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
