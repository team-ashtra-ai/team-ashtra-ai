# ASH-TRA Languages Brazil — Original Design Rebuild

This package preserves the dark navy, blue-neon and coral ASH-TRA visual system, shared floating header, rounded navigation, typography, glass surfaces and atlas footer while replacing the old web-studio content with the language programme.

# ASH-TRA Languages Brazil complete static website

This folder is ready for static hosting at **https://ash-tra.com**. It contains every requested route, shared partials, responsive CSS, JavaScript, original SVG artwork, SEO files, the price calculator, forms and EdBot.

## Start locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Forms

The forms work immediately through email and WhatsApp fallbacks. To send silently through a secure endpoint, open `assets/js/site-config.js` and set `formEndpoint` to your approved form handler. Review privacy and spam protection before enabling it.

Current contact email in the site: **nativeielts@gmail.com**. Replace it with a tested domain mailbox if `contact@ash-tra.com` is created.

## Before publishing

The site presents the language programme through the original ASH-TRA visual system. Before launch, confirm current programme dates, timetable, teaching availability, form endpoints and payment details.

## Academic model

The uploaded core curriculum has been structured for the website as a 40-week, 600-hour intensive programme: five 3-hour scheduled classes each week. The public Study page presents the academic sequence at website level, while the detailed session schedule remains in the programme documents.

## Page structure

The duplicate `consultation` entry in the requested tree was created once. All other requested routes are present.

## Dynamic price formula

- US$25 per scheduled hour
- 15 hours per week
- US$375 tuition per week
- US$250 documentation and administration fee where applicable
- 12–50 week selector

Variable cultural, transport, ticket, food, accommodation, third-party and student expenses are not included.

## Deployment

Upload the contents of this folder—not the outer ZIP—to the web root. `_headers` and `_redirects` are compatible with Cloudflare Pages-style static deployment. Confirm DNS, HTTPS, form endpoint, analytics consent and email delivery before launch.

### SEO synchronization

`python3 scripts/seo_sync.py` (also `npm run seo:sync`) crawls the configured live site, validates and writes `sitemap.xml`, `robots.txt`, and `llms.txt`, compares indexable page content with `.seo-state.json`, then submits changed, new, and removed URLs to IndexNow. Run `npm run seo:build` before publishing so the generated discovery files ship in that deployment, then `npm run postdeploy` after publishing to crawl the live site and notify IndexNow. Configure `SEO_SITE_URL` if the canonical origin changes. The default is `https://ash-tra.com/`, matching the canonical URLs in this site.

Set `INDEXNOW_KEY` to a key you have generated for this host and publish the matching public key file at `https://ash-tra.com/<key>.txt` before enabling submission. A local build writes this file automatically when `INDEXNOW_KEY` is set and no custom key location is configured. Set `INDEXNOW_KEY_LOCATION` only when the file uses another path on the same host. The key is public by IndexNow design; do not use a secret from another service. The live command checks that the key file is reachable and contains the configured key before submitting. For deployment automation, configure the hosting pipeline's build command to run `npm run seo:build` and its post-deploy command to run `npm run postdeploy` with `INDEXNOW_KEY` and `SEO_SITE_URL` set, and persist `.seo-state.json` between runs (for example, as a CI cache/artifact). The repository does not contain deployment credentials or a configured hosting workflow, so the host-side build and post-deploy hooks must be enabled in the hosting account. Since this is a static site, post-deploy crawl output is written to the runner; publishing changed discovery files still requires the host's next deployment unless its pipeline publishes build artifacts after the crawl.

The script logs to `seo-sync.log`, retries transient IndexNow failures, and does not advance its saved baseline when URL submissions were skipped or rejected. IndexNow covers Bing and participating engines; deprecated generic sitemap ping endpoints are not called. Google's sitemap discovery remains available through the `Sitemap` directive in `robots.txt` and Search Console.

## Pre-launch checklist

1. Confirm the public brand and email.
2. Obtain legal review of Terms, Privacy, Cookies and refund wording.
3. Confirm current programme dates, timetable, teaching availability and intake capacity.
4. Confirm the final 15-hour timetable and teacher capacity.
5. Configure a secure form endpoint and anti-spam control.
6. Test all pages on mobile and desktop.
7. Replace or expand original SVG artwork with properly licensed photography if desired.
8. Run `python3 docs/setup/check_site.py`.


## Brazil Study Blog

This edition adds:

- `/blog/` main blog page
- 10 category pages in `/blog/category/`
- 50 long-form article pages in `/blog/<seo-slug>/`
- 50 original SEO-named SVG hero images in `/assets/media/blog/`
- Blog link in the header and Site Atlas footer
- Article and breadcrumb structured data
- RSS feed at `/blog/feed.xml`
- Updated sitemap
- Editorial manifest and authoritative research-source record in `/docs/`

Every article contains between 1,500 and 2,000 words, H1–H3 headings, a top Brazil-themed image and a unique CTA.


## Editorial immersive rebuild
- Thin Formspree registration banner on every page
- Contact Formspree endpoint: xljreklg
- Application Formspree endpoint: xgawebzl
- Dynamic active navigation
- Unified Brazil hero system and image strips
- Golden outline SVG icon library
- WhatsApp, EdBot and progress-ring back-to-top widgets
- Evergreen blog metadata and enhanced article layout
- Image inventory: docs/IMAGE_INVENTORY.csv
