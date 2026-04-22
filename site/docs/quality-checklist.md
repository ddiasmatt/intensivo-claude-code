---
title: Checklist de Validacao de Qualidade — Landing ICC
created: 2026-04-22
tags: [checklist, quality, pre-deploy, icc, astro]
status: active
project: intensivo-claude-code-astro
---

# Checklist de validacao de qualidade — Landing ICC

> [!info] Como usar
> Roda esse checklist antes de cada deploy. Marca "manual" quando nao da pra automatizar. Qualquer item vermelho segura o merge.

## 🔧 Build e codigo

- [ ] `npx astro build` passa sem warnings nem erros
- [ ] `git status` mostra so os arquivos intencionais (nada de `dist/`, `.env`, `node_modules/`)
- [ ] Nenhum `bg-[#...]` novo em `.astro`/`.tsx` — tudo via token (`bg-page`, `bg-surface`, `bg-elevated`, `text-ink-*`, `accent*`)
- [ ] Nenhum `import ... from "framer-motion"` — so `motion/react`
- [ ] Nenhum webhook, GA ID ou pixel ID hardcoded em `src/`
- [ ] `.env.example` atualizado com qualquer variavel `PUBLIC_*` nova

## 🔒 Env e secrets (manual)

- [ ] `.env` existe em local + Vercel com `PUBLIC_GA_ID`, `PUBLIC_META_PIXEL_ID`, `PUBLIC_WEBHOOK_URLS`, `PUBLIC_REDIRECT_URL`
- [ ] `.env` **nunca** foi commitado (`git log --all --full-history -- .env` vazio)
- [ ] Rotacionar pixel/webhook se algum desses IDs ja vazou em commits antigos

## 🌐 SEO e structured data

- [ ] `dist/index.html` tem `<meta name="description">` preenchido, `<meta name="keywords">`, `<meta name="author">`, `<meta name="robots">`
- [ ] `dist/index.html` tem `<link rel="canonical">` apontando pro dominio de producao (`intensivo.grupovuk.com.br` ou `icc.thesociety.com.br` — decidir um e nao divergir)
- [ ] `dist/index.html` tem `<script type="application/ld+json">` com Event Schema — validar em https://validator.schema.org
- [ ] `dist/robots.txt` tem `Sitemap:` apontando pro dominio correto
- [ ] `dist/sitemap.xml` tem `<lastmod>` recente, `<loc>` com dominio correto
- [ ] `dist/llms.txt` lido por um LLM, retorna resumo que bate com a proposta real do evento
- [ ] `dist/manifest.webmanifest` parse OK (JSON valido, `theme_color` bate com `<meta theme-color>`)
- [ ] OG preview testado em https://www.opengraph.xyz/ e Meta Debugger

## ⚡ Performance

- [ ] Lighthouse Performance >= 90 em mobile (throttled 4G) — rodar em producao
- [ ] Sem erros no console do browser em `npm run preview`
- [ ] Nenhum script bloqueante acima de GA4/Meta (ambos `async`)
- [ ] Fonts carregam com `font-display: swap` (ja no URL do Google Fonts)
- [ ] Imagens de testimonials + `mateus.webp` com `loading="lazy"` onde aplicavel (conferir `Testimonials.astro`)

## ♿ Acessibilidade (manual no browser)

- [ ] `Tab` dentro do modal cicla so entre os inputs + botoes do card, nunca sai
- [ ] `Shift+Tab` no primeiro input volta pro botao X
- [ ] `Esc` fecha o modal; se tem dado digitado, pede confirm
- [ ] Click no backdrop com dado digitado pede confirm
- [ ] Submit com erro dispara leitor de tela (aria-live assertive)
- [ ] Skip link "Pular para conteudo" aparece ao dar Tab na pagina

## 📱 Responsivo (manual)

- [ ] 320px / 390px / 768px / 1024px: nenhum overflow horizontal
- [ ] Touch targets do CTA e do modal >= 44x44
- [ ] Teclado numerico aparece no campo telefone em iOS/Android
- [ ] Mascara `(XX) XXXXX-XXXX` funcional em todos os browsers

## 🎯 Conversao (manual, fluxo end-to-end)

- [ ] Qualquer `[data-open-modal]` abre o modal (botoes do Hero, TopBar, Final)
- [ ] Validacao bloqueia submit com campo vazio/invalido e mostra erro
- [ ] Submit valido: botao vira "Enviando...", dispara POST pra todos os `PUBLIC_WEBHOOK_URLS`, tracking Meta Pixel `Lead` + GA4 `generate_lead` com mesmo `event_id`, redirect com UTMs propagados
- [ ] UTMs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) chegam no destino do redirect
- [ ] Double-submit: clicar 2x no botao nao dispara 2 requests (botao fica `disabled` em loading)
- [ ] No painel Meta: evento `Lead` aparece com `event_id` (deduplicacao pronta quando plugar Conversions API)
- [ ] No painel GA4: `generate_lead` com `event_id` aparece em Realtime

## 🧭 Git hygiene

- [ ] `.gitignore` cobre `dist/`, `.astro/`, `node_modules/`, `.env*` (confere)
- [ ] `git grep "G-7CJMYD129G"` vazio (nenhum pixel antigo no historico trackado)
- [ ] `git grep "310399388108164"` vazio
- [ ] `git grep "dwkfaqbfhdeemulmkxjn"` vazio (webhook Supabase)

## 🚀 Pos-deploy (manual na URL de producao)

- [ ] `curl -I https://dominio/robots.txt` retorna 200
- [ ] `curl https://dominio/sitemap.xml` valido
- [ ] `curl https://dominio/llms.txt` retorna conteudo
- [ ] `curl https://dominio/manifest.webmanifest` JSON valido
- [ ] Schema.org validator aponta 0 erros na URL
- [ ] PageSpeed Insights >= 85 mobile, >= 95 desktop
- [ ] Meta Debugger mostra OG correto
- [ ] Teste E2E de lead em producao → confere webhook recebeu + destino Sndflw abriu com UTMs

---

## Referencias internas

- Arquitetura e stack: [[README]]
- Auditoria original que originou esse checklist: conversa Artur/Mateus 2026-04-22
- Config de envs: `.env.example` na raiz
- Token colors: `tailwind.config.mjs`
