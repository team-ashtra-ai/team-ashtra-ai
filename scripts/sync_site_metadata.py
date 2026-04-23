#!/usr/bin/env python3
from __future__ import annotations

import json
import math
import re
import textwrap
from datetime import date
from html import escape
from pathlib import Path

from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
BRAND_DIR = ROOT / "assets" / "brand"
SITE_URL = "https://ash-tra.com"
TODAY = date.today().isoformat()

LOGO_PNG = BRAND_DIR / "ash-tra-logo.png"
FALLBACK_SOCIAL = "ash-tra-brand-website-social-preview.png"
INDEXABLE_ROBOTS = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"

DEFAULT_SERVICES = [
    "Website strategy",
    "Launch builds",
    "Premium redesigns",
    "Full rebuilds",
    "SEO foundations",
    "Analytics setup",
    "Systems integration",
    "Performance support",
]

OFFER_CATALOG = [
    {
        "name": "Direction Session",
        "description": "Strategic website diagnosis and planning before the build begins.",
    },
    {
        "name": "Message and Position",
        "description": "Sharper positioning, clearer offer language, and stronger messaging structure.",
    },
    {
        "name": "Launch Build",
        "description": "A serious first website for businesses starting properly.",
    },
    {
        "name": "Presence Upgrade",
        "description": "A redesign route for businesses that have outgrown the current site.",
    },
    {
        "name": "Full Reset",
        "description": "A deeper rebuild when the business needs a stronger public read across the whole site.",
    },
    {
        "name": "Pages That Sell",
        "description": "Focused offer and service pages built to convert attention into action.",
    },
    {
        "name": "Search Lift",
        "description": "SEO foundations and search-focused improvements for stronger discoverability.",
    },
    {
        "name": "Insight Setup",
        "description": "Analytics and tracking configuration for clearer decision-making.",
    },
    {
        "name": "Systems Connection",
        "description": "CRM, forms, and back-end routing connected cleanly to the site.",
    },
    {
        "name": "Performance Polish",
        "description": "Usability, speed, and finish improvements after launch.",
    },
    {
        "name": "Global Reach",
        "description": "International and multilingual expansion support when the business needs wider reach.",
    },
    {
        "name": "Momentum Support",
        "description": "Ongoing updates and refinements so the site stays current as the business grows.",
    },
]

HOME_SERVICE_ITEMS = [
    "Strategy and message",
    "Launch builds",
    "Website redesigns",
    "SEO foundations",
    "Analytics setup",
    "Performance support",
]

PORTFOLIO_DIRECTIONS = [
    "Founder-led consultancy website direction",
    "Cinematic AI launch website route",
    "Editorial premium service page system",
]

PROCESS_STEPS = [
    "Discovery",
    "Direction",
    "Build",
    "Refinement",
    "Optimisation",
    "Support",
]

DISCOVERY_ROUTES = [
    "Paid consultation for live diagnosis and strategy.",
    "Free discovery brief for an approximate price range.",
]

CONTACT_ROUTES = [
    "Launch for ready-to-move projects.",
    "Book Call for higher-stakes strategic direction.",
    "Discovery Form for a lighter async first step.",
]

INVESTMENT_LEVELS = [
    {
        "name": "Foundation",
        "description": "A strong professional website presence built fast.",
        "minPrice": 1000,
    },
    {
        "name": "Growth System",
        "description": "A stronger site plus content, positioning, and conversion-focused structure.",
        "minPrice": 1500,
    },
    {
        "name": "Orbital Partnership",
        "description": "An ongoing growth system with continuous updates and strategic support.",
        "minPrice": 2000,
    },
]


