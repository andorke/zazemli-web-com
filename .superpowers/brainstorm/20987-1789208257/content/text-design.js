import {seregaGentle} from '/files/serega-gentle.js';
import {seregaEmotional} from '/files/serega-emotional.js';

// Typography from sasha; factual, scientific and legal copy stays verbatim.
export function polishRussian(root){
 if(root.querySelector('.page-lab,.page-guide,.page-privacy,.page-terms'))return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 for(let node=walker.nextNode();node;node=walker.nextNode()){
  if(!node.parentElement.closest('.scene')||node.parentElement.closest('footer,form,.research-source,.soil-experience,.material-board,.product-recipe,.diary-value,.price,.size-options,button,a,[data-text-polished]'))continue;
  node.textContent=node.textContent.replace(/(^|[\s(«])([ВвКкСсОоУу]) (?=\S)/g,'$1$2\u00a0').replace(/ (?=—)/g,'\u00a0');
 }
}

// One-shot, viewport-triggered choreography; no text swapping or scroll interception.
export function mountTextDesign(root,{viewport,motion=true,animateVisible=true}={}){
 polishRussian(root);
 const scene=root.querySelector('.scene');
 if(!scene)return {destroy(){}};
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const enabled=motion&&!reduce;
 const controls=[],animations=new Set(),restores=[];
 let disposed=false;
 scene.dataset.motion=enabled?'on':'off';
 const playFrame=(element,keyframes,options)=>{
  if(disposed)return;
  const animation=element.animate(keyframes,options);animations.add(animation);
  animation.finished.catch(()=>{}).then(()=>{animation.cancel();animations.delete(animation)});
 };
 function revealHeading(heading){
  const label=heading.getAttribute('aria-label');
  heading.setAttribute('aria-label',heading.innerText.replace(/\s+/g,' ').trim());
  const inserted=[];
  for(const node of [...heading.childNodes]){
   if(node.nodeType===Node.TEXT_NODE&&node.textContent.trim()){
    const span=document.createElement('span');span.dataset.motionPart='';span.textContent=node.textContent;node.replaceWith(span);inserted.push(span);
   }
  }
  const parts=[...heading.children].filter(el=>el.tagName!=='BR');
  const previous=parts.map(el=>el.getAttribute('aria-hidden'));
  parts.forEach(el=>el.setAttribute('aria-hidden','true'));
  restores.push(()=>{parts.forEach((el,i)=>previous[i]===null?el.removeAttribute('aria-hidden'):el.setAttribute('aria-hidden',previous[i]));label===null?heading.removeAttribute('aria-label'):heading.setAttribute('aria-label',label);inserted.forEach(el=>el.replaceWith(...el.childNodes))});
  let delay=0;
  for(const part of parts){
   const words=part.textContent.trim().split(/\s+/).length;
   const emotional=heading.matches('h1')&&part.tagName==='EM'&&words<=4;
   if(emotional){
    // The expressive accent starts when the preceding phrase has settled.
    const control=seregaEmotional(part,{autoplay:false});controls.push(control);
    const cover=part.animate([{opacity:0},{opacity:0}],{duration:delay,fill:'both'});animations.add(cover);
    cover.finished.catch(()=>{}).then(()=>{cover.cancel();animations.delete(cover);if(!disposed)control.play()});
   }else{
    if(delay>0){const cover=part.animate([{opacity:0},{opacity:0}],{duration:delay,fill:'both'});animations.add(cover);cover.finished.catch(()=>{}).then(()=>{cover.cancel();animations.delete(cover)})}
    const control=seregaGentle(part,{loop:false,initialDelay:delay});controls.push(control);
   }
   delay+=500+Math.max(0,[...part.textContent].length-1)*15;
  }
 }
 const jobs=new Map();
 if(!scene.matches('.page-privacy,.page-terms')){
  scene.querySelectorAll('h1,.chapter-heading h2,.stage-copy h2,.letters>h2,.diary-form h2').forEach(el=>jobs.set(el,()=>revealHeading(el)));
  scene.querySelectorAll('.story-hero-copy>.micro,.hero-core,.chapter-heading>.micro,.kit-inventory,.home-plant-index,.purchase-value,.ritual-steps,.diary-photo-pair').forEach(el=>{
   jobs.set(el,()=>{
    const rows=el.matches('.kit-inventory,.home-plant-index,.purchase-value,.ritual-steps')?[...el.children]:[el];
    rows.forEach((row,i)=>{const base=getComputedStyle(row).transform;const transform=base==='none'?'':base;playFrame(row,[{opacity:0,transform:`translateY(12px) ${transform}`},{opacity:1,transform:`translateY(0) ${transform}`}],{duration:500,delay:i*65,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'})});
   });
  });
 }
 const played=new Set();
 const rootRect=viewport.getBoundingClientRect();
 if(!animateVisible){for(const el of jobs.keys()){const r=el.getBoundingClientRect();if(r.bottom>rootRect.top&&r.top<rootRect.bottom){played.add(el);el.dataset.revealState='settled'}}}
 const observer=enabled?new IntersectionObserver(entries=>{
  for(const entry of entries){if(!entry.isIntersecting||played.has(entry.target))continue;
   played.add(entry.target);entry.target.dataset.revealState='played';observer.unobserve(entry.target);jobs.get(entry.target)?.();
  }
 },{root:viewport,threshold:0.12}):null;
 if(observer)jobs.forEach((_,el)=>{if(!played.has(el))observer.observe(el)});
 return {destroy(){
  disposed=true;observer?.disconnect();animations.forEach(a=>a.cancel());animations.clear();controls.forEach(c=>c.destroy());restores.reverse().forEach(fn=>fn());jobs.forEach((_,el)=>delete el.dataset.revealState);delete scene.dataset.motion;
 }};
}
