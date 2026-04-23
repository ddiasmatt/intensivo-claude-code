---
title: Meta Pixel + Conversions API no próprio código (Vercel serverless)
created: 2026-04-23
tags: [research, tracking, meta-ads, capi, pixel, advanced-matching, vercel]
status: pronto-para-implementar
project: intensivo-claude-code
owner: Artur (Head de Gestão)
veredito: VIAVEL
---

# Meta Pixel + Conversions API no próprio código (Vercel serverless)

> [!tldr] TL;DR
> 1. Sim, dá pra fazer tudo dentro do nosso repo, sem GTM server-side, sem CAPI Gateway, sem plataforma terceira.
> 2. A peça que falta é uma **Astro API route** rodando em **Vercel Serverless Function** (Node). É 1 arquivo novo em `src/pages/api/capi.ts` + mudar `output: 'static'` para `'hybrid'` + adapter `@astrojs/vercel`.
> 3. Payload mínimo viável alcança EMQ 7+. Com order bump no checkout (recoleta dados do Stripe/Hotmart) dá pra passar de 9.
> 4. Deduplicação já está 90% feita. O `eventID` que o `CaptureModal.tsx` gera (`lead_<ts>_<rand>`) precisa só ser reusado no POST `/api/capi` pro server espelhar o Pixel.
> 5. Custo Vercel: insignificante (Hobby plan aguenta o lançamento inteiro, event de Lead é milissegundos).
> 6. Risco: access token em env var no Vercel. Rotacionar a cada 60 dias. Nunca expor no client.

---

## 1. Estado atual (diagnóstico)

Li `site-v2/src/layouts/Base.astro`, `site-v2/src/components/react/CaptureModal.tsx` e `astro.config.mjs`. O que já existe:

| Peça | Status | Observação |
|---|---|---|
| Meta Pixel (browser) | OK | `fbq('init')` + `fbq('track','PageView')` injetados em `Base.astro:77`. Condicional em `PUBLIC_META_PIXEL_ID`. |
| Evento Lead | OK | `fbq('track','Lead',{},{eventID})` em `CaptureModal.tsx:161`. |
| `event_id` para dedup | OK | Gerado em `CaptureModal.tsx:135` como `lead_<ts>_<rand>`. |
| GA4 | OK | `gtag('event','generate_lead',{event_id})` com mesmo ID. |
| Webhook de captura | OK | Fire-and-forget em `CaptureModal.tsx:148-156`. |
| CSP `connect-src` | OK | `vercel.json:10` permite `facebook.com`. Vai continuar aceitando `graph.facebook.com` sem mexer. |
| **Conversions API (server)** | **FALTA** | Zero. |
| **Advanced Matching (Pixel)** | **FALTA** | `fbq('init', ID)` sem segundo arg de AM. Evento Lead manda `{}` como custom_data. Meta não está vendo email/phone no browser. |
| **Action source** | N/A | Será `website` no payload server. |
| `output` do Astro | `static` | Vai precisar mudar pra `hybrid` pra poder ter API route. Páginas continuam pré-renderizadas. |

Conclusão: a base está sólida, `event_id` já circula corretamente. Só falta a ponta servidor e o enriquecimento do payload.

---

## 2. Por que CAPI (e não só Pixel)

Pixel sozinho perde entre 30% e 60% dos eventos em 2026. Motivos:

- iOS 17+ + Safari: ITP corta cookies de terceiros em 7 dias.
- uBlock/AdGuard bloqueiam `connect.facebook.net` em ~25% dos desktops.
- Brave, Firefox strict, Edge Balanced: bloqueiam `fbevents.js` por padrão.
- Consent banners (não é nosso caso ainda, mas vai ser).

CAPI é server-to-server. Não depende do browser, não é bloqueável por extensão, não é afetado por ITP. **Mas não substitui o Pixel**, ele **complementa**. O par Pixel + CAPI com `event_id` igual em ambos faz o Meta:
1. Preferir o evento que chegou primeiro (geralmente browser, latência menor).
2. Usar o outro como fallback quando o primeiro falha.
3. Mesclar `user_data` dos dois pra melhorar o EMQ (Event Match Quality).

Fonte: [Handling Duplicate Pixel and Conversions API Events](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/).

---

## 3. Arquitetura proposta

