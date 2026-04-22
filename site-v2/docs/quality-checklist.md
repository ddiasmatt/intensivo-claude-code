---
title: Checklist de Validacao de Qualidade — Landing Novo Intensivo Claude Code
created: 2026-04-22
tags: [checklist, quality, pre-deploy, intensivo-claude-code, astro]
status: active
project: intensivo-claude-code-landing
---

# Checklist de Validacao de Qualidade — Landing Intensivo Claude Code

> [!info] Como usar
> Roda esse checklist antes de cada deploy. Marca "manual" quando nao da pra automatizar. Qualquer item vermelho segura o merge.

## Build e codigo

- [x] `npx astro build` passa sem warnings nem erros
- [x] `git status` mostra so os arquivos intencionais (nada de `dist/`, `.env`, `node_modules/`)
- [x] Nenhum `bg-[#...]` novo em `.astro`/`.tsx` — tudo via token (`bg-page`, `bg-surface`, `bg-elevated`, `text-ink-*`, `accent*`)
- [x] Nenhum `import ... from "framer-motion"` — so `motion/react` quando hidracao React (Modal.tsx)
- [x] Nenhum webhook, GA ID ou pixel ID hardcoded em `src/` — tudo em `.env` via `PUBLIC_*`
- [x] `.env.example` atualizado com `PUBLIC_GA_ID`, `PUBLIC_META_PIXEL_ID`, `PUBLIC_WEBHOOK_URLS`, `PUBLIC_REDIRECT_URL`
- [x] TypeScript check (`npx tsc --noEmit`) passa sem erros

## Env e secrets (manual, pre-merge)

- [ ] `.env` existe em local com `PUBLIC_GA_ID=G-7CJMYD129G`, `PUBLIC_META_PIXEL_ID=` (vazio v1), `PUBLIC_WEBHOOK_URLS=` (vazio v1), `PUBLIC_REDIRECT_URL=https://sndflw.com/i/trV5sqi3n9eSZD0U1Rlx`
- [ ] `.env` **nunca** foi commitado (`git log --all --full-history -- .env` vazio)
- [ ] `.env` listado em `.gitignore` (verificar)

## SEO e structured data

- [x] `dist/index.html` tem `<meta name="description">`, `<meta name="keywords">`, `<meta name="author">`, `<meta name="robots">` preenchidos
- [ ] `dist/index.html` tem `<link rel="canonical">` apontando pro dominio de producao (atualmente placeholder "TODO-DOMINIO-FINAL" — decidir antes do merge)
- [x] `dist/index.html` tem `<script type="application/ld+json">` com 3 schemas: Organization, WebSite, Event
- [ ] JSON-LD validado em https://validator.schema.org (manual — requer dominio final)
- [ ] `dist/robots.txt` existe e tem User-agent rules com LLM crawlers
- [ ] `dist/llms.txt` existe com context denso do produto (manual — verificar leitura por Claude)
- [ ] `dist/manifest.webmanifest` parse OK (JSON valido, `theme_color: #FBFAF7`, `background_color: #FBFAF7`)
- [x] `dist/apple-touch-icon.png`, `dist/favicon.ico`, `dist/favicon.png` existem
- [ ] OG preview testado em https://www.opengraph.xyz/ e Meta Debugger (manual — requer dominio final ou preview URL)
- [ ] OG image (`og-image.png`) revisado: bate com tema light + laranja imprensa ou marcado como OK para recriar em PR futuro

## Performance

- [x] `npx astro build` completa em <2s (passou em 1.39s)
- [ ] Lighthouse Performance >= 90 em mobile (throttled 4G) — rodar em `npm run preview` (manual)
- [ ] Sem erros no console do browser em `npm run preview` (manual)
- [x] Scripts GA4 e Meta Pixel (quando ativo) sao async
- [x] Fonts carregam com `font-display=swap` no Google Fonts URL preconnect
- [x] Imagens de testimonials (`depoimentos/`) tem `loading="lazy"` no marquee

## Acessibilidade (manual no browser)

- [ ] `Tab` dentro do modal cicla so entre inputs + botoes, nunca sai do modal
- [ ] `Shift+Tab` no primeiro input volta pro botao X (close)
- [ ] `Esc` fecha o modal; se tem dado digitado, pede confirm()
- [ ] Click no backdrop com dado digitado pede confirm()
- [ ] Submit com erro dispara alerta no leitor de tela (`aria-live="assertive"`)
- [ ] Skip link "Pular para conteudo" aparece ao dar Tab no inicio da pagina (se implementado)

