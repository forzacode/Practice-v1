#!/usr/bin/env python3
"""
Home Search Scraper — finds houses under $200k within 3 hours of White Plains, NY
in outdoor/mountain/lake/river areas.  Sources: Redfin + LandWatch.
"""

import json
import time
import random
import logging
import re
from datetime import datetime
from pathlib import Path

import requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Areas within ~3 hours of White Plains NY that have outdoor character
# Each poly is: lon_west lat_south, lon_east lat_south, lon_east lat_north,
#               lon_west lat_north, lon_west lat_south  (closed polygon)
# ---------------------------------------------------------------------------
SEARCH_AREAS = [
    {
        "name": "Sullivan County (Catskills), NY",
        "area_type": "mountain",
        "state": "NY",
        "drive_time": "~1.5h",
        # bounding box: roughly Sullivan County
        "poly": "-75.25 41.45,-74.40 41.45,-74.40 42.00,-75.25 42.00,-75.25 41.45",
    },
    {
        "name": "Delaware County (Catskills), NY",
        "area_type": "mountain",
        "state": "NY",
        "drive_time": "~2h",
        "poly": "-75.50 42.00,-74.50 42.00,-74.50 42.55,-75.50 42.55,-75.50 42.00",
    },
    {
        "name": "Greene County (Catskills), NY",
        "area_type": "mountain",
        "state": "NY",
        "drive_time": "~1.5-2h",
        "poly": "-74.70 42.10,-73.95 42.10,-73.95 42.50,-74.70 42.50,-74.70 42.10",
    },
    {
        "name": "Ulster County (Hudson Valley/Catskills), NY",
        "area_type": "mountain_river",
        "state": "NY",
        "drive_time": "~1.5-2h",
        "poly": "-74.90 41.55,-73.95 41.55,-73.95 42.10,-74.90 42.10,-74.90 41.55",
    },
    {
        "name": "Pike County (Poconos), PA",
        "area_type": "mountain_lake",
        "state": "PA",
        "drive_time": "~1.5h",
        "poly": "-75.30 41.10,-74.65 41.10,-74.65 41.60,-75.30 41.60,-75.30 41.10",
    },
    {
        "name": "Wayne County (Poconos), PA",
        "area_type": "mountain_lake",
        "state": "PA",
        "drive_time": "~2h",
        "poly": "-75.55 41.50,-75.00 41.50,-75.00 41.95,-75.55 41.95,-75.55 41.50",
    },
    {
        "name": "Berkshire County, MA",
        "area_type": "mountain_river",
        "state": "MA",
        "drive_time": "~2.5h",
        "poly": "-73.55 42.00,-72.80 42.00,-72.80 42.70,-73.55 42.70,-73.55 42.00",
    },
    {
        "name": "Litchfield County (NW Corner), CT",
        "area_type": "mountain_lake_river",
        "state": "CT",
        "drive_time": "~1.5h",
        "poly": "-73.55 41.70,-72.90 41.70,-72.90 42.10,-73.55 42.10,-73.55 41.70",
    },
    {
        "name": "Windham County (Southern VT), VT",
        "area_type": "mountain",
        "state": "VT",
        "drive_time": "~3h",
        "poly": "-72.90 42.75,-72.40 42.75,-72.40 43.20,-72.90 43.20,-72.90 42.75",
    },
]

AFRAME_KEYWORDS = {"a-frame", "a frame", "aframe", "chalet", "a-frame cabin", "a frame cabin"}
OUTDOOR_KEYWORDS = {"cabin", "mountain", "lake", "river", "creek", "pond", "woods", "forest",
                    "retreat", "camp", "lodge", "chalet", "cottage", "barn"}

BASE_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
}

SESSION = requests.Session()
SESSION.headers.update(BASE_HEADERS)


def _sleep():
    time.sleep(random.uniform(2.5, 5.0))


# ---------------------------------------------------------------------------
# REDFIN  (unofficial GIS JSON API)
# ---------------------------------------------------------------------------

