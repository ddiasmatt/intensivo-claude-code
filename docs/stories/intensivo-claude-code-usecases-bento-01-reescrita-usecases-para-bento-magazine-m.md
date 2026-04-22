---
title: Story 01 — Reescrita UseCases para Bento Magazine (markup + CSS + script + SVG pre-process)
slug: intensivo-claude-code-usecases-bento-01
plan: docs/plans/intensivo-claude-code-usecases-bento.md
prd: docs/prds/intensivo-claude-code-usecases-bento.md
complexity: M
model: implementer-sonnet
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-usecases-bento]
---

# Story 01 — Reescrita UseCases para Bento Magazine (markup + CSS + script + SVG pre-process)

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** nada (seção já existe, esta story substitui markup + adiciona CSS + script)
- **Arquivos a criar:** nenhum
- **Arquivos a modificar:**
  - `site/src/components/sections/UseCases.astro` — reescrita completa do bloco `<section>`, preserva o header (kicker + h2) e o frontmatter de ícones. **Novo:** pré-processar cada string SVG removendo atributos `width="32"` e `height="32"` fixos via `.replace()` no frontmatter, para que o SVG escale 100% do wrapper (essencial pro ícone decorativo 280px do featured). Novo array `layout[]` com 8 entradas `{cols, rows, bg, featured}`. Novo componente `<article class="bento-card …">` com eyebrow numerado, ícone canto superior direito, título, descrição e (só no featured) ícone decorativo absolute position. **Novo script** inline com GSAP + ScrollTrigger + `document.fonts.ready` + `prefers-reduced-motion` guard.
  - `site/src/styles/global.css` — adicionar **~6 linhas** na seção de classes escopadas (entre o bloco `.mc-task` e o `@layer base`): `.bento-card` com `transition` em `transform` e `box-shadow`, `will-change: transform`; `.bento-card:hover` com `translateY(-2px)` + `box-shadow: inset 0 0 0 1px rgba(228, 87, 46, 0.4)`. Zero adição em `@theme` (todo o resto sai de tokens existentes).
- **Arquivos NÃO tocados:** `src/config.ts`, `Hero.astro`, `Base.astro`, qualquer outro componente de seção, `astro.config.mjs`, `package.json`.
- **Patterns a seguir:**
  - `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` (tokens `page | surface | elevated | rule | ink.* | accent.*`, **proibido** `bg-[#hex]` inline, GSAP como orquestrador único de entrada)
  - Direção estética Fase 0 do PRD mãe §3 (Editorial Light + Brutalist Raw: cantos retos, zero shadow sintética, zero gradient, régua 1px `bg-rule`, Fraunces + Inter Tight + JetBrains Mono)
  - PRD §3.1 (mapa de layout 12-col), §3.2 (anatomia card padrão vs featured), §3.3 (motion signature), §5.2 (estrutura completa do componente), §5.3 (script GSAP), §5.4 (CSS hover)

**Contexto:** a implementação atual entrega grid 2-col com dois cards full-width enfatizados. Na revisão visual ficou monótona: todos cards no mesmo `bg-page`, altura idêntica, sem diferenciação visual entre setor featured e demais. A promessa "setores **JÁ** construindo com Claude Code" pede layout curado de revista que comunique variedade + peso editorial. Bento 12-col com `auto-flow` denso resolve: soma `6×2 + 6 + 3 + 3 + 4 + 8 + 6 + 6 = 48` células = `12×4` grid fechado sem buracos. Mobile colapsa em coluna única, ordem natural (Saúde primeiro).

**Código de referência:**

Frontmatter com pré-processamento de SVG:

```astro
---
import { CONFIG } from '../../config';

// Icones Lucide inline — stroke 1.5, sem width/height fixos para permitir escalar no wrapper
const rawIcons = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path><circle cx="20" cy="10" r="2"></circle></svg>`,
  // ... manter os 7 outros SVGs existentes (Scale, HardHat, GraduationCap, Store, TrendingUp, Megaphone, BedDouble)
];

