# Intensivo Claude Code — Versao Astro (Dark Mode)

Landing do Intensivo Claude Code em **Astro 4 + componentes inspirados em 21st.dev/community + GSAP**, rodando em dark mode. Deploy em `https://icc.thesociety.com.br` (Vercel + Cloudflare DNS).

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Astro 4 (output estatico) |
| UI reativa | React 18 como islands (`@astrojs/react`) |
| Estilo | Tailwind CSS (darkMode: 'class' fixo) |
| Animacao hero / CTA | GSAP 3 (entrance stagger + magnetic CTA) |
| Microinteracoes React | `motion` v12 (via componentes 21st.dev / Aceternity) |
| Particulas | `@tsparticles/*` (hero/final sparkles) |
| Icones | lucide-react |
| Utils | class-variance-authority, clsx, tailwind-merge |

## Como rodar localmente

```bash
pnpm install        # ou npm install / yarn install / bun install
pnpm dev            # dev server em http://localhost:4321
pnpm build          # build estatico em ./dist
pnpm preview        # serve o ./dist localmente
```

## Estrutura

```
astro/
├── src/
│   ├── config.ts                  # copy, IDs, webhook, redirect (cópia do src/components/imersao/config.ts)
│   ├── env.d.ts
│   ├── layouts/Base.astro         # HTML shell dark, meta tags, GA4, Meta Pixel
│   ├── pages/index.astro          # orquestra secoes + dispara scripts GSAP
│   ├── components/
│   │   ├── sections/              # 9 secoes .astro (TopBar, Hero, Testimonials, ...)
│   │   ├── ui/                    # componentes 21st.dev-style (React)
│   │   └── react/                 # islands CaptureModal + AgentSwarm
│   ├── scripts/gsap-init.ts       # reveal + parallax + magnetic CTAs + modal bridge
│   ├── styles/global.css          # tokens dark + keyframes
│   └── lib/utils.ts               # helper cn()
├── public/                        # favicon, og-image, mateus.webp, 19 depoimentos
├── astro.config.mjs               # @astrojs/react + @astrojs/tailwind
├── tailwind.config.mjs            # tokens: base, surface, accent, ink-*
└── package.json
```

## Componentes UI (inspiracao 21st.dev)

| Arquivo | Origem conceitual |
|---|---|
| `ui/Spotlight.tsx` | aceternity-ui/spotlight-new |
| `ui/BeamsBackground.tsx` | aceternity-ui/beams-background |
| `ui/Marquee.tsx` | magicui/marquee |
| `ui/BentoGrid.tsx` | aceternity-ui/bento-grid |
| `ui/CardHover3D.tsx` | aceternity-ui/3d-card |
| `ui/Sparkles.tsx` | aceternity-ui/sparkles |
| `ui/HoverBorderGradient.tsx` | aceternity-ui/hover-border-gradient |
| `ui/NumberTicker.tsx` | magicui/number-ticker |
| `ui/VerticalTimeline.tsx` | aceternity-ui/timeline |
| `ui/Accordion.tsx` | shadcn/accordion (escrito a mao sem Radix) |

Os componentes sao TypeScript React puros (sem depender de `shadcn@latest add`). Se quiser usar o CLI original do 21st.dev depois: `pnpm dlx shadcn@latest add "https://21st.dev/r/<autor>/<slug>"` vai populate `src/components/ui/` com o fonte canonico — e so trocar imports.

## Animacoes GSAP

Todas no arquivo `src/scripts/gsap-init.ts`:

- **Hero entrance**: stagger fade+rise em badge, wordmark, headline, subhead, price card, CTA, diagram (`gsap.from`).
- **Magnetic CTA**: `[data-magnetic]` faz o botao seguir levemente o cursor via `gsap.quickTo`.
- **Modal bridge**: `[data-open-modal]` dispara `CustomEvent('open-capture-modal')` que o `CaptureModal` (island React) escuta.

Respeita `prefers-reduced-motion: reduce` — quando ligado, nenhuma animacao GSAP e registrada.

> Reveals e parallax por scroll (Timeline, UseCases etc.) vivem dentro dos componentes React via `motion/react` (`useScroll`, `useInView`), nao em GSAP.

## Dark mode

O `<html>` sempre tem classe `dark`. Os tokens em `src/styles/global.css` + `tailwind.config.mjs`:

- `bg-base` `#0A0A0B` preto quase puro
- `bg-surface` `#141416` cards
- `bg-elevated` `#1C1C20` modals
- `text-ink-primary` `#F5F5F5`
- `text-ink-secondary` `#A8A8A8`
- `accent` `#E07A3A` | `accent-hover` `#F59E53` | `accent-deep` `#C85D25`

## Lead capture

`CaptureModal` (React island `client:load`):

1. Escuta evento `open-capture-modal` (disparado por qualquer `[data-open-modal]`).
2. Valida nome (>=2 chars), email (regex), telefone (11 digitos via mascara).
3. `POST` para webhook Supabase (`CONFIG.WEBHOOK_URL`) com UTMs.
4. Dispara `fbq('track','Lead')` + `gtag('event','generate_lead')` com `eventID` para dedup.
5. `window.location.href = CONFIG.REDIRECT_URL` com UTMs propagados.

IDs e webhooks vivem em `.env` (ver `.env.example`):

```
PUBLIC_GA_ID=G-XXXXXXXXXX
PUBLIC_META_PIXEL_ID=000000000000000
PUBLIC_WEBHOOK_URLS=https://webhook-1,https://webhook-2
PUBLIC_REDIRECT_URL=https://destino/obrigado
```

`Base.astro` so injeta os scripts GA4/Meta Pixel se as variaveis estiverem definidas — em dev sem `.env`, a pagina sobe sem tracking e sem reclamar.

## Deploy (referencia, fora do escopo)

Qualquer host estatico: Vercel, Cloudflare Pages, Netlify. Build command: `pnpm build`. Output dir: `dist/`.

## Checklist de smoke test

1. `pnpm dev` → abrir `http://localhost:4321`.
2. Fundo dark com spotlight laranja + beams visiveis.
3. Hero entra em stagger. Scroll → headline faz parallax suave.
4. Testimonials: 2 marquees em direcoes opostas, pause on hover.
5. Use Cases: bento grid 2/2 desktop, stack mobile.
6. Benefits: 4 cards com tilt 3D no mouse.
7. Timeline: cada bloco entra com stagger quando aparece.
8. Final: sparkles aleatorios + CTA magnetico.
9. FAQ: accordion abre/fecha, 1 item aberto por vez.
10. Qualquer CTA abre modal dark → erros inline → submit → redirect.
11. DevTools > `prefers-reduced-motion: reduce` → animacoes desligam.
