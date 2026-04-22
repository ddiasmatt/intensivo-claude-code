---
title: Plan — Variante Hero ICC · Mission Control
slug: intensivo-claude-code-hero-mission-control
prd: docs/prds/intensivo-claude-code-hero-mission-control.md
parent-plan: docs/plans/intensivo-claude-code.md
supersedes: docs/plans/intensivo-claude-code-hero-swarm-visual.md
created: 2026-04-22
status: draft
---

# Plano de Implementação — Variante Hero Mission Control

## Resumo

Plano escopado para substituir o bloco Hero swarm-visual (variante 1, stories 01–02 com `status: superseded`) pela releitura Mission Control: header com contador ao vivo + grid 5×2 com 10 cards de squads do ecossistema VUK ciclando tasks + footer editorial "VOCÊ NO CENTRO". Infra e stack já implementadas (Astro 4 + Tailwind 4 + GSAP 3). Produz **2 stories de complexidade M** (estrutura + orquestração), totalizando ~90 min. Zero nova dependência, zero novo token `@theme`. Este plano **remove** todos os artefatos da variante 1 (`HeroSwarmVisual.astro`, chave `HERO_SWARM`, classes `.swarm-*`) e cria os equivalentes `.mc-*` / `HeroMissionControl.astro`.

## Ordem canônica de landing (desvios justificados)

Idêntico ao plano da variante 1: este é escopo de variação de uma seção sobre base já implementada. Stories 1–4 e 6–10 da ordem canônica foram concluídas no plano mãe (`docs/plans/intensivo-claude-code.md`) em 5 ondas no dia 22/04. Não re-executar.

1. ~~Scaffold Astro~~ — concluído (plano mãe, story 01)
2. ~~Tokens Tailwind~~ — concluído (plano mãe, story 02 + migração v3→v4)
3. ~~Layout Base~~ — concluído (plano mãe, story 04)
4. ~~Config centralizado~~ — concluído, **modificado aqui** (Story 01 remove `HERO_SWARM`, adiciona `HERO_MISSION_CONTROL`)
5. **Componentes de seção** — Hero já entregue (story 06 mãe). Esta variante toca só no bloco de swarm, nas Stories 01–02 deste plano
6. ~~Modal de captura~~ — concluído (plano mãe, story 11)
7. ~~Assets públicos~~ — concluído (plano mãe, story 05)
8. ~~JSON-LD~~ — concluído (plano mãe, story 04)
9. **Audit viewports** — Story 12 do plano mãe precisa re-rodar após esta variante ir ao ar. Não entra como story deste plano (gate de merge).
10. ~~Verificação pré-deploy~~ — coberta pelo gate da Story 12 mãe

Desvio único: este plano **só altera Hero + deleta artefatos da v1**.

## Dependências npm

**Nenhuma adição.** Tudo coberto pelo `package.json` atual:

- `gsap@^3` (orquestrador único)
- `astro@^4`, `@astrojs/react@^3` (este último não usado nesta variante, mantido por outras seções)
- `tailwindcss@^4`, `@tailwindcss/vite@^4` (tokens via `@theme`)
- `lucide-react@^0.263` (não usado aqui — ícones não entram nesta variante; cards são só mono + texto)

Adicionar dependência nova é bug de PR.

## Stories embutidas

### Story 01 — Estrutura do Hero Mission Control (remove v1 + markup + config + CSS)

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** nada (a variante 1 existe no código mas está marcada `superseded`; esta story remove os artefatos dela como parte do escopo)
- **Arquivos a criar:** `site/src/components/hero/HeroMissionControl.astro`
- **Arquivos a deletar:** `site/src/components/hero/HeroSwarmVisual.astro`
- **Arquivos a modificar:**
  - `site/src/config.ts` — remover chave `HERO_SWARM`, adicionar `HERO_MISSION_CONTROL` (estrutura no PRD §5.1)
  - `site/src/components/sections/Hero.astro` — trocar `import HeroSwarmVisual` por `import HeroMissionControl`; trocar a tag no JSX; atualizar seletor da timeline de `.hero-swarm-visual` para `.hero-mission-control`
  - `site/src/styles/global.css` — remover classes `.swarm-dot`, `.swarm-row`, `.swarm-component`, regras `.swarm-row .task`, `.swarm-row.swapping .task`, custom property `--animate-swarm-pulse` e keyframe `swarm-pulse`. Adicionar classes `.mc-dot`, `.mc-card`, `.mc-task`, `.mc-task-text`, `.mc-prefix`, `.mc-underline`, custom property `--animate-mc-pulse`, keyframe `mc-pulse` (código no PRD §5.2)
