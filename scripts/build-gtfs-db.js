#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SCHEMA_VERSION = 1;
const DEFAULT_PRECISION = 6;
const DEFAULT_MAX_EXAMPLE_TRIPS = 3;

function printUsage() {
  const script = path.relative(process.cwd(), __filename);
  console.log(`Usage:
  node ${script} --input ./gtfs --output ./gtfs_db.json
  node ${script} --input ./gtfs/yuirail --output ./yuirail_gtfs_db.json
  node ${script} --shapes ./shapes.txt --routes ./routes.txt --trips ./trips.txt --output ./gtfs_db.json

Options:
  --input <dir>              GTFS feed directory, or parent directory containing provider feed directories
  --shapes <file>            Path to shapes.txt
  --routes <file>            Path to routes.txt
  --trips <file>             Path to trips.txt
  --output <file>            Output path. Default: ./gtfs_db.json
  --precision <digits>       Coordinate precision. Default: ${DEFAULT_PRECISION}
  --max-example-trips <n>    Example trip_ids kept per shape/route pair. Default: ${DEFAULT_MAX_EXAMPLE_TRIPS}
  --pretty                   Pretty-print JSON output
  --help                     Show this help
`);
}

function parseArgs(argv) {
  const args = {
    input: process.cwd(),
    shapes: null,
    routes: null,
    trips: null,
    output: path.resolve(process.cwd(), 'gtfs_db.json'),
    precision: DEFAULT_PRECISION,
    maxExampleTrips: DEFAULT_MAX_EXAMPLE_TRIPS,
    pretty: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      args.help = true;
      continue;
    }
    if (arg === '--pretty') {
      args.pretty = true;
      continue;
    }

    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      throw new Error(`Missing value for ${arg}`);
    }

    if (arg === '--input') args.input = path.resolve(next);
    else if (arg === '--shapes') args.shapes = path.resolve(next);
    else if (arg === '--routes') args.routes = path.resolve(next);
    else if (arg === '--trips') args.trips = path.resolve(next);
    else if (arg === '--output') args.output = path.resolve(next);
    else if (arg === '--precision') args.precision = parseInteger(next, 'precision');
    else if (arg === '--max-example-trips') args.maxExampleTrips = parseInteger(next, 'max-example-trips');
    else throw new Error(`Unknown option: ${arg}`);

    i += 1;
  }

  args.explicitFiles = !!(args.shapes || args.routes || args.trips);
  args.shapes = args.shapes || path.join(args.input, 'shapes.txt');
  args.routes = args.routes || path.join(args.input, 'routes.txt');
  args.trips = args.trips || path.join(args.input, 'trips.txt');

  if (args.precision < 0 || args.precision > 8) {
    throw new Error('--precision must be between 0 and 8');
  }
  if (args.maxExampleTrips < 0) {
    throw new Error('--max-example-trips must be 0 or greater');
  }

  return args;
}

function parseInteger(value, name) {
  const n = Number(value);
  if (!Number.isInteger(n)) throw new Error(`--${name} must be an integer`);
  return n;
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }

  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(text);
  if (!rows.length) return [];

  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1)
    .filter((row) => row.some((cell) => cell.trim() !== ''))
    .map((row, rowIndex) => {
      const record = {};
      headers.forEach((header, colIndex) => {
        record[header] = row[colIndex] !== undefined ? row[colIndex] : '';
      });
      record.__rowNumber = rowIndex + 2;
      return record;
    });
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function feedFilesForDir(dirPath) {
  return {
    shapes: path.join(dirPath, 'shapes.txt'),
    routes: path.join(dirPath, 'routes.txt'),
    trips: path.join(dirPath, 'trips.txt'),
  };
}

function isCompleteFeed(files) {
  return fileExists(files.shapes) && fileExists(files.routes) && fileExists(files.trips);
}

function discoverInputFeeds(args) {
  const direct = {
    providerId: sanitizeProviderId(path.basename(args.input) || 'gtfs'),
    shapes: args.shapes,
    routes: args.routes,
    trips: args.trips,
    namespaceIds: false,
  };

  if (isCompleteFeed(direct) || args.explicitFiles) {
    return [direct];
  }

  if (!fs.existsSync(args.input) || !fs.statSync(args.input).isDirectory()) {
    throw new Error(`Input directory not found: ${args.input}`);
  }

  const feeds = fs.readdirSync(args.input, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const providerDir = path.join(args.input, entry.name);
      return Object.assign({
        providerId: sanitizeProviderId(entry.name),
        namespaceIds: true,
      }, feedFilesForDir(providerDir));
    })
    .filter(isCompleteFeed)
    .sort((a, b) => a.providerId.localeCompare(b.providerId));

  if (!feeds.length) {
    throw new Error(`No complete GTFS feeds found in ${args.input}`);
  }

  return feeds;
}

