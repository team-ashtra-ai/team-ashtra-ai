# ASH-TRA Languages Brazil — Original Design Rebuild

This package preserves the dark navy, blue-neon and coral ASH-TRA visual system, shared floating header, rounded navigation, typography, glass surfaces and atlas footer while replacing the old web-studio content with the language programme.

# ASH-TRA Languages Brazil complete static website

This folder is ready for static hosting at **https://www.ash-tra.com**. It contains every requested route, shared partials, responsive CSS, JavaScript, original SVG artwork, SEO files, the price calculator, forms and EdBot.

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
