# Production shape files

GTFS `shapes.txt`-format CSV files used by the Limey Route Map replay engine.

## Layout

| Directory | Contents |
| --------- | -------- |
| `airport-access/` | Airport rail and express lines |
| `jre/` | JR East lines and JRE-operated shinkansen |
| `jrc/` | JR Central shinkansen |
| `jrk/` | JR Kyushu shinkansen |
| `jrw/` | JR West lines and shinkansen |
| `toei/` | Toei subway and tram |
| `tokyometro/` | Tokyo Metro |
| `yokohama/` | Yokohama municipal subway |
| `sapporo/` | Sapporo subway |
| `keio/` | Keio private railway |
| `bus/` | Bus routes (e.g. ゆとりーとライン) |

## Source pipeline

```
data/raw-geojson/*_overpass.geojson
  → scripts/geojson-route-to-shape.py (or scripts/batch-convert-raw-geojson.py)
  → data/shapes/<category>/*.txt
  → scripts/validate-airport-shapes.py
```

See `CONVERSION_REPORT.json` and `VALIDATION_SUMMARY.md` for the latest batch run.
