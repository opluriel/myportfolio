create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 1 and 5000),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create table public.contact_rate_limits (
  ip_hash text not null check (char_length(ip_hash) = 64),
  window_start timestamptz not null,
  request_count integer not null check (request_count > 0),
  primary key (ip_hash, window_start)
);

alter table public.contact_rate_limits enable row level security;

create or replace function public.consume_contact_rate_limit(
  p_ip_hash text,
  p_window_start timestamptz,
  p_limit integer
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_count integer;
begin
  delete from public.contact_rate_limits
    where window_start < now() - interval '48 hours';

  insert into public.contact_rate_limits (ip_hash, window_start, request_count)
  values (p_ip_hash, p_window_start, 1)
  on conflict (ip_hash, window_start)
  do update set request_count = public.contact_rate_limits.request_count + 1
  returning request_count into current_count;

  return current_count <= p_limit;
end;
$$;

revoke all on function public.consume_contact_rate_limit(text, timestamptz, integer) from public, anon, authenticated;
grant execute on function public.consume_contact_rate_limit(text, timestamptz, integer) to service_role;
