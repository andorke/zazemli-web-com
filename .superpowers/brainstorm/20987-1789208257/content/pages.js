import {specimen,diaryPhoto} from '/files/photo-story.js';
// Visual exploration only: canonical content is a read-only snapshot of this repository.
import {footer,renderProduct,renderLab,productName} from '/files/narrative.js';
export const pageNames={home:'Главная',collection:'Коллекция',product:'Карточка бокса',lab:'Лаборатория',guide:'Гайд',diary:'Дневник',privacy:'Конфиденциальность',terms:'Условия'};
export const titleCase=s=>s[0].toUpperCase()+s.slice(1);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=(page,label,extra='')=>`<button class="page-link" data-route="${page}" ${extra}>${label} <span>↗</span></button>`;
export function siteFooter(d,page){return footer(d,page)}
function disclosures(items){return items.map(i=>`<details class="fold"><summary>${i.title}</summary><div>${i.body}</div></details>`).join('')}

function guideTip(t){return `<details class="fold"><summary>${esc(t.summary)}</summary>${t.kind==='list'?`<ul>${t.body.map(b=>`<li>${b.lead?`<b>${esc(b.lead)}</b> — `:''}${esc(b.text)}</li>`).join('')}</ul>`:t.body.map(b=>`<p>${esc(b)}</p>`).join('')}</details>`}
function guideStage(s){return `<div class="stage-copy"><div class="micro">Шаг ${esc(s.num)}</div><h2>${esc(s.title)}</h2><ol>${s.steps.map(st=>`<li>${esc(st.text)}${st.subs?`<ul>${st.subs.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}${st.subTip?guideTip(st.subTip):''}${st.subLink?`<a href="${esc(st.subLink.href)}" target="_blank" rel="noreferrer">${esc(st.subLink.label)}</a>`:''}</li>`).join('')}</ol>${s.tips.map(guideTip).join('')}${s.outro?`<p class="care-note">${esc(s.outro)}</p>`:''}</div>`}
function legalBody(doc){return doc.sections.map((s,i)=>`<section id="doc-${i}"><h2>${i+1}. ${esc(s.title)}</h2>${s.body.map(b=>b.kind==='paragraph'?`<p>${esc(b.text)}</p>`:b.kind==='list'?`<${b.ordered?'ol':'ul'}>${b.items.map(t=>`<li>${esc(t)}</li>`).join('')}</${b.ordered?'ol':'ul'}>`:`<p>${esc(doc.operator.legalName)}<br>ОГРНИП ${esc(doc.operator.ogrnip)} · ИНН ${esc(doc.operator.inn)}<br>${esc(doc.operator.email)}</p>`).join('')}</section>`).join('')}
export function renderInterior(concept,page,d,state,helpers){
 if(page==='product')return renderProduct(d,state,helpers);
 if(page==='lab')return renderLab(d,state,helpers);
 const {nav,art}=helpers;

 const head=(kicker,title,sub,photo='herb')=>`<div class="page-head"><div class="head-copy"><div class="micro">${kicker}</div><h1 data-reveal>${title}</h1><p>${sub}</p></div>${art(photo)}</div>`;
 let html='';
 if(page==='collection'){
  html=head('Collectio / семь рецептур','Семь растений.<br><em>Семь боксов.</em>','Выбери свой «Заземли». Внутри — грунт под растение, принадлежности и дневник на год.','box');
  html+=`<div class="collection-list">${d.skus.map((s,i)=>`<button class="plant-row" data-product="${i}"><span class="collection-thumb"><img src="/files/soil-${s.slug}-cutout.webp" alt="Раскладка грунта — ${esc(productName(s))}" loading="lazy"></span><span class="plant-no">0${i+1}</span><span class="plant-name">${esc(productName(s))}<small>${esc(s.latin)}</small></span><span class="plant-tag">${esc(s.tagline)}</span><span class="plant-price">${esc(s.priceFrom)}</span><span class="row-arrow">↗</span></button>`).join('')}</div><div class="quiet-band"><p>Грунт под растение · принадлежности для пересадки · дневник на год</p>${route('lab','Почему семь рецептур')}</div>`;
 }
 if(page==='guide'){
  const branch=state.guideBranch||'entry',g=branch==='entry'?d.guide.guideEntry:branch==='perevalka'?d.guide.guidePerevalka:d.guide.guidePolnayaZamena,index=Math.min(state.step,g.stages.length-1),s=g.stages[index];
  html=head('Гайд / шаг за шагом',branch==='entry'?'Пересадка.<br><em>Без суеты.</em>':branch==='perevalka'?'Бережная<br><em>перевалка.</em>':'Новая земля.<br><em>С самого корня.</em>',esc(g.hero.sub),'hands');
  html+=`<div class="guide-location"><span>${branch==='entry'?'Сначала подготовка и осмотр корней':branch==='perevalka'?'Маршрут: перевалка':'Маршрут: полная замена грунта'}</span>${branch!=='entry'?'<button data-guide="entry">← К подготовке и выбору способа</button>':''}</div><div class="guide-layout"><aside class="step-index">${g.stages.map((s,i)=>`<button data-step="${i}" aria-current="${index===i?'step':'false'}"><span>${esc(s.num)}</span>${esc(s.title)}</button>`).join('')}${branch==='entry'?'<button data-fork>После осмотра → выбрать способ</button>':''}</aside><div>${guideStage(s)}<div class="step-actions"><button data-step="${Math.max(index-1,0)}" ${index===0?'disabled':''}>← Назад</button>${index<g.stages.length-1?`<button data-step="${index+1}">Следующий шаг →</button>`:branch==='entry'?'<button data-fork>Выбрать способ →</button>':'<span>Готово · дальше действуй по дневнику</span>'}</div></div></div>`;
  if(branch==='entry')html+=`<div class="guide-kit reading-block">${disclosures([{title:'Что подготовить',body:`<p>${esc(g.kit.time)}</p><ul>${g.kit.items.map(i=>`<li>${esc(i.text)}${i.note?` — ${esc(i.note)}`:''}</li>`).join('')}</ul>`}])}</div><div class="fork-panel" ${!state.fork?'hidden':''}><div class="micro">После осмотра корней</div><h2>${esc(g.fork.title)}</h2><p>${esc(g.fork.sub)}</p><div class="fork-grid">${g.fork.paths.map((f,i)=>`<article><h3>${esc(f.title)}</h3><p>${esc(f.lede)}</p><b>${esc(f.whenLabel)}</b><ul>${f.when.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><button class="cta" data-guide="${i===0?'perevalka':'full'}">${esc(f.button.label)} →</button></article>`).join('')}</div>${guideTip(g.fork.tip)}</div>`;
 }
 if(page==='guide')html+=`<div class="quiet-band"><p>Грунт и принадлежности для этих шагов уже собраны.</p><button class="cta" data-route="collection">Выбрать бокс <span>↗</span></button></div>`;
 if(page==='diary'){
  html=`<div class="diary-layout"><div class="diary-copy"><div class="micro">Ты здесь по QR из дневника</div><h1 data-reveal>Забота<br><em>продолжается.</em></h1><p>Семь писем за год.<br>От пересадки до следующей весны.</p>${diaryPhoto(d.skus[state.plant],true)}<p class="core">Земля и забота — всё, что нужно</p></div><form class="diary-form"><div class="micro">Дневник растения / письмо первое</div><h2>Пусть придёт<br>вовремя</h2><label class="email-label">Твоя почта<input name="email" type="email" placeholder="name@example.com" autocomplete="off" required></label>${d.diary.form.consents.map((c,i)=>`<label class="consent"><input type="checkbox" name="${c.name}" ${i===0?'required':''}><span>${esc(c.text)}</span></label>`).join('')}${route('privacy','Политика конфиденциальности')}<button class="cta" type="submit">Хочу свой дневник ухода →</button><p class="demo-label">Демо формы · данные не отправляются</p><p class="form-result" role="status" hidden></p></form></div><div class="letters"><h2>Год с растением</h2><div class="letter-tabs">${d.diary.inside.letters.map((l,i)=>`<button data-letter="${i}" aria-pressed="${i===state.letter}">${String(l.n).padStart(2,'0')}<span>${esc(l.when)}</span></button>`).join('')}</div><div class="letter-content"><h3>${esc(d.diary.inside.letters[state.letter].title)}</h3><p>${esc(d.diary.inside.letters[state.letter].text)}</p></div></div>`;
 }
 if(page==='privacy'||page==='terms'){
  const doc=d[page];html=`<div class="legal-heading"><div class="micro">Документы / ${page==='privacy'?'данные':'сайт'}</div><h1>${esc(doc.title)}</h1><p>Редакция от ${esc(doc.effectiveDate)}</p></div><div class="legal-layout"><aside>${doc.sections.map((s,i)=>`<button data-document="${i}">${i+1}. ${esc(s.title)}</button>`).join('')}</aside><article>${legalBody(doc)}</article></div>`;
 }
 return nav()+html+siteFooter(d,page);
}
