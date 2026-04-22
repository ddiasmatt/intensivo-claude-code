---
title: Story 12 — Audit mobile + verificacao pre-deploy
slug: intensivo-claude-code-12
plan: docs/plans/intensivo-claude-code.md
prd: docs/prds/intensivo-claude-code.md
complexity: P
model: implementer-haiku
depends_on: [Story 11]
status: pending
created: 2026-04-22
tags: [story, landing, intensivo-claude-code]
---

# Story 12 — Audit mobile + verificacao pre-deploy

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** Story 11
- **Arquivos a criar:** `site/docs/quality-checklist.md` (baseado em `intensivo-claude-code-astro/docs/quality-checklist.md`), `docs/mobile-audit.md`
- **Arquivos a modificar:** ajustes pontuais em secoes conforme achados do audit
- **Patterns a seguir:** skill `landing-page-audit` (executar), PRD secao 7 e 8

**Contexto:** Ultimo gate antes do merge em main. Roda o audit de mobile nos 4 breakpoints (320/390/768/1024) e preenche o checklist de 13 itens SEO. Resolver ou aceitar explicitamente cada item marcado `⚠️ TODO` do PRD secao 10 antes de abrir PR.

**Atividades:**

1. Rodar `landing-page-audit` (skill dedicada) — gera `docs/mobile-audit.md`
2. Revisar 13 itens SEO via `curl` no `dist/index.html`:
   ```bash
   cd site && npx astro build
   grep -E "<title>|name=\"description\"|name=\"keywords\"|rel=\"canonical\"|theme-color|application/ld\\+json|apple-touch-icon|manifest" dist/index.html
   ```
3. Rodar Lighthouse manual em producao local (`npm run preview`) — thresholds: Performance >= 90, A11y >= 95, Best Practices >= 95, SEO >= 95
4. Validar JSON-LD em https://search.google.com/test/rich-results (apos deploy)
5. Fechar ou aceitar os 7 TODOs do PRD secao 10:
   - Dominio final → canonical e JSON-LD
   - Meta Pixel ID → `.env`
   - Webhook URL → `.env`
   - URL do Zoom → JSON-LD `Event.location`
   - Politica privacidade + Termos → Footer
   - Email contato → Footer
   - OG image → revisar se bate com tema light; se nao, recriar

**Criterios de aceite:**
1. QUANDO audit rodar, ENTAO `docs/mobile-audit.md` existe e nao lista falha critica em 320px, 390px, 768px, 1024px
2. QUANDO `dist/index.html` for buscado por `grep`, ENTAO os 13 itens SEO estao presentes
3. QUANDO rodar Lighthouse mobile no `npm run preview`, ENTAO 4 scores >= 90/95/95/95
4. QUANDO `quality-checklist.md` for aberto, ENTAO todos os items estao `[x]` ou justificados com `⚠️ BLOCKER <razao>`

**Comando de validacao:**
```bash
cd site && npx astro build && npm run preview
# paralelo: rodar Lighthouse CI ou DevTools em http://localhost:4321
```
