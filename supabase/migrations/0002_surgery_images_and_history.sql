alter table public.surgeries
add column if not exists complications text;

create table if not exists public.surgery_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  surgery_id uuid not null references public.surgeries(id) on delete cascade,
  bucket text not null default 'surgery-images',
  storage_path text not null,
  file_name text,
  content_type text,
  file_size bigint,
  category text,
  caption text,
  created_at timestamptz not null default now()
);

alter table public.surgery_images enable row level security;

drop policy if exists "Users can read their own surgery images" on public.surgery_images;
drop policy if exists "Users can insert images for their own surgeries" on public.surgery_images;
drop policy if exists "Users can delete their own surgery images" on public.surgery_images;

create policy "Users can read their own surgery images"
on public.surgery_images
for select
using (auth.uid() = user_id);

create policy "Users can insert images for their own surgeries"
on public.surgery_images
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.surgeries
    where surgeries.id = surgery_images.surgery_id
      and surgeries.user_id = auth.uid()
  )
);

create policy "Users can delete their own surgery images"
on public.surgery_images
for delete
using (auth.uid() = user_id);

create table if not exists public.user_field_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  field_name text not null,
  value text not null,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, field_name, value)
);

alter table public.user_field_preferences enable row level security;

drop policy if exists "Users can manage their own field preferences" on public.user_field_preferences;

create policy "Users can manage their own field preferences"
on public.user_field_preferences
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('surgery-images', 'surgery-images', false)
on conflict (id) do nothing;

drop policy if exists "Users can read their own surgery image files" on storage.objects;
drop policy if exists "Users can upload their own surgery image files" on storage.objects;
drop policy if exists "Users can update their own surgery image files" on storage.objects;
drop policy if exists "Users can delete their own surgery image files" on storage.objects;

create policy "Users can read their own surgery image files"
on storage.objects
for select
using (
  bucket_id = 'surgery-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can upload their own surgery image files"
on storage.objects
for insert
with check (
  bucket_id = 'surgery-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own surgery image files"
on storage.objects
for update
using (
  bucket_id = 'surgery-images'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'surgery-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own surgery image files"
on storage.objects
for delete
using (
  bucket_id = 'surgery-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
