---
title: Plan — Variante ParaQuem ICC · Checklist Editorial
slug: intensivo-claude-code-paraquem-checklist
prd: docs/prds/intensivo-claude-code-paraquem-checklist.md
created: 2026-04-22
status: draft
---

# Plano de Implementacao — Variante ParaQuem ICC · Checklist Editorial

## Resumo

Variante cirurgica de UMA secao. O projeto ja tem scaffold Astro 4 + Tailwind 4 (via `@tailwindcss/vite`) + GSAP 3 + tokens `@theme` + layout Base + modal delegator global funcionando (`src/scripts/modal-trigger.ts`). Nao ha scaffold, tokens, layout, assets publicos, JSON-LD ou deploy a fazer aqui. O delta e **1 story M** cobrindo: mutacoes minimas em `src/config.ts` (1 chave alterada, 1 remocao do array, 3 chaves novas obrigatorias + 1 opcional) + reescrita completa de `src/components/sections/ParaQuem.astro` (markup editorial coluna unica + P.S. outlier + micro-CTA inline + script GSAP de entrance com stagger + script vanilla de toggle/aria-pressed + clipPath reveal do CTA). Tempo estimado: **45-60 min** por `implementer-sonnet`. Auditoria mobile e pre-deploy rodam ao final via re-execucao da Story 12 do plano mae (`landing-page-audit`), fora do escopo deste plano.

## Ordem canonica de landing (justificativa de desvios)

Este plano **nao segue a ordem canonica** porque nao e uma landing nova — e uma variante de UMA secao de landing ja implementada e em `done` (Story 09 do plano mae `docs/plans/intensivo-claude-code.md`). Steps ignorados e justificativa:

1. ~~Scaffold Astro~~ — ja existe em `site/`. `npm create astro` rodado na Story 01 do plano mae.
2. ~~Tokens Tailwind~~ — ja existem em `site/src/styles/global.css` (`@theme` com `page | surface | elevated | rule | ink.* | accent.*`). Story 02 do plano mae. **Zero novo token** neste PRD (§2 e §3 confirmam).
3. ~~Layout Base~~ — `site/src/layouts/Base.astro` ja tem SEO, analytics condicional, fonts preload, manifest. Story 03 do plano mae.
4. ~~Config centralizado~~ — `site/src/config.ts` ja existe. Este plano **muta** chaves existentes, nao cria o arquivo. Cobertura na Story 01 abaixo.
5. Componentes de secao — **unica story deste plano** (Story 01). Reescreve somente `ParaQuem.astro`. Demais secoes intocadas.
6. ~~Modal de captura~~ — ja existe. Story 10 do plano mae. Micro-CTA reusa `[data-open-modal]` via delegator global (`site/src/scripts/modal-trigger.ts`). Zero trabalho.
7. ~~Assets publicos~~ — `public/` completo (favicon, robots.txt, llms.txt, og-image, manifest, apple-touch-icon). Story 11 do plano mae.
8. ~~JSON-LD~~ — ja injetado em `Base.astro`. Story 11 do plano mae.
9. ~~Audit~~ — rodar `landing-page-audit` como gate de merge apos implementacao. **Fora do escopo deste plano** (sera a re-execucao da Story 12 do plano mae).
10. ~~Pre-deploy checklist~~ — 13 itens ja resolvidos no plano mae. Re-validacao no audit.

## Dependencias npm

**Nenhuma nova.** Toda dependencia ja esta no `package.json` do site:
- `astro` 4.x
- `@tailwindcss/vite` 4.x (Tailwind 4 via Vite plugin, nao `tailwind.config.mjs`)
- `gsap` 3.x (+ `ScrollTrigger` registrado via `gsap.registerPlugin`)

Zero React (esta secao nao vira React island — interatividade e vanilla `<script>` inline Astro). Zero `@gsap/react` (nao ha React island). Zero `framer-motion` (proibido — usar `motion` v12 se algum dia precisar, mas esta secao nao precisa).

## Stories embutidas

### Story 01 — ParaQuem · Checklist editorial + P.S. outlier + micro-CTA

