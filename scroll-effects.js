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
      if(entry.isIntersecting){entry.target.classList.add('visible');revealWatcher.unobserve(entry.target);}
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.065 });
  document.querySelectorAll('.reveal').forEach(el => revealWatcher.observe(el));

  // Reveal headings once; revisiting a section must never hide its content.
  const sectionWatcher = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if(entry.isIntersecting)entry.target.classList.add('fx-active');
    }
  }, { rootMargin: '-8% 0px -12% 0px', threshold: 0 });
  document.querySelectorAll('main > section').forEach(el => sectionWatcher.observe(el));

  // Staggered image cards; animate again if scrolling back up.
  const itemWatcher = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if(entry.isIntersecting){entry.target.classList.add('in-view');itemWatcher.unobserve(entry.target);}
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
  attachItems(document.querySelectorAll('.section-heading:not(.reveal), .celebration-photo, .google-reviews .reviews-inner'), 1);
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

/* V2: full-screen chapter cards, orange sweeps and image shine on vertical navigation. */
(() => {
  'use strict';
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const scenes = [
    { selector:'#misiones', num:'01 / 04', title:'TU MISIÓN EMPIEZA' },
    { selector:'#packs', num:'02 / 04', title:'SUBE DE NIVEL' },
    { selector:'#galeria', num:'03 / 04', title:'MOMENTOS REALES' },
    { selector:'#ubicacion', num:'04 / 04', title:'NOS VEMOS EN LLEIDA' }
  ];
  const overlay = document.createElement('div');
  overlay.className = 'fx-scene-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<div class="fx-scene-center"><span class="fx-scene-num"></span><strong class="fx-scene-title"></strong><span class="fx-scene-decoration"></span></div>';
  const num = overlay.querySelector('.fx-scene-num');
  const title = overlay.querySelector('.fx-scene-title');
  const decoration = overlay.querySelector('.fx-scene-decoration');
  document.body.append(overlay);

  const glow = document.createElement('span');
  glow.className = 'fx-glint';
  glow.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('.mission-photo,.quick-card').forEach(host => {
    host.append(glow.cloneNode());
  });

  let navigationUntil = 0;
  let interactionUntil = 0;
  const dismiss = () => overlay.classList.remove('fx-playing');
  document.addEventListener('click', event => {
    if (event.target.closest('a[href^="#"]')) navigationUntil = Date.now() + 1800;
    if (event.target.closest('a,button,input,select,textarea,summary')) { interactionUntil = Date.now() + 1400; dismiss(); }
  }, true);
  document.addEventListener('focusin', event => { if(event.target.closest('form,[role="dialog"],details')) { interactionUntil=Date.now()+1400; dismiss(); } });
  let current = '';
  const played=new Set();
  let timer = null;
  let enabled = false;
  // Let the first viewport settle; transitions should respond to real navigation.
  window.requestAnimationFrame(() => { enabled = true; });

  function play(scene) {
    if (!enabled || Date.now() < navigationUntil || Date.now() < interactionUntil || document.querySelector('[role="dialog"][aria-hidden="false"]') || scene.selector === current || played.has(scene.selector)) return;
    played.add(scene.selector);
    current = scene.selector;
    if (timer !== null) clearTimeout(timer);
    num.textContent = scene.num + ' · PARK AVENTURA LLEIDA';
    title.textContent = scene.title;
    decoration.textContent = scene.num.slice(0,2);
    overlay.classList.remove('fx-playing');
    // Restart transitions when revisiting a section from below.
    void overlay.offsetWidth;
    overlay.classList.add('fx-playing');
    timer = window.setTimeout(() => {
      overlay.classList.remove('fx-playing');
      timer = null;
    }, 1100);
  }
  const observer = new IntersectionObserver(entries => {
    // If multiple panels enter the center band, prefer the one nearest center.
    const hits = entries.filter(entry => entry.isIntersecting);
    if (!hits.length) return;
    hits.sort((a,b) => {
      const center = window.innerHeight/2;
      const ac = Math.abs((a.boundingClientRect.top+a.boundingClientRect.bottom)/2-center);
      const bc = Math.abs((b.boundingClientRect.top+b.boundingClientRect.bottom)/2-center);
      return ac-bc;
    });
    const scene = scenes.find(item => item.selector === '#' + hits[0].target.id);
    if (scene) play(scene);
  }, { rootMargin:'-28% 0px -40% 0px', threshold:0 });
  for (const scene of scenes) {
    const element = document.querySelector(scene.selector);
    if (element) observer.observe(element);
  }
})();
