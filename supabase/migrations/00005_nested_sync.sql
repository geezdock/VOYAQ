-- VOYAQ 005: Nested collection sync
-- Persists client-owned collections (date proposals, polls) as JSONB on the squad row,
-- and adds a UPI id on squad members for expense settlement.

-- 1. JSONB columns for client-owned nested collections
alter table squads add column if not exists date_proposals_json jsonb;
alter table squads add column if not exists polls_json jsonb;

-- 2. UPI id on squad members (for expense settlement QR)
alter table squad_members add column if not exists upi_id text;

-- 3. RPC: join_squad — atomically adds the authenticated user to a squad by invite code.
-- Security definer so non-members can look up a squad they were invited to.
create or replace function join_squad(p_invite_code text)
returns jsonb
language plpgsql security definer
as $$
declare
  v_squad_id uuid;
  v_member_count int;
  v_member_limit int;
  v_profile_id uuid := auth.uid();
begin
  if v_profile_id is null then
    raise exception 'Not authenticated';
  end if;

  select id, member_limit into v_squad_id, v_member_limit
  from squads
  where invite_code = p_invite_code;

  if v_squad_id is null then
    raise exception 'Squad not found';
  end if;

  select count(*) into v_member_count
  from squad_members
  where squad_id = v_squad_id;

  if v_member_count >= v_member_limit then
    raise exception 'Squad is full';
  end if;

  insert into squad_members (squad_id, profile_id, verified)
  values (v_squad_id, v_profile_id, false)
  on conflict (squad_id, profile_id) do nothing;

  return jsonb_build_object('id', v_squad_id::text);
end;
$$;
