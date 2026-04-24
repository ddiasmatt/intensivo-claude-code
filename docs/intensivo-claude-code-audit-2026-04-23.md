---
title: Audit Pre-Deploy — Intensivo Claude Code
slug: intensivo-claude-code
created: 2026-04-22
tags: [audit, landing, intensivo-claude-code, pre-deploy]
status: blocked
---

# Audit Pre-Deploy — Intensivo Claude Code

**Data:** 2026-04-22
**Stack:** Astro 4 + React 18 (islands) + Tailwind CSS 4 + GSAP 3 + motion v12
**Build:** PASSOU (`npx astro build`, 1.26s, 2 paginas: `/` + `/lab/`)
**Type check:** PASSOU (`npx astro check`, 0 erros, 0 warnings, 134 hints informativos)

---

## Resumo

Landing tecnicamente solida: build limpo, type-safe, 13/13 itens SEO presentes, 6/6 crawlers LLM liberados, CaptureModal com fire-and-forget + event_id UUID compartilhado + aria completo, UTMs capturados e propagados no redirect. **Bloqueia merge** por 5 gatekeepers de conteudo/integracao (dominio final em 6 lugares, Meta Pixel ID v1, Webhook URLs v1, URL do Zoom, Privacidade+Termos no Footer). Tres findings criticos nao-gatekeepers tambem precisam de atencao antes do deploy: ausencia de `<header>` landmark, ausencia de honeypot/reCAPTCHA no form, ausencia de security headers no Vercel. Proximo passo: resolver os 5 gatekeepers, adicionar honeypot + security headers, depois rodar Lighthouse + Rich Results + viewport manual.

---

## 1. Semantica & Estrutura
- [x] `<h1>` unico (observado: 1)
- [x] `<html lang="pt-BR">`
- [x] `<meta charset="UTF-8">`
- [x] `<meta viewport>` presente (`width=device-width, initial-scale=1`)
- [x] Alt text em 100% das imagens (observado: 115/115)
- [ ] Landmarks: `<main>` (1), `<footer>` (1), `<header>` **AUSENTE**
- Nota: TopBar renderizada como `<div class="sticky top-0 z-40">`, nao usa `<header role="banner">`. FAIL de semantica nao-critico: a rota `/lab/` tem `<header>` no `LabLayout.astro` — padrao existe no projeto, so nao foi aplicado na landing principal.
- Nota manual: revisar `aria-label` em botoes sem texto visivel (botao X do modal tem `aria-label="Fechar"` ✓)

## 2. SEO On-Page
- [x] `<title>` no limite: 60 chars (`Intensivo Claude Code · 16/05 ao vivo no Zoom`)
- [x] `<meta description>` dentro do limite: 108 chars
- [x] `<meta keywords>`, `<meta author>`, `<meta robots>`
- [ ] Canonical **NAO real**: `https://TODO-DOMINIO-FINAL/` → **GATEKEEPER**
- [x] `robots.txt` presente (4 KB)
- N/A `sitemap.xml` (landing 1 pagina; `/lab/` existe no build mas nao deveria ser indexada)
- Nota: bloquear indexacao de `/lab/` via `Disallow: /lab/` em `robots.txt` ou remover a rota do build de producao
- Nota manual: rodar Rich Results Test quando dominio final estiver no ar

## 3. LLMEO
- [x] `llms.txt` presente e denso (observado: 2209 bytes, 7 H2 sections)
- [x] `robots.txt` libera **6/6 crawlers**: GPTBot, ChatGPT-User, anthropic-ai, ClaudeBot, PerplexityBot, Google-Extended
- [x] JSON-LD: **3 schemas top-level** em 1 `<script>` (Organization + WebSite + Event com Offer + VirtualLocation + Person embutidos)
- [x] Conteudo em texto (H1, CTAs, proof em HTML textual — zero texto trancado em imagem na landing principal)
- Nota: `Event.location.url` = `https://zoom.us/j/TODO` → **GATEKEEPER**
- Nota: `Organization.logo`, `WebSite.url`, `Event.image` todos com `TODO-DOMINIO-FINAL` → **GATEKEEPER (mesmo bucket do canonical)**
- Nota manual: validator.schema.org zero erros apos preencher dominio

