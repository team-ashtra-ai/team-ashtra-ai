# ASH-TRA Static Site

Static multi-page site for `ash-tra.com`.

Brand line: `Where ambition meets momentum.`

## Local preview

```bash
npm run dev
```

Then open `http://localhost:5501`.

## Production notes

- Deploy the repo root with the Cloudflare Pages project connection.
- Keep this as a static Cloudflare Pages site. Do not use Cloudflare Workers or Pages Functions for runtime form handling.
- Keep the canonical domain as `https://ash-tra.com`.
- Add the Search Console TXT record at DNS level.
- Google Analytics loading is wired in [assets/js/site.js](/home/ash/nacho/assets/js/site.js:1) and reads the measurement ID from [assets/js/site-config.js](/home/ash/nacho/assets/js/site-config.js:1).
- Discovery submissions use Formspree directly from the static pages.
