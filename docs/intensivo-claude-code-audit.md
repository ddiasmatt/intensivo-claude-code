---
title: Audit Pre-Deploy — Intensivo Claude Code
slug: intensivo-claude-code
created: 2026-04-23
tags: [audit, landing, intensivo-claude-code, pre-deploy]
status: partial
---

# Audit Pre-Deploy — Intensivo Claude Code

**Data:** 2026-04-23  
**Stack:** Astro 4 + React 18 islands + Tailwind 3 + GSAP + motion + tsparticles  
**Site dir:** `site/`  
**Build:** PASSOU (`npm run build`, 1.71s, 1 pagina)  
**Type check:** FALHOU (`npx tsc --noEmit`, 2 erros TS7006)  
**Dominio final:** `https://intensivo.grupovuk.com.br/`

---

## Resumo Executivo

Auditoria bloqueia deploy/merge. O build está gerando `site/dist`, mas o type check falha, `npm audit --production` acusa 1 vulnerabilidade high em Astro e o bundle final ainda tem problemas de semântica, compliance e performance. A landing auditada em `site/` também não cumpre a direção estética/copy do PRD atual: o PRD pede Editorial Light Serifado, mas o build entregue é dark, com Inter regular, glow/particles e copy do "Sistema 10x".

Principais blockers: type check quebrado, ausência de `<header>`, ausência de links legais e e-mail no footer, `og:image` relativo, descrição acima de 160 caracteres, payload de webhook sem `event_id`, `timestamp` e `origin`, `npm audit` high, e `site/` sem link local de Vercel para validar env vars.

---

## Tabela Consolidada de Checks

