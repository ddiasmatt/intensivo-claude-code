// site/src/components/react/CaptureModal.tsx
// Modal de captura (ilha React, client:load). Unico ponto de conversao.
// Contrato em ~/.claude/skills/landing-page-prd/references/modal-pattern.md.
// Abertura via CustomEvent('open-capture-modal') disparado por modal-trigger.ts.

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { CONFIG } from '../../config';
import { captureUTMs, getStoredUTMs, buildUrlWithUTMs } from '../../lib/utm';
import { getFbp, getFbc } from '../../lib/fb-cookies';
import { normalizeEmail, normalizePhone, normalizeName, splitFullName } from '../../lib/hash';

const PIXEL_ID = import.meta.env.PUBLIC_META_PIXEL_ID ?? '';

type Status = 'idle' | 'loading' | 'success' | 'error';

// Regex email suficiente para validacao client-side. Validacao final no backend.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CaptureModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cardRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Captura UTMs da URL na primeira montagem da pagina. Persiste em sessionStorage.
  useEffect(() => {
    captureUTMs();
  }, []);

  // Escuta o evento global disparado pelos CTAs.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('open-capture-modal', onOpen);
    return () => window.removeEventListener('open-capture-modal', onOpen);
  }, []);

  // requestClose: guarda conta o formulario sujo antes de fechar. Usado por
  // Esc, clique no X e clique no backdrop.
  const requestClose = useCallback(() => {
    const hasData = name.trim() !== '' || email.trim() !== '' || phone.trim() !== '';
    if (hasData && status !== 'success') {
      // eslint-disable-next-line no-alert
      const ok = window.confirm('Fechar agora? Os dados preenchidos serao perdidos.');
      if (!ok) return;
    }
    setOpen(false);
    setStatus('idle');
    setErrors({});
  }, [name, email, phone, status]);

  // Focus trap manual. Confina Tab/Shift+Tab entre focaveis visiveis do card.
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (!cardRef.current) return;
    const focusables = cardRef.current.querySelectorAll<HTMLElement>(
      'input, button, [href], [tabindex]:not([tabindex="-1"])'
    );
    const visibles = Array.from(focusables).filter(
      (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
    );
    if (visibles.length === 0) return;
    const first = visibles[0];
    const last = visibles[visibles.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  // Ref espelha o requestClose atual. Deps diretas no useEffect abaixo causariam
  // re-run a cada keystroke (porque requestClose depende de name/email/phone/status),
  // o que rechamaria o RAF de focus e jogaria o foco de volta no campo Nome.
  const requestCloseRef = useRef(requestClose);
  useEffect(() => {
    requestCloseRef.current = requestClose;
  }, [requestClose]);

  // Side-effects enquanto aberto: lock scroll do body, focus inicial, keyboard handlers.
  // Dep array contem apenas `open` — trapFocus e estavel (useCallback []), requestClose
  // e lido via ref. Roda so na transicao aberto/fechado, nao em cada digitacao.
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // requestAnimationFrame garante que o elemento ja foi montado no DOM
    // antes do foco ser aplicado (evita perda de focus em animacoes de entrada).
    const rafId = requestAnimationFrame(() => {
      firstInputRef.current?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestCloseRef.current();
      } else if (e.key === 'Tab') {
        trapFocus(e);
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Preencha seu nome.';
    if (!EMAIL_RE.test(email.trim())) e.email = 'Email invalido.';
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      e.phone = 'Telefone invalido. Inclua codigo do pais.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (status === 'loading') return; // Guard extra contra double-submit.
    if (!validate()) return;
    setStatus('loading');

    // Honeypot: bots preenchem, humanos nao.
    // Fingir sucesso sem disparar tracking/webhook — nao alertar o bot.
    if (honeypot.trim().length > 0) {
      setStatus('success');
      return;
    }

    // eventID gerado UMA vez. Propagado em Pixel, GA4 e payload para dedup CAPI.
    const eventID = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const utms = getStoredUTMs();

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone, // ja vem em E.164 do PhoneInput (ex: +5511999999999)
      event_id: eventID,
      ...utms,
    };

    // Fire-and-forget pra webhook VUKer (lead de verdade) — tracking (Pixel/GA/CAPI)
    // e redirect rodam em try independentes. Qualquer excecao sincrona nao pode
    // deixar o botao travado em "Enviando...".
    try {
      if (CONFIG.WEBHOOK_URLS.length > 0) {
        CONFIG.WEBHOOK_URLS.forEach((url: string) => {
          fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch((err) => {
            console.error('[capture] webhook failed:', err);
          });
        });
      } else {
        console.warn('[capture] PUBLIC_WEBHOOK_URLS nao configurado no build — lead nao sera persistido');
      }
    } catch (err) {
      console.error('[capture] webhook dispatch crashed:', err);
    }

    try {
      const { fn, ln } = splitFullName(payload.name);
      const advancedMatching: Record<string, string> = {
        em: normalizeEmail(payload.email),
        ph: normalizePhone(payload.phone),
        fn: normalizeName(fn),
        country: 'br',
        external_id: normalizeEmail(payload.email),
      };
      if (ln) advancedMatching.ln = normalizeName(ln);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fbq = (window as any).fbq as ((...args: unknown[]) => void) | undefined;
      if (fbq && PIXEL_ID) {
        fbq('init', PIXEL_ID, advancedMatching);
        fbq('track', 'Lead', {}, { eventID });
      }
      // @ts-expect-error gtag injetado pelo GA4 em Base.astro
      window.gtag?.('event', 'generate_lead', { event_id: eventID });
    } catch (err) {
      console.error('[capture] pixel/gtag failed:', err);
    }

    // CAPI server-side. Fire-and-forget: 404/500 aqui nao pode travar o lead nem o redirect.
    try {
      const fbp = getFbp();
      const fbc = getFbc();
      const capiPayload: Record<string, unknown> = {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        event_id: eventID,
        event_source_url: window.location.href,
        custom_data: { lead_source: 'landing_intensivo', ...utms },
      };
      if (fbp) capiPayload.fbp = fbp;
      if (fbc) capiPayload.fbc = fbc;
      const capiUrl = `${import.meta.env.BASE_URL}api/capi`.replace(/\/+/g, '/');
      fetch(capiUrl, {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capiPayload),
      }).catch((err) => {
        console.error('[capture] CAPI fetch failed:', err);
      });
    } catch (err) {
      console.error('[capture] CAPI dispatch crashed:', err);
    }

    // Redirect com UTMs propagados. Safety belt: se navigation nao acontecer
    // (CSP block, URL invalida, etc), reverte status pra idle em 8s pro usuario
    // poder tentar de novo em vez de ficar preso em "Enviando...".
    if (CONFIG.REDIRECT_URL) {
      const redirectTo = buildUrlWithUTMs(CONFIG.REDIRECT_URL, utms);
      window.setTimeout(() => {
        if (document.visibilityState === 'visible') {
          console.error('[capture] redirect did not happen within 8s. URL:', redirectTo);
          setStatus('error');
        }
      }, 8000);
      try {
        window.location.assign(redirectTo);
      } catch (err) {
        console.error('[capture] window.location.assign crashed:', err);
        setStatus('error');
      }
      return;
    }
    setStatus('success');
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="capture-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-primary/60 p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) requestClose();
          }}
        >
          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="capture-modal-title"
            aria-describedby="capture-modal-subtitle"
            className="relative w-full max-w-md border border-rule bg-elevated p-6 sm:p-10"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={requestClose}
              aria-label="Fechar"
              className="absolute right-4 top-4 text-ink-muted transition-colors hover:text-ink-primary"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <h2
              id="capture-modal-title"
              className="mb-2 font-display text-3xl text-ink-primary"
            >
              {CONFIG.MODAL_TITLE}
            </h2>
            <p
              id="capture-modal-subtitle"
              className="mb-6 font-sans text-base text-ink-secondary"
            >
              {CONFIG.MODAL_SUBTITLE}
            </p>

            {status === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center gap-3 py-6 text-center"
              >
                <CheckCircle2 size={40} strokeWidth={1.5} className="text-accent" />
                <p className="font-display text-2xl text-ink-primary">
                  {CONFIG.MODAL_SUCCESS}
                </p>
                <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                  {CONFIG.MODAL_PRIVACY}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="capture-name"
                    className="mb-1 block font-mono text-xs uppercase tracking-widest text-ink-muted"
                  >
                    Nome
                  </label>
                  <input
                    ref={firstInputRef}
                    id="capture-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'capture-name-error' : undefined}
                    className="w-full border border-rule bg-page px-3 py-3 font-sans text-base text-ink-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="Seu nome"
                  />
                  {errors.name && (
                    <p
                      id="capture-name-error"
                      className="mt-1 font-mono text-xs text-accent"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="capture-email"
                    className="mb-1 block font-mono text-xs uppercase tracking-widest text-ink-muted"
                  >
                    Email
                  </label>
                  <input
                    id="capture-email"
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'capture-email-error' : undefined}
                    className="w-full border border-rule bg-page px-3 py-3 font-sans text-base text-ink-primary outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="voce@email.com"
                  />
                  {errors.email && (
                    <p
                      id="capture-email-error"
                      className="mt-1 font-mono text-xs text-accent"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="capture-phone"
                    className="mb-1 block font-mono text-xs uppercase tracking-widest text-ink-muted"
                  >
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
                  {errors.phone && (
                    <p
                      id="capture-phone-error"
                      className="mt-1 font-mono text-xs text-accent"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

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

                {status === 'error' && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="flex items-center gap-2 border border-accent/40 bg-accent/5 p-3 font-mono text-sm text-accent"
                  >
                    <AlertCircle size={16} strokeWidth={1.5} />
                    <span>{CONFIG.MODAL_ERROR}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-accent py-4 font-mono text-sm uppercase tracking-widest text-page transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'loading' ? 'Enviando...' : CONFIG.MODAL_SUBMIT}
                </button>

                <p className="text-center font-mono text-xs text-ink-muted">
                  {CONFIG.MODAL_PRIVACY}
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
