-- ============================================================
-- URGESTOP DATABASE SETUP
-- Run this entire file in: Supabase → SQL Editor → New Query
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── PROFILES ─────────────────────────────────────────────────
create table profiles (
  id                         uuid primary key references auth.users(id) on delete cascade,
  sobriety_start_date        date,
  substance_focus            text not null default 'unspecified',
  estimated_daily_spend_usd  numeric(8,2) default 0,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

-- ── URGE LOGS ─────────────────────────────────────────────────
create table urge_logs (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references profiles(id) on delete cascade,
  logged_at            timestamptz not null default now(),
  intensity_raw        smallint not null check (intensity_raw between 1 and 10),
  trigger_tags         text[] not null default '{}',
  context_location     text,
  coping_used          text,
  coping_successful    boolean,
  narrative_encrypted  text,
  deleted_at           timestamptz
);

-- ── JOURNAL ENTRIES ──────────────────────────────────────────
create table journal_entries (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references profiles(id) on delete cascade,
  entry_date            date not null default current_date,
  mood_score            smallint check (mood_score between 1 and 5),
  reflection_encrypted  text,
  created_at            timestamptz not null default now(),
  unique (user_id, entry_date)
);

-- ── PLEDGE COMPLETIONS ───────────────────────────────────────
create table pledge_completions (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references profiles(id) on delete cascade,
  completed_date  date not null default current_date,
  period          text not null check (period in ('morning', 'evening')),
  pledge_ids      text[] not null default '{}',
  mood_score      smallint check (mood_score between 1 and 5),
  created_at      timestamptz not null default now(),
  unique (user_id, completed_date, period)
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
alter table profiles           enable row level security;
alter table urge_logs          enable row level security;
alter table journal_entries    enable row level security;
alter table pledge_completions enable row level security;

create policy "own_profile"             on profiles           using (id = auth.uid());
create policy "own_urge_logs"           on urge_logs          using (user_id = auth.uid());
create policy "own_journal_entries"     on journal_entries    using (user_id = auth.uid());
create policy "own_pledge_completions"  on pledge_completions using (user_id = auth.uid());

-- ── AUTO-CREATE PROFILE ON SIGNUP ───────────────────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── INDEXES ──────────────────────────────────────────────────
create index idx_urge_logs_user_time
  on urge_logs (user_id, logged_at desc)
  where deleted_at is null;

create index idx_journal_entries_user_date
  on journal_entries (user_id, entry_date desc);

create index idx_pledge_completions_user_date
  on pledge_completions (user_id, completed_date desc);
