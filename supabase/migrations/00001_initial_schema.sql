-- VOYAQ Initial Schema

-- 0. Extensions
create extension if not exists "pgcrypto";

-- 1. Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  phone text,
  avatar_initial text generated always as (coalesce(left(display_name, 1), '?')) stored,
  avatar_color text not null default 'bg-accent',
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_username on profiles(username);

-- 2. Squads
create table if not exists squads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_by uuid not null references profiles(id) on delete cascade,
  destination text,
  locked_destination text,
  member_limit smallint not null default 8 check (member_limit between 2 and 20),
  budget_per_person numeric(10,2),
  locked_budget numeric(10,2),
  locked_start_date date,
  locked_end_date date,
  status text not null default 'planning' check (status in ('planning','voting','ready','pending','booked','cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists idx_squads_invite_code on squads(invite_code);
create index if not exists idx_squads_created_by on squads(created_by);

-- 3. Squad members
create table if not exists squad_members (
  id uuid primary key default gen_random_uuid(),
  squad_id uuid not null references squads(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  verified boolean not null default false,
  joined_at timestamptz not null default now(),
  unique(squad_id, profile_id)
);

create index if not exists idx_squad_members_squad on squad_members(squad_id);
create index if not exists idx_squad_members_profile on squad_members(profile_id);

-- 4. Destinations (candidate destinations within a squad)
create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  squad_id uuid not null references squads(id) on delete cascade,
  name text not null,
  created_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(squad_id, name)
);

create index if not exists idx_destinations_squad on destinations(squad_id);

-- 5. Destination votes (one per member per squad)
create table if not exists destination_votes (
  id uuid primary key default gen_random_uuid(),
  squad_id uuid not null references squads(id) on delete cascade,
  member_id uuid not null references profiles(id) on delete cascade,
  destination text not null,
  unique(squad_id, member_id)
);

create index if not exists idx_destination_votes_squad on destination_votes(squad_id);

-- 6. Budget preferences (one per member per squad)
create table if not exists budget_preferences (
  id uuid primary key default gen_random_uuid(),
  squad_id uuid not null references squads(id) on delete cascade,
  member_id uuid not null references profiles(id) on delete cascade,
  amount numeric(10,2) not null check (amount >= 0),
  unique(squad_id, member_id)
);

create index if not exists idx_budget_prefs_squad on budget_preferences(squad_id);

-- 7. Date proposals
create table if not exists date_proposals (
  id uuid primary key default gen_random_uuid(),
  squad_id uuid not null references squads(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  proposed_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create index if not exists idx_date_proposals_squad on date_proposals(squad_id);

-- 8. Date proposal votes
create table if not exists date_proposal_votes (
  id uuid primary key default gen_random_uuid(),
  date_proposal_id uuid not null references date_proposals(id) on delete cascade,
  member_id uuid not null references profiles(id) on delete cascade,
  unique(date_proposal_id, member_id)
);

create index if not exists idx_dpv_proposal on date_proposal_votes(date_proposal_id);

-- 9. Polls
create table if not exists polls (
  id uuid primary key default gen_random_uuid(),
  squad_id uuid not null references squads(id) on delete cascade,
  question text not null,
  created_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_polls_squad on polls(squad_id);

-- 10. Poll options
create table if not exists poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  label text not null,
  unique(poll_id, label)
);

create index if not exists idx_poll_options_poll on poll_options(poll_id);

-- 11. Poll votes
create table if not exists poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_option_id uuid not null references poll_options(id) on delete cascade,
  member_id uuid not null references profiles(id) on delete cascade,
  unique(poll_option_id, member_id)
);

create index if not exists idx_poll_votes_option on poll_votes(poll_option_id);

-- 12. Parental consents
create table if not exists parental_consents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  parent_contact_type text not null check (parent_contact_type in ('phone','email')),
  parent_contact_value text not null,
  status text not null default 'pending' check (status in ('pending','approved','denied')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_parental_consents_profile on parental_consents(profile_id);

-- === ROW LEVEL SECURITY ===

do $$ begin
  -- Profiles
  alter table profiles enable row level security;
  if not exists (select 1 from pg_policies where policyname = 'Profiles are viewable by authenticated users') then
    create policy "Profiles are viewable by authenticated users" on profiles for select using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own profile') then
    create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
  end if;

  -- Squads
  alter table squads enable row level security;
  if not exists (select 1 from pg_policies where policyname = 'Squad members can view their squads') then
    create policy "Squad members can view their squads" on squads for select using (exists (select 1 from squad_members where squad_members.squad_id = squads.id and squad_members.profile_id = auth.uid()) or created_by = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated users can create squads') then
    create policy "Authenticated users can create squads" on squads for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Squad creator can update') then
    create policy "Squad creator can update" on squads for update using (created_by = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Squad creator can delete') then
    create policy "Squad creator can delete" on squads for delete using (created_by = auth.uid());
  end if;

  -- Squad members
  alter table squad_members enable row level security;
  if not exists (select 1 from pg_policies where policyname = 'Members are viewable by squad members') then
    create policy "Members are viewable by squad members" on squad_members for select using (exists (select 1 from squad_members sm where sm.squad_id = squad_members.squad_id and sm.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can join squads') then
    create policy "Users can join squads" on squad_members for insert with check (auth.role() = 'authenticated' and profile_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Squad creator can manage members') then
    create policy "Squad creator can manage members" on squad_members for delete using (exists (select 1 from squads where squads.id = squad_members.squad_id and squads.created_by = auth.uid()) or profile_id = auth.uid());
  end if;

  -- Destinations
  alter table destinations enable row level security;
  if not exists (select 1 from pg_policies where policyname = 'Destinations are viewable by squad members') then
    create policy "Destinations are viewable by squad members" on destinations for select using (exists (select 1 from squad_members where squad_members.squad_id = destinations.squad_id and squad_members.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Squad members can add destinations') then
    create policy "Squad members can add destinations" on destinations for insert with check (exists (select 1 from squad_members where squad_members.squad_id = destinations.squad_id and squad_members.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Squad members can delete destinations') then
    create policy "Squad members can delete destinations" on destinations for delete using (exists (select 1 from squad_members where squad_members.squad_id = destinations.squad_id and squad_members.profile_id = auth.uid()));
  end if;

  -- Destination votes
  alter table destination_votes enable row level security;
  if not exists (select 1 from pg_policies where policyname = 'Votes are viewable by squad members') then
    create policy "Votes are viewable by squad members" on destination_votes for select using (exists (select 1 from squad_members where squad_members.squad_id = destination_votes.squad_id and squad_members.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can manage own votes') then
    create policy "Users can manage own votes" on destination_votes for insert with check (member_id = auth.uid() and exists (select 1 from squad_members where squad_members.squad_id = destination_votes.squad_id and squad_members.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own votes') then
    create policy "Users can update own votes" on destination_votes for update using (member_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can delete own votes') then
    create policy "Users can delete own votes" on destination_votes for delete using (member_id = auth.uid());
  end if;

  -- Budget preferences
  alter table budget_preferences enable row level security;
  if not exists (select 1 from pg_policies where policyname = 'Budget prefs are viewable by squad members') then
    create policy "Budget prefs are viewable by squad members" on budget_preferences for select using (exists (select 1 from squad_members where squad_members.squad_id = budget_preferences.squad_id and squad_members.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can manage own budget') then
    create policy "Users can manage own budget" on budget_preferences for insert with check (member_id = auth.uid() and exists (select 1 from squad_members where squad_members.squad_id = budget_preferences.squad_id and squad_members.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own budget') then
    create policy "Users can update own budget" on budget_preferences for update using (member_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can delete own budget') then
    create policy "Users can delete own budget" on budget_preferences for delete using (member_id = auth.uid());
  end if;

  -- Date proposals
  alter table date_proposals enable row level security;
  if not exists (select 1 from pg_policies where policyname = 'Date proposals are viewable by squad members') then
    create policy "Date proposals are viewable by squad members" on date_proposals for select using (exists (select 1 from squad_members where squad_members.squad_id = date_proposals.squad_id and squad_members.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Squad members can create proposals') then
    create policy "Squad members can create proposals" on date_proposals for insert with check (exists (select 1 from squad_members where squad_members.squad_id = date_proposals.squad_id and squad_members.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Proposer can delete own proposal') then
    create policy "Proposer can delete own proposal" on date_proposals for delete using (proposed_by = auth.uid());
  end if;

  -- Date proposal votes
  alter table date_proposal_votes enable row level security;
  if not exists (select 1 from pg_policies where policyname = 'Date votes are viewable by squad members') then
    create policy "Date votes are viewable by squad members" on date_proposal_votes for select using (exists (select 1 from date_proposals dp join squad_members sm on sm.squad_id = dp.squad_id where dp.id = date_proposal_votes.date_proposal_id and sm.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can manage own date votes') then
    create policy "Users can manage own date votes" on date_proposal_votes for insert with check (member_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can delete own date votes') then
    create policy "Users can delete own date votes" on date_proposal_votes for delete using (member_id = auth.uid());
  end if;

  -- Polls
  alter table polls enable row level security;
  if not exists (select 1 from pg_policies where policyname = 'Polls are viewable by squad members') then
    create policy "Polls are viewable by squad members" on polls for select using (exists (select 1 from squad_members where squad_members.squad_id = polls.squad_id and squad_members.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Squad members can create polls') then
    create policy "Squad members can create polls" on polls for insert with check (exists (select 1 from squad_members where squad_members.squad_id = polls.squad_id and squad_members.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Creator can delete own poll') then
    create policy "Creator can delete own poll" on polls for delete using (created_by = auth.uid());
  end if;

  -- Poll options
  alter table poll_options enable row level security;
  if not exists (select 1 from pg_policies where policyname = 'Poll options are viewable by squad members') then
    create policy "Poll options are viewable by squad members" on poll_options for select using (exists (select 1 from polls join squad_members on squad_members.squad_id = polls.squad_id where polls.id = poll_options.poll_id and squad_members.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Squad members can add options') then
    create policy "Squad members can add options" on poll_options for insert with check (exists (select 1 from polls join squad_members on squad_members.squad_id = polls.squad_id where polls.id = poll_options.poll_id and squad_members.profile_id = auth.uid()));
  end if;

  -- Poll votes
  alter table poll_votes enable row level security;
  if not exists (select 1 from pg_policies where policyname = 'Poll votes are viewable by squad members') then
    create policy "Poll votes are viewable by squad members" on poll_votes for select using (exists (select 1 from poll_options po join polls on polls.id = po.poll_id join squad_members on squad_members.squad_id = polls.squad_id where po.id = poll_votes.poll_option_id and squad_members.profile_id = auth.uid()));
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can manage own poll votes') then
    create policy "Users can manage own poll votes" on poll_votes for insert with check (member_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can delete own poll votes') then
    create policy "Users can delete own poll votes" on poll_votes for delete using (member_id = auth.uid());
  end if;

  -- Parental consents
  alter table parental_consents enable row level security;
  if not exists (select 1 from pg_policies where policyname = 'Users can view own consents') then
    create policy "Users can view own consents" on parental_consents for select using (profile_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can create own consent') then
    create policy "Users can create own consent" on parental_consents for insert with check (profile_id = auth.uid());
  end if;
end $$;
