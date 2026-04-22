---
title: PRD — Variante ParaQuem ICC · Checklist Editorial
created: 2026-04-22
tags: [prd, landing, intensivo-claude-code, paraquem, variant]
status: draft
project: intensivo-claude-code-landing
parent-prd: intensivo-claude-code.md
---

# PRD: Variante ParaQuem ICC · Checklist Editorial

> Releitura da seção "Se algum desses é você, o intensivo é pra você." (`src/components/sections/ParaQuem.astro`). A implementação atual usa grid 3-col uniforme com 6 cards idênticos — zero hierarquia, zero interatividade, e o 6º item ("Você não precisa saber programar") não é perfil (é meta-reassurance) mas recebe o mesmo peso visual dos outros 5. Esta variante substitui por um **checklist editorial**: coluna única, cada perfil é um `<button>` com caixa de check 24px à esquerda, título Fraunces e descrição Inter Tight à direita, régua 1px `bg-rule` entre itens. O usuário **clica pra se marcar** (estado visual client-side, sem form). O 6º item é promovido a callout P.S. separado, fora do checklist. Stack, tokens, direção estética, SEO, modal, analytics herdados do PRD mãe. Este documento especifica apenas o delta da seção ParaQuem.

---

## 1. Contexto

- **Escopo:** **uma seção só** (ParaQuem). Nada fora dela muda em Astro/CSS; `src/config.ts` recebe dois ajustes mínimos (headline + chave nova pra footnote).
- **Por que existe:** a implementação atual falha em dois níveis:
  1. **Sem hierarquia.** 6 cards idênticos em grid 3×2 dão a impressão de "lista de segmentos de mercado", não de "identificação pessoal". O usuário escaneia e segue scrollando sem parar pra se reconhecer.
  2. **Outlier disfarçado.** O 6º item ("Você não precisa saber programar") é reassurance, não perfil. Tratá-lo como perfil força o leitor a reler e pensar "ah, isso não é um perfil, é um lembrete" — quebra ritmo de leitura e dilui os 5 perfis reais.
- **Por que o Checklist Editorial resolve:**
  1. **Pede ação mental ativa.** O formato checklist força o leitor a se perguntar "isso sou eu?". Transforma leitura passiva em reconhecimento consciente.
  2. **Resolve o outlier naturalmente.** O 6º item sai do checklist e vira P.S. com tipografia distinta (mono + border-top + `bg-surface`), comunicando explicitamente "este é um lembrete, não um perfil".
  3. **Amplifica o lead magnet.** Quando o usuário marca 1+ itens, aparece um CTA inline ("Se você se reconheceu, entra no grupo"). Micro-compromisso antes do scroll chegar no Final CTA.
- **Público:** idêntico ao PRD mãe. Empresário / empreendedor / profissional liberal. O formato checklist funciona universalmente (não pede letramento técnico).
- **Métrica norte:** **tempo médio na seção ParaQuem ≥ 6s** (GA4 `scroll_depth` entre `#para-quem-e` e `#benefits`, baseline atual ~3s). Secundária: % de usuários que clicam pelo menos 1 check (tracking via `click_paraquem_check` custom event, não-crítico).
- **Janela:** mesmo deploy das variantes anteriores (hero-mission-control, usecases-bento). Prazo final PRD mãe 24/04/2026 vigente.
- **Risco principal:** interatividade (click-to-check) pode sugerir falsamente que é formulário e confundir usuário. Mitigação: label claro ("Isto é um autoteste, não envia nada") + nenhum `<form>` / `<input>` real / submit button.

---

## 2. Stack

Sem alteração. Herda integralmente do PRD mãe.

- Astro 4, Tailwind 4 via `@tailwindcss/vite`, GSAP 3 como orquestrador de entrada, **zero React island** nesta seção (interatividade via `<script>` inline vanilla + `data-*` attributes, Astro puro).
- **Zero nova dependência.**
- **Zero novo token em `@theme`.** Toda a paleta sai de `page | surface | elevated | rule | ink.* | accent.*` já existentes.