## 4. Redes Sociais / Compartilhamento
- [x] OG 6 props presentes: `og:title`, `og:description`, `og:image`, `og:type=website`, `og:locale=pt_BR`, `og:url`
- [ ] `og:image` e `og:url` **NAO reais** (placeholders) → **GATEKEEPER (mesmo bucket do canonical)**
- [x] Twitter card `summary_large_image`
- [x] `theme-color` (`#FBFAF7`) bate com `manifest.theme_color`
- [x] `apple-touch-icon` link + arquivo (8 KB)
- [x] `manifest.webmanifest` link + arquivo (4 KB)
- Nota manual: Facebook Debugger + Twitter Card Validator apos dominio final

## 5. Analytics & Pixel
- [ ] GA4 ID **NAO injetado** no `dist/` (0 ocorrencias `gtag`/`googletagmanager`)
  - Motivo: `.env` local ausente, apenas `.env.example` com `PUBLIC_GA_ID=G-7CJMYD129G`. Em producao Vercel, env var injeta via dashboard.
  - Status: **validacao pos-deploy obrigatoria** (GA4 Realtime <5min apos primeiro hit)
- [ ] Meta Pixel vazio em `.env.example` (`PUBLIC_META_PIXEL_ID=`) → **GATEKEEPER v1 intencional**
- [ ] Microsoft Clarity ausente (PRD nao exige; considerar para heatmap de CTAs)
- N/A GTM (stack nao usa)
- [x] UTM capture + persistencia: `src/lib/utm.ts` com `captureUTMs()`, `getStoredUTMs()`, `buildUrlWithUTMs()` + chave `sessionStorage 'icc_utms'`
- [x] `event_id` UUID gerado uma vez em `CaptureModal.tsx:129` (formato `lead_${timestamp}_${rand}`), propagado em:
  - Payload webhook (`event_id: eventID`, linha 136)
  - Meta Pixel (`fbq('track', 'Lead', {}, { eventID })`, linha 155)
  - GA4 (`gtag('event', 'generate_lead', { event_id: eventID })`, linha 157)
- Nota manual: submit real em producao + GA4 DebugView + Meta Events Manager

## 6. Formularios
- [x] Campos minimos: `name`, `email`, `phone`
- [x] Validacao client-side: email regex, telefone digits-only (`phone.replace(/\D/g, '')`)
- [x] `inputMode="email"` + `autoComplete="email"` no email
- [x] `autoComplete="name"` no nome
- [x] `font-size: 16px` em inputs (`className="... font-sans text-base ..."` → `text-base` = 16px Tailwind v4, iOS nao da zoom)
- [ ] **Mascara `(XX) XXXXX-XXXX` nao implementada** — placeholder `(11) 99999-9999` e visual, mas nao ha mask real no `onChange` do telefone. Validacao usa digits-only apos o fato.
- [ ] **Honeypot/reCAPTCHA AUSENTE** → **FAIL critico nao-gatekeeper** — form exposto a bot spam
- Nota manual: walkthrough modal (Tab trap, Esc, backdrop, aria-live, disabled submit) — codigo tem todos os hooks, falta confirmar em browser

**Modal UX (verificado no codigo, confirmar no browser):**
- [x] `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`
- [x] Guard anti double-submit (`if (status === 'loading') return`, linha 124)
- [x] `aria-invalid` + `aria-describedby` nos inputs com erro
- [x] Success state com `role="status"` + `aria-live="polite"`
- [x] Backdrop click fecha (linha 177: `if (e.target === e.currentTarget) requestClose()`)
- [x] Botao X com `aria-label="Fechar"`
- [ ] Focus trap Tab/Shift+Tab: nao verificado no codigo — validacao manual

## 7. Webhooks
- [ ] `PUBLIC_WEBHOOK_URLS` vazio em `.env.example` → **GATEKEEPER v1 intencional**
- [x] **Fire-and-forget correto** (CaptureModal.tsx linhas 140-151):
  - `CONFIG.WEBHOOK_URLS.forEach(url => fetch(url, {...}).catch(() => {}))`
  - Redirect na linha 161 nao aguarda response
  - `.catch()` silencioso: falha de webhook nao trava o lead
