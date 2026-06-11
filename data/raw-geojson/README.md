# Raw GeoJSON workspace

Temporary source files exported from [Overpass Turbo](https://overpass-turbo.eu/). These are inputs for the shape conversion pipeline—not used directly by the Limey Route Map replay engine.

## Workflow

1. **Antigravity** generates an Overpass query for the target route.
2. **You** run the query in Overpass Turbo.
3. **You** export the result as GeoJSON.
4. **You** save the file under `data/raw-geojson/` (commit it to the repo when ready).
5. **Cursor** reads the GeoJSON from the repository—no need to paste large exports into chat.
6. **Cursor** converts GeoJSON into Limey GTFS-style shape files (see `scripts/geojson-route-to-shape.py`).
7. **Validated output** is written to `data/shapes/` (e.g. `data/shapes/airport-access/`).

## Notes

- Files here are **temporary source data**. Treat them as disposable once shapes are generated and validated.
- Do not edit GeoJSON manually unless fixing a clear export issue.
- **Production replay** should only use finalized files under `data/shapes/`, not this directory.

## Suggested naming

Use a short, descriptive filename:

```
data/raw-geojson/jr_haruka_overpass.geojson
data/raw-geojson/keisei_skyliner_overpass.geojson
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