def scrape_redfin(area: dict) -> list[dict]:
    url = "https://www.redfin.com/stingray/api/gis"
    params = {
        "al": "1",
        "max_price": "200000",
        "min_beds": "1",
        "num_homes": "350",
        "ord": "redfin-recommended-asc",
        "page_number": "1",
        "poly": area["poly"],
        "sf": "1,2,3,5,6,7",
        "start": "0",
        "status": "9",
        "uipt": "1",   # single-family homes only
        "v": "8",
    }
    headers = {
        **BASE_HEADERS,
        "Referer": "https://www.redfin.com/",
        "Accept": "application/json, text/plain, */*",
        "X-Requested-With": "XMLHttpRequest",
    }

    try:
        resp = SESSION.get(url, params=params, headers=headers, timeout=30)
        resp.raise_for_status()
    except Exception as exc:
        log.warning("Redfin request failed for %s: %s", area["name"], exc)
        return []

    raw = resp.text
    # Redfin prepends  {}&&  to prevent JSON hijacking
    if raw.startswith("{}&&"):
        raw = raw[4:]

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        log.warning("Redfin JSON parse error for %s: %s", area["name"], exc)
        return []

    if data.get("errorMessage") not in ("Success", "success"):
        log.warning("Redfin non-success for %s: %s", area["name"], data.get("errorMessage"))
        return []

    homes = data.get("payload", {}).get("homes", [])
    results = []

    for home in homes:
        try:
            price = home.get("price", {}).get("value", 0) or 0
            if price > 200_000:
                continue

            beds  = home.get("beds")  or 0
            baths = home.get("baths") or 0
            if beds < 1 or baths < 1:
                continue

            sqft_val  = home.get("sqFt",      {}).get("value") or 0
            street    = home.get("streetLine", {}).get("value", "")
            city      = home.get("city",  "")
            state     = home.get("state", "")
            zip_code  = home.get("zip",   "")
            url_path  = home.get("url",   "")

            address = f"{street}, {city}, {state} {zip_code}".strip(", ")
            full_url = f"https://www.redfin.com{url_path}" if url_path else ""

            features = _area_features(area)
            outdoor_score = _outdoor_score(area)

            listing = {
                "id":            str(home.get("listingId") or home.get("propertyId") or hash(full_url)),
                "source":        "Redfin",
                "price":         price,
                "price_display": f"${price:,}",
                "beds":          beds,
                "baths":         baths,
                "sqft":          int(sqft_val) if sqft_val else 0,
                "address":       address,
                "city":          city,
                "state":         state,
                "zip":           zip_code,
                "url":           full_url,
                "area":          area["name"],
                "area_type":     area["area_type"],
                "drive_time":    area["drive_time"],
                "year_built":    home.get("yearBuilt"),
                "lot_size":      home.get("lotSize"),
                "days_on_market": home.get("timeOnRedfin"),
                "taxes":         None,
                "is_aframe":     False,
                "outdoor_score": outdoor_score,
                "features":      features,
                "description":   "",
                "photo":         None,
                "scraped_at":    datetime.utcnow().isoformat(),
            }

            # Try to pull a photo URL if the list API included one
            photos = home.get("photos") or []
            if photos:
                listing["photo"] = photos[0].get("url") or photos[0].get("photoUrl")

            results.append(listing)

        except Exception as exc:
            log.debug("Error parsing Redfin home: %s", exc)
            continue

    return results


# ---------------------------------------------------------------------------
# LANDWATCH  (HTML scrape — good for cabins / A-frames / rural retreats)
# ---------------------------------------------------------------------------
_STATE_SLUG = {
    "NY": "new-york",
    "PA": "pennsylvania",
    "MA": "massachusetts",
    "CT": "connecticut",
    "VT": "vermont",
    "NJ": "new-jersey",
}


