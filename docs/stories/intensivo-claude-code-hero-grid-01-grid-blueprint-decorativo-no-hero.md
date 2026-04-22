---
title: Story 01 — Grid blueprint decorativo no Hero (refactor + SVG + CSS + path drawing)
slug: intensivo-claude-code-hero-grid-01
plan: docs/plans/intensivo-claude-code-hero-grid.md
prd: docs/prds/intensivo-claude-code-hero-grid.md
complexity: M
model: implementer-sonnet
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-hero-grid]
---

# Story 01 — Grid blueprint decorativo no Hero (refactor + SVG + CSS + path drawing)

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** nada (sobre base já implementada, sem conflito com outras variantes em voo)
- **Arquivos a criar:** nenhum
- **Arquivos a modificar:**
  - `site/src/components/sections/Hero.astro` — refactor estrutural em 2 wrappers irmãos + SVG inline do grid + bloco `<script>` de path drawing anexado ao script existente
  - `site/src/styles/global.css` — adicionar bloco `.hero-grid*` após as classes `.mc-*` existentes
- **Patterns a seguir:**
  - `~/.claude/skills/landing-page-create-plan/references/svg-illustrations.md` (SVG inline estruturado, decision tree motion/GSAP/CSS, a11y para decorativo, anti-padrões de filtro/loop)
  - `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` (tokens `rule | accent`, proibido `bg-[#hex]`)
  - Direção estética Fase 0 do PRD mãe §3 (cantos retos, zero shadow, zero gradient, motion signature mask-reveal)
  - Reaproveita `@keyframes mc-pulse` já existente em `global.css` — **não criar keyframe novo**

**Contexto:** o Hero atual tem peso tipográfico forte sobre fundo `page` plano. Sem gradient, mesh ou shadow (anti-patterns da Fase 0), a única ferramenta legítima pra dar estrutura editorial ao fundo é **linha**. Grid blueprint 1px `rule` com densidade 80×80 px, **mascarado por gradiente radial elíptico** centralizado no bloco textual (zona central transparente, grid aparece apenas nas bordas laterais/topo/base), garante que nenhuma linha cruza o corpo do H1/sub/CTA. Uma única alfinetada `accent` em intersecção do canto superior direito assina a página com a cor da marca (pulsa 1x no load, depois estática). Motion: path drawing GSAP sincronizado com a timeline existente da Hero (t=0 do grid = t=0 do kicker). Zero loop contínuo. Mobile oculta o grid por higiene visual. Como efeito colateral positivo, o refactor estrutural extrai o `<HeroMissionControl />` do wrapper `max-w-4xl` e coloca em wrapper próprio `max-w-5xl`, corrigindo bug pré-existente de limite implícito.

**Código de referência:**

#### 1. `site/src/styles/global.css` — adicionar após as classes `.mc-*` existentes

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

#### 2. `site/src/components/sections/Hero.astro` — refactor completo

**Estado atual (linhas 5–55):** todo o conteúdo dentro de um único `<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">`, incluindo `<HeroMissionControl />` na linha 52.

**Estado alvo:** dividir em 2 wrappers irmãos dentro da `<section>`. Wrapper 1 envolve o conteúdo textual + grid SVG absoluto. Wrapper 2 contém o Mission Control em `max-w-5xl` próprio.

