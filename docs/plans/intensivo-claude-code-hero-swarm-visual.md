---
title: Plan — Variante Hero ICC · Swarm Visual
slug: intensivo-claude-code-hero-swarm-visual
prd: docs/prds/intensivo-claude-code-hero-swarm-visual.md
parent-plan: docs/plans/intensivo-claude-code.md
created: 2026-04-22
status: superseded
superseded-by: docs/plans/intensivo-claude-code-hero-mission-control.md (a ser criado)
superseded-at: 2026-04-22
---

> ⚠️ **SUPERSEDED em 2026-04-22.** O PRD deste plano (`intensivo-claude-code-hero-swarm-visual.md`) foi deprecado após validação visual. Novo PRD: `intensivo-claude-code-hero-mission-control.md`. O código já entregue pelas stories 01 e 02 deste plano será removido pela story de refactor da nova variante.

# Plano de Implementação — Variante Hero Swarm Visual

## Resumo

Plano escopado para substituir o bloco terminal-only do swarm atual (`.hero-agents` inline em `site/src/components/sections/Hero.astro`) por um split "agentes trabalhando → produto emergindo no browser". Como stack, tokens, analytics, modal, JSON-LD, SEO e deploy já estão resolvidos pelo plano mãe (`docs/plans/intensivo-claude-code.md`, 12 stories executadas em 5 ondas), este plano não repete os passos 1–4 e 6–10 da ordem canônica. Produz **2 stories de complexidade M** (estrutura + orquestração de timeline), totalizando ~90 min. Stack e dependências sem alteração.

## Ordem canônica de landing (desvios justificados)

A ordem canônica presume criação de landing do zero. Como a base já está em produção interna (`npm run dev` servindo `http://localhost:4321/` sem build warnings), este plano **pula** as etapas já concluídas:

1. ~~Scaffold Astro~~ — **concluído** pelo plan mãe, story 01
2. ~~Tokens Tailwind~~ — **concluído** story 02 (migração v3→v4 em `@theme` registrada no log 22/04 14:20)
3. ~~Layout Base~~ — **concluído** story 04 (`Base.astro` com 13 itens SEO + analytics condicional + JSON-LD)
4. ~~Config centralizado~~ — **concluído** story 03, **modificado aqui** (Story 01 adiciona chave `HERO_SWARM`)
5. **Componentes de seção** — Hero já entregue (story 06), variante reescrita aqui nas Stories 01–02 deste plano
6. ~~Modal de captura~~ — **concluído** story 11
7. ~~Assets públicos~~ — **concluído** story 05
8. ~~JSON-LD~~ — **concluído** story 04
9. **Audit viewports** — Story 12 do plan mãe precisa re-rodar após esta variante (nota: não entra como story deste plano, entra como gate de merge)
10. ~~Verificação pré-deploy~~ — coberto pelo gate da Story 12 mãe, re-executada após estas 2 stories

Desvio único: este plano **só altera Hero**. Nenhuma outra seção muda.

## Dependências npm

**Nenhuma adição.** Tudo coberto pelo `package.json` atual:
- `gsap@^3` (orquestrador único da timeline)
- `astro@^4`, `@astrojs/react@^3`, `react@^18` (islands já disponíveis, não usados nesta variante)
- `tailwindcss@^4`, `@tailwindcss/vite@^4` (tokens via `@theme`)
- `lucide-react@^0.263` (não usado — ícones como SVG inline seguindo padrão de `UseCases.astro`)

Adicionar dependência nova aqui é bug de PR.

## Stories embutidas

### Story 01 — Estrutura do Hero Swarm Visual (config + componente shell)

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** nada (hero base já existe)
- **Arquivos a criar:** `site/src/components/hero/HeroSwarmVisual.astro`
- **Arquivos a modificar:**
  - `site/src/config.ts` — adicionar export `HERO_SWARM`
  - `site/src/components/sections/Hero.astro` — remover bloco inline `.hero-agents` + frontmatter `AGENTS` + trecho da timeline que dispara `startAgentSwarm`; importar e renderizar `<HeroSwarmVisual />` no mesmo local
  - `site/src/styles/global.css` — renomear classes compartilhadas (`agent-dot`, `agent-row`) com prefixo `swarm-` para escopar (evitar colisão caso alguém reuse as classes no futuro em outra seção)
