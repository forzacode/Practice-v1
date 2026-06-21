#!/usr/bin/env python3
"""
Miami Hurricanes Football Data Aggregator
Pulls from ESPN API, Reddit, and RSS feeds — all free, no API keys required.
Writes output to docs/hurricanes_data.json for GitHub Pages.
"""

import json
import re
import time
import logging
from datetime import datetime, timezone
from pathlib import Path

import requests
import feedparser

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}

ESPN_TEAM_ID = 2390  # Miami Hurricanes
ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/football/college-football"
OUT_FILE = Path("docs/hurricanes_data.json")


def safe_get(url, **kwargs):
    try:
        r = requests.get(url, headers=HEADERS, timeout=20, **kwargs)
        r.raise_for_status()
        return r
    except Exception as e:
        log.warning("Failed to fetch %s: %s", url, e)
        return None


def strip_html(text):
    return re.sub(r"<[^>]+>", "", text or "").strip()


# ---------------------------------------------------------------------------
# ESPN API helpers
# ---------------------------------------------------------------------------

def fetch_team_info():
    r = safe_get(f"{ESPN_BASE}/teams/{ESPN_TEAM_ID}")
    if not r:
        return {}
    team = r.json().get("team", {})

    record_items = team.get("record", {}).get("items", [])
    record = {}
    if record_items:
        item = record_items[0]
        record["summary"] = item.get("summary", "")
        stats = {s["name"]: s.get("displayValue", s.get("value", "")) for s in item.get("stats", [])}
        record["wins"] = stats.get("wins", "")
        record["losses"] = stats.get("losses", "")

    logos = team.get("logos", [])
    logo = logos[0].get("href", "") if logos else ""

    links = team.get("links", [])
    website = next((l.get("href", "") for l in links if "clubhouse" in l.get("href", "")), "")

    return {
        "name": team.get("displayName", "Miami Hurricanes"),
        "abbreviation": team.get("abbreviation", "MIA"),
        "location": team.get("location", "Miami"),
        "nickname": team.get("nickname", "Hurricanes"),
        "color": team.get("color", "F47321"),
        "alternate_color": team.get("alternateColor", "005030"),
        "logo": logo,
        "record": record,
        "website": website,
    }


def fetch_espn_news():
    r = safe_get(f"{ESPN_BASE}/news?team={ESPN_TEAM_ID}&limit=30")
    if not r:
        return []
    articles = r.json().get("articles", [])
    news = []
    for a in articles:
        images = a.get("images", [])
        image = images[0].get("url", "") if images else ""
        news.append({
            "title": a.get("headline", ""),
            "summary": strip_html(a.get("description", "")),
            "url": a.get("links", {}).get("web", {}).get("href", ""),
            "published": a.get("published", ""),
            "source": "ESPN",
            "image": image,
        })
    return news


def fetch_schedule():
    year = datetime.now().year
    # Try current year first, then next year (handles season crossover)
    games = []
    for season in [year, year + 1, year - 1]:
        r = safe_get(f"{ESPN_BASE}/teams/{ESPN_TEAM_ID}/schedule?season={season}")
        if not r:
            continue
        events = r.json().get("events", [])
        if events:
            for e in events:
                comps = e.get("competitions", [])
                if not comps:
                    continue
                comp = comps[0]
                competitors = comp.get("competitors", [])
                miami = next((c for c in competitors if c.get("team", {}).get("id") == str(ESPN_TEAM_ID)), {})
                opponent = next((c for c in competitors if c.get("team", {}).get("id") != str(ESPN_TEAM_ID)), {})

                status_obj = comp.get("status", {}).get("type", {})
                status = status_obj.get("name", "")
                status_detail = status_obj.get("detail", "")

                result = ""
                miami_score = ""
                opp_score = ""
                if status == "STATUS_FINAL":
                    miami_score = miami.get("score", "")
                    opp_score = opponent.get("score", "")
                    result = "W" if miami.get("winner", False) else "L"
                elif status == "STATUS_IN_PROGRESS":
                    miami_score = miami.get("score", "")
                    opp_score = opponent.get("score", "")

                opp_team = opponent.get("team", {})
                opp_logos = opp_team.get("logos", [])
                opp_logo = opp_logos[0].get("href", "") if opp_logos else ""

                rankings = comp.get("competitors", [])
                miami_rank = miami.get("curRank", "")
                opp_rank = opponent.get("curRank", "")

                games.append({
                    "season": season,
                    "date": e.get("date", ""),
                    "name": e.get("name", ""),
                    "short_name": e.get("shortName", ""),
                    "opponent": opp_team.get("displayName", "TBD"),
                    "opponent_short": opp_team.get("shortDisplayName", ""),
                    "opponent_abbreviation": opp_team.get("abbreviation", ""),
                    "opponent_logo": opp_logo,
                    "opponent_rank": opp_rank,
                    "miami_rank": miami_rank,
                    "home_away": miami.get("homeAway", "home"),
                    "venue": comp.get("venue", {}).get("fullName", ""),
                    "city": comp.get("venue", {}).get("address", {}).get("city", ""),
                    "result": result,
                    "miami_score": miami_score,
                    "opp_score": opp_score,
                    "status": status,
                    "status_detail": status_detail,
                    "neutral_site": comp.get("neutralSite", False),
                    "conference_game": comp.get("conferenceCompetition", False),
                    "tv": next((b.get("station", "") for b in comp.get("broadcasts", []) if b.get("station")), ""),
                })
            break  # Use first season that has data
    return games


