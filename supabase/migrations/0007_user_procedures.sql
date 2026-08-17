create table if not exists public.user_procedures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  procedure_key text not null,
  label text not null,
  normalized_label text not null,
  family text not null,
  is_active boolean not null default true,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_procedures_key_unique unique (procedure_key),
  constraint user_procedures_normalized_label_unique unique (user_id, normalized_label),
  constraint user_procedures_custom_key check (procedure_key like 'custom:%'),
  constraint user_procedures_label_not_blank check (length(trim(label)) > 0),
  constraint user_procedures_normalized_label_not_blank check (length(trim(normalized_label)) > 0),
  constraint user_procedures_family_not_blank check (length(trim(family)) > 0),
  constraint user_procedures_archive_state check (
    (is_active = true and archived_at is null)
    or (is_active = false and archived_at is not null)
  )
);

create index if not exists user_procedures_active_catalog_idx
  on public.user_procedures (user_id, family, label)
  where is_active = true;

alter table public.user_procedures enable row level security;

drop policy if exists "Users can read their own procedure catalog" on public.user_procedures;
drop policy if exists "Users can create their own procedures" on public.user_procedures;
drop policy if exists "Users can update their own procedures" on public.user_procedures;

create policy "Users can read their own procedure catalog"
on public.user_procedures
for select
using (auth.uid() = user_id);

create policy "Users can create their own procedures"
on public.user_procedures
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own procedures"
on public.user_procedures
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- No DELETE policy is created intentionally. Personal procedures are archived instead,
-- while surgery_procedures keeps its historical label/family snapshots unchanged.

drop trigger if exists user_procedures_set_updated_at on public.user_procedures;

create trigger user_procedures_set_updated_at
before update on public.user_procedures
for each row
execute function public.set_updated_at();
