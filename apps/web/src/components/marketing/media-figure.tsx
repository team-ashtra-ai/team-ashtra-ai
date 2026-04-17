import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import type { MarketingMediaId } from "@/lib/marketing-media.generated";
import { marketingMedia } from "@/lib/marketing-media.generated";
import { cn } from "@/lib/utils";

export function MediaFigure({
  mediaId,
  eyebrow,
  title,
  className,
  priority = false,
}: {
  mediaId: MarketingMediaId;
  eyebrow?: string;
  title?: string;
  className?: string;
  priority?: boolean;
}) {
  const media = marketingMedia[mediaId];

  return (
    <figure className={cn("media-figure", className)}>
      <div className="media-frame">
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="mt-4 space-y-3">
        {eyebrow ? <Badge tone="cyan" variant="trust">{eyebrow}</Badge> : null}
        {title ? <p className="type-h5 text-[var(--color-ink-strong)]">{title}</p> : null}
        <p className="type-body-sm text-[var(--color-text-muted)]">{media.caption}</p>
        <p className="type-caption text-[var(--color-text-subtle)]">
          Photo by {media.photographer} via Pixabay.
        </p>
      </figcaption>
    </figure>
  );
}