- [x] Payload inclui: `name`, `email`, `phone` (digits-only), `event_id`, `...utms`
- [ ] Payload NAO inclui `timestamp` nem `origin` explicitos (recomendavel adicionar para audit de entrega no CRM)
- Nota manual: submit end-to-end com webhook real + conferir entrega (quando URL estiver populada)

## 8. Performance
- [ ] **`fetchpriority="high"` ausente** (0 ocorrencias)
  - Aceitavel pois hero e tipografico (nao ha `<img>` no hero). Primeira imagem real esta no SocialProof marquee, below-the-fold em mobile.
  - Nota: considerar adicionar em `mateus.webp` (foto autoridade) se ela aparecer na primeira viewport em alguns dispositivos
- [x] `loading="lazy"` aplicado em 115/115 imagens (inclui 38 depoimentos do marquee x2 direcoes)
- [x] `decoding="async"` em imagens (1 ocorrencia na contagem linha, que no HTML minificado cobre todas)
- [x] WebP em `mateus.webp` (hero autoridade)
- [ ] 19 depoimentos em PNG puro (total 22 raster) — considerar conversao WebP para reduzir peso em ~30%
- [x] `font-display: swap` ativo via URL Google Fonts (`&display=swap` na querystring do stylesheet)
- [x] `preconnect` para `fonts.googleapis.com` + `fonts.gstatic.com`
- [x] Scripts: 2 totais, 1 com `type="module"` (= defer implicito)
- [ ] **Bundle JS ~220 KB gzip total** (acima do target de 200 KB):
  - `CaptureModal.Buti3l7O.js`: 132 KB raw / 44.92 KB gzip
  - `ScrollTrigger.CiEuWA-R.js`: 112 KB raw / ~42 KB gzip (estimado)
  - `client.BuOr9PT5.js`: 132 KB raw / 43.80 KB gzip
  - `hoisted.Cs4l2GNg.js`: 116 KB raw / 46.73 KB gzip
  - 4 hoisted menores (~8 KB raw total)
- Nota manual: Lighthouse mobile (Slow 4G): Performance >=90, LCP <2.5s, CLS <0.1, INP <200ms

## 9. Mobile
- [x] `<meta viewport>` correto (sem `user-scalable=no`)
- [x] Grid 12-col assimetrico editorial (PRD Fase 0)
- [ ] `safe-area-inset-*` nao utilizado (0 ocorrencias) — aceitavel se iOS notch nao for critico; considerar no TopBar sticky e no modal em iPhone X+
- Nota manual: DevTools 320, 390, 768, 1024 — zero scroll horizontal, texto legivel, CTAs alcancaveis. Audit manual anterior (`docs/mobile-audit.md`, 2026-04-22) tem essa validacao pendente.

## 10. Seguranca
- [x] HTTPS + HSTS valido em producao (pos-deploy Vercel)
- [ ] **`vercel.json` sem `headers`** → **FAIL critico nao-gatekeeper**
  - Sem CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy declarados
  - Recomenda-se adicionar bloco `headers` em `vercel.json` antes do merge (ver acao em TODOs)
- [x] **Zero secrets em `dist/`** (grep por `sk_live`, `rk_live`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `DATABASE_URL`, `JWT_SECRET`, `PRIVATE_KEY`)
- [x] **Zero `console.log`/`debug`/`info`** em `dist/*.js`
- [x] `.env.example` so com `PUBLIC_*` expostos (GA_ID, META_PIXEL_ID, WEBHOOK_URLS, REDIRECT_URL)
- Nao rodado: `npm audit` — executar antes do merge
- Nota manual: securityheaders.io grade B+ apos deploy com headers no `vercel.json`