function sanitizeProviderId(value) {
  return String(value || 'gtfs').trim().replace(/[^A-Za-z0-9_-]+/g, '_').toLowerCase();
}

function namespaceValue(providerId, value, namespaceIds) {
  if (!namespaceIds || value === undefined || value === null || value === '') return value || '';
  return `${providerId}:${value}`;
}

function namespaceRecords(records, providerId, namespaceIds, fields) {
  return records.map((record) => {
    const next = Object.assign({}, record, { providerId });
    fields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(next, field)) {
        next[field] = namespaceValue(providerId, next[field], namespaceIds);
      }
    });
    return next;
  });
}

function readFeed(feed) {
  return {
    providerId: feed.providerId,
    files: {
      shapes: feed.shapes,
      routes: feed.routes,
      trips: feed.trips,
    },
    shapeRecords: namespaceRecords(readCsv(feed.shapes), feed.providerId, feed.namespaceIds, ['shape_id']),
    routeRecords: namespaceRecords(readCsv(feed.routes), feed.providerId, feed.namespaceIds, ['route_id']),
    tripRecords: namespaceRecords(readCsv(feed.trips), feed.providerId, feed.namespaceIds, ['route_id', 'trip_id', 'shape_id']),
  };
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (ch !== '\r') {
      cell += ch;
    }
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function requireColumns(records, columns, fileName) {
  const first = records[0];
  if (!first) return;

  columns.forEach((column) => {
    if (!Object.prototype.hasOwnProperty.call(first, column)) {
      throw new Error(`${fileName} is missing required column: ${column}`);
    }
  });
}

function roundCoord(value, precision) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Number(n.toFixed(precision));
}

function sortObjectByKey(obj) {
  return Object.keys(obj).sort().reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
}

function uniqSorted(values) {
  return Array.from(new Set(values.filter((value) => value !== undefined && value !== null && value !== ''))).sort();
}

function buildRoutes(records) {
  requireColumns(records, ['route_id'], 'routes.txt');

  const routes = {};
  records.forEach((record) => {
    const routeId = record.route_id;
    if (!routeId) return;
    routes[routeId] = {
      routeId,
      shortName: record.route_short_name || '',
      longName: record.route_long_name || '',
      type: record.route_type !== undefined && record.route_type !== '' ? Number(record.route_type) : null,
      color: normalizeColor(record.route_color),
      textColor: normalizeColor(record.route_text_color),
    };
  });

  return sortObjectByKey(routes);
}

function normalizeColor(value) {
  const color = String(value || '').trim();
  if (!color) return '';
  return color.startsWith('#') ? color : `#${color}`;
}

function routeDisplayName(routeInfo) {
  if (!routeInfo) return '';
  return routeInfo.routeLongName || routeInfo.routeShortName || routeInfo.routeId || '';
}

function inferTransportType(routeInfo) {
  if (!routeInfo) return 'bus_local';

  const name = `${routeInfo.routeShortName || ''} ${routeInfo.routeLongName || ''}`.toLowerCase();
  const routeType = routeInfo.routeType;

  if (/新幹線|shinkansen/.test(name)) return 'shinkansen';
  if (/シャトル|shuttle|リゾートライナー|resort\s*liner|エアポートライナー|airport\s*liner/.test(name)) return 'shuttle';
  if (/高速|急行|ハイウェイ|highway|express|limousine|リムジン|airport\s*bus/.test(name)) return 'bus_express';
  if (/フェリー|ferry|船/.test(name)) return 'ferry';
  if (/ゆいレール|モノレール|monorail|rail|train|tram/.test(name)) return 'train_local';

  if (routeType === 4) return 'ferry';
  if (routeType === 0 || routeType === 1 || routeType === 2 || routeType === 12) return 'train_local';
  if (routeType === 3 || routeType === 11) return 'bus_local';

  // Extended GTFS route types commonly seen in regional feeds.
  if (routeType >= 100 && routeType < 200) return 'train_local';
  if (routeType >= 700 && routeType < 800) return 'bus_local';
  if (routeType >= 1000 && routeType < 1100) return 'ferry';

  return 'bus_local';
}