- **Complexidade:** M (~130-180 linhas tocadas entre `config.ts` e `ParaQuem.astro` + 1 `<script>` vanilla + 1 `<script>` GSAP)
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** nada (secoes paralelas ja estao `done`, projeto e buildavel antes desta story)
- **Arquivos a criar:** nenhum
- **Arquivos a modificar:**
  - `site/src/config.ts` — altera 1 chave, remove 1 objeto de array, adiciona 3 chaves obrigatorias + 1 opcional
  - `site/src/components/sections/ParaQuem.astro` — reescreve markup + adiciona 2 scripts (entrance GSAP + toggle vanilla)
- **Patterns a seguir:**
  - PRD: `docs/prds/intensivo-claude-code-paraquem-checklist.md` §3 (direcao estetica), §5 (contratos)
  - Modal: `~/.claude/skills/landing-page-prd/references/modal-pattern.md` (apenas para referencia — esta story reusa `[data-open-modal]` global, nao reimplementa modal)
  - Landing pattern base: `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` §GSAP (entrance com `document.fonts.ready` + `ScrollTrigger.refresh()`)

**Contexto:**

A implementacao atual de ParaQuem (`site/src/components/sections/ParaQuem.astro`) usa grid `md:grid-cols-3` com 6 cards identicos. Falha em dois niveis: (1) sem hierarquia — o leitor varre sem se reconhecer; (2) o 6o item e meta-reassurance ("Voce nao precisa saber programar"), nao perfil, e recebe peso visual de perfil. A variante substitui o grid por **checklist editorial coluna unica** (`max-w-3xl`), cada perfil vira `<button type="button">` clicavel com `aria-pressed`, caixa de check 24-28px `<span>` visual a esquerda, titulo Fraunces + descricao Inter Tight a direita, regua `border-b border-rule` entre itens. O 6o item sai do checklist e vira `<aside>` P.S. com moldura `bg-elevated border border-rule` e eyebrow mono. Um micro-CTA `hidden` por default aparece com `clipPath reveal` GSAP apos o primeiro check. Zero form, zero fetch, zero persistencia — e autoteste visual puro.

**Codigo de referencia:**

Diff alvo em `site/src/config.ts` (bloco PARAQUEM, linhas 95-123 atuais):

```ts
// ANTES (linhas 95-123)
// Para Quem É (6 perfis)
PARAQUEM_KICKER: 'PERFIL DE QUEM VAI',
PARAQUEM_HEADLINE: 'Se algum desses é você, o intensivo é pra você.',
PARAQUEM: [
  { title: 'Empresários e empreendedores', description: 'Que querem criar ferramentas internas, automatizar processos ou lançar um produto digital sem depender de dev.' },
  { title: 'Profissionais liberais e consultores', description: 'Que querem transformar seu conhecimento de nicho em SaaS com receita recorrente.' },
  { title: 'Criadores e influenciadores', description: 'Que têm audiência e querem criar uma ferramenta própria para monetizar além do conteúdo.' },
  { title: 'Founders e futuros founders', description: 'Que têm ideia de startup mas travam na parte técnica. Valide, lance e itere sem CTO.' },
  { title: 'Gestores e analistas', description: 'Que vivem em planilhas e processos manuais e querem construir ferramentas internas.' },
  { title: 'Você não precisa saber programar', description: 'O pré-requisito é ter uma ideia de problema que vale resolver. A IA cuida do resto.' },
],
```

