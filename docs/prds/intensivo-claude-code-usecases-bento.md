---
title: PRD — Variante UseCases ICC · Bento Magazine
created: 2026-04-22
tags: [prd, landing, intensivo-claude-code, usecases, variant]
status: draft
project: intensivo-claude-code-landing
parent-prd: intensivo-claude-code.md
---

# PRD: Variante UseCases ICC · Bento Magazine

> Releitura visual da seção "Setores que já estão construindo com Claude Code" (`src/components/sections/UseCases.astro`). A implementação atual usa grid 2-col uniforme com dois cards full-width emphasizados — ficou plano, sem hierarquia editorial. Esta variante substitui por um **bento magazine**: grid 12-col denso, cards de tamanhos heterogêneos, 1 featured dominante (`Saúde`), alternância sutil `bg-elevated / bg-surface` criando padrão tabuleiro, numeração mono laranja "01./02./..." em cada card, hover com outline accent. Stack, tokens, direção estética, SEO, modal, analytics herdados do PRD mãe. Este documento só especifica o delta da seção UseCases.

---

## 1. Contexto

- **Escopo:** **uma seção só** (UseCases). Nada fora dela muda.
- **Por que existe:** validação visual mostrou que a implementação atual (`emphasize = new Set([0, 3])` com cards full-width 2x e cards single 1x) entrega layout monótono — cards empilhados com separadores 1px, todos no mesmo bg, sem peso visual diferenciando setor featured dos demais. A promessa da seção é "setores JÁ construindo com Claude Code", pede layout curado de revista que transmita variedade + diferenciação.
- **Público:** igual ao PRD mãe. Empresário não-dev scaneando a seção precisa: (a) ver rapidamente que há **muitos setores** cobertos, (b) sentir que **Saúde tem peso destacado** (ou qualquer que seja o featured), (c) perceber ritmo visual que faz a seção **parar o scroll**.
- **Métrica norte:** scroll depth ≥ 60% dos usuários desktop chegam a Final CTA (ajustar após coleta). Meta secundária: tempo médio na UseCases aumenta de X para X+30% vs implementação atual (antes x depois via GA4 `scroll_depth`).
- **Janela:** mesmo deploy das variantes anteriores. Prazo final PRD mãe (24/04/2026) ainda vigente.
- **Risco principal:** bento complicado vira bagunça em mobile. Mitigação: `md:` breakpoint colapsa tudo para coluna única empilhada, featured continua primeiro.

---

## 2. Stack

Sem alteração. Herda integralmente do PRD mãe.

- Astro 4, Tailwind 4 via `@tailwindcss/vite`, GSAP 3 como orquestrador de entrada, zero React island nesta seção (Astro puro).
- **Zero nova dependência.** Ícones Lucide continuam inline SVG (reuso dos 8 definidos no `UseCases.astro` atual).
- **Zero novo token em `@theme`.** Toda a alternância visual sai de `bg-elevated` + `bg-surface` + `accent` + `ink.*` que já existem.

---

## 3. Direção estética (delta Fase 0)

Herda Editorial Light + Brutalist Raw do PRD mãe §3 (cantos retos, zero shadow sintética, Fraunces + Inter Tight + JetBrains Mono, régua 1px accent/rule).

### 3.1 Composição do bento

Grid `md:grid-cols-12` no desktop (auto-flow dense), `grid-cols-1` no mobile. `gap-px bg-rule` mantém as "linhas" editoriais entre cards (mesma técnica do Mission Control). Altura das linhas define pela altura dos cards médios (provavelmente ~180px), featured cresce via `row-span-2`.

Layout por índice (0–7, mesmos 8 setores do `CONFIG.USECASES`):

| idx | Setor | Desktop col-span | Desktop row-span | Bg |
|---|---|---|---|---|
| 0 | Saúde (featured) | 6 | 2 | `surface` |
| 1 | Jurídico | 6 | 1 | `elevated` |
| 2 | Construção civil | 3 | 1 | `surface` |
| 3 | Educação | 3 | 1 | `elevated` |
| 4 | Varejo | 4 | 1 | `surface` |
| 5 | Finanças | 8 | 1 | `elevated` |
| 6 | Marketing | 6 | 1 | `surface` |
| 7 | Hospitalidade | 6 | 1 | `elevated` |

