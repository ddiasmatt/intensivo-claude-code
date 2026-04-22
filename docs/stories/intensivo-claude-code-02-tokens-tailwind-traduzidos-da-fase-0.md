---
title: Story 02 — Tokens Tailwind traduzidos da Fase 0
slug: intensivo-claude-code-02
plan: docs/plans/intensivo-claude-code.md
prd: docs/prds/intensivo-claude-code.md
complexity: P
model: implementer-haiku
depends_on: [Story 01]
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code]
---

# Story 02 — Tokens Tailwind traduzidos da Fase 0

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** Story 01
- **Arquivos a criar:** `site/tailwind.config.mjs`, `site/src/styles/global.css`
- **Arquivos a modificar:** `site/src/pages/index.astro` (importa `global.css`)
- **Patterns a seguir:** `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` secao 3 (Design Tokens)

**Contexto:** Traduzir a tabela da Fase 0 (PRD secao 3.3) e fontes (PRD secao 3.4) para o `tailwind.config.mjs`. Incluir keyframes `mask-reveal`, `live-pulse`, `marquee-left`, `marquee-right`. Global CSS carrega fontes do Google, reset e `prefers-reduced-motion`.

**Codigo de referencia:**

```js
// site/tailwind.config.mjs (copia literal do PRD secao 5.7)
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'serif'],
        sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        page: '#FBFAF7',
        surface: '#F3F1EC',
        elevated: '#FFFFFF',
        rule: '#D9D4CB',
        accent: {
          DEFAULT: '#E4572E',
          hover: '#C84521',
          deep: '#A63A1F',
        },
        ink: {
          primary: '#0B0B0D',
          secondary: '#4A4744',
          muted: '#8A8580',
        },
      },
      keyframes: {
        'mask-reveal': {
          '0%':   { 'clip-path': 'inset(0 100% 0 0)' },
          '100%': { 'clip-path': 'inset(0 0 0 0)' },
        },
        'live-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.4' },
        },
        'marquee-left':  { '0%': { transform: 'translateX(0)' },       '100%': { transform: 'translateX(-50%)' } },
        'marquee-right': { '0%': { transform: 'translateX(-50%)' },    '100%': { transform: 'translateX(0)' }    },
      },
      animation: {
        'mask-reveal':   'mask-reveal 0.8s cubic-bezier(0.77, 0, 0.175, 1) both',
        'live-pulse':    'live-pulse 1.6s ease-in-out infinite',
        'marquee-left':  'marquee-left 55s linear infinite',
        'marquee-right': 'marquee-right 55s linear infinite',
      },
    },
  },
  plugins: [],
};
```

```css
/* site/src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { font-family: theme('fontFamily.sans'); color: theme('colors.ink.primary'); background: theme('colors.page'); }
  body { min-height: 100vh; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Criterios de aceite:**
1. QUANDO aplicar `class="bg-page text-ink-primary"`, ENTAO DOM renderiza com as cores exatas da Fase 0
2. QUANDO aplicar `class="font-display"`, ENTAO fonte Fraunces carrega do Google Fonts (via `<link>` no Base, Story 04)
3. QUANDO rodar `npx astro build`, ENTAO zero warnings e classes custom aparecem no CSS final
4. QUANDO existir `bg-[#hex]` ou `text-[#hex]` inline em qualquer arquivo, ENTAO review reprova

**Comando de validacao:**
```bash
cd site && npx astro build && grep -q "page" dist/_astro/*.css && echo OK
```