```astro
---
import { CONFIG } from '../../config';
import HeroMissionControl from '../hero/HeroMissionControl.astro';

const gridVerticals = [80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880, 960, 1040, 1120];
const gridHorizontals = [80, 160, 240, 320, 400, 480, 560, 640];
---
<section class="relative bg-page pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">

  <!-- 1. Bloco textual + grid decorativo -->
  <div class="hero-text-block relative">

    <!-- Grid decorativo (apenas sm+) -->
    <div
      class="hero-grid hidden sm:block absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      <svg
        class="hero-grid-svg"
        viewBox="0 0 1200 720"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
        aria-hidden="true"
      >
        {gridVerticals.map((x) => (
          <line class="hero-grid-line hero-grid-line-v" x1={x} y1="0" x2={x} y2="720" />
        ))}
        {gridHorizontals.map((y) => (
          <line class="hero-grid-line hero-grid-line-h" x1="0" y1={y} x2="1200" y2={y} />
        ))}
        <circle class="hero-grid-dot" cx="960" cy="160" r="3" />
      </svg>
    </div>

    <!-- Conteúdo textual acima do grid -->
    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

      <p class="hero-kicker font-mono text-xs tracking-widest text-accent uppercase mb-8">
        {CONFIG.HERO_KICKER}
      </p>

      <h1 class="font-display leading-[1.02] text-[clamp(2.75rem,9vw,6.5rem)]">
        <span class="hero-line block" data-line="1">{CONFIG.HERO_H1_LINES[0].text}</span>
        <span class="hero-line block font-bold" data-line="2">
          <span class="text-accent">Claude</span> Code
        </span>
      </h1>

      <p class="hero-sub mt-8 mx-auto max-w-2xl font-sans text-ink-secondary text-lg sm:text-xl leading-relaxed">
        {CONFIG.HERO_SUBHEADLINE}
      </p>

      <p class="hero-icp mt-3 mx-auto max-w-2xl font-sans text-ink-muted text-base">
        {CONFIG.HERO_ICP}
      </p>

      <p class="hero-offer mt-10 font-mono text-sm tracking-wide text-accent uppercase">
        {CONFIG.HERO_OFFER}
      </p>

      <div class="mt-6 flex justify-center">
        <button
          type="button"
          data-open-modal
          data-cta-location="hero"
          class="hero-cta inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-page font-mono text-sm tracking-widest uppercase px-8 py-4 transition-colors"
        >
          {CONFIG.HERO_CTA}
        </button>
      </div>

      <p class="hero-microcopy mt-4 font-mono text-xs text-ink-muted tracking-wide">
        {CONFIG.HERO_MICROCOPY}
      </p>

      <ul class="hero-bullets mt-8 flex flex-col sm:flex-row sm:justify-center gap-3 sm:gap-6 font-sans text-sm text-ink-secondary">
        {CONFIG.HERO_BULLETS.map((b) => (
          <li class="flex items-center justify-center gap-2 before:content-['-'] before:text-accent before:font-bold">{b}</li>
        ))}
      </ul>
    </div>
  </div>

  <!-- 2. HeroMissionControl em container próprio, fora do grid -->
  <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
    <HeroMissionControl />
  </div>

</section>

<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.fonts.ready.then(() => {
    // 1. Grid path drawing
    const gridLines = Array.from(
      document.querySelectorAll<SVGLineElement>('.hero-grid-line')
    );
    const gridDot = document.querySelector<SVGCircleElement>('.hero-grid-dot');

    if (prefersReducedMotion) {
      // estado final estático
      gridLines.forEach((line) => {
        line.style.strokeDasharray = '';
        line.style.strokeDashoffset = '';
      });
      if (gridDot) gridDot.classList.add('is-visible');
    } else if (gridLines.length > 0) {
      // seed dashoffset = comprimento em cada linha
      gridLines.forEach((line) => {
        const len = line.getTotalLength();
        line.style.strokeDasharray = `${len}`;
        line.style.strokeDashoffset = `${len}`;
      });

      const verticals = gridLines.filter((l) => l.classList.contains('hero-grid-line-v'));
      const horizontals = gridLines.filter((l) => l.classList.contains('hero-grid-line-h'));

      const gridTl = gsap.timeline();

      gridTl
        .to(verticals, {
          strokeDashoffset: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power2.out',
        }, 0)
        .to(horizontals, {
          strokeDashoffset: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power2.out',
        }, 0);

      if (gridDot) {
        gridTl.call(() => {
          gridDot.classList.add('is-visible');
          gridDot.classList.add('is-pulsing');
        }, [], 0.9);
      }
    }

    // 2. Timeline existente da Hero (inalterada)
    const tl = gsap.timeline();

    tl.from('.hero-kicker', {
      opacity: 0,
      y: -8,
      duration: 0.4,
      ease: 'power2.out',
    })
      .from(
        '.hero-line',
        {
          clipPath: 'inset(0 50% 0 50%)',
          stagger: 0.15,
          duration: 0.9,
          ease: 'expo.out',
        },
        0.2
      )
      .from('.hero-sub', { opacity: 0, y: 10, duration: 0.5 }, 1.0)
      .from('.hero-icp', { opacity: 0, duration: 0.4 }, 1.2)
      .from('.hero-offer', { opacity: 0, duration: 0.4 }, 1.4)
      .from('.hero-cta', { opacity: 0, y: 10, duration: 0.4 }, 1.6)
      .from(
        '.hero-microcopy, .hero-bullets li',
        { opacity: 0, duration: 0.3, stagger: 0.08 },
        1.8
      )
      .from('.hero-mission-control', { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' }, 2.1);

    ScrollTrigger.refresh();
  });
</script>
```

