#!/usr/bin/env python3
"""Crawl a static site and synchronize sitemap, robots, llms, and IndexNow.

Live mode is deliberately fail-closed: discovery files and the change baseline
are only replaced after the entire crawl and all local validations succeed.
No third-party packages are required.
"""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from hashlib import sha256
from html import escape
from html.parser import HTMLParser
import json
import logging
import os
from pathlib import Path
import random
import re
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urldefrag, urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
USER_AGENT = "ASHTRA-SEO-Sync/1.0 (+https://ash-tra.com/)"
LOG = logging.getLogger("seo_sync")


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []
        self.canonical: str | None = None
        self.noindex = False
        self.title = ""
        self.description = ""
        self.in_title = False
        self.in_head = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        attrs = {k.lower(): v or "" for k, v in attrs}
        if tag == "head": self.in_head = True
        if tag == "title": self.in_title = True
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "link" and "canonical" in attrs.get("rel", "").lower().split():
            self.canonical = attrs.get("href") or None
        if tag == "meta":
            name = attrs.get("name", "").lower()
            if name in {"robots", "bingbot"} and "noindex" in attrs.get("content", "").lower():
                self.noindex = True
            if name == "description": self.description = attrs.get("content", "").strip()

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title": self.in_title = False
        if tag.lower() == "head": self.in_head = False

    def handle_data(self, data: str) -> None:
        if self.in_title: self.title += data


def normalized_url(value: str, base: str) -> str | None:
    absolute = urldefrag(urljoin(base, value.strip()))[0]
    parts = urlsplit(absolute)
    if parts.scheme not in {"http", "https"} or not parts.netloc or parts.username or parts.password:
        return None
    path = re.sub(r"/{2,}", "/", parts.path or "/")
    if path != "/" and not Path(path).suffix and not path.endswith("/"):
        path += "/"
    return urlunsplit((parts.scheme.lower(), parts.netloc.lower(), path, parts.query, ""))


def same_site_host(host: str, origin: str) -> bool:
    """Treat apex and www as one site; reject unrelated redirect hosts."""
    host = host.lower().split(":", 1)[0]
    origin = origin.lower().split(":", 1)[0]
    return host.removeprefix("www.") == origin.removeprefix("www.")


def sitemap_urls(body: bytes, base: str, origin: str) -> list[str]:
    root = ET.fromstring(body)
    urls = []
    for node in root.iter():
        if node.tag.rsplit("}", 1)[-1] != "loc" or not node.text: continue
        candidate = normalized_url(node.text, base)
        if candidate and same_site_host(urlsplit(candidate).netloc, origin):
            urls.append(candidate)
    return urls


def is_html(content_type: str, url: str) -> bool:
    return "text/html" in content_type.lower() or (not content_type and urlsplit(url).path.lower().endswith((".html", "/")))


