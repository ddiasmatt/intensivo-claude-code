---
title: PRD — Hero ICC · Grid editorial decorativo
created: 2026-04-22
tags: [prd, landing, intensivo-claude-code, hero, grid, decorative]
status: draft
project: intensivo-claude-code-landing
parent-prd: intensivo-claude-code.md
related:
  - intensivo-claude-code-hero-mission-control.md
---

# PRD: Hero ICC · Grid editorial decorativo

> Adiciona um **grid blueprint decorativo animado** atrás do bloco textual do Hero (do kicker até os bullets), **sem envolver o `HeroMissionControl`**. O grid entra com path drawing GSAP sincronizado com a timeline de mask-reveal existente e recebe uma **alfinetada laranja** (1 ponto accent pulsando uma única vez) numa intersecção do canto superior direito, servindo como assinatura visual da página. Stack, tokens, direção estética, contratos de SEO/modal/analytics/JSON-LD herdados sem alteração do PRD mãe. Este documento especifica apenas o delta.

---

## 1. Contexto

- **Escopo:** só o Hero. O grid vive como camada absoluta atrás do conteúdo textual do Hero (kicker, H1, subheadline, ICP, oferta visível, CTA, microcopy, bullets). **Não envolve** o `HeroMissionControl` nem nenhuma outra seção.
- **Por que agora:** a Hero atual está com peso tipográfico forte (Fraunces H1 em `clamp(2.75rem, 9vw, 6.5rem)`), mas o fundo `page` plano deixa a composição parecer "sem chão". Sem gradient, sem mesh, sem shadow (tudo anti-pattern na Fase 0), a única ferramenta legítima pra dar estrutura editorial ao fundo é **linha**. Grid blueprint em linhas finas 1px ecoa a linguagem "régua editorial 1px" da Fase 0 sem introduzir vocabulário novo.
- **Por que não cobrir o `HeroMissionControl`:** o Mission Control já é denso (10 cards, dots pulsantes, tasks ciclando, contador subindo). Grid atrás dele vira ruído. A descontinuidade entre o fim do grid e o início do Mission Control é editorialmente intencional: dois blocos com gramáticas visuais complementares, separados por respiro.
- **Por que uma alfinetada laranja:** o grid cinza `rule` sozinho é bonito mas anônimo. Um único ponto accent numa intersecção específica funciona como cursor de terminal / mark-up editorial, assinando a página com a cor da marca. Pulsa uma vez no load, depois fica estático. **Uma única alfinetada** — loop infinito violaria o anti-pattern "Zero sparkle".
- **Público e objetivo:** herdados do PRD mãe. Essa melhoria não muda público nem métrica norte; é polish visual.
- **Métrica norte desta melhoria:** nenhum KPI quantitativo dedicado. Objetivo: ↑ qualidade percebida do Hero, ↓ sensação de "página de texto em fundo liso". Validação subjetiva via revisão de stakeholder (Mateus).
- **Janela:** deploy antes do fechamento do grupo VIP em 26/04/2026 (mesma janela do PRD mãe).
- **Risco principal:** grid denso atrás do H1 competir com a tipografia. Mitigação: **mask radial** centralizada no texto, opacidade do grid vai a 0 no centro e sobe pras bordas. Texto H1/sub/CTA nunca fica visualmente sobreposto por linha. Segundo risco: mobile com grid carregado visualmente em tela pequena. Mitigação: **grid oculto abaixo de 640px** (`< sm`). A régua do `HeroMissionControl` já entrega o toque editorial no mobile.

---

## 2. Stack

Sem alteração. Herda integralmente PRD mãe.

- Astro 4 · React 18 islands (não usado nesta variante) · Tailwind 4 via `@tailwindcss/vite` · GSAP 3 como orquestrador único · fontes Fraunces / Inter Tight / JetBrains Mono · deploy via Vercel Git Integration.
- **Zero nova dependência.** SVG inline + GSAP (já instalado) + CSS mask (suportado universalmente desde Safari 15.4 e Chrome 120).
- **Zero novo token em `@theme`.** Usa `--color-rule` (grid) e `--color-accent` (alfinetada) existentes.

---

## 3. Direção estética (delta Fase 0)

Herda Fase 0 do PRD mãe §3 (Editorial Light + Brutalist Raw controlado). Delta específico:

### 3.1 Tipo de grid

