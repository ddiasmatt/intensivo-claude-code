---
title: Story 02 — Orquestração da timeline + contador + pause on hover
slug: intensivo-claude-code-hero-mission-control-02
plan: docs/plans/intensivo-claude-code-hero-mission-control.md
prd: docs/prds/intensivo-claude-code-hero-mission-control.md
complexity: M
model: implementer-sonnet
depends_on: [Story 01]
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-hero-mission-control]
---

# Story 02 — Orquestração da timeline + contador + pause on hover

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** Story 01
- **Arquivos a modificar:** `site/src/components/hero/HeroMissionControl.astro` (adicionar bloco `<script>` ao final)
- **Arquivos a criar:** nenhum
- **Patterns a seguir:**
  - `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` (seção GSAP: `ScrollTrigger.config({ ignoreMobileResize: true })`, `ScrollTrigger.refresh()` após fontes)
  - Motion signature PRD mãe §3.5: cortes secos, `expo.out`/`power2.out`, zero elastic

**Contexto:** injeta vida no Mission Control. Três sistemas rodam em paralelo:

1. **Entrada:** stagger 50ms por card (mask-reveal `clipPath: inset(0 100% 0 0) → inset(0 0 0 0)`, 450ms, `expo.out`). Só roda uma vez quando o bloco entra na viewport.
2. **Mini-loops por card (10 instâncias independentes):** cada card cicla `idle → working (2.8–4.2s) → done (500ms com prefixo ✓) → swapping (160ms fade) → troca task → idle breve (0–800ms) → repeat`. Fase inicial randomizada entre 0 e 3s por card para desincronizar. Efeito: 3–4 cards em `working` a qualquer momento.
3. **Contador:** `setTimeout` recursivo com intervalo 1.1–1.9s incrementando `+1`. Sem `setInterval` fixo (variância por tick).

Pause on hover pausa tudo: mini-loops checam flag `state.paused` antes de avançar, contador reagenda com delay longo. ScrollTrigger pausa quando bloco sai da viewport. Reduced-motion: zero loop, estado estático com `idle` em todos os cards e contador travado.

**Código de referência (script inline no `.astro`):**

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.querySelector<HTMLElement>('.hero-mission-control');
  if (!root) throw new Error('[HeroMissionControl] root not found');

  const cards = Array.from(root.querySelectorAll<HTMLElement>('.mc-card'));
  const counterEl = root.querySelector<HTMLElement>('[data-counter]');
  if (!counterEl) throw new Error('[HeroMissionControl] counter element not found');

  const state = {
    paused: false,
    counter: parseInt(root.dataset.initialCount || '247', 10),
  };

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  const rand = (min: number, max: number) => min + Math.random() * (max - min);

  async function waitWhilePaused() {
    while (state.paused) await sleep(120);
  }

  function setCardState(card: HTMLElement, next: 'idle' | 'working' | 'done' | 'swapping') {
    card.classList.remove('working', 'done', 'swapping');
    if (next !== 'idle') card.classList.add(next);
  }

  function applyTask(card: HTMLElement, nextIndex: number) {
    const taskEl = card.querySelector<HTMLElement>('.mc-task-text')!;
    const prefixEl = card.querySelector<HTMLElement>('.mc-prefix')!;
    const tasks = JSON.parse(card.dataset.squadTasks || '[]') as string[];
    if (!tasks.length) return;
    taskEl.textContent = tasks[nextIndex % tasks.length];
    prefixEl.textContent = '$';
  }

  async function runCard(card: HTMLElement, startDelay: number) {
    await sleep(startDelay);
    const tasks = JSON.parse(card.dataset.squadTasks || '[]') as string[];
    if (!tasks.length) return;
    let idx = 0;

    while (true) {
      await waitWhilePaused();
      setCardState(card, 'working');
      await sleep(rand(2800, 4200));
      await waitWhilePaused();

      const prefixEl = card.querySelector<HTMLElement>('.mc-prefix');
      if (prefixEl) prefixEl.textContent = '✓';
      setCardState(card, 'done');
      await sleep(500);

      setCardState(card, 'swapping');
      await sleep(160);
      idx = (idx + 1) % tasks.length;
      applyTask(card, idx);
      setCardState(card, 'idle');
      await sleep(rand(0, 800));
    }
  }

  function scheduleCounterTick() {
    if (state.paused) {
      setTimeout(scheduleCounterTick, 600);
      return;
    }
    state.counter += 1;
    counterEl!.textContent = state.counter.toString();
    setTimeout(scheduleCounterTick, rand(1100, 1900));
  }

  function init() {
    if (prefersReducedMotion) {
      cards.forEach((c) => setCardState(c, 'idle'));
      counterEl!.textContent = state.counter.toString();
      return;
    }

    gsap.set(cards, { clipPath: 'inset(0 100% 0 0)', opacity: 0 });

    gsap.to(cards, {
      clipPath: 'inset(0 0 0 0)',
      opacity: 1,
      duration: 0.45,
      stagger: 0.05,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: root,
        start: 'top 85%',
        toggleActions: 'play pause resume pause',
        onToggle: (self) => { state.paused = !self.isActive; },
      },
      onComplete: () => {
        cards.forEach((card) => runCard(card, rand(0, 3000)));
        setTimeout(scheduleCounterTick, rand(800, 1600));
      },
    });

    root.addEventListener('mouseenter', () => { state.paused = true; });
    root.addEventListener('mouseleave', () => { state.paused = false; });
  }

  document.fonts.ready.then(() => {
    init();
    ScrollTrigger.refresh();
  });
</script>
```

**Critérios de aceite:**
1. QUANDO carregar a página e rolar até o Mission Control, ENTÃO cards entram em stagger esquerda→direita (não todos de uma vez) em ≤ 1.2s
2. QUANDO os cards terminarem a entrada, ENTÃO em ≤ 3s há pelo menos 2 cards visivelmente em estado `working` (dot laranja pulsando + underline accent visível)
3. QUANDO um card concluir sua task, ENTÃO o prefixo `$` vira `✓` por 500ms com a cor do texto em `ink-primary` antes da troca para a próxima task
4. QUANDO observar o counter por 10s sem mover o mouse, ENTÃO o valor incrementa entre 5 e 9 vezes (variância por tick)
5. QUANDO passar o mouse sobre o bloco inteiro, ENTÃO todos os cards param em seus estados atuais e o counter congela. QUANDO tirar o mouse, ENTÃO retomam
6. QUANDO scrollar para fora da viewport do bloco, ENTÃO loops e counter pausam (checar via `ScrollTrigger.isActive === false` ou rolar rápido pro footer e voltar)
7. QUANDO o usuário tem `prefers-reduced-motion: reduce` (DevTools > Rendering > Emulate CSS media feature), ENTÃO nenhuma animação roda; todos os cards ficam em `idle` e counter fica no valor inicial
8. QUANDO rodar `npx astro build`, ENTÃO build passa sem warnings e sem erros TS no script inline

**Comando de validação:**

```bash
cd "/Users/mateusdias/Documents/00 - Projetos/intensivo-claude-code-landing/site" && npx astro check && npx astro build && echo "validar manual no browser: stagger de entrada, 3-4 cards working simultâneos, counter incrementando, pause on hover, reduced-motion via DevTools"
```
