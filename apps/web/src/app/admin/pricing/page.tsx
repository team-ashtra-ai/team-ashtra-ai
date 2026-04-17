import { FileText, Tags } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { pricingMaster } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";

const pricingGroups = [
  {
    title: "Core build pricing",
    items: [
      ["Optimize current site", pricingMaster.baseOptimizeCurrentSite],
      ["Hybrid refresh", pricingMaster.baseHybridRefresh],
      ["New site", pricingMaster.baseNewSite],
      ["Source analysis", pricingMaster.sourceAnalysis],
      ["Additional page", pricingMaster.additionalPage],
    ],
  },
  {
    title: "Consultation pricing",
    items: [
      ["Discovery consultation", pricingMaster.discoveryConsultation],
      ["Follow-up consultation", pricingMaster.followUpConsultation],
      ["Maintenance consultation", pricingMaster.maintenanceConsultation],
      ["New site direction", pricingMaster.newSiteDirection],
      ["Growth retainer planning", pricingMaster.monthlyGrowthRetainerPlanning],
    ],
  },
  {
    title: "Integrations and add-ons",
    items: [
      ["Multilingual locale", pricingMaster.multilingualLocale],
      ["CRM integration", pricingMaster.crmIntegration],
      ["Tracking implementation", pricingMaster.trackingImplementation],
      ["Ads conversion support", pricingMaster.adsConversionSupport],
      ["Reference asset review", pricingMaster.referenceAssetReview],
    ],
  },
];

export default async function AdminPricingPage() {
  const user = await requireAdmin();

  return (
    <AppShell
      user={user}
      title="Pricing master for quotes, deposits, and consultation pricing."
      subtitle="This page reflects the single source of truth used by the project quote engine. Update the pricing master file to refresh open quotes across the app."
    >
      <div className="grid gap-6">
        <section className="surface-card section-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge tone="accent" variant="trust" icon={Tags}>
                Pricing master
              </Badge>
              <h2 className="mt-5 type-h2">Live quote inputs in one place.</h2>
            </div>
            <Badge tone="gold" variant="metric">
              {pricingMaster.currency}
            </Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {pricingGroups.map((group) => (
              <article key={group.title} className="feature-panel">
                <h3 className="type-h4">{group.title}</h3>
                <div className="mt-4 grid gap-3">
                  {group.items.map(([label, amount]) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-3 border-b border-[color:var(--color-line)] pb-3 last:border-b-0 last:pb-0"
                    >
                      <span className="type-body-sm">{label}</span>
                      <strong className="type-body-sm">
                        {formatCurrency(Number(amount), pricingMaster.currency)}
                      </strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="surface-card section-shell">
          <Badge tone="cyan" variant="trust" icon={FileText}>
            Where to edit
          </Badge>
          <p className="mt-5 type-body">
            The source of truth lives in <code>apps/web/src/lib/pricing.ts</code>. Open-project
            quotes are re-synced against that file when the dashboard or project detail pages load.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
