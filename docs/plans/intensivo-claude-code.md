---
title: Plan — Intensivo Claude Code
slug: intensivo-claude-code
prd: docs/prds/intensivo-claude-code.md
created: 2026-04-22
status: draft
---

# Plano de Implementacao — Intensivo Claude Code

## Resumo

Landing de captura de lead para o Intensivo Claude Code (16/05/2026, Zoom, R$27 via grupo VIP), construida do zero em `site/` com Astro 4 + Tailwind 4 + React 18. Direcao estetica **Editorial Light Serifado** (off-white quente + laranja imprensa). 12 stories em ordem canonica, estimativa total 6h45min. Copy e Fase 0 vem 100% do PRD; paginas anteriores do ICC (em `../intensivo-claude-code-astro/`) entram so como doador de assets estaticos (PNGs, favicon, manifest, robots, llms).

## Ordem canonica de landing

1. Scaffold Astro em `site/` (pasta vazia hoje; raiz do repo tem projeto Vite-React Lovable legado que sera substituido)
2. Tokens Tailwind traduzidos da Fase 0 (secao 3.3 do PRD)
3. Config centralizado `src/config.ts` (toda copy, URLs, horarios)
4. Layout `Base.astro` com SEO + Analytics GA4/Pixel condicional + fonts + manifest + JSON-LD
5. Assets publicos importados de `../intensivo-claude-code-astro/public/`
6. TopBar sticky + Hero com mask-reveal GSAP
7. SocialProof (marquee 2 direcoes, 19 PNGs)
8. BigIdea + UseCases (2 secoes editoriais densas)
9. ParaQuem + Benefits + Timeline (3 secoes com grids editoriais)
10. Autoridade Mateus + FinalCTA + FAQ + Footer (bottom half)
11. Modal de captura React island (focus trap, Esc, backdrop confirm, analytics, UTM, webhook)
12. Audit mobile (`landing-page-audit`) + verificacao pre-deploy dos 13 itens SEO

Nenhum desvio da ordem canonica. Stories 9 e 10 agrupam 3 secoes cada para manter o plano em 12 stories (regra da skill).

## Dependencias npm

Conforme PRD secao 6, nenhuma adicao alem do template minimo de `landing-page-pattern.md`. Tailwind fixado em `^4` (stack do CLAUDE.md global manda v4, template da skill diz `^3.4`; prevalece o global). `class-variance-authority` removido (nao precisamos, variantes simples com `clsx` bastam). `tailwindcss-animate` removido (keyframes locais cobrem).

```json
{
  "dependencies": {
    "@astrojs/react": "^3",
    "@astrojs/tailwind": "^5",
    "astro": "^4",
    "motion": "^12",
    "gsap": "^3",
    "react": "^18",
    "react-dom": "^18",
    "tailwindcss": "^4",
    "tailwind-merge": "^2",
    "clsx": "^2",
    "lucide-react": "^0.4"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
```

## Stories embutidas

### Story 01 — Scaffold Astro em site/

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** nada
- **Arquivos a criar:** `site/package.json`, `site/astro.config.mjs`, `site/tsconfig.json`, `site/.gitignore`, `site/src/pages/index.astro` (stub)
- **Arquivos a modificar:** nenhum
- **Patterns a seguir:** `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` secao 1 (Stack Obrigatorio)

**Contexto:** Pasta `site/` existe vazia. Scaffolding Astro minimal com React e Tailwind integrados. NAO usar template oficial interativo (`npm create astro@latest`); criar arquivos direto para ter controle sobre deps fixadas.

**Codigo de referencia:**

```json
// site/package.json
{
  "name": "intensivo-claude-code-landing",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "@astrojs/react": "^3",
    "@astrojs/tailwind": "^5",
    "astro": "^4",
    "motion": "^12",
    "gsap": "^3",
    "react": "^18",
    "react-dom": "^18",
    "tailwindcss": "^4",
    "tailwind-merge": "^2",
    "clsx": "^2",
    "lucide-react": "^0.4"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
```

```js
// site/astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  output: 'static',
});
```

```astro
---
// site/src/pages/index.astro (stub apenas)
---
<html lang="pt-BR"><body><h1>ICC Landing (scaffold)</h1></body></html>
```

**Criterios de aceite:**
1. QUANDO rodar `npm install` em `site/`, ENTAO instala sem erro e gera `node_modules/`
2. QUANDO rodar `npx astro build`, ENTAO gera `dist/` com `index.html` do stub sem warnings
3. QUANDO rodar `npx astro check`, ENTAO zero erros de TypeScript

**Comando de validacao:**
```bash
cd site && npm install && npx astro build && npx astro check
```

---

### Story 02 — Tokens Tailwind traduzidos da Fase 0

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** Story 01
- **Arquivos a criar:** `site/tailwind.config.mjs`, `site/src/styles/global.css`
- **Arquivos a modificar:** `site/src/pages/index.astro` (importa `global.css`)
- **Patterns a seguir:** `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` secao 3 (Design Tokens)

**Contexto:** Traduzir a tabela da Fase 0 (PRD secao 3.3) e fontes (PRD secao 3.4) para o `tailwind.config.mjs`. Incluir keyframes `mask-reveal`, `live-pulse`, `marquee-left`, `marquee-right`. Global CSS carrega fontes do Google, reset e `prefers-reduced-motion`.

**Codigo de referencia:**

```js
// site/tailwind.config.mjs (copia literal do PRD secao 5.7)
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'serif'],
        sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        page: '#FBFAF7',
        surface: '#F3F1EC',
        elevated: '#FFFFFF',
        rule: '#D9D4CB',
        accent: {
          DEFAULT: '#E4572E',
          hover: '#C84521',
          deep: '#A63A1F',
        },
        ink: {
          primary: '#0B0B0D',
          secondary: '#4A4744',
          muted: '#8A8580',
        },
      },
      keyframes: {
        'mask-reveal': {
          '0%':   { 'clip-path': 'inset(0 100% 0 0)' },
          '100%': { 'clip-path': 'inset(0 0 0 0)' },
        },
        'live-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.4' },
        },
        'marquee-left':  { '0%': { transform: 'translateX(0)' },       '100%': { transform: 'translateX(-50%)' } },
        'marquee-right': { '0%': { transform: 'translateX(-50%)' },    '100%': { transform: 'translateX(0)' }    },
      },
      animation: {
        'mask-reveal':   'mask-reveal 0.8s cubic-bezier(0.77, 0, 0.175, 1) both',
        'live-pulse':    'live-pulse 1.6s ease-in-out infinite',
        'marquee-left':  'marquee-left 55s linear infinite',
        'marquee-right': 'marquee-right 55s linear infinite',
      },
    },
  },
  plugins: [],
};
```

