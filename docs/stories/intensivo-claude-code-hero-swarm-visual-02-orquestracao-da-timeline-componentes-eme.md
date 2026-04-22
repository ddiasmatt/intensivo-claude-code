---
title: Story 02 — Orquestração da timeline + componentes emergentes
slug: intensivo-claude-code-hero-swarm-visual-02
plan: docs/plans/intensivo-claude-code-hero-swarm-visual.md
prd: docs/prds/intensivo-claude-code-hero-swarm-visual.md
complexity: M
model: implementer-sonnet
depends_on: [Story 01]
status: superseded
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-hero-swarm-visual]
---

# Story 02 — Orquestração da timeline + componentes emergentes

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
