---
title: PRD — Intensivo Claude Code
created: 2026-04-22
tags: [prd, landing, intensivo-claude-code]
status: draft
project: intensivo-claude-code-landing
---

# PRD: Intensivo Claude Code

> Landing de captura para o Intensivo Claude Code (16/05/2026, ao vivo no Zoom). Stack Astro 4 + Tailwind 4 + React 18 via islands. Direção estética **Editorial Light Serifado** (branco quente + laranja imprensa). Leitura do PRD em ≤ 10 minutos. Patterns detalhados em `~/.claude/skills/landing-page-prd/references/`.

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
- **Estilo:** Tailwind CSS 4
- **Animação de entrada e hero:** GSAP 3
- **Microinteração em componentes React:** `motion` v12 (proibido `framer-motion`)
- **Fontes:** Definidas na seção 3 abaixo. Injetadas via `<link>` Google Fonts com `display=swap` e `preconnect`.
- **Ícones:** `lucide-react` (stroke 1.5, nunca filled)
- **Deploy:** Vercel Git Integration (merge em `main` = deploy production). Proibido `vercel --prod` manual.
- **DNS:** Cloudflare MCP (quando domínio definir).

---

## 3. Direção estética (Fase 0)

### 3.1 Respostas às 4 perguntas

- **Propósito.** Vender um sábado ao vivo (R$27) a empreendedores não-dev. A página precisa entregar pertencimento e timing histórico.
- **Tom.** Editorial de revista de tecnologia séria, autoral, sem hype. Nada de "transforme sua vida".
- **Restrições.** 48h mínimas no ar até fechamento do grupo (26/04). Mobile-first (tráfego primário Instagram/WhatsApp). Precisa abrigar foto do Mateus sem cair em vibe gurú.
- **Diferencial.** A tese do paralelo histórico ("Claude Code em 2026 é o marketing digital em 2015"). Toda a página ancora nesse frame.

### 3.2 Extremo escolhido

`editorial/magazine` em tema **light com acento quente**. Combinado com traço `brutalist/raw` controlado (réguas 1px, cortes secos, zero sombra sintética).

### 3.3 Tokens da Fase 0 (fonte da verdade para `tailwind.config.mjs`)

| Categoria | Token | Valor | Nota |
|---|---|---|---|
| Fundo | `page` | `#FBFAF7` | Off-white quente, cor de papel impresso |
| Fundo alt | `surface` | `#F3F1EC` | Um grau de warmth para blocos de ênfase |
| Card | `elevated` | `#FFFFFF` | Branco puro, apenas em cards críticos |
| Tinta principal | `ink.primary` | `#0B0B0D` | Preto levemente quente |
| Tinta apoio | `ink.secondary` | `#4A4744` | Parágrafo secundário, metadata |
| Tinta muted | `ink.muted` | `#8A8580` | Captions, disclaimers |
| Linha | `rule` | `#D9D4CB` | Régua 1px editorial |
| Acento | `accent.DEFAULT` | `#E4572E` | Laranja imprensa |
| Acento hover | `accent.hover` | `#C84521` | |
| Acento deep | `accent.deep` | `#A63A1F` | Texto sobre acento em estados ativos |

### 3.4 Fontes

- **Display:** **Fraunces** (Google Fonts). Variable, `opsz` ativa, peso 500–700. Usada em H1, H2, grandes números, títulos de bloco.
- **Body:** **Inter Tight** (Google Fonts). Denso, editorial. Peso 400 regular, 600 em ênfase curta.
- **Mono:** **JetBrains Mono** (Google Fonts). Apenas em datas, horários, valores (`R$ 27`), pré-headlines tipo `AO VIVO · 16 DE MAIO · ZOOM`.
- **Proibido no projeto:** Inter regular (não-tight) como display, Space Grotesk, Roboto, Arial, system-ui.

### 3.5 Textura, motion, composição

- **Textura:** SVG grain 4% de opacidade em `page`. Régua horizontal 1px (`rule`) separando seções, como em revista. Zero gradient. Zero orb. Zero sparkle. Zero shadow-2xl.
- **Motion signature:** **Mask-reveal horizontal** no H1 e H2 (GSAP + `clip-path` inset). Cortes secos ao entrar no viewport. Microinteração em cards = translate 2px + outline laranja 1px. Nada de fade-in-from-bottom.
- **Composição:** Grid 12-col editorial **assimétrico**. Hero quebra H1 em 3 linhas com ênfase tipográfica diferente em cada. Setores e Perfis alternam tamanhos de cards (não bento uniforme). Timeline horizontal com régua.

### 3.6 Referências visuais

1. **Attio** (attio.com) — transições tipográficas dramáticas, bold em serifada, densidade editorial. Emprestar: hierarquia de H1.
2. **The Marginalian** (themarginalian.org) — editorial denso em light theme, tipografia autoral. Emprestar: atmosfera de revista.
3. **It's Nice That** (itsnicethat.com) — grid assimétrico, crops tipográficos. Emprestar: crop e alternância de tamanho.

### 3.7 Anti-padrões deste projeto

