import gsap from 'gsap';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Modal bridge: delegated click (sempre ativo)
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const trigger = target.closest<HTMLElement>('[data-open-modal]');
  if (!trigger) return;
  e.preventDefault();
  window.dispatchEvent(new CustomEvent('open-capture-modal'));
});

if (!reducedMotion) {
  requestAnimationFrame(() => {
    // Hero entrance: stagger fade+rise no mount (Hero e 100% estatico, sem island conflitando)
    const heroTargets = [
      '[data-gsap="hero-badge"]',
      '[data-gsap="hero-wordmark"]',
      '[data-gsap="hero-headline"]',
      '[data-gsap="hero-sub"]',
      '[data-gsap="hero-price"]',
      '[data-gsap="hero-cta"]',
      '[data-gsap="hero-diagram"]',
    ];
    gsap.from(heroTargets.join(','), {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
    });

    // Magnetic CTA: efeito de atração magnetica no mouse hover
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((wrapper) => {
      const btn = wrapper.querySelector<HTMLElement>('button, a, astro-island');
      if (!btn) return;
      const moveX = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
      const moveY = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });

      wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const relX = (e.clientX - rect.left - rect.width / 2) * 0.2;
        const relY = (e.clientY - rect.top - rect.height / 2) * 0.2;
        moveX(relX);
        moveY(relY);
      });
      wrapper.addEventListener('mouseleave', () => {
        moveX(0);
        moveY(0);
      });
    });
  });
}
