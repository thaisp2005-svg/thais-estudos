-- Horário opcional em tarefas/compromissos (a recorrência não precisa de coluna:
-- cada ocorrência vira sua própria linha em `eventos`, geradas todas de uma vez
-- na criação — mesmo princípio já usado pelas revisões de estudo).
alter table eventos add column if not exists horario_inicio time;
alter table eventos add column if not exists horario_fim time;

-- Preferência de aparência (claro/escuro/automático), guardada no banco em vez
-- de localStorage, para carregar igual em qualquer dispositivo. Tabela com uma
-- linha só: `id boolean primary key default true check (id)` garante que nunca
-- exista uma segunda linha.
create table if not exists preferencias (
  id boolean primary key default true check (id),
  tema text not null default 'auto' check (tema in ('light', 'dark', 'auto')),
  atualizado_em timestamptz not null default now()
);

alter table preferencias enable row level security;

create policy "preferencias: acesso livre (sem login)" on preferencias
  for all using (true) with check (true);

insert into preferencias (id, tema) values (true, 'auto') on conflict (id) do nothing;
