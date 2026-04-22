---
title: Plan — Timeline vertical v1 (Railway/Trilho)
slug: landing-timeline-v1-vertical
prd: docs/prds/landing-timeline-v1-vertical.md
created: 2026-04-22
status: draft
target_folder: site-v2
version: 2
base_path: /lpv2
deploy_topology: v2-existente
---

# Plano de Implementação — Timeline vertical v1 (Railway)

## Resumo

Refactor de 1 seção (`Timeline.astro`) dentro de `site-v2/` já em produção. Layout horizontal (4 colunas com trilho superior) passa a vertical (trilho esquerdo contínuo, nodes por bloco, hierarquia tipográfica editorial). Animação via `IntersectionObserver` nativo, sem GSAP, sem dependências novas. **2 stories P totalizando ~30 min estimados.**

## Deploy topology

- **Target folder:** `site-v2/`
- **Versão:** v2 (já em produção)
- **Subpath:** `/lpv2`
- **Projeto Vercel:** `intensivo-claude-code-v2` (já vinculado)
- **Rewrite no `vercel.json` raiz:** já configurado em produção (commits `b5fd638`, `1ec7c38`, `c68f35e`, `30a3931`). **Nada a mudar.**
- **Playbook Vercel:** `~/.claude/skills/landing-page-create-plan/references/vercel-multiversion-setup.md` (apenas referência; não executar).
- **Decisão arquitetural:** já documentada no PRD-mãe e commits anteriores. Sem nova ADR necessária.

## Ordem canônica de landing — DESVIOS JUSTIFICADOS

Este é um refactor pontual, não uma landing nova. Desvios:

| Story canônica | Aplica? | Justificativa do desvio |
|---|---|---|
| 0. Setup Vercel multiversion | NÃO | Já em produção (v2 live). |
| 1. Scaffold Astro | NÃO | `site-v2/` já existe e builda. |
| 2. Tokens Tailwind | NÃO | Tokens em `site-v2/tailwind.config.mjs` inalterados (herda da Fase 0 do PRD-mãe). |
| 3. Layout Base | NÃO | `Base.astro` inalterado. |
| 4. Config centralizado | NÃO | `config.ts` inalterado — data shape `TIMELINE_BLOCKS` preservada. |
| 5. Componentes de seção | **PARCIAL** | Apenas `Timeline.astro` é refatorado (Story 01 deste plano). |
| 6. Modal de captura | NÃO | `CaptureModal.tsx` inalterado. |
| 7. Assets públicos | NÃO | `public/` inalterado. |
| 8. JSON-LD | NÃO | Schema.org `Event` existente mantido. |
| 9. Audit | **SIM, escopo reduzido** | Story 02 deste plano (audit visual focado em Timeline + regressão nas seções vizinhas). |
| 10. Verificação pré-deploy (13 itens SEO) | NÃO | Todos os 13 já validados pelo PRD `intensivo-claude-code-ajustes-pre-deploy.md`. Audit desta story só re-valida Lighthouse mobile da página `/lpv2/`. |

Resultado: **2 stories ativas** (01 Refactor Timeline, 02 Audit visual).

## Dependências npm

**Zero adições.** Confirmar ao fim:
- `framer-motion` NÃO existe no `package.json` (usa CSS + IntersectionObserver)
- Sem `gsap`, sem `motion` na Timeline (decisão explícita do PRD §2)
- Sem `lucide-react` adicional

## Stories embutidas

---

### Story 01 — Refactor Timeline.astro para layout vertical Railway

- **Complexidade:** P (< 80 linhas alteradas, escopo cirúrgico)
- **Modelo sugerido:** `implementer-haiku`
- **Depende de:** nada
- **Arquivos a modificar:** `site-v2/src/components/sections/Timeline.astro` (rewrite completo, mesmo caminho)
- **Arquivos a criar:** nenhum
- **Patterns a seguir:**
  - PRD §4 (`docs/prds/landing-timeline-v1-vertical.md`) — spec visual e regras de animação
  - `~/.claude/skills/landing-page-prd/references/landing-page-pattern.md` — uso de tokens Tailwind

**Contexto:** a Timeline atual é horizontal e responde mal em telas < 1024px. Substituir pela versão vertical Railway mantendo copy e data shape inalterados. Animação via `IntersectionObserver` nativo (sem GSAP/motion). Respeitar `prefers-reduced-motion` e ter fallback no-JS.

**Código de referência (rewrite completo — `Timeline.astro`):**

