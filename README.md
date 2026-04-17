# ASH-TRA Static Site

Static multi-page site for `ash-tra.com`.

Brand line: `Where ambition meets momentum.`

## Local preview

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Production notes

- Deploy the repo root with the Cloudflare Pages project connection.
- GitHub Actions no longer performs Cloudflare deploys for this site.
- Keep the canonical domain as `https://ash-tra.com`.
- Add the Search Console TXT record at DNS level.
- Google Analytics is configured in [assets/js/site-config.js](/home/ash/nacho/assets/js/site-config.js:1).
- Add a real GTM container ID later if you want Tag Manager as well.
