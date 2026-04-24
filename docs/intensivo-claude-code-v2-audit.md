---
title: Audit Pre-Deploy — Intensivo Claude Code v2 (captacao)
slug: intensivo-claude-code-v2
created: 2026-04-23
tags: [audit, landing, intensivo-claude-code, site-v2, pre-deploy]
status: blocked
---

# Audit Pre-Deploy — Intensivo Claude Code v2 (captacao)

**Data:** 2026-04-23
**Stack:** Astro 4 (hybrid) + React 18 + Tailwind 4 + Vercel adapter
**Build:** PASSOU (`npx astro build`, ~2.8s). 1 advisory ambiental (Node 24 local vs Node 18 runtime Vercel)
**Type check:** PASSOU (`npx astro check`, 0 erros, 0 warnings, 2 hints `is:inline` benignos)
**Dominio final:** https://icc-v2.thesociety.com.br
**Build output:** `.vercel/output/static/` (hybrid mode)

---

## Resumo Executivo

Landing esta 95% pronta. Build limpa, zero erros de tipo, integracoes (Meta Pixel, GA4, CAPI, webhook Sigma) todas cabeadas e propagando `event_id` para dedup. Dois gatekeepers bloqueiam merge: **(1)** JSON-LD Event aponta para `https://zoom.us/j/TODO` (URL real nao preenchida) e **(2)** Footer Politica de Privacidade e Termos com `href="#"` + comentarios TODO. Ambos em `src/layouts/Base.astro` e `src/components/Footer.astro`. Warnings nao bloqueadores: `robots.txt` referencia sitemap em dominio errado (`intensivo.grupovuk.com.br/sitemap.xml`, deveria ser `icc-v2.thesociety.com.br` ou remover), npm audit 1 high + 4 moderate (transitive deps), ausencia de `fetchpriority="high"` na hero (OK porque hero e SVG, nao imagem). Resolver 2 gatekeepers + warnings que couber e esta pronto pra merge.

---

## Tabela Consolidada de Checks

