---
title: PRD — Variante Hero ICC · Swarm Visual (Agente → Produto Emergindo)
created: 2026-04-22
tags: [prd, landing, intensivo-claude-code, hero, variant, deprecated]
status: deprecated
deprecated-at: 2026-04-22
superseded-by: intensivo-claude-code-hero-mission-control.md
project: intensivo-claude-code-landing
parent-prd: intensivo-claude-code.md
---

> ⚠️ **DEPRECATED em 2026-04-22.** Substituído por `intensivo-claude-code-hero-mission-control.md`. Motivo: validação visual em chrome mostrou que o split "4 agentes + browser mock emergindo" apertava o layout na altura máxima de 420px da hero e subcomunicava o paralelismo (4 agentes é pouco para transmitir escala). A releitura Mission Control expande pra 10 squads em grid 5×2 e traz contador ao vivo. Stories 01 e 02 deste PRD ficaram com `status: superseded`, código correspondente será removido pela story da nova variante. Este documento permanece para histórico.

# PRD: Variante Hero ICC · Swarm Visual

> Extensão escopada do PRD mãe `intensivo-claude-code.md`. Substitui a animação terminal-only do swarm (implementada dia 22/04 durante iteração de edição) por um layout split que traduz a promessa da hero "crie em minutos toda a estrutura digital do seu negócio" em imagem ao vivo: **lado esquerdo** 4 agentes autônomos trabalhando em loop, **lado direito** um mock de browser que materializa componentes reais a cada task concluída. Stack, tokens, direção estética, contratos de SEO, modal e analytics são herdados sem alteração do PRD mãe. Este documento só especifica o que é novo.

---

## 1. Contexto

- **Escopo:** variante visual de **uma seção** (Hero, já centralizada). Nada fora dela muda.
- **Por que existe:** a iteração anterior adicionou um card terminal minimalista só com rows de agentes ciclando tarefas. Funciona para público técnico, mas este público é empresário não-dev. A imagem "terminal cyberpunk" transmite "código complicado" em vez de "ferramenta nascendo". O visual novo mostra causalidade direta **agente trabalhou → sua aplicação existe**.
- **Público-alvo:** igual ao PRD mãe. Empresário não-dev precisa olhar 5s e entender "alguém (algo) está construindo uma coisa usável". Sem jargão de CLI.
- **Proposta de valor na imagem:** Claude Code não é um terminal. É uma fábrica de ferramentas digitais. A hero inteira precisa reforçar isso antes do visitante rolar.
- **Métrica norte:** tempo médio na hero (scroll depth até `#social-proof`) ≥ 8s no desktop. Medição posterior via GA4 `scroll_depth` (cobertura no PRD mãe).
- **Janela:** vai no mesmo deploy das outras stories pendentes. Prazo final já travado no PRD mãe (24/04/2026).
- **Risco principal:** peso visual na hero, bullets podem ficar abafados. Mitigação: reduzir altura vertical do bloco swarm ao máximo e manter bullets acima, respirando.

---

## 2. Stack

Sem alteração em relação ao PRD mãe. Apenas confirma dependências já instaladas:

- **Framework:** Astro 4 (herda)
- **Motion:** **GSAP 3** como orquestrador único do swarm (timelines encadeadas, ScrollTrigger já está no projeto). **Sem** React island — tudo em script do próprio `Hero.astro`, sem custo de hidratação adicional.
- **Estilo:** tokens existentes em `src/styles/global.css` `@theme` (PRD mãe §3.3). **Nenhum token novo.** Se algo precisa de cor, reusa `page | surface | elevated | rule | ink.* | accent.*`.
- **Ícones:** `lucide-react` já disponível — mas o browser mock usa **SVG inline** dos ícones (sem hidratação React). Seguir padrão já aplicado em `UseCases.astro`.
- **Build:** `npx astro build` passando sem warnings, limite CLS ≤ 0.1 nesta variante.

---

## 3. Direção estética (delta Fase 0)

Herda integralmente Fase 0 do PRD mãe. Deltas específicos desta variante:

### 3.1 Composição do bloco