```ts
// DEPOIS
// Para Quem É (5 perfis + P.S. outlier + micro-CTA)
PARAQUEM_KICKER: 'PERFIL DE QUEM VAI',
PARAQUEM_HEADLINE: 'Marque os que se aplicam a você.',
PARAQUEM_SUB: 'Autoteste. Marque quem você é. Nenhum dado é enviado.',
PARAQUEM: [
  { title: 'Empresários e empreendedores', description: 'Que querem criar ferramentas internas, automatizar processos ou lançar um produto digital sem depender de dev.' },
  { title: 'Profissionais liberais e consultores', description: 'Que querem transformar seu conhecimento de nicho em SaaS com receita recorrente.' },
  { title: 'Criadores e influenciadores', description: 'Que têm audiência e querem criar uma ferramenta própria para monetizar além do conteúdo.' },
  { title: 'Founders e futuros founders', description: 'Que têm ideia de startup mas travam na parte técnica. Valide, lance e itere sem CTO.' },
  { title: 'Gestores e analistas', description: 'Que vivem em planilhas e processos manuais e querem construir ferramentas internas.' },
],
PARAQUEM_FOOTNOTE: {
  label: 'VOCÊ NÃO PRECISA SABER PROGRAMAR',
  body: 'O pré-requisito é ter uma ideia de problema que vale resolver. A IA cuida do resto.',
},
PARAQUEM_CTA_TEXT: 'Se você se reconheceu em algum desses, entra no grupo e pega a oferta única de R$ 27.',
PARAQUEM_CTA_BUTTON: 'ENTRAR NO GRUPO',
```

Reescrita completa de `site/src/components/sections/ParaQuem.astro` (substitui integralmente o arquivo atual, 24 linhas, por ~90 linhas markup + ~70 linhas script):

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
          class:list={[
            'paraquem-item w-full grid grid-cols-[auto_1fr] gap-5 sm:gap-6 items-start text-left',
            'py-6 sm:py-7',
            i < CONFIG.PARAQUEM.length - 1 ? 'border-b border-rule' : '',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4',
            'transition-colors duration-200 hover:bg-page/40',
          ]}
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
        <span class="text-accent">&rarr;</span> {CONFIG.PARAQUEM_CTA_TEXT}
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

Notas de implementacao:

- Usar `class:list` (idiomatico Astro) no lugar de `.join(' ')`. A PRD mostra `.join(' ')` por legibilidade; na implementacao final trocar para `class:list` array.
- Entity `&rarr;` em vez de caractere Unicode `→` no markup Astro para evitar issues de encoding no build output.
- Zero travessao longo (`—`) em copy: o PRD ja respeita essa regra (usar ponto, virgula, dois pontos).
- Nao adicionar novas classes em `src/styles/global.css`. Todas as classes `.paraquem-*` servem apenas como **hooks JS/seletor** e nao precisam de declaracao CSS — o estilo vem de utilities Tailwind aplicadas inline.
- O `<script>` do componente e processado pelo Vite de Astro (import relativo de `gsap` funciona via tree-shaking). Nao precisa de `is:inline` nem de registrar em `astro.config.mjs`.
- Se o build reclamar de `import gsap from 'gsap'` dentro do `<script>` por conta de ordem de bundle em paginas com mais de uma ocorrencia de GSAP, manter a ocorrencia atual (componente isolado — cada script Astro gera seu proprio bundle entry e GSAP e de-dup pelo Vite).

**Criterios de aceite:**

