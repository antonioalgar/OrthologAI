create table if not exists public.surgeries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  surgery_date date not null,
  hospital text,
  lead_surgeon text,
  my_role text,
  payment_amount numeric(10, 2),
  is_invoiced boolean not null default false,
  is_paid boolean not null default false,
  patient_identifier text,
  patient_age integer,
  patient_sex text,
  patient_bmi numeric(4, 1),
  patient_profession text,
  patient_sport text,
  diagnosis text,
  procedure text not null,
  implants text,
  surgical_observations text,
  lessons_learned text,
  senior_surgeon_pearls text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.surgeries enable row level security;

create policy "Users can read their own surgeries"
on public.surgeries
for select
using (auth.uid() = user_id);

create policy "Users can insert their own surgeries"
on public.surgeries
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own surgeries"
on public.surgeries
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own surgeries"
on public.surgeries
for delete
using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists surgeries_set_updated_at on public.surgeries;

create trigger surgeries_set_updated_at
before update on public.surgeries
for each row
execute function public.set_updated_at();
