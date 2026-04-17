# GitHub And Cloudflare Setup

This repo now includes a GitHub Actions deployment workflow at [.github/workflows/deploy-cloudflare.yml](/home/ash/nacho/.github/workflows/deploy-cloudflare.yml).

When you push to `main`, GitHub can deploy the `apps/web` Next.js app to Cloudflare automatically.

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

## 7. Create the Cloudflare API token

In Cloudflare:

1. Open `My Profile` -> `API Tokens`.
2. Create a token that can deploy Workers.
3. Include at least:
   - `Account` -> `Cloudflare Workers Scripts` -> `Edit`
   - `Zone` -> `Workers Routes` -> `Edit` if you will attach custom domains through automation
   - `Zone` -> `Zone Settings` -> `Read`
4. Copy the token value.

You also need your Cloudflare account ID from the dashboard.

## 8. Add GitHub secrets and variables

In `team-ashtra-ai/team-ashtra-ai` -> `Settings` -> `Secrets and variables` -> `Actions`:

Add these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `SESSION_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PIXABAY_API_KEY` if used
- `SMTP_USER` if used
- `SMTP_PASS` if used

Add these repository variables:

- `NEXT_PUBLIC_APP_URL`
- `OWNER_EMAIL`
- `OLLAMA_BASE_URL`
- `OLLAMA_MODEL`
- `STRIPE_CURRENCY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_FROM`

Only the values your app actually uses need to be set, but `NEXT_PUBLIC_APP_URL` should be set for production.

## 9. Cloudflare app target

This repo is no longer using the old static-only Pages approach for automatic deploys.

The checked-in deploy flow uses:

- `@opennextjs/cloudflare`
- [apps/web/wrangler.jsonc](/home/ash/nacho/apps/web/wrangler.jsonc)
- [apps/web/open-next.config.ts](/home/ash/nacho/apps/web/open-next.config.ts)
- GitHub Actions on push to `main`

That better matches the current Next.js app than a static Pages export.

## 10. Push to main

After the GitHub secrets and variables are set:

```bash
git add .
git commit -m "Add Cloudflare auto-deploy workflow"
git push origin main
```

Each push to `main` will trigger the workflow and deploy the latest app build to Cloudflare.

## 11. Important runtime note

The public marketing site is the best fit for this hosted setup today.

Parts of the app still depend on local filesystem storage for users, projects, uploads, and generated outputs. Those flows may need a later refactor to use hosted storage before the entire dashboard workflow is production-ready on Cloudflare.
