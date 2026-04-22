---
title: Copy — <Nome da Landing>
slug: <slug-da-landing>
status: draft
owner: Mateus Dias
updated: YYYY-MM-DD
project: <projeto>
tags: [copy, landing, draft]
---

> [!note] Como usar este template
> Um arquivo por landing, salvo em `docs/copy/<slug>.md`. Este é o **source of truth da copy**, antes de virar `src/config.ts`. Preencha de cima pra baixo. O que estiver `<entre colchetes>` é placeholder. O que estiver em `// comentário` é orientação e deve ser removido no final.

---

## 0. Briefing resumido

- **Produto/oferta:** <uma frase>
- **Público-alvo:** <quem é, em que momento, qual dor>
- **Objetivo da página:** <captura | venda | agendamento | download>
- **CTA primário:** <texto do botão> → <destino>
- **Oferta / preço:** <R$ valor, parcelas, desconto, prazo>
- **Deadline:** <quando vai ao ar>
- **Nível de urgência:** <nenhuma | moderada | alta — e por quê>

---

## 1. Big Idea e ângulo

> A big idea responde: "por que **agora** e por que **assim**?"

- **Big idea (uma frase):** <a tese central da página>
- **Ângulo dominante:** <descoberta | mecanismo | contraste | inimigo | paradigma>
- **Promessa específica:** <resultado mensurável + prazo>
- **Prova que sustenta:** <cases, dados, autoridade, demo>

---

## 2. TopBar (opcional — só em lançamento)

// Faixa superior clicável. Usada quando existe oferta com urgência.

- **Texto:** <max 80 caracteres> // ex: "Inscrições encerram 28/04 — últimas 12 vagas"
- **Ação ao clicar:** <abre modal | rola pra pricing | nada>

---

## 3. Hero

> A dobra. Testa aqui primeiro. Se o hero não vende, o resto não salva.

- **Pré-headline / kicker (opcional):** <max 40 caracteres>
- **Headline (H1):** <max 90 caracteres> // ganho concreto + especificidade
- **Subheadline:** <max 180 caracteres> // como entrega, para quem, em quanto tempo
- **Bullets de apoio (3 no máximo):**
  - <bullet 1>
  - <bullet 2>
  - <bullet 3>
- **CTA primário:** <texto do botão>
- **CTA secundário (opcional):** <texto> // ex: "Ver como funciona"
- **Microcopy abaixo do CTA:** <max 60 caracteres> // ex: "Sem cartão. Acesso em 2 minutos."
- **Prova curta visível:** <logos de empresa | "+2.400 alunos" | rating>

---

## 4. Social Proof / Depoimentos

// Entra quando existem 6+ depoimentos reais. Marquee 2 direções, pause on hover.

- **Headline da seção (opcional):** <max 70 caracteres>
- **Depoimentos:** // mínimo 6 para virar marquee; cada depoimento 60–140 caracteres
  - Nome, cargo/empresa — "<depoimento>"
  - ...

---

## 5. Use Cases (opcional)

// Entra quando o produto tem cenários de uso distintos.

- **Headline da seção:** <max 70 caracteres>
- **Subheadline:** <max 160 caracteres>
- **Cenários:**
  - **<Título do cenário 1>** — <1 frase do problema + 1 frase do resultado>
  - **<Título do cenário 2>** — ...

---

## 6. Benefits (sempre)

// Numerados 01–04, no máximo 4. Cada benefício = transformação concreta.

- **Headline da seção:** <max 70 caracteres>
- **Benefícios:**
  - **01. <Título do benefício>** — <descrição 1–2 frases, transformação antes/depois>
  - **02. <Título do benefício>** — ...
  - **03. <Título do benefício>** — ...
  - **04. <Título do benefício>** — ...

---

## 7. Timeline (só para evento)

// Blocos hora/título/descrição. Remover a seção se não for evento.

- **Data do evento:** <DD/MM/YYYY>
- **Blocos:**
  - `HH:MM` — **<título>** — <1 frase do que acontece>
  - ...

---

## 8. Pricing (só para SaaS / produto com preço público)

// Remover se for captura de lead sem preço visível.

- **Headline da seção:** <max 70 caracteres>
- **Subheadline:** <max 160 caracteres>
- **Planos:**
  - **<Nome do plano>** — <R$ valor / período>
    - <bullet 1>
    - <bullet 2>
    - <bullet 3>
    - **CTA:** <texto do botão>
  - ...
- **Garantia:** <texto da garantia, prazo, condição>

---

## 9. Final CTA

- **Headline:** <max 90 caracteres> // urgência + benefício final
- **Subheadline:** <max 180 caracteres>
- **CTA primário:** <texto do botão>
- **Microcopy abaixo do CTA:** <max 60 caracteres>
- **Reforço visual:** <contador | faixa de oferta | prova final>

---

## 10. FAQ

// Accordion, 1 aberto por vez. 5–8 perguntas. Ataque objeções reais, não genéricas.

- **Headline da seção:** <max 60 caracteres> // ex: "Dúvidas frequentes"
- **Perguntas:**
  1. **<pergunta, na voz do lead>** — <resposta 2–4 frases>
  2. ...

---

## 11. Footer

- **Copyright:** © <ano> <empresa>. Todos os direitos reservados.
- **Links legais:** <Política de Privacidade> | <Termos de Uso>
- **Contato:** <email | WhatsApp>
- **Logos de parceiros/selos (opcional):** <lista>

---

## 12. Meta e SEO

// Alimenta os 13 itens do pré-deploy checklist.

- **Meta title (< 60 caracteres):** <título>
- **Meta description (< 160 caracteres):** <descrição>
- **Meta keywords:** <kw1, kw2, kw3>
- **OG title:** <título para redes sociais>
- **OG description:** <descrição para redes sociais>
- **OG image (1200×630):** <path ou URL>
- **Slug da URL:** <slug>
- **Canonical:** <URL completa>

---

## 13. Microcopy utilitária

// Frases curtas espalhadas pela página.

- **Label do campo nome:** Seu nome
- **Label do campo email:** Seu melhor e-mail
- **Label do campo telefone:** WhatsApp com DDD
- **Placeholder telefone:** (11) 98765-4321
- **Texto de erro genérico:** Revise os campos e tente novamente.
- **Texto de sucesso:** Pronto. Redirecionando…
- **Texto do botão durante loading:** Enviando…
- **Texto de "voltar ao topo":** Voltar ao topo

---

## 14. Checklist de tom (passar antes de aprovar)

- [ ] Nenhum travessão longo (em dash `—`). Usar ponto, vírgula, ou dois pontos.
- [ ] Acentos corretos em todo texto voltado ao usuário.
- [ ] Voz ativa em 90%+ do texto.
- [ ] Zero "soluções", "transforme sua vida", "resultados incríveis", "nunca mais". Palavras mornas e genéricas reprovam.
- [ ] Headline tem número, nome próprio ou especificidade concreta.
- [ ] CTA começa com verbo no imperativo afirmativo.
- [ ] Cada benefício é uma transformação, não uma feature.
- [ ] FAQ ataca objeções reais do público, não perguntas fabricadas.
- [ ] Depoimentos têm nome completo + cargo/empresa; genéricos são removidos.
- [ ] Toda promessa tem prova ao lado (case, dado, demo, garantia).
- [ ] Nenhum lorem ipsum, nenhum `<placeholder>` esquecido.

---

## 15. Referências e variações descartadas (opcional)

// Espaço para o que foi testado e descartado, para não refazer depois.

- **Headline alternativa:** <opção descartada + motivo>
- **CTA alternativo:** <opção descartada + motivo>

