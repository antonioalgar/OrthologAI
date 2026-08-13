alter table public.surgeries
add column if not exists practice_setting text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'surgeries_practice_setting_check'
  ) then
    alter table public.surgeries
    add constraint surgeries_practice_setting_check
    check (practice_setting in ('public', 'private') or practice_setting is null);
  end if;
end $$;

create table if not exists public.professional_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  surgery_id uuid references public.surgeries(id) on delete cascade,
  activity_type text not null,
  activity_date date not null,
  payer_type text,
  payer_name text,
  expected_amount numeric(12, 2),
  invoiced_amount numeric(12, 2),
  received_amount numeric(12, 2),
  invoice_date date,
  payment_date date,
  billing_status text not null default 'not_invoiced',
  billing_notes text,
  currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint professional_activities_activity_type_check
    check (activity_type in ('surgery', 'consultation', 'follow_up', 'injection', 'prp', 'outpatient_procedure', 'other')),
  constraint professional_activities_payer_type_check
    check (payer_type in ('insurance', 'private_patient', 'other') or payer_type is null),
  constraint professional_activities_billing_status_check
    check (billing_status in ('not_invoiced', 'invoiced', 'paid', 'issue')),
  constraint professional_activities_currency_check
    check (currency = 'EUR'),
  constraint professional_activities_expected_amount_check
    check (expected_amount is null or expected_amount >= 0),
  constraint professional_activities_invoiced_amount_check
    check (invoiced_amount is null or invoiced_amount >= 0),
  constraint professional_activities_received_amount_check
    check (received_amount is null or received_amount >= 0)
);

create unique index if not exists professional_activities_one_surgery_activity_per_surgery
on public.professional_activities (surgery_id)
where surgery_id is not null
  and activity_type = 'surgery';

create index if not exists professional_activities_user_status_idx
on public.professional_activities (user_id, billing_status);

create index if not exists professional_activities_user_date_idx
on public.professional_activities (user_id, activity_date desc);

alter table public.professional_activities enable row level security;

drop policy if exists "Users can read their own professional activities" on public.professional_activities;
drop policy if exists "Users can insert professional activities for their own surgeries" on public.professional_activities;
drop policy if exists "Users can update their own professional activities" on public.professional_activities;
drop policy if exists "Users can delete their own professional activities" on public.professional_activities;

create policy "Users can read their own professional activities"
on public.professional_activities
for select
using (auth.uid() = user_id);

create policy "Users can insert professional activities for their own surgeries"
on public.professional_activities
for insert
with check (
  auth.uid() = user_id
  and (
    surgery_id is null
    or exists (
      select 1
      from public.surgeries
      where surgeries.id = professional_activities.surgery_id
        and surgeries.user_id = auth.uid()
    )
  )
);

create policy "Users can update their own professional activities"
on public.professional_activities
for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and (
    surgery_id is null
    or exists (
      select 1
      from public.surgeries
      where surgeries.id = professional_activities.surgery_id
        and surgeries.user_id = auth.uid()
    )
  )
);

create policy "Users can delete their own professional activities"
on public.professional_activities
for delete
using (auth.uid() = user_id);

drop trigger if exists professional_activities_set_updated_at on public.professional_activities;

create trigger professional_activities_set_updated_at
before update on public.professional_activities
for each row
execute function public.set_updated_at();

insert into public.professional_activities (
  user_id,
  surgery_id,
  activity_type,
  activity_date,
  expected_amount,
  billing_status
)
select
  surgeries.user_id,
  surgeries.id,
  'surgery',
  surgeries.surgery_date,
  surgeries.payment_amount,
  case
    when surgeries.is_paid then 'paid'
    when surgeries.is_invoiced then 'invoiced'
    else 'not_invoiced'
  end
from public.surgeries
where surgeries.payment_amount is not null
   or surgeries.is_invoiced
   or surgeries.is_paid
on conflict (surgery_id)
where surgery_id is not null
  and activity_type = 'surgery'
do nothing;