**Notas de implementação que o implementer precisa respeitar:**

- **`gridVerticals` e `gridHorizontals` arrays no frontmatter**: Astro renderiza o loop no build, SVG sai estático no HTML. Zero JS para gerar o markup.
- **`vector-effect: non-scaling-stroke` no CSS**: mesmo com `preserveAspectRatio="slice"` escalando o viewBox em viewports largos, o stroke permanece 1px visual.
- **`getTotalLength()` dentro de `document.fonts.ready.then(...)`**: garantia de que o SVG está no DOM e tem layout. Chamar antes disso retorna 0 em alguns browsers.
- **Ordem no script**: path drawing do grid é iniciado **antes** da timeline da Hero, mas ambos rodam em paralelo (sem `await`). Não há dependência de ordem — o grid tem seu próprio `gsap.timeline()` independente.
- **Branch reduced-motion antes do resto**: zero `gsap.set`/`.to` para o grid, apenas adiciona `is-visible` na alfinetada. A timeline da Hero (segundo bloco) **continua rodando** mesmo com reduced-motion hoje no projeto (já é o padrão do Hero atual). **Não mudar esse comportamento nesta story.**
- **Alfinetada**: posicionada em `(960, 160)` no viewBox 1200×720 = ~80% horizontal, ~22% vertical. Em viewports ultralargos com `preserveAspectRatio="slice"` o centro do viewBox é preservado; esta posição fica visualmente estável.
- **Ordem no DOM**: `.hero-grid` vem **antes** do `.relative max-w-4xl mx-auto ...` dentro do `.hero-text-block`. O grid está em `absolute inset-0` (fora do fluxo) e o conteúdo textual tem `class="relative"` — stacking context natural garante texto acima do grid sem precisar de `z-index` explícito.
- **`pointer-events-none` no wrapper do grid**: protege contra qualquer caso extremo de intercept de clique no CTA.
- **`HeroMissionControl` agora em `max-w-5xl` próprio**: correção do bug pré-existente em que estava limitado implicitamente a `max-w-4xl` pelo pai. Validar visualmente que o grid 5×2 agora respira à largura correta.

**Critérios de aceite:**

