#!/usr/bin/env python3
"""
Home Search Scraper — finds houses under $200k within 3 hours of White Plains, NY
in outdoor/mountain/lake/river areas.
Sources: Redfin (unofficial GIS API) + LandWatch (HTML) + Craigslist (RSS).
"""

import json
import re
import time
import random
import logging
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path

import requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Areas (Redfin / LandWatch bounding boxes)
# ---------------------------------------------------------------------------
SEARCH_AREAS = [
    {"name": "Sullivan County (Catskills), NY",           "area_type": "mountain",           "state": "NY", "drive_time": "~1.5h",   "poly": "-75.25 41.45,-74.40 41.45,-74.40 42.00,-75.25 42.00,-75.25 41.45"},
    {"name": "Delaware County (Catskills), NY",           "area_type": "mountain",           "state": "NY", "drive_time": "~2h",     "poly": "-75.50 42.00,-74.50 42.00,-74.50 42.55,-75.50 42.55,-75.50 42.00"},
    {"name": "Greene County (Catskills), NY",             "area_type": "mountain",           "state": "NY", "drive_time": "~1.5-2h", "poly": "-74.70 42.10,-73.95 42.10,-73.95 42.50,-74.70 42.50,-74.70 42.10"},
    {"name": "Ulster County (Hudson Valley/Catskills), NY","area_type": "mountain_river",    "state": "NY", "drive_time": "~1.5-2h", "poly": "-74.90 41.55,-73.95 41.55,-73.95 42.10,-74.90 42.10,-74.90 41.55"},
    {"name": "Pike County (Poconos), PA",                 "area_type": "mountain_lake",      "state": "PA", "drive_time": "~1.5h",   "poly": "-75.30 41.10,-74.65 41.10,-74.65 41.60,-75.30 41.60,-75.30 41.10"},
    {"name": "Wayne County (Poconos), PA",                "area_type": "mountain_lake",      "state": "PA", "drive_time": "~2h",     "poly": "-75.55 41.50,-75.00 41.50,-75.00 41.95,-75.55 41.95,-75.55 41.50"},
    {"name": "Berkshire County, MA",                      "area_type": "mountain_river",    "state": "MA", "drive_time": "~2.5h",   "poly": "-73.55 42.00,-72.80 42.00,-72.80 42.70,-73.55 42.70,-73.55 42.00"},
    {"name": "Litchfield County (NW Corner), CT",         "area_type": "mountain_lake_river","state": "CT", "drive_time": "~1.5h",   "poly": "-73.55 41.70,-72.90 41.70,-72.90 42.10,-73.55 42.10,-73.55 41.70"},
    {"name": "Windham County (Southern VT), VT",          "area_type": "mountain",           "state": "VT", "drive_time": "~3h",     "poly": "-72.90 42.75,-72.40 42.75,-72.40 43.20,-72.90 43.20,-72.90 42.75"},
]

# ---------------------------------------------------------------------------
# Craigslist RSS areas (subdomain → metadata)
# ---------------------------------------------------------------------------
CRAIGSLIST_AREAS = [
    {"subdomain": "hudsonvalley", "name": "Hudson Valley / Catskills, NY", "area_type": "mountain_river",    "state": "NY", "drive_time": "~1.5h"},
    {"subdomain": "poconos",      "name": "Poconos, PA",                   "area_type": "mountain_lake",      "state": "PA", "drive_time": "~1.5-2h"},
    {"subdomain": "vermont",      "name": "Vermont",                       "area_type": "mountain",           "state": "VT", "drive_time": "~3h"},
    {"subdomain": "westernmass",  "name": "Western MA (Berkshires)",       "area_type": "mountain_river",    "state": "MA", "drive_time": "~2.5h"},
    {"subdomain": "hartford",     "name": "NW Connecticut",                "area_type": "mountain_lake_river","state": "CT", "drive_time": "~1.5h"},
]

AFRAME_KEYWORDS = {"a-frame", "a frame", "aframe", "chalet", "a-frame cabin"}
OUTDOOR_KEYWORDS = {"cabin", "mountain", "lake", "river", "creek", "pond", "woods", "forest",
                    "retreat", "camp", "lodge", "cottage", "farmhouse", "barn", "chalet"}
CITY_SIGNALS = {"apartment", "condo", "studio", "high-rise", "downtown", "urban", "transit"}

_STATE_SLUG = {"NY": "new-york", "PA": "pennsylvania", "MA": "massachusetts",
               "CT": "connecticut", "VT": "vermont", "NJ": "new-jersey"}

BASE_HEADERS = {
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                   "AppleWebKit/537.36 (KHTML, like Gecko) "
                   "Chrome/124.0.0.0 Safari/537.36"),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
}

