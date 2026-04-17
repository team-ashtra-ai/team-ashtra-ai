import type { ReactNode } from "react";

import Link from "next/link";
import { LayoutDashboard, LogOut, ShieldCheck, Sparkles, Tags } from "lucide-react";

import { logoutAction } from "@/app/actions/auth";
import { BrandMark } from "@/components/brand/brand-mark";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import type { UserRecord } from "@/lib/types";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppShell({
  user,
  title,
  subtitle,
  children,
}: {
  user: UserRecord;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const initials = getInitials(user.name);

  return (
    <div className="min-h-screen bg-[var(--color-shell)]">
      <header className="sticky top-0 z-40 border-b border-[color:var(--color-line)] bg-[rgba(245,239,232,0.8)] backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <BrandMark compact />
            <nav className="hidden items-center gap-2 md:flex">
              <Link className={buttonStyles({ variant: "ghost", size: "sm" })} href="/dashboard">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Dashboard
              </Link>
              {user.role === "admin" ? (
                <>
                  <Link className={buttonStyles({ variant: "ghost", size: "sm" })} href="/admin/orders">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    Admin
                  </Link>
                  <Link className={buttonStyles({ variant: "ghost", size: "sm" })} href="/admin/pricing">
                    <Tags className="h-4 w-4" aria-hidden="true" />
                    Pricing
                  </Link>
                </>
              ) : null}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="type-meta text-[var(--color-text-subtle)]">
                Signed in as
              </p>
              <p className="mt-1 font-semibold text-[var(--color-ink-strong)]">{user.name}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[color:var(--color-line)] bg-white/75 text-sm font-semibold text-[var(--color-ink-strong)]">
              {initials}
            </div>
            <form action={logoutAction}>
              <button className={buttonStyles({ variant: "secondary", size: "sm" })} type="submit">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 md:py-10">
        <section className="surface-dark rounded-[2.2rem] px-8 py-10 md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="accent" variant="trust" icon={Sparkles}>
                  Client workspace
                </Badge>
                <Badge tone="cyan" variant="feature">
                  Unified delivery center
                </Badge>
              </div>
              <h1 className="type-display-2 mt-5 max-w-4xl text-[var(--color-cloud)]">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl type-body text-white/74">{subtitle}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
                <p className="type-meta text-white/56">
                  Workspace focus
                </p>
                <p className="mt-3 type-body-sm text-white/76">
                  Strategy, payment, delivery state, and outputs stay visible in one flow.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
                <p className="type-meta text-white/56">
                  Role
                </p>
                <p className="mt-3 type-body-sm text-white/76">
                  {user.role === "admin"
                    ? "Admin account with access to owner-side order review."
                    : "Client account with access to project intake and delivery progress."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {children}
      </main>
    </div>
  );
}
