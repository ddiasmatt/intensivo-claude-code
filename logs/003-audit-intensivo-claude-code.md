---
log: 003
title: Audit landing intensivo-claude-code
date: 2026-04-23
squad: dev
tags: [log, audit]
---

## [21:38] Audit landing intensivo-claude-code. Status blocked

- **Projeto:** intensivo-claude-code
- **Site dir:** `site/`
- **Audit:** `docs/intensivo-claude-code-audit.md`
- **Build:** passou (`npm run build`, 1.71s)
- **Type check:** falhou (`npx tsc --noEmit`, 2 erros TS7006)
- **Tasks:** ✅ 65 · ❌ 25 · ⚠️ 11 · ⏸ 12 · ➖ 2
- **Taxa aprovação:** 64,4%
- **Gatekeeper TODOs:** 9
- **Próximo passo:** corrigir type check, drift PRD vs implementação, compliance footer, payload Sigma, anti-spam, Vercel env validation e `npm audit` high.

## [21:51] Correcoes de blockers aplicadas. Status partial

- **Build:** passou (`npm run build`, 2 paginas)
- **Type check:** passou (`npx tsc --noEmit`)
- **Corrigido:** PRD/site drift, header landmark, OG absoluto, description, JSON-LD 3 scripts, payload Sigma com event_id/timestamp/origin, UTM sessionStorage, honeypot, Promise.allSettled, footer legal/contato, apple-touch-icon, 404 customizada e remocao do chunk tsparticles.
- **Vercel env:** GA/Meta confirmados em Production/Preview/Development; webhook/redirect ausentes no dashboard, cobertos por fallback no codigo.
- **Ainda pendente:** npm audit high aceito/mitigado, peso `dist` 1.8MB, dimensoes de imagens nos marquees e validacoes manuais.