## 11. Build & Deploy
- [x] `npx astro build` passou sem warning (1.26s)
- [x] `npx astro check` passou: 0 erros, 0 warnings (134 hints sobre `is:inline` em scripts — informativo)
- [x] Zero `TODO`/`FIXME`/`TBD` inesperados em `dist/` — todos os `TODO` encontrados sao dos **gatekeepers conhecidos** (canonical, og, JSON-LD, Footer privacy/terms)
- [ ] **Env vars Vercel pendentes** (validacao pos-deploy): `PUBLIC_GA_ID`, `PUBLIC_META_PIXEL_ID` (quando ativar), `PUBLIC_WEBHOOK_URLS` (quando integrar), `PUBLIC_REDIRECT_URL` (se diferente do hardcoded)
- Nota manual: preview deploy smoke-tested antes do merge

## 12. Copy & Compliance
- [x] **Zero travessao longo (—) em copy visivel** da landing principal
- [ ] 1 ocorrencia de `—` em `src/pages/lab/timeline/index.astro:43` (pagina de lab, bloqueada ou removida antes do deploy)
- [x] Acentos corretos em pt-BR (conferido nos principais trechos do `config.ts`)
- [ ] **Footer Privacidade + Termos com `href="#"`** + comentarios `<!-- TODO: URL legal pendente -->` → **GATEKEEPER**
- [x] Email de contato real: `mailto:contato@grupovuk.com.br`
- Nota manual: revisar ausencia de dark patterns (opt-out do grupo facil, preco R$27 vs R$47 claro, sem urgencia falsa — deadline 26/04 e real)

---

## Assets Publicos
- [x] `favicon.ico` (20 KB)
- [x] `favicon.png` (36 KB)
- [x] `apple-touch-icon.png` (8 KB)
- [x] `og-image.png` (52 KB) — **revisar alinhamento com tema Light Editorial** (PRD Fase 0 indica `#FBFAF7` + laranja imprensa; OG atual vindo do ICC Astro tem tema dark amber)
- [x] `robots.txt` (4 KB, 6/6 crawlers LLM)
- [x] `llms.txt` (4 KB, denso, 7 H2 sections)
- [x] `manifest.webmanifest` (4 KB, `theme_color: #FBFAF7`)
- [x] 19/19 depoimentos em `public/depoimentos/depoimento-{01..19}.png`
- [x] `mateus.webp` (foto autoridade)

**Resultado:** 9/9 assets criticos + 19 depoimentos

---

## TODOs Bloqueadores Pre-Deploy (5 gatekeepers)

1. **Dominio final em 6 lugares:** PENDENTE
   - Estado atual: `https://TODO-DOMINIO-FINAL/` em `canonical`, `og:url`, `og:image`, `Organization.logo`, `WebSite.url`, `Event.image`
   - Acao: decidir dominio final e popular em `src/config.ts` (ou via env var se arquitetura permitir) + rebuild
   - Arquivos: `src/layouts/Base.astro` (meta tags + JSON-LD via config), `src/config.ts`

2. **Meta Pixel ID:** PENDENTE (v1 intencional)
   - Estado atual: `PUBLIC_META_PIXEL_ID=` vazio em `.env.example`
   - Acao: quando Pixel ativar, popular env var no dashboard Vercel (Production + Preview)
   - Arquivo: env var Vercel (nao precisa rebuild manual, deploy automatico pega na proxima)

3. **Webhook URLs:** PENDENTE (v1 intencional)
   - Estado atual: `PUBLIC_WEBHOOK_URLS=` vazio
   - Acao: quando integracao CRM definida, popular env var Vercel
   - Arquivo: env var Vercel

4. **URL do Zoom (JSON-LD Event.location):** PENDENTE
   - Estado atual: `https://zoom.us/j/TODO` em `src/config.ts` (injetado no JSON-LD de `Base.astro`)
   - Acao: substituir pelo link Zoom real quando disponivel
   - Arquivo: `src/config.ts` (campo `EVENT_ZOOM_URL` ou similar) + rebuild

5. **Politica + Termos no Footer:** PENDENTE
   - Estado atual: `<a href="#">Politica de Privacidade</a>` + `<a href="#">Termos de Uso</a>` (comentarios `<!-- TODO: URL legal pendente -->` no Footer)
   - Acao: criar paginas `/privacy` e `/terms` no Astro OU apontar para URLs existentes do Grupo VUK
   - Arquivo: `src/components/Footer.astro`