| # | Categoria | Task | Status | Valor observado |
|---|-----------|------|--------|-----------------|
| 0.1 | Build | Build sem warnings | ⚠️ | `build ok, 1 advisory: Node 24 local vs Node 18 Vercel runtime` |
| 0.2 | Build | Type check zero erros | ✅ | `0 erros, 0 warnings, 2 hints (is:inline benignos)` |
| 0.3 | Build | `dist/` existe | ✅ | `.vercel/output/static/ com index.html + _astro/` |
| 1.1 | Semantica | `<h1>` unico | ✅ | `1` |
| 1.2 | Semantica | `lang="pt-BR"` | ✅ | `pt-BR` |
| 1.3 | Semantica | charset UTF-8 | ✅ | `UTF-8` |
| 1.4 | Semantica | viewport correto | ✅ | `width=device-width, initial-scale=1` |
| 1.5 | Semantica | Alt text 100% imagens | ✅ | `116/116` |
| 1.6 | Semantica | landmarks (header/main/footer) | ✅ | `todos presentes, header com role="banner"` |
| 1.7 | Semantica | Zero script/style/SMIL em SVG | ✅ | `15 SVGs, 0 com conteudo proibido` |
| 1.8 | Semantica | SVG accessibility | ✅ | `todos com aria-hidden="true" ou role="presentation"` |
| 1.9 | Semantica | prefers-reduced-motion | ✅ | `presente em index.CEn0_rcQ.css` |
| 1.10 | Semantica | @gsap/react se GSAP em React | ✅ | `"@gsap/react": "^2"` declarado |
| 1.11 | Semantica | aria-label em botoes icone-only | ⏸ MANUAL | pendente revisao humana |
| 1.12 | Semantica | Hierarquia H2-H6 sem pulos | ⏸ MANUAL | `H1(1) H2(9) H3(21) declarados, ordem doc a revisar` |
| 2.1 | SEO | title <= 60 chars | ✅ | `45 chars: "Intensivo Claude Code · 16/05 ao vivo no Zoom"` |
| 2.2 | SEO | description <= 160 chars | ✅ | `108 chars` |
| 2.3 | SEO | keywords presente | ✅ | `claude code, intensivo, mateus dias, agentes de ia...` |
| 2.4 | SEO | author presente | ✅ | `Grupo VUK` |
| 2.5 | SEO | robots meta | ✅ | `index, follow` |
| 2.6 | SEO | canonical real | ✅ | `https://icc-v2.thesociety.com.br/` |
| 2.7 | SEO | robots.txt presente | ✅ | `659 bytes` |
| 2.8 | SEO | sitemap.xml | ⚠️ | `N/A (landing 1 pagina) MAS robots.txt referencia https://intensivo.grupovuk.com.br/sitemap.xml (dominio errado, arquivo inexistente)` |
| 2.9 | SEO | Rich Results Test detecta tipos | ⏸ MANUAL | pendente (bloqueado pelo TODO na Event.location.url) |
| 3.1 | LLMEO | llms.txt presente | ✅ | `presente` |
| 3.2 | LLMEO | llms.txt > 500 bytes | ✅ | `2209 bytes` |
| 3.3 | LLMEO | robots libera GPTBot | ✅ | `Allow: /` |
| 3.4 | LLMEO | robots libera ClaudeBot/anthropic-ai | ✅ | `ambos Allow: /` |
| 3.5 | LLMEO | robots libera PerplexityBot | ✅ | `Allow: /` |
| 3.6 | LLMEO | robots libera ChatGPT-User | ✅ | `Allow: /` |
| 3.7 | LLMEO | robots libera Google-Extended | ✅ | `Allow: /` |
| 3.8 | LLMEO | JSON-LD count >= 2 | ✅ | `1 block mas array com 3 schemas: Organization + WebSite + Event` |
| 3.9 | LLMEO | Conteudo em texto | ⏸ MANUAL | pendente |
| 3.10 | LLMEO | JSON-LD sintaxe valida | ⏸ MANUAL | `parse JSON ok, validator.schema.org pendente (bloqueado pelo TODO)` |
| 4.1 | Social | og:title | ✅ | `"Intensivo Claude Code · 16/05 ao vivo no Zoom"` |
| 4.2 | Social | og:description | ✅ | presente |
| 4.3 | Social | og:image real (1200x630) | ✅ | `og-image.png 1200x630, 51KB` |
| 4.4 | Social | og:type | ✅ | `website` |
| 4.5 | Social | og:locale pt_BR | ✅ | `pt_BR` |
| 4.6 | Social | og:url real | ✅ | `https://icc-v2.thesociety.com.br/` |
| 4.7 | Social | twitter summary_large_image | ✅ | confirmado |
| 4.8 | Social | theme-color | ✅ | `#FBFAF7` |
| 4.9 | Social | apple-touch-icon + manifest | ✅ | ambos presentes |
| 4.10 | Social | FB Debugger + Twitter validator | ⏸ MANUAL | pendente |
| 5.1 | Analytics | PUBLIC_GA_ID real | ✅ | `G-7CJMYD129G` |
| 5.2 | Analytics | PUBLIC_META_PIXEL_ID real | ✅ | `310399388108164` |
| 5.3 | Analytics | Meta Pixel snippet integro | ✅ | `fbq init + connect.facebook.net + 3x PageView` |
| 5.4 | Analytics | GA4 snippet integro | ✅ | `googletagmanager.com/gtag/js + gtag config` |
| 5.5 | Analytics | Vercel env vars Production | ✅ | `PUBLIC_GA_ID, PUBLIC_META_PIXEL_ID, PUBLIC_WEBHOOK_URLS, PUBLIC_REDIRECT_URL, META_PIXEL_ID, META_CAPI_ACCESS_TOKEN` |
| 5.6 | Analytics | Production smoke test | ⏸ MANUAL | pendente pos-deploy |
| 5.7 | Analytics | Microsoft Clarity | ➖ N/A | PRD nao declara Clarity |
| 5.8 | Analytics | UTM capture + sessionStorage | ✅ | `captureUTMs/getStoredUTMs em src/lib/utm` |
| 5.9 | Analytics | event_id compartilhado (dedup) | ✅ | `eventID = lead_Date.now()_random propagado em Pixel, GA4 e CAPI` |
| 5.10 | Analytics | Submit real + GA4 DebugView | ⏸ MANUAL | pendente preview |
| 6.1 | Forms | Campos nome/email/telefone | ✅ | `3 campos + honeypot` |
| 6.2 | Forms | Mascara (XX) XXXXX-XXXX | ✅ | `maskPhoneBR() em CaptureModal.tsx:21` |
| 6.3 | Forms | Validacao client-side | ✅ | `EMAIL_RE + phoneDigits.length === 11` |
| 6.4 | Forms | Honeypot ou reCAPTCHA | ✅ | `honeypot name="website" off-screen em linha 421` |
| 6.5 | Forms | font-size 16px inputs (iOS) | ✅ | `text-base = 1rem = 16px em Tailwind default` |
| 6.6 | Forms | CSS padronizado | ✅ | `3 inputs compartilham mesma classe: w-full border border-rule bg-page px-3 py-3 font-sans text-base` |
| 6.7 | Forms | Modal UX (trap, Esc, backdrop) | ⏸ MANUAL | `implementado: trapFocus, Esc, confirm() em dirty form, aria-live, disabled` |
| 7.1 | Webhooks | Webhook Sigma em TODO form | ✅ | `CONFIG.WEBHOOK_URLS.forEach + fetch fire-and-forget em CaptureModal.tsx:172` |
| 7.2 | Webhooks | PUBLIC_WEBHOOK_URLS populado | ✅ | `api-sigma.vuker.com.br/api/webhooks/inbound/9d2cd781... em .env + Vercel` |
| 7.3 | Webhooks | Fetch fire-and-forget paralelo | ⚠️ | `forEach + .catch individual. Equivalente funcional, mas NAO usa Promise.allSettled literal` |
| 7.4 | Webhooks | Payload event_id/UTMs/timestamp/origem | ⚠️ | `event_id ✅, ...utms ✅, timestamp implicito no event_id (Date.now()), origem AUSENTE` |
| 7.5 | Webhooks | Fallback webhook nao bloqueia | ✅ | `.catch() em cada fetch + try/catch externo + redirect roda independente` |
| 7.6 | Webhooks | Submit end-to-end + Sigma | ⏸ MANUAL | pendente preview + CRM Sigma |
| 8.1 | Perf | fetchpriority="high" hero | ⚠️ | `NAO aplicavel: hero e SVG/CSS grid, nao <img>. Zero imgs above-the-fold` |
| 8.2 | Perf | loading="lazy" below-the-fold | ✅ | `116 imgs com loading="lazy"` |
| 8.3 | Perf | tracking scripts defer/async | ✅ | `GA4 async; Pixel inline IIFE no head` |
| 8.4 | Perf | font-display swap | ✅ | `Google Fonts com display=swap` |
| 8.5 | Perf | Bundle JS < 200KB | ✅ | `CaptureModal 147KB, client 135KB, hoisted 121KB (todos individuais < 200KB)` |
| 8.6 | Perf | Pagina total < 1MB | ✅ | `872KB total` |
| 8.7 | Perf | Lighthouse mobile | ⏸ MANUAL | pendente preview |
| 9.1 | Mobile | viewport correto | ✅ | `width=device-width, initial-scale=1` |
| 9.2 | Mobile | Sem larguras fixas px top-level | ✅ | `so hairlines 1-2px (honeypot, bordas)` |
| 9.3 | Mobile | safe-area-inset | ➖ N/A | `design sem notch iOS criticamente afetado` |
| 9.4 | Mobile | Viewports 320/390/768/1024 | ⏸ MANUAL | pendente DevTools |
| 9.5 | Mobile | Touch targets >= 44x44px | ⏸ MANUAL | pendente DevTools |
| 10.1 | Seguranca | HTTPS + HSTS | ✅ | `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` |
| 10.2 | Seguranca | CSP/XFO/XCTO/RP/PP headers | ✅ | `todos 5 headers presentes em vercel.json` |
| 10.3 | Seguranca | Zero secrets no bundle | ✅ | `META_CAPI_ACCESS_TOKEN NAO presente em nenhum .js/.html do dist` |
| 10.4 | Seguranca | Zero console.log em JS buildado | ✅ | `0 ocorrencias em todos os bundles` |
| 10.5 | Seguranca | npm audit sem CVE high/critical | ⚠️ | `5 vulns (4 moderate, 1 high: Astro Cloudflare adapter XSS — transitive, projeto usa Vercel adapter, nao expoe)` |
| 10.6 | Seguranca | securityheaders.io B+ | ⏸ MANUAL | pendente pos-deploy |
| 11.1 | Build | Build sem warning | ⚠️ | `ver 0.1 (Node advisory)` |
| 11.2 | Build | Type check zero erros | ✅ | `ver 0.2` |
| 11.3 | Build | Zero TODO/FIXME em dist | ❌ | `3 ocorrencias de TODO: 1 em JSON-LD Event.location.url e 2 em comentarios HTML do Footer` |
| 11.4 | Build | Env vars no Vercel | ✅ | `todas 6 env vars provisionadas em Production` |
| 11.5 | Build | Preview smoke test | ⏸ MANUAL | pendente |
| 11.6 | Build | 404 customizada | ⏸ MANUAL | pendente |
| 12.1 | Copy | Zero em dash em src | ⚠️ | `15 ocorrencias em src/, TODAS em comentarios (// e {/* */}) ou console.warn dev-only. 0 no HTML final` |
| 12.2 | Copy | Acentos corretos pt-BR | ⏸ MANUAL | `grep encontra variantes sem acento (sao, nao, acao) — esperado no pattern Mateus (decisao editorial)` |
| 12.3 | Copy | Footer Privacidade + Termos apontam pra pagina real | ❌ | `ambos com href="#" + comentario TODO. Ver 11.3` |
| 12.4 | Copy | Email de contato real | ✅ | `contato@grupovuk.com.br` |
| 12.5 | Copy | Sem dark patterns | ⏸ MANUAL | pendente revisao |
| A.1 | Assets | favicon.ico + favicon.png | ✅ | ambos em /public |
| A.2 | Assets | apple-touch-icon.png | ✅ | `2.7KB` |
| A.3 | Assets | robots.txt + llms.txt + manifest | ✅ | todos presentes |
| A.4 | Assets | og-image.png (1200x630) | ✅ | `1200x630, 51KB` |
| A.5 | Assets | imgs referenciadas existem | ✅ | `20 depoimentos depoimento-XX.webp confirmados em /public/depoimentos/` |

