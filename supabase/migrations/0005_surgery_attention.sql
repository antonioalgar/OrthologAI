alter table public.surgeries
  add column if not exists attention_required boolean not null default false,
  add column if not exists attention_reason text,
  add column if not exists attention_created_at timestamptz,
  add column if not exists attention_resolved_at timestamptz;

create index if not exists surgeries_active_attention_by_user
  on public.surgeries (user_id, attention_created_at desc)
  where attention_required = true;
