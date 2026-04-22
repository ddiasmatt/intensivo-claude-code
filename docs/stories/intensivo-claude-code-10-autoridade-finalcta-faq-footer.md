---
title: Story 10 — Autoridade Mateus + FinalCTA + FAQ + Footer
slug: intensivo-claude-code-10
plan: docs/plans/intensivo-claude-code.md
prd: docs/prds/intensivo-claude-code.md
complexity: M
model: implementer-sonnet
depends_on: [Story 04, Story 05]
status: in_progress
created: 2026-04-22
tags: [story, landing, intensivo-claude-code]
---

# Story 10 — Autoridade Mateus + FinalCTA + FAQ + Footer

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** Story 04, Story 05
- **Arquivos a criar:** `site/src/components/sections/Autoridade.astro`, `site/src/components/sections/FinalCTA.astro`, `site/src/components/sections/FAQ.astro` (com accordion Astro puro), `site/src/components/Footer.astro`
- **Arquivos a modificar:** `site/src/pages/index.astro`
- **Patterns a seguir:** PRD secoes 4.9, 4.10, 4.11, 4.12

**Contexto:** 4 blocos finais agrupados para caber em 12 stories.
- **Autoridade** — split 50/50 desktop, foto do Mateus (`/mateus.webp`) com `filter: grayscale(1) contrast(1.1)` CSS.
- **FinalCTA** — full-width `bg-surface`, H2 Fraunces dominante, CTA `data-cta-location="final"`, `id="final-cta"` (ancora do TopBar).
- **FAQ** — 7 perguntas canonicas. Accordion com `<details>`/`<summary>` nativo (a11y free). 1 aberto por vez via script inline de ~15 linhas que fecha outros `<details>` ao abrir um.
- **Footer** — copyright VUK, 2 links legais (`⚠️ TODO`), email de contato (`⚠️ TODO`), logo mono.

**Codigo de referencia (recortes):**

```astro
---
// site/src/components/sections/Autoridade.astro
import { CONFIG } from '../../config';
---
<section class="relative border-t border-rule py-24 sm:py-36 bg-page">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
    <figure class="relative">
      <img src="/mateus.webp" alt="Mateus Dias" width="560" height="700" loading="lazy"
        class="w-full h-auto grayscale contrast-[1.1] border border-rule" />
    </figure>
    <div>
      <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">QUEM CONDUZ</p>
      <h2 class="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-ink-primary mb-8">Mateus Dias.</h2>
      <p class="font-sans text-lg text-ink-secondary leading-relaxed mb-8">{CONFIG.AUTHOR_BIO}</p>
      <ul class="space-y-2 font-mono text-sm text-ink-primary mb-8">
        {CONFIG.AUTHOR_CREDS.map((c) => <li class="before:content-['—'] before:text-accent before:mr-2">{c}</li>)}
      </ul>
      <p class="font-sans text-base text-ink-secondary leading-relaxed">{CONFIG.AUTHOR_PROOF}</p>
    </div>
  </div>
</section>
```

```astro
---
// site/src/components/sections/FAQ.astro
import { CONFIG } from '../../config';
---
<section class="relative border-t border-rule py-24 sm:py-36 bg-page" id="faq">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">PERGUNTAS FREQUENTES</p>
    <h2 class="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink-primary mb-16">Respostas rapidas antes de voce entrar.</h2>
    <ul class="divide-y divide-rule border-t border-b border-rule" id="faq-list">
      {CONFIG.FAQ.map((q) => (
        <li>
          <details class="group">
            <summary class="flex justify-between items-center py-6 cursor-pointer font-display text-xl text-ink-primary list-none">
              {q.q}
              <span class="text-accent font-mono text-2xl transition-transform group-open:rotate-45">+</span>
            </summary>
            <p class="pb-6 font-sans text-ink-secondary leading-relaxed">{q.a}</p>
          </details>
        </li>
      ))}
    </ul>
  </div>
</section>
<script>
  // 1 aberto por vez
  const list = document.getElementById('faq-list');
  list?.addEventListener('toggle', (e) => {
    const target = e.target as HTMLDetailsElement;
    if (!target.open) return;
    list.querySelectorAll('details[open]').forEach((d) => { if (d !== target) (d as HTMLDetailsElement).open = false; });
  }, true);
</script>
```

**Criterios de aceite:**
1. QUANDO Autoridade renderiza, ENTAO foto aplica `grayscale(1)` e contraste +10%
2. QUANDO FinalCTA renderiza, ENTAO tem `id="final-cta"` (TopBar scroll target)
3. QUANDO abrir uma pergunta do FAQ, ENTAO as outras fecham automaticamente (1 aberto por vez)
4. QUANDO ler FAQ pergunta 6, ENTAO texto menciona "infra completa" (NAO "Sistema 10x")
5. QUANDO footer renderiza, ENTAO contem copyright VUK e marca links legais com `⚠️ TODO` visivel como comentario HTML (nao em producao)

**Comando de validacao:**
```bash
cd site && npx astro build && grep -c "final-cta" dist/index.html
# esperado: >= 2 (ancora + id)
```
