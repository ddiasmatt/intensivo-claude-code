---
title: Story 08 — Security headers em `vercel.json`
slug: intensivo-claude-code-ajustes-pre-deploy-08
plan: docs/plans/intensivo-claude-code-ajustes-pre-deploy.md
prd: docs/prds/intensivo-claude-code-ajustes-pre-deploy.md
complexity: M
model: implementer-sonnet
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-ajustes-pre-deploy]
---

# Story 08 — Security headers em `vercel.json`

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** nenhuma
- **Arquivos a criar:** nenhum
- **Arquivos a modificar:** `vercel.json` (na raiz do repo, nao em `site/`)
- **Patterns a seguir:** PRD secao 4.5.3

**Contexto:** `vercel.json` existe mas sem bloco `headers`. Sem CSP + outros 5 headers, qualquer audit de seguranca retorna grade F. Headers nao bloqueiam merge por si, mas sao finding critico e impactam reputacao e compliance.

**Codigo de referencia:** `vercel.json` final

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.facebook.com https://api-sigma.vuker.com.br; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://sndflw.com"
        },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    }
  ]
}
```

**Se `vercel.json` ja tem outras keys** (`rewrites`, `redirects`, `cleanUrls`, etc.), **preservar** e apenas adicionar a key `headers` no topo do objeto.

**Iteracao pos-preview:** apos preview deploy, abrir DevTools Console e recarregar a pagina com form submit completo. Se aparecer algum erro de CSP (`Refused to load ...` ou `Refused to connect to ...`):
1. Identificar o dominio bloqueado
2. Adicionar na diretiva CSP correta (`script-src` para JS, `connect-src` para fetch/websocket, `img-src` para imagens, `frame-src` para iframes)
3. Se dominio vier de third-party (GTM, Clarity futuro), adicionar explicitamente

**Dominios cobertos no CSP atual:**
- `script-src`: `'self'` + Google Tag Manager + Facebook (Meta Pixel `fbevents.js`)
- `connect-src`: `'self'` + GA4 analytics + Meta Pixel beacons + **VUKer webhook** (`api-sigma.vuker.com.br`)
- `form-action`: `'self'` + Sendflow (redirect)
- `font-src`: `'self'` + Google Fonts (`fonts.gstatic.com`)
- `style-src`: `'self'` + Google Fonts CSS + `'unsafe-inline'` (Tailwind gera styles inline no build)
- `img-src`: `'self'` + data: (SVG inline) + Google/Facebook tracking pixels

**Criterios de aceite:**
1. QUANDO abrir `vercel.json` apos a mudanca, ENTAO contem o array `headers[0].headers` com 6 entradas (CSP, X-Frame, X-Content, Referrer, Permissions, HSTS)
2. QUANDO preview deploy concluir, ENTAO um `curl -I <preview-url>` retorna os 6 headers no response
3. QUANDO carregar a landing em preview com DevTools Console aberto, ENTAO zero erros `Refused to load` ou `Refused to connect to` aparecem (se aparecerem, iterar CSP antes do merge)
4. QUANDO submeter o form em preview, ENTAO webhook VUKer recebe sem bloqueio de CSP
5. QUANDO testar pos-deploy em https://securityheaders.io, ENTAO grade **B ou superior** (A+ e objetivo stretch mas requer mais ajustes)

**Comando de validacao:**
```bash
# Validar estrutura JSON
jq -e '.headers[0].headers | length == 6' vercel.json && echo "PASS: 6 headers"

# Apos preview deploy, validar ao vivo:
# curl -sI <preview-url> | grep -iE "content-security-policy|x-frame-options|x-content-type-options|referrer-policy|permissions-policy|strict-transport-security"
```
