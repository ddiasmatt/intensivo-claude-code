---
title: Story 01 — Popular env vars Vercel (Pixel ID + Webhook URL)
slug: intensivo-claude-code-ajustes-pre-deploy-01
plan: docs/plans/intensivo-claude-code-ajustes-pre-deploy.md
prd: docs/prds/intensivo-claude-code-ajustes-pre-deploy.md
complexity: P
model: implementer-haiku
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-ajustes-pre-deploy]
---

# Story 01 — Popular env vars Vercel (Pixel ID + Webhook URL)

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** nenhuma
- **Arquivos a criar:** nenhum (operacao de dashboard Vercel)
- **Arquivos a modificar:** `.env.example` (anotar nos comentarios que valor real vive no Vercel — documentacao)
- **Patterns a seguir:** `~/.claude/skills/landing-page-prd/references/analytics-pattern.md` (GA4 + Pixel + Webhook condicionais)

**Contexto:** audit identificou Meta Pixel ID e Webhook URL vazios em `.env.example`, bloqueando disparo de `Lead` pro Pixel e webhook pro CRM VUKer. Valores informados pelo stakeholder: Pixel `310399388108164`; Webhook `https://api-sigma.vuker.com.br/api/webhooks/inbound/9d2cd781-a63f-4a3d-8aea-edd3413b652a`.

**Acao:**
1. No dashboard Vercel do projeto `intensivo-claude-code-landing`, acessar Settings → Environment Variables
2. Criar/atualizar em **Production** e **Preview** (nao Development):
   - `PUBLIC_META_PIXEL_ID` = `310399388108164`
   - `PUBLIC_WEBHOOK_URLS` = `https://api-sigma.vuker.com.br/api/webhooks/inbound/9d2cd781-a63f-4a3d-8aea-edd3413b652a`
3. Confirmar que `PUBLIC_GA_ID` (`G-7CJMYD129G`) e `PUBLIC_REDIRECT_URL` (`https://sndflw.com/i/trV5sqi3n9eSZD0U1Rlx`) ja estao presentes em ambos escopos
4. No repo local, atualizar `.env.example` **apenas com comentario informativo**:

**Codigo de referencia:** arquivo `site/.env.example` atualizado

```env
# GA4 — valor em producao definido no Vercel dashboard (Production + Preview)
PUBLIC_GA_ID=G-7CJMYD129G

# Meta Pixel — valor real vive no Vercel dashboard. Variavel vazia aqui desativa snippet em dev local.
PUBLIC_META_PIXEL_ID=

# Webhook VUKer — valor real vive no Vercel dashboard. Vazia = fire-and-forget skip em dev local.
PUBLIC_WEBHOOK_URLS=

# Redirect pos-submit — Sendflow grupo VIP
PUBLIC_REDIRECT_URL=https://sndflw.com/i/trV5sqi3n9eSZD0U1Rlx
```

**Criterios de aceite:**
1. QUANDO acessar Vercel → Settings → Environment Variables, ENTAO `PUBLIC_META_PIXEL_ID` e `PUBLIC_WEBHOOK_URLS` aparecem com os valores acima em escopo Production **e** Preview
2. QUANDO o proximo deploy rodar, ENTAO `dist/index.html` contem `fbq('init', '310399388108164')` no snippet Meta Pixel
3. QUANDO clicar nos CTAs em ambiente de preview e submeter o form com dados validos, ENTAO o webhook VUKer recebe request POST em `api-sigma.vuker.com.br/...` (validado em Story 02)
4. QUANDO clonar o repo fresco e rodar `cat site/.env.example`, ENTAO o arquivo documenta que os valores reais vivem no Vercel

**Comando de validacao:**
```bash
# Verificar via Vercel CLI (usuario precisa estar autenticado)
cd site && vercel env ls production | grep -E "PUBLIC_META_PIXEL_ID|PUBLIC_WEBHOOK_URLS"
# Esperado: 2 linhas, ambas com valores populados
```
