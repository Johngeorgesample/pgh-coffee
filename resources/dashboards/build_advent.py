import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = pathlib.Path(__file__).with_name("advent-calendar.json")
LOKI = {"type": "loki", "uid": "grafanacloud-logs"}

lineup = json.loads((ROOT / "data/advent.json").read_text())
JAR_NAMES = {str(d["day"]): {"text": f'{d["day"]:02d} · {d["roasterName"]}', "index": d["day"]} for d in lineup}


def events(name, extra=""):
    return (
        f'{{service_name="pgh-coffee", kind="event"}} |= "{name}" | logfmt '
        f'| event_name="{name}" | page_url=~"https?://$host.*"{extra}'
    )


def count(name, by="", window="$__range", extra=""):
    if by:
        return f"sum by ({by}) (count_over_time({events(name, extra)} [{window}]))"
    return f"sum(count_over_time({events(name, extra)} [{window}])) or vector(0)"


def target(expr, ref="A", legend="", instant=False):
    return {
        "datasource": LOKI,
        "refId": ref,
        "expr": expr,
        "legendFormat": legend,
        "queryType": "instant" if instant else "range",
        **({"instant": True, "range": False} if instant else {}),
    }


panel_id = 0


def panel(kind, title, description, grid, targets, **extra):
    global panel_id
    panel_id += 1
    return {
        "id": panel_id,
        "type": kind,
        "title": title,
        "description": description,
        "datasource": LOKI,
        "gridPos": dict(zip("xywh", grid)),
        "targets": targets,
        **extra,
    }


def row(title, y):
    global panel_id
    panel_id += 1
    return {"id": panel_id, "type": "row", "title": title, "collapsed": False, "gridPos": {"x": 0, "y": y, "w": 24, "h": 1}, "panels": []}


def stat(title, description, grid, expr, unit="short"):
    return panel(
        "stat", title, description, grid, [target(expr, instant=True)],
        options={"reduceOptions": {"calcs": ["lastNotNull"]}, "colorMode": "none", "graphMode": "none", "textMode": "value"},
        fieldConfig={"defaults": {"unit": "locale" if unit == "short" else unit, "noValue": "0", "decimals": 0}, "overrides": []},
    )


def daily_bars(title, description, grid, targets, stacked=True):
    return panel(
        "timeseries", title, description, grid, targets,
        interval="1d",
        fieldConfig={
            "defaults": {
                "unit": "short",
                "decimals": 0,
                "min": 0,
                "custom": {"drawStyle": "bars", "barAlignment": -1, "fillOpacity": 80, "lineWidth": 0, "stacking": {"mode": "normal" if stacked else "none"}},
            },
            "overrides": [],
        },
        options={"legend": {"displayMode": "list", "placement": "bottom"}, "tooltip": {"mode": "multi", "sort": "desc"}},
    )


def named(names):
    return [{"matcher": {"id": "byFrameRefID", "options": ref}, "properties": [{"id": "displayName", "value": name}]} for ref, name in names.items()]


def totals_bargauge(title, description, grid, names, label=None):
    targets = [target(expr, ref, instant=True) for ref, (_, expr) in zip("ABCDEF", names)]
    overrides = named({ref: name for ref, (name, _) in zip("ABCDEF", names)}) if not label else []
    display = {"displayName": f"${{__data.fields.{label}}}"} if label else {}
    return panel(
        "bargauge", title, description, grid, targets,
        options={"orientation": "horizontal", "displayMode": "basic", "showUnfilled": True, "valueMode": "text", "namePlacement": "left",
                 "sizing": "manual", "maxVizHeight": 22, "minVizHeight": 16, "text": {"titleSize": 13, "valueSize": 18},
                 "reduceOptions": {"calcs": ["lastNotNull"], "values": bool(label)}},
        fieldConfig={"defaults": {"unit": "locale", "decimals": 0, "color": {"mode": "fixed", "fixedColor": "#FDE047"}, "min": 0, **display},
                     "overrides": overrides},
    )


