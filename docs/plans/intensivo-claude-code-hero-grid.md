---
title: Plan — Hero ICC · Grid editorial decorativo
slug: intensivo-claude-code-hero-grid
prd: docs/prds/intensivo-claude-code-hero-grid.md
parent-plan: docs/plans/intensivo-claude-code.md
created: 2026-04-22
status: draft
---

# Plano de Implementação — Hero Grid decorativo

## Resumo

Plano escopado para adicionar um **grid blueprint decorativo animado** atrás do bloco textual do Hero (do kicker aos bullets), **sem cobrir o `HeroMissionControl`**. Entrega: refactor estrutural do `Hero.astro` em 2 wrappers irmãos, SVG inline (14 linhas verticais + 8 horizontais + 1 `<circle>` accent) mascarado por gradiente radial elíptico central, bloco CSS `.hero-grid*` em `global.css`, script de path drawing GSAP via `stroke-dasharray`/`dashoffset` sincronizado com a timeline existente da Hero. **Zero nova dependência**, zero novo token `@theme`, zero nova chave em `config.ts`. Produz **1 story M** (~45 min, `implementer-sonnet`). Mobile `< 640px` oculta o grid inteiro por higiene visual.

## Ordem canônica de landing (desvios justificados)

Idêntico aos planos variantes anteriores do projeto (`hero-mission-control`, `usecases-bento`, `paraquem-checklist`): escopo de melhoria sobre base já implementada. Stories 1–11 da ordem canônica foram concluídas no plano mãe (`docs/plans/intensivo-claude-code.md`) em 5 ondas no dia 22/04. Não re-executar.

1. ~~Scaffold Astro~~ — concluído (plano mãe, story 01)
2. ~~Tokens Tailwind~~ — concluído (plano mãe, story 02 + migração v3→v4)
3. ~~Layout Base~~ — concluído (plano mãe, story 04)
4. ~~Config centralizado~~ — concluído. **Não tocado nesta variante** (grid é decorativo, não carrega copy)
5. **Componentes de seção** — Hero já entregue (story 06 mãe) e refinado (Mission Control + Usecases Bento). Esta variante **modifica `Hero.astro`** e **adiciona bloco SVG inline**
6. ~~Modal de captura~~ — concluído (plano mãe, story 11)
7. ~~Assets públicos~~ — concluído (plano mãe, story 05)
8. ~~JSON-LD~~ — concluído (plano mãe, story 04)
9. **Audit viewports** — Story 12 do plano mãe precisa re-rodar após esta variante ir ao ar (grid novo no DOM + refactor estrutural do Hero). Não entra como story deste plano (gate de merge).
10. ~~Verificação pré-deploy~~ — coberta pelo gate da Story 12 mãe

Desvio único: este plano **só altera `Hero.astro` + `global.css`**.

## Dependências npm

**Nenhuma adição.** Tudo coberto pelo `package.json` atual:

- `gsap@^3` (path drawing via `strokeDashoffset`, já instalado)
- `astro@^4`, `@astrojs/react@^3` (react não usado nesta variante)
- `tailwindcss@^4`, `@tailwindcss/vite@^4`
- `lucide-react@^0.263` (não usado aqui)

**Decisões técnicas tomadas no plano, não no PRD:**

- **Sem `@gsap/react`**: a animação roda em `<script>` inline do Astro (padrão do projeto, usado por `Hero.astro` e `HeroMissionControl.astro`). `@gsap/react` só é necessário em React islands para cleanup via `useGSAP({ scope })`. Aqui não há React.
- **Sem `DrawSVGPlugin` (apesar de grátis desde GSAP 3.13)**: `<line>` simples com `stroke-dasharray` + `stroke-dashoffset` cobre 100% do caso. Plugin é overkill e aumenta bundle sem benefício.
- **Sem `SVGO`**: SVG é gerado inline no Astro (22 elementos, ~1KB), não é asset externo. SVGO não tem o que otimizar aqui.
- **Reduced-motion via `window.matchMedia` direto, não `gsap.matchMedia`**: mantém consistência com o padrão já usado no projeto (`HeroMissionControl.astro:60`).

Adicionar `@gsap/react`, `svgo`, ou `DrawSVGPlugin` sem justificativa adicional é bug de PR.

## Stories embutidas

### Story 01 — Grid blueprint decorativo no Hero (refactor + SVG + CSS + path drawing)

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

---

## Checklist de a11y