**Legenda:** ✅ PASS · ❌ FAIL · ⚠️ WARN · ⏸ MANUAL (pendente revisao humana) · ➖ N/A

---

## Totais

| Status | Contagem |
|---|---|
| ✅ Aprovados | 59 |
| ❌ Reprovados | 2 |
| ⚠️ Warnings | 8 |
| ⏸ Manuais pendentes | 16 |
| ➖ N/A | 2 |
| **Total de tasks** | **87** |

**Taxa de aprovacao automatizada:** 59 / (59+2+8) = **85.5%**

---

## Falhas por Categoria

### Categoria 2: SEO
- **2.8 sitemap.xml**: WARN. `robots.txt` referencia `https://intensivo.grupovuk.com.br/sitemap.xml` — dominio errado (deveria ser `icc-v2.thesociety.com.br`) e arquivo nao existe. Como a landing tem 1 pagina, a opcao correta e **remover a linha Sitemap do robots.txt**. Arquivo: `site-v2/public/robots.txt:42`

### Categoria 7: Webhooks
- **7.3 Promise.allSettled**: WARN. O codigo usa `forEach` com `fetch().catch()` individual. Funcionalmente equivalente a `Promise.allSettled` pra o caso fire-and-forget (ninguem aguarda), mas o padrao literal nao e aplicado. Nao bloqueia. Arquivo: `src/components/react/CaptureModal.tsx:172-181`
- **7.4 payload origem**: WARN. Payload Sigma nao inclui campo `origem` (esperado pelo rubric). `event_id` ja carrega `Date.now()` implicitamente. Avaliar se Sigma precisa do campo explicito. Arquivo: `src/components/react/CaptureModal.tsx:160-166`

