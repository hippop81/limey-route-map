(function(global) {
  'use strict';

  var ROUTE_SCHEMA_VERSION = '5.17';

  function getClient() {
    if (!global.LimeySupabase || typeof global.LimeySupabase.getSupabaseClient !== 'function') {
      throw new Error('Supabase client helper is not loaded.');
    }
    var client = global.LimeySupabase.getSupabaseClient();
    if (!client) {
      throw new Error('Supabase is not configured. Set URL and anon key before using TripRepository.');
    }
    return client;
  }

  function assertNoError(result, action) {
    if (result && result.error) {
      throw new Error(action + ': ' + result.error.message);
    }
    return result;
  }

  function schemaVersionFor(routeData) {
    return (routeData && routeData.schemaVersion) ||
      global.ROUTE_SCHEMA_VERSION ||
      ROUTE_SCHEMA_VERSION;
  }

  function emptyRouteData(title) {
    return {
      schemaVersion: schemaVersionFor(null),
      trip: {
        title: title || 'Untitled Trip',
        subtitle: '',
        palette: 'tropical'
      },
      days: {}
    };
  }

  async function createTrip(title) {
    var client = getClient();
    var result = await client
      .from('trips')
      .insert({ title: title || 'Untitled Trip' })
      .select('*')
      .single();

    return assertNoError(result, 'createTrip').data;
  }

  async function createTripVersion(tripId, routeData) {
    var client = getClient();
    var versionedRouteData = Object.assign({}, routeData || {}, {
      schemaVersion: schemaVersionFor(routeData)
    });
    var result = await client
      .from('trip_versions')
      .insert({
        trip_id: tripId,
        schema_version: versionedRouteData.schemaVersion,
        route_data: versionedRouteData
      })
      .select('*')
      .single();

    return assertNoError(result, 'createTripVersion').data;
  }

  async function saveTrip(title, routeData) {
    var trip = await createTrip(title);
    try {
      var version = await createTripVersion(trip.id, routeData);
      return { trip: trip, version: version };
    } catch (err) {
      // Avoid orphan trips when version creation fails.
      try { await deleteTrip(trip.id); } catch (rollbackErr) {}
      throw err;
    }
  }

  async function loadTrip(tripId) {
    var client = getClient();
    var result = await client
      .from('trip_versions')
      .select('route_data, schema_version, created_at')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    assertNoError(result, 'loadTrip');
    return result.data ? result.data.route_data : null;
  }

  async function listTrips() {
    var client = getClient();
    var result = await client
      .from('trips')
      .select('id, title, created_at, updated_at')
      .order('updated_at', { ascending: false });

    return assertNoError(result, 'listTrips').data || [];
  }

  async function createEmptyTrip(title) {
    var trip = await createTrip(title);
    var version = await createTripVersion(trip.id, emptyRouteData(title));
    return { trip: trip, version: version };
  }

  async function deleteTrip(tripId) {
    var client = getClient();
    assertNoError(await client.from('trip_versions').delete().eq('trip_id', tripId), 'deleteTrip versions');
    assertNoError(await client.from('trips').delete().eq('id', tripId), 'deleteTrip trip');
    return true;
  }

  global.TripRepository = {
    schemaVersion: ROUTE_SCHEMA_VERSION,
    createTrip: createEmptyTrip,
    saveTrip: saveTrip,
    loadTrip: loadTrip,
    listTrips: listTrips,
    deleteTrip: deleteTrip,

    // Exposed for tests and advanced workflows.
    _createTripRecord: createTrip,
    _createTripVersion: createTripVersion,
    _emptyRouteData: emptyRouteData
  };
})(window);
