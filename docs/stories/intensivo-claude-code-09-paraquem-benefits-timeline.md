---
title: Story 09 — ParaQuem + Benefits + Timeline
slug: intensivo-claude-code-09
plan: docs/plans/intensivo-claude-code.md
prd: docs/prds/intensivo-claude-code.md
complexity: M
model: implementer-sonnet
depends_on: [Story 04]
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code]
---

# Story 09 — ParaQuem + Benefits + Timeline

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** Story 04
- **Arquivos a criar:** `site/src/components/sections/ParaQuem.astro`, `site/src/components/sections/Benefits.astro`, `site/src/components/sections/Timeline.astro`
- **Arquivos a modificar:** `site/src/pages/index.astro`, `site/src/config.ts` (garantir arrays de perfis, beneficios, timeline)
- **Patterns a seguir:** PRD secoes 4.6, 4.7, 4.8

**Contexto:** 3 secoes editoriais back-to-back.
- **ParaQuem** — grid 3x2, cards `bg-surface` com borda inferior `rule`. 6 perfis.
- **Benefits** — numerados 01-04. Numero grande em Fraunces 72px, titulo 24px, descricao Inter Tight 16px. CTA inline no fim (`data-open-modal`, `data-cta-location="benefits"`).
- **Timeline** — horizontal em desktop (regua com 4 pontos), empilhada mobile (`flex-col md:flex-row`). 4 blocos de horario. Rodape mono com "gravacao liberada".

**Codigo de referencia (recortes):**

```astro
---
// site/src/components/sections/Benefits.astro
import { CONFIG } from '../../config';
---
<section class="relative border-t border-rule py-24 sm:py-36 bg-surface">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">O QUE SO QUEM ESTA NO GRUPO TEM</p>
    <h2 class="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink-primary mb-20">
      4 condicoes que o publico geral nao vai ter.
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
      {CONFIG.BENEFITS.map((b, i) => (
        <article class="relative">
          <p class="font-display text-[clamp(3rem,6vw,5rem)] text-accent leading-none mb-4">{String(i + 1).padStart(2, '0')}</p>
          <h3 class="font-display text-2xl sm:text-[26px] text-ink-primary mb-3">{b.title}</h3>
          <p class="font-sans text-ink-secondary text-base leading-relaxed">{b.body}</p>
        </article>
      ))}
    </div>
    <button type="button" data-open-modal data-cta-location="benefits"
      class="mt-20 inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-page font-mono text-sm tracking-widest uppercase px-8 py-4 transition-colors">
      QUERO ENTRAR NO GRUPO
    </button>
  </div>
</section>
```

```astro
---
// site/src/components/sections/Timeline.astro
import { CONFIG } from '../../config';
---
<section class="relative border-t border-rule py-24 sm:py-36 bg-page">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">AGENDA DO DIA</p>
    <h2 class="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink-primary mb-6">Como seu sabado vai ser montado.</h2>
    <p class="font-sans text-ink-secondary text-lg mb-16 max-w-2xl">Voce sai do dia com a operacao configurada, nao so com o conceito entendido.</p>

    <ol class="relative md:flex md:gap-0 md:items-start md:before:content-[''] md:before:absolute md:before:top-4 md:before:left-0 md:before:right-0 md:before:h-px md:before:bg-rule">
      {CONFIG.TIMELINE.map((t, i) => (
        <li class="relative md:flex-1 md:px-6 py-8 md:py-0 border-b md:border-b-0 md:border-r last:border-r-0 border-rule">
          <span class="hidden md:block w-2 h-2 rounded-full bg-accent mb-6 -translate-y-[5px]"></span>
          <span class="font-mono text-xs tracking-wider text-accent block mb-3">{t.time}</span>
          <h3 class="font-display text-xl text-ink-primary mb-2">{t.title}</h3>
          <p class="font-sans text-sm text-ink-secondary leading-relaxed">{t.body}</p>
        </li>
      ))}
    </ol>
    <p class="mt-12 font-mono text-xs tracking-widest text-ink-muted uppercase">
      Sabado 16/05 · 09h as 17h · ao vivo no Zoom com gravacao liberada.
    </p>
  </div>
</section>
```

**Criterios de aceite:**
1. QUANDO ParaQuem renderiza, ENTAO 6 perfis em grid 3x2 em `md`, 1 col em mobile
2. QUANDO Benefits renderiza, ENTAO 4 blocos numerados com numero Fraunces grande em laranja
3. QUANDO CTA de Benefits e clicado, ENTAO dispara `open-capture-modal` com `cta_location="benefits"` no analytics
4. QUANDO Timeline renderiza em desktop (>= 768px), ENTAO layout horizontal com regua 1px e 4 pontos; em mobile, empilhado vertical com separadores
5. QUANDO ler texto da Timeline, ENTAO rodape contem "gravacao liberada" (PRD ajuste 5.1)

**Comando de validacao:**
```bash
cd site && npx astro build && ! grep -n "Sistema 10x" dist/index.html && echo OK
```