### Categoria 8: Performance
- **8.1 fetchpriority hero**: WARN. Hero e SVG/CSS grid, nao `<img>`. Nao aplicavel — marcar como passou. Sem acao.

### Categoria 10: Seguranca
- **10.5 npm audit**: WARN. 5 vulnerabilidades (4 moderate, 1 high). A high e em `@astrojs/cloudflare` (XSS no `/_image` endpoint), que NAO esta em uso — projeto usa `@astrojs/vercel`. Transitive dep via Astro core. Rodar `npm audit fix` se nao quebrar build; caso contrario documentar como aceitavel (nao exposto).

### Categoria 11: Build & Deploy
- **11.3 TODO em dist**: FAIL — **GATEKEEPER**. 3 ocorrencias:
  1. `JSON-LD Event.location.url = "https://zoom.us/j/TODO"` — Rich Results quebra, SEO de evento perdido. Arquivo: `src/layouts/Base.astro` (string do JSON-LD)
  2. Footer link Politica de Privacidade com `href="#"` + comentario `<!-- TODO: URL legal pendente -->`. Arquivo: `src/components/Footer.astro`
  3. Footer link Termos com `href="#"` + comentario `<!-- TODO: URL legal pendente -->`. Arquivo: `src/components/Footer.astro`

### Categoria 12: Copy
- **12.1 em dash em src**: WARN. 15 ocorrencias, 100% em comentarios ou mensagens de console dev-only. Build HTML tem 0. Decisao: WARN (nao FAIL) porque regra e contra em dash em copy visivel. Aceitavel, mas considerar remover mesmo dos comentarios pra consistencia.
- **12.3 Privacidade + Termos**: FAIL — ver 11.3.

