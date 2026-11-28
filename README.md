# NoobJerry website

## Files
| File | What it is | Edit it? |
|---|---|---|
| `content.js` | Your name, bio, links, featured video, hand-picked videos | **Yes, this is the one** |
| `videos.js` | Your latest uploads, filled in automatically | No (it's rewritten by the robot) |
| `index.html` | Page layout | Rarely |
| `style.css` | Colors and look (both themes are at the top) | If you want new colors |
| `app.js` | Builds the page | No |
| `scripts/update_videos.py` | Fetches your new uploads from YouTube | Only to change tag rules |
| `.github/workflows/update-site.yml` | Runs the above every 3 hours and publishes the site | No |

## New uploads appear on their own
Once the site is on GitHub (steps below), GitHub checks your channel every 3 hours.
A new upload shows up on the site **within about 3 hours**, with its real title and date.

Tags are picked from the title:
- "Wuthering" → **Wuthering Waves**
- iRacing, AMS2, Assetto, ACC, Forza, GT3, hotlap, Le Mans… → **Sim Racing**
- anything else → **Gaming**

Change these rules at the top of `scripts/update_videos.py`.

In `content.js` you can still:
- **Feature a video**, or change its title or tags: add it to `videos` with `featured: true`. What you write there wins over the automatic version.
- **Hide an upload**: put its ID in `hideVideos`, e.g. `hideVideos: ["dyNGeu6O0O0"]`.
- **Show older videos** that are no longer in YouTube's latest-15 list: add them to `videos`.
- **Turn it off**: set `autoVideos: false`.

Want it right now instead of waiting? GitHub → **Actions** tab → *Update videos and publish site* → **Run workflow**.

## Instagram tab
Instagram doesn't let websites read your posts automatically, so this part is by hand:
1. Open the post on Instagram. The link is `instagram.com/p/CODE/` (photo) or `instagram.com/reel/CODE/` (video).
2. Save its picture into `images/instagram/` as `CODE.jpg` (portrait 3:4 looks best).
3. In `content.js` → `instagram.posts`, copy a line to the top and change `code`, `type` (`"post"` or `"reel"`) and `date`.

Clicking a tile opens the real post in a popup (reels play there), with a link to Instagram.

## One-time setup on GitHub (free, about 10 minutes)
1. Sign in at github.com (or create a free account).
2. Click **+** (top right) → **New repository**. Name it e.g. `noobjerry-site`, set it **Public**, then **Create repository**.
3. On the new repo page, click **uploading an existing file**, and drag in **everything in this folder**,
   including the `.github` and `scripts` folders. Click **Commit changes**.
   - Hidden folders like `.github` may not show in your file manager: press **Ctrl+H** to show them.
   - If drag-and-drop skips `.github`, create it on GitHub instead: **Add file → Create new file**, type the name
     `.github/workflows/update-site.yml`, and paste in the contents of that file.
4. Go to **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**.
5. Go to the **Actions** tab. If asked, click **I understand my workflows, go ahead and enable them**.
   Open *Update videos and publish site* → **Run workflow**.
6. When it turns green (1–2 minutes), your site is live at
   `https://<your-github-username>.github.io/noobjerry-site/`.
   The link is also shown in **Settings → Pages**.

After that, any file you change on GitHub is published automatically within a couple of minutes.

**Note:** GitHub pauses scheduled tasks if a repo has no activity for 60 days. New uploads count as activity,
so this only matters if you don't upload for 2 months. If it happens, GitHub emails you and the Actions tab has
an **Enable workflow** button.

## View it on your computer
Double-click `index.html`. It opens in your browser, no install needed.
To pull new uploads into your local copy, run `python3 scripts/update_videos.py`.

## Change colors
At the top of `style.css`: the first block is the dark theme, the `[data-theme="light"]` block is the light theme.

## Under the hood (for later)
- **Fonts** live in `fonts/` (trimmed to the characters the site uses; free OFL license). No Google Fonts request.
- **Security policy:** `index.html` has a `Content-Security-Policy` line listing every outside service the page
  may use (YouTube thumbnails and player, Instagram embeds, GoatCounter, decapi.me for the Twitch LIVE badge).
  If you add a new outside service and it doesn't load, it needs adding there.
- **Pre-render:** on every publish, `scripts/prerender.py` writes your name, bio, links, setup and latest videos
  straight into the HTML, so search engines and visitors without JavaScript see them too.
- **Theme:** first-time visitors get light or dark to match their device; the Light/Dark button overrides it.

