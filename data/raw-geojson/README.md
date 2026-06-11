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
