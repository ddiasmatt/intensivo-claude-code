---
title: Story 02 — Tokens Tailwind v4 traduzidos da Fase 0
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

# Story 02 — Tokens Tailwind v4 traduzidos da Fase 0

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** Story 01
- **Arquivos a criar:** `site/src/styles/global.css`
- **Arquivos a modificar:** `site/src/pages/index.astro` (importa `global.css` via Base layout na Story 04)
- **Patterns a seguir:** `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` secao 3 (Design Tokens)

**Contexto:** Traduzir a tabela da Fase 0 (PRD secao 3.3) e fontes (PRD secao 3.4) para `@theme` em `global.css`. Incluir keyframes `mask-reveal`, `live-pulse`, `marquee-left`, `marquee-right`. No Tailwind v4 nao existe `tailwind.config.mjs`: toda configuracao vive no CSS via `@theme`, e os tokens viram classes automaticamente (`--color-page` → `bg-page`, `--font-display` → `font-display`, `--animate-live-pulse` → `animate-live-pulse`).

> [!warning] Se achou um `tailwind.config.mjs`, deletar
> Nenhum arquivo de config JS do Tailwind deve existir no projeto. Se aparecer, remover no code review. A unica fonte de verdade dos tokens e o bloco `@theme` em `global.css`.

**Codigo de referencia:**

```css
/* site/src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-page: #FBFAF7;
  --color-surface: #F3F1EC;
  --color-elevated: #FFFFFF;
  --color-rule: #D9D4CB;

  --color-accent: #E4572E;
  --color-accent-hover: #C84521;
  --color-accent-deep: #A63A1F;

  --color-ink-primary: #0B0B0D;
  --color-ink-secondary: #4A4744;
  --color-ink-muted: #8A8580;

  --font-display: "Fraunces", ui-serif, serif;
  --font-sans: "Inter Tight", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  --animate-mask-reveal: mask-reveal 0.8s cubic-bezier(0.77, 0, 0.175, 1) both;
  --animate-live-pulse: live-pulse 1.6s ease-in-out infinite;
  --animate-marquee-left: marquee-left 55s linear infinite;
  --animate-marquee-right: marquee-right 55s linear infinite;

  @keyframes mask-reveal {
    0%   { clip-path: inset(0 100% 0 0); }
    100% { clip-path: inset(0 0 0 0); }
  }
  @keyframes live-pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.4; }
  }
  @keyframes marquee-left {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes marquee-right {
    0%   { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
}

@layer base {
  html {
    font-family: var(--font-sans);
    color: var(--color-ink-primary);
    background: var(--color-page);
  }
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

**Armadilhas do v4:**
- `@tailwind base;`/`components;`/`utilities;` **virou** um unico `@import "tailwindcss";`.
- `theme('colors.ink.primary')` dentro de CSS **virou** `var(--color-ink-primary)`.
- `content: ['./src/**/*.{...}']` **nao existe mais**: o plugin Vite detecta templates automaticamente.
- `keyframes` vivem **dentro** do bloco `@theme` (ou em CSS global, casados com um `--animate-<nome>`).
- Cor nested (`accent.DEFAULT` + `accent.hover`) virou `--color-accent` (default) + `--color-accent-hover`.

**Criterios de aceite:**
1. QUANDO aplicar `class="bg-page text-ink-primary"`, ENTAO DOM renderiza com as cores exatas da Fase 0
2. QUANDO aplicar `class="font-display"`, ENTAO fonte Fraunces carrega do Google Fonts (via `<link>` no Base, Story 04)
3. QUANDO rodar `npx astro build`, ENTAO zero warnings e classes custom aparecem no CSS final
4. QUANDO existir `bg-[#hex]` ou `text-[#hex]` inline em qualquer arquivo, ENTAO review reprova
5. QUANDO existir `tailwind.config.mjs` ou `tailwind.config.js` no repo, ENTAO review reprova

**Comando de validacao:**
```bash
cd site && npx astro build && grep -qE "bg-page|text-ink-primary" dist/_astro/*.css && echo OK
```