- **Patterns a seguir:**
  - `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` (tokens `page | surface | elevated | rule | ink.* | accent.*`, proibido `bg-[#hex]`)
  - Direção estética Fase 0 do PRD mãe §3 (cantos retos, zero shadow, zero gradient)

**Contexto:** estabelece o esqueleto visual **estático** do Mission Control e liquida a variante 1. Um implementador rodando só esta story vê: 10 cards no grid com suas primeiras tasks visíveis, header e footer no lugar, sem animação nenhuma. O contador mostra o valor inicial (random do range). Isso permite revisar layout, responsividade, densidade e a11y **antes** da complexidade da timeline entrar (Story 02).

**Código de referência:**

Substituição em `site/src/config.ts` (remove `HERO_SWARM`, adiciona):

```ts
HERO_MISSION_CONTROL: {
  EYEBROW: 'MISSION CONTROL',
  BADGE: '10 AGENTES ATIVOS',
  LIVE_LABEL: '/live',
  COUNTER_LABEL: 'TAREFAS CONCLUÍDAS HOJE',
  COUNTER_INITIAL_RANGE: [240, 260] as const,
  FOOTER_LINE: 'VOCÊ NO CENTRO. DEZ AGENTES EM PARALELO TRABALHANDO PRA VOCÊ.',
  SQUADS: [
    { handle: '@pesquisa',  tasks: ['mapeando concorrentes', 'coletando benchmarks', 'extraindo reviews de produto', 'analisando ICPs'] },
    { handle: '@copy',      tasks: ['escrevendo headline', 'afinando CTA', 'variante A/B da página', 'sequência de e-mails'] },
    { handle: '@dev',       tasks: ['gerando dashboard', 'criando checkout', 'integrando webhook', 'deploy em staging'] },
    { handle: '@design',    tasks: ['refinando hero', 'ajustando grid mobile', 'exportando assets', 'OG image nova'] },
    { handle: '@analytics', tasks: ['validando eventos GA4', 'checando dedup Meta', 'funil de conversão', 'painel semanal'] },
    { handle: '@conteudo',  tasks: ['roteiro de YouTube', 'post do Instagram', 'script de short', 'editorial da newsletter'] },
    { handle: '@trafego',   tasks: ['criativos Meta Ads', 'teste de públicos', 'escala de campanha', 'UTM de lote'] },
    { handle: '@audio',     tasks: ['voice clone update', 'narração do VSL', 'efeito de abertura', 'áudio digest'] },
    { handle: '@vendas',    tasks: ['follow-up WhatsApp', 'agendamento de call', 'proposta personalizada', 'segmentação de leads'] },
    { handle: '@cs',        tasks: ['resposta de ticket', 'onboarding ativo', 'NPS trimestral', 'escalada pra time'] },
  ],
},
```

`site/src/components/hero/HeroMissionControl.astro` (shell estático, sem `<script>`):

