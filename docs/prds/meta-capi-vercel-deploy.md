---
title: Meta Pixel + CAPI — deploy na Vercel (tasks faltantes)
created: 2026-04-23
tags: [prd, meta-ads, capi, vercel, deploy, intensivo-claude-code]
status: aguardando-execucao
project: intensivo-claude-code
owner: Artur (Head de Gestão)
next_agent: Claude com Vercel MCP conectado
---

# PRD: Meta Pixel + CAPI — deploy na Vercel

> [!important] Contexto para a proxima sessao do Claude
> Este PRD foi escrito em 2026-04-23 depois que implementei o codigo do Meta Conversions API localmente em `site-v2/`. O codigo esta pronto, validado com Test Events Tool (2 eventos recebidos status "Processado" via Servidor com code `TEST79132`). Faltam **4 tasks manuais** que o Mateus vai executar comigo na proxima sessao quando o Vercel MCP estiver conectado. Esse PRD documenta exatamente o que falta para evitar perda de contexto no restart.

## Objetivo

Subir as 3 variaveis Meta CAPI para a Vercel em Production + Preview, mergear o branch `feat/modal-center-favicon-ai-society` (ja contem as mudancas) na `main`, validar que eventos CAPI estao chegando no Events Manager em modo producao, e rotacionar o access token exposto no chat.

## Estado atual (2026-04-23 13:55)

### O que esta pronto

- Codigo do Meta CAPI implementado e validado localmente:
  - `site-v2/astro.config.mjs` → `output: 'hybrid'` + `adapter: @astrojs/vercel/serverless`
  - `site-v2/package.json` → `@astrojs/vercel@^7.8.2` + `engines.node: "20.x"`
  - `site-v2/src/lib/hash.ts` → SHA-256 + normalizacao (spec Meta)
  - `site-v2/src/lib/fb-cookies.ts` → leitura de `_fbp`/`_fbc` client-side
  - `site-v2/src/lib/capi.ts` → builder de payload + POST `graph.facebook.com/v21.0/{pixelId}/events`
  - `site-v2/src/pages/api/capi.ts` → endpoint Astro serverless
  - `site-v2/src/components/react/CaptureModal.tsx` → Advanced Matching via `fbq('init', ID, {AM})` + `fetch('/api/capi')` paralelo
  - `site-v2/.env` (gitignored) → com 3 vars preenchidas para dev local
  - `site-v2/.env.example` → template documentado

- Validacao local feita:
  - `npm run build` passou, gerou `.vercel/output/functions/capi.func/`
  - Curl com payload valido retornou 204
  - Curl com JSON invalido retornou 400
  - Curl com payload incompleto retornou 400
  - Events Manager > Test Events > `TEST79132` recebeu 2 Leads via metodo "Servidor", status "Processado", IDs `lead_test_*` batendo com o `event_id` enviado

- Skills atualizadas (global `~/.claude/skills/`):
  - `landing-page-prd/references/meta-capi-pattern.md` (novo)
  - `landing-page-create-plan/references/meta-capi-implementation.md` (novo)
  - `landing-page-audit/references/meta-capi-audit.md` (novo)
  - `env-secrets/references/env-var-map.md` (atualizado com 4 vars Meta CAPI)

- Documentacao de pesquisa em `docs/research/meta-capi-research.md` (12KB, 14 secoes)

### O que NAO esta feito

1. **Vars da Vercel nao estao setadas** em Production nem Preview.
2. **Branch nao foi commitada nem mergeada**. Estado atual: uncommitted changes em `site-v2/`.
3. **Token exposto no chat**. Precisa ser rotacionado apos confirmacao que o atual funciona em producao.
4. **Validacao em producao nao foi feita**. So validei local com Test Events Tool.

## Valores a configurar

> [!danger] Token exposto em chat
> O valor de `META_CAPI_ACCESS_TOKEN` apareceu no historico do chat do dia 2026-04-23. **Apos validar em producao, gerar um novo token** em Events Manager > Settings > Conversions API > Generate access token, revogar o anterior, atualizar a var no Vercel.

