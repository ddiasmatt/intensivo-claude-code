---
title: Story 11 — Modal de captura (React island)
slug: intensivo-claude-code-11
plan: docs/plans/intensivo-claude-code.md
prd: docs/prds/intensivo-claude-code.md
complexity: G
model: implementer-opus
depends_on: [Story 03, Story 04]
status: in_progress
created: 2026-04-22
tags: [story, landing, intensivo-claude-code]
---

# Story 11 — Modal de captura (React island)

- **Complexidade:** G
- **Modelo sugerido:** implementer-opus
- **Depende de:** Story 03, Story 04
- **Arquivos a criar:** `site/src/components/react/CaptureModal.tsx`, `site/src/lib/utm.ts`, `site/src/scripts/modal-trigger.ts`
- **Arquivos a modificar:** `site/src/layouts/Base.astro` (inclui `<CaptureModal client:load />` + script global `modal-trigger.ts`)
- **Patterns a seguir:**
  - `~/.claude/skills/landing-page-prd/references/modal-pattern.md` (contrato INTEIRO, nao reinventar)
  - `~/.claude/skills/landing-page-prd/references/analytics-pattern.md` secoes 3, 4, 5 (eventID, UTMs, webhooks)
  - PRD secao 5.4 (campos + textos + fluxo)

**Contexto:** Story mais critica. Unico ponto de conversao. Seguir `modal-pattern.md` item por item; nao inventar variantes. Componente React unico, client:load, escuta `window` para `CustomEvent('open-capture-modal')`. `modal-trigger.ts` e um delegador global que captura clicks em `[data-open-modal]` e despacha o evento, para CTAs espalhados em `.astro` estaticos nao precisarem importar React.

Checklist da story (derivado do contrato):
- [ ] `role="dialog"`, `aria-modal="true"`, `aria-labelledby="capture-modal-title"`
- [ ] Primeiro input recebe focus via `requestAnimationFrame` apos mount
- [ ] Tab/Shift+Tab confinados (focus trap manual sobre `input, button`)
- [ ] Esc fecha via `requestClose()` (nao `close()` direto)
- [ ] Backdrop click passa por `requestClose()` com `window.confirm()` quando form sujo
- [ ] Submit loading: botao `disabled`, texto muda para "Enviando..."
- [ ] `eventID` gerado uma vez, passado pra `fbq('track', 'Lead', {}, { eventID })`, `gtag('event', 'generate_lead', { event_id })` e payload do webhook
- [ ] `CONFIG.WEBHOOK_URLS.forEach(url => fetch(url, {...}).catch(()=>{}))` fire-and-forget
- [ ] Redirect com `buildUrlWithUTMs(CONFIG.REDIRECT_URL, utmParams)` apos gatilhos
- [ ] Erro renderiza com `role="alert" aria-live="assertive"`
- [ ] Mascara telefone `(XX) XXXXX-XXXX`, `inputMode="numeric"`, `autocomplete="tel-national"`, `raw` salvo no payload
- [ ] `document.body.style.overflow = 'hidden'` no mount, restaurar no cleanup
- [ ] CTAs passam `data-cta-location` (`hero | benefits | final`); `click_cta` disparado em GA4 antes de abrir

**Codigo de referencia (esqueleto, nao final):**

