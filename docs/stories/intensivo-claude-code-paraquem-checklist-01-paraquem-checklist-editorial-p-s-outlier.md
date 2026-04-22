---
title: Story 01 — ParaQuem · Checklist editorial + P.S. outlier + micro-CTA
slug: intensivo-claude-code-paraquem-checklist-01
plan: docs/plans/intensivo-claude-code-paraquem-checklist.md
prd: docs/prds/intensivo-claude-code-paraquem-checklist.md
complexity: M
model: implementer-sonnet
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-paraquem-checklist]
---

# Story 01 — ParaQuem · Checklist editorial + P.S. outlier + micro-CTA

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
