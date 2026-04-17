import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type BadgeVariant = "trust" | "feature" | "metric" | "status" | "process";
type BadgeTone = "ink" | "accent" | "cyan" | "gold" | "success" | "warning" | "neutral";

const toneStyles: Record<BadgeTone, string> = {
  ink: "border-[color:rgba(9,20,31,0.12)] bg-[rgba(9,20,31,0.06)] text-[var(--color-ink-strong)]",
  accent:
    "border-[color:rgba(242,106,59,0.18)] bg-[rgba(242,106,59,0.12)] text-[var(--color-accent-strong)]",
  cyan: "border-[color:rgba(49,160,163,0.18)] bg-[rgba(49,160,163,0.12)] text-[var(--color-cyan-deep)]",
  gold: "border-[color:rgba(183,138,77,0.18)] bg-[rgba(183,138,77,0.14)] text-[var(--color-gold-deep)]",
  success:
    "border-[color:rgba(27,132,95,0.18)] bg-[rgba(27,132,95,0.12)] text-[var(--color-success-deep)]",
  warning:
    "border-[color:rgba(173,106,31,0.2)] bg-[rgba(173,106,31,0.14)] text-[var(--color-warning-deep)]",
  neutral:
    "border-[color:var(--color-line)] bg-[rgba(255,255,255,0.76)] text-[var(--color-text-muted)]",
};

const variantStyles: Record<BadgeVariant, string> = {
  trust: "uppercase tracking-[0.18em]",
  feature: "",
  metric: "font-semibold",
  status: "font-semibold",
  process: "uppercase tracking-[0.18em]",
};

export function Badge({
  children,
  icon: Icon,
  tone = "neutral",
  variant = "feature",
  className,
}: {
  children: ReactNode;
  icon?: LucideIcon;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[0.72rem] leading-none",
        toneStyles[tone],
        variantStyles[variant],
        className,
      )}
    >
      {Icon ? <Icon className="h-[0.95rem] w-[0.95rem] shrink-0 stroke-[1.85]" aria-hidden="true" /> : null}
      <span>{children}</span>
    </span>
  );
}
