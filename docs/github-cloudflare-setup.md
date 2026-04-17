# GitHub And Cloudflare Setup

This is the simplest safe workflow for this repo.

## 1. Check your local Git identity

From the repo root:

```bash
git config --get user.name
git config --get user.email
```

If either value is empty:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## 2. Initialize and inspect the repo

If the repo is not initialized yet:

```bash
git init
```

Then check what will be committed:

```bash
git status
```

## 3. Make sure local-only files stay out of Git

This repo already ignores:

- `storage/optimise-ai`
- `portfolio-sites/`
- local env files

That is important because those folders can contain private data and client outputs.

## 4. Add your GitHub remote

SSH version:

```bash
git remote add origin git@github.com:team-ashtra-ai/team-ashtra-ai.git
```

HTTPS version:

```bash
git remote add origin https://github.com/team-ashtra-ai/team-ashtra-ai.git
```

If `origin` already exists:

```bash
git remote set-url origin git@github.com:team-ashtra-ai/team-ashtra-ai.git
```

## 5. Create the first commit

```bash
git add .
git commit -m "Initial app setup"
```

## 6. Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## 7. Connect GitHub to Cloudflare

For Cloudflare Pages:

1. Open Cloudflare Dashboard.
2. Go to `Workers & Pages`.
3. Select `Create application`.
4. Select `Pages`.
5. Select `Connect to Git`.
6. Authorize the `team-ashtra-ai/team-ashtra-ai` repository.

## 8. Choose the right Cloudflare target

Use Cloudflare Pages only for a static export.

Do not point Cloudflare Pages at the current full `apps/web` product unless you first convert it into a true static build target.

Why:

- the app uses server routes
- the app uses local filesystem storage
- the app writes project files at runtime

For the current codebase, the practical choices are:

1. Keep the full app local while you keep building.
2. Deploy only a static site to Cloudflare Pages.
3. Refactor the full app for hosted storage before putting the whole product on Cloudflare.

## 9. If you want automatic deploys from Git

Cloudflare Pages can auto-deploy every time you push to `main` after the repository is connected in the dashboard.

For static Next.js projects, Cloudflare's documented preset is:

- Framework preset: `Next.js (Static HTML Export)`
- Production branch: `main`
- Build command: `npx next build`
- Build directory: `out`

That applies to static exports, not to this repo's current full product flow.

## 10. Recommended next step for this repo

Push this repo to GitHub first.

Then decide between:

1. deploying a small static marketing surface to Cloudflare Pages
2. keeping the full app local until we replace filesystem storage with hosted storage
