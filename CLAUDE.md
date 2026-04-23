# intensivo-claude-code

> [!important] Este projeto segue `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SOPs/funnel-project.md` (SOP mestre F0-F7) + `copy-production.md` (F5) + `technical-implementation.md` (F6). Tipo de funil: **paid-challenge** (ver `Blueprints/Funnels/funnel-paid-challenge.md`).

Funil inteiro de lançamento pago do Intensivo Claude Code.

## Contexto

- **Tipo**: funil
- **Criado**: 2026-04-20
- **Localização**: `~/Documents/00 - Projetos/intensivo-claude-code/`
- **Ecossistema Grupo VUK**: lançamento pago de um intensivo (produto educacional) sobre Claude Code. Relação com ecossistema a definir (se alimenta AI Society, CAIA, YouTube, etc).

### Briefing consolidado (2026-04-20)

**Data do evento**: Sábado, **16 de maio de 2026**, 09h-16h, ao vivo no Zoom.

**Entregáveis do ingresso**:
- Acesso ao evento 1 dia (09h-16h)
- Material complementar das aulas
- Trial 30 dias do ChatFunnel (ativação obrigatória)
- **No final do evento**: pitch de venda da AI Society (back-end high-ticket)

**Estrutura de lotes**:

| Fase | Período | Preço |
|------|---------|-------|
| Captação para o grupo (leads) | 20/04 -> 26/04 | . |
| Pré-lançamento | 27/04 -> 29/04 | R$27 |
| Lote 1 | 30/04 -> 03/05 | R$47 |
| Lote 2 | 04/05 -> 09/05 | R$67 |
| Lote 3 | 10/05 -> 16/05 | R$97 |
| VIP | Todos os lotes | R$197 |
| Order bump: Contrato e Comercial | - | R$47 |
| Order bump: Gravação + Tira-dúvidas | - | R$197 |

**CPA máximo**: R$300/ingresso (ICP confirmado).

**Modelo de monetização** (tripwire + event launch + high-ticket back-end):
1. Ingresso (R$27-97) é tripwire. Auto-qualifica comprador.
2. Order bumps (R$197 + R$47) reduzem prejuízo de CPA.
3. **AI Society** vendida no evento é o back-end principal.
4. **Trial ChatFunnel** ativado gera MRR recorrente.

> [!danger] Ticket médio baixo + CPA alto
> Sem back-end forte (AI Society + MRR ChatFunnel), o lançamento queima caixa. **PRD deve projetar unit economics antes de escrever copy.**

**ICP** (validado em 79 respostas de forms):

Primário: Dono de agência de marketing ou gestor de tráfego/lançador faturando R$10k-R$150k/mês, solo ou com 2-5 pessoas, já comprador do Mateus (YouTube/LTV/ChatFunnel/CAIA).

Secundário: Copywriter, social media, designer querendo virar dono em vez de operador.

Terciário: Profissional liberal com negócio rodando querendo automatizar operação própria.

**Dores top-3** (ranking direto dos forms):
1. Como VENDER serviço de IA (aquisição + processo comercial)
2. Como ESCALAR / ter recorrência / LTV
3. Como OPERACIONALIZAR a entrega sem contratar time

**Big idea** (escolhida pelo Mateus, 2026-04-20):
**"Intensivo Claude Code: aprenda a usar a IA que te permite produzir por 10 pessoas."**

Vetor emocional complementar: **FOMO**. Claude Code é a conversa do mercado. Quem dominar até maio sai na frente. Quem esperar 12 meses vira comodity. Incorporar FOMO como urgência de janela competitiva, não só de lote.

**AI Society** (back-end principal do evento):
- Preço: **R$15.000** (até 12x), 6 meses
- Entregáveis: encontros quinzenais com Mateus, 8 pilares (AI Circle gravado), plataformas prontas (Sigma Ads + Vuk Tasks + ChatFunnel), Claude Code Teams 5X (6 meses, dono + 4 colab), comunidade + WhatsApp
- Bônus: 1 conta ChatFunnel adicional
- Garantia: 7 dias incondicional + 90 dias condicional
- Detalhes: `~/Documents/00 - Projetos/ai-society/copy-brief-v3.md`

**Metas de conversão**:
- Meta de ingressos pagos: **600**
- Ingresso -> AI Society: **7%** (R$1.050 esperados por ingresso)
- Ingresso -> ativação trial ChatFunnel: **30%**
- ChatFunnel pós-trial: R$497/mês (LTV 6m assumido = R$2.982)

**Unit economics** (projeção com 600 ingressos):
- Receita bruta projetada: **R$845.000**
  - AI Society (42 vendas): R$630.000
  - ChatFunnel MRR (54 paying x 6m): R$161.000
  - Order bumps + ingressos: R$54.000
- CPA máximo (600 x R$300): R$180.000
- **Receita pós-ads: R$665.000**
- Break-even AI Society: 2% (folga de 3.5x em relação à meta)

**Nome do mecanismo único**: **Sistema 10x**
(4 Squads Claude Code + ChatFunnel + Mission Control)