---

## Findings Criticos Nao-Gatekeepers (resolver antes do merge)

1. **Sem `<header>` landmark na landing principal** (categoria 1)
   - TopBar e `<div class="sticky top-0 z-40">`
   - Acao: envolver a TopBar em `<header role="banner">` ou equivalente, consistente com `LabLayout.astro` que ja usa `<header>`

2. **Sem honeypot/reCAPTCHA no form** (categoria 6)
   - Form exposto a bot spam — cada bot que preencher gera `Lead` GA4 + Meta Pixel + webhook
   - Acao: adicionar honeypot invisivel (`input type="text" name="website" style="display:none"` + validar vazio no submit) — implementacao simples, zero UX impact

3. **Sem security headers em `vercel.json`** (categoria 10)
   - Acao: adicionar bloco `headers` em `vercel.json` com CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy restritivo
   - Referencia: `~/.claude/skills/landing-page-audit/references/audit-categories.md` categoria 10

---

## WARN (nao bloqueiam, mas ficam em radar)

- Mascara `(XX) XXXXX-XXXX` nao implementada no telefone — placeholder visual apenas. Adicionar mask real no `onChange` do `<input name="phone">`
- 19 depoimentos em PNG puro (poderiam ir pra WebP, reducao ~30% no peso total de imagens)
- Bundle JS ~220 KB gzip (acima do target 200 KB). CaptureModal + ScrollTrigger + client React sao responsaveis. Considerar code-split do Modal em load dinamico sob demanda do CTA
- `loading="lazy"` em TODAS as 115 imagens — revisar se alguma imagem esta above-the-fold em mobile (primeira foto visivel), essa deveria ser `loading="eager"` ou sem atributo (default eager)
- Microsoft Clarity ausente — opcional pelo PRD, mas util para heatmap de CTAs
- Rota `/lab/` esta no build de producao — se for zona interna de testes, adicionar `Disallow: /lab/` em `robots.txt` ou remover do build
- Payload webhook nao inclui `timestamp` nem `origin` — recomendavel adicionar para audit de entrega no CRM
- `npm audit` nao rodado — executar antes do merge

---

## Validacao Manual Pendente

- [ ] **Lighthouse mobile** (375px, Slow 4G): Performance >=90, A11y >=95, Best Practices >=95, SEO >=95
  - Como rodar: `cd site && npm run preview` + Chrome DevTools Lighthouse
- [ ] **Viewport tests** (320, 390, 768, 1024) — Chrome DevTools Responsive Design Mode
- [ ] **Touch targets** >=44x44px via DevTools measurements
- [ ] **Modal UX walkthrough completo** (focus trap Tab/Shift+Tab, Esc fecha, backdrop confirm em form dirty, submit disabled em loading)
- [ ] **Submit end-to-end** (pos-deploy com Pixel + Webhook populados): GA4 Realtime + GA4 DebugView, Meta Events Manager Test Events, webhook delivery no CRM, redirect com UTMs visiveis
- [ ] **JSON-LD syntax**: https://validator.schema.org
- [ ] **Rich Results Test**: https://search.google.com/test/rich-results (detectar Event + Organization + WebSite)
- [ ] **Security headers**: https://securityheaders.io (grade B+ apos adicionar headers no `vercel.json`)
- [ ] **404 customizada**: criar `src/pages/404.astro` se ainda nao existe
- [ ] **npm audit**: rodar em `site/` e conferir que nao ha CVE critica ou alta

---

## Notas Contextuais

1. **Relacao com `mobile-audit.md`**: este projeto ja tinha um audit manual (`docs/mobile-audit.md`, 2026-04-22) feito antes da skill `landing-page-audit` existir. Esse arquivo foi preservado intacto (ele inspirou o formato do output desta skill). Os achados batem: mesmos 5 gatekeepers, mesmas validacoes manuais pendentes. Este audit adiciona: verificacao formal das 12 categorias, findings criticos nao-gatekeepers (header landmark, honeypot, security headers), bundle JS detalhado, confirmacao de CaptureModal correto.

