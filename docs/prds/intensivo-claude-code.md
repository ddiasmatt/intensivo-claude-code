---
title: PRD — Intensivo Claude Code
created: 2026-04-22
tags: [prd, landing, intensivo-claude-code]
status: draft
project: intensivo-claude-code-landing
---

# PRD: Intensivo Claude Code

> Landing de captura para o Intensivo Claude Code (16/05/2026, ao vivo no Zoom). Este PRD foi reconciliado em 2026-04-23 para refletir a **v1 dark vigente em `site/`**, com stack Astro 4 + Tailwind 3 + React 18 via islands. A direção Editorial Light Serifada fica registrada como alternativa futura para `site-v2/`, não como contrato da v1.

---

## 1. Contexto

- **Produto/marca:** Intensivo Claude Code, evento online ao vivo, 1 sábado, R$27 para lista VIP do grupo (WhatsApp via Sendflow). Carrinho público abre 30/04 a R$47.
- **Público-alvo:** Empresários, empreendedores, profissionais liberais e criadores **não-dev** que querem construir produtos/ferramentas digitais com IA sem depender de programador contratado. Brasil, ticket baixo, tráfego cruzado com o canal do Mateus (300k YouTube) e base VUK.
- **Proposta de valor:** Sair do sábado com 10 agentes de IA rodando na operação, sem escrever código manualmente.
- **Objetivo da página:** Captura de lead para o grupo VIP no Sendflow. **Não é venda direta.** Checkout só acontece dentro do grupo.
- **Métrica norte:** taxa de entrada no grupo ≥ 25% do tráfego qualificado (base: landings de captura do ecossistema VUK).
- **Janela de execução:** Evento em 16/05/2026 (sábado). Grupo fecha em **26/04/2026**. Carrinho público abre em **30/04/2026**. Logo: landing precisa ir ao ar **até 24/04/2026** para ter 48h mínimas de tráfego no grupo.
- **Stakeholders:**
  - **Decisão de copy e direção:** Mateus Dias
  - **Execução técnica:** Squad Dev
  - **Tráfego:** Squad Tráfego (pós deploy)

---

## 2. Stack

Fixa pela skill. Não alterar sem subir para `skill-architect`.

- **Framework:** Astro 4 (output estático)
- **UI reativa:** React 18 via `@astrojs/react` (islands)
- **Estilo:** Tailwind CSS 3 via `@astrojs/tailwind`, conforme implementação atual de `site/`. Tokens vivem em `tailwind.config.mjs` e em `src/styles/global.css`.
- **Animação de entrada e hero:** GSAP 3
- **Microinteração em componentes React:** `motion` v12 (proibido `framer-motion`)
- **Fontes:** Definidas na seção 3 abaixo. Injetadas via `<link>` Google Fonts com `display=swap` e `preconnect`.
- **Ícones:** `lucide-react` (stroke 1.5, nunca filled)
- **Deploy:** Vercel Git Integration (merge em `main` = deploy production). Proibido `vercel --prod` manual.
- **DNS:** Cloudflare MCP (quando domínio definir).

---

## 3. Direção estética (Fase 0)

### 3.1 Respostas às 4 perguntas

- **Propósito.** Capturar leads para o grupo VIP do Intensivo Claude Code, com promessa clara de produção operacional por IA.
- **Tom.** Dark premium, técnico e urgente, com estética de mission control. Deve comunicar execução, automação e janela de oportunidade.
- **Restrições.** Go-live rápido, mobile-first, integração com GA4, Meta Pixel, webhook Sigma e redirect Sendflow. A v1 prioriza estabilidade e captura sobre redesign.
- **Diferencial.** A imagem mental de 4 squads de Claude Code trabalhando para o empreendedor, reduzindo dependência de equipe operacional.

### 3.2 Extremo escolhido

`industrial/utilitarian` + `retro-futuristic` em tema **dark amber**. A página usa contraste alto, grid técnico, glass cards, motion pontual e acento laranja VUK.

### 3.3 Tokens da Fase 0 (fonte da verdade para `tailwind.config.mjs` + `src/styles/global.css`)

