-- Run this in Supabase SQL Editor

-- Add profile fields to players table
alter table players add column if not exists avatar_url text;
alter table players add column if not exists bio text;
alter table players add column if not exists jersey_number integer;
alter table players add column if not exists preferred_foot text; -- left|right|both

-- Create storage bucket for avatars
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Allow public access to avatars
create policy "public_avatar_access" on storage.objects
  for all using (bucket_id = 'avatars')
  with check (bucket_id = 'avatars');
