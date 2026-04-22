---
title: PRD — Intensivo Claude Code (Ajustes Pre-Deploy)
created: 2026-04-22
tags: [prd, landing, intensivo-claude-code, pre-deploy, ajustes]
status: draft
project: intensivo-claude-code-ajustes-pre-deploy
parent: docs/prds/intensivo-claude-code.md
---

# PRD: Intensivo Claude Code — Ajustes Pre-Deploy

> PRD de **ajustes** na landing `intensivo-claude-code` ja implementada. NAO e landing nova. Fase 0 (design), Phase 1 (research), Phase 2 (sections) ja foram resolvidos no PRD original em `docs/prds/intensivo-claude-code.md` e nao sao reabertos aqui. Escopo: resolver findings pre-deploy identificados no audit `docs/intensivo-claude-code-audit.md` (2026-04-22) + aplicar 3 ajustes concretos informados pelo stakeholder apos a audit. Leitura ≤ 5 minutos.

---

## 1. Contexto

- **Produto/marca:** Intensivo Claude Code — landing ja implementada, em `/Users/mateusdias/Documents/00 - Projetos/intensivo-claude-code-landing/`. Detalhes de produto, publico, proposta de valor, objetivo e metrica no PRD original.
- **Origem destes ajustes:** audit rodado via skill `landing-page-audit` em 2026-04-22 resultou em status `blocked` com 5 gatekeepers + 3 findings criticos nao-gatekeepers. Stakeholder (Mateus) respondeu com os valores concretos que faltavam (Pixel ID, Webhook URL, payload) e adicionou 3 ajustes de implementacao (mascara internacional, conversao WebP, remocao `/lab/`).
- **Janela de execucao:** mesma do PRD original — landing precisa ir ao ar **ate 24/04/2026**. Este PRD deve ser implementado em um unico dia de trabalho concentrado (estimativa 4-6h).
- **Stakeholders:**
  - **Decisao e validacao final:** Mateus Dias
  - **Execucao tecnica:** Squad Dev (implementer-sonnet para blocos M, implementer-haiku para blocos P)
  - **Validacao pos-deploy (analytics/pixel):** Squad Trafego apos go-live
- **Metrica norte:** audit pos-implementacao retornar status `clear` (zero gatekeepers, zero findings criticos).

---

## 2. Stack

Fixa pelo PRD original. **Nao alterar neste PRD.** Ver `docs/prds/intensivo-claude-code.md` secao 2.

Adicoes pontuais deste PRD ao `package.json`:
- `react-international-phone` (~15 KB gzip) — mascara internacional de telefone. Ver Bloco 2 para justificativa.

Nao adicionar:
- `libphonenumber-js` (nao precisa — `react-international-phone` ja cobre parsing)
- `framer-motion` (proibido universalmente)
- Qualquer lib de anti-spam pesada (`recaptcha`, `hcaptcha`) — honeypot basta para este volume de trafego

---

## 3. Secoes da pagina

Nenhuma secao nova. Alteracao escopada:

- [x] **TopBar** — envolver em `<header role="banner">` (Bloco 5.1)
- [x] **Footer** — Privacidade + Termos apontando para paginas reais (gatekeeper externo, Bloco 6)
- [ ] Todas as demais secoes ficam intactas

---

## 4. Contratos de ajuste

### 4.1 Integracoes externas (env vars + payload)

#### Pixel ID Meta
- **Valor:** `310399388108164`
- **Acao:** popular `PUBLIC_META_PIXEL_ID=310399388108164` em env vars Vercel (Production **e** Preview)
- **Arquivo:** dashboard Vercel (nao requer rebuild manual — proximo deploy pega)
- **Snippet ja existe e e condicional** em `src/layouts/Base.astro` (segue `references/analytics-pattern.md` secao 2)
- **Validacao pos-deploy:** Meta Events Manager → Test Events → disparar 1 submit real → conferir `Lead` com `eventID` no formato `lead_<timestamp>_<random>`

