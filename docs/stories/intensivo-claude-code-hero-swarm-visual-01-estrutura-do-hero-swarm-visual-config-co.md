---
title: Story 01 — Estrutura do Hero Swarm Visual (config + componente shell)
slug: intensivo-claude-code-hero-swarm-visual-01
plan: docs/plans/intensivo-claude-code-hero-swarm-visual.md
prd: docs/prds/intensivo-claude-code-hero-swarm-visual.md
complexity: M
model: implementer-sonnet
depends_on: []
status: superseded
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-hero-swarm-visual]
---

# Story 01 — Estrutura do Hero Swarm Visual (config + componente shell)

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
