---
title: Plan — Intensivo Claude Code (Ajustes Pre-Deploy)
slug: intensivo-claude-code-ajustes-pre-deploy
prd: docs/prds/intensivo-claude-code-ajustes-pre-deploy.md
parent_prd: docs/prds/intensivo-claude-code.md
audit_origin: docs/intensivo-claude-code-audit.md
created: 2026-04-22
status: draft
---

# Plano de Implementacao — Intensivo Claude Code (Ajustes Pre-Deploy)

## Resumo

Plano **incremental** de ajustes pre-deploy na landing `intensivo-claude-code` ja implementada. NAO inclui scaffold, tokens ou sections — PRD parent cobre isso. 8 stories total (5 P + 3 M), organizadas em 2 ondas: Onda 1 paraleliza 7 stories (01, 03, 04, 05, 06, 07, 08), Onda 2 roda apenas 02 (validacao end-to-end) apos preview deploy. Tempo estimado real ~60 min em paralelizacao maxima (M mais lento define o gargalo) + 15 min da Onda 2 = **~1h15 para liberar merge**, presumindo gatekeepers externos resolvidos em paralelo.

## Ordem de execucao (desvio justificado do padrao canonico)

Padrao canonico da skill (Scaffold → Tokens → Base → Config → Sections → Modal → Assets → JSON-LD → Audit → Pre-deploy) **nao se aplica** aqui — o projeto ja esta implementado. Substituicao:

### Onda 1 — paralela (7 stories independentes)

| Story | Titulo | Complex. | Modelo | Tempo |
|---|---|---|---|---|
| 01 | Env vars Vercel (Pixel + Webhook) | P | implementer-haiku | 15 min |
| 03 | `react-international-phone` + refactor campo phone | M | implementer-sonnet | 45 min |
| 04 | Script WebP + conversao 19 depoimentos + update config | M | implementer-sonnet | 45 min |
| 05 | Remover `src/pages/lab/` + rebuild | P | implementer-haiku | 15 min |
| 06 | Envolver TopBar em `<header role="banner">` | P | implementer-haiku | 15 min |
| 07 | Honeypot anti-spam no CaptureModal | P | implementer-haiku | 15 min |
| 08 | Security headers em `vercel.json` (CSP + 5) | M | implementer-sonnet | 45 min |

Com dispatcher paralelo real: gargalo da onda = **45 min** (stories M).

### Onda 2 — sequencial, apos preview deploy (1 story)

| Story | Titulo | Complex. | Modelo | Tempo |
|---|---|---|---|---|
| 02 | Validar payload VUKer + eventID Meta/GA4 end-to-end | P | implementer-haiku (validacao manual dirigida) | 15 min |

**Dependencia hard:** Story 02 precisa de **preview deploy** (Vercel Git Integration ou `vercel` CLI bloqueado — precisa ser push pra branch feature).

### Gate implicito entre ondas

Apos Onda 1 finalizar, dev ou squad Dev abre branch / PR que dispara Vercel preview. Story 02 consome URL do preview pra submeter form real, conferir Meta Events Manager + GA4 Realtime + webhook VUKer.

## Dependencias npm (apenas adicoes)

```json
{
  "dependencies": {
    "react-international-phone": "^3"
  },
  "devDependencies": {
    "sharp": "^0.33"
  }
}
```

- `react-international-phone`: mascara telefone multi-pais com dropdown de bandeira (~15 KB gzip). Substitui input simples na Story 03. Justificativa completa no PRD secao 4.2.
- `sharp`: devDep explicita para script de conversao WebP (Story 04). Ja presente transitivamente via Astro image optimization, mas declarar explicito torna o script confiavel em CI e em maquinas com lockfile fresco.

**Nao adicionar:**
- `libphonenumber-js` (overkill, react-international-phone cobre parsing interno)
- `recaptcha` ou `hcaptcha` (honeypot invisivel basta para o volume atual — ver Story 07)
- `framer-motion` (proibido universalmente — usamos motion v12)
- `@gsap/react` (nao neste plan — GSAP atual roda em `.astro` scripts, nao em React islands; se migrar no futuro, adicionar em PR separado)

## Stories embutidas

---

### Story 01 — Popular env vars Vercel (Pixel ID + Webhook URL)
- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** nenhuma
- **Arquivos a criar:** nenhum (operacao de dashboard Vercel)
- **Arquivos a modificar:** `.env.example` (anotar nos comentarios que valor real vive no Vercel — documentacao)
- **Patterns a seguir:** `~/.claude/skills/landing-page-prd/references/analytics-pattern.md` (GA4 + Pixel + Webhook condicionais)

**Contexto:** audit identificou Meta Pixel ID e Webhook URL vazios em `.env.example`, bloqueando disparo de `Lead` pro Pixel e webhook pro CRM VUKer. Valores informados pelo stakeholder: Pixel `310399388108164`; Webhook `https://api-sigma.vuker.com.br/api/webhooks/inbound/9d2cd781-a63f-4a3d-8aea-edd3413b652a`.

**Acao:**
1. No dashboard Vercel do projeto `intensivo-claude-code-landing`, acessar Settings → Environment Variables
2. Criar/atualizar em **Production** e **Preview** (nao Development):
   - `PUBLIC_META_PIXEL_ID` = `310399388108164`
   - `PUBLIC_WEBHOOK_URLS` = `https://api-sigma.vuker.com.br/api/webhooks/inbound/9d2cd781-a63f-4a3d-8aea-edd3413b652a`
