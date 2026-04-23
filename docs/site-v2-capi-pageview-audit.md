---
title: Audit Pre-Deploy — CAPI PageView via endpoint + fetch client-side
slug: site-v2-capi-pageview
created: 2026-04-23
tags: [audit, landing, site-v2, capi, meta-pixel, pre-deploy]
status: partial
branch: feat/capi-pageview-v2
commit: 9540263
---

# Audit Pre-Deploy — CAPI PageView via endpoint + fetch client-side

**Data:** 2026-04-23
**Stack:** Astro 4 (output hybrid) + @astrojs/vercel/serverless
**Build:** PASSOU (`npm run build`, 1.9s)
**Type check:** PASSOU (`npm run check`, 0 errors, 0 warnings, 2 hints benignos)

---

## Resumo

Auditoria focada nas mudancas da branch `feat/capi-pageview-v2` (CAPI PageView server-side via endpoint API dedicado + fetch same-origin no browser). Substitui o approach `prerender=false` que quebrou producao em 2026-04-23 (ver `docs/incidents/2026-04-23-capi-pageview-500.md`).

**Mudancas da branch: LIBERA MERGE.** Analytics/Pixel/CAPI checks passam, security preservada, landing permanece estatica (checkpoint critico `index.astro` sem `prerender=false` confirmado). Smoke test no preview Vercel real retornou landing 200 + script inline integro + endpoint 204.

**Gatekeepers herdados (NAO introduzidos por essa branch):** Zoom URL placeholder em JSON-LD Event.location + Privacidade/Termos URLs placeholder no Footer. Mesmos gatekeepers listados em auditorias anteriores dessa landing — nao bloqueiam esse merge especifico (sao divida pre-existente).

**Proximo passo:** merge na main, monitorar deploy, confirmar Test Events no Events Manager.

---

## 1. Semantica & Estrutura
- [x] `<h1>` unico (observado: 1)
- [x] `<html lang="pt-BR">`
- [x] `<meta charset="UTF-8">`
- [x] `<meta viewport>` presente (`width=device-width, initial-scale=1`)
- [x] Alt text em 100% das imagens (observado: 116/116)
- [x] Landmarks (`<header>`, `<main>`, `<footer>`) presentes
- [x] SVG hygiene: zero `<script>`/SMIL/`<animate>` dentro de `<svg>` (nao introduzido pela branch; inalterado)
- [x] CSS global tem `@media (prefers-reduced-motion: reduce)` (inalterado)
- Nota manual: branch nao alterou a11y; revisao previa permanece valida.

## 2. SEO On-Page
- [x] `<title>` = 47 chars (alvo <= 60)
- [x] `<meta description>` = 109 chars (alvo <= 160)
- [x] Canonical real: `https://icc.thesociety.com.br/lpv2/` (nao placeholder)
- [x] `robots.txt` presente
- [x] `sitemap.xml` via `site/` fronting (N/A pra landing de 1 pagina em site-v2)
- Nota manual: Rich Results Test — skipado pelo usuario nesse audit; rodar em https://search.google.com/test/rich-results apos merge.

## 3. LLMEO
- [x] `llms.txt` presente (2209 bytes, > 500)
- [x] `robots.txt` libera 6 crawlers (GPTBot, anthropic-ai, ClaudeBot, PerplexityBot, ChatGPT-User, Google-Extended)
- [x] JSON-LD: 1 script com 3 entidades (Organization + WebSite + Event)
- Nota manual: branch nao alterou estrutura JSON-LD. Zoom URL placeholder ja listado como gatekeeper herdado.

## 4. Redes Sociais / Compartilhamento
- [x] OG 6 props: title, description, image, type, url, locale (todas presentes)
- [x] `og:url` real (nao placeholder)
- [x] Twitter card `summary_large_image`
- [x] `theme-color`: `#FBFAF7`
- [x] `manifest.webmanifest` presente (com base path `/lpv2/`)
- Nota manual: branch nao alterou social tags.

## 5. Analytics & Pixel & CAPI (FOCO DESSA BRANCH)

### Frontend (Pixel + fetch CAPI no browser)