def pie(title, description, grid, expr, label):
    return panel(
        "piechart", title, description, grid, [target(expr, instant=True)],
        options={"pieType": "donut", "legend": {"displayMode": "table", "placement": "right", "values": ["value", "percent"]},
                 "reduceOptions": {"calcs": ["lastNotNull"], "values": True}},
        fieldConfig={"defaults": {"unit": "locale", "decimals": 0, "displayName": f"${{__data.fields.{label}}}"}, "overrides": []},
    )


def jar_table(grid):
    jar = "event_data_jar"
    rated = ' | event_data_rating > 0'
    targets = [
        target(count("AdventJarOpened", jar), "A", instant=True),
        target(count("AdventCupSaved", jar), "B", instant=True),
        target(f'avg by ({jar}) (avg_over_time({events("AdventCupSaved", rated)} | unwrap event_data_rating [$__range]))', "C", instant=True),
        target(count("AdventBrewVideoPlayed", jar), "D", instant=True),
    ]
    column = lambda name, unit="locale", decimals=0, **custom: {
        "matcher": {"id": "byName", "options": name},
        "properties": [{"id": "unit", "value": unit}, {"id": "decimals", "value": decimals}]
        + [{"id": f"custom.{k}", "value": v} for k, v in custom.items()],
    }
    gauge = {"type": "gauge", "mode": "basic", "valueDisplayMode": "text"}
    return panel(
        "table",
        "Engagement by jar",
        "One row per jar, labelled with its roaster. Opens follow where a jar falls in the month as much as the brand, "
        "so compare brands on save rate and rating, which don't depend on how many people were around that day. "
        "Jars sit on different days in the North-to-south and Oldest-first orders, which also helps separate brand from date.",
        grid,
        targets,
        transformations=[
            {"id": "merge", "options": {}},
            {"id": "organize", "options": {
                "excludeByName": {"Time": True},
                "renameByName": {jar: "Jar", "Value #A": "Opened", "Value #B": "Cups logged", "Value #C": "Avg rating", "Value #D": "Video plays"},
            }},
            {"id": "calculateField", "options": {
                "mode": "binary", "alias": "Save rate",
                "binary": {"left": {"matcher": {"id": "byName", "options": "Cups logged"}}, "operator": "/",
                           "right": {"matcher": {"id": "byName", "options": "Opened"}}},
            }},
            {"id": "sortBy", "options": {"sort": [{"field": "Opened", "desc": True}]}},
        ],
        fieldConfig={
            "defaults": {"noValue": "–", "color": {"mode": "fixed", "fixedColor": "#FDE047"}, "min": 0},
            "overrides": [
                {"matcher": {"id": "byName", "options": "Jar"},
                 "properties": [{"id": "mappings", "value": [{"type": "value", "options": JAR_NAMES}]}, {"id": "custom.width", "value": 240}, {"id": "custom.align", "value": "left"}]},
                column("Opened", **{"cellOptions": gauge}),
                {**(c := column("Save rate", "percentunit", 0, **{"cellOptions": gauge})), "properties": c["properties"] + [{"id": "max", "value": 0.25}]},
                column("Avg rating", "none", 1),
            ],
        },
        options={"showHeader": True, "cellHeight": "sm", "footer": {"show": False}},
    )