---

## 3. Direção estética (delta Fase 0)

Herda Editorial Light + Brutalist Raw do PRD mãe §3 (cantos retos, zero shadow sintética, Fraunces + Inter Tight + JetBrains Mono, régua 1px `bg-rule` accent).

### 3.1 Composição do checklist

- **Container:** `max-w-3xl mx-auto`. Largura menor que o padrão `max-w-6xl` das outras seções (UseCases, Timeline). Checklist editorial pede rítmo de leitura estreito, tipo página de revista: linha de 60-70 caracteres, não linha de dashboard.
- **Desktop e Mobile:** **coluna única** em todos os breakpoints. Sem grid responsivo. A única variação entre viewports é padding do item (mais compacto no mobile) e tamanho do título (Fraunces 24px mobile → 28px desktop).
- **Régua divisória:** `border-b border-rule` em cada item exceto o último. Mantém o espírito "índice de revista" (mesma técnica do rule 1px no UseCases original).
- **Espaçamento vertical entre itens:** `py-6 sm:py-7` dentro de cada `<button>`. Respiração generosa — cada linha tem peso de entrada de lista, não de célula de tabela.

### 3.2 Anatomia do item (5 perfis)

Cada item é um `<button type="button">` (row inteira clicável/focável), com grid interno:

```
┌────────────────────────────────────────────────────┐
│ [☐]   Empresários e empreendedores                 │
│        Que querem criar ferramentas internas,      │
│        automatizar processos ou lançar um produto  │
│        digital sem depender de dev.                │
└────────────────────────────────────────────────────┘
```

**Especificações:**

- **Layout interno:** `grid grid-cols-[auto_1fr] gap-5 sm:gap-6 items-start text-left`.
- **Check box (`<span class="check">`):**
  - Tamanho: `w-6 h-6 sm:w-7 sm:h-7` (24–28px).
  - Estilo padrão: `border border-rule bg-elevated`, quadrado, cantos retos.
  - Estado `aria-pressed="true"`: `bg-accent border-accent` + ícone `✓` branco em Lucide `Check` stroke 2.
  - Transição: `transition-colors duration-200 ease-out`.
- **Título (`<h3>`):**
  - `font-display text-2xl sm:text-[1.75rem] leading-snug text-ink-primary`.
  - Fraunces 24–28px.
  - Sem bold extra — Fraunces 500 já tem peso.
- **Descrição (`<p>`):**
  - `font-sans text-base text-ink-secondary leading-relaxed max-w-prose`.
  - Inter Tight 16px, `leading: 1.6`.
  - `mt-2 sm:mt-3`.

**Estados de interação:**

- **Hover (mouse):** toda a row ganha `bg-surface/50` sutil. Check ganha `border-ink-primary`. Transform zero.
- **Focus-visible:** outline 2px accent com `outline-offset: 4px` em toda a row (não só no check). Garante keyboard navigation clara.
- **Active (`aria-pressed="true"`):** check fica accent, `✓` aparece. Título ganha `text-ink-primary` (não muda, já era). Descrição mantém. Pequeno indicador `→` inline ao final do título em `text-accent` opcional — **decisão de render:** testar sem primeiro, adicionar se parecer flat. **Sem mudança de background da row** (evita sensação de "selected" de formulário).
- **Reduced motion:** sem transição, troca instantânea de estado.

### 3.3 Anatomia do outlier (6º item promovido a P.S.)

Após o último item do checklist (Gestores e analistas), **divisória mais forte** (`mt-12 pt-8 border-t border-rule`) e bloco distinto:

```
┌────────────────────────────────────────────────────┐
│ P.S.    VOCÊ NÃO PRECISA SABER PROGRAMAR           │
│                                                    │
│ O pré-requisito é ter uma ideia de problema que    │
│ vale resolver. A IA cuida do resto.                │
└────────────────────────────────────────────────────┘
```

**Especificações:**

