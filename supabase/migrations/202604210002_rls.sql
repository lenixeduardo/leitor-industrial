-- ============================================================
-- RLS: perfis
-- ============================================================
alter table perfis enable row level security;

-- each user can only read their own profile row
create policy "perfis_select_own"
  on perfis for select
  using (auth.uid() = id);

-- ============================================================
-- RLS: equipamentos
-- ============================================================
alter table equipamentos enable row level security;

-- any authenticated user can read equipment
create policy "equipamentos_select_auth"
  on equipamentos for select
  using (auth.uid() is not null);

-- only supervisors can update equipment metadata
create policy "equipamentos_update_supervisor"
  on equipamentos for update
  using (
    exists (
      select 1 from perfis
      where id = auth.uid() and role = 'supervisor'
    )
  );

-- scan endpoint does upsert via service role key, so no insert policy needed for anon/user

-- ============================================================
-- RLS: leituras
-- ============================================================
alter table leituras enable row level security;

-- worker sees only own readings; supervisor sees all
create policy "leituras_select_own_or_supervisor"
  on leituras for select
  using (
    operario_id = auth.uid()
    or exists (
      select 1 from perfis
      where id = auth.uid() and role = 'supervisor'
    )
  );

-- authenticated user can insert their own readings
create policy "leituras_insert_auth"
  on leituras for insert
  with check (
    auth.uid() is not null
    and operario_id = auth.uid()
  );
