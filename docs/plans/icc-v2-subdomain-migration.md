---
title: Migração site-v2 para subdomínio icc-v2.thesociety.com.br
created: 2026-04-23
tags: [plano, infra, deploy, dns, vercel, cloudflare]
status: em-execucao
project: intensivo-claude-code
---

# Migração site-v2 para subdomínio próprio

> [!info] Objetivo
> Eliminar a topologia de fronting `site/` + rewrite externo pra `site-v2/` e servir o `site-v2/` direto em `icc-v2.thesociety.com.br`. Isso elimina duplicação de CSP, o 404 do `/api/capi` e simplifica deploys futuros. Funda o padrão "subdomínio por peça de funil" pro resto do lançamento.

## Motivação

Deployada em `icc.thesociety.com.br/lpv2/`, a landing v2 herdava a CSP do projeto `site/` (fronting), não a dela própria. Cada vez que a CSP do v2 precisava crescer (vercel.live, google.com, facebook.com, etc), era preciso lembrar de editar os dois `vercel.json`. Drift aconteceu 2x (PR #5 e erros atuais). Além disso, rewrite externo pra POST (endpoint `/api/capi`) se mostrou instável, causando 404 no envio de lead.

Regra do padrão agora em `CLAUDE.md`:
> Cada peça de funil = pasta própria + projeto Vercel independente + subdomínio próprio. Nunca fronting com rewrite externo.

## Escopo

- Promover `site-v2/` pra rodar em `icc-v2.thesociety.com.br` (sem base path)
- Manter `site/` em `icc.thesociety.com.br` (v1 dark continua viva)
- Redirecionar URLs velhas `icc.thesociety.com.br/lpv2/*` pra `icc-v2.thesociety.com.br/*` via 301

Fora de escopo:
- Alterar a v1 (`site/`)
- Migrar `site/` pra outro projeto ou subdomínio
- Criar novas peças de funil (outra entrega)

## Estado atual (Fase 1 concluída)

> [!success] Código já ajustado na branch `feat/icc-v2-subdomain`
> Mudanças aplicadas e build do v2 validado (`npm run build` OK, prerender em `/index.html`).

### Arquivos editados

| Arquivo | Mudança |
|---|---|
| `site-v2/astro.config.mjs` | `site: 'https://icc-v2.thesociety.com.br'`, removido `base: '/lpv2/'` |
| `site-v2/vercel.json` | Removidos rewrites internos `/lpv2/*` → `/*` |
| `site-v2/src/layouts/Base.astro` | `canonical` → `https://icc-v2.thesociety.com.br/` |
| `site-v2/public/manifest.webmanifest` | Ícones e `start_url` sem prefixo `/lpv2/` |
| `site-v2/src/components/react/CaptureModal.tsx` | Removido comentário obsoleto sobre base path |
| `site/vercel.json` | Rewrites `/lpv2/*` → redirects **301** pra `icc-v2.thesociety.com.br` |
| `CLAUDE.md` | Seção "Topologia multi-landing" fixando o padrão |

Branch: `feat/icc-v2-subdomain`. Ainda não mergeada.

## Passos restantes (Fase 2 a 5)

### Fase 2 — Pré-requisitos MCP ✅

- [x] **Cloudflare MCP** — conectado em 2026-04-23
- [x] **Vercel MCP** — conectado em 2026-04-23 (team VUK `vuk-ai-society`)

### Fase 3 — Configuração de DNS e domínio ✅

**3.1. CNAME criado na Cloudflare** (2026-04-23 20:03 BRT)
- Zona: `thesociety.com.br` (id `c06b39c2d80ba0eed06498c0586d28b4`)
- Record id: `037f6103b232c4c5795138999deb11e6`
- Nome: `icc-v2` → Target: `cname.vercel-dns.com` (DNS only, TTL Auto)
- Propagação confirmada em `@1.1.1.1` e `@8.8.8.8`

**3.2. Domínio adicionado no projeto Vercel v2** (2026-04-23 20:06 BRT)
- Projeto: `intensivo-claude-code-v2` (prj_e4e5WdS8ifGzmIcevjo5XgBhsndy)
- Via `vercel domains add icc-v2.thesociety.com.br --scope=vuk-ai-society`
- SSL ativo: `curl -I` retornou `HTTP/2 200` + `strict-transport-security: max-age=63072000; includeSubDomains; preload`
- CSP servida já é a do `site-v2/vercel.json` (vercel.live, facebook.com, googletagmanager.com, sndflw.com)

**3.3. Env vars confirmadas em Production**
- ✅ `META_CAPI_ACCESS_TOKEN` (encrypted)
- ✅ `META_PIXEL_ID` (encrypted)
- ✅ `PUBLIC_META_PIXEL_ID` (310399388108164)
- ✅ `PUBLIC_GA_ID` (G-7CJMYD129G)
- ✅ `PUBLIC_REDIRECT_URL` (encrypted)
- ✅ `PUBLIC_WEBHOOK_URLS` (encrypted)
- `META_CAPI_TEST_EVENT_CODE` ausente — opcional, só pra staging/debug

> [!warning] Deploy atual ainda é pré-merge
> `https://icc-v2.thesociety.com.br/` responde 200 mas serve o bundle antigo (canonical aponta pra `icc.thesociety.com.br/lpv2/`, manifest em `/lpv2/...`). Merge da branch na main é o que promove o código novo sem base path.

### Fase 4 — Deploy e validação

**4.1. Merge da branch**
- Abrir PR de `feat/icc-v2-subdomain` pra `main`
- Título: `feat: migra site-v2 pra icc-v2.thesociety.com.br`
- Merge → deploy automático em ambos projetos Vercel (`site/` recebe redirect 301, `site-v2/` passa a responder no subdomínio novo)

**4.2. Checklist de validação pós-deploy**

Verificar em ordem:

- [ ] DNS propagou: `dig icc-v2.thesociety.com.br CNAME` retorna `cname.vercel-dns.com`
- [ ] SSL ativo: `curl -I https://icc-v2.thesociety.com.br/` retorna 200 + header `strict-transport-security`
- [ ] CSP correta: no response header, aparece `frame-src 'self' https://vercel.live https://www.facebook.com`, `form-action 'self' https://sndflw.com https://www.facebook.com`, etc.
- [ ] Canonical no HTML aponta pra `https://icc-v2.thesociety.com.br/` (sem `/lpv2/`)
- [ ] Assets carregam: favicon.png, og-image.png, manifest.webmanifest sem 404
- [ ] Redirect 301 funciona: `curl -I https://icc.thesociety.com.br/lpv2/` retorna `301` + `location: https://icc-v2.thesociety.com.br/`
- [ ] `/api/capi` responde: POST de teste com payload válido retorna 204; payload inválido retorna 400
- [ ] `/api/capi-pageview` responde: GET retorna 204
- [ ] Pixel Meta dispara PageView (checar Meta Pixel Helper)
- [ ] GA4 recebe pageview (DebugView)
- [ ] Sem erros de CSP no console do Chrome

**4.3. Smoke test do formulário**
- Preencher CaptureModal com dados de teste
- Verificar em Events Manager (Meta) que CAPI + Pixel deduplicam pelo `event_id` (tabela "Parameters received" mostra ambos)
- Verificar redirect pós-envio funciona

### Fase 5 — Cleanup e comunicação

- [ ] Atualizar briefing de ads do squad-trafego: URL nova é `icc-v2.thesociety.com.br` (sem `/lpv2/`)
- [ ] Atualizar qualquer template de email, post social, newsletter que tinha URL antiga
- [ ] Atualizar UTMs de todas campanhas ativas
- [ ] Documentar no log do squad-dev: `docs/logs/squad-dev/2026-04-23.md`
- [ ] Atualizar memória `feedback_landing_folder_versioning.md` com a topologia final (subdomínio, não fronting)

## Rollback

Se algo der errado em produção:

**Rollback rápido (URL antiga volta a funcionar):**
1. Reverter o merge do PR: `git revert <merge-sha>` + push
2. `site/vercel.json` volta a ter rewrites externos pra `intensivo-claude-code-v2.vercel.app/lpv2/*`
3. `site-v2/astro.config.mjs` volta a ter `base: '/lpv2/'`
4. Vercel re-deploya em ~1 min

**Rollback de DNS (se o CNAME der problema):**
- Remover record `icc-v2` na Cloudflare
- Remover domínio na Vercel
- CNAME dangling não afeta tráfego do `icc.thesociety.com.br/` porque é outro subdomínio

**Se redirect 301 ficar cached errado no browser do usuário:**
- 301 é cache forte. Se precisar "desfazer" rápido, usar redirect temporário (302) antes de promover 301.
- Mitigação: os ads novos devem apontar direto pra `icc-v2.thesociety.com.br` desde o começo.

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| CNAME não propagar antes da Vercel validar | SSL demora 15+ min | Aguardar propagação global (checar `dig @8.8.8.8`) antes de add na Vercel |
| Cloudflare em Proxy ON por engano | SSL Vercel falha com loop | Confirmar DNS only antes de salvar |
| Env vars faltando no projeto v2 em prod | CAPI retorna 204 silencioso (não manda evento) | Checklist 3.3 antes do merge |
| Ads já rodando em URL velha | Perda de tráfego na janela de 301 | Redirect 301 preserva query + path; UTMs chegam intactos |
| Domínio `icc-v2.thesociety.com.br` estranho comercialmente | Percepção "versão de teste" | Aceitável nesse estágio (funil curto, lançamento pontual). Se virar incômodo, promove a v2 pra `icc.` no pós-evento |

## Dependências e bloqueios

**Bloqueia esse plano:**
- Cloudflare MCP conectado
- Vercel MCP conectado com acesso ao projeto v2

**Esse plano bloqueia:**
- Disparo de ads pagos (27/04 em diante) com URL nova
- Próximas peças de funil (página de vendas, checkout) que seguirão o mesmo padrão

## Referências

- [[CLAUDE]] — regra do padrão subdomínio-por-peça
- Memória: `feedback_landing_folder_versioning.md`
- Commit anterior relevante: `1050ccb fix(site): mesma CSP do site-v2 no fronting` (o patch que virou obsoleto com essa migração)
- Astro + Vercel hybrid adapter: https://docs.astro.build/en/guides/integrations-guide/vercel/
- Vercel redirects doc: https://vercel.com/docs/projects/project-configuration#redirects

## Tags

#projeto/intensivo-claude-code #infra #deploy #dns #vercel #cloudflare