- **Layout split 2-col** dentro do container `max-w-5xl` centralizado, começando **abaixo dos bullets** da hero (mantém a centralização do texto intocada).
- **Desktop (md+):** `grid grid-cols-[minmax(0,18rem)_1fr] gap-6`. Agentes 18rem fixos à esquerda, browser ocupa o resto.
- **Mobile (< md):** `flex flex-col gap-6`. Agentes em cima, browser embaixo. Browser mantém proporção 4:3 mínima.
- **Altura máxima:** `max-h-[420px]` no desktop para nunca empurrar o resto da página.

### 3.2 Atmosfera e detalhe

- **Bordas:** cantos retos, `border border-rule`. Zero `rounded-xl` ou shadow-2xl. Respeita anti-padrões §3.7 do PRD mãe.
- **Fundo dos painéis:** `bg-elevated` (branco puro) em ambos. Régua 1px `rule` entre painéis e em qualquer subdivisão interna.
- **Highlight de estado ativo:** dot laranja `accent` pulsante (mesmo keyframe `agent-pulse` já adicionado a `global.css`). Quando um componente emerge no mock, linha 1px `accent` corre de cima a baixo do painel de agentes até o painel do browser durante 400ms (trail visual de causalidade).
- **Zero emoji.** Zero ícone "decorativo". Ícones do browser mock devem representar informação real (login, dashboard, checkout, integração).

### 3.3 Motion signature (delta)

- **Mask-reveal horizontal** da hero principal já existe.
- **Variante desta seção:** cortes secos via `clip-path: inset()`, durações curtas (240–400ms), easings `power2.out`. Nada de `elastic` ou `bounce`. Nada de spring-y.
- **Loop principal:** duração total de ciclo ≈ **14–18s**. Após completar, todos os elementos do browser mock se apagam em `power2.in` e o ciclo reinicia. Pause on hover **no painel inteiro** (ambos os lados param junto para preservar sync).
- **Reduced motion:** `prefers-reduced-motion: reduce` → render estático de um frame final (mock preenchido com todos os 4 componentes, agentes em estado `✓ done`). Nenhum loop corre.

---

## 4. Seções afetadas

### 4.1 Hero — só o bloco abaixo dos bullets

**Remove:** componente `.hero-agents` atual (terminal-card simples com 4 rows). Todo o CSS `.agent-dot`, `.agent-row`, `@keyframes agent-pulse` permanece **compatível** e é reusado pelo painel esquerdo desta variante.

**Adiciona:** componente novo em `src/components/hero/HeroSwarmVisual.astro` importado dentro de `Hero.astro` no mesmo lugar em que o bloco atual está (após `<ul class="hero-bullets">`).

Nenhuma outra seção muda.

---

## 5. Contratos obrigatórios

### 5.1 Config centralizada

Agentes, tasks e componentes emergentes saem de `src/config.ts` (mesmo arquivo já existente). Adicionar a chave `HERO_SWARM`:

```ts
HERO_SWARM: {
  AGENTS: [
    {
      id: 'pesquisa',
      name: '@pesquisa',
      tasks: ['mapeando concorrentes', 'coletando benchmarks', 'analisando público-alvo'],
      delivers: 'landing-hero',
    },
    {
      id: 'arquiteto',
      name: '@arquiteto',
      tasks: ['desenhando schema', 'definindo rotas da API', 'estruturando módulos'],
      delivers: 'sidebar-nav',
    },
    {
      id: 'implementador',
      name: '@implementador',
      tasks: ['escrevendo módulo de auth', 'gerando dashboard', 'criando checkout', 'integrando pagamento'],
      delivers: 'dashboard-chart',
    },
    {
      id: 'auditor',
      name: '@auditor',
      tasks: ['testando responsivo', 'checando Core Web Vitals', 'validando formulários'],
      delivers: 'integration-panel',
    },
  ],
  BROWSER_URL: 'https://meu-app.vercel.app',
}
```

O campo `delivers` mapeia 1:1 para um componente emergente no painel do browser. Ver §5.3.

### 5.2 Painel esquerdo — AgentList

Estrutura por linha (reusa classes `.agent-row`, `.agent-dot`, `.task`, `.status` já existentes em `global.css`):

```
┌──────────────────────────────────────────┐
│ ● ● ●        claude-code / swarm         │
├──────────────────────────────────────────┤
│ [dot] @pesquisa       mapeando concorr…  │
│ [dot] @arquiteto      desenhando schema  │
│ [dot] @implementador  escrevendo auth    │
│ [dot] @auditor        testando mobile    │
└──────────────────────────────────────────┘
```

