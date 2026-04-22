---
title: PRD — Variante Hero ICC · Mission Control
created: 2026-04-22
tags: [prd, landing, intensivo-claude-code, hero, variant]
status: draft
project: intensivo-claude-code-landing
parent-prd: intensivo-claude-code.md
supersedes: intensivo-claude-code-hero-swarm-visual.md
---

# PRD: Variante Hero ICC · Mission Control

> Segunda (e final) variante da animação de agentes na Hero da landing ICC. **Substitui** a variante `intensivo-claude-code-hero-swarm-visual` (4 agentes + browser mock split), que comunicava "um produto nascendo" mas falhava em transmitir a tese central: **paralelismo em escala**. Esta releitura importa o framing "Mission Control" da versão antiga da página (screenshot de referência registrado no log) e adapta pra direção editorial light: **10 squads de Claude Code rodando em paralelo, tasks trocando ao vivo, contador global de tarefas concluídas subindo em tempo real**. Empresário não-dev olha e entende em 3s: "enquanto eu durmo, 10 agentes trabalham em áreas diferentes do meu negócio". Stack, tokens, direção estética, contratos de SEO/modal/analytics/JSON-LD herdados sem alteração do PRD mãe. Este documento especifica apenas o delta.

---

## 1. Contexto

- **Escopo:** mesma seção que a variante anterior (Hero, abaixo dos bullets da hero centralizada).
- **Por que a variante 1 foi deprecada:** o split "agentes → browser mock com 4 componentes emergindo" tinha três problemas:
  1. Só 4 agentes visíveis. Subcomunica a escala do paralelismo (o diferencial real do Claude Code).
  2. O browser mock pedia um layout de app coerente que ficou apertado no espaço da hero (máximo 420px de altura). Cada iteração de reposicionamento resolvia uma colisão e criava outra.
  3. O reveal sequencial dos 4 componentes no browser quebrava a leitura: o espectador olhava o browser e esperava ver "como" o produto é feito, quando a mensagem real é "quantas coisas estão sendo feitas agora, para você".
- **Por que Mission Control resolve:** 10 cards num grid denso entregam "equipe completa rodando" em um glance só. Cada card mostra um squad + task momentânea em mono (`$ comando`). Tasks cyclam de forma assíncrona. Contador global de tarefas concluídas dá prova social ao vivo sem número fabricado de inscritos. Framing "VOCÊ NO CENTRO" posiciona o visitante como comandante, não espectador.
- **Público:** idêntico ao PRD mãe. Empresário / empreendedor / profissional liberal não-dev. A imagem precisa traduzir "operação paralela" sem jargão.
- **Métrica norte:** tempo médio na hero (scroll depth até `#social-proof`) ≥ 10s no desktop (métrica ajustada pra cima vs. variante 1 porque esperamos que a densidade do grid prenda mais atenção). Medição via GA4 `scroll_depth`.
- **Janela:** mesmo deploy, mesmo prazo. Prazo no PRD mãe (24/04/2026).
- **Risco principal:** 10 cards ciclando em paralelo podem virar ruído visual ou pesar em CPU. Mitigação: loop assíncrono com **só 3-4 cards em estado `working`** simultâneos (o resto em idle/done), frame budget ≤ 2ms por frame de animação, todo o trabalho via GSAP timeline + um único `setInterval` pro contador.

---

## 2. Stack

Sem alteração. Herda integralmente PRD mãe.

- Framework Astro 4 · React 18 islands (não usado nesta variante, só Astro puro) · Tailwind 4 via `@tailwindcss/vite` · GSAP 3 como orquestrador único · JetBrains Mono / Fraunces / Inter Tight · Deploy via Vercel Git Integration.
- **Zero nova dependência.** Reaproveita `gsap` e `@astrojs/react` já instalados.
- **Zero novo token em `@theme`.** Paleta atual cobre todos os estados necessários.

---

## 3. Direção estética (delta Fase 0)

Herda integralmente Fase 0 do PRD mãe §3 (Editorial Light + Brutalist Raw controlado).

### 3.1 Composição do bloco

- **Container:** `max-w-5xl mx-auto mt-16`, centralizado horizontalmente. Alinha com o `text-center` da hero, mas o conteúdo interno do bloco é `text-left` (grid exige alinhamento).
- **Desktop (≥ md 768px):** grid `5×2` (5 colunas, 2 linhas). Gap `6`.
- **Mobile (< md):** grid `2×5` (2 colunas, 5 linhas). Gap `4`. Altura total fica alta, mas o bloco já está abaixo da dobra no mobile — não impacta LCP.
- **Altura:** sem `max-h` fixo. O grid define a altura pelo conteúdo dos cards. Cards em altura uniforme (`auto-rows-fr`), ~88px cada no desktop. Total ≈ 240px grid + header + footer ≈ 360px. Cabe bem.

