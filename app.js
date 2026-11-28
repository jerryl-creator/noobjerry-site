// Builds the page from content.js. You normally don't need to edit this file.
(function () {
  const S = window.SITE || {};
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const ICONS = {
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.5 2.5 4.5 5 4.5"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4l16 16M20 4L4 20"/></svg>',
    twitch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 3h16v11l-4 4h-4l-3 3v-3H4z"/><path d="M11 8v4M15 8v4"/></svg>',
    discord: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 6c2-1.5 4.5-2 7-2s5 .5 7 2c1.5 3 2 6 2 10-1.5 1.5-3.5 2.5-5 3l-1-2.5c-1 .3-2 .5-3 .5s-2-.2-3-.5L8 19c-1.5-.5-3.5-1.5-5-3 0-4 .5-7 2-10z"/><circle cx="9" cy="12" r="1.3" fill="currentColor"/><circle cx="15" cy="12" r="1.3" fill="currentColor"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'
  };
  const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>';
  const icon = (p) => ICONS[p] || ICONS.link;
  const nice = (t) => String(t).replace(/\b\w/g, (c) => c.toUpperCase()); // "sim racing" -> "Sim Racing"

  // ---- header / hero ----
  document.title = S.name || "My Channel";
  $("logo").textContent = S.name || "";
  $("name").textContent = S.name || "";
  $("tagline").textContent = S.tagline || "";
  $("bio").textContent = S.bio || "";
  $("footer-text").textContent = S.footer || "";
  if (!S.footer) $("footer-text").hidden = true;
  $("footer-name").textContent = S.name || "";
  $("year").textContent = new Date().getFullYear();

  const avatar = $("avatar");
  if (S.avatar) avatar.innerHTML = `<img src="${esc(S.avatar)}" alt="" referrerpolicy="no-referrer">`;
  else avatar.textContent = (S.name || "?").replace(/[^a-z0-9]/gi, "").charAt(0).toUpperCase();

  const socials = S.socials || [];
  $("social-row").innerHTML = socials.map((s) =>
    `<a class="social-btn" data-platform="${esc(s.platform)}" href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}" title="${esc(s.label)}">${icon(s.platform)}</a>`
  ).join("");
  $("link-list").innerHTML = socials.map((s) =>
    `<a class="link-item" data-platform="${esc(s.platform)}" href="${esc(s.url)}" target="_blank" rel="noopener">${icon(s.platform)}
       <div><strong>${esc(s.label)}</strong><span>${esc(s.handle)}</span></div><span class="arrow">↗</span></a>`
  ).join("");

  // ---- videos ----
  // Hand-picked videos (content.js) + automatic uploads (videos.js); hand-picked wins.
  const hidden = new Set(S.hideVideos || []);
  const manual = S.videos || [];
  const manualIds = new Set(manual.map((v) => v.youtubeId).filter(Boolean));
  const auto = S.autoVideos === false ? [] : (window.AUTO_VIDEOS || []).filter((v) => !manualIds.has(v.youtubeId));
  const videos = manual.concat(auto).filter((v) => !hidden.has(v.youtubeId)).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const fmtDate = (d) => {
    const t = new Date(d + "T00:00:00");
    return isNaN(t) ? esc(d) : t.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };
  const thumb = (v) => {
    if (v.short && v.youtubeId && !v.thumbnail) {
      // Shorts get YouTube's vertical thumbnail (falls back to the normal one if missing).
      const id = encodeURIComponent(v.youtubeId);
      return `<div class="thumb thumb-short"><img src="https://i.ytimg.com/vi/${id}/oar2.jpg" alt="" loading="lazy"
        onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg'"><span class="play">${PLAY}</span></div>`;
    }
    const img = v.thumbnail || (v.youtubeId ? `https://i.ytimg.com/vi/${encodeURIComponent(v.youtubeId)}/mqdefault.jpg` : "");
    return `<div class="thumb">${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : `<span class="ph">no video yet</span>`}
      <span class="play">${PLAY}</span></div>`;
  };
  // Shorts titles often end in "| sandwichjerry on #Twitch"; hide that tail on the cards.
  const cleanTitle = (v) => v.short ? String(v.title).replace(/\s*\|\s*[^|]*\bon #?Twitch\s*$/i, "") : v.title;

  // Featured: a pinned YouTube ID from content.js, or (default) the newest normal upload.
  const featSetting = String(S.featured || "latest").trim();
  const pinned = featSetting !== "latest" ? videos.find((v) => v.youtubeId === featSetting) : null;
  const feat = pinned || videos.find((v) => v.featured) || videos.find((v) => !v.short);
  if (feat) {
    const f = $("featured");
    f.hidden = false;
    f.innerHTML = `<div role="button" tabindex="0" data-i="${videos.indexOf(feat)}" class="feat-thumb">${thumb(feat)}</div>
      <div><span class="label">${feat === pinned || feat.featured ? "★ featured" : "★ latest upload"}</span><h3>${esc(feat.title)}</h3>${feat.description ? `<p>${esc(feat.description)}</p>` : `<p>${fmtDate(feat.date)}${(feat.tags || []).length ? " · " + (feat.tags || []).map(nice).map(esc).join(" · ") : ""}</p>`}
      <button class="btn" data-i="${videos.indexOf(feat)}">${PLAY.replace('<svg', '<svg width="14" height="14"')} Watch now</button></div>`;
  }

  // Filters: "All" = normal videos, one chip per tag, and "Shorts" for vertical clips.
  const longVideos = videos.filter((v) => !v.short);
  const hasShorts = videos.some((v) => v.short);
  const tags = [...new Set(longVideos.flatMap((v) => v.tags || []))];
  let active = "all";
  let query = "";
  const filters = $("filters");
  const search = $("video-search");
  const renderFilters = () => {
    filters.innerHTML = ["all", ...tags, ...(hasShorts ? ["shorts"] : [])].map((t) =>
      `<button class="chip ${t === active ? "active" : ""} ${t === "shorts" ? "chip-shorts" : ""}" data-tag="${esc(t)}" aria-pressed="${t === active}">${esc(nice(t))}</button>`).join("");
  };
  const matches = (v, words) => {
    const hay = [v.title, v.description, ...(v.tags || []), v.short ? "short shorts" : ""].join(" ").toLowerCase();
    return words.every((w) => hay.includes(w));
  };
  // Show 12 videos at a time (Shorts: 16); "Load more" adds the next batch.
  // A search always shows every match.
  const PAGE = 12, PAGE_SHORTS = 16;
  const pageSize = () => (active === "shorts" ? PAGE_SHORTS : PAGE);
  let shown = PAGE;
  let currentList = [];
  const cardHTML = ([v, i]) =>
    `<button class="card${v.short ? " card-short" : ""}" data-i="${i}">${thumb(v)}<div class="card-body"><h3>${esc(cleanTitle(v))}</h3>
      <div class="meta"><span>${fmtDate(v.date)}</span>${v.short ? `<span class="tag">Short</span>` : (v.tags || []).map((t) => `<span class="tag">${esc(nice(t))}</span>`).join("")}</div></div></button>`;
  const moreBtn = $("load-more");
  const paintMore = (words) => {
    const left = words.length ? 0 : currentList.length - shown;
    moreBtn.hidden = left <= 0;
    if (left > 0) moreBtn.innerHTML = `Load more <span>(${left} left)</span>`;
  };
  const renderGrid = () => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    currentList = videos.map((v, i) => [v, i]).filter(([v]) => {
      if (active === "shorts") return v.short && matches(v, words);
      if (active !== "all") return !v.short && (v.tags || []).includes(active) && matches(v, words);
      // "All": normal videos only, but a search looks through Shorts too.
      return (words.length || !v.short) && matches(v, words);
    });
    const visible = words.length ? currentList : currentList.slice(0, shown);
    const grid = $("video-grid");
    grid.classList.toggle("shorts-mode", active === "shorts");
    grid.innerHTML = visible.length ? visible.map(cardHTML).join("")
      : `<p class="empty">${words.length ? `No videos match “${esc(query.trim())}”.` : "No videos with this tag yet."}</p>`;
    $("video-count").textContent = words.length ? `${currentList.length} result${currentList.length === 1 ? "" : "s"}` : "";
    paintMore(words);
  };
  moreBtn.addEventListener("click", () => {
    const from = shown;
    shown += pageSize();
    const grid = $("video-grid");
    grid.insertAdjacentHTML("beforeend", currentList.slice(from, shown).map(cardHTML).join(""));
    const firstNew = grid.querySelectorAll(".card")[from];
    if (typeof reveal === "function") reveal(grid); // new cards slide in
    if (firstNew) firstNew.focus({ preventScroll: true });
    paintMore([]);
  });
  filters.addEventListener("click", (e) => {
    const b = e.target.closest("[data-tag]");
    if (!b) return;
    active = b.dataset.tag;
    shown = pageSize();
    renderFilters(); renderGrid();
  });
  search.addEventListener("input", () => { query = search.value; shown = pageSize(); renderGrid(); });
  // Press "/" anywhere to jump to the search box (like YouTube); Esc clears it.
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName) && !$("player").open) {
      e.preventDefault();
      if (typeof selectTab === "function") selectTab("youtube");
      search.focus();
    }
  });
  search.addEventListener("keydown", (e) => { if (e.key === "Escape") { search.value = ""; query = ""; renderGrid(); search.blur(); } });
  renderFilters(); renderGrid();

  // ---- tabs: YouTube / Instagram, with a sliding pill ----
  const tabsEl = $("tabs"), pill = $("tab-pill");
  const GH = window.GITHUB_DATA || null;
  const hasGitHub = !!(GH && (GH.projects || []).length);
  const TABS = ["youtube", "instagram", ...(hasGitHub ? ["github"] : [])];
  if (!hasGitHub) $("tab-github").remove();
  // Anime-style label: big title letters (each its own span so they can bounce) + small katakana under it.
  const animeLabel = (en, jp) =>
    `<span class="al"><span class="al-en">${[...en].map((c, i) => `<span class="ch" style="--i:${i}">${esc(c)}</span>`).join("")}</span><span class="al-jp">${esc(jp)}</span></span>`;
  const replay = (el, cls) => {
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    clearTimeout(el["_t" + cls]); el["_t" + cls] = setTimeout(() => el.classList.remove(cls), 1000);
  };
  $("tab-youtube").innerHTML = ICONS.youtube + animeLabel("YouTube", "ユーチューブ");
  $("tab-instagram").innerHTML = ICONS.instagram + animeLabel("Instagram", "インスタグラム");
  if (hasGitHub) $("tab-github").innerHTML = ICONS.github + animeLabel("GitHub", "ギットハブ");
  let currentTab = "youtube";
  const movePill = () => {
    const btn = $("tab-" + currentTab);
    pill.style.width = btn.offsetWidth + "px";
    pill.style.transform = `translateX(${btn.offsetLeft - 4}px)`;
  };
  // Pop the tab's items in one after another (the first ~12; the rest appear together).
  const popPanel = (panel) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    panel.querySelectorAll(".chip, .card, .ig-head, .ig-tile, .gh-project, .gh-entry").forEach((el, i) => {
      el.classList.remove("reveal", "in"); el.style.transitionDelay = ""; el.dataset.shown = "1";
      el.style.setProperty("--k", Math.min(i, 12));
    });
    panel.classList.remove("popping"); void panel.offsetWidth; panel.classList.add("popping");
    clearTimeout(panel._pop); panel._pop = setTimeout(() => panel.classList.remove("popping"), 1600);
  };
  const selectTab = (name, focus) => {
    if (!TABS.includes(name) || name === currentTab) return;
    currentTab = name;
    TABS.forEach((t) => {
      const on = t === name, btn = $("tab-" + t), panel = $("panel-" + t);
      btn.setAttribute("aria-selected", on);
      btn.tabIndex = on ? 0 : -1;
      panel.hidden = !on;
      if (on) popPanel(panel);
    });
    if (focus) $("tab-" + name).focus();
    replay($("tab-" + name), "pop");
    replay(pill, "shine");
    movePill();
  };
  tabsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-tab]");
    if (b) selectTab(b.dataset.tab);
  });
  tabsEl.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = TABS.indexOf(currentTab) + (e.key === "ArrowRight" ? 1 : -1);
    selectTab(TABS[(i + TABS.length) % TABS.length], true);
  });
  // Nav links (#youtube / #instagram) pick the tab and scroll to it.
  const fromHash = () => {
    const h = location.hash.slice(1);
    if (TABS.includes(h)) {
      selectTab(h);
      $("content").scrollIntoView({ behavior: "smooth" });
    }
  };
  window.addEventListener("hashchange", fromHash);
  window.addEventListener("resize", movePill);
  if (document.fonts) document.fonts.ready.then(movePill);
  // The Japanese letters of the font load a bit later and make the tabs wider;
  // re-measure whenever a tab changes size so the pill always fits.
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => movePill());
    tabsEl.querySelectorAll(".tab").forEach((b) => ro.observe(b));
  }
  movePill();
  requestAnimationFrame(() => tabsEl.classList.add("ready")); // no slide on first paint
  fromHash();

  // ---- Instagram grid ----
  const IG = S.instagram || {};
  const posts = (IG.posts || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const igUrl = (p) => `https://www.instagram.com/${p.type === "reel" ? "reel" : "p"}/${encodeURIComponent(p.code)}/`;
  $("ig-head").innerHTML = `${ICONS.instagram}<div><strong>${esc(IG.handle || "")}</strong>
      <span>Latest photos and reels</span></div>
      ${IG.url ? `<a class="btn" href="${esc(IG.url)}" target="_blank" rel="noopener">Follow ↗</a>` : ""}`;
  const REEL = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5l11 7-11 7z"/></svg>';
  $("ig-grid").innerHTML = posts.length ? posts.map((p, i) =>
    `<button class="ig-tile" data-ig="${i}" aria-label="${esc((p.type === "reel" ? "Reel" : "Photo") + " from " + fmtDate(p.date))}">
       <img src="${esc(p.image)}" alt="" loading="lazy">
       ${p.type === "reel" ? `<span class="ig-badge">${REEL}</span>` : ""}
       <span class="ig-date">${fmtDate(p.date)}</span>
     </button>`).join("") : `<p class="empty">No Instagram posts added yet.</p>`;

  // ---- GitHub tab: projects + changelog (from github.js, refreshed on every site update) ----
  if (hasGitHub) {
    const REPO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v16H7.5A2.5 2.5 0 0 0 5 20.5z"/><path d="M5 20.5A2.5 2.5 0 0 0 7.5 23H19v-5"/></svg>';
    const STAR = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>';
    const thisSite = location.pathname.split("/").filter(Boolean)[0] || "";
    $("gh-head").innerHTML = `${ICONS.github}<div><strong>@${esc(GH.user)}</strong>
        <span>Projects I build and what changed lately</span></div>
        <a class="btn" href="${esc(GH.url)}" target="_blank" rel="noopener" data-gh="profile">Follow ↗</a>`;
    $("gh-projects").innerHTML = GH.projects.map((p) => `
      <article class="gh-project">
        <div class="gh-project-top">${REPO}<a href="${esc(p.url)}" target="_blank" rel="noopener" data-gh="${esc(p.name)}"><strong>${esc(p.name)}</strong></a>
          ${p.name === thisSite ? `<span class="gh-badge">this website</span>` : ""}
          ${p.release ? `<span class="gh-badge gh-badge-solid">${esc(p.release.tag)}</span>` : ""}</div>
        ${p.description ? `<p>${esc(p.description)}</p>` : ""}
        ${(p.topics || []).length ? `<div class="gh-topics">${p.topics.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
        <div class="gh-project-foot">
          <span class="meta">${p.language ? `<span class="gh-lang"></span>${esc(p.language)}` : ""}${p.stars ? `<span>${STAR}${p.stars}</span>` : ""}<span>Updated ${fmtDate(p.updated)}</span></span>
          <span class="gh-actions">
            ${p.release ? `<a class="btn btn-small btn-solid" href="${esc(p.release.url)}" target="_blank" rel="noopener" data-gh="${esc(p.name)}-download">Download ↓</a>` : ""}
            <a class="btn btn-small" href="${esc(p.url)}" target="_blank" rel="noopener" data-gh="${esc(p.name)}">Code ↗</a>
          </span>
        </div>
      </article>`).join("");

    const LOG_PAGE = 10;
    const log = GH.changelog || [];
    let logShown = LOG_PAGE;
    const multiRepo = new Set(log.map((e) => e.repo)).size > 1;
    const entryHTML = (e) => `
      <li class="gh-entry gh-${e.kind}">
        <span class="gh-dot" aria-hidden="true"></span>
        <div class="gh-entry-body">
          <div class="gh-entry-top">${e.kind === "release" ? `<span class="gh-badge gh-badge-solid">★ ${esc(e.tag)}</span>` : ""}${multiRepo ? `<span class="gh-badge">${esc(e.repo)}</span>` : ""}<time datetime="${esc(e.date)}">${fmtDate(e.date.slice(0, 10))}</time></div>
          <a href="${esc(e.url)}" target="_blank" rel="noopener" data-gh="${esc(e.repo)}-${e.kind}">${esc(e.title)}</a>
          ${e.kind === "release" && e.text ? `<p>${esc(e.text)}</p>` : ""}
          ${e.kind === "commit" ? `<code>${esc(e.sha)}</code>` : ""}
        </div>
      </li>`;
    const logMore = $("gh-more");
    const paintLog = () => {
      const left = log.length - logShown;
      logMore.hidden = left <= 0;
      if (left > 0) logMore.innerHTML = `Show more <span>(${left} left)</span>`;
    };
    $("gh-log").innerHTML = log.slice(0, logShown).map(entryHTML).join("");
    $("gh-all").href = GH.url;
    paintLog();
    logMore.addEventListener("click", () => {
      const from = logShown;
      logShown += LOG_PAGE;
      $("gh-log").insertAdjacentHTML("beforeend", log.slice(from, logShown).map(entryHTML).join(""));
      if (typeof reveal === "function") reveal($("gh-log"));
      paintLog();
    });
  }

  // ---- My setup ----
  const setup = S.setup || [];
  if (setup.length) {
    $("setup").hidden = false;
    $("setup-grid").innerHTML = setup.map((g) =>
      `<div class="setup-card"><h3>${esc(g.name)}<span class="jp">${esc(g.jp || "")}</span></h3>
        <dl>${(g.items || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>`
    ).join("");
  }

  // ---- Twitch LIVE badge ----
  // Asks decapi.me (a free public Twitch helper) whether the channel is streaming.
  const twitchUser = String(S.twitchLive || "").trim();
  if (/^[a-z0-9_]{3,25}$/i.test(twitchUser)) {
    const badge = $("live-badge");
    badge.href = `https://www.twitch.tv/${twitchUser}`;
    let wasLive = false;
    const shortUptime = (t) => t.split(",").slice(0, 2).join(",").trim(); // "2 hours, 3 minutes"
    const setLive = (live, game, uptime) => {
      badge.hidden = !live;
      $("live-meta").textContent = live && game ? " · " + game : "";
      $("live-time").textContent = live && uptime ? " · " + shortUptime(uptime) : "";
      badge.title = live ? `Watch ${twitchUser} live on Twitch` : "";
      document.querySelectorAll('[data-platform="twitch"]').forEach((el) => {
        el.classList.toggle("is-live", live);
        if (el.classList.contains("link-item")) {
          const h = el.querySelector("div span");
          if (h) h.textContent = live ? "● LIVE now" : twitchUser;
        }
      });
      if (live && !wasLive) replay(badge, "pop");
      wasLive = live;
    };
    const ask = async (what) => (await (await fetch(`https://decapi.me/twitch/${what}/${twitchUser}`, { cache: "no-store" })).text()).trim();
    const checkLive = async () => {
      try {
        const uptime = await ask("uptime");
        const live = /\b\d+\s+(second|minute|hour|day)s?\b/i.test(uptime) && !/offline/i.test(uptime);
        let game = "";
        if (live) {
          try { game = await ask("game"); } catch (e) {}
          if (game.length > 60 || /error|not found|no game/i.test(game)) game = "";
        }
        setLive(live, game, live ? uptime : "");
      } catch (e) { /* service unreachable: keep current state */ }
    };
    checkLive();
    setInterval(() => { if (!document.hidden) checkLive(); }, 120000); // every 2 minutes
    document.addEventListener("visibilitychange", () => { if (!document.hidden) checkLive(); });
  }

  // ---- visitor stats (GoatCounter, only if a code is set in content.js) ----
  const gcCode = String(S.goatcounter || "").trim().toLowerCase();
  const track = (path, title) => {
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path, title, event: true }); } catch (e) {}
  };
  if (/^[a-z0-9-]+$/.test(gcCode)) {
    const gc = document.createElement("script");
    gc.async = true;
    gc.src = "https://gc.zgo.at/count.js";
    gc.dataset.goatcounter = `https://${gcCode}.goatcounter.com/count`;
    document.body.appendChild(gc);
    // Count which things people click: videos, Instagram posts, social links, tabs.
    document.addEventListener("click", (e) => {
      const v = e.target.closest("[data-i]");
      if (v && !v.closest("dialog")) { const x = videos[+v.dataset.i]; if (x) track(`video/${x.youtubeId || x.url}`, x.title); }
      const gh = e.target.closest("[data-gh]");
      if (gh) track(`github/${gh.dataset.gh}`, "GitHub: " + gh.dataset.gh);
      const g = e.target.closest("[data-ig]");
      if (g) { const p = posts[+g.dataset.ig]; if (p) track(`instagram/${p.code}`, "Instagram " + p.type); }
      const l = e.target.closest(".social-btn, .link-item");
      if (l) track(`link/${l.hostname}`, "Link: " + (l.getAttribute("aria-label") || l.querySelector("strong")?.textContent || l.hostname));
      const t = e.target.closest("[data-tab]");
      if (t) track(`tab/${t.dataset.tab}`, "Tab: " + t.dataset.tab);
    }, true);
  }

  // ---- scroll-in reveal ----
  const root0 = document.documentElement;
  const io = "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches
    ? new IntersectionObserver((entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add("in"); io.unobserve(el);
        // once it has arrived, hand control back to the normal hover effects
        setTimeout(() => { el.classList.remove("reveal", "in"); el.style.transitionDelay = ""; el.dataset.shown = "1"; }, 900);
      }), { rootMargin: "0px 0px -40px 0px" })
    : null;
  const reveal = (scope) => {
    if (!io) return;
    scope.querySelectorAll(".card, .ig-tile, .link-item, .featured, .setup-card, .gh-project, .gh-entry").forEach((el, i) => {
      if (el.classList.contains("reveal") || el.dataset.shown) return;
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      io.observe(el);
    });
  };
  // Wait for the page intro to finish before cards start revealing on scroll.
  const hasIntro = root0.classList.contains("intro");
  setTimeout(() => reveal(document), hasIntro ? 1500 : 0);
  if (hasIntro) setTimeout(() => root0.classList.remove("intro"), 2600);
  filters.addEventListener("click", () => reveal($("video-grid")));
  // Tiles in a hidden tab can't be seen yet; reveal them when the tab opens.

  // ---- theme switch (dark monochrome / light) ----
  const root = document.documentElement;
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  const toggle = $("theme-toggle");
  const current = () => root.dataset.theme || "dark";
  const paintToggle = () => {
    const light = current() === "light";
    toggle.innerHTML = light ? MOON + animeLabel("Dark", "ダーク") : SUN + animeLabel("Light", "ライト");
    toggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  };
  const applyTheme = (next) => {
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    paintToggle();
    replay(toggle, "spin"); replay(toggle, "pop");
  };
  toggle.addEventListener("click", () => {
    const next = current() === "light" ? "dark" : "light";
    toggle.classList.remove("spin", "pop");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || calm) {
      // Older browsers: colors fade smoothly via CSS instead.
      root.classList.add("theme-fade");
      applyTheme(next);
      setTimeout(() => root.classList.remove("theme-fade"), 600);
      return;
    }
    // Circle that grows out of the button and reveals the new theme.
    const r = toggle.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(() => applyTheme(next)).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(.65, 0, .35, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  });
  paintToggle();

  // ---- player ----
  const dlg = $("player");
  const open = (v) => {
    if (v.url && !v.youtubeId) { window.open(v.url, "_blank", "noopener"); return; }
    dlg.classList.remove("ig-mode");
    $("player-link").hidden = true;
    $("player-title").textContent = v.title;
    $("player-frame").innerHTML = v.youtubeId
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtubeId)}?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="${esc(v.title)}"></iframe>`
      : `<p class="ph-msg">No video linked yet.<br>Add a <code>youtubeId</code> for this video in <code>content.js</code>.</p>`;
    dlg.showModal();
  };
  const openIg = (p) => {
    dlg.classList.add("ig-mode");
    $("player-title").textContent = p.caption || (p.type === "reel" ? "Reel" : "Photo") + " · " + fmtDate(p.date);
    const link = $("player-link");
    link.href = igUrl(p); link.textContent = "Open on Instagram ↗"; link.hidden = false;
    $("player-frame").innerHTML = `<iframe src="${igUrl(p)}embed/" title="Instagram post" allowfullscreen scrolling="no"></iframe>`;
    dlg.showModal();
  };
  const close = () => { dlg.close(); };
  dlg.addEventListener("close", () => { $("player-frame").innerHTML = ""; });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
  $("player-close").addEventListener("click", close);

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-i]");
    if (el && !el.closest("dialog")) open(videos[+el.dataset.i]);
    const ig = e.target.closest("[data-ig]");
    if (ig) openIg(posts[+ig.dataset.ig]);
  });
  document.addEventListener("keydown", (e) => {
    const el = e.target.closest && e.target.closest('[role="button"][data-i]');
    if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(videos[+el.dataset.i]); }
  });
})();
