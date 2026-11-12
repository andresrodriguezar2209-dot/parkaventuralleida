/* One bounded animation; scrolling stays native on touch and desktop. */
(() => {
 'use strict';
 const scene = document.getElementById('paintballScene');
 const replay = document.getElementById('paintballReplay');
 if (!scene || !replay) return;
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const dots = scene.querySelector('.impact-droplets');
 for (let i=0;i<34;i++) {
  const dot=document.createElement('i');
  const angle=(i*2.39996);const distance=85+(i%9)*27;
  dot.style.setProperty('--dx',`${Math.cos(angle)*distance}px`);
  dot.style.setProperty('--dy',`${Math.sin(angle)*distance+40}px`);
  dot.style.setProperty('--size',`${3+i%6}px`);dots.append(dot);
 }
 let timer=0, autoTimer=0, busy=false, started=false, visible=false, frame=0;
 const image = new Image();
 image.src='/assets/paintball-impact.webp';
 const ready=image.decode ? image.decode().catch(()=>{}) : Promise.resolve();
 function reset() {
  clearTimeout(timer);clearTimeout(autoTimer);cancelAnimationFrame(frame);busy=false;
  scene.classList.remove('impact-running');
 }
 async function play() {
  if (busy || reduced.matches || document.hidden || !visible) return;
  busy=true;clearTimeout(autoTimer);await ready;
  if (reduced.matches || document.hidden || !visible) {busy=false;return;}
  started=true;scene.classList.remove('impact-running');scene.classList.add('impact-ready');
  // Commit the clean mask before restarting CSS keyframes.
  void scene.offsetWidth;
  frame=requestAnimationFrame(()=>{
   scene.classList.add('impact-running');
   timer=setTimeout(()=>{scene.classList.remove('impact-ready','impact-running');busy=false;},1800);
  });
 }
 replay.addEventListener('click',play);
 scene.addEventListener('click',event=>{if(!event.target.closest('button'))play();});
 const observer=new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;
  if(visible&&!started&&!reduced.matches){scene.classList.add('impact-ready');autoTimer=setTimeout(play,650);}
  if(!visible){clearTimeout(autoTimer);if(busy){reset();scene.classList.remove('impact-ready');}}
 },{threshold:.35});observer.observe(scene);
 // The first deliberate scroll can trigger it sooner if the mask is visible.
 window.addEventListener('scroll',()=>{if(visible&&!started)play();},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){reset();scene.classList.remove('impact-ready');}});
 reduced.addEventListener('change',()=>{reset();scene.classList.remove('impact-ready');});
})();