#### Webhook URL VUKer
- **Valor:** `https://api-sigma.vuker.com.br/api/webhooks/inbound/9d2cd781-a63f-4a3d-8aea-edd3413b652a`
- **Acao:** popular `PUBLIC_WEBHOOK_URLS=https://api-sigma.vuker.com.br/api/webhooks/inbound/9d2cd781-a63f-4a3d-8aea-edd3413b652a` em env vars Vercel (Production e Preview)
- **Arquivo:** dashboard Vercel
- **Arquitetura ja existente:** `CONFIG.WEBHOOK_URLS` em `src/config.ts:17-19` faz `split(',')` → suporta multiplas URLs futuras via append com virgula
- **Fire-and-forget ja implementado** em `CaptureModal.tsx:140-151` com `.catch()` silencioso
- **Validacao pos-deploy:** submit real → verificar chegada do payload no CRM VUKer (lead aparece em < 10s)

#### Formato do payload
- **Contrato VUKer:** `{email, name?, phone?, utm_source?, utm_medium?, utm_campaign?, utm_content?, utm_term?}`
- **Payload atual** (CaptureModal.tsx:132-138):
  ```ts
  const payload = {
    name: name.trim(),
    email: email.trim(),
    phone: phone.replace(/\D/g, ''),
    event_id: eventID,
    ...utms,
  };
  ```
- **Compatibilidade:** o spread `...utms` vem de `getStoredUTMs()` (`src/lib/utm.ts:49`) que retorna exatamente as 5 chaves canonicas GA4 (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) — **bate com o contrato VUKer**. Campo `event_id` e extra, aceito sem quebrar.
- **Ajuste tecnico:** nenhum — payload atual ja cumpre o contrato. Validar em teste ponta a ponta.

### 4.2 Mascara de telefone internacional

**Divergencia explicita do padrao canonico** `~/.claude/skills/landing-page-prd/references/modal-pattern.md:115-119` que prescreve `(XX) XXXXX-XXXX` + `inputMode="numeric"` + `autocomplete="tel-national"`. A divergencia e intencional: publico do Intensivo tem brasileiros no exterior + possiveis leads LATAM que vao aparecer apos tracao do canal. Documentar no CaptureModal com comentario explicando a divergencia.

**Lib escolhida:** `react-international-phone` (~15 KB gzip)
- **Por que:** dropdown de bandeira + auto-format + validacao por pais, integracao React simples, bundle pequeno
- **Alternativas consideradas:** `libphonenumber-js` (80 KB full, overkill); custom regex por pais (mais codigo, mais manutencao)

**Contrato do campo phone apos mudanca:**

| Aspecto | Valor |
|---|---|
| Formato visivel | `+55 (11) 99999-9999`, `+1 (555) 555-1234`, `+351 912 345 678`, etc. |
| Auto-deteccao de pais | sim, pelo prefixo digitado |
| Default de pais | Brasil (`+55`) |
| Armazenamento no state React | raw input do usuario (formatado) |
| Valor enviado no payload | **E.164** (`+5511999999999`) — formato internacional padrao |
| Atributos HTML | `inputMode="tel"`, `autoComplete="tel"` (remover `tel-national`) |
| Validacao no submit | minimo 8 digitos (menor numero nacional valido), maximo 15 (padrao ITU E.164) |

**Mudancas no codigo:**
- `site/package.json`: adicionar `"react-international-phone": "^3"` ou versao estavel mais recente
- `src/components/react/CaptureModal.tsx` linhas 291-298 (bloco do input phone): substituir `<input>` simples por `<PhoneInput>` da lib
- `src/components/react/CaptureModal.tsx`: importar CSS da lib (`import 'react-international-phone/style.css'`) + override de tokens visuais para bater com Fase 0 editorial (`border-rule`, `bg-page`, `font-sans text-base`)
- Payload (linha 135): substituir `phone.replace(/\D/g, '')` por valor E.164 direto do `PhoneInput` (o componente ja expoe esse formato via callback)
- Remover placeholder `(11) 99999-9999` do `<input>` atual (lib injeta placeholder contextual por pais)

**Impacto na validacao atual:** `validate()` precisa aceitar E.164 em vez de regex `\d{11}`. Stories do implementer devem atualizar esse ponto.

