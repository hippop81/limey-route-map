#!/usr/bin/env python3
"""Convert all raw Overpass GeoJSON files under data/raw-geojson/ to GTFS shapes."""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

_spec = importlib.util.spec_from_file_location(
    "geojson_route_to_shape", Path(__file__).parent / "geojson-route-to-shape.py"
)
_gj = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_gj)
convert = _gj.convert

RAW_DIR = Path("data/raw-geojson")
SHAPES_ROOT = Path("data/shapes")

RELATION_OVERRIDES: dict[str, str] = {
    "jrc_tokaido_shinkansen_overpass_geojson": "5263977",
    "jre_narita_express_overpass.geojson": "11688429",
    "jre_yamanote_line_overpass.geojson": "1972960",
    "jrw_osakaloop_line_overpass.geojson": "1864758",
    "yokohama_blue_line_overpass.geojson": "7732276",
    "jre_chuo_sobu_local_overpass.geojson": "3351488",
    "jre_keihin_tohoku_line_overpass.geojson": "5195691",
    "jre_keiyo_line_overpass.geojson": "9474241",
    "jre_hokuriku_shinkansen_overpass.geojson": "1926393",
    "jre_joetsu_shinkansen_overpass.geojson": "1860557",
    "jre_tohoku_shinkansen_overpass.geojson": "9349293",
    "jrk_kyusyu_shinkansen_overpass.geojson": "1565609",
    "jrw_sanyo_shinkansen_overpass.geojson": "1837932",
    "toei_asakusa_line_overpass.geojson": "8019849",
    "toei_mita_line_overpass.geojson": "8019910",
    "toei_oedo_line_overpass.geojson": "8019883",
    "toei_shinjuku_line_overpass.geojson": "443259",
    "sapporo_namboku_line_overpass.geojson": "8000571",
    "sapporo_toho_line_overpass.geojson": "8000553",
    "sapporo_tozai_line_overpass.geojson": "1827997",
    "yokohama_minatomirai_line_overpass.geojson": "1905260",
}


def shape_output_path(geojson_name: str) -> tuple[Path, str]:
    base = geojson_name
    if base.endswith("_overpass.geojson"):
        stem = base[: -len("_overpass.geojson")]
    elif base.endswith("_overpass_geojson"):
        stem = base[: -len("_overpass_geojson")]
    else:
        stem = Path(base).stem

    shape_id = f"shape_{stem}"

    if stem == "jre_narita_express":
        return SHAPES_ROOT / "airport-access" / "jre_narita_express.txt", shape_id

    prefix = stem.split("_", 1)[0] if "_" in stem else "other"
    category_map = {
        "jre": "jre",
        "jrc": "jrc",
        "jrk": "jrk",
        "jrw": "jrw",
        "keio": "keio",
        "toei": "toei",
        "tokyometro": "tokyometro",
        "yokohama": "yokohama",
        "sapporo": "sapporo",
        "yurito": "bus",
    }
    subdir = category_map.get(prefix, "other")
    return SHAPES_ROOT / subdir / f"{stem}.txt", shape_id


def list_geojson_files() -> list[Path]:
    files: list[Path] = []
    for path in sorted(RAW_DIR.iterdir()):
        if not path.is_file():
            continue
        name = path.name
        if name.endswith("_overpass.geojson") or name.endswith("_overpass_geojson"):
            files.append(path)
    return files


def main() -> None:
    results: list[dict] = []
    failures: list[str] = []

    for path in list_geojson_files():
        name = path.name
        if name in SKIP_FILES:
            failures.append(f"{name}: skipped (no route geometry in export)")
            continue

        out_path, shape_id = shape_output_path(name)
        relation_id = RELATION_OVERRIDES.get(name)

        try:
            result = convert(path, shape_id, out_path, relation_id=relation_id)
            result["status"] = "ok" if not any("large jump" in w for w in result["warnings"]) else "warn"
            results.append(result)
            print(json.dumps(result, ensure_ascii=False))
        except Exception as exc:  # noqa: BLE001
            failures.append(f"{name}: {exc}")
            print(f"FAIL {name}: {exc}", file=sys.stderr)

    summary = {
        "converted": len(results),
        "failed": len(failures),
        "total_points": sum(r["points"] for r in results),
        "failures": failures,
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))

    report_path = SHAPES_ROOT / "CONVERSION_REPORT.json"
    report_path.write_text(
        json.dumps({"results": results, "summary": summary}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    if failures and not results:
        sys.exit(1)


if __name__ == "__main__":
    main()