1. QUANDO rodo `npx astro build` na raiz de `site/`, ENTAO passa sem warnings e sem erros, e `dist/index.html` contem `<section id="para-quem-e">` com exatamente 5 `<button data-paraquem-check>`, 1 `<aside class="paraquem-footnote">` e 1 `<div class="paraquem-cta hidden">`.
2. QUANDO rodo `npx astro check` na raiz de `site/`, ENTAO reporta 0 errors e 0 warnings no arquivo `ParaQuem.astro`.
3. QUANDO abro a pagina no browser em 1440px (desktop), ENTAO a secao ParaQuem renderiza em coluna unica `max-w-3xl`, com os 5 itens separados por linhas 1px `bg-rule`, P.S. com moldura `bg-elevated border border-rule` abaixo, e CTA `hidden` (nao visivel).
4. QUANDO abro a pagina em 390px (mobile), ENTAO a secao permanece em coluna unica (sem grid responsivo), padding reduzido para `py-6`, titulo Fraunces 24px (`text-2xl`), descricao Inter Tight 16px.
5. QUANDO clico em qualquer item do checklist, ENTAO (a) `aria-pressed="true"` e setado no botao, (b) o check muda para `bg-accent border-accent`, (c) o svg `✓` aparece com `opacity: 1`, (d) o row NAO ganha background de "selected".
6. QUANDO clico de novo no mesmo item, ENTAO desmarca: `aria-pressed="false"`, check volta para `border-rule bg-elevated`, icone some (`opacity: 0`).
7. QUANDO clico no PRIMEIRO item da sessao (qualquer que seja), ENTAO o bloco `.paraquem-cta` remove `hidden`, remove `aria-hidden`, e aparece com transicao GSAP `clipPath: inset(100% 0 0 0) → inset(0 0 0 0)` + `opacity 0 → 1` em 320ms `power3.out`.
8. QUANDO desmarco todos os itens apos o CTA ter aparecido, ENTAO o CTA permanece visivel (nao some).
9. QUANDO clico no botao "ENTRAR NO GRUPO" dentro do `.paraquem-cta`, ENTAO o modal global (`[data-open-modal]` delegator em `src/scripts/modal-trigger.ts`) abre — zero codigo adicional de modal trigger dentro desta secao.
10. QUANDO uso teclado (Tab), ENTAO o foco circula entre os 5 botoes do checklist na ordem visual, cada um mostra outline accent 2px com offset 4px (focus-visible).
11. QUANDO aciono Space ou Enter com foco em um botao, ENTAO alterna o check (mesmo comportamento do click).
12. QUANDO role a pagina para dentro da secao (trigger `#para-quem-e` em `top 75%`), ENTAO cada `.paraquem-item` + `.paraquem-footnote` aparece com `opacity 0 → 1` + `y 16 → 0` em 400ms com stagger 60ms, ease `power3.out`, apenas 1 vez (nao reverte no scroll-up).
13. QUANDO ativo `prefers-reduced-motion: reduce` no sistema, ENTAO a secao renderiza estatica (sem entrance), toggle do check e instantaneo (sem transition), e o CTA aparece via `display: block` sem clipPath.
14. QUANDO inspeciono Network/DevTools ao clicar em qualquer item, ENTAO zero request HTTP e feita (nem fetch de webhook, nem evento de analytics).
15. QUANDO leitor de tela (VoiceOver / NVDA) chega em um botao, ENTAO anuncia titulo do perfil + "not pressed" (ou "pressed" apos toggle), seguido da descricao.
16. QUANDO `CONFIG.PARAQUEM` e lido em runtime, ENTAO tem exatamente 5 objetos (nao 6). QUANDO `CONFIG.PARAQUEM_HEADLINE` e lido, ENTAO retorna `'Marque os que se aplicam a você.'`. QUANDO `CONFIG.PARAQUEM_FOOTNOTE` e lido, ENTAO retorna `{ label: 'VOCÊ NÃO PRECISA SABER PROGRAMAR', body: '...' }`.

**Comando de validacao:**

```bash
cd site && npx astro check && npx astro build
```

Smoke manual adicional (exigido para marcar a story como done):

```bash
# Terminal 1
cd site && npx astro dev

# Browser (Safari/Chrome em DevTools com device emulation):
# 1. Navegar para http://localhost:4321/#para-quem-e em 320px, 390px, 768px, 1024px, 1440px
# 2. Em cada viewport: validar coluna unica, padding esperado, tipografia correta
# 3. Em 390px: click em 3 itens aleatorios → confirmar aria-pressed muda + check muda + CTA aparece no 1o click
# 4. Teclado: Tab circula, Space/Enter togam, focus-visible ring accent visivel em todos os 5 botoes
# 5. Reduced motion: Safari → Develop > Experimental Features > prefers-reduced-motion: reduce → reload → confirmar estatico
# 6. VoiceOver (Cmd+F5): Tab pelos botoes → anuncia "Empresarios e empreendedores, button, not pressed" e apos click "pressed"
# 7. Network tab: click em itens → zero requests
# 8. Click no "ENTRAR NO GRUPO" do CTA → modal abre (reutiliza delegator global)
```