function buildShapes(records, precision) {
  requireColumns(records, ['shape_id', 'shape_pt_lat', 'shape_pt_lon', 'shape_pt_sequence'], 'shapes.txt');

  const grouped = {};
  let skippedPointCount = 0;

  records.forEach((record) => {
    const shapeId = record.shape_id;
    const lat = roundCoord(record.shape_pt_lat, precision);
    const lng = roundCoord(record.shape_pt_lon, precision);
    const sequence = Number(record.shape_pt_sequence);

    if (!shapeId || lat === null || lng === null || !Number.isFinite(sequence)) {
      skippedPointCount += 1;
      return;
    }

    if (!grouped[shapeId]) grouped[shapeId] = [];
    grouped[shapeId].push({ lat, lng, sequence });
  });

  const shapes = {};
  Object.keys(grouped).sort().forEach((shapeId) => {
    const points = grouped[shapeId]
      .sort((a, b) => a.sequence - b.sequence)
      .map((point) => [point.lat, point.lng]);

    shapes[shapeId] = {
      points,
      bounds: computeBounds(points),
      pointCount: points.length,
    };
  });

  return { shapes, skippedPointCount };
}

function computeBounds(points) {
  if (!points.length) return null;

  let minLat = points[0][0];
  let minLng = points[0][1];
  let maxLat = points[0][0];
  let maxLng = points[0][1];

  points.forEach(([lat, lng]) => {
    minLat = Math.min(minLat, lat);
    minLng = Math.min(minLng, lng);
    maxLat = Math.max(maxLat, lat);
    maxLng = Math.max(maxLng, lng);
  });

  return [minLat, minLng, maxLat, maxLng];
}

function buildIndexes(tripRecords, routes, shapes, maxExampleTrips) {
  requireColumns(tripRecords, ['route_id', 'trip_id', 'shape_id'], 'trips.txt');

  const shapeRouteBuckets = {};
  const routeShapeBuckets = {};
  let tripsWithoutShape = 0;
  let tripsWithMissingShape = 0;

  tripRecords.forEach((record) => {
    const shapeId = record.shape_id;
    const routeId = record.route_id;
    const tripId = record.trip_id;
    const directionId = record.direction_id || '';

    if (!shapeId) {
      tripsWithoutShape += 1;
      return;
    }
    if (!shapes[shapeId]) {
      tripsWithMissingShape += 1;
      return;
    }
    if (!routeId) return;

    const shapeRouteKey = `${shapeId}\u0000${routeId}`;
    if (!shapeRouteBuckets[shapeRouteKey]) {
      shapeRouteBuckets[shapeRouteKey] = {
        shapeId,
        routeId,
        directionIds: new Set(),
        tripCount: 0,
        exampleTripIds: [],
      };
    }

    const shapeRoute = shapeRouteBuckets[shapeRouteKey];
    shapeRoute.tripCount += 1;
    if (directionId !== '') shapeRoute.directionIds.add(directionId);
    if (tripId && shapeRoute.exampleTripIds.length < maxExampleTrips) {
      shapeRoute.exampleTripIds.push(tripId);
    }

    if (!routeShapeBuckets[routeId]) {
      routeShapeBuckets[routeId] = {
        shapeIds: new Set(),
        directions: {},
      };
    }

    routeShapeBuckets[routeId].shapeIds.add(shapeId);
    const directionKey = directionId === '' ? 'unknown' : directionId;
    if (!routeShapeBuckets[routeId].directions[directionKey]) {
      routeShapeBuckets[routeId].directions[directionKey] = new Set();
    }
    routeShapeBuckets[routeId].directions[directionKey].add(shapeId);
  });

  const shapeToRoute = {};
  Object.keys(shapeRouteBuckets).sort().forEach((key) => {
    const bucket = shapeRouteBuckets[key];
    if (!shapeToRoute[bucket.shapeId]) shapeToRoute[bucket.shapeId] = [];
    const route = routes[bucket.routeId] || null;
    shapeToRoute[bucket.shapeId].push({
      routeId: bucket.routeId,
      routeShortName: route ? route.shortName : '',
      routeLongName: route ? route.longName : '',
      routeType: route ? route.type : null,
      routeColor: route ? route.color : '',
      routeTextColor: route ? route.textColor : '',
      directionIds: Array.from(bucket.directionIds).sort(),
      tripCount: bucket.tripCount,
      exampleTripIds: bucket.exampleTripIds,
    });
  });

  Object.keys(shapeToRoute).forEach((shapeId) => {
    shapeToRoute[shapeId].sort((a, b) => {
      if (b.tripCount !== a.tripCount) return b.tripCount - a.tripCount;
      return a.routeId.localeCompare(b.routeId);
    });
  });

  const routeToShapes = {};
  Object.keys(routeShapeBuckets).sort().forEach((routeId) => {
    const bucket = routeShapeBuckets[routeId];
    const directions = {};
    Object.keys(bucket.directions).sort().forEach((directionId) => {
      directions[directionId] = Array.from(bucket.directions[directionId]).sort();
    });
    routeToShapes[routeId] = {
      shapeIds: Array.from(bucket.shapeIds).sort(),
      directions,
    };
  });

  return {
    shapeToRoute: sortObjectByKey(shapeToRoute),
    routeToShapes,
    tripsWithoutShape,
    tripsWithMissingShape,
  };
}

