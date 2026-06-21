# Mountain Home Finder

> A free, zero-maintenance real estate app that scrapes live listings and surfaces homes under **$200,000** within **3 hours of White Plains, NY** in outdoor, mountain, lake, and river areas — with A-frames and cabins ranked first.

**Live site:** `https://forzacode.github.io/practice-v1/`

---

## Features

### Search & Discovery
- **One-click Refresh** — fetches the latest listings without reloading the page
- **A-frame / cabin priority** — these are always sorted to the top with a gold ribbon badge
- **Filter chips** — All Homes · A-Frames · Mountain · Lake · River · Price Drop · Saved
- **Sort options** — Recommended · Price (low/high) · Newest listed · Most sq ft
- **Per-listing detail** — price, beds, baths, sq ft, lot size, year built, yearly taxes, days on market, area type, and drive time from White Plains

### Map View
- Toggle between **List** and **Map** with one click
- Interactive **Leaflet.js** map with **OpenStreetMap / CARTO** tiles (no API key, completely free)
- Price-label map markers colour-coded by type: gold for A-frames, blue for lake, sage for mountain/river
- Click any marker for a popup with full stats, a View Listing link, and a Google Maps directions link
- Map tiles switch between light and dark styles automatically with the theme toggle

### Saved Listings
- **Heart button** on every card saves a property to your browser's `localStorage`
- Saved count shown live in the filter chip (e.g. *♥ Saved (3)*)
- Favourited markers are highlighted on the map
- Persists across page reloads and browser restarts — no account needed

### Price Drop Tracking
- The nightly scraper compares each listing's current price against the previous run
- Cards and map popups display a **"↓ Was $X"** badge when a price has dropped
- Dedicated **Price Drop** filter chip to view only reduced listings
- `previous_price` and `price_changed_at` fields stored per listing in the JSON

### New Listing Detection
- Each listing gets a `first_seen` timestamp the first time it appears (never overwritten by re-scrapes)
- On page load, any listing first seen since your last visit gets a green **NEW** badge
- New listings also show a green dot on their map marker
- Tracked entirely in `localStorage` — no backend required

### Directions
- Every card and every map popup includes a **🚗 Directions from White Plains** link
- Opens Google Maps with the drive pre-plotted — no API key required

### Artistic UI (Monet / Picasso theme)
- **Light mode** — inspired by Monet's Water Lilies and Giverny gardens: soft iris, lavender, sky-blue, and sage pastel radial gradients layered to create a painterly watercolour background; frosted-glass glassmorphism header with a rainbow brushstroke accent line
- **Dark mode** — inspired by Picasso's Blue Period and Cubism: deep midnight indigo and cobalt backgrounds, same pastels at higher saturation on dark surfaces
- **Light / Dark toggle** — ☀ / ☾ button in the header; preference saved to `localStorage`
- **Playfair Display** serif font for headings and section labels; **Inter** for all UI copy
- Per-card coloured left accent border keyed to area type (ochre A-frame, water-blue lake, sage mountain/river)
- Smooth 0.3–0.4 s CSS transitions on all themed elements

---

## Data Sources (all free, no API key)

| Source | Method | Best for |
|---|---|---|
| **Redfin** | Unofficial GIS JSON API | Structured MLS listings with beds, baths, sq ft, lat/lon |
| **LandWatch** | HTML scrape | Rural cabins, retreats, A-frames, land+home packages |
| **Craigslist** | Public RSS feeds | Owner-listed cabins and camps that skip the MLS entirely |

### Craigslist feeds covered
Hudson Valley NY · Poconos PA · Vermont · Western MA (Berkshires) · Hartford/NW Connecticut

---

## Search Areas (within 3 hours of White Plains, NY)

| Area | State | Drive | Character |
|---|---|---|---|
| Sullivan County (Catskills) | NY | ~1.5 h | Mountain |
| Delaware County (Catskills) | NY | ~2 h | Mountain |
| Greene County (Catskills) | NY | ~1.5–2 h | Mountain |
| Ulster County (Hudson Valley) | NY | ~1.5–2 h | Mountain + River |
| Pike County (Poconos) | PA | ~1.5 h | Mountain + Lake |
| Wayne County (Poconos) | PA | ~2 h | Mountain + Lake |
| Berkshire County | MA | ~2.5 h | Mountain + River |
| Litchfield County (NW CT) | CT | ~1.5 h | Mountain + Lake + River |
| Windham County (Southern VT) | VT | ~3 h | Mountain |

---

## How It Works (zero-cost stack)

| Layer | Tool | Cost |
|---|---|---|
| Hosting | GitHub Pages (`docs/` folder) | Free |
| Scraping | Python — Redfin, LandWatch, Craigslist RSS | Free |
| Automation | GitHub Actions nightly cron (6 AM ET) + manual trigger | Free |
| Data storage | `docs/listings.json` committed to repo | Free |
| Maps | Leaflet.js + CARTO/OSM tiles | Free |
| Fonts | Google Fonts CDN | Free |

The **Refresh** button re-fetches `listings.json` from GitHub Pages. GitHub Actions runs the scraper every night, commits the updated JSON, and the next Refresh picks it up automatically.

The page also works **offline / as a local file** — sample listings are embedded as a JavaScript fallback so the UI is always visible even before the scraper has run.

---

## One-Time Setup

### 1. Enable GitHub Pages

1. Go to **Settings → Pages** in this repository
2. Source: **Deploy from a branch**
3. Branch: `master` · Folder: `/docs` → **Save**
4. Your site goes live at `https://forzacode.github.io/practice-v1/`

### 2. Run the First Scrape

**Actions → Refresh Home Listings → Run workflow**

After the first run completes (~2–3 min), click Refresh on the live site to see real listings. Every subsequent night at 6 AM ET the data refreshes automatically.

---

## Project Structure

```
docs/
  index.html        ← Frontend (GitHub Pages) — all UI, themes, map, favourites
  listings.json     ← Auto-updated nightly by GitHub Actions
scraper/
  scrape.py         ← Multi-source scraper (Redfin + LandWatch + Craigslist RSS)
  requirements.txt  ← requests, beautifulsoup4, lxml
.github/
  workflows/
    scrape.yml      ← Nightly cron (6 AM ET) + workflow_dispatch manual trigger
README.md
```

---

## Listing Criteria

- **Price:** $200,000 or under
- **Type:** Single-family house only (no condos, apartments, townhouses)
- **Bedrooms:** At least 1
- **Bathrooms:** At least 1
- **Location:** Rural or semi-rural outdoor character — mountain, lake, river, forest
- **Distance:** Within approximately 3 hours' drive of White Plains, NY
