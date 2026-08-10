-- Esquema inicial: planos de revisão, matérias, conteúdos de estudo e eventos da agenda.
-- Rode este arquivo no SQL editor do seu projeto Supabase (Database > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- planos_revisao: receitas de intervalos (em dias) usadas para gerar revisões.
-- Linhas com user_id nulo são os padrões do sistema (Plano A e Plano B),
-- visíveis para todo mundo mas não editáveis. Planos com user_id preenchido
-- são criados pelo próprio usuário na tela de Configurações.
-- ---------------------------------------------------------------------------
create table if not exists planos_revisao (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  nome text not null,
  intervalos_dias integer[] not null,
  created_at timestamptz not null default now()
);

alter table planos_revisao enable row level security;

create policy "planos: ver padrões e os próprios" on planos_revisao
  for select using (user_id is null or auth.uid() = user_id);
create policy "planos: criar os próprios" on planos_revisao
  for insert with check (auth.uid() = user_id);
create policy "planos: editar os próprios" on planos_revisao
  for update using (auth.uid() = user_id);
create policy "planos: excluir os próprios" on planos_revisao
  for delete using (auth.uid() = user_id);

insert into planos_revisao (user_id, nome, intervalos_dias) values
  (null, 'Plano A', array[1, 7, 30]),
  (null, 'Plano B', array[1, 7, 30, 90]);

-- ---------------------------------------------------------------------------
-- materias: nome + cor escolhida (hex livre — preset ou personalizada).
-- É a fonte da legenda de cores da agenda.
-- ---------------------------------------------------------------------------
create table if not exists materias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nome text not null,
  cor text not null,
  created_at timestamptz not null default now(),
  unique (user_id, nome)
);

alter table materias enable row level security;

create policy "materias: ver as próprias" on materias
  for select using (auth.uid() = user_id);
create policy "materias: criar as próprias" on materias
  for insert with check (auth.uid() = user_id);
create policy "materias: editar as próprias" on materias
  for update using (auth.uid() = user_id);
create policy "materias: excluir as próprias" on materias
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- conteudos_estudo: o que foi estudado, de onde as revisões são geradas.
-- ---------------------------------------------------------------------------
create table if not exists conteudos_estudo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  titulo text not null,
  materia_id uuid references materias(id) on delete set null,
  observacoes text,
  data_inicial date not null,
  plano_revisao_id uuid references planos_revisao(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table conteudos_estudo enable row level security;

create policy "conteudos: ver os próprios" on conteudos_estudo
  for select using (auth.uid() = user_id);
create policy "conteudos: criar os próprios" on conteudos_estudo
  for insert with check (auth.uid() = user_id);
create policy "conteudos: editar os próprios" on conteudos_estudo
  for update using (auth.uid() = user_id);
create policy "conteudos: excluir os próprios" on conteudos_estudo
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- eventos: tudo que aparece na agenda — revisão, tarefa ou compromisso.
-- Revisões ligam de volta ao conteúdo (para herdar a cor da matéria);
-- tarefas/compromissos avulsos não têm conteudo_id e aparecem em cinza.
-- ---------------------------------------------------------------------------
create table if not exists eventos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('revisao', 'tarefa', 'compromisso')),
  titulo text not null,
  data date not null,
  status text not null default 'pendente' check (status in ('pendente', 'feito')),
  conteudo_id uuid references conteudos_estudo(id) on delete cascade,
  numero_revisao integer,
  concluido_em timestamptz,
  created_at timestamptz not null default now()
);

alter table eventos enable row level security;

create policy "eventos: ver os próprios" on eventos
  for select using (auth.uid() = user_id);
create policy "eventos: criar os próprios" on eventos
  for insert with check (auth.uid() = user_id);
create policy "eventos: editar os próprios" on eventos
  for update using (auth.uid() = user_id);
create policy "eventos: excluir os próprios" on eventos
  for delete using (auth.uid() = user_id);

create index if not exists eventos_data_idx on eventos (user_id, data);
create index if not exists eventos_conteudo_idx on eventos (conteudo_id);