Os valores ja estao preenchidos em `site-v2/.env` (gitignored). Copiar de la ou usar abaixo:

| Variavel | Valor | Targets Vercel |
|---|---|---|
| `META_PIXEL_ID` | `310399388108164` | Production + Preview + Development |
| `META_CAPI_ACCESS_TOKEN` | (ver `site-v2/.env`, nao replicar aqui) | Production + Preview + Development |
| `META_CAPI_TEST_EVENT_CODE` | **vazio em Production**. `TEST79132` em Preview se for validar. | Preview apenas (opcional) |

**Regras de exposicao:**
- As 3 vars **NAO tem prefixo `PUBLIC_`**. Isso e proposital. `PUBLIC_*` expoe no bundle do client. Essas 3 sao lidas so pelo endpoint serverless em `src/pages/api/capi.ts`.
- `PUBLIC_META_PIXEL_ID` (ja existente, do Pixel client-side) continua com prefixo `PUBLIC_`. Mesmo valor do `META_PIXEL_ID`, duplicado intencionalmente.

## Tasks faltantes

> [!note] Ordem recomendada
> Tasks T1 e T2 sao independentes (podem rodar em paralelo). T3 depende de T1 e T2. T4 e T5 dependem de T3.

### T1. Setar vars no Vercel (via MCP)

**Quando:** primeira coisa apos restart, com Vercel MCP conectado.

**Como (com MCP):**

1. Identificar o projeto Vercel correto. O `site-v2/` tem seu proprio projeto Vercel (multiversion setup — rewrite `/lpv2/:path*` aponta pra ele). Verificar com:
   ```bash
   cat "/Users/mateusdias/Documents/00 - Projetos/intensivo-claude-code/site-v2/.vercel/project.json"
   ```
   Isso retorna `{"projectId": "prj_...", "orgId": "team_..."}`. Usar esse `projectId` nas chamadas MCP.

2. Via Vercel MCP, adicionar as 3 vars no projeto do `site-v2`:
   ```
   META_PIXEL_ID = 310399388108164
   targets: [production, preview, development]
   type: plain

   META_CAPI_ACCESS_TOKEN = <ler de site-v2/.env>
   targets: [production, preview, development]
   type: sensitive (se o MCP suportar) ou plain

   META_CAPI_TEST_EVENT_CODE = TEST79132
   targets: [preview]  # APENAS preview, NUNCA production
   type: plain
   ```

3. Confirmar que estao la listando as vars do projeto.

**Como (fallback sem MCP, via Vercel CLI):**

```bash
cd "/Users/mateusdias/Documents/00 - Projetos/intensivo-claude-code/site-v2"

# Preview + Development + Production
vercel env add META_PIXEL_ID production
# (prompt pede o valor): 310399388108164
vercel env add META_PIXEL_ID preview
vercel env add META_PIXEL_ID development

vercel env add META_CAPI_ACCESS_TOKEN production
# (prompt pede o valor): copiar de site-v2/.env
vercel env add META_CAPI_ACCESS_TOKEN preview
vercel env add META_CAPI_ACCESS_TOKEN development

# Test code so em Preview
vercel env add META_CAPI_TEST_EVENT_CODE preview
# (prompt pede o valor): TEST79132

# Confirmar
vercel env ls
```

**Validacao:**

- `vercel env ls` mostra as 3 vars nos targets certos.
- `META_CAPI_TEST_EVENT_CODE` NAO aparece em Production (so Preview).
- Nenhuma var CAPI tem prefixo `PUBLIC_`.

### T2. Commit + branch + push

**Quando:** em paralelo com T1, ou apos.

**Como:**

