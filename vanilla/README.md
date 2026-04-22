# Intensivo Claude Code — Versão Vanilla

Landing da Imersão em **HTML + CSS + JS puro**, sem build step, sem framework. Clone fiel da versão React (`/src`), mas rodando direto do filesystem.

## Como rodar localmente

```bash
# Opção 1: abrir direto no navegador
open index.html

# Opção 2: servir via HTTP (melhor para testar fetch/webhook)
npx serve .
# ou
python3 -m http.server 8000
```

## Estrutura

```
vanilla/
├── index.html              # HTML semântico, meta tags, Schema.org, GA4, Meta Pixel
├── styles/
│   ├── tokens.css          # design tokens (cores, spacing, typography)
│   ├── base.css            # reset + utilities (container, sr-only)
│   ├── components.css      # btn, card, dialog, accordion, marquee, keyframes
│   └── sections.css        # hero, testimonials, usecases, benefits, timeline, final, faq
├── scripts/
│   ├── analytics.js        # wrappers GA4 + Meta Pixel (trackLead)
│   ├── phone-mask.js       # máscara (XX) XXXXX-XXXX
│   ├── modal.js            # validação + submit + redirect
│   ├── agent-swarm.js      # animação dos 10 agentes no hero
│   ├── interactive-graph.js# grafo SVG interativo das 4 frentes
│   └── main.js             # boot: UTMs, CTAs, scroll reveal, testimonials
└── assets/
    ├── mateus.webp
    ├── favicon.png
    ├── og-image.png
    └── depoimentos/        # 19 PNGs
```

## Princípios aplicados (clean-code)

- **HTML5 semântico**: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<dialog>` nativo, `<details>`/`<summary>` para FAQ (acessível sem JS)
- **CSS com custom properties**: tokens centralizados em `tokens.css`, BEM para nomear classes
- **JS sem dependências**: IIFEs, sem framework, sem jQuery, zero libs externas
- **Acessibilidade**: ARIA labels, skip link, focus-visible, navegação por teclado (Esc fecha modal/viewer), touch targets ≥ 44px
- **Performance**: `loading="lazy"` em imagens below-the-fold, fontes com `font-display: swap`, IntersectionObserver para animação on-scroll
- **Reduced motion**: `prefers-reduced-motion: reduce` desliga todas as animações

## Como deployar

Qualquer hospedagem estática funciona:

### Cloudflare Pages (recomendado)
```bash
npx wrangler pages deploy . --project-name intensivo-claude-vanilla
```

### Vercel
```bash
npx vercel --yes
```

### Netlify
Arraste a pasta `vanilla/` para https://app.netlify.com/drop

### S3 + CloudFront
```bash
aws s3 sync . s3://BUCKET/ --exclude "README.md"
```

## Integrações ativas

- **GA4** (`G-7CJMYD129G`): PageView automático no head, `generate_lead` no submit
- **Meta Pixel** (`310399388108164`): PageView automático, `Lead` no submit com `eventID` único (deduplicação)
- **Webhook Supabase**: POST JSON com `{name, email, phone, utm_*}` para `dwkfaqbfhdeemulmkxjn.supabase.co/functions/v1/webhook-funnel?type=generico&funnel_id=14`
- **Redirect pós-lead**: `https://sndflw.com/i/trV5sqi3n9eSZD0U1Rlx` com UTMs propagados

Para trocar os valores de produção, edite as constantes no topo de `scripts/modal.js`:

```js
var WEBHOOK_URL = '...';
var REDIRECT_URL = '...';
```

E o ID do GA4/Meta Pixel no `<head>` do `index.html`.

## Smoke test

1. Abrir `index.html` no navegador
2. Conferir hero, headline, agentes animando, botão CTA com glow
3. Rolar para testimonials — marquees devem rodar em direções opostas
4. Chegar no use cases — grafo SVG aparece, nodes oscilam, hover destaca edges
5. Clicar em qualquer CTA — modal abre, form visível
6. Submeter vazio — 3 erros aparecem
7. Digitar telefone — máscara `(XX) XXXXX-XXXX` aplicada ao vivo
8. Submeter válido — request sai pra Supabase (aba Network), GA4/Meta Pixel dispara, redirect
9. Abrir FAQ — cada `<details>` abre/fecha sem JS
10. Testar responsivo em 375px, 768px, 1280px
