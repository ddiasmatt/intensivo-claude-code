---
title: intensivo-claude-code
description: Funil inteiro de lançamento pago do Intensivo Claude Code.
created: 2026-04-20
type: funil
status: active
tags: [projeto, projeto/funil, grupo-vuk]
project: intensivo-claude-code
---

# intensivo-claude-code

> [!info] Projeto do tipo funil
> Funil inteiro de lançamento pago do Intensivo Claude Code.

## Sobre

Lançamento pago do Intensivo Claude Code. Escopo: funil completo de ponta a ponta (captura, aquecimento, conversão, onboarding).

TODO: detalhar oferta, promessa, preço, datas, mecanismo e público-alvo no `CLAUDE.md` antes de rodar `/create-prd`.

## MOC (Map of Content)

### Documentação
- [[docs/prds/|PRDs]]. Product Requirements Documents
- [[docs/plans/|Planos]]. Planos técnicos de implementação
- [[docs/stories/|Stories]]. User stories fragmentadas
- [[docs/research/|Research]]. Pesquisa específica do projeto
- [[docs/copy/|Copy]]. Copy de páginas, emails, ads
- [[docs/decisions/|Decisions]]. Decisões arquiteturais e estratégicas

### Operação
- [[docs/logs/|Logs]]. Logs diários por squad
- [[CLAUDE|CLAUDE.md]]. Briefing local para Claude Code

### Assets
- [[assets/]]. Imagens, logos, videos, referências

## Status

- **Criado em**: 2026-04-20
- **Tipo**: `funil`
- **Status atual**: active
- **Próxima ação**: preencher briefing em `CLAUDE.md` (oferta, promessa, preço, datas) e rodar `/create-prd` para cada peça do funil

## Stack / Ferramentas

Funil de lançamento pago. Stack provável:

- **Landing/captura**: Next.js App Router + Tailwind + GSAP (via skill `deploy-landing`)
- **Página de vendas**: HTML+Tailwind+GSAP ou Next.js (definir em PRD)
- **Checkout**: Stripe ou plataforma de lançamento (a definir)
- **Email/nutrição**: Resend (transacional) + plataforma de broadcast (a definir)
- **Ads**: Meta Ads (via skills `meta-ads-strategy` + `meta-ads-copywriting` + `ad-creative`)
- **Analytics**: UTMs consistentes em todos os links + dashboard próprio
- **Conteúdo**: VSL/webinar, emails de nutrição, ads, posts orgânicos

Ajustar no PRD inicial.

## Recursos transversais

Materiais metodológicos e SOPs consumidos por este projeto ficam no vault Obsidian:

- Biblioteca de blueprints: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Blueprints/`
- SOPs da operação: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SOPs/`
- Research transversal: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Research/`

SOPs mais relevantes para este projeto:

- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SOPs/funnel-project.md` - SOP mestre para projetos do tipo funil
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SOPs/copy-production.md` - produção de copy na F5 do funnel-project
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SOPs/technical-implementation.md` - parte técnica (landing, checkout, integrações)

Referenciar via path absoluto. Não duplicar conteúdo.

## Tags

#projeto #projeto/funil #grupo-vuk