```bash
cd "/Users/mateusdias/Documents/00 - Projetos/intensivo-claude-code"

# Ver o que mudou
git status
# Esperado:
# M  site-v2/.env.example
# M  site-v2/astro.config.mjs
# M  site-v2/package-lock.json
# M  site-v2/package.json
# M  site-v2/src/components/react/CaptureModal.tsx
# ?? site-v2/src/lib/capi.ts
# ?? site-v2/src/lib/fb-cookies.ts
# ?? site-v2/src/lib/hash.ts
# ?? site-v2/src/pages/api/
# ?? docs/prds/meta-capi-vercel-deploy.md
# ?? docs/research/meta-capi-research.md

# Verificar que .env NAO esta na lista (gitignore)
git check-ignore site-v2/.env && echo "OK, gitignored"

# Criar branch
git checkout -b feat/meta-capi

# Stage SELETIVO (nunca git add -A por seguranca)
git add site-v2/astro.config.mjs \
        site-v2/package.json \
        site-v2/package-lock.json \
        site-v2/.env.example \
        site-v2/src/lib/hash.ts \
        site-v2/src/lib/fb-cookies.ts \
        site-v2/src/lib/capi.ts \
        site-v2/src/pages/api/capi.ts \
        site-v2/src/components/react/CaptureModal.tsx \
        docs/prds/meta-capi-vercel-deploy.md \
        docs/research/meta-capi-research.md

git commit -m "feat(site-v2): meta pixel + conversions api via vercel serverless

- src/pages/api/capi.ts: endpoint serverless que recebe payload do modal
- src/lib/{capi,hash,fb-cookies}.ts: builder de payload, normalizacao SHA-256, cookies _fbp/_fbc
- src/components/react/CaptureModal.tsx: Advanced Matching no Pixel + fetch /api/capi paralelo ao webhook
- astro.config.mjs: output hybrid + adapter Vercel
- package.json: engines.node 20.x + @astrojs/vercel

Pixel e CAPI compartilham event_id para dedup em 48h no Meta.
Validado local via Test Events Tool (2 Leads processados via Servidor).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"

git push -u origin feat/meta-capi
```

**Validacao:**

- `git log --oneline -5` mostra o commit.
- `git status` clean.
- Vercel automaticamente cria um Preview deploy a partir do push.

### T3. Validar Preview em producao

**Quando:** apos T1 e T2 completos.

**Como:**

1. Aguardar Vercel terminar o Preview deploy (~60s). Pegar URL do preview:
   ```bash
   vercel ls --scope <team>
   # Ou via MCP: listar deployments do projeto site-v2
   ```

2. Abrir `https://<preview-url>/lpv2/` em browser real (Chrome recomendado com Meta Pixel Helper extension).

3. Submeter um lead de teste no modal (usar email real tipo `artur+capi-preview-001@grupovuk.com.br`).

4. Abrir DevTools > Network antes de submeter. Procurar:
   - `POST /api/capi` → status 204 (sucesso)
   - `POST connect.facebook.net/signals/config/...` → pixel payload
   - Ambos com payload contendo o mesmo `event_id`.

5. Events Manager > Test Events > codigo `TEST79132`:
   - Deve aparecer 1 Lead com metodo "Navegador e Servidor" (ou "Recebido de: Navegador, Servidor").
   - Status "Processado".
   - Identificacao do evento batendo com o `event_id` que apareceu no DevTools.

6. Se aparecer so "Navegador" e nao "Servidor": vars nao subiram ou endpoint retornou erro. Checar logs do Vercel.

**Validacao:**

- Events Manager mostra dedup funcionando (evento "Navegador e Servidor").
- Preview URL responde 200 na landing e 204 em `/api/capi`.
- Logs Vercel sem erro 502 em `/api/capi`.

### T4. Merge na main + deploy Production

**Quando:** apos T3 passar.

**Como:**

