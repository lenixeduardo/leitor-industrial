-- perfis (one row per auth.users record)
create table perfis (
  id   uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  role text not null check (role in ('worker', 'supervisor'))
);

-- equipamentos (auto-created on first scan of unknown serial)
create table equipamentos (
  id        uuid primary key default gen_random_uuid(),
  serial    text not null unique,
  nome      text,
  criado_em timestamptz default now()
);

-- leituras
create table leituras (
  id            uuid primary key default gen_random_uuid(),
  serial        text not null references equipamentos(serial),
  operario_id   uuid not null references auth.users(id),
  registrado_em timestamptz not null,
  latitude      numeric(9,6),
  longitude     numeric(9,6),
  criado_em     timestamptz default now()
);

-- índices de performance
create index leituras_operario_id_idx  on leituras(operario_id);
create index leituras_serial_idx       on leituras(serial);
create index leituras_registrado_em_idx on leituras(registrado_em desc);