**Canais de tráfego**: orgânico + Meta Ads + YouTube + newsletter.
Budget sugerido ads: R$180.000 em 26 dias (R$2k-7k/dia). Split inicial Meta 70% / YouTube 30%.

**Nome do evento**: Intensivo Claude Code (mantido).

Ver análise completa em `docs/research/briefing-inicial.md`.

### Pipeline de PRDs (ordem por urgência)

**P0 (hoje/amanhã)**:
1. Landing de captação (20-26/04)
2. Briefing de ads de captação

**P1 (até 26/04)**:
3. Página de vendas do ingresso
4. Checkout + order bumps
5. Sequência de email de nutrição

**P2 (durante 27/04-16/05)**:
6. Ads de conversão (Meta + YouTube)
7. Newsletter Quinta Era
8. Orgânicos (Reels/Shorts + posts)

**P3 (pré-evento + pós)**:
9. Briefing do evento 16/05 (roteiro + pitch AI Society)
10. Sequência pós-evento (trial ChatFunnel + retoma AI Society)

## Pipeline obrigatório

Todo trabalho neste projeto segue o pipeline estruturado:

1. `/create-prd <feature>`. PRD em `docs/prds/`
2. `/create-plan <feature>`. Plano técnico em `docs/plans/`
3. `/create-story <feature>`. Stories em `docs/stories/`
4. `/implement <numero>`. Implementa story específica
5. `/review <numero>`. Review de código
6. `/commit`. Commit inteligente

NUNCA pule direto para implementação sem PRD + plano documentados.

## SOPs aplicáveis

Projeto do tipo `funil`. SOPs diretos:

- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SOPs/funnel-project.md` - SOP mestre do funil (fases F1 a F6)
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SOPs/copy-production.md` - produção de copy na F5
- `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SOPs/technical-implementation.md` - parte técnica (landing, checkout, integrações)

Consumir via path absoluto, não copiar.

## Topologia multi-landing (padrão obrigatório)

Cada peça de funil (captação, vendas, checkout, obrigado, evento) vive em **pasta própria** (`site/`, `site-v2/`, `site-vendas/`, ...) e é deployada como **projeto Vercel independente**, com **subdomínio próprio** em Cloudflare.

- `site/` → `icc.thesociety.com.br` (landing v1 original, design dark)
- `site-v2/` → `icc-v2.thesociety.com.br` (captação v2, design claro)
- Próximas peças: `site-<slug>/` → `<slug>.thesociety.com.br`

**NUNCA usar rewrite externo como fronting** pra servir outra peça sob o mesmo domínio. O rewrite externo quebra CSP (a do fronting prevalece sobre a da origem), proxy de POST tem pegadinhas, e a CSP duplica entre os dois `vercel.json` (drift garantido).

Se precisar preservar URL velha depois de mover uma peça, use **redirect 301** pro subdomínio novo (padrão aplicado em `site/vercel.json` após a migração de `/lpv2/*` → `icc-v2.thesociety.com.br/*`).

Cada pasta de peça tem:
- `astro.config.mjs` com `site: 'https://<subdomínio>'` e **sem** `base:` (URLs limpas)
- `vercel.json` com sua própria CSP e headers de segurança (fonte única de verdade por peça)
- `.vercel/` apontando pro projeto Vercel próprio

## Regras deste projeto

- Toda documentação em `docs/` (prds, plans, stories, research, copy, decisions, logs)
- Obsidian-first: frontmatter obrigatório em todo `.md`, wikilinks em vez de paths relativos
- Logs numerados em `logs/<NNN>-<slug>.md` (3 dígitos zero-padded, sequenciais, sempre ler a contagem atual antes de criar novo). Ver regra global em `~/.claude/CLAUDE.md`.
- Conventional Commits: `tipo(escopo): descrição`
- Nunca commitar na main diretamente. Crie feature branch.
- Consumir blueprints/SOPs do vault Obsidian via path absoluto, não copiar conteúdo.
- UTMs consistentes em TODOS os links de tráfego.
- Nunca gastar mais de R$100/dia em ads sem aprovação (regra global da agência).
- Nunca deletar campanhas; apenas pausar.

## Stack

Funil de lançamento pago (definir no PRD por peça):

- **Landing/captura + página de vendas**: Next.js App Router + Tailwind + GSAP ou HTML+Tailwind+GSAP
- **Deploy**: Vercel via merge na main (nunca `vercel --prod` manual)
- **Checkout**: Stripe ou plataforma de lançamento (a definir no PRD)
- **Email transacional**: Resend
- **Email broadcast/nutrição**: plataforma a definir
- **Ads**: Meta Ads (estratégia + copy + criativos via skills do squad-trafego)
- **Analytics**: UTMs + dashboard próprio + Meta Ads insights

## Referências

- [[README|MOC do projeto]]
- MOC de projetos: `~/Documents/00 - Projetos/README.md`
- Biblioteca: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/README.md`
- CLAUDE global: `~/.claude/CLAUDE.md`

## Tags

#projeto #projeto/funil #grupo-vuk
