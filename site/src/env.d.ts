/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}
