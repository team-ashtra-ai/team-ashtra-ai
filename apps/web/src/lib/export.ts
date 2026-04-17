import "server-only";

export async function generateZipFile(): Promise<Buffer | null> {
  return null;
}

export function generateWordPressExport(
  html: string,
  projectId: string,
  companyName: string
): string {
  // Convert HTML to WordPress post XML format
  const timestamp = new Date().toISOString();
  const postId = 1;

  const wpExport = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
	<title>${companyName}</title>
	<link>https://example.com</link>
	<description>Migrated from ${companyName}</description>
	<lastBuildDate>${timestamp}</lastBuildDate>
	<language>en-us</language>
	<wp:wxr_version>1.2</wp:wxr_version>
	<wp:base_site_url>https://example.com/</wp:base_site_url>
	<wp:base_blog_url>https://example.com/</wp:base_blog_url>
	<wp:author>
		<wp:author_login>admin</wp:author_login>
		<wp:author_email>admin@example.com</wp:author_email>
		<wp:author_display_name><![CDATA[Administrator]]></wp:author_display_name>
	</wp:author>
	<category>
		<term_id>1</term_id>
		<cat_name><![CDATA[Uncategorized]]></cat_name>
		<category_nicename>uncategorized</category_nicename>
	</category>
	<wp:category>
		<wp:term_id>1</wp:term_id>
		<wp:category_nicename>uncategorized</wp:category_nicename>
		<wp:cat_name><![CDATA[Uncategorized]]></wp:cat_name>
	</wp:category>
	<item>
		<title><![CDATA[${companyName}]]></title>
		<link>https://example.com/</link>
		<pubDate>${timestamp}</pubDate>
		<dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/"><![CDATA[admin]]></dc:creator>
		<guid isPermaLink="false">https://example.com/?p=${postId}</guid>
		<description></description>
		<content:encoded><![CDATA[
${html}
		]]></content:encoded>
		<excerpt:encoded><![CDATA[]]></excerpt:encoded>
		<wp:post_id>${postId}</wp:post_id>
		<wp:post_name>homepage</wp:post_name>
		<wp:post_parent>0</wp:post_parent>
		<wp:menu_order>0</wp:menu_order>
		<wp:post_type>page</wp:post_type>
		<wp:post_password></wp:post_password>
		<wp:is_sticky>0</wp:is_sticky>
		<category domain="category" nicename="uncategorized"><![CDATA[Uncategorized]]></category>
	</item>
</rss>`;

  return wpExport;
}

export function generateNetlifyConfig(): string {
  return `[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/styles/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"
`;
}

export function generateCloudflareConfig(domain: string): string {
  return `
# Cloudflare Pages Configuration
name = "${domain}"
compatibility_date = "2024-01-01"

[build]
  command = "npm run build"
  watch_paths = ["/src/**/*.{js,jsx,ts,tsx}"]

[env.production]
  routes = [
    { pattern = "*.example.com", zone_name = "example.com" }
  ]

[[routes]]
  pattern = "/"
  custom_domain = true

[[routes]]
  pattern = "/images/*"
  custom_domain = true
`;
}

export function generateDockerfile(): string {
  return `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
`;
}

export function generateEnvTemplate(): string {
  return `# Database
DATABASE_URL=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Ollama (Local AI)
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:7b

# Pixabay (Curated marketing media)
PIXABAY_API_KEY=

# Site
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;
}
