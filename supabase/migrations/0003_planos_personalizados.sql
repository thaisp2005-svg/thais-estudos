-- Suporte a planos de revisão personalizados criados pelo usuário.
-- Rode no SQL editor do Supabase, depois de 0001 e 0002.

-- Marca quais planos são os padrões do sistema (Plano A e B). Sem login,
-- user_id fica nulo em tudo, então precisamos desta coluna para distinguir
-- os padrões (não editáveis) dos criados pelo usuário.
alter table planos_revisao add column if not exists is_padrao boolean not null default false;
update planos_revisao set is_padrao = true where nome in ('Plano A', 'Plano B') and user_id is null;

-- TEMPORÁRIO (junto com 0002): libera criar/editar/excluir planos sem login.
drop policy if exists "planos: ver padrões e os próprios" on planos_revisao;
drop policy if exists "planos: criar os próprios" on planos_revisao;
drop policy if exists "planos: editar os próprios" on planos_revisao;
drop policy if exists "planos: excluir os próprios" on planos_revisao;

create policy "planos: acesso livre (sem login)" on planos_revisao
  for all using (true) with check (true);

-- Protege os planos padrão contra edição/exclusão acidental pelo app.
create or replace function impedir_alterar_plano_padrao()
returns trigger as $$
begin
  if old.is_padrao then
    raise exception 'Os planos padrão não podem ser alterados nem excluídos.';
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$ language plpgsql;

drop trigger if exists trg_plano_padrao_update on planos_revisao;
create trigger trg_plano_padrao_update
  before update on planos_revisao
  for each row execute function impedir_alterar_plano_padrao();

drop trigger if exists trg_plano_padrao_delete on planos_revisao;
create trigger trg_plano_padrao_delete
  before delete on planos_revisao
  for each row execute function impedir_alterar_plano_padrao();