| # | Categoria | Task | Status | Valor observado |
|---|---|---|---|---|
| 0.1 | Build | Build sem warnings | ✅ PASS | `npm run build` passou; 1 pagina, 1.71s |
| 0.2 | Build | Type check zero erros | ❌ FAIL | `npx tsc --noEmit`: TS7006 em `CaptureModal.tsx:158` e `config.ts:10` |
| 0.3 | Build | `dist/` existe | ✅ PASS | `site/dist/` gerado com `index.html` e assets |
| 1.1 | Semantica | `<h1>` unico | ✅ PASS | `1` |
| 1.2 | Semantica | `<html lang="pt-BR">` | ✅ PASS | `lang="pt-BR"` |
| 1.3 | Semantica | Charset UTF-8 | ✅ PASS | `<meta charset="utf-8">` |
| 1.4 | Semantica | Viewport correto | ✅ PASS | `width=device-width, initial-scale=1, viewport-fit=cover` |
| 1.5 | Semantica | Alt text 100% imagens | ✅ PASS | `58/58` imagens com `alt` |
| 1.6 | Semantica | Landmarks header/main/footer | ❌ FAIL | `<main>` e `<footer>` presentes; `<header>` ausente |
| 1.7 | Semantica | SVG sem script/style/SMIL interno | ✅ PASS | Nenhum `<script>`, `<style>` ou `<animate>` dentro de SVG detectado |
| 1.8 | Semantica | SVG com `aria-hidden` ou `role/img` | ❌ FAIL | Alguns SVGs Lucide renderizados sem `aria-hidden`/label no HTML final |
| 1.9 | Semantica | `prefers-reduced-motion` no CSS | ✅ PASS | Regra presente em `site/dist/_astro/index.*.css` |
| 1.10 | Semantica | `@gsap/react` se GSAP usado em React | ➖ N/A | GSAP usado em script Astro, não em componente React |
| 1.11 | Semantica | `aria-label` em botoes sem texto | ✅ PASS | Botao X do modal tem `aria-label="Fechar"`; CTAs têm texto visivel |
| 1.12 | Semantica | Hierarquia H2-H6 sem pulos | ⚠️ WARN | H1/H2/H3 sem pulo grosseiro, mas cards/accordion geram muitos H3; revisar visualmente |
| 2.1 | SEO | `<title>` <= 60 chars | ✅ PASS | 58 chars |
| 2.2 | SEO | `<meta description>` <= 160 chars | ❌ FAIL | 165 chars |
| 2.3 | SEO | `<meta keywords>` presente | ✅ PASS | Presente |
| 2.4 | SEO | `<meta author>` presente | ✅ PASS | `Grupo VUK` |
| 2.5 | SEO | `<meta robots>` = `index, follow` | ⚠️ WARN | `index, follow, max-image-preview:large`; aceitavel, mas nao igual ao threshold estrito |
| 2.6 | SEO | Canonical absoluto e real | ✅ PASS | `https://intensivo.grupovuk.com.br/` |
| 2.7 | SEO | `robots.txt` presente | ✅ PASS | `site/dist/robots.txt`, 659 B |
| 2.8 | SEO | `sitemap.xml` presente | ✅ PASS | `site/dist/sitemap.xml` presente |
| 2.9 | SEO | Rich Results Test | ⏸ MANUAL | Pendente em `https://search.google.com/test/rich-results` |
| 3.1 | LLMEO | `llms.txt` presente | ✅ PASS | Presente |
| 3.2 | LLMEO | `llms.txt` > 500 bytes | ✅ PASS | 1792 bytes |
| 3.3 | LLMEO | `robots.txt` libera GPTBot | ✅ PASS | Presente |
| 3.4 | LLMEO | `robots.txt` libera anthropic-ai / ClaudeBot | ✅ PASS | Ambos presentes |
| 3.5 | LLMEO | `robots.txt` libera PerplexityBot | ✅ PASS | Presente |
| 3.6 | LLMEO | `robots.txt` libera ChatGPT-User | ✅ PASS | Presente |
| 3.7 | LLMEO | `robots.txt` libera Google-Extended | ✅ PASS | Presente |
| 3.8 | LLMEO | JSON-LD count >= 2 | ❌ FAIL | Apenas 1 `<script application/ld+json>` e schema principal `Event`; faltam top-level `Organization` + `WebSite` |
| 3.9 | LLMEO | Conteudo em texto | ✅ PASS | Conteudo principal renderiza como HTML textual |
| 3.10 | LLMEO | JSON-LD sintaxe valida | ⏸ MANUAL | Pendente em `https://validator.schema.org` |
| 4.1 | Social | `og:title` presente | ✅ PASS | Presente |
| 4.2 | Social | `og:description` presente | ✅ PASS | Presente |
| 4.3 | Social | `og:image` real 1200x630 | ❌ FAIL | Arquivo é 1200x630, mas meta usa URL relativa `/og-image.png`; threshold pede URL real |
| 4.4 | Social | `og:type` presente | ✅ PASS | `website` |
| 4.5 | Social | `og:locale=pt_BR` | ✅ PASS | `pt_BR` |
| 4.6 | Social | `og:url` real | ✅ PASS | `https://intensivo.grupovuk.com.br/` |
| 4.7 | Social | Twitter card large | ✅ PASS | `summary_large_image` |
| 4.8 | Social | `theme-color` presente | ✅ PASS | `#0A0A0B` |
| 4.9 | Social | `apple-touch-icon` + manifest | ⚠️ WARN | Link usa `/favicon.png`; não existe `apple-touch-icon.png` dedicado |
| 4.10 | Social | Facebook Debugger + Twitter Validator | ⏸ MANUAL | Pendente pós-preview/produção |
| 5.1 | Analytics | `PUBLIC_GA_ID` real | ✅ PASS | `G-7CJMYD129G` injetado no build local |
| 5.2 | Analytics | `PUBLIC_META_PIXEL_ID` real | ✅ PASS | Pixel real injetado via `.env` local |
| 5.3 | Analytics | Snippet Meta Pixel integro | ✅ PASS | `fbq init`, `connect.facebook.net`, `PageView` presentes |
| 5.4 | Analytics | Snippet GA4 integro | ✅ PASS | `gtag/js` + `gtag('config')` presentes |
| 5.5 | Analytics | Vercel env vars Production | ❌ FAIL | `vercel env ls` falhou: `site/` não está linkado a projeto Vercel |
| 5.6 | Analytics | Production smoke test | ⏸ MANUAL | Pendente em dominio/deploy |
| 5.7 | Analytics | Microsoft Clarity se declarado | ➖ N/A | PRD não declara Clarity como obrigatorio |
| 5.8 | Analytics | UTM capture + sessionStorage | ❌ FAIL | UTMs capturados em state, mas não persistidos em `sessionStorage` |
| 5.9 | Analytics | `event_id` compartilhado Meta/GA4 | ❌ FAIL | Meta/GA4 compartilham `eventID`, mas payload webhook não inclui `event_id` |
| 5.10 | Analytics | Submit real + DebugView + Events Manager | ⏸ MANUAL | Pendente pós-preview/produção |
| 6.1 | Formularios | Campos nome/email/telefone | ✅ PASS | Form tem os 3 campos |
| 6.2 | Formularios | Mascara `(XX) XXXXX-XXXX` | ✅ PASS | `maskPhone()` implementado |
| 6.3 | Formularios | Validacao client-side | ✅ PASS | Email regex + telefone 11 digitos |
| 6.4 | Formularios | Honeypot ou reCAPTCHA | ❌ FAIL | Ausente |
| 6.5 | Formularios | Inputs com font-size 16px | ✅ PASS | Base/input renderizam 16px; sem `text-sm` nos inputs |
| 6.6 | Formularios | CSS padronizado dos campos | ✅ PASS | Campos compartilham `h-12`, `rounded-xl`, `border`, `bg`, `px-4` |
| 6.7 | Formularios | Modal UX completo | ✅ PASS | Focus trap, Esc, backdrop confirm, aria-live, disabled loading presentes no codigo |
| 7.1 | Webhooks | Webhook Sigma em todo form | ✅ PASS | Unico form dispara para `api-sigma.vuker.com.br` por fallback/default |
| 7.2 | Webhooks | `PUBLIC_WEBHOOK_URLS` populado | ✅ PASS | `.env` local populado; `.env.example` ainda é placeholder |
| 7.3 | Webhooks | Fetch paralelo com `Promise.allSettled` | ❌ FAIL | Usa `forEach(fetch(...).catch())`, nao `Promise.allSettled` |
| 7.4 | Webhooks | Payload inclui event_id, UTMs, timestamp, origem | ❌ FAIL | Inclui UTMs; falta `event_id`, `timestamp` e `origin` |
| 7.5 | Webhooks | Falha nao bloqueia redirect | ✅ PASS | `.catch(() => {})` e redirect independente |
| 7.6 | Webhooks | Submit end-to-end real | ⏸ MANUAL | Pendente com CRM/Sigma |
| 8.1 | Performance | `fetchpriority="high"` no hero image | ➖ N/A | Hero é tipografico/React visual; sem hero `<img>` |
| 8.2 | Performance | `loading="lazy"` below-the-fold | ✅ PASS | Imagens de depoimento e Mateus têm lazy |
| 8.3 | Performance | Scripts tracking async/defer | ✅ PASS | GA async; Meta inline async loader; modules deferem |
| 8.4 | Performance | `font-display: swap` | ✅ PASS | Google Fonts com `display=swap` |
| 8.5 | Performance | Bundle JS < 200KB | ❌ FAIL | JS total ultrapassa 200KB; chunks grandes: `sparkles` 151KB, React 134KB, `proxy` 100KB |
| 8.6 | Performance | Pagina total < 1MB | ❌ FAIL | `site/dist` = 1.9MB |
| 8.7 | Performance | Lighthouse mobile | ⏸ MANUAL | Pendente contra preview/produção |
| 9.1 | Mobile | Viewport correto | ✅ PASS | `width=device-width, initial-scale=1, viewport-fit=cover` |
| 9.2 | Mobile | Sem larguras fixas top-level | ⚠️ WARN | Há `w-[2px]`, widths fixas e `h-*/w-*`; nao confirmado scroll horizontal |
| 9.3 | Mobile | Safe-area insets | ⚠️ WARN | Usa `viewport-fit=cover`, mas não há `env(safe-area-inset-*)` |
| 9.4 | Mobile | Viewports 320/390/768/1024 | ⏸ MANUAL | Pendente DevTools |
| 9.5 | Mobile | Touch targets >=44px | ⏸ MANUAL | Pendente medição visual |
| 10.1 | Seguranca | HTTPS + HSTS | ⏸ MANUAL | HSTS configurado no `vercel.json`, validar header em produção |
| 10.2 | Seguranca | CSP e headers | ✅ PASS | CSP, XFO, XCTO, Referrer, Permissions e HSTS em `site/vercel.json` |
| 10.3 | Seguranca | Zero secrets no bundle | ✅ PASS | Grep encontrou apenas strings internas do React; nenhum secret real |
| 10.4 | Seguranca | Zero `console.log` no JS buildado | ❌ FAIL | `console.log` aparece em bundle de `tsparticles/sparkles` |
| 10.5 | Seguranca | `npm audit` sem high/critical | ❌ FAIL | 4 vulns: 1 high em `astro`, 3 moderate em `vite/esbuild/@astrojs/react` |
| 10.6 | Seguranca | securityheaders.io B+ | ⏸ MANUAL | Pendente em produção |
| 11.1 | Build/Deploy | Build passou sem warning | ✅ PASS | Build passou |
| 11.2 | Build/Deploy | Type check zero erros | ❌ FAIL | 2 erros TS7006 |
| 11.3 | Build/Deploy | Zero TODO/FIXME/placeholder/TBD em `dist/` | ⚠️ WARN | Sem TODO literal; mas `.env.example` contém placeholders de GA/Pixel/Webhook |
| 11.4 | Build/Deploy | Env vars no dashboard Vercel | ❌ FAIL | `site/` não está linkado; `.vercel` está na raiz do repo |
| 11.5 | Build/Deploy | Preview smoke-tested | ⏸ MANUAL | Pendente |
| 11.6 | Build/Deploy | 404 customizada renderiza | ⏸ MANUAL | Não validado; `src/pages/404.astro` não encontrado |
| 12.1 | Copy/Compliance | Zero travessao longo em `src/` | ❌ FAIL | Em dash visivel no title de `src/pages/index.astro`; comentarios em `config.ts`/`gsap-init.ts` |
| 12.2 | Copy/Compliance | Acentos corretos pt-BR | ⚠️ WARN | `sabado`, `unica`, `automacao`, `voce` aparecem sem acento em copy/meta |
| 12.3 | Copy/Compliance | Footer Privacidade + Termos reais | ❌ FAIL | Footer não tem links legais |
| 12.4 | Copy/Compliance | Email de contato real | ❌ FAIL | Footer não expõe e-mail |
| 12.5 | Copy/Compliance | Sem dark patterns | ⏸ MANUAL | Copy parece defensavel, mas revisar jurídico/compliance |
| 13.1 | Clean Code | HTML semantico sem divs semanticas obvias | ✅ PASS | Heuristica não detectou `<div class="header|footer|main">` |
| 13.2 | Clean Code | Heading hierarchy | ⚠️ WARN | Sem pulo claro, mas vários H3 em islands/accordion precisam revisão visual |
| 13.3 | Clean Code | Nomenclatura sem `data/temp/foo` | ❌ FAIL | Heuristica pega `data` em `TimelineWrapper.tsx`/`timeline.tsx` |
| 13.4 | Clean Code | Zero `console.log` em `src/` | ✅ PASS | Nenhum `console.log` em source |
| 13.5 | Clean Code | Zero TODO/FIXME/codigo morto em comentarios | ✅ PASS | Nenhum TODO/FIXME relevante em `src/` |
| 13.6 | Clean Code | Zero numeros magicos JSX/CSS | ⚠️ WARN | Muitos valores arbitrarios Tailwind (`tracking-[...]`, `text-[...]`, `w-[2px]`) |
| 13.7 | Clean Code | Zero cores hardcoded fora tokens | ❌ FAIL | Hex/rgb hardcoded em `Base.astro`, `Final.astro`, `sparkles.tsx`, `hover-border-gradient.tsx` |
| 13.8 | Clean Code | Objetos/arrays inline JSX | ⚠️ WARN | Inline styles e arrays existem; revisar impacto de render |
| 13.9 | Clean Code | Imagens com width/height explicitos | ❌ FAIL | `57/58` imagens sem `width` e `height`; só `mateus.webp` tem dimensoes |
| 13.10 | Clean Code | Hover/focus com transition | ✅ PASS | Classes `transition*` amplamente presentes |
| 13.11 | Clean Code | Modal max-w universal + a11y | ✅ PASS | `max-w-md`, padding mobile, backdrop, Esc, focus trap, role dialog |
| 13.12 | Clean Code | Breakpoint 430px | ⏸ MANUAL | Pendente DevTools |
| 13.13 | Clean Code | Focus visible | ✅ PASS | Regra global `:focus-visible` e rings nos componentes |
| 13.14 | Clean Code | Contraste WCAG AA | ⏸ MANUAL | Pendente Lighthouse/contraste |
| A.1 | Assets | `favicon.ico` + `favicon.png` | ✅ PASS | Ambos presentes |
| A.2 | Assets | `apple-touch-icon.png` | ❌ FAIL | Arquivo dedicado ausente; link aponta para `favicon.png` |
| A.3 | Assets | `robots.txt`, `llms.txt`, manifest | ✅ PASS | Todos presentes |
| A.4 | Assets | `og-image.png` 1200x630 | ✅ PASS | 1200x630, 51KB |
| A.5 | Assets | Imagens referenciadas existem | ✅ PASS | Depoimentos, `mateus.webp`, favicon e OG existem |

