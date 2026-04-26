-- Athlete OS — Update v4: Team Schedule + Attendance

-- Events table
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade,
  type text not null, -- Practice|Game|Team Meeting|Recovery Session
  title text not null,
  opponent text,
  date date not null,
  start_time text,
  end_time text,
  location text,
  field_number text,
  notes text,
  coach_focus text,
  intensity_level text, -- Low|Moderate|High|Match
  status text default 'Scheduled', -- Scheduled|Canceled|Rescheduled
  formation text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table events enable row level security;
create policy "public_all_events" on events for all using (true);

-- Attendance table
create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  player_id uuid references players(id) on delete cascade,
  status text default 'Not Responded', -- Confirmed|Maybe|Unavailable|Not Responded
  response_note text,
  responded_at timestamptz,
  created_at timestamptz default now(),
  unique(event_id, player_id)
);

alter table attendance enable row level security;
create policy "public_all_attendance" on attendance for all using (true);

-- Add performance_focus to players (replaces body_goal)
alter table players add column if not exists performance_focus text;

-- Trigger for events updated_at
create or replace function update_events_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger events_updated_at before update on events
  for each row execute function update_events_updated_at();
