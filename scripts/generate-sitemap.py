#!/usr/bin/env python3
"""Generate sitemap.xml from indexable HTML pages in this static site."""

from __future__ import annotations

from datetime import datetime, timezone
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
SKIP_DIRS = {".git", "docs", "node_modules", "scripts", "screenshots"}


class PageMetadata(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.canonical = ""
        self.noindex = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = {key.lower(): value or "" for key, value in attrs}
        if tag.lower() == "link" and "canonical" in data.get("rel", "").lower().split():
            self.canonical = data.get("href", "")
        if tag.lower() == "meta" and data.get("name", "").lower() == "robots":
            self.noindex = "noindex" in data.get("content", "").lower()


def lastmod(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    result = subprocess.run(["git", "log", "-1", "--format=%cs", "--", rel], cwd=ROOT, text=True, capture_output=True, check=False)
    return result.stdout.strip() or datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).date().isoformat()


def main() -> int:
    pages: list[tuple[str, Path]] = []
    for path in sorted(ROOT.rglob("*.html")):
        if any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts):
            continue
        parser = PageMetadata()
        parser.feed(path.read_text(encoding="utf-8", errors="replace"))
        if not parser.noindex and parser.canonical.startswith("https://"):
            pages.append((parser.canonical, path))
    if not pages:
        raise RuntimeError("No indexable HTML pages with absolute canonical URLs were found")
    duplicates = {url for url, _ in pages if sum(url == other for other, _ in pages) > 1}
    if duplicates:
        raise RuntimeError(f"Duplicate canonical URLs: {', '.join(sorted(duplicates))}")
    body = "\n".join(f"  <url>\n    <loc>{escape(url)}</loc>\n    <lastmod>{lastmod(path)}</lastmod>\n  </url>" for url, path in pages)
    SITEMAP.write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "\n</urlset>\n", encoding="utf-8")
    print(f"Generated sitemap.xml with {len(pages)} indexable URLs.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
