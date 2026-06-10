import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// ── Constants ──────────────────────────────────────────────────────────────
const MAX_PROMPT_CHARS  = 3_000;
const MAX_STOPS         = 100;
const MAX_DAYS          = 14;
const MAX_POIS          = 20;
const RATE_PER_IP_HOUR  = 5;
const RATE_GLOBAL_DAY   = 100;
const TIMEOUT_MS        = 30_000;
const MODEL             = "claude-haiku-4-5";

const SYSTEM_PROMPT = `You are a travel itinerary parser.
Extract stops from the user's input.

Return valid JSON only.
No markdown. No explanations.

Output format:
{
  "stops": [
    {
      "name": "羽田空港",
      "time": "06:00",
      "transport": "plane",
      "categories": [],
      "activity": "",
      "operatorHint": "",
      "isDayEnd": false,
      "confidence": 0.95,
      "inferred": false
    }
  ]
}

Transport inference priority:
1. Explicit mention (「飛行機で」「ゆいレール」)
2. Known operator mapping (「ゆいレール」→ train_local)
3. Distance heuristic
4. Default → walk

Valid transport values:
plane, ferry, shinkansen, train_limited, train_local,
bus_express, bus_local, shuttle, car, bike, walk

Category inference (multiple allowed):
「食べる」「ランチ」「タコス」→ food
「カフェ」「コーヒー」→ cafe
「泊まる」「ホテル」「宿」→ stay (also set isDayEnd: true)
「ライブ」「コンサート」「観戦」→ event
「観光」「水族館」「公園」→ sightseeing
「神社」「仏閣」「城」「遺跡」→ heritage
「買い物」「ショッピング」→ shopping
「温泉」「サウナ」「銭湯」→ onsen

isDayEnd: true when 「泊まる」「宿泊」「ホテル」「宿」or last stop of the day.

Do NOT output shapeId.
Output operatorHint instead.
(例: 「ゆいレール」→ operatorHint: "Yui Rail")`;

// ── Types ──────────────────────────────────────────────────────────────────
interface POI {
  name:     string;
  lat:      number;
  lng:      number;
  category: string | null;
}

type ErrorType =
  | "validation_error"
  | "rate_limited"
  | "timeout"
  | "provider_error"
  | "invalid_response";