Diferenças em relação ao terminal atual:
- Remove a **coluna de status** (`X.Xs ✓`). Essa leitura numérica distraía e não agregava ao público não-dev. A confirmação de conclusão vira o **evento de reveal no browser** (§5.3).
- Dot muda de `bg-ink-muted` (idle) → `bg-accent` pulsante (working) → `bg-ink-primary` estável (done). Zero texto auxiliar.
- Task swapa com `opacity` 180ms, sem caracteres spinner Braille. A animação do dot é suficiente como sinal de atividade.

### 5.3 Painel direito — BrowserMock

**Chrome do browser** (não funcional, só visual):
- 3 dots laranja/cinza no canto superior esquerdo
- URL bar mono com texto `meu-app.vercel.app`, `text-ink-muted`, `text-xs`
- Régua 1px `rule` separando chrome do content

**Content area**: `aspect-video` em desktop, `aspect-square` em mobile. Fundo `bg-page`. Começa **vazio** (apenas linhas-guia esmaecidas 4% opacidade para quebrar o branco puro).

Componentes emergentes (4, cada um atrelado a um agente via `delivers`):

| `delivers` | Componente visual | Descrição |
|---|---|---|
| `landing-hero` | Mini landing hero (título grande Fraunces + sub + botão accent) | Aparece no topo do content area |
| `sidebar-nav` | Barra lateral esquerda com 4 itens Lucide (Home, Users, BarChart, Settings) | Apaga se já renderizado, mas desta vez alinhada à esquerda do content area |
| `dashboard-chart` | Card de dashboard com número grande + mini-gráfico de linha em SVG | Center-right do content area |
| `integration-panel` | 3 chips de integração (Stripe, WhatsApp, Google Calendar) em linha inferior | Rodapé do content area |

Cada componente **aparece** com:
- `clipPath: 'inset(0 100% 0 0)'` → revelando da esquerda pra direita em 400ms, `expo.out`
- `opacity: 0 → 1` em sobreposição
- Pequeno dash de 2px da régua `rule` emitido do painel esquerdo do agente que entregou até o componente revelado (ver §5.5)

**Zero interação.** O mock é decorativo. `pointer-events: none`, `aria-hidden="true"`.

### 5.4 Orquestração de timeline

Script único dentro de `HeroSwarmVisual.astro`. Master timeline GSAP com as seguintes fases:

| Fase | t (s) | Ação |
|---|---|---|
| 0 | 0.0 | `@pesquisa` entra em `working`. Task 1 (aleatória) renderizada. |
| 1 | 2.4 | `@pesquisa` → `done`. Componente `landing-hero` reveals no browser. Trail line desenha. |
| 2 | 3.0 | `@arquiteto` entra em `working`. |
| 3 | 5.4 | `@arquiteto` → `done`. Componente `sidebar-nav` reveals. |
| 4 | 6.0 | `@implementador` entra em `working`. |
| 5 | 9.0 | `@implementador` → `done`. `dashboard-chart` reveals. |
| 6 | 9.6 | `@auditor` entra em `working`. |
| 7 | 12.0 | `@auditor` → `done`. `integration-panel` reveals. |
| 8 | 14.0 | Hold final com mock completo, dots todos em `ink.primary`. |
| 9 | 15.5 | Fade-out simultâneo de todos os componentes do browser (300ms, `power2.in`). |
| 10 | 16.0 | Reset de estado. Timeline reinicia em 0.0. |

Implementação com GSAP `timeline().add()` e `repeat: -1`. Durações por agente com variância ±300ms para não parecer mecânico (mas mantendo a ordem das fases).

**Pause on hover:** `mouseenter` em `.hero-swarm-visual` dispara `tl.pause()`, `mouseleave` dispara `tl.resume()`.

**ScrollTrigger:** timeline só começa quando o bloco entra na viewport (`start: 'top 85%'`). Fora da viewport, pausa para economizar CPU.

### 5.5 Trail line entre agente e componente (opcional na v1)

Linha 1px `accent`, 400ms, desenhada da linha do agente responsável até o componente que emerge no painel direito. Implementação via SVG absoluto sobreposto aos dois painéis com `stroke-dasharray` animado (`0 100% → 100% 0`). 

