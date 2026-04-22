---
title: Story 08 — BigIdea + UseCases
slug: intensivo-claude-code-08
plan: docs/plans/intensivo-claude-code.md
prd: docs/prds/intensivo-claude-code.md
complexity: M
model: implementer-sonnet
depends_on: [Story 04]
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code]
---

# Story 08 — BigIdea + UseCases

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** Story 04
- **Arquivos a criar:** `site/src/components/sections/BigIdea.astro`, `site/src/components/sections/UseCases.astro`
- **Arquivos a modificar:** `site/src/pages/index.astro`, `site/src/config.ts` (ja deve ter os arrays de casos; garantir populacao)
- **Patterns a seguir:** PRD secoes 4.4 e 4.5

**Contexto:** BigIdea e o bloco narrativo central da tese "2015 -> 2026". Tipografia protagonista: H2 Fraunces dominante (~clamp 2.5rem-4.5rem), 2 paragrafos de apoio em Inter Tight, assinatura mono italico. Mask-reveal GSAP no H2 quando entra no viewport.

UseCases e grid editorial 2 col **alternando tamanho** (nao uniforme). Icones Lucide monocromaticos stroke 1.5 (proibido emoji colorido). 8 setores conforme PRD.

**Codigo de referencia:**

```astro
---
// site/src/components/sections/BigIdea.astro
import { CONFIG } from '../../config';
---
<section class="relative border-t border-rule bg-surface py-24 sm:py-36">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-8 reveal">A TESE DA PAGINA</p>
    <h2 class="font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.05] text-ink-primary reveal" data-mask-reveal>
      Aprender Claude Code em 2026 tem a vantagem de quem aprendeu marketing digital em 2015.
    </h2>
    <div class="mt-12 space-y-6 font-sans text-ink-secondary text-lg leading-relaxed max-w-2xl">
      <p class="reveal">Poucos sabiam. Muitos negocios precisavam.</p>
      <p class="reveal">Hoje, dashboards, ferramentas internas, automacoes e aplicacoes de nicho deixaram de ser "software". Viraram ativo digital de qualquer negocio minimamente serio.</p>
    </div>
    <p class="mt-16 font-mono italic text-sm text-ink-muted reveal">Mateus Dias, abril de 2026</p>
  </div>
</section>

<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('section [data-mask-reveal]').forEach((el) => {
    gsap.from(el, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
    });
  });
</script>
```

```astro
---
// site/src/components/sections/UseCases.astro
import { CONFIG } from '../../config';
import { Stethoscope, Scale, HardHat, GraduationCap, Store, TrendingUp, Megaphone, BedDouble } from 'lucide-react';

const icons = [Stethoscope, Scale, HardHat, GraduationCap, Store, TrendingUp, Megaphone, BedDouble];
// CONFIG.USECASES: [{ sector, title, body }, ...] — ver PRD secao 4.5
---
<section class="relative border-t border-rule py-24 sm:py-36 bg-page">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">QUEM JA USA</p>
    <h2 class="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink-primary mb-16">
      Setores que ja estao construindo com Claude Code.
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule">
      {CONFIG.USECASES.map((uc, i) => {
        const Icon = icons[i];
        const emphasize = [0, 3, 5].includes(i); // 3 cards maiores
        return (
          <article class={`p-8 sm:p-10 bg-page ${emphasize ? 'md:col-span-2 md:p-14' : ''}`}>
            <Icon strokeWidth={1.5} size={32} className="text-accent mb-6" />
            <h3 class="font-display text-2xl sm:text-3xl text-ink-primary mb-3">{uc.sector}</h3>
            <p class="font-sans text-ink-secondary text-base leading-relaxed">{uc.body}</p>
          </article>
        );
      })}
    </div>
  </div>
</section>
```

**Criterios de aceite:**
1. QUANDO BigIdea entra no viewport, ENTAO H2 recebe mask-reveal da esquerda para direita
2. QUANDO UseCases renderiza, ENTAO grid alterna tamanhos (3 cards full-width + 5 half-width) e separadores sao reguas 1px `rule`
3. QUANDO `prefers-reduced-motion`, ENTAO mask-reveal desliga
4. QUANDO testar em mobile 375px, ENTAO cards empilham em 1 coluna sem quebrar icones

**Comando de validacao:**
```bash
cd site && npx astro build && npx astro check
```
