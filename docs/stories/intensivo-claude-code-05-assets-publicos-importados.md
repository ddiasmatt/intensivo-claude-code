---
title: Story 05 — Assets publicos importados
slug: intensivo-claude-code-05
plan: docs/plans/intensivo-claude-code.md
prd: docs/prds/intensivo-claude-code.md
complexity: P
model: implementer-haiku
depends_on: [Story 01]
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code]
---

# Story 05 — Assets publicos importados

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** Story 01
- **Arquivos a criar:** `site/public/depoimentos/` (19 PNGs), `site/public/mateus.webp`, `site/public/og-image.png`, `site/public/favicon.ico`, `site/public/favicon.png`, `site/public/robots.txt`, `site/public/llms.txt`, `site/public/manifest.webmanifest`, `site/public/apple-touch-icon.png`
- **Arquivos a modificar:** `site/public/manifest.webmanifest` apos copia (ajustar `theme_color: #FBFAF7`, `background_color: #FBFAF7`), `site/public/llms.txt` apos copia (reescrever com a copy nova do PRD)
- **Patterns a seguir:** PRD secao 5.9 (tabela de assets)

**Contexto:** Copiar em bloco de `../intensivo-claude-code-astro/public/` para `site/public/`. Apos copia, 3 ajustes manuais:
1. `manifest.webmanifest` — ajustar `theme_color` e `background_color` para `#FBFAF7` (light, nao mais dark)
2. `llms.txt` — reescrever conteudo para refletir a direcao Editorial Light e a copy nova (PRD secao 4)
3. `og-image.png` — **BLOCKER PENDENTE** (PRD pendencia 7): manter do ICC Astro por enquanto; marcar para revisao no dia do merge. Se visual nao casar com tema light, recriar em design pass paralelo.

**Codigo de referencia (comandos shell):**

```bash
# rodar na raiz do projeto
SRC="../intensivo-claude-code-astro/public"
DST="site/public"
mkdir -p "$DST/depoimentos"
cp "$SRC"/depoimentos/depoimento-*.png "$DST/depoimentos/"
cp "$SRC"/mateus.webp "$SRC"/og-image.png "$SRC"/favicon.ico "$SRC"/favicon.png "$DST/"
cp "$SRC"/robots.txt "$SRC"/llms.txt "$SRC"/manifest.webmanifest "$DST/"
# apple-touch-icon: se nao existir na origem, gerar a partir do favicon.png (180x180)
```

```json
// site/public/manifest.webmanifest (apos ajuste)
{
  "name": "Intensivo Claude Code",
  "short_name": "ICC",
  "icons": [
    { "src": "/favicon.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
  ],
  "theme_color": "#FBFAF7",
  "background_color": "#FBFAF7",
  "display": "standalone",
  "start_url": "/"
}
```

**Criterios de aceite:**
1. [x] QUANDO listar `site/public/depoimentos/`, ENTAO 19 arquivos PNG existem (`depoimento-01.png` a `depoimento-19.png`)
2. [x] QUANDO abrir `site/public/manifest.webmanifest`, ENTAO `theme_color` e `background_color` = `#FBFAF7`
3. [x] QUANDO abrir `site/public/llms.txt`, ENTAO contem a copy nova do Intensivo (Event, 16/05, R$27 grupo), NAO a anterior do ICC Astro
4. [x] QUANDO rodar `npx astro build`, ENTAO `dist/robots.txt`, `dist/llms.txt`, `dist/manifest.webmanifest` estao presentes

**Comando de validacao:**
```bash
cd site && npx astro build && ls dist/depoimentos/ | wc -l
# esperado: 19
```
