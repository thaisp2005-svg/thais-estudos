# Projeto: Estudo+ — agenda pessoal e revisão espaçada

## Visão geral

Aplicativo web pessoal de organização e estudos, de uso individual, acessado remotamente (não local). Precisa funcionar bem tanto em computador quanto em celular. Dois módulos iniciais, que se relacionam entre si:

1. **Estudos com revisão espaçada**
2. **Agenda/calendário pessoal**

Prioridades: simplicidade, fácil manutenção, possibilidade de expansão futura. Não é multiusuário/comercial — é uso pessoal, mas com login (arquitetura já preparada para múltiplos usuários via RLS, mesmo que só um exista).

---

## Módulo 1 — Estudos (revisão espaçada)

- Cadastro de um **conteúdo estudado** com: título, matéria, cor, data inicial, observações, plano de revisão.
- **Planos de revisão**: o usuário escolhe um na hora de cadastrar. Dois planos fixos vêm prontos:
  - **Plano A** — 3 revisões: 24h, 7 dias, 30 dias
  - **Plano B** — 4 revisões: 24h, 7 dias, 30 dias, 90 dias
- O sistema deve permitir **criar planos personalizados** (quantidade de revisões e intervalos livres) numa tela de Configurações, para uso futuro.
- A partir do plano escolhido, o sistema **gera automaticamente as datas das próximas revisões**.
- O **plano de um conteúdo pode ser trocado a qualquer momento**: revisões já feitas ficam preservadas no histórico; revisões pendentes são recalculadas pelo novo plano.
- Deve ser possível **voltar em qualquer conteúdo já estudado** (mesmo com todas as revisões concluídas) e **agendar uma revisão avulsa** extra, a qualquer momento.
- Revisões **atrasadas** (data passada e ainda não confirmadas) precisam aparecer em **destaque visual claro**, como lembrete, tanto na agenda quanto num painel dedicado.

## Módulo 2 — Agenda/calendário

- Mostra, juntos: as revisões geradas pelo módulo de Estudos + tarefas/compromissos comuns criados direto na agenda.
- Cada item tem um **check de confirmação** ("feito"), que vale tanto para revisões quanto para tarefas/compromissos avulsos — é o mesmo mecanismo para os dois tipos.
- **Visão mês**: grade com o dia atual destacado, uma barrinha colorida por evento naquele dia, linhas de separação entre os dias bem finas e discretas, e dias com item atrasado marcados com contorno vermelho no número.
- **Visão dia**: lista simples dos itens daquele dia (sem grade de horário — só a lista, com check em cada item).
- **Painel/dashboard**: uma tela separada que reúne tudo que está atrasado (em destaque) + os itens de hoje, para funcionar como lembrete central.

## Relação entre os dois módulos

- Cada revisão gerada por um conteúdo de estudo **é**, ao mesmo tempo, um evento da agenda — não é uma cópia, é a mesma informação vista dos dois lugares.
- A **cor de um evento de revisão é herdada da matéria/conteúdo** que a gerou (escolhida uma vez no cadastro, reflete em todas as revisões daquele conteúdo).
- **Tarefas/compromissos criados direto na agenda** (sem ligação a um conteúdo de estudo) sempre aparecem em **cinza**, para diferenciar visualmente de revisões.

## Cores e legenda

- Paleta fixa oferecida ao cadastrar a cor de uma matéria: **verde musgo, verde claro, azul marinho, azul claro, laranja, amarelo, vermelho, rosa choque, roxo**.
- Botão "+" ao lado da paleta abre um **seletor de cor personalizada** (quadrado de saturação/brilho + régua de matiz + campo hex, no estilo do seletor "mais cores" do Excel/Office), permitindo qualquer cor além da paleta fixa.
- A **legenda de cores mostra o nome da matéria cadastrada** (não o nome da cor) ao lado da bolinha colorida, e **só lista matérias que o usuário realmente cadastrou** — nada de mostrar as 9 cores por padrão. Ao cadastrar uma matéria nova com uma cor (inclusive personalizada), a legenda **atualiza automaticamente**, sem precisar recarregar a página.

## Aparência

- Controle de tema com três opções: **Claro / Escuro / Automático** (automático segue a preferência do sistema operacional do usuário), disponível na tela de Configurações, aplicado ao app inteiro.

## Layout responsivo

- **Não são dois designs separados** — é um único layout que se adapta à largura da tela.
- **Computador é o padrão**: aparece como um site normal, com barra lateral de navegação (Painel, Estudos, Agenda, Configurações) + legenda de matérias + botão "Novo conteúdo".
- **Celular**: a barra lateral vira **navegação por abas na parte de baixo da tela** (mesmo conjunto de seções) + um **botão flutuante "+"** para criar conteúdo rapidamente — comportamento de app, não de site com barra lateral espremida.
- Implementado com responsividade real (media queries por largura de tela), não é um toggle manual nem truque de preview.

