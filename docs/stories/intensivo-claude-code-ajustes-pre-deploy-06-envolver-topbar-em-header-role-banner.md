---
title: Story 06 — Envolver TopBar em `<header role="banner">`
slug: intensivo-claude-code-ajustes-pre-deploy-06
plan: docs/plans/intensivo-claude-code-ajustes-pre-deploy.md
prd: docs/prds/intensivo-claude-code-ajustes-pre-deploy.md
complexity: P
model: implementer-haiku
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-ajustes-pre-deploy]
---

# Story 06 — Envolver TopBar em `<header role="banner">`

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** nenhuma
- **Arquivos a criar:** nenhum
- **Arquivos a modificar:** `site/src/pages/index.astro` (ou componente TopBar dedicado, se existir em `src/components/`)
- **Patterns a seguir:** `site/src/layouts/LabLayout.astro` (ja usa `<header class="sticky ...">` — replicar padrao)

**Contexto:** audit flagged ausencia de `<header>` landmark na landing principal. TopBar atualmente renderizada como `<div class="sticky top-0 z-40">`. Finding critico nao-gatekeeper. Simples mas obrigatorio pre-merge.

**Acao:**
1. Localizar o bloco da TopBar. Pelo `dist/index.html` esta inline em `src/pages/index.astro` (aproximadamente):
   ```astro
   <div class="sticky top-0 z-40">
     <a href="#final-cta" class="block bg-ink-primary text-page font-mono text-[11px] ...">
       <span class="inline-block w-1.5 h-1.5 rounded-full bg-accent ..." aria-hidden="true"></span>
       {CONFIG.TOPBAR_TEXT}
     </a>
   </div>
   ```
2. Se o bloco estiver em um componente (`src/components/TopBar.astro` ou similar), modificar o componente. Caso contrario, modificar `src/pages/index.astro`.
3. Substituir o wrapper `<div>` por `<header>`. `<header>` direto descendente de `<body>` tem role implicito `banner` — nao precisa declarar `role="banner"` explicito. **Mas** como a TopBar esta dentro de `<main>` ou outro wrapper, declarar `role="banner"` explicito e mais seguro.

**Codigo de referencia (depois):**
```astro
<header class="sticky top-0 z-40" role="banner">
  <a
    href="#final-cta"
    class="block bg-ink-primary text-page font-mono text-[11px] tracking-widest py-2.5 text-center hover:bg-ink-primary/90 transition-colors"
  >
    <span
      class="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-2 align-middle animate-live-pulse"
      aria-hidden="true"
    ></span>
    {CONFIG.TOPBAR_TEXT}
  </a>
</header>
```

**Criterios de aceite:**
1. QUANDO `npx astro build` rodar, ENTAO `dist/index.html` contem pelo menos 1 `<header` tag
2. QUANDO abrir em leitor de tela ou inspecionar acessibilidade no DevTools (tab Accessibility > Landmarks), ENTAO "banner" landmark aparece na lista e corresponde a TopBar
3. QUANDO visualizar a landing em viewport qualquer, ENTAO layout e styling da TopBar permanecem identicos (apenas tag semantica muda)
4. QUANDO `grep -c "<header" dist/index.html`, ENTAO retorna >= 1

**Comando de validacao:**
```bash
cd site && npx astro build 2>&1 >/dev/null && \
  count=$(grep -c "<header" dist/index.html) && \
  [ "$count" -ge 1 ] && echo "PASS: $count <header> landmark(s)"
```