**Legenda:** ✅ PASS · ❌ FAIL · ⚠️ WARN · ⏸ MANUAL · ➖ N/A

---

## Totais

| Status | Contagem |
|---|---:|
| ✅ Aprovados | 65 |
| ❌ Reprovados | 25 |
| ⚠️ Warnings | 11 |
| ⏸ Manuais pendentes | 12 |
| ➖ N/A | 2 |
| **Total de tasks** | **115** |

**Taxa de aprovação automatizada:** 64,4% (`65 / (65+25+11)`).

---

## Falhas por Categoria

### Build
- **0.2 Type check:** FAIL. `npx tsc --noEmit` falha por parâmetros implícitos `any` em `site/src/components/react/CaptureModal.tsx:158` e `site/src/config.ts:10`.

### Semantica & Estrutura
- **1.6 Landmarks:** FAIL. Falta `<header>` na landing principal. Arquivo: `site/src/pages/index.astro` ou `site/src/components/sections/TopBar.astro`.
- **1.8 SVG a11y:** FAIL. SVGs Lucide em componentes renderizam sem `aria-hidden` ou label.

### SEO / Social / LLMEO
- **2.2 Description:** FAIL. `meta description` tem 165 caracteres; target <=160.
- **3.8 JSON-LD:** FAIL. Só há 1 script/schema principal; faltam `Organization` e `WebSite` top-level.
- **4.3 OG image:** FAIL. Meta usa `/og-image.png`; deve ser absoluta (`https://intensivo.grupovuk.com.br/og-image.png`).

