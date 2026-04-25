-- Athlete OS — Supabase Schema
-- Run this entire file in your Supabase SQL Editor

create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  team_code text unique not null,
  coach_code text unique not null,
  created_at timestamptz default now()
);

create table players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  name text not null,
  pin text not null,
  position text not null,
  gym_focus text not null,
  body_goal text not null,
  height_in numeric,
  weight_lbs numeric,
  body_fat_pct numeric,
  arm_in numeric,
  arm_target_in numeric,
  sprint_40m numeric,
  vertical_in numeric,
  bench_lbs numeric,
  squat_lbs numeric,
  is_injured boolean default false,
  injury_stage integer default 0,
  coach_note text,
  coach_focus text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table checkins (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  week_date date not null,
  weight_lbs numeric,
  sprint_40m numeric,
  bench_lbs numeric,
  sleep_avg numeric,
  energy_avg numeric,
  soreness_avg numeric,
  days_completed integer,
  cal_target integer,
  adjustments jsonb,
  created_at timestamptz default now(),
  unique(player_id, week_date)
);

create table game_logs (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  game_date date not null,
  opponent text,
  minutes_played integer,
  stats jsonb not null default '{}',
  self_rating integer,
  run_worked text,
  notes text,
  created_at timestamptz default now()
);

create table lift_logs (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  logged_at timestamptz default now(),
  exercise text not null,
  weight_lbs numeric,
  reps integer
);

create table measurements (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id) on delete cascade,
  measured_at date not null,
  weight_lbs numeric,
  arm_in numeric,
  sprint_40m numeric,
  bench_lbs numeric,
  vertical_in numeric,
  unique(player_id, measured_at)
);

alter table teams enable row level security;
alter table players enable row level security;
alter table checkins enable row level security;
alter table game_logs enable row level security;
alter table lift_logs enable row level security;
alter table measurements enable row level security;

create policy "public_read_teams" on teams for select using (true);
create policy "public_insert_teams" on teams for insert with check (true);
create policy "public_all_players" on players for all using (true);
create policy "public_all_checkins" on checkins for all using (true);
create policy "public_all_gamelogs" on game_logs for all using (true);
create policy "public_all_liftlogs" on lift_logs for all using (true);
create policy "public_all_measurements" on measurements for all using (true);

create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger players_updated_at before update on players
  for each row execute function update_updated_at();
