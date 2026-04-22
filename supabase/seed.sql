-- Seeds para testes de integração
-- Executar APÓS aplicar as migrations e criar os usuários no Supabase Auth.
--
-- Pré-requisito: criar os usuários via Supabase dashboard ou CLI:
--   supabase auth create-user --email worker@test.com --password test123456
--   supabase auth create-user --email supervisor@test.com --password test123456
-- Então copiar os UUIDs gerados nos valores abaixo.
--
-- Substitua os UUIDs marcados com <WORKER_ID> e <SUPERVISOR_ID> pelos reais.

-- perfis
insert into perfis (id, nome, role) values
  ('00000000-0000-0000-0000-000000000001', 'Operário Teste',    'worker'),
  ('00000000-0000-0000-0000-000000000002', 'Supervisor Teste',  'supervisor')
on conflict (id) do nothing;

-- equipamentos
insert into equipamentos (id, serial, nome) values
  ('10000000-0000-0000-0000-000000000001', 'SN-001', 'Compressor A'),
  ('10000000-0000-0000-0000-000000000002', 'SN-002', 'Torno CNC B'),
  ('10000000-0000-0000-0000-000000000003', 'SN-003', null)
on conflict (serial) do nothing;

-- leituras (3 do worker, 2 do supervisor)
insert into leituras (id, serial, operario_id, registrado_em, latitude, longitude) values
  ('20000000-0000-0000-0000-000000000001', 'SN-001', '00000000-0000-0000-0000-000000000001', now() - interval '4 hours', -23.550520, -46.633308),
  ('20000000-0000-0000-0000-000000000002', 'SN-002', '00000000-0000-0000-0000-000000000001', now() - interval '3 hours', -23.550520, -46.633308),
  ('20000000-0000-0000-0000-000000000003', 'SN-003', '00000000-0000-0000-0000-000000000001', now() - interval '2 hours', null, null),
  ('20000000-0000-0000-0000-000000000004', 'SN-001', '00000000-0000-0000-0000-000000000002', now() - interval '1 hour',  -23.550520, -46.633308),
  ('20000000-0000-0000-0000-000000000005', 'SN-002', '00000000-0000-0000-0000-000000000002', now(),                      null, null)
on conflict (id) do nothing;