---

## Telas principais

1. **Login**
2. **Painel** — atrasadas em destaque + itens de hoje
3. **Estudos**
   - Lista de conteúdos cadastrados
   - Novo conteúdo: título, matéria (com autocompletar das matérias já usadas), data inicial, plano de revisão (A/B/personalizado), cor (paleta + seletor personalizado), observações
   - Detalhe do conteúdo: histórico de revisões, trocar plano, agendar revisão avulsa
4. **Agenda** — mês (grade) e dia (lista), navegáveis um a partir do outro
5. **Configurações** — aparência (claro/escuro/automático) + planos de revisão (padrões A/B e criação de personalizados)

---

## Estrutura de dados

**planos_revisao**
`id, user_id (nulo = padrão do sistema), nome, intervalos_dias (array de inteiros, em dias), created_at`

**materias**
`id, user_id, nome, cor (hex), created_at` — único por (user_id, nome)

**conteudos_estudo**
`id, user_id, titulo, materia_id (FK), observacoes, data_inicial, plano_revisao_id (FK), created_at`

**eventos** (revisão, tarefa ou compromisso — tudo que aparece na agenda)
`id, user_id, tipo ('revisao'|'tarefa'|'compromisso'), titulo, data, status ('pendente'|'feito'), conteudo_id (FK, só quando tipo=revisao), numero_revisao, concluido_em, created_at`

Regra chave: a cor de um evento **não fica salva no evento** — quando é revisão, vem de `conteudos_estudo → materias.cor`; quando é avulso, é sempre cinza fixo na exibição. Isso evita duplicar dado e garante que mudar a cor da matéria atualize tudo de uma vez.

Cada tabela de dados do usuário precisa de **RLS** (row level security) restringindo leitura/escrita a `auth.uid() = user_id`, exceto `planos_revisao`, onde linhas com `user_id` nulo (os planos padrão A/B) são visíveis a todos mas não editáveis.

---

## Arquitetura técnica escolhida

- **Next.js** (App Router, TypeScript) para front-end e as poucas rotas de backend necessárias (Server Actions para gravação).
- **Tailwind CSS** para estilo, com os tokens de cor definidos como CSS custom properties (claro/escuro) e expostos ao Tailwind via `@theme inline`.
- **Supabase** (Postgres gerenciado + Auth) como banco de dados e backend — evita precisar manter servidor próprio.
- **Netlify** para hospedar o front-end (decisão trocada de Vercel para Netlify durante o
  projeto, a pedido do usuário) — deploy via Netlify CLI, sem precisar de repositório Git.
- Sem servidor dedicado, sem infraestrutura própria — tudo em serviços gerenciados com planos gratuitos suficientes para uso pessoal.

---

## Estado atual do projeto

Sistema completo e funcionando, gravando no Supabase de verdade, **publicado em produção**:
https://thais-estudos.netlify.app

- Next.js 16 + Tailwind v4, tokens de design claro/escuro, layout responsivo (`AppShell`)
- Banco: migrations `0001` a `0004` em `supabase/migrations/` (ver README.md para a lista)
- Leitura em `src/lib/data.ts`, escrita em `src/lib/actions.ts` (Server Actions)
- Estudos: criar, editar, excluir, trocar plano (preservando revisões feitas), revisão avulsa,
  excluir revisão individual
- Matérias: tela própria (`/materias`) para cadastrar nome + cor, editar, excluir — a cor
  reflete automaticamente em todas as revisões daquela matéria
- Agenda: navegação entre meses, visão anual (12 meses), lista do dia, criar/editar/excluir
  tarefas e compromissos com horário e repetição (diária/semanal/quinzenal/mensal/anual/
  personalizada), check persistido, indicador "+N" no mês quando não cabem todos os tracinhos
- Configurações: tema (persistido no banco, igual em qualquer dispositivo) e planos de
  revisão personalizados (padrões A/B protegidos por trigger)
- Deploy: `netlify.toml` + Netlify CLI, publicado via `npx netlify deploy --prod`
- `src/proxy.ts` está desativado (renomeado para `.disabled`) por incompatibilidade entre
  o Turbopack do Next 16 e o empacotador de Edge Functions da Netlify — ver README.md

### Única pendência

**Login com senha.** Adicionar exige:

1. Reverter o `0002_dev_sem_login.sql` e o trecho equivalente do `0003`: restaurar as
   policies `auth.uid() = user_id` e voltar `user_id` para `not null default auth.uid()`.
2. Preencher `user_id` nas linhas já existentes antes de aplicar o `not null`.
3. Criar as telas de login e proteger as rotas (o `src/proxy.ts` já renova a sessão).

O site pode ser publicado antes disso (fica acessível a qualquer um com o link, sem
senha) — foi o pedido do usuário para poder testar pela internet enquanto o login não
existe.
