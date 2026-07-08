create table if not exists public.surgery_evolution_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  surgery_id uuid not null references public.surgeries(id) on delete cascade,
  event_type text not null check (event_type in ('first_review', 'review', 'discharge')),
  title text not null,
  scheduled_date date not null,
  clinical_state text,
  notes text,
  next_steps text,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists surgery_evolution_events_one_first_review
on public.surgery_evolution_events (surgery_id)
where event_type = 'first_review';

alter table public.surgery_evolution_events enable row level security;

drop policy if exists "Users can read their own surgery evolution events" on public.surgery_evolution_events;
drop policy if exists "Users can insert evolution events for their own surgeries" on public.surgery_evolution_events;
drop policy if exists "Users can update their own surgery evolution events" on public.surgery_evolution_events;
drop policy if exists "Users can delete their own surgery evolution events" on public.surgery_evolution_events;

create policy "Users can read their own surgery evolution events"
on public.surgery_evolution_events
for select
using (auth.uid() = user_id);

create policy "Users can insert evolution events for their own surgeries"
on public.surgery_evolution_events
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.surgeries
    where surgeries.id = surgery_evolution_events.surgery_id
      and surgeries.user_id = auth.uid()
  )
);

create policy "Users can update their own surgery evolution events"
on public.surgery_evolution_events
for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.surgeries
    where surgeries.id = surgery_evolution_events.surgery_id
      and surgeries.user_id = auth.uid()
  )
);

create policy "Users can delete their own surgery evolution events"
on public.surgery_evolution_events
for delete
using (auth.uid() = user_id);

drop trigger if exists surgery_evolution_events_set_updated_at on public.surgery_evolution_events;

create trigger surgery_evolution_events_set_updated_at
before update on public.surgery_evolution_events
for each row
execute function public.set_updated_at();
