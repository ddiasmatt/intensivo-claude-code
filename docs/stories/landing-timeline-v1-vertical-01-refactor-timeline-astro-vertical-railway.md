---
title: Story 01 — Refactor Timeline.astro para layout vertical Railway
slug: landing-timeline-v1-vertical-01
plan: docs/plans/landing-timeline-v1-vertical.md
prd: docs/prds/landing-timeline-v1-vertical.md
complexity: P
model: implementer-haiku
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, landing-timeline-v1-vertical]
---

# Story 01 — Refactor Timeline.astro para layout vertical Railway

- **Complexidade:** P (< 80 linhas alteradas, escopo cirúrgico)
- **Modelo sugerido:** `implementer-haiku`
- **Depende de:** nada
- **Arquivos a modificar:** `site-v2/src/components/sections/Timeline.astro` (rewrite completo, mesmo caminho)
- **Arquivos a criar:** nenhum
- **Patterns a seguir:**
  - PRD §4 (`docs/prds/landing-timeline-v1-vertical.md`) — spec visual e regras de animação
  - `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` — uso de tokens Tailwind

**Contexto:** a Timeline atual é horizontal e responde mal em telas < 1024px. Substituir pela versão vertical Railway mantendo copy e data shape inalterados. Animação via `IntersectionObserver` nativo (sem GSAP/motion). Respeitar `prefers-reduced-motion` e ter fallback no-JS.

**Código de referência (rewrite completo — `Timeline.astro`):**

```astro
---
import { CONFIG } from '../../config';
---
<section
  class="relative border-t border-rule py-24 sm:py-36 bg-page"
  aria-labelledby="timeline-headline"
>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">
      {CONFIG.TIMELINE_KICKER}
    </p>
    <h2
      id="timeline-headline"
      class="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink-primary mb-6"
    >
      {CONFIG.TIMELINE_HEADLINE}
    </h2>
    <p class="font-sans text-ink-secondary text-lg mb-16 max-w-2xl">
      {CONFIG.TIMELINE_SUBHEADLINE}
    </p>

    <ol
      class="timeline-rail relative border-l border-rule ml-1.5 md:ml-2"
      data-timeline
    >
      {CONFIG.TIMELINE_BLOCKS.map((t, i) => (
        <li
          class="timeline-item relative pl-8 md:pl-12 pb-10 md:pb-14 last:pb-0"
          data-index={i}
        >
          <span
            aria-hidden="true"
            class="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-page -translate-x-1/2"
          ></span>
          <span class="font-mono text-xs tracking-widest text-accent uppercase block mb-3">
            {t.time}
          </span>
          <h3 class="font-display text-[clamp(1.375rem,3vw,1.875rem)] leading-tight text-ink-primary mb-2">
            {t.title}
          </h3>
          <p class="font-sans text-base md:text-lg leading-relaxed text-ink-secondary max-w-2xl">
            {t.description}
          </p>
        </li>
      ))}
    </ol>

    <p class="mt-12 font-mono text-xs tracking-widest text-ink-muted uppercase">
      {CONFIG.TIMELINE_FOOTER}
    </p>

  </div>
</section>

<style>
  /* Estado inicial so quando JS ativa o observer */
  .timeline-rail.is-armed .timeline-item {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
                transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .timeline-rail.is-armed .timeline-item.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .timeline-rail.is-armed .timeline-item {
      transform: none !important;
      transition-duration: 200ms !important;
    }
  }
</style>

<script is:inline>
  (() => {
    if (typeof window === 'undefined') return;
    const rail = document.querySelector('[data-timeline]');
    if (!rail) return;
    // Arma o estado inicial (opacity 0) apenas quando JS roda.
    // Sem JS, a secao fica visivel por default (sem classe is-armed).
    rail.classList.add('is-armed');

    const items = rail.querySelectorAll('.timeline-item');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const reveal = (el) => {
      const idx = Number(el.dataset.index || 0);
      const delay = reduced ? 0 : idx * 120;
      window.setTimeout(() => el.classList.add('is-visible'), delay);
    };

    if (!('IntersectionObserver' in window)) {
      items.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.1 }
    );

    items.forEach((el) => io.observe(el));
  })();
</script>
```

**Critérios de aceite:**

1. QUANDO `npm run build` roda em `site-v2/`, ENTÃO conclui sem warnings novos (comparar com build pré-refactor).
2. QUANDO renderizado em 360px de largura, ENTÃO a Timeline aparece vertical, sem overflow horizontal, com trilho à esquerda e nodes alinhados na linha do trilho.
3. QUANDO renderizado em 768px e 1280px, ENTÃO o layout permanece vertical (não volta a ser horizontal).
4. QUANDO o usuário rola até a seção, ENTÃO cada bloco entra em sequência com fade-up de 500ms e stagger de 120ms, um após o outro, de cima pra baixo.
5. QUANDO `prefers-reduced-motion: reduce` está ativo (DevTools > Rendering > Emulate), ENTÃO os blocos aparecem apenas com fade (sem translate), em 200ms.
6. QUANDO o JavaScript está desativado (DevTools > Disable JavaScript), ENTÃO a seção fica totalmente visível (sem `opacity: 0` preso).
7. QUANDO inspecionado o DOM, ENTÃO o `<h2>` da headline tem `id="timeline-headline"` e a `<section>` tem `aria-labelledby="timeline-headline"`.
8. QUANDO `CONFIG.TIMELINE_*` é lido, ENTÃO copy e data shape estão inalterados (mesmas 4 entradas em `TIMELINE_BLOCKS`, mesmo `TIMELINE_FOOTER`).
9. QUANDO passado o axe DevTools (ou equivalente) na seção, ENTÃO contraste AA passa em título e descrição; node do accent é marcado como decorativo (`aria-hidden="true"`).

**Comando de validação:**

```bash
cd "/Users/mateusdias/Documents/00 - Projetos/intensivo-claude-code/site-v2" && npm run build
```
