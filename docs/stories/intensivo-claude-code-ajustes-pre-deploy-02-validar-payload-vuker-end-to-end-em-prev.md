---
title: Story 02 — Validar payload VUKer end-to-end em preview deploy
slug: intensivo-claude-code-ajustes-pre-deploy-02
plan: docs/plans/intensivo-claude-code-ajustes-pre-deploy.md
prd: docs/prds/intensivo-claude-code-ajustes-pre-deploy.md
complexity: P
model: implementer-haiku
depends_on: [Story 01]
status: pending
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-ajustes-pre-deploy]
---

# Story 02 — Validar payload VUKer end-to-end em preview deploy

- **Complexidade:** P (validacao manual dirigida, sem codigo)
- **Modelo sugerido:** implementer-haiku (guia manual) OU execucao humana direta
- **Depende de:** Story 01 + branch feature com Onda 1 completa + Vercel preview deploy disponivel
- **Arquivos a criar:** `docs/tests/vuker-webhook-smoke-2026-04-22.md` (laudo do teste)
- **Arquivos a modificar:** nenhum
- **Patterns a seguir:** `~/.claude/skills/landing-page-prd/references/analytics-pattern.md` secao 7 (Manual pre-deploy test)

**Contexto:** o PRD afirma que o payload atual do `CaptureModal.tsx:132-138` ja e compativel com o contrato VUKer. Esta story e a **validacao end-to-end** que confirma essa premissa antes do merge em main. Sem ela, descobrimos o bug so em producao.

**Acao:**
1. Aguardar Vercel preview deploy da branch com Onda 1 mergeada (URL tipo `https://intensivo-claude-code-landing-git-<branch>.vercel.app`)
2. Abrir Meta Events Manager → Events → Test Events tab, copiar test code
3. Abrir GA4 → Reports → Realtime em outra aba
4. Abrir o preview URL com UTMs na query string: `?utm_source=smoke-test&utm_medium=manual&utm_campaign=pre-deploy-validation&utm_term=test&utm_content=submit-br`
5. Clicar CTA → preencher form com:
   - Nome: `Smoke Test Brasil`
   - Email: `smoke+br@vuker.com.br`
   - Phone: numero BR valido (`+55 11 99999-9999` apos Story 03 implementada)
6. Submeter. Observar em paralelo:
   - **Meta Events Manager Test Events:** `Lead` aparece com `eventID` no formato `lead_<timestamp>_<rand>`
   - **GA4 Realtime:** evento `generate_lead` com `event_id` **identico** ao `eventID` do Pixel
   - **Webhook VUKer:** pedir a equipe VUKer (ou validar via logs `api-sigma.vuker.com.br` se acesso disponivel) que o payload chegou
   - **Redirect:** browser navega para `https://sndflw.com/i/...?utm_source=smoke-test&utm_medium=manual&...` (5 UTMs na query string)
7. Repetir com numero internacional (`+1 555 123 4567`, Nome `Smoke Test International`, email `smoke+us@vuker.com.br`) — validar que phone chega em E.164 no payload (`+15551234567`)
8. Documentar resultado em `docs/tests/vuker-webhook-smoke-2026-04-22.md` (template abaixo)

**Codigo de referencia:** laudo do teste

```markdown
---
title: Smoke Test — Webhook VUKer + Pixel + GA4
created: 2026-04-22
test_type: end-to-end pre-deploy
preview_url: <preencher>
---

## Submit BR
- Phone no form: +55 11 99999-9999
- Phone no payload (E.164): <preencher, ex: +5511999999999>
- eventID gerado: <preencher, ex: lead_1745245200000_ab12cd34>
- Meta Events Manager: <PASS/FAIL>
- GA4 Realtime event_id match: <PASS/FAIL>
- Webhook VUKer recebeu: <PASS/FAIL> (<timestamp VUKer>)
- Redirect URL com UTMs: <URL completa>

## Submit US
- Phone no form: +1 555 123 4567
- Phone no payload (E.164): <preencher, ex: +15551234567>
- eventID gerado: <preencher>
- Meta Events Manager: <PASS/FAIL>
- GA4 Realtime event_id match: <PASS/FAIL>
- Webhook VUKer recebeu: <PASS/FAIL>

## Veredito
<LIBERA MERGE | BLOQUEIA MERGE (lista de problemas)>
```

**Criterios de aceite:**
1. QUANDO submeter form com numero BR, ENTAO Meta Pixel registra `Lead` com `eventID` e GA4 registra `generate_lead` com `event_id` identico
2. QUANDO submeter form com numero internacional, ENTAO `phone` chega no payload VUKer em formato E.164 (`+<codigo-pais><digitos>`)
3. QUANDO submit completa, ENTAO webhook VUKer recebe POST com payload contendo todos os 5 campos UTM top-level quando aplicavel
4. QUANDO submit completa, ENTAO browser navega para redirect Sendflow com 5 UTMs propagados na query string
5. QUANDO laudo e escrito em `docs/tests/`, ENTAO veredito final e **LIBERA MERGE** — caso contrario, Onda 1 precisa de hotfix antes do merge

**Comando de validacao:**
```bash
# Verificar que o laudo foi criado e tem veredito
test -f "docs/tests/vuker-webhook-smoke-2026-04-22.md" \
  && grep -q "LIBERA MERGE" "docs/tests/vuker-webhook-smoke-2026-04-22.md" \
  && echo "PASS" || echo "FAIL"
```