1. QUANDO abrir `/` no dev server em 1280px, ENTÃO o Hero mostra um grid 1px em `rule` **nas laterais** do bloco textual (kicker até bullets) e **nenhuma linha cruza o H1, subheadline, oferta, CTA ou microcopy**
2. QUANDO inspecionar o CSS do wrapper `.hero-grid` em DevTools, ENTÃO `mask-image` e `-webkit-mask-image` com `radial-gradient(ellipse 55% 70% at center, transparent 0%, transparent 35%, black 85%)` estão aplicados
3. QUANDO carregar a página com cache limpo, ENTÃO as linhas do grid aparecem com path drawing (efeito de "sendo desenhadas") em ~0.9s a partir do início do load, com stagger visível por linha
4. QUANDO o path drawing terminar, ENTÃO 1 ponto laranja `accent` aparece na intersecção canto superior direito (~80% horizontal, ~22% vertical do bloco) e pulsa **uma única vez** (`mc-pulse` 0.8s). Após o pulso, fica estático em fill accent sólido
5. QUANDO redimensionar para `< 640px` (mobile), ENTÃO o grid inteiro **some** (`hidden sm:block` funcional); o conteúdo textual e o `HeroMissionControl` permanecem intactos
6. QUANDO o usuário tem `prefers-reduced-motion: reduce` (DevTools > Rendering > Emulate CSS media feature), ENTÃO as linhas do grid aparecem **estáticas** (sem path drawing) e a alfinetada aparece **estática** (sem pulso)
7. QUANDO inspecionar a estrutura do `<section>`, ENTÃO existem 2 wrappers irmãos: `.hero-text-block.relative` (contém grid + conteúdo textual em `max-w-4xl`) e `.mx-auto.max-w-5xl.px-4.sm:px-6.lg:px-8` (contém `HeroMissionControl`)
8. QUANDO visualizar o `HeroMissionControl`, ENTÃO o grid 5×2 aparenta respirar à largura `max-w-5xl` (80rem), não mais limitado implicitamente a `max-w-4xl` (56rem)
9. QUANDO clicar no CTA primário "ENTRAR NO GRUPO E VER A OFERTA" com o mouse posicionado exatamente sobre uma linha do grid, ENTÃO o modal abre (grid não intercepta clique — `pointer-events-none`)
10. QUANDO inspecionar o CSS aplicado às `<line>` do SVG em viewport muito largo (1920px+), ENTÃO `stroke-width` permanece visualmente 1px (efeito de `vector-effect: non-scaling-stroke`)
11. QUANDO rodar `npx astro check && npx astro build`, ENTÃO ambos passam com zero errors e zero warnings
12. QUANDO verificar o CSS gerado em `dist/`, ENTÃO contém as classes `.hero-grid`, `.hero-grid-svg`, `.hero-grid-line`, `.hero-grid-dot`, `.hero-grid-dot.is-visible`, `.hero-grid-dot.is-pulsing`
13. QUANDO grep `bg-\[#\|text-\[#` em `site/src/components/sections/Hero.astro` e no novo bloco CSS de `global.css`, ENTÃO retorna zero ocorrências (tudo via tokens)
14. QUANDO contar elementos do SVG no HTML gerado, ENTÃO são exatamente **14 `<line>` com classe `hero-grid-line-v`**, **8 `<line>` com classe `hero-grid-line-h`** e **1 `<circle>` com classe `hero-grid-dot`**
15. QUANDO observar o Hero completo por 10s após o load completar, ENTÃO o grid fica **100% estático** (zero loop contínuo); apenas o `HeroMissionControl` continua com suas animações próprias inalteradas

**Comando de validação:**

```bash
cd "/Users/mateusdias/Documents/00 - Projetos/intensivo-claude-code-landing/site" \
  && npx astro check \
  && npx astro build \
  && grep -c "hero-grid-line-v" dist/*.html dist/**/*.html 2>/dev/null | grep -v ":0$" | head -1 \
  && grep -c "hero-grid-line-h" dist/*.html dist/**/*.html 2>/dev/null | grep -v ":0$" | head -1 \
  && grep -c "hero-grid-dot" dist/*.html dist/**/*.html 2>/dev/null | grep -v ":0$" | head -1 \
  && ! grep -rn "bg-\[#\|text-\[#" src/components/sections/Hero.astro \
  && echo "✓ grid no DOM, build limpa, zero hex inline"
```

Validação manual obrigatória (o build passa sem isso, mas a story só é done após confirmar):

- Abrir em `localhost:4321/` em viewport 1280px: grid visível nas bordas, H1/CTA sem linha cruzando, alfinetada pulsa 1x no load
- Redimensionar para 375px: grid some, texto + Mission Control intactos
- DevTools > Rendering > Emulate CSS media feature `prefers-reduced-motion: reduce`: recarregar, grid aparece estático sem drawing, alfinetada estática sem pulso
- Clicar no CTA com cursor sobre uma linha visível: modal abre