def fetch_stats():
    r = safe_get(f"{ESPN_BASE}/teams/{ESPN_TEAM_ID}/statistics")
    if not r:
        return {}
    data = r.json()
    results = data.get("results", {})
    if not results:
        # Try alternate path
        results = data.get("stats", {})

    categories = {}
    for cat in results.get("stats", {}).get("categories", []):
        cat_name = cat.get("name", "")
        categories[cat_name] = {}
        for stat in cat.get("stats", []):
            categories[cat_name][stat.get("name", "")] = {
                "display": stat.get("displayValue", ""),
                "value": stat.get("value", ""),
                "rank": stat.get("rank", ""),
            }
    return categories


def fetch_leaders():
    """Fetch statistical leaders from the team leaders endpoint."""
    r = safe_get(f"{ESPN_BASE}/teams/{ESPN_TEAM_ID}")
    if not r:
        return []
    team = r.json().get("team", {})
    leaders_data = team.get("leaders", [])
    leaders = []
    for cat in leaders_data:
        cat_name = cat.get("name", "")
        display_name = cat.get("displayName", cat_name)
        athletes = cat.get("leaders", [])
        if athletes:
            top = athletes[0]
            athlete = top.get("athlete", {})
            leaders.append({
                "category": display_name,
                "name": athlete.get("displayName", ""),
                "value": top.get("displayValue", ""),
                "position": athlete.get("position", {}).get("abbreviation", ""),
                "jersey": athlete.get("jersey", ""),
                "headshot": athlete.get("headshot", {}).get("href", ""),
            })
    return leaders


def fetch_roster():
    r = safe_get(f"{ESPN_BASE}/teams/{ESPN_TEAM_ID}/roster")
    if not r:
        return []
    data = r.json()
    players = []
    for group in data.get("athletes", []):
        for athlete in group.get("items", []):
            position_info = athlete.get("position", {})
            links = athlete.get("links", [])
            profile = next((l.get("href", "") for l in links if "player" in l.get("href", "")), "")
            players.append({
                "name": athlete.get("displayName", ""),
                "first_name": athlete.get("firstName", ""),
                "last_name": athlete.get("lastName", ""),
                "position": position_info.get("abbreviation", ""),
                "position_name": position_info.get("displayName", ""),
                "jersey": athlete.get("jersey", ""),
                "year": athlete.get("displayExperience", ""),
                "hometown": athlete.get("birthPlace", {}).get("city", ""),
                "home_state": athlete.get("birthPlace", {}).get("state", ""),
                "height": athlete.get("displayHeight", ""),
                "weight": athlete.get("displayWeight", ""),
                "image": athlete.get("headshot", {}).get("href", ""),
                "profile": profile,
            })
    return players


# ---------------------------------------------------------------------------
# Reddit (no API key needed for public JSON endpoints)
# ---------------------------------------------------------------------------

def fetch_reddit():
    posts = []
    reddit_headers = {**HEADERS, "Accept": "application/json"}

    sources = [
        ("r/MiamiHurricanes", "https://www.reddit.com/r/MiamiHurricanes/hot.json?limit=25"),
        ("r/CFB", "https://www.reddit.com/r/CFB/search.json?q=Miami+Hurricanes&sort=new&limit=15&restrict_sr=1"),
    ]

    for subreddit, url in sources:
        r = safe_get(url, headers=reddit_headers)
        if not r:
            continue
        children = r.json().get("data", {}).get("children", [])
        for child in children:
            post = child.get("data", {})
            if post.get("is_self") and not post.get("selftext"):
                text_preview = ""
            else:
                text_preview = strip_html(post.get("selftext", ""))[:280]

            created_ts = post.get("created_utc", 0)
            created_iso = datetime.fromtimestamp(created_ts, tz=timezone.utc).isoformat() if created_ts else ""

            posts.append({
                "title": post.get("title", ""),
                "url": f"https://reddit.com{post.get('permalink', '')}",
                "external_url": post.get("url", ""),
                "score": post.get("score", 0),
                "comments": post.get("num_comments", 0),
                "created": created_iso,
                "author": post.get("author", ""),
                "flair": post.get("link_flair_text", ""),
                "text": text_preview,
                "subreddit": subreddit,
                "thumbnail": post.get("thumbnail", "") if post.get("thumbnail", "").startswith("http") else "",
                "is_link": not post.get("is_self", True),
            })
        time.sleep(1.5)  # Respect Reddit rate limits

    return posts


# ---------------------------------------------------------------------------
# RSS Feed aggregation
# ---------------------------------------------------------------------------