- **Container:** `bg-surface border border-rule p-6 sm:p-8`, cantos retos.
- **Eyebrow:** `font-mono text-xs tracking-widest text-accent uppercase` com prefixo `P.S.` separado do título por `tab` visual (margin + linha vertical 1px accent).
  - Estrutura: `<span>P.S.</span><span class="h-3 w-px bg-accent"></span><span>VOCÊ NÃO PRECISA SABER PROGRAMAR</span>`
- **Descrição:** `font-sans text-base sm:text-lg text-ink-secondary leading-relaxed`.
- **Zero check**, **zero interatividade**, **zero role button**. É só leitura.
- **Zero bold** no texto — o peso vem da moldura e do `P.S.`, não do texto.

### 3.4 Micro-CTA inline (aparece após 1+ click)

Quando o usuário marca ao menos 1 check, um bloco CTA aparece abaixo do P.S. com animação `clipPath` reveal + fade:

```
┌────────────────────────────────────────────────────┐
│ →  Se você se reconheceu em algum desses,         │
│    entra no grupo e pega a oferta única de R$ 27.  │
│                                                    │
│    [ ENTRAR NO GRUPO ]                             │
└────────────────────────────────────────────────────┘
```

**Especificações:**

- **Container:** `mt-8 p-6 sm:p-8 bg-elevated border border-accent/40`. Border accent sutil (diferencia visualmente).
- **Texto:** `font-display text-xl text-ink-primary leading-snug`. Fraunces 20px. Começa com seta `→` em `text-accent`.
- **Botão:** CTA padrão da página (`bg-ink-primary text-page hover:bg-accent`, mesmo tratamento dos outros CTAs). Ação: abre modal (reusa `data-open-modal` pattern).
- **Estado inicial:** `hidden` (não apenas opacity). Adicionado ao DOM mas não visível até 1º click.
- **Transição de entrada:** `clipPath: inset(100% 0 0 0) → inset(0 0 0 0)` + `opacity 0 → 1`, duração 320ms, `power3.out`. Vem de baixo pra cima.
- **Não desaparece:** uma vez que apareceu, fica. Mesmo se o usuário desmarcar tudo. (Desmarcar tudo raramente acontece e esconder o CTA dá má impressão de "cancelei algo".)

### 3.5 Motion signature (delta)

- **Entrada da seção:** cada item do checklist entra com `opacity 0 → 1` + `y: 16 → 0`, duração 400ms, stagger 60ms, ease `power3.out`. ScrollTrigger `start: 'top 75%'`. **Uma vez.**
- **Entrada do P.S.:** mesma timeline, stagger estendido (continua após o 5º item). Sem animação diferenciada.
- **Toggle do check:** CSS transition (`transition-colors 200ms`). Zero JS motion lib aqui — mudança de estado é instantânea visualmente, o smooth vem do CSS.
- **Entrada do CTA:** GSAP timeline separada, disparada no JS handler do click (não é ScrollTrigger).
- **Reduced motion:** checklist inteiro renderiza estático, sem entrance, sem transição de toggle (instantâneo). CTA aparece sem animação também (só `display: block`).

---

## 4. Seções afetadas

### 4.1 ParaQuem — substituição completa do markup

**Modifica:** `src/components/sections/ParaQuem.astro` — reescreve o bloco `<section>` inteiro.

### 4.2 Config — ajustes mínimos

**Modifica:** `src/config.ts`:
- **Altera** `PARAQUEM_HEADLINE` de `"Se algum desses é você, o intensivo é pra você."` para `"Marque os que se aplicam a você."`.
- **Remove** o 6º objeto do array `PARAQUEM` (`"Você não precisa saber programar"` + descrição). Fica array de **5 perfis**.
- **Adiciona** nova chave `PARAQUEM_FOOTNOTE`:
  ```ts
  PARAQUEM_FOOTNOTE: {
    label: 'VOCÊ NÃO PRECISA SABER PROGRAMAR',
    body: 'O pré-requisito é ter uma ideia de problema que vale resolver. A IA cuida do resto.',
  },
  ```
