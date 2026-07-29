-- VOYAQ 003: Squad repository support
-- Adds updated_at for concurrency control, create_squad RPC function

-- 1. Add updated_at column to squads for optimistic concurrency
alter table squads add column if not exists updated_at timestamptz not null default now();

-- 2. Trigger to auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_squads_updated_at on squads;
create trigger trg_squads_updated_at
  before update on squads
  for each row
  execute function update_updated_at();

-- 3. RPC: create_squad — atomic squad creation + owner membership
create or replace function create_squad(
  p_id text,
  p_name text,
  p_invite_code text,
  p_created_by uuid,
  p_member_limit int default 8
) returns jsonb
language plpgsql security definer
as $$
declare
  v_squad_id uuid;
  v_result jsonb;
begin
  -- Insert squad (use p_id if valid uuid, else generate)
  begin
    v_squad_id := p_id::uuid;
  exception when others then
    v_squad_id := gen_random_uuid();
  end;

  insert into squads (id, name, invite_code, created_by, member_limit)
  values (v_squad_id, p_name, p_invite_code, p_created_by, p_member_limit);

  -- Add creator as owner member
  insert into squad_members (squad_id, profile_id, verified)
  values (v_squad_id, p_created_by, true);

  -- Return created squad id
  select jsonb_build_object(
    'id', v_squad_id::text,
    'name', p_name,
    'invite_code', p_invite_code
  ) into v_result;

  return v_result;
end;
$$;

-- 4. Add locked_dates jsonb column for storing date range as JSON
alter table squads add column if not exists locked_dates jsonb;