PAGES = {
    "home": {
        "file": ROOT / "index.html",
        "path": "/",
        "title": "ASH-TRA | Modern Websites for Ambitious Businesses",
        "description": "ASH-TRA builds modern websites, sharper messaging, and stronger digital presence for ambitious businesses that want more trust, more pull, and more momentum.",
        "keywords": [
            "modern websites",
            "website redesign",
            "website rebuild",
            "premium web design",
            "SEO foundations",
            "ASH-TRA",
        ],
        "social_filename": "ash-tra-home-modern-websites-social-preview.png",
        "social_label": "Home",
        "social_title": "Modern websites for ambitious businesses",
        "social_body": "Strategy, premium design, and sharper digital momentum for companies that want to look ready and move faster.",
        "social_chips": ["Strategy", "Modern Websites", "SEO Foundations"],
        "accent": ("#79E3FF", "#FFB184"),
        "page_type": "WebPage",
        "schema_kind": "home",
        "indexable": True,
    },
    "about": {
        "file": ROOT / "about" / "index.html",
        "path": "/about/",
        "title": "About ASH-TRA | Story, Standards, and the Signal Behind the Site",
        "description": "Read the story behind ASH-TRA, what it stands for, who it fits, and why the studio builds websites to feel clear, credible, and ready for momentum.",
        "keywords": [
            "about ASH-TRA",
            "website studio",
            "brand standards",
            "digital presence",
            "positioning",
            "premium websites",
        ],
        "social_filename": "ash-tra-about-story-standards-signal-social-preview.png",
        "social_label": "About",
        "social_title": "Story, standards, and signal",
        "social_body": "Why ASH-TRA exists, what it believes, and how stronger presentation changes business outcomes.",
        "social_chips": ["Studio Story", "Standards", "Business Signal"],
        "accent": ("#79E3FF", "#8C91FF"),
        "page_type": "AboutPage",
        "schema_kind": "about",
        "indexable": True,
    },
    "services": {
        "file": ROOT / "services" / "index.html",
        "path": "/services/",
        "title": "Services | Strategy, Rebuilds, SEO, and Support | ASH-TRA",
        "description": "Explore ASH-TRA services for strategy, messaging, website launches, redesigns, full rebuilds, SEO foundations, analytics, systems, and ongoing support.",
        "keywords": [
            "website services",
            "website strategy",
            "website redesign",
            "full rebuild",
            "SEO foundations",
            "analytics setup",
        ],
        "social_filename": "ash-tra-services-strategy-rebuild-seo-social-preview.png",
        "social_label": "Services",
        "social_title": "Strategy, rebuilds, SEO, and support",
        "social_body": "A service system built to make ambitious companies look sharper, feel more credible, and move with more force.",
        "social_chips": ["Strategy", "Rebuilds", "SEO & Analytics"],
        "accent": ("#FFB184", "#79E3FF"),
        "page_type": "CollectionPage",
        "schema_kind": "services",
        "indexable": True,
    },
    "examples": {
        "file": ROOT / "examples" / "index.html",
        "path": "/examples/",
        "title": "Website Work Examples | Premium Portfolio Directions | ASH-TRA",
        "description": "Explore ASH-TRA website work examples and portfolio directions that show how structure, pacing, and message change by business type.",
        "keywords": [
            "website portfolio",
            "web design examples",
            "premium website work",
            "case directions",
            "service page design",
            "launch page design",
        ],
        "social_filename": "ash-tra-portfolio-website-work-examples-social-preview.png",
        "social_label": "Portfolio",
        "social_title": "Website work examples with direction",
        "social_body": "Portfolio directions that show how hierarchy, pacing, and premium presentation shift across consultancy, launch, and service brands.",
        "social_chips": ["Portfolio", "Structure", "Premium UX"],
        "accent": ("#79E3FF", "#8C91FF"),
        "page_type": "CollectionPage",
        "schema_kind": "examples",
        "indexable": True,
    },
    "process": {
        "file": ROOT / "process" / "index.html",
        "path": "/process/",
        "title": "Website Process | Discovery, Build, Refinement, and Support | ASH-TRA",
        "description": "See the ASH-TRA process from discovery and direction through build, refinement, optimisation, and support for a stronger website launch.",
        "keywords": [
            "website process",
            "discovery consultation",
            "website build process",
            "website refinement",
            "SEO setup",
            "support",
        ],
        "social_filename": "ash-tra-process-discovery-build-support-social-preview.png",
        "social_label": "Process",
        "social_title": "Discovery, build, refinement, support",
        "social_body": "A clear process built to remove guesswork, sharpen direction, and keep the site moving after launch.",
        "social_chips": ["Discovery", "Build", "Support"],
        "accent": ("#79E3FF", "#FFB184"),
        "page_type": "WebPage",
        "schema_kind": "process",
        "indexable": True,
    },
    "discovery": {
        "file": ROOT / "discovery" / "index.html",
        "path": "/discovery/",
        "title": "Discovery | Paid Consultation or Free Website Brief | ASH-TRA",
        "description": "Choose the ASH-TRA discovery route that fits: paid consultation for live strategic input or a free website brief for an approximate price range.",
        "keywords": [
            "discovery form",
            "project brief",
            "paid consultation",
            "free price range",
            "website strategy",
            "ASH-TRA",
        ],
        "social_filename": "ash-tra-discovery-consultation-price-range-social-preview.png",
        "social_label": "Discovery",
        "social_title": "Paid consultation or free website brief",
        "social_body": "Start with a live strategy route or a free async brief so the next website decision is clearer and more commercially sound.",
        "social_chips": ["Paid Consultation", "Free Brief", "Project Clarity"],
        "accent": ("#79E3FF", "#FFB184"),
        "page_type": "ContactPage",
        "schema_kind": "discovery",
        "indexable": True,
    },
    "contact": {
        "file": ROOT / "contact" / "index.html",
        "path": "/contact/",
        "title": "Contact ASH-TRA | Project Enquiry, Launch, or Discovery Route",
        "description": "Contact ASH-TRA through the route that fits best: direct project launch, paid call, or discovery form for a lighter first step.",
        "keywords": [
            "contact ASH-TRA",
            "project enquiry",
            "launch route",
            "book consultation",
            "discovery form",
            "website enquiry",
        ],
        "social_filename": "ash-tra-contact-project-enquiry-social-preview.png",
        "social_label": "Contact",
        "social_title": "Project enquiry, launch, or discovery route",
        "social_body": "Choose the cleanest way to start: direct launch intake, paid consultation, or async discovery form.",
        "social_chips": ["Project Enquiry", "Launch Route", "Discovery Support"],
        "accent": ("#79E3FF", "#FFB184"),
        "page_type": "ContactPage",
        "schema_kind": "contact",
        "indexable": True,
    },
    "launch": {
        "file": ROOT / "launch" / "index.html",
        "path": "/launch/",
        "title": "Launch Your Project | Website Intake Form | ASH-TRA",
        "description": "Use the ASH-TRA launch intake to start a new website, rebuild, redesign, or focused page project with a cleaner first step.",
        "keywords": [
            "launch project",
            "website intake form",
            "website redesign",
            "website rebuild",
            "new website project",
            "ASH-TRA",
        ],
        "social_filename": "ash-tra-launch-project-intake-social-preview.png",
        "social_label": "Launch",
        "social_title": "Start the project with a cleaner first step",
        "social_body": "A direct intake route for businesses ready to launch, rebuild, or upgrade the public-facing website properly.",
        "social_chips": ["Project Intake", "Website Launch", "Page Builds"],
        "accent": ("#FFB184", "#79E3FF"),
        "page_type": "ContactPage",
        "schema_kind": "launch",
        "indexable": True,
    },
    "invest": {
        "file": ROOT / "invest" / "index.html",
        "path": "/invest/",
        "title": "Website Investment Levels | Foundation, Growth, or Partnership | ASH-TRA",
        "description": "Compare the ASH-TRA investment levels and choose between Foundation, Growth System, and Orbital Partnership based on the level of performance and support you need.",
        "keywords": [
            "website pricing",
            "website investment",
            "foundation package",
            "growth system",
            "orbital partnership",
            "ASH-TRA",
        ],
        "social_filename": "ash-tra-investment-foundation-growth-partnership-social-preview.png",
        "social_label": "Invest",
        "social_title": "Foundation, Growth System, or Partnership",
        "social_body": "Three website investment levels for businesses that need a stronger presence, better performance, or an ongoing growth system.",
        "social_chips": ["Foundation", "Growth System", "Partnership"],
        "accent": ("#FFB184", "#79E3FF"),
        "page_type": "CollectionPage",
        "schema_kind": "invest",
        "indexable": True,
    },
    "payments": {
        "file": ROOT / "payments" / "index.html",
        "path": "/payments/",
        "title": "Consultation Payments | Stripe, PayPal, or Pix | ASH-TRA",
        "description": "Choose the paid consultation route, request Stripe, PayPal, or Pix, and start your website project with a stronger strategic direction.",
        "keywords": [
            "paid consultation",
            "strategy consultation",
            "Stripe",
            "PayPal",
            "Pix",
            "ASH-TRA payments",
        ],
        "social_filename": "ash-tra-payments-consultation-stripe-paypal-pix-social-preview.png",
        "social_label": "Payments",
        "social_title": "Stripe, PayPal, or Pix for the consultation route",
        "social_body": "Start the paid consultation path, request the preferred payment route, and move into booking with real strategic clarity.",
        "social_chips": ["Stripe", "PayPal", "Pix"],
        "accent": ("#FFB184", "#79E3FF"),
        "page_type": "WebPage",
        "schema_kind": "payments",
        "indexable": True,
    },
    "schedule": {
        "file": ROOT / "schedule" / "index.html",
        "path": "/schedule/",
        "title": "Schedule Your Consultation | Book the ASH-TRA Call",
        "description": "Book your paid ASH-TRA consultation slot, prepare properly, and move into the next clear direction for the website project.",
        "keywords": [
            "schedule consultation",
            "book call",
            "Calendly booking",
            "website consultation",
            "ASH-TRA schedule",
            "strategy call",
        ],
        "social_filename": "ash-tra-schedule-consultation-booking-social-preview.png",
        "social_label": "Schedule",
        "social_title": "Book the ASH-TRA consultation call",
        "social_body": "Lock the consultation slot, prepare the right context, and move into the strongest next step for the project.",
        "social_chips": ["Book Call", "Calendly", "Prep"],
        "accent": ("#79E3FF", "#8C91FF"),
        "page_type": "WebPage",
        "schema_kind": "schedule",
        "indexable": True,
    },
    "faq": {
        "file": ROOT / "faq" / "index.html",
        "path": "/faq/",
        "title": "ASH-TRA FAQ | Services, Discovery, SEO, Analytics, and Support",
        "description": "Read clear answers about ASH-TRA services, discovery, paid consultations, SEO, analytics, performance, support, and fit.",
        "keywords": [
            "ASH-TRA FAQ",
            "website services questions",
            "SEO setup",
            "analytics setup",
            "website support",
            "discovery route",
        ],
        "social_filename": "ash-tra-faq-services-seo-support-social-preview.png",
        "social_label": "FAQ",
        "social_title": "Clear answers about services, SEO, and support",
        "social_body": "Short answers covering fit, discovery, paid calls, SEO, analytics, performance, support, and what happens next.",
        "social_chips": ["Services", "SEO", "Support"],
        "accent": ("#79E3FF", "#FFB184"),
        "page_type": "FAQPage",
        "schema_kind": "faq",
        "indexable": True,
    },
    "privacy": {
        "file": ROOT / "privacy" / "index.html",
        "path": "/privacy/",
        "title": "Privacy Policy | ASH-TRA",
        "description": "Read how ASH-TRA collects, uses, stores, and protects information submitted through the website, forms, scheduling, and payment routes.",
        "keywords": [
            "privacy policy",
            "data usage",
            "website forms",
            "payment information",
            "data rights",
            "ASH-TRA privacy",
        ],
        "social_filename": "ash-tra-privacy-policy-data-usage-social-preview.png",
        "social_label": "Privacy",
        "social_title": "How information is collected and used",
        "social_body": "The privacy policy covering submitted information, contact routes, payment steps, and how data is handled on the site.",
        "social_chips": ["Data Use", "Forms", "Rights"],
        "accent": ("#79E3FF", "#8C91FF"),
        "page_type": "WebPage",
        "schema_kind": "privacy",
        "indexable": True,
    },
    "terms": {
        "file": ROOT / "terms" / "index.html",
        "path": "/terms/",
        "title": "Terms of Service | ASH-TRA",
        "description": "Read the ASH-TRA terms covering consultations, project scope, payments, ownership, revisions, liability, and general site use.",
        "keywords": [
            "terms of service",
            "project scope",
            "website payments",
            "ownership",
            "liability",
            "ASH-TRA terms",
        ],
        "social_filename": "ash-tra-terms-service-commercial-scope-social-preview.png",
        "social_label": "Terms",
        "social_title": "Consultations, scope, payments, ownership",
        "social_body": "The commercial terms that apply to consultations, project work, payments, rights, and general use of the site.",
        "social_chips": ["Scope", "Payments", "Ownership"],
        "accent": ("#79E3FF", "#8C91FF"),
        "page_type": "WebPage",
        "schema_kind": "terms",
        "indexable": True,
    },
    "cookies": {
        "file": ROOT / "cookies" / "index.html",
        "path": "/cookies/",
        "title": "Cookie Policy | ASH-TRA",
        "description": "Read how cookies and similar technologies may be used on ash-tra.com for site functionality, analytics, preferences, and performance improvement.",
        "keywords": [
            "cookie policy",
            "cookie consent",
            "analytics cookies",
            "website preferences",
            "tracking policy",
            "ASH-TRA cookies",
        ],
        "social_filename": "ash-tra-cookie-policy-consent-analytics-social-preview.png",
        "social_label": "Cookies",
        "social_title": "Cookie consent, analytics, and preferences",
        "social_body": "The cookie policy covering essential functionality, analytics, preference storage, and website performance measurement.",
        "social_chips": ["Consent", "Analytics", "Preferences"],
        "accent": ("#79E3FF", "#8C91FF"),
        "page_type": "WebPage",
        "schema_kind": "cookies",
        "indexable": True,
    },
    "accessibility": {
        "file": ROOT / "accessibility" / "index.html",
        "path": "/accessibility/",
        "title": "Accessibility Statement | ASH-TRA",
        "description": "Read the ASH-TRA accessibility approach, ongoing improvements, third-party tool notes, and ways to report access issues.",
        "keywords": [
            "accessibility statement",
            "readable website",
            "responsive design",
            "navigation",
            "inclusive web",
            "ASH-TRA accessibility",
        ],
        "social_filename": "ash-tra-accessibility-statement-usable-website-social-preview.png",
        "social_label": "Accessibility",
        "social_title": "Readability, navigation, and responsive access",
        "social_body": "The accessibility statement covering readable layouts, keyboard-friendly paths, responsive behavior, and ongoing improvement.",
        "social_chips": ["Readability", "Navigation", "Responsive"],
        "accent": ("#79E3FF", "#8C91FF"),
        "page_type": "WebPage",
        "schema_kind": "accessibility",
        "indexable": True,
    },
    "404": {
        "file": ROOT / "404.html",
        "path": "/404.html",
        "title": "Page Not Found | ASH-TRA",
        "description": "The page you tried to open is not available. Use the homepage, launch route, discovery route, or contact page instead.",
        "keywords": ["404", "page not found", "site navigation", "launch", "contact", "ASH-TRA"],
        "social_filename": "ash-tra-404-page-not-found-social-preview.png",
        "social_label": "404",
        "social_title": "The page is not here, but the route still is",
        "social_body": "Use the homepage, launch page, discovery route, or contact page to get back onto the right path.",
        "social_chips": ["Not Found", "Site Routes", "Next Step"],
        "accent": ("#79E3FF", "#FFB184"),
        "page_type": "WebPage",
        "schema_kind": "status",
        "indexable": False,
        "robots": "noindex,follow",
        "canonical": "https://ash-tra.com/404.html",
    },
}