3. Confirmar que `PUBLIC_GA_ID` (`G-7CJMYD129G`) e `PUBLIC_REDIRECT_URL` (`https://sndflw.com/i/trV5sqi3n9eSZD0U1Rlx`) ja estao presentes em ambos escopos
4. No repo local, atualizar `.env.example` **apenas com comentario informativo**:

**Codigo de referencia:** arquivo `site/.env.example` atualizado

```env
# GA4 — valor em producao definido no Vercel dashboard (Production + Preview)
PUBLIC_GA_ID=G-7CJMYD129G

# Meta Pixel — valor real vive no Vercel dashboard. Variavel vazia aqui desativa snippet em dev local.
PUBLIC_META_PIXEL_ID=

# Webhook VUKer — valor real vive no Vercel dashboard. Vazia = fire-and-forget skip em dev local.
PUBLIC_WEBHOOK_URLS=

# Redirect pos-submit — Sendflow grupo VIP
PUBLIC_REDIRECT_URL=https://sndflw.com/i/trV5sqi3n9eSZD0U1Rlx
```

**Criterios de aceite:**
1. QUANDO acessar Vercel → Settings → Environment Variables, ENTAO `PUBLIC_META_PIXEL_ID` e `PUBLIC_WEBHOOK_URLS` aparecem com os valores acima em escopo Production **e** Preview
2. QUANDO o proximo deploy rodar, ENTAO `dist/index.html` contem `fbq('init', '310399388108164')` no snippet Meta Pixel
3. QUANDO clicar nos CTAs em ambiente de preview e submeter o form com dados validos, ENTAO o webhook VUKer recebe request POST em `api-sigma.vuker.com.br/...` (validado em Story 02)
4. QUANDO clonar o repo fresco e rodar `cat site/.env.example`, ENTAO o arquivo documenta que os valores reais vivem no Vercel

**Comando de validacao:**
```bash
# Verificar via Vercel CLI (usuario precisa estar autenticado)
cd site && vercel env ls production | grep -E "PUBLIC_META_PIXEL_ID|PUBLIC_WEBHOOK_URLS"
# Esperado: 2 linhas, ambas com valores populados
```

---

### Story 02 — Validar payload VUKer end-to-end em preview deploy
- **Complexidade:** P (validacao manual dirigida, sem codigo)
- **Modelo sugerido:** implementer-haiku (guia manual) OU execucao humana direta
- **Depende de:** Story 01 + branch feature com Onda 1 completa + Vercel preview deploy disponivel
- **Arquivos a criar:** `docs/tests/vuker-webhook-smoke-2026-04-22.md` (laudo do teste)
- **Arquivos a modificar:** nenhum
- **Patterns a seguir:** `~/.claude/skills/landing-page-prd/references/analytics-pattern.md` secao 7 (Manual pre-deploy test)

**Contexto:** o PRD afirma que o payload atual do `CaptureModal.tsx:132-138` ja e compativel com o contrato VUKer. Esta story e a **validacao end-to-end** que confirma essa premissa antes do merge em main. Sem ela, descobrimos o bug so em producao.

**Acao:**
1. Aguardar Vercel preview deploy da branch com Onda 1 mergeada (URL tipo `https://intensivo-claude-code-landing-git-<branch>.vercel.app`)
2. Abrir Meta Events Manager → Events → Test Events tab, copiar test code
3. Abrir GA4 → Reports → Realtime em outra aba
4. Abrir o preview URL com UTMs na query string: `?utm_source=smoke-test&utm_medium=manual&utm_campaign=pre-deploy-validation&utm_term=test&utm_content=submit-br`
5. Clicar CTA → preencher form com:
   - Nome: `Smoke Test Brasil`
   - Email: `smoke+br@vuker.com.br`
   - Phone: numero BR valido (`+55 11 99999-9999` apos Story 03 implementada)
6. Submeter. Observar em paralelo:
   - **Meta Events Manager Test Events:** `Lead` aparece com `eventID` no formato `lead_<timestamp>_<rand>`
   - **GA4 Realtime:** evento `generate_lead` com `event_id` **identico** ao `eventID` do Pixel
   - **Webhook VUKer:** pedir a equipe VUKer (ou validar via logs `api-sigma.vuker.com.br` se acesso disponivel) que o payload chegou
   - **Redirect:** browser navega para `https://sndflw.com/i/...?utm_source=smoke-test&utm_medium=manual&...` (5 UTMs na query string)
7. Repetir com numero internacional (`+1 555 123 4567`, Nome `Smoke Test International`, email `smoke+us@vuker.com.br`) — validar que phone chega em E.164 no payload (`+15551234567`)
8. Documentar resultado em `docs/tests/vuker-webhook-smoke-2026-04-22.md` (template abaixo)

**Codigo de referencia:** laudo do teste

