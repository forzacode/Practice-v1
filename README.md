# Mountain Home Finder

A free, zero-maintenance app that finds homes **under $200,000** within **3 hours of White Plains, NY** in outdoor/mountain/lake/river areas — with A-frames and mountain cabins prioritized first.

**Live site:** `https://forzacode.github.io/practice-v1/`

---

## How it works

| Layer | Tool | Cost |
|---|---|---|
| Frontend | GitHub Pages (`docs/`) | Free |
| Data scraping | Python (Redfin + LandWatch) | Free |
| Automation | GitHub Actions (nightly cron) | Free |
| Data storage | `docs/listings.json` in repo | Free |

The **Refresh** button on the site re-fetches `listings.json`, which is automatically updated every night by a GitHub Actions workflow.

---

## One-time setup

### 1. Enable GitHub Pages

1. Go to **Settings → Pages** in this repository
2. Set **Source** to `Deploy from a branch`
3. Set **Branch** to `master` (or your main branch), folder `/docs`
4. Save — your site will be live at `https://forzacode.github.io/practice-v1/`

### 2. Run the first scrape

Go to **Actions → Refresh Home Listings → Run workflow** to populate live data immediately.

After that, it runs automatically every night at 6 AM ET.

---

## Search areas covered

| Area | State | Drive time | Features |
|---|---|---|---|
| Sullivan County (Catskills) | NY | ~1.5h | Mountain |
| Delaware County (Catskills) | NY | ~2h | Mountain |
| Greene County (Catskills) | NY | ~1.5-2h | Mountain |
| Ulster County (Hudson Valley) | NY | ~1.5-2h | Mountain + River |
| Pike County (Poconos) | PA | ~1.5h | Mountain + Lake |
| Wayne County (Poconos) | PA | ~2h | Mountain + Lake |
| Berkshire County | MA | ~2.5h | Mountain + River |
| Litchfield County (NW CT) | CT | ~1.5h | Mountain + Lake + River |
| Windham County (Southern VT) | VT | ~3h | Mountain |

---

## Filters and sorting

- **All Homes / A-Frames Only / Mountain / Lake / River** chips
- **Sort:** Recommended (A-frames first) · Price · Newest · Most sq ft
- A-frame and cabin properties are automatically promoted to the top with a gold badge

---

## Project structure

```
docs/
  index.html       <- Frontend (GitHub Pages)
  listings.json    <- Auto-updated by GitHub Actions
scraper/
  scrape.py        <- Pulls from Redfin + LandWatch
  requirements.txt
.github/
  workflows/
    scrape.yml     <- Nightly cron + manual trigger
```