- **Blueprint ortogonal**, linhas finas 1px na cor `rule` (`#D9D4CB`). Cantos retos. Sem dots, sem dashes, sem crosshairs.
- **Densidade:** 80px × 80px no desktop. Cada célula quadrada.
- **Proibido neste grid:** dots (é vocabulário SaaS dev-first, conflita com editorial), hatching diagonal, padrão hexagonal, linhas tracejadas, gradient fill, drop shadow.

### 3.2 Máscara (sem atrapalhar o texto)

- **Mask radial elíptica centralizada** no bloco de texto:
  ```
  mask-image: radial-gradient(
    ellipse 55% 70% at center,
    transparent 0%,
    transparent 35%,
    black 85%
  );
  ```
- Traduzindo: centro do Hero (H1 + sub + CTA) fica com o grid **invisível**; conforme afasta do centro, o grid aparece suavemente; nas bordas laterais e topo/base do bloco, opacidade plena.
- Isso garante que **nenhuma linha do grid cruza o corpo do texto**. Grid visível só onde há espaço livre: laterais do H1, abaixo dos bullets, acima do kicker, nos corners.
- `-webkit-mask-image` duplicado para cobertura Safari < 15.4 (defensivo, mesmo com baseline atual).

### 3.3 Alfinetada laranja

- **Um único `<circle>`** SVG, r=3px, `fill: accent`, posicionado numa intersecção específica no canto superior direito do grid.
- **Posição visual:** ~78% horizontal, ~22% vertical do bloco de texto. Essa posição coloca o ponto claramente fora da zona central mascarada, visível desde o primeiro frame de render estático.
- **Animação:** pulsa **uma única vez** no load (0.8s, mesmo `@keyframes mc-pulse` que já existe em `global.css`, ciclo único), depois estático em `fill: accent` sólido.
- **Proibido:** loop infinito, múltiplas alfinetadas (só 1), gradient radial no preenchimento, halo/glow.

### 3.4 Motion signature (delta)

- **Entrada do grid:** path drawing via GSAP + `stroke-dasharray` / `stroke-dashoffset`. Cada linha (vertical + horizontal) tem dashoffset inicial = seu comprimento, anima para 0.
  - Linhas verticais desenham top → bottom.
  - Linhas horizontais desenham left → right.
  - Stagger 30ms por linha, duração individual 0.6s, ease `power2.out`.
  - Duração total da entrada do grid ≈ 0.9s.
- **Sincronização com a timeline existente da Hero:** grid entra em **t=0** (junto com `hero-kicker`), H1 mask-reveal começa em t=0.3 como hoje. Overlap de 0.6s: grid vai aparecendo enquanto o H1 emerge. Atmosfera de "página sendo impressa".
- **Alfinetada laranja:** aparece em t=0.9 (quando o grid termina de desenhar), pulse único 0.8s. Grid inteiro + alfinetada resolvidos até t=1.7. Hero timeline segue inalterada até `HeroMissionControl` entrar em t=2.1.
- **Loop contínuo:** **nenhum.** Após entrada, o grid é 100% estático. Zero CPU consumida depois de montado.
- **Reduced motion (`prefers-reduced-motion: reduce`):** grid renderiza no estado final direto (dashoffset 0), alfinetada aparece estática sem pulse. Coberto pelo bloco `@media (prefers-reduced-motion)` global já existente em `global.css`.

### 3.5 Comportamento responsivo

- **Desktop (≥ 1024px):** grid pleno, 80px × 80px, mask radial 55% × 70%.
- **Tablet (640px ≤ w < 1024px):** grid visível, densidade mantida (80px × 80px — preserve proporção).
- **Mobile (< 640px):** **grid oculto** (`hidden sm:block` no wrapper). A Hero mobile já é estreita e densa; grid só acrescenta ruído. A régua do `HeroMissionControl` segura o toque editorial no mobile.
- **Print / save-as-PDF:** irrelevante (landing de captura, não é documento).

### 3.6 Anti-patterns específicos desta melhoria

Além dos anti-patterns do PRD mãe, nesta melhoria **não pode**:
1. Dot grid (estilo Linear/Vercel) — vocabulário errado.
2. Grid animado em loop (parallax com scroll, pulsação contínua, wave).
3. Mais de uma alfinetada laranja.
4. Alfinetada com halo / ring / glow animado.
5. Cursor trail / mouse follow (quebra mobile e é vocabulário "labs").
6. Hatching, diagonal lines, grid isométrico.
7. `background-image: linear-gradient(...)` em vez de SVG estruturado — perde path drawing animável.