```
browser (CaptureModal.tsx)
│
├─► Pixel fbq('track','Lead', {...AM}, {eventID})         (já existe, falta AM)
│
├─► POST /api/capi        (com payload enriquecido)       (NOVO)
│       │
│       └─► Vercel Serverless Function (Node)
│              │
│              ├─► hash SHA-256 (em, ph, fn, ln, ct, country)
│              ├─► lê client_ip_address do header Vercel
│              ├─► lê client_user_agent do header request
│              └─► POST https://graph.facebook.com/v21.0/{PIXEL_ID}/events
│                     Bearer: CAPI_ACCESS_TOKEN
│
└─► webhook VUKer (já existe, continua funcionando)
```

**Fluxo resumido:**
1. Usuário envia formulário do modal.
2. Modal gera `eventID` uma única vez.
3. Modal dispara **em paralelo**: `fbq` (Pixel), `POST /api/capi` (server), webhook VUKer.
4. A função serverless recebe, hasheia PII, monta payload, posta no endpoint CAPI do Meta.
5. Redirect acontece sem esperar resposta dos 3 canais.

Meta desduplica Pixel + CAPI dentro de 48h pelo par (`event_name`, `event_id`).

---

## 4. Payload completo (Lead event)

Endpoint: `POST https://graph.facebook.com/v21.0/{PIXEL_ID}/events?access_token={TOKEN}`

```json
{
  "data": [
    {
      "event_name": "Lead",
      "event_time": 1714000000,
      "event_id": "lead_1714000000_a3f9x2k1",
      "event_source_url": "https://icc.thesociety.com.br/lpv2/",
      "action_source": "website",
      "user_data": {
        "em": ["<sha256(lowercase(trim(email)))>"],
        "ph": ["<sha256(digits_only(phone_with_country_code))>"],
        "fn": ["<sha256(lowercase(trim(first_name)))>"],
        "ln": ["<sha256(lowercase(trim(last_name)))>"],
        "country": ["<sha256('br')>"],
        "external_id": ["<sha256(email)>"],
        "fbp": "fb.1.<timestamp>.<random>",
        "fbc": "fb.1.<timestamp>.<fbclid>",
        "client_ip_address": "201.x.x.x",
        "client_user_agent": "Mozilla/5.0 ..."
      },
      "custom_data": {
        "lead_source": "landing_intensivo",
        "utm_source": "meta_ads",
        "utm_campaign": "captacao-lote1",
        "utm_medium": "cpc",
        "utm_content": "creative-01",
        "utm_term": "claude-code"
      }
    }
  ],
  "test_event_code": "TEST12345"
}
```

`test_event_code` só em ambiente de teste. Remover em produção.

---

## 5. Advanced Matching: todos os parâmetros úteis

### 5.1 Ranking de impacto no EMQ (fonte: Meta + Aimerce + AGrowth)

| Parâmetro | Nome CAPI | Hash? | Impacto EMQ | Temos hoje? |
|---|---|---|---|---|
| Email | `em` | SHA-256 | **ALTO (+4 pontos)** | Sim no modal |
| Click ID (fbclid) | `fbc` | Não | **ALTO** | Não capturamos |
| Phone | `ph` | SHA-256 | ALTO (+3) | Sim no modal (E.164) |
| Browser ID | `fbp` | Não | MÉDIO | Não lemos cookie |
| External ID | `external_id` | SHA-256 (recomendado) | MÉDIO | Podemos derivar do email |
| Country | `country` | SHA-256 (2 letras) | MÉDIO | Temos (E.164) |
| First name | `fn` | SHA-256 | BAIXO | Split do `name` |
| Last name | `ln` | SHA-256 | BAIXO | Split do `name` |
| City | `ct` | SHA-256 | BAIXO | Não |
| State | `st` | SHA-256 | BAIXO | Não |
| Zip | `zp` | SHA-256 | BAIXO | Não |
| IP | `client_ip_address` | Não | MÉDIO | Headers Vercel |
| User agent | `client_user_agent` | Não | MÉDIO | Headers request |
| Date of birth | `db` | SHA-256 | BAIXO | Não coletamos |
| Gender | `ge` | SHA-256 | BAIXO | Não coletamos |

### 5.2 O que vamos mandar no evento Lead da landing

Dados temos disponíveis na captura (formulário + browser + request):