- **Patterns a seguir:**
  - `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` (tokens `page | surface | elevated | rule | ink.* | accent.*`, proibido `bg-[#hex]`)
  - Direção estética Fase 0 do PRD mãe §3 (cantos retos, zero shadow, zero gradient)

**Contexto:** estabelece o esqueleto visual sem animação. Um implementador rodando só esta story vê o estado estático final (painel de agentes à esquerda, browser mock à direita com 4 componentes preenchidos). A orquestração viva vem na Story 02. Separar em duas etapas permite revisar o layout, responsividade e acessibilidade **sem** o ruído de uma timeline GSAP de 14s sendo debuggada.

**Código de referência (trechos-chave):**

Adição em `site/src/config.ts`:

```ts
HERO_SWARM: {
  BROWSER_URL: 'https://meu-app.vercel.app',
  AGENTS: [
    {
      id: 'pesquisa',
      name: '@pesquisa',
      tasks: [
        'mapeando concorrentes',
        'coletando benchmarks',
        'analisando público-alvo',
      ],
      delivers: 'landing-hero' as const,
    },
    {
      id: 'arquiteto',
      name: '@arquiteto',
      tasks: [
        'desenhando schema',
        'definindo rotas da API',
        'estruturando módulos',
      ],
      delivers: 'sidebar-nav' as const,
    },
    {
      id: 'implementador',
      name: '@implementador',
      tasks: [
        'escrevendo módulo de auth',
        'gerando dashboard',
        'criando checkout',
        'integrando pagamento',
      ],
      delivers: 'dashboard-chart' as const,
    },
    {
      id: 'auditor',
      name: '@auditor',
      tasks: [
        'testando responsivo',
        'checando Core Web Vitals',
        'validando formulários',
      ],
      delivers: 'integration-panel' as const,
    },
  ],
},
```

Esqueleto de `site/src/components/hero/HeroSwarmVisual.astro` (sem script GSAP; estático):

```astro
---
import { CONFIG } from '../../config';
const { AGENTS, BROWSER_URL } = CONFIG.HERO_SWARM;
---

<div
  class="hero-swarm-visual mt-16 mx-auto max-w-5xl grid gap-6 md:grid-cols-[minmax(0,18rem)_1fr] md:max-h-[420px] text-left"
  aria-hidden="true"
>
  <!-- painel esquerdo: agentes -->
  <aside class="swarm-agents bg-elevated border border-rule self-start">
    <div class="flex items-center justify-between px-4 py-2.5 border-b border-rule">
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-accent/80"></span>
        <span class="w-2 h-2 rounded-full bg-ink-muted/50"></span>
        <span class="w-2 h-2 rounded-full bg-ink-muted/50"></span>
      </div>
      <p class="font-mono text-[10px] tracking-widest text-ink-muted uppercase">claude-code / swarm</p>
    </div>
    <ul class="divide-y divide-rule/60 font-mono text-xs sm:text-sm">
      {AGENTS.map((a) => (
        <li
          class="swarm-row grid grid-cols-[auto_auto_1fr] items-center gap-3 px-4 py-3"
          data-agent-id={a.id}
          data-agent-tasks={JSON.stringify(a.tasks)}
          data-delivers={a.delivers}
        >
          <span class="swarm-dot"></span>
          <span class="text-accent">{a.name}</span>
          <span class="task text-ink-secondary truncate">{a.tasks[0]}</span>
        </li>
      ))}
    </ul>
  </aside>

  <!-- painel direito: browser mock -->
  <section class="swarm-browser bg-elevated border border-rule flex flex-col">
    <div class="flex items-center gap-3 px-4 py-2.5 border-b border-rule">
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-accent/60"></span>
        <span class="w-2 h-2 rounded-full bg-ink-muted/40"></span>
        <span class="w-2 h-2 rounded-full bg-ink-muted/40"></span>
      </div>
      <p class="font-mono text-[10px] text-ink-muted truncate">{BROWSER_URL}</p>
    </div>
    <div class="swarm-stage relative flex-1 min-h-[260px] bg-page p-4 overflow-hidden">
      <!-- slots dos 4 componentes emergentes; Story 02 injeta animação -->
      <div class="swarm-component" data-slot="landing-hero">
        <!-- mini hero: eyebrow mono + h3 Fraunces + sub + botão accent -->
      </div>
      <div class="swarm-component" data-slot="sidebar-nav">
        <!-- 4 rows: Home / Users / BarChart / Settings com ícones Lucide inline SVG -->
      </div>
      <div class="swarm-component" data-slot="dashboard-chart">
        <!-- card com número grande + mini-gráfico SVG polyline -->
      </div>
      <div class="swarm-component" data-slot="integration-panel">
        <!-- 3 chips: Stripe / WhatsApp / Google Calendar -->
      </div>
    </div>
  </section>
</div>
```

