---
title: Story 07 — Honeypot anti-spam no CaptureModal
slug: intensivo-claude-code-ajustes-pre-deploy-07
plan: docs/plans/intensivo-claude-code-ajustes-pre-deploy.md
prd: docs/prds/intensivo-claude-code-ajustes-pre-deploy.md
complexity: P
model: implementer-haiku
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-ajustes-pre-deploy]
---

# Story 07 — Honeypot anti-spam no CaptureModal

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