---

## 4. Seções afetadas

### 4.1 Hero — refatoração estrutural mínima

A estrutura atual do `Hero.astro` tem todo o conteúdo dentro de um único `<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">`, incluindo `<HeroMissionControl />`. Para que o grid cubra **só o bloco textual**, o Hero precisa ser dividido em dois wrappers irmãos:

- **Wrapper 1 (`.hero-text-block`):** `relative`, contém o grid SVG absoluto + o conteúdo textual (kicker, H1, sub, ICP, offer, CTA, microcopy, bullets).
- **Wrapper 2:** contém `<HeroMissionControl />` sem grid atrás.

Markup de referência (estrutura real vai na story):

```astro
<section class="relative bg-page pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">

  <!-- 1. Bloco textual + grid decorativo -->
  <div class="hero-text-block relative">
    <!-- Grid SVG decorativo, absolute, aria-hidden -->
    <div class="hero-grid hidden sm:block absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- SVG inline: 14 linhas v + 8 linhas h + 1 circle accent -->
    </div>

    <!-- Conteúdo textual acima do grid -->
    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- kicker, h1, sub, icp, offer, cta, microcopy, bullets (idêntico ao atual) -->
    </div>
  </div>

  <!-- 2. HeroMissionControl em container próprio, sem grid -->
  <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
    <HeroMissionControl />
  </div>

</section>
```

Mudança no markup do `Hero.astro`:
- Novo wrapper `.hero-text-block` envolvendo o conteúdo textual.
- Novo `<div class="hero-grid hidden sm:block absolute inset-0 pointer-events-none" aria-hidden="true">` com SVG inline dentro do wrapper textual.
- `<HeroMissionControl />` movido para **fora** do `max-w-4xl`, para um wrapper próprio `max-w-5xl`.

**Efeito colateral positivo:** o `HeroMissionControl` volta a respeitar sua `max-w-5xl` projetada originalmente (hoje está implicitamente limitado a `max-w-4xl` pelo pai, bug pré-existente). Este PRD resolve esse detalhe como free upgrade.

Nenhuma outra seção muda. Copy, timeline da Hero, tokens, fontes: tudo preservado.

---

## 5. Contratos obrigatórios

### 5.1 Config centralizada

O grid é **100% visual decorativo**, não carrega copy. **Nada precisa ser adicionado em `src/config.ts`**. Se algum número configurável for exposto futuramente (ex: densidade por breakpoint), entra como `HERO_GRID` em `config.ts` na época — v1 não precisa.

### 5.2 Estrutura do SVG

SVG inline no `Hero.astro` (não componente separado — é pequeno, escopado ao Hero, não reusável).

Especificação:
- **viewBox:** `0 0 1200 720` (proporção ~5:3, casa com altura média da Hero).
- **preserveAspectRatio:** `xMidYMid slice` (preenche o container, corta excedente).
- **Classes escopadas:** `.hero-grid-svg`, `.hero-grid-line`, `.hero-grid-dot`.
- **Atributos a11y:** `role="presentation"` no `<svg>` e `aria-hidden="true"` no wrapper pai.
- **Linhas verticais:** `<line x1="N" y1="0" x2="N" y2="720" />` para N ∈ {80, 160, ..., 1120}. 14 linhas.
- **Linhas horizontais:** `<line x1="0" y1="M" x2="1200" y2="M" />` para M ∈ {80, 160, ..., 640}. 8 linhas.
- **Alfinetada:** `<circle cx="960" cy="160" r="3" class="hero-grid-dot" />`. Posição (80%, 22%) no viewBox, intersecção limpa do grid.
- **Sem `<pattern>`** (path drawing em pattern não funciona — cada linha precisa ser um elemento DOM individual animável).

### 5.3 CSS (adicionar em `src/styles/global.css`)

Dentro de `@theme` não vai nada novo. Fora do `@theme`, adicionar após as classes `.mc-*` existentes:

```css
/* Hero grid decorativo */
.hero-grid {
  mask-image: radial-gradient(
    ellipse 55% 70% at center,
    transparent 0%,
    transparent 35%,
    black 85%
  );
  -webkit-mask-image: radial-gradient(
    ellipse 55% 70% at center,
    transparent 0%,
    transparent 35%,
    black 85%
  );
}

.hero-grid-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.hero-grid-line {
  stroke: var(--color-rule);
  stroke-width: 1;
  fill: none;
  vector-effect: non-scaling-stroke;
}

.hero-grid-dot {
  fill: var(--color-accent);
  opacity: 0;
}

.hero-grid-dot.is-visible {
  opacity: 1;
}

.hero-grid-dot.is-pulsing {
  animation: mc-pulse 0.8s ease-out 1;
}
```

Notas:
- `vector-effect: non-scaling-stroke` garante linhas 1px mesmo com `preserveAspectRatio="slice"` escalando o viewBox.
- Reusa `@keyframes mc-pulse` já existente no projeto. **Não** cria keyframe novo.
- A classe `.is-pulsing` é adicionada via JS uma única vez no final da entrada do grid; após 0.8s ela pode ser removida ou ficar (não faz diferença — `animation: ... 1` roda uma única vez).

### 5.4 Script de orquestração (inline no `Hero.astro`)

Adicionar dentro do `<script>` existente do `Hero.astro`, **antes** da timeline atual. Especificação funcional (código real vai na story):

1. Após `document.fonts.ready`:
2. `const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
3. Se reduced motion: setar todas as linhas com `strokeDashoffset: 0` e a `.hero-grid-dot` com `is-visible`, retornar sem animar.
4. Caso contrário:
   - Para cada `<line>` no SVG, calcular comprimento via `line.getTotalLength()` e setar `strokeDasharray` = comprimento, `strokeDashoffset` = comprimento (linha invisível).
   - Criar `gsap.timeline()` (ou incorporar à timeline mestre da Hero):
     - t=0: animar `strokeDashoffset` de todas as linhas verticais para 0, duração 0.6s, stagger 30ms.
     - t=0: em paralelo, animar `strokeDashoffset` de todas as linhas horizontais para 0, duração 0.6s, stagger 30ms.
     - t=0.9: adicionar classe `is-visible` e `is-pulsing` à `.hero-grid-dot`.
5. A timeline da Hero existente começa em t=0.2 (kicker) e não muda. Grid coexiste em paralelo, não conflita.

**Ordem de invocação:** init do grid roda **antes** da timeline da Hero no mesmo `document.fonts.ready`. Ambas as timelines se resolvem independentemente.

### 5.5 Acessibilidade

- `aria-hidden="true"` no wrapper `.hero-grid`.
- `role="presentation"` no `<svg>`.
- Zero elemento focável (nenhum `<a>`, `<button>`, `tabindex`).
- `pointer-events-none` no wrapper garante que o grid nunca intercepta cliques que deveriam ir pro CTA (proteção defensiva; com `z-index` correto o CTA já fica acima).
- `prefers-reduced-motion`: render estático.
- Contraste: grid `rule` (`#D9D4CB`) sobre `page` (`#FBFAF7`) = 1.32:1. **Não passa WCAG AA.** Tolerável porque é decorativo em `aria-hidden` — WCAG 1.4.11 exclui elementos não-essenciais. Não há texto sobre o grid.

### 5.6 Performance

- SVG inline: ~1KB no HTML (14+8 linhas curtas + 1 circle).
- Zero request de rede novo.
- Animação: 22 elementos com `strokeDashoffset` animado por 0.6s. GSAP otimiza via sub-pixel rendering no compositor. Testado em padrão da agência, impacto desprezível.
- Após entrada (t=1.7s), grid fica **100% estático**. Zero custo contínuo.
- **Impacto em LCP:** nenhum. Grid entra via JS após fonts.ready, não bloqueia parse do HTML, não afeta o LCP do H1.
- **Impacto em CLS:** zero. Grid é `absolute inset-0 pointer-events-none`, não ocupa layout.

### 5.7 Tokens e classes

- Classes novas escopadas: `.hero-grid`, `.hero-grid-svg`, `.hero-grid-line`, `.hero-grid-dot`. Todas com prefixo `hero-grid`.
- Zero `bg-[#hex]` / `text-[#hex]` inline.
- Zero novo `@theme` token.
- Reusa `@keyframes mc-pulse` existente.

---

## 6. Dependências