**Nao fazer:**
- Nao mostrar 2 campos separados (DDI + numero). Unico campo com mascara + bandeira.
- Nao esconder o dropdown de pais em mobile (importante para UX internacional).
- Nao inserir bandeira como emoji (poluicao visual, inconsistente com Fase 0 editorial). Usar fallback de iniciais do pais (`BR`, `US`, `PT`) ou SVG monocromatico se a lib permitir custom render.

### 4.3 Conversao de depoimentos para WebP

**Estado atual:**
- `mateus.webp` ja em WebP ✓
- 19 depoimentos em PNG: `public/depoimentos/depoimento-{01..19}.png` (total estimado 1-3 MB, dependendo de resolucao original)
- Assets nao convertidos (deliberadamente): `favicon.png` (fallback raster), `apple-touch-icon.png` (spec iOS exige PNG), `og-image.png` (compatibilidade com crawlers sociais)

**Mudanca:** converter **apenas os 19 depoimentos** para WebP com qualidade 85, substituicao direta sem fallback.

**Pipeline:**
1. Instalar `sharp` como devDependency (ja presente indiretamente via Astro, mas adicionar explicitamente para consistencia): `npm i -D sharp`
2. Criar `scripts/convert-depoimentos.mjs`:
   ```js
   import sharp from 'sharp';
   import { readdir } from 'fs/promises';
   import path from 'path';

   const dir = 'public/depoimentos';
   const files = (await readdir(dir)).filter((f) => f.endsWith('.png'));

   for (const f of files) {
     const input = path.join(dir, f);
     const output = path.join(dir, f.replace('.png', '.webp'));
     await sharp(input).webp({ quality: 85 }).toFile(output);
     console.log(`${f} -> ${path.basename(output)}`);
   }
   ```
3. Rodar uma vez: `node scripts/convert-depoimentos.mjs`
4. Update `src/config.ts:45-48` — trocar `.png` por `.webp` no `SOCIALPROOF_IMAGES`:
   ```ts
   SOCIALPROOF_IMAGES: Array.from(
     { length: 19 },
     (_, i) => `/depoimentos/depoimento-${String(i + 1).padStart(2, '0')}.webp`
   ),
   ```
5. Remover `.png` originais **apos** validar que os `.webp` renderizam corretamente (verificar em dev + preview)
6. Verificacao final: `ls public/depoimentos/*.webp | wc -l` deve retornar 19; tamanho total reduzido em ~60-70%

**Justificativa de nao usar `<picture>` com fallback:**
- Audience VUK e majoritariamente Chrome/Safari mobile (>95% suporta WebP nativo desde 2020)
- Marquee usa `<img>` simples, adicionar `<picture>` complica markup e motion (GSAP/CSS marquee espera `<img>` uniforme)
- Se algum navegador legado falhar, imagem quebrada e aceitavel (fallback automatico do browser renderiza alt text)

**Ganho esperado:**
- Reducao de peso ~60-70% em 19 imagens — impacto direto em LCP mobile (mesmo com `loading="lazy"`, menos bytes = renderizacao mais rapida quando entra viewport)
- Meta: bundle total de `public/depoimentos/` < 400 KB (provavelmente ~300-350 KB apos conversao)

### 4.4 Remocao da rota `/lab/`

**Estado atual:**
- `src/pages/lab/index.astro` — indice de experimentos
- `src/pages/lab/timeline/index.astro` — variantes da Timeline
- Build gera `dist/lab/index.html` + `dist/lab/timeline/index.html` — **rota publica acessivel**

**Decisao:** **remocao fisica** do `src/pages/lab/`. Motivos:
1. Bundle menor (evita 2 paginas em producao)
2. Zero vazamento de conteudo de teste para crawlers ou visitors curiosos
3. Historico preservado em git; se precisar, `git checkout <sha> -- src/pages/lab/` restaura
4. Opcao de `Disallow` em `robots.txt` mantem a rota acessivel via URL direta — fraco para producao de marca

**Acao:**
1. `rm -rf site/src/pages/lab/`
2. Rebuild: `npx astro build` — confirmar que `dist/lab/` **nao** existe
3. Ajustar `.gitignore` se houver referencia a `lab/` (nao deve haver)

