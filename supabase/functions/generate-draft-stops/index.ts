import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  const t0 = Date.now();
  let success = false;
  let draftStopCount = 0;
  let errorMsg: string | undefined;
  let promptLength = 0;

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const body = await req.json().catch(() => ({}));
    const prompt: string = typeof body?.prompt === "string" ? body.prompt : "";
    promptLength = prompt.length;

    if (!prompt.trim()) {
      return json({ error: "prompt is required" }, 400);
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({})) as Record<string, unknown>;
      const msg = (errData?.error as Record<string, unknown>)?.message;
      throw new Error(typeof msg === "string" ? msg : `Anthropic HTTP ${resp.status}`);
    }

    const data = await resp.json() as Record<string, unknown>;
    const content = data?.content as Array<Record<string, unknown>> | undefined;
    const rawText: string = (content?.[0]?.text as string) ?? "";

    draftStopCount = (rawText.match(/"name"\s*:/g) ?? []).length;
    success = true;

    return json({ rawText });

  } catch (err) {
    errorMsg = err instanceof Error ? err.message : String(err);
    return json({ error: errorMsg }, 500);

  } finally {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      promptLength,
      success,
      latencyMs: Date.now() - t0,
      draftStopCount,
      ...(errorMsg ? { error: errorMsg } : {}),
    }));
  }
});