```markdown
---
title: Smoke Test — Webhook VUKer + Pixel + GA4
created: 2026-04-22
test_type: end-to-end pre-deploy
preview_url: <preencher>
---

## Submit BR
- Phone no form: +55 11 99999-9999
- Phone no payload (E.164): <preencher, ex: +5511999999999>
- eventID gerado: <preencher, ex: lead_1745245200000_ab12cd34>
- Meta Events Manager: <PASS/FAIL>
- GA4 Realtime event_id match: <PASS/FAIL>
- Webhook VUKer recebeu: <PASS/FAIL> (<timestamp VUKer>)
- Redirect URL com UTMs: <URL completa>

## Submit US
- Phone no form: +1 555 123 4567
- Phone no payload (E.164): <preencher, ex: +15551234567>
- eventID gerado: <preencher>
- Meta Events Manager: <PASS/FAIL>
- GA4 Realtime event_id match: <PASS/FAIL>
- Webhook VUKer recebeu: <PASS/FAIL>

## Veredito
<LIBERA MERGE | BLOQUEIA MERGE (lista de problemas)>
```

**Criterios de aceite:**
1. QUANDO submeter form com numero BR, ENTAO Meta Pixel registra `Lead` com `eventID` e GA4 registra `generate_lead` com `event_id` identico
2. QUANDO submeter form com numero internacional, ENTAO `phone` chega no payload VUKer em formato E.164 (`+<codigo-pais><digitos>`)
3. QUANDO submit completa, ENTAO webhook VUKer recebe POST com payload contendo todos os 5 campos UTM top-level quando aplicavel
4. QUANDO submit completa, ENTAO browser navega para redirect Sendflow com 5 UTMs propagados na query string
5. QUANDO laudo e escrito em `docs/tests/`, ENTAO veredito final e **LIBERA MERGE** — caso contrario, Onda 1 precisa de hotfix antes do merge

**Comando de validacao:**
```bash
# Verificar que o laudo foi criado e tem veredito
test -f "docs/tests/vuker-webhook-smoke-2026-04-22.md" \
  && grep -q "LIBERA MERGE" "docs/tests/vuker-webhook-smoke-2026-04-22.md" \
  && echo "PASS" || echo "FAIL"
```

---

### Story 03 — Mascara telefone internacional com `react-international-phone`
- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** nenhuma
- **Arquivos a criar:** nenhum
- **Arquivos a modificar:**
  - `site/package.json` — adicionar `react-international-phone` em `dependencies`
  - `site/src/components/react/CaptureModal.tsx` — trocar `<input>` simples de phone por `<PhoneInput>` da lib; atualizar `validate()` + payload builder
  - `site/src/styles/global.css` — importar CSS da lib (ou importar direto no TSX) e overrides para tokens editoriais
- **Patterns a seguir:** PRD secao 4.2 (divergencia explicita do padrao canonico `modal-pattern.md` linhas 115-119)

**Contexto:** input de phone atual tem apenas `placeholder="(11) 99999-9999"` visual sem mascara real no `onChange`. Stakeholder pediu suporte **internacional** (publico VUK tem brasileiros no exterior + leads LATAM futuros). Lib `react-international-phone` cobre formato + validacao + UX (bandeira). Mudanca rompe padrao canonico — comentario no codigo explica.

**Codigo de referencia (diff conceitual):**

**Antes** (`CaptureModal.tsx:291-310`, aproximado):
```tsx
<div>
  <label htmlFor="capture-phone" className="mb-1 block font-mono ...">
    Telefone (WhatsApp)
  </label>
  <input
    id="capture-phone"
    type="tel"
    name="phone"
    inputMode="numeric"
    autoComplete="tel-national"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    aria-invalid={!!errors.phone}
    aria-describedby={errors.phone ? 'capture-phone-error' : undefined}
    className="w-full border border-rule bg-page px-3 py-3 ..."
    placeholder="(11) 99999-9999"
  />
  {errors.phone && <p id="capture-phone-error" className="mt-1 ...">{errors.phone}</p>}
</div>
```

**Depois:**
```tsx
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

// No topo do componente (state):
const [phone, setPhone] = useState(''); // E.164 automatico via lib

// ... no JSX:
<div>
  <label htmlFor="capture-phone" className="mb-1 block font-mono ...">
    Telefone (WhatsApp)
  </label>
  {/*
    Divergencia intencional do padrao canonico ~/.claude/skills/landing-page-prd/references/modal-pattern.md
    linhas 115-119 (mask BR-only). Publico VUK inclui brasileiros no exterior + leads LATAM futuros.
    PhoneInput retorna valor em E.164 (ex: +5511999999999) — shape esperado pelo webhook VUKer.
  */}
  <PhoneInput
    defaultCountry="br"
    value={phone}
    onChange={(newPhone) => setPhone(newPhone)}
    inputProps={{
      id: 'capture-phone',
      name: 'phone',
      autoComplete: 'tel',
      'aria-invalid': !!errors.phone,
      'aria-describedby': errors.phone ? 'capture-phone-error' : undefined,
    }}
    inputClassName="w-full border border-rule bg-page px-3 py-3 font-sans text-base text-ink-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent"
    countrySelectorStyleProps={{
      buttonClassName: 'border border-rule bg-page px-3 py-3',
      dropdownStyleProps: {
        className: 'border border-rule bg-elevated text-ink-primary font-sans text-sm',
      },
    }}
  />
  {errors.phone && <p id="capture-phone-error" className="mt-1 font-mono text-xs text-accent">{errors.phone}</p>}
</div>
```

**Ajustar `validate()`:**
```ts
// Antes (regex 11 digitos BR)
const phoneDigits = phone.replace(/\D/g, '');
if (phoneDigits.length !== 11) { errors.phone = 'Telefone invalido'; valid = false; }

// Depois (E.164: 8-15 digitos apos +, padrao ITU)
const phoneDigits = phone.replace(/\D/g, '');
if (phoneDigits.length < 8 || phoneDigits.length > 15) {
  errors.phone = 'Telefone invalido. Inclua codigo do pais.';
  valid = false;
}
```

