import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';
import { CONFIG } from '@/config';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const UTM_STORAGE_KEY = 'icc_utms';

function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function buildUrlWithUTMs(baseUrl: string, utmParams: Record<string, string>): string {
  try {
    const url = new URL(baseUrl);
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    return baseUrl;
  }
}

function createLeadEventId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function trackLead(eventID: string) {
  if (typeof window === 'undefined') return;
  try {
    window.fbq?.('track', 'Lead', {}, { eventID });
  } catch {
    /* no-op */
  }
  try {
    window.gtag?.('event', 'generate_lead', { event_id: eventID });
  } catch {
    /* no-op */
  }
}

export default function CaptureModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [utmParams, setUtmParams] = useState<Record<string, string>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let stored: Record<string, string> = {};
    try {
      stored = JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || '{}');
    } catch {
      stored = {};
    }

    const captured: Record<string, string> = { ...stored };
    UTM_PARAMS.forEach((k) => {
      const v = params.get(k);
      if (v) captured[k] = v;
    });
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
    setUtmParams(captured);
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-capture-modal', handler);
    return () => window.removeEventListener('open-capture-modal', handler);
  }, []);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => firstInputRef.current?.focus());
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const card = cardRef.current;
    if (!card) return;
    const focusableSelector =
      'input:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = Array.from(
        card.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !card.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function close() {
    setOpen(false);
    setStatus('idle');
    setErrors({});
  }

  function requestClose() {
    const hasData = name.trim() || email.trim() || phone.trim();
    if (hasData && status !== 'success') {
      const ok = window.confirm(
        'Fechar agora? Os dados preenchidos serao perdidos.',
      );
      if (!ok) return;
    }
    close();
  }

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!name.trim() || name.trim().length < 2) newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) newErrors.email = 'E-mail invalido';
    const rawPhone = phone.replace(/\D/g, '');
    if (rawPhone.length !== 11) newErrors.phone = 'Telefone deve ter 11 digitos';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (website.trim()) {
      setStatus('success');
      return;
    }
    if (!validate()) return;
    setStatus('loading');
    const eventID = createLeadEventId();

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.replace(/\D/g, ''),
      event_id: eventID,
      timestamp: new Date().toISOString(),
      origin: window.location.origin,
      utm_source: utmParams.utm_source || '',
      utm_medium: utmParams.utm_medium || '',
      utm_campaign: utmParams.utm_campaign || '',
      utm_content: utmParams.utm_content || '',
      utm_term: utmParams.utm_term || '',
    };

    void Promise.allSettled(CONFIG.WEBHOOK_URLS.map((url: string) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
    ));

    trackLead(eventID);

    if (CONFIG.REDIRECT_URL) {
      window.location.href = buildUrlWithUTMs(CONFIG.REDIRECT_URL, utmParams);
      return;
    }
    setStatus('success');
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="capture-modal-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={requestClose}
        aria-hidden="true"
      />
      <div
        ref={cardRef}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-elevated shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]"
      >
        <button
          type="button"
          onClick={requestClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-ink-secondary transition hover:bg-white/10 hover:text-ink-primary"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 py-8 sm:px-8">
          <div className="mb-6 text-center">
            <h2
              id="capture-modal-title"
              className="text-xl font-bold tracking-tight text-ink-primary sm:text-2xl"
            >
              {CONFIG.MODAL_TITLE}
            </h2>
            <p className="mt-2 text-sm text-ink-secondary sm:text-base">{CONFIG.MODAL_SUBTITLE}</p>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle className="h-14 w-14 text-accent" />
              <p className="text-lg font-semibold text-accent">{CONFIG.MODAL_SUCCESS}</p>
              {CONFIG.REDIRECT_URL && <p className="text-sm text-ink-muted">Redirecionando...</p>}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                className="hidden"
              />

              <div>
                <input
                  ref={firstInputRef}
                  type="text"
                  placeholder="Primeiro nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="given-name"
                  className="h-12 w-full rounded-xl border border-white/10 bg-surface/70 px-4 text-ink-primary placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                {errors.name && <p className="mt-1 pl-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-white/10 bg-surface/70 px-4 text-ink-primary placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                {errors.email && <p className="mt-1 pl-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Telefone com DDD"
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  autoComplete="tel-national"
                  inputMode="numeric"
                  className="h-12 w-full rounded-xl border border-white/10 bg-surface/70 px-4 text-ink-primary placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                {errors.phone && <p className="mt-1 pl-1 text-xs text-red-400">{errors.phone}</p>}
              </div>

              {status === 'error' && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{CONFIG.MODAL_ERROR}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="cta-button relative w-full text-base sm:text-lg"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  CONFIG.MODAL_SUBMIT
                )}
              </button>

              <p className="pt-1 text-center text-xs text-ink-muted">{CONFIG.MODAL_PRIVACY}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