### Analytics, Form e Webhook
- **5.5/11.4 Vercel env:** FAIL. `site/` não está linkado a Vercel; `.vercel/project.json` está na raiz do repo.
- **5.8 UTM:** FAIL. UTMs não persistem em `sessionStorage`.
- **5.9/7.4 event_id:** FAIL. `eventID` existe para Meta/GA4, mas não entra no payload Sigma.
- **6.4 Anti-spam:** FAIL. Não há honeypot/reCAPTCHA.
- **7.3 Webhook paralelo:** FAIL. Usa `forEach(fetch)` em vez de `Promise.allSettled`.

### Performance
- **8.5 Bundle JS:** FAIL. Chunks grandes (`sparkles`, React, proxy/motion) colocam JS acima do target.
- **8.6 Peso total:** FAIL. `site/dist` tem 1.9MB, acima do target de 1MB.

### Segurança
- **10.4 console.log:** FAIL. Bundle de terceiros inclui `console.log`.
- **10.5 npm audit:** FAIL. `astro <=6.1.5` high; `vite/esbuild/@astrojs/react` moderate.

### Copy & Compliance
- **12.1 Em dash:** FAIL. Em dash visivel no title.
- **12.3 Legal:** FAIL. Footer não tem Privacidade/Termos.
- **12.4 Contato:** FAIL. Footer não expõe e-mail.
- **PRD drift:** FAIL contextual. PRD pede Editorial Light Serifado, Fraunces + Inter Tight, light theme; build é dark, Inter regular, particles/glow e copy antiga do Sistema 10x.