**Ajustar payload (`handleSubmit` linha 135):**
```ts
// Antes
phone: phone.replace(/\D/g, ''),

// Depois (manter E.164 completo com "+")
phone: phone, // ja vem em E.164 do PhoneInput
```

**Criterios de aceite:**
1. QUANDO abrir o modal em mobile Android/iOS, ENTAO o teclado numerico (`inputMode="tel"`) abre e dropdown de pais e operavel sem problemas
2. QUANDO digitar `11999999999` com BR selecionado, ENTAO o campo formata para `+55 11 99999-9999` e o state guarda `+5511999999999`
3. QUANDO trocar pais para US e digitar `5551234567`, ENTAO campo formata para `+1 (555) 123-4567` e state guarda `+15551234567`
4. QUANDO submit com numero valido (>= 8 digitos apos +), ENTAO payload.phone contem E.164 completo
5. QUANDO submit com numero invalido (< 8 digitos ou > 15), ENTAO `errors.phone` dispara com texto `'Telefone invalido. Inclua codigo do pais.'` e `aria-live` anuncia
6. QUANDO `astro build` rodar, ENTAO bundle JS de CaptureModal cresce em ~15 KB gzip (aceitavel, monitorar)

**Comando de validacao:**
```bash
cd site && npm install && npx astro build && npx astro check
# Esperado: build ok, zero erros de tipo, bundle CaptureModal.*.js cresce mas total < 250 KB gzip
```

---

### Story 04 — Conversao dos 19 depoimentos para WebP
- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** nenhuma
- **Arquivos a criar:**
  - `site/scripts/convert-depoimentos.mjs` (script de conversao)
  - `site/public/depoimentos/depoimento-{01..19}.webp` (output da conversao)
- **Arquivos a modificar:**
  - `site/package.json` — adicionar `sharp` em `devDependencies`; opcionalmente adicionar npm script `"convert:webp": "node scripts/convert-depoimentos.mjs"`
  - `site/src/config.ts` linhas 45-48 — trocar `.png` por `.webp` no `SOCIALPROOF_IMAGES`
  - `site/public/depoimentos/` — **deletar** os 19 `.png` apos confirmar que os `.webp` renderizam no preview
- **Patterns a seguir:** PRD secao 4.3

**Contexto:** 19 depoimentos em PNG puro estao inflando o bundle de imagens em ~60-70%. WebP com qualidade 85 mantem qualidade visual indistinguivel e reduz ~60% do peso. Audience VUK e >95% Chrome/Safari mobile — WebP e suportado universalmente em 2020+. `<picture>` fallback nao vale a pena (complica marquee GSAP).

**Codigo de referencia:** `site/scripts/convert-depoimentos.mjs`

