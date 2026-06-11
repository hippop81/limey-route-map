#!/usr/bin/env python3
"""Fetch an OSM route relation and write a minimal Overpass-style GeoJSON FeatureCollection."""

from __future__ import annotations

import argparse
import json
import math
import urllib.parse
import urllib.request
from pathlib import Path

OVERPASS_ENDPOINTS = (
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
)


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


def fetch_relation(relation_id: int) -> dict:
    query = f"[out:json][timeout:120];relation({relation_id});(._;>;);out geom;"
    payload = urllib.parse.urlencode({"data": query}).encode("utf-8")
    last_error: Exception | None = None
    for endpoint in OVERPASS_ENDPOINTS:
        try:
            req = urllib.request.Request(
                endpoint,
                data=payload,
                headers={"User-Agent": "limey-route-map/1.0"},
            )
            with urllib.request.urlopen(req, timeout=180) as resp:
                body = resp.read()
            data = json.loads(body)
            if "elements" in data:
                return data
        except Exception as exc:  # noqa: BLE001
            last_error = exc
    raise RuntimeError(f"Overpass fetch failed for relation {relation_id}") from last_error


def stitch_route_coords(relation: dict, ways: dict[int, dict]) -> list[list[float]]:
    route_way_ids = [
        member["ref"]
        for member in relation["members"]
        if member["type"] == "way" and member.get("role") in ("", None)
    ]
    coords: list[list[float]] = []
    for way_id in route_way_ids:
        geometry = ways[way_id]["geometry"]
        segment = [[point["lon"], point["lat"]] for point in geometry]
        if not coords:
            coords.extend(segment)
            continue
        last = coords[-1]
        if abs(segment[0][0] - last[0]) < 1e-6 and abs(segment[0][1] - last[1]) < 1e-6:
            coords.extend(segment[1:])
            continue
        if abs(segment[-1][0] - last[0]) < 1e-6 and abs(segment[-1][1] - last[1]) < 1e-6:
            coords.extend(reversed(segment[:-1]))
            continue
        d0 = haversine_km(last[1], last[0], segment[0][1], segment[0][0])
        d1 = haversine_km(last[1], last[0], segment[-1][1], segment[-1][0])
        if d1 < d0:
            coords.extend(reversed(segment))
        else:
            coords.extend(segment)
    return coords


def relation_to_feature_collection(data: dict) -> dict:
    relations = [element for element in data["elements"] if element["type"] == "relation"]
    if not relations:
        raise ValueError("no relation found in Overpass response")
    relation = relations[0]
    ways = {
        element["id"]: element
        for element in data["elements"]
        if element["type"] == "way" and "geometry" in element
    }
    coords = stitch_route_coords(relation, ways)
    tags = relation.get("tags") or {}
    feature = {
        "type": "Feature",
        "properties": {
            "@id": f"relation/{relation['id']}",
            **tags,
        },
        "geometry": {
            "type": "LineString",
            "coordinates": coords,
        },
        "id": f"relation/{relation['id']}",
    }
    return {
        "type": "FeatureCollection",
        "generator": "fetch-route-geojson.py",
        "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
        "features": [feature],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch OSM route relation as GeoJSON")
    parser.add_argument("relation_id", type=int)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    data = fetch_relation(args.relation_id)
    geojson = relation_to_feature_collection(data)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(geojson, ensure_ascii=False, indent=2), encoding="utf-8")
    coords = geojson["features"][0]["geometry"]["coordinates"]
    print(
        json.dumps(
            {
                "relation_id": args.relation_id,
                "output": str(args.out),
                "points": len(coords),
                "name": geojson["features"][0]["properties"].get("name:ja")
                or geojson["features"][0]["properties"].get("name"),
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
