---
title: Story 03 — Mascara telefone internacional com `react-international-phone`
slug: intensivo-claude-code-ajustes-pre-deploy-03
plan: docs/plans/intensivo-claude-code-ajustes-pre-deploy.md
prd: docs/prds/intensivo-claude-code-ajustes-pre-deploy.md
complexity: M
model: implementer-sonnet
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-ajustes-pre-deploy]
---

# Story 03 — Mascara telefone internacional com `react-international-phone`

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
