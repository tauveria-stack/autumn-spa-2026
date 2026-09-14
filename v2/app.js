const D=globalThis.Travel2Domain,R=globalThis.Travel2Ranking,A=globalThis.Travel2HotelBase,KEY='travel2.profile.v2';
if(!D||!R||!A)throw Error('Travel2 runtime missing');
let base,hotels=[],profile;
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dest={ukraine:'Україна',europe:'Європа',sea:'Море',cruise:'Круїз',mountains:'Гори',anywhere:'Будь-куди',worldwide:'Worldwide'};
const dateModes={exact:'Точні дати',flexible:'Гнучко',season:'Пора року',schoolHoliday:'Канікули'};
const seasons={winter:'Зима',spring:'Весна',summer:'Літо',autumn:'Осінь'};
const holidays={autumn:'Осінні',winter:'Зимові',spring:'Весняні',summer:'Літні'};
const prefs={quiet:'Тиша',coziness:'Затишок',spa:'SPA',waterparks:'Аквапарки',pools:'Басейни',amusement:'Атракціони',nature:'Природа',mountains:'Гори',active:'Активний відпочинок',calm:'Спокійний відпочинок',kids:'Дітям',culture:'Екскурсії',entertainment:'Двіж'};
const discountLabels={combat_veteran:'УБД',disability:'Особа з інвалідністю',disability_group_1:'I група інвалідності',war_disability:'Інвалідність внаслідок війни',birthday:'Іменинник'};
function load(){try{return Object.assign(structuredClone(base),JSON.parse(localStorage.getItem(KEY))||{})}catch{return structuredClone(base)}}
function save(){localStorage.setItem(KEY,JSON.stringify(profile))}
function setDest(v){profile.destinationMode=v;profile.rankingMode=['sea','worldwide'].includes(v)?v:'ukraine';save();draw()}
function toggleGeography(key){
 const current=R.selectedGeography(profile);
 profile.geography=current.includes(key)?current.filter(x=>x!==key):[...current,key];
 save();draw();
}
function toggleDiscount(type){
 const selected=R.selectedPersonalDiscountTypes(profile);
 profile.personalDiscountTypes=selected.includes(type)?selected.filter(x=>x!==type):[...selected,type];
 save();draw();
}
function dateFields(){
 const d=profile.date||{};
 if(d.mode==='flexible')return `<label>Від <input data-date="flexFrom" type="date" value="${esc(d.flexFrom||'')}"></label><label>До <input data-date="flexTo" type="date" value="${esc(d.flexTo||'')}"></label>`;
 if(d.mode==='season')return `<label>Пора року <select data-date="season">${Object.entries(seasons).map(([v,l])=>`<option value="${v}" ${d.season===v?'selected':''}>${l}</option>`).join('')}</select></label>`;
 if(d.mode==='schoolHoliday')return `<label>Канікули <select data-date="schoolHoliday">${Object.entries(holidays).map(([v,l])=>`<option value="${v}" ${d.schoolHoliday===v?'selected':''}>${l}</option>`).join('')}</select></label>`;
 return `<label>Заїзд <input data-date="checkIn" type="date" value="${esc(d.checkIn||'')}"></label><label>Виїзд <input data-date="checkOut" type="date" value="${esc(d.checkOut||'')}"></label>`;
}
function geographyControls(){
 if(['europe','sea','cruise'].includes(profile.destinationMode))return '';
 const selected=R.selectedGeography(profile);
 return `<h3>Де саме?</h3><div class="chips"><button data-geo-all="1" class="chip ${selected.length?'':'active'}">Вся Україна</button>${Object.entries(D.TAXONOMY).map(([k,v])=>`<button data-geo="${k}" class="chip ${selected.includes(k)?'active':''}">${esc(v.label)}</button>`).join('')}</div>`;
}
function controls(){
 const canRemove=profile.travellers.length>1;
 $('profileControls').innerHTML=`<h3>Куди?</h3><div class="chips">${Object.entries(dest).map(([v,l])=>`<button data-dest="${v}" class="chip ${profile.destinationMode===v?'active':''}">${l}</button>`).join('')}</div>${geographyControls()}<h3>Коли?</h3><div class="chips">${Object.entries(dateModes).map(([v,l])=>`<button data-date-mode="${v}" class="chip ${profile.date?.mode===v?'active':''}">${l}</button>`).join('')}</div><div id="dateFields">${dateFields()}</div><h3>Хто їде?</h3><div id="people">${profile.travellers.map((t,i)=>`<div class="traveller"><label>${esc(t.label)} <input data-age="${i}" type="number" min="0" max="120" value="${Number(t.age)||0}"></label>${canRemove?`<button type="button" data-remove="${i}" aria-label="Прибрати ${esc(t.label)}">− Прибрати</button>`:''}</div>`).join('')}</div><button id="add" ${profile.travellers.length>=5?'disabled':''}>+ Додати</button><h3>Бюджет / ніч</h3><input id="budget" type="number" min="1000" step="500" value="${Number(profile.budgetPerNight)||7000}"><h3>Персональні знижки</h3><div class="chips">${Object.entries(discountLabels).map(([k,l])=>`<button type="button" data-discount="${k}" class="chip ${R.selectedPersonalDiscountTypes(profile).includes(k)?'active':''}">${esc(l)}</button>`).join('')}</div><h3>Що важливо?</h3>${Object.entries(prefs).map(([k,l])=>`<label class="slider"><span>${l}</span><input data-pref="${k}" type="range" min="0" max="5" value="${Number(profile.preferences?.[k])||0}"><b>${Number(profile.preferences?.[k])||0}</b></label>`).join('')}`;
 document.querySelectorAll('[data-dest]').forEach(b=>b.onclick=()=>setDest(b.dataset.dest));
 document.querySelectorAll('[data-geo]').forEach(b=>b.onclick=()=>toggleGeography(b.dataset.geo));
 const allGeo=document.querySelector('[data-geo-all]');if(allGeo)allGeo.onclick=()=>{profile.geography=[];save();draw()};
 document.querySelectorAll('[data-date-mode]').forEach(b=>b.onclick=()=>{profile.date={...base.date,...profile.date,mode:b.dataset.dateMode};save();draw()});
 $('dateFields').onchange=e=>{const k=e.target.dataset.date;if(k){profile.date={...base.date,...profile.date,[k]:e.target.value};save();results()}};
 document.querySelectorAll('[data-discount]').forEach(b=>b.onclick=()=>toggleDiscount(b.dataset.discount));
 document.querySelectorAll('[data-pref]').forEach(x=>x.oninput=()=>{profile.preferences[x.dataset.pref]=+x.value;x.nextElementSibling.textContent=x.value;save();results()});
 $('people').onchange=e=>{if(e.target.dataset.age!==undefined){profile.travellers[+e.target.dataset.age].age=Math.max(0,Math.min(120,+e.target.value||0));save();draw()}};
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{if(profile.travellers.length<=1)return;profile.travellers.splice(+b.dataset.remove,1);profile.travellers.forEach((t,i)=>t.label=`Мандрівник ${i+1}`);save();draw()});
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
function geographySummary(){const g=R.selectedGeography(profile);return g.length?g.map(k=>D.TAXONOMY[k].label).join(' + '):'вся Україна'}
function pricePresentation(snapshot){
 if(snapshot?.coverageStatus==='date_mismatch')return {price:'Актуальна ціна потребує перевірки',detail:'У базі є пропозиція для іншого періоду — її не використовуємо для вашого бюджету'};
 const before=snapshot?.best_offer_before_personal_discount||snapshot?.regular_price;
 const final=snapshot?.final_price_after_personal_discounts;
 if(snapshot?.discount_status==='confirmed'&&final>0&&before>0&&final<before)return {price:`${final.toLocaleString('uk-UA')} грн / ніч`,detail:`Після підтвердженої персональної знижки · до знижки ${before.toLocaleString('uk-UA')} грн`};
 if(snapshot?.discount_status==='needs_confirmation'&&before>0)return {price:`${before.toLocaleString('uk-UA')} грн / ніч`,detail:'Персональну знижку знайдено, але її умови або сумування ще треба підтвердити'};
 if(snapshot?.regular_price)return {price:`${snapshot.regular_price.toLocaleString('uk-UA')} грн / ніч`,detail:'Ціна відповідає вибраним датам'};
 return {price:'Ціна потребує перевірки',detail:'Для цього сценарію ще немає підтвердженої ціни'};
}
function effectivePrice(snapshot){
 if(snapshot?.discount_status==='confirmed'&&snapshot?.final_price_after_personal_discounts>0)return snapshot.final_price_after_personal_discounts;
 return snapshot?.best_offer_before_personal_discount||snapshot?.regular_price||null;
}
function availabilityPresentation(snapshot){
 const v=snapshot?.availability;
 if(v==='confirmed'||v===true)return 'Наявність підтверджена';
 if(v==='unavailable'||v===false)return 'Немає місць';
 return 'Наявність для ваших дат треба перевірити';
}
function resultCard(x){
 const pp=pricePresentation(x.snapshot),budget=effectivePrice(x.snapshot)?` · бюджет ${Math.round(x.budgetFit*100)}%`:'';
 return `<article class="card"><div class="cardtop"><h3>${esc(x.hotel.name)}</h3><div class="score">${x.profileScore.toFixed(1)}<small>/10</small></div></div><div class="meta">${esc(x.hotel.location)} · ${(x.taxonomy||[]).map(k=>esc(D.TAXONOMY[k]?.label||k)).join(' · ')}</div><div class="price">${esc(pp.price)}</div><div class="hint">${esc(pp.detail)}</div><p>${esc(x.variant.verdict||'')}</p><div class="hint">Відповідність побажанням ${Math.round(x.preferenceFit*100)}%${budget} · ${esc(availabilityPresentation(x.snapshot))}</div></article>`;
}
function results(){
 const ranked=R.rankHotels(hotels,profile),n=R.nights(profile),limit=R.shortlistLimit(profile.maxShortlist),ages=profile.travellers.map(t=>Number(t.age)||0).join(', '),geo=['europe','sea','cruise'].includes(profile.destinationMode)?'':` · ${geographySummary()}`,discounts=R.selectedPersonalDiscountTypes(profile),discountSummary=discounts.length?` · пільги: ${discounts.map(k=>discountLabels[k]).join(', ')}`:'';
 $('profileSummary').textContent=`${profile.travellers.length} ос. (${ages} р.) · ${R.groupType(profile)==='family'?'сімейний':'дорослий'} профіль${geo} · ${dateSummary()}${n?` · ${n} ночей`:''} · ${Number(profile.budgetPerNight).toLocaleString('uk-UA')} грн/ніч${discountSummary}`;
 $('status').textContent=`${ranked.length} кандидатів · показуємо до ${limit} найкращих · база готелів актуальна`;
 $('results').innerHTML=ranked.map(resultCard).join('')||'<p>Для цього режиму підключених кандидатів поки немає.</p>';
}
function draw(){controls();results()}
Promise.all([fetch('profile.json',{cache:'no-store'}).then(r=>r.json()),A.loadHotelBase()]).then(([p,h])=>{base=p;base.version=2;base.geography=Array.isArray(base.geography)?base.geography:[];base.personalDiscountTypes=R.selectedPersonalDiscountTypes(base);base.preferences={quiet:5,coziness:4,spa:5,waterparks:0,pools:4,amusement:0,nature:5,mountains:4,active:2,calm:5,kids:0,culture:2,entertainment:1,...base.preferences};hotels=h.hotels;profile=load();profile.date={...base.date,...profile.date};profile.preferences={...base.preferences,...profile.preferences};profile.geography=R.selectedGeography(profile);profile.personalDiscountTypes=R.selectedPersonalDiscountTypes(profile);if(!Array.isArray(profile.travellers)||!profile.travellers.length)profile.travellers=structuredClone(base.travellers);profile.travellers=profile.travellers.slice(0,5).map((t,i)=>({label:`Мандрівник ${i+1}`,age:Math.max(0,Math.min(120,Number(t?.age)||0))}));document.body.dataset.travel2='ready';draw()}).catch(e=>{$('status').textContent='Помилка завантаження: '+e.message});