- `em` (hashed email)
- `ph` (hashed E.164 normalizado pra só dígitos)
- `fn`, `ln` (split do campo `name` por primeiro espaço)
- `country` (hashed de `br` por padrão, ou derivado do DDI do telefone via `react-international-phone`)
- `external_id` (hashed do email, pra permitir join server-side depois)
- `fbp` (lê cookie `_fbp` no browser, manda no body)
- `fbc` (lê cookie `_fbc` se existir; se não, tenta construir do `fbclid` da URL)
- `client_ip_address` (header `x-forwarded-for` no Vercel)
- `client_user_agent` (header `user-agent`)

Estimativa de EMQ com esse set: **7.5 a 8.5 no evento Lead**. No evento Purchase (back-end do evento = AI Society) a gente pega mais: city/state/zip do checkout, DOB se pedir no form, e o score passa de 9.

### 5.3 Normalização (regras oficiais Meta)

Antes de hashear:

- **email**: `trim` + `toLowerCase`. Não remover pontos nem "+aliases" (`john.doe+tag@gmail.com` fica como está).
- **phone**: remover **TUDO** que não é dígito (inclusive `+`). Manter código do país. `+55 11 99999-9999` → `5511999999999`.
- **first_name / last_name**: `trim` + `toLowerCase`. Sem acento não é requisito oficial, mas melhora match (`josé` casa com `jose` no Meta em ~80% dos casos, então melhor remover acento antes).
- **country**: 2 letras ISO lowercase. `BR` → `br`.
- **city**: `trim` + `toLowerCase` + remover espaços. `"São Paulo"` → `"saopaulo"`.
- **state**: 2 letras ISO lowercase. `"SP"` → `"sp"`.
- **zip**: só dígitos. `"01234-567"` → `"01234567"`.
- **db**: `YYYYMMDD`. `"01/05/1990"` → `"19900501"`.
- **fbp, fbc, client_ip_address, client_user_agent**: **NUNCA HASHEAR**.

Fonte oficial: [Customer Information Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters/).

### 5.4 Sobre `fbp` e `fbc`

- `fbp`: cookie `_fbp` setado pelo Pixel no browser. Formato `fb.1.<epoch_ms>.<random>`. Ler com `document.cookie`.
- `fbc`: cookie `_fbc` setado pelo Pixel quando usuário chega com `?fbclid=...` na URL. Formato `fb.1.<epoch_ms>.<fbclid>`. Se o cookie não existir mas a URL tiver `fbclid`, montar manualmente: `fb.1.${Date.now()}.${fbclid}`.

Fonte: [fbp and fbc Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc/).

### 5.5 Enriquecer o próprio Pixel com Advanced Matching

O `fbq('init', ID)` hoje não manda Advanced Matching. Pra o Pixel também conseguir matchear antes mesmo do Lead event, atualizar via **segundo argumento de init** (Advanced Matching é injetado na inicialização):

```js
fbq('init', PIXEL_ID);
// ...no momento do lead, ANTES do track:
fbq('setUserProperties', PIXEL_ID, {
  em: hashedEmail,
  ph: hashedPhone,
  fn: hashedFirstName,
  ln: hashedLastName,
  country: hashedCountry,
  external_id: hashedEmail,
});
fbq('track', 'Lead', {}, { eventID });
```

Alternativa: habilitar **Automatic Advanced Matching** no painel do Events Manager. Simpler, mas menos controlado. Recomendo **manual** (o código acima) porque a gente controla exatamente o que manda e pode testar com Pixel Helper.

---

## 6. Vercel Serverless Function (viabilidade)

### 6.1 Confirmado viável

