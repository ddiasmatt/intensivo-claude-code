// Endpoint Vercel Serverless que recebe payload do CaptureModal e dispara CAPI.
// Nunca retorna detalhes de erro do Meta pro client. Tudo 204/400/502.

import type { APIRoute } from 'astro';
import { sendCapiEvent } from '../../lib/capi';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const name = String(body.name ?? '').trim();
  const eventId = String(body.event_id ?? '').trim();
  const eventSourceUrl = String(body.event_source_url ?? '').trim();

  if (!EMAIL_RE.test(email) || !phone || !name || !eventId) {
    return new Response('Invalid payload', { status: 400 });
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor?.split(',')[0]?.trim() ?? clientAddress;
  const clientUa = request.headers.get('user-agent') ?? undefined;

  const customData =
    typeof body.custom_data === 'object' && body.custom_data !== null
      ? (body.custom_data as Record<string, string | number>)
      : undefined;

  try {
    await sendCapiEvent(
      {
        eventId,
        eventName: 'Lead',
        eventSourceUrl,
        email,
        phone,
        name,
        fbp: typeof body.fbp === 'string' ? body.fbp : undefined,
        fbc: typeof body.fbc === 'string' ? body.fbc : undefined,
        clientIp,
        clientUa,
        customData,
      },
      {
        pixelId,
        accessToken,
        testEventCode: testCode || undefined,
      }
    );
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('CAPI send failed:', (err as Error).message);
    return new Response(null, { status: 502 });
  }
};