**Rhythm visual esperado:**
- Linhas 1-2: [Saúde 6×2 | Jurídico 6 ↘ Construção 3 + Educação 3]
- Linha 3: [Varejo 4 | Finanças 8]
- Linha 4: [Marketing 6 | Hospitalidade 6]

Soma: 6×2 + 6 + 3 + 3 + 4 + 8 + 6 + 6 = 48 células = 12×4. Grid fecha sem buracos.

No mobile (`< md`): `grid-cols-1`, todos cards full-width, ordem natural do array (Saúde featured fica no topo, último é Hospitalidade).

### 3.2 Anatomia do card

**Card padrão (índices 1–7):**

```
┌────────────────────────────────┐
│ 02.            [ícone Lucide]  │
│                                │
│ Jurídico                       │
│                                │
│ Advogados lançando...          │
│                                │
└────────────────────────────────┘
```

- Eyebrow: número `01./02./...` em `font-mono text-xs text-accent tracking-widest` no canto superior esquerdo
- Ícone: Lucide inline SVG, **28px**, `stroke-width: 1.5`, cor `text-accent`, posicionado canto superior direito
- Título: `font-display text-2xl text-ink-primary leading-tight` (Fraunces 24px)
- Descrição: `font-sans text-sm text-ink-secondary leading-relaxed` (Inter Tight 14px, leading 1.6)
- Padding: `p-6 sm:p-8`

**Card featured (índice 0, Saúde):**

```
┌──────────────────────────────────────────────┐
│ 01.                         [ícone grande]   │  ← ícone background decorativo
│                                              │
│                                              │
│ Saúde                                        │  ← Fraunces maior
│                                              │
│ Médicos criando apps de                      │
│ acompanhamento. Clínicas                     │
│ automatizando agendamento                    │
│ e prontuários.                               │
│                                              │
│                          [ícone real small]  │
└──────────────────────────────────────────────┘
```

- Eyebrow: `01.` em `font-mono text-xs text-accent`
- **Ícone decorativo de fundo:** mesmo SVG Lucide mas escalado via inline style `width: 280px; height: 280px; opacity: 0.08`, posicionado `absolute right-0 bottom-0 translate-x-12 translate-y-6 rotate-[-15deg] pointer-events-none`. Dá peso visual sem competir com a tipografia. Usa `currentColor` = `text-accent` com a opacidade aplicada.
- Ícone real (consistência com cards menores): 32px no canto superior direito, `text-accent`
- Título: `font-display text-4xl sm:text-5xl text-ink-primary leading-tight` (Fraunces 40–48px)
- Descrição: `font-sans text-base sm:text-lg text-ink-secondary leading-relaxed max-w-md`
- Padding: `p-8 sm:p-12`
- `overflow-hidden` no card para cortar o ícone decorativo nas bordas

### 3.3 Motion signature (delta)

- **Entrada:** cada card entra com `clipPath: inset(0 100% 0 0) → inset(0 0 0 0)` + `opacity 0 → 1` + `y: 12 → 0`, duração 450ms, stagger 40ms em order natural, ease `power3.out`. ScrollTrigger `start: 'top 80%'`.
- **Hover:** `transform: translateY(-2px)` + `box-shadow: inset 0 0 0 1px rgba(228, 87, 46, 0.4)` (outline accent via inset shadow, zero layout shift), transition 240ms cubic-bezier(.22,1,.36,1). Sai por cima do grid gap sem cortes visuais.
- **Ícone decorativo do featured:** estático, sem animação. Podia ter parallax sutil no scroll, mas fora de escopo v1 (mantém simples).
- **Reduced motion:** render estático sem reveal, sem hover transform (só muda a outline do shadow).

---

## 4. Seções afetadas

### 4.1 UseCases — substituição completa do markup

**Modifica:** `src/components/sections/UseCases.astro` — reescreve o bloco `<section>` inteiro mantendo os 8 ícones Lucide inline SVG existentes no frontmatter e o header (kicker + h2).

**Não modifica:**
- `src/config.ts` — chave `USECASES` permanece idêntica (8 objetos `{title, description}`)
- `src/styles/global.css` — zero adição (tudo via Tailwind utilities + tokens existentes)
- Qualquer outro componente

