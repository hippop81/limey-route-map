(function(global) {
  'use strict';

  var DEFAULT_CONFIG = {
    url: 'https://vybjtfbfketpoabaxaib.supabase.co',
    anonKey: 'sb_publishable_L3Vqy6WpyjxOEQSbhVPYzA_EWl44wnw'
  };

  var client = null;

  function readStoredConfig() {
    try {
      return {
        url: global.localStorage && global.localStorage.getItem('https://vybjtfbfketpoabaxaib.supabase.co'),
        anonKey: global.localStorage && global.localStorage.getItem('sb_publishable_L3Vqy6WpyjxOEQSbhVPYzA_EWl44wnw')
      };
    } catch (err) {
      return {};
    }
  }

  function resolveConfig(overrides) {
    var stored = readStoredConfig();
    var runtime = global.LIMEY_SUPABASE_CONFIG || {};
    return {
      url: (overrides && overrides.url) || runtime.url || stored.url || DEFAULT_CONFIG.url,
      anonKey: (overrides && (overrides.anonKey || overrides.anon_key)) ||
        runtime.anonKey || runtime.anon_key || stored.anonKey || DEFAULT_CONFIG.anonKey
    };
  }

function isConfigured(config) {
  return !!(config && config.url && config.anonKey &&
    config.url.startsWith('https://') &&
    config.anonKey.length > 20);
}

  function getSupabaseFactory() {
    return global.supabase && typeof global.supabase.createClient === 'function'
      ? global.supabase.createClient
      : null;
  }

  function initSupabaseClient(overrides) {
    var config = resolveConfig(overrides);
    if (!isConfigured(config)) {
      console.warn('[Limey] Supabase config is not set. Update supabase-client.js or set window.LIMEY_SUPABASE_CONFIG.');
      return null;
    }

    var createClient = getSupabaseFactory();
    if (!createClient) {
      console.warn('[Limey] Supabase SDK is not loaded. Include @supabase/supabase-js before supabase-client.js.');
      return null;
    }

    client = createClient(config.url, config.anonKey);
    return client;
  }

  function getSupabaseClient() {
    return client || initSupabaseClient();
  }

  function setSupabaseConfig(url, anonKey) {
    global.LIMEY_SUPABASE_CONFIG = { url: url, anonKey: anonKey };
    client = null;
    return initSupabaseClient(global.LIMEY_SUPABASE_CONFIG);
  }

  global.LimeySupabase = {
    DEFAULT_CONFIG: DEFAULT_CONFIG,
    resolveConfig: resolveConfig,
    isConfigured: isConfigured,
    initSupabaseClient: initSupabaseClient,
    getSupabaseClient: getSupabaseClient,
    setSupabaseConfig: setSupabaseConfig
  };

  // Initialize eagerly when real credentials are present. With placeholders this is a no-op.
  initSupabaseClient();
})(window);
