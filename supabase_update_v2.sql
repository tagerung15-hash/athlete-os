-- Run this in Supabase SQL Editor to add new features

-- Add secondary position to players
alter table players add column if not exists secondary_position text;

-- Create lineups table
create table if not exists lineups (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  name text not null,
  formation text,
  slot_positions jsonb,
  assignments jsonb,
  created_at timestamptz default now()
);

alter table lineups enable row level security;
create policy "public_all_lineups" on lineups for all using (true);
