-- VOYAQ RLS Gaps
-- Adds UPDATE policies for tables that were missing them

do $$ begin

  -- Squad members: member can update own membership (e.g. verified flag)
  if not exists (select 1 from pg_policies where policyname = 'Squad member can update own membership') then
    create policy "Squad member can update own membership" on squad_members for update using (profile_id = auth.uid());
  end if;

  -- Destinations: creator can rename/update
  if not exists (select 1 from pg_policies where policyname = 'Creator can update own destination') then
    create policy "Creator can update own destination" on destinations for update using (created_by = auth.uid());
  end if;

  -- Date proposals: proposer can update own proposal
  if not exists (select 1 from pg_policies where policyname = 'Proposer can update own proposal') then
    create policy "Proposer can update own proposal" on date_proposals for update using (proposed_by = auth.uid());
  end if;

  -- Polls: creator can update own poll
  if not exists (select 1 from pg_policies where policyname = 'Creator can update own poll') then
    create policy "Creator can update own poll" on polls for update using (created_by = auth.uid());
  end if;

  -- Poll options: creator of parent poll can update
  if not exists (select 1 from pg_policies where policyname = 'Poll creator can update options') then
    create policy "Poll creator can update options" on poll_options for update using (
      exists (
        select 1 from polls
        where polls.id = poll_options.poll_id
        and polls.created_by = auth.uid()
      )
    );
  end if;

  -- Parental consents: user can update own consent record
  if not exists (select 1 from pg_policies where policyname = 'Users can update own consent') then
    create policy "Users can update own consent" on parental_consents for update using (profile_id = auth.uid());
  end if;

end $$;
