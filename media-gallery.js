import { categories, repositoryPhotos, mergePhotos } from './media-catalog.js';

// One lightbox per gallery. Full images are fetched only when opened.
export function createLightbox({ dialog, image, close, previous, next, counter }) {
  let photos = [], index = 0, trigger = null, savedOverflow = '';
  const show = offset => {
    index = (offset + photos.length) % photos.length;
    const photo = photos[index];
    image.src = photo.full || photo.url;
    image.alt = photo.title;
    counter.textContent = `${index + 1} / ${photos.length} · ${photo.title}`;
    previous.hidden = next.hidden = photos.length < 2;
  };
  const dismiss = () => {
    if (!dialog.classList.contains('open')) return;
    dialog.classList.remove('open');
    dialog.setAttribute('aria-hidden', 'true');
    image.removeAttribute('src');
    document.body.style.overflow = savedOverflow;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  };
  previous.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  close.addEventListener('click', dismiss);
  dialog.addEventListener('click', event => { if (event.target === dialog) dismiss(); });
  let startX = null;
  image.addEventListener('touchstart', event => { startX = event.touches[0].clientX; }, { passive: true });
  image.addEventListener('touchend', event => {
    const delta = event.changedTouches[0].clientX - startX;
    if (startX !== null && Math.abs(delta) > 60) show(index + (delta < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
  document.addEventListener('keydown', event => {
    if (!dialog.classList.contains('open')) return;
    if (event.key === 'Escape') { event.stopImmediatePropagation(); dismiss(); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(index + (event.key === 'ArrowLeft' ? -1 : 1));
    }
    if (event.key === 'Tab') {
      const buttons = [close, previous, next].filter(button => !button.hidden);
      const first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }, true);
  return {
    open(items, selected, opener) {
      photos = items; trigger = opener;
      savedOverflow = document.body.style.overflow;
      show(selected);
      dialog.classList.add('open');
      dialog.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      close.focus();
    },
    get isOpen() { return dialog.classList.contains('open'); }
  };
}

export function photoButton(photo, className, onOpen) {
  const button = document.createElement('button');
  button.type = 'button'; button.className = className;
  button.setAttribute('aria-label', `Ampliar fotografía: ${photo.title}`);
  const image = document.createElement('img');
  image.loading = 'lazy'; image.decoding = 'async';
  image.src = photo.url; image.alt = photo.title;
  if (photo.srcset) {
    image.srcset = photo.srcset;
    image.sizes = '(max-width: 600px) 46vw, (max-width: 1000px) 45vw, 30vw';
  }
  if (photo.width) { image.width = photo.width; image.height = photo.height; }
  button.append(image); button.addEventListener('click', () => onOpen(button));
  return button;
}

export function mountGallery({ root, filters, lightbox, home = false }) {
  let photos = repositoryPhotos, category = 'all';
  function render() {
    root.replaceChildren();
    const groups = Object.entries(categories).filter(([key]) => category === 'all' || key === category);
    for (const [key, label] of groups) {
      const related = photos.filter(photo => photo.category === key);
      if (!related.length) continue;
      const heading = document.createElement('h3');
      heading.className = 'media-group-title'; heading.textContent = label;
      const count = document.createElement('span'); count.textContent = `${related.length} fotos`;
      heading.append(count); root.append(heading);
      const selection = home ? related.slice(0, category === 'all' ? 3 : 9) : related;
      selection.forEach((photo, index) => {
        root.append(photoButton(photo, home ? 'home-gallery-item' : 'item', opener => lightbox.open(related, index, opener)));
      });
    }
    if (!root.children.length) {
      const empty = document.createElement('p'); empty.className = 'gallery-empty empty';
      empty.textContent = 'Todavía no hay fotografías publicadas de esta actividad.'; root.append(empty);
    }
  }
  filters.forEach(button => {
    const key = home ? button.dataset.galleryCategory : button.dataset.category;
    button.setAttribute('aria-pressed', String(key === category));
    button.addEventListener('click', () => {
      category = key;
      filters.forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
      render();
    });
  });
  render();
  return {
    setPublished(data) {
      // Keep the current selection and keyboard focus stable during asynchronous reads.
      if (lightbox.isOpen || root.contains(document.activeElement)) return;
      photos = mergePhotos(repositoryPhotos, data); render();
    }
  };
}
