---
log: 001
title: Fix campo telefone no modal de captura site-v2 - input nativo com mascara BR
date: 2026-04-23
squad: dev
tags: [log]
---

## [20:40] Troca PhoneInput por input nativo

**Contexto**: o campo TELEFONE no modal de captura do `site-v2` nao batia visualmente com NOME/EMAIL. Causa: lib `react-international-phone` impoe altura fixa 36px via CSS propria, renderiza button + input separados com bordas duplicadas, e estilos defaults (background branco, radius) competem com Tailwind. Divergencia intencional do padrao canonico (modal-pattern.md §8) estava marcada por comentario no componente, sob justificativa de suportar BRs no exterior + LATAM futuro. ICP validado nos forms e no briefing e 100% Brasil; divida tecnica nao se paga.

**Mudancas** na branch `fix/phone-input-nativo-mascara-br`:

1. `site-v2/src/components/react/CaptureModal.tsx`
   - Removido `import { PhoneInput } from 'react-international-phone'` + import do CSS da lib
   - Removido bloco `<PhoneInput>` (21 linhas) + comentario de divergencia
   - Adicionada funcao pura `maskPhoneBR(raw: string): string` (5 linhas, inline) que aplica `(XX) XXXXX-XXXX`
   - Substituido por `<input type="tel" inputMode="numeric" autoComplete="tel-national">` com as mesmas classes Tailwind de NOME/EMAIL (`w-full border border-rule bg-page px-3 py-3 font-sans text-base text-ink-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent`)
   - `validate()` apertado de `8-15 digitos genericos` para `=== 11 digitos` (DDD + 9 celular)
   - `payload.phone` passa a ser `55${digitos}` (13 digitos, ex: `5511912345678`) em vez de E.164 `+55...`

2. `site-v2/package.json`
   - Removida dep `"react-international-phone": "^3"`

3. `site-v2/vercel.json`
   - Removido `https://cdnjs.cloudflare.com` da diretiva `img-src` da CSP (entrou no log #11 so pra servir SVGs das bandeiras da lib removida)

4. `site-v2/package-lock.json` atualizado via `npm install` — 84 packages adicionados de reorg, 1 removido (a lib). `node_modules/react-international-phone/` nao existe mais. 0 ocorrencias de `react-international-phone` no lockfile.

## [20:41] Validacao Meta Ads / CAPI

Auditado impacto em Pixel e Conversions API antes de considerar completo:

- **Pixel advanced matching** (`fbq('init', PIXEL_ID, { ph: normalizePhone(payload.phone) })`): `normalizePhone` em `src/lib/hash.ts:20-22` e `.replace(/\D/g, '')`, agnostico de formato. Antes hasheava `"5511912345678"` (E.164 sem +), agora hasheia `"5511912345678"` (igual). **Hash SHA-256 identico**, Events Manager nao ve diferenca.
- **CAPI server-side** (`/api/capi` → `buildUserData` em `src/lib/capi.ts:67`): recebe `phone` como string, coerce `.trim()`, normaliza via mesma funcao, hasheia. Fluxo inalterado.
- **event_id (dedup)**: gerado 1x no client, propagado para `fbq` e CAPI payload. Sem mudanca.
- **Compatibilidade historica**: leads antigos entravam com shape `5511xxxxxxxxx` pos-normalizacao. Novos entram identicos. Match quality, attribution windows e lookalikes nao sofrem reset.
- **CSP**: retirar `cdnjs.cloudflare.com` afeta so imagens. `connect.facebook.net`, `www.facebook.com` e `graph.facebook.com` permanecem intactos em script-src/img-src/connect-src/frame-src. fbq carrega, CAPI POST funciona.
- **Cookies fbp/fbc**: `src/lib/fb-cookies.ts` intocado.

**Nota de escopo**: validator agora rejeita telefones nao-BR. Briefing confirma ICP 100% Brasil, entao e o comportamento correto. Se futura audience LATAM/US for testada em Ads, o form bloqueia (guardar pra revisar na epoca).

## [20:42] Build validado

```
cd site-v2 && npm install && npm run build
```

Zero erros. Bundle do CaptureModal: 147.63 kB (gzip 50.55 kB), menor que antes (lib `react-international-phone@^3` saiu do chunk). Build hibrido Vercel completou em 1.65s.

## Pendente

- Teste manual nos breakpoints 320/430/768/1024/1440 com `npm run dev` (Mateus/Artur)
- Submeter lead de teste e conferir no Events Manager do Meta: 1 evento Lead com event_id batendo entre Pixel e CAPI
- Abrir PR pra `main` → Vercel auto-deploy pra `icc-v2.thesociety.com.br`