- Astro 4 suporta `output: 'hybrid'` com páginas estáticas + API routes dinâmicas.
- Adapter `@astrojs/vercel` ([docs](https://docs.astro.build/en/guides/integrations-guide/vercel/)) empacota cada `.ts` em `src/pages/api/` como Vercel Serverless Function (Node runtime).
- No plano Hobby: 100 GB-hours/mês + 100k invocations. Evento Lead = ~200ms de CPU, payload 2KB. Lançamento com 600 leads = 600 invocações. Nada.
- Cold start Node em Vercel: ~300-500ms. Não impacta UX porque modal faz redirect sem esperar resposta.

### 6.2 Contraindicações descartadas

- **Edge runtime (WinterCG)**: funciona com `crypto.subtle` pra SHA-256, mas **não suporta** certas libs. Para Lead, Edge funcionaria. Vou recomendar **Node runtime** mesmo assim, porque:
  - `crypto` built-in do Node é mais explícito.
  - Se a gente evoluir pra adicionar validação anti-fraude (ex: HMAC de um token), Node é mais conveniente.
  - Cold start extra de ~200ms é irrelevante (modal já redireciona sem esperar).

### 6.3 Mudanças no Astro config

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://icc.thesociety.com.br',
  base: '/lpv2/',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ['.trycloudflare.com'] },
  },
  output: 'hybrid',
  adapter: vercel(),
});
```

Todas as páginas continuam pré-renderizadas (porque `output: 'hybrid'` defaulta a static). Só o arquivo `src/pages/api/capi.ts` precisa de `export const prerender = false` pra virar serverless.

### 6.4 CSP atualizar?

O `vercel.json:10` já permite `connect-src ... https://www.facebook.com`. O endpoint `graph.facebook.com` é um subdomínio diferente, então precisamos adicionar `https://graph.facebook.com`. **Mas** a chamada pra `graph.facebook.com` acontece **do servidor** (Vercel Function), não do browser. **Não afeta o CSP**. O browser só fala com `connect.facebook.net` (já autorizado) e com nosso próprio domínio (`/api/capi`, self, já autorizado por default).

Zero mudança em `vercel.json`.

---

## 7. Estrutura de código proposta (clean-code)

### 7.1 Arquivos novos

```
site-v2/
├── astro.config.mjs                     # +3 linhas (hybrid + adapter)
├── package.json                         # +1 dep: @astrojs/vercel
├── .env.example                         # +3 vars: PIXEL_ID, ACCESS_TOKEN, TEST_EVENT_CODE
└── src/
    ├── pages/
    │   └── api/
    │       └── capi.ts                  # NOVO. Endpoint POST.
    └── lib/
        ├── capi.ts                      # NOVO. Build payload + POST pro Meta.
        ├── hash.ts                      # NOVO. normalize + sha256 helpers.
        └── fb-cookies.ts                # NOVO. Lê _fbp/_fbc/fbclid no browser.
```

Tudo em ~300 linhas de código. Divisão respeita clean-code (módulo puro de hashing, módulo de cookies isolado, endpoint fino só orquestra).

### 7.2 `lib/hash.ts` (server + client-safe)

```ts
// Hash SHA-256 hex. Usa WebCrypto (funciona em Node 20+ e edge/browser).
// Fonte: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters

export async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Remove acentos. "josé" -> "jose".
function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function normalizeEmail(v: string): string {
  return v.trim().toLowerCase();
}

export function normalizePhone(v: string): string {
  // Remove tudo que não é digito. Preserva codigo do pais.
  return v.replace(/\D/g, '');
}

export function normalizeName(v: string): string {
  return stripAccents(v.trim().toLowerCase());
}

export function normalizeCountry(v: string): string {
  return v.trim().toLowerCase().slice(0, 2);
}

export function splitFullName(full: string): { fn: string; ln: string } {
  const parts = full.trim().split(/\s+/);
  const fn = parts[0] ?? '';
  const ln = parts.slice(1).join(' ');
  return { fn, ln };
}
```

### 7.3 `lib/fb-cookies.ts` (só client)

```ts
// Le cookies _fbp/_fbc setados pelo Pixel. Fallback: monta fbc a partir
// do fbclid na URL caso o Pixel ainda nao tenha setado o cookie.
// Formato esperado: fb.<subdomainIndex>.<creationTime>.<value>

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match?.[1];
}

export function getFbp(): string | undefined {
  return readCookie('_fbp');
}

export function getFbc(): string | undefined {
  const fromCookie = readCookie('_fbc');
  if (fromCookie) return fromCookie;

  if (typeof window === 'undefined') return undefined;
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid');
  if (!fbclid) return undefined;

  return `fb.1.${Date.now()}.${fbclid}`;
}
```

### 7.4 `lib/capi.ts` (só server)

