# ash-tra.com Product Guide

`ash-tra.com` is a single-purpose Next.js workspace for a design-led website transformation company serving premium service businesses. The repo focuses on the public marketing site, the client portal, local runtime storage, and the brand/media system that supports both.

## Product Shape

The app sells and operates strategy-led website relaunches:

1. A visitor lands on the public site and understands the offer.
2. They can choose a direct brief or a guided consultation path.
3. A client creates an account or signs in.
4. They submit a brief through the intake flow, including page scope and discovery answers.
5. The app captures the selected source pages, generates strategy, creates a quote, and tracks payment.
6. The dashboard becomes the delivery center for preview, feedback, payment, booking, files, and fulfillment.

## Repo Map

- `apps/web`
  The Next.js app. This is the product.

- `storage/optimise-ai`
  Local runtime storage for users, projects, uploads, and generated delivery artifacts.

- `docs`
  Operating notes for brand assets, typography/semantic rules, and the curated Pixabay workflow.

- `memory-bank`
  Working notes from earlier planning. Helpful for context, but not required to run the app.

- `package.json`
  Root convenience scripts that proxy into `apps/web`.

## Main Routes

- `/`
  Public homepage.

- `/services`
  Offer architecture and deliverables.

- `/consultation`
  Guided discovery, preview-before-payment, and consultation booking offer.

- `/process`
  Delivery model and principles.

- `/login`
  Existing client access.

- `/register`
  New account creation.

- `/dashboard`
  Signed-in workspace overview.

- `/dashboard/new`
  Project intake form.

- `/dashboard/projects/[projectId]`
  Strategy, payment, delivery, downloads, and project-state detail.

- `/admin/orders`
  Admin payment and fulfillment oversight.

## Quick Start

From the repo root:

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
npm run dev
```

Open `http://localhost:3000`.

## Commands

Run these from the repo root:

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run start
npm run media:generate
```

## Environment Variables

The canonical env file is `apps/web/.env.local`.

Important variables:

- `NEXT_PUBLIC_APP_URL`
  Public app URL used for canonical metadata and webhooks.

- `SESSION_SECRET`
  Session signing secret.

- `OWNER_EMAIL`
  Owner/admin notification target.

- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`
  Local AI strategy generation configuration.

- `STRIPE_CURRENCY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
  Payment settings.

- `PIXABAY_API_KEY`
  Used when you want to search for new Pixabay replacements during the curated marketing-media workflow. The currently pinned image set can be regenerated from stored Pixabay source URLs.

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
  Optional owner-notification email settings.

- `STORAGE_ROOT`
  Optional override for local runtime storage. Defaults to the legacy-compatible `storage/optimise-ai`.

## Local Storage

The runtime stays local-first by default.

Key data written into `storage/optimise-ai`:

- `users.json`
  Local auth records.

- `projects.json`
  Project state, strategy, quoting, and automation records.

- `owner-delivery-log.json`
  Owner-side fulfillment log.

- `uploads/<projectId>`
  Uploaded client assets.

- `projects/<projectId>`
  Captured source files, optimized output, and downloadable artifacts.

## Brand And Media Workflow

Marketing imagery is not fetched at runtime.

Instead:

1. Curate approved selections in `apps/web/src/content/pixabay-media-selections.json`.
2. Pin or update Pixabay source URLs and metadata for each approved asset.
3. Set `PIXABAY_API_KEY` only when you want to search for new replacements.
4. Run `npm run media:generate`.
5. Review the generated assets in `apps/web/public/media/marketing`.
6. Use the generated metadata in `apps/web/src/lib/marketing-media.generated.ts`.

That keeps filenames deterministic, alt text intentional, and production pages independent from external image URLs.

## Docs

- [Brand System](docs/brand-system.md)
- [Pixabay Asset Workflow](docs/pixabay-asset-workflow.md)
- [Content Semantics](docs/content-semantics.md)
- [Marketing Proof Requirements](docs/marketing-proof-requirements.md)
- [How To Use This Repo](docs/how-to-use-this-repo.md)
- [GitHub And Cloudflare Setup](docs/github-cloudflare-setup.md)

## Operational Notes

- The public site and the dashboard intentionally share the same brand tokens, badge language, motion rules, and typography system.
- Public pages should keep a valid semantic heading hierarchy with exactly one `h1` per page.
- Oversized display treatments belong in CSS classes, not custom heading tags.
- The current storage path keeps the historical `optimise-ai` name for compatibility with existing local project data.