### Clean Code / Assets
- **13.7 Cores hardcoded:** FAIL. Hex/rgb fora de tokens.
- **13.9 Imagens sem dimensoes:** FAIL. 57 imagens sem `width`/`height`.
- **A.2 apple-touch-icon:** FAIL. Arquivo dedicado ausente.

---

## TODOs Bloqueadores Pre-Deploy

1. **Corrigir type check**
   - Estado atual: TS7006 em `CaptureModal.tsx:158` e `config.ts:10`.
   - Ação: tipar `WEBHOOK_URLS`/callbacks e rodar `npx tsc --noEmit`.
   - Arquivos: `site/src/config.ts`, `site/src/components/react/CaptureModal.tsx`.

2. **Resolver drift do PRD**
   - Estado atual: `site/` não reflete a direção do PRD `docs/prds/intensivo-claude-code.md`.
   - Ação: decidir se `site/` deve ser a v1 dark atual ou migrar para Editorial Light. Se for v1, atualizar PRD/docs; se for PRD atual, refatorar UI/copy.
   - Arquivos: `site/src/**`, `docs/prds/intensivo-claude-code.md`.

3. **Completar compliance do footer**
   - Estado atual: sem Privacidade, Termos e e-mail.
   - Ação: adicionar links reais e contato.
   - Arquivo: `site/src/components/sections/Footer.astro`.