```astro
---
import { CONFIG } from '../../config';
---
<section
  class="relative border-t border-rule py-24 sm:py-36 bg-page"
  aria-labelledby="timeline-headline"
>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

    <p class="font-mono text-xs tracking-widest text-accent uppercase mb-6">
      {CONFIG.TIMELINE_KICKER}
    </p>
    <h2
      id="timeline-headline"
      class="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink-primary mb-6"
    >
      {CONFIG.TIMELINE_HEADLINE}
    </h2>
    <p class="font-sans text-ink-secondary text-lg mb-16 max-w-2xl">
      {CONFIG.TIMELINE_SUBHEADLINE}
    </p>

    <ol
      class="timeline-rail relative border-l border-rule ml-1.5 md:ml-2"
      data-timeline
    >
      {CONFIG.TIMELINE_BLOCKS.map((t, i) => (
        <li
          class="timeline-item relative pl-8 md:pl-12 pb-10 md:pb-14 last:pb-0"
          data-index={i}
        >
          <span
            aria-hidden="true"
            class="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-accent ring-4 ring-page -translate-x-1/2"
          ></span>
          <span class="font-mono text-xs tracking-widest text-accent uppercase block mb-3">
            {t.time}
          </span>
          <h3 class="font-display text-[clamp(1.375rem,3vw,1.875rem)] leading-tight text-ink-primary mb-2">
            {t.title}
          </h3>
          <p class="font-sans text-base md:text-lg leading-relaxed text-ink-secondary max-w-2xl">
            {t.description}
          </p>
        </li>
      ))}
    </ol>

    <p class="mt-12 font-mono text-xs tracking-widest text-ink-muted uppercase">
      {CONFIG.TIMELINE_FOOTER}
    </p>

  </div>
</section>

<style>
  /* Estado inicial so quando JS ativa o observer */
  .timeline-rail.is-armed .timeline-item {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
                transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .timeline-rail.is-armed .timeline-item.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .timeline-rail.is-armed .timeline-item {
      transform: none !important;
      transition-duration: 200ms !important;
    }
  }
</style>

<script is:inline>
  (() => {
    if (typeof window === 'undefined') return;
    const rail = document.querySelector('[data-timeline]');
    if (!rail) return;
    // Arma o estado inicial (opacity 0) apenas quando JS roda.
    // Sem JS, a secao fica visivel por default (sem classe is-armed).
    rail.classList.add('is-armed');

    const items = rail.querySelectorAll('.timeline-item');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const reveal = (el) => {
      const idx = Number(el.dataset.index || 0);
      const delay = reduced ? 0 : idx * 120;
      window.setTimeout(() => el.classList.add('is-visible'), delay);
    };

    if (!('IntersectionObserver' in window)) {
      items.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.1 }
    );

    items.forEach((el) => io.observe(el));
  })();
</script>
```

**Critérios de aceite:**

1. QUANDO `npm run build` roda em `site-v2/`, ENTÃO conclui sem warnings novos (comparar com build pré-refactor).
2. QUANDO renderizado em 360px de largura, ENTÃO a Timeline aparece vertical, sem overflow horizontal, com trilho à esquerda e nodes alinhados na linha do trilho.
3. QUANDO renderizado em 768px e 1280px, ENTÃO o layout permanece vertical (não volta a ser horizontal).
4. QUANDO o usuário rola até a seção, ENTÃO cada bloco entra em sequência com fade-up de 500ms e stagger de 120ms, um após o outro, de cima pra baixo.
5. QUANDO `prefers-reduced-motion: reduce` está ativo (DevTools > Rendering > Emulate), ENTÃO os blocos aparecem apenas com fade (sem translate), em 200ms.
6. QUANDO o JavaScript está desativado (DevTools > Disable JavaScript), ENTÃO a seção fica totalmente visível (sem `opacity: 0` preso).
7. QUANDO inspecionado o DOM, ENTÃO o `<h2>` da headline tem `id="timeline-headline"` e a `<section>` tem `aria-labelledby="timeline-headline"`.
8. QUANDO `CONFIG.TIMELINE_*` é lido, ENTÃO copy e data shape estão inalterados (mesmas 4 entradas em `TIMELINE_BLOCKS`, mesmo `TIMELINE_FOOTER`).
9. QUANDO passado o axe DevTools (ou equivalente) na seção, ENTÃO contraste AA passa em título e descrição; node do accent é marcado como decorativo (`aria-hidden="true"`).

**Comando de validação:**

```bash
cd "/Users/mateusdias/Documents/00 - Projetos/intensivo-claude-code/site-v2" && npm run build
```

---

### Story 02 — Audit visual pós-refactor Timeline

