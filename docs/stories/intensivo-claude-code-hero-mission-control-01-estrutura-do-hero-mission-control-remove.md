---
title: Story 01 — Estrutura do Hero Mission Control (remove v1 + markup + config + CSS)
slug: intensivo-claude-code-hero-mission-control-01
plan: docs/plans/intensivo-claude-code-hero-mission-control.md
prd: docs/prds/intensivo-claude-code-hero-mission-control.md
complexity: M
model: implementer-sonnet
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-hero-mission-control]
---

# Story 01 — Estrutura do Hero Mission Control (remove v1 + markup + config + CSS)

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