```ts
// Monta payload Conversions API e envia pro Meta.
// Endpoint: https://graph.facebook.com/v21.0/{PIXEL_ID}/events

import {
  sha256,
  normalizeEmail,
  normalizePhone,
  normalizeName,
  normalizeCountry,
  splitFullName,
} from './hash';

interface CapiInput {
  eventId: string;
  eventName: 'Lead' | 'CompleteRegistration' | 'Purchase' | 'InitiateCheckout';
  eventSourceUrl: string;
  email: string;
  phone: string;
  name: string;
  country?: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  clientUa?: string;
  customData?: Record<string, string | number>;
}

interface CapiConfig {
  pixelId: string;
  accessToken: string;
  testEventCode?: string;
}

export async function sendCapiEvent(input: CapiInput, cfg: CapiConfig) {
  const { fn, ln } = splitFullName(input.name);

  const userData: Record<string, string[] | string> = {
    em: [await sha256(normalizeEmail(input.email))],
    ph: [await sha256(normalizePhone(input.phone))],
    fn: [await sha256(normalizeName(fn))],
    ln: [await sha256(normalizeName(ln))],
    country: [await sha256(normalizeCountry(input.country ?? 'br'))],
    external_id: [await sha256(normalizeEmail(input.email))],
  };

  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.clientUa) userData.client_user_agent = input.clientUa;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: 'website',
        user_data: userData,
        custom_data: input.customData ?? {},
      },
    ],
  };

  if (cfg.testEventCode) payload.test_event_code = cfg.testEventCode;

  const url = `https://graph.facebook.com/v21.0/${cfg.pixelId}/events?access_token=${encodeURIComponent(cfg.accessToken)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`CAPI error ${res.status}: ${body}`);
  }

  return res.json();
}
```

### 7.5 `src/pages/api/capi.ts` (endpoint serverless)

```ts
// Serverless endpoint que recebe dados do modal e dispara CAPI.
// Nunca expoe access_token pro client.