Nenhuma nova. Tudo coberto pelo `package.json` atual.

---

## 7. Verificação end-to-end

- [ ] `npx astro build` passa sem warnings
- [ ] Estrutura do `Hero.astro` dividida em 2 wrappers irmãos (texto + mission control)
- [ ] `HeroMissionControl` visualmente respira até `max-w-5xl` (correção do bug pré-existente de limite implícito)
- [ ] SVG com 14 linhas verticais + 8 horizontais + 1 circle renderiza no DOM
- [ ] Mask radial oculta o grid atrás do H1 / sub / CTA — nenhuma linha visível cruza o texto no estado final
- [ ] Grid entra com path drawing stagger (vertical + horizontal simultâneos) em ~0.9s, em paralelo com kicker + H1 da timeline existente
- [ ] Alfinetada laranja aparece em t=0.9, pulsa 1x (0.8s), fica estática em fill accent
- [ ] Mobile (< 640px): grid oculto (`hidden sm:block` funcional). Bloco textual e `HeroMissionControl` intactos
- [ ] Reduced motion: grid e alfinetada renderizam estáticos direto, zero animação
- [ ] Lighthouse mobile mantém thresholds do PRD mãe (Perf ≥ 90, a11y ≥ 95, SEO ≥ 95)
- [ ] CLS ≤ 0.1 (confirmado via `absolute inset-0` no wrapper do grid)
- [ ] Grid não intercepta clique no CTA primário (hit test em desktop e mobile)
- [ ] CTA primário permanece acima do grid (z-index ou ordem natural via `relative` no wrapper de conteúdo)
- [ ] Timeline existente da Hero (kicker, hero-line, hero-sub, etc.) não foi alterada em timing — apenas acrescida

---

## 8. Impacto em artefatos existentes

### 8.1 PRD mãe (`intensivo-claude-code.md`)
- Sem alteração estrutural.
- Opcional: adicionar nota em §3.5 (Textura, motion, composição) apontando este PRD como a especificação do grid decorativo do Hero.

### 8.2 PRD irmão (`intensivo-claude-code-hero-mission-control.md`)
- Sem alteração. `HeroMissionControl` continua exatamente como está, só ganha um wrapper externo próprio.

### 8.3 Plano e stories do Mission Control
- Sem alteração.

### 8.4 Código
- `site/src/components/sections/Hero.astro`: refatoração estrutural (dois wrappers) + SVG inline + script adicional.
- `site/src/styles/global.css`: adicionar bloco `.hero-grid*` após as classes `.mc-*` existentes.
- `site/src/components/hero/HeroMissionControl.astro`: **sem mudança**.
- `site/src/config.ts`: **sem mudança** em v1.

---

## 9. Fora do escopo deste PRD

- Variante mobile do grid (decisão explícita: oculto em `< sm`). Se quiser trazer o grid pro mobile depois, abrir PRD novo.
- Alfinetada animada em loop ou múltiplas alfinetadas. Explicitamente vetado aqui.
- Parallax do grid com scroll. Explicitamente vetado.
- Interatividade (hover em intersecções, cursor follow). Grid é `aria-hidden`, decorativo.
- A/B test de grid vs. sem grid. Escopo de Tráfego pós-deploy.
- Extensão do grid para outras seções (UseCases, Benefits, Final CTA). Cada seção tem linguagem visual própria; grid é identidade exclusiva do Hero.
- Mobile audit fino (rodar `landing-page-audit` após build).
- Mudança nos tokens `rule` ou `accent`. Reusa os existentes.

---

## 10. Próximo passo

Acionar `landing-page-create-plan` com este PRD como input. O plano deve produzir uma única story (complexidade M) cobrindo:

- **Story M:** refatorar `Hero.astro` em dois wrappers irmãos; adicionar SVG inline do grid com 14+8 linhas + 1 circle; adicionar bloco CSS `.hero-grid*` em `global.css`; adicionar script de path drawing GSAP com ramo reduced-motion; verificar que `HeroMissionControl` continua funcional e que a timeline existente da Hero não quebra.

Se o implementer julgar que a story cabe em P, aceitar. Se pedir pra quebrar em duas (refactor estrutural + animação), também aceitar — mas o default é **1 story M**.

Depois do plano: `/expand-stories intensivo-claude-code-hero-grid` + `implementer-sonnet`.