```astro
---
import { CONFIG } from '../../config';
const MC = CONFIG.HERO_MISSION_CONTROL;
const initialCount = Math.floor(
  MC.COUNTER_INITIAL_RANGE[0] +
  Math.random() * (MC.COUNTER_INITIAL_RANGE[1] - MC.COUNTER_INITIAL_RANGE[0])
);
---

<div
  class="hero-mission-control mt-16 mx-auto max-w-5xl text-left"
  aria-hidden="true"
  data-initial-count={initialCount}
>
  <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-3 mb-4">
    <div class="flex items-center gap-3">
      <span class="mc-dot working inline-block"></span>
      <p class="font-mono text-xs tracking-widest text-accent uppercase">{MC.EYEBROW}</p>
      <p class="font-mono text-xs text-ink-muted uppercase tracking-widest">{MC.BADGE}</p>
    </div>
    <p class="font-mono text-xs text-ink-muted">{MC.LIVE_LABEL}</p>
  </div>

  <div class="flex items-center justify-between mb-5">
    <p class="font-mono text-[10px] tracking-widest text-ink-muted uppercase">{MC.COUNTER_LABEL}</p>
    <p class="font-display text-ink-primary tabular-nums text-lg" data-counter>{initialCount}</p>
  </div>

  <ul class="grid grid-cols-2 md:grid-cols-5 gap-px bg-rule">
    {MC.SQUADS.map((s, i) => (
      <li
        class="mc-card relative bg-elevated p-3 min-h-[88px] flex flex-col justify-between"
        data-squad-index={i}
        data-squad-tasks={JSON.stringify(s.tasks)}
      >
        <div class="flex items-start justify-between gap-2">
          <span class="font-mono text-xs text-accent">{s.handle}</span>
          <span class="mc-dot inline-block mt-1.5"></span>
        </div>
        <p class="mc-task font-mono text-[11px] text-ink-secondary leading-snug mt-2 relative">
          <span class="mc-prefix">$</span> <span class="mc-task-text">{s.tasks[0]}</span>
          <span class="mc-underline absolute left-0 bottom-0 h-px w-full bg-accent origin-left scale-x-0"></span>
        </p>
      </li>
    ))}
  </ul>

  <p class="mt-6 border-t border-rule pt-4 font-mono text-[10px] sm:text-xs tracking-widest text-ink-muted uppercase text-center">
    {MC.FOOTER_LINE}
  </p>
</div>
```

CSS em `src/styles/global.css` (dentro do `@theme` adicionar `--animate-mc-pulse`, fora do `@theme` adicionar classes):

```css
/* dentro de @theme */
--animate-mc-pulse: mc-pulse 1.4s ease-in-out infinite;

@keyframes mc-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(228, 87, 46, 0.55); }
  50%      { box-shadow: 0 0 0 5px rgba(228, 87, 46, 0); }
}

/* fora de @theme */
.mc-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--color-ink-muted);
  transition: background 220ms ease;
}
.mc-dot.working {
  background: var(--color-accent);
  animation: mc-pulse 1.4s ease-in-out infinite;
}
.mc-dot.done {
  background: var(--color-ink-primary);
}

.mc-card .mc-underline {
  transition: transform 320ms cubic-bezier(.22,1,.36,1);
}
.mc-card.working .mc-underline {
  transform: scaleX(1);
}

.mc-task {
  transition: color 180ms ease;
}
.mc-card.done .mc-task {
  color: var(--color-ink-primary);
}
.mc-card.swapping .mc-task-text {
  opacity: 0;
  transition: opacity 160ms ease;
}
```

Ajuste em `site/src/components/sections/Hero.astro` (import + tag + seletor da timeline):

```astro
// frontmatter
import HeroMissionControl from '../hero/HeroMissionControl.astro';
// (remover import de HeroSwarmVisual)

// JSX: substituir <HeroSwarmVisual /> por <HeroMissionControl />

// script da hero (timeline principal): se existir referência a '.hero-swarm-visual', trocar por '.hero-mission-control'
```

**Critérios de aceite:**
1. QUANDO abrir `/` no dev server, ENTÃO abaixo dos bullets aparece o bloco Mission Control com header + counter line + grid 5×2 de 10 cards + footer editorial
2. QUANDO redimensionar para < 768px, ENTÃO o grid vira 2×5 mantendo o mesmo conteúdo legível
3. QUANDO inspecionar o bloco raiz, ENTÃO `aria-hidden="true"` está presente e nenhum elemento é focável via Tab
4. QUANDO inspecionar CSS, ENTÃO zero `bg-[#hex]` ou `text-[#hex]` nas classes novas; tudo via tokens `@theme` e `--color-*`
5. QUANDO rodar `npx astro build`, ENTÃO build completa sem warnings e sem erros de tipo
6. QUANDO grep `swarm-dot\|swarm-row\|swarm-component\|swarm-pulse\|HERO_SWARM\|HeroSwarmVisual` em `site/src`, ENTÃO retorna zero ocorrências
7. QUANDO arquivo `site/src/components/hero/HeroSwarmVisual.astro` for verificado, ENTÃO não existe
8. QUANDO inspecionar o counter element, ENTÃO mostra um número inteiro entre 240 e 260 (valor inicial via `data-initial-count`)
9. QUANDO visualizar o dot do header "MISSION CONTROL", ENTÃO está na classe `.working` (pulso laranja ativo) — único dot em `working` na fase estática