interface StructuredLog {
  request_id:      string;
  timestamp:       string;
  ip_hash:         string;
  prompt_length:   number;
  model:           string;
  success:         boolean;
  error_type?:     ErrorType;
  latency_ms:      number;
  draft_stop_count: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

async function hashIp(ip: string): Promise<string> {
  const salt = Deno.env.get("IP_HASH_SALT") ?? "";
  const data = new TextEncoder().encode(ip + salt);
  const buf  = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .slice(0, 8)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Validates the optional `pois` field: array of {name, lat, lng, category} (max MAX_POIS). */
function validatePois(value: unknown): POI[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > MAX_POIS) return null;

  const pois: POI[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const o = item as Record<string, unknown>;
    if (typeof o.name !== "string") return null;
    if (typeof o.lat !== "number" || !isFinite(o.lat) || o.lat < -90 || o.lat > 90) return null;
    if (typeof o.lng !== "number" || !isFinite(o.lng) || o.lng < -180 || o.lng > 180) return null;
    if (o.category !== null && typeof o.category !== "string") return null;
    pois.push({ name: o.name, lat: o.lat, lng: o.lng, category: o.category as string | null });
  }
  return pois;
}

/** Appends grounding context for matched POIs to the system prompt. */
function buildSystemPrompt(pois: POI[]): string {
  if (pois.length === 0) return SYSTEM_PROMPT;

  const poiContext =
    `\n\nKnown POIs (use these when matched):\n` +
    JSON.stringify(pois.map(p => ({ name: p.name, lat: p.lat, lng: p.lng, category: p.category }))) +
    `\nWhen a location matches a known POI:\n` +
    `- Use the provided lat/lng coordinates\n` +
    `- Use the provided category\n` +
    `- Prefer POI coordinates over inferred coordinates\n` +
    `- Do not invent coordinates`;

  return SYSTEM_PROMPT + poiContext;
}

/** Mirror of client-side _extractJsonText for output validation only. */
function extractJsonText(raw: string): string {
  const fj = raw.match(/```json\s*([\s\S]*?)```/i);
  if (fj) return fj[1].trim();
  const f  = raw.match(/```\s*([\s\S]*?)```/);
  if (f)  return f[1].trim();
  const fo = raw.indexOf("{"), lo = raw.lastIndexOf("}");
  if (fo !== -1 && lo > fo) return raw.slice(fo, lo + 1).trim();
  const fa = raw.indexOf("["), la = raw.lastIndexOf("]");
  if (fa !== -1 && la > fa) return raw.slice(fa, la + 1).trim();
  return raw.trim();
}

// ── Rate Limiting ──────────────────────────────────────────────────────────
async function checkAndRecord(
  sb: SupabaseClient,
  ipHash: string,
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const now     = Date.now();
  const hourAgo = new Date(now - 3_600_000).toISOString();
  const dayAgo  = new Date(now - 86_400_000).toISOString();

  // Per-IP hourly check
  const { count: ipCount, error: ipErr } = await sb
    .from("ai_rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", hourAgo);

  if (ipErr) throw new Error("rate-limit read failed: " + ipErr.message);

  if ((ipCount ?? 0) >= RATE_PER_IP_HOUR) {
    const { data: oldest } = await sb
      .from("ai_rate_limits")
      .select("created_at")
      .eq("ip_hash", ipHash)
      .gte("created_at", hourAgo)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();
    const expiresAt = oldest
      ? new Date(oldest.created_at).getTime() + 3_600_000
      : now + 3_600_000;
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((expiresAt - now) / 1000)) };
  }

  // Global daily cap
  const { count: globalCount, error: globalErr } = await sb
    .from("ai_rate_limits")
    .select("*", { count: "exact", head: true })
    .gte("created_at", dayAgo);

  if (globalErr) throw new Error("rate-limit read failed: " + globalErr.message);

  if ((globalCount ?? 0) >= RATE_GLOBAL_DAY) {
    const midnight = new Date(now);
    midnight.setUTCHours(24, 0, 0, 0);
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((midnight.getTime() - now) / 1000)) };
  }

  // Record this request (retries from same IP count independently)
  const { error: insertErr } = await sb
    .from("ai_rate_limits")
    .insert({ ip_hash: ipHash });
  if (insertErr) throw new Error("rate-limit insert failed: " + insertErr.message);

  return { allowed: true };
}

// ── Anthropic call with internal retry ────────────────────────────────────
async function callAnthropic(
  apiKey: string,
  prompt: string,
  systemPrompt: string,
  signal: AbortSignal,
): Promise<string> {
  let lastStatus = 0;

  for (let attempt = 0; attempt <= 1; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 1000));

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: 2048,
        system:     systemPrompt,
        messages:   [{ role: "user", content: prompt }],
      }),
      signal,
    });

    lastStatus = resp.status;

    // Retry only on 429 or 5xx from Anthropic
    if (resp.status === 429 || resp.status >= 500) continue;

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({})) as Record<string, unknown>;
      const msg = (errData?.error as Record<string, unknown>)?.message;
      throw new Error(typeof msg === "string" ? msg : `Anthropic HTTP ${resp.status}`);
    }

    const data    = await resp.json() as Record<string, unknown>;
    const content = data?.content as Array<Record<string, unknown>> | undefined;
    return (content?.[0]?.text as string) ?? "";
  }

  throw new Error(`Anthropic HTTP ${lastStatus} after retry`);
}