---

## Checklist de a11y

- [ ] `<section id="para-quem-e">` com landmark implicito
- [ ] H2 preservado, H3 por perfil (hierarquia mantida)
- [ ] `<aside class="paraquem-footnote">` para conteudo auxiliar do P.S.
- [ ] `role="group"` + `aria-label="Autoteste de perfil"` no container dos 5 botoes
- [ ] Cada botao com `type="button"` explicito e `aria-pressed="false"` inicial
- [ ] Check icon (`<span class="paraquem-check">`) marcado `aria-hidden="true"` (estado comunicado via `aria-pressed`)
- [ ] Focus-visible: `outline 2px accent` com `outline-offset: 4px` em toda a row
- [ ] Keyboard: Tab circula, Space/Enter togam (heranca nativa de `<button>`)
- [ ] Touch: area >= 44x44px garantida por `py-6` + tipografia
- [ ] Contraste WCAG AA:
  - [ ] `ink-primary` sobre `bg-surface` = 15.8:1 ✓
  - [ ] `ink-secondary` sobre `bg-surface` = 9.4:1 ✓
  - [ ] `accent` no eyebrow mono `text-xs` = 3.7:1 — aceitavel como decorativo (mesma caveat documentada em UseCases Bento §5.5). Fallback documentado: trocar para `accent-deep` (6.1:1) se auditor flaguear.
  - [ ] Icone `✓` branco sobre `bg-accent` = 4.6:1 ✓ (icone nao-texto)
- [ ] `prefers-reduced-motion`: desliga entrance GSAP, desliga transicao de toggle, CTA sem clipPath reveal
- [ ] Nenhum `<form>`, `<input>`, `<submit>` — e autoteste visual, nao formulario
- [ ] Subheadline "Autoteste. Marque quem você é. Nenhum dado é enviado." (via `PARAQUEM_SUB`) desambigua visualmente

## Checklist de analytics (3 pilares)

- [ ] GA4 com `PUBLIC_GA_ID` condicional — **ja resolvido no `Base.astro`** via plano mae. Nao tocar.
- [ ] Meta Pixel com `PUBLIC_META_PIXEL_ID` condicional — **ja resolvido no `Base.astro`**. Nao tocar.
- [ ] UTM capture — **ja resolvido em `site/src/lib/utm.ts`**. Nao tocar.
- [ ] Evento `Lead` no submit do modal com `event_id` UUID compartilhado — **ja resolvido no Modal island** via plano mae. Nao tocar.
- [ ] Evento `click_cta` no botao "ENTRAR NO GRUPO" — reusa o mesmo handler do `[data-open-modal]` global delegator (`cta_location: 'para-quem-cta'`). **Verificar se o delegator ja captura cta_location automatico**; se nao captura, adicionar `data-cta-location="para-quem-cta"` no `<button data-open-modal>` e ajustar delegator em outra story (fora deste escopo).
- [ ] Evento `click_paraquem_check` no toggle de cada item — **EXPLICITAMENTE fora de escopo** por §9 do PRD (nice-to-have, fica pra 2a iteracao).
- [ ] Webhook fetch fire-and-forget no submit do modal — **ja resolvido no Modal island**. Nao tocar.
- [ ] Zero request HTTP ao clicar em um item do checklist (confirmar em Network tab).

## Checklist de SEO (13 itens do CLAUDE.md global)

Esta secao nao e uma landing nova. **Todos os 13 itens ja estao resolvidos** nas Stories 03 e 11 do plano mae (`docs/plans/intensivo-claude-code.md`, status `done`). Re-validacao completa acontece no audit final (`landing-page-audit`, re-execucao da Story 12 do plano mae). Nenhum item abaixo exige acao nesta story:

- [x] favicon.ico + favicon.png (public/)
- [x] robots.txt com crawlers LLM (GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended)
- [x] llms.txt especifico do produto
- [x] OG image 1200x630
- [x] meta title < 60 chars, keyword-first
- [x] meta description < 160 chars
- [x] meta keywords, author, robots
- [x] viewport, lang="pt-BR", charset UTF-8
- [x] link canonical com dominio final
- [x] meta theme-color batendo com manifest
- [x] link manifest + public/manifest.webmanifest
- [x] link apple-touch-icon
- [x] JSON-LD: Organization + WebSite + tipo especifico (Course / Event)