SESSION = requests.Session()
SESSION.headers.update(BASE_HEADERS)


def _sleep(lo=2.0, hi=4.5):
    time.sleep(random.uniform(lo, hi))


def _parse_price(txt: str) -> int | None:
    digits = re.sub(r"[^\d]", "", txt or "")
    return int(digits) if digits else None


def _area_features(area: dict) -> list[str]:
    tags, at = [], area.get("area_type", "")
    if "mountain" in at: tags.append("Mountain area")
    if "lake"     in at: tags.append("Lake region")
    if "river"    in at: tags.append("River area")
    tags.append(f"Drive: {area['drive_time']} from White Plains")
    return tags


def _outdoor_score(area: dict) -> int:
    at = area.get("area_type", "")
    return ("mountain" in at) * 3 + ("lake" in at) * 2 + ("river" in at) * 2


def _apply_history(listing: dict, existing: dict) -> None:
    """Preserve first_seen date and detect price drops vs. previous run."""
    old = existing.get(listing["id"], {})
    listing["first_seen"] = old.get("first_seen") or listing["scraped_at"]

    old_price = old.get("price")
    cur_price = listing.get("price") or 0
    if old_price and cur_price and old_price != cur_price:
        listing["previous_price"]    = old_price
        listing["price_changed_at"]  = listing["scraped_at"]
    else:
        listing["previous_price"]   = old.get("previous_price")
        listing["price_changed_at"] = old.get("price_changed_at")


# ---------------------------------------------------------------------------
# REDFIN  (unofficial GIS JSON API)
# ---------------------------------------------------------------------------
def scrape_redfin(area: dict) -> list[dict]:
    url = "https://www.redfin.com/stingray/api/gis"
    params = {
        "al": "1", "max_price": "200000", "min_beds": "1",
        "num_homes": "350", "ord": "redfin-recommended-asc",
        "page_number": "1", "poly": area["poly"],
        "sf": "1,2,3,5,6,7", "start": "0", "status": "9",
        "uipt": "1", "v": "8",
    }
    headers = {**BASE_HEADERS, "Referer": "https://www.redfin.com/",
               "Accept": "application/json, text/plain, */*",
               "X-Requested-With": "XMLHttpRequest"}
    try:
        resp = SESSION.get(url, params=params, headers=headers, timeout=30)
        resp.raise_for_status()
    except Exception as exc:
        log.warning("Redfin request failed for %s: %s", area["name"], exc)
        return []

    raw = resp.text
    if raw.startswith("{}&&"):
        raw = raw[4:]
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        log.warning("Redfin JSON parse error for %s", area["name"])
        return []

    if data.get("errorMessage", "").lower() not in ("success",):
        log.warning("Redfin error for %s: %s", area["name"], data.get("errorMessage"))
        return []

    results = []
    for home in data.get("payload", {}).get("homes", []):
        try:
            price = home.get("price", {}).get("value") or 0
            if price > 200_000:
                continue
            beds  = home.get("beds")  or 0
            baths = home.get("baths") or 0
            if beds < 1 or baths < 1:
                continue

            sqft      = home.get("sqFt",      {}).get("value") or 0
            street    = home.get("streetLine", {}).get("value", "")
            city      = home.get("city",  "")
            state     = home.get("state", "")
            zip_code  = home.get("zip",   "")
            url_path  = home.get("url",   "")
            address   = f"{street}, {city}, {state} {zip_code}".strip(", ")
            full_url  = f"https://www.redfin.com{url_path}" if url_path else ""

            # lat/lon
            latlng = home.get("latLng") or {}
            lat = latlng.get("latitude")  or 0
            lon = latlng.get("longitude") or 0

            # photo (not always in list API)
            photo = None
            photos = home.get("photos") or []
            if photos:
                photo = photos[0].get("url") or photos[0].get("photoUrl")

            listing = {
                "id":            str(home.get("listingId") or home.get("propertyId") or hash(full_url)),
                "source":        "Redfin",
                "price":         price,
                "price_display": f"${price:,}",
                "previous_price": None,
                "price_changed_at": None,
                "beds":          beds,
                "baths":         baths,
                "sqft":          int(sqft) if sqft else 0,
                "address":       address,
                "city":          city,
                "state":         state,
                "zip":           zip_code,
                "url":           full_url,
                "area":          area["name"],
                "area_type":     area["area_type"],
                "drive_time":    area["drive_time"],
                "lat":           lat,
                "lon":           lon,
                "year_built":    home.get("yearBuilt"),
                "lot_size":      home.get("lotSize"),
                "days_on_market": home.get("timeOnRedfin"),
                "taxes":         None,
                "is_aframe":     False,
                "outdoor_score": _outdoor_score(area),
                "features":      _area_features(area),
                "description":   "",
                "photo":         photo,
                "first_seen":    None,
                "scraped_at":    datetime.utcnow().isoformat(),
            }
            results.append(listing)
        except Exception as exc:
            log.debug("Redfin home parse error: %s", exc)
    return results