**Ressalva:** se o Mateus quiser manter `/lab/` como staging interno de variantes futuras, alternativa e adicionar frontmatter de bloqueio em cada `.astro` do lab:
```astro
---
export const prerender = false; // ou redirecionar para 404 em prod
---
```
+ `Disallow: /lab/` no `robots.txt`. **Nao recomendado**, mas documentado como opcao B.

### 4.5 Findings criticos do audit (resolucoes P/M)

#### 4.5.1 `<header>` landmark na landing principal

**Estado atual:** `src/components/TopBar.astro` (ou inline no `index.astro`) renderiza `<div class="sticky top-0 z-40">`. Sem landmark semantica.

**Evidencia do padrao:** `src/layouts/LabLayout.astro` ja usa `<header class="sticky top-0 z-50 border-b border-rule bg-page/90 backdrop-blur">` — replicar estrutura.

**Mudanca:**
- Localizar o bloco da TopBar no `index.astro` (provavelmente inline, dada a ausencia de `<header>` no dist)
- Envolver em `<header>` (role implicito e `banner` quando `<header>` e descendente direto de `<body>`)
- Manter `class="sticky top-0 z-40"` e todo o conteudo interno intacto
- Validacao automatica no audit: `grep -c "<header" dist/index.html` deve retornar >= 1

**Complexidade:** P (pequena, < 80 linhas de diff).

#### 4.5.2 Honeypot no form

**Estado atual:** zero mecanismo anti-spam no `CaptureModal.tsx`. Form aberto a bots.

**Mudanca:** adicionar campo honeypot invisivel **dentro do `<form>`** entre os inputs reais:

```tsx
{/* Honeypot anti-spam. Bots preenchem automaticamente; humanos nao veem. */}
<input
  type="text"
  name="website"
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
  style={{
    position: 'absolute',
    left: '-9999px',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  }}
  value={honeypot}
  onChange={(e) => setHoneypot(e.target.value)}
/>
```

E no `handleSubmit`:
```ts
// Se honeypot preenchido, e bot. Fingir sucesso (redirect false) sem disparar tracking.
if (honeypot.trim().length > 0) {
  setStatus('success');
  return;
}
```

- Nome do campo: `website` ou `url` (nomes que bots assumem ser padrao de registro)
- **Nao** fazer: `display: none` (alguns bots detectam); `visibility: hidden` (idem). Posicionamento off-screen e o metodo confiavel
- **Nao** disparar tracking nem webhook para honeypot positivo — economia de eventos pagos Meta/GA4

**Complexidade:** P (< 30 linhas).

#### 4.5.3 Security headers em `vercel.json`

**Estado atual:** `vercel.json` presente na raiz mas sem bloco `headers`.

**Mudanca:** adicionar bloco `headers` ao `vercel.json` com politica conservadora mas compativel com as integracoes da landing:

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

**Racional por header:**
- **CSP:** `script-src` libera googletagmanager + Facebook (Pixel); `style-src` libera Google Fonts inline; `img-src` libera pixels de tracking + data URIs; `connect-src` libera GA4 analytics + Meta Pixel fbevents + **webhook VUKer** (`api-sigma.vuker.com.br`); `form-action` libera Sendflow (`sndflw.com`, URL do redirect atual)
- **X-Frame-Options DENY:** bloqueia iframe, evita clickjacking
- **X-Content-Type-Options nosniff:** impede MIME-sniffing, reduz XSS
- **Referrer-Policy strict-origin-when-cross-origin:** padrao moderno, envia origem completa apenas em navegacao mesma origem, so origem em cross
- **Permissions-Policy:** bloqueia API de hardware desnecessaria + opt-out de FLoC (`interest-cohort=()`)
- **HSTS com preload:** forca HTTPS por 2 anos, inclui subdominios

**Cuidado com `'unsafe-inline'` no `script-src`:** necessario porque o Astro inline scripts inline `is:inline` + gtag config. Longo prazo, substituir por `'strict-dynamic'` + nonces (fora do escopo deste PRD).

**Validacao:** apos deploy, rodar https://securityheaders.io/?q=<dominio-final> — meta de **grade B minimo, A+ desejavel**. Headers acima tipicamente dao A.

**Complexidade:** M (media, CSP requer iteracao — pode precisar ajuste apos observar bloqueios no DevTools Console pos-deploy).