def fetch(url: str, timeout: float, max_bytes: int = 3_000_000) -> tuple[str, bytes, str, dict[str, str]]:
    req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xml,text/plain;q=0.9,*/*;q=0.5"})
    with urlopen(req, timeout=timeout) as response:
        body = response.read(max_bytes + 1)
        if len(body) > max_bytes: raise ValueError(f"Response too large: {url}")
        return response.geturl(), body, response.headers.get("Content-Type", ""), dict(response.headers.items())


def crawl(start: str, timeout: float, max_pages: int) -> dict[str, dict[str, str]]:
    origin = urlsplit(start).netloc.lower()
    queue, seen, pages = [start], set(), {}
    try:
        sitemap_url, sitemap_body, _, _ = fetch(urljoin(start, "sitemap.xml"), timeout, max_bytes=20_000_000)
        sitemap_host = urlsplit(sitemap_url).netloc.lower()
        if same_site_host(sitemap_host, origin): origin = sitemap_host
        queue.extend(sitemap_urls(sitemap_body, start, origin))
        LOG.info("seeded crawl from published sitemap (%d URLs queued)", len(queue))
    except Exception as exc:
        LOG.warning("could not use published sitemap: %s", exc)
        local_sitemap = ROOT / "sitemap.xml"
        try:
            queue.extend(sitemap_urls(local_sitemap.read_bytes(), start, origin))
            LOG.info("seeded crawl from validated repository sitemap (%d URLs queued)", len(queue))
        except Exception as local_exc:
            LOG.warning("repository sitemap is unavailable or invalid; continuing with homepage links: %s", local_exc)
    while queue:
        requested = queue.pop(0)
        if requested in seen: continue
        seen.add(requested)
        try:
            final_url, body, content_type, headers = fetch(requested, timeout)
        except HTTPError as exc:
            if exc.code in {404, 410}:
                LOG.info("skip removed URL (HTTP %d): %s", exc.code, requested)
                continue
            raise
        final = normalized_url(final_url, start)
        if not final or not same_site_host(urlsplit(final).netloc, origin):
            LOG.info("skip redirected outside site: %s -> %s", requested, final_url)
            continue
        if requested != final and final in seen:
            LOG.info("skip duplicate redirect target: %s -> %s", requested, final)
            continue
        if requested == start:
            origin = urlsplit(final).netloc.lower()
        seen.add(final)
        if not is_html(content_type, final): continue
        parser = PageParser()
        parser.feed(body.decode("utf-8", errors="replace"))
        if "noindex" in next((v for k, v in headers.items() if k.lower() == "x-robots-tag"), "").lower():
            parser.noindex = True
        canonical = normalized_url(parser.canonical, final) if parser.canonical else final
        if canonical and same_site_host(urlsplit(canonical).netloc, origin) and not parser.noindex:
            digest = sha256(body).hexdigest()
            pages[canonical] = {"hash": digest, "title": " ".join(parser.title.split()),
                                "description": " ".join(parser.description.split()),
                                "lastmod": _last_modified(headers)}
        for href in parser.links:
            candidate = normalized_url(href, final)
            if candidate and same_site_host(urlsplit(candidate).netloc, origin) and candidate not in seen:
                path = urlsplit(candidate).path.lower()
                if not Path(path).suffix or path.endswith(".html"):
                    queue.append(candidate)
        if len(seen) >= max_pages and queue:
            raise RuntimeError(f"Crawl page limit ({max_pages}) reached; refusing partial output")
        LOG.info("crawled %s (%d indexable URLs)", final, len(pages))
    if not pages: raise RuntimeError("Crawl found no indexable HTML pages")
    return dict(sorted(pages.items()))


def _last_modified(headers: dict[str, str]) -> str:
    value = next((v for k, v in headers.items() if k.lower() == "last-modified"), "")
    try: return parsedate_to_datetime(value).date().isoformat()
    except (TypeError, ValueError, OverflowError): return ""


def local_pages(source: Path, base_url: str) -> dict[str, dict[str, str]]:
    pages: dict[str, dict[str, str]] = {}
    ignored = {".git", "node_modules", "docs", "scripts", "screenshots", ".tmp", "partials"}
    for path in sorted(source.rglob("*.html")):
        if any(part in ignored for part in path.relative_to(source).parts): continue
        content = path.read_bytes()
        parser = PageParser()
        parser.feed(content.decode("utf-8", errors="replace"))
        local_path = path.relative_to(source).as_posix()
        local_path = "" if local_path == "index.html" else local_path.removesuffix("index.html")
        fallback = urljoin(base_url.rstrip("/") + "/", local_path)
        canonical = normalized_url(parser.canonical, fallback) if parser.canonical else normalized_url(fallback, base_url)
        if not parser.noindex and canonical and urlsplit(canonical).netloc.lower() == urlsplit(base_url).netloc.lower():
            pages[canonical] = {"hash": sha256(content).hexdigest(), "title": " ".join(parser.title.split()),
                                "description": " ".join(parser.description.split()), "lastmod": ""}
    if not pages: raise RuntimeError(f"No indexable HTML pages found under {source}")
    return dict(sorted(pages.items()))


def make_sitemap(pages: dict[str, dict[str, str]]) -> bytes:
    ET.register_namespace("", SITEMAP_NS)
    root = ET.Element(f"{{{SITEMAP_NS}}}urlset")
    for url, meta in sorted(pages.items()):
        item = ET.SubElement(root, f"{{{SITEMAP_NS}}}url")
        ET.SubElement(item, f"{{{SITEMAP_NS}}}loc").text = url
        if meta.get("lastmod"): ET.SubElement(item, f"{{{SITEMAP_NS}}}lastmod").text = meta["lastmod"]
    return b'<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(root, encoding="utf-8") + b"\n"


def make_robots(path: Path, sitemap_url: str) -> bytes:
    text = path.read_text(encoding="utf-8") if path.exists() else "User-agent: *\nAllow: /\n"
    lines = [line.rstrip() for line in text.splitlines() if not line.strip().lower().startswith("sitemap:")]
    lines.extend(["", f"Sitemap: {sitemap_url}"])
    result = "\n".join(lines).strip() + "\n"
    if not any(line.strip().lower() == "user-agent: *" for line in lines):
        raise ValueError("robots.txt must include a User-agent: * group")
    return result.encode("utf-8")


def make_llms(pages: dict[str, dict[str, str]]) -> bytes:
    out = ["# ASH-TRA Languages Brazil", "", "> Brazilian Portuguese language study and cultural learning in Brazil.",
           "", "## Indexable pages", ""]
    for url, meta in sorted(pages.items()):
        label = meta.get("title") or url
        description = meta.get("description", "")
        out.append(f"- [{label}]({url})" + (f": {description}" if description else ""))
    out += ["", "## Discovery", "", f"- Sitemap: {urlsplit(next(iter(pages)))[0]}://{urlsplit(next(iter(pages))).netloc}/sitemap.xml", ""]
    return "\n".join(out).encode("utf-8")


def validate_outputs(pages: dict[str, dict[str, str]], sitemap: bytes, robots: bytes, llms: bytes) -> None:
    root = ET.fromstring(sitemap)
    locs = [node.text for node in root.findall(f"{{{SITEMAP_NS}}}url/{{{SITEMAP_NS}}}loc")]
    if len(locs) != len(set(locs)) or set(locs) != set(pages): raise ValueError("Sitemap URL set is invalid")
    for loc in locs:
        parts = urlsplit(loc)
        if parts.scheme != "https" or not parts.netloc or parts.fragment: raise ValueError(f"Invalid sitemap URL: {loc}")
    robot_text = robots.decode("utf-8")
    if "User-agent: *" not in robot_text or "Sitemap: https://" not in robot_text: raise ValueError("robots.txt is missing required directives")
    if not llms.startswith(b"# ") or not llms.endswith(b"\n"): raise ValueError("llms.txt format is invalid")


def atomic_write(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_bytes(data)
    temp.replace(path)


def submit_indexnow(urls: list[str], key: str, key_location: str, host: str,
                    timeout: float, retries: int, dry_run: bool) -> None:
    if not urls: LOG.info("IndexNow: no changed URLs"); return
    if not key:
        LOG.warning("INDEXNOW_KEY is unset; %d changed URLs were not submitted", len(urls)); return
    if not re.fullmatch(r"[A-Za-z0-9-]{8,128}", key): raise ValueError("INDEXNOW_KEY has invalid format")
    key_location = key_location or f"https://{host}/{key}.txt"
    if urlsplit(key_location).scheme != "https" or urlsplit(key_location).netloc.lower() != host.lower():
        raise ValueError("IndexNow key location must be an HTTPS URL on the submitted host")
    if not dry_run:
        try:
            _, key_body, _, _ = fetch(key_location, timeout, max_bytes=4096)
        except Exception as exc:
            raise RuntimeError(f"IndexNow key file is not publicly reachable: {key_location}: {exc}") from exc
        if key_body.decode("utf-8", errors="replace").strip() != key:
            raise RuntimeError(f"IndexNow key file content does not match INDEXNOW_KEY: {key_location}")
    # The API permits batches of at most 10,000 URLs.
    for offset in range(0, len(urls), 10_000):
        batch = urls[offset:offset + 10_000]
        payload = json.dumps({"host": host, "key": key, "keyLocation": key_location, "urlList": batch}).encode()
        if dry_run:
            LOG.info("DRY RUN IndexNow batch: %d URLs", len(batch)); continue
        for attempt in range(retries + 1):
            request = Request(INDEXNOW_ENDPOINT, data=payload, method="POST", headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": USER_AGENT})
            try:
                with urlopen(request, timeout=timeout) as response:
                    body = response.read(4096).decode("utf-8", errors="replace")
                    LOG.info("IndexNow response status=%d body=%s", response.status, body[:1000])
                    if response.status in {200, 202}: break
                    if response.status in {400, 403, 422}: raise RuntimeError(f"IndexNow rejected request ({response.status}): {body}")
                    if response.status < 500: raise RuntimeError(f"Unexpected IndexNow status {response.status}: {body}")
            except HTTPError as exc:
                detail = exc.read(4096).decode("utf-8", errors="replace")
                LOG.warning("IndexNow HTTP %s: %s", exc.code, detail[:1000])
                if exc.code in {400, 403, 422}: raise RuntimeError(f"IndexNow rejected request ({exc.code}): {detail}") from exc
                if exc.code not in {429, 500, 502, 503, 504}: raise
                if attempt == retries: raise
                delay = min(60, 2 ** attempt + random.random())
                retry_after = exc.headers.get("Retry-After")
                if retry_after and retry_after.isdigit(): delay = min(120, int(retry_after))
                time.sleep(delay)
                continue
            except (URLError, TimeoutError) as exc:
                if attempt == retries: raise RuntimeError(f"IndexNow request failed: {exc}") from exc
                time.sleep(min(60, 2 ** attempt + random.random()))
                continue
            break


def load_state(path: Path) -> dict[str, dict[str, str]]:
    if not path.exists(): return {}
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict) or not all(isinstance(k, str) and isinstance(v, dict) and isinstance(v.get("hash"), str) for k, v in raw.items()):
        raise ValueError(f"Invalid SEO state file: {path}")
    return raw


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site-url", default=os.getenv("SEO_SITE_URL", "https://ash-tra.com/"), help="Canonical HTTPS site origin")
    parser.add_argument("--local", action="store_true", help="Generate from local HTML (for builds); do not crawl")
    parser.add_argument("--source", type=Path, default=ROOT, help="Local HTML root (with --local)")
    parser.add_argument("--output", type=Path, default=ROOT, help="Output directory for sitemap.xml, robots.txt, llms.txt")
    parser.add_argument("--state-file", type=Path, default=ROOT / ".seo-state.json")
    parser.add_argument("--max-pages", type=int, default=5000)
    parser.add_argument("--timeout", type=float, default=15)
    parser.add_argument("--retries", type=int, default=4)
    parser.add_argument("--dry-run", action="store_true", help="Do not submit IndexNow requests")
    parser.add_argument("--no-submit", action="store_true", help="Generate files and report changes without IndexNow submission")
    parser.add_argument("--log-file", type=Path, default=ROOT / "seo-sync.log")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s",
                        handlers=[logging.StreamHandler(), logging.FileHandler(args.log_file, encoding="utf-8")])
    try:
        site = args.site_url.rstrip("/") + "/"
        site_parts = urlsplit(site)
        if site_parts.scheme != "https" or not site_parts.netloc or site_parts.path not in {"", "/"}:
            raise ValueError("--site-url must be an HTTPS origin without a path")
        pages = local_pages(args.source.resolve(), site) if args.local else crawl(site, args.timeout, args.max_pages)
        canonical_parts = urlsplit(next(iter(pages)))
        canonical_origin = f"{canonical_parts.scheme}://{canonical_parts.netloc}"
        old = load_state(args.state_file)
        new_urls = sorted(set(pages) - set(old))
        changed_urls = sorted(url for url in set(pages) & set(old) if pages[url]["hash"] != old[url]["hash"])
        deleted_urls = sorted(set(old) - set(pages))
        LOG.info("Crawl complete: %d indexable, %d new, %d updated, %d deleted", len(pages), len(new_urls), len(changed_urls), len(deleted_urls))

        sitemap = make_sitemap(pages)
        robots = make_robots(args.output / "robots.txt", canonical_origin + "/sitemap.xml")
        llms = make_llms(pages)
        validate_outputs(pages, sitemap, robots, llms)
        if args.local or not args.no_submit:
            for name, data in (("sitemap.xml", sitemap), ("robots.txt", robots), ("llms.txt", llms)):
                atomic_write(args.output / name, data)
                LOG.info("wrote and validated %s (%d bytes)", args.output / name, len(data))
            key = os.getenv("INDEXNOW_KEY", "")
            if args.local and key and not os.getenv("INDEXNOW_KEY_LOCATION"):
                atomic_write(args.output / f"{key}.txt", (key + "\n").encode())
                LOG.info("wrote public IndexNow key file %s", args.output / f"{key}.txt")
        submit_list = sorted(set(new_urls + changed_urls + deleted_urls))
        submission_complete = not submit_list
        if not args.no_submit:
            if args.dry_run and submit_list:
                submit_indexnow(submit_list, os.getenv("INDEXNOW_KEY", ""), os.getenv("INDEXNOW_KEY_LOCATION", ""),
                                canonical_parts.netloc, args.timeout, args.retries, True)
            else:
                before = bool(os.getenv("INDEXNOW_KEY"))
                submit_indexnow(submit_list, os.getenv("INDEXNOW_KEY", ""), os.getenv("INDEXNOW_KEY_LOCATION", ""),
                                canonical_parts.netloc, args.timeout, args.retries, False)
                submission_complete = before or not submit_list
        else:
            LOG.info("IndexNow submission disabled; changed URLs: %s", submit_list)
        # Keep changes pending until IndexNow accepted them (or there were none).
        if submission_complete and not args.dry_run:
            atomic_write(args.state_file, (json.dumps(pages, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode())
        elif submit_list:
            LOG.warning("Change baseline not advanced; these URLs remain pending submission")
        return 0
    except Exception as exc:
        LOG.exception("SEO sync failed: %s", exc)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