```css
/* site/src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { font-family: theme('fontFamily.sans'); color: theme('colors.ink.primary'); background: theme('colors.page'); }
  body { min-height: 100vh; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Criterios de aceite:**
1. QUANDO aplicar `class="bg-page text-ink-primary"`, ENTAO DOM renderiza com as cores exatas da Fase 0
2. QUANDO aplicar `class="font-display"`, ENTAO fonte Fraunces carrega do Google Fonts (via `<link>` no Base, Story 04)
3. QUANDO rodar `npx astro build`, ENTAO zero warnings e classes custom aparecem no CSS final
4. QUANDO existir `bg-[#hex]` ou `text-[#hex]` inline em qualquer arquivo, ENTAO review reprova

**Comando de validacao:**
```bash
cd site && npx astro build && grep -q "page" dist/_astro/*.css && echo OK
```

---

### Story 03 — Config centralizado src/config.ts

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

---

### Story 04 — Layout Base.astro com SEO, Analytics, fonts, JSON-LD

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** Story 02, Story 03
- **Arquivos a criar:** `site/src/layouts/Base.astro`, `site/src/lib/structured-data.ts`
- **Arquivos a modificar:** `site/src/pages/index.astro` (passa a usar `<Base>`)
- **Patterns a seguir:**
  - `~/.claude/skills/landing-page-prd/references/analytics-pattern.md` (3 pilares: GA4, Meta Pixel, UTM)
  - `~/.claude/skills/landing-page-prd/references/structured-data-templates.md` (Organization + WebSite + Event)
  - PRD secao 5.5 (SEO 13 itens), 5.6 (structured data)

**Contexto:** Layout base unico. Carrega fontes Google com `preconnect + display=swap`, injeta analytics SO se env presente (contrato obrigatorio v1 sem Pixel ID), JSON-LD com 3 tipos (`Organization` + `WebSite` + `Event`), todos os meta tags do checklist SEO. `canonical` fica `⚠️ TODO` ate dominio ser escolhido (PRD pendencia 1).

**Codigo de referencia:**

```astro
---
// site/src/layouts/Base.astro
import '../styles/global.css';
import { CONFIG } from '../config';
import { buildStructuredData } from '../lib/structured-data';

interface Props {
  title?: string;
  description?: string;
}

const { title = 'Intensivo Claude Code · 16/05 ao vivo no Zoom', description = 'Sabado intensivo com Mateus Dias. Construa 10 agentes de IA sem programar. Grupo VIP com oferta unica R$ 27.' } = Astro.props;

const GA_ID = import.meta.env.PUBLIC_GA_ID ?? '';
const META_PIXEL = import.meta.env.PUBLIC_META_PIXEL_ID ?? '';
const canonical = 'https://TODO-DOMINIO-FINAL/';

const jsonLd = buildStructuredData({
  canonical,
  eventStart: CONFIG.EVENT_START_ISO,
  eventEnd: CONFIG.EVENT_END_ISO,
  redirectUrl: CONFIG.REDIRECT_URL,
});
---
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content="claude code, intensivo, mateus dias, agentes de ia, grupo vuk, ai builder, no-code, saas brasileiro" />
    <meta name="author" content="Grupo VUK" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href={canonical} />
    <meta name="theme-color" content="#FBFAF7" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content={`${canonical}og-image.png`} />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:url" content={canonical} />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500..700;1,9..144,500&family=Inter+Tight:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap" />

    <!-- GA4 condicional -->
    {GA_ID && (
      <>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
        <script is:inline define:vars={{ GA_ID }}>
          window.dataLayer = window.dataLayer || [];
          function gtag() { window.dataLayer.push(arguments); }
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', GA_ID);
        </script>
      </>
    )}

    <!-- Meta Pixel condicional (v1: vazio, script nao injeta) -->
    {META_PIXEL && (
      <script is:inline define:vars={{ META_PIXEL }}>
        /* snippet oficial Meta Pixel; ver analytics-pattern.md secao 2 */
      </script>
    )}

    <!-- JSON-LD: Organization + WebSite + Event -->
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body class="bg-page text-ink-primary font-sans antialiased">
    <slot />
  </body>
</html>
```

```typescript
// site/src/lib/structured-data.ts
export function buildStructuredData({ canonical, eventStart, eventEnd, redirectUrl }: {
  canonical: string;
  eventStart: string;
  eventEnd: string;
  redirectUrl: string;
}) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Grupo VUK',
      url: 'https://grupovuk.com.br',
      logo: `${canonical}favicon.png`,
      sameAs: ['https://www.instagram.com/grupovuk', 'https://www.youtube.com/@mateusdiasmkt'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Intensivo Claude Code',
      url: canonical,
      inLanguage: 'pt-BR',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Intensivo Claude Code',
      startDate: eventStart,
      endDate: eventEnd,
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: { '@type': 'VirtualLocation', url: 'https://zoom.us/j/TODO' },
      description: 'Intensivo online ao vivo para construir 10 agentes de IA em 1 sabado, sem programar.',
      organizer: { '@type': 'Organization', name: 'Grupo VUK', url: 'https://grupovuk.com.br' },
      image: [`${canonical}og-image.png`],
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: '27.00',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-04-22',
        url: redirectUrl,
      },
      performer: { '@type': 'Person', name: 'Mateus Dias' },
    },
  ];
}
```

**Criterios de aceite:**
1. QUANDO `.env` ausente, ENTAO pagina sobe em dev e DOM nao contem `<script>` do GA4 nem do Pixel
2. QUANDO `PUBLIC_GA_ID` definido, ENTAO DOM contem `gtag.js` carregado e config chamado com o ID
3. QUANDO `PUBLIC_META_PIXEL_ID` vazio, ENTAO DOM NAO contem script do Pixel (contrato v1)
4. QUANDO inspecionar `dist/index.html`, ENTAO contem 3 blocos JSON-LD (Organization, WebSite, Event) validos
5. QUANDO validar em https://validator.schema.org, ENTAO zero erros
6. QUANDO rodar Lighthouse, ENTAO SEO >= 95

**Comando de validacao:**
```bash
cd site && npx astro build && grep -c "application/ld+json" dist/index.html
# esperado: 1 (1 tag script contendo array de 3 schemas)
```

---

### Story 05 — Assets publicos importados

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** Story 01
- **Arquivos a criar:** `site/public/depoimentos/` (19 PNGs), `site/public/mateus.webp`, `site/public/og-image.png`, `site/public/favicon.ico`, `site/public/favicon.png`, `site/public/robots.txt`, `site/public/llms.txt`, `site/public/manifest.webmanifest`, `site/public/apple-touch-icon.png`
- **Arquivos a modificar:** `site/public/manifest.webmanifest` apos copia (ajustar `theme_color: #FBFAF7`, `background_color: #FBFAF7`), `site/public/llms.txt` apos copia (reescrever com a copy nova do PRD)
- **Patterns a seguir:** PRD secao 5.9 (tabela de assets)

**Contexto:** Copiar em bloco de `../intensivo-claude-code-astro/public/` para `site/public/`. Apos copia, 3 ajustes manuais:
1. `manifest.webmanifest` — ajustar `theme_color` e `background_color` para `#FBFAF7` (light, nao mais dark)
2. `llms.txt` — reescrever conteudo para refletir a direcao Editorial Light e a copy nova (PRD secao 4)
3. `og-image.png` — **BLOCKER PENDENTE** (PRD pendencia 7): manter do ICC Astro por enquanto; marcar para revisao no dia do merge. Se visual nao casar com tema light, recriar em design pass paralelo.

**Codigo de referencia (comandos shell):**

```bash
# rodar na raiz do projeto
SRC="../intensivo-claude-code-astro/public"
DST="site/public"
mkdir -p "$DST/depoimentos"
cp "$SRC"/depoimentos/depoimento-*.png "$DST/depoimentos/"
cp "$SRC"/mateus.webp "$SRC"/og-image.png "$SRC"/favicon.ico "$SRC"/favicon.png "$DST/"
cp "$SRC"/robots.txt "$SRC"/llms.txt "$SRC"/manifest.webmanifest "$DST/"
# apple-touch-icon: se nao existir na origem, gerar a partir do favicon.png (180x180)
```

```json
// site/public/manifest.webmanifest (apos ajuste)
{
  "name": "Intensivo Claude Code",
  "short_name": "ICC",
  "icons": [
    { "src": "/favicon.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" }
  ],
  "theme_color": "#FBFAF7",
  "background_color": "#FBFAF7",
  "display": "standalone",
  "start_url": "/"
}
```

**Criterios de aceite:**
1. QUANDO listar `site/public/depoimentos/`, ENTAO 19 arquivos PNG existem (`depoimento-01.png` a `depoimento-19.png`)
2. QUANDO abrir `site/public/manifest.webmanifest`, ENTAO `theme_color` e `background_color` = `#FBFAF7`
3. QUANDO abrir `site/public/llms.txt`, ENTAO contem a copy nova do Intensivo (Event, 16/05, R$27 grupo), NAO a anterior do ICC Astro
4. QUANDO rodar `npx astro build`, ENTAO `dist/robots.txt`, `dist/llms.txt`, `dist/manifest.webmanifest` estao presentes

**Comando de validacao:**
```bash
cd site && npx astro build && ls dist/depoimentos/ | wc -l
# esperado: 19
```

---

### Story 06 — TopBar sticky + Hero com mask-reveal GSAP

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** Story 04
- **Arquivos a criar:** `site/src/components/TopBar.astro`, `site/src/components/sections/Hero.astro`, `site/src/scripts/hero-reveal.ts` (GSAP inline script)
- **Arquivos a modificar:** `site/src/pages/index.astro` (compoe `<Base>` + `<TopBar>` + `<Hero>`)
- **Patterns a seguir:** `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` secao 5 (GSAP)

**Contexto:** Hero e o primeiro ponto de impacto. H1 em 3 linhas com enfases tipograficas distintas conforme `CONFIG.HERO_H1_LINES`. Mask-reveal horizontal (`clip-path inset`) em H1 e H2 via GSAP; entrada cinematica total ~3s (eyebrow -> H1 linha por linha -> sub -> CTA). CTA abre modal via `data-open-modal` (contrato do modal-pattern). TopBar sticky, mono 12px, bg preto + texto page + ponto pulsante laranja.

Crítico: `ScrollTrigger.refresh()` apos carregamento de fontes (Fraunces em variable mode). Sem isso, clip-path quebra em mobile Safari.

**Codigo de referencia:**

```astro
---
// site/src/components/TopBar.astro
import { CONFIG } from '../config';
---
<a href="#final-cta" class="block bg-ink-primary text-page font-mono text-[11px] tracking-widest py-2.5 text-center hover:bg-ink-primary/90 transition-colors">
  <span class="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-2 align-middle animate-live-pulse" aria-hidden="true"></span>
  {CONFIG.TOPBAR_TEXT}
</a>
```

```astro
---
// site/src/components/sections/Hero.astro
import { CONFIG } from '../../config';
---
<section class="relative bg-page pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="hero-kicker font-mono text-xs tracking-widest text-accent uppercase mb-8">{CONFIG.HERO_KICKER}</p>
    <h1 class="font-display leading-[1.02] text-[clamp(2.75rem,9vw,6.5rem)]">
      <span class="hero-line block" data-line="1">{CONFIG.HERO_H1_LINES[0].text}</span>
      <span class="hero-line block font-bold" data-line="2">
        <span class="text-accent">Claude</span> Code
      </span>
      <span class="hero-line block italic font-medium" data-line="3">{CONFIG.HERO_H1_LINES[2].text}</span>
    </h1>
    <p class="hero-sub mt-8 max-w-2xl font-sans text-ink-secondary text-lg sm:text-xl leading-relaxed">
      {CONFIG.HERO_SUBHEADLINE}
    </p>
    <p class="hero-icp mt-3 font-sans text-ink-muted text-base">{CONFIG.HERO_ICP}</p>
    <p class="hero-offer mt-10 font-mono text-sm tracking-wide text-accent uppercase">{CONFIG.HERO_OFFER}</p>
    <button
      type="button"
      data-open-modal
      data-cta-location="hero"
      class="hero-cta mt-6 inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-page font-mono text-sm tracking-widest uppercase px-8 py-4 transition-colors"
    >
      {CONFIG.HERO_CTA}
    </button>
    <p class="hero-microcopy mt-4 font-mono text-xs text-ink-muted tracking-wide">{CONFIG.HERO_MICROCOPY}</p>
    <ul class="hero-bullets mt-8 flex flex-col sm:flex-row gap-3 sm:gap-6 font-sans text-sm text-ink-secondary">
      {CONFIG.HERO_BULLETS.map((b) => (
        <li class="flex items-start gap-2 before:content-['—'] before:text-accent before:font-bold">{b}</li>
      ))}
    </ul>
  </div>
</section>

<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);

  document.fonts.ready.then(() => {
    const tl = gsap.timeline();
    tl.from('.hero-kicker', { opacity: 0, y: -8, duration: 0.4, ease: 'power2.out' })
      .from('.hero-line', { clipPath: 'inset(0 100% 0 0)', stagger: 0.15, duration: 0.8, ease: 'expo.out' }, 0.2)
      .from('.hero-sub', { opacity: 0, y: 10, duration: 0.5 }, 1.0)
      .from('.hero-icp', { opacity: 0, duration: 0.4 }, 1.2)
      .from('.hero-offer', { opacity: 0, duration: 0.4 }, 1.4)
      .from('.hero-cta', { opacity: 0, y: 10, duration: 0.4 }, 1.6)
      .from('.hero-microcopy, .hero-bullets li', { opacity: 0, duration: 0.3, stagger: 0.08 }, 1.8);
    ScrollTrigger.refresh();
  });
</script>
```

**Criterios de aceite:**
1. QUANDO abrir a pagina, ENTAO topbar sticky no topo com ponto pulsante laranja a esquerda
2. QUANDO Hero renderiza, ENTAO H1 em 3 linhas distintas (regular, bold com "Claude" em laranja, italico) e mask-reveal varre da esquerda para direita em cada linha
3. QUANDO clicar no CTA `HERO_CTA`, ENTAO dispara `CustomEvent('open-capture-modal')` (handler global da Story 11)
4. QUANDO `prefers-reduced-motion: reduce` ativo, ENTAO animacao GSAP passa em `0.01ms` (CSS da Story 02)
5. QUANDO testar em 375px, ENTAO H1 nao corta texto, `clamp()` escala corretamente

**Comando de validacao:**
```bash
cd site && npx astro build && npx astro check
```

---

### Story 07 — SocialProof marquee (2 direcoes, 19 PNGs)

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** Story 04, Story 05
- **Arquivos a criar:** `site/src/components/sections/SocialProof.astro`
- **Arquivos a modificar:** `site/src/pages/index.astro`
- **Patterns a seguir:** `landing-page-pattern.md` secao 5.5 (marquee 100% CSS, zero JS)

**Contexto:** 2 faixas paralelas rolando em direcoes opostas (`marquee-left` e `marquee-right` keyframes ja definidas na Story 02). Cada faixa contem as 19 imagens duplicadas (para loop seamless em `-50%`). `pause on hover` via `:hover { animation-play-state: paused }`. Imagens com `loading="lazy"` e `decoding="async"`. Altura fixa ~240px para evitar CLS.

**Codigo de referencia:**

```astro
---
// site/src/components/sections/SocialProof.astro
import { CONFIG } from '../../config';
const imgs = CONFIG.SOCIALPROOF_IMAGES;
const track = [...imgs, ...imgs]; // duplica para loop
---
<section class="relative border-t border-rule py-20 sm:py-28 overflow-hidden bg-page">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
    <h2 class="font-display text-[clamp(2rem,5vw,3.25rem)] leading-tight text-ink-primary">
      {CONFIG.SOCIALPROOF_HEADLINE}
    </h2>
    <p class="mt-4 font-sans text-ink-secondary text-lg max-w-2xl">{CONFIG.SOCIALPROOF_SUB}</p>
  </div>

  <div class="flex flex-col gap-6">
    <div class="marquee flex gap-6 animate-marquee-left hover:[animation-play-state:paused]">
      {track.map((src, i) => (
        <img src={src} alt="" loading="lazy" decoding="async" width="320" height="240" class="h-60 w-auto flex-shrink-0 object-contain border border-rule bg-elevated" />
      ))}
    </div>
    <div class="marquee flex gap-6 animate-marquee-right hover:[animation-play-state:paused]">
      {track.map((src, i) => (
        <img src={src} alt="" loading="lazy" decoding="async" width="320" height="240" class="h-60 w-auto flex-shrink-0 object-contain border border-rule bg-elevated" />
      ))}
    </div>
  </div>

  <p class="mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 font-mono text-xs tracking-widest text-ink-muted uppercase">
    {CONFIG.SOCIALPROOF_FOOTER}
  </p>
</section>
```

**Criterios de aceite:**
1. QUANDO faixa renderiza, ENTAO mostra 38 itens por track (19 x2) e rolagem e seamless (sem jump)
2. QUANDO mouse entra na faixa, ENTAO animacao pausa; ao sair, retoma
3. QUANDO testar em mobile, ENTAO scroll vertical da pagina funciona normalmente (marquee nao captura touchmove)
4. QUANDO Lighthouse rodar, ENTAO CLS < 0.1 (width/height explicitos garantem)
5. QUANDO imagem quebrar por 404, ENTAO `alt=""` impede leitor de tela anunciar lixo

**Comando de validacao:**
```bash
cd site && npx astro build && grep -c "depoimento-" dist/index.html
# esperado: 38 (19 imgs x 2 tracks duplicadas)
```

---

### Story 08 — BigIdea + UseCases

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** Story 04
- **Arquivos a criar:** `site/src/components/sections/BigIdea.astro`, `site/src/components/sections/UseCases.astro`
- **Arquivos a modificar:** `site/src/pages/index.astro`, `site/src/config.ts` (ja deve ter os arrays de casos; garantir populacao)
- **Patterns a seguir:** PRD secoes 4.4 e 4.5

**Contexto:** BigIdea e o bloco narrativo central da tese "2015 -> 2026". Tipografia protagonista: H2 Fraunces dominante (~clamp 2.5rem-4.5rem), 2 paragrafos de apoio em Inter Tight, assinatura mono italico. Mask-reveal GSAP no H2 quando entra no viewport.

UseCases e grid editorial 2 col **alternando tamanho** (nao uniforme). Icones Lucide monocromaticos stroke 1.5 (proibido emoji colorido). 8 setores conforme PRD.

**Codigo de referencia:**

```astro
---
// site/src/components/sections/BigIdea.astro
import { CONFIG } from '../../config';
---
<section class="relative border-t border-rule bg-surface py-24 sm:py-36">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-8 reveal">A TESE DA PAGINA</p>
    <h2 class="font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.05] text-ink-primary reveal" data-mask-reveal>
      Aprender Claude Code em 2026 tem a vantagem de quem aprendeu marketing digital em 2015.
    </h2>
    <div class="mt-12 space-y-6 font-sans text-ink-secondary text-lg leading-relaxed max-w-2xl">
      <p class="reveal">Poucos sabiam. Muitos negocios precisavam.</p>
      <p class="reveal">Hoje, dashboards, ferramentas internas, automacoes e aplicacoes de nicho deixaram de ser "software". Viraram ativo digital de qualquer negocio minimamente serio.</p>
    </div>
    <p class="mt-16 font-mono italic text-sm text-ink-muted reveal">Mateus Dias, abril de 2026</p>
  </div>
</section>

<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('section [data-mask-reveal]').forEach((el) => {
    gsap.from(el, {
      clipPath: 'inset(0 100% 0 0)',
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
    });
  });
</script>
```

```astro
---
// site/src/components/sections/UseCases.astro
import { CONFIG } from '../../config';
import { Stethoscope, Scale, HardHat, GraduationCap, Store, TrendingUp, Megaphone, BedDouble } from 'lucide-react';

const icons = [Stethoscope, Scale, HardHat, GraduationCap, Store, TrendingUp, Megaphone, BedDouble];
// CONFIG.USECASES: [{ sector, title, body }, ...] — ver PRD secao 4.5
---
<section class="relative border-t border-rule py-24 sm:py-36 bg-page">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">QUEM JA USA</p>
    <h2 class="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink-primary mb-16">
      Setores que ja estao construindo com Claude Code.
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule">
      {CONFIG.USECASES.map((uc, i) => {
        const Icon = icons[i];
        const emphasize = [0, 3, 5].includes(i); // 3 cards maiores
        return (
          <article class={`p-8 sm:p-10 bg-page ${emphasize ? 'md:col-span-2 md:p-14' : ''}`}>
            <Icon strokeWidth={1.5} size={32} className="text-accent mb-6" />
            <h3 class="font-display text-2xl sm:text-3xl text-ink-primary mb-3">{uc.sector}</h3>
            <p class="font-sans text-ink-secondary text-base leading-relaxed">{uc.body}</p>
          </article>
        );
      })}
    </div>
  </div>
</section>
```

**Criterios de aceite:**
1. QUANDO BigIdea entra no viewport, ENTAO H2 recebe mask-reveal da esquerda para direita
2. QUANDO UseCases renderiza, ENTAO grid alterna tamanhos (3 cards full-width + 5 half-width) e separadores sao reguas 1px `rule`
3. QUANDO `prefers-reduced-motion`, ENTAO mask-reveal desliga
4. QUANDO testar em mobile 375px, ENTAO cards empilham em 1 coluna sem quebrar icones

**Comando de validacao:**
```bash
cd site && npx astro build && npx astro check
```

---

### Story 09 — ParaQuem + Benefits + Timeline

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** Story 04
- **Arquivos a criar:** `site/src/components/sections/ParaQuem.astro`, `site/src/components/sections/Benefits.astro`, `site/src/components/sections/Timeline.astro`
- **Arquivos a modificar:** `site/src/pages/index.astro`, `site/src/config.ts` (garantir arrays de perfis, beneficios, timeline)
- **Patterns a seguir:** PRD secoes 4.6, 4.7, 4.8

**Contexto:** 3 secoes editoriais back-to-back.
- **ParaQuem** — grid 3x2, cards `bg-surface` com borda inferior `rule`. 6 perfis.
- **Benefits** — numerados 01-04. Numero grande em Fraunces 72px, titulo 24px, descricao Inter Tight 16px. CTA inline no fim (`data-open-modal`, `data-cta-location="benefits"`).
- **Timeline** — horizontal em desktop (regua com 4 pontos), empilhada mobile (`flex-col md:flex-row`). 4 blocos de horario. Rodape mono com "gravacao liberada".

**Codigo de referencia (recortes):**

```astro
---
// site/src/components/sections/Benefits.astro
import { CONFIG } from '../../config';
---
<section class="relative border-t border-rule py-24 sm:py-36 bg-surface">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">O QUE SO QUEM ESTA NO GRUPO TEM</p>
    <h2 class="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink-primary mb-20">
      4 condicoes que o publico geral nao vai ter.
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
      {CONFIG.BENEFITS.map((b, i) => (
        <article class="relative">
          <p class="font-display text-[clamp(3rem,6vw,5rem)] text-accent leading-none mb-4">{String(i + 1).padStart(2, '0')}</p>
          <h3 class="font-display text-2xl sm:text-[26px] text-ink-primary mb-3">{b.title}</h3>
          <p class="font-sans text-ink-secondary text-base leading-relaxed">{b.body}</p>
        </article>
      ))}
    </div>
    <button type="button" data-open-modal data-cta-location="benefits"
      class="mt-20 inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-page font-mono text-sm tracking-widest uppercase px-8 py-4 transition-colors">
      QUERO ENTRAR NO GRUPO
    </button>
  </div>
</section>
```

```astro
---
// site/src/components/sections/Timeline.astro
import { CONFIG } from '../../config';
---
<section class="relative border-t border-rule py-24 sm:py-36 bg-page">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">AGENDA DO DIA</p>
    <h2 class="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink-primary mb-6">Como seu sabado vai ser montado.</h2>
    <p class="font-sans text-ink-secondary text-lg mb-16 max-w-2xl">Voce sai do dia com a operacao configurada, nao so com o conceito entendido.</p>

    <ol class="relative md:flex md:gap-0 md:items-start md:before:content-[''] md:before:absolute md:before:top-4 md:before:left-0 md:before:right-0 md:before:h-px md:before:bg-rule">
      {CONFIG.TIMELINE.map((t, i) => (
        <li class="relative md:flex-1 md:px-6 py-8 md:py-0 border-b md:border-b-0 md:border-r last:border-r-0 border-rule">
          <span class="hidden md:block w-2 h-2 rounded-full bg-accent mb-6 -translate-y-[5px]"></span>
          <span class="font-mono text-xs tracking-wider text-accent block mb-3">{t.time}</span>
          <h3 class="font-display text-xl text-ink-primary mb-2">{t.title}</h3>
          <p class="font-sans text-sm text-ink-secondary leading-relaxed">{t.body}</p>
        </li>
      ))}
    </ol>
    <p class="mt-12 font-mono text-xs tracking-widest text-ink-muted uppercase">
      Sabado 16/05 · 09h as 17h · ao vivo no Zoom com gravacao liberada.
    </p>
  </div>
</section>
```

**Criterios de aceite:**
1. QUANDO ParaQuem renderiza, ENTAO 6 perfis em grid 3x2 em `md`, 1 col em mobile
2. QUANDO Benefits renderiza, ENTAO 4 blocos numerados com numero Fraunces grande em laranja
3. QUANDO CTA de Benefits e clicado, ENTAO dispara `open-capture-modal` com `cta_location="benefits"` no analytics
4. QUANDO Timeline renderiza em desktop (>= 768px), ENTAO layout horizontal com regua 1px e 4 pontos; em mobile, empilhado vertical com separadores
5. QUANDO ler texto da Timeline, ENTAO rodape contem "gravacao liberada" (PRD ajuste 5.1)

**Comando de validacao:**
```bash
cd site && npx astro build && ! grep -n "Sistema 10x" dist/index.html && echo OK
```

---

### Story 10 — Autoridade Mateus + FinalCTA + FAQ + Footer

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** Story 04, Story 05
- **Arquivos a criar:** `site/src/components/sections/Autoridade.astro`, `site/src/components/sections/FinalCTA.astro`, `site/src/components/sections/FAQ.astro` (com accordion Astro puro), `site/src/components/Footer.astro`
- **Arquivos a modificar:** `site/src/pages/index.astro`
- **Patterns a seguir:** PRD secoes 4.9, 4.10, 4.11, 4.12

**Contexto:** 4 blocos finais agrupados para caber em 12 stories.
- **Autoridade** — split 50/50 desktop, foto do Mateus (`/mateus.webp`) com `filter: grayscale(1) contrast(1.1)` CSS.
- **FinalCTA** — full-width `bg-surface`, H2 Fraunces dominante, CTA `data-cta-location="final"`, `id="final-cta"` (ancora do TopBar).
- **FAQ** — 7 perguntas canonicas. Accordion com `<details>`/`<summary>` nativo (a11y free). 1 aberto por vez via script inline de ~15 linhas que fecha outros `<details>` ao abrir um.
- **Footer** — copyright VUK, 2 links legais (`⚠️ TODO`), email de contato (`⚠️ TODO`), logo mono.

**Codigo de referencia (recortes):**

```astro
---
// site/src/components/sections/Autoridade.astro
import { CONFIG } from '../../config';
---
<section class="relative border-t border-rule py-24 sm:py-36 bg-page">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
    <figure class="relative">
      <img src="/mateus.webp" alt="Mateus Dias" width="560" height="700" loading="lazy"
        class="w-full h-auto grayscale contrast-[1.1] border border-rule" />
    </figure>
    <div>
      <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">QUEM CONDUZ</p>
      <h2 class="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-ink-primary mb-8">Mateus Dias.</h2>
      <p class="font-sans text-lg text-ink-secondary leading-relaxed mb-8">{CONFIG.AUTHOR_BIO}</p>
      <ul class="space-y-2 font-mono text-sm text-ink-primary mb-8">
        {CONFIG.AUTHOR_CREDS.map((c) => <li class="before:content-['—'] before:text-accent before:mr-2">{c}</li>)}
      </ul>
      <p class="font-sans text-base text-ink-secondary leading-relaxed">{CONFIG.AUTHOR_PROOF}</p>
    </div>
  </div>
</section>
```

```astro
---
// site/src/components/sections/FAQ.astro
import { CONFIG } from '../../config';
---
<section class="relative border-t border-rule py-24 sm:py-36 bg-page" id="faq">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">PERGUNTAS FREQUENTES</p>
    <h2 class="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink-primary mb-16">Respostas rapidas antes de voce entrar.</h2>
    <ul class="divide-y divide-rule border-t border-b border-rule" id="faq-list">
      {CONFIG.FAQ.map((q) => (
        <li>
          <details class="group">
            <summary class="flex justify-between items-center py-6 cursor-pointer font-display text-xl text-ink-primary list-none">
              {q.q}
              <span class="text-accent font-mono text-2xl transition-transform group-open:rotate-45">+</span>
            </summary>
            <p class="pb-6 font-sans text-ink-secondary leading-relaxed">{q.a}</p>
          </details>
        </li>
      ))}
    </ul>
  </div>
</section>
<script>
  // 1 aberto por vez
  const list = document.getElementById('faq-list');
  list?.addEventListener('toggle', (e) => {
    const target = e.target as HTMLDetailsElement;
    if (!target.open) return;
    list.querySelectorAll('details[open]').forEach((d) => { if (d !== target) (d as HTMLDetailsElement).open = false; });
  }, true);
</script>
```

**Criterios de aceite:**
1. QUANDO Autoridade renderiza, ENTAO foto aplica `grayscale(1)` e contraste +10%
2. QUANDO FinalCTA renderiza, ENTAO tem `id="final-cta"` (TopBar scroll target)
3. QUANDO abrir uma pergunta do FAQ, ENTAO as outras fecham automaticamente (1 aberto por vez)
4. QUANDO ler FAQ pergunta 6, ENTAO texto menciona "infra completa" (NAO "Sistema 10x")
5. QUANDO footer renderiza, ENTAO contem copyright VUK e marca links legais com `⚠️ TODO` visivel como comentario HTML (nao em producao)

**Comando de validacao:**
```bash
cd site && npx astro build && grep -c "final-cta" dist/index.html
# esperado: >= 2 (ancora + id)
```

---

### Story 11 — Modal de captura (React island)

- **Complexidade:** G
- **Modelo sugerido:** implementer-opus
- **Depende de:** Story 03, Story 04
- **Arquivos a criar:** `site/src/components/react/CaptureModal.tsx`, `site/src/lib/utm.ts`, `site/src/scripts/modal-trigger.ts`
- **Arquivos a modificar:** `site/src/layouts/Base.astro` (inclui `<CaptureModal client:load />` + script global `modal-trigger.ts`)
- **Patterns a seguir:**
  - `~/.claude/skills/landing-page-prd/references/modal-pattern.md` (contrato INTEIRO, nao reinventar)
  - `~/.claude/skills/landing-page-prd/references/analytics-pattern.md` secoes 3, 4, 5 (eventID, UTMs, webhooks)
  - PRD secao 5.4 (campos + textos + fluxo)

**Contexto:** Story mais critica. Unico ponto de conversao. Seguir `modal-pattern.md` item por item; nao inventar variantes. Componente React unico, client:load, escuta `window` para `CustomEvent('open-capture-modal')`. `modal-trigger.ts` e um delegador global que captura clicks em `[data-open-modal]` e despacha o evento, para CTAs espalhados em `.astro` estaticos nao precisarem importar React.

Checklist da story (derivado do contrato):
- [ ] `role="dialog"`, `aria-modal="true"`, `aria-labelledby="capture-modal-title"`
- [ ] Primeiro input recebe focus via `requestAnimationFrame` apos mount
- [ ] Tab/Shift+Tab confinados (focus trap manual sobre `input, button`)
- [ ] Esc fecha via `requestClose()` (nao `close()` direto)
- [ ] Backdrop click passa por `requestClose()` com `window.confirm()` quando form sujo
- [ ] Submit loading: botao `disabled`, texto muda para "Enviando..."
- [ ] `eventID` gerado uma vez, passado pra `fbq('track', 'Lead', {}, { eventID })`, `gtag('event', 'generate_lead', { event_id })` e payload do webhook
- [ ] `CONFIG.WEBHOOK_URLS.forEach(url => fetch(url, {...}).catch(()=>{}))` fire-and-forget
- [ ] Redirect com `buildUrlWithUTMs(CONFIG.REDIRECT_URL, utmParams)` apos gatilhos
- [ ] Erro renderiza com `role="alert" aria-live="assertive"`
- [ ] Mascara telefone `(XX) XXXXX-XXXX`, `inputMode="numeric"`, `autocomplete="tel-national"`, `raw` salvo no payload
- [ ] `document.body.style.overflow = 'hidden'` no mount, restaurar no cleanup
- [ ] CTAs passam `data-cta-location` (`hero | benefits | final`); `click_cta` disparado em GA4 antes de abrir

**Codigo de referencia (esqueleto, nao final):**

```tsx
// site/src/components/react/CaptureModal.tsx
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';
import { CONFIG } from '../../config';
import { captureUTMs, getStoredUTMs, buildUrlWithUTMs } from '../../lib/utm';

export function CaptureModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const cardRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { captureUTMs(); }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('open-capture-modal', onOpen);
    return () => window.removeEventListener('open-capture-modal', onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => firstInputRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
      if (e.key === 'Tab') trapFocus(e);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function trapFocus(e: KeyboardEvent) {
    if (!cardRef.current) return;
    const focusables = cardRef.current.querySelectorAll<HTMLElement>(
      'input, button, [href], [tabindex]:not([tabindex="-1"])'
    );
    const visibles = Array.from(focusables).filter((el) => el.offsetParent !== null);
    if (!visibles.length) return;
    const first = visibles[0];
    const last = visibles[visibles.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function requestClose() {
    const hasData = name.trim() || email.trim() || phone.trim();
    if (hasData && status !== 'success') {
      if (!window.confirm('Fechar agora? Os dados preenchidos serao perdidos.')) return;
    }
    setOpen(false);
    setStatus('idle');
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Preencha seu nome.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalido.';
    if (phone.replace(/\D/g, '').length < 10) e.phone = 'Telefone invalido.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');

    const eventID = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const utms = getStoredUTMs();
    const payload = { name: name.trim(), email: email.trim(), phone: phone.replace(/\D/g, ''), event_id: eventID, ...utms };

    CONFIG.WEBHOOK_URLS.forEach((url) => {
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});
    });

    (window as any).fbq?.('track', 'Lead', {}, { eventID });
    (window as any).gtag?.('event', 'generate_lead', { event_id: eventID });

    if (CONFIG.REDIRECT_URL) {
      window.location.href = buildUrlWithUTMs(CONFIG.REDIRECT_URL, utms);
      return;
    }
    setStatus('success');
  }

  function maskPhone(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-ink-primary/60 flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}
        >
          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="capture-modal-title"
            className="relative bg-elevated w-full sm:max-w-md border border-rule p-8 sm:p-10"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
          >
            <button type="button" onClick={requestClose} aria-label="Fechar" className="absolute top-4 right-4 text-ink-muted hover:text-ink-primary">
              <X size={20} />
            </button>
            <h2 id="capture-modal-title" className="font-display text-3xl text-ink-primary mb-2">{CONFIG.MODAL_TITLE}</h2>
            <p className="font-sans text-ink-secondary text-base mb-6">{CONFIG.MODAL_SUBTITLE}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* inputs: name, email, phone; cada um com label, error inline, aria-invalid */}
              {status === 'error' && (
                <div role="alert" aria-live="assertive" className="flex items-center gap-2 text-accent font-mono text-sm">
                  <AlertCircle size={16} />
                  <span>{CONFIG.MODAL_ERROR}</span>
                </div>
              )}
              <button type="submit" disabled={status === 'loading'}
                className="w-full bg-accent hover:bg-accent-hover text-page font-mono text-sm tracking-widest uppercase py-4 disabled:opacity-60">
                {status === 'loading' ? 'Enviando...' : CONFIG.MODAL_SUBMIT}
              </button>
              <p className="text-center font-mono text-xs text-ink-muted">{CONFIG.MODAL_PRIVACY}</p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

```ts
// site/src/scripts/modal-trigger.ts (incluido como <script> no Base.astro)
document.addEventListener('click', (e) => {
  const trigger = (e.target as HTMLElement).closest<HTMLElement>('[data-open-modal]');
  if (!trigger) return;
  e.preventDefault();
  const loc = trigger.dataset.ctaLocation ?? 'unknown';
  (window as any).gtag?.('event', 'click_cta', { cta_location: loc });
  window.dispatchEvent(new CustomEvent('open-capture-modal'));
});
```

**Criterios de aceite:**
1. QUANDO clicar em qualquer CTA `data-open-modal`, ENTAO `click_cta` dispara no GA4 com `cta_location` correto e modal abre em ~200ms
2. QUANDO modal abrir, ENTAO primeiro input recebe foco e `body` ganha `overflow: hidden`
3. QUANDO Tab cicla, ENTAO foco fica preso entre 3 inputs + botao X + submit; Shift+Tab cicla ao contrario
4. QUANDO Esc pressionado com form sujo, ENTAO `confirm()` aparece; com form vazio, fecha direto
5. QUANDO submit valido, ENTAO `Lead` dispara em Meta (se Pixel ativo) e `generate_lead` em GA4 **com mesmo `event_id`**, webhook recebe POST, redirect vai para Sendflow com UTMs
6. QUANDO `PUBLIC_WEBHOOK_URLS` vazio, ENTAO submit pula o `forEach(fetch)` mas ainda dispara analytics e redireciona
7. QUANDO 2 cliques rapidos no submit, ENTAO segunda requisicao nao sai (`disabled` efetivo)
8. QUANDO erro de rede, ENTAO modal nao trava (fire-and-forget nao aguarda response)

**Comando de validacao:**
```bash
cd site && npm run dev
# manual: abrir http://localhost:4321, testar via DevTools Network + GA4 DebugView + console
```

---

### Story 12 — Audit mobile + verificacao pre-deploy

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** Story 11
- **Arquivos a criar:** `site/docs/quality-checklist.md` (baseado em `intensivo-claude-code-astro/docs/quality-checklist.md`), `docs/mobile-audit.md`
- **Arquivos a modificar:** ajustes pontuais em secoes conforme achados do audit
- **Patterns a seguir:** skill `landing-page-audit` (executar), PRD secao 7 e 8

**Contexto:** Ultimo gate antes do merge em main. Roda o audit de mobile nos 4 breakpoints (320/390/768/1024) e preenche o checklist de 13 itens SEO. Resolver ou aceitar explicitamente cada item marcado `⚠️ TODO` do PRD secao 10 antes de abrir PR.

**Atividades:**

1. Rodar `landing-page-audit` (skill dedicada) — gera `docs/mobile-audit.md`
2. Revisar 13 itens SEO via `curl` no `dist/index.html`:
   ```bash
   cd site && npx astro build
   grep -E "<title>|name=\"description\"|name=\"keywords\"|rel=\"canonical\"|theme-color|application/ld\\+json|apple-touch-icon|manifest" dist/index.html
   ```
3. Rodar Lighthouse manual em producao local (`npm run preview`) — thresholds: Performance >= 90, A11y >= 95, Best Practices >= 95, SEO >= 95
4. Validar JSON-LD em https://search.google.com/test/rich-results (apos deploy)
5. Fechar ou aceitar os 7 TODOs do PRD secao 10:
   - Dominio final → canonical e JSON-LD
   - Meta Pixel ID → `.env`
   - Webhook URL → `.env`
   - URL do Zoom → JSON-LD `Event.location`
   - Politica privacidade + Termos → Footer
   - Email contato → Footer
   - OG image → revisar se bate com tema light; se nao, recriar

**Criterios de aceite:**
1. QUANDO audit rodar, ENTAO `docs/mobile-audit.md` existe e nao lista falha critica em 320px, 390px, 768px, 1024px
2. QUANDO `dist/index.html` for buscado por `grep`, ENTAO os 13 itens SEO estao presentes
3. QUANDO rodar Lighthouse mobile no `npm run preview`, ENTAO 4 scores >= 90/95/95/95
4. QUANDO `quality-checklist.md` for aberto, ENTAO todos os items estao `[x]` ou justificados com `⚠️ BLOCKER <razao>`

**Comando de validacao:**
```bash
cd site && npx astro build && npm run preview
# paralelo: rodar Lighthouse CI ou DevTools em http://localhost:4321
```

---

## Checklist de a11y

- [ ] Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, Esc fecha, backdrop condicional com `confirm()` em form sujo, `role="alert"` + `aria-live="assertive"` no erro, `disabled` no submit durante `status==='loading'`
- [ ] Contraste WCAG AA em todo texto sobre fundo (testar `ink-secondary #4A4744` sobre `page #FBFAF7` e `ink-muted #8A8580` sobre `surface #F3F1EC` — ambos precisam bater 4.5:1 em texto < 18px)
- [ ] `prefers-reduced-motion`: global CSS da Story 02 aplica `0.01ms` em animacao e transicao; GSAP timelines respeitam via `gsap.matchMedia` OU o override CSS basta (verificar no audit)
- [ ] Focus visivel em todos os elementos interativos (CTA, inputs, accordion summary, botao X do modal) — outline custom laranja `#E4572E` com 2px offset
- [ ] Labels associadas a inputs (`htmlFor`/`id`) no modal
- [ ] Landmarks semanticos (`<header>` topbar, `<main>` wrap das secoes, `<footer>`, cada secao com `aria-labelledby` no H2)
- [ ] Skip-to-content link no topo do `<body>` (focus visible apenas)
- [ ] Imagens de marquee com `alt=""` (decorativas); `mateus.webp` com `alt="Mateus Dias"`; PNGs de depoimento com `alt=""` (sao prints nao legiveis de texto curto)

## Checklist de analytics (3 pilares)

- [ ] GA4 com `PUBLIC_GA_ID=G-7CJMYD129G` injetado condicionalmente em `Base.astro`
- [ ] Meta Pixel desativado em v1 (`PUBLIC_META_PIXEL_ID` vazio no `.env.example`); condicional `{META_PIXEL && ...}` no layout preservado
- [ ] UTM capture no mount de `CaptureModal` (`captureUTMs()`), persistencia em `sessionStorage`, append no redirect via `buildUrlWithUTMs`
- [ ] Evento `Lead`/`generate_lead` no submit com `event_id` UUID compartilhado entre Meta + GA4 + payload do webhook
- [ ] Evento `click_cta` em cada CTA via delegador global `modal-trigger.ts` (passa `cta_location` = `hero | benefits | final`)
- [ ] Webhook fetch fire-and-forget em paralelo (`.forEach(fetch)`), nao bloqueia redirect; quando `WEBHOOK_URLS` vazio, pula sem quebrar
- [ ] Quando webhook vazio, ainda dispara `generate_lead` no GA4 (mede preenchimento do form)

## Checklist de SEO (13 itens do CLAUDE.md global)

- [ ] `favicon.ico` + `favicon.png` (importados em Story 05)
- [ ] `public/robots.txt` com crawlers de LLM (GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended) — copiar e revisar
- [ ] `public/llms.txt` reescrito para refletir a copy nova do Intensivo (nao deixar a do ICC Astro anterior)
- [ ] OG image 1200x630 (`⚠️ BLOCKER LIGHT`: manter do ICC Astro em v1 e revisar se casa visualmente com tema light editorial; recriar em design pass se nao bater)
- [ ] `<title>`: `Intensivo Claude Code · 16/05 ao vivo no Zoom` (45 chars, < 60 OK)
- [ ] `<meta description>`: ≈ 140 chars conforme PRD
- [ ] `<meta keywords>`, `<meta author>`, `<meta robots>`
- [ ] `<meta viewport>`, `<html lang="pt-BR">`, `<meta charset="UTF-8">`
- [ ] `<link rel="canonical">` (⚠️ TODO: definir com dominio final antes do deploy)
- [ ] `<meta theme-color="#FBFAF7">` batendo com `manifest.theme_color`
- [ ] `<link rel="manifest">` + `public/manifest.webmanifest` ajustado para light
- [ ] `<link rel="apple-touch-icon">` (180x180)
- [ ] `<script type="application/ld+json">` com `Organization` + `WebSite` + `Event`

## Checklist de performance

- [ ] Lighthouse mobile (375px, Slow 4G): Performance >= 90, A11y >= 95, Best Practices >= 95, SEO >= 95
- [ ] LCP <= 2.5s, CLS <= 0.1, INP <= 200ms
- [ ] Imagens com `width`/`height` explicitos (evita CLS): marquee 320x240, mateus 560x700
- [ ] `mateus.webp` ja em WebP; PNGs de depoimento aceitaveis (nao convertir, sao prints existentes)
- [ ] Fonts Google com `display=swap` e `preconnect` em `fonts.googleapis.com` + `fonts.gstatic.com`
- [ ] Tailwind purga classes nao usadas no build (`content: ['./src/**/*.{astro,tsx,...}']`)
- [ ] JS islands minimizados: so `CaptureModal` e `client:load`. Tudo resto e `.astro` estatico + `<script>` inline
- [ ] GSAP importado como module, tree-shake ativado pelo Vite

## Checklist de motion hygiene

- [ ] GSAP 3 cuida de: mask-reveal H1, mask-reveal H2 em BigIdea, entrada do Hero, entrada de secoes ao scroll
- [ ] `motion` v12 cuida de: abrir/fechar modal (`AnimatePresence`, scale + fade)
- [ ] CSS puro cuida de: marquee-left, marquee-right, live-pulse no topbar, shimmer se usar (nao planejado aqui)
- [ ] `framer-motion` ausente (rodar `grep -ri "framer-motion" site/package.json site/src/` e confirmar zero)
- [ ] `tailwindcss-animate` ausente (rodar mesmo grep)
- [ ] `ScrollTrigger.refresh()` chamado apos `document.fonts.ready` no Hero (sem isso, mask-reveal quebra em Fraunces variable)
- [ ] `prefers-reduced-motion`: CSS global aplica override; GSAP respeita automaticamente via `gsap.matchMedia` OU o override CSS (validar no audit)
- [ ] Sem FLOP: Base.astro ja renderiza com `bg-page` antes de qualquer script carregar

## Checklist de dependency hygiene

- [ ] Nenhuma lib duplicando capacidade (`motion` + `framer-motion`; `gsap` + `anime.js`; `dayjs` + `date-fns`)
- [ ] `framer-motion` ausente do `package.json`
- [ ] `tailwindcss-animate` ausente (keyframes locais cobrem)
- [ ] `class-variance-authority` ausente (variantes simples com `clsx` bastam)
- [ ] `react-intersection-observer` ausente (GSAP `ScrollTrigger` basta)
- [ ] `@headlessui/react` ausente (`<details>`/`<summary>` nativos para FAQ)
- [ ] Build final `npx astro build` sem warnings

## Riscos tecnicos

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| Fraunces variable nao carrega em iOS Safari 15 | Media | Medio | `display=swap` + `font-display: swap` no CSS; mask-reveal disparado apos `document.fonts.ready` com `ScrollTrigger.refresh()` |
| Mask-reveal via `clip-path: inset()` bugga com fonte italico (linha 3 do H1) | Baixa | Medio | Testar em 375px iPhone real (Safari) durante Story 06; fallback: trocar por `overflow:hidden + translateX` mask se clip falhar |
| Marquee com 38 imagens de ~40KB cada = ~1.5MB total | Media | Medio | Imagens ja em PNG existente (nao convertemos para nao perder qualidade de print); usar `loading="lazy"` e `decoding="async"`; aceitar trade-off; revisar no Lighthouse |
| `.env` ausente em dev quebra build Astro por causa do `import.meta.env` | Baixa | Alto | Defaults via `?? ''`; condicionais `{GA_ID && ...}` e `filter(Boolean)` no `WEBHOOK_URLS.split(',')`; testar `npm run dev` sem `.env` na Story 04 |
| OG image do ICC Astro (tema dark anterior) nao bate com landing light | Alta | Baixo | Manter em v1 (PRD pendencia 7); planejar design pass antes do tráfego escalar; ate la, CTR organico no WhatsApp nao depende de OG |
| Canonical com placeholder "TODO" quebra indexacao se deploy acidental | Media | Alto | Story 12 checklist inclui verificacao `grep "TODO-DOMINIO-FINAL" dist/index.html` — build falha se encontrar antes do merge |
| Modal com `body.style.overflow = 'hidden'` nao restaura apos reload se bug de cleanup | Baixa | Alto | `useEffect` cleanup restaura `''`; Story 11 tem criterio de aceite explicito testando reload com modal aberto |
| Tailwind 4 muda nomenclatura de algum plugin vs Tailwind 3 docs | Media | Baixo | `@astrojs/tailwind@^5` ja e compat v4; se build falhar, fallback para `^3.4` e avisar o usuario |

## Deploy

1. Merge em `main` via GitHub. Vercel Git Integration dispara build automatico. **Proibido `npx vercel --prod`** (regra critica do CLAUDE.md global).
2. Antes do primeiro merge em `main`, configurar no Vercel Dashboard:
   - Root directory: `site/`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables: `PUBLIC_GA_ID`, `PUBLIC_REDIRECT_URL` (os outros podem ficar vazios em v1)
3. Apos primeiro deploy:
   - Abrir URL Vercel e verificar que `dist/index.html` expoe todos os meta tags + JSON-LD
   - Rodar Rich Results Test em https://search.google.com/test/rich-results (Event precisa validar)
   - Rodar Lighthouse no dominio de producao (thresholds do checklist)
4. Apos resolver pendencias do PRD secao 10 (dominio final, links legais, Zoom URL):
   - Atualizar `canonical` em `Base.astro`
   - Atualizar `location.url` do Event JSON-LD
   - Preencher Footer
   - Configurar DNS via Cloudflare MCP (skill `dns-ssl`)

---

## Proximo passo

Rodar `/expand-stories docs/plans/intensivo-claude-code.md` para explodir cada story em arquivo individual em `docs/stories/`. Depois, implementar na ordem:

- **Agora (P=15min cada):** Stories 01, 02, 03 em sequencia (scaffold -> tokens -> config)
- **Core visual (M=45min cada):** Stories 04, 06, 08, 09, 10 (layout + 5 secoes principais)
- **Interativos (1 P + 1 G):** Story 07 (marquee) + Story 11 (modal, 90min)
- **Gate final (P=15min):** Story 12 (audit + checklist)

Estimativa total: **~6h45min** de implementacao para ir do zero a pronto pra merge.
