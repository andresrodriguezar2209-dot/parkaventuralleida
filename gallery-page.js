import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './supabase-config.js';
import { createLightbox, mountGallery } from './media-gallery.js';

const home = Boolean(document.getElementById('homeGalleryGrid'));
const get = id => document.getElementById(id);
const root = get(home ? 'homeGalleryGrid' : 'gallery');
const lightbox = createLightbox({
  dialog: get(home ? 'homeGalleryLightbox' : 'lightbox'),
  image: get(home ? 'homeGalleryLarge' : 'lightboxImage'),
  close: get(home ? 'homeGalleryClose' : 'lightboxClose'),
  previous: get(home ? 'homeGalleryPrev' : 'galleryPrev'),
  next: get(home ? 'homeGalleryNext' : 'galleryNext'),
  counter: get(home ? 'homeGalleryCounter' : 'galleryCounter')
});
const gallery = mountGallery({ root, home, lightbox, filters: [...document.querySelectorAll(home ? '[data-gallery-category]' : '[data-category]')] });
document.querySelectorAll('.team-meal-photo').forEach(button => button.addEventListener('click', () => {
  const items = [...document.querySelectorAll('.team-meal-photo img')].map(img => ({ url: img.src, title: img.alt }));
  lightbox.open(items, [...document.querySelectorAll('.team-meal-photo')].indexOf(button), button);
}));
get('year').textContent = new Date().getFullYear();

// Existing read-only published-gallery integration. No schema, settings or admin changes.
async function loadPublishedPhotos() {
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    const { data, error } = await db.from('gallery_photos').select('id,title,category,storage_path').eq('is_published', true).order('sort_order').order('created_at', { ascending: false }).abortSignal(AbortSignal.timeout(8000));
    if (error || !data?.length) return;
    gallery.setPublished(data.map(photo => ({ ...photo, url: db.storage.from('park-gallery').getPublicUrl(photo.storage_path).data.publicUrl })));
  } catch { /* Local photos and all gallery controls remain available. */ }
}
loadPublishedPhotos();