### 3.2 Atmosfera e detalhe

- **Cards:** `bg-elevated border border-rule p-3`. Cantos retos. Zero `shadow`. Zero `rounded-lg`. Zero gradient.
- **Grid de regras:** o gap dos cards é visual suficiente, mas opcionalmente aplicar `gap-px bg-rule` (técnica editorial das seções UseCases) pra cards colados com régua 1px entre eles. **Decisão de render:** usar `gap-4` / `gap-px` decidido na implementação (testar qual respira melhor com o peso do header + footer).
- **Estado ativo (`working`):** dot `accent` pulsante no canto superior direito do card + sublinhado animado sob o comando (pseudo-elemento ou `<span>` com `scale-x` animado). Mesmo keyframe `swarm-pulse` que já existe em `global.css`.
- **Estado `done` momentâneo:** 500ms antes do swap da próxima task, o comando ganha um `✓` prefixo e muda de `ink-secondary` para `ink-primary`. Dá sinal de conclusão sem interromper o fluxo.
- **Estado idle:** dot `ink-muted` sem pulso. Comando em `ink-muted` também (um grau mais claro que o `working`).

### 3.3 Motion signature (delta)

- **Entrada do bloco inteiro:** após a hero timeline já existente completar (~t+2.1s do onLoad), o grid inteiro entra com mask-reveal horizontal + stagger 50ms por card, esquerda→direita, linha por linha. Duração total da entrada ≈ 700ms.
- **Loop principal:** cada card tem seu próprio mini-timeline GSAP independente, com fase inicial randomizada entre 0 e 3s. Ciclo por card: `idle → working (2.8s–4.2s com variância) → done (500ms) → swap task → idle breve (0-800ms) → working`. Resultado visual: 3-4 cards em `working` a qualquer momento, os demais transitando.
- **Contador de tarefas concluídas:** `setInterval` a ~1.5s com variância ±400ms incrementando `+1`. Valor inicial randomizado entre 240 e 260. Texto substituído via `textContent`, sem causar layout shift (usar `tabular-nums`).
- **Pause on hover:** `mouseenter` no grid inteiro → pausa todos os mini-timelines + o contador. `mouseleave` → retoma.
- **ScrollTrigger:** todas as animações (entrada + loops + contador) só iniciam quando o bloco entra na viewport (`start: 'top 85%'`, `toggleActions: 'play pause resume pause'`). Fora da viewport, pausa.
- **Reduced motion (`prefers-reduced-motion: reduce`):** estado estático. Todos os 10 cards em estado `idle`, contador congelado no valor inicial, header sem pulso no dot. Nenhum loop corre.

---

## 4. Seções afetadas

### 4.1 Hero — substituição do bloco `.hero-swarm-visual`

**Remove:** todo o componente `src/components/hero/HeroSwarmVisual.astro` entregue nas Stories 01–02 da variante anterior (config, shell, 4 componentes emergentes, master timeline).

**Adiciona:** componente novo `src/components/hero/HeroMissionControl.astro` importado em `Hero.astro` no mesmo lugar.

**Reusa:**
- Classes `.swarm-dot.{working,done}` e keyframe `swarm-pulse` em `global.css` → renomeadas para `.mc-dot` / `mc-pulse` (escopando essa variante por clareza, já que swarm-visual fica deprecada e pode ser removida do CSS depois).
- Padrão de script inline Astro (fonts ready + ScrollTrigger + reduced-motion gate) da variante 1.

Nenhuma outra seção muda.

---

## 5. Contratos obrigatórios

### 5.1 Config centralizada

Substituir a chave `HERO_SWARM` atual (de 4 agentes) por **`HERO_MISSION_CONTROL`** em `src/config.ts`:

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

10 squads × 4 tasks = 40 tasks totais. Variância suficiente pra nunca ver a mesma task aparecer duas vezes por ciclo completo.

### 5.2 Estrutura do componente `HeroMissionControl.astro`