def brand_url(filename: str) -> str:
    return f"{SITE_URL}/assets/brand/{filename}"


def relative_prefix(page_key: str) -> str:
    return "./" if page_key in {"home", "404"} else "../"


def canonical_url(page_key: str, meta: dict) -> str:
    return meta.get("canonical", f"{SITE_URL}{meta['path']}")


def slug_display(page_key: str, meta: dict) -> str:
    return meta.get("social_label", page_key.replace("-", " ").title())


def fit_text(draw: ImageDraw.ImageDraw, text: str, font_path: str, max_size: int, min_size: int, max_width: int, max_lines: int):
    words = text.split()
    for size in range(max_size, min_size - 1, -2):
        font = ImageFont.truetype(font_path, size=size)
        lines = []
        current = []
        for word in words:
            probe = " ".join(current + [word]).strip()
            if draw.textbbox((0, 0), probe, font=font)[2] <= max_width:
                current.append(word)
            else:
                if current:
                    lines.append(" ".join(current))
                current = [word]
        if current:
            lines.append(" ".join(current))
        if len(lines) <= max_lines:
            return font, lines
    fallback = ImageFont.truetype(font_path, size=min_size)
    wrapped = textwrap.wrap(text, width=max(10, int(max_width / max(min_size * 0.7, 1))))
    return fallback, wrapped[:max_lines]


