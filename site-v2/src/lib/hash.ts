// Hashing e normalização de user_data conforme spec Meta CAPI.
// Fonte: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters

export async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '');
}

export function normalizeName(value: string): string {
  return stripAccents(value.trim().toLowerCase());
}

export function normalizeCountry(value: string): string {
  return value.trim().toLowerCase().slice(0, 2);
}

export function splitFullName(full: string): { fn: string; ln: string } {
  const parts = full.trim().split(/\s+/);
  const fn = parts[0] ?? '';
  const ln = parts.slice(1).join(' ');
  return { fn, ln };
}