```tsx
// site/src/components/react/CaptureModal.tsx
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle } from 'lucide-react';
import { CONFIG } from '../../config';
import { captureUTMs, getStoredUTMs, buildUrlWithUTMs } from '../../lib/utm';

export function CaptureModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const cardRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { captureUTMs(); }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('open-capture-modal', onOpen);
    return () => window.removeEventListener('open-capture-modal', onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => firstInputRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
      if (e.key === 'Tab') trapFocus(e);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function trapFocus(e: KeyboardEvent) {
    if (!cardRef.current) return;
    const focusables = cardRef.current.querySelectorAll<HTMLElement>(
      'input, button, [href], [tabindex]:not([tabindex="-1"])'
    );
    const visibles = Array.from(focusables).filter((el) => el.offsetParent !== null);
    if (!visibles.length) return;
    const first = visibles[0];
    const last = visibles[visibles.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function requestClose() {
    const hasData = name.trim() || email.trim() || phone.trim();
    if (hasData && status !== 'success') {
      if (!window.confirm('Fechar agora? Os dados preenchidos serao perdidos.')) return;
    }
    setOpen(false);
    setStatus('idle');
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Preencha seu nome.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalido.';
    if (phone.replace(/\D/g, '').length < 10) e.phone = 'Telefone invalido.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');

    const eventID = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const utms = getStoredUTMs();
    const payload = { name: name.trim(), email: email.trim(), phone: phone.replace(/\D/g, ''), event_id: eventID, ...utms };

    CONFIG.WEBHOOK_URLS.forEach((url) => {
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {});
    });

    (window as any).fbq?.('track', 'Lead', {}, { eventID });
    (window as any).gtag?.('event', 'generate_lead', { event_id: eventID });

    if (CONFIG.REDIRECT_URL) {
      window.location.href = buildUrlWithUTMs(CONFIG.REDIRECT_URL, utms);
      return;
    }
    setStatus('success');
  }

  function maskPhone(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-ink-primary/60 flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}
        >
          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="capture-modal-title"
            className="relative bg-elevated w-full sm:max-w-md border border-rule p-8 sm:p-10"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
          >
            <button type="button" onClick={requestClose} aria-label="Fechar" className="absolute top-4 right-4 text-ink-muted hover:text-ink-primary">
              <X size={20} />
            </button>
            <h2 id="capture-modal-title" className="font-display text-3xl text-ink-primary mb-2">{CONFIG.MODAL_TITLE}</h2>
            <p className="font-sans text-ink-secondary text-base mb-6">{CONFIG.MODAL_SUBTITLE}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* inputs: name, email, phone; cada um com label, error inline, aria-invalid */}
              {status === 'error' && (
                <div role="alert" aria-live="assertive" className="flex items-center gap-2 text-accent font-mono text-sm">
                  <AlertCircle size={16} />
                  <span>{CONFIG.MODAL_ERROR}</span>
                </div>
              )}
              <button type="submit" disabled={status === 'loading'}
                className="w-full bg-accent hover:bg-accent-hover text-page font-mono text-sm tracking-widest uppercase py-4 disabled:opacity-60">
                {status === 'loading' ? 'Enviando...' : CONFIG.MODAL_SUBMIT}
              </button>
              <p className="text-center font-mono text-xs text-ink-muted">{CONFIG.MODAL_PRIVACY}</p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

```ts
// site/src/scripts/modal-trigger.ts (incluido como <script> no Base.astro)
document.addEventListener('click', (e) => {
  const trigger = (e.target as HTMLElement).closest<HTMLElement>('[data-open-modal]');
  if (!trigger) return;
  e.preventDefault();
  const loc = trigger.dataset.ctaLocation ?? 'unknown';
  (window as any).gtag?.('event', 'click_cta', { cta_location: loc });
  window.dispatchEvent(new CustomEvent('open-capture-modal'));
});
```

**Criterios de aceite:**
1. QUANDO clicar em qualquer CTA `data-open-modal`, ENTAO `click_cta` dispara no GA4 com `cta_location` correto e modal abre em ~200ms
2. QUANDO modal abrir, ENTAO primeiro input recebe foco e `body` ganha `overflow: hidden`
3. QUANDO Tab cicla, ENTAO foco fica preso entre 3 inputs + botao X + submit; Shift+Tab cicla ao contrario
4. QUANDO Esc pressionado com form sujo, ENTAO `confirm()` aparece; com form vazio, fecha direto
5. QUANDO submit valido, ENTAO `Lead` dispara em Meta (se Pixel ativo) e `generate_lead` em GA4 **com mesmo `event_id`**, webhook recebe POST, redirect vai para Sendflow com UTMs
6. QUANDO `PUBLIC_WEBHOOK_URLS` vazio, ENTAO submit pula o `forEach(fetch)` mas ainda dispara analytics e redireciona
7. QUANDO 2 cliques rapidos no submit, ENTAO segunda requisicao nao sai (`disabled` efetivo)
8. QUANDO erro de rede, ENTAO modal nao trava (fire-and-forget nao aguarda response)

**Comando de validacao:**
```bash
cd site && npm run dev
# manual: abrir http://localhost:4321, testar via DevTools Network + GA4 DebugView + console
```
