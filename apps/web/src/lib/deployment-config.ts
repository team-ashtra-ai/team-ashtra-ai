import "server-only";

import { writeFile } from "fs/promises";
import { join } from "path";

import type { IntakeSelections } from "@/lib/types";
import { slugify } from "@/lib/utils";

/**
 * Generate deployment configuration files
 */
export async function generateDeploymentConfigs(
  projectDir: string,
  intake: IntakeSelections
): Promise<void> {
  // 1. Netlify config
  await writeFile(join(projectDir, "netlify.toml"), generateNetlifyConfig(intake));

  // 2. Cloudflare Pages config
  await writeFile(
    join(projectDir, "wrangler.toml"),
    generateCloudflareConfig(intake)
  );

  // 3. Vercel config
  await writeFile(join(projectDir, "vercel.json"), generateVercelConfig(intake));

  // 4. GitHub Pages config
  await writeFile(
    join(projectDir, ".github_workflows_deploy.yml"),
    generateGitHubActionsConfig()
  );

  // 5. Docker config for self-hosted
  await writeFile(join(projectDir, "Dockerfile"), generateDockerfile(intake));
  await writeFile(
    join(projectDir, "docker-compose.yml"),
    generateDockerCompose(intake)
  );

  // 6. Environment template
  await writeFile(
    join(projectDir, ".env.template"),
    generateEnvTemplate(intake)
  );
}

function generateNetlifyConfig(intake: IntakeSelections): string {
  return `# Netlify Configuration for ${intake.companyName}
[build]
  publish = "."
  command = "echo 'Static site ready'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Cache settings
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
`;
}

function generateCloudflareConfig(intake: IntakeSelections): string {
  const safeName = slugify(intake.companyName) || "site";

  return `name = "${safeName}-cloudflare"
main = "index.js"
type = "javascript"
account_id = ""
workers_dev = true
route = ""
zone_id = ""

[env.production]
name = "${safeName}-prod"
zone_id = ""

[build]
command = "npm install"
cwd = "./"

[build.upload]
format = "service-worker"

[env.staging]
name = "${safeName}-staging"
zone_id = ""

[[triggers.crons]]
cron = "0 0 * * MON"
`;
}

function generateVercelConfig(intake: IntakeSelections): string {
  const safeName = slugify(intake.companyName) || "site";

  return JSON.stringify(
    {
      name: safeName,
      version: 2,
      public: true,
      buildCommand:
        "echo 'Building static site' && ls -la",
      outputDirectory: "./",
      cleanUrls: true,
      trailingSlash: false,
      headers: [
        {
          source: "/js/:path(.*)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/css/:path(.*)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
      ],
      rewrites: [
        {
          source: "/(.*)",
          destination: "/index.html",
        },
      ],
    },
    null,
    2
  );
}

function generateGitHubActionsConfig(): string {
  return `name: Deploy to production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './'
          production-branch: main
          github-token: \${{ secrets.GITHUB_TOKEN }}
          deploy-message: "CD [skip ci]"
          netlify-auth-token: \${{ secrets.NETLIFY_AUTH_TOKEN }}
          netlify-site-id: \${{ secrets.NETLIFY_SITE_ID }}

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}

env:
  NODE_VERSION: 18
`;
}

function generateDockerfile(intake: IntakeSelections): string {
  const safeName = slugify(intake.companyName) || "site";

  return `FROM node:18-alpine

WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Build if needed
RUN npm run build || true

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]

LABEL com.ashtra.company="${safeName}"
LABEL com.ashtra.app="ash-tra-site"
`;
}

function generateDockerCompose(intake: IntakeSelections): string {
  const safeName = slugify(intake.companyName) || "site";

  return `version: '3.8'

services:
  web:
    build: .
    container_name: ash-tra-${safeName}
    ports:
      - "\${PORT:-3000}:3000"
    environment:
      - NODE_ENV=production
      - COMPANY_NAME=${intake.companyName}
    volumes:
      - ./:/app
      - /app/node_modules
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    container_name: ash-tra-${safeName}-nginx
    ports:
      - "\${NGINX_PORT:-80}:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - web
    restart: unless-stopped
`;
}

function generateEnvTemplate(intake: IntakeSelections): string {
  return `# Environment Configuration for ${intake.companyName}

# Company Info
COMPANY_NAME=${intake.companyName}
COMPANY_EMAIL=
COMPANY_PHONE=

# Site Info
SITE_URL=
SITE_TITLE=${intake.companyName}
SITE_DESCRIPTION=

# Analytics
GOOGLE_ANALYTICS_ID=
GTM_ID=

# Services
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=

# Deployment
NETLIFY_SITE_ID=
NETLIFY_AUTH_TOKEN=

CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ZONE_ID=

# Email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Performance
CACHE_TTL=3600
IMAGE_OPTIMIZATION=true
COMPRESSION_ENABLED=true

# Security
CORS_ORIGINS=
ALLOWED_HOSTS=

# Other
DEBUG=false
NODE_ENV=production
`;
}
