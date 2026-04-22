---
title: Story 07 — SocialProof marquee (2 direcoes, 19 PNGs)
slug: intensivo-claude-code-07
plan: docs/plans/intensivo-claude-code.md
prd: docs/prds/intensivo-claude-code.md
complexity: P
model: implementer-haiku
depends_on: [Story 04, Story 05]
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code]
---

# Story 07 — SocialProof marquee (2 direcoes, 19 PNGs)

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** Story 04, Story 05
- **Arquivos a criar:** `site/src/components/sections/SocialProof.astro`
- **Arquivos a modificar:** `site/src/pages/index.astro`
- **Patterns a seguir:** `landing-page-pattern.md` secao 5.5 (marquee 100% CSS, zero JS)

**Contexto:** 2 faixas paralelas rolando em direcoes opostas (`marquee-left` e `marquee-right` keyframes ja definidas na Story 02). Cada faixa contem as 19 imagens duplicadas (para loop seamless em `-50%`). `pause on hover` via `:hover { animation-play-state: paused }`. Imagens com `loading="lazy"` e `decoding="async"`. Altura fixa ~240px para evitar CLS.

**Codigo de referencia:**

```astro
---
// site/src/components/sections/SocialProof.astro
import { CONFIG } from '../../config';
const imgs = CONFIG.SOCIALPROOF_IMAGES;
const track = [...imgs, ...imgs]; // duplica para loop
---
<section class="relative border-t border-rule py-20 sm:py-28 overflow-hidden bg-page">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
    <h2 class="font-display text-[clamp(2rem,5vw,3.25rem)] leading-tight text-ink-primary">
      {CONFIG.SOCIALPROOF_HEADLINE}
    </h2>
    <p class="mt-4 font-sans text-ink-secondary text-lg max-w-2xl">{CONFIG.SOCIALPROOF_SUB}</p>
  </div>

  <div class="flex flex-col gap-6">
    <div class="marquee flex gap-6 animate-marquee-left hover:[animation-play-state:paused]">
      {track.map((src, i) => (
        <img src={src} alt="" loading="lazy" decoding="async" width="320" height="240" class="h-60 w-auto flex-shrink-0 object-contain border border-rule bg-elevated" />
      ))}
    </div>
    <div class="marquee flex gap-6 animate-marquee-right hover:[animation-play-state:paused]">
      {track.map((src, i) => (
        <img src={src} alt="" loading="lazy" decoding="async" width="320" height="240" class="h-60 w-auto flex-shrink-0 object-contain border border-rule bg-elevated" />
      ))}
    </div>
  </div>

  <p class="mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 font-mono text-xs tracking-widest text-ink-muted uppercase">
    {CONFIG.SOCIALPROOF_FOOTER}
  </p>
</section>
```

**Criterios de aceite:**
1. [x] QUANDO faixa renderiza, ENTAO mostra 38 itens por track (19 x2) e rolagem e seamless (sem jump)
2. [x] QUANDO mouse entra na faixa, ENTAO animacao pausa; ao sair, retoma
3. [x] QUANDO testar em mobile, ENTAO scroll vertical da pagina funciona normalmente (marquee nao captura touchmove)
4. [x] QUANDO Lighthouse rodar, ENTAO CLS < 0.1 (width/height explicitos garantem)
5. [x] QUANDO imagem quebrar por 404, ENTAO `alt=""` impede leitor de tela anunciar lixo

**Comando de validacao:**
```bash
cd site && npx astro build && grep -c "depoimento-" dist/index.html
# esperado: 38 (19 imgs x 2 tracks duplicadas)
```
