import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function BrandMark({
  href = "/",
  compact = false,
  className,
}: {
  href?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-3 text-left transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5",
        className,
      )}
      >
      <Image
        src="/brand/ash-tra-mark-gold.png"
        alt=""
        aria-hidden="true"
        width={compact ? 40 : 48}
        height={compact ? 40 : 48}
        className={cn(
          "shrink-0",
          compact ? "h-10 w-10 rounded-[1rem]" : "h-12 w-12 rounded-[1.15rem]",
        )}
      />
      <span className="flex flex-col">
        <span
          className={cn(
            "font-serif tracking-[-0.06em] text-[var(--color-ink-strong)]",
            compact ? "text-[1.2rem]" : "text-[1.42rem]",
          )}
        >
          ash-tra.com
        </span>
        <span className="type-meta mt-1 text-[var(--color-text-subtle)]">
          Overcoming challenges. Pursuing goals.
        </span>
      </span>
    </Link>
  );
}
