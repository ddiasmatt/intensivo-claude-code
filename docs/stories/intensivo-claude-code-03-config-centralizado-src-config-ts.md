---
title: Story 03 — Config centralizado src/config.ts
slug: intensivo-claude-code-03
plan: docs/plans/intensivo-claude-code.md
prd: docs/prds/intensivo-claude-code.md
complexity: P
model: implementer-haiku
depends_on: [Story 01]
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code]
---

# Story 03 — Config centralizado src/config.ts

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** Story 01
- **Arquivos a criar:** `site/src/config.ts`, `site/.env.example`
- **Arquivos a modificar:** nenhum
- **Patterns a seguir:** PRD secao 5.1 (Config centralizada) e 5.2 (Variaveis de ambiente)

**Contexto:** Todo componente `.astro` e `.tsx` importa de `src/config.ts`. Zero copy hardcoded nos componentes. Espelhar estrutura do `intensivo-claude-code-astro/src/config.ts` com os ajustes do PRD: remover "Sistema 10x" (substituir por "infra completa" ou "operacao"), `TIMELINE_FOOTER` inclui "gravacao liberada", `EVENT_DATE = "16/05, evento online ao vivo no Zoom"`.

**Codigo de referencia (estrutura obrigatoria):**

```typescript
// site/src/config.ts
const WEBHOOK_URLS_ENV = import.meta.env.PUBLIC_WEBHOOK_URLS ?? '';

export const CONFIG = {
  // Meta do produto
  EVENT_NAME: 'Intensivo Claude Code',
  EVENT_DATE: '16/05, evento online ao vivo no Zoom',
  EVENT_START_ISO: '2026-05-16T09:00:00-03:00',
  EVENT_END_ISO: '2026-05-16T17:00:00-03:00',
  PRICE_GROUP: 'R$ 27',
  PRICE_PUBLIC: 'R$ 47',
  GROUP_CLOSES: '26/04',
  CART_OPENS: '30/04',

  // URLs e env
  REDIRECT_URL: import.meta.env.PUBLIC_REDIRECT_URL ?? 'https://sndflw.com/i/trV5sqi3n9eSZD0U1Rlx',
  WEBHOOK_URLS: WEBHOOK_URLS_ENV.split(',').map((u) => u.trim()).filter(Boolean),

  // TopBar
  TOPBAR_TEXT: 'ENTRE NO GRUPO E ACESSE A OFERTA UNICA DE R$ 27. CARRINHO PUBLICO ABRE A R$ 47.',

  // Hero
  HERO_KICKER: 'AO VIVO · 16 DE MAIO · ZOOM',
  HERO_H1_LINES: [
    { text: 'Intensivo', style: 'default' },
    { text: 'Claude Code', style: 'bold-accent-on-claude' },
    { text: 'em um sabado.', style: 'italic-light' },
  ],
  HERO_SUBHEADLINE: 'Aprenda do zero a ferramenta de IA preferida dos empreendedores e crie em minutos toda a estrutura digital do seu negocio.',
  HERO_ICP: 'Intensivo para empresarios, empreendedores e profissionais liberais.',
  HERO_OFFER: 'Oferta unica R$ 27. Entre no grupo para receber.',
  HERO_CTA: 'ENTRAR NO GRUPO E VER A OFERTA',
  HERO_MICROCOPY: 'Sabado 16/05 · 09h as 17h · gravacao liberada',
  HERO_BULLETS: ['Sem programar codigo', 'Sem contratar mais gente', 'Sem curso infinito antes de aplicar'],

  // Social Proof
  SOCIALPROOF_HEADLINE: '4.200+ empresarios ja aplicaram o metodo.',
  SOCIALPROOF_SUB: 'Rola pra ver alguns dos resultados de quem ja participou.',
  SOCIALPROOF_FOOTER: '19 prints reais. Zero stock. Zero ator pago.',
  SOCIALPROOF_IMAGES: Array.from({ length: 19 }, (_, i) => `/depoimentos/depoimento-${String(i + 1).padStart(2, '0')}.png`),

  // Big Idea, UseCases, ParaQuem, Benefits, Timeline, Autoridade, FinalCTA, FAQ — todos os campos do PRD secao 4
  // ... (completar conforme secao 4 do PRD)

  // Modal
  MODAL_TITLE: 'Quase la.',
  MODAL_SUBTITLE: 'Preencha para entrar no grupo e acessar a oferta unica de R$ 27.',
  MODAL_SUBMIT: 'ENTRAR NO GRUPO',
  MODAL_PRIVACY: 'Seus dados estao seguros. Zero spam.',
  MODAL_SUCCESS: 'Voce esta dentro.',
  MODAL_ERROR: 'Erro ao enviar. Tente novamente.',
} as const;
```

```env
# site/.env.example
PUBLIC_GA_ID=G-7CJMYD129G
PUBLIC_META_PIXEL_ID=
PUBLIC_WEBHOOK_URLS=
PUBLIC_REDIRECT_URL=https://sndflw.com/i/trV5sqi3n9eSZD0U1Rlx
```

**Criterios de aceite:**
1. QUANDO qualquer componente de secao importar `{ CONFIG }`, ENTAO recebe strings tipadas (readonly `as const`)
2. QUANDO `PUBLIC_WEBHOOK_URLS` estiver vazio, ENTAO `CONFIG.WEBHOOK_URLS` e array vazio (nao `['']`)
3. QUANDO build rodar sem `.env`, ENTAO usa defaults e nao quebra (`REDIRECT_URL` fallback hardcoded)
4. QUANDO `grep -ri "Sistema 10x" src/`, ENTAO zero ocorrencias

**Comando de validacao:**
```bash
cd site && npx astro check && ! grep -rn "Sistema 10x" src/
```