4. **Corrigir integrações de lead**
   - Estado atual: webhook recebe nome/email/telefone/UTMs, mas não recebe `event_id`, `timestamp` nem `origin`.
   - Ação: incluir campos no payload e usar o mesmo event ID de Meta/GA4.
   - Arquivo: `site/src/components/react/CaptureModal.tsx`.

5. **Adicionar anti-spam**
   - Estado atual: form sem honeypot/reCAPTCHA.
   - Ação: adicionar honeypot invisivel e descartar submit se preenchido.
   - Arquivo: `site/src/components/react/CaptureModal.tsx`.

6. **Corrigir Vercel link/env validation**
   - Estado atual: `vercel env ls` falha em `site/`; `.vercel` está na raiz.
   - Ação: linkar `site/` ao projeto correto ou rodar Vercel a partir da raiz com configuração consistente.
   - Arquivo: `.vercel/project.json` / setup local.

7. **Corrigir npm audit high**
   - Estado atual: `npm audit --production` retorna high em Astro e moderate em Vite/esbuild.
   - Ação: planejar upgrade de Astro/Vite ou aceitar risco explicitamente se só afeta dev/server paths não usados pelo output estático.
   - Arquivo: `site/package.json`, `site/package-lock.json`.

---

## Validação Manual Pendente

- [ ] Lighthouse mobile contra preview/produção: Perf >=90, A11y >=95, Best Practices >=95, SEO >=95.
- [ ] Viewports 320/390/768/1024: zero scroll horizontal e CTAs alcançáveis.
- [ ] Touch targets >=44x44px.
- [ ] JSON-LD em `https://validator.schema.org`.
- [ ] Rich Results em `https://search.google.com/test/rich-results`.
- [ ] Facebook Debugger e Twitter Card Validator.
- [ ] Submit end-to-end: GA4 DebugView, Meta Events Manager, entrega Sigma, redirect com UTMs.
- [ ] Security headers em `https://securityheaders.io`.
- [ ] HSTS/HTTPS no domínio final.
- [ ] 404 customizada em `/rota-inexistente`.
- [ ] Revisão de compliance/dark patterns.
- [ ] Contraste WCAG AA.

---

## Notas Contextuais

- O audit anterior foi arquivado em `docs/intensivo-claude-code-audit-2026-04-23.md` antes de escrever este arquivo.
- `npx astro check` não rodou porque `@astrojs/check` não está instalado e o CLI pediu instalação interativa. Para não alterar dependências durante a auditoria, usei `npx tsc --noEmit` como type check local.
- `npm audit --production` precisou de rede e foi reexecutado com permissão escalada. Resultado: 4 vulnerabilidades, incluindo 1 high.
- O grep de secrets em `dist/` encontra strings internas do React como `__SECRET_INTERNALS_DO_NOT_USE...`; isso não é segredo operacional.
- O build local usa `.env` real e por isso GA4/Meta/Sigma aparecem no `dist`. O `.env.example` ainda contém placeholders, o que é aceitável como exemplo, mas deve ser mantido claramente separado de validação de produção.

