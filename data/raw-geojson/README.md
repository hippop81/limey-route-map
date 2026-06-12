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
6. **Cursor** converts GeoJSON into Limey GTFS-style shape files (`scripts/geojson-route-to-shape.py` or `scripts/batch-convert-raw-geojson.py`).
7. **Validated output** is written to `data/shapes/` (see `data/shapes/CONVERSION_REPORT.json`).

## Current dataset

Track every file in this directory. Update the table when status changes.

| File | Category | Status | Shape output | Notes |
| ---- | -------- | ------ | ------------ | ----- |
| `fukuoka_subway_airport_overpass.geojson` | airport_access | 🚀 Merged | `shape_fukuoka_subway_airport` | `airport-access/fukuoka_subway_airport.txt` |
| `jr_haruka_overpass.geojson` | airport_access | 🚀 Merged | `shape_jr_haruka` | `airport-access/jr_haruka.txt` (sources/) |
| `jrc_tokaido_shinkansen_overpass_geojson` | shinkansen | ✅ Converted | `shape_jrc_tokaido_shinkansen` | `jrc/jrc_tokaido_shinkansen.txt` — OSM 5263977 |
| `jre_chuo_sobu_local_overpass.geojson` | local_rail | ✅ Converted | `shape_jre_chuo_sobu_local` | `jre/jre_chuo_sobu_local.txt` — 千葉=>三鷹 |
| `jre_hokuriku_shinkansen_overpass.geojson` | shinkansen | ✅ Converted ⚠️ | `shape_jre_hokuriku_shinkansen` | `jre/jre_hokuriku_shinkansen.txt` — OSM gap seq 3718 |
| `jre_joetsu_shinkansen_overpass.geojson` | shinkansen | ✅ Converted | `shape_jre_joetsu_shinkansen` | `jre/jre_joetsu_shinkansen.txt` |
| `jre_keihin_tohoku_line_overpass.geojson` | local_rail | ✅ Converted | `shape_jre_keihin_tohoku_line` | `jre/jre_keihin_tohoku_line.txt` |
| `jre_keiyo_line_overpass.geojson` | local_rail | ✅ Converted | `shape_jre_keiyo_line` | `jre/jre_keiyo_line.txt` |
| `jre_narita_express_overpass.geojson` | airport_access | ✅ Converted | `shape_jre_narita_express` | `airport-access/jre_narita_express.txt` — 成田空港→大宮 |
| `jre_senseki_line_overpass.geojson` | local_rail | ✅ Converted | `shape_jre_senseki_line` | `jre/jre_senseki_line.txt` |
| `jre_tohoku_shinkansen_overpass.geojson` | shinkansen | ✅ Converted | `shape_jre_tohoku_shinkansen` | `jre/jre_tohoku_shinkansen.txt` |
| `jre_utsunomiya_takasaki_saikyo_lines_overpass.geojson` | local_rail | ✅ Converted | `shape_jre_utsunomiya_takasaki_saikyo_lines` | `jre/jre_utsunomiya_takasaki_saikyo_lines.txt` — 高崎線のみ |
| `jre_yamanote_line_overpass.geojson` | local_rail | ✅ Converted | `shape_jre_yamanote_line` | `jre/jre_yamanote_line.txt` — 内回り |
| `jre_yokohama_line_overpass.geojson` | local_rail | ✅ Converted | `shape_jre_yokohama_line` | `jre/jre_yokohama_line.txt` |
| `jre_yokosuka_line_overpass.geojson` | local_rail | ✅ Converted | `shape_jre_yokosuka_line` | `jre/jre_yokosuka_line.txt` |
| `jrk_kyusyu_shinkansen_overpass.geojson` | shinkansen | ✅ Converted | `shape_jrk_kyusyu_shinkansen` | `jrk/jrk_kyusyu_shinkansen.txt` |
| `jrw_osakaloop_line_overpass.geojson` | local_rail | ✅ Converted | `shape_jrw_osakaloop_line` | `jrw/jrw_osakaloop_line.txt` — JR大阪環状線 |
| `jrw_sanyo_shinkansen_overpass.geojson` | shinkansen | ✅ Converted | `shape_jrw_sanyo_shinkansen` | `jrw/jrw_sanyo_shinkansen.txt` |
| `keikyu_airport_overpass.geojson` | airport_access | 🚀 Merged | `shape_keikyu_airport` | `airport-access/keikyu_airport.txt` |
| `keio_line_overpass.geojson` | local_rail | ✅ Converted | `shape_keio_line` | `keio/keio_line.txt` |
| `keisei_skyliner_overpass.geojson` | airport_access | 🚀 Merged | `shape_keisei_skyliner` | `airport-access/keisei_skyliner.txt` (sources/) |
| `meitetsu_airport_overpass.geojson` | airport_access | 🚀 Merged | `shape_meitetsu_airport` | `airport-access/meitetsu_airport.txt` (sources/) |
| `nankai_airport_overpass.geojson` | airport_access | 🚀 Merged | `shape_nankai_airport` | `airport-access/nankai_airport.txt` |
| `osaka_monorail_itami_overpass.geojson` | airport_access | 🚀 Merged | `shape_osaka_monorail_itami` | `airport-access/osaka_monorail_itami.txt` (sources/) |
| `sapporo_namboku_line_overpass.geojson` | subway | ✅ Converted | `shape_sapporo_namboku_line` | `sapporo/sapporo_namboku_line.txt` |
| `sapporo_toho_line_overpass.geojson` | subway | ✅ Converted | `shape_sapporo_toho_line` | `sapporo/sapporo_toho_line.txt` |
| `sapporo_tozai_line_overpass.geojson` | subway | ✅ Converted | `shape_sapporo_tozai_line` | `sapporo/sapporo_tozai_line.txt` |
| `toei_arakawa_line_overpass.geojson` | subway | ✅ Converted | `shape_toei_arakawa_line` | `toei/toei_arakawa_line.txt` |
| `toei_asakusa_line_overpass.geojson` | subway | ✅ Converted | `shape_toei_asakusa_line` | `toei/toei_asakusa_line.txt` |
| `toei_mita_line_overpass.geojson` | subway | ✅ Converted | `shape_toei_mita_line` | `toei/toei_mita_line.txt` |
| `toei_oedo_line_overpass.geojson` | subway | ✅ Converted | `shape_toei_oedo_line` | `toei/toei_oedo_line.txt` |
| `toei_shinjuku_line_overpass.geojson` | subway | ✅ Converted | `shape_toei_shinjuku_line` | `toei/toei_shinjuku_line.txt` |
| `tokyo_monorail_overpass.geojson` | airport_access | 🚀 Merged | `shape_tokyo_monorail` | `airport-access/tokyo_monorail.txt` |
| `tokyometro_marunouchi_line_overpass.geojson` | subway | ✅ Converted | `shape_tokyometro_marunouchi_line` | `tokyometro/tokyometro_marunouchi_line.txt` |
| `yokohama_blue_line_overpass.geojson` | subway | ✅ Converted | `shape_yokohama_blue_line` | `yokohama/yokohama_blue_line.txt` |
| `yokohama_minatomirai_line_overpass.geojson` | subway | ✅ Converted | `shape_yokohama_minatomirai_line` | `yokohama/yokohama_minatomirai_line.txt` — re-fetched OSM 1905260 |
| `yurito_line_overpass.geojson` | bus | ✅ Converted | `shape_yurito_line` | `bus/yurito_line.txt` |

**Summary:** 29 raw exports in this folder — all **✅ Converted**. Eight legacy airport-access shapes are **🚀 Merged** (converted before this workspace; GeoJSON in `shapes/airport-access/sources/` or pre-workspace).

### Status values

| Status | Meaning |
| ------ | ------- |
| 🆕 Exported | GeoJSON saved here; not yet picked up for conversion |
| 🔄 Converting | Cursor/agent is running conversion or validation |
| ✅ Converted | Shape file written under `data/shapes/`; validation passed |
| ✅ Converted ⚠️ | Shape written; known validation warning (see Notes) |
| 🚀 Merged | Shape on main/production branch; raw file may be removed later |

Move files through the pipeline in order: **Exported → Converting → Converted → Merged**.

## Naming convention

```
<route_name>_overpass.geojson
```

- Use **lowercase** and **underscores** only.
- `<route_name>` should match the eventual shape basename (without `shape_` prefix).

Examples:

- `jre_yamanote_line_overpass.geojson`
- `jrc_tokaido_shinkansen_overpass.geojson`
- `toei_oedo_line_overpass.geojson`

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
- Batch conversion details: `data/shapes/CONVERSION_REPORT.json` and `data/shapes/VALIDATION_SUMMARY.md`.