Ajuste em `global.css` (renomear classes + manter keyframe `agent-pulse` como `swarm-pulse`):

```css
.swarm-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--color-ink-muted);
  transition: background 220ms ease;
}
.swarm-dot.working {
  background: var(--color-accent);
  animation: swarm-pulse 1.4s ease-in-out infinite;
}
.swarm-dot.done { background: var(--color-ink-primary); }

.swarm-row .task { transition: opacity 180ms ease; }
.swarm-row.swapping .task { opacity: 0; }

@keyframes swarm-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(228, 87, 46, 0.55); }
  50%      { box-shadow: 0 0 0 6px rgba(228, 87, 46, 0); }
}

.swarm-component {
  /* Story 02 controla opacity/clip-path via GSAP */
  position: absolute;
  /* posicionamento específico por slot definido em 02 */
}
```

**Critérios de aceite:**
1. QUANDO abrir `/` no dev server, ENTÃO abaixo dos bullets aparece o bloco split com painel de agentes à esquerda e browser mock à direita em telas ≥ 768px
2. QUANDO redimensionar para < 768px, ENTÃO os dois painéis empilham verticalmente (agentes em cima, browser embaixo)
3. QUANDO inspecionar o bloco, ENTÃO `aria-hidden="true"` está no container raiz e nenhum elemento é focável via Tab
4. QUANDO inspecionar CSS, ENTÃO zero `bg-[#hex]` ou `text-[#hex]` nas classes novas; tudo via tokens `@theme`
5. QUANDO rodar `npx astro build`, ENTÃO build completa sem warnings e sem erros de tipo
6. QUANDO `@keyframes agent-pulse` antigo for removido, ENTÃO nenhum outro arquivo no projeto referencia `.agent-dot`, `.agent-row`, `agent-pulse` (grep limpo)
7. QUANDO a altura total do bloco exceder 420px em desktop, ENTÃO a story falha (usar `max-h-[420px]` no container, `overflow-hidden` se precisar)

**Comando de validação:**

```bash
cd site && npx astro check && npx astro build && grep -rn "agent-dot\|agent-row\|agent-pulse" src/ || echo "✓ classes antigas removidas"
```

---

### Story 02 — Orquestração da timeline + componentes emergentes

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** Story 01
- **Arquivos a modificar:**
  - `site/src/components/hero/HeroSwarmVisual.astro` — adicionar script GSAP (master timeline), marcação real dos 4 `.swarm-component` slots (SVGs inline dos ícones + números/labels dos componentes emergentes)
- **Arquivos a criar:** nenhum
- **Patterns a seguir:**
  - `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` (seção GSAP: `ScrollTrigger.config({ ignoreMobileResize: true })`, `ScrollTrigger.refresh()` após fonts)
  - Motion signature do PRD mãe §3.5: cortes secos, `expo.out`/`power2.out`, zero elastic

**Contexto:** injeta a vida no shell. Um master timeline GSAP com 10 fases (detalhadas em PRD variante §5.4) orquestra dots dos agentes (`idle → working → done`), swap de tasks, reveal sequencial dos 4 componentes emergentes (com `clipPath: 'inset(0 100% 0 0)'` + `expo.out` 400ms) e reset ao final. Pause on hover no container inteiro e ScrollTrigger 85% impedem que a animação rode fora da viewport. `prefers-reduced-motion` força render estático do frame final.

**Código de referência (trechos-chave):**

Conteúdo de cada `.swarm-component` (SVGs inline, sem React, seguindo padrão de `UseCases.astro`):

