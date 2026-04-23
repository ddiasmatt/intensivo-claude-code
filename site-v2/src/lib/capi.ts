// Monta payload Conversions API e envia pro endpoint Graph da Meta.
// NUNCA expor accessToken pro client. Usar apenas em API routes server-side.
//
// `identity` e opcional pra suportar eventos sem PII (PageView, ViewContent).
// Semantica Meta: eventos sem PII ainda sao aceitos desde que user_data contenha
// ao menos um identificador (fbp, fbc, client_ip_address, client_user_agent).

import {
  sha256,
  normalizeEmail,
  normalizePhone,
  normalizeName,
  normalizeCountry,
  splitFullName,
} from './hash';

export type CapiEventName =
  | 'PageView'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Purchase'
  | 'InitiateCheckout'
  | 'ViewContent'
  | 'AddToCart';

export interface CapiIdentity {
  email: string;
  phone: string;
  name: string;
  country?: string;
}

export interface CapiRequestContext {
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  clientUa?: string;
}

export interface CapiEventInput {
  eventId: string;
  eventName: CapiEventName;
  eventSourceUrl: string;
  identity?: CapiIdentity;
  context?: CapiRequestContext;
  customData?: Record<string, string | number>;
}

export interface CapiConfig {
  pixelId: string;
  accessToken: string;
  testEventCode?: string;
  apiVersion?: string;
}

async function buildUserData(
  identity: CapiIdentity | undefined,
  context: CapiRequestContext | undefined
): Promise<Record<string, string[] | string>> {
  const userData: Record<string, string[] | string> = {};

  if (identity) {
    const { fn, ln } = splitFullName(identity.name);
    const normalizedEmail = normalizeEmail(identity.email);

    userData.em = [await sha256(normalizedEmail)];
    userData.ph = [await sha256(normalizePhone(identity.phone))];
    userData.fn = [await sha256(normalizeName(fn))];
    userData.country = [await sha256(normalizeCountry(identity.country ?? 'br'))];
    userData.external_id = [await sha256(normalizedEmail)];
    if (ln) userData.ln = [await sha256(normalizeName(ln))];
  }

  if (context?.fbp) userData.fbp = context.fbp;
  if (context?.fbc) userData.fbc = context.fbc;
  if (context?.clientIp) userData.client_ip_address = context.clientIp;
  if (context?.clientUa) userData.client_user_agent = context.clientUa;

  return userData;
}

export async function sendCapiEvent(event: CapiEventInput, cfg: CapiConfig): Promise<unknown> {
  const userData = await buildUserData(event.identity, event.context);

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl,
        action_source: 'website',
        user_data: userData,
        custom_data: event.customData ?? {},
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
