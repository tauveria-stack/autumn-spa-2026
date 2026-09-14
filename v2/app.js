const D=globalThis.Travel2Domain,R=globalThis.Travel2Ranking,A=globalThis.Travel2HotelBase,KEY='travel2.profile.v2';
if(!D||!R||!A)throw Error('Travel2 runtime missing');
let base,hotels=[],profile;
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
const dest={ukraine:'Україна',europe:'Європа',sea:'Море',cruise:'Круїз',mountains:'Гори',anywhere:'Будь-куди',worldwide:'Worldwide'};
const dateModes={exact:'Точні дати',flexible:'Гнучко',season:'Пора року',schoolHoliday:'Канікули'};
const seasons={winter:'Зима',spring:'Весна',summer:'Літо',autumn:'Осінь'};
const holidays={autumn:'Осінні',winter:'Зимові',spring:'Весняні',summer:'Літні'};
const prefs={quiet:'Тиша',coziness:'Затишок',spa:'SPA',waterparks:'Аквапарки',pools:'Басейни',amusement:'Атракціони',nature:'Природа',mountains:'Гори',active:'Активний відпочинок',calm:'Спокійний відпочинок',kids:'Дітям',culture:'Екскурсії',entertainment:'Двіж'};
function load(){try{return Object.assign(structuredClone(base),JSON.parse(localStorage.getItem(KEY))||{})}catch{return structuredClone(base)}}
function save(){localStorage.setItem(KEY,JSON.stringify(profile))}
function setDest(v){profile.destinationMode=v;profile.rankingMode=['sea','worldwide'].includes(v)?v:'ukraine';save();draw()}
function dateFields(){
 const d=profile.date||{};
 if(d.mode==='flexible')return `<label>Від <input data-date="flexFrom" type="date" value="${esc(d.flexFrom||'')}"></label><label>До <input data-date="flexTo" type="date" value="${esc(d.flexTo||'')}"></label>`;
 if(d.mode==='season')return `<label>Пора року <select data-date="season">${Object.entries(seasons).map(([v,l])=>`<option value="${v}" ${d.season===v?'selected':''}>${l}</option>`).join('')}</select></label>`;
 if(d.mode==='schoolHoliday')return `<label>Канікули <select data-date="schoolHoliday">${Object.entries(holidays).map(([v,l])=>`<option value="${v}" ${d.schoolHoliday===v?'selected':''}>${l}</option>`).join('')}</select></label>`;
 return `<label>Заїзд <input data-date="checkIn" type="date" value="${esc(d.checkIn||'')}"></label><label>Виїзд <input data-date="checkOut" type="date" value="${esc(d.checkOut||'')}"></label>`;
}
function controls(){
 $('profileControls').innerHTML=`<h3>Куди?</h3><div class="chips">${Object.entries(dest).map(([v,l])=>`<button data-dest="${v}" class="chip ${profile.destinationMode===v?'active':''}">${l}</button>`).join('')}</div><h3>Коли?</h3><div class="chips">${Object.entries(dateModes).map(([v,l])=>`<button data-date-mode="${v}" class="chip ${profile.date?.mode===v?'active':''}">${l}</button>`).join('')}</div><div id="dateFields">${dateFields()}</div><h3>Хто їде?</h3><div id="people">${profile.travellers.map((t,i)=>`<label>${esc(t.label)} <input data-age="${i}" type="number" min="0" max="120" value="${Number(t.age)||0}"></label>`).join('')}</div><button id="add">+ Додати</button><h3>Бюджет / ніч</h3><input id="budget" type="number" min="1000" step="500" value="${Number(profile.budgetPerNight)||7000}"><h3>Що важливо?</h3>${Object.entries(prefs).map(([k,l])=>`<label class="slider"><span>${l}</span><input data-pref="${k}" type="range" min="0" max="5" value="${Number(profile.preferences?.[k])||0}"><b>${Number(profile.preferences?.[k])||0}</b></label>`).join('')}`;
 document.querySelectorAll('[data-dest]').forEach(b=>b.onclick=()=>setDest(b.dataset.dest));
 document.querySelectorAll('[data-date-mode]').forEach(b=>b.onclick=()=>{profile.date={...base.date,...profile.date,mode:b.dataset.dateMode};save();draw()});
 $('dateFields').onchange=e=>{const k=e.target.dataset.date;if(k){profile.date={...base.date,...profile.date,[k]:e.target.value};save();results()}};
 document.querySelectorAll('[data-pref]').forEach(x=>x.oninput=()=>{profile.preferences[x.dataset.pref]=+x.value;x.nextElementSibling.textContent=x.value;save();results()});
 $('people').onchange=e=>{if(e.target.dataset.age!==undefined){profile.travellers[+e.target.dataset.age].age=Math.max(0,Math.min(120,+e.target.value||0));save();draw()}};
 $('add').onclick=()=>{if(profile.travellers.length<5){profile.travellers.push({label:`Мандрівник ${profile.travellers.length+1}`,age:18});save();draw()}};
 $('budget').onchange=e=>{profile.budgetPerNight=+e.target.value||0;save();results()};
}
function dateSummary(){
 const d=profile.date||{};
 if(d.mode==='exact')return `${d.checkIn||'—'} → ${d.checkOut||'—'}`;
 if(d.mode==='flexible')return `гнучко ${d.flexFrom||'—'} → ${d.flexTo||'—'}`;
 if(d.mode==='season')return seasons[d.season]||'Пора року';
 return `${holidays[d.schoolHoliday]||'Канікули'} канікули`;
}
function results(){
 const ranked=R.rankHotels(hotels,profile),n=R.nights(profile),limit=R.shortlistLimit(profile.maxShortlist);
 $('profileSummary').textContent=`${profile.travellers.length} ос. · ${R.groupType(profile)==='family'?'сімейний':'дорослий'} профіль · ${dateSummary()}${n?` · ${n} ночей`:''} · ${Number(profile.budgetPerNight).toLocaleString('uk-UA')} грн/ніч`;
 $('status').textContent=`${ranked.length} кандидатів · shortlist до ${limit} · ranking ${D.normalizeRankingMode(profile.rankingMode)} · production hotel base`;
 $('results').innerHTML=ranked.map(x=>`<article class="card"><div class="cardtop"><h3>${esc(x.hotel.name)}</h3><div class="score">${x.profileScore.toFixed(1)}<small>/10</small></div></div><div class="meta">${esc(x.hotel.location)} · ${(x.taxonomy||[]).map(k=>esc(D.TAXONOMY[k]?.label||k)).join(' · ')}</div><div class="price">${x.snapshot.regular_price?x.snapshot.regular_price.toLocaleString('uk-UA')+' грн / ніч':'Ціна уточнюється'}</div><p>${esc(x.variant.verdict||'')}</p><div class="hint">budget ${Math.round(x.budgetFit*100)}% · preference ${Math.round(x.preferenceFit*100)}% · ${esc(x.snapshot.availability)}</div></article>`).join('')||'<p>Для цього режиму підключених кандидатів поки немає.</p>';
}
function draw(){controls();results()}
Promise.all([fetch('profile.json',{cache:'no-store'}).then(r=>r.json()),A.loadHotelBase()]).then(([p,h])=>{base=p;base.version=2;base.preferences={quiet:5,coziness:4,spa:5,waterparks:0,pools:4,amusement:0,nature:5,mountains:4,active:2,calm:5,kids:0,culture:2,entertainment:1,...base.preferences};hotels=h.hotels;profile=load();profile.date={...base.date,...profile.date};profile.preferences={...base.preferences,...profile.preferences};document.body.dataset.travel2='ready';draw()}).catch(e=>{$('status').textContent='Помилка завантаження: '+e.message});
