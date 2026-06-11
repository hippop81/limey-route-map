#!/usr/bin/env python3
"""Lightweight QA for airport-access GTFS shape CSV files."""

from __future__ import annotations

import argparse
import csv
import math
from pathlib import Path

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


def read_shapes(path: Path) -> list[dict]:
    with path.open(newline="") as f:
        rows = [
            {
                "shape_id": r["shape_id"].strip(),
                "lat": float(r["shape_pt_lat"]),
                "lon": float(r["shape_pt_lon"]),
                "seq": int(r["shape_pt_sequence"]),
            }
            for r in csv.DictReader(f)
        ]
    rows.sort(key=lambda x: x["seq"])
    return rows


def write_shapes(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["shape_id", "shape_pt_lat", "shape_pt_lon", "shape_pt_sequence"])
        for r in rows:
            w.writerow([r["shape_id"], f"{r['lat']:.7f}", f"{r['lon']:.7f}", r["seq"]])


def try_lon_typo_fix(lon: float, prev_lon: float | None, next_lon: float | None):
    if prev_lon is None or next_lon is None:
        return None, None
    prev_i = int(round(prev_lon))
    next_i = int(round(next_lon))
    lon_i = int(round(lon))
    if prev_i == next_i and lon_i != prev_i:
        fixed = prev_i + (lon - lon_i)
        return fixed, f"lon integer typo {lon} -> {fixed} (neighbors ~{prev_i})"
    return None, None


def validate_file(src: Path, dst: Path) -> dict:
    rows = read_shapes(src)
    steps = [
        haversine_km(rows[i - 1]["lat"], rows[i - 1]["lon"], rows[i]["lat"], rows[i]["lon"])
        for i in range(1, len(rows))
    ]
    median_step = sorted(steps)[len(steps) // 2] if steps else 0.0
    threshold = max(MAX_STEP_KM, median_step * OUTLIER_FACTOR)
    corrections: list[dict] = []
    warnings: list[str] = []

    for i, row in enumerate(rows):
        prev = rows[i - 1] if i else None
        nxt = rows[i + 1] if i < len(rows) - 1 else None
        lat, lon = row["lat"], row["lon"]

        if not (JAPAN_LAT[0] <= lat <= JAPAN_LAT[1] and JAPAN_LON[0] <= lon <= JAPAN_LON[1]):
            warnings.append(f"seq {row['seq']}: outside Japan bounds ({lat}, {lon})")

        d_prev = haversine_km(prev["lat"], prev["lon"], lat, lon) if prev else 0.0
        d_next = haversine_km(lat, lon, nxt["lat"], nxt["lon"]) if nxt else 0.0
        outlier = (prev and d_prev > threshold) or (nxt and d_next > threshold)

        if outlier and prev and nxt:
            fixed_lon, reason = try_lon_typo_fix(lon, prev["lon"], nxt["lon"])
            if fixed_lon is not None:
                ndp = haversine_km(prev["lat"], prev["lon"], lat, fixed_lon)
                ndn = haversine_km(lat, fixed_lon, nxt["lat"], nxt["lon"])
                if ndp <= threshold and ndn <= threshold:
                    corrections.append(
                        {"seq": row["seq"], "field": "lon", "from": lon, "to": fixed_lon, "reason": reason}
                    )
                    row["lon"] = fixed_lon
                    lon = fixed_lon
                    outlier = False

        if outlier and prev and nxt:
            warnings.append(
                f"seq {row['seq']}: large jump (prev {d_prev:.2f} km, next {d_next:.2f} km)"
            )

        if prev and prev["lat"] == lat and prev["lon"] == lon:
            warnings.append(f"seq {row['seq']}: duplicate coordinates of previous point")

    write_shapes(dst, rows)
    return {
        "source": src.name,
        "points": len(rows),
        "median_step_km": median_step,
        "threshold_km": threshold,
        "corrections": corrections,
        "warnings": warnings,
        "output": str(dst),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate and normalize airport-access shapes")
    parser.add_argument("inputs", nargs="+", type=Path, help="Input shape CSV files")
    parser.add_argument("--out-dir", type=Path, default=Path("data/shapes/airport-access"))
    args = parser.parse_args()

    results = []
    for src in args.inputs:
        dst = args.out_dir / src.name
        results.append(validate_file(src, dst))

    total_points = sum(r["points"] for r in results)
    total_corrected = sum(len(r["corrections"]) for r in results)
    total_warnings = sum(len(r["warnings"]) for r in results)
    print(f"Validated {len(results)} file(s), {total_points} points, {total_corrected} corrected, {total_warnings} warnings")


if __name__ == "__main__":
    main()
