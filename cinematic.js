/* Decorative motion enhances native controls; no animation library or network request. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const hero = document.getElementById('inicio');
  if (!hero || !('IntersectionObserver' in window)) return;

  const atmosphere = document.createElement('div');
  atmosphere.className = 'hero-atmosphere';
  atmosphere.setAttribute('aria-hidden', 'true');
  const radar = document.createElement('div');
  radar.className = 'hero-radar';
  radar.innerHTML = '<span class="radar-cross"></span><span class="radar-orbit"></span><span class="radar-caption">PLAY / TOGETHER</span>';
  atmosphere.append(radar);
  const embers = document.createElement('div');
  embers.className = 'hero-embers';
  for (let i = 0; i < 26; i++) {
    const ember = document.createElement('i');
    ember.style.setProperty('--x', ((i * 37 + 11) % 100) + '%');
    ember.style.setProperty('--y', ((i * 23 + 7) % 100) + '%');
    ember.style.setProperty('--delay', (-i * .79) + 's');
    ember.style.setProperty('--duration', (5 + i % 7) + 's');
    ember.style.setProperty('--drift', (i % 2 ? 48 : -32) + 'px');
    ember.style.setProperty('--size', (2 + i % 3) + 'px');
    embers.append(ember);
  }
  atmosphere.append(embers);
  hero.append(atmosphere);
  document.body.classList.add('cinema-ready');

  // Infinite effects stop when their section is offscreen or the tab is hidden.
  const looping = [hero, ...document.querySelectorAll('.adventure-ticker, .final-cta')];
  const visible = new Set();
  const syncPlayback = () => looping.forEach(el => el.classList.toggle('motion-running', visible.has(el) && !document.hidden && !reduced.matches));
  const loopObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    syncPlayback();
  }, { threshold: 0 });
  looping.forEach(el => loopObserver.observe(el));
  document.addEventListener('visibilitychange', syncPlayback);
  reduced.addEventListener('change', syncPlayback);

  // A restrained depth response uses one animation frame per pointer update.
  let pointerFrame = 0;
  let pointerX = 0, pointerY = 0;
  function paintHero() {
    pointerFrame = 0;
    hero.style.setProperty('--aim-x', pointerX.toFixed(2) + 'px');
    hero.style.setProperty('--aim-y', pointerY.toFixed(2) + 'px');
  }
  hero.addEventListener('pointermove', event => {
    if (reduced.matches || !finePointer.matches) return;
    const box = hero.getBoundingClientRect();
    pointerX = ((event.clientX - box.left) / box.width - .5) * 18;
    pointerY = ((event.clientY - box.top) / box.height - .5) * 12;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(paintHero);
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; if (!pointerFrame) pointerFrame = requestAnimationFrame(paintHero); });

  document.querySelectorAll('.mission-card, .pack').forEach(card => {
    let frame = 0;
    let x = 50, y = 50;
    const paint = () => {
      frame = 0;
      card.style.setProperty('--light-x', x.toFixed(1) + '%');
      card.style.setProperty('--light-y', y.toFixed(1) + '%');
      card.style.setProperty('--tilt-x', ((50 - y) * .035).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', ((x - 50) * .045).toFixed(2) + 'deg');
    };
    card.addEventListener('pointermove', event => {
      if (reduced.matches || !finePointer.matches) return;
      const box = card.getBoundingClientRect();
      x = Math.max(0, Math.min(100, (event.clientX - box.left) / box.width * 100));
      y = Math.max(0, Math.min(100, (event.clientY - box.top) / box.height * 100));
      if (!frame) frame = requestAnimationFrame(paint);
    }, { passive: true });
    card.addEventListener('pointerleave', () => { x = 50; y = 50; if (!frame) frame = requestAnimationFrame(paint); });
  });

  // Text stays intact for screen readers; only the visual heading gets an entrance.
  const headingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('title-arrived');
      headingObserver.unobserve(entry.target);
    });
  }, { threshold: .12 });
  document.querySelectorAll('.section-heading h2, .location h2, .booking h2, .final-cta h2').forEach(heading => {
    heading.classList.add('cinematic-title');
    headingObserver.observe(heading);
  });
})();
