# Airport Access Shape Validation Report

## tokyo_monorail.txt
- **Source:** `shapes_tokyo_monorail_27da.txt`
- **Points:** 60
- **Median step:** 0.026 km (outlier threshold: 15.00 km)
- **Corrected:** 0
- **Warnings:** 21
  - seq 8: duplicate coordinates of previous point
  - seq 12: duplicate coordinates of previous point
  - seq 15: duplicate coordinates of previous point
  - seq 17: duplicate coordinates of previous point
  - seq 19: duplicate coordinates of previous point
  - seq 22: duplicate coordinates of previous point
  - seq 25: duplicate coordinates of previous point
  - seq 28: duplicate coordinates of previous point
  - seq 32: duplicate coordinates of previous point
  - seq 36: duplicate coordinates of previous point
  - seq 38: duplicate coordinates of previous point
  - seq 40: duplicate coordinates of previous point
  - seq 42: duplicate coordinates of previous point
  - seq 44: duplicate coordinates of previous point
  - seq 46: duplicate coordinates of previous point
  - seq 48: duplicate coordinates of previous point
  - seq 50: duplicate coordinates of previous point
  - seq 52: duplicate coordinates of previous point
  - seq 54: duplicate coordinates of previous point
  - seq 56: duplicate coordinates of previous point
  - seq 58: duplicate coordinates of previous point
- **Output:** `data/shapes/airport-access/tokyo_monorail.txt`

## keikyu_airport.txt
- **Source:** `shapes_keikyu_airport_6ff7.txt`
- **Points:** 43
- **Median step:** 0.136 km (outlier threshold: 15.00 km)
- **Corrected:** 1
  - seq 16: lon `135.7355872` → `139.7355872` — lon integer typo 135.7355872 -> 139.7355872 (neighbors ~140)
- **Warnings (source, pre-fix):** 1 — seq 15 showed a 361 km jump to the bad seq 16 point; **resolved after correction** (cleaned max step 0.371 km)
- **Output:** `data/shapes/airport-access/keikyu_airport.txt`

## nankai_airport.txt
- **Source:** `shapes_nankai_airport_dc27.txt`
- **Points:** 35
- **Median step:** 0.162 km (outlier threshold: 15.00 km)
- **Corrected:** 0
- **Warnings:** 0
- **Output:** `data/shapes/airport-access/nankai_airport.txt`

## fukuoka_subway_airport.txt
- **Source:** `shapes_fukuoka_subway_e7d1.txt`
- **Points:** 74
- **Median step:** 0.166 km (outlier threshold: 15.00 km)
- **Corrected:** 0
- **Warnings:** 0
- **Output:** `data/shapes/airport-access/fukuoka_subway_airport.txt`

## meitetsu_airport.txt
- **Source:** `sources/meitetsu_airport.geojson` (OSM relation `11852485`, 常滑 → 中部国際空港)
- **Points:** 71
- **Median step:** 0.036 km (outlier threshold: 15.00 km)
- **Max step:** 0.675 km
- **Corrected:** 0
- **Warnings:** 0
- **Output:** `data/shapes/airport-access/meitetsu_airport.txt`

## osaka_monorail_itami.txt
- **Source:** `sources/osaka_monorail_itami.geojson` (OSM relation `6011645`, 門真市 → 大阪空港)
- **Points:** 704
- **Median step:** 0.018 km (outlier threshold: 15.00 km)
- **Max step:** 0.661 km
- **Corrected:** 0
- **Warnings:** 0
- **Output:** `data/shapes/airport-access/osaka_monorail_itami.txt`

## keisei_skyliner.txt
- **Source:** `sources/keisei_skyliner.geojson` (OSM relation `3120358`, 成田空港 → 京成上野)
- **Points:** 924
- **Median step:** 0.043 km (outlier threshold: 15.00 km)
- **Max step:** 0.491 km
- **Corrected:** 0
- **Warnings:** 0
- **Output:** `data/shapes/airport-access/keisei_skyliner.txt`

## jr_haruka.txt
- **Source:** `sources/jr_haruka.geojson` (OSM relation `18635200`, 特急はるか 関西空港 → 京都)
- **Points:** 1720
- **Median step:** 0.038 km (outlier threshold: 15.00 km)
- **Max step:** 2.116 km
- **Corrected:** 0
- **Warnings:** 0
- **Output:** `data/shapes/airport-access/jr_haruka.txt`

## Summary
- **Total points:** 3631
- **Total corrected:** 1
- **Total warnings:** 22

### All warnings
- tokyo_monorail.txt: seq 8: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 12: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 15: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 17: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 19: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 22: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 25: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 28: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 32: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 36: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 38: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 40: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 42: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 44: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 46: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 48: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 50: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 52: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 54: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 56: duplicate coordinates of previous point
- tokyo_monorail.txt: seq 58: duplicate coordinates of previous point
_Note: Keikyu seq 15 “large jump” warning was caused by the seq 16 typo; no warnings remain after normalization._