---

## 5. Contratos obrigatórios

### 5.1 Config centralizada

Chave `CONFIG.USECASES` não muda. Array de 8 objetos `{title, description}` continua em `src/config.ts`. Nenhuma adição necessária no config.

### 5.2 Estrutura do componente

```astro
---
import { CONFIG } from '../../config';

const icons = [ /* 8 SVGs Lucide inline, reuso do arquivo atual */ ];

// mapeamento de tamanho por índice (desktop)
const layout = [
  { cols: 'md:col-span-6', rows: 'md:row-span-2', bg: 'bg-surface', featured: true },
  { cols: 'md:col-span-6', rows: '',              bg: 'bg-elevated' },
  { cols: 'md:col-span-3', rows: '',              bg: 'bg-surface' },
  { cols: 'md:col-span-3', rows: '',              bg: 'bg-elevated' },
  { cols: 'md:col-span-4', rows: '',              bg: 'bg-surface' },
  { cols: 'md:col-span-8', rows: '',              bg: 'bg-elevated' },
  { cols: 'md:col-span-6', rows: '',              bg: 'bg-surface' },
  { cols: 'md:col-span-6', rows: '',              bg: 'bg-elevated' },
];
---

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
        return (
          <article
            class={[
              'bento-card relative overflow-hidden',
              l.bg,
              l.cols,
              l.rows,
              l.featured ? 'p-8 sm:p-12 flex flex-col justify-between min-h-[360px]' : 'p-6 sm:p-8 flex flex-col justify-between',
            ].join(' ')}
          >
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
                class={l.featured ? 'text-accent w-8 h-8' : 'text-accent w-7 h-7'}
                set:html={icons[i]}
                aria-hidden="true"
              />
            </div>

            <div class="relative">
              <h3 class={l.featured ? 'font-display text-4xl sm:text-5xl leading-tight text-ink-primary mb-3' : 'font-display text-2xl text-ink-primary mb-2'}>
                {uc.title}
              </h3>
              <p class={l.featured ? 'font-sans text-base sm:text-lg text-ink-secondary leading-relaxed max-w-md' : 'font-sans text-sm text-ink-secondary leading-relaxed'}>
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

**Nota sobre SVG inline com tamanho via inline style:** como o ícone é `set:html={icons[i]}`, o tamanho setado no SVG original (`width="32" height="32"`) prevalece sobre classes Tailwind. Pro featured decorativo, o `<span>` wrapper recebe `style="width: 280px; height: 280px"` e o CSS `span > svg { width: 100%; height: 100% }` escala. **Caveat de implementação:** talvez precise de `span.decorative-icon svg { width: 100% !important }` em `global.css` — só adicionar se o SVG não escalar. **Preferível:** pré-processar os SVG strings no frontmatter removendo os atributos `width` e `height` fixos antes de renderizar.

### 5.3 Motion no script

Script inline `<script>` do componente:

```ts
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // sem entrance animation
  } else {
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

### 5.4 Hover state (CSS, sem JS)

Adicionar em `src/styles/global.css`:

```css
.bento-card {
  transition: transform 240ms cubic-bezier(.22,1,.36,1), box-shadow 240ms ease-out;
  will-change: transform;
}
.bento-card:hover {
  transform: translateY(-2px);
  box-shadow: inset 0 0 0 1px rgba(228, 87, 46, 0.4);
}
```

`inset` box-shadow evita layout shift + não quebra o `gap-px bg-rule` adjacente.

### 5.5 Acessibilidade

- `<section>` já tem landmark natural. Não adicionar `role`.
- H2 principal preservado. H3 em cada card (`uc.title`) dá hierarquia semântica.
- Cards são `<article>` (bom pra leitores: cada setor é unidade independente).
- Ícones com `aria-hidden="true"` (decorativos, título textual já descreve o setor).
- Zero elemento focável (sem `<button>`, sem `<a>`). Cards não são links.
- Contraste WCAG AA:
  - `ink-primary #0B0B0D` sobre `bg-surface #F3F1EC` = 15.8:1 ✓
  - `ink-primary` sobre `bg-elevated #FFFFFF` = 18:1 ✓
  - `ink-secondary #4A4744` sobre `bg-surface` = 9.4:1 ✓
  - `accent #E4572E` sobre `bg-surface` = 3.7:1 — texto mono eyebrow `text-xs` — FALHA AA para texto < 18px. **Mitigação aceitável:** eyebrow é decorativo, não conteúdo essencial; título e descrição (conteúdo real) passam AA folgado. Se auditor pedir, usar `accent-deep #A63A1F` = 6.1:1 ✓ AA.

### 5.6 Tokens e classes

- **Nenhum `bg-[#hex]` ou `text-[#hex]` inline.** Tudo via tokens.
- **Exceção documentada:** a `rgba(228, 87, 46, 0.4)` do `inset box-shadow` no hover e o `opacity: 0.08` do ícone decorativo usam o valor RGB do `--color-accent`. Tolerável porque:
  1. Tailwind 4 não tem utility pra `inset shadow` com cor custom + alpha dinâmico
  2. O glifo decorativo tem `text-accent` + CSS filter/opacity aplicado no wrapper, não altera a cor-fonte
- Classes novas escopadas: `.bento-card`. Zero leak.

---

## 6. Dependências

Nenhuma nova.

---

## 7. Verificação end-to-end

- [ ] `npx astro build` passa sem warnings
- [ ] Grid renderiza 12-col em `md+` com layout de 4 linhas conforme tabela §3.1
- [ ] Grid vira coluna única em `< md`, ordem natural (Saúde primeiro)
- [ ] Featured Saúde tem ícone decorativo de fundo em 8% opacity, cortado pelos limites do card
- [ ] Cards alternam `bg-elevated` e `bg-surface` conforme mapa §3.1
- [ ] Eyebrow `01./02./.../08.` aparece em cada card, mono laranja
- [ ] Hover: outline 1px accent via inset shadow + translateY(-2px), transition 240ms
- [ ] Entrance: stagger 40ms, mask-reveal + y + opacity, roda uma vez ao entrar na viewport
- [ ] Reduced motion: cards visíveis imediatamente, sem entrance, sem hover translate
- [ ] Lighthouse mobile mantém thresholds (Perf ≥ 90, a11y ≥ 95)
- [ ] CLS ≤ 0.1 (grid tem `auto-rows-[minmax(180px,auto)]` + `min-h-[360px]` no featured, altura determinística)
- [ ] Grid sem buracos em nenhum breakpoint (validar visualmente em 375/768/1024/1440)

---

## 8. Impacto em artefatos existentes

### 8.1 PRD mãe
- §4.5 (UseCases): atualizar nota apontando para este documento como fonte da implementação visual.

### 8.2 Outros PRDs variantes
- `intensivo-claude-code-hero-swarm-visual.md`: sem impacto (deprecado)
- `intensivo-claude-code-hero-mission-control.md`: sem impacto (vive no Hero, seção diferente)

### 8.3 Código
- Reescreve `src/components/sections/UseCases.astro` inteiro (frontmatter de ícones preserva-se, markup é substituído)
- Adiciona ~6 linhas em `src/styles/global.css` para `.bento-card` hover transition
- Sem impacto em `config.ts`, `Hero.astro`, outros componentes

---

## 9. Fora do escopo deste PRD

- Copy nova pros setores (permanece a de `config.ts` entregue pelo PRD mãe)
- Ilustrações customizadas (usamos Lucide como glifo decorativo do featured, não arte original)
- Featured diferente por A/B test (apenas Saúde é featured na v1; rotacionar featured é escopo de Tráfego)
- Parallax do ícone decorativo no scroll (iteração futura, se valer)
- Mobile audit fino (rodar `landing-page-audit` após build)
- Performance audit detalhado (rodar `clean-code` após implementação)

---

## 10. Próximo passo

Acionar `landing-page-create-plan` com este PRD como input. O plano deve sair com:

- **1 story M** de reescrita completa do `UseCases.astro` + adição `.bento-card` CSS + script de entrance + QA visual nos 4 viewports (320/375/768/1440)
- Possível 1 story P separada para pré-processar os SVGs removendo `width`/`height` fixos, se o implementer confirmar que o ícone decorativo não escala via `style`. Pode ser absorvida na story principal.

Depois do plano: `/expand-stories` + `implementer-sonnet`.