### 4.6 Stories emitidas (para o `landing-page-create-plan`)

Este PRD espera gerar as seguintes stories no plan downstream:

| # | Titulo | Complexidade | Bloco | Dependencia |
|---|---|---|---|---|
| 01 | Populate env vars Vercel (Pixel ID + Webhook URL) | P | 4.1 | nenhuma — operacao de dashboard |
| 02 | Validar payload VUKer compatibilidade (test submit ponta a ponta) | P | 4.1 | Story 01 + deploy preview |
| 03 | Instalar `react-international-phone` + refactor `<input phone>` em CaptureModal | M | 4.2 | nenhuma |
| 04 | Script de conversao WebP + execucao + atualizar `SOCIALPROOF_IMAGES` | M | 4.3 | nenhuma |
| 05 | Remover `src/pages/lab/` + rebuild | P | 4.4 | nenhuma |
| 06 | Envolver TopBar em `<header>` | P | 4.5.1 | nenhuma |
| 07 | Adicionar honeypot no CaptureModal | P | 4.5.2 | pode paralelizar com 03 |
| 08 | Adicionar security headers em `vercel.json` | M | 4.5.3 | nenhuma — mas validar em preview deploy |

**Paralelizacao:** stories 03, 04, 05, 06, 07, 08 sao independentes entre si. Dispararias em 2 ondas:
- **Onda 1 (paralela):** 01, 03, 04, 05, 06, 07, 08
- **Onda 2 (depois do deploy preview):** 02

Tempo estimado: Onda 1 ~4h (sonnet + haiku paralelos); Onda 2 ~30min (validacao manual).

---

## 5. Pendencias externas (bloqueiam merge mas nao sao stories)

Os 4 gatekeepers abaixo dependem de decisao ou asset do Mateus/stakeholders. Nao entram como stories porque nao ha o que implementar ate valor ser definido. Devem ser resolvidos **em paralelo** com a implementacao dos blocos deste PRD.

1. **Dominio final** — necessario para popular `canonical`, `og:url`, `og:image`, `Organization.logo`, `WebSite.url`, `Event.image` em `src/config.ts`. Sem isso, o pre-merge nao libera.
   - Acao: Mateus decide dominio. Atualizar campo em `src/config.ts` (criar campo `DOMAIN` se ainda nao existir) + rebuild.

2. **URL do Zoom** — atualmente `https://zoom.us/j/TODO` no JSON-LD `Event.location.url`.
   - Acao: obter link real do Zoom. Popular em `src/config.ts` (campo `EVENT_ZOOM_URL`, novo) + usar em `Base.astro` ao montar JSON-LD.

3. **Politica de Privacidade + Termos de Uso** — Footer atualmente com `href="#"`.
   - Opcao A: criar paginas `/privacy` e `/terms` no Astro (implica 2 stories extras)
   - Opcao B: apontar para URLs existentes do Grupo VUK (grupovuk.com.br/privacidade, etc.) — se existirem, e o caminho rapido
   - Acao: Mateus decide. Atualizar `src/components/Footer.astro` com hrefs reais.

4. **OG image alinhada com Fase 0** — `og-image.png` atual vem do ICC Astro anterior (tema dark amber). Fase 0 do PRD original e Light Editorial (`#FBFAF7` + `#E4572E`).
   - Acao: decidir se recriar agora (Figma) ou aceitar o atual para o go-live de 24/04 e refazer em PR posterior. Nao e bloqueio hard — OG legivel funciona mesmo fora da direcao estetica.

**Timing:** gatekeepers 1, 2, 3 devem ser resolvidos **antes do merge em main**. Gatekeeper 4 pode ir pos-deploy.

---

## 6. Verificacao end-to-end

Checklist atomico para liberar merge (todos devem estar `x`):