```js
// site/scripts/convert-depoimentos.mjs
import sharp from 'sharp';
import { readdir, unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '..', 'public', 'depoimentos');

async function main() {
  const files = (await readdir(DIR)).filter((f) => f.endsWith('.png'));

  if (files.length === 0) {
    console.log('Nenhum PNG para converter.');
    return;
  }

  console.log(`Convertendo ${files.length} arquivos em ${DIR}...`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const f of files) {
    const input = path.join(DIR, f);
    const output = path.join(DIR, f.replace('.png', '.webp'));

    const buf = await sharp(input).webp({ quality: 85 }).toBuffer();
    const { fs } = await import('fs');
    (await import('fs')).writeFileSync(output, buf);

    const beforeSize = (await import('fs')).statSync(input).size;
    const afterSize = buf.length;
    totalBefore += beforeSize;
    totalAfter += afterSize;

    console.log(
      `  ${f} (${(beforeSize / 1024).toFixed(1)} KB) -> ${path.basename(output)} (${(afterSize / 1024).toFixed(1)} KB)`
    );
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024).toFixed(1)} KB -> ${(totalAfter / 1024).toFixed(1)} KB (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}% menor)`
  );
  console.log(`\nOK. Para deletar os PNGs, rode:`);
  console.log(`  rm ${DIR}/*.png`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

**Atualizacao em `site/src/config.ts` linhas 45-48:**
```ts
// Antes
SOCIALPROOF_IMAGES: Array.from(
  { length: 19 },
  (_, i) => `/depoimentos/depoimento-${String(i + 1).padStart(2, '0')}.png`
),

// Depois
SOCIALPROOF_IMAGES: Array.from(
  { length: 19 },
  (_, i) => `/depoimentos/depoimento-${String(i + 1).padStart(2, '0')}.webp`
),
```

**Sequencia de execucao:**
1. `cd site && npm install --save-dev sharp`
2. Criar `site/scripts/convert-depoimentos.mjs` com o conteudo acima
3. Rodar `node scripts/convert-depoimentos.mjs` — gera 19 `.webp`
4. Atualizar `src/config.ts`
5. `npx astro build` — confirmar que `dist/depoimentos/*.webp` existe
6. `npx astro preview` — abrir em localhost, conferir marquee renderiza as 19 imagens
7. **Apos confirmar visualmente no preview**, executar `rm site/public/depoimentos/*.png`
8. Rebuild final: `npx astro build` — confirmar `dist/depoimentos/*.png` nao existe

**Criterios de aceite:**
1. QUANDO rodar `node scripts/convert-depoimentos.mjs`, ENTAO 19 arquivos `.webp` sao gerados em `public/depoimentos/`
2. QUANDO comparar tamanhos, ENTAO o total dos `.webp` e < 40% do total dos `.png` originais (reducao >= 60%)
3. QUANDO rodar `npx astro build` apos update do config, ENTAO `dist/depoimentos/*.webp` existe e `dist/depoimentos/*.png` **nao** existe (apos deletados)
4. QUANDO abrir o preview local, ENTAO SocialProof renderiza as 19 imagens em marquee sem quebra visual
5. QUANDO conferir o DevTools Network em mobile viewport, ENTAO Content-Type dos depoimentos e `image/webp`

**Comando de validacao:**
```bash
cd site && npm install && node scripts/convert-depoimentos.mjs && \
  ls public/depoimentos/*.webp | wc -l | tr -d ' ' | grep -q "^19$" && \
  echo "PASS: 19 WebP gerados"
```

---

### Story 05 — Remover `src/pages/lab/` + rebuild
- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** nenhuma
- **Arquivos a criar:** nenhum
- **Arquivos a modificar:** nenhum (operacao destrutiva controlada)
- **Arquivos a remover:**
  - `site/src/pages/lab/` (pasta inteira: `index.astro`, `timeline/index.astro`, qualquer sub-rota)
  - `site/src/layouts/LabLayout.astro` se nao for usado em mais lugar nenhum apos remocao do `/lab/`
- **Patterns a seguir:** PRD secao 4.4

**Contexto:** rota `/lab/` era zona interna de experimentos (variantes de Timeline, etc.) e foi para `dist/` no build atual. Audit detectou como risco de vazamento. Decisao do PRD: **remocao fisica** (preserva historico em git, bundle menor, zero acesso publico).

**Acao:**
1. Conferir se `src/layouts/LabLayout.astro` e referenciado **apenas** por arquivos dentro de `src/pages/lab/`:
   ```bash
   cd site && grep -rln "LabLayout" src/ --include="*.astro"
   ```
   Esperado: so arquivos em `src/pages/lab/*`. Se aparecer em outro lugar, **nao remover o layout** — so o diretorio `pages/lab/`.
2. Executar:
   ```bash
   rm -rf site/src/pages/lab/
   # Se passo 1 confirmou que LabLayout so e usado em /lab/:
   rm site/src/layouts/LabLayout.astro
   ```
3. Rebuild:
   ```bash
   cd site && npx astro build
   ```
4. Validar:
   ```bash
   ! test -d dist/lab && echo "PASS: dist/lab removido"
   ```

**Criterios de aceite:**
1. QUANDO executar `rm -rf site/src/pages/lab/`, ENTAO pasta e removida sem erro
2. QUANDO `npx astro build` roda apos remocao, ENTAO build passa sem warning e `dist/lab/` nao existe
3. QUANDO `npx astro check` roda, ENTAO zero erros de referencia quebrada
4. QUANDO buscar `LabLayout` no src, ENTAO nenhuma ocorrencia resta (se o layout foi removido junto)
5. QUANDO `git status` exibir, ENTAO as mudancas sao `deleted` (nao `modified`) nos arquivos removidos

**Comando de validacao:**
```bash
cd site && npx astro build 2>&1 | grep -q "Complete!" && \
  ! test -d dist/lab && \
  echo "PASS: build ok, /lab/ ausente"
```

---

### Story 06 — Envolver TopBar em `<header role="banner">`
- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** nenhuma
- **Arquivos a criar:** nenhum
- **Arquivos a modificar:** `site/src/pages/index.astro` (ou componente TopBar dedicado, se existir em `src/components/`)
- **Patterns a seguir:** `site/src/layouts/LabLayout.astro` (ja usa `<header class="sticky ...">` — replicar padrao)

**Contexto:** audit flagged ausencia de `<header>` landmark na landing principal. TopBar atualmente renderizada como `<div class="sticky top-0 z-40">`. Finding critico nao-gatekeeper. Simples mas obrigatorio pre-merge.

**Acao:**
1. Localizar o bloco da TopBar. Pelo `dist/index.html` esta inline em `src/pages/index.astro` (aproximadamente):
   ```astro
   <div class="sticky top-0 z-40">
     <a href="#final-cta" class="block bg-ink-primary text-page font-mono text-[11px] ...">
       <span class="inline-block w-1.5 h-1.5 rounded-full bg-accent ..." aria-hidden="true"></span>
       {CONFIG.TOPBAR_TEXT}
     </a>
   </div>
   ```
2. Se o bloco estiver em um componente (`src/components/TopBar.astro` ou similar), modificar o componente. Caso contrario, modificar `src/pages/index.astro`.
3. Substituir o wrapper `<div>` por `<header>`. `<header>` direto descendente de `<body>` tem role implicito `banner` — nao precisa declarar `role="banner"` explicito. **Mas** como a TopBar esta dentro de `<main>` ou outro wrapper, declarar `role="banner"` explicito e mais seguro.

**Codigo de referencia (depois):**
```astro
<header class="sticky top-0 z-40" role="banner">
  <a
    href="#final-cta"
    class="block bg-ink-primary text-page font-mono text-[11px] tracking-widest py-2.5 text-center hover:bg-ink-primary/90 transition-colors"
  >
    <span
      class="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-2 align-middle animate-live-pulse"
      aria-hidden="true"
    ></span>
    {CONFIG.TOPBAR_TEXT}
  </a>
</header>
```

**Criterios de aceite:**
1. QUANDO `npx astro build` rodar, ENTAO `dist/index.html` contem pelo menos 1 `<header` tag
2. QUANDO abrir em leitor de tela ou inspecionar acessibilidade no DevTools (tab Accessibility > Landmarks), ENTAO "banner" landmark aparece na lista e corresponde a TopBar
3. QUANDO visualizar a landing em viewport qualquer, ENTAO layout e styling da TopBar permanecem identicos (apenas tag semantica muda)
4. QUANDO `grep -c "<header" dist/index.html`, ENTAO retorna >= 1

**Comando de validacao:**
```bash
cd site && npx astro build 2>&1 >/dev/null && \
  count=$(grep -c "<header" dist/index.html) && \
  [ "$count" -ge 1 ] && echo "PASS: $count <header> landmark(s)"
```

---

### Story 07 — Honeypot anti-spam no CaptureModal
- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** nenhuma (pode paralelizar com Story 03)
- **Arquivos a criar:** nenhum
- **Arquivos a modificar:** `site/src/components/react/CaptureModal.tsx`
- **Patterns a seguir:** PRD secao 4.5.2

**Contexto:** form atual exposto a bot spam. Cada bot que preencher queima 1 evento Meta `Lead`, 1 evento GA4, 1 POST no webhook VUKer. Honeypot off-screen e solucao zero-UX-impact, zero-dep, eficaz para o volume atual.

**Codigo de referencia (diff):**

**Adicionar state no componente** (topo, junto com os outros useState):
```tsx
const [honeypot, setHoneypot] = useState('');
```

**Adicionar campo no `<form>`** (entre os inputs reais, antes do submit):
```tsx
{/*
  Honeypot anti-spam. Posicionado off-screen (nao display:none — alguns bots detectam).
  Bots automatizados tendem a preencher qualquer campo com `name="website"` ou `name="url"`.
  Humanos nao veem. Se preenchido, submit finge sucesso e nao dispara nenhum tracking/webhook.
*/}
<input
  type="text"
  name="website"
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
  value={honeypot}
  onChange={(e) => setHoneypot(e.target.value)}
  style={{
    position: 'absolute',
    left: '-9999px',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    opacity: 0,
    pointerEvents: 'none',
  }}
/>
```

**Adicionar guard no `handleSubmit`** (imediatamente apos `setStatus('loading')` em `CaptureModal.tsx:126`):
```tsx
async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
  ev.preventDefault();
  if (status === 'loading') return;
  if (!validate()) return;
  setStatus('loading');

  // Honeypot: bots preenchem, humanos nao.
  // Fingir sucesso sem disparar tracking/webhook — nao alertar o bot.
  if (honeypot.trim().length > 0) {
    setStatus('success');
    return;
  }

  // ... resto do handleSubmit continua igual (eventID, webhook, fbq, gtag, redirect)
}
```

**Criterios de aceite:**
1. QUANDO renderizar o modal em tela, ENTAO o campo `<input name="website">` existe no DOM mas nao e visivel para o usuario
2. QUANDO navegar por Tab no modal, ENTAO o honeypot e pulado (`tabIndex={-1}`)
3. QUANDO inspecionar com leitor de tela, ENTAO o honeypot nao e anunciado (`aria-hidden="true"`)
4. QUANDO submeter o form com honeypot vazio, ENTAO fluxo normal acontece (webhook + pixel + GA + redirect)
5. QUANDO submeter o form com honeypot preenchido (simular via DevTools), ENTAO `status = 'success'` mas **nenhum** fetch de webhook dispara, **nenhum** `fbq('track', 'Lead')`, **nenhum** `gtag('event', 'generate_lead')` — verificavel via DevTools Network tab (zero requests)

**Comando de validacao:**
```bash
cd site && npx astro build 2>&1 >/dev/null && \
  grep -q 'name="website"' dist/_astro/CaptureModal.*.js && \
  grep -q "honeypot" dist/_astro/CaptureModal.*.js && \
  echo "PASS: honeypot presente no bundle"
```

---

### Story 08 — Security headers em `vercel.json`
- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** nenhuma
- **Arquivos a criar:** nenhum
- **Arquivos a modificar:** `vercel.json` (na raiz do repo, nao em `site/`)
- **Patterns a seguir:** PRD secao 4.5.3

**Contexto:** `vercel.json` existe mas sem bloco `headers`. Sem CSP + outros 5 headers, qualquer audit de seguranca retorna grade F. Headers nao bloqueiam merge por si, mas sao finding critico e impactam reputacao e compliance.

**Codigo de referencia:** `vercel.json` final

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.facebook.com https://api-sigma.vuker.com.br; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://sndflw.com"
        },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    }
  ]
}
```

**Se `vercel.json` ja tem outras keys** (`rewrites`, `redirects`, `cleanUrls`, etc.), **preservar** e apenas adicionar a key `headers` no topo do objeto.

**Iteracao pos-preview:** apos preview deploy, abrir DevTools Console e recarregar a pagina com form submit completo. Se aparecer algum erro de CSP (`Refused to load ...` ou `Refused to connect to ...`):
1. Identificar o dominio bloqueado
2. Adicionar na diretiva CSP correta (`script-src` para JS, `connect-src` para fetch/websocket, `img-src` para imagens, `frame-src` para iframes)
3. Se dominio vier de third-party (GTM, Clarity futuro), adicionar explicitamente

**Dominios cobertos no CSP atual:**
- `script-src`: `'self'` + Google Tag Manager + Facebook (Meta Pixel `fbevents.js`)
- `connect-src`: `'self'` + GA4 analytics + Meta Pixel beacons + **VUKer webhook** (`api-sigma.vuker.com.br`)
- `form-action`: `'self'` + Sendflow (redirect)
- `font-src`: `'self'` + Google Fonts (`fonts.gstatic.com`)
- `style-src`: `'self'` + Google Fonts CSS + `'unsafe-inline'` (Tailwind gera styles inline no build)
- `img-src`: `'self'` + data: (SVG inline) + Google/Facebook tracking pixels

**Criterios de aceite:**
1. QUANDO abrir `vercel.json` apos a mudanca, ENTAO contem o array `headers[0].headers` com 6 entradas (CSP, X-Frame, X-Content, Referrer, Permissions, HSTS)
2. QUANDO preview deploy concluir, ENTAO um `curl -I <preview-url>` retorna os 6 headers no response
3. QUANDO carregar a landing em preview com DevTools Console aberto, ENTAO zero erros `Refused to load` ou `Refused to connect to` aparecem (se aparecerem, iterar CSP antes do merge)
4. QUANDO submeter o form em preview, ENTAO webhook VUKer recebe sem bloqueio de CSP
5. QUANDO testar pos-deploy em https://securityheaders.io, ENTAO grade **B ou superior** (A+ e objetivo stretch mas requer mais ajustes)

**Comando de validacao:**
```bash
# Validar estrutura JSON
jq -e '.headers[0].headers | length == 6' vercel.json && echo "PASS: 6 headers"