// Remover width e height fixos para que o SVG herde 100% do wrapper
const icons = rawIcons.map((svg) =>
  svg.replace(/\swidth="\d+"/, '').replace(/\sheight="\d+"/, '')
);

// Mapa de tamanho por índice (desktop 12-col). Soma fecha em 12×4 = 48 células.
const layout = [
  { cols: 'md:col-span-6', rows: 'md:row-span-2', bg: 'bg-surface',  featured: true },  // Saúde (0)
  { cols: 'md:col-span-6', rows: '',              bg: 'bg-elevated', featured: false }, // Jurídico (1)
  { cols: 'md:col-span-3', rows: '',              bg: 'bg-surface',  featured: false }, // Construção (2)
  { cols: 'md:col-span-3', rows: '',              bg: 'bg-elevated', featured: false }, // Educação (3)
  { cols: 'md:col-span-4', rows: '',              bg: 'bg-surface',  featured: false }, // Varejo (4)
  { cols: 'md:col-span-8', rows: '',              bg: 'bg-elevated', featured: false }, // Finanças (5)
  { cols: 'md:col-span-6', rows: '',              bg: 'bg-surface',  featured: false }, // Marketing (6)
  { cols: 'md:col-span-6', rows: '',              bg: 'bg-elevated', featured: false }, // Hospitalidade (7)
];
---
```

Markup do grid e cards:

```astro
<section class="relative border-t border-rule py-24 sm:py-36 bg-page">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">
      {CONFIG.USECASES_KICKER}
    </p>
    <h2 class="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink-primary mb-16">
      {CONFIG.USECASES_HEADLINE}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-px bg-rule auto-rows-[minmax(180px,auto)]">
      {CONFIG.USECASES.map((uc, i) => {
        const l = layout[i];
        const num = String(i + 1).padStart(2, '0');
        const base = 'bento-card relative overflow-hidden flex flex-col justify-between';
        const sizing = l.featured
          ? 'p-8 sm:p-12 min-h-[360px]'
          : 'p-6 sm:p-8';
        return (
          <article class={[base, sizing, l.bg, l.cols, l.rows].join(' ')}>
            {l.featured && (
              <span
                class="absolute right-0 bottom-0 pointer-events-none text-accent"
                style="opacity: 0.08; transform: translate(3rem, 1.5rem) rotate(-15deg); width: 280px; height: 280px;"
                set:html={icons[i]}
                aria-hidden="true"
              />
            )}

            <div class="relative flex items-start justify-between gap-4">
              <span class="font-mono text-xs tracking-widest text-accent">{num}.</span>
              <span
                class={l.featured ? 'text-accent inline-block w-8 h-8' : 'text-accent inline-block w-7 h-7'}
                set:html={icons[i]}
                aria-hidden="true"
              />
            </div>

            <div class="relative">
              <h3 class={
                l.featured
                  ? 'font-display text-4xl sm:text-5xl leading-tight text-ink-primary mb-3'
                  : 'font-display text-2xl text-ink-primary mb-2'
              }>
                {uc.title}
              </h3>
              <p class={
                l.featured
                  ? 'font-sans text-base sm:text-lg text-ink-secondary leading-relaxed max-w-md'
                  : 'font-sans text-sm text-ink-secondary leading-relaxed'
              }>
                {uc.description}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  </div>
</section>
```

Script de entrada (inline no final do componente):

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    document.fonts.ready.then(() => {
      gsap.set('.bento-card', { clipPath: 'inset(0 100% 0 0)', opacity: 0, y: 12 });
      gsap.to('.bento-card', {
        clipPath: 'inset(0 0 0 0)',
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: 'section:has(.bento-card)',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        onComplete: () => {
          gsap.set('.bento-card', { clearProps: 'opacity,y,clipPath' });
        },
      });
      ScrollTrigger.refresh();
    });
  }
</script>
```

CSS a adicionar em `site/src/styles/global.css` (depois do bloco `.mc-task { … }`, antes do `@layer base`):

```css
.bento-card {
  transition: transform 240ms cubic-bezier(.22,1,.36,1),
              box-shadow 240ms ease-out;
  will-change: transform;
}
.bento-card:hover {
  transform: translateY(-2px);
  box-shadow: inset 0 0 0 1px rgba(228, 87, 46, 0.4);
}
```

**Critérios de aceite:**

1. QUANDO o viewport for `≥ 768px`, ENTÃO o grid renderiza 4 linhas conforme mapa §3.1 (linha 1-2: Saúde 6×2 + Jurídico 6 + Construção 3 + Educação 3; linha 3: Varejo 4 + Finanças 8; linha 4: Marketing 6 + Hospitalidade 6), **sem buracos** em 768/1024/1440.
2. QUANDO o viewport for `< 768px`, ENTÃO todos os cards ficam em coluna única, ordem natural (Saúde primeiro, Hospitalidade último), full-width.
3. QUANDO renderizado, ENTÃO cada card mostra eyebrow `01./02./.../08.` em `font-mono text-xs text-accent tracking-widest` no canto superior esquerdo.
4. QUANDO o card é featured (Saúde, idx 0), ENTÃO o ícone Stethoscope aparece duas vezes: (a) em tamanho real 32px no canto superior direito com `text-accent` e (b) como glifo decorativo 280×280px, `opacity: 0.08`, rotacionado `-15deg`, posicionado `bottom-right` com `translate(3rem, 1.5rem)`, cortado pelo `overflow-hidden` do card.
5. QUANDO renderizado, ENTÃO os 8 cards alternam `bg-surface` e `bg-elevated` conforme tabela §3.1 (idx 0/2/4/6 em `surface`, 1/3/5/7 em `elevated`).
6. QUANDO o usuário passa o mouse sobre qualquer card em `hover: hover`, ENTÃO o card sobe 2px e ganha outline 1px accent `rgba(228, 87, 46, 0.4)` via `inset box-shadow`, transição 240ms, **sem layout shift** e sem cortar no `gap-px`.
7. QUANDO a seção entra no viewport pela primeira vez (`start: 'top 80%'`), ENTÃO os 8 cards animam com `clipPath: inset(0 100% 0 0) → inset(0 0 0 0)` + `opacity 0→1` + `y: 12→0`, duração 450ms, stagger 40ms entre cards, ease `power3.out`, **uma única vez** (sem reverter no scroll up).
8. QUANDO `prefers-reduced-motion: reduce` estiver ativo, ENTÃO cards renderizam estáticos (sem entrance, sem hover translate — mantém só a outline via box-shadow).
9. QUANDO `npx astro build` rodar, ENTÃO termina sem warnings e sem erros de TypeScript (`npx astro check`).
10. QUANDO o Lighthouse mobile rodar no viewport 375px (Slow 4G), ENTÃO Performance `≥ 90`, Accessibility `≥ 95`, Best Practices `≥ 95`, SEO `≥ 95` (thresholds do plano mãe mantidos).
11. QUANDO o grid terminar de compor, ENTÃO `CLS ≤ 0.1` (garantido por `auto-rows-[minmax(180px,auto)]` + `min-h-[360px]` no featured + ícones com dimensões declaradas).
12. QUANDO inspeccionado, ENTÃO nenhuma nova dependência aparece em `package.json` e nenhum `bg-[#hex]` ou `text-[#hex]` inline aparece no template (exceções documentadas no PRD §5.6: apenas a `rgba(…)` do `inset box-shadow` e o `opacity: 0.08` do ícone decorativo).
13. QUANDO `src/config.ts` for comparado com o estado antes da story, ENTÃO não há diff (chave `USECASES` intocada).

**Comando de validação:**

```bash
cd site && npx astro check && npx astro build && npx astro preview --port 4321 &
# em outra aba: abrir http://localhost:4321, validar visualmente em DevTools responsive (320/375/768/1024/1440),
# conferir bg alternância, ícone decorativo de Saúde, eyebrow numerado, hover outline, entrance stagger,
# ligar prefers-reduced-motion e revalidar
```
