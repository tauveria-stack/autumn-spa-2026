const state={scenario:'couple',region:'all',maxPrice:7000,spaOnly:true,data:null};
const money=n=>n?new Intl.NumberFormat('uk-UA').format(n)+' ₴':'уточнюється';
const dateTimeFmt=s=>s?new Intl.DateTimeFormat('uk-UA',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Europe/Kyiv'}).format(new Date(s)):'—';

// Одна візитна фотографія на картку. Беремо насамперед hero/перший промо-кадр
// з офіційного сайту готелю; якщо він не верифікований — лишаємо fallback, а не випадкове фото.
const heroImages={
  'osonnya':{src:'https://osonnya.com/upload/medialibrary/4ce/q4p97o0hy0ts5k3uvn8ygp8oghdkbxn9.jpg',alt:'Осоння Карпати — головний корпус і басейн',source:'Офіційний сайт'},
  'kyivska-russ':{src:'https://kyivskaruss.com.ua/wp-content/uploads/2026/02/q11.jpg.webp',alt:'Карпатська природа біля Kyivska Russ Resort Medical & Spa',source:'Офіційний сайт'},
  'vedmezha-gora':{src:'https://vedmezhagora.com/wp-content/uploads/Vidpochynok-z-basejnom-Karpaty.jpg',alt:'SPA та басейн Vedmezha Gora',source:'Офіційний сайт'},
  'taor':{src:'https://taor.com.ua/wp-content/themes/twentytwenty/img/Rectangle23.jpeg',alt:'TAOR Karpaty Resort & Spa з висоти',source:'Офіційний сайт'},
  'voevodyno':{src:'https://voevodyno.com/wp-content/uploads/2026/08/vasya.shtefaniak-61-1-e1787912451709-optimized.jpg',alt:'Осіння територія курорту Воєводино',source:'Офіційний сайт'}
};

async function load(){
  const res=await fetch('hotels.json',{cache:'no-store'});
  state.data=await res.json();
  document.getElementById('updatedAt').textContent=dateTimeFmt(state.data.meta.updatedAt);
  document.getElementById('auditState').textContent=state.data.meta.status;
  initRegions();bind();render();
}
function initRegions(){
  const select=document.getElementById('regionFilter');
  [...new Set(state.data.hotels.map(h=>h.region))].sort().forEach(r=>{const o=document.createElement('option');o.value=r;o.textContent=r;select.appendChild(o)});
}
function bind(){
  document.querySelectorAll('.seg').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.seg').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.scenario=b.dataset.scenario;render();
  }));
  document.getElementById('regionFilter').addEventListener('change',e=>{state.region=e.target.value;render()});
  document.getElementById('priceFilter').addEventListener('change',e=>{state.maxPrice=Number(e.target.value);render()});
  document.getElementById('spaFilter').addEventListener('change',e=>{state.spaOnly=e.target.checked;render()});
}
function scenarioOf(h){return state.scenario==='couple'?h.couple:h.family}
function effectiveNight(v){
  const offer=v?.bestOffer;
  if(offer?.verified!==false){
    if(offer.pricePerNight)return offer.pricePerNight;
    if(offer.total7Nights)return Math.round(offer.total7Nights/7);
  }
  return v?.pricePerNight||0;
}
function render(){
  const rows=state.data.hotels.map(h=>({...h,view:scenarioOf(h)}))
    .filter(h=>h.view?.eligible!==false)
    .filter(h=>state.region==='all'||h.region===state.region)
    .filter(h=>!effectiveNight(h.view)||effectiveNight(h.view)<=state.maxPrice)
    .filter(h=>!state.spaOnly||h.indoorSpa)
    .sort((a,b)=>(b.view.score||0)-(a.view.score||0));
  renderSummary(rows);renderCards(rows);
}
function renderSummary(rows){
  const known=rows.filter(h=>effectiveNight(h.view));
  const avg=known.length?Math.round(known.reduce((a,h)=>a+effectiveNight(h.view),0)/known.length):0;
  document.getElementById('summary').innerHTML=`<span class="summary-pill"><strong>${rows.length}</strong> кандидатів</span><span class="summary-pill">Сценарій: <strong>${state.scenario==='couple'?'2 дорослих':'2 дорослих + дитина 10 років'}</strong></span>${avg?`<span class="summary-pill">Середня найкраща ціна: <strong>${money(avg)}/ніч</strong></span>`:''}`;
}
function setupPhoto(node,h){
  const media=node.querySelector('.hotel-media');
  const img=node.querySelector('.hotel-photo');
  const source=node.querySelector('.photo-source');
  const info=heroImages[h.id];
  if(!info){img.removeAttribute('src');img.alt='';source.textContent='Фото добирається';return}
  img.alt=info.alt||h.name;
  img.onload=()=>media.classList.add('has-photo');
  img.onerror=()=>{media.classList.remove('has-photo');source.textContent='Фото тимчасово недоступне'};
  img.src=info.src;
  source.textContent='Фото: '+info.source;
}
function setupBestOffer(node,v){
  const box=node.querySelector('.best-offer');
  const o=v?.bestOffer;
  if(!o||o.verified===false||(!o.total7Nights&&!o.pricePerNight)){box.hidden=true;return}
  box.hidden=false;
  node.querySelector('.best-offer-source').textContent=o.source||'Перевірене джерело';
  const total=o.total7Nights||(o.pricePerNight?o.pricePerNight*7:0);
  node.querySelector('.best-offer-price').textContent=total?`${money(total)} за 7 ночей`:money(o.pricePerNight);
  const saving=[];
  if(o.savingAmount)saving.push(`−${money(o.savingAmount)}`);
  if(o.savingPercent)saving.push(`−${o.savingPercent}%`);
  node.querySelector('.best-offer-saving').textContent=saving.join(' · ');
  node.querySelector('.best-offer-note').textContent=o.note||'Умови пропозиції перевірені для цього сценарію; деталі дивись у джерелі.';
  const a=node.querySelector('.best-offer-link');
  if(o.url){a.href=o.url;a.hidden=false}else{a.hidden=true}
}
function renderCards(rows){
  const grid=document.getElementById('hotelGrid');grid.innerHTML='';
  if(!rows.length){grid.innerHTML='<div class="empty">За цими фільтрами кандидатів поки немає.</div>';return}
  rows.forEach((h,i)=>{
    const node=document.getElementById('hotelCardTemplate').content.cloneNode(true);const v=h.view;
    setupPhoto(node,h);setupBestOffer(node,v);
    node.querySelector('.rank-badge').textContent='#'+(i+1);
    node.querySelector('.location').textContent=`${h.location} · ${h.region}`;
    node.querySelector('.hotel-name').textContent=h.name;
    node.querySelector('.score').textContent=(v.score||0).toFixed(1);
    node.querySelector('.verdict').textContent=v.verdict;
    node.querySelector('.night-price').textContent=money(v.pricePerNight);
    node.querySelector('.week-price').textContent=money(v.total7Nights||(v.pricePerNight?v.pricePerNight*7:0));
    node.querySelector('.value-score').textContent=v.value||'—';
    const chips=[];
    if(h.indoorSpa)chips.push('<span class="chip good">Критий SPA</span>');
    if(h.thermal)chips.push('<span class="chip good">Термальні води</span>');
    if(v.meals)chips.push(`<span class="chip">${v.meals}</span>`);
    if(v.bestOffer?.source)chips.push(`<span class="chip good">Best price: ${v.bestOffer.source}</span>`);
    if(v.priceStatus==='live')chips.push('<span class="chip good">Базова ціна перевірена</span>');
    if(v.priceStatus==='estimate')chips.push('<span class="chip warn">Базова ціна орієнтовна</span>');
    node.querySelector('.chips').innerHTML=chips.join('');
    node.querySelector('.pros').innerHTML=(v.pros||[]).map(x=>`<li>${x}</li>`).join('');
    node.querySelector('.cons').innerHTML=(v.cons||[]).map(x=>`<li>${x}</li>`).join('');
    node.querySelector('.details').textContent=v.included||'Склад тарифу уточнюється під час аудиту.';
    node.querySelector('.checked').textContent=`Перевірено: ${dateTimeFmt(h.checkedAt)} · Київ`;
    const a=node.querySelector('.hotel-link');a.href=h.url;
    grid.appendChild(node);
  });
}
load().catch(err=>{console.error(err);document.getElementById('hotelGrid').innerHTML='<div class="empty">Не вдалося завантажити базу готелів.</div>'});