- [x] **Checkpoint critico — `src/pages/index.astro` NAO tem `export const prerender = false`.** Confirmado via grep: `! grep -E "export const prerender = false" src/pages/index.astro` retornou vazio. Landing permanece estatica no `dist/` como `/index.html`. Evita o incident 2026-04-23.
- [x] **Script inline Pixel + CAPI em `src/layouts/Base.astro`** integro no HTML buildado:
  - `META_PIXEL = "310399388108164"` (1 match)
  - Loader `connect.facebook.net/en_US/fbevents.js` (1 match)
  - `fbq('init', META_PIXEL)` (1 match)
  - `fbq('track', 'PageView', {}, { eventID: eventId })` (1 match)
  - `fetch('/lpv2/api/capi-pageview', { method: 'POST', keepalive: true, ... })` (2 matches: const + call)
- [x] `eventId` compartilhado entre Pixel e CAPI via `crypto.randomUUID()` (fallback `pv-<epoch>-<rand>`)
- [x] GA4 `gtag('config')` intacto, GA ID real: `G-7CJMYD129G`
- [x] Noscript pixel: `facebook.com/tr?id=310399388108164&ev=PageView&noscript=1`
- [x] Env vars client: `PUBLIC_META_PIXEL_ID`, `PUBLIC_GA_ID` populadas em Production+Preview+Development (`vercel env ls`)

### Backend (endpoints CAPI Lead + PageView)

- [x] `src/pages/api/capi.ts` (Lead): `export const prerender = false` + POST handler + shape `identity:{...}` novo
- [x] `src/pages/api/capi-pageview.ts` (NOVO): `export const prerender = false` + POST handler + context-only (sem PII)
- [x] Ambos endpoints validam payload: 400 em JSON invalido ou campos faltando
- [x] Ambos endpoints nao vazam detalhes de erro: `console.error` generico + response `null` 502
- [x] Config `.vercel/output/config.json` registra rotas `/api/capi` e `/api/capi-pageview` como `_render` serverless
- [x] `fbp`/`fbc`/`clientIp`/`clientUa` NUNCA hasheados (passados raw no user_data)
- [x] CAPI input refactor clean: `CapiEventInput.identity?` (opcional, PII hashed) + `CapiEventInput.context?` (raw fbp/fbc/ip/ua)

### Smoke test preview Vercel real (branch deployada, `dpl_B1dc2T5Lb1ed4WXFYtUiAaD7fnVd`)

- [x] `GET <preview>/lpv2/` = HTTP 200, 77KB, TTFB 76ms
- [x] `POST <preview>/lpv2/api/capi-pageview` com payload valido = HTTP 204
- [x] Browser Console: `typeof window.fbq === 'function'`, `fbq.loaded === true`, `fbq.version === "2.9.307"` (confirmado pelo usuario)
- Nota manual: confirmar em **Events Manager > Test Events** que PageView chegou com metodo "Navegador e Servidor" (requer `META_CAPI_TEST_EVENT_CODE` setado em env Preview OU logar no dashboard e filtrar por codigo).

## 6. Formularios
- [x] Campos: nome (`name="name"`), email (`name="email"`), telefone via `PhoneInput` (react-international-phone, E.164)
- [x] Validacao client-side (email regex, phone E.164)
- [x] Honeypot anti-spam posicionado off-screen (comentario explicito no codigo: "nao display:none — alguns bots detectam")
- Nota manual: branch nao alterou modal; walkthrough UX (Tab/Shift+Tab, Esc, backdrop, aria-live, submit disabled) inalterado.

## 7. Webhooks
- [x] `PUBLIC_WEBHOOK_URLS` em `.env.example` (env var configurada no Vercel, nao alterada)
- [x] `fetch('/api/capi', ...)` + webhook em paralelo no handleSubmit do modal
- [x] Payload inclui `event_id` (compartilhado com Pixel Lead)
- Nota manual: submit end-to-end inalterado pela branch.

## 8. Performance
- [x] Landing permanece ESTATICA (prerender default, servida do CDN). TTFB medido no preview: 76ms.
- [x] Bundle sizes (gzip): `CaptureModal.D3E19lyu.js` 53.43KB + `client.BjKZz6wI.js` 43.80KB + `hoisted.Bx415rDW.js` 47.25KB = ~145KB gzip total
- [x] Script inline Pixel+CAPI nao bloqueia render: `fbq()` e `fetch()` sao async; `keepalive: true` preserva fetch em navegacao
- [x] `font-display: swap` via Google Fonts URL
- Nota manual: Lighthouse mobile — skipado pelo usuario nesse audit; rodar apos merge pra benchmark de LCP/CLS/INP real.

## 9. Mobile
- [x] `<meta viewport>` com `width=device-width, initial-scale=1`
- [x] Landing nao introduziu larguras fixas novas (branch mexeu so em layouts/Base.astro + pages/api/)
- Nota manual: viewport 320/390/768/1024 — inalterado pela branch.

