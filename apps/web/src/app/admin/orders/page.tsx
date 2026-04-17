import { CircleDollarSign, FolderKanban, MailCheck } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import {
  getNotificationStatusMeta,
  getPaymentStatusMeta,
  getProjectStatusMeta,
} from "@/lib/project-state";
import { getProjectsForViewer } from "@/lib/project-service";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const user = await requireAdmin();
  const projects = await getProjectsForViewer(user);
  const paidCount = projects.filter((project) => project.payment.status === "paid").length;

  return (
    <AppShell
      user={user}
      title="Owner view for paid orders, fulfillment state, and delivery follow-through."
      subtitle="Track what has been paid, what still needs action, and whether the owner-side handoff has already been logged or sent."
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-3">
          <article className="surface-card rounded-[1.8rem] p-6">
            <p className="type-meta text-[var(--color-text-subtle)]">Orders</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--color-ink-strong)]">
              {projects.length}
            </p>
            <p className="mt-2 type-body-sm">Projects visible to the admin account.</p>
          </article>
          <article className="surface-card rounded-[1.8rem] p-6">
            <p className="type-meta text-[var(--color-text-subtle)]">Paid</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--color-ink-strong)]">
              {paidCount}
            </p>
            <p className="mt-2 type-body-sm">Projects that already cleared the kickoff deposit.</p>
          </article>
          <article className="surface-card rounded-[1.8rem] p-6">
            <p className="type-meta text-[var(--color-text-subtle)]">Logged handoffs</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[var(--color-ink-strong)]">
              {projects.filter((project) => project.ownerNotification.status !== "not_sent").length}
            </p>
            <p className="mt-2 type-body-sm">Notifications that already reached logging or email.</p>
          </article>
        </section>

        <section className="surface-card section-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge tone="accent" variant="trust">
                Orders
              </Badge>
              <h2 className="mt-5 type-h2">Payment and fulfillment overview.</h2>
            </div>
            <p className="max-w-xl type-body-sm">
              This keeps the commercial side and the delivery side visible in the same place.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {projects.map((project) => {
              const projectMeta = getProjectStatusMeta(project.status);
              const paymentMeta = getPaymentStatusMeta(project.payment.status);
              const notificationMeta = getNotificationStatusMeta(project.ownerNotification.status);

              return (
                <article key={project.id} className="rounded-[1.7rem] border border-[color:var(--color-line)] bg-[rgba(255,255,255,0.8)] p-5">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div>
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
                      <p className="mt-2 type-body-sm">{project.payment.invoiceReference}</p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3 xl:min-w-[360px]">
                      <div className="metric-panel">
                        <p className="type-meta text-[var(--color-text-subtle)]">Deposit</p>
                        <p className="mt-3 type-h5">
                          {formatCurrency(project.payment.amount, project.payment.currency)}
                        </p>
                      </div>
                      <div className="metric-panel">
                        <p className="type-meta text-[var(--color-text-subtle)]">Updated</p>
                        <p className="mt-3 type-h5">{formatDate(project.updatedAt)}</p>
                      </div>
                      <div className="metric-panel">
                        <p className="type-meta text-[var(--color-text-subtle)]">Notification</p>
                        <p className="mt-3 type-h5">{notificationMeta.label}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 border-t border-[color:var(--color-line)] pt-4 md:grid-cols-3">
                    <div className="feature-panel">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-[var(--color-accent-strong)]" aria-hidden="true" />
                        <p className="type-caption text-[var(--color-text-subtle)]">Project</p>
                      </div>
                      <p className="mt-2 type-body-sm">{projectMeta.description}</p>
                    </div>
                    <div className="feature-panel">
                      <div className="flex items-center gap-2">
                        <CircleDollarSign className="h-4 w-4 text-[var(--color-gold-deep)]" aria-hidden="true" />
                        <p className="type-caption text-[var(--color-text-subtle)]">Payment</p>
                      </div>
                      <p className="mt-2 type-body-sm">{paymentMeta.description}</p>
                    </div>
                    <div className="feature-panel">
                      <div className="flex items-center gap-2">
                        <MailCheck className="h-4 w-4 text-[var(--color-cyan-deep)]" aria-hidden="true" />
                        <p className="type-caption text-[var(--color-text-subtle)]">Handoff</p>
                      </div>
                      <p className="mt-2 type-body-sm">{notificationMeta.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
