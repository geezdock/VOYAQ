-- VOYAQ 006: Fix infinite RLS recursion on squad_members
--
-- The policy "Members are viewable by squad members" (00001) references
-- squad_members inside its own USING clause, and every other policy that
-- checked membership via `exists (select 1 from squad_members ...)` triggered
-- that policy recursively. Postgres aborts these reads with:
--   infinite recursion detected in policy for relation "squad_members"
--
-- Fix: introduce a SECURITY DEFINER helper that checks membership without
-- re-entering RLS, and rewrite every policy that referenced squad_members
-- inline to use it.

create or replace function public.is_squad_member(p_squad_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    exists (
      select 1 from public.squad_members sm
      where sm.squad_id = p_squad_id and sm.profile_id = auth.uid()
    )
    or exists (
      select 1 from public.squads s
      where s.id = p_squad_id and s.created_by = auth.uid()
    );
$$;

grant execute on function public.is_squad_member(uuid) to anon, authenticated;

-- ── Squads ─────────────────────────────────────────────
drop policy if exists "Squad members can view their squads" on squads;
create policy "Squad members can view their squads"
  on squads for select
  using (public.is_squad_member(id));

-- ── Squad members ──────────────────────────────────────
drop policy if exists "Members are viewable by squad members" on squad_members;
create policy "Members are viewable by squad members"
  on squad_members for select
  using (public.is_squad_member(squad_id));

-- ── Destinations ───────────────────────────────────────
drop policy if exists "Destinations are viewable by squad members" on destinations;
create policy "Destinations are viewable by squad members"
  on destinations for select
  using (public.is_squad_member(squad_id));

drop policy if exists "Squad members can add destinations" on destinations;
create policy "Squad members can add destinations"
  on destinations for insert
  with check (public.is_squad_member(squad_id));

drop policy if exists "Squad members can delete destinations" on destinations;
create policy "Squad members can delete destinations"
  on destinations for delete
  using (public.is_squad_member(squad_id));

-- ── Destination votes ──────────────────────────────────
drop policy if exists "Votes are viewable by squad members" on destination_votes;
create policy "Votes are viewable by squad members"
  on destination_votes for select
  using (public.is_squad_member(squad_id));

drop policy if exists "Users can manage own votes" on destination_votes;
create policy "Users can manage own votes"
  on destination_votes for insert
  with check (
    member_id = auth.uid()
    and public.is_squad_member(squad_id)
  );

-- ── Budget preferences ─────────────────────────────────
drop policy if exists "Budget prefs are viewable by squad members" on budget_preferences;
create policy "Budget prefs are viewable by squad members"
  on budget_preferences for select
  using (public.is_squad_member(squad_id));

drop policy if exists "Users can manage own budget" on budget_preferences;
create policy "Users can manage own budget"
  on budget_preferences for insert
  with check (
    member_id = auth.uid()
    and public.is_squad_member(squad_id)
  );

-- ── Date proposals ─────────────────────────────────────
drop policy if exists "Date proposals are viewable by squad members" on date_proposals;
create policy "Date proposals are viewable by squad members"
  on date_proposals for select
  using (public.is_squad_member(squad_id));

drop policy if exists "Squad members can create proposals" on date_proposals;
create policy "Squad members can create proposals"
  on date_proposals for insert
  with check (public.is_squad_member(squad_id));

-- ── Date proposal votes ────────────────────────────────
drop policy if exists "Date votes are viewable by squad members" on date_proposal_votes;
create policy "Date votes are viewable by squad members"
  on date_proposal_votes for select
  using (
    exists (
      select 1 from date_proposals dp
      where dp.id = date_proposal_votes.date_proposal_id
        and public.is_squad_member(dp.squad_id)
    )
  );

-- ── Polls ──────────────────────────────────────────────
drop policy if exists "Polls are viewable by squad members" on polls;
create policy "Polls are viewable by squad members"
  on polls for select
  using (public.is_squad_member(squad_id));

drop policy if exists "Squad members can create polls" on polls;
create policy "Squad members can create polls"
  on polls for insert
  with check (public.is_squad_member(squad_id));

-- ── Poll options ───────────────────────────────────────
drop policy if exists "Poll options are viewable by squad members" on poll_options;
create policy "Poll options are viewable by squad members"
  on poll_options for select
  using (
    exists (
      select 1 from polls p
      where p.id = poll_options.poll_id
        and public.is_squad_member(p.squad_id)
    )
  );

drop policy if exists "Squad members can add options" on poll_options;
create policy "Squad members can add options"
  on poll_options for insert
  with check (
    exists (
      select 1 from polls p
      where p.id = poll_options.poll_id
        and public.is_squad_member(p.squad_id)
    )
  );

-- ── Poll votes ─────────────────────────────────────────
drop policy if exists "Poll votes are viewable by squad members" on poll_votes;
create policy "Poll votes are viewable by squad members"
  on poll_votes for select
  using (
    exists (
      select 1 from poll_options po
      join polls p on p.id = po.poll_id
      where po.id = poll_votes.poll_option_id
        and public.is_squad_member(p.squad_id)
    )
  );
