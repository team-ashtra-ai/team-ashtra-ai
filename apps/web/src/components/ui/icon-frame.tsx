import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "accent" | "cyan" | "gold" | "ink";
type Size = "sm" | "md" | "lg";

const toneStyles: Record<Tone, string> = {
  accent:
    "border-[color:rgba(242,106,59,0.18)] bg-[linear-gradient(145deg,rgba(242,106,59,0.16),rgba(255,255,255,0.78))] text-[var(--color-accent-strong)]",
  cyan: "border-[color:rgba(49,160,163,0.18)] bg-[linear-gradient(145deg,rgba(49,160,163,0.14),rgba(255,255,255,0.76))] text-[var(--color-cyan-deep)]",
  gold: "border-[color:rgba(183,138,77,0.18)] bg-[linear-gradient(145deg,rgba(183,138,77,0.16),rgba(255,255,255,0.76))] text-[var(--color-gold-deep)]",
  ink: "border-[color:rgba(9,20,31,0.12)] bg-[linear-gradient(145deg,rgba(9,20,31,0.08),rgba(255,255,255,0.76))] text-[var(--color-ink-strong)]",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-11 w-11 rounded-[1rem]",
  md: "h-13 w-13 rounded-[1.15rem]",
  lg: "h-15 w-15 rounded-[1.35rem]",
};

export function IconFrame({
  icon: Icon,
  tone = "accent",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tone?: Tone;
  size?: Size;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center border shadow-[var(--shadow-xs)]",
        toneStyles[tone],
        sizeStyles[size],
        className,
      )}
      aria-hidden="true"
    >
      <Icon className="h-[1.15rem] w-[1.15rem] stroke-[1.85]" />
    </span>
  );
}