- **Complexidade:** P (manual, checklist curto, sem código)
- **Modelo sugerido:** `implementer-haiku`
- **Depende de:** Story 01
- **Arquivos a criar:** `docs/audits/landing-timeline-v1-vertical.md` (relatório do audit)
- **Arquivos a modificar:** nenhum
- **Patterns a seguir:**
  - `~/.claude/skills/landing-page-audit/` (se disponível) — critérios de auditoria
  - Screenshots em 3 larguras, DevTools reduced-motion, DevTools no-JS

**Contexto:** validar que o refactor não regressou nada nas seções vizinhas (acima: Benefits ou o que estiver no `index.astro`; abaixo: Autoridade/FAQ) e que a nova Timeline cumpre todos os critérios de aceite da Story 01 em produção (preview Vercel). Produz relatório `.md` com screenshots referenciados.

**Passos:**

1. **Build local:** `cd site-v2 && npm run build && npm run preview` (ou `npx astro preview`).
2. **Screenshots em 3 larguras** (DevTools responsive): 360px, 768px, 1280px. Salvar em `docs/audits/screenshots/timeline-v1/` com nomes `timeline-360.png`, `timeline-768.png`, `timeline-1280.png`.
3. **Reduced motion:** DevTools > Rendering > Emulate CSS > `prefers-reduced-motion: reduce`. Scroll pela seção. Validar que blocos aparecem em fade simples (sem translate). Screenshot `timeline-reduced-motion.png`.
4. **No-JS:** DevTools > Settings > Debugger > Disable JavaScript. Reload. Validar que a seção está 100% visível (sem `opacity: 0`). Screenshot `timeline-no-js.png`.
5. **Contraste:** axe DevTools ou Lighthouse a11y report na home de `/lpv2/`. Capturar score e copiar issues que mencionem Timeline (se houver).
6. **Lighthouse mobile** (Throttling: Slow 4G, Device: Mobile) na preview build. Capturar Performance/A11y/Best Practices/SEO. Comparar com valores anteriores (registrados em `docs/logs/squad-dev/2026-04-22.md` ou no último audit).
7. **Diff visual das seções vizinhas:** screenshots antes (na main) e depois (na feat) de Benefits (acima) e Autoridade/FAQ (abaixo). Confirmar zero regressão.
8. **Preencher relatório** em `docs/audits/landing-timeline-v1-vertical.md` com a estrutura abaixo.

**Template do relatório (`docs/audits/landing-timeline-v1-vertical.md`):**

```markdown
---
title: Audit — Timeline v1 vertical
date: YYYY-MM-DD
plan: docs/plans/landing-timeline-v1-vertical.md
prd: docs/prds/landing-timeline-v1-vertical.md
status: [clear | issues-found]
---

# Audit: Timeline v1 vertical

## Resumo
[2-3 frases: passou? regressões? lighthouse delta?]

## Evidências
- 360px: ![](screenshots/timeline-v1/timeline-360.png)
- 768px: ![](screenshots/timeline-v1/timeline-768.png)
- 1280px: ![](screenshots/timeline-v1/timeline-1280.png)
- Reduced motion: ![](screenshots/timeline-v1/timeline-reduced-motion.png)
- No JS: ![](screenshots/timeline-v1/timeline-no-js.png)

## Lighthouse mobile (delta)
| Métrica | Antes | Depois | Delta |
|---|---|---|---|
| Performance | | | |
| Accessibility | | | |
| Best Practices | | | |
| SEO | | | |

## A11y (axe/Lighthouse)
- [ ] Contraste AA em título
- [ ] Contraste AA em descrição
- [ ] Landmark `<section>` com `aria-labelledby`
- [ ] Node decorativo com `aria-hidden="true"`

## Regressões nas seções vizinhas
- Benefits (acima): [OK | regredi — descrever]
- Autoridade/FAQ (abaixo): [OK | regredi — descrever]

## Bloqueadores
[lista ou "nenhum"]

## Decisão
[aprovar merge | pedir ajustes]
```

**Critérios de aceite:**

1. QUANDO o relatório é preenchido, ENTÃO todos os 5 screenshots existem no caminho `docs/audits/screenshots/timeline-v1/`.
2. QUANDO o Lighthouse mobile é capturado, ENTÃO Performance >= 90 e A11y >= 90 (match com patamar atual).
3. QUANDO o axe roda na seção, ENTÃO não há issue crítica nem séria ligada à Timeline.
4. QUANDO as seções vizinhas são comparadas, ENTÃO o diff visual é nulo (só a Timeline mudou).
5. QUANDO o relatório finaliza, ENTÃO `status: clear` e decisão = `aprovar merge`. Se não, listar bloqueadores.

**Comando de validação:**

