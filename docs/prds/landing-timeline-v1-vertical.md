---
title: PRD — Timeline vertical v1 (Railway/Trilho)
created: 2026-04-22
tags: [prd, landing, refactor, intensivo-claude-code, site-v2]
status: draft
project: intensivo-claude-code
parent-prd: intensivo-claude-code.md
---

# PRD: Timeline vertical v1 (Railway/Trilho minimalista)

> [!info] Escopo reduzido
> Este PRD cobre **somente** o refactor da seção `Timeline` em `site-v2/`. Toda a arquitetura da landing (stack, SEO, analytics, modal, tokens, deploy, JSON-LD) segue definida pelo PRD-mãe `docs/prds/intensivo-claude-code.md` e pelos PRDs de seção já implementados. Itens fora do escopo estão explícitos em §7.

## 1. Contexto

- **Produto:** Intensivo Claude Code (evento pago, 16/05/2026, Zoom)
- **Página afetada:** landing `site-v2/` (versão 2 do funil, rewrite `/lpv2/` ativo)
- **Seção alvo:** `site-v2/src/components/sections/Timeline.astro`
- **Motivo do refactor:** a timeline atual é horizontal (4 colunas `md:flex-row` com trilho 1px acima dos blocos). O layout empacota pouco em telas < 1024px (blocos viram stack sem trilho), quebra o ritmo tipográfico do restante da v2 (Fraunces editorial) e não comunica a duração e sequência do dia com clareza suficiente.
- **Decisão do stakeholder (2026-04-22):** adotar a **Opção 1 — Railway/Trilho minimalista** (versão vertical clássica com trilho contínuo e nodes por bloco), descartando a Opção 2 (terminal/mono) e a Opção 3 (cards com entregas tangíveis).
- **Branch:** `feat/landing-timeline-v1` (já criada)
- **Métrica norte:** scroll-depth não cair na seção. Não é seção de CTA nem ponto de conversão direto; é **reforço de tangibilidade** do evento. Validação qualitativa pós-deploy (heatmap quando disponível).

## 2. Stack (herdada, sem alteração)

A seção vive dentro de `site-v2/` já scaffoldado:

- **Framework:** Astro 4 (output estático, subpath `/lpv2`)
- **Estilo:** Tailwind CSS com tokens de `site-v2/tailwind.config.mjs` (tema claro editorial)
- **Animação de entrada:** `IntersectionObserver` nativo + classes Tailwind (decisão explícita: **não adicionar GSAP** nesta seção; manter seção leve e sem island JS pesada)
- **Microinteração:** N/A (seção estática)
- **Sem novas dependências.** Esta story NÃO instala nada.

### 2.1 Tokens e tipografia consumidos