- [x] Wrapper `.hero-grid` com `aria-hidden="true"` — Story 01
- [x] SVG com `role="presentation"` + `aria-hidden="true"` — Story 01
- [x] `pointer-events-none` no wrapper (proteção defensiva contra intercept de clique) — Story 01
- [x] Zero elemento focável (nenhum `<a>`, `<button>`, `tabindex` no SVG) — Story 01
- [x] `prefers-reduced-motion: reduce`: branch early, render estático direto — Story 01
- [ ] Contraste WCAG AA: `rule #D9D4CB` sobre `page #FBFAF7` = 1.32:1 (falha AA). **Aceitável** porque elemento é puramente decorativo, sem texto sobre ele, e WCAG 1.4.11 (Non-text Contrast) exclui non-essential visual elements. Documentado no PRD §5.5. Não bloqueia merge.
- [ ] Focus visible — N/A, grid não recebe foco
- [ ] Labels/htmlFor — N/A, sem inputs
- [x] Landmarks semânticos: grid vive dentro do `<section>` do hero existente, sem criar landmark novo — Story 01
- [x] Skip-to-content link — já no `Base.astro` (herdado)
- [x] Imagens decorativas com `alt=""` — N/A (SVG inline, não `<img>`)

## Checklist de analytics (3 pilares)

Herdado integralmente do plano mãe. Esta variante **não adiciona eventos novos**:

- [x] GA4 condicional em `PUBLIC_GA_ID` — já no Base.astro
- [x] Meta Pixel condicional em `PUBLIC_META_PIXEL_ID` — já no Base.astro
- [x] UTM capture + sessionStorage + redirect append — já em `src/lib/utm.ts` e modal
- [x] Evento `Lead` com `event_id` compartilhado — já no modal React island
- [x] Evento `click_cta` nos CTAs — já nos botões com `data-cta-location`
- [x] Webhook fire-and-forget com `Promise.allSettled` — já no modal

**Nenhum item novo. Grid e alfinetada são decorativos, não disparam eventos.**

## Checklist de SEO (13 itens do CLAUDE.md global)

Herdado integralmente do `Base.astro` e plano mãe. SVG decorativo `aria-hidden`, zero impacto em DOM SEO-relevante.

- [x] favicon · robots · llms · OG · meta title/desc · viewport/lang/charset · canonical · theme-color · manifest · apple-touch-icon · JSON-LD — **todos herdados**

## Checklist de performance

- [ ] Lighthouse mobile mantém thresholds do plano mãe (Perf ≥ 90, a11y ≥ 95, SEO ≥ 95) — re-rodar após Story 01
- [x] **CLS ≤ 0.1** — grid em `absolute inset-0` (fora do fluxo), não participa de layout. Nenhum shift introduzido
- [x] **LCP não afetado** — grid via JS após `fonts.ready`, não bloqueia LCP do H1
- [x] INP ≤ 200ms — path drawing roda uma vez na entrada; estado estático pós-entrada
- [x] Imagens: zero `<img>` nesta variante (SVG inline ~1KB)
- [x] Fonts com `display=swap` e preconnect — herdado do Base.astro
- [x] JS island mínimo: zero React nesta variante, só script Astro inline (~40 linhas adicionais)
- [x] Above-the-fold SVG: ~1KB gzip, ~25 nós DOM (bem abaixo do teto de 200 da reference svg-illustrations §9)
- [x] Animação GPU-accelerated: `strokeDashoffset` em GSAP + `transform`/`opacity` no CSS

## Checklist de motion hygiene

- [x] GSAP para orquestração (única lib usada) — Story 01
- [x] CSS para `mc-pulse` reaproveitado (`@keyframes` já existente) — **não duplicar** — Story 01
- [x] `motion` v12 não utilizado (overkill pra path drawing 22 linhas)
- [x] `framer-motion` ausente — herdado
- [x] `DrawSVGPlugin` não utilizado (técnica nativa `strokeDashoffset` basta)
- [x] `ScrollTrigger.refresh()` após `document.fonts.ready` — mantido da timeline existente
- [x] `prefers-reduced-motion: reduce`: branch early com estado estático — Story 01
- [x] Sem FLOP: `getTotalLength()` + seed de `strokeDashoffset` dentro de `fonts.ready.then(...)` garante que linhas não piscam antes do script rodar
- [x] Sem loop infinito no grid (anti-pattern "Zero sparkle" da Fase 0 respeitado)
- [x] Animação individual ≤ 800ms (linhas desenham em 0.6s cada, alfinetada pulsa 0.8s — no limite, cf. anti-padrões svg-illustrations §10)

## Checklist de SVG & ilustrações

Referência: `~/.claude/skills/landing-page-create-plan/references/svg-illustrations.md`

