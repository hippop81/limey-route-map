#!/usr/bin/env python3
"""Convert Overpass route GeoJSON (FeatureCollection) to GTFS shapes.txt CSV."""

from __future__ import annotations

import argparse
import csv
import json
import math
import sys
from pathlib import Path

# Reuse validation thresholds from validate-airport-shapes.py
JAPAN_LAT = (24.0, 46.5)
JAPAN_LON = (122.0, 154.0)
MAX_STEP_KM = 15.0
OUTLIER_FACTOR = 8.0


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    return r * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def is_route_feature(feature: dict) -> bool:
    geom = feature.get("geometry") or {}
    if geom.get("type") not in ("LineString", "MultiLineString"):
        return False
    props = feature.get("properties") or {}
    if props.get("type") == "route":
        return True
    if props.get("route") in ("train", "monorail", "light_rail", "subway"):
        return True
    return False


def extract_main_line_coords(feature: dict) -> list[list[float]]:
    geom = feature["geometry"]
    if geom["type"] == "LineString":
        return geom["coordinates"]
    if geom["type"] == "MultiLineString":
        segments = geom["coordinates"]
        if not segments:
            return []
        return max(segments, key=len)
    raise ValueError("unsupported geometry: " + geom.get("type", "?"))


def dedupe_lon_lat(coords: list[list[float]]) -> list[list[float]]:
    out: list[list[float]] = []
    for lon, lat in coords:
        if not out or lon != out[-1][0] or lat != out[-1][1]:
            out.append([lon, lat])
    return out


def try_lon_typo_fix(lon: float, prev_lon: float | None, next_lon: float | None):
    if prev_lon is None or next_lon is None:
        return None
    prev_i = int(round(prev_lon))
    next_i = int(round(next_lon))
    lon_i = int(round(lon))
    if prev_i == next_i and lon_i != prev_i:
        return prev_i + (lon - lon_i)
    return None


def validate_and_fix_points(points: list[tuple[float, float]]) -> tuple[list[tuple[float, float]], list[dict], list[str]]:
    """points: [(lat, lon), ...]"""
    corrections: list[dict] = []
    warnings: list[str] = []
    if len(points) < 2:
        return points, corrections, warnings

    steps = [
        haversine_km(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1])
        for i in range(1, len(points))
    ]
    median_step = sorted(steps)[len(steps) // 2]
    threshold = max(MAX_STEP_KM, median_step * OUTLIER_FACTOR)

    fixed = [list(p) for p in points]
    for i in range(len(fixed)):
        lat, lon = fixed[i][0], fixed[i][1]
        if not (JAPAN_LAT[0] <= lat <= JAPAN_LAT[1] and JAPAN_LON[0] <= lon <= JAPAN_LON[1]):
            warnings.append(f"seq {i + 1}: outside Japan bounds ({lat}, {lon})")

        prev = fixed[i - 1] if i else None
        nxt = fixed[i + 1] if i < len(fixed) - 1 else None
        d_prev = haversine_km(prev[0], prev[1], lat, lon) if prev else 0.0
        d_next = haversine_km(lat, lon, nxt[0], nxt[1]) if nxt else 0.0
        outlier = (prev and d_prev > threshold) or (nxt and d_next > threshold)

        if outlier and prev and nxt:
            fixed_lon = try_lon_typo_fix(lon, prev[1], nxt[1])
            if fixed_lon is not None:
                ndp = haversine_km(prev[0], prev[1], lat, fixed_lon)
                ndn = haversine_km(lat, fixed_lon, nxt[0], nxt[1])
                if ndp <= threshold and ndn <= threshold:
                    corrections.append(
                        {"seq": i + 1, "from": lon, "to": fixed_lon, "reason": "lon integer typo"}
                    )
                    fixed[i][1] = fixed_lon
                    outlier = False

        if outlier and prev and nxt:
            warnings.append(
                f"seq {i + 1}: large jump (prev {d_prev:.2f} km, next {d_next:.2f} km)"
            )

        if prev and prev[0] == lat and prev[1] == lon:
            warnings.append(f"seq {i + 1}: duplicate coordinates of previous point")

    return [(p[0], p[1]) for p in fixed], corrections, warnings


def pick_route_feature(features: list[dict], relation_id: str | None, name_substr: str | None) -> dict:
    routes = [f for f in features if is_route_feature(f)]
    if not routes:
        raise ValueError("no route LineString/MultiLineString features found")

    if relation_id:
        rid = relation_id if relation_id.startswith("relation/") else "relation/" + relation_id
        for f in routes:
            if f.get("properties", {}).get("@id") == rid:
                return f

    if name_substr:
        for f in routes:
            props = f.get("properties") or {}
            for key in ("name", "name:ja", "name:en"):
                val = props.get(key) or ""
                if name_substr in val:
                    return f

    return routes[0]


def convert(
    geojson_path: Path,
    shape_id: str,
    output_path: Path,
    relation_id: str | None = None,
    name_substr: str | None = None,
) -> dict:
    data = json.loads(geojson_path.read_text(encoding="utf-8"))
    features = data.get("features") or []
    feature = pick_route_feature(features, relation_id, name_substr)
    coords = dedupe_lon_lat(extract_main_line_coords(feature))
    points = [(lat, lon) for lon, lat in coords]
    points, corrections, warnings = validate_and_fix_points(points)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["shape_id", "shape_pt_lat", "shape_pt_lon", "shape_pt_sequence"])
        for i, (lat, lon) in enumerate(points, start=1):
            w.writerow([shape_id, f"{lat:.7f}", f"{lon:.7f}", i])

    steps = [
        haversine_km(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1])
        for i in range(1, len(points))
    ]
    max_step = max(steps) if steps else 0.0
    median_step = sorted(steps)[len(steps) // 2] if steps else 0.0

    return {
        "source": geojson_path.name,
        "shape_id": shape_id,
        "route": (feature.get("properties") or {}).get("name:ja")
        or (feature.get("properties") or {}).get("name"),
        "relation": (feature.get("properties") or {}).get("@id"),
        "points": len(points),
        "median_step_km": median_step,
        "max_step_km": max_step,
        "corrections": corrections,
        "warnings": warnings,
        "output": str(output_path),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert Overpass route GeoJSON to GTFS shapes CSV")
    parser.add_argument("geojson", type=Path)
    parser.add_argument("--shape-id", required=True, help="GTFS shape_id value")
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--relation-id", help="e.g. 11852485 or relation/11852485")
    parser.add_argument("--name-contains", help="Substring to match route name")
    args = parser.parse_args()

    result = convert(args.geojson, args.shape_id, args.out, args.relation_id, args.name_contains)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if any("large jump" in w for w in result["warnings"]):
        sys.exit(1)


if __name__ == "__main__":
    main()