## Responsivo (manual)

- [ ] 320px: nenhum overflow horizontal, topbar legivel, buttons >= 44x44
- [ ] 390px: hero inteiro visivel, grid adaptado, mascara de telefone funciona
- [ ] 768px: transicao para 2 colunas, marquee pausavel ao hover
- [ ] 1024px: layout completo, timeline horizontal, foto do Mateus ao lado de bio

## Conversao (manual, fluxo end-to-end)

- [ ] Click em qualquer CTA (`[data-open-modal]`) abre o modal sem scroll da pagina
- [ ] Validacao em tempo real: nome nao vazio, email valido, telefone com 11 digitos apos mascara
- [ ] Submit bloqueado enquanto campos invalidos
- [ ] Submit valido:
  - [x] Botao muda para "Enviando..." e fica `disabled`
  - [ ] GA4 dispara evento `generate_lead` com `event_id` (UUID v4) unico
  - [ ] Meta Pixel dispara evento `Lead` com mesmo `event_id` (quando `PUBLIC_META_PIXEL_ID` ativo)
  - [ ] Fire-and-forget para webhook em `PUBLIC_WEBHOOK_URLS` (quando definido)
  - [ ] Redireciona para `PUBLIC_REDIRECT_URL` (Sendflow) com UTMs propagados: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`
- [ ] Double-submit: clicar 2x no botao sao dispara 1 request (botao ja disabled em loading)
- [ ] Pagina de sucesso exibida antes do redirect (ou redirect imediato)

## Git hygiene

- [x] `.gitignore` cobre `dist/`, `.astro/`, `node_modules/`, `.env*`
- [ ] `git grep "G-7CJMYD129G"` vazio (nenhum ID de producao no historico trackado)
- [ ] `git grep "sndflw.com"` reflete so a URL atual autorizada

## Qualidade de codigo e copy

- [x] Build sem warnings (passou)
- [ ] Copy em pt-BR com acentos corretos (manual — revisar em pagina final)
- [ ] Travessao longo (—) ausente em copy render (10 ocorrencias em comentarios apenas, zero em UX)
- [ ] "Sistema 10x" nao aparece em nenhum lugar (zero ocorrencias — substituido por "infra completa")
- [ ] Modal de captura: texto coeso, CTA clara, privacy statement presente

## Pos-deploy (manual na URL de producao)

- [ ] `curl -I https://dominio/` retorna 200
- [ ] `curl -I https://dominio/robots.txt` retorna 200
- [ ] `curl https://dominio/llms.txt` retorna conteudo valido
- [ ] `curl https://dominio/manifest.webmanifest` retorna JSON valido
- [ ] https://validator.schema.org aponta 0 erros no URL
- [ ] PageSpeed Insights >= 85 mobile (ou melhorias no backlog se houver)
- [ ] Meta Debugger e OG Preview mostra imagem, titulo, descricao corretos
- [ ] Teste E2E de lead: preencher form → webhook recebe → redirecionamento com UTMs funciona

## TODOs abertos (gatekeepers do PRD secao 10)

1. [ ] **Dominio final** — canonical + og:url devem apontar para dominio real (atualmente TODO-DOMINIO-FINAL)
2. [ ] **Meta Pixel ID** — quando ativar em v1.1, popular `PUBLIC_META_PIXEL_ID` no `.env` e Vercel
3. [ ] **Webhook URL** — quando CRM integrado, popular `PUBLIC_WEBHOOK_URLS` no `.env`
4. [ ] **Zoom URL** — substituir placeholder em Event.location.url com link Zoom real
5. [ ] **Politica de Privacidade + Termos** — URLs finalizadas no Footer
6. [ ] **Email de contato** — confirmar `contato@grupovuk.com.br` com Mateus
7. [ ] **OG image** — revisado contra tema light ou marcado para recriacao em PR futuro

---

## Referencias

- PRD: `docs/prds/intensivo-claude-code.md` (secoes 5, 7, 8, 10)
- Plano: `docs/plans/intensivo-claude-code.md`
- Audit: `docs/mobile-audit.md` (resultados automatizados)
- Config de envs: `.env.example` na raiz de `site/`
- Tokens Tailwind: `tailwind.config.mjs`
- Copy centralizada: `src/config.ts`