Estrutura anotada (markup real, não pseudocódigo — dá o chão pra Story única desta variante):

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
  <!-- header -->
  <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-3 mb-4">
    <div class="flex items-center gap-3">
      <span class="mc-dot working inline-block"></span>
      <p class="font-mono text-xs tracking-widest text-accent uppercase">{MC.EYEBROW}</p>
      <p class="font-mono text-xs text-ink-muted uppercase tracking-widest">{MC.BADGE}</p>
    </div>
    <p class="font-mono text-xs text-ink-muted">{MC.LIVE_LABEL}</p>
  </div>

  <!-- counter line -->
  <div class="flex items-center justify-between mb-5">
    <p class="font-mono text-[10px] tracking-widest text-ink-muted uppercase">{MC.COUNTER_LABEL}</p>
    <p class="font-display text-ink-primary tabular-nums text-lg" data-counter>{initialCount}</p>
  </div>

  <!-- grid 5x2 desktop / 2x5 mobile -->
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
        <p class="mc-task font-mono text-[11px] text-ink-muted leading-snug mt-2 relative">
          <span class="mc-prefix">$</span> <span class="mc-task-text">{s.tasks[0]}</span>
          <span class="mc-underline absolute left-0 bottom-0 h-px w-full bg-accent origin-left scale-x-0"></span>
        </p>
      </li>
    ))}
  </ul>

  <!-- footer editorial -->
  <p class="mt-6 border-t border-rule pt-4 font-mono text-[10px] sm:text-xs tracking-widest text-ink-muted uppercase text-center">
    {MC.FOOTER_LINE}
  </p>
</div>
```

CSS correspondente (adicionar em `src/styles/global.css`, manter `swarm-*` existentes até remover explicitamente):

```css
.mc-dot {
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
.mc-dot.done { background: var(--color-ink-primary); }

.mc-card .mc-underline { transition: transform 320ms cubic-bezier(.22,1,.36,1); }
.mc-card.working .mc-underline { transform: scaleX(1); }

.mc-task { transition: color 180ms ease; }
.mc-card.done .mc-task { color: var(--color-ink-primary); }
.mc-card.swapping .mc-task-text { opacity: 0; transition: opacity 160ms ease; }

@keyframes mc-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(228, 87, 46, 0.55); }
  50%      { box-shadow: 0 0 0 5px rgba(228, 87, 46, 0); }
}
```

### 5.3 Lógica de orquestração (script inline no `.astro`)

Especificação funcional do script (código real fica na story / plano):

1. `document.fonts.ready.then(() => init())`.
2. `const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
3. Se reduced-motion: setar todos os cards para estado idle (nada a fazer), travar counter em `initialCount`, retornar.
4. Master timeline de **entrada** (GSAP): `stagger 50ms`, `clipPath` mask-reveal left→right em cada `.mc-card`, duração 0.45s, `expo.out`. ScrollTrigger `start: 'top 85%'`, `toggleActions: 'play pause resume pause'`.
5. Por card, iniciar um **mini-loop assíncrono** (função async + `while(true)` com `await sleep`):
   - Estado `working` (adiciona classe `.working`, dot pulsa, underline scaleX 0→1 via CSS transition)
   - Duração: 2800ms + random(0, 1400)
   - Estado `done` (troca classe `.working` por `.done`, ✓ prefixo aparece)
   - Duração: 500ms
   - `swapping` (adiciona classe `.swapping`, text fade-out 160ms)
   - Troca task, remove `.done` e `.swapping`, volta a idle
   - Idle breve: random(0, 800)
   - Repete
   - Fase inicial: cada card espera `random(0, 3000)` antes de começar o primeiro ciclo → desincroniza.
6. Contador: `setInterval(() => counter++, 1500 + random(-400, 400))` com `el.textContent = counter.toString()`. A variância por tick precisa ser reagendada a cada iteração (usar `setTimeout` recursivo, não `setInterval` fixo).
7. Pause on hover: `mouseenter` em `.hero-mission-control` → flag global `paused = true` que todos os mini-loops verificam antes de avançar + `clearTimeout` do contador. `mouseleave` → `paused = false` e reagenda.
8. ScrollTrigger: além do toggleActions padrão, quando `isActive === false` (fora da viewport), setar `paused = true`.

### 5.4 Acessibilidade

- `aria-hidden="true"` no container raiz (decorativo).
- Zero elemento focável. Cards são `<li>` sem `tabIndex`, sem `<a>`, sem `<button>`.
- `prefers-reduced-motion`: render estático conforme §3.3.
- Contrast check pendente: `ink-muted` sobre `elevated` com `text-[10px]` precisa ≥ 4.5:1 — `@theme` atual usa `#8A8580` sobre `#FFFFFF` = 3.4:1 (não passa WCAG AA). **Mitigação:** o footer em `ink-muted` é decorativo, não conteúdo essencial (info relevante já tá na copy do hero acima). Tolerável em `aria-hidden`. Se o auditor pedir, trocar para `ink-secondary` (`#4A4744` = 9.3:1). **Decisão na implementação.**

### 5.5 Tokens e classes

