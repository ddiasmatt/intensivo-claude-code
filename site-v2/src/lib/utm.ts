// site/src/lib/utm.ts
// Captura e propagacao de UTMs. Chaves padrao do GA4 + Meta.

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

const STORAGE_KEY = 'icc_utms';

type UTMRecord = Record<string, string>;

/**
 * Le window.location.search e extrai utm_*. Salva em sessionStorage 'icc_utms'
 * apenas uma vez por sessao (primeira aterrissagem). Retorna o objeto capturado
 * (ou os UTMs ja armazenados se ja houver sessao).
 */
export function captureUTMs(): UTMRecord {
  if (typeof window === 'undefined') return {};

  // Se ja capturou nesta sessao, nao sobrescreve (preserva first-touch).
  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing) as UTMRecord;
    } catch {
      // Se corrompido, segue adiante e recaptura.
    }
  }

  const params = new URLSearchParams(window.location.search);
  const captured: UTMRecord = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) captured[k] = v;
  });

  // Sempre grava, mesmo que vazio, para marcar "ja processado nesta sessao".
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
  return captured;
}

/**
 * Le sessionStorage 'icc_utms' e retorna objeto. Se ausente, retorna {}.
 */
export function getStoredUTMs(): UTMRecord {
  if (typeof window === 'undefined') return {};
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as UTMRecord;
  } catch {
    return {};
  }
}

/**
 * Anexa UTMs como query string ao URL redirect. Se o URL ja possui alguma
 * dessas keys, sobrescreve com o valor armazenado (intencional: first-touch manda).
 * Retorna o URL base sem alteracao caso seja invalido.
 */
export function buildUrlWithUTMs(url: string, utms: UTMRecord): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    Object.entries(utms).forEach(([k, v]) => {
      if (v) u.searchParams.set(k, v);
    });
    return u.toString();
  } catch {
    return url;
  }
}
