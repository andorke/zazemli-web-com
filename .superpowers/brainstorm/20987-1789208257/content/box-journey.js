// Editorial product story: one photograph in its own sticky column.
// No clone crosses text, no spacer scenes, and all copy stays in normal document flow.
export function mountBoxJourney(stage,viewer,{enabled=true}={}){
 const scene=stage.querySelector('.page-home');
 if(!enabled||!scene)return {destroy(){}};
 const hero=scene.querySelector('.story-hero'),kit=scene.querySelector('.kit-section');
 if(!hero||!kit)return {destroy(){}};
 const heroObject=hero.querySelector('.hero-object'),kitVisual=kit.querySelector('.kit-visual'),points=kit.querySelector('.kit-hotspots'),hint=kit.querySelector('.kit-hint');
 const pointsHome=points.parentNode,hintHome=hint.parentNode,heroHome=heroObject.parentNode;
 const buttons=[...points.querySelectorAll('button')];
 let opening=null,visual=null,frame=0,disposed=false,mode='',chapter='';
 const cleanLayout=()=>{
  if(opening){heroHome.append(heroObject);pointsHome.append(points);hintHome.append(hint);kitVisual.hidden=false;opening.before(hero,kit);opening.remove();opening=null;visual=null;}
  scene.classList.remove('editorial-opening','mobile-opening');
  points.inert=false;points.removeAttribute('aria-hidden');points.classList.remove('points-revealed');
  buttons.forEach(b=>b.style.removeProperty('--point-order'));
  delete scene.dataset.boxJourney;
 };
 const build=next=>{
  cleanLayout();mode=next;chapter='';
  buttons.forEach((b,i)=>b.style.setProperty('--point-order',i));
  if(mode==='desktop'){
   opening=document.createElement('div');opening.className='opening-story';hero.before(opening);opening.append(hero,kit);
   visual=document.createElement('aside');visual.className='opening-visual';visual.setAttribute('aria-label','Бокс и его комплектация');
   visual.innerHTML='<div class="opening-caption" aria-hidden="true"><span>01 / Бокс на одну пересадку</span><span>02 / Что внутри</span></div><div class="opening-rule" aria-hidden="true"><i></i></div>';
   visual.append(heroObject,hint);heroObject.querySelector('.box-image').append(points);opening.append(visual);kitVisual.hidden=true;scene.classList.add('editorial-opening');
  }else scene.classList.add('mobile-opening');
 };
 const update=()=>{if(!frame)frame=requestAnimationFrame(draw)};
 const draw=()=>{
  frame=0;if(disposed)return;
  const rect=viewer.getBoundingClientRect(),headerHeight=viewer.querySelector('.dialog-top').getBoundingClientRect().height;
  const next=scene.clientWidth>=760&&viewer.clientHeight-headerHeight>=540?'desktop':'mobile';
  if(next!==mode)build(next);
  const offset=rect.top+headerHeight+24;
  const start=(opening||hero).getBoundingClientRect().top+viewer.scrollTop-offset;
  const end=kit.getBoundingClientRect().top+viewer.scrollTop-offset;
  const progress=Math.max(0,Math.min(1,(viewer.scrollTop-start)/Math.max(1,end-start)));
  chapter=progress>=.5?'contents':'hero';
  if(mode==='desktop'){
   opening.style.setProperty('--opening-top',`${headerHeight+24}px`);
   opening.style.setProperty('--opening-photo-limit',`${Math.min(670,viewer.clientHeight-headerHeight-165)}px`);
   opening.style.setProperty('--opening-progress',progress.toFixed(3));
   opening.dataset.chapterState=chapter;
  }
  const revealed=chapter==='contents';
  scene.dataset.boxJourney=mode+'-'+chapter;
  points.classList.toggle('points-revealed',revealed);points.inert=!revealed;points.setAttribute('aria-hidden',String(!revealed));
 };
 viewer.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);const observer=new ResizeObserver(update);observer.observe(scene);observer.observe(viewer);draw();
 return {destroy(){disposed=true;cancelAnimationFrame(frame);viewer.removeEventListener('scroll',update);window.removeEventListener('resize',update);observer.disconnect();cleanLayout()}};
}
