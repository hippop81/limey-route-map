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
| `narita_express_overpass.geojson` | airport_access | 🆕 Exported | `shape_narita_express` | 成田エクスプレス — `narita_express_overpass.md` |
| `chuo_sobu_local_overpass.geojson` | local_rail | 🆕 Exported | `shape_chuo_sobu_local` | 中央・総武線（各駅停車）— `chuo_sobu_local_overpass.md` |
| `yurito_line_overpass.geojson` | bus | 🆕 Exported | `shape_yurito_line` | ゆとりーとライン — `yurito_line_overpass.md` |
| `tokaido_shinkansen_overpass.geojson` | shinkansen | 🆕 Exported | `shape_tokaido_shinkansen` | 東海道新幹線 — relation/5263977 — `tokaido_shinkansen_overpass.md` |
| `tokyo_monorail_overpass.geojson` | airport_access | ✅ Converted | `shape_tokyo_monorail` | Haneda access |
| `keikyu_airport_overpass.geojson` | airport_access | ✅ Converted | `shape_keikyu_airport` | Coordinate typo fixed (139.xxx) |
| `nankai_airport_overpass.geojson` | airport_access | ✅ Converted | `shape_nankai_airport` | KIX access |
| `fukuoka_subway_airport_overpass.geojson` | airport_access | ✅ Converted | `shape_fukuoka_subway_airport` | Fukuoka Airport |
| `meitetsu_airport_overpass.geojson` | airport_access | ✅ Converted | `shape_meitetsu_airport` | Source in `shapes/airport-access/sources/` |
| `osaka_monorail_itami_overpass.geojson` | airport_access | ✅ Converted | `shape_osaka_monorail_itami` | Source in `shapes/airport-access/sources/` |
| `keisei_skyliner_overpass.geojson` | airport_access | ✅ Converted | `shape_keisei_skyliner` | Source in `shapes/airport-access/sources/` |
| `jr_haruka_overpass.geojson` | airport_access | ✅ Converted | `shape_jr_haruka` | Source in `shapes/airport-access/sources/` |

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
- `narita_express_overpass.geojson`
- `tokaido_shinkansen_overpass.geojson`

Optional: include OSM relation id in the paired metadata file or **Notes** column, not in the filename.

## Metadata template

Naming Convention

<operator>_<route_name>_overpass.geojson

Examples:
- jre_narita_express_overpass.geojson
- jre_chuo_sobu_local_overpass.geojson
- keisei_skyliner_overpass.geojson
- keikyu_airport_overpass.geojson
- tokyo_monorail_overpass.geojson

- Files here are **temporary source data**. Treat them as disposable once shapes are generated, validated, and merged.
- Do not edit GeoJSON manually unless fixing a clear export issue.
- **Production replay** should only use finalized files under `data/shapes/`, not this directory.