| Categoria | Token | Valor | Nota |
|---|---|---|---|
| Fundo | `page` | `#0A0A0B` | Near-black operacional |
| Fundo alt | `surface` | `#141416` | Cards e blocos secundários |
| Card | `elevated` | `#1C1C20` | Modal e superfícies críticas |
| Tinta principal | `ink.primary` | `#F5F5F5` | Texto principal |
| Tinta apoio | `ink.secondary` | `#A8A8A8` | Parágrafos |
| Tinta muted | `ink.muted` | `#6B6B6B` | Captions |
| Acento | `accent.DEFAULT` | `#E07A3A` | Laranja VUK |
| Acento hover | `accent.hover` | `#F59E53` | Estados de hover |
| Acento deep | `accent.deep` | `#C85D25` | Topbar e CTA |

### 3.4 Fontes

- **Display/body:** **Inter** (Google Fonts), pesos 400-800. A v1 usa Inter por legibilidade e velocidade de execução.
- **Mono:** **JetBrains Mono** (Google Fonts), para datas, horários, badges e códigos visuais.
- **Futura v2:** pode migrar para Fraunces + Inter Tight se a direção Editorial Light for retomada em `site-v2/`.

### 3.5 Textura, motion, composição

- **Textura:** radial glows sutis, dot grid e glass surfaces. Sem 3D pesado.
- **Motion signature:** GSAP para entrada do hero e microinteração magnética em CTAs. Respeitar `prefers-reduced-motion`.
- **Composição:** container central, cards técnicos, timeline vertical/mobile-friendly e CTA final com atmosfera de mission control.

### 3.6 Referências visuais

1. **Vercel** - contraste técnico, UI limpa, foco em performance.
2. **Linear** - dark mode refinado, bordas finas e acentos pontuais.
3. **Raycast** - sensação de ferramenta operacional e atalhos de produtividade.

### 3.7 Anti-padrões deste projeto

1. Reescrever a v1 para Editorial Light antes do go-live.
2. Dependência de animação pesada que bloqueie performance mobile.
3. Copy vaga de hype sem vínculo com captura e oferta R$27.
4. Form sem anti-spam, sem event ID ou sem rastreabilidade Sigma/GA4/Meta.
5. Metatags sociais relativas ou placeholders em produção.

---

## 4. Seções da página

Ordem de renderização e copy final. Copy consolidada a partir de `docs/copy/intensivo-claude-code.md` e `intensivo-claude-code-astro/src/config.ts` (este último usado como source of truth onde conflita com a versão colada, por ser mais completo e específico).

### 4.1 TopBar (sticky, clique rola para Final CTA)

```
ENTRE NO GRUPO E ACESSE A OFERTA ÚNICA DE R$ 27. CARRINHO PÚBLICO ABRE A R$ 47.
```

- Mono, 12px tracking largo, `bg-ink-primary` + `text-page` (inversão).
- Ponto pulsante laranja à esquerda (evento ao vivo).

### 4.2 Hero

- **Kicker (mono, laranja, tracking largo):** `AO VIVO · 16 DE MAIO · ZOOM`
- **H1 (Fraunces, 3 linhas com ênfase):**
  - Linha 1: `Intensivo`
  - Linha 2: `Claude Code` (peso 700, acento laranja na palavra "Claude")
  - Linha 3: `em um sábado.` (itálico, peso 500)
- **Subheadline:** Aprenda do zero a ferramenta de IA preferida dos empreendedores e crie em minutos toda a estrutura digital do seu negócio.
- **ICP line:** Intensivo para empresários, empreendedores e profissionais liberais.
- **Oferta visível (mono + laranja):** `Oferta única R$ 27. Entre no grupo para receber.`
- **CTA primário:** `ENTRAR NO GRUPO E VER A OFERTA` → abre modal de captura.
- **Microcopy abaixo do CTA:** `Sábado 16/05 · 09h às 17h · gravação liberada`
- **Bullets de apoio:**
  - Sem programar código
  - Sem contratar mais gente
  - Sem curso infinito antes de aplicar

### 4.3 Social Proof (marquee de prints)

- **Headline da seção:** `4.200+ empresários já aplicaram o método.`
- **Subheadline:** Rola pra ver alguns dos resultados de quem já participou.
- **Formato:** Marquee em 2 direções opostas, pause on hover. **Imagens PNG**, não texto. Importar as 19 imagens de `intensivo-claude-code-astro/public/depoimentos/depoimento-01.png` até `depoimento-19.png` para `site/public/depoimentos/`.
- **Linha editorial sob o marquee (mono):** `19 prints reais. Zero stock. Zero ator pago.`

### 4.4 Big Idea — 2015 → 2026

