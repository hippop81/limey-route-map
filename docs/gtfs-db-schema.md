# gtfs_db.json schema

`gtfs_db.json` is a preprocessed GTFS drawing database for Limey Route Replay.
It is intentionally lighter than full GTFS because the runtime only needs route
geometry and enough route metadata to choose a plausible shape.

Generate it with:

```sh
node scripts/build-gtfs-db.js --input ./gtfs --output ./gtfs_db.json --pretty
```

Or with explicit files:

```sh
node scripts/build-gtfs-db.js \
  --shapes ./gtfs/shapes.txt \
  --routes ./gtfs/routes.txt \
  --trips ./gtfs/trips.txt \
  --output ./gtfs_db.json \
  --pretty
```

## Recommended schema

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-05-31T00:00:00.000Z",
  "generator": {
    "name": "limey-route-replay-gtfs-preprocessor",
    "coordinateOrder": "lat_lng",
    "coordinatePrecision": 6
  },
  "source": {
    "shapes": "shapes.txt",
    "routes": "routes.txt",
    "trips": "trips.txt"
  },
  "stats": {
    "routeCount": 1,
    "tripCount": 2,
    "shapeCount": 1,
    "pointCount": 128,
    "skippedPointCount": 0,
    "tripsWithoutShape": 0,
    "tripsWithMissingShape": 0
  },
  "routes": {
    "117": {
      "routeId": "117",
      "shortName": "117",
      "longName": "Highway Bus",
      "type": 3,
      "color": "#007A8A",
      "textColor": "#FFFFFF"
    }
  },
  "shapes": {
    "shape_557_1": {
      "points": [
        [26.124, 127.665],
        [26.19584, 127.64686]
      ],
      "routeId": "383",
      "routeName": "ゆいレール",
      "transportType": "train_local"
    },
    "shape_424_1": {
      "points": [
        [26.195, 127.646],
        [26.694, 127.878]
      ],
      "routeId": "424",
      "routeName": "リゾートライナーA",
      "transportType": "shuttle"
    }
  },
  "shapeToRoute": {
    "shape_117_northbound": [
      {
        "routeId": "117",
        "routeShortName": "117",
        "routeLongName": "Highway Bus",
        "routeType": 3,
        "routeColor": "#007A8A",
        "routeTextColor": "#FFFFFF",
        "directionIds": ["0"],
        "tripCount": 12,
        "exampleTripIds": ["117_weekday_0921"]
      }
    ]
  },
  "routeToShapes": {
    "117": {
      "shapeIds": ["shape_117_northbound"],
      "directions": {
        "0": ["shape_117_northbound"]
      }
    }
  }
}
```

## Field notes

- `schemaVersion`: bump when runtime field names or coordinate semantics change.
- `shapes[shapeId].points`: ordered `[lat, lng]` pairs from `shapes.txt`, sorted by
  `shape_pt_sequence`. This order matches current Leaflet usage in the app.
- `shapes[shapeId].routeId`: the primary route for this shape, selected from
  `trips.txt` by highest trip count. This is intentionally duplicated here so the
  replay runtime can resolve a shape with a single lookup.
- `shapes[shapeId].routeName`: display name for the primary route, preferring
  `route_long_name`, then `route_short_name`, then `route_id`.
- `shapes[shapeId].transportType`: Route Replay transport type inferred from route
  name and GTFS `route_type`, for example `train_local`, `shuttle`, `bus_express`,
  `bus_local`, or `ferry`. OAS-style `エアポートライナー` names are treated as `shuttle` for replay purposes.
- `shapeToRoute`: secondary index for debugging and ambiguous cases where a shape
  is shared by multiple routes. It is built through `trips.txt`, not by guessing
  from `shape_id`.
- `routeToShapes`: runtime-friendly reverse index for "I know route and direction,
  which shapes are available?".
- `directionIds`: copied from `trips.txt.direction_id`. It is useful for filtering,
  but it should not be treated as one-to-one with a shape.
- `exampleTripIds`: limited debug hints. Keep these small; the replay runtime should
  not depend on exhaustive trip storage for the Okinawa MVP.

## Stop A to Stop B selection without stop_times.txt

This MVP database does not contain stop order, so it cannot prove that a shape
passes Stop A before Stop B. Runtime shape selection should therefore be:

1. If a segment already has `shapeId`, use it.
2. Else, filter by `routeId` using `routeToShapes`.
3. If `directionId` is known, prefer shapes under that direction.
4. Pick the candidate shape whose polyline is geographically closest to both Stop
   A and Stop B.
5. Slice or project the displayed polyline between the closest points to Stop A and
   Stop B.
6. If confidence is low, fall back to the existing straight or curved segment.

For a future high-confidence replay, add `stop_times.txt` preprocessing and choose
the shape through `trip_id` plus `stop_sequence`.
