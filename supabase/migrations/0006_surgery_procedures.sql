create table if not exists public.surgery_procedures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  surgery_id uuid not null references public.surgeries(id) on delete cascade,
  procedure_key text not null,
  procedure_label text not null,
  procedure_family text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint surgery_procedures_unique_key_per_surgery unique (surgery_id, procedure_key),
  constraint surgery_procedures_key_not_blank check (length(trim(procedure_key)) > 0),
  constraint surgery_procedures_label_not_blank check (length(trim(procedure_label)) > 0),
  constraint surgery_procedures_family_not_blank check (length(trim(procedure_family)) > 0)
);

create index if not exists surgery_procedures_user_key_idx
  on public.surgery_procedures (user_id, procedure_key);

create index if not exists surgery_procedures_surgery_id_idx
  on public.surgery_procedures (surgery_id);

alter table public.surgery_procedures enable row level security;

drop policy if exists "Users can read their own surgery procedures" on public.surgery_procedures;
drop policy if exists "Users can insert procedures for their own surgeries" on public.surgery_procedures;
drop policy if exists "Users can update their own surgery procedures" on public.surgery_procedures;
drop policy if exists "Users can delete their own surgery procedures" on public.surgery_procedures;

create policy "Users can read their own surgery procedures"
on public.surgery_procedures
for select
using (auth.uid() = user_id);

create policy "Users can insert procedures for their own surgeries"
on public.surgery_procedures
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.surgeries
    where surgeries.id = surgery_procedures.surgery_id
      and surgeries.user_id = auth.uid()
  )
);

create policy "Users can update their own surgery procedures"
on public.surgery_procedures
for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.surgeries
    where surgeries.id = surgery_procedures.surgery_id
      and surgeries.user_id = auth.uid()
  )
);

create policy "Users can delete their own surgery procedures"
on public.surgery_procedures
for delete
using (auth.uid() = user_id);

drop trigger if exists surgery_procedures_set_updated_at on public.surgery_procedures;

create trigger surgery_procedures_set_updated_at
before update on public.surgery_procedures
for each row
execute function public.set_updated_at();

-- Deliberately no automatic backfill: existing free-text procedure values are preserved
-- and remain unclassified until the user assigns structured procedures explicitly.