```bash
# Via GitHub (preferido, gera historico de PR)
gh pr create --base main --head feat/meta-capi \
  --title "feat(site-v2): meta pixel + conversions api via vercel serverless" \
  --body "$(cat <<'EOF'
## Summary

- Implementa Meta Conversions API server-side via Astro + Vercel Serverless Function
- Adiciona Advanced Matching no Pixel browser para subir EMQ
- Compartilha event_id entre Pixel e CAPI para dedup em 48h
- Validado local via Test Events Tool e em Preview

## Test plan

- [x] Build local passa
- [x] Curl local retorna 204 com payload valido, 400 com invalido
- [x] Events Manager Test Events recebe Lead via Servidor (local)
- [ ] Preview Vercel: Lead aparece como "Navegador e Servidor" (a validar em T3)
- [ ] Production: primeiro lead real apos merge aparece dedup (a validar em T4)

PRD: docs/prds/meta-capi-vercel-deploy.md
Research: docs/research/meta-capi-research.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"

# Apos aprovacao (ou auto-merge se permitido):
gh pr merge --squash --auto
git checkout main
git pull
```

**Validacao:**

- Vercel Production re-deploy roda automaticamente na merge.
- Preview de `https://icc.thesociety.com.br/lpv2/` (ou dominio final) continua funcionando.
- Submeter lead real e confirmar em Events Manager > Overview (nao Test Events, agora e dados reais):
  - Evento Lead aparece com metodo "Navegador e Servidor"
  - Match Quality comeca a subir em 24-48h (meta: >= 7.5)

### T5. Rotacionar token (security follow-up)

**Quando:** apos T4 confirmado funcionando em producao (1-2h depois, pra ter certeza).

**Por que:** o token foi exposto em chat do dia 2026-04-23. Qualquer pessoa com acesso ao historico do chat pode usar esse token para enviar eventos falsos em nome do Pixel 310399388108164.

**Como:**

1. Events Manager > Pixel 310399388108164 > Settings > Conversions API.
2. "Generate access token" → gerar novo. Copiar.
3. Na mesma tela, revogar o token anterior (`EAAG7HXRJzMU...ZD`).
4. Atualizar `META_CAPI_ACCESS_TOKEN` no Vercel (Production + Preview + Development) com o novo valor. Via MCP ou CLI.
5. Atualizar `site-v2/.env` local com o novo valor.
6. Nao precisa redeploy explicito. Vercel picks up o novo valor na proxima invocacao da serverless function (pode forcar via "Redeploy" no dashboard se quiser garantir).
7. Confirmar: Events Manager > Test Events (com um preview) continua recebendo. Se sim, token novo funciona.

**Validacao:**

- Token antigo revogado no Events Manager.
- Token novo ativo no Vercel.
- Events Manager continua recebendo eventos.
- `git log -p --all -S "EAAG7HXRJzMU"` continua vazio (token antigo nunca foi commitado).

## Checklist de aceitacao (para marcar PRD como completo)

- [ ] T1: `vercel env ls` mostra 3 vars CAPI nos targets certos
- [ ] T2: branch `feat/meta-capi` commitada e pushada, Preview deploy criado
- [ ] T3: Preview mostra Lead como "Navegador e Servidor" em Test Events
- [ ] T4: PR mergeada, Production deploy rodou, primeiro lead real dedupado
- [ ] T5: token antigo revogado, token novo em Vercel, eventos continuam chegando

## Arquivos relacionados

- `docs/research/meta-capi-research.md` — pesquisa completa que originou a implementacao
- `site-v2/.env` — valores reais (gitignored)
- `site-v2/.env.example` — template sem valores
- `~/.claude/skills/landing-page-prd/references/meta-capi-pattern.md` — o que o PRD de landing tem que declarar
- `~/.claude/skills/landing-page-create-plan/references/meta-capi-implementation.md` — spec completa de implementacao
- `~/.claude/skills/landing-page-audit/references/meta-capi-audit.md` — checklist de auditoria
- `~/.claude/skills/env-secrets/references/env-var-map.md` — spec de todas as env vars da agencia

## Notas para a proxima sessao do Claude

> Quando o Mateus voltar, provavelmente vai falar algo tipo "bora subir as vars do Meta CAPI pra Vercel" ou "continua de onde parou no CAPI". O contexto completo esta nesse PRD. Executar T1-T5 na ordem, com Vercel MCP conectado. Nao precisa reimplementar codigo — tudo ja esta feito. Se tiver duvida em qualquer valor, ler de `site-v2/.env` (local, gitignored, tem todos os valores corretos).
