---
log: 002
title: Audit landing site-v2 (icc-v2.thesociety.com.br)
date: 2026-04-23
squad: dev
tags: [log, audit]
---

## [20:50] Audit landing site-v2. Status blocked

- **Projeto:** intensivo-claude-code / site-v2
- **Audit:** docs/intensivo-claude-code-v2-audit.md
- **Build:** passou (`npx astro build` ~2.8s, 1 advisory Node 24 ambiental)
- **Type check:** passou (`npx astro check`, 0 erros, 0 warnings, 2 hints `is:inline` benignos)
- **Tasks: PASS 59 · FAIL 2 · WARN 8 · MANUAL 16 · N/A 2 (total 87)**
- **Taxa aprovacao:** 85.5%
- **Gatekeeper TODOs:** 2 (+ 1 WARN secundario)
- **Proximo passo:** resolver gatekeepers e liberar merge

### Gatekeepers (bloqueiam merge)

1. JSON-LD Event.location.url = `https://zoom.us/j/TODO` em `src/layouts/Base.astro` — quebra Rich Results
2. Footer links Privacidade + Termos com `href="#"` + comentario `<!-- TODO: URL legal pendente -->` em `src/components/Footer.astro`

### WARN nao bloqueante

- `site-v2/public/robots.txt` linha `Sitemap: https://intensivo.grupovuk.com.br/sitemap.xml` — dominio errado + arquivo inexistente. Remover linha (landing tem 1 pagina, sitemap dispensavel)
- `npm audit`: 5 vulns (4 moderate, 1 high em @astrojs/cloudflare — adapter nao usado, transitive)
- 7.3 webhook usa `forEach + .catch` em vez de `Promise.allSettled` literal (equivalente funcional)
- 7.4 payload Sigma sem campo `origem` explicito (event_id ja tem Date.now())
- 8.1 `fetchpriority` ausente — N/A porque hero e SVG, nao img
- 12.1 em-dash em comentarios JS/JSX (15 ocorrencias, 0 no HTML final)

### Validacao manual pendente (em preview deploy)

- Lighthouse mobile
- Viewport tests 320/390/768/1024
- Modal UX (trap/Esc/backdrop/aria-live)
- Submit end-to-end (GA4 DebugView + Events Manager + Sigma CRM)
- Schema validator + Rich Results (apos gatekeeper 1)
- FB Debugger + Twitter validator
- Security headers (pos-deploy)
- Hierarquia headings em ordem doc
- Touch targets >= 44x44px
- Dark patterns
