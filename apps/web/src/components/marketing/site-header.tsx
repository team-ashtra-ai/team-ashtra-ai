import Link from "next/link";
import { ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { siteConfig } from "@/lib/site-config";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-line)] bg-[rgba(245,239,232,0.78)] backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandMark />
            <Badge className="hidden xl:inline-flex" tone="accent" variant="trust" icon={ShieldCheck}>
              Design-led website transformation
            </Badge>
          </div>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] lg:flex"
          >
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={buttonStyles({ variant: "ghost", size: "sm" })}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={user ? "/dashboard" : "/login"}
              className={buttonStyles({ variant: "ghost", size: "sm" })}
            >
              {user ? (
                <>
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  Client Portal
                </>
              ) : (
                "Client Login"
              )}
            </Link>
            <Link
              href={user ? "/dashboard/new" : "/register"}
              className={buttonStyles({ variant: "primary", size: "sm" })}
            >
              {user ? "Start a Project" : "Start a Project"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto lg:hidden">
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
      </div>
    </header>
  );
}
