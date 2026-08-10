# Estudo+ — agenda pessoal e revisão espaçada

App web responsivo para organização de estudos (revisão espaçada) e agenda pessoal.
Next.js 16 (App Router) + Tailwind CSS v4 + Supabase.

## Estado atual

Sistema funcionando de ponta a ponta, gravando no Supabase de verdade.
**Ainda sem login** — qualquer pessoa com o endereço acessa. A senha é a última etapa,
antes de publicar.

### Telas

| Rota | O que faz |
|---|---|
| `/` | Painel — revisões atrasadas em destaque + itens de hoje |
| `/agenda` | Calendário do mês, com navegação entre meses |
| `/agenda/dia/[data]` | Lista do dia (revisões + tarefas/compromissos), com check |
| `/agenda/novo` | Criar tarefa/compromisso avulso |
| `/agenda/evento/[id]` | Editar/excluir tarefa ou compromisso |
| `/estudos` | Lista de conteúdos de estudo |
| `/estudos/novo` | Cadastrar conteúdo (gera as revisões automaticamente) |
| `/estudos/[id]` | Detalhe: histórico de revisões + agendar revisão avulsa |
| `/estudos/[id]/editar` | Editar/excluir conteúdo e trocar o plano de revisão |
| `/materias` | Lista de matérias (nome + cor) |
| `/materias/novo` e `/materias/[id]` | Criar/editar/excluir matéria |
| `/configuracoes` | Aparência (claro/escuro/automático, salva no banco) + planos de revisão |
| `/configuracoes/planos/novo` e `/planos/[id]` | Criar/editar/excluir planos personalizados |

Layout único responsivo: barra lateral no computador, navegação por abas + botão
flutuante no celular.

### Regras principais

- **Revisões** são geradas a partir do plano escolhido (Plano A: 24h/7/30 dias; Plano B: +90 dias).
- **Trocar o plano ou a data inicial** preserva as revisões já feitas e recalcula só as pendentes.
- **Revisões avulsas** (extras, em qualquer data) nunca são afetadas por troca de plano — e cada
  revisão (avulsa ou do plano) pode ser excluída individualmente no detalhe do conteúdo.
- **Cor vem da matéria**, cadastrada em `/materias`; tarefas/compromissos avulsos são sempre cinza.
  Trocar a cor de uma matéria atualiza todas as revisões dela automaticamente (é a mesma cor,
  buscada em tempo real — não uma cópia).
- **Atrasado** = data no passado e ainda pendente.
- **Tarefas/compromissos** podem ter horário (início/fim) e repetição (diária, semanal, quinzenal,
  mensal, anual ou personalizada). Cada repetição gera ocorrências independentes (até 1 ano à
  frente), então editar ou excluir uma não mexe nas outras.
- No mês da agenda, cada evento tem seu próprio tracinho; quando não cabem todos, aparece um "+N"
  com quantos ficaram de fora.
- **Aparência** (claro/escuro/automático) é salva no banco — abrir em outro navegador ou
  dispositivo carrega a mesma escolha.

## Rodar localmente

```bash
npm run dev
```

Ou use o atalho **"Estudo+"** criado na área de trabalho (sobe o servidor e abre o navegador).

## Banco de dados (Supabase)

Rode os arquivos abaixo no **SQL Editor** do projeto, nesta ordem:

1. [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) — tabelas e planos padrão
2. [`supabase/migrations/0002_dev_sem_login.sql`](supabase/migrations/0002_dev_sem_login.sql) — libera o uso sem login (temporário)
3. [`supabase/migrations/0003_planos_personalizados.sql`](supabase/migrations/0003_planos_personalizados.sql) — planos personalizados
4. [`supabase/migrations/0004_horario_e_tema.sql`](supabase/migrations/0004_horario_e_tema.sql) — horário em tarefas/compromissos + preferência de tema
5. [`supabase/seed_demo.sql`](supabase/seed_demo.sql) — dados fictícios para testar (opcional)

Para apagar todos os dados e recomeçar: [`supabase/limpar_seed.sql`](supabase/limpar_seed.sql).

As credenciais ficam em `.env.local` (veja `.env.local.example`).

## Publicado no Netlify

**URL:** https://estudo-mais-thais.netlify.app
**Painel do projeto:** https://app.netlify.com/projects/estudo-mais-thais

Deploy feito via Netlify CLI (login, criação do site, variáveis de ambiente e
`netlify deploy --prod` — tudo já configurado e vinculado a esta pasta em `.netlify/`).

Para publicar uma atualização depois de mudar o código:

```bash
npx netlify deploy --prod
```

> **Sem senha nossa ainda:** qualquer um com o link acessa e vê os mesmos dados. Quando
> adicionarmos login (próxima etapa), isso muda.

### `proxy.ts` desativado temporariamente

O arquivo `src/proxy.ts` (renovação de sessão do Supabase) foi renomeado para
`src/proxy.ts.disabled` porque o empacotador de Edge Functions da Netlify (runtime
`@netlify/plugin-nextjs` v5.15.13) não consegue empacotar o build gerado pelo Turbopack
do Next.js 16 para esse arquivo (erro `Cannot find module './chunks/[turbopack]_runtime.js'`
ao empacotar). Como ainda não existe login, esse arquivo não faz falta agora. Ao
implementar a senha, será preciso reativá-lo e resolver essa incompatibilidade
(possivelmente rodando o build com Webpack em vez de Turbopack, ou aguardando correção
da Netlify/Next.js).

## Falta fazer

- **Login com senha** — envolve reverter o `0002_dev_sem_login.sql`, restaurando as
  policies que limitam cada linha ao seu dono (`auth.uid() = user_id`), e reativar
  `src/proxy.ts` (resolvendo a incompatibilidade com o Turbopack).
- **Repetição "mensal"/"anual" em datas no fim do mês** (ex: dia 31) pode pular ou
  deslocar em meses mais curtos — é uma limitação conhecida da implementação atual,
  que usa `setMonth`/`setFullYear` do JavaScript.
