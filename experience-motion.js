/* Each experience has its own decorative language; controls stay native. */
(() => {
 'use strict';
 const ids=['paintball','laser','vr','humor','team','stress','battle'];
 const hosts=[];
 for(const id of ids){
  const quick=document.querySelector('.quick-card[href="#detalle-'+id+'"]');
  const detail=document.getElementById('detalle-'+id);
  for(const host of [quick,detail?.querySelector('.mission-photo')].filter(Boolean)){
   host.dataset.experience=id;
   const frame=document.createElement('span');frame.className='experience-frame';frame.setAttribute('aria-hidden','true');
   for(let i=0;i<3;i++){const mark=document.createElement('i');frame.append(mark);}
   host.append(frame);hosts.push(host);
  }
 }
 if(!('IntersectionObserver' in window))return;
 const watcher=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(entry.isIntersecting){entry.target.classList.add('experience-arrived');watcher.unobserve(entry.target);}
  }
 },{threshold:.15});
 hosts.forEach(host=>watcher.observe(host));
})();
