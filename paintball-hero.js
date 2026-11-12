/* Play the approved rendered sequence, with native inline video on phones. */
(() => {
 'use strict';
 const scene=document.getElementById('paintballScene');
 const replay=document.getElementById('paintballReplay');
 const video=document.getElementById('paintballImpactVideo');
 if(!scene||!replay||!video)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let visible=false,started=false,timer=0,attempt=0;
 video.muted=true;
 async function play(){
  if(reduced.matches||document.hidden||!visible)return;
  clearTimeout(timer);started=true;
  const request=++attempt;
  video.currentTime=0;
  try{await video.play();if(request!==attempt)return;scene.classList.add('impact-video-active');}
  catch{scene.classList.remove('impact-video-active');started=false;}
 }
 const stop=()=>{clearTimeout(timer);attempt++;video.pause();};
 replay.addEventListener('click',play);
 scene.addEventListener('click',e=>{if(!e.target.closest('button'))play();});
 video.addEventListener('error',()=>{stop();scene.classList.remove('impact-video-active');});
 const observer=new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;
  if(visible&&!started&&!reduced.matches)timer=setTimeout(play,450);
  if(!visible)stop();
 },{threshold:.3});observer.observe(scene);
 window.addEventListener('scroll',()=>{if(visible&&!started)play();},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 reduced.addEventListener('change',()=>{stop();if(reduced.matches)scene.classList.remove('impact-video-active');});
})();