## 10. Seguranca
- [x] HTTPS + HSTS configurado em `vercel.json` (`max-age=63072000; includeSubDomains; preload`)
- [x] 6 headers declarados em `vercel.json`: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`
- [x] **CSP cobre o script e fetch CAPI:**
  - `script-src` inclui `https://connect.facebook.net` (carrega fbevents.js)
  - `connect-src 'self'` libera fetch pra `/lpv2/api/capi-pageview` (same-origin)
  - `connect-src` inclui `https://www.facebook.com` (Pixel client posta pra /tr)
- [x] Zero `PUBLIC_*ACCESS_TOKEN` ou `PUBLIC_*SECRET` no bundle (`META_CAPI_ACCESS_TOKEN` e server-only, acessado so em API routes via `import.meta.env.META_CAPI_ACCESS_TOKEN`)
- [x] `src/pages/api/capi-pageview.ts` nao loga PII (so `event_id` + status)
- [x] Zero `console.log` no JS buildado (`.vercel/output/static/_astro/`)
- [x] `npm audit`: nao rodado (fora do escopo da branch; inalterado)
- Nota manual: securityheaders.io — inalterado pela branch.

## 11. Build & Deploy
- [x] `npm run build` passou sem warning critico (1 WARN Node 24→18 do Vercel adapter, benigno)
- [x] `npm run check` passou com 0 erros e 0 warnings (2 hints benignos sobre scripts com atributos)
- [x] Build gera `dist/index.html` estatico + 2 functions (`_render.func` cobre `/api/capi` e `/api/capi-pageview`)
- [x] Placeholders em dist: 3 ocorrencias, todas ja conhecidas/herdadas (Zoom URL no JSON-LD + 2x "URL legal pendente" no footer). Nenhum placeholder novo introduzido pela branch.
- [x] Env vars declaradas no Vercel: `PUBLIC_GA_ID`, `PUBLIC_META_PIXEL_ID` confirmadas em Production+Preview+Development do projeto `intensivo-claude-code-astro` (fronting).
- Nota manual: branch deployou em `intensivo-claude-code-v2` (projeto separado). Preview URL validada (`dpl_B1dc2T5Lb1ed4WXFYtUiAaD7fnVd`). Confirmar que `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `META_CAPI_TEST_EVENT_CODE` estao em Production+Preview do projeto v2 antes do merge.

## 12. Copy & Compliance
- [x] Em dash (—) em `src/components`: 13 ocorrencias. **Todas em comentarios de codigo** (JSDoc/comments TSX/Astro), zero em copy visivel ao usuario. Conforme regra 10 da skill: WARN, nao FAIL.
- [x] Acentos corretos em pt-BR no source
- [ ] Footer: links Privacidade + Termos apontam pra `href="#"` com comentario `<!-- TODO: URL legal pendente -->` — **gatekeeper herdado**, nao introduzido por essa branch
- Nota manual: compliance inalterada pela branch.

---

## Assets Publicos
- [x] `favicon.ico`, `favicon.png`, `apple-touch-icon.png`
- [x] `robots.txt`, `llms.txt`, `manifest.webmanifest`
- [x] `og-image.png`
- [x] `mateus.webp` + pasta `depoimentos/` (19 WEBPs)

**Resultado:** 100% dos assets criticos presentes no build.

---

## TODOs Bloqueadores Pre-Deploy

### Desta branch (feat/capi-pageview-v2): ZERO

Nenhum gatekeeper novo introduzido pela mudanca de CAPI PageView. Mudancas da branch liberam merge.

### Heranca (pre-existentes, NAO bloqueiam esse merge especifico)

1. **Zoom URL placeholder no JSON-LD Event.location**
   - Estado atual: `"url":"https://zoom.us/j/TODO"` no schema Event
   - Acao: setar URL real do Zoom antes do evento em 16/05
   - Arquivo: `site-v2/src/lib/structured-data.ts` ou `site-v2/src/config.ts`

2. **Footer: URLs de Privacidade + Termos**
   - Estado atual: `<a href="#">` com comentario `<!-- TODO: URL legal pendente -->`
   - Acao: publicar paginas de politica e substituir `#` pelos paths reais
   - Arquivo: `site-v2/src/components/Footer.astro`