def draw_glow(canvas: Image.Image, color: str, bbox: tuple[int, int, int, int], blur: int):
    glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    draw.ellipse(bbox, fill=color)
    glow = glow.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(glow)


def draw_grid(draw: ImageDraw.ImageDraw, width: int, height: int):
    grid_color = (125, 235, 255, 18)
    for x in range(80, width, 120):
        draw.line((x, 0, x, height), fill=grid_color, width=1)
    for y in range(60, height, 120):
        draw.line((0, y, width, y), fill=grid_color, width=1)


def generate_social_image(page_key: str, meta: dict):
    width, height = 1200, 630
    color_a, color_b = meta["accent"]
    canvas = Image.new("RGBA", (width, height), "#07111d")
    draw = ImageDraw.Draw(canvas)

    for y in range(height):
        t = y / max(height - 1, 1)
        r = int(5 + (10 - 5) * t)
        g = int(9 + (20 - 9) * t)
        b = int(20 + (38 - 20) * t)
        draw.line((0, y, width, y), fill=(r, g, b, 255))

    draw_glow(canvas, (*ImageColor(color_a), 90), (70, 40, 470, 330), 80)
    draw_glow(canvas, (*ImageColor(color_b), 82), (760, 210, 1160, 590), 90)

    draw = ImageDraw.Draw(canvas)
    draw_grid(draw, width, height)

    draw.arc((590, 55, 1090, 415), start=205, end=350, fill=(125, 235, 255, 85), width=3)
    draw.arc((120, 180, 980, 720), start=275, end=20, fill=(255, 177, 132, 42), width=2)
    draw.ellipse((830, 335, 1110, 615), outline=(125, 235, 255, 38), width=2)
    draw.ellipse((905, 410, 1015, 520), fill=(255, 177, 132, 28))

    title_font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    body_font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    mono_font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

    label_font = ImageFont.truetype(mono_font_path, size=21)
    body_font = ImageFont.truetype(body_font_path, size=28)
    chip_font = ImageFont.truetype(mono_font_path, size=20)
    brand_font = ImageFont.truetype(body_font_path, size=20)

    title_font, title_lines = fit_text(
        draw,
        meta["social_title"],
        title_font_path,
        max_size=74,
        min_size=48,
        max_width=600,
        max_lines=3,
    )

    left = 74
    top = 74
    label_text = f"ASH-TRA / {slug_display(page_key, meta).upper()}"
    draw.text((left, top), label_text, font=label_font, fill=(196, 225, 242, 210))
    label_w = draw.textbbox((0, 0), label_text, font=label_font)[2]
    draw.line((left, top + 34, left + min(label_w, 320), top + 34), fill=(125, 235, 255, 110), width=2)

    title_top = top + 62
    line_gap = 8
    for line in title_lines:
        draw.text((left, title_top), line, font=title_font, fill=(244, 247, 252, 255))
        title_top += draw.textbbox((0, 0), line, font=title_font)[3] + line_gap

    body_box_w = 560
    body_text = meta["social_body"]
    body_lines = textwrap.wrap(body_text, width=46)
    body_y = title_top + 18
    for line in body_lines[:3]:
        draw.text((left, body_y), line, font=body_font, fill=(221, 229, 239, 232))
        body_y += draw.textbbox((0, 0), line, font=body_font)[3] + 10

    chip_y = 516
    chip_x = left
    for chip in meta["social_chips"][:3]:
        text_w = draw.textbbox((0, 0), chip, font=chip_font)[2]
        chip_w = text_w + 34
        chip_h = 42
        draw.rounded_rectangle(
            (chip_x, chip_y, chip_x + chip_w, chip_y + chip_h),
            radius=21,
            fill=(255, 255, 255, 18),
            outline=(125, 235, 255, 54),
            width=1,
        )
        draw.text((chip_x + 17, chip_y + 9), chip, font=chip_font, fill=(228, 236, 244, 230))
        chip_x += chip_w + 14

    logo = Image.open(LOGO_PNG).convert("RGBA")
    logo.thumbnail((120, 120))
    logo_alpha = logo.split()[-1].point(lambda px: int(px * 0.94))
    logo.putalpha(logo_alpha)
    canvas.alpha_composite(logo, (975, 62))
    draw.text((943, 188), "ASH-TRA", font=brand_font, fill=(228, 236, 244, 232))
    draw.text((74, 582), "ash-tra.com", font=brand_font, fill=(182, 196, 210, 190))

    output_path = BRAND_DIR / meta["social_filename"]
    canvas.convert("RGB").save(output_path, format="PNG", optimize=True)