RSS_FEEDS = [
    ("247Sports", "https://247sports.com/team/miami-hurricanes-football/rss/"),
    ("Google News", "https://news.google.com/rss/search?q=%22Miami+Hurricanes%22+football&hl=en-US&gl=US&ceid=US:en"),
    ("Recruiting News", "https://news.google.com/rss/search?q=%22Miami+Hurricanes%22+football+recruiting&hl=en-US&gl=US&ceid=US:en"),
    ("CanesInSight", "https://canesinsight.com/feed/"),
    ("CaneSport", "https://www.canesport.com/rss.xml"),
    ("The Hurricanes Wire", "https://hurricaneswire.usatoday.com/feed/"),
]

MIAMI_KEYWORDS = ["miami", "hurricanes", "canes", "the u", "canesville"]


def is_miami_related(title, summary=""):
    combined = (title + " " + summary).lower()
    return any(kw in combined for kw in MIAMI_KEYWORDS)


def parse_rss_feeds():
    all_items = []
    for source_name, feed_url in RSS_FEEDS:
        log.info("  Fetching RSS: %s", source_name)
        try:
            feed = feedparser.parse(feed_url, agent=HEADERS["User-Agent"])
            for entry in feed.entries[:15]:
                title = entry.get("title", "")
                summary = strip_html(entry.get("summary", entry.get("description", "")))[:500]

                # For generic feeds, skip non-Miami content
                if source_name in ("ESPN NCAA Football",) and not is_miami_related(title, summary):
                    continue

                # Extract image from content if available
                image = ""
                for content in entry.get("media_content", []):
                    if content.get("medium") == "image":
                        image = content.get("url", "")
                        break
                if not image:
                    for enc in entry.get("enclosures", []):
                        if "image" in enc.get("type", ""):
                            image = enc.get("url", "")
                            break

                pub_date = entry.get("published", entry.get("updated", ""))

                all_items.append({
                    "title": title,
                    "summary": summary,
                    "url": entry.get("link", ""),
                    "published": pub_date,
                    "source": source_name,
                    "image": image,
                    "category": "news",
                })
        except Exception as e:
            log.warning("RSS feed %s failed: %s", source_name, e)

    return all_items


def parse_recruiting_feeds():
    recruiting_feeds = [
        ("247Sports Recruiting", "https://247sports.com/team/miami-hurricanes-football/rss/"),
        ("Rivals Recruiting", "https://news.google.com/rss/search?q=%22Miami+Hurricanes%22+football+recruit+commit+2025+2026&hl=en-US&gl=US&ceid=US:en"),
        ("On3 Recruiting", "https://news.google.com/rss/search?q=%22Miami+Hurricanes%22+commit+decommit+offer+transfer+portal&hl=en-US&gl=US&ceid=US:en"),
    ]
    items = []
    for source_name, feed_url in recruiting_feeds:
        log.info("  Fetching Recruiting RSS: %s", source_name)
        try:
            feed = feedparser.parse(feed_url, agent=HEADERS["User-Agent"])
            for entry in feed.entries[:10]:
                title = entry.get("title", "")
                summary = strip_html(entry.get("summary", entry.get("description", "")))[:400]
                items.append({
                    "title": title,
                    "summary": summary,
                    "url": entry.get("link", ""),
                    "published": entry.get("published", ""),
                    "source": source_name,
                })
        except Exception as e:
            log.warning("Recruiting feed %s failed: %s", source_name, e)
    return items


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    log.info("=== Miami Hurricanes Data Scraper Starting ===")

    log.info("Fetching team info...")
    team = fetch_team_info()

    log.info("Fetching ESPN news...")
    espn_news = fetch_espn_news()

    log.info("Fetching schedule...")
    schedule = fetch_schedule()

    log.info("Fetching stats...")
    stats = fetch_stats()

    log.info("Fetching leaders...")
    leaders = fetch_leaders()

    log.info("Fetching roster...")
    roster = fetch_roster()

    log.info("Fetching Reddit posts...")
    reddit = fetch_reddit()

    log.info("Fetching RSS news feeds...")
    rss_news = parse_rss_feeds()

    log.info("Fetching recruiting news...")
    recruiting = parse_recruiting_feeds()

    # Merge and deduplicate news by title
    all_news = espn_news + rss_news
    seen_titles = set()
    unique_news = []
    for item in all_news:
        key = re.sub(r"\W+", "", item["title"].lower())[:60]
        if key and key not in seen_titles:
            seen_titles.add(key)
            unique_news.append(item)

    # Sort news: items with images first, then by source priority
    source_priority = {"ESPN": 0, "Hurricanes Wire": 1, "CanesInSight": 2, "CaneSport": 3, "247Sports": 4}
    unique_news.sort(key=lambda x: (0 if x.get("image") else 1, source_priority.get(x["source"], 9)))

    output = {
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "team": team,
        "news": unique_news[:40],
        "schedule": schedule,
        "stats": stats,
        "leaders": leaders,
        "roster": roster[:80],
        "social": {
            "reddit": reddit
        },
        "recruiting": recruiting[:30],
    }

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    log.info(
        "Done! %d news | %d games | %d reddit | %d recruiting | %d leaders | %d roster",
        len(unique_news), len(schedule), len(reddit), len(recruiting), len(leaders), len(roster)
    )


if __name__ == "__main__":
    main()
