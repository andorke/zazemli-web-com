import {activateKit} from '/files/narrative.js';

// Regions of the two actual photographs, in percentages. No generated product images.
const regions={
 anthurium:[[20,69,29,27],[40,49,20,26],[28,39,20,28],[65,38,25,48],[66,80,27,19]],
 epipremnum:[[33,59,29,25],[31,35,25,26],[41,7,24,33],[14,21,22,35],[60,51,14,27]]
};
export function mountMobileKit(stage,viewer){
 const popup=document.createElement('div');popup.id='kit-popover';popup.setAttribute('popover','manual');popup.setAttribute('role','dialog');popup.setAttribute('aria-modal','false');popup.setAttribute('aria-labelledby','kit-popover-title');
 popup.innerHTML='<div class="kit-popover-arrow" aria-hidden="true"></div><header><span class="kit-popover-number"></span><button data-kit-close aria-label="Закрыть описание">×</button></header><div class="kit-popover-content"><div class="kit-detail-crop"><img alt=""></div><div aria-live="polite"><h2 id="kit-popover-title"></h2><p></p></div></div><footer><button data-kit-recipe>Рецептура ↗</button><button data-kit-purchase>Купить бокс ↗</button></footer>';
 viewer.append(popup);
 let origin=null,section=null,outline=null,recipe=null,region=null,frame=0;
 const isOpen=()=>popup.matches(':popover-open');
 const clear=()=>{origin?.setAttribute('aria-expanded','false');outline?.remove();outline=null;cancelAnimationFrame(frame);frame=0};
 const close=(restore=true)=>{if(!isOpen())return;popup.hidePopover();clear();if(restore)origin?.focus({preventScroll:true})};
 const position=()=>{
  frame=0;if(!isOpen()||!origin?.isConnected)return;
  const scene=origin.closest('.scene'),r=origin.getBoundingClientRect(),s=scene.getBoundingClientRect(),v=viewer.getBoundingClientRect();
  if(scene.clientWidth>600||r.bottom<v.top||r.top>v.bottom){close(false);return}
  const leftEdge=Math.max(8,s.left+8),rightEdge=Math.min(innerWidth-8,s.right-8);
  const width=Math.min(320,rightEdge-leftEdge);popup.style.width=width+'px';
  const h=popup.offsetHeight,cx=r.left+r.width/2,x=Math.max(leftEdge,Math.min(cx-width/2,rightEdge-width));
  const candidates=[{side:'bottom',y:r.bottom+10},{side:'top',y:r.top-h-10}];
  const dots=[...origin.parentNode.querySelectorAll('button')].map(b=>b.getBoundingClientRect());
  candidates.push({side:'bottom',y:Math.max(...dots.map(d=>d.bottom))+10},{side:'top',y:Math.min(...dots.map(d=>d.top))-h-10});
  for(const c of candidates){const ideal=c.y;c.y=Math.max(8,Math.min(c.y,innerHeight-h-8));c.score=dots.filter(d=>d.left<x+width&&d.right>x&&d.top<c.y+h&&d.bottom>c.y).length*10000+Math.abs(c.y-ideal)+Math.abs((c.side==='bottom'?c.y-r.bottom:r.top-c.y-h));}
  candidates.sort((a,b)=>a.score-b.score);const chosen=candidates[0];
  popup.dataset.side=chosen.side;popup.style.left=x+'px';popup.style.top=Math.max(8,Math.min(chosen.y,innerHeight-h-8))+'px';popup.style.setProperty('--arrow-x',Math.max(16,Math.min(cx-x,width-16))+'px');
  const crop=popup.querySelector('.kit-detail-crop'),img=crop.querySelector('img'),[rx,ry,rw,rh]=region;
  const scale=Math.min(crop.clientWidth/(1448*rw/100),crop.clientHeight/(1086*rh/100));
  Object.assign(img.style,{width:1448*scale+'px',height:1086*scale+'px',left:(crop.clientWidth-1448*rw/100*scale)/2-1448*rx/100*scale+'px',top:(crop.clientHeight-1086*rh/100*scale)/2-1086*ry/100*scale+'px'});
 };
 const update=()=>{if(isOpen()&&!frame)frame=requestAnimationFrame(position)};
 stage.addEventListener('click',e=>{
  const target=e.target.closest('[data-kit],[data-kit-detail]');
  if(!target||target.closest('.scene').clientWidth>600)return;
  if(target===origin&&isOpen()){close();return}
  clear();origin=target;const scope=target.closest('.opening-story')||target.closest('.kit-section');section=scope.querySelector('.kit-section')||scope;
  const detail=!!target.dataset.kitDetail,index=detail?0:Number(target.dataset.kit),row=section.querySelector(`[data-kit-row="${index}"]`);
  activateKit(target);
  region=regions[target.parentNode.dataset.boxPhoto][detail?4:index];
  const photo=target.parentNode.parentNode.querySelector('.box-image>img');
  const title=detail?'Корневин':row.querySelector('h3').textContent;
  const img=popup.querySelector('img');img.src=photo.src;img.alt=title+' — фрагмент фотографии комплектации';
  popup.querySelector('h2').textContent=title;
  popup.querySelector('.kit-popover-content p').textContent=detail?'Входит в набор принадлежностей для пересадки.':row.querySelector('p').textContent;
  popup.querySelector('.kit-popover-number').textContent=(detail?'+':`0${index+1}`)+' / Входит в бокс';
  recipe=row.querySelector('[data-recipe-link]');popup.querySelector('[data-kit-recipe]').hidden=!recipe||detail;
  outline=document.createElement('div');outline.className='kit-object-outline';outline.setAttribute('aria-hidden','true');
  Object.assign(outline.style,{left:region[0]+'%',top:region[1]+'%',width:region[2]+'%',height:region[3]+'%'});target.parentNode.append(outline);
  target.setAttribute('aria-expanded','true');target.setAttribute('aria-controls',popup.id);target.setAttribute('aria-haspopup','dialog');
  popup.dataset.motion=target.closest('.scene').dataset.motion||'off';if(!isOpen())popup.showPopover();position();
  if(e.detail===0)popup.querySelector('[data-kit-close]').focus({preventScroll:true});
 });
 popup.addEventListener('click',e=>{
  if(e.target.closest('[data-kit-close]'))close();
  if(e.target.closest('[data-kit-recipe]')){const action=recipe;close();action?.click()}
  if(e.target.closest('[data-kit-purchase]')){const action=section.querySelector('.kit-buy');close();action.click()}
 });
 document.addEventListener('pointerdown',e=>{if(isOpen()&&!popup.contains(e.target)&&!e.target.closest('[data-kit],[data-kit-detail]'))close(false)},true);
 document.addEventListener('keydown',e=>{if(isOpen()&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close()}},true);
 viewer.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);viewer.addEventListener('close',()=>close(false));
 return {close};
}