def ImageColor(hex_value: str):
    hex_value = hex_value.lstrip("#")
    return tuple(int(hex_value[index : index + 2], 16) for index in range(0, 6, 2))


def organization_schema() -> dict:
    return {
        "@type": "Organization",
        "@id": f"{SITE_URL}/#organization",
        "name": "ASH-TRA",
        "url": f"{SITE_URL}/",
        "logo": {"@type": "ImageObject", "url": brand_url("ash-tra-logo.png")},
        "image": brand_url(FALLBACK_SOCIAL),
        "description": "ASH-TRA builds modern websites, sharper messaging, and stronger digital presence for ambitious businesses.",
        "sameAs": [f"{SITE_URL}/"],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "sales",
            "url": f"{SITE_URL}/contact/",
        },
    }


def website_schema() -> dict:
    return {
        "@type": "WebSite",
        "@id": f"{SITE_URL}/#website",
        "url": f"{SITE_URL}/",
        "name": "ASH-TRA",
        "publisher": {"@id": f"{SITE_URL}/#organization"},
        "inLanguage": "en",
    }


def breadcrumb_schema(page_key: str, meta: dict) -> dict | None:
    if page_key == "home":
        return None

    current_url = canonical_url(page_key, meta)
    current_name = meta["title"].split("|")[0].strip()
    return {
        "@type": "BreadcrumbList",
        "@id": f"{current_url}#breadcrumb",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": f"{SITE_URL}/",
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": current_name,
                "item": current_url,
            },
        ],
    }