function attachShapeRouteInfo(shapes, shapeToRoute) {
  const result = {};
  Object.keys(shapes).sort().forEach((shapeId) => {
    const primaryRoute = (shapeToRoute[shapeId] || [])[0] || null;
    result[shapeId] = {
      points: shapes[shapeId].points,
      routeId: primaryRoute ? primaryRoute.routeId : '',
      routeName: routeDisplayName(primaryRoute),
      transportType: inferTransportType(primaryRoute),
    };
  });
  return result;
}

function buildDb(args) {
  const feeds = discoverInputFeeds(args).map(readFeed);
  const shapeRecords = feeds.flatMap((feed) => feed.shapeRecords);
  const routeRecords = feeds.flatMap((feed) => feed.routeRecords);
  const tripRecords = feeds.flatMap((feed) => feed.tripRecords);

  const routes = buildRoutes(routeRecords);
  const { shapes, skippedPointCount } = buildShapes(shapeRecords, args.precision);
  const indexes = buildIndexes(tripRecords, routes, shapes, args.maxExampleTrips);
  const shapesWithRouteInfo = attachShapeRouteInfo(shapes, indexes.shapeToRoute);

  const pointCount = Object.values(shapesWithRouteInfo)
    .reduce((sum, shape) => sum + shape.points.length, 0);

  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    generator: {
      name: 'limey-route-replay-gtfs-preprocessor',
      coordinateOrder: 'lat_lng',
      coordinatePrecision: args.precision,
    },
    source: {
      input: path.basename(args.input),
      feedCount: feeds.length,
      feeds: feeds.map((feed) => ({
        providerId: feed.providerId,
        shapes: path.relative(process.cwd(), feed.files.shapes),
        routes: path.relative(process.cwd(), feed.files.routes),
        trips: path.relative(process.cwd(), feed.files.trips),
      })),
    },
    stats: {
      routeCount: Object.keys(routes).length,
      tripCount: tripRecords.length,
      shapeCount: Object.keys(shapesWithRouteInfo).length,
      pointCount,
      skippedPointCount,
      tripsWithoutShape: indexes.tripsWithoutShape,
      tripsWithMissingShape: indexes.tripsWithMissingShape,
    },
    routes,
    shapes: shapesWithRouteInfo,
    shapeToRoute: indexes.shapeToRoute,
    routeToShapes: indexes.routeToShapes,
  };
}

function ensureOutputDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      printUsage();
      return;
    }

    const db = buildDb(args);
    ensureOutputDir(args.output);
    fs.writeFileSync(args.output, JSON.stringify(db, null, args.pretty ? 2 : 0) + '\n');

    console.log(`Generated ${args.output}`);
    console.log(`Shapes: ${db.stats.shapeCount}, points: ${db.stats.pointCount}, routes: ${db.stats.routeCount}, trips: ${db.stats.tripCount}`);
    if (db.stats.skippedPointCount || db.stats.tripsWithoutShape || db.stats.tripsWithMissingShape) {
      console.log(`Warnings: skippedPoints=${db.stats.skippedPointCount}, tripsWithoutShape=${db.stats.tripsWithoutShape}, tripsWithMissingShape=${db.stats.tripsWithMissingShape}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('');
    printUsage();
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
