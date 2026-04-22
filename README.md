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
- Discovery submissions use the Cloudflare Pages Function at `/api/submit-discovery`.
- Set `FORMSPREE_DISCOVERY_ENDPOINT` if you want to override the default Formspree target.
- Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in Cloudflare Pages if you want the discovery brief relayed to Telegram as well.