- Nenhum `bg-[#hex]`/`text-[#hex]` inline. Tudo via tokens.
- Classes novas escopadas: `.hero-mission-control`, `.mc-card`, `.mc-dot`, `.mc-task`, `.mc-task-text`, `.mc-prefix`, `.mc-underline`. Todas com prefixo `mc-` ou `hero-mission-control`.
- Classes `swarm-*` existentes ficam obsoletas após esta variante ser mergeada. **Removê-las em uma micro-story de cleanup** (ver §7).

---

## 6. Dependências

Nenhuma nova. Tudo coberto pelo `package.json` atual.

---

## 7. Verificação end-to-end

- [ ] `npx astro build` passa sem warnings
- [ ] Grid renderiza 5×2 em `md+` e 2×5 em `< md`
- [ ] 10 cards, 10 squads, tasks visíveis desde o primeiro frame (primeiro item do array)
- [ ] Entrada do grid em stagger esquerda→direita após a hero (~t+2.1s), sem sobrepor animações da hero principal
- [ ] Loop: 3-4 cards em estado `working` simultâneos, tasks cyclam de 3-6s, contador sobe ~1 a cada 1.5s
- [ ] Pause on hover funciona: cards param + contador congela
- [ ] ScrollTrigger: fora da viewport, tudo pausa (checar via `document.visibilityState` alternativo se Safari iOS bugar)
- [ ] Reduced motion: estado estático, contador travado, cards em idle
- [ ] Lighthouse mobile mantém thresholds do plan mãe (Perf ≥ 90, a11y ≥ 95, SEO ≥ 95)
- [ ] CLS ≤ 0.1 (grid tem altura determinística pelo `min-h-[88px]` nos cards)
- [ ] Sem layout shift na entrada — `gsap.set` antes de `fonts.ready` resolve o flash inicial
- [ ] Grep `swarm-*` em `src/` retorna zero após cleanup (story de remoção)

---

## 8. Impacto em artefatos existentes

### 8.1 PRD mãe
- §4.2 (Hero): atualizar nota de referência, apontando para `intensivo-claude-code-hero-mission-control.md` em vez da variante 1.

### 8.2 PRD variante 1 (`intensivo-claude-code-hero-swarm-visual.md`)
- Marcar `status: deprecated` no frontmatter
- Adicionar nota no topo: "Substituído por `intensivo-claude-code-hero-mission-control.md` em 2026-04-22 após validação visual. Motivo: layout apertado, subcomunica paralelismo."

### 8.3 Plano variante 1 (`docs/plans/intensivo-claude-code-hero-swarm-visual.md`)
- Marcar `status: superseded`

### 8.4 Stories da variante 1
- 01 e 02: marcar `status: superseded` no frontmatter
- **Não deletar arquivos** — preserva histórico para referência e reverse-engineering se precisar reviver a ideia

### 8.5 Código
- Remover componente `HeroSwarmVisual.astro` (criado pela variante 1)
- Remover chave `HERO_SWARM` de `src/config.ts`
- Remover classes `.swarm-*` e `@keyframes swarm-pulse` de `global.css`
- Remover import e uso de `<HeroSwarmVisual />` em `Hero.astro`, substituir por `<HeroMissionControl />`

Tudo isso cabe em **uma única story M** da próxima fase (ver §10).

---

## 9. Fora do escopo deste PRD

- Copy alternativa pro eyebrow/badge/footer ( `copywriting` + `hooks-and-angles`)
- Internacionalização (página é 100% pt-BR)
- A/B test automático da variante vs. versões anteriores (escopo de Tráfego + GA4 post-merge)
- Mobile audit fino (rodar `landing-page-audit` após build)
- Contador real conectado a um endpoint de verdade (esta v1 é puramente decorativa, number teatro; substituir por `fetch` real fica pra um PRD futuro se fizer sentido comercial)
- Links / hover-state interativo em cards (aria-hidden, decorativo)

---

## 10. Próximo passo

Acionar `landing-page-create-plan` com este PRD como input. O plano deve produzir:

- **1 story M/G de refactor:** remover artefatos da variante 1 (config + componente + CSS + import) + criar `HeroMissionControl.astro` (markup, CSS, script completo) + atualizar `Hero.astro` + adicionar `HERO_MISSION_CONTROL` em `config.ts`.
- **Provavelmente 1 story P extra de cleanup:** marcar frontmatter das variantes deprecated (PRDs + plan + stories da v1 como `superseded`). Pode ser absorvida na story principal se preferir.

Depois do plano: `/expand-stories` + `implementer-sonnet` (ou opus se vier G pela densidade do script).
