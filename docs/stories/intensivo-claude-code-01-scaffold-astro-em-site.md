---
title: Story 01 — Scaffold Astro em site/
slug: intensivo-claude-code-01
plan: docs/plans/intensivo-claude-code.md
prd: docs/prds/intensivo-claude-code.md
complexity: P
model: implementer-haiku
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code]
---

# Story 01 — Scaffold Astro em site/

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** nada
- **Arquivos a criar:** `site/package.json`, `site/astro.config.mjs`, `site/tsconfig.json`, `site/.gitignore`, `site/src/pages/index.astro` (stub)
- **Arquivos a modificar:** nenhum
- **Patterns a seguir:** `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` secao 1 (Stack Obrigatorio)

**Contexto:** Pasta `site/` existe vazia. Scaffolding Astro minimal com React e Tailwind integrados. NAO usar template oficial interativo (`npm create astro@latest`); criar arquivos direto para ter controle sobre deps fixadas.

**Codigo de referencia:**

> [!warning] Tailwind v4 em Astro
> NAO instalar `@astrojs/tailwind`. Essa integration e v3-only (peer dep `tailwindcss@^3.0.24`) e nao foi portada pro v4. O caminho oficial do Tailwind v4 em Astro e o plugin Vite `@tailwindcss/vite`.

```json
// site/package.json
{
  "name": "intensivo-claude-code-landing",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "@astrojs/react": "^3",
    "@tailwindcss/vite": "^4",
    "astro": "^4",
    "motion": "^12",
    "gsap": "^3",
    "react": "^18",
    "react-dom": "^18",
    "tailwindcss": "^4",
    "tailwind-merge": "^2",
    "clsx": "^2",
    "lucide-react": "^0.4"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
```

```js
// site/astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  output: 'static',
});
```

```astro
---
// site/src/pages/index.astro (stub apenas)
---
<html lang="pt-BR"><body><h1>ICC Landing (scaffold)</h1></body></html>
```

**Criterios de aceite:**
1. [x] QUANDO rodar `npm install` em `site/`, ENTAO instala sem erro e gera `node_modules/`
2. [x] QUANDO rodar `npx astro build`, ENTAO gera `dist/` com `index.html` do stub sem warnings
3. [x] QUANDO rodar `npx astro check`, ENTAO zero erros de TypeScript

**Comando de validacao:**
```bash
cd site && npm install && npx astro build && npx astro check
```
