import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard, UploadCloud } from "lucide-react";
import { redirect } from "next/navigation";

import { registerAction } from "@/app/actions/auth";
import { MediaFigure } from "@/components/marketing/media-figure";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

const outcomes = [
  {
    icon: CheckCircle2,
    title: "Tell us about the current site and goals",
    description: "Share the business context, what is not working, and what the new site needs to improve.",
  },
  {
    icon: UploadCloud,
    title: "Upload references and brand material",
    description: "Add logos, screenshots, PDFs, inspiration, and notes that should shape the direction.",
  },
  {
    icon: LayoutDashboard,
    title: "Track the project in one client portal",
    description: "Keep the brief, preview, files, payment, and handoff organized from the start.",
  },
];

export const metadata = buildMetadata({
  title: "Start a Project",
  description: "Create your account to submit the brief, share references, and keep the project organized from the start.",
  path: "/register",
  noIndex: true,
});

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <div className="page-shell">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-16 pt-6 md:gap-10 md:pb-24">
        <section className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
          <article className="surface-card section-shell reveal">
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent" variant="trust">
                Start a project
              </Badge>
              <Badge tone="cyan" variant="feature">
                Keep the brief and delivery organized from the start
              </Badge>
            </div>

            <h1 className="mt-6 type-display-2">
              Create your account to submit the brief, share references, and keep the project organized from the start.
            </h1>
            <p className="mt-6 text-measure-lg type-lead">
              The account gives you access to the intake, the preview, the files, and the client portal
              so the whole project can move forward in one clear place.
            </p>

            <div className="mt-8 grid gap-4">
              {outcomes.map(({ icon: Icon, title, description }) => (
                <div key={title} className="feature-panel">
                  <div className="flex gap-3">
                    <Icon className="mt-1 h-5 w-5 shrink-0 text-[var(--color-accent-strong)]" aria-hidden="true" />
                    <div>
                      <h2 className="type-h5">{title}</h2>
                      <p className="mt-2 type-body-sm">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <MediaFigure
                mediaId="dashboard-client"
                eyebrow="Client portal image"
                title="The start of the project should feel clear, premium, and easy to follow."
                className="max-w-xl"
              />
            </div>
          </article>

          <article className="surface-card section-shell reveal reveal-delay-1">
            <Badge tone="gold" variant="trust" icon={CheckCircle2}>
              Create account
            </Badge>

            <h2 className="mt-5 type-h2">Start a project</h2>
            <p className="mt-4 type-body-sm">
              Create your account, then move into the project brief and reference upload.
            </p>

            {params.error ? (
              <div className="mt-6 rounded-[1.3rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {params.error}
              </div>
            ) : null}

            <form action={registerAction} className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="field-label" htmlFor="name">
                  Full name
                </label>
                <input className="text-field" id="name" name="name" required />
              </div>

              <div className="md:col-span-2">
                <label className="field-label" htmlFor="email">
                  Email
                </label>
                <input className="text-field" id="email" name="email" type="email" required />
              </div>

              <div className="md:col-span-2">
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <input className="text-field" id="password" name="password" type="password" minLength={8} required />
              </div>

              <div className="md:col-span-2">
                <button className={buttonStyles({ variant: "primary", className: "w-full" })} type="submit">
                  Create account
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>

            <p className="mt-6 type-body-sm">
              Already have access?{" "}
              <Link className="font-semibold text-[var(--color-accent-strong)]" href="/login">
                Sign in
              </Link>
              .
            </p>
          </article>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
