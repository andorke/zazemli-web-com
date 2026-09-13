// Coordinates reference the supplied, named photographic plates; percentages are not recipe amounts.
const zones={
 monstera:[['pesok',2,2,18,17],['peno',2,24,18,21],['kora',24,2,27,43],['char',55,2,42,15],['gum',55,20,42,6],['zeo',55,30,42,25],['diat',1,52,4,43],['kokos',8,52,22,43],['moh',34,52,17,43],['peat',56,62,40,34]],
 ficus:[['pesok',2,2,16,18],['peno',2,25,16,21],['kora',22,2,20,44],['char',47,2,31,18],['gum',84,2,13,18],['zeo',47,26,50,21],['kokos',2,54,17,42],['diat',24,54,17,42],['peat',48,54,48,42]],
 anthurium:[['pesok',2,2,11,28],['peno',17,2,7,28],['diat',29,2,31,13],['gum',66,2,30,13],['kora',2,36,21,59],['kokos',29,22,30,45],['moh',29,76,30,19],['char',66,21,30,21],['zeo',66,49,30,17],['peat',66,74,30,21]],
 aglaonema:[['pesok',2,2,24,32],['peno',32,2,6,32],['gum',44,1,51,6],['char',44,12,51,11],['zeo',44,29,51,11],['kokos',2,41,25,33],['diat',33,41,6,33],['kora',2,81,37,14],['peat',46,48,49,47]],
 spathiphyllum:[['pesok',2,2,17,21],['peno',25,2,16,21],['gum',48,1,47,5],['char',48,11,47,13],['zeo',48,31,47,12],['kokos',2,30,17,44],['diat',25,30,16,16],['moh',25,54,16,40],['kora',2,83,17,11],['peat',48,51,47,44]],
 zamioculcas:[['pesok',2,2,17,42],['peno',25,2,16,42],['char',48,2,32,19],['gum',87,2,9,19],['zeo',48,28,47,19],['kokos',2,53,17,42],['diat',25,53,16,42],['peat',49,55,46,40]],
 epipremnum:[['pesok',1,1,7,8],['peno',12,1,32,8],['char',52,2,27,19],['gum',86,2,10,19],['zeo',52,29,44,14],['kokos',2,15,14,50],['diat',22,15,9,50],['moh',37,15,8,50],['kora',2,74,43,21],['peat',52,52,44,43]]
};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const shot=(file,alt,cls='',zoom=true)=>`<figure class="real-shot ${cls}">${zoom?`<button class="photo-enlarge" data-enlarge="${file}" aria-label="Рассмотреть: ${escape(alt)}">`:''}<img src="/files/${file}" alt="${escape(alt)}" loading="lazy" decoding="async">${zoom?'<span class="enlarge-mark" aria-hidden="true">＋</span></button>':''}</figure>`;
export const macro=(key,label,cls='')=>`<img class="material-macro ${cls}" src="/files/macro-${key}.webp" alt="${escape(label)} — макрофотография" loading="lazy" decoding="async">`;
export function specimen(s){return shot(`soil-${s.slug}-cutout.webp`,`Компоненты грунта: Заземли ${s.accusative}`,'specimen-shot')}
export function diaryPhoto(s,spread=false){return shot(spread?'diary-spread.webp':`diary-${s.slug}.webp`,spread?'Разворот дневника — весенний календарь заботы':`Дневник из бокса «Заземли ${s.accusative}»`,'diary-real')}
export function soilPlate(s,d){
 const list=zones[s.slug];
 return `<div class="material-board" data-plant-slug="${s.slug}"><div class="plate-top"><span class="micro">${s.number} / Заземли ${escape(s.accusative)}</span><span class="plate-instruction">Наведи или нажми на материал</span></div><div class="plate-photo"><img src="/files/soil-${s.slug}-photo.webp" alt="Раскладка компонентов: Заземли ${escape(s.accusative)}" loading="lazy" decoding="async"><div class="plate-zones">${list.map(([key,x,y,w,h])=>{const label=key==='peat'?'Торфяная основа':d.lab.components.find(c=>c.key===key).name;return `<button data-plate-zone="${key}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%" aria-label="${label}" aria-pressed="false"><span aria-hidden="true">＋</span></button>`}).join('')}</div></div><div class="plate-caption" role="status"><span class="plate-symbol">↗</span><div><b>У каждого компонента своя работа</b><p>Рассмотри фактуру. Состав и точные доли — в рецептуре.</p></div></div></div>`;
}
export function activatePlate(button,d){
 const board=button.closest('.material-board'),key=button.dataset.plateZone;
 board.querySelectorAll('[data-plate-zone]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
 const c=d.lab.components.find(c=>c.key===key);
 board.querySelector('.plate-caption').innerHTML=key==='peat'?`<span class="plate-symbol">↗</span><div><b>Торфяная основа</b><p>Типы торфа и их доли смотри в рецептуре этого бокса.</p></div>`:`${macro(key,c.name)}<div><b>${escape(c.name)}</b><p>${escape(c.group)} · ${escape(c.spec.value)}</p></div>`;
}
