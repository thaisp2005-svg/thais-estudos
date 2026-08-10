-- Dados fictícios para testar o sistema completo antes de ter conteúdo de
-- verdade. Rode DEPOIS de 0001_init.sql e 0002_dev_sem_login.sql.
-- Para apagar tudo isso depois, veja supabase/limpar_seed.sql.

do $$
declare
  plano_a uuid;
  plano_b uuid;
  m_anatomia uuid;
  m_farmaco uuid;
  m_fisio uuid;
  m_bioquimica uuid;
  m_genetica uuid;
  c1 uuid; -- Sistema nervoso central
  c2 uuid; -- Farmacologia - antibioticos
  c3 uuid; -- Ciclo de Krebs
  c4 uuid; -- Ciclo menstrual e hormonios
  c5 uuid; -- Heranca mendeliana
begin
  select id into plano_a from planos_revisao where nome = 'Plano A' and user_id is null;
  select id into plano_b from planos_revisao where nome = 'Plano B' and user_id is null;

  insert into materias (nome, cor) values ('Anatomia', '#24476B') returning id into m_anatomia;
  insert into materias (nome, cor) values ('Farmacologia', '#F2994A') returning id into m_farmaco;
  insert into materias (nome, cor) values ('Fisiologia', '#FF3D9A') returning id into m_fisio;
  insert into materias (nome, cor) values ('Bioquímica', '#5AA9E6') returning id into m_bioquimica;
  insert into materias (nome, cor) values ('Genética', '#8FBF6B') returning id into m_genetica;

  -- Conteúdo 1: plano B, iniciado há 10 dias -> 2 revisões atrasadas, 2 futuras
  insert into conteudos_estudo (titulo, materia_id, observacoes, data_inicial, plano_revisao_id)
    values ('Sistema nervoso central', m_anatomia, 'Foco em vias motoras e sensitivas.', '2026-07-29', plano_b)
    returning id into c1;
  insert into eventos (tipo, titulo, data, status, conteudo_id, numero_revisao, concluido_em) values
    ('revisao', 'Sistema nervoso central · Revisão (24h)', '2026-07-30', 'feito', c1, 1, '2026-07-30 20:00:00+00'),
    ('revisao', 'Sistema nervoso central · Revisão (7 dias)', '2026-08-05', 'pendente', c1, 2, null),
    ('revisao', 'Sistema nervoso central · Revisão (30 dias)', '2026-08-28', 'pendente', c1, 3, null),
    ('revisao', 'Sistema nervoso central · Revisão (90 dias)', '2026-10-27', 'pendente', c1, 4, null);

  -- Conteúdo 2: plano A, iniciado ontem -> primeira revisão cai hoje
  insert into conteudos_estudo (titulo, materia_id, observacoes, data_inicial, plano_revisao_id)
    values ('Farmacologia — antibióticos', m_farmaco, 'Focar nas classes e mecanismos de ação.', '2026-08-07', plano_a)
    returning id into c2;
  insert into eventos (tipo, titulo, data, status, conteudo_id, numero_revisao, concluido_em) values
    ('revisao', 'Farmacologia — antibióticos · Revisão (24h)', '2026-08-08', 'pendente', c2, 1, null),
    ('revisao', 'Farmacologia — antibióticos · Revisão (7 dias)', '2026-08-14', 'pendente', c2, 2, null),
    ('revisao', 'Farmacologia — antibióticos · Revisão (30 dias)', '2026-09-06', 'pendente', c2, 3, null);

  -- Conteúdo 3: plano A, iniciado há 1 semana -> uma revisão já feita, uma hoje
  insert into conteudos_estudo (titulo, materia_id, observacoes, data_inicial, plano_revisao_id)
    values ('Ciclo de Krebs', m_bioquimica, null, '2026-08-01', plano_a)
    returning id into c3;
  insert into eventos (tipo, titulo, data, status, conteudo_id, numero_revisao, concluido_em) values
    ('revisao', 'Ciclo de Krebs · Revisão (24h)', '2026-08-02', 'feito', c3, 1, '2026-08-02 19:00:00+00'),
    ('revisao', 'Ciclo de Krebs · Revisão (7 dias)', '2026-08-08', 'pendente', c3, 2, null),
    ('revisao', 'Ciclo de Krebs · Revisão (30 dias)', '2026-08-31', 'pendente', c3, 3, null);

  -- Conteúdo 4: plano A, mais atrasos para o Painel ficar rico
  insert into conteudos_estudo (titulo, materia_id, observacoes, data_inicial, plano_revisao_id)
    values ('Ciclo menstrual e hormônios', m_fisio, null, '2026-07-25', plano_a)
    returning id into c4;
  insert into eventos (tipo, titulo, data, status, conteudo_id, numero_revisao, concluido_em) values
    ('revisao', 'Ciclo menstrual e hormônios · Revisão (24h)', '2026-07-26', 'feito', c4, 1, '2026-07-26 21:00:00+00'),
    ('revisao', 'Ciclo menstrual e hormônios · Revisão (7 dias)', '2026-08-01', 'pendente', c4, 2, null),
    ('revisao', 'Ciclo menstrual e hormônios · Revisão (30 dias)', '2026-08-24', 'pendente', c4, 3, null);

  -- Conteúdo 5: plano A, começa daqui a alguns dias -> só revisões futuras
  insert into conteudos_estudo (titulo, materia_id, observacoes, data_inicial, plano_revisao_id)
    values ('Herança mendeliana', m_genetica, null, '2026-08-10', plano_a)
    returning id into c5;
  insert into eventos (tipo, titulo, data, status, conteudo_id, numero_revisao, concluido_em) values
    ('revisao', 'Herança mendeliana · Revisão (24h)', '2026-08-11', 'pendente', c5, 1, null),
    ('revisao', 'Herança mendeliana · Revisão (7 dias)', '2026-08-17', 'pendente', c5, 2, null),
    ('revisao', 'Herança mendeliana · Revisão (30 dias)', '2026-09-09', 'pendente', c5, 3, null);

  -- Tarefas/compromissos avulsos (sem conteúdo, sempre cinza na agenda)
  insert into eventos (tipo, titulo, data, status) values
    ('compromisso', 'Reunião com orientador', '2026-08-05', 'pendente'),
    ('tarefa', 'Organizar resumos da semana', '2026-08-08', 'pendente'),
    ('compromisso', 'Prova de Farmacologia', '2026-08-20', 'pendente');
end $$;
