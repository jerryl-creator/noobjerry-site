#!/usr/bin/env python3
"""
Writes the page's main content straight into index.html at publish time.

The site normally builds itself with JavaScript (app.js). This step puts the same
content into the HTML file first, so search engines, link checkers and visitors
without JavaScript see your name, bio, links, setup and latest videos too.
app.js then takes over as usual and redraws the same markup.

Used by the GitHub workflow:  python3 scripts/prerender.py _site
If anything here can't be read, it prints a warning and leaves index.html as it is:
the site still works exactly as before, just built by JavaScript.
"""
import datetime
import html
import json
import pathlib
import re
import sys

esc = lambda s: html.escape(str(s or ""), quote=True)


def js_literal_to_json(src):
    """Turn the JavaScript object in content.js into JSON: drop comments,
    quote bare keys, remove trailing commas. Strings are left untouched."""
    out, i, n = [], 0, len(src)
    while i < n:
        c = src[i]
        if c in "\"'":                                   # string literal
            q, j, buf = c, i + 1, []
            while j < n and src[j] != q:
                if src[j] == "\\":
                    buf.append(src[j:j + 2]); j += 2; continue
                buf.append(src[j]); j += 1
            body = "".join(buf)
            if q == "'":
                body = body.replace("\\'", "'").replace('"', '\\"')
            out.append('"' + body + '"'); i = j + 1
        elif src.startswith("//", i):
            i = src.find("\n", i); i = n if i == -1 else i
        elif src.startswith("/*", i):
            i = src.find("*/", i); i = n if i == -1 else i + 2
        elif c.isalpha() or c in "_$":                   # bare word: key, true/false/null
            m = re.match(r"[A-Za-z_$][\w$]*", src[i:])
            word = m.group(0); i += len(word)
            rest = src[i:].lstrip()
            out.append(f'"{word}"' if rest.startswith(":") else word)
        else:
            out.append(c); i += 1
    text = "".join(out)
    text = re.sub(r",(\s*[}\]])", r"\1", text)          # trailing commas
    return text


def load_assigned(path, name):
    src = path.read_text(encoding="utf-8")
    m = re.search(r"window\." + name + r"\s*=\s*", src)
    if not m:
        raise ValueError(f"{name} not found in {path.name}")
    body = src[m.end():].strip().rstrip(";").strip()
    return json.loads(js_literal_to_json(body))


def fmt_date(d):
    try:
        return datetime.date.fromisoformat(str(d)[:10]).strftime("%b %-d, %Y")
    except ValueError:
        return esc(d)


def nice(t):
    return re.sub(r"\b\w", lambda m: m.group(0).upper(), str(t))