def image_schema(page_key: str, meta: dict) -> dict:
    current_url = canonical_url(page_key, meta)
    return {
        "@type": "ImageObject",
        "@id": f"{current_url}#primaryimage",
        "url": brand_url(meta["social_filename"]),
        "contentUrl": brand_url(meta["social_filename"]),
        "width": 1200,
        "height": 630,
        "caption": f"{meta['title'].split('|')[0].strip()} social preview",
    }


def webpage_schema(page_key: str, meta: dict) -> dict:
    current_url = canonical_url(page_key, meta)
    schema = {
        "@type": meta["page_type"],
        "@id": f"{current_url}#webpage",
        "url": current_url,
        "name": meta["title"].split("|")[0].strip(),
        "headline": meta["title"],
        "description": meta["description"],
        "isPartOf": {"@id": f"{SITE_URL}/#website"},
        "about": {"@id": f"{SITE_URL}/#organization"},
        "primaryImageOfPage": {"@id": f"{current_url}#primaryimage"},
        "inLanguage": "en",
    }
    breadcrumb = breadcrumb_schema(page_key, meta)
    if breadcrumb:
        schema["breadcrumb"] = {"@id": breadcrumb["@id"]}
    return schema


def faq_entities(faq_file: Path) -> list[dict]:
    soup = BeautifulSoup(faq_file.read_text(encoding="utf-8"), "html.parser")
    entities = []
    for details in soup.select("details[data-faq]"):
        summary = details.find("summary")
        answer = details.find("p")
        if not summary or not answer:
            continue
        question = summary.get_text(" ", strip=True)
        answer_text = answer.get_text(" ", strip=True)
        if not question or not answer_text:
            continue
        entities.append(
            {
                "@type": "Question",
                "name": re.sub(r"^\d+\.\s*", "", question),
                "acceptedAnswer": {"@type": "Answer", "text": answer_text},
            }
        )
    return entities