Bloco narrativo editorial, full-width, protagonismo da tipografia.

- **Kicker:** `A TESE DA PÁGINA`
- **H2 (Fraunces, dominante):** `Aprender Claude Code em 2026 tem a vantagem de quem aprendeu marketing digital em 2015.`
- **Parágrafo 1:** Poucos sabiam. Muitos negócios precisavam.
- **Parágrafo 2:** Hoje, dashboards, ferramentas internas, automações e aplicações de nicho deixaram de ser "software". Viraram ativo digital de qualquer negócio minimamente sério.
- **Assinatura (mono, em itálico):** `Mateus Dias, abril de 2026`

### 4.5 Use Cases — Setores

Grid editorial 2 colunas, alternando tamanho. Ícones Lucide monocromáticos (não emoji).

- **Kicker:** `QUEM JÁ USA`
- **H2:** Setores que já estão construindo com Claude Code.
- **Cenários (8):**
  1. **Saúde** — Médicos criando apps de acompanhamento. Clínicas automatizando agendamento e prontuários.
  2. **Jurídico** — Advogados lançando ferramentas de análise de contratos e dashboards de gestão de processos.
  3. **Construção civil** — Construtoras criando sistemas de gestão de obras sem contratar software house.
  4. **Educação** — Professores construindo plataformas próprias de aprendizado com assinatura mensal.
  5. **Varejo** — Lojistas automatizando precificação, estoque e atendimento com ferramentas próprias.
  6. **Finanças** — Consultores lançando dashboards de acompanhamento para clientes com recorrência.
  7. **Marketing** — Agências criando ferramentas de relatório e automação de entregáveis.
  8. **Hospitalidade** — Hotéis automatizando reservas e comunicação com hóspedes.

### 4.6 Para Quem É

Grid 3×2. Cada perfil em card de `surface`, borda inferior `rule`.

- **Kicker:** `PERFIL DE QUEM VAI`
- **H2:** Se algum desses é você, o intensivo é pra você.
- **Perfis (6):**
  1. **Empresários e empreendedores** — Que querem criar ferramentas internas, automatizar processos ou lançar um produto digital sem depender de dev.
  2. **Profissionais liberais e consultores** — Que querem transformar seu conhecimento de nicho em SaaS com receita recorrente.
  3. **Criadores e influenciadores** — Que têm audiência e querem criar uma ferramenta própria para monetizar além do conteúdo.
  4. **Founders e futuros founders** — Que têm ideia de startup mas travam na parte técnica. Valide, lance e itere sem CTO.
  5. **Gestores e analistas** — Que vivem em planilhas e processos manuais e querem construir ferramentas internas.
  6. **Você não precisa saber programar** — O pré-requisito é ter uma ideia de problema que vale resolver. A IA cuida do resto.

### 4.7 Benefits — "O que só quem está no grupo tem"

Numerados 01 a 04. Formato editorial: número grande em Fraunces 72px, título em 24px, descrição em Inter Tight 16px.

- **Kicker:** `O QUE SÓ QUEM ESTÁ NO GRUPO TEM`
- **H2:** 4 condições que o público geral não vai ter.
- **Benefícios:**
  - **01. Preço travado em R$ 27** — Carrinho público abre em 30/04 por R$ 47 no Lote 1. Quem está no grupo paga R$ 27 por estar 3 dias antes. Esse preço não volta.
  - **02. Bônus de preparação** — Guia de setup do Claude Code e checklist dos 4 Squads no e-mail de boas-vindas. Você chega com o ambiente pronto no dia 16.
  - **03. 72h de vantagem** — Acesso ao carrinho 3 dias antes do público geral. Zero concorrência por vaga e menor preço garantido do funil.
  - **04. Trial 30 dias ChatFunnel** — Todo ingresso inclui trial ativado do ChatFunnel, nossa plataforma própria de automação com IA. Aplica o que aprendeu imediatamente.
- **CTA inline:** `QUERO ENTRAR NO GRUPO`

### 4.8 Timeline do sábado

Horizontal em desktop (régua com 4 pontos), empilhada em mobile.

