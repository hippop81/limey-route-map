# AGENTS.md

## Project overview

**Limey Route Replay** is a static client-side Okinawa trip itinerary map (`index.html`). There is no `package.json`, bundler, or test runner. Optional Node tooling exists only for the GTFS preprocessor (`scripts/build-gtfs-db.js`).

## Cursor Cloud specific instructions

### Services

| Service | Required? | Notes |
|---------|-----------|-------|
| Static HTTP server | **MUST** | Serves `index.html` and JS assets. Do not open `index.html` via `file://` (Leaflet tiles and relative script paths need HTTP). |
| Internet / CDNs | **MUST** | Leaflet, Google Fonts, map tiles (ArcGIS, Carto), and Supabase SDK load from CDNs. |
| Node.js | **OPTIONAL** | Only for `scripts/build-gtfs-db.js`. Prebuilt `gtfs_db.json` is already in the repo. |
| Supabase | **OPTIONAL** | `supabase-client.js` / `trip-repository.js` are loaded but `index.html` MVP uses embedded `DAYS` data only. |

### Start the app (development)

```bash
cd /workspace
python3 -m http.server 8080
```

Open `http://localhost:8080/index.html`. Use a tmux session for long-running servers (e.g. `limey-http-server`).

### GTFS database rebuild (optional)

```bash
node scripts/build-gtfs-db.js --input ./gtfs --output ./gtfs_db.json --pretty
```

Single-provider smoke test:

```bash
node scripts/build-gtfs-db.js --input ./gtfs/yuirail --output /tmp/yuirail_gtfs_db.json
```

### Lint / tests

No lint or automated test suite is configured. Verification is manual (browser) or by running the GTFS build script above.

### Supabase configuration

Credentials are in `supabase-client.js` (`DEFAULT_CONFIG`). Override before scripts load with `window.LIMEY_SUPABASE_CONFIG = { url, anonKey }`.