```astro
<!-- dentro de .swarm-stage, após o shell da Story 01 -->

<div class="swarm-component absolute inset-x-4 top-4" data-slot="landing-hero">
  <p class="font-mono text-[9px] tracking-widest text-accent uppercase">seu produto</p>
  <h4 class="font-display text-xl leading-tight text-ink-primary">Título do app em serifada</h4>
  <p class="font-sans text-[11px] text-ink-secondary mt-1">Subheadline curta.</p>
  <button class="mt-2 bg-accent text-page font-mono text-[10px] uppercase tracking-widest px-3 py-1.5" type="button" tabindex="-1">entrar</button>
</div>

<div class="swarm-component absolute left-4 top-4 bottom-4 w-32 border-r border-rule pr-3" data-slot="sidebar-nav">
  <!-- 4 items Home/Users/BarChart/Settings em mono com SVGs Lucide inline (stroke 1.5, 14px) -->
</div>

<div class="swarm-component absolute right-4 top-16 w-48 bg-surface border border-rule p-3" data-slot="dashboard-chart">
  <p class="font-mono text-[9px] text-ink-muted uppercase tracking-widest">MRR</p>
  <p class="font-display text-2xl text-ink-primary">R$ 12.400</p>
  <!-- polyline SVG 120x36 simulando linha ascendente -->
</div>

<div class="swarm-component absolute inset-x-4 bottom-4 flex gap-2" data-slot="integration-panel">
  <!-- 3 chips: Stripe / WhatsApp / Google Calendar, font-mono text-[10px] px-2 py-1 bg-surface border border-rule -->
</div>
```

Script da master timeline (a adicionar no final do `.astro`):

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const visual = document.querySelector<HTMLElement>('.hero-swarm-visual');
  if (!visual) throw new Error('[HeroSwarmVisual] root not found');

  const rows = Array.from(visual.querySelectorAll<HTMLElement>('.swarm-row'));
  const components = Array.from(visual.querySelectorAll<HTMLElement>('.swarm-component'));
  const byDelivers = (key: string) =>
    components.find((c) => c.dataset.slot === key)!;

  function setAgentState(row: HTMLElement, state: 'idle' | 'working' | 'done') {
    const dot = row.querySelector<HTMLElement>('.swarm-dot')!;
    dot.classList.remove('working', 'done');
    if (state !== 'idle') dot.classList.add(state);
  }

  function swapTask(row: HTMLElement, taskIndex: number) {
    const taskEl = row.querySelector<HTMLElement>('.task')!;
    const tasks = JSON.parse(row.dataset.agentTasks || '[]') as string[];
    row.classList.add('swapping');
    setTimeout(() => {
      taskEl.textContent = tasks[taskIndex % tasks.length];
      row.classList.remove('swapping');
    }, 180);
  }

  function buildTimeline() {
    if (prefersReducedMotion) {
      // estado final estático
      rows.forEach((r) => setAgentState(r, 'done'));
      gsap.set(components, { opacity: 1, clipPath: 'inset(0 0 0 0)' });
      return null;
    }

    // estado inicial do loop
    gsap.set(components, { opacity: 0, clipPath: 'inset(0 100% 0 0)' });

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.2,
      scrollTrigger: {
        trigger: visual,
        start: 'top 85%',
        toggleActions: 'play pause resume pause',
      },
    });

    // sequência: cada agente trabalha ≈2.4s, entrega, passa o bastão
    const phases = [
      { row: 0, delivers: 'landing-hero' },
      { row: 1, delivers: 'sidebar-nav' },
      { row: 2, delivers: 'dashboard-chart' },
      { row: 3, delivers: 'integration-panel' },
    ];

    let cursor = 0;
    phases.forEach((p, i) => {
      const row = rows[p.row];
      const comp = byDelivers(p.delivers);
      tl.call(() => setAgentState(row, 'working'), [], cursor);
      tl.call(() => swapTask(row, i), [], cursor + 0.2);
      tl.call(() => setAgentState(row, 'done'), [], cursor + 2.4);
      tl.to(
        comp,
        {
          clipPath: 'inset(0 0 0 0)',
          opacity: 1,
          duration: 0.4,
          ease: 'expo.out',
        },
        cursor + 2.4
      );
      cursor += 3.0;
    });

    // hold final + fade-out + reset
    tl.to(components, { opacity: 0, duration: 0.3, ease: 'power2.in' }, cursor + 1.5);
    tl.call(
      () => rows.forEach((r) => setAgentState(r, 'idle')),
      [],
      cursor + 1.8
    );

    return tl;
  }

  document.fonts.ready.then(() => {
    const tl = buildTimeline();
    ScrollTrigger.refresh();

    if (tl) {
      visual.addEventListener('mouseenter', () => tl.pause());
      visual.addEventListener('mouseleave', () => tl.resume());
    }
  });
