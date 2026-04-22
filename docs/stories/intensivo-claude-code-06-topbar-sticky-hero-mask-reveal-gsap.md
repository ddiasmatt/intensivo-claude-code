---
title: Story 06 — TopBar sticky + Hero com mask-reveal GSAP
slug: intensivo-claude-code-06
plan: docs/plans/intensivo-claude-code.md
prd: docs/prds/intensivo-claude-code.md
complexity: M
model: implementer-sonnet
depends_on: [Story 04]
status: in_progress
created: 2026-04-22
tags: [story, landing, intensivo-claude-code]
---

# Story 06 — TopBar sticky + Hero com mask-reveal GSAP

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** Story 04
- **Arquivos a criar:** `site/src/components/TopBar.astro`, `site/src/components/sections/Hero.astro`, `site/src/scripts/hero-reveal.ts` (GSAP inline script)
- **Arquivos a modificar:** `site/src/pages/index.astro` (compoe `<Base>` + `<TopBar>` + `<Hero>`)
- **Patterns a seguir:** `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` secao 5 (GSAP)

**Contexto:** Hero e o primeiro ponto de impacto. H1 em 3 linhas com enfases tipograficas distintas conforme `CONFIG.HERO_H1_LINES`. Mask-reveal horizontal (`clip-path inset`) em H1 e H2 via GSAP; entrada cinematica total ~3s (eyebrow -> H1 linha por linha -> sub -> CTA). CTA abre modal via `data-open-modal` (contrato do modal-pattern). TopBar sticky, mono 12px, bg preto + texto page + ponto pulsante laranja.

Crítico: `ScrollTrigger.refresh()` apos carregamento de fontes (Fraunces em variable mode). Sem isso, clip-path quebra em mobile Safari.

**Codigo de referencia:**

```astro
---
// site/src/components/TopBar.astro
import { CONFIG } from '../config';
---
<a href="#final-cta" class="block bg-ink-primary text-page font-mono text-[11px] tracking-widest py-2.5 text-center hover:bg-ink-primary/90 transition-colors">
  <span class="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-2 align-middle animate-live-pulse" aria-hidden="true"></span>
  {CONFIG.TOPBAR_TEXT}
</a>
```

```astro
---
// site/src/components/sections/Hero.astro
import { CONFIG } from '../../config';
---
<section class="relative bg-page pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="hero-kicker font-mono text-xs tracking-widest text-accent uppercase mb-8">{CONFIG.HERO_KICKER}</p>
    <h1 class="font-display leading-[1.02] text-[clamp(2.75rem,9vw,6.5rem)]">
      <span class="hero-line block" data-line="1">{CONFIG.HERO_H1_LINES[0].text}</span>
      <span class="hero-line block font-bold" data-line="2">
        <span class="text-accent">Claude</span> Code
      </span>
      <span class="hero-line block italic font-medium" data-line="3">{CONFIG.HERO_H1_LINES[2].text}</span>
    </h1>
    <p class="hero-sub mt-8 max-w-2xl font-sans text-ink-secondary text-lg sm:text-xl leading-relaxed">
      {CONFIG.HERO_SUBHEADLINE}
    </p>
    <p class="hero-icp mt-3 font-sans text-ink-muted text-base">{CONFIG.HERO_ICP}</p>
    <p class="hero-offer mt-10 font-mono text-sm tracking-wide text-accent uppercase">{CONFIG.HERO_OFFER}</p>
    <button
      type="button"
      data-open-modal
      data-cta-location="hero"
      class="hero-cta mt-6 inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-page font-mono text-sm tracking-widest uppercase px-8 py-4 transition-colors"
    >
      {CONFIG.HERO_CTA}
    </button>
    <p class="hero-microcopy mt-4 font-mono text-xs text-ink-muted tracking-wide">{CONFIG.HERO_MICROCOPY}</p>
    <ul class="hero-bullets mt-8 flex flex-col sm:flex-row gap-3 sm:gap-6 font-sans text-sm text-ink-secondary">
      {CONFIG.HERO_BULLETS.map((b) => (
        <li class="flex items-start gap-2 before:content-['—'] before:text-accent before:font-bold">{b}</li>
      ))}
    </ul>
  </div>
</section>

<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  document.fonts.ready.then(() => {
    const tl = gsap.timeline();
    tl.from('.hero-kicker', { opacity: 0, y: -8, duration: 0.4, ease: 'power2.out' })
      .from('.hero-line', { clipPath: 'inset(0 100% 0 0)', stagger: 0.15, duration: 0.8, ease: 'expo.out' }, 0.2)
      .from('.hero-sub', { opacity: 0, y: 10, duration: 0.5 }, 1.0)
      .from('.hero-icp', { opacity: 0, duration: 0.4 }, 1.2)
      .from('.hero-offer', { opacity: 0, duration: 0.4 }, 1.4)
      .from('.hero-cta', { opacity: 0, y: 10, duration: 0.4 }, 1.6)
      .from('.hero-microcopy, .hero-bullets li', { opacity: 0, duration: 0.3, stagger: 0.08 }, 1.8);
    ScrollTrigger.refresh();
  });
</script>
```

**Criterios de aceite:**
1. QUANDO abrir a pagina, ENTAO topbar sticky no topo com ponto pulsante laranja a esquerda
2. QUANDO Hero renderiza, ENTAO H1 em 3 linhas distintas (regular, bold com "Claude" em laranja, italico) e mask-reveal varre da esquerda para direita em cada linha
3. QUANDO clicar no CTA `HERO_CTA`, ENTAO dispara `CustomEvent('open-capture-modal')` (handler global da Story 11)
4. QUANDO `prefers-reduced-motion: reduce` ativo, ENTAO animacao GSAP passa em `0.01ms` (CSS da Story 02)
5. QUANDO testar em 375px, ENTAO H1 nao corta texto, `clamp()` escala corretamente

**Comando de validacao:**
```bash
cd site && npx astro build && npx astro check
```