**Acao desta story:** confirmar que a alteracao de `PARAQUEM_HEADLINE` nao introduz nenhuma quebra em strings usadas em `<title>` / `<meta description>` (nao introduz — essas strings sao chaves separadas em `CONFIG`).

## Checklist de performance

- [ ] Lighthouse mobile (375px, Slow 4G): Performance >= 90, a11y >= 95, best practices >= 95, SEO >= 95 — re-validar no audit final apos essa story.
- [ ] LCP <= 2.5s — H2 "Marque os que se aplicam a você." e possivel LCP candidate se a secao ficar acima da dobra em viewports longos. Confirmar no audit.
- [ ] CLS <= 0.1 — risco de CLS no entrance GSAP (`y: 16 → 0`). Mitigado por `gsap.set` estatico antes do `gsap.to` + `onComplete: clearProps`. Se aparecer CLS > 0.1 no Lighthouse, trocar entrance por `opacity` apenas (sem translate).
- [ ] INP <= 200ms — o toggle handler e ~10 linhas de DOM mutation + 1 condicional. Sem risco.
- [ ] Imagens: nenhuma imagem adicionada nesta story. Zero impacto.
- [ ] Fonts: Fraunces + Inter Tight + JetBrains Mono ja carregadas no `Base.astro` com `display=swap` + preconnect. Zero adicao.
- [ ] CSS nao-critico inline: zero (tudo via utilities Tailwind 4 gerado pelo Vite).
- [ ] JS island: **ZERO React island nesta secao**. O `<script>` Astro e bundle vanilla com import de GSAP (ja carregado por outras secoes — dedup via Vite).

## Checklist de motion hygiene

- [ ] GSAP para entrance (scroll-driven, `ScrollTrigger`, `top 75%`, `toggleActions: 'play none none none'`) ✓
- [ ] CSS para transicoes curtas (`transition-colors duration-200` no check e row) ✓
- [ ] GSAP para clipPath reveal do CTA (disparado em event handler, nao scroll-driven) ✓
- [ ] Uma lib por papel — zero `motion` v12 aqui (nao ha microinteracao React porque nao ha React island)
- [ ] `framer-motion` ausente do package.json (confirmado — regra global)
- [ ] `ScrollTrigger.refresh()` chamado apos `document.fonts.ready` resolver ✓
- [ ] `prefers-reduced-motion`: early return em entrance + condicional no reveal do CTA ✓
- [ ] `onComplete: clearProps: 'opacity,y'` para evitar CLS residual apos entrance ✓
- [ ] Sem FLOP (flash of unstyled content): os elementos entram com `opacity: 0` apenas apos `gsap.set` — para evitar flash ANTES do `gsap.set`, o CSS default dos elementos e `opacity: 1`. Trade-off documentado: se o JS falhar por algum motivo, a secao aparece estatica (fail-open, correto).
- [ ] Nao usa `from: ...` do GSAP (reliable em Astro mas pode FLOP se o JS iniciar apos render). Usa `gsap.set` + `gsap.to` explicitos ✓
- [ ] Toggle do check e instantaneo via CSS transition, nao via GSAP (correto — GSAP seria overkill pra troca de 2 classes)

## Checklist de SVG & ilustracoes

**Nao aplicavel a esta story.** A unica SVG usada e o icone `✓` do Lucide `Check` (`<polyline points="20 6 9 17 4 12">`), inline de 1 path, 4 coordenadas. Sem animacao `drawSVG`, sem gradiente, sem filter, sem `<style>`, sem SMIL. `aria-hidden="true"` no wrapper `<span class="paraquem-check">` torna o SVG decorativo por heranca. Nenhuma acao adicional exigida.

## Checklist de dependency hygiene

