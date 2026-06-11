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

- Use **lowercase** and **underscores** only.
- `<route_name>` should match the eventual shape basename (without `shape_` prefix).

Examples:

- `tokyo_monorail_overpass.geojson`
- `keikyu_airport_overpass.geojson`
- `jr_haruka_overpass.geojson`
- `keisei_skyliner_overpass.geojson`

Optional: include OSM relation id in **Notes** or the metadata template, not in the filename.

## Metadata template

Copy `TEMPLATE.md` beside each new export (e.g. `jr_haruka_overpass.md`) or paste its fields into the **Notes** column above.

## Notes

- Files here are **temporary source data**. Treat them as disposable once shapes are generated, validated, and merged.
- Do not edit GeoJSON manually unless fixing a clear export issue.
- **Production replay** should only use finalized files under `data/shapes/`, not this directory.
