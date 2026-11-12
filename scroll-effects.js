/* Park Aventura Lleida · scroll-driven motion layer.
   Effects are decorative only; links, modals, forms, gallery and navigation stay native. */
(() => {
  'use strict';
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.body.classList.add('scroll-fx');

  // Existing .reveal elements now animate when entering from either direction.
  // This observer remains subscribed (unlike the one-shot legacy reveal watcher).
  const revealWatcher = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.065 });
  document.querySelectorAll('.reveal').forEach(el => revealWatcher.observe(el));

  // Stage headings, chapter copy and subtle accents switch on and off naturally.
  const sectionWatcher = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('fx-active', entry.isIntersecting);
    }
  }, { rootMargin: '-8% 0px -12% 0px', threshold: 0 });
  document.querySelectorAll('main > section').forEach(el => sectionWatcher.observe(el));

  // Staggered image cards; animate again if scrolling back up.
  const itemWatcher = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    }
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0.06 });

  function attachItems(elements, groupSize = 3, step = 100) {
    Array.from(elements).forEach((el, i) => {
      if (el.classList.contains('motion-item')) return;
      el.style.setProperty('--fx-delay', (i % groupSize) * step + 'ms');
      el.classList.add('motion-item');
      itemWatcher.observe(el);
    });
  }
  attachItems(document.querySelectorAll('.quick-heading'), 1);
  attachItems(document.querySelectorAll('.quick-grid .quick-card'), 3, 110);
  attachItems(document.querySelectorAll('.faq details'), 2, 90);

  // Gallery photos arrive asynchronously from Supabase or repository fallback.
  // Watch only child additions, so filtering/re-rendering keeps working.
  const galleryGrid = document.getElementById('homeGalleryGrid');
  if (galleryGrid) {
    const attachGallery = () => attachItems(galleryGrid.querySelectorAll('.home-gallery-item'), 3, 70);
    attachGallery();
    new MutationObserver(attachGallery).observe(galleryGrid, { childList: true });
  }

  // Scroll position moves background photos a few pixels for a layered, 3D feel.
  // Keep this off small screens and when reduced motion is enabled.
  const desktop = window.matchMedia('(min-width: 761px)');
  const parallax = [];
  const hero = document.querySelector('#inicio .chapter-bg');
  if (hero) parallax.push({ target: hero, host: document.getElementById('inicio'), amount: 35 });
  document.querySelectorAll('.mission-photo, .feature-main, .feature-small').forEach(host => {
    const photo = host.querySelector('img');
    if (!photo) return;
    photo.classList.add('fx-parallax-image');
    parallax.push({ target: photo, host, amount: 23 });
  });
  document.querySelectorAll('.quick-card').forEach(host => {
    parallax.push({ target: host, host, amount: 18 });
  });

  const nav = document.querySelector('.nav');
  let requested = false;
  const paint = () => {
    requested = false;
    if (document.hidden) return;
    if (nav) nav.classList.toggle('fx-scrolled', window.scrollY > 30);
    if (!desktop.matches) {
      // Reset desktop motion on viewport changes, never move mobile photos.
      for (const item of parallax) item.target.style.removeProperty('--fx-shift');
      return;
    }
    const viewportHeight = window.innerHeight || 1;
    for (const item of parallax) {
      const box = item.host.getBoundingClientRect();
      if (box.bottom < -110 || box.top > viewportHeight + 110) continue;
      const centerOffset = (viewportHeight / 2 - box.top - box.height / 2) / viewportHeight;
      const shift = Math.max(-1, Math.min(1, centerOffset)) * item.amount;
      item.target.style.setProperty('--fx-shift', shift.toFixed(1) + 'px');
    }
  };
  const requestPaint = () => {
    if (requested) return;
    requested = true;
    window.requestAnimationFrame(paint);
  };
  window.addEventListener('scroll', requestPaint, { passive: true });
  window.addEventListener('resize', requestPaint, { passive: true });
  window.addEventListener('pageshow', requestPaint);
  document.addEventListener('visibilitychange', requestPaint);
  requestPaint();
})();