- [ ] `package.json` nao ganha nova dependencia
- [ ] `gsap` + `gsap/ScrollTrigger` ja instalados (plano mae)
- [ ] Zero `framer-motion`
- [ ] Zero `motion` (v12) — nao necessario aqui
- [ ] Zero `tailwindcss-animate`
- [ ] Zero `@gsap/react` (nao ha React island nesta secao)
- [ ] `npx astro build` termina sem warnings

## Riscos tecnicos

| Risco | Probabilidade | Impacto | Mitigacao |
|---|---|---|---|
| Usuario interpreta click-to-check como formulario e espera submit/confirmacao | Media | Alto (confusao de UX, abandono) | Subheadline explicita `PARAQUEM_SUB` "Autoteste. Marque quem você é. Nenhum dado é enviado." + zero `<form>`/`<input>`/`<submit>` real (§1 do PRD) |
| CLS > 0.1 por causa do `y: 16 → 0` no entrance | Baixa | Medio (Lighthouse perf drop) | `gsap.set` estatico antes do `gsap.to` + `clearProps` no `onComplete`. Fallback: entrance apenas `opacity` (remover `y`) se audit reprovar. |
| Contraste `accent` sobre `bg-surface` no eyebrow P.S. falha AA (3.7:1) | Certa (ja documentada) | Baixo (decorativo, mesma caveat do UseCases Bento) | Plano B pronto: trocar pra `accent-deep` (6.1:1) em 1 linha de diff se auditor externo flaguear |
| `gsap/ScrollTrigger` duplicado entre multiplos `<script>` Astro (outros componentes) causa overhead | Muito baixa | Muito baixo | Vite dedupa automaticamente. Se aparecer no bundle analyzer, centralizar ScrollTrigger registration em `src/scripts/gsap-plugins.ts` e importar nos componentes (fora de escopo desta story) |
| Entrance roda antes das fontes carregarem e dispara layout shift | Baixa | Medio | Handler dentro de `document.fonts.ready.then(...)` + `ScrollTrigger.refresh()` apos setup (§5.4 do PRD) |
| `hidden` do Tailwind + GSAP `clipPath` conflitam (GSAP anima um elemento `display: none`) | Muito baixa | Medio | Primeiro `classList.remove('hidden')` + `removeAttribute('aria-hidden')`, DEPOIS `gsap.fromTo`. Ordem ja correta no codigo de referencia §5.4 do PRD |
| Focus-visible ring `outline-offset: 4px` vaza fora do container em mobile estreito | Baixa | Baixo | Container `max-w-3xl mx-auto px-4 sm:px-6 lg:px-8` tem padding horizontal suficiente pra ring. Confirmar em 320px no audit. |
| Copy da P.S. ou do CTA extrapola 1 linha em viewports muito estreitos (320px) e quebra a composicao | Media | Baixo | `leading-relaxed` + `max-w-prose` na descricao + eyebrow `text-xs` mono aguentam quebra visualmente. QA manual em 320px obrigatorio. |

## Deploy

Nao ha deploy nesta story. O fluxo completo permanece:

1. Implementar Story 01
2. Rodar `npx astro build` e `npx astro check` (criterios 1-2)
3. Smoke manual em 320/390/768/1024/1440 + teclado + reduced motion + VoiceOver (criterios 3-16)
4. Re-rodar **Story 12 do plano mae** (`landing-page-audit`) como gate. O audit produz `docs/intensivo-claude-code-audit.md` atualizado.
5. Merge em `main` via GitHub. Vercel Git Integration dispara build automatico. **Proibido `npx vercel --prod` manual.**
6. Pos-deploy: rodar Lighthouse no dominio de producao (mobile 375px Slow 4G), confirmar Perf >= 90 / a11y >= 95 / best-practices >= 95 / SEO >= 95.
7. Pos-deploy: rodar Rich Results Test em `https://search.google.com/test/rich-results` na URL final (JSON-LD ja existente nao mudou, mas re-validar nao custa).
8. DNS: nao aplicavel (dominio ja resolvido no plano mae).