### Automatizado (roda via `/landing-page-audit`)
- [ ] `npx astro build` sem warning em 100% das rodadas
- [ ] `npx astro check` zero erros
- [ ] `dist/lab/` **nao** existe
- [ ] `dist/depoimentos/*.webp` — 19 arquivos presentes; `dist/depoimentos/*.png` — zero arquivos
- [ ] `<header>` landmark presente em `dist/index.html`
- [ ] Honeypot `<input name="website"` presente no bundle de CaptureModal
- [ ] `vercel.json` com bloco `headers` contendo os 6 headers (CSP, X-Frame, X-Content, Referrer, Permissions, HSTS)
- [ ] Canonical absoluto real (nao `TODO-DOMINIO-FINAL`)
- [ ] OG URL/image apontam para dominio real
- [ ] Event.location.url no JSON-LD nao contem `TODO`
- [ ] Footer: hrefs reais para Privacidade + Termos (nao `href="#"`)

### Manual
- [ ] Meta Pixel ID injetado em env var Vercel Production e Preview
- [ ] Webhook URL injetada em env var Vercel Production e Preview
- [ ] Submit end-to-end em **preview deploy**:
  - Preencher form com numero BR (`+55 11 9...`) e numero internacional (`+1 555...`)
  - Conferir Meta Events Manager Test Events: `Lead` com `eventID`
  - Conferir GA4 Realtime: `generate_lead` com mesmo `event_id`
  - Conferir webhook VUKer: payload chegou com todos os campos (`email`, `name`, `phone` em E.164, `event_id`, 5 UTMs quando aplicavel)
  - Conferir redirect Sendflow recebeu UTMs na query string
- [ ] Lighthouse mobile (375px, Slow 4G): Performance >= 90, A11y >= 95, Best Practices >= 95, SEO >= 95
- [ ] Viewport 320, 390, 768, 1024 — zero scroll horizontal
- [ ] securityheaders.io no dominio de producao: grade **A** ou **B** minimo (CSP evaluator: sem `'unsafe-eval'`, sem wildcards em `script-src`)
- [ ] Modal walkthrough: Tab/Shift+Tab confinados, Esc fecha, backdrop `confirm()` em form sujo, `aria-live` nos erros, submit `disabled` em loading
- [ ] **Novo audit via `/landing-page-audit`** retorna status `clear`

---

## 7. Checklist pre-deploy

Referencia: `~/.claude/CLAUDE.md` (pre-deploy 13 itens) + `docs/intensivo-claude-code-audit.md` (audit pos-implementacao).

---

## 8. Fora do escopo deste PRD

- **Copy** de qualquer secao (PRD de ajustes nao toca copy) — se algo precisar mudar, acionar `copywriting` ou `hooks-and-angles`
- **Fase 0 (design)** — congelada no PRD original
- **Arquitetura de secoes** — nenhuma secao nova nem reordenada
- **Criacao das paginas `/privacy` e `/terms`** — se decisao for Opcao A (ver Pendencia #3), gerar PRD separado ou story solta
- **Recriacao da OG image** — ver Pendencia #4. Se feito, e tarefa de design (Figma), nao de dev
- **SVG hygiene checks** (scripts/SMIL/reduced-motion) adicionados recentemente a `landing-page-audit` — validar em audit pos-implementacao; se houver finding, virar PRD separado
- **Code-split do CaptureModal** para reduzir bundle JS dos ~220 KB gzip atuais — otimizacao futura, nao pre-deploy
- **Substituir `'unsafe-inline'` no CSP por `'strict-dynamic'` + nonces** — otimizacao de seguranca de longo prazo
- **Microsoft Clarity** — PRD original nao exigiu; pode entrar em PRD futuro se heatmap virar prioridade
- **`@gsap/react`** — landing atual usa GSAP direto em `.astro`, nao em React islands, entao nao precisa do helper oficial. Se migrar GSAP para dentro de React component, adicionar a dependencia (nao neste PRD)

---

## Referencias canonicas (nao duplicar conteudo — apenas consultar)

- `docs/prds/intensivo-claude-code.md` — PRD original (stack, Fase 0, sections, integracoes)
- `docs/intensivo-claude-code-audit.md` — audit que originou este PRD
- `~/.claude/skills/landing-page-prd/references/analytics-pattern.md` — padroes GA4 + Pixel + UTM + webhook
- `~/.claude/skills/landing-page-prd/references/modal-pattern.md` — contrato do CaptureModal (e a divergencia explicita no Bloco 4.2)
- `~/.claude/CLAUDE.md` — regras criticas universais e pre-deploy checklist