- **Kicker:** `AGENDA DO DIA`
- **H2:** Como seu sábado vai ser montado.
- **Subheadline:** Você sai do dia com a operação configurada, não só com o conceito entendido.
- **Blocos:**
  - `09h00 às 12h00` — **Bloco 1: Fundamentos do Claude Code** — O que é, como instalar, primeiros passos e tour completo. Sai da manhã com o ambiente rodando e entendendo cada alavanca.
  - `12h00 às 14h00` — **Intervalo para almoço** — Pausa para processar a primeira metade.
  - `14h00 às 16h00` — **Bloco 2: MCP, Agentes, Skills e Projetos Práticos** — Extensões avançadas. Configuração de MCPs, construção de agentes, criação de skills e aplicação tudo junto em projetos práticos ao vivo.
  - `16h00 às 17h00` — **Bloco 3: Apresentação do ecossistema AI Society** — Como o ecossistema acelera o que você acabou de aprender e continua te puxando pra cima depois do sábado.
- **Rodapé da timeline (mono):** `Sábado 16/05 · 09h às 17h · ao vivo no Zoom com gravação liberada.`

### 4.9 Autoridade — Mateus Dias

Split 50/50 em desktop. Foto à esquerda (preto-e-branco alto contraste, crop retrato), texto à direita.

- **Kicker:** `QUEM CONDUZ`
- **H2 (Fraunces):** `Mateus Dias.`
- **Bio:** Fundador do Grupo VUK e especialista em operações de IA para negócios digitais.
- **Credenciais (bullets mono):**
  - CEO do ChatFunnel
  - CEO do ThumbFlow
  - Founder do AI Sigma Studio
  - Host da Imersão InfoSaaS e da CAIA
- **Prova (parágrafo):** Criador do maior canal de Funil de Vendas do Brasil, com 300 mil inscritos e 480+ vídeos que já alcançaram 70 milhões de pessoas. 4.200+ alunos formados no ecossistema VUK.
- **Asset:** Importar `intensivo-claude-code-astro/public/mateus.webp` para `site/public/mateus.webp`. Tratamento visual: filtro grayscale + contraste +10%, aplicado via CSS para preservar fonte original.

### 4.10 Final CTA — "A janela não espera"

Bloco full-width, fundo `surface`, tipografia protagonista.

- **H2 (Fraunces dominante):** `A janela de mercado não espera.`
- **Subheadline:** Claude Code é a conversa do mercado agora. Quem domina em maio sai na frente por 6 a 12 meses. O grupo fecha em 26/04 e a oferta única de R$ 27 não volta.
- **CTA primário:** `SIM, QUERO MEU LUGAR NO GRUPO` → abre modal de captura
- **Microcopy abaixo do CTA:** `Seus dados vão direto para o grupo. Zero spam.`

### 4.11 FAQ

Accordion, 1 aberto por vez. Usa a copy canônica do `intensivo-claude-code-astro/src/config.ts`. **"Sistema 10x" foi substituído** por "infra completa" por decisão do briefing.

- **Kicker:** `PERGUNTAS FREQUENTES`
- **H2:** Respostas rápidas antes de você entrar.
- **Perguntas:**
  1. **Preciso saber programar para usar Claude Code?** — Não. Claude Code foi desenhado para ser operado em linguagem natural. Você dá instruções como daria para um colaborador. O evento parte do zero em configuração e você acompanha ao vivo cada passo.
  2. **O que é esse grupo e por que entrar por ele?** — É o grupo de acesso antecipado no WhatsApp com uma oferta única: R$ 27 no ingresso, disponível só para quem está dentro antes de 26/04. O carrinho público abre em 30/04 a R$ 47 no Lote 1. A oferta de R$ 27 não volta depois.
  3. **E se eu não conseguir estar no Zoom no dia 16/05?** — Se você sabe que não vai conseguir ao vivo, recomendamos o ingresso VIP com gravação vitalícia. O evento ao vivo tem interações e demonstrações práticas que perdem parte do valor no replay.
  4. **Já tenho um curso de Claude Code. Esse é diferente?** — Totalmente. Cursos existentes ensinam produtividade pessoal. Este evento ensina como montar uma operação de IA que você vende para clientes e que gera recorrência mensal. Ângulos completamente diferentes.
  5. **Preciso ter clientes de IA já para aproveitar o evento?** — Não. Se já tem clientes de outros serviços (tráfego, copy, social), você sai do evento com o roteiro para oferecer IA como novo serviço para eles. Se não tem clientes ainda, o bloco 3 cobre como posicionar e vender o serviço.
  6. **Quanto custa para rodar a infra depois do evento?** — A infra completa fica em torno de R$ 39/mês com Claude Code Max mais o trial do ChatFunnel. Após o trial, o ChatFunnel custa R$ 497/mês. Você pode repassar esse custo ao cliente como parte do serviço recorrente.
  7. **E se eu não gostar ou achar que não foi o que esperava?** — Você tem 7 dias a partir da data do evento para pedir reembolso integral, sem justificar. Nenhuma pergunta, nenhuma burocracia.

