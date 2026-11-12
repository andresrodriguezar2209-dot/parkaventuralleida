/* Native controls, progressive enhancement and decorative motion. */
(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const grid=document.querySelector('.quick-grid');
 // The complete finder lives in adventure-finder.js.
 if(grid&&matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduced.matches){
  grid.querySelectorAll('.quick-card').forEach(card=>{
   const light=document.createElement('span');light.className='card-spotlight';light.setAttribute('aria-hidden','true');card.append(light);
   card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--pointer-x',100*(e.clientX-r.left)/r.width+'%');card.style.setProperty('--pointer-y',100*(e.clientY-r.top)/r.height+'%');},{passive:true});
  });
 }
 // Feedback is visual only: native link navigation and form submission are preserved.
 document.querySelectorAll('.btn').forEach(button=>button.addEventListener('click',e=>{
  if(reduced.matches||e.detail===0)return;
  const r=button.getBoundingClientRect(),wave=document.createElement('span');wave.className='tap-wave';wave.setAttribute('aria-hidden','true');wave.style.left=e.clientX-r.left+'px';wave.style.top=e.clientY-r.top+'px';button.append(wave);wave.addEventListener('animationend',()=>wave.remove(),{once:true});
 }));
 const availableVideos=new Set(['Paintball','Laser Tag','Sala y merienda']);
 document.querySelectorAll('.video-trigger').forEach(button=>{
  if(!availableVideos.has(button.dataset.videoTitle)){button.disabled=true;button.setAttribute('aria-label','Vídeo de '+button.dataset.videoTitle+' próximamente');button.querySelector('span:last-child').textContent='Vídeo próximamente';}
 });
 // Trap keyboard focus inside every open modal; make the page inert while it is open.
 const dialogs=[...document.querySelectorAll('[role="dialog"]')];
 const pageParts=[...document.querySelectorAll('header.nav,main,footer,.wa,.chapter-dots')];
 let previousDialog=null;
 let returnFocus=null;
 document.addEventListener('click',e=>{const trigger=e.target.closest('[data-activity-info],.video-trigger,.home-gallery-item');if(trigger)returnFocus=trigger;},true);
 function syncDialogs(){
  const active=dialogs.find(d=>d.getAttribute('aria-hidden')==='false');
  pageParts.forEach(part=>{part.inert=Boolean(active)&&!part.contains(active);});
  if(active&&active!==previousDialog)active.querySelector('button:not(:disabled)')?.focus({preventScroll:true});
  if(!active&&previousDialog&&returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
  previousDialog=active;
 }
 dialogs.forEach(dialog=>new MutationObserver(syncDialogs).observe(dialog,{attributes:true,attributeFilter:['aria-hidden']}));
 document.addEventListener('keydown',e=>{
  const active=dialogs.find(d=>d.getAttribute('aria-hidden')==='false');
  if(e.key==='Tab'&&active){
   const focusable=[...active.querySelectorAll('button:not(:disabled),a[href],input,select,textarea,video[controls],[tabindex="0"]')].filter(el=>el.getClientRects().length&&!el.closest('[hidden]'));
   if(!focusable.length){e.preventDefault();return;}
   const first=focusable[0],last=focusable[focusable.length-1];
   if(e.shiftKey&&(document.activeElement===first||!active.contains(document.activeElement))){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&(document.activeElement===last||!active.contains(document.activeElement))){e.preventDefault();first.focus();}
  }
  if(e.key==='Escape'){
   const menu=document.getElementById('menu'),links=document.getElementById('links');
   if(links?.classList.contains('open')){links.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');menu.textContent='☰';menu.focus();}
  }
 });
 document.querySelectorAll('[data-gallery-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('active'))));
 const menu=document.getElementById('menu');if(menu)menu.setAttribute('aria-controls','links');
 // Keep the floating contact shortcut away from active forms and finder controls.
 if('IntersectionObserver' in window){
  const activeZones=new Set();
  const zoneObserver=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting)activeZones.add(entry.target);else activeZones.delete(entry.target);});
   document.body.classList.toggle('planning-in-view',activeZones.size>0);
  },{threshold:0});
  document.querySelectorAll('#reservar').forEach(zone=>zoneObserver.observe(zone));
  // The finder is inserted by a later deferred script.
  document.addEventListener('DOMContentLoaded',()=>{const finder=document.querySelector('.adventure-finder');if(finder)zoneObserver.observe(finder);},{once:true});
 }
 // Broken image URLs outside the hero recover with real repository photography.
 const fallback={ 'detalle-battle':'/d9ff5331-6ce4-43c3-adf0-27db93e16f80.jpeg' };
 document.querySelectorAll('.mission-photo img').forEach(img=>{
  const src=fallback[img.closest('.mission-card')?.id];if(!src)return;
  const recover=()=>{if(!img.dataset.recovered){img.dataset.recovered='true';img.src=src;}};
  img.addEventListener('error',recover,{once:true});if(img.complete&&!img.naturalWidth)recover();
 });
})();
