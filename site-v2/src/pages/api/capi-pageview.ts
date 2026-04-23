// Endpoint Vercel Serverless para PageView server-side (CAPI).
//
// Padrao: browser dispara Pixel fbq('track','PageView',{},{eventID}) e em paralelo
// faz fetch pra este endpoint com o MESMO event_id. Meta deduplica os dois eventos
// pelo event_id em janela de 48h. Resultado: PageView entrega mesmo com adblock
// bloqueando o Pixel no browser, sem duplicar quando nao bloqueia.
//
// Sem PII: user_data so leva fbp/fbc (se ja setados) + client_ip + client_user_agent.
// Meta aceita eventos sem PII desde que haja ao menos um identificador.
//
// Resposta opaca: 204 success / 400 payload / 502 upstream. Nunca vaza erro da Meta.

import type { APIRoute } from 'astro';
import { sendCapiEvent } from '../../lib/capi';

export const prerender = false;

function readCookie(cookieHeader: string, name: string): string | undefined {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match?.[1];
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const pixelId = import.meta.env.META_PIXEL_ID;
  const accessToken = import.meta.env.META_CAPI_ACCESS_TOKEN;
  const testCode = import.meta.env.META_CAPI_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    return new Response(null, { status: 204 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const eventId = String(body.event_id ?? '').trim();
  const eventSourceUrl = String(body.event_source_url ?? '').trim();

  if (!eventId || !eventSourceUrl) {
    return new Response('Invalid payload', { status: 400 });
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor?.split(',')[0]?.trim() ?? clientAddress;
  const clientUa = request.headers.get('user-agent') ?? undefined;

  const cookieHeader = request.headers.get('cookie') ?? '';
  const fbpFromBody = typeof body.fbp === 'string' ? body.fbp : undefined;
  const fbcFromBody = typeof body.fbc === 'string' ? body.fbc : undefined;
  const fbp = fbpFromBody || readCookie(cookieHeader, '_fbp');
  const fbc = fbcFromBody || readCookie(cookieHeader, '_fbc');

  try {
    await sendCapiEvent(
      {
        eventId,
        eventName: 'PageView',
        eventSourceUrl,
        context: { fbp, fbc, clientIp, clientUa },
      },
      { pixelId, accessToken, testEventCode: testCode || undefined }
    );
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('CAPI PageView failed:', (err as Error).message);
    return new Response(null, { status: 502 });
  }
};