</script>
```

**Critérios de aceite:**
1. QUANDO carregar a página e rolar até a hero, ENTÃO a timeline começa a rodar (primeiro agente vira `working`) em ≤ 1s
2. QUANDO a timeline chegar à fase do `@pesquisa` concluir, ENTÃO o componente `landing-hero` aparece no browser mock via clip-path da esquerda pra direita
3. QUANDO todos os 4 agentes terminarem, ENTÃO os 4 componentes estão visíveis simultaneamente por ≥ 1.2s antes do fade-out
4. QUANDO o loop reiniciar, ENTÃO agentes voltam para `idle` e browser mock fica vazio
5. QUANDO passar o mouse sobre o bloco, ENTÃO a timeline pausa (dots congelam no estado atual); QUANDO tirar o mouse, ENTÃO retoma
6. QUANDO a seção estiver fora da viewport, ENTÃO a timeline está pausada (verificar com `ScrollTrigger` em `position: sticky` ou rolando rápido para baixo)
7. QUANDO o usuário tem `prefers-reduced-motion: reduce`, ENTÃO nenhuma animação roda; o browser mock mostra os 4 componentes preenchidos e os 4 dots em `done`
8. QUANDO rodar `npx astro build`, ENTÃO build passa sem warnings e sem erros TS no script inline

**Comando de validação:**

```bash
cd site && npx astro check && npx astro build && echo "validar manual: abrir http://localhost:4321/ e confirmar ciclo de ≈14–18s, pause on hover, redução de movimento (DevTools > Rendering > Emulate prefers-reduced-motion)"
```

---

## Checklist de a11y

- [x] Bloco inteiro `aria-hidden="true"` (decorativo, não entra no reading order) — **exigido nas 2 stories**
- [x] Zero elemento focável: `tabindex="-1"` no botão fake dentro do componente `landing-hero`; nenhum `<a>` clicável; `pointer-events: none` no `.swarm-stage` se necessário — **Story 02**
- [x] `prefers-reduced-motion`: early return na timeline com render estático — **Story 02**
- [x] Contraste WCAG AA preservado (todas as combinações usam tokens já validados no PRD mãe) — **herdado**
- [x] Texto mono ≥ 10px não é blocker porque é decorativo e não precisa ser lido por leitor de tela
- [ ] Focus visible — N/A, bloco não recebe foco
- [ ] Labels/htmlFor — N/A, sem inputs
- [x] Landmarks semânticos — `<aside>` para painel de agentes, `<section>` para browser mock (ambos dentro do `<section>` do hero, não criar novos `main`) — **Story 01**
- [ ] Skip-to-content — já existe no `Base.astro` (herdado)
- [x] Imagens decorativas com `alt=""` — N/A (SVGs inline com `aria-hidden`)

## Checklist de analytics (3 pilares)

Herdado integralmente do plan mãe e `Base.astro`. Esta variante **não adiciona eventos novos**:

- [x] GA4 condicional em `PUBLIC_GA_ID` — já no Base.astro
- [x] Meta Pixel condicional em `PUBLIC_META_PIXEL_ID` — já no Base.astro
- [x] UTM capture + sessionStorage + redirect append — já em `src/lib/utm.ts` e modal
- [x] Evento `Lead` com `event_id` compartilhado — já no modal React island
- [x] Evento `click_cta` nos CTAs — já nos botões com `data-cta-location`
- [x] Webhook fire-and-forget com `Promise.allSettled` — já no modal

**Nenhum item novo. Nenhum hook do swarm visual chama analytics.**

## Checklist de SEO (13 itens do CLAUDE.md global)

Herdado integralmente do `Base.astro` e plan mãe (story 04). Esta variante não altera nada que o crawler enxergue: bloco é `aria-hidden`, decorativo, todo conteúdo relevante (H1, sub, CTA, oferta) já está fora dele.

- [x] favicon · robots · llms · OG · meta title/desc · viewport/lang/charset · canonical · theme-color · manifest · apple-touch-icon · JSON-LD — **todos herdados**

Impacto zero no DOM relevante para SEO.

## Checklist de performance

- [ ] Lighthouse mobile mantém thresholds do plan mãe (Perf ≥ 90, a11y ≥ 95, best practices ≥ 95, SEO ≥ 95) — **re-rodar após Story 02**
- [ ] **CLS ≤ 0.1** — crítico: reserva de altura mínima (`min-h-[260px]` no `.swarm-stage`) e `max-h-[420px]` no container para evitar shift quando componentes emergem — **Story 01**
- [x] LCP: hero continua com LCP no H1 (texto); swarm visual abaixo da dobra na maioria dos viewports mobile
- [x] INP ≤ 200ms — script roda em `requestAnimationFrame` via GSAP, sem long tasks
- [x] Imagens: zero `<img>` (tudo SVG inline leve)
- [x] Fonts com `display=swap` e preconnect — herdado do Base.astro
- [x] Sem CSS crítico inline adicional acima da dobra — bloco está abaixo do CTA
- [x] JS island mínimo — **zero React** nesta variante; script inline é Astro-only, ~2KB gzipped

## Checklist de motion hygiene

- [x] GSAP para orquestração (única lib usada aqui) — **Story 02**
- [x] `motion` v12 não utilizado nesta variante (seria overkill)
- [x] CSS para loop infinito do dot pulse (já em `@keyframes swarm-pulse`) — **Story 01**
- [x] `framer-motion` ausente — validado no plan mãe
- [x] `ScrollTrigger.refresh()` após `document.fonts.ready` — **Story 02**
- [x] `prefers-reduced-motion`: early return com estado final estático — **Story 02**
- [x] Sem FLOP: componentes começam com `opacity: 0` via `gsap.set()` no mount, não via CSS inline que pode flashar antes do JS

## Checklist de dependency hygiene

- [x] Zero nova dependência — **validado no §"Dependências npm"**
- [x] `framer-motion` ausente — herdado
- [x] `tailwindcss-animate` ausente — herdado
- [x] Build `npx astro build` sem warnings — **critério de aceite das duas stories**

## Riscos técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| CLS na entrada do swarm visual (componentes surgindo empurram layout) | M | A | `min-h-[260px]` e `max-h-[420px]` no container; componentes usam `position: absolute` dentro do `.swarm-stage` (não afetam fluxo) — **Story 01** |
| Timeline descontrolada em tabs inativas (browser pausa rAF mas GSAP pode acumular) | M | M | `gsap.ticker` pausa automático com `document.visibilityState`; confirmar em QA com Alt+Tab |
| Script inline do Astro quebra hot-reload no dev | B | B | Testar 2–3 ciclos de `ctrl+s` no arquivo; se quebrar, extrair script para `.ts` em `src/scripts/hero-swarm.ts` e importar via `<script>` |
| Mobile (375px) sem espaço vertical — bloco ultrapassa dobra do CTA | A | M | Validar no audit viewport 375; se necessário, `md:hidden` o browser mock e manter só painel de agentes no mobile (decisão pós-Story 02, não antes) |
| Conflito com `.hero-agents` antigo se grep faltar | B | A | Critério de aceite 6 da Story 01 grep explícito das classes antigas |
| Peer dep do GSAP em versão diferente da já instalada | B | A | `npm ls gsap` antes de começar Story 02; versão atual é `^3.x` e o código usa apenas API estável desde 3.10 |
| Trail line (PRD §5.5) puxando escopo | M | B | **Explicitamente fora** deste plano. Se Story 02 passar sem estouro, avaliar como story 03 futura |

## Deploy

1. Merge em `main` via PR no GitHub. Vercel Git Integration dispara build.
2. Proibido `npx vercel --prod` manual.
3. Após merge: abrir URL de produção e verificar ciclo completo do swarm (manual, 14–18s).
4. Rodar **`landing-page-audit`** skill em 4 viewports (320/390/768/1024) após merge para revalidar CLS e responsividade.
5. Se Lighthouse mobile cair de Perf ≥ 90, abrir issue de performance e avaliar `content-visibility: auto` no `.swarm-stage`.
6. DNS sem mudança (domínio único já configurado pelo plan mãe).

## Próximo passo

Após revisão deste plano:

```bash
/expand-stories docs/plans/intensivo-claude-code-hero-swarm-visual.md
```

Vai gerar:
- `docs/stories/intensivo-claude-code-hero-swarm-visual-01-estrutura-split-config-shell.md`
- `docs/stories/intensivo-claude-code-hero-swarm-visual-02-timeline-componentes-emergentes.md`

Em seguida, `implementer-sonnet` executa ambas em sequência (Story 02 depende de 01). Após Story 02 mergear, re-rodar `landing-page-audit` antes do merge final em `main`.