---

## Próximo Passo

**PRE-MERGE CHECKLIST:**
- [ ] Corrigir type check.
- [ ] Resolver o drift PRD vs implementação.
- [ ] Adicionar header landmark.
- [ ] Adicionar links legais + e-mail no footer.
- [ ] Corrigir payload Sigma com `event_id`, `timestamp`, `origin`.
- [ ] Adicionar honeypot.
- [ ] Corrigir `og:image` absoluto.
- [ ] Linkar `site/` no Vercel ou ajustar fluxo de env validation.
- [ ] Tratar `npm audit` high.

**VALIDAÇÃO MANUAL:**
- [ ] Lighthouse, viewports, touch targets, schema/rich results, social debuggers, submit end-to-end e securityheaders.io.

**Status final:** BLOQUEIA MERGE (9 gatekeepers + 12 validações manuais pendentes).

---

## Atualizacao Pos-Correcao — 2026-04-23 21:51

Correcoes aplicadas em `site/` sem alterar a paleta dark/amber:

- **Type check corrigido:** `npx tsc --noEmit` passa sem erros.
- **Build corrigido:** `npm run build` passa e gera 2 paginas (`/` + `/404.html`).
- **PRD reconciliado:** `docs/prds/intensivo-claude-code.md` agora declara `site/` como v1 dark vigente; Editorial Light fica fora do escopo desta correcao.
- **Semantica:** `TopBar` agora renderiza dentro de `<header role="banner">`.
- **SEO/social:** description reduzida para 133 chars; `og:image` e `twitter:image` absolutos.
- **LLMEO/schema:** JSON-LD agora renderiza 3 scripts separados: `Organization`, `WebSite`, `Event`.
- **Analytics/webhook:** payload Sigma inclui `event_id`, `timestamp`, `origin` e UTMs; Meta/GA4 usam o mesmo `event_id`.
- **UTMs:** captura persiste em `sessionStorage`.
- **Anti-spam:** honeypot invisivel adicionado ao formulario.
- **Webhook fire-and-forget:** envio usa `Promise.allSettled` sem bloquear redirect.
- **Compliance:** footer ganhou links de Privacidade, Termos e e-mail `contato@grupovuk.com.br`.
- **Assets:** `apple-touch-icon.png` dedicado criado.
- **404:** pagina customizada criada.
- **Performance:** `SparklesCore`/tsparticles removido do Final CTA; chunk `sparkles.*.js` saiu do build.
- **Vercel:** `site/.vercel` aponta para a config local da raiz; `vercel env ls` acessa o projeto e confirma GA/Meta em Production/Preview/Development.

Checks ainda pendentes/aceitos:

- **npm audit:** permanece com 1 high em Astro e 3 moderate em Vite/esbuild; decisao do plano foi mitigar/documentar e nao fazer upgrade breaking antes do go-live.
- **Vercel env:** `PUBLIC_WEBHOOK_URLS` e `PUBLIC_REDIRECT_URL` nao aparecem no dashboard; o codigo possui fallback de producao para Sigma/Sendflow.
- **Peso total:** `site/dist` ainda tem 1.8MB, acima do target estrito de 1MB, principalmente por imagens/depoimentos e runtime React/motion.
- **Imagens:** 57 imagens seguem sem `width`/`height`; nao foi corrigido para evitar retrabalho amplo nos marquees.
- **Validacoes manuais:** Lighthouse, viewports, touch targets, schema validator, Rich Results, social debuggers, securityheaders.io e submit end-to-end continuam pendentes.

**Status pos-correcao:** AUDITORIA PARCIAL. Blockers tecnicos imediatos foram corrigidos; liberacao final ainda depende das validacoes manuais e da aceitacao explicita do risco `npm audit`/peso.
