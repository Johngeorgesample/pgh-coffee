import json
import math
import pathlib
import random
import re
from datetime import datetime, timedelta, timezone

HERE = pathlib.Path(__file__).parent
ROOT = HERE.parents[1]
TESTDATA = {"type": "grafana-testdata-datasource", "uid": "beo2hdqv8m6tcf"}

random.seed(2026)
lineup = {d["day"]: d for d in json.loads((ROOT / "data/advent.json").read_text())}
orders_src = (ROOT / "data/advent-orders.ts").read_text()
ORDERS = {
    "curated": list(range(1, 26)),
    "geo": [int(n) for n in re.search(r"id: 'geo'.*?sequence: \[([^\]]+)\]", orders_src, re.S).group(1).split(",")],
    "founded": [int(n) for n in re.search(r"id: 'founded'.*?sequence: \[([^\]]+)\]", orders_src, re.S).group(1).split(",")],
}
ORDER_SHARE = {"curated": 0.70, "geo": 0.18, "founded": 0.12}
DAYS = range(1, 32)


def visitors(day):
    if day > 25:
        return round(14 * math.exp(-(day - 25) / 2) + 2)
    decay = 55 * math.exp(-(day - 1) / 5)
    rebound = 16 / (1 + math.exp(-(day - 19) / 1.5))
    weekend = 1.15 if datetime(2026, 12, day).weekday() >= 5 else 1
    return round((decay + 34 + rebound) * weekend * random.uniform(0.9, 1.1))


V = {d: visitors(d) for d in DAYS}
APPEAL = {jar: random.uniform(0.7, 1.35) for jar in lineup}
SAVE_RATE = {jar: random.uniform(0.06, 0.2) for jar in lineup}
RATING = {jar: round(random.uniform(3.2, 4.7), 2) for jar in lineup}
HAS_VIDEO = {jar: random.random() < 0.55 for jar in lineup}


def opens_by_timing(day):
    if day > 25:
        return {"today": 0, "catchup": round(V[day] * 0.35), "early": 0}
    monday = datetime(2026, 12, day).weekday() == 0
    catchup = V[day] * (0.32 if monday else 0.12) + (V[day] * 0.25 if day >= 20 else 0)
    early = 6 if day <= 2 else (5 if day >= 23 else 1.5)
    return {"today": round(V[day] * 0.58), "catchup": round(catchup), "early": round(early * random.uniform(0.8, 1.2))}


TIMING = {d: opens_by_timing(d) for d in DAYS}


def jar_opens(jar):
    return round(sum(share * V[ORDERS[o].index(jar) + 1] * 0.8 * APPEAL[jar] for o, share in ORDER_SHARE.items()))


OPENS = {jar: jar_opens(jar) for jar in lineup}
CUPS = {jar: round(OPENS[jar] * SAVE_RATE[jar]) for jar in lineup}


def stamp(day):
    return (datetime(2026, 12, 1, tzinfo=timezone.utc) + timedelta(days=day)).strftime("%Y-%m-%dT%H:%M:%SZ")


def csv(rows):
    return "\n".join(",".join(str(c) for c in row) for row in rows)


def daily(columns, value):
    return csv([["time", *columns]] + [[stamp(d), *value(d)] for d in DAYS])


def roaster_clicks():
    clicks = {}
    for jar, entry in lineup.items():
        slug = entry.get("roasterSlug")
        if slug:
            clicks[slug] = clicks.get(slug, 0) + round(OPENS[jar] * 0.05 * APPEAL[jar]) + random.randint(0, 3)
    return sorted(clicks.items(), key=lambda kv: -kv[1])


MOCK = {
    "Calendar visitors": [csv([["Value"], [412]])],
    "Jars opened": [csv([["Value"], [sum(OPENS.values())]])],
    "Cups logged": [csv([["Value"], [sum(CUPS.values())]])],
    "Accounts from the save prompt": [csv([["Value"], [21]])],
    "Calendar visitors per day": [daily(["visitors"], lambda d: [V[d]])],
    "Jars opened per day, by timing": [daily(["today", "catchup", "early"], lambda d: TIMING[d].values())],
    "Cups logged per day": [daily(["cups"], lambda d: [round(sum(TIMING[d].values()) * 0.11)])],
    "Engagement by jar": [
        csv([["event_data_jar", "Value #A"]] + [[j, OPENS[j]] for j in lineup]),
        csv([["event_data_jar", "Value #B"]] + [[j, CUPS[j]] for j in lineup]),
        csv([["event_data_jar", "Value #C"]] + [[j, RATING[j]] for j in lineup]),
        csv([["event_data_jar", "Value #D"]] + [[j, round(OPENS[j] * 0.22)] for j in lineup if HAS_VIDEO[j]]),
    ],
    "Roaster link clicks": [csv([["event_data_roaster", "Value"]] + roaster_clicks())],
    "Order chosen": [csv([["event_data_order", "Value"], ["curated", 76], ["geo", 19], ["founded", 12]])],
    "Save prompt funnel": [csv([["Value"], [58]]), csv([["Value"], [21]])],
    "Opening jars early": [csv([["Value"], [n]]) for n in (143, 24, 39, 31)],
}

dashboard = json.loads((HERE / "advent-calendar.json").read_text())
dashboard["metadata"]["name"] = "pgh-coffee-advent-calendar-mock"
spec = dashboard["spec"]
spec["title"] = "Advent calendar engagement (mock data)"
spec["templating"]["list"] = []
spec["time"] = {"from": "2026-11-28T00:00:00.000Z", "to": "2027-01-01T00:00:00.000Z"}

for panel in spec["panels"]:
    if panel["type"] == "row":
        continue
    frames = MOCK[panel["title"]]
    panel["datasource"] = TESTDATA
    panel["targets"] = [
        {"datasource": TESTDATA, "refId": t["refId"], "scenarioId": "csv_content", "csvContent": frame}
        for t, frame in zip(panel["targets"], frames)
    ]

(HERE / "mock" ).mkdir(exist_ok=True)
(HERE / "mock" / "advent-calendar-mock.json").write_text(json.dumps(dashboard, indent=2) + "\n")
