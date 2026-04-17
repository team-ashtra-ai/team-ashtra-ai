import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full border text-sm font-semibold tracking-[0.01em] transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    size === "md" ? "min-h-12 px-5 text-sm" : "min-h-10 px-4 text-sm",
    variant === "primary" &&
      "border-[var(--color-accent)] bg-[linear-gradient(135deg,var(--color-accent),var(--color-accent-strong))] text-[var(--color-cloud)] shadow-[0_18px_44px_rgba(242,106,59,0.26)] hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(242,106,59,0.34)] focus-visible:ring-[var(--color-accent)]",
    variant === "secondary" &&
      "border-[color:var(--color-line)] bg-[rgba(255,255,255,0.78)] text-[var(--color-ink-strong)] shadow-[var(--shadow-xs)] hover:-translate-y-0.5 hover:border-[rgba(9,20,31,0.18)] hover:bg-[var(--color-surface-strong)] focus-visible:ring-[var(--color-gold)]",
    variant === "ghost" &&
      "border-transparent bg-transparent text-[var(--color-ink-strong)] hover:bg-white/70 focus-visible:ring-[var(--color-cyan)]",
    className,
  );
}

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