```bash
cd "/Users/mateusdias/Documents/00 - Projetos/intensivo-claude-code/site-v2" && npm run build && npx astro preview --port 4321
# Abrir http://localhost:4321/lpv2/ e seguir passos 2-8 acima.
```

---

## Checklist de a11y (focado no que esta story toca)

- [x] Seção tem landmark semântico `<section>` com `aria-labelledby` apontando pro `<h2>`
- [x] Node decorativo (circulinho accent) marcado com `aria-hidden="true"`
- [x] Contraste AA em `ink-primary` sobre `bg-page` (ratio ≈ 18:1, ok)
- [x] Contraste AA em `ink-secondary` sobre `bg-page` (ratio ≈ 7:1, ok)
- [x] `prefers-reduced-motion` respeitado (CSS media query)
- [x] Nenhum elemento interativo na Timeline (não exige focus-visible)
- [x] Estrutura `<ol>` semanticamente correta para sequência temporal

## Checklist de analytics (fora do escopo desta story)

- [x] Timeline não dispara eventos. Nenhum listener. Sem impacto em GA4/Meta Pixel/UTM/webhook.

## Checklist de SEO (fora do escopo; todos os 13 itens já validados na landing v2)

- [x] Nada a revalidar. Audit só confirma Lighthouse delta.

## Checklist de performance

- [ ] Build size de `Timeline.astro` não cresce significativamente (< 2KB HTML adicional)
- [ ] Zero novas dependências no bundle JS (IntersectionObserver é nativo)
- [ ] Animação via CSS transition (GPU-friendly, não dispara layout)
- [ ] Lighthouse mobile mantém Performance >= 90 na preview

## Checklist de motion hygiene

- [x] Uma lib por papel: aqui é **CSS + IntersectionObserver nativo** (decisão explícita). Zero GSAP, zero motion v12 nesta seção.
- [x] `framer-motion` PROIBIDO (não está no package.json da v2; confirmar no audit)
- [x] `prefers-reduced-motion` respeitado via `@media`
- [x] Sem FLOP: fallback sem JS deixa seção visível

## Checklist de SVG & ilustrações

- N/A. Esta story não adiciona ilustração. Node circular é `<span>` Tailwind puro, não SVG.

## Checklist de dependency hygiene

- [ ] `package.json` de `site-v2/` NÃO ganha entradas novas (diff do `package.json` deve ser vazio)
- [ ] `package-lock.json` não muda
- [ ] Build final `npm run build` sem warnings novos

## Riscos técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| IntersectionObserver não suportado em navegador antigo | Muito baixa | Blocos não revelam, mas ficam visíveis (fallback cobre) | Fallback explícito no script: se não houver `IntersectionObserver`, chama `reveal` em todos os itens imediatamente. |
| FLOP: bloco pisca `opacity: 0` antes do JS carregar | Baixa | Flash visual ruim | Classe `is-armed` é adicionada via JS antes do observer; HTML estático nasce sem a classe, portanto sem `opacity: 0`. Validado no Critério 6 da Story 01. |
| `ring-4 ring-page` não renderiza o "corte" visual do trilho pelo node | Baixa | Node visualmente "flutua" em vez de ancorar no trilho | Se acontecer, substituir `ring-4 ring-page` por `box-shadow: 0 0 0 4px var(page)` inline. Fix de 1 linha. |
| Stagger de 120ms fica lento se usuário rola muito rápido | Muito baixa | 4 blocos × 120ms = 480ms de atraso máximo | Aceitável (< meio segundo). Não mitigar. |
| Contraste do node accent sobre page cai em monitores ruins | Baixa | Node pouco visível | `#E4572E` sobre `#FBFAF7` = 3.5:1 (ok pra elemento decorativo 12px, não é texto). Aceitável. |

## Deploy

1. Merge de `feat/landing-timeline-v1` em `main` via PR GitHub (Vercel Git Integration dispara build automaticamente).
2. Proibido `npx vercel --prod` manual.
3. Após deploy na preview:
   - Abrir `https://<preview-url>/lpv2/` e rolar até a Timeline
   - Validar animação stagger em produção
   - Rodar Lighthouse mobile na preview
4. Após merge em main:
   - Confirmar deploy de produção em `<dominio>/lpv2/`
   - Re-validar scroll/animação em produção
5. Sem mudança de DNS. Sem Cloudflare MCP.

## Tempo estimado

- Story 01: 15 min (haiku)
- Story 02: 15 min (haiku, manual)
- **Total: ~30 min**

## Próximo passo

```
/expand-stories docs/plans/landing-timeline-v1-vertical.md
```
