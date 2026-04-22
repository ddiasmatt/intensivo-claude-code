---
title: Story 04 — Layout Base.astro com SEO, Analytics, fonts, JSON-LD
slug: intensivo-claude-code-04
plan: docs/plans/intensivo-claude-code.md
prd: docs/prds/intensivo-claude-code.md
complexity: M
model: implementer-sonnet
depends_on: [Story 02, Story 03]
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code]
---

# Story 04 — Layout Base.astro com SEO, Analytics, fonts, JSON-LD

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
