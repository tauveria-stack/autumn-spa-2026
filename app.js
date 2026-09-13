const state={scenario:'couple',region:'all',maxPrice:7000,spaOnly:true,data:null};
const money=n=>n?new Intl.NumberFormat('uk-UA').format(n)+' ₴':'уточнюється';
const dateFmt=s=>s?new Intl.DateTimeFormat('uk-UA',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(s)):'—';

async function load(){
  const res=await fetch('hotels.json',{cache:'no-store'});
  state.data=await res.json();
  document.getElementById('updatedAt').textContent=dateFmt(state.data.meta.updatedAt);
  document.getElementById('auditState').textContent=state.data.meta.status;
  initRegions(); bind(); render();
}
function initRegions(){
  const select=document.getElementById('regionFilter');
  [...new Set(state.data.hotels.map(h=>h.region))].sort().forEach(r=>{
    const o=document.createElement('option');o.value=r;o.textContent=r;select.appendChild(o);
  });
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
function renderCards(rows){
  const grid=document.getElementById('hotelGrid');grid.innerHTML='';
  if(!rows.length){grid.innerHTML='<div class="empty">За цими фільтрами кандидатів поки немає.</div>';return}
  rows.forEach((h,i)=>{
    const node=document.getElementById('hotelCardTemplate').content.cloneNode(true);const v=h.view;
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
    if(v.priceStatus==='live')chips.push('<span class="chip good">Ціна перевірена</span>');
    if(v.priceStatus==='estimate')chips.push('<span class="chip warn">Орієнтовна ціна</span>');
    node.querySelector('.chips').innerHTML=chips.join('');
    node.querySelector('.pros').innerHTML=(v.pros||[]).map(x=>`<li>${x}</li>`).join('');
    node.querySelector('.cons').innerHTML=(v.cons||[]).map(x=>`<li>${x}</li>`).join('');
    node.querySelector('.details').textContent=v.included||'Склад тарифу уточнюється під час аудиту.';
    node.querySelector('.checked').textContent=`Перевірено: ${dateFmt(h.checkedAt)}`;
    const a=node.querySelector('.hotel-link');a.href=h.url;
    grid.appendChild(node);
  });
}
load().catch(err=>{console.error(err);document.getElementById('hotelGrid').innerHTML='<div class="empty">Не вдалося завантажити базу готелів.</div>'});
