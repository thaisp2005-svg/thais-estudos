-- TEMPORÁRIO: libera o uso do app sem login, para testar o sistema completo
-- antes de implementar autenticação. Quando o login for adicionado, reverter
-- este arquivo (restaurar as policies estritas de auth.uid() = user_id e
-- voltar user_id para NOT NULL / default auth.uid()).
--
-- Rode este arquivo no SQL editor do Supabase, depois de já ter rodado
-- 0001_init.sql.

-- materias -------------------------------------------------------------
alter table materias alter column user_id drop not null;
alter table materias alter column user_id drop default;

drop policy if exists "materias: ver as próprias" on materias;
drop policy if exists "materias: criar as próprias" on materias;
drop policy if exists "materias: editar as próprias" on materias;
drop policy if exists "materias: excluir as próprias" on materias;

create policy "materias: acesso livre (sem login)" on materias
  for all using (true) with check (true);

-- conteudos_estudo -------------------------------------------------------
alter table conteudos_estudo alter column user_id drop not null;
alter table conteudos_estudo alter column user_id drop default;

drop policy if exists "conteudos: ver os próprios" on conteudos_estudo;
drop policy if exists "conteudos: criar os próprios" on conteudos_estudo;
drop policy if exists "conteudos: editar os próprios" on conteudos_estudo;
drop policy if exists "conteudos: excluir os próprios" on conteudos_estudo;

create policy "conteudos: acesso livre (sem login)" on conteudos_estudo
  for all using (true) with check (true);

-- eventos -------------------------------------------------------
alter table eventos alter column user_id drop not null;
alter table eventos alter column user_id drop default;
alter table eventos add column if not exists observacoes text;

drop policy if exists "eventos: ver os próprios" on eventos;
drop policy if exists "eventos: criar os próprios" on eventos;
drop policy if exists "eventos: editar os próprios" on eventos;
drop policy if exists "eventos: excluir os próprios" on eventos;

create policy "eventos: acesso livre (sem login)" on eventos
  for all using (true) with check (true);