**Comando de validação:**

```bash
cd "/Users/mateusdias/Documents/00 - Projetos/intensivo-claude-code-landing/site" && npx astro check && npx astro build && ( ! grep -rn "swarm-dot\|swarm-row\|swarm-component\|swarm-pulse\|HERO_SWARM\|HeroSwarmVisual" src/ ) && test ! -f src/components/hero/HeroSwarmVisual.astro && echo "✓ v1 removido e v2 estrutura no lugar"
```

---

### Story 02 — Orquestração da timeline + contador + pause on hover

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

---

## Checklist de a11y

- [x] Bloco inteiro `aria-hidden="true"` (decorativo, fora do reading order) — exigido nas 2 stories
- [x] Zero elemento focável: cards são `<li>` sem `tabIndex`, sem `<a>`, sem `<button>` — Story 01
- [x] `prefers-reduced-motion: reduce`: early return com estado estático, counter travado — Story 02
- [ ] Contraste WCAG AA: `ink-muted #8A8580` sobre `elevated #FFFFFF` = 3.4:1 (falha AA para texto < 18px). **Aceitável** neste contexto porque bloco é `aria-hidden` + decorativo. Se o auditor flagar, trocar `text-ink-muted` por `text-ink-secondary` nos cards (não no header/footer). Decisão durante implementação, não bloqueante.
- [ ] Focus visible — N/A, bloco não recebe foco
- [ ] Labels/htmlFor — N/A, sem inputs
- [x] Landmarks semânticos: bloco dentro do `<section>` do hero existente, sem criar novo landmark — Story 01
- [ ] Skip-to-content link — já no `Base.astro` (herdado)
- [x] Imagens decorativas com `alt=""` — N/A (zero imagem nesta variante)

## Checklist de analytics (3 pilares)

Herdado integralmente do plano mãe. Esta variante **não adiciona eventos novos**:

- [x] GA4 condicional em `PUBLIC_GA_ID` — já no Base.astro
- [x] Meta Pixel condicional em `PUBLIC_META_PIXEL_ID` — já no Base.astro
- [x] UTM capture + sessionStorage + redirect append — já em `src/lib/utm.ts` e modal
- [x] Evento `Lead` com `event_id` compartilhado — já no modal React island
- [x] Evento `click_cta` nos CTAs — já nos botões com `data-cta-location`
- [x] Webhook fire-and-forget com `Promise.allSettled` — já no modal

**Nenhum item novo. Counter e cards são decorativos, não disparam eventos.**

## Checklist de SEO (13 itens do CLAUDE.md global)

Herdado integralmente do `Base.astro` e plano mãe. Bloco é `aria-hidden`, decorativo, crawler ignora.

- [x] favicon · robots · llms · OG · meta title/desc · viewport/lang/charset · canonical · theme-color · manifest · apple-touch-icon · JSON-LD — **todos herdados**

Impacto zero no DOM SEO-relevante.

## Checklist de performance

- [ ] Lighthouse mobile mantém thresholds do plano mãe (Perf ≥ 90, a11y ≥ 95, SEO ≥ 95) — re-rodar após Story 02
- [ ] **CLS ≤ 0.1** — crítico: cards com `min-h-[88px]`, grid com altura determinística, `gsap.set` antes de fonts.ready para não flashar. Story 01 entrega altura estável; Story 02 só anima opacity e clipPath (não afetam layout).
- [x] LCP: bloco abaixo da dobra no mobile; hero mantém LCP no H1
- [x] INP ≤ 200ms — tudo via `setTimeout` + CSS transitions, zero long tasks
- [x] Imagens: zero `<img>` nesta variante
- [x] Fonts com `display=swap` e preconnect — herdado do Base.astro
- [x] Sem CSS crítico inline adicional acima da dobra
- [x] JS island mínimo: zero React nesta variante, só script Astro inline (~120 linhas)