| Token | Uso na Timeline |
|---|---|
| `bg-page` (#FBFAF7) | fundo da seção |
| `border-rule` (#D9D4CB) | trilho vertical + dividers |
| `bg-accent` (#E4572E) | node circular por bloco |
| `text-accent` | horário (eyebrow) e texto de realce |
| `text-ink-primary` (#0B0B0D) | título do bloco (Fraunces) |
| `text-ink-secondary` (#4A4744) | descrição (Inter Tight) |
| `text-ink-muted` | footer TIMELINE_FOOTER |
| `font-display` (Fraunces) | título de cada bloco |
| `font-sans` (Inter Tight) | descrição |
| `font-mono` (JetBrains Mono) | horário, kicker, footer |

## 3. Seções da página

Esta landing é multi-seção (herdada do PRD-mãe). A seção objeto deste refactor é marcada abaixo. **Nenhuma outra seção é tocada.**

- [ ] TopBar <!-- fora do escopo -->
- [ ] Hero <!-- fora do escopo -->
- [ ] SocialProof <!-- fora do escopo -->
- [ ] Autoridade <!-- fora do escopo -->
- [ ] BigIdea <!-- fora do escopo -->
- [ ] ParaQuem <!-- fora do escopo -->
- [ ] UseCases <!-- fora do escopo -->
- [ ] Benefits <!-- fora do escopo -->
- [x] **Timeline** (refactor para vertical Railway). Copy em `CONFIG.TIMELINE_*` permanece inalterada.
- [ ] FinalCTA <!-- fora do escopo -->
- [ ] FAQ <!-- fora do escopo -->
- [ ] Footer <!-- fora do escopo -->

### 3.1 Copy (inalterada, já em `src/config.ts`)

Não reescrever. Fonte de verdade: `site-v2/src/config.ts` linhas 156–181.

- `TIMELINE_KICKER = "AGENDA DO DIA"`
- `TIMELINE_HEADLINE = "Como seu sábado vai ser montado"`
- `TIMELINE_SUBHEADLINE = "Você sai do dia com a operação configurada, não só com o conceito entendido."`
- `TIMELINE_BLOCKS = [` 4 blocos (09–12, 12–14, 14–16, 16–17) `]`
- `TIMELINE_FOOTER = "Sábado 16/05 . 09h às 17h . ao vivo no Zoom."`

## 4. Design spec — Railway/Trilho minimalista

### 4.1 Estrutura (mobile-first, mesma estrutura em md+)

```
   09h00 – 12h00
       ●─────── BLOCO 1: Fundamentos do Claude Code
       │        O que é, como instalar, primeiros passos e tour completo...
       │
   12h00 – 14h00
       ●─────── Intervalo para almoço
       │        Pausa para processar a primeira metade.
       │
   14h00 – 16h00
       ●─────── BLOCO 2: MCP, Agentes, Skills e Projetos Práticos
       │        Extensões avançadas...
       │
   16h00 – 17h00
       ●─────── BLOCO 3: Apresentação do ecossistema AI Society
                Como o ecossistema acelera...
```

### 4.2 Regras visuais

- **Trilho:** `border-l border-rule` no `<ol>`, começando logo acima do primeiro node e terminando logo abaixo do último. Largura: 1px.
- **Node:** `w-3 h-3 rounded-full bg-accent` posicionado na linha do trilho. `-translate-x-[calc(50%+0.5px)]` pra centralizar em cima da borda. `ring-4 ring-page` pra criar o "corte" visual do trilho pelo node.
- **Horário (eyebrow):** `font-mono text-xs tracking-widest uppercase text-accent` acima do título, alinhado à esquerda do container de texto.
- **Título:** `font-display text-[clamp(1.375rem,3vw,1.875rem)] leading-tight text-ink-primary`.
- **Descrição:** `font-sans text-base md:text-lg leading-relaxed text-ink-secondary max-w-2xl`.
- **Espaçamento vertical entre blocos:** `pb-10 md:pb-14` no `<li>` (último sem `pb`).
- **Padding horizontal do conteúdo:** `pl-8 md:pl-12` (afastamento do trilho).
- **Container da seção:** mantém `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36` (igual ao atual).
- **Último bloco:** sem trilho visível abaixo (o border-l do `<ol>` pode se estender até o final; visualmente aceitável).

### 4.3 Responsive

- **Mobile (< 768px):** mesma estrutura vertical, fonte do título no clamp mínimo, descrição `text-base`.
- **Tablet/Desktop (>= 768px):** mesmo layout vertical (não volta pra horizontal). Fonte do título no clamp máximo, descrição `text-lg`.
- **360px de largura (iPhone SE):** valida sem overflow horizontal; descrição pode ter 4–5 linhas.

### 4.4 Animação

- **Mecanismo:** `IntersectionObserver` nativo em um `<script is:inline>` no final do componente. Sem dependência externa.
- **Efeito:** cada `<li>` entra com `opacity: 0 → 1` + `translate-y: 16px → 0`, transição de 500ms `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Stagger:** 120ms entre blocos, aplicado via `transition-delay` calculado com `data-index` no `<li>` (0ms, 120ms, 240ms, 360ms).
- **Trigger:** quando o node cruza 15% do viewport (`rootMargin: "0px 0px -15% 0px"`).
- **Reduced motion:** respeitar `@media (prefers-reduced-motion: reduce)`; neste caso, entrar sem `translate-y`, apenas `opacity` em 200ms.
- **Classe inicial:** `opacity-0 translate-y-4` (ou equivalente). Classe revelada: `opacity-100 translate-y-0`. Transição em inline style ou utility `transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`.
- **Fallback sem JS:** se o script não rodar, a seção fica visível por padrão (nunca presa em `opacity-0`). Implementação: adicionar classe `opacity-0` só quando JS detecta suporte (ex: `document.documentElement.classList.add('js')` no `<head>` + seletor `.js .timeline-item { opacity: 0; }`) OU usar `<noscript>` pra neutralizar. Decidir no plano.

### 4.5 Fora do escopo desta story principal (split opcional)

- **Trilho scroll-linked** (trilho cresce de cima pra baixo conforme o scroll progride na seção): separar em story secundária opcional. NÃO bloqueia o merge. Se implementada, usa `scrollY` + `getBoundingClientRect()` + CSS custom property `--track-scale-y` (sem GSAP).

## 5. Contratos obrigatórios (herdados, não-negociáveis)

### 5.1 Config centralizada
Copy permanece em `site-v2/src/config.ts`. **Não criar novas chaves** nesta story (data shape inalterado).

### 5.2 Variáveis de ambiente
Nenhuma nova env. Todas as existentes continuam lidas em `Base.astro`.

### 5.3 Analytics
Timeline **não** dispara eventos. Nenhum listener de click. Sem mudanças em GA4/Meta Pixel/webhook/UTM.

### 5.4 Modal, SEO, JSON-LD, theme-color, manifest
Inalterados. O refactor não toca `Base.astro`, `public/`, nem `CaptureModal.tsx`.

### 5.5 Tokens
Proibido `bg-[#hex]`, `text-[#hex]` inline. Toda cor via tokens de §2.1. Proibido hardcode de tamanho de fonte com valor fora do `clamp()` especificado em §4.2.

### 5.6 Dependency hygiene
**NÃO instalar nada.** Sem GSAP, sem motion v12, sem `lucide-react` adicional. Se o implementer sentir necessidade, pausar e pedir aprovação.

## 6. Deploy topology

Herdada. Não muda nesta story.

- **Versão:** 2 (landing v2 já em produção)
- **Pasta de target:** `site-v2/`
- **Subpath:** `/lpv2`
- **Projeto Vercel:** `intensivo-claude-code-v2` (já vinculado)
- **Domínio final:** `<raiz>/lpv2/`
- **Rewrite raiz:** já configurado em `site/vercel.json` e `vercel.json` raiz (commits `b5fd638`, `1ec7c38`).

## 7. Fora do escopo

- Copy do evento (já validada, fonte: briefing 2026-04-20)
- Qualquer outra seção da landing v2 (Hero, Autoridade, ParaQuem, UseCases, Benefits, FinalCTA, FAQ, Footer)
- Adição de GSAP ou biblioteca de scroll-linked para o trilho (fica como story secundária opcional)
- Dark mode, internacionalização, A/B testing
- Mudanças em `CaptureModal.tsx`, `Base.astro`, `Footer.astro`, `TopBar.astro`
- Trackers novos, novos webhooks, mudanças em UTM
- Story 0 Vercel multiversion (já feita no scaffold original da v2)

## 8. Verificação end-to-end (desta story)

- [ ] `npm run build` em `site-v2/` passa sem warnings novos
- [ ] Timeline renderiza vertical em 360px, 768px, 1280px (validação manual + screenshot)
- [ ] IntersectionObserver dispara stagger corretamente ao rolar (validação manual + DevTools)
- [ ] `prefers-reduced-motion: reduce` omite translate (testar via DevTools Rendering > Emulate CSS media feature)
- [ ] Sem JS (DevTools > Disable JavaScript): seção visível, não presa em `opacity-0`
- [ ] Contraste AA: título `ink-primary` sobre `bg-page` (ratio > 14:1), descrição `ink-secondary` sobre `bg-page` (> 7:1), accent node sobre bg-page (decorativo, não precisa AA)
- [ ] Nenhuma regressão visual em outras seções (diff screenshot antes/depois das seções vizinhas: Benefits acima, Autoridade abaixo — ou o que estiver no `index.astro`)
- [ ] Lighthouse mobile na home de `/lpv2/` mantém scores atuais (Performance >= 90, a11y >= 90)

## 9. Stories esperadas (a ser detalhado pelo `landing-page-create-plan`)

Preview das stories que devem sair do plano. Este PRD não explode, apenas sinaliza:

1. **Refactor Timeline.astro para vertical Railway** (complexidade: P/pequena)
   - Implementer sugerido: `implementer-haiku`
   - Validação: build clean + screenshot em 3 larguras
2. **Audit visual pós-merge** (complexidade: P/pequena)
   - Lighthouse mobile + screenshots em 360/768/1280 + DevTools reduced-motion + no-JS check
3. **(opcional, pode ficar em backlog)** Trilho scroll-linked
   - Complexidade: M/média. Só entra se validação qualitativa pedir mais dinâmica.

## 10. Checklist pré-merge

Referência: PRD-mãe + `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/SOPs/technical-implementation.md`.

- [ ] Build passou
- [ ] Screenshot 360/768/1280 anexado ao PR
- [ ] Reduced-motion testado
- [ ] No-JS testado
- [ ] Diff visual OK nas seções vizinhas
- [ ] PR descrição cita este PRD e a branch `feat/landing-timeline-v1`
- [ ] Revisão humana do Mateus antes de merge em main

## 11. Observações

- Por ser escopo pequeno, este PRD pode ir direto para `landing-page-create-plan` sem passar por `copywriting` (copy já existe). O plano deve caber em 2 stories (uma de implementação, uma de audit). Se o plano ficar maior que isso, pausar e questionar.
- Pós-deploy, decisão de manter ou não (baseada em heatmap/scroll-depth quando disponível) fica com o stakeholder. Reversão é cheap: `git revert` da PR única.