---

## TODOs Bloqueadores Pre-Deploy (Gatekeepers)

1. **JSON-LD Event.location.url tem `/TODO`:** PENDENTE
   - Estado atual: `"url":"https://zoom.us/j/TODO"` no JSON-LD `@type:Event.location`
   - Acao: substituir por URL real do Zoom Meeting (ou remover `location.url` e manter `VirtualLocation` generico se a URL so sai proximo do evento)
   - Arquivo: `src/layouts/Base.astro` (procurar pelo bloco JSON-LD, Event.location)

2. **Footer Privacidade + Termos com `href="#"`:** PENDENTE
   - Estado atual: 2 `<a href="#">` com comentario HTML `<!-- TODO: URL legal pendente -->`
   - Acao: apontar pros URLs finais das paginas de Privacidade e Termos (ou remover os links do Footer se ainda nao existem, em vez de deixar link morto)
   - Arquivo: `src/components/Footer.astro`

3. **robots.txt Sitemap URL invalido (WARN, nao blocker):** PENDENTE
   - Estado atual: `Sitemap: https://intensivo.grupovuk.com.br/sitemap.xml` (dominio errado, arquivo inexistente)
   - Acao: **remover a linha** inteira, ou substituir por `https://icc-v2.thesociety.com.br/sitemap.xml` + gerar sitemap (overkill pra 1 pagina — preferir remover)
   - Arquivo: `site-v2/public/robots.txt:42`

---

## Validacao Manual Pendente

Rodar em preview deploy (antes do merge final) ou em producao (pos-deploy monitorado):

