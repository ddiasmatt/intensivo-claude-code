// Monta payload Conversions API e envia pro endpoint Graph da Meta.
// NUNCA expor accessToken pro client. Usar apenas em API routes server-side.

import {
  sha256,
  normalizeEmail,
  normalizePhone,
  normalizeName,
  normalizeCountry,
  splitFullName,
} from './hash';

export type CapiEventName =
  | 'Lead'
  | 'CompleteRegistration'
  | 'Purchase'
  | 'InitiateCheckout'
  | 'ViewContent'
  | 'AddToCart';

export interface CapiInput {
  eventId: string;
  eventName: CapiEventName;
  eventSourceUrl: string;
  email: string;
  phone: string;
  name: string;
  country?: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  clientUa?: string;
  customData?: Record<string, string | number>;
}

export interface CapiConfig {
  pixelId: string;
  accessToken: string;
  testEventCode?: string;
  apiVersion?: string;
}

export async function sendCapiEvent(input: CapiInput, cfg: CapiConfig): Promise<unknown> {
  const { fn, ln } = splitFullName(input.name);
  const normalizedEmail = normalizeEmail(input.email);

  const userData: Record<string, string[] | string> = {
    em: [await sha256(normalizedEmail)],
    ph: [await sha256(normalizePhone(input.phone))],
    fn: [await sha256(normalizeName(fn))],
    country: [await sha256(normalizeCountry(input.country ?? 'br'))],
    external_id: [await sha256(normalizedEmail)],
  };

  if (ln) userData.ln = [await sha256(normalizeName(ln))];
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.clientUa) userData.client_user_agent = input.clientUa;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: 'website',
        user_data: userData,
        custom_data: input.customData ?? {},
      },
    ],
  };

  if (cfg.testEventCode) payload.test_event_code = cfg.testEventCode;

  const version = cfg.apiVersion ?? 'v21.0';
  const url = `https://graph.facebook.com/${version}/${cfg.pixelId}/events?access_token=${encodeURIComponent(cfg.accessToken)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`CAPI ${res.status}: ${body}`);
  }

  return res.json();
}
