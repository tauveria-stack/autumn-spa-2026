const state={scenario:'couple',region:'all',maxPrice:999999,spaOnly:false,data:null};
const money=n=>n?new Intl.NumberFormat('uk-UA').format(Math.round(n))+' ₴':'уточнюється';
const dateTimeFmt=s=>s?new Intl.DateTimeFormat('uk-UA',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Europe/Kyiv'}).format(new Date(s)):'—';
const humanize=text=>String(text??'')
  .replaceAll('потрібно перевірити силу критої SPA-зони наприкінці жовтня','потрібно уточнити, які саме криті басейни та SPA-зони працюють наприкінці жовтня')
  .replaceAll('indoor-дозвілля','розваги в приміщенні')
  .replaceAll('value-кандидатів','варіантів')
  .replaceAll('сімейний value','співвідношення ціни та сімейних можливостей')
  .replaceAll('осіння придатність','наскільки готель підходить для відпочинку наприкінці жовтня');

const heroImages={
  'osonnya':{src:'https://osonnya.com/upload/medialibrary/4ce/q4p97o0hy0ts5k3uvn8ygp8oghdkbxn9.jpg',alt:'Осоння Карпати — головний корпус і басейн',source:'Офіційний сайт'},
  'kyivska-russ':{src:'https://kyivskaruss.com.ua/wp-content/uploads/2026/02/q11.jpg.webp',alt:'Карпатська природа біля Kyivska Russ Resort Medical & Spa',source:'Офіційний сайт'},
  'vedmezha-gora':{src:'https://vedmezhagora.com/wp-content/uploads/Vidpochynok-z-basejnom-Karpaty.jpg',alt:'SPA та басейн Vedmezha Gora',source:'Офіційний сайт'},
  'taor':{src:'https://taor.com.ua/wp-content/themes/twentytwenty/img/Rectangle23.jpeg',alt:'TAOR Karpaty Resort & Spa з висоти',source:'Офіційний сайт'},
  'voevodyno':{src:'https://voevodyno.com/wp-content/uploads/2026/08/vasya.shtefaniak-61-1-e1787912451709-optimized.jpg',alt:'Осіння територія курорту Воєводино',source:'Офіційний сайт'}
};

async function load(){
  const [baseRes,extraRes]=await Promise.all([
    fetch('hotels.json',{cache:'no-store'}),
    fetch('hotels-20260914.json',{cache:'no-store'}).catch(()=>null)
  ]);
  if(!baseRes.ok)throw new Error(`hotels.json: HTTP ${baseRes.status}`);
  const base=await baseRes.json();
  let extra=null;
  if(extraRes?.ok)extra=await extraRes.json();
  const byId=new Map(base.hotels.map(h=>[h.id,h]));
  (extra?.hotels||[]).forEach(h=>byId.set(h.id,h));
  state.data={...base,hotels:[...byId.values()],meta:{...base.meta,...(extra?.meta||{})}};
  document.getElementById('updatedAt').textContent=dateTimeFmt(state.data.meta.updatedAt);
  document.getElementById('auditState').textContent=humanize(state.data.meta.status);
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
function render(){
  const rows=state.data.hotels.map(h=>({...h,view:scenarioOf(h)}))
    .filter(h=>h.view?.eligible!==false)
    .filter(h=>state.region==='all'||h.region===state.region)
    .filter(h=>!h.view.pricePerNight||h.view.pricePerNight<=state.maxPrice)
    .filter(h=>!state.spaOnly||h.indoorSpa)
    .sort((a,b)=>(b.view.score||0)-(a.view.score||0));
  renderSummary(rows);renderCards(rows);
}
function renderSummary(rows){
  const known=rows.filter(h=>h.view.pricePerNight);
  const avg=known.length?Math.round(known.reduce((a,h)=>a+h.view.pricePerNight,0)/known.length):0;
  document.getElementById('summary').innerHTML=`<span class="summary-pill"><strong>${rows.length}</strong> кандидатів</span><span class="summary-pill">Сценарій: <strong>${state.scenario==='couple'?'2 дорослих':'2 дорослих + дитина 10 років'}</strong></span>${avg?`<span class="summary-pill">Середня ціна: <strong>${money(avg)}/ніч</strong></span>`:''}`;
}
function setupPhoto(node,h){
  const media=node.querySelector('.hotel-media');
  const img=node.querySelector('.hotel-photo');
  const source=node.querySelector('.photo-source');
  if(!media||!img||!source)return;
  const info=h.hero||heroImages[h.id];
  if(!info){img.removeAttribute('src');img.alt='';source.textContent='Фото поки відсутнє';return}
  img.alt=info.alt||h.name;
  img.onload=()=>media.classList.add('has-photo');
  img.onerror=()=>{media.classList.remove('has-photo');source.textContent='Фото поки відсутнє'};
  img.src=info.src;
  source.textContent='Фото: '+info.source;
}
function renderCards(rows){
  const grid=document.getElementById('hotelGrid');grid.innerHTML='';
  if(!rows.length){grid.innerHTML='<div class="empty">За цими фільтрами кандидатів поки немає.</div>';return}
  rows.forEach((h,i)=>{
    const node=document.getElementById('hotelCardTemplate').content.cloneNode(true);const v=h.view;
    setupPhoto(node,h);
    node.querySelector('.rank-badge').textContent='#'+(i+1);
    node.querySelector('.location').textContent=`${h.location} · ${h.region}`;
    node.querySelector('.hotel-name').textContent=h.name;
    node.querySelector('.score').textContent=(v.score||0).toFixed(1);
    node.querySelector('.verdict').textContent=humanize(v.verdict);
    node.querySelector('.night-price').textContent=money(v.pricePerNight);
    node.querySelector('.week-price').textContent=money(v.total7Nights||(v.pricePerNight?v.pricePerNight*7:0));
    node.querySelector('.value-score').textContent=v.value||'—';
    const chips=[];
    if(h.indoorSpa)chips.push('<span class="chip good">Критий SPA</span>');
    if(h.thermal)chips.push('<span class="chip good">Термальні води</span>');
    if(v.meals)chips.push(`<span class="chip">${humanize(v.meals)}</span>`);
    if(v.priceStatus==='live')chips.push('<span class="chip good">Ціна перевірена</span>');
    if(v.priceStatus==='estimate')chips.push('<span class="chip warn">Орієнтовна ціна</span>');
    node.querySelector('.chips').innerHTML=chips.join('');
    node.querySelector('.pros').innerHTML=(v.pros||[]).map(x=>`<li>${humanize(x)}</li>`).join('');
    node.querySelector('.cons').innerHTML=(v.cons||[]).map(x=>`<li>${humanize(x)}</li>`).join('');
    node.querySelector('.details').textContent=humanize(v.included||'Склад тарифу потрібно уточнити.');
    node.querySelector('.checked').textContent=`Перевірено: ${dateTimeFmt(h.checkedAt)} · Київ`;
    const a=node.querySelector('.hotel-link');a.href=h.url;
    grid.appendChild(node);
  });
}
load().catch(err=>{
  console.error(err);
  const grid=document.getElementById('hotelGrid');
  if(grid)grid.innerHTML=`<div class="empty">Не вдалося завантажити базу готелів.<br><small>${String(err?.message||err)}</small></div>`;
});