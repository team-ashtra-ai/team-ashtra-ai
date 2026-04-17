import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Mail,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { notFound } from "next/navigation";

import {
  approvePreviewAction,
  markManualPaidAction,
  savePreviewFeedbackAction,
  startCheckoutAction,
} from "@/app/actions/projects";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import {
  calculatePageInsights,
  getInsightSummary,
  getScoreColor,
  scoreToGrade,
} from "@/lib/page-insights";
import {
  buildDeliveryTimeline,
  getAutomationStatusMeta,
  getNotificationStatusMeta,
  getPaymentStatusMeta,
  getProjectStatusMeta,
} from "@/lib/project-state";
import { getProjectForViewer } from "@/lib/project-service";
import { formatCurrency, formatDate, summarizeList } from "@/lib/utils";

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ payment?: string; paid?: string; checkout?: string; preview?: string }>;
}) {
  const user = await requireUser();
  const { projectId } = await params;
  const query = await searchParams;
  let project;

  try {
    project = await getProjectForViewer(projectId, user);
  } catch {
    notFound();
  }

  const insights = calculatePageInsights(project.siteSnapshot, project.blueprint);
  const insightSummary = getInsightSummary(insights);
  const selectedVariation =
    project.blueprint.designVariations.find(
      (variation) => variation.id === project.intake.styleDirection,
    ) || project.blueprint.designVariations[0];
  const paymentCompleted = project.payment.status === "paid" || query.paid === "1";
  const previewEntries = project.preview?.feedbackEntries || [];
  const previewStatus = project.preview?.status || "ready";
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "";
  const projectMeta = getProjectStatusMeta(project.status);
  const paymentMeta = getPaymentStatusMeta(project.payment.status);
  const automationMeta = getAutomationStatusMeta(project.automation.status);
  const notificationMeta = getNotificationStatusMeta(project.ownerNotification.status);
  const deliveryTimeline = buildDeliveryTimeline(project);

  const alerts = [
    query.payment === "manual"
      ? {
          tone: "warning" as const,
          message:
            "Stripe is not configured yet, so this project is still in manual payment mode. Use the local paid action to continue the demo flow.",
        }
      : null,
    query.checkout === "success"
      ? {
          tone: "success" as const,
          message:
            "Checkout completed successfully. The payment state will sync when the webhook confirms the session.",
        }
      : null,
    query.checkout === "cancelled"
      ? {
          tone: "neutral" as const,
          message:
            "Checkout was cancelled. The project is still saved here whenever you are ready to continue.",
        }
      : null,
    query.paid === "1"
      ? {
          tone: "success" as const,
          message:
            "Payment recorded. The fulfillment brief and confirmation emails have been generated for the client and owner.",
        }
      : null,
    query.preview === "updated"
      ? {
          tone: "success" as const,
          message:
            "Preview feedback saved. The optimized package has been regenerated with the latest notes and selected direction.",
        }
      : null,
    query.preview === "approved"
      ? {
          tone: "success" as const,
          message:
            "Preview approved. The project can now move forward with the accepted direction and package.",
        }
      : null,
  ].filter((alert): alert is { tone: "warning" | "success" | "neutral"; message: string } => Boolean(alert));

  const scoreCards = [
    {
      label: "SEO",
      value: insights.seoScore,
      note: `Grade ${scoreToGrade(insights.seoScore)}`,
    },
    {
      label: "Performance",
      value: insights.performanceScore,
      note: `${insights.estimatedSpeedMs}ms estimated load`,
    },
    {
      label: "Accessibility",
      value: insights.accessibilityScore,
      note: `Grade ${scoreToGrade(insights.accessibilityScore)}`,
    },
    {
      label: "Mobile",
      value: insights.mobileScore,
      note: `Grade ${scoreToGrade(insights.mobileScore)}`,
    },
  ];

  const strategyCards = [
    { title: "Quick wins", items: project.blueprint.quickWins, tone: "accent" as const },
    { title: "SEO issues", items: project.blueprint.seoIssues, tone: "cyan" as const },
    {
      title: "Conversion opportunities",
      items: project.blueprint.conversionOpportunities,
      tone: "gold" as const,
    },
  ];

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-6">
        <article className="surface-card section-shell">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <Badge tone={projectMeta.tone} variant="status">
                  {projectMeta.label}
                </Badge>
                <Badge tone={paymentMeta.tone} variant="status">
                  {paymentMeta.label}
                </Badge>
                <Badge tone={automationMeta.tone} variant="status">
                  {automationMeta.label}
                </Badge>
                <Badge tone={notificationMeta.tone} variant="status">
                  {notificationMeta.label}
                </Badge>
                <Badge
                  tone={
                    previewStatus === "approved"
                      ? "success"
                      : previewStatus === "changes_requested"
                        ? "warning"
                        : "gold"
                  }
                  variant="status"
                >
                  {previewStatus === "approved"
                    ? "Preview approved"
                    : previewStatus === "changes_requested"
                      ? "Preview changes requested"
                      : "Preview ready"}
                </Badge>
              </div>

              <h2 className="mt-5 type-h2">{project.intake.companyName}</h2>
              <p className="mt-2 type-body-sm">{project.intake.sourceUrl}</p>
              <p className="mt-5 text-measure-lg type-body">{project.blueprint.summary}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:min-w-[340px]">
              <div className="metric-panel">
                <p className="type-meta text-[var(--color-text-subtle)]">Overall score</p>
                <p
                  className="mt-3 text-5xl font-semibold tracking-[-0.05em]"
                  style={{ color: getScoreColor(insights.overallScore) }}
                >
                  {insights.overallScore}
                </p>
                <p className="mt-2 type-body-sm">{insightSummary}</p>
              </div>
              <div className="metric-panel">
                <p className="type-meta text-[var(--color-text-subtle)]">Kickoff deposit</p>
                <p className="mt-3 type-h4">
                  {formatCurrency(project.payment.amount, project.payment.currency)}
                </p>
                <p className="mt-2 type-body-sm">{project.payment.invoiceReference}</p>
              </div>
              <div className="metric-panel">
                <p className="type-meta text-[var(--color-text-subtle)]">Selected direction</p>
                <p className="mt-3 type-h5">{selectedVariation?.name || "Not set"}</p>
                <p className="mt-2 type-body-sm">{selectedVariation?.headline}</p>
              </div>
              <div className="metric-panel">
                <p className="type-meta text-[var(--color-text-subtle)]">Updated</p>
                <p className="mt-3 type-h5">{formatDate(project.updatedAt)}</p>
                <p className="mt-2 type-body-sm">Source title: {project.siteSnapshot.title || "Not captured"}</p>
              </div>
            </div>
          </div>
        </article>

        <article className="surface-card section-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge tone="gold" variant="trust" icon={Workflow}>
                Delivery progress
              </Badge>
              <h2 className="mt-5 type-h2">Track the commercial and fulfillment state in one place.</h2>
            </div>
            <p className="max-w-xl type-body-sm">
              The project page now separates strategy, operational state, downloads, and
              preferences so the delivery center reads clearly at a glance.
            </p>
          </div>

          {alerts.length ? (
            <div className="mt-6 grid gap-3">
              {alerts.map((alert) => (
                <div
                  key={alert.message}
                  className={`rounded-[1.3rem] px-4 py-3 text-sm ${
                    alert.tone === "success"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                      : alert.tone === "warning"
                        ? "border border-amber-200 bg-amber-50 text-amber-800"
                        : "border border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  {alert.message}
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
            <div className="rounded-[1.7rem] border border-[color:var(--color-line)] bg-[rgba(255,255,255,0.82)] p-6">
              <p className="type-meta text-[var(--color-text-subtle)]">Timeline</p>
              <div className="mt-5 grid gap-5">
                {deliveryTimeline.map((step) => (
                  <div key={step.label} className="timeline-step">
                    <p className="type-h5">{step.label}</p>
                    <p className="mt-2 type-body-sm">
                      {step.complete ? "Complete. " : "In progress. "}
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Project state",
                  meta: projectMeta,
                  icon: ShieldCheck,
                },
                {
                  title: "Payment state",
                  meta: paymentMeta,
                  icon: CircleDollarSign,
                },
                {
                  title: "Automation state",
                  meta: automationMeta,
                  icon: Sparkles,
                },
                {
                  title: "Owner handoff",
                  meta: notificationMeta,
                  icon: Mail,
                },
              ].map(({ title, meta, icon: Icon }) => (
                <div key={title} className="status-panel">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[var(--color-accent-strong)]" aria-hidden="true" />
                    <p className="type-caption text-[var(--color-text-subtle)]">{title}</p>
                  </div>
                  <div className="mt-3">
                    <Badge tone={meta.tone} variant="status">
                      {meta.label}
                    </Badge>
                  </div>
                  <p className="mt-3 type-body-sm">{meta.description}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="surface-card section-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge tone="accent" variant="trust" icon={Gauge}>
                Site signal review
              </Badge>
              <h2 className="mt-5 type-h2">What the current site is signaling right now.</h2>
            </div>
            <p className="max-w-xl type-body-sm">
              These scores blend source-site signals with the blueprint so the rebuild
              priorities stay anchored in the real state of the current site.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {scoreCards.map((card) => (
              <div key={card.label} className="metric-panel">
                <p className="type-meta text-[var(--color-text-subtle)]">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-ink-strong)]">
                  {card.value}
                </p>
                <p className="mt-2 type-body-sm">{card.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[0.84fr_1.16fr]">
            <div className="feature-panel">
              <p className="type-h5">Captured metadata</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="type-caption text-[var(--color-text-subtle)]">Title</p>
                  <p className="mt-1 type-body-sm">{project.siteSnapshot.title || "No title captured"}</p>
                </div>
                <div>
                  <p className="type-caption text-[var(--color-text-subtle)]">Description</p>
                  <p className="mt-1 type-body-sm">
                    {project.siteSnapshot.description || "No description captured"}
                  </p>
                </div>
                <div>
                  <p className="type-caption text-[var(--color-text-subtle)]">Tech signals</p>
                  <p className="mt-1 type-body-sm">
                    {summarizeList(project.siteSnapshot.techSignals)}
                  </p>
                </div>
                <div>
                  <p className="type-caption text-[var(--color-text-subtle)]">Tracked images</p>
                  <p className="mt-1 type-body-sm">{project.siteSnapshot.imageCount}</p>
                </div>
              </div>
            </div>

            <div className="feature-panel">
              <p className="type-h5">Optimization summary</p>
              <p className="mt-4 type-body">{insightSummary}</p>
              {insights.recommendations.length > 0 ? (
                <div className="mt-5 grid gap-3">
                  {insights.recommendations.map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-cyan-deep)]" aria-hidden="true" />
                      <p className="type-body-sm">{item}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 type-body-sm">
                  The current snapshot already shows a solid base. The main opportunity
                  now is sharper messaging, better hierarchy, and a cleaner conversion path.
                </p>
              )}
            </div>
          </div>
        </article>

        <article className="surface-card section-shell">
          <Badge tone="gold" variant="trust" icon={FileText}>
            Strategic output
          </Badge>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {strategyCards.map((section) => (
              <div key={section.title} className="feature-panel">
                <Badge tone={section.tone} variant="metric">
                  {section.title}
                </Badge>
                <div className="mt-4 grid gap-3">
                  {section.items.map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent-strong)]" aria-hidden="true" />
                      <p className="type-body-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <div className="feature-panel">
              <p className="type-h5">Build roadmap</p>
              <div className="mt-4 grid gap-3">
                {project.blueprint.buildRoadmap.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-gold-deep)]" aria-hidden="true" />
                    <p className="type-body-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="feature-panel">
              <p className="type-h5">Deliverables</p>
              <div className="mt-4 grid gap-3">
                {project.blueprint.deliverables.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-cyan-deep)]" aria-hidden="true" />
                    <p className="type-body-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="surface-card section-shell">
          <Badge tone="accent" variant="trust" icon={Sparkles}>
            Design directions
          </Badge>
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {project.blueprint.designVariations.map((variation) => (
              <div
                key={variation.id}
                className={`rounded-[1.6rem] border p-6 ${
                  project.intake.styleDirection === variation.id
                    ? "border-[var(--color-accent)] bg-[rgba(242,106,59,0.08)]"
                    : "border-[color:var(--color-line)] bg-[rgba(255,255,255,0.8)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="type-h4">{variation.name}</p>
                  {project.intake.styleDirection === variation.id ? (
                    <Badge tone="accent" variant="status">
                      Selected
                    </Badge>
                  ) : null}
                </div>

                <p className="mt-4 type-h5">{variation.headline}</p>
                <p className="mt-4 type-body-sm">{variation.positioning}</p>
                <p className="mt-3 type-body-sm">{variation.notes}</p>

                <div className="mt-5 border-t border-[color:var(--color-line)] pt-4">
                  <p className="type-caption text-[var(--color-text-subtle)]">Suggested section order</p>
                  <p className="mt-2 type-body-sm">{variation.sectionOrder.join(" / ")}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card section-shell">
          <Badge tone="cyan" variant="trust" icon={Workflow}>
            Capture scope
          </Badge>
          <div className="mt-6 grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
            <div className="feature-panel">
              <p className="type-h5">How this project is packaged</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="type-caption text-[var(--color-text-subtle)]">Engagement type</p>
                  <p className="mt-1 type-body-sm">{project.intake.engagementType || "Full optimization"}</p>
                </div>
                <div>
                  <p className="type-caption text-[var(--color-text-subtle)]">Project approach</p>
                  <p className="mt-1 type-body-sm">{project.intake.projectApproach || "Optimize current site"}</p>
                </div>
                <div>
                  <p className="type-caption text-[var(--color-text-subtle)]">Capture mode</p>
                  <p className="mt-1 type-body-sm">{project.intake.siteCapture?.mode || "primary_navigation"}</p>
                </div>
                <div>
                  <p className="type-caption text-[var(--color-text-subtle)]">Selected pages</p>
                  <p className="mt-1 type-body-sm">
                    {project.siteSnapshot.selectedPageUrls?.length || 0} page
                    {(project.siteSnapshot.selectedPageUrls?.length || 0) === 1 ? "" : "s"}
                  </p>
                </div>
                <div>
                  <p className="type-caption text-[var(--color-text-subtle)]">Captured assets</p>
                  <p className="mt-1 type-body-sm">{project.siteSnapshot.assetCount || 0}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {(project.siteSnapshot.capturedPages || []).length ? (
                project.siteSnapshot.capturedPages.map((page) => (
                  <div key={page.url} className="feature-panel">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="type-h5">{page.title}</p>
                        <p className="mt-2 type-body-sm">{page.path}</p>
                        <p className="mt-2 type-caption text-[var(--color-text-subtle)]">
                          {page.assetCount} localized assets
                        </p>
                      </div>
                      <Badge tone={page.fetchStatus === "ok" ? "success" : "warning"} variant="status">
                        {page.fetchStatus}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="feature-panel md:col-span-2">
                  <p className="type-body-sm">
                    This project does not have a multi-page capture yet. Add a source URL
                    or re-run the intake with crawl selections to package the full site.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className="type-h5">Pixabay image suggestions</p>
            {project.mediaSuggestions.length ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {project.mediaSuggestions.map((item) => (
                  <div key={item.id} className="feature-panel overflow-hidden">
                    <div className="overflow-hidden rounded-[1.2rem] border border-[color:var(--color-line)] bg-white">
                      <img
                        alt={item.alt}
                        className="aspect-[4/3] w-full object-cover"
                        src={item.src}
                      />
                    </div>
                    <p className="mt-4 type-h5">{item.query}</p>
                    <p className="mt-2 type-body-sm">{item.alt}</p>
                    <p className="mt-2 type-caption text-[var(--color-text-subtle)]">
                      SEO filename: {item.seoFilename}
                    </p>
                    <p className="mt-2 type-caption text-[var(--color-text-subtle)]">
                      Photo by {item.photographer}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 feature-panel type-body-sm">
                No Pixabay suggestions are saved yet. Add a `PIXABAY_API_KEY` to generate
                image ideas from the discovery brief.
              </div>
            )}
          </div>
        </article>

        <article className="surface-card section-shell">
          <Badge tone="gold" variant="trust" icon={Sparkles}>
            Preview and revisions
          </Badge>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
            <div className="overflow-hidden rounded-[1.7rem] border border-[color:var(--color-line)] bg-white">
              {project.siteSnapshot.capturedPages?.length ? (
                <iframe
                  className="min-h-[720px] w-full border-0 bg-white"
                  src={`/preview/${project.id}/optimized/`}
                  title={`${project.intake.companyName} optimized preview`}
                />
              ) : (
                <div className="flex min-h-[420px] items-center justify-center px-6 text-center type-body-sm">
                  A live preview appears here once the source site has been captured and
                  packaged into the local preview workspace.
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="feature-panel">
                <p className="type-h5">Preview status</p>
                <p className="mt-3 type-body-sm">
                  {previewStatus === "approved"
                    ? "The client has accepted this direction."
                    : previewStatus === "changes_requested"
                      ? "The latest revision notes have been saved and applied to the optimized package."
                      : "The preview is ready for review before payment."}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    className={buttonStyles({ variant: "secondary", size: "sm" })}
                    href={`/preview/${project.id}/original/`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Open original preview
                  </a>
                  <a
                    className={buttonStyles({ variant: "primary", size: "sm" })}
                    href={`/preview/${project.id}/optimized/`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Open optimized preview
                  </a>
                </div>
              </div>

              <form action={savePreviewFeedbackAction.bind(null, project.id)} className="feature-panel space-y-4">
                <div>
                  <label className="field-label" htmlFor="summary">
                    Feedback summary
                  </label>
                  <input
                    className="text-field"
                    defaultValue="Tighten the offer and make the premium value clearer."
                    id="summary"
                    name="summary"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="selectedDirection">
                    Direction to refine
                  </label>
                  <select
                    className="select-field"
                    defaultValue={project.intake.styleDirection}
                    id="selectedDirection"
                    name="selectedDirection"
                  >
                    {project.blueprint.designVariations.map((variation) => (
                      <option key={variation.id} value={variation.id}>
                        {variation.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="requestedChanges">
                    Requested changes
                  </label>
                  <textarea
                    className="text-area"
                    defaultValue="Push stronger proof above the fold, clarify the CTA, and keep the visual tone premium without feeling cold."
                    id="requestedChanges"
                    name="requestedChanges"
                  />
                </div>
                <button className={buttonStyles({ variant: "secondary", className: "w-full" })} type="submit">
                  Save feedback and regenerate preview
                </button>
              </form>

              <form action={approvePreviewAction.bind(null, project.id)}>
                <button className={buttonStyles({ variant: "primary", className: "w-full" })} type="submit">
                  Approve preview
                </button>
              </form>

              {previewEntries.length ? (
                <div className="feature-panel">
                  <p className="type-h5">Latest preview feedback</p>
                  <div className="mt-4 grid gap-3">
                    {previewEntries.slice(0, 3).map((entry) => (
                      <div key={entry.id} className="rounded-[1.2rem] border border-[color:var(--color-line)] bg-white/70 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="type-h5">{entry.summary}</p>
                          <Badge tone={entry.approved ? "success" : "gold"} variant="status">
                            {entry.approved ? "Approved" : "Revision"}
                          </Badge>
                        </div>
                        <p className="mt-3 type-body-sm">
                          {entry.requestedChanges || "No extra notes attached to this update."}
                        </p>
                        <p className="mt-3 type-caption text-[var(--color-text-subtle)]">
                          Direction: {entry.selectedDirection}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </article>
      </section>

      <aside className="space-y-6 2xl:sticky 2xl:top-6 2xl:self-start">
        <article className="surface-card section-shell">
          <Badge tone="gold" variant="trust" icon={CircleDollarSign}>
            Payment and downloads
          </Badge>
          <h3 className="mt-5 type-h2">
            {formatCurrency(project.payment.amount, project.payment.currency)}
          </h3>
          <p className="mt-4 type-body-sm">{project.quote.note}</p>

          <div className="mt-5 feature-panel">
            <p className="type-caption text-[var(--color-text-subtle)]">Invoice reference</p>
            <p className="mt-2 type-body-sm">{project.payment.invoiceReference}</p>
            <p className="mt-3 type-caption text-[var(--color-text-subtle)]">Project subtotal</p>
            <p className="mt-2 type-body-sm">
              {formatCurrency(project.quote.subtotal, project.quote.currency)}
            </p>
            {project.payment.paidAt ? (
              <>
                <p className="mt-3 type-caption text-[var(--color-text-subtle)]">Paid at</p>
                <p className="mt-2 type-body-sm">{formatDate(project.payment.paidAt)}</p>
              </>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3">
            {project.quote.lineItems.map((lineItem) => (
              <div key={lineItem.label} className="feature-panel">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="type-h5">{lineItem.label}</p>
                    <p className="mt-2 type-body-sm">{lineItem.detail}</p>
                  </div>
                  <span className="type-body-sm">
                    {formatCurrency(lineItem.amount, project.quote.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {project.payment.status !== "paid" ? (
              <form action={startCheckoutAction.bind(null, project.id)}>
                <button className={buttonStyles({ variant: "primary", className: "w-full" })} type="submit">
                  Start payment
                </button>
              </form>
            ) : null}

            {project.payment.status !== "paid" ? (
              <form action={markManualPaidAction.bind(null, project.id)}>
                <button className={buttonStyles({ variant: "secondary", className: "w-full" })} type="submit">
                  Mark paid in local demo
                </button>
              </form>
            ) : null}

            <div className="border-t border-[color:var(--color-line)] pt-4">
              <p className="type-caption text-[var(--color-text-subtle)]">
                {paymentCompleted ? "Downloads" : "Preview packages"}
              </p>
              <div className="mt-3 grid gap-3">
                <a
                  href={`/api/download/${project.id}?format=original${paymentCompleted ? "" : "&test=true"}`}
                  className={buttonStyles({ variant: "secondary", className: "w-full", size: "sm" })}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Original site package
                </a>
                <a
                  href={`/api/download/${project.id}?format=optimized${paymentCompleted ? "" : "&test=true"}`}
                  className={buttonStyles({ variant: "primary", className: "w-full" })}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Optimized site package
                </a>
                <a
                  href={`/preview/${project.id}/optimized/`}
                  rel="noreferrer"
                  target="_blank"
                  className={buttonStyles({ variant: "secondary", className: "w-full", size: "sm" })}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Open live preview
                </a>
                {paymentCompleted ? (
                  <>
                    <a
                      href={`/api/download/${project.id}?format=wordpress`}
                      className={buttonStyles({ variant: "secondary", className: "w-full", size: "sm" })}
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      WordPress package
                    </a>
                    <a
                      href={`/api/download/${project.id}?format=deployment-configs`}
                      className={buttonStyles({ variant: "secondary", className: "w-full", size: "sm" })}
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Deployment configs
                    </a>
                    {project.intake.engagementType === "guided_consultation" && calendlyUrl ? (
                      <a
                        className={buttonStyles({ variant: "primary", className: "w-full" })}
                        href={calendlyUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        Book the consultation
                      </a>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>

            <Link href="/dashboard/new" className={buttonStyles({ variant: "ghost", className: "w-full" })}>
              Start another intake
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </article>

        <article className="surface-card section-shell">
          <Badge tone="cyan" variant="trust">
            Captured preferences
          </Badge>
          <div className="mt-5 space-y-4">
            <div>
              <p className="type-caption text-[var(--color-text-subtle)]">Engagement type</p>
              <p className="mt-2 type-body-sm">{project.intake.engagementType || "Not specified"}</p>
            </div>
            <div>
              <p className="type-caption text-[var(--color-text-subtle)]">Project approach</p>
              <p className="mt-2 type-body-sm">{project.intake.projectApproach || "Not specified"}</p>
            </div>
            <div>
              <p className="type-caption text-[var(--color-text-subtle)]">Consultation type</p>
              <p className="mt-2 type-body-sm">{project.intake.consultationType.replaceAll("_", " ")}</p>
            </div>
            <div>
              <p className="type-caption text-[var(--color-text-subtle)]">Goals</p>
              <p className="mt-2 type-body-sm">{summarizeList(project.intake.goals)}</p>
            </div>
            <div>
              <p className="type-caption text-[var(--color-text-subtle)]">Marketing priorities</p>
              <p className="mt-2 type-body-sm">{summarizeList(project.intake.marketingPriorities)}</p>
            </div>
            <div>
              <p className="type-caption text-[var(--color-text-subtle)]">Integrations</p>
              <p className="mt-2 type-body-sm">{summarizeList(project.intake.desiredIntegrations)}</p>
            </div>
            <div>
              <p className="type-caption text-[var(--color-text-subtle)]">Locales</p>
              <p className="mt-2 type-body-sm">{summarizeList(project.intake.locales)}</p>
            </div>
            <div>
              <p className="type-caption text-[var(--color-text-subtle)]">Personalization</p>
              <p className="mt-2 type-body-sm">{project.intake.personalizationNotes || "Not specified"}</p>
            </div>
            <div>
              <p className="type-caption text-[var(--color-text-subtle)]">AI inspiration</p>
              <p className="mt-2 type-body-sm">{project.intake.aiInspiration || "Not specified"}</p>
            </div>
            <div>
              <p className="type-caption text-[var(--color-text-subtle)]">Hosting and domain</p>
              <p className="mt-2 type-body-sm">
                {[project.intake.hostingPreference, project.intake.domainStatus]
                  .filter(Boolean)
                  .join(" / ") || "Not specified"}
              </p>
            </div>
            <div>
              <p className="type-caption text-[var(--color-text-subtle)]">Ongoing support</p>
              <p className="mt-2 type-body-sm">{project.intake.maintenancePreference || "Not specified"}</p>
            </div>
            {project.intake.discoveryAnswers?.length ? (
              <div>
                <p className="type-caption text-[var(--color-text-subtle)]">Discovery highlights</p>
                <div className="mt-3 grid gap-3">
                  {project.intake.discoveryAnswers.slice(0, 4).map((answer) => (
                    <div key={answer.id} className="feature-panel">
                      <p className="type-caption text-[var(--color-text-subtle)]">{answer.label}</p>
                      <p className="mt-2 type-body-sm">{answer.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </article>

        <article className="surface-card section-shell">
          <Badge tone="accent" variant="trust" icon={Mail}>
            Fulfillment handoff
          </Badge>
          <p className="mt-4 type-body-sm">{notificationMeta.description}</p>
          {project.ownerNotification.sentAt ? (
            <p className="mt-3 type-body-sm">Sent {formatDate(project.ownerNotification.sentAt)}</p>
          ) : null}
          {project.ownerNotification.preview ? (
            <div className="mt-4 feature-panel">
              <p className="type-body-sm">{project.ownerNotification.preview}</p>
            </div>
          ) : null}
          {project.communications.length ? (
            <div className="mt-4 grid gap-3">
              {project.communications.slice(0, 5).map((entry) => (
                <div key={entry.id} className="feature-panel">
                  <div className="flex items-center justify-between gap-3">
                    <p className="type-h5">
                      {entry.kind.replaceAll("_", " ")} to {entry.audience}
                    </p>
                    <Badge tone={entry.channel === "smtp" ? "success" : "gold"} variant="status">
                      {entry.channel}
                    </Badge>
                  </div>
                  <p className="mt-2 type-body-sm">{entry.subject}</p>
                  <p className="mt-2 type-caption text-[var(--color-text-subtle)]">
                    {entry.email} • {formatDate(entry.sentAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </article>
      </aside>
    </div>
  );
}
