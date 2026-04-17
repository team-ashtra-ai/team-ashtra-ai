# How To Use This Repo

This repo works best when you treat it as two separate systems:

1. `apps/web`
   The real product app. This is the Next.js workspace you run, edit, test, and publish.

2. `storage/optimise-ai/projects`
   Local project data and generated site outputs. This is runtime data, not app source code.

## Best Working Model

Use the repo in this order:

1. Start the app locally.
2. Use the dashboard and project intake flow to capture or review source sites.
3. Keep generated client outputs in local storage or in the ignored `portfolio-sites/` workspace.
4. Push only the app, docs, scripts, and safe project infrastructure to GitHub.

That keeps the product clean and avoids accidentally publishing client work, local auth data, or generated artifacts.

## Main Commands

Run these from the repo root:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run typecheck
```

The app itself lives in `apps/web`, but the root scripts proxy into that folder so you can stay at the repo root.

## What The App Already Does

The current app already supports:

- a public marketing site
- local registration and login
- a client dashboard
- project intake and source-site capture
- previewing original and optimized project outputs
- generating deployment files for exported project packages

## Local Portfolio Workflow

Use this when you want to keep client rebuilds local and out of Git:

```bash
npm run portfolio:setup
```

That creates a local `portfolio-sites/` folder with:

- `federico-righi-original-static`
- `federico-righi-optimized-static`
- `rotata-original-static`
- `rotata-optimized-static`

Because `portfolio-sites/` is ignored in Git, those site builds stay on your machine unless you move them into a different repo later.

## Important Hosting Constraint

The full app is local-first and depends on filesystem storage for users, projects, uploads, and generated outputs.

That means:

- the repo is great for local production work
- the current full app is not a clean Cloudflare Pages target as-is
- a true Cloudflare deployment for the full product would require replacing local filesystem storage with hosted storage

If you only want a static marketing surface, that can go to Cloudflare Pages. If you want the full dashboard/product flow online, plan for a deeper hosting refactor first.