// ── Main Handler ───────────────────────────────────────────────────────────
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  const t0        = Date.now();
  const requestId = crypto.randomUUID();

  let ipHash:         string    = "unknown";
  let promptLength:   number    = 0;
  let success:        boolean   = false;
  let errorType:      ErrorType | undefined;
  let draftStopCount: number    = 0;

  try {
    if (req.method !== "POST") {
      errorType = "validation_error";
      return json({ error: "validation_error", message: "Method not allowed" }, 405);
    }

    // ── IP hash ──────────────────────────────────────────────────────────
    const rawIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
      ?? req.headers.get("x-real-ip")
      ?? "unknown";
    ipHash = await hashIp(rawIp);

    // ── Parse body ───────────────────────────────────────────────────────
    const body = await req.json().catch(() => null) as Record<string, unknown> | null;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      errorType = "validation_error";
      return json({ error: "validation_error", message: "Invalid JSON body" }, 400);
    }

    const unknown = Object.keys(body).filter(k => k !== "prompt" && k !== "pois");
    if (unknown.length > 0) {
      errorType = "validation_error";
      return json({ error: "validation_error", message: `Unknown fields: ${unknown.join(", ")}` }, 400);
    }

    const prompt = typeof body.prompt === "string" ? body.prompt : "";
    promptLength = prompt.length;

    if (!prompt.trim()) {
      errorType = "validation_error";
      return json({ error: "validation_error", message: "prompt is required" }, 400);
    }
    if (prompt.length > MAX_PROMPT_CHARS) {
      errorType = "validation_error";
      return json({ error: "validation_error", message: `prompt exceeds ${MAX_PROMPT_CHARS} characters` }, 400);
    }

    const pois = validatePois(body.pois);
    if (pois === null) {
      errorType = "validation_error";
      return json({ error: "validation_error", message: `pois must be an array of at most ${MAX_POIS} {name, lat, lng, category} objects` }, 400);
    }

    // ── Rate limiting ────────────────────────────────────────────────────
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const rl = await checkAndRecord(sb, ipHash);
    if (!rl.allowed) {
      errorType = "rate_limited";
      return json({ error: "rate_limited", retryAfter: rl.retryAfter }, 429);
    }

    // ── Claude call with 30s hard timeout ────────────────────────────────
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

    const abort   = new AbortController();
    const timeoutId = setTimeout(() => abort.abort(), TIMEOUT_MS);

    const systemPrompt = buildSystemPrompt(pois);

    let rawText = "";
    try {
      rawText = await callAnthropic(apiKey, prompt, systemPrompt, abort.signal);
    } catch (err) {
      clearTimeout(timeoutId);
      if ((err as Error).name === "AbortError") {
        errorType = "timeout";
        return json({ error: "timeout" }, 504);
      }
      errorType = "provider_error";
      throw err;
    }
    clearTimeout(timeoutId);

    // ── Output validation ────────────────────────────────────────────────
    try {
      const parsed = JSON.parse(extractJsonText(rawText)) as unknown;
      const stops  = Array.isArray(parsed)
        ? parsed
        : Array.isArray((parsed as Record<string, unknown>).stops)
          ? (parsed as Record<string, unknown>).stops as unknown[]
          : [];

      if (stops.length > MAX_STOPS) {
        errorType = "invalid_response";
        return json({ error: "invalid_response", message: `Response exceeded ${MAX_STOPS} stops` }, 502);
      }

      const dayEnds = (stops as Array<Record<string, unknown>>)
        .filter(s => s.isDayEnd === true).length;
      if (dayEnds > MAX_DAYS) {
        errorType = "invalid_response";
        return json({ error: "invalid_response", message: `Response exceeded ${MAX_DAYS} days` }, 502);
      }

      draftStopCount = stops.length;
    } catch {
      // Unparseable JSON — client-side parser handles it
      draftStopCount = (rawText.match(/"name"\s*:/g) ?? []).length;
    }

    success = true;
    return json({ rawText });

  } catch (err) {
    if (!errorType) errorType = "provider_error";
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: errorType, message: msg }, 500);

  } finally {
    const log: StructuredLog = {
      request_id:       requestId,
      timestamp:        new Date().toISOString(),
      ip_hash:          ipHash,
      prompt_length:    promptLength,
      model:            MODEL,
      success,
      latency_ms:       Date.now() - t0,
      draft_stop_count: draftStopCount,
      ...(errorType ? { error_type: errorType } : {}),
    };
    console.log(JSON.stringify(log));
  }
});
