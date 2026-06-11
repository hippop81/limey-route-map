# Raw GeoJSON workspace

Temporary source files exported from [Overpass Turbo](https://overpass-turbo.eu/). These are inputs for the shape conversion pipeline—not used directly by the Limey Route Map replay engine.

## Pipeline

```
Antigravity
  → Overpass Query
  → User exports GeoJSON
  → data/raw-geojson/
  → Cursor reads repository file
  → scripts/geojson-route-to-shape.py
  → data/shapes/
  → Replay Engine
```

## Workflow

1. **Antigravity** generates an Overpass query for the target route.
2. **You** run the query in Overpass Turbo.
3. **You** export the result as GeoJSON.
4. **You** save the file under `data/raw-geojson/` using the naming convention below (commit when ready).
5. **Cursor** reads the GeoJSON from the repository—no need to paste large exports into chat.
6. **Cursor** converts GeoJSON into Limey GTFS-style shape files (`scripts/geojson-route-to-shape.py`).
7. **Validated output** is written to `data/shapes/` (e.g. `data/shapes/airport-access/`).

## Current dataset

Track every file in this directory. Update the table when status changes.

| File | Category | Status | Shape output | Notes |
| ---- | -------- | ------ | ------------ | ----- |
| _(none yet)_ | — | — | — | Add a row when the first export is committed |

### Status values

| Status | Meaning |
| ------ | ------- |
| 🆕 Exported | GeoJSON saved here; not yet picked up for conversion |
| 🔄 Converting | Cursor/agent is running conversion or validation |
| ✅ Converted | Shape file written under `data/shapes/`; validation passed |
| 🚀 Merged | Shape merged to main/production branch; raw file may be removed |

Move files through the pipeline in order: **Exported → Converting → Converted → Merged**.

## Naming convention

```
<route_name>_overpass.geojson
```

Include the route name and optionally the OSM relation id in the filename when helpful.
## Current Dataset

| File                                      | Category       | Status      | Shape Output                   | Notes                           |
| ----------------------------------------- | -------------- | ----------- | ------------------------------ | ------------------------------- |
| `tokyo_monorail_overpass.geojson`         | Airport Access | ✅ Converted | `shape_tokyo_monorail`         | Haneda access                   |
| `keikyu_airport_overpass.geojson`         | Airport Access | ✅ Converted | `shape_keikyu_airport`         | Coordinate typo fixed (139.xxx) |
| `nankai_airport_overpass.geojson`         | Airport Access | ✅ Converted | `shape_nankai_airport`         | KIX access                      |
| `fukuoka_subway_airport_overpass.geojson` | Airport Access | ✅ Converted | `shape_fukuoka_subway_airport` | Fukuoka Airport                 |

### Status meanings

* 🆕 Exported — GeoJSON exported from Overpass, not yet converted.
* 🔄 Converting — Cursor/Codex currently processing.
* ✅ Converted — Shape file generated and validated.
* 🚀 Merged — Shape file merged into `data/shapes/` and available to the replay engine.

### Naming Convention

```
<route_name>_overpass.geojson
```

Examples:

```
tokyo_monorail_overpass.geojson
keisei_skyliner_overpass.geojson
jr_haruka_overpass.geojson
hokuriku_shinkansen_overpass.geojson
```

Use lowercase with underscores for consistency.