- **Adiciona** chaves opcionais de micro-CTA (pra manter single source of truth):
  ```ts
  PARAQUEM_CTA_TEXT: 'Se você se reconheceu em algum desses, entra no grupo e pega a oferta única de R$ 27.',
  PARAQUEM_CTA_BUTTON: 'ENTRAR NO GRUPO',
  ```
- **Adiciona** subheadline curta opcional (decisão de render — só incluir se o H2 parecer isolado):
  ```ts
  PARAQUEM_SUB: 'Autoteste. Marque quem você é. Nenhum dado é enviado.',
  ```

**Não modifica:**
- `src/styles/global.css` — zero adição no `@theme`.
- Qualquer outro componente / página.
- Mantém chave `PARAQUEM_KICKER` intacta.

---

## 5. Contratos obrigatórios

### 5.1 Config centralizada

Ver §4.2. Resumo dos exports novos/alterados em `CONFIG`:
- `PARAQUEM_HEADLINE` (alterado)
- `PARAQUEM` (5 objetos, não 6)
- `PARAQUEM_FOOTNOTE` (novo, objeto `{ label, body }`)
- `PARAQUEM_CTA_TEXT` (novo, string)
- `PARAQUEM_CTA_BUTTON` (novo, string)
- `PARAQUEM_SUB` (novo, opcional, string)

### 5.2 Estrutura do componente

```astro
---
import { CONFIG } from '../../config';
---
<section id="para-quem-e" class="relative border-t border-rule py-24 sm:py-36 bg-surface">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">
      {CONFIG.PARAQUEM_KICKER}
    </p>
    <h2 class="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink-primary mb-4">
      {CONFIG.PARAQUEM_HEADLINE}
    </h2>
    {CONFIG.PARAQUEM_SUB && (
      <p class="font-mono text-xs tracking-widest text-ink-muted uppercase mb-12">
        {CONFIG.PARAQUEM_SUB}
      </p>
    )}

    <div class="paraquem-list" role="group" aria-label="Autoteste de perfil">
      {CONFIG.PARAQUEM.map((perfil, i) => (
        <button
          type="button"
          class={[
            'paraquem-item w-full grid grid-cols-[auto_1fr] gap-5 sm:gap-6 items-start text-left',
            'py-6 sm:py-7',
            i < CONFIG.PARAQUEM.length - 1 ? 'border-b border-rule' : '',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4',
            'transition-colors duration-200 hover:bg-page/40',
          ].join(' ')}
          aria-pressed="false"
          data-paraquem-check
        >
          <span class="paraquem-check relative w-6 h-6 sm:w-7 sm:h-7 border border-rule bg-elevated flex items-center justify-center transition-colors duration-200 mt-1" aria-hidden="true">
            <svg class="paraquem-check-icon opacity-0 transition-opacity duration-150 w-4 h-4 text-page" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </span>
          <div>
            <h3 class="font-display text-2xl sm:text-[1.75rem] leading-snug text-ink-primary">
              {perfil.title}
            </h3>
            <p class="font-sans text-base text-ink-secondary leading-relaxed mt-2 sm:mt-3 max-w-prose">
              {perfil.description}
            </p>
          </div>
        </button>
      ))}
    </div>

    <aside class="paraquem-footnote mt-12 pt-8 border-t border-rule">
      <div class="bg-elevated border border-rule p-6 sm:p-8">
        <p class="flex items-center gap-3 font-mono text-xs tracking-widest text-accent uppercase mb-4">
          <span>P.S.</span>
          <span class="inline-block h-3 w-px bg-accent"></span>
          <span>{CONFIG.PARAQUEM_FOOTNOTE.label}</span>
        </p>
        <p class="font-sans text-base sm:text-lg text-ink-secondary leading-relaxed">
          {CONFIG.PARAQUEM_FOOTNOTE.body}
        </p>
      </div>
    </aside>

    <div class="paraquem-cta hidden mt-8 p-6 sm:p-8 bg-elevated border border-accent/40" aria-hidden="true">
      <p class="font-display text-xl text-ink-primary leading-snug mb-6">
        <span class="text-accent">→</span> {CONFIG.PARAQUEM_CTA_TEXT}
      </p>
      <button
        type="button"
        data-open-modal
        class="inline-block bg-ink-primary text-page font-mono text-xs tracking-widest uppercase px-6 py-4 hover:bg-accent transition-colors duration-200"
      >
        {CONFIG.PARAQUEM_CTA_BUTTON}
      </button>
    </div>
  </div>
</section>
```

