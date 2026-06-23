# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repo contains three independent sub-projects that share a single GitHub repository:

1. **Mountain Home Finder** — a real estate discovery app (`docs/index.html` + `scraper/scrape.py`)
2. **Miami Hurricanes Dashboard** — a sports data aggregator (`docs/hurricanes.html` + `scraper/scrape_hurricanes.py`)
3. **Realmshard Chronicles** — a browser-based RPG (`realmshard/`)

There is no build system. No npm, no bundler, no compilation step. All frontend code is plain HTML/CSS/JS served directly from the repo.

---

## Commands

### Python Scrapers

```bash
# Install dependencies (Python 3.11)
pip install -r scraper/requirements.txt

# Run the home listings scraper → writes docs/listings.json
python scraper/scrape.py

# Run the Hurricanes data scraper → writes docs/hurricanes_data.json
python scraper/scrape_hurricanes.py
```

### Serving frontend locally

```bash
# Any static file server works; e.g.:
python -m http.server 8000
# then open http://localhost:8000/docs/ or http://localhost:8000/realmshard/
```

---

## GitHub Actions Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `scrape.yml` | Nightly 6 AM ET (10:00 UTC) + manual | Runs `scrape.py`, commits updated `docs/listings.json` |
| `scrape_hurricanes.yml` | Nightly 7 AM ET (11:00 UTC) + manual | Runs `scrape_hurricanes.py`, commits updated `docs/hurricanes_data.json` |
| `deploy-pages.yml` | Push to `master` + manual | Deploys `realmshard/` folder to GitHub Pages via Actions artifact |

**Important**: `deploy-pages.yml` uses the GitHub Actions Pages deployment method (not branch/folder), and it uploads only the `realmshard/` folder. The `docs/` folder content (`index.html`, `hurricanes.html`) is served from the `master` branch `/docs` folder setting — these two Pages mechanisms must be configured separately in repository settings. If the Actions deployment is active, it takes precedence at the root.

---

## Mountain Home Finder Architecture

**Frontend** (`docs/index.html`): Single self-contained file. No external JS framework — pure DOM manipulation. Uses:
- Leaflet.js (via CDN) for the map; CARTO/OSM tiles (no API key)
- CSS custom properties for light/dark theming — all theme values defined under `[data-theme="light"]` and `[data-theme="dark"]` selectors at the top of the `<style>` block
- `localStorage` for saved listings, last-visit timestamp (new listing detection), and theme preference
- Embedded fallback sample listings in JS so the page works offline before the first scrape

**Data flow**: `scrape.py` → `docs/listings.json` → fetched by the "Refresh" button in the browser.

**Listing JSON schema** (every listing has these fields):
```
id, source, price, price_display, previous_price, price_changed_at,
beds, baths, sqft, address, city, state, zip, url, area, area_type,
drive_time, lat, lon, year_built, lot_size, days_on_market, taxes,
is_aframe, outdoor_score, features[], description, photo,
first_seen, scraped_at
```

**Scraper sources** (`scrape.py`):
- **Redfin** — unofficial GIS JSON API (`/stingray/api/gis`), 9 bounding-box polygons
- **LandWatch** — HTML scrape, one pass per unique state, filtered for outdoor keywords
- **Craigslist** — RSS feeds (`/search/reo?format=rss`), 5 regional subdomains

**`_apply_history()`** is the key function for state persistence across scrape runs: it copies `first_seen` from the previous run (never overwrites) and sets `previous_price` / `price_changed_at` when a price change is detected.

**Sort order**: A-frames first (`is_aframe` desc) → `outdoor_score` desc → `price` asc.

**`area_type` values**: `mountain`, `mountain_river`, `mountain_lake`, `mountain_lake_river` — these drive color-coding in the UI and map markers.

---

## Miami Hurricanes Dashboard Architecture

**Scraper** (`scraper/scrape_hurricanes.py`): Aggregates data from:
- ESPN public API (`site.api.espn.com/apis/site/v2/sports/football/college-football`) — team info, news, schedule, stats, leaders, roster. Team ID: `2390`.
- Reddit public JSON endpoints — `r/MiamiHurricanes` hot posts + `r/CFB` search
- RSS feeds — 247Sports, Google News, CanesInSight, CaneSport, Hurricanes Wire

News is deduplicated by normalized title, then sorted: items with images first, then by source priority (ESPN → Hurricanes Wire → CanesInSight → …).

Output written to `docs/hurricanes_data.json` with top-level keys: `last_updated`, `team`, `news`, `schedule`, `stats`, `leaders`, `roster`, `social`, `recruiting`.

---

## Realmshard Chronicles Architecture

**Structure**: `realmshard/index.html` embeds all CSS inline; JS is split across four files loaded in this order (order matters — later files depend on earlier ones):

1. `js/data.js` — all static constants: `ITEMS`, `CLASSES`, `LEVELS` (no logic)
2. `js/game.js` — global state object `G`, save/load (`localStorage` key `realmshard_save`), player initialization, combat engine
3. `js/ui.js` — all DOM rendering and screen transitions; reads `G` and `CLASSES`/`ITEMS`/`LEVELS`
4. `js/main.js` — entry point (`DOMContentLoaded`), event bindings only

**Global state** (`G` in `game.js`): `player`, `currentLevelId`, `combat`, `screen`, `pendingLevelUp`, `_selectedClass`, `_activeChapter`. All game logic reads/writes `G` directly.

**Save format** (`realmshard_save` in localStorage): `{ player: {...}, currentLevelId: string, v: 1 }`

**Screen routing** (`ui.js`): `showScreen(id)` toggles `.active` on `.screen` elements by `id="screen-{id}"`. Valid screens: `title`, `create`, `map`, `level`, `combat`, `shop`, `inventory`.