1. Dark theme com âmbar `#E07A3A` (é a cara do ICC Astro atual, estamos justamente nos afastando).
2. Fade-in from bottom genérico em tudo.
3. Emojis coloridos nos setores (usar glifos monocromáticos Lucide ou tipografia com letra-de-caixa).
4. Cards com `border-radius > 8px`. Editorial pede cantos retos ou levemente arredondados.
5. Shadow-2xl, glow, spotlight, sparkle animation.
6. Gradient mesh de fundo.

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
- [ ] `public/og-image.png` (1200×630). Importar de `intensivo-claude-code-astro/public/og-image.png`. **Revisar** se bate com a nova direção estética (light + laranja); se não, recriar.
- [ ] `<meta title>`: `Intensivo Claude Code · 16/05 ao vivo no Zoom` (45 chars)
- [ ] `<meta description>`: `Sábado intensivo com Mateus Dias. Construa 10 agentes de IA sem programar. Grupo VIP com oferta única R$ 27.` (≈ 140 chars)
- [ ] `<meta keywords>`: `claude code, intensivo, mateus dias, agentes de ia, grupo vuk, ai builder, no-code, saas brasileiro`
- [ ] `<meta viewport>`, `<html lang="pt-BR">`, `<meta charset="UTF-8">`
- [ ] `<link rel="canonical">`: `⚠️ TODO` (definir quando domínio for escolhido)
- [ ] `<meta theme-color="#FBFAF7">` batendo com `manifest.theme_color`
- [ ] `<link rel="manifest">` + `public/manifest.webmanifest` (`theme_color: #FBFAF7`, `background_color: #FBFAF7`)
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

### 5.7 Tokens Tailwind (tradução da Fase 0)

```js
// site/tailwind.config.mjs — extract
export default {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'serif'],
        sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        page: '#FBFAF7',
        surface: '#F3F1EC',
        elevated: '#FFFFFF',
        rule: '#D9D4CB',
        accent: {
          DEFAULT: '#E4572E',
          hover: '#C84521',
          deep: '#A63A1F',
        },
        ink: {
          primary: '#0B0B0D',
          secondary: '#4A4744',
          muted: '#8A8580',
        },
      },
      keyframes: {
        'mask-reveal': {
          '0%':   { 'clip-path': 'inset(0 100% 0 0)' },
          '100%': { 'clip-path': 'inset(0 0 0 0)' },
        },
        'live-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.4' },
        },
        'marquee-left':  { '0%': { transform: 'translateX(0)' },       '100%': { transform: 'translateX(-50%)' } },
        'marquee-right': { '0%': { transform: 'translateX(-50%)' },    '100%': { transform: 'translateX(0)' }    },
      },
      animation: {
        'mask-reveal':   'mask-reveal 0.8s cubic-bezier(0.77, 0, 0.175, 1) both',
        'live-pulse':    'live-pulse 1.6s ease-in-out infinite',
        'marquee-left':  'marquee-left 55s linear infinite',
        'marquee-right': 'marquee-right 55s linear infinite',
      },
    },
  },
  plugins: [],
};
```

`bg-[#hex]` e `text-[#hex]` inline **são bug de code review**. Reprovar PR.

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
    "@astrojs/tailwind": "^5",
    "astro": "^4",
    "motion": "^12",
    "gsap": "^3",
    "react": "^18",
    "react-dom": "^18",
    "tailwindcss": "^4",
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

Notas:
- **Tailwind 4** (não 3.4 como o template antigo sugere). Projeto é novo, stack do CLAUDE.md global manda v4.
- **Removido:** `class-variance-authority` (não precisamos, variantes simples com `clsx` bastam); `tailwindcss-animate` (temos nossas keyframes).
- **Adicionado via justificativa:** nada além do template mínimo.

---

## 7. Verificação end-to-end

- [ ] `npx astro build` passa sem warnings
- [ ] `dist/index.html` contém JSON-LD com `Organization + WebSite + Event`
- [ ] `dist/index.html` contém `<meta>` title, description, keywords, canonical, theme-color, og:*
- [ ] `dist/robots.txt`, `dist/llms.txt`, `dist/manifest.webmanifest` existem e batem com o novo tema
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
- Webhook de captura de lead (CRM destino) — definir em próxima iteração
- Recriação do OG image se o atual não bater com light theme

---

## 10. Pendências abertas a resolver antes do deploy

Itens marcados `⚠️ TODO` no PRD, consolidados:

1. **Domínio final** da landing (impacta canonical, manifest, og:url).
2. **Meta Pixel ID** (se for ativar v1.1, passar para `.env`).
3. **Webhook de captura** (CRM ou Zapier para push do lead).
4. **URL do Zoom** para JSON-LD `Event.location`.
5. **Política de Privacidade + Termos** (URLs).
6. **E-mail de contato** no footer.
7. **Decisão sobre OG image** (manter do ICC Astro ou recriar no novo tema).

Nenhuma dessas bloqueia a implementação inicial. Todas podem ser resolvidas via `.env` ou ajuste pontual no dia do merge.

---

<!-- removido: seção Pricing (oferta única dentro do grupo; não se justifica tabela comparativa) -->
<!-- removido: menção a "Sistema 10x" (decisão do briefing; substituído por "infra completa" ou "a operação") -->
<!-- removido: CTA secundário "GARANTIR MINHA VAGA — R$ 27" da copy colada (página é captura, não checkout direto) -->