# ---------------------------------------------------------------------------
# LANDWATCH  (HTML scrape — good for cabins / rural retreats)
# ---------------------------------------------------------------------------
def scrape_landwatch(state: str) -> list[dict]:
    slug = _STATE_SLUG.get(state.upper(), state.lower())
    url  = f"https://www.landwatch.com/{slug}-land-for-sale/residential"
    params = {"MaxPrice": "200000", "MinBeds": "1", "TypeIds": "1,6,7,35,38"}
    headers = {**BASE_HEADERS, "Referer": "https://www.landwatch.com/"}

    try:
        resp = SESSION.get(url, params=params, headers=headers, timeout=30)
        resp.raise_for_status()
    except Exception as exc:
        log.warning("LandWatch failed for %s: %s", state, exc)
        return []

    soup  = BeautifulSoup(resp.content, "lxml")
    cards = (
        soup.find_all("article", class_=lambda c: c and "propCard" in c)
        or soup.find_all("div", attrs={"data-testid": lambda v: v and "property" in (v or "").lower()})
        or soup.find_all("div", class_=lambda c: c and "listing" in " ".join(c if isinstance(c, list) else [c]).lower())
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
            price     = _parse_price(price_txt) or 0
            if price > 200_000:
                continue

            link_el = card.find("a", href=True)
            href    = link_el["href"] if link_el else ""
            if href and not href.startswith("http"):
                href = "https://www.landwatch.com" + href

            photo_el = card.find("img")
            photo    = (photo_el.get("src") or photo_el.get("data-src")) if photo_el else None
            if photo and photo.startswith("//"):
                photo = "https:" + photo

            area_tag = {"name": f"{state} — rural", "area_type": "mountain",
                        "drive_time": "varies", "state": state}
            features = _area_features(area_tag)
            if is_aframe: features.insert(0, "A-Frame / Cabin")

            listing = {
                "id":            f"lw-{hash(href)}",
                "source":        "LandWatch",
                "price":         price,
                "price_display": price_txt or "See listing",
                "previous_price": None,
                "price_changed_at": None,
                "beds":  1, "baths": 1, "sqft": 0,
                "address": title, "city": "", "state": state, "zip": "",
                "url": href, "area": area_tag["name"],
                "area_type": area_tag["area_type"],
                "drive_time": area_tag["drive_time"],
                "lat": 0, "lon": 0,
                "year_built": None, "lot_size": None,
                "days_on_market": None, "taxes": None,
                "is_aframe":     is_aframe,
                "outdoor_score": 5 if is_aframe else 3,
                "features":      features,
                "description":   title,
                "photo":         photo,
                "first_seen":    None,
                "scraped_at":    datetime.utcnow().isoformat(),
            }
            results.append(listing)
        except Exception as exc:
            log.debug("LandWatch card parse error: %s", exc)
    return results


# ---------------------------------------------------------------------------
# CRAIGSLIST  (RSS feeds — free, no auth, great for rural/cabin listings)
# ---------------------------------------------------------------------------
def scrape_craigslist(cl_area: dict) -> list[dict]:
    subdomain = cl_area["subdomain"]
    url = f"https://{subdomain}.craigslist.org/search/reo"
    params = {
        "format":           "rss",
        "max_price":        "200000",
        "min_bedrooms":     "1",
        "housing_type":     "6",    # house only
        "bundleDuplicates": "1",
    }
    headers = {**BASE_HEADERS, "Referer": f"https://{subdomain}.craigslist.org/"}

    try:
        resp = SESSION.get(url, params=params, headers=headers, timeout=30)
        resp.raise_for_status()
    except Exception as exc:
        log.warning("Craigslist %s failed: %s", subdomain, exc)
        return []

    try:
        root = ET.fromstring(resp.content)
    except ET.ParseError as exc:
        log.warning("Craigslist %s XML error: %s", subdomain, exc)
        return []

    # Common RSS namespaces used by Craigslist
    NS = {
        "content": "http://purl.org/rss/1.0/modules/content/",
        "geo":     "http://www.w3.org/2003/01/geo/wgs84_pos#",
        "georss":  "http://www.georss.org/georss",
    }

    results = []
    for item in root.findall(".//item")[:40]:
        try:
            title    = (item.findtext("title") or "").strip()
            link     = (item.findtext("link")  or "").strip()
            desc_raw = (item.findtext(f"{{{NS['content']}}}encoded")
                        or item.findtext("description") or "")

            # Price from title: "$125,000 / 2br - ..." or "$125,000 2br ..."
            price_m = re.search(r"\$([0-9,]+)", title)
            price   = int(price_m.group(1).replace(",", "")) if price_m else 0
            if price and price > 200_000:
                continue

            # Beds from title
            br_m = re.search(r"(\d+)\s*br", title, re.I)
            beds = int(br_m.group(1)) if br_m else 1
            if beds < 1:
                continue

            # Description text
            desc_text = BeautifulSoup(desc_raw, "lxml").get_text(" ", strip=True)[:400]

            combined    = (title + " " + desc_text).lower()
            is_aframe   = any(k in combined for k in AFRAME_KEYWORDS)
            is_outdoor  = any(k in combined for k in OUTDOOR_KEYWORDS)
            is_city_ish = any(s in combined for s in CITY_SIGNALS)

            if is_city_ish:
                continue

            # Extract lat/lon if present (Craigslist includes georss:point on many listings)
            lat = lon = 0.0
            georss_point = item.findtext(f"{{{NS['georss']}}}point")
            if georss_point:
                parts = georss_point.strip().split()
                if len(parts) == 2:
                    try:
                        lat, lon = float(parts[0]), float(parts[1])
                    except ValueError:
                        pass
            if not lat:
                geo_lat = item.findtext(f"{{{NS['geo']}}}lat")
                geo_lon = item.findtext(f"{{{NS['geo']}}}long")
                if geo_lat and geo_lon:
                    try:
                        lat, lon = float(geo_lat), float(geo_lon)
                    except ValueError:
                        pass

            features = _area_features(cl_area)
            if is_aframe: features.insert(0, "A-Frame / Cabin")
            if is_outdoor and not is_aframe: features.insert(0, "Cabin / Retreat")

            listing = {
                "id":            f"cl-{abs(hash(link))}",
                "source":        "Craigslist",
                "price":         price,
                "price_display": f"${price:,}" if price else "See listing",
                "previous_price": None,
                "price_changed_at": None,
                "beds":  beds, "baths": 1, "sqft": 0,
                "address": title, "city": "", "state": cl_area["state"], "zip": "",
                "url": link, "area": cl_area["name"],
                "area_type": cl_area["area_type"],
                "drive_time": cl_area["drive_time"],
                "lat": lat, "lon": lon,
                "year_built": None, "lot_size": None,
                "days_on_market": None, "taxes": None,
                "is_aframe":     is_aframe,
                "outdoor_score": 5 if is_aframe else (3 if is_outdoor else 2),
                "features":      features,
                "description":   desc_text[:300],
                "photo":         None,
                "first_seen":    None,
                "scraped_at":    datetime.utcnow().isoformat(),
            }
            results.append(listing)
        except Exception as exc:
            log.debug("Craigslist item error: %s", exc)

    return results


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------
def main():
    out_path = Path(__file__).parent.parent / "docs" / "listings.json"

    # Load previous run to preserve first_seen + detect price drops
    existing: dict[str, dict] = {}
    if out_path.exists():
        try:
            old = json.loads(out_path.read_text())
            for l in old.get("listings", []):
                existing[l["id"]] = l
            log.info("Loaded %d existing listings for history tracking", len(existing))
        except Exception as exc:
            log.warning("Could not read existing listings: %s", exc)

    all_listings: list[dict] = []
    seen_ids: set[str] = set()

    def add(lst: list[dict]) -> None:
        for l in lst:
            if l["id"] not in seen_ids:
                seen_ids.add(l["id"])
                _apply_history(l, existing)
                all_listings.append(l)

    # ── Redfin ──
    for area in SEARCH_AREAS:
        log.info("Redfin → %s", area["name"])
        found = scrape_redfin(area)
        add(found)
        log.info("  %d listings", len(found))
        _sleep()

    # ── LandWatch (one pass per unique state) ──
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

    # ── Craigslist RSS ──
    for cl_area in CRAIGSLIST_AREAS:
        log.info("Craigslist → %s (%s)", cl_area["subdomain"], cl_area["name"])
        found = scrape_craigslist(cl_area)
        add(found)
        log.info("  %d listings", len(found))
        _sleep(1.5, 3.0)

    # Sort: A-frame → outdoor_score desc → price asc
    all_listings.sort(key=lambda l: (-l["is_aframe"], -l["outdoor_score"], l["price"]))

    output = {
        "updated_at": datetime.utcnow().isoformat() + "Z",
        "total":      len(all_listings),
        "listings":   all_listings,
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(output, indent=2))
    log.info("Done — %d listings → %s", len(all_listings), out_path)


if __name__ == "__main__":
    main()