import type { APIRoute } from 'astro';
import { sendCapiEvent } from '../../lib/capi';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const pixelId = import.meta.env.META_PIXEL_ID;
  const accessToken = import.meta.env.META_CAPI_ACCESS_TOKEN;
  const testCode = import.meta.env.META_CAPI_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    return new Response('CAPI disabled', { status: 204 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const name = String(body.name ?? '').trim();
  const eventId = String(body.event_id ?? '').trim();
  const eventSourceUrl = String(body.event_source_url ?? '').trim();

  if (!EMAIL_RE.test(email) || !phone || !name || !eventId) {
    return new Response('Invalid payload', { status: 400 });
  }

  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    clientAddress;
  const clientUa = request.headers.get('user-agent') ?? undefined;

  try {
    await sendCapiEvent(
      {
        eventId,
        eventName: 'Lead',
        eventSourceUrl,
        email,
        phone,
        name,
        fbp: typeof body.fbp === 'string' ? body.fbp : undefined,
        fbc: typeof body.fbc === 'string' ? body.fbc : undefined,
        clientIp,
        clientUa,
        customData: typeof body.custom_data === 'object' && body.custom_data !== null
          ? (body.custom_data as Record<string, string | number>)
          : undefined,
      },
      { pixelId, accessToken, testEventCode: testCode || undefined }
    );
    return new Response(null, { status: 204 });
  } catch (err) {
    // Nao vazar detalhes de erro do Meta pro client.
    console.error('CAPI send failed', err);
    return new Response(null, { status: 502 });
  }
};
```

### 7.6 Mudança no `CaptureModal.tsx` (~15 linhas)

No submit, antes do redirect:

```ts
import { getFbp, getFbc } from '../../lib/fb-cookies';

// ... dentro do handleSubmit, depois de gerar eventID e utms:

const fbp = getFbp();
const fbc = getFbc();

const capiPayload = {
  name: name.trim(),
  email: email.trim(),
  phone,
  event_id: eventID,
  event_source_url: window.location.href,
  fbp,
  fbc,
  custom_data: {
    lead_source: 'landing_intensivo',
    ...utms,
  },
};

// Fire-and-forget. Server responde 204, nao precisa aguardar.
fetch('/api/capi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(capiPayload),
}).catch(() => {
  // Silencioso. Falha de CAPI nao pode travar o lead.
});
```

O `fbq('track', 'Lead', ..., { eventID })` que já existe fica do mesmo jeito. Os dois eventos (browser + server) chegam com o mesmo `event_id` e mesmo `event_name` → dedup.

---

## 8. Variáveis de ambiente

Adicionar em `.env.example`:

```bash
# META CONVERSIONS API (server only, NEVER expose client-side)
META_PIXEL_ID=1234567890
META_CAPI_ACCESS_TOKEN=EAAxxxxxxxxxxxxxx
META_CAPI_TEST_EVENT_CODE=  # Preencher TEMPORARIAMENTE no Events Manager > Test Events
```

No painel da Vercel (Project Settings > Environment Variables), adicionar as **3 keys** acima como **server-only** (sem prefixo `PUBLIC_`). O Astro só expõe ao browser as que começam com `PUBLIC_`.

Como obter o `META_CAPI_ACCESS_TOKEN`:
1. Events Manager → selecionar o Pixel → Settings → Conversions API.
2. "Generate access token". Copiar (só aparece uma vez).
3. Rotacionar a cada 60 dias. Criar task recorrente no Vuktasks.

---

## 9. Segurança

| Risco | Mitigação |
|---|---|
| Access token vazando | Sempre server-only, nunca em `PUBLIC_*`, nunca em client bundle. Revisar build antes do deploy. |
| Spam no endpoint (bot enchendo o Pixel) | Honeypot do modal já filtra. Rate-limit básico: Vercel cobra por invocação, mas acima de 100k/mês vira problema. Se precisar, adicionar `@upstash/ratelimit` (Redis). Pro lançamento não precisa. |
| Dados sensíveis em logs | Nunca logar `email`/`phone` brutos. Só logar `event_id` + status code. |
| CSRF | Endpoint aceita só POST JSON, valida payload. Sem cookie de sessão, não tem superfície CSRF. |
| CORS | Por padrão Astro serve same-origin. Não habilitar CORS. |
| Privacidade (LGPD) | Política de privacidade já cobre captura de dados pra marketing. Se for rodar UE, ativar `data_processing_options`. Brasil não precisa. |

---

## 10. Teste e verificação

**Sequência obrigatória antes de considerar pronto:**

1. **Test Events Tool** (Events Manager → Test Events):
   - Gerar `test_event_code` no painel (ex: `TEST12345`).
   - Setar `META_CAPI_TEST_EVENT_CODE=TEST12345` no `.env.local`.
   - Submeter lead real no form local (`npm run dev`).
   - Ver evento aparecer no painel em <5s. Conferir `event_id` e `event_name`.
   - Remover a var antes de commitar.

2. **Pixel Helper** (Chrome extension):
   - Abrir landing em produção.
   - Submeter form.
   - Confirmar que `Lead` dispara com `eventID`.

3. **Match Quality** (Events Manager → Overview):
   - 24h após primeiro tráfego real, ver score.
   - Meta: Lead ≥ 7.5. Se < 7, investigar quais `user_data` estão vindo vazios.

4. **Deduplication Check** (Events Manager → Data Sources → [Pixel] → Diagnostics):
   - Ver % de eventos deduplicados. Ideal: 80-95% (alguns sempre ficam sem match por timing).
   - Se < 50%: algo errado com `event_id` (provavelmente não está sendo igual nos dois canais).

---

## 11. Custo

**Vercel Hobby plan** (o que estamos no `site-v2/`):
- 100k invocations/mês: grátis.
- 100 GB-hours compute/mês: grátis.
- Lead event: ~200ms de CPU, 2KB payload.
- Projeção 600 leads do lançamento: 600 invocations, ~0.03 GB-hours. Zero custo.

Se ChatFunnel/AI Society também começarem a chamar (evento Purchase, InitiateCheckout): ainda muito abaixo dos limites.

**Meta**: grátis (CAPI não é pago).

---

## 12. Plano de implementação (stories)

Seguindo pipeline PRD → Plan → Stories do projeto.

1. **S1 (P) — Adicionar adapter Vercel + output hybrid**.
   Arquivos: `astro.config.mjs`, `package.json`.
   Valida: `npm run build` gera `.vercel/output/functions` vazio (ainda sem route).

2. **S2 (P) — Criar `src/lib/hash.ts`**.
   Só funções puras + testes manuais (vetor oficial do Meta).

3. **S3 (P) — Criar `src/lib/fb-cookies.ts`**.
   Só funções puras client-side.

4. **S4 (M) — Criar `src/lib/capi.ts` + `src/pages/api/capi.ts`**.
   Endpoint completo. Testa com curl local.

5. **S5 (M) — Integrar no `CaptureModal.tsx`**.
   Adiciona fetch `/api/capi` em paralelo ao `fbq`. Mantém webhook VUKer.

6. **S6 (P) — Adicionar Advanced Matching no Pixel (browser)**.
   `fbq('setUserProperties', ...)` antes do `track`.

7. **S7 (P) — Atualizar `.env.example`, setar vars na Vercel, rodar Test Events Tool**.

Total: ~2h de dev, ~1h de validação (Test Events + Pixel Helper).

---

## 13. Atualização das skills (automatização futura)

Para que toda landing nova já nasça com Pixel+CAPI completo, atualizar:

### 13.1 `~/.claude/skills/landing-page-prd/SKILL.md`

Adicionar na checklist de PRD:
- **Tracking**: Pixel + CAPI sempre. PRD deve declarar eventos (Lead, ViewContent, InitiateCheckout, Purchase) e quais `user_data` cada um deve mandar.

Adicionar reference file `references/meta-capi-pattern.md` (novo) com:
- Payload spec completo.
- Regras de normalização.
- Checklist de EMQ mínimo por evento.

### 13.2 `~/.claude/skills/landing-page-create-plan/SKILL.md`

Adicionar na fase técnica obrigatória:
- Stories de CAPI (S1-S7 deste relatório) como bloco reutilizável em qualquer landing com formulário de captura.

### 13.3 `~/.claude/skills/landing-page-audit/SKILL.md`

Adicionar 3 checks na categoria **analytics**:
- [ ] `/api/capi` responde 204 pra payload válido.
- [ ] Pixel dispara `Lead` com `eventID` (via Pixel Helper).
- [ ] Test Events Tool recebe evento server-side com mesmo `event_id`.
- [ ] EMQ ≥ 7 após 24h de tráfego real.

### 13.4 `~/.claude/skills/landing-page-implement/SKILL.md`

Adicionar ao template de ondas de implementação:
- **Onda final**: dispatcher pra implementer-sonnet executar stories S1-S7 de CAPI sempre que o plano tiver `tracking: meta-capi: true` no frontmatter.

### 13.5 Criar skill nova (opcional): `meta-capi`

Skill reutilizável que qualquer squad-dev pode invocar pra setar Pixel+CAPI num projeto existente. Body com processo + references com payload specs por evento (Lead, Purchase, InitiateCheckout, ViewContent, AddToCart, CompleteRegistration).

Decisão: **NÃO criar skill separada por enquanto**. Integrar nas 4 skills de landing é suficiente e evita fragmentação. Se no futuro outros projetos (não-landing) precisarem de CAPI, aí sim criar.

---

## 14. Veredito

**VIÁVEL. IMPLEMENTAR AGORA.**

Razões pra não adiar:
1. Lote 1 abre 30/04. Quanto antes o CAPI estiver rodando, mais dados o Meta acumula pra otimizar ads de conversão.
2. EMQ melhora ao longo de 72h. Não dá pra ligar na véspera do lote e esperar performance.
3. Sem CAPI, perdemos ~40% dos Leads que o Meta poderia matchear. Num orçamento de R$180k em ads, isso é R$72k de otimização abaixo do ótimo.
4. Implementação cabe em 2-3h de trabalho real. ROI óbvio.

**O que eu faço em seguida (aguardando tua decisão):**
- [ ] Implementar as 7 stories agora (pipeline `/create-plan` → `/expand-stories` → `/implement`).
- [ ] Atualizar as 4 skills de landing pra automatizar nas próximas.
- [ ] Documentar os valores de `META_PIXEL_ID` e `META_CAPI_ACCESS_TOKEN` em `env-secrets` (skill) depois de coletar do Events Manager.

Me confirma e eu executo.

---

## Fontes consultadas (2026-04-23)

- [Conversions API - Meta for Developers](https://developers.facebook.com/docs/marketing-api/conversions-api/) (docs oficiais)
- [Using the API](https://developers.facebook.com/documentation/ads-commerce/conversions-api/using-the-api/)
- [Customer Information Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters/)
- [fbp and fbc Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc/)
- [Handling Duplicate Pixel and Conversions API Events](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events/)
- [Parameter Builder Library](https://developers.facebook.com/documentation/ads-commerce/conversions-api/parameter-builder-library)
- [Astro Endpoints docs](https://docs.astro.build/en/guides/endpoints/)
- [DataAlly: Complete 2026 Guide Meta CAPI](https://www.dataally.ai/blog/how-to-set-up-meta-conversions-api)
- [Aimerce: EMQ Score 2025](https://www.aimerce.ai/blogs/demystifying-emq-score-2025)
- [AGrowth: Event Match Quality 2025](https://agrowth.io/blogs/facebook-ads/event-match-quality)
- [AdvertStar: Advanced Facebook Pixel Setup 2025](https://advertstar.net/2025/11/03/advanced-facebook-pixel-setup-a-complete-2025-guide-to-events-capi-and-optimization/)
