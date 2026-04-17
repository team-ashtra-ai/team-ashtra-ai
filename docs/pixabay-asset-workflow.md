# Pixabay Asset Workflow

## Purpose

Pixabay is used only for curated marketing imagery. The app does not inject Pixabay images dynamically during request-time rendering.

## Source Of Truth

Curated image prompts live in:

`apps/web/src/content/pixabay-media-selections.json`

Each entry should define:

- a stable media `id`
- the search `query`
- an SEO-safe base `filename`
- purposeful `alt` text
- a short `caption`
- a human-readable `ownerNote`
- an optional `candidateIndex` if the first result is not the best fit

## Generate Assets

1. Set `PIXABAY_API_KEY` in `apps/web/.env.local` if you want to search for new replacement images.
2. Pin approved `sourcePageUrl` and `sourceImageUrl` values when a selection is finalized.
3. Run `npm run media:generate` from the repo root.
4. Review the downloaded files in `apps/web/public/media/marketing`.
5. Confirm the generated metadata file in `apps/web/src/lib/marketing-media.generated.ts`.

## Output Rules

- Filenames must stay deterministic and SEO-safe.
- Use locally saved files only on production pages.
- Alt text should describe the scene and why it belongs on the page.
- Captions should explain the editorial role of the image, not just repeat the alt text.
- Keep ownership notes so future editors understand that the asset is curated stock media.

## Review Checklist

- The image matches the page story and section purpose.
- The photo feels premium rather than generic filler.
- The alt text is descriptive but not spammy.
- The image dimensions are suitable for desktop and mobile cropping.
- The page still works if the image is removed or swapped later.
- Pinned source URLs are stored so the curated set can be regenerated deterministically.
