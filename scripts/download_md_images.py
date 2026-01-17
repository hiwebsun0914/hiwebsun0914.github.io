#!/usr/bin/env python3
"""Download CDN images referenced in markdown files and rewrite ONLY those image URLs.

- Only touches image references (Markdown image syntax / HTML <img> src).
- Only downloads & rewrites URLs whose host matches allowed CDN hosts (default: cdn.nlark.com).
- Does NOT touch normal links, raw URLs, or anything in code blocks.
"""

from __future__ import annotations

import hashlib
import mimetypes
import re
import urllib.parse
import urllib.request
from pathlib import Path


# Markdown image: ![alt](url "optional title")
MARKDOWN_IMAGE_RE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")

# HTML img: <img ... src="..."> or <img ... src='...'
HTML_IMAGE_RE = re.compile(r"(<img\b[^>]*\bsrc=)([\"'])([^\"']+)(\2)", re.IGNORECASE)

# Skip fenced code blocks ```...``` to avoid touching examples
FENCED_CODE_BLOCK_RE = re.compile(r"```[\s\S]*?```", re.MULTILINE)


# Only these CDN hosts will be downloaded/rewritten.
# Add more if needed, e.g. {"cdn.nlark.com", "your.cdn.com"}
ALLOWED_CDN_HOSTS = {"cdn.nlark.com"}


def iter_markdown_files(posts_dir: Path) -> list[Path]:
    return sorted(path for path in posts_dir.rglob("*.md") if path.is_file())


def protect_code_blocks(text: str) -> tuple[str, dict[str, str]]:
    mapping: dict[str, str] = {}
    idx = 0

    def repl(m: re.Match) -> str:
        nonlocal idx
        key = f"__CODE_BLOCK_{idx}__"
        mapping[key] = m.group(0)
        idx += 1
        return key

    protected = re.sub(FENCED_CODE_BLOCK_RE, repl, text)
    return protected, mapping


def restore_code_blocks(text: str, mapping: dict[str, str]) -> str:
    for key, block in mapping.items():
        text = text.replace(key, block)
    return text


def extract_url_and_title(raw_inside_parentheses: str) -> tuple[str, str]:
    """
    Parse Markdown image target inside parentheses:
      url
      <url>
      url "title"
      url 'title'
    Return (url, title_part_with_leading_space_or_empty).
    """
    cleaned = raw_inside_parentheses.strip().strip("<>")
    if not cleaned:
        return "", ""

    parts = cleaned.split(maxsplit=1)
    url = parts[0].strip()
    title = ""
    if len(parts) == 2:
        title = " " + parts[1].strip()
    return url, title


def is_allowed_cdn_image(url: str) -> bool:
    """True if url is http(s) and host is in ALLOWED_CDN_HOSTS."""
    if not (url.startswith("http://") or url.startswith("https://")):
        return False
    parsed = urllib.parse.urlparse(url)
    host = (parsed.hostname or "").lower()
    return host in ALLOWED_CDN_HOSTS


def url_to_filename(url: str, content_type: str | None) -> str:
    parsed = urllib.parse.urlparse(url)
    basename = Path(parsed.path).name
    stem = Path(basename).stem if basename else "image"
    ext = Path(basename).suffix

    if not ext:
        guessed = None
        if content_type:
            guessed = mimetypes.guess_extension(content_type.split(";")[0].strip())
        ext = guessed or ".bin"

    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:10]
    safe_stem = re.sub(r"[^a-zA-Z0-9._-]+", "-", stem).strip("-") or "image"
    return f"{safe_stem}-{digest}{ext}"


def download_image(url: str, destination: Path) -> Path | None:
    destination.parent.mkdir(parents=True, exist_ok=True)

    # reuse if already exists
    if destination.exists():
        return destination

    request = urllib.request.Request(url, headers={"User-Agent": "cdn-image-downloader/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            content_type = response.headers.get("Content-Type")
            data = response.read()
    except Exception:
        return None

    # If extension unknown, resolve based on content-type
    if destination.suffix in ("", ".bin"):
        resolved_name = url_to_filename(url, content_type)
        destination = destination.with_name(resolved_name)
        if destination.exists():
            return destination

    destination.write_bytes(data)
    return destination


def process_markdown_file(md_path: Path, image_dir: Path) -> bool:
    original = md_path.read_text(encoding="utf-8")
    protected, code_map = protect_code_blocks(original)

    changed = False
    url_to_local: dict[str, str] = {}

    # Markdown images
    def repl_md(m: re.Match) -> str:
        nonlocal changed
        raw_inside = m.group(1)
        url, title = extract_url_and_title(raw_inside)

        if not url or not is_allowed_cdn_image(url):
            return m.group(0)

        if url not in url_to_local:
            filename = url_to_filename(url, None)
            saved = download_image(url, image_dir / filename)
            if saved is None:
                return m.group(0)
            url_to_local[url] = f"image/{saved.name}"

        new_target = f"{url_to_local[url]}{title}"
        changed = True
        return m.group(0).replace(raw_inside, new_target)

    protected2 = re.sub(MARKDOWN_IMAGE_RE, repl_md, protected)

    # HTML <img src="...">
    def repl_html(m: re.Match) -> str:
        nonlocal changed
        prefix, quote, url = m.group(1), m.group(2), m.group(3)

        if not url or not is_allowed_cdn_image(url):
            return m.group(0)

        if url not in url_to_local:
            filename = url_to_filename(url, None)
            saved = download_image(url, image_dir / filename)
            if saved is None:
                return m.group(0)
            url_to_local[url] = f"image/{saved.name}"

        changed = True
        return f"{prefix}{quote}{url_to_local[url]}{quote}"

    protected3 = re.sub(HTML_IMAGE_RE, repl_html, protected2)

    updated = restore_code_blocks(protected3, code_map)

    if changed and updated != original:
        md_path.write_text(updated, encoding="utf-8")
        return True
    return False


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    posts_dir = repo_root / "data" / "posts"
    image_dir = posts_dir / "image"

    md_files = iter_markdown_files(posts_dir)
    any_changed = False

    for md in md_files:
        if process_markdown_file(md, image_dir):
            any_changed = True

    print("Updated CDN image links and downloaded images." if any_changed else "No CDN images to update.")


if __name__ == "__main__":
    main()
