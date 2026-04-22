---
title: Story 02 — Audit visual pós-refactor Timeline
slug: landing-timeline-v1-vertical-02
plan: docs/plans/landing-timeline-v1-vertical.md
prd: docs/prds/landing-timeline-v1-vertical.md
complexity: P
model: implementer-haiku
depends_on: [landing-timeline-v1-vertical-01]
status: done
note: validacao manual pendente antes do merge (Chrome DevTools + Lighthouse). Runbook em docs/logs/squad-dev/2026-04-22.md entrada das 19:58.
created: 2026-04-22
tags: [story, landing, landing-timeline-v1-vertical, audit]
---

# Story 02 — Audit visual pós-refactor Timeline

- **Complexidade:** P (manual, checklist curto, sem código)
- **Modelo sugerido:** `implementer-haiku`
- **Depende de:** Story 01
- **Arquivos a criar:** `docs/audits/landing-timeline-v1-vertical.md` (relatório do audit)
- **Arquivos a modificar:** nenhum
- **Patterns a seguir:**
  - `~/.claude/skills/landing-page-audit/` (se disponível) — critérios de auditoria
  - Screenshots em 3 larguras, DevTools reduced-motion, DevTools no-JS

**Contexto:** validar que o refactor não regressou nada nas seções vizinhas (acima: Benefits ou o que estiver no `index.astro`; abaixo: Autoridade/FAQ) e que a nova Timeline cumpre todos os critérios de aceite da Story 01 em produção (preview Vercel). Produz relatório `.md` com screenshots referenciados.

**Passos:**

1. **Build local:** `cd site-v2 && npm run build && npm run preview` (ou `npx astro preview`).
2. **Screenshots em 3 larguras** (DevTools responsive): 360px, 768px, 1280px. Salvar em `docs/audits/screenshots/timeline-v1/` com nomes `timeline-360.png`, `timeline-768.png`, `timeline-1280.png`.
3. **Reduced motion:** DevTools > Rendering > Emulate CSS > `prefers-reduced-motion: reduce`. Scroll pela seção. Validar que blocos aparecem em fade simples (sem translate). Screenshot `timeline-reduced-motion.png`.
4. **No-JS:** DevTools > Settings > Debugger > Disable JavaScript. Reload. Validar que a seção está 100% visível (sem `opacity: 0`). Screenshot `timeline-no-js.png`.
5. **Contraste:** axe DevTools ou Lighthouse a11y report na home de `/lpv2/`. Capturar score e copiar issues que mencionem Timeline (se houver).
6. **Lighthouse mobile** (Throttling: Slow 4G, Device: Mobile) na preview build. Capturar Performance/A11y/Best Practices/SEO. Comparar com valores anteriores (registrados em `docs/logs/squad-dev/2026-04-22.md` ou no último audit).
7. **Diff visual das seções vizinhas:** screenshots antes (na main) e depois (na feat) de Benefits (acima) e Autoridade/FAQ (abaixo). Confirmar zero regressão.
8. **Preencher relatório** em `docs/audits/landing-timeline-v1-vertical.md` com a estrutura abaixo.

**Template do relatório (`docs/audits/landing-timeline-v1-vertical.md`):**

```markdown
---
title: Audit — Timeline v1 vertical
date: YYYY-MM-DD
plan: docs/plans/landing-timeline-v1-vertical.md
prd: docs/prds/landing-timeline-v1-vertical.md
status: [clear | issues-found]
---

# Audit: Timeline v1 vertical

## Resumo
[2-3 frases: passou? regressões? lighthouse delta?]

## Evidências
- 360px: ![](screenshots/timeline-v1/timeline-360.png)
- 768px: ![](screenshots/timeline-v1/timeline-768.png)
- 1280px: ![](screenshots/timeline-v1/timeline-1280.png)
- Reduced motion: ![](screenshots/timeline-v1/timeline-reduced-motion.png)
- No JS: ![](screenshots/timeline-v1/timeline-no-js.png)

## Lighthouse mobile (delta)
| Métrica | Antes | Depois | Delta |
|---|---|---|---|
| Performance | | | |
| Accessibility | | | |
| Best Practices | | | |
| SEO | | | |

## A11y (axe/Lighthouse)
- [ ] Contraste AA em título
- [ ] Contraste AA em descrição
- [ ] Landmark `<section>` com `aria-labelledby`
- [ ] Node decorativo com `aria-hidden="true"`

## Regressões nas seções vizinhas
- Benefits (acima): [OK | regredi — descrever]
- Autoridade/FAQ (abaixo): [OK | regredi — descrever]

## Bloqueadores
[lista ou "nenhum"]

## Decisão
[aprovar merge | pedir ajustes]
```

**Critérios de aceite:**

1. QUANDO o relatório é preenchido, ENTÃO todos os 5 screenshots existem no caminho `docs/audits/screenshots/timeline-v1/`.
2. QUANDO o Lighthouse mobile é capturado, ENTÃO Performance >= 90 e A11y >= 90 (match com patamar atual).
3. QUANDO o axe roda na seção, ENTÃO não há issue crítica nem séria ligada à Timeline.
4. QUANDO as seções vizinhas são comparadas, ENTÃO o diff visual é nulo (só a Timeline mudou).
5. QUANDO o relatório finaliza, ENTÃO `status: clear` e decisão = `aprovar merge`. Se não, listar bloqueadores.

**Comando de validação:**

```bash
cd "/Users/mateusdias/Documents/00 - Projetos/intensivo-claude-code/site-v2" && npm run build && npx astro preview --port 4321
# Abrir http://localhost:4321/lpv2/ e seguir passos 2-8 acima.
```