**Se complexidade empurrar prazo, cortar e deixar para uma iteração posterior.** A causalidade já fica implícita pela ordem temporal.

### 5.6 Acessibilidade

- Painel inteiro: `aria-hidden="true"`. É decorativo. Não entra no reading order.
- Nenhum elemento focável (sem `<button>`, sem `tabIndex`).
- Copy significativa da hero (H1, sub, CTA) já cobre o que acessibilidade precisa.
- `prefers-reduced-motion`: estado final estático, sem loop. Browser mock mostra os 4 componentes preenchidos e os 4 agentes em `done`.

### 5.7 Tokens e classes

- **Nenhum `bg-[#hex]` ou `text-[#hex]` inline.** Tudo via tokens existentes.
- **Classes novas permitidas:** `.hero-swarm-visual`, `.swarm-agents`, `.swarm-browser`, `.swarm-component`, `.swarm-trail`. Todas escopadas no componente, zero leak.
- **Nenhum token novo em `@theme`.** Se algo demandar cor não coberta, retornar ao PRD mãe e reabrir Fase 0.

---

## 6. Dependências

Nenhuma nova dependência. Tudo coberto por `gsap`, `astro`, `tailwindcss` já no `package.json`.

---

## 7. Verificação end-to-end

- [ ] `npx astro build` passa sem warnings
- [ ] Layout split renderiza lado-a-lado em ≥ `md` (768px) e empilha em `< md`
- [ ] Altura total do bloco ≤ 420px em desktop
- [ ] Timeline completa um ciclo em 14–18s
- [ ] Todos os 4 componentes aparecem no browser mock antes do fade-out
- [ ] Reduced motion: nenhum loop corre, estado final estático visível
- [ ] Pause on hover funciona
- [ ] ScrollTrigger: timeline só roda com a seção na viewport
- [ ] Lighthouse mobile: Performance ≥ 90 (CLS ≤ 0.1, LCP ≤ 2.5s)
- [ ] Sem layout shift na entrada da timeline principal da hero (mask-reveal do H1 continua limpo)

---

## 8. Impacto em PRD mãe, plan e stories existentes

- **PRD mãe:** §4.2 (Hero) recebe nota de referência a este documento, sem reescrita.
- **Plan `docs/plans/intensivo-claude-code.md`:** adicionar uma nova story **12.5** (entre audit mobile e pre-deploy) ou nova story isolada **13** sob title `hero-swarm-visual`. Decisão pertence a `landing-page-create-plan` (próximo passo).
- **Stories existentes:** nenhuma é reescrita. A story `06-topbar-sticky-hero-mask-reveal-gsap` permanece como base; esta é um **add-on** sobre o Hero já entregue.
- **Story de audit mobile (12):** precisa rodar **depois** desta variante ir ao ar, para cobrir o novo bloco. Incluir viewport 320/390/768/1024 validando que o split empilha corretamente.

---

## 9. Fora do escopo deste PRD

- Redesenho do hero textual (centralização já foi aplicada fora do pipeline, será documentada em uma variante irmã se virar ponto de contenção)
- Cópia do hero (`copywriting` + `hooks-and-angles`)
- Mobile audit fino (invocar `landing-page-audit` após build)
- Performance audit (`clean-code` após implementação)
- A/B test do visual novo vs. terminal atual (escopo de Tráfego + GA)
- Variantes com dados reais do cliente (mock é genérico, pré-produção)

---

## 10. Próximo passo

Acionar `landing-page-create-plan` com este documento como input. O plano deve produzir stories mínimas (provavelmente 1 a 2 stories de complexidade M) com:

1. Adicionar `HERO_SWARM` em `src/config.ts` e remover bloco inline atual em `Hero.astro`
2. Criar `src/components/hero/HeroSwarmVisual.astro` com chrome, layout split, painel de agentes, painel de browser e master timeline GSAP
3. Montar os 4 componentes emergentes (`landing-hero`, `sidebar-nav`, `dashboard-chart`, `integration-panel`) como subcomponentes ou slots renderizados condicionalmente
4. Ajustar `Hero.astro` para importar e renderizar `HeroSwarmVisual` no lugar do bloco atual

Depois de `landing-page-create-plan` gerar o plano, `/expand-stories` explode em arquivos, e `implementer-sonnet` (ou `opus` se o plano classificar como G) executa.