def extra_schema(page_key: str, meta: dict) -> list[dict]:
    current_url = canonical_url(page_key, meta)
    org_ref = {"@id": f"{SITE_URL}/#organization"}

    if meta["schema_kind"] == "home":
        return [
            {
                "@type": "ItemList",
                "@id": f"{current_url}#core-services",
                "name": "ASH-TRA core services",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {"@type": "Service", "name": name, "provider": org_ref},
                    }
                    for index, name in enumerate(HOME_SERVICE_ITEMS)
                ],
            }
        ]

    if meta["schema_kind"] == "about":
        return [
            {
                "@type": "Service",
                "@id": f"{current_url}#studio-service",
                "name": "Premium website strategy and presentation",
                "provider": org_ref,
                "serviceType": "Website strategy, design, rebuilds, and digital presence improvement",
                "areaServed": "Worldwide",
            }
        ]

    if meta["schema_kind"] == "services":
        return [
            {
                "@type": "OfferCatalog",
                "@id": f"{current_url}#service-catalog",
                "name": "ASH-TRA service catalog",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "position": index + 1,
                        "itemOffered": {
                            "@type": "Service",
                            "name": item["name"],
                            "description": item["description"],
                            "provider": org_ref,
                        },
                    }
                    for index, item in enumerate(OFFER_CATALOG)
                ],
            }
        ]

    if meta["schema_kind"] == "examples":
        return [
            {
                "@type": "ItemList",
                "@id": f"{current_url}#work-directions",
                "name": "Representative website directions",
                "itemListElement": [
                    {"@type": "ListItem", "position": index + 1, "name": item}
                    for index, item in enumerate(PORTFOLIO_DIRECTIONS)
                ],
            }
        ]

    if meta["schema_kind"] == "process":
        return [
            {
                "@type": "HowTo",
                "@id": f"{current_url}#how-it-works",
                "name": "ASH-TRA website process",
                "description": meta["description"],
                "step": [
                    {"@type": "HowToStep", "position": index + 1, "name": step}
                    for index, step in enumerate(PROCESS_STEPS)
                ],
            }
        ]

    if meta["schema_kind"] == "discovery":
        return [
            {
                "@type": "ItemList",
                "@id": f"{current_url}#discovery-routes",
                "name": "ASH-TRA discovery routes",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": item,
                    }
                    for index, item in enumerate(DISCOVERY_ROUTES)
                ],
            }
        ]

    if meta["schema_kind"] == "contact":
        return [
            {
                "@type": "ItemList",
                "@id": f"{current_url}#contact-routes",
                "name": "ASH-TRA contact routes",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": item,
                    }
                    for index, item in enumerate(CONTACT_ROUTES)
                ],
            }
        ]

    if meta["schema_kind"] == "launch":
        return [
            {
                "@type": "Service",
                "@id": f"{current_url}#launch-intake",
                "name": "Website launch intake",
                "provider": org_ref,
                "serviceType": "Project intake for new websites, rebuilds, and focused page work",
                "areaServed": "Worldwide",
            }
        ]

    if meta["schema_kind"] == "invest":
        return [
            {
                "@type": "OfferCatalog",
                "@id": f"{current_url}#investment-levels",
                "name": "ASH-TRA investment levels",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "position": index + 1,
                        "name": item["name"],
                        "description": item["description"],
                        "priceCurrency": "EUR",
                        "priceSpecification": {
                            "@type": "PriceSpecification",
                            "priceCurrency": "EUR",
                            "minPrice": item["minPrice"],
                        },
                        "itemOffered": {
                            "@type": "Service",
                            "name": item["name"],
                            "provider": org_ref,
                        },
                    }
                    for index, item in enumerate(INVESTMENT_LEVELS)
                ],
            }
        ]

    if meta["schema_kind"] == "payments":
        return [
            {
                "@type": "Service",
                "@id": f"{current_url}#paid-consultation",
                "name": "ASH-TRA paid consultation",
                "provider": org_ref,
                "serviceType": "Website strategy consultation",
                "paymentAccepted": "Credit Card, PayPal, Pix",
                "areaServed": "Worldwide",
            }
        ]

    if meta["schema_kind"] == "schedule":
        return [
            {
                "@type": "Service",
                "@id": f"{current_url}#consultation-booking",
                "name": "ASH-TRA consultation booking",
                "provider": org_ref,
                "serviceType": "Consultation booking and preparation",
                "areaServed": "Worldwide",
            }
        ]

    if meta["schema_kind"] == "faq":
        return [
            {
                "@type": "FAQPage",
                "@id": f"{current_url}#faqpage",
                "mainEntity": faq_entities(meta["file"]),
            }
        ]

    return []


def schema_graph(page_key: str, meta: dict) -> dict:
    graph = [
        organization_schema(),
        website_schema(),
        image_schema(page_key, meta),
        webpage_schema(page_key, meta),
    ]
    breadcrumb = breadcrumb_schema(page_key, meta)
    if breadcrumb:
        graph.append(breadcrumb)
    graph.extend(extra_schema(page_key, meta))
    return {"@context": "https://schema.org", "@graph": graph}