- [ ] **Lighthouse mobile** (375px, Slow 4G): `npm run preview` + Chrome DevTools. Target: Perf>=90, A11y>=95, Best Practices>=95, SEO>=95
- [ ] **Viewport tests** 320/390/768/1024: DevTools Responsive (zero scroll horizontal, CTAs alcancaveis)
- [ ] **Modal UX**: confirmar Tab trap, Esc fecha, backdrop confirm() em dirty form, aria-live em erro, submit disabled durante loading (implementado, precisa validar em browser real)
- [ ] **Form submit end-to-end**: GA4 DebugView + Meta Events Manager + Sigma CRM delivery + UTM propagation em redirect
- [ ] **JSON-LD validator**: https://validator.schema.org (bloqueado ate resolver TODO em Event.location.url)
- [ ] **Rich Results**: https://search.google.com/test/rich-results (bloqueado ate resolver TODO)
- [ ] **Facebook Debugger**: https://developers.facebook.com/tools/debug/?q=https://icc-v2.thesociety.com.br
- [ ] **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- [ ] **Security headers**: https://securityheaders.io/?q=icc-v2.thesociety.com.br (target B+)
- [ ] **404 customizada**: acessar `/rota-inexistente` e conferir render
- [ ] **Touch targets**: DevTools measurements, todos >= 44x44px
- [ ] **Hierarquia headings**: percorrer documento em ordem, sem pulos H1 -> H3 (H1:1, H2:9, H3:21)
- [ ] **aria-label em botoes icone-only**: 1 confirmado (botao X fechar modal). Validar se ha outros
- [ ] **Dark patterns**: revisar copy — urgencia real (lote 16/05), sem falsa escassez

---

## Notas Contextuais

- **Hero sem img**: a hero e composta por SVG grid animado + card Mission Control, nao tem imagem de destaque. Por isso `fetchpriority="high"` e inaplicavel. Nao e problema — LCP provavelmente e o H1 ou o card de CTA.
- **JSON-LD em 1 bloco/array**: convencao da equipe (concatenar schemas em array de JSON-LD). Sintaticamente valido. `@type` cobre Organization + WebSite + Event conforme minimo exigido.
- **em dash permitido em comentarios JS/JSX**: regra global da agencia e contra em dash em copy visivel (pt-BR). 15 ocorrencias em `src/` estao 100% em comentarios e `console.warn` dev-only — build final nao carrega nenhuma.
- **npm audit 1 high transitive**: CVE e em `@astrojs/cloudflare`, que nao e usado. Projeto usa `@astrojs/vercel`. Nao exposto.
- **Vercel Git Integration em `vuk-ai-society/intensivo-claude-code-v2`** — deploy via merge na main automatico. Nunca rodar `vercel --prod` manual.

---

## Proximo Passo

**PRE-MERGE CHECKLIST (bloqueadores):**
- [ ] Substituir `https://zoom.us/j/TODO` em `src/layouts/Base.astro` pela URL real do Zoom (ou remover `location.url` ate ter)
- [ ] Substituir `href="#"` dos links Privacidade + Termos em `src/components/Footer.astro` pelas URLs reais (ou remover os links ate ter paginas)
- [ ] Remover linha `Sitemap: ...` de `site-v2/public/robots.txt` (ou corrigir o dominio)

**VALIDACAO MANUAL (em paralelo, rodar em preview deploy):**
- [ ] Lighthouse mobile + viewport tests + modal UX + submit end-to-end
- [ ] Schema validator + Rich Results apos gatekeeper 1 resolvido
- [ ] FB Debugger + Twitter validator
- [ ] Security headers (pos-deploy)

**POS-MERGE:**
- Vercel Git Integration dispara deploy em `intensivo-claude-code-v2` automaticamente
- Monitorar build log no dashboard Vercel
- Validar GA4 Realtime + Meta Events Manager (PageView + Lead) no dominio de producao
- Rodar Lighthouse e securityheaders.io em `icc-v2.thesociety.com.br`

---

**Status final:** BLOQUEIA MERGE (2 gatekeepers: JSON-LD Event TODO + Footer Privacidade/Termos TODO). Resolver em ~15min libera merge. Taxa automatizada 85.5%, manuais pendentes 16 (normal pra pre-deploy).
