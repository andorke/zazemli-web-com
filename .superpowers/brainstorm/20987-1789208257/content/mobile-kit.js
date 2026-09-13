import {activateKit,esc} from '/files/narrative.js';

// The desktop inventory is also the content source for the mobile dialog.
export function mountMobileKit(stage,viewer){
 const sheet=document.createElement('dialog');sheet.id='kit-sheet';sheet.setAttribute('aria-labelledby','kit-sheet-title');
 sheet.innerHTML=`<header class="kit-sheet-head"><span>Внутри твоего бокса</span><button data-sheet-close aria-label="Закрыть описание">×</button></header><nav aria-label="Предметы в боксе"></nav><div class="kit-sheet-body"><div aria-live="polite" aria-atomic="true"><h2 id="kit-sheet-title" tabindex="-1"></h2><p class="kit-sheet-description"></p></div><button data-sheet-recipe>Открыть рецептуру <span>↗</span></button></div><footer><span class="kit-sheet-price"></span><button data-sheet-buy>Купить бокс <span>↗</span></button><small>Все четыре предмета входят в стоимость</small></footer>`;
 document.body.append(sheet);
 let origin=null,section=null,scrollTop=0,overflow='',recipe=null;
 const close=()=>{if(!sheet.open)return;sheet.close();viewer.style.overflow=overflow;viewer.scrollTop=scrollTop;origin?.focus({preventScroll:true})};
 const select=(index,detail=false)=>{
  const row=section.querySelector(`[data-kit-row="${index}"]`);
  const scope=section.closest('.opening-story')||section;
  const point=scope.querySelector(detail?'[data-kit-detail]':`[data-kit="${index}"]`);
  activateKit(point);
  sheet.querySelector('h2').textContent=detail?'Корневин':row.querySelector('h3').textContent;
  sheet.querySelector('.kit-sheet-description').textContent=detail?'Входит в набор принадлежностей вместе с перчатками, деревянными палочками и угольной пудрой.':row.querySelector('p').textContent;
  sheet.querySelectorAll('[data-sheet-item]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sheetItem===String(index))));
  recipe=row.querySelector('[data-recipe-link]');sheet.querySelector('[data-sheet-recipe]').hidden=!recipe||detail;
  sheet.querySelector('.kit-sheet-body').scrollTop=0;
 };
 stage.addEventListener('click',e=>{
  const target=e.target.closest('[data-kit],[data-kit-detail]');
  if(!target||target.closest('.scene').clientWidth>600)return;
  origin=target;section=(target.closest('.opening-story')||target.closest('.kit-section')).querySelector('.kit-section')||target.closest('.kit-section');
  sheet.querySelector('nav').innerHTML=[...section.querySelectorAll('[data-kit-row]')].map((row,i)=>`<button data-sheet-item="${i}" aria-label="0${i+1}. ${esc(row.querySelector('h3').textContent)}">0${i+1}</button>`).join('');
  sheet.querySelector('.kit-sheet-price').textContent=section.querySelector('.kit-purchase>span').textContent;
  select(target.dataset.kit||0,!!target.dataset.kitDetail);
  scrollTop=viewer.scrollTop;overflow=viewer.style.overflow;viewer.style.overflow='hidden';
  sheet.dataset.motion=stage.querySelector('.scene').dataset.motion||'off';sheet.showModal();sheet.querySelector('h2').focus({preventScroll:true});
 });
 sheet.addEventListener('click',e=>{
  const item=e.target.closest('[data-sheet-item]');if(item)select(item.dataset.sheetItem);
  if(e.target.closest('[data-sheet-close]'))close();
  if(e.target.closest('[data-sheet-recipe]')){const action=recipe;close();action?.click()}
  if(e.target.closest('[data-sheet-buy]')){const action=section.querySelector('.kit-buy');close();action.click()}
  if(e.target===sheet){const r=sheet.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}
 });
 sheet.addEventListener('keydown',e=>{
  if(e.key!=='Tab')return;
  const buttons=[...sheet.querySelectorAll('button')].filter(b=>!b.hidden&&!b.disabled);
  const first=buttons[0],last=buttons.at(-1),active=document.activeElement;
  if(e.shiftKey&&(active===first||active===sheet.querySelector('h2'))){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&active===last){e.preventDefault();first.focus()}
 });
 sheet.addEventListener('cancel',e=>{e.preventDefault();close()});
 window.addEventListener('resize',()=>{if(sheet.open&&stage.querySelector('.scene').clientWidth>600)close()});
 return {close};
}