def build_head(page_key: str, meta: dict) -> str:
    prefix = relative_prefix(page_key)
    social_url = brand_url(meta["social_filename"])
    robots = meta.get("robots", INDEXABLE_ROBOTS if meta["indexable"] else "noindex,follow")
    canonical = canonical_url(page_key, meta)
    schema_json = json.dumps(schema_graph(page_key, meta), ensure_ascii=False, separators=(",", ":"))
    keyword_content = ", ".join(meta["keywords"])

    redirect_html = ""
    if meta.get("redirect_target"):
        target = meta["redirect_target"]
        redirect_html = (
            f'    <meta http-equiv="refresh" content="0; url={escape(target)}" />\n'
            "    <script>\n"
            "      // Redirect legacy route names locally as well as on hosts that do not read `_redirects`.\n"
            f"      window.location.replace({json.dumps(target)});\n"
            "    </script>\n"
        )

    return (
        "<head>\n"
        '    <meta charset="utf-8" />\n'
        '    <meta name="viewport" content="width=device-width, initial-scale=1" />\n'
        f"    <title>{escape(meta['title'])}</title>\n"
        f'    <meta name="description" content="{escape(meta["description"])}" />\n'
        f'    <meta name="keywords" content="{escape(keyword_content)}" />\n'
        f'    <meta name="robots" content="{escape(robots)}" />\n'
        '    <meta name="author" content="ASH-TRA" />\n'
        '    <meta name="creator" content="ASH-TRA" />\n'
        '    <meta property="og:locale" content="en_US" />\n'
        f'    <link rel="canonical" href="{escape(canonical)}" />\n'
        '    <meta property="og:type" content="website" />\n'
        f'    <meta property="og:title" content="{escape(meta["title"])}" />\n'
        f'    <meta property="og:description" content="{escape(meta["description"])}" />\n'
        '    <meta property="og:site_name" content="ASH-TRA" />\n'
        f'    <meta property="og:url" content="{escape(canonical)}" />\n'
        f'    <meta property="og:image" content="{escape(social_url)}" />\n'
        f'    <meta property="og:image:secure_url" content="{escape(social_url)}" />\n'
        '    <meta property="og:image:type" content="image/png" />\n'
        '    <meta property="og:image:width" content="1200" />\n'
        '    <meta property="og:image:height" content="630" />\n'
        f'    <meta property="og:image:alt" content="{escape(meta["title"].split("|")[0].strip())} social preview" />\n'
        '    <meta name="twitter:card" content="summary_large_image" />\n'
        f'    <meta name="twitter:title" content="{escape(meta["title"])}" />\n'
        f'    <meta name="twitter:description" content="{escape(meta["description"])}" />\n'
        f'    <meta name="twitter:image" content="{escape(social_url)}" />\n'
        f'    <meta name="twitter:image:alt" content="{escape(meta["title"].split("|")[0].strip())} social preview" />\n'
        '    <meta name="application-name" content="ASH-TRA" />\n'
        '    <meta name="theme-color" content="#090d16" />\n'
        '    <meta name="msapplication-TileColor" content="#090d16" />\n'
        f'    <meta name="msapplication-TileImage" content="{prefix}assets/brand/ash-tra-icon-192.png" />\n'
        '    <meta name="color-scheme" content="dark" />\n'
        '    <meta name="apple-mobile-web-app-capable" content="yes" />\n'
        '    <meta name="apple-mobile-web-app-title" content="ASH-TRA" />\n'
        '    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />\n'
        f'    <script type="application/ld+json" data-seo-schema="page">{schema_json}</script>\n'
        f"{redirect_html}"
        f'    <link rel="icon" href="{prefix}assets/brand/ash-tra-favicon.svg" type="image/svg+xml" />\n'
        f'    <link rel="icon" href="{prefix}assets/brand/favicon-16.png" sizes="16x16" type="image/png" />\n'
        f'    <link rel="icon" href="{prefix}assets/brand/favicon-32.png" sizes="32x32" type="image/png" />\n'
        f'    <link rel="icon" href="{prefix}assets/brand/favicon-64.png" sizes="64x64" type="image/png" />\n'
        f'    <link rel="shortcut icon" href="{prefix}assets/brand/favicon-32.png" type="image/png" />\n'
        f'    <link rel="apple-touch-icon" href="{prefix}assets/brand/apple-touch-icon.png" sizes="180x180" />\n'
        f'    <link rel="manifest" href="{prefix}site.webmanifest" />\n'
        '    <link rel="preconnect" href="https://fonts.googleapis.com" />\n'
        '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n'
        '    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700;800&family=Syne:wght@500;600;700;800&display=swap" rel="stylesheet" />\n'
        f'    <link rel="stylesheet" href="{prefix}assets/css/site.css" />\n'
        "</head>"
    )


def replace_head(page_key: str, meta: dict):
    source = meta["file"].read_text(encoding="utf-8")
    rebuilt = build_head(page_key, meta)
    updated = re.sub(r"(?is)<head>.*?</head>", rebuilt, source, count=1)
    meta["file"].write_text(updated, encoding="utf-8")


def generate_sitemap():
    urls = []
    for page_key, meta in PAGES.items():
        if not meta["indexable"]:
            continue
        loc = canonical_url(page_key, meta)
        urls.append(
            "  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{TODAY}</lastmod>\n"
            "  </url>"
        )

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>\n"
    )
    (ROOT / "sitemap.xml").write_text(xml, encoding="utf-8")


def main():
    fallback_meta = {
        "social_filename": FALLBACK_SOCIAL,
        "social_label": "ASH-TRA",
        "social_title": "Modern websites, strategy, and momentum",
        "social_body": "Premium websites, clearer messaging, SEO foundations, and stronger digital presence for ambitious businesses.",
        "social_chips": ["Websites", "Strategy", "Momentum"],
        "accent": ("#79E3FF", "#FFB184"),
    }
    generate_social_image("fallback", fallback_meta)

    for page_key, meta in PAGES.items():
        generate_social_image(page_key, meta)
        replace_head(page_key, meta)

    generate_sitemap()
    print(f"Updated {len(PAGES)} page heads, generated social cards, and refreshed sitemap.xml.")


if __name__ == "__main__":
    main()
