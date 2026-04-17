import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--color-line)] bg-[rgba(255,250,245,0.78)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="space-y-5">
            <BrandMark />
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent" variant="trust" icon={Sparkles}>
                Premium websites and client portals
              </Badge>
              <Badge tone="cyan" variant="feature" icon={ShieldCheck}>
                Clearer messaging, stronger SEO
              </Badge>
            </div>
            <p className="max-w-2xl type-body">
              ash-tra redesigns websites and client portals for serious service
              businesses that need clearer messaging, stronger SEO foundations,
              better accessibility, multilingual readiness, and a smoother client journey.
            </p>
          </div>

          <div className="grid gap-4 lg:justify-items-end">
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              {siteConfig.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={buttonStyles({ variant: "ghost", size: "sm" })}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Link href="/register" className={buttonStyles({ variant: "primary", size: "sm" })}>
              Start a project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[color:var(--color-line)] pt-6 text-sm text-[var(--color-text-muted)] md:flex-row md:items-center md:justify-between">
          <p>{siteConfig.tagline}</p>
          <p>Clarity, trust, SEO, accessibility, multilingual usability, and client experience.</p>
        </div>
      </div>
    </footer>
  );
}