## Checklist de motion hygiene

- [x] GSAP para orquestração (única lib usada) — Story 02
- [x] `motion` v12 não utilizado nesta variante (overkill pra 10 loops de `classList`)
- [x] CSS para pulso do dot (`@keyframes mc-pulse`) — Story 01
- [x] `framer-motion` ausente — herdado
- [x] `ScrollTrigger.refresh()` após `document.fonts.ready` — Story 02
- [x] `prefers-reduced-motion`: early return com estado estático — Story 02
- [x] Sem FLOP: `gsap.set(cards, { opacity: 0, clipPath: inset(0 100% 0 0) })` antes do reveal garante que cards não pisquem antes do script rodar

## Checklist de dependency hygiene

- [x] Zero nova dependência
- [x] `framer-motion` ausente — herdado
- [x] `tailwindcss-animate` ausente — herdado
- [x] Build `npx astro build` sem warnings — critério de aceite das 2 stories

## Riscos técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Performance: 10 mini-loops assíncronos + 1 contador + GSAP timeline simultâneos em mobile baixo | M | A | Loops são `async/await sleep` (não rAF), custo desprezível. Flag `paused` centralizada + ScrollTrigger pausa fora da viewport. Validar CPU no DevTools ≤ 2% em loop steady-state. |
| CLS na entrada do grid se fontes carregarem depois do layout | M | A | `document.fonts.ready.then(init)` + `gsap.set` opacity 0 antes do reveal. `min-h-[88px]` nos cards garante altura estável. |
| Contraste `ink-muted` falha WCAG AA | A | B | Documentado como aceitável (aria-hidden). Plano B: trocar pra `ink-secondary`. Não bloqueia merge. |
| Grep não captura todas referências a `swarm-*` durante cleanup (Story 01) | M | A | Critério de aceite 6 da Story 01 é o próprio grep de bloqueio. Se achar, corrigir antes de marcar story como done. |
| Hot-reload do Vite quebrar com script inline denso (>100 linhas) | B | B | Se quebrar, extrair script para `src/scripts/hero-mission-control.ts` e importar via `<script src>`. Não precisa adiantar — corrigir só se acontecer. |
| Mobile 2×5 faz bloco ocupar muito espaço vertical (empurra social proof pra longe) | M | M | Aceitável em v1. Validar no `landing-page-audit` viewport 375. Se ficar ruim, reduzir `min-h-[88px]` para `min-h-[72px]` no breakpoint mobile. |
| Counter ultrapassa 9999 e quebra layout do `tabular-nums` | B | B | Counter só sobe ~1/1.5s. Em sessão de 1h cresce ~2400. Pra passar de 9999 precisa 4h+ na mesma aba. Aceitável. Se virar problema, resetar ao voltar da viewport. |
| `data-squad-tasks` com JSON falha parse se tasks tiverem aspas curvas | B | M | `JSON.stringify` no Astro encoda. Aspas curvas (`"`/`"`) no config vão como code points válidos. Validar via build. |

## Deploy

1. Merge em `main` via PR. Vercel Git Integration dispara build.
2. Proibido `npx vercel --prod` manual.
3. Após merge: abrir URL de produção e verificar ciclo do Mission Control por 30s (manual).
4. Rodar **`landing-page-audit`** em 4 viewports (320/390/768/1024) após o merge para revalidar CLS, responsividade e peso mobile.
5. Se Lighthouse mobile Perf cair abaixo de 90, abrir issue e considerar `content-visibility: auto` no container do grid.
6. DNS sem mudança (domínio único já configurado).

## Próximo passo

Após revisão deste plano:

```bash
/expand-stories docs/plans/intensivo-claude-code-hero-mission-control.md
```

Gera:
- `docs/stories/intensivo-claude-code-hero-mission-control-01-estrutura-do-hero-mission-control-re.md`
- `docs/stories/intensivo-claude-code-hero-mission-control-02-orquestracao-da-timeline-contador-p.md`

Em seguida `implementer-sonnet` executa em série (Story 02 depende de 01). Após Story 02, re-rodar `landing-page-audit` antes do merge.
