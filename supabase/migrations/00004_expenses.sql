-- VOYAQ 004: Expenses table

create table if not exists expenses (
  id text primary key,
  squad_id uuid not null references squads(id) on delete cascade,
  paid_by uuid not null references profiles(id) on delete cascade,
  description text not null,
  amount numeric(10,2) not null check (amount > 0),
  category text not null check (category in ('food','transport','stay','activities','other')),
  split jsonb not null default '[]'::jsonb,
  date text,
  created_at timestamptz not null default now()
);

create index if not exists idx_expenses_squad on expenses(squad_id);
create index if not exists idx_expenses_paid_by on expenses(paid_by);

-- RLS
alter table expenses enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Expenses are viewable by squad members') then
    create policy "Expenses are viewable by squad members"
      on expenses for select
      using (exists (select 1 from squad_members where squad_members.squad_id = expenses.squad_id and squad_members.profile_id = auth.uid()));
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Squad members can add expenses') then
    create policy "Squad members can add expenses"
      on expenses for insert
      with check (exists (select 1 from squad_members where squad_members.squad_id = expenses.squad_id and squad_members.profile_id = auth.uid()));
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Payer can update own expense') then
    create policy "Payer can update own expense"
      on expenses for update
      using (paid_by = auth.uid());
  end if;

  if not exists (select 1 from pg_policies where policyname = 'Payer can delete own expense') then
    create policy "Payer can delete own expense"
      on expenses for delete
      using (paid_by = auth.uid());
  end if;
end $$;