### 5.3 Interatividade + a11y (contrato completo)

Cada `<button data-paraquem-check>` obedece:

- **Role implícito `button`**, `type="button"` explícito (nunca `submit`).
- **`aria-pressed`** reflete estado (`"true"` / `"false"`). Toggle no click.
- **Teclado:** Space e Enter disparam `click` nativo (herança gratuita de `<button>`).
- **Leitores de tela:** anunciam título do perfil + estado "pressed / not pressed". Descrição é lida em seguida pelo foco natural.
- **Focus-visible:** outline accent 2px com offset 4px em toda a row (contrato §3.2).
- **Container `role="group"` + `aria-label="Autoteste de perfil"`** agrupa semanticamente os 5 botões.
- **Não submete nada.** Zero `<form>`, zero fetch. Estado é puramente client-side visual.
- **Sem cookie / localStorage** pra persistir seleção entre visitas. Por design: autoteste é momento único, não preferência.
- **Touch:** `<button>` cobre row inteira, área de toque ≥ 44×44px garantida pelo `py-6` e altura intrínseca do título + descrição.

### 5.4 Script de toggle e entrance

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Entrance
  document.fonts.ready.then(() => {
    const items = document.querySelectorAll('.paraquem-item, .paraquem-footnote');
    if (prefersReducedMotion || items.length === 0) return;

    gsap.set(items, { opacity: 0, y: 16 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#para-quem-e',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
      onComplete: () => gsap.set(items, { clearProps: 'opacity,y' }),
    });
    ScrollTrigger.refresh();
  });

  // Toggle + CTA reveal
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-paraquem-check]');
  const cta = document.querySelector<HTMLElement>('.paraquem-cta');
  let ctaRevealed = false;

  function toggle(btn: HTMLButtonElement) {
    const isPressed = btn.getAttribute('aria-pressed') === 'true';
    const next = !isPressed;
    btn.setAttribute('aria-pressed', String(next));
    const check = btn.querySelector<HTMLElement>('.paraquem-check');
    const icon = btn.querySelector<HTMLElement>('.paraquem-check-icon');
    if (check && icon) {
      if (next) {
        check.classList.remove('border-rule', 'bg-elevated');
        check.classList.add('border-accent', 'bg-accent');
        icon.style.opacity = '1';
      } else {
        check.classList.add('border-rule', 'bg-elevated');
        check.classList.remove('border-accent', 'bg-accent');
        icon.style.opacity = '0';
      }
    }
    // CTA reveal on first check
    if (next && !ctaRevealed && cta) {
      ctaRevealed = true;
      cta.classList.remove('hidden');
      cta.removeAttribute('aria-hidden');
      if (!prefersReducedMotion) {
        gsap.fromTo(cta,
          { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0 0 0)', opacity: 1, duration: 0.32, ease: 'power3.out' }
        );
      }
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => toggle(btn));
  });