panels = [
    row("Engagement through the month", 0),
    stat("Calendar visitors", "Distinct browser sessions that loaded any /advent page in the time range.", (0, 1, 6, 4),
         f'count(sum by (session_id) (count_over_time({{service_name="pgh-coffee", kind="event"}} | logfmt | page_id=~"/advent.*" | page_url=~"https?://$host.*" [$__range])))'),
    stat("Jars opened", "First visits to a jar's page. Revisits aren't counted.", (6, 1, 6, 4), count("AdventJarOpened")),
    stat("Cups logged", "Tasting notes saved to an account.", (12, 1, 6, 4), count("AdventCupSaved")),
    stat("Accounts from the save prompt", "Visitors who were asked to sign in to save a cup and came back signed in.", (18, 1, 6, 4), count("AdventSaveAuthCompleted")),
    daily_bars(
        "Calendar visitors per day",
        "Distinct sessions that loaded an /advent page each day. Your shape check: strong start, a mid-month dip, and how far it recovers by the 25th. Days are UTC, so a bar starts at 7pm Pittsburgh time.",
        (0, 5, 24, 8),
        [target('count(sum by (session_id) (count_over_time({service_name="pgh-coffee", kind="event"} | logfmt | page_id=~"/advent.*" | page_url=~"https?://$host.*" [1d])))', legend="visitors")],
        stacked=False,
    ),
    daily_bars(
        "Jars opened per day, by timing",
        "today = opened on its day, catchup = an earlier jar opened late, early = opened before its day. Lots of catch-up late in the month means people are coming back after a gap.",
        (0, 13, 12, 8),
        [target(count("AdventJarOpened", "event_data_timing", "1d"), legend="{{event_data_timing}}")],
    ),
    daily_bars(
        "Cups logged per day",
        "Tasting notes saved each day: the deepest form of engagement on the page.",
        (12, 13, 12, 8),
        [target(count("AdventCupSaved", window="1d"), legend="cups")],
        stacked=False,
    ),
    row("Which brands drive engagement", 21),
    jar_table((0, 22, 16, 27)),
    totals_bargauge(
        "Roaster link clicks",
        "Clicks from the calendar through to a roaster's page on the map, from the roster sidebar or a jar's page.",
        (16, 22, 8, 27),
        [("", count("AdventRoasterClicked", "event_data_roaster"))],
        label="event_data_roaster",
    ),
    row("Orders and sign-ups", 49),
    pie("Order chosen", "Which order visitors locked in. Useful for deciding whether next year needs more than one.", (0, 50, 8, 8),
        count("AdventOrderChosen", "event_data_order"), "event_data_order"),
    totals_bargauge(
        "Save prompt funnel",
        "Signed-out visitors asked to save a cup, and how many came back signed in.",
        (8, 50, 8, 8),
        [("Asked to save", count("AdventSavePrompted")),
         ("Signed in and saved", count("AdventSaveAuthCompleted"))],
    ),
    totals_bargauge(
        "Opening jars early",
        "Taps on jars that aren't open yet, and what people did at the spoiler warning.",
        (16, 50, 8, 8),
        [("Tapped a sealed jar", count("AdventSealedJarTapped")),
         ("Opened anyway at the spoiler warning", count("AdventSpoilerWarning", extra=' | event_data_choice="accept"')),
         ("Backed off at the spoiler warning", count("AdventSpoilerWarning", extra=' | event_data_choice="cancel"')),
         ("Backed out of choosing an order", count("AdventOrderBackedOut"))],
    ),
]

dashboard = {
    "apiVersion": "dashboard.grafana.app/v1beta1",
    "kind": "Dashboard",
    "metadata": {"name": "pgh-coffee-advent-calendar", "annotations": {"grafana.app/folder": "pgh-coffee"}},
    "spec": {
        "title": "Advent calendar engagement",
        "tags": ["pgh-coffee", "advent"],
        "timezone": "America/New_York",
        "schemaVersion": 39,
        "time": {"from": "2026-11-28T00:00:00.000Z", "to": "2026-12-31T23:59:59.000Z"},
        "templating": {"list": [{
            "type": "custom", "name": "host", "label": "Site",
            "query": "pgh.coffee,localhost:3000",
            "current": {"text": "pgh.coffee", "value": "pgh.coffee"},
            "options": [{"text": v, "value": v, "selected": v == "pgh.coffee"} for v in ["pgh.coffee", "localhost:3000"]],
        }]},
        "panels": panels,
    },
}

OUT.write_text(json.dumps(dashboard, indent=2) + "\n")
print(OUT)