- [x] SVG tem `viewBox` (`0 0 1200 720`), `role="presentation"` + `aria-hidden="true"` (decorativo) — Story 01
- [x] Elementos com classes de intenção (`.hero-grid-line-v`, `.hero-grid-line-h`, `.hero-grid-dot`) — Story 01
- [x] Zero `<style>`, zero `<script>` dentro do SVG, zero SMIL — Story 01
- [x] Zero figura humana, rosto, cena figurativa — N/A (grid ortogonal) — Story 01
- [x] Single-segment paths: `<line x1 y1 x2 y2>` é single-segment por natureza — Story 01
- [ ] SVGO: **não aplicável**. SVG inline gerado pelo Astro, não asset externo
- [x] Above-the-fold: gzip < 10KB (real: ~1KB), DOM < 200 nós (real: 23) — Story 01
- [ ] `@gsap/react`: **não aplicável**. Animação em `<script>` inline do Astro, não React island
- [x] IDs únicos de gradiente/filter: N/A, zero `<defs>` / `<linearGradient>` / `<filter>` — Story 01
- [ ] Pausa fora do viewport: **não aplicável**. Animação roda uma vez na entrada, zero loop contínuo. Pós-entrada, CPU consumida = 0

## Checklist de dependency hygiene

- [x] Zero nova dependência
- [x] `framer-motion` ausente — herdado
- [x] `tailwindcss-animate` ausente — herdado
- [x] `@gsap/react` ausente — não usado nesta variante (sem React island)
- [x] `DrawSVGPlugin` não registrado — técnica nativa `strokeDashoffset` basta
- [x] Build `npx astro build` sem warnings — critério de aceite da Story 01

## Riscos técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Grid visível atrapalhando leitura do H1 | B | A | Mask radial `ellipse 55% 70% at center` com `transparent 35%` garante zona central limpa. Critério de aceite 1 da Story 01 é o próprio gate visual. |
| `getTotalLength()` retornar 0 antes do SVG estar no DOM | M | A | Chamada dentro de `document.fonts.ready.then(...)` garante DOM pronto. Se `len === 0`, linha ficaria invisível; detectar e pular animação. |
| `preserveAspectRatio="slice"` escalando linhas em viewports extremos (ultra-wide 2560px+) | M | B | `vector-effect: non-scaling-stroke` no CSS. Se falhar em algum browser antigo, linhas ficariam apenas ligeiramente mais grossas (aceitável visualmente). |
| Mask radial em Safari < 15.4 | B | M | `-webkit-mask-image` duplicado. Baseline atual de browsers suporta. Fallback sem mask = grid visível atrás do texto (aceitável graceful degradation). |
| Alfinetada posicionada fora do viewport visível após `slice` em mobile/tablet estreito | B | B | Irrelevante: grid oculto em `< 640px`. Em 640–1024px, posição (960, 160) no viewBox 1200×720 fica dentro do corte `slice` com margem. |
| Intercept de clique no CTA pelo grid | B | A | `pointer-events-none` no wrapper `.hero-grid`. Critério de aceite 9 da Story 01 testa o caso. |
| Grid entrar antes das fontes carregarem e causar reflow visível | B | M | Sincronização via `document.fonts.ready.then(...)` igual à timeline existente. Sem FLOP. |
| Refactor estrutural quebrar seletor da timeline existente (`.hero-mission-control`) | B | A | `<HeroMissionControl />` continua renderizando o mesmo componente com a mesma classe raiz `.hero-mission-control`. Seletor da linha 92 da timeline existente permanece válido. Critério de aceite 11 (`npx astro check`) pega se quebrar. |
| `HeroMissionControl` em `max-w-5xl` ampliado quebrar o layout do grid 5×2 em desktop 1024–1280px | M | M | Grid `HeroMissionControl` já tem `auto-rows-fr` + `min-h-[88px]`. Ampliação apenas dá mais largura aos cards. Validar visualmente em 1024/1280/1440 após merge. Se pedir ajuste, tem 2 alternativas: a) manter `max-w-4xl` no wrapper 2 para zero mudança visual; b) reduzir `min-h` dos cards. Decisão fora do escopo desta story. |
| Hot-reload do Vite quebrar com script inline denso (60 linhas adicionais) | B | B | Se quebrar, extrair script pro final do arquivo `.astro` existente (já é onde está hoje). Não adiantar — corrigir só se acontecer. |

## Deploy

1. Merge em `main` via PR. Vercel Git Integration dispara build.
2. Proibido `npx vercel --prod` manual.
3. Após merge: abrir URL de produção, validar em 1280/768/375 que o grid aparece nos breakpoints corretos e que o H1 permanece intocado.
4. Rodar **`landing-page-audit`** em 4 viewports (320/390/768/1024) após o merge para revalidar CLS, Lighthouse mobile e responsividade.
5. Se Lighthouse mobile Perf cair abaixo de 90 após esta variante, abrir issue e investigar — grid tem pegada trivial (~1KB HTML + 40 linhas de JS), regressão seria suspeita.
6. DNS sem mudança.

## Próximo passo

Após revisão deste plano:

```bash
/expand-stories docs/plans/intensivo-claude-code-hero-grid.md
```

Gera:

- `docs/stories/intensivo-claude-code-hero-grid-01-grid-blueprint-decorativo-no-hero.md` (ou slug semelhante)

Em seguida `implementer-sonnet` executa a story única. Após validação automática + manual, re-rodar `landing-page-audit` antes do merge.
