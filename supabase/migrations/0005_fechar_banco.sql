-- Fecha o banco: a partir daqui, só o servidor da aplicação (usando a chave
-- service_role) consegue ler/gravar nas tabelas. As policies "acesso livre"
-- liberavam qualquer chave, inclusive a anon (pública, embutida em qualquer
-- site que aponte pra este projeto) — removidas sem substituto, então o RLS
-- (já ligado desde 0001) passa a negar tudo por padrão pra quem não for
-- service_role. A chave service_role ignora RLS, então o app continua
-- funcionando normalmente assim que src/lib/supabase/server.ts passar a
-- usá-la no lugar da anon.
--
-- Rode este arquivo no SQL editor do Supabase, depois de já ter rodado
-- 0001 a 0004.

drop policy if exists "planos: acesso livre (sem login)" on planos_revisao;
drop policy if exists "materias: acesso livre (sem login)" on materias;
drop policy if exists "conteudos: acesso livre (sem login)" on conteudos_estudo;
drop policy if exists "eventos: acesso livre (sem login)" on eventos;
drop policy if exists "preferencias: acesso livre (sem login)" on preferencias;
