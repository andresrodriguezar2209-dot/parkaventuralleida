import { activityMedia } from './media-catalog.js';
import { createLightbox, photoButton } from './media-gallery.js';

const modal = document.getElementById('activityVideoModal');
const player = document.getElementById('experienceVideo');
const playback = document.getElementById('videoPlayback');
const title = document.getElementById('experienceTitle');
const cover = document.getElementById('experienceCover');
const description = document.getElementById('experienceDescription');
const choices = document.getElementById('experienceVideoChoices');
const photos = document.getElementById('experiencePhotos');
const status = document.getElementById('experienceStatus');
const reserve = document.getElementById('videoReserveLink');
const info = document.getElementById('experienceInfoLink');
const lightbox = createLightbox({
  dialog: document.getElementById('experienceLightbox'), image: document.getElementById('experienceLarge'),
  close: document.getElementById('experiencePhotoClose'), previous: document.getElementById('experiencePhotoPrev'),
  next: document.getElementById('experiencePhotoNext'), counter: document.getElementById('experiencePhotoCounter')
});
let trigger = null, current = null;

function clearVideo() {
  player.pause(); player.removeAttribute('src'); player.removeAttribute('poster'); player.load();
}
function setVideo(index) {
  clearVideo();
  const video = current.videos[index];
  player.muted = true; player.poster = video.poster; player.src = video.src;
  player.setAttribute('aria-label', `Vídeo de ${current.title} · ${index + 1}`);
  status.textContent = ''; player.load();
  choices.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
}
function closeExperience({ restore = true } = {}) {
  clearVideo(); modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (restore && trigger?.isConnected) trigger.focus({ preventScroll: true });
}
function openExperience(name, opener) {
  current = activityMedia[name]; if (!current) return;
  trigger = opener; clearVideo();
  title.textContent = current.title; cover.src = current.cover.full || current.cover.url; cover.alt = current.cover.title;
  description.textContent = current.description;
  modal.setAttribute('aria-label', `Experiencia: ${current.title}`);
  choices.replaceChildren(); photos.replaceChildren();
  playback.hidden = !current.videos.length;
  status.textContent = '';
  current.videos.forEach((video, index) => {
    const button = document.createElement('button'); button.type = 'button';
    const image = document.createElement('img'); image.src = video.poster; image.alt = ''; image.loading = 'lazy';
    const label = document.createElement('span'); label.textContent = `Vídeo ${index + 1}`;
    button.append(image, label); button.setAttribute('aria-pressed', String(index === 0));
    button.addEventListener('click', () => setVideo(index)); choices.append(button);
  });
  choices.hidden = current.videos.length < 2;
  if (current.videos.length) setVideo(0);
  if (current.photos.length) {
    const heading = document.createElement('h3'); heading.textContent = 'La experiencia en imágenes'; photos.append(heading);
    current.photos.forEach((photo, index) => photos.append(photoButton(photo, 'experience-photo', button => lightbox.open(current.photos, index, button))));
  }
  photos.hidden = !current.photos.length;
  info.hidden = !current.info;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; modal.querySelector('.video-modal-panel').scrollTop = 0;
  modal.querySelector('.video-modal-close').focus();
}

document.querySelectorAll('.video-trigger').forEach(button => {
  button.disabled = false;
  button.addEventListener('click', () => openExperience(button.dataset.videoTitle, button));
});
modal.querySelectorAll('[data-close-video]').forEach(button => button.addEventListener('click', () => closeExperience()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('open') && !lightbox.isOpen) closeExperience();
});
player.addEventListener('error', () => {
  if (modal.classList.contains('open') && player.hasAttribute('src')) status.textContent = 'No se ha podido cargar el vídeo. Puedes seleccionar otro vídeo o volver a abrir la experiencia.';
});
// Includes the existing decorative hero video; the user-selected player takes priority.
document.addEventListener('play', event => {
  if (!(event.target instanceof HTMLVideoElement)) return;
  document.querySelectorAll('video').forEach(video => { if (video !== event.target && !video.paused) video.pause(); });
}, true);
document.addEventListener('visibilitychange', () => { if (document.hidden) player.pause(); });
info.addEventListener('click', () => {
  const key = current.info;
  closeExperience({ restore: false });
  document.querySelector(`[data-activity-info="${key}"]`)?.click();
});
reserve.addEventListener('click', () => {
  selectActivity(trigger?.dataset.videoPack || current.booking);
  closeExperience({ restore: false });
});
