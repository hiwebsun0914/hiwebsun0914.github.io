#!/usr/bin/env python3
"""Download remote images referenced in markdown files and rewrite paths."""
from __future__ import annotations

import hashlib
import mimetypes
import re
import urllib.parse
import urllib.request
from pathlib import Path

MARKDOWN_IMAGE_RE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")
HTML_IMAGE_RE = re.compile(r"<img[^>]+src=[\"']([^\"']+)[\"']", re.IGNORECASE)


def iter_markdown_files(posts_dir: Path) -> list[Path]:
    return sorted(path for path in posts_dir.rglob("*.md") if path.is_file())


def extract_url(raw: str) -> str:
    cleaned = raw.strip().strip("<>")
    if not cleaned:
        return ""
    parts = cleaned.split()
    return parts[0].strip()


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
    return f"{stem}-{digest}{ext}"


def download_image(url: str, destination: Path) -> Path | None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        return destination
    request = urllib.request.Request(url, headers={"User-Agent": "md-image-downloader/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            content_type = response.headers.get("Content-Type")
            data = response.read()
    except Exception:
        return None
    if not destination.suffix or destination.suffix == ".bin":
        resolved_name = url_to_filename(url, content_type)
        destination = destination.with_name(resolved_name)
        if destination.exists():
            return destination
    destination.write_bytes(data)
    return destination


def replace_links_in_markdown(content: str, url_map: dict[str, str]) -> str:
    for url, local_path in url_map.items():
        content = content.replace(url, local_path)
    return content


def process_markdown_file(path: Path, image_dir: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    urls: set[str] = set()
    for match in MARKDOWN_IMAGE_RE.findall(original):
        url = extract_url(match)
        if url.startswith("http://") or url.startswith("https://"):
            urls.add(url)
    for match in HTML_IMAGE_RE.findall(original):
        url = extract_url(match)
        if url.startswith("http://") or url.startswith("https://"):
            urls.add(url)

    if not urls:
        return False

    url_map: dict[str, str] = {}
    for url in sorted(urls):
        filename = url_to_filename(url, None)
        destination = image_dir / filename
        saved_path = download_image(url, destination)
        if saved_path is not None:
            url_map[url] = f"image/{saved_path.name}"

    if not url_map:
        return False

    updated = replace_links_in_markdown(original, url_map)
    if updated != original:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    posts_dir = repo_root / "data" / "posts"
    image_dir = posts_dir / "image"
    files = iter_markdown_files(posts_dir)
    changed = False
    for md_file in files:
        if process_markdown_file(md_file, image_dir):
            changed = True
    if changed:
        print("Updated markdown files and downloaded images.")
    else:
        print("No updates needed.")


if __name__ == "__main__":
    main()