def scrape_landwatch(state: str) -> list[dict]:
    slug = _STATE_SLUG.get(state.upper(), state.lower())
    url  = f"https://www.landwatch.com/{slug}-land-for-sale/residential"
    params = {
        "MaxPrice":  "200000",
        "MinBeds":   "1",
        "TypeIds":   "1,6,7,35,38",  # house, cabin, A-frame, retreat, lodge
    }
    headers = {**BASE_HEADERS, "Referer": "https://www.landwatch.com/"}

    try:
        resp = SESSION.get(url, params=params, headers=headers, timeout=30)
        resp.raise_for_status()
    except Exception as exc:
        log.warning("LandWatch request failed for %s: %s", state, exc)
        return []

    soup = BeautifulSoup(resp.content, "lxml")

    # LandWatch listing cards (selector may need updating if they redesign)
    cards = (
        soup.find_all("article", class_=lambda c: c and "propCard" in c)
        or soup.find_all("div", attrs={"data-testid": lambda v: v and "property" in v.lower()})
        or soup.find_all("div", class_=lambda c: c and "listing" in (c or "").lower())
    )

    results = []
    for card in cards[:30]:
        try:
            title_el = card.find(["h2", "h3", "h4", "h5"])
            title    = title_el.get_text(" ", strip=True) if title_el else ""
            if not title:
                continue

            title_lower = title.lower()
            is_aframe   = any(k in title_lower for k in AFRAME_KEYWORDS)
            is_outdoor  = any(k in title_lower for k in OUTDOOR_KEYWORDS)
            if not (is_aframe or is_outdoor):
                continue

            price_el  = card.find(attrs={"class": lambda c: c and "price" in " ".join(c if isinstance(c, list) else [c]).lower()})
            price_txt = price_el.get_text(strip=True) if price_el else ""
            price     = _parse_price(price_txt)
            if price and price > 200_000:
                continue

            link_el = card.find("a", href=True)
            href    = (link_el["href"] if link_el else "") or ""
            if href and not href.startswith("http"):
                href = "https://www.landwatch.com" + href

            photo_el = card.find("img")
            photo    = photo_el.get("src") or photo_el.get("data-src") if photo_el else None
            if photo and photo.startswith("//"):
                photo = "https:" + photo

            features = ["Cabin / Rural retreat" if is_outdoor else "", "A-Frame" if is_aframe else ""]
            features = [f for f in features if f]

            listing = {
                "id":            f"lw-{hash(href)}",
                "source":        "LandWatch",
                "price":         price or 0,
                "price_display": price_txt or "See listing",
                "beds":          1,
                "baths":         1,
                "sqft":          0,
                "address":       title,
                "city":          "",
                "state":         state,
                "zip":           "",
                "url":           href,
                "area":          f"{state} — rural",
                "area_type":     "mountain",
                "drive_time":    "varies",
                "year_built":    None,
                "lot_size":      None,
                "days_on_market": None,
                "taxes":         None,
                "is_aframe":     is_aframe,
                "outdoor_score": 5 if is_aframe else 3,
                "features":      features,
                "description":   title,
                "photo":         photo,
                "scraped_at":    datetime.utcnow().isoformat(),
            }
            results.append(listing)

        except Exception as exc:
            log.debug("LandWatch card parse error: %s", exc)
            continue

    return results


# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------

def _parse_price(txt: str) -> int | None:
    digits = re.sub(r"[^\d]", "", txt)
    return int(digits) if digits else None


def _area_features(area: dict) -> list[str]:
    tags = []
    at   = area.get("area_type", "")
    if "mountain" in at: tags.append("Mountain area")
    if "lake"     in at: tags.append("Lake region")
    if "river"    in at: tags.append("River area")
    tags.append(f"Drive: {area['drive_time']} from White Plains")
    return tags


def _outdoor_score(area: dict) -> int:
    at = area.get("area_type", "")
    score = 0
    if "mountain" in at: score += 3
    if "lake"     in at: score += 2
    if "river"    in at: score += 2
    return score


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def main():
    all_listings: list[dict] = []
    seen_ids: set[str] = set()

    def add(lst: list[dict]):
        for l in lst:
            if l["id"] not in seen_ids:
                seen_ids.add(l["id"])
                all_listings.append(l)

    # --- Redfin pass ---
    for area in SEARCH_AREAS:
        log.info("Redfin → %s", area["name"])
        found = scrape_redfin(area)
        add(found)
        log.info("  %d listings", len(found))
        _sleep()

    # --- LandWatch pass (one per unique state) ---
    done_states: set[str] = set()
    for area in SEARCH_AREAS:
        st = area["state"]
        if st not in done_states:
            done_states.add(st)
            log.info("LandWatch → %s", st)
            found = scrape_landwatch(st)
            add(found)
            log.info("  %d listings", len(found))
            _sleep()

    # Sort: A-frame first → outdoor_score desc → price asc
    all_listings.sort(key=lambda l: (-l["is_aframe"], -l["outdoor_score"], l["price"]))

    output = {
        "updated_at": datetime.utcnow().isoformat() + "Z",
        "total":      len(all_listings),
        "listings":   all_listings,
    }

    out_path = Path(__file__).parent.parent / "docs" / "listings.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(output, indent=2))

    log.info("Done — %d listings written to %s", len(all_listings), out_path)


if __name__ == "__main__":
    main()