</script>
```

**Nota:** o modal trigger reusa o `data-open-modal` global delegator já implementado em `site/src/scripts/modal-trigger.ts`. Zero trabalho extra pra integrar o botão.

### 5.5 Tokens e classes

- **Nenhum `bg-[#hex]` ou `text-[#hex]` inline.** Tudo via tokens existentes.
- **Exceção documentada:** `border-accent/40` no container do CTA usa opacity modifier do Tailwind (legítimo, não é hex inline).
- **Classes novas escopadas:** `.paraquem-item`, `.paraquem-check`, `.paraquem-check-icon`, `.paraquem-footnote`, `.paraquem-cta`, `.paraquem-list`. Prefixo `paraquem-` evita leak.
- **Zero classe CSS em `global.css`.** Toda tipografia/cor/estado via utilities Tailwind.

### 5.6 Acessibilidade (resumo)

- Landmark `<section id="para-quem-e">` natural.
- H2 preservado. H3 por perfil no checklist (hierarquia mantida).
- P.S. é `<aside>` (apropriado para conteúdo auxiliar).
- Botões com `aria-pressed`, agrupados em `role="group"` com `aria-label`.
- Check icon é decorativo (`aria-hidden="true"`), estado é comunicado via `aria-pressed`.
- **Contraste WCAG AA:**
  - `ink-primary #0B0B0D` sobre `bg-surface #F3F1EC` = 15.8:1 ✓
  - `ink-secondary #4A4744` sobre `bg-surface` = 9.4:1 ✓
  - `accent #E4572E` sobre `bg-surface` no eyebrow mono `text-xs` = 3.7:1 — FALHA AA para texto < 18px. **Aceitável:** eyebrow é decorativo (mesma caveat do UseCases Bento §5.5). Fallback: trocar para `accent-deep #A63A1F` = 6.1:1.
  - Check `bg-accent` com `✓` branco (`text-page #FBFAF7`) = 4.6:1 ✓ AA para ícone (não-texto).
- **prefers-reduced-motion:** sem entrance, sem transição de toggle, CTA aparece sem clipPath reveal.
- **Keyboard navigation:** Tab circula entre os 5 botões. Focus-visible ring accent garante visibilidade.

---

## 6. Dependências

Nenhuma nova.

---

## 7. Verificação end-to-end

- [ ] `npx astro build` passa sem warnings
- [ ] `npx astro check` 0 errors, 0 warnings no componente novo
- [ ] Headline muda pra "Marque os que se aplicam a você." e array `CONFIG.PARAQUEM` tem exatamente 5 perfis (não 6)
- [ ] Nova chave `CONFIG.PARAQUEM_FOOTNOTE` renderiza como P.S. com mono eyebrow + linha vertical 1px accent
- [ ] Desktop: coluna única, `max-w-3xl`, 5 itens com divisória 1px entre eles
- [ ] Mobile: mesma coluna única, padding ajustado, títulos 24px
- [ ] Click em qualquer item: check vira accent, ícone `✓` aparece, `aria-pressed="true"`, row mantém background
- [ ] Click de novo no mesmo item: desmarca (check volta ao border-rule, ícone some, `aria-pressed="false"`)
- [ ] Keyboard: Tab circula entre 5 botões, Space/Enter toggam check, focus-visible ring accent visível
- [ ] Primeiro click de qualquer item: CTA aparece com `clipPath reveal` (clipPath inset(100% 0 0 0) → inset(0 0 0 0))
- [ ] CTA permanece visível mesmo se usuário desmarcar tudo
- [ ] Click no botão do CTA abre o modal (reuso do `data-open-modal` global)
- [ ] Entrance com stagger 60ms ao entrar no viewport (`top 75%`), uma vez, sem reverter
- [ ] Reduced motion: tudo estático, toggle instantâneo, CTA aparece sem clipPath
- [ ] Lighthouse mobile mantém thresholds (Perf ≥ 90, a11y ≥ 95)
- [ ] Screen reader (VoiceOver macOS / NVDA) anuncia cada botão com título + "not pressed" / "pressed"
- [ ] Nada é enviado a webhook/analytics no toggle (confirma via Network tab)

---

## 8. Impacto em artefatos existentes

### 8.1 PRD mãe
- §4.6 (Para Quem É): adicionar nota apontando para este documento como fonte da implementação visual.

### 8.2 Outros PRDs variantes
- `intensivo-claude-code-hero-mission-control.md`: sem impacto.
- `intensivo-claude-code-usecases-bento.md`: sem impacto. Variantes são independentes.

### 8.3 Código
- Reescreve `src/components/sections/ParaQuem.astro` inteiro.
- Modifica `src/config.ts`: altera 1 chave existente (`PARAQUEM_HEADLINE`), remove 1 entrada do array `PARAQUEM`, adiciona 3 chaves novas (`PARAQUEM_FOOTNOTE`, `PARAQUEM_CTA_TEXT`, `PARAQUEM_CTA_BUTTON`). Opcional: `PARAQUEM_SUB`.
- Sem impacto em `global.css`, `Hero.astro`, `Base.astro`, outros componentes.

### 8.4 Stories existentes
- Nenhuma story em aberto sobre ParaQuem no plano mãe precisa ser rerodada. Story 09 do plano mãe (ParaQuem + Benefits + Timeline) está `done`; esta variante faz um override cirúrgico sobre o estado já implementado.

---

## 9. Fora do escopo deste PRD

- Copy nova pros perfis (permanece a de `config.ts` herdada do PRD mãe; só o 6º item migra pra chave nova e o headline muda).
- Tracking do evento `click_paraquem_check` no GA4 (nice-to-have, fica pra segunda iteração se a métrica norte exigir).
- Persistência do estado entre visitas (cookie/localStorage).
- A/B test entre Checklist (esta variante) vs. Bento (variante alternativa descartada) vs. Lista numerada (variante C descartada) — se rodar teste, é escopo de Tráfego, não de Dev.
- Ícones representativos por perfil (Lucide por role) — fica de fora porque rompe a estética editorial do checklist (ícone vira ruído).
- Mobile audit fino (rodar `landing-page-audit` após build).
- Performance audit detalhado (rodar `clean-code` após implementação).

---

## 10. Próximo passo

Acionar `landing-page-create-plan` com este PRD como input. O plano deve sair com:

- **1 story M** cobrindo: ajustes em `src/config.ts` (headline + array + 3 chaves novas) + reescrita completa de `src/components/sections/ParaQuem.astro` (markup checklist + P.S. + CTA inline + script de toggle + script de entrance) + QA visual em 4 viewports (320/390/768/1024/1440) + teste manual de keyboard nav + screen reader spot-check.
- A story é cleanable em ~45-60 min por `implementer-sonnet`.

Depois do plano: `/expand-stories` + `implementer-sonnet` + re-rodar Story 12 do plano mãe (`landing-page-audit`) como gate de merge.

---

## 11. Log obrigatório

Registrar em `docs/logs/squad-dev/2026-04-22.md` ao fim deste PRD:

```markdown
## [HH:MM] PRD landing intensivo-claude-code-paraquem-checklist — fase planejamento concluida

- **Projeto:** intensivo-claude-code-paraquem-checklist (variante escopada)
- **PRD:** docs/prds/intensivo-claude-code-paraquem-checklist.md
- **Parent PRD:** docs/prds/intensivo-claude-code.md
- **Stack confirmada:** Astro 4 + Tailwind 4 (via @tailwindcss/vite) + GSAP 3 (ScrollTrigger). Zero React, zero nova dep, zero novo token @theme.
- **Secoes afetadas:** ParaQuem (src/components/sections/ParaQuem.astro) + src/config.ts (1 chave alterada, 1 removida do array, 3-4 chaves novas).
- **Integracoes:** nenhuma nova. Reuso do data-open-modal global para o micro-CTA.
- **Copy nova:** headline "Marque os que se aplicam a você."; footnote label "VOCÊ NÃO PRECISA SABER PROGRAMAR"; CTA inline "Se você se reconheceu em algum desses, entra no grupo e pega a oferta única de R$ 27."
- **Risco:** interatividade client-side pode sugerir formulario. Mitigacao via label "Autoteste. Marque quem você é. Nenhum dado é enviado." + zero form/input real.
- **a11y check pendente:** contraste accent sobre bg-surface no eyebrow P.S. (3.7:1) — mesma caveat decorativa do UseCases Bento. Plano B: trocar pra accent-deep (6.1:1).
- **Proximo passo:** invocar `landing-page-create-plan` com slug intensivo-claude-code-paraquem-checklist.
```
