create table if not exists public.ai_rate_limits (
  id         uuid        primary key default gen_random_uuid(),
  ip_hash    text        not null,
  created_at timestamptz not null default now()
);

-- Per-IP hourly lookups
create index if not exists ai_rate_limits_ip_hour_idx
  on public.ai_rate_limits (ip_hash, created_at);

-- Global daily cap lookups
create index if not exists ai_rate_limits_global_day_idx
  on public.ai_rate_limits (created_at);

alter table public.ai_rate_limits enable row level security;

-- Only service role (edge function) may access; no anon/authenticated policies
