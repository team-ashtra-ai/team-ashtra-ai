import Link from "next/link";
import {
  ArrowRight,
  CircleDollarSign,
  FolderKanban,
  Gauge,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { IconFrame } from "@/components/ui/icon-frame";
import { requireUser } from "@/lib/auth";
import { calculatePageInsights } from "@/lib/page-insights";
import {
  getNotificationStatusMeta,
  getPaymentStatusMeta,
  getProjectStatusMeta,
} from "@/lib/project-state";
import { getProjectsForViewer } from "@/lib/project-service";
import { formatCurrency, formatDate, summarizeList } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();
  const projects = await getProjectsForViewer(user);
  const hasProjects = projects.length > 0;

  const paidProjects = projects.filter((project) => project.payment.status === "paid").length;
  const unpaidProjects = projects.filter((project) => project.payment.status !== "paid").length;
  const pipelineValue = projects.reduce((total, project) => total + project.payment.amount, 0);
  const averageScore = projects.length
    ? Math.round(
        projects.reduce((sum, project) => {
          return sum + calculatePageInsights(project.siteSnapshot, project.blueprint).overallScore;
        }, 0) / projects.length,
      )
    : 0;

  const overviewCards = [
    {
      icon: FolderKanban,
      tone: "accent" as const,
      label: "Active projects",
      value: String(projects.length),
      note: "Live briefs and relaunches currently visible in the workspace.",
    },
    {
      icon: CircleDollarSign,
      tone: "gold" as const,
      label: "Pipeline value",
      value: formatCurrency(pipelineValue || 0, projects[0]?.payment.currency || "EUR"),
      note: `${paidProjects} paid, ${unpaidProjects} still moving through payment.`,
    },
    {
      icon: Gauge,
      tone: "cyan" as const,
      label: "Average site score",
      value: averageScore ? `${averageScore}/100` : "No score yet",
      note: "Based on the captured source-site snapshots and strategy signals.",
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
      <section className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {overviewCards.map(({ icon, tone, label, value, note }) => (
            <article key={label} className="surface-card rounded-[1.8rem] p-6">
              <IconFrame icon={icon} tone={tone} size="sm" />
              <p className="mt-4 type-meta text-[var(--color-text-subtle)]">{label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink-strong)]">
                {value}
              </p>
              <p className="mt-3 type-body-sm">{note}</p>
            </article>
          ))}
        </div>

        <article className="surface-card section-shell">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge tone="accent" variant="trust" icon={Workflow}>
                Next move
              </Badge>
              <h2 className="mt-5 type-h2">
                {hasProjects
                  ? "Start a new brief while the business context is still fresh."
                  : "Start with the client discovery brief so the AI has real direction."}
              </h2>
              <p className="mt-4 type-body">
                {hasProjects
                  ? "Capture the source URL, page scope, discovery answers, design direction, integrations, and timeline in one pass so the strategy output and the preview start from real operating context instead of loose notes."
                  : "Add the business basics, answer the discovery questions, choose what pages matter, and write any extra AI inspiration. That gives the strategy, quote, imagery suggestions, and optimized preview something concrete to work from."}
              </p>
            </div>
            <Link href="/dashboard/new" className={buttonStyles({ variant: "primary" })}>
              {hasProjects ? "New intake" : "Start the brief"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </article>

        <article className="surface-card section-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge tone="gold" variant="trust">
                Live projects
              </Badge>
              <h2 className="mt-5 type-h2">Project state, payment, and fulfillment in one view.</h2>
            </div>
            <Badge tone="neutral" variant="metric">
              {projects.length} total
            </Badge>
          </div>

          {projects.length ? (
            <div className="mt-6 grid gap-4">
              {projects.map((project) => {
                const insight = calculatePageInsights(project.siteSnapshot, project.blueprint);
                const projectMeta = getProjectStatusMeta(project.status);
                const paymentMeta = getPaymentStatusMeta(project.payment.status);
                const notificationMeta = getNotificationStatusMeta(project.ownerNotification.status);

                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className="rounded-[1.8rem] border border-[color:var(--color-line)] bg-[rgba(255,255,255,0.82)] p-5 transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="max-w-2xl">
                        <div className="flex flex-wrap gap-2">
                          <Badge tone={projectMeta.tone} variant="status">
                            {projectMeta.label}
                          </Badge>
                          <Badge tone={paymentMeta.tone} variant="status">
                            {paymentMeta.label}
                          </Badge>
                          <Badge tone={notificationMeta.tone} variant="status">
                            {notificationMeta.label}
                          </Badge>
                        </div>

                        <h3 className="mt-5 type-h3">{project.intake.companyName}</h3>
                        <p className="mt-2 type-body-sm">{project.intake.sourceUrl}</p>
                        <p className="mt-4 text-measure type-body-sm">{project.blueprint.summary}</p>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3 xl:min-w-[360px]">
                        <div className="metric-panel">
                          <p className="type-meta text-[var(--color-text-subtle)]">Deposit</p>
                          <p className="mt-3 type-h4">
                            {formatCurrency(project.payment.amount, project.payment.currency)}
                          </p>
                        </div>
                        <div className="metric-panel">
                          <p className="type-meta text-[var(--color-text-subtle)]">Site score</p>
                          <p className="mt-3 type-h4">{insight.overallScore}/100</p>
                        </div>
                        <div className="metric-panel">
                          <p className="type-meta text-[var(--color-text-subtle)]">Updated</p>
                          <p className="mt-3 type-h5">{formatDate(project.updatedAt)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 border-t border-[color:var(--color-line)] pt-4 md:grid-cols-2">
                      <div className="feature-panel">
                        <p className="type-meta text-[var(--color-text-subtle)]">Client goals</p>
                        <p className="mt-2 type-body-sm">{summarizeList(project.intake.goals)}</p>
                      </div>
                      <div className="feature-panel">
                        <p className="type-meta text-[var(--color-text-subtle)]">Primary quick win</p>
                        <p className="mt-2 type-body-sm">{project.blueprint.quickWins[0]}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.6rem] border border-dashed border-[color:var(--color-line)] px-6 py-8">
              <Badge tone="accent" variant="metric">
                Start here
              </Badge>
              <h3 className="mt-5 type-h3">Nothing has been submitted yet.</h3>
              <div className="mt-5 grid gap-3">
                {[
                  "Add the company name, website URL, industry, tone, budget, and timeline.",
                  "Answer the client discovery questions and write extra AI inspiration in your own words.",
                  "Choose the page scope, upload references, and generate the quote and preview.",
                ].map((item) => (
                  <div key={item} className="feature-panel type-body-sm">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/dashboard/new?welcome=1" className={buttonStyles({ variant: "primary" })}>
                  Open the discovery brief
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </article>
      </section>

      <aside className="space-y-6">
        <article className="surface-card section-shell">
          <Badge tone="accent" variant="trust" icon={ShieldCheck}>
            What the client can control
          </Badge>
          <div className="mt-6 grid gap-3">
            {[
              "The business URL, goals, timeline, integrations, and budget range.",
              "Discovery answers, preferred visual direction, and direct AI inspiration text.",
              "Reference files that influence strategy and the later handoff.",
            ].map((item) => (
              <div key={item} className="feature-panel type-body-sm">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card section-shell">
          <Badge tone="cyan" variant="trust" icon={Sparkles}>
            Workspace promise
          </Badge>
          <h2 className="mt-5 type-h3">The dashboard should feel like the inside of the same product.</h2>
          <p className="mt-4 type-body-sm">
            That means fewer dead ends, clearer action labels, better delivery-state
            visibility, and a stronger bridge between client expectation and owner-side
            fulfillment.
          </p>
        </article>
      </aside>
    </div>
  );
}