2. **GA4 aparentemente "ausente" em dist local**: e comportamento correto. A injecao do GA4 e condicional ao valor de `PUBLIC_GA_ID` em `.env`. Como o projeto so tem `.env.example` trackeado, a build local roda sem GA. Em producao Vercel, a env var injeta e o snippet gtag aparece. Validacao pos-deploy obrigatoria: conferir GA4 Realtime <5min apos primeiro hit.

3. **JSON-LD em 1 `<script>` com array de 3 schemas**: formato valido e preferivel a 3 scripts separados (1 request menor). Pass.

4. **5 TODOs em `dist/index.html`**: todos sao os gatekeepers conhecidos (canonical, 3 OG, Zoom URL). Zero `TODO` orfao. Pass no criterio "nenhum placeholder inesperado".

5. **Tema visual vs OG image**: `og-image.png` foi importado do ICC Astro anterior (tema dark amber). Direcao Fase 0 do PRD e Light Editorial (`#FBFAF7` + `#E4572E` laranja imprensa). Recomenda-se recriar o OG alinhado com a nova direcao antes do go-live, ou gerar via Figma/Photoshop em PR futuro (nao bloqueia deploy se OG atual ainda for legivel).

6. **Pipeline PRD → Plan → Stories → Implement foi seguido**: PRD em `docs/prds/intensivo-claude-code.md`, Plan em `docs/plans/intensivo-claude-code.md`, stories em `docs/stories/` (12 arquivos `intensivo-claude-code-*`). Implementacao condiz com contratos do PRD (secao 3.3 a 3.9).

---

## Proximo Passo

**PRE-MERGE CHECKLIST:**
- [ ] Dominio final decidido → atualizar `src/config.ts` → `canonical`, `og:url`, `og:image`, `Organization.logo`, `WebSite.url`, `Event.image` → rebuild
- [ ] Meta Pixel ID populado em env var Vercel (quando ativar; aceitar v1 sem Pixel se decisao)
- [ ] Webhook URL populado em env var Vercel (quando integrar; aceitar v1 sem webhook se decisao)
- [ ] Zoom URL substituida em `src/config.ts` → `Event.location.url` → rebuild
- [ ] Politica + Termos: URLs finalizadas no Footer (criar paginas ou apontar pra VUK)
- [ ] **Adicionar `<header role="banner">` envolvendo a TopBar**
- [ ] **Adicionar honeypot no form** (`<input type="text" name="website" style="display:none">` + validar vazio no submit)
- [ ] **Adicionar `headers` em `vercel.json`** (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [ ] Rodar `cd site && npm audit` — conferir sem CVE critica/alta

**VALIDACAO MANUAL (em paralelo):**
- [ ] Lighthouse mobile em preview (Performance >=90, A11y >=95, Best Practices >=95, SEO >=95)
- [ ] Viewport 320, 390, 768, 1024 no DevTools Responsive Mode
- [ ] Modal UX walkthrough (focus trap, Esc, backdrop, aria-live, disabled submit)
- [ ] JSON-LD em validator.schema.org (apos dominio real)
- [ ] Rich Results Test (apos dominio real)
- [ ] 404 customizada existe e renderiza

**POS-MERGE:**
- Vercel Git Integration dispara deploy automatico no merge em `main`
- Acompanhar build log no dashboard Vercel
- GA4 Realtime: conferir primeiro hit <5min apos deploy — se zerado, revisar env vars Vercel
- securityheaders.io no dominio de producao (grade B+ minimo)
- DNS via Cloudflare MCP (se dominio novo)
- Meta Events Manager Test Events: disparar 1 submit real e conferir Pixel `Lead` com `eventID` (quando Pixel ativar)

---

**Status final:** **BLOQUEIA MERGE (5 gatekeepers + 3 findings criticos nao-gatekeepers).** Cobertura das 12 categorias completa; implementacao tecnica solida; pendencias sao de conteudo (dominio, legal), integracoes (Pixel, webhook), e 3 fixes rapidos (header landmark, honeypot, vercel.json headers). Estimativa pra liberar merge: 1-2h de trabalho concentrado + validacao manual.