def main(site):
    site = pathlib.Path(site)
    page_path = site / "index.html"
    page = page_path.read_text(encoding="utf-8")
    S = load_assigned(site / "content.js", "SITE")
    auto = load_assigned(site / "videos.js", "AUTO_VIDEOS") if (site / "videos.js").exists() else []
    app = (site / "app.js").read_text(encoding="utf-8")
    icons = dict(re.findall(r"^\s{4}(\w+): '(<svg.*?</svg>)',?$", app, re.M))
    play = re.search(r"const PLAY = '(<svg.*?</svg>)';", app).group(1)
    icon = lambda p: icons.get(p, icons.get("link", ""))

    def fill(tag_open, inner, count=1):
        nonlocal page
        empty = tag_open + "</" + re.match(r"<(\w+)", tag_open).group(1) + ">"
        if empty not in page:
            print(f"  (skipped, not found: {tag_open})")
            return
        page = page.replace(empty, tag_open + inner + empty[len(tag_open):], count)

    name = S.get("name", "")
    fill('<a href="#top" class="logo" id="logo">', esc(name))
    fill('<h1 id="name">', esc(name))
    fill('<p class="tagline" id="tagline">', esc(S.get("tagline")))
    fill('<p class="bio" id="bio">', esc(S.get("bio")))
    if S.get("avatar"):
        fill('<div class="avatar" id="avatar">',
             f'<img src="{esc(S["avatar"])}" alt="" width="400" height="400" referrerpolicy="no-referrer">')

    socials = S.get("socials", [])
    fill('<div class="social-row" id="social-row">', "".join(
        f'<a class="social-btn" data-platform="{esc(s.get("platform"))}" href="{esc(s.get("url"))}" target="_blank" rel="noopener" '
        f'aria-label="{esc(s.get("label"))}" title="{esc(s.get("label"))}">{icon(s.get("platform"))}</a>' for s in socials))
    fill('<div class="link-list" id="link-list">', "".join(
        f'<a class="link-item" data-platform="{esc(s.get("platform"))}" href="{esc(s.get("url"))}" target="_blank" rel="noopener">{icon(s.get("platform"))}'
        f'<div><strong>{esc(s.get("label"))}</strong><span>{esc(s.get("handle"))}</span></div><span class="arrow">↗</span></a>' for s in socials))

    # Setup cards
    setup = S.get("setup") or []
    if setup:
        page = page.replace('<section id="setup" class="section" hidden>', '<section id="setup" class="section">', 1)
        fill('<div class="setup-grid" id="setup-grid">', "".join(
            f'<div class="setup-card"><h3>{esc(g.get("name"))}<span class="jp">{esc(g.get("jp"))}</span></h3><dl>'
            + "".join(f"<div><dt>{esc(k)}</dt><dd>{esc(v)}</dd></div>" for k, v in g.get("items", []))
            + "</dl></div>" for g in setup))

    # Latest videos (same merge rules as app.js: hand-picked win, hidden ones left out)
    manual = S.get("videos") or []
    manual_ids = {v.get("youtubeId") for v in manual if v.get("youtubeId")}
    hidden = set(S.get("hideVideos") or [])
    pool = manual + ([] if S.get("autoVideos") is False else [v for v in auto if v.get("youtubeId") not in manual_ids])
    videos = sorted((v for v in pool if v.get("youtubeId") not in hidden), key=lambda v: str(v.get("date")), reverse=True)
    long_videos = [v for v in videos if not v.get("short")]

    def thumb(v):
        vid = v.get("youtubeId")
        img = v.get("thumbnail") or (f"https://i.ytimg.com/vi/{vid}/mqdefault.jpg" if vid else "")
        pic = f'<img src="{esc(img)}" alt="" loading="lazy" width="320" height="180">' if img else '<span class="ph">no video yet</span>'
        return f'<div class="thumb">{pic}<span class="play">{play}</span></div>'

    def watch_url(v):
        return v.get("url") or f'https://www.youtube.com/watch?v={v.get("youtubeId")}'

    fill('<div class="video-grid" id="video-grid">', "".join(
        f'<a class="card" href="{esc(watch_url(v))}" target="_blank" rel="noopener">{thumb(v)}<div class="card-body"><h3>{esc(v.get("title"))}</h3>'
        f'<div class="meta"><span>{fmt_date(v.get("date"))}</span>'
        + "".join(f'<span class="tag">{esc(nice(t))}</span>' for t in v.get("tags") or [])
        + "</div></div></a>" for v in long_videos[:12]))

    # Featured video
    setting = str(S.get("featured") or "latest").strip()
    feat = (next((v for v in videos if v.get("youtubeId") == setting), None) if setting != "latest" else None) \
        or next((v for v in videos if v.get("featured")), None) or (long_videos[0] if long_videos else None)
    if feat and '<section class="featured" id="featured" hidden></section>' in page:
        label = "★ featured" if setting != "latest" or feat.get("featured") else "★ latest upload"
        desc = f'<p>{esc(feat.get("description"))}</p>' if feat.get("description") else ""
        page = page.replace('<section class="featured" id="featured" hidden></section>',
            f'<section class="featured" id="featured"><a class="feat-thumb" href="{esc(watch_url(feat))}" target="_blank" rel="noopener">{thumb(feat)}</a>'
            f'<div><span class="label">{label}</span><h3>{esc(feat.get("title"))}</h3>{desc}'
            f'<a class="btn" href="{esc(watch_url(feat))}" target="_blank" rel="noopener">Watch on YouTube</a></div></section>', 1)

    fill('<p id="footer-text">', esc(S.get("footer")))
    fill('<span id="year">', str(datetime.date.today().year))
    fill('<span id="footer-name">', esc(name))

    page_path.write_text(page, encoding="utf-8")
    print(f"Pre-rendered: name, bio, {len(socials)} links, {len(setup)} setup cards, {min(12, len(long_videos))} videos"
          + (", featured video" if feat else ""))


if __name__ == "__main__":
    try:
        main(sys.argv[1] if len(sys.argv) > 1 else "_site")
    except Exception as err:  # never break the publish: the JavaScript version still works
        print(f"Pre-render skipped: {err}", file=sys.stderr)