### 4.12 Footer

- **Copyright:** `© 2026 Grupo VUK. Todos os direitos reservados.`
- **Links legais:** `⚠️ TODO` Política de Privacidade e Termos de Uso (a definir com jurídico da VUK).
- **Contato:** `⚠️ TODO` e-mail de suporte.
- **Logo:** Logo VUK em mono, altura 24px.

---

## 5. Contratos obrigatórios

### 5.1 Config centralizada

Toda copy, CTAs, textos de modal, horário, data e URL do Sendflow em `src/config.ts`. Componentes só importam daí.

Estrutura espelhada do `intensivo-claude-code-astro/src/config.ts`, com os ajustes:
- Remover ocorrências de "Sistema 10x" (substituir por "a operação" ou "a infra completa").
- Ajustar `TIMELINE_FOOTER` para incluir "gravação liberada".
- `EVENT_DATE` = `"16/05, evento online ao vivo no Zoom"` (mantém).

### 5.2 Variáveis de ambiente

`.env.example` obrigatório na raiz de `site/`:

```
PUBLIC_GA_ID=G-7CJMYD129G
PUBLIC_META_PIXEL_ID=
PUBLIC_WEBHOOK_URLS=
PUBLIC_REDIRECT_URL=https://sndflw.com/i/trV5sqi3n9eSZD0U1Rlx
```

Notas:
- `PUBLIC_GA_ID`: fornecido.
- `PUBLIC_META_PIXEL_ID`: `⚠️ TODO` vazio em v1. Quando vazio, script do Pixel não é injetado.
- `PUBLIC_WEBHOOK_URLS`: `⚠️ TODO` vazio em v1. Quando vazio, submit do modal pula o fetch e vai direto ao redirect (sem fire-and-forget).
- `PUBLIC_REDIRECT_URL`: Sendflow do grupo VIP.

**Regra de build:** `.env` ausente em dev não pode quebrar o build. Condicionais em `Base.astro` e `Modal.tsx` precisam detectar string vazia.

### 5.3 Analytics

Padrão detalhado em `~/.claude/skills/landing-page-prd/references/analytics-pattern.md`. Obrigatórios nesta landing:

1. **GA4** com `PUBLIC_GA_ID=G-7CJMYD129G` injetado em `Base.astro`.
2. **Meta Pixel**: **desativado em v1** por falta de ID. Código condicional em `Base.astro` deve permanecer (detecta string vazia e não injeta).
3. **UTM capture** no mount, persistência em `sessionStorage`, append no redirect.
4. **Evento `click_cta`** em cada clique no botão primário (passa `cta_location` = `hero | benefits | final`).
5. **Evento `Lead`** disparado no submit do modal com `event_id` único (UUID v4).

Quando `PUBLIC_WEBHOOK_URLS` estiver vazio, ainda disparar `Lead` no GA4 para medir preenchimento do form.

### 5.4 Modal de captura

Padrão completo em `~/.claude/skills/landing-page-prd/references/modal-pattern.md`. Ajustes específicos:

- **Campos:** nome, email, telefone (máscara `(XX) XXXXX-XXXX`, `inputMode="numeric"`, `autocomplete="tel-national"`).
- **Texto do modal:**
  - `MODAL_TITLE`: "Quase lá."
  - `MODAL_SUBTITLE`: "Preencha para entrar no grupo e acessar a oferta única de R$ 27."
  - `MODAL_SUBMIT`: "ENTRAR NO GRUPO"
  - `MODAL_PRIVACY`: "Seus dados estão seguros. Zero spam."
  - `MODAL_SUCCESS`: "Você está dentro."
  - `MODAL_ERROR`: "Erro ao enviar. Tente novamente."
- **Fluxo de submit:**
  1. Valida campos (lib de validação leve; regex no próprio form).
  2. Dispara `Lead` no GA4 (e no Meta quando o Pixel estiver ativo) com mesmo `event_id`.
  3. Fire-and-forget para webhooks (quando definidos).
  4. Redireciona para `PUBLIC_REDIRECT_URL` com UTMs appended.