# Apos preview deploy, validar ao vivo:
# curl -sI <preview-url> | grep -iE "content-security-policy|x-frame-options|x-content-type-options|referrer-policy|permissions-policy|strict-transport-security"
```

---

## Gatekeepers externos (bloqueiam merge, nao sao stories)

Mantidos em linha com PRD secao 5. Devem ser resolvidos **em paralelo** com as ondas, fora do escopo do squad Dev:

| # | Gatekeeper | Onde aparece | Acao requerida | Responsavel |
|---|---|---|---|---|
| EXT-1 | Dominio final | `canonical`, `og:url`, `og:image`, `Organization.logo`, `WebSite.url`, `Event.image` em `src/config.ts` | Mateus decide dominio → atualizar campo em `config.ts` → rebuild | Mateus + Squad Dev |
| EXT-2 | URL do Zoom real | JSON-LD `Event.location.url` (atualmente `zoom.us/j/TODO`) | Obter link do Zoom → popular `EVENT_ZOOM_URL` em `config.ts` | Mateus |
| EXT-3 | Privacidade + Termos | Footer `href="#"` | Opcao A: criar paginas `/privacy` e `/terms` (story extra futura). Opcao B: apontar URLs existentes do Grupo VUK | Mateus |
| EXT-4 | OG image alinhada Fase 0 | `public/og-image.png` (dark theme ICC Astro, nao bate com Light Editorial) | Recriar em Figma OU aceitar atual + refazer pos-go-live | Design / Mateus |

EXT-1, EXT-2, EXT-3 sao **hard blockers** pre-merge. EXT-4 e soft (pode ir no ar com OG atual se necessario).

## Checklists (apenas itens alterados neste PR)

Checklists completos do padrao da agencia vivem em `~/.claude/CLAUDE.md` e no PRD parent (`docs/prds/intensivo-claude-code.md`). Aqui, apenas os itens que **este plano altera**:

### a11y — itens alterados
- [ ] `<header role="banner">` envolve a TopBar (Story 06)
- [ ] Honeypot com `aria-hidden="true"` + `tabIndex={-1}` (Story 07) — nao anunciado por leitor de tela, pulado no Tab
- [ ] Input phone (`PhoneInput` de `react-international-phone`) preserva `aria-invalid` e `aria-describedby` do input original (Story 03)

### Analytics — itens alterados
- [ ] `PUBLIC_META_PIXEL_ID` = `310399388108164` em Vercel Production + Preview (Story 01)
- [ ] `PUBLIC_WEBHOOK_URLS` = endpoint VUKer em Vercel Production + Preview (Story 01)
- [ ] Payload webhook entregue em preview com phone em E.164 + 5 UTMs top-level (Story 02)
- [ ] Honeypot positivo nao dispara Pixel, GA4 ou webhook (Story 07)

### SEO — itens alterados
- [ ] `/lab/` removido do `dist/` (Story 05) — evita indexacao de pagina de teste
- [ ] `<header>` semantica presente (Story 06) — melhora crawlability

### Performance — itens alterados
- [ ] 19 depoimentos em WebP (Story 04) — reducao >= 60% no peso de imagens de SocialProof
- [ ] Bundle JS cresce ~15 KB gzip com `react-international-phone` (Story 03) — manter total < 250 KB gzip

### Motion — nenhuma mudanca
(Stories nao tocam GSAP, motion v12, nem `prefers-reduced-motion`.)

### Dependency hygiene — itens alterados
- [ ] `react-international-phone` adicionada em `dependencies` (Story 03) — justificativa: mascara multi-pais, unica lib do projeto com essa capacidade
- [ ] `sharp` adicionada em `devDependencies` (Story 04) — justificativa: script one-shot de conversao WebP
- [ ] `framer-motion` continua **ausente** do `package.json`
- [ ] Build final `npx astro build` sem warnings

## Riscos tecnicos

| Risco | Probab. | Impacto | Mitigacao |
|---|---|---|---|
| CSP bloqueia dominio nao previsto em preview (ex: GA4 colocar subdominio novo) | Media | Alto (form pode quebrar em producao) | Story 08 itera CSP baseado no DevTools Console do preview. Story 02 valida que submit real funciona end-to-end. |
| Mascara internacional muda shape do `phone` (agora E.164 `+55...`) e VUKer espera raw digits | Baixa | Alto (webhook rejeita payload) | Endpoint VUKer aceita `phone` como string livre — formato E.164 nao quebra. Story 02 confirma com submit BR **e** US. |
| `react-international-phone` tem conflito de CSS com tokens Fase 0 (botao dropdown desalinhado) | Media | Medio (UX estranha, nao bloqueia funcionalidade) | Story 03 inclui overrides via `inputClassName` + `countrySelectorStyleProps`. Se insuficiente, adicionar CSS custom em `src/styles/global.css` com seletores `.react-international-phone-*`. |
| WebP converte mas qualidade visual cai em tela retina | Baixa | Medio (depoimentos ficam borrados) | Story 04 usa qualidade 85 (sweet spot). Validar visual em retina antes de deletar PNGs. Se queda notavel, aumentar para 90 e re-rodar. |
| Remocao de `/lab/` quebra referencia que nao apareceu no grep (ex: link em log ou documento) | Baixa | Baixo (link morto em doc interno) | Aceitavel — docs podem ter links mortos, audit de docs e fora do escopo deste PR. |
| Bundle JS excede 250 KB gzip com `react-international-phone` + nota de dependencia cruzada | Baixa | Medio (Lighthouse Performance cai) | Bundle atual ~220 KB + ~15 KB da lib = ~235 KB. Margem de 15 KB. Se passar de 250, avaliar code-split do modal em `lazy()`. |
| Preview deploy requerer que `PUBLIC_META_PIXEL_ID` e `PUBLIC_WEBHOOK_URLS` estejam em Preview **antes** do preview rodar | Alta | Alto (Story 02 falha por var ausente) | Story 01 popula em **ambos** Production e Preview desde o inicio. Se preview ja rodou antes da Story 01, re-deployar com push novo. |
| Gatekeeper externo (dominio, Zoom, legal) atrasa merge mesmo com Onda 1/2 completas | Alta | Critico (deadline 24/04 fica apertado) | Gatekeepers externos sao topico de sync com Mateus em paralelo as ondas. Plan apenas sinaliza — resolucao e fora do escopo Dev. |

## Deploy

1. Branch feature (`feat/pre-deploy-adjustments` ou similar) — squad Dev abre PR apos Onda 1 completa
2. Vercel Git Integration dispara **preview deploy** automatico em qualquer push para branch nao-main
3. Story 02 consome URL do preview para validacao end-to-end
4. Apos Story 02 retornar **LIBERA MERGE** no laudo:
   - Confirmar EXT-1 (dominio), EXT-2 (Zoom), EXT-3 (legal) resolvidos em `src/config.ts`
   - Rebuild local: `cd site && npx astro build` — zero warnings
   - Rodar `/landing-page-audit intensivo-claude-code` — status deve ser `clear` (nao `blocked`, nao `partial`)
   - Rodar `securityheaders.io` no preview — grade **B** minimo, **A** desejavel
5. Merge em `main` via GitHub UI → Vercel dispara production deploy automatico
6. Pos-deploy:
   - Acompanhar build log no dashboard Vercel (verificar sem erros)
   - Abrir dominio de producao em mobile — smoke test visual
   - Submit real em producao com UTMs — conferir chegada no Meta Events Manager, GA4 Realtime, webhook VUKer (via equipe VUKer)
   - Rodar Lighthouse mobile no dominio de producao — meta Performance >= 90
   - Rich Results Test em https://search.google.com/test/rich-results — confirmar `Event` + `Organization` + `WebSite` detectados sem warnings
7. **Proibido** `npx vercel --prod` manual — regra universal CLAUDE.md

## Proximo passo

Apos revisao deste plan pelo Mateus, executar:

```
/expand-stories docs/plans/intensivo-claude-code-ajustes-pre-deploy.md
```

Comando mecanico que quebra as 8 stories embutidas acima em 8 arquivos individuais em `docs/stories/intensivo-claude-code-ajustes-pre-deploy-NN-*.md`, prontos pra dispatcher paralelo.

Em seguida:

```
implementer-landing
```

(skill `landing-page-implement` — orquestra haiku + sonnet em ondas de dependencia-resolvida.)

Apos implementers terminarem Onda 1:
1. Squad Dev abre PR com branch feature
2. Vercel preview deploy roda automatico
3. Dispatcher executa Story 02 (Onda 2)
4. Se laudo = LIBERA MERGE + gatekeepers externos resolvidos → merge em main

Apos merge:
```
/landing-page-audit intensivo-claude-code
```

Re-auditoria deve retornar status `clear`. Se retornar `partial` ou `blocked`, abrir PRD de ajustes v2 (cadencia de iteracao — landing raramente atinge `clear` em 1 round).
