// site/src/scripts/modal-trigger.ts
// Delegador global. Captura cliques em qualquer [data-open-modal] e despacha
// o CustomEvent que o CaptureModal (React island) escuta. Dispara tambem
// click_cta no GA4 com cta_location antes de abrir. Permite que CTAs em
// componentes .astro estaticos disparem o modal sem importar React.

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;
  const trigger = target.closest<HTMLElement>('[data-open-modal]');
  if (!trigger) return;
  e.preventDefault();
  const loc = trigger.dataset.ctaLocation ?? 'unknown';
  // @ts-expect-error gtag is injected by GA4 snippet in Base.astro (may be absent)
  window.gtag?.('event', 'click_cta', { cta_location: loc });
  window.dispatchEvent(new CustomEvent('open-capture-modal'));
});