- **A11y obrigatório:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, Esc fecha, backdrop condicional com `confirm()` em form sujo, `role="alert"` + `aria-live="assertive"` no erro, `disabled` no submit durante `status==='loading'`.

### 5.5 SEO (13 itens)

- [ ] `favicon.ico` + `favicon.png` (importar de `intensivo-claude-code-astro/public/`)
- [ ] `public/robots.txt` com crawlers de LLM (GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended). Importar base de `intensivo-claude-code-astro/public/robots.txt`.
- [ ] `public/llms.txt` com contexto denso do produto. Importar base de `intensivo-claude-code-astro/public/llms.txt` e revisar.
- [ ] `public/og-image.png` (1200×630). Usar a arte dark/amber vigente da v1.
- [ ] `<meta title>`: `Intensivo Claude Code · 16/05 ao vivo no Zoom` (45 chars)
- [ ] `<meta description>`: `Sábado intensivo com Mateus Dias. Construa 10 agentes de IA sem programar. Grupo VIP com oferta única R$ 27.` (≈ 140 chars)
- [ ] `<meta keywords>`: `claude code, intensivo, mateus dias, agentes de ia, grupo vuk, ai builder, no-code, saas brasileiro`
- [ ] `<meta viewport>`, `<html lang="pt-BR">`, `<meta charset="UTF-8">`
- [ ] `<link rel="canonical">`: `⚠️ TODO` (definir quando domínio for escolhido)
- [ ] `<meta theme-color="#0A0A0B">` batendo com `manifest.theme_color`
- [ ] `<link rel="manifest">` + `public/manifest.webmanifest` (`theme_color: #0A0A0B`, `background_color: #0A0A0B`)
- [ ] `<link rel="apple-touch-icon">`
- [ ] `<script type="application/ld+json">` com `Organization` + `WebSite` + `Event` (ver 5.6)

### 5.6 Structured data

Três tipos obrigatórios nesta landing:

- **Organization** (Grupo VUK) — nome, url, logo, sameAs redes sociais
- **WebSite** — potentialAction SearchAction se aplicável (aqui pode omitir)
- **Event** — ver template em `~/.claude/skills/landing-page-prd/references/structured-data-templates.md`. Campos:
  - `name: "Intensivo Claude Code"`
  - `startDate: "2026-05-16T09:00:00-03:00"`
  - `endDate: "2026-05-16T17:00:00-03:00"`
  - `eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode"`
  - `eventStatus: "https://schema.org/EventScheduled"`
  - `location: VirtualLocation com url = Zoom placeholder "https://zoom.us/j/..."` (`⚠️ TODO` link do Zoom)
  - `organizer: Grupo VUK`
  - `offers: price 27.00, priceCurrency BRL, availability InStock, validFrom 2026-04-22, url = Sendflow`

### 5.7 Tokens Tailwind v3 da v1 dark

Na v1, tokens vivem em `tailwind.config.mjs` e são espelhados em `src/styles/global.css`. A paleta dark/amber atual é contrato da landing e não deve ser alterada nesta correção:

- `page: #0A0A0B`
- `surface: #141416`
- `elevated: #1C1C20`
- `accent.DEFAULT: #E07A3A`
- `accent.hover: #F59E53`
- `accent.deep: #C85D25`
- `ink.primary: #F5F5F5`
- `ink.secondary: #A8A8A8`
- `ink.muted: #6B6B6B`

`bg-[#hex]` e `text-[#hex]` inline continuam proibidos fora de componentes utilitários legados. Não alterar cores no ciclo de correção dos blockers.

### 5.8 Dependency hygiene

- Uma lib de animação por papel: **GSAP 3** (entrance + mask-reveal), **motion v12** (microinteração React), **CSS puro** (marquee infinito, live-pulse).
- **Proibido:** `framer-motion`, `tailwindcss-animate` (não precisamos, temos keyframes locais), `react-intersection-observer` (GSAP ScrollTrigger basta), `headlessui/react` (accordion e dialog vamos escrever com primitivas do projeto + Radix se necessário).
- Build final: `npx astro build` sem warnings.

### 5.9 Assets importados do ICC Astro

Cópia bruta para `site/public/`:

| Origem | Destino | Observação |
|---|---|---|
| `intensivo-claude-code-astro/public/depoimentos/depoimento-{01..19}.png` | `site/public/depoimentos/` | 19 prints; usados na seção Social Proof |
| `intensivo-claude-code-astro/public/mateus.webp` | `site/public/mateus.webp` | Foto do Mateus; aplicar grayscale via CSS |
| `intensivo-claude-code-astro/public/og-image.png` | `site/public/og-image.png` | ⚠️ Revisar se bate com light theme; se não, recriar |
| `intensivo-claude-code-astro/public/favicon.ico` | `site/public/favicon.ico` | |
| `intensivo-claude-code-astro/public/favicon.png` | `site/public/favicon.png` | |
| `intensivo-claude-code-astro/public/robots.txt` | `site/public/robots.txt` | Revisar |
| `intensivo-claude-code-astro/public/llms.txt` | `site/public/llms.txt` | Reescrever para refletir copy nova |
| `intensivo-claude-code-astro/public/manifest.webmanifest` | `site/public/manifest.webmanifest` | Ajustar `theme_color` para `#FBFAF7` |

Componentes **não** são importados. A refatoração visual é total.

---

## 6. Dependências do projeto

```json
{
  "dependencies": {
    "@astrojs/react": "^3",
    "astro": "^4",
    "motion": "^12",
    "gsap": "^3",
    "react": "^18",
    "react-dom": "^18",
    "tailwindcss": "^3",
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

`site/astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  output: 'static',
});
```

Notas:
- `site/` usa Tailwind v3 e `@astrojs/tailwind` por decisão de estabilidade da v1.
- `tailwind.config.mjs` existe e é fonte de verdade para tokens de classe.
- Migração para Tailwind v4 fica fora do escopo desta correção.

---

## 7. Verificação end-to-end

- [ ] `npx astro build` passa sem warnings
- [ ] `dist/index.html` contém JSON-LD com `Organization + WebSite + Event`
- [ ] `dist/index.html` contém `<meta>` title, description, keywords, canonical, theme-color, og:*
- [ ] `dist/robots.txt`, `dist/llms.txt`, `dist/manifest.webmanifest` existem e batem com o tema dark/amber
- [ ] Modal: Tab/Shift+Tab confinados, Esc fecha, backdrop com `confirm()` em form sujo, erro com `aria-live`
- [ ] Submit end-to-end: GA4 dispara `Lead` com `event_id`, redireciona para Sendflow com UTMs propagados
- [ ] Lighthouse mobile (375px, Slow 4G): Performance ≥ 90, Acessibilidade ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] `landing-page-audit` rodado em 320 / 390 / 768 / 1024 — zero falha crítica
- [ ] `clean-code` rodado — sem warnings de qualidade

---

## 8. Checklist pré-deploy

Copiar `intensivo-claude-code-astro/docs/quality-checklist.md` para `site/docs/quality-checklist.md` e adaptar. Preencher **antes** do merge em `main`.

---

## 9. Fora do escopo deste PRD

- Copy de hero final (já colada aqui, mas variações A/B são escopo de `copywriting` + `hooks-and-angles`)
- Mobile audit fino (`landing-page-audit` pós build)
- Auditoria de qualidade geral (`clean-code`)
- Validação pós-deploy do JSON-LD (Rich Results Test)
- Configuração de DNS e SSL (ver `dns-ssl`, `deploy-pipeline`)
- Criação de pixel novo caso o cliente decida ativar (ver `env-secrets`)
- Recriação visual completa em Editorial Light
- Migração para Tailwind 4

---

## 10. Pendências abertas a resolver antes do deploy

Itens marcados `⚠️ TODO` no PRD, consolidados:

1. Validar submit real com Sigma, GA4 e Meta Events Manager.
2. Validar JSON-LD no validator.schema.org.
3. Validar Lighthouse mobile e securityheaders.io no domínio final.
7. **Decisão sobre OG image** (manter do ICC Astro ou recriar no novo tema).

Nenhuma dessas bloqueia a implementação inicial. Todas podem ser resolvidas via `.env` ou ajuste pontual no dia do merge.

---

<!-- removido: seção Pricing (oferta única dentro do grupo; não se justifica tabela comparativa) -->
<!-- removido: menção a "Sistema 10x" (decisão do briefing; substituído por "infra completa" ou "a operação") -->
<!-- removido: CTA secundário "GARANTIR MINHA VAGA — R$ 27" da copy colada (página é captura, não checkout direto) -->