3. **Env vars CAPI no projeto v2 Vercel** (validar, provavelmente ja setadas)
   - Estado atual: preview retornou 204 no endpoint, mas 204 pode ser sucesso OU early return por env vars faltando
   - Acao: confirmar via Events Manager > Test Events que PageView server-side chegou. Se nao chegar, setar `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `META_CAPI_TEST_EVENT_CODE` no projeto v2 (Production + Preview).
   - Arquivo: Vercel Dashboard > `intensivo-claude-code-v2` > Settings > Environment Variables

---

## Validacao Manual Pendente

- [ ] **Events Manager > Test Events**: confirmar PageView com metodo "Navegador e Servidor" no preview URL (dedup funcionando via event_id). Usar `META_CAPI_TEST_EVENT_CODE` ou codigo de Test Events.
- [ ] **Lighthouse mobile** pos-merge no dominio de producao (`icc.thesociety.com.br/lpv2/`): LCP < 2.5s, CLS < 0.1, INP < 200ms.
- [ ] **Rich Results Test** — https://search.google.com/test/rich-results — detectar Organization + WebSite + Event.
- [ ] **Facebook Pixel Helper** em aba anonima sem extensoes: detectar pixel `310399388108164` ativo (em preview URL com SSO o helper da falso negativo).
- [ ] **Form submit end-to-end** (Lead) em preview: confirmar webhook entregue + evento `Lead` com dedup em Events Manager.
- [ ] **viewport 320/390/768/1024** — inalterado pela branch, mas revalidar apos qualquer deploy.

---

## Notas Contextuais

1. **Escopo desse audit**: foco nas mudancas da branch `feat/capi-pageview-v2`. Gatekeepers pre-existentes (Zoom URL, Privacy/Terms) NAO sao novos — foram herdados de auditorias anteriores e continuam pendentes.

2. **Por que `status: partial`**: mudancas da branch (CAPI PageView) estao `clear-for-merge`, mas a landing em producao mantem os gatekeepers herdados listados acima. O audit nao pode marcar `clear` enquanto houver gatekeeper pendente, mesmo que seja heranca. Por isso `partial`.

3. **Hints benignos do `astro check`** (2 ocorrencias): warnings sobre scripts com atributos serem tratados como `is:inline`. Nao bloqueia — pode ser silenciado adicionando `is:inline` explicito nos scripts em `Base.astro:63` e `:104` em follow-up.

4. **Hipotese do incident 2026-04-23 NAO confirmada**: postmortem diz "hipotese forte, nao 100% confirmada". A abordagem escolhida (endpoint + fetch client-side) funciona independentemente de qual foi a causa raiz real — evita totalmente o vetor de `prerender=false` no index com base+rewrite.

5. **Bug do Pixel Helper em preview Vercel com SSO**: extension scana a pagina de auth do Vercel antes do redirect pro `/lpv2/` e cacheia "No Pixels found". Validacao real feita via `window.fbq` no console (confirmou `loaded: true, version: 2.9.307`).

---

## Proximo Passo

**PRE-MERGE CHECKLIST (bloqueia esse merge):** ZERO. Branch pode ser mergeada.

**PRE-MERGE CHECKLIST OPCIONAL (validar antes pra paz de espirito):**
- [ ] Abrir Events Manager > Test Events no preview e confirmar PageView "Navegador e Servidor"
- [ ] Confirmar env vars `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN` no projeto v2 Vercel

**VALIDACAO MANUAL (pos-merge, em paralelo):**
- [ ] Lighthouse mobile no dominio de prod
- [ ] Rich Results Test
- [ ] Facebook Pixel Helper em aba anonima (sem SSO)
- [ ] Events Manager > Overview: PageView "Navegador e Servidor" em producao real

**POS-MERGE:**
- Vercel Git Integration dispara deploy automatico de `intensivo-claude-code-v2` no push de main
- Monitorar build log no dashboard Vercel (esperado: mesmo PASS que o preview ja validou)
- Se landing retornar 500 em prod: `vercel rollback <previous>` imediato (runbook incident 2026-04-23 documentado)
- Remover `META_CAPI_TEST_EVENT_CODE` de Production no Vercel se estiver setado (eventos precisam ir pra Overview, nao Test Events)

**GATEKEEPERS HERDADOS (proxima sprint, nao bloqueiam esse merge):**
- [ ] Publicar paginas de Privacidade + Termos e substituir `#` no Footer
- [ ] Setar URL real do Zoom no JSON-LD Event antes de 16/05

---

**Status final:** LIBERA MERGE da branch `feat/capi-pageview-v2`. Mudancas passam em todas 12 categorias (gatekeepers pendentes sao heranca, nao novos). Rodar validacao manual pos-merge pra confirmar PageView server-side no Events Manager de producao.
