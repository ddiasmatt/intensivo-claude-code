// Le _fbp/_fbc setados pelo Pixel. Fallback: monta fbc a partir do fbclid
// da URL quando o Pixel ainda nao tem o cookie disponivel.
// Formato esperado: fb.<subdomainIndex>.<creationTime>.<value>

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match?.[1];
}

export function getFbp(): string | undefined {
  return readCookie('_fbp');
}

export function getFbc(): string | undefined {
  const fromCookie = readCookie('_fbc');
  if (fromCookie) return fromCookie;

  if (typeof window === 'undefined') return undefined;
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid');
  if (!fbclid) return undefined;

  return `fb.1.${Date.now()}.${fbclid}`;
}
