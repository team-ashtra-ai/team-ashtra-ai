import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { loginAction } from "@/app/actions/auth";
import { MediaFigure } from "@/components/marketing/media-figure";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

const sellingPoints = [
  "View project updates, files, payment status, and delivery notes in one place.",
  "Keep the project organized without searching through email threads.",
  "See the same calm, premium experience after sign-in as you saw on the public site.",
];

export const metadata = buildMetadata({
  title: "Client Login",
  description: "Sign in to view project updates, files, payment status, and delivery notes.",
  path: "/login",
  noIndex: true,
});

export default async function LoginPage({
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
          <article className="surface-dark rounded-[2rem] px-8 py-10 md:px-10 md:py-12">
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent" variant="trust" icon={LayoutDashboard}>
                Client portal login
              </Badge>
              <Badge tone="cyan" variant="feature" icon={ShieldCheck}>
                Project updates, files, payment, handoff
              </Badge>
            </div>

            <h1 className="mt-6 type-display-2 text-[var(--color-cloud)]">
              Sign in to view project updates, files, payment status, and delivery notes.
            </h1>
            <p className="mt-6 max-w-2xl type-body text-white/74">
              Use the email and password connected to your workspace.
            </p>

            <div className="mt-8 grid gap-3">
              {sellingPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border border-white/10 bg-white/8 px-4 py-4"
                >
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-white/82" aria-hidden="true" />
                    <p className="type-body-sm text-white/74">{item}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <MediaFigure
                mediaId="dashboard-client"
                eyebrow="Client portal image"
                title="The signed-in experience should feel organized and reassuring."
                className="max-w-xl"
              />
            </div>
          </article>

          <article className="surface-card section-shell reveal">
            <div className="flex flex-wrap gap-2">
              <Badge tone="gold" variant="trust" icon={LayoutDashboard}>
                Sign in
              </Badge>
            </div>

            <h2 className="mt-5 type-h2">Client portal login</h2>
            <p className="mt-4 type-body-sm">
              Enter the email and password connected to your account.
            </p>

            {params.error ? (
              <div className="mt-6 rounded-[1.3rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {params.error}
              </div>
            ) : null}

            <form action={loginAction} className="mt-8 space-y-5">
              <div>
                <label className="field-label" htmlFor="email">
                  Email
                </label>
                <input className="text-field" id="email" name="email" type="email" required />
              </div>

              <div>
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <input className="text-field" id="password" name="password" type="password" required />
              </div>

              <button className={buttonStyles({ variant: "primary", className: "w-full" })} type="submit">
                Sign in
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            <p className="mt-6 type-body-sm">
              Need access?{" "}
              <Link className="font-semibold text-[var(--color-accent-strong)]" href="/register">
                Create an account
              </Link>{" "}
              or contact the team.
            </p>
          </article>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
