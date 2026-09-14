(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.Travel2Domain=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const TAXONOMY={
    prykarpattia:{label:'Прикарпаття',tokens:['прикарпат','івано-франків','яремче','татарів','микулич','буковел','поляниц']},
    zakarpattia:{label:'Закарпаття',tokens:['закарпат','мукач','ужгород','сваляв','поляна','косино','берег']},
    high_carpathians:{label:'Високі Карпати',tokens:['високі карпати','драгобрат','ясіня','кваси','рахів','ворохта','чорногора']},
    pearls_ukraine:{label:'Перлини України',tokens:[]}
  };
  const RANKING_MODES=['ukraine','worldwide','sea'];
  const DISCOUNT_TYPES=['combat_veteran','disability','disability_group_1','war_disability','birthday'];
  const SCHOOL_HOLIDAY_CALENDARS={
    kyiv:{
      label:'Київ',
      authority:'КМДА / Департамент освіти і науки',
      source:'https://kyivcity.gov.ua/news/grafik_kanikul_20262027_kiv_rekomenduvav_strukturu_nastupnogo_shkilnogo_roku/',
      status:'recommended',
      checkedAt:'2026-09-15',
      years:{
        2026:{autumn:{from:'2026-10-26',to:'2026-11-01'},winter:{from:'2026-12-24',to:'2027-01-10'}},
        2027:{winter:{from:'2026-12-24',to:'2027-01-10'},spring:{from:'2027-03-22',to:'2027-03-28'}}
      }
    }
  };
  const textOf=h=>[h?.name,h?.location,h?.region,h?.group].filter(Boolean).join(' ').toLowerCase();
  const positiveNumber=value=>{const n=Number(value);return Number.isFinite(n)&&n>0?n:null};
  function classifyUkraineHotel(h){
    const text=textOf(h), out=[];
    for(const [key,def] of Object.entries(TAXONOMY)){
      if(key==='pearls_ukraine') continue;
      if(def.tokens.some(t=>text.includes(t))) out.push(key);
    }
    if(!out.length) out.push('pearls_ukraine');
    return [...new Set(out)];
  }
  function normalizeRankingMode(mode){return RANKING_MODES.includes(mode)?mode:'ukraine'}
  function resolveSchoolHoliday({region='kyiv',year,holiday}={}){
    const calendar=SCHOOL_HOLIDAY_CALENDARS[region];
    const window=calendar?.years?.[Number(year)]?.[holiday];
    if(!calendar||!window?.from||!window?.to)return null;
    return {region,label:calendar.label,holiday,from:window.from,to:window.to,authority:calendar.authority,source:calendar.source,status:calendar.status,checkedAt:calendar.checkedAt};
  }
  function createSearchSnapshot({hotelId,profileKind,variant={},checkedAt=null,source=null}){
    const legacy=positiveNumber(variant.pricePerNight);
    const regular=positiveNumber(variant.regularPricePerNight ?? variant.regular_price) ?? legacy;
    const best=positiveNumber(variant.bestOfferPerNight ?? variant.best_offer_before_personal_discount) ?? legacy ?? regular;
    const priceStatus=variant.priceStatus||'unknown';
    return {
      schemaVersion:1,hotelId,profileKind,
      availability:priceStatus==='unknown'?'needs_confirmation':'candidate',
      price_status:priceStatus,
      regular_price:regular,
      best_offer_before_personal_discount:best,
      final_price_after_personal_discounts:best,
      totalPrice:positiveNumber(variant.totalPrice ?? variant.total7Nights),
      room:variant.room||null,
      inclusions:variant.included||'',meals:variant.meals||'',
      cancellation:variant.cancellation||'needs_confirmation',
      childSupplement:profileKind==='family'?(variant.childSupplement||'embedded_or_needs_confirmation'):null,
      checkedAt,source,discounts:[]
    };
  }
  function normalizeDiscount(d={}){
    const type=DISCOUNT_TYPES.includes(d.discount_type)?d.discount_type:null;
    return {
      discount_type:type,discount_value:Number(d.discount_value)||0,
      value_type:d.value_type==='fixed'?'fixed':'percent',
      eligibility:d.eligibility||null,required_documents:d.required_documents||[],
      valid_window:d.valid_window||null,applies_to:d.applies_to||'room',
      source:d.source||null,stacking_rule:d.stacking_rule||'needs_confirmation',
      checkedAt:d.checkedAt||null
    };
  }
  function applyDiscount(price,d){
    if(!(price>0)||!d||!(d.discount_value>0)) return price;
    return d.value_type==='fixed'?Math.max(0,price-d.discount_value):Math.max(0,price*(1-d.discount_value/100));
  }
  function priceAfterPersonalDiscounts(base,discounts=[]){
    const ds=discounts.map(normalizeDiscount).filter(d=>d.discount_type&&d.discount_value>0);
    if(!(base>0)||!ds.length) return {price:base||null,status:'none',applied:[]};
    if(ds.some(d=>d.stacking_rule==='needs_confirmation')) return {price:base,status:'needs_confirmation',applied:[]};
    const stackable=ds.filter(d=>d.stacking_rule==='stackable');
    if(stackable.length){
      const price=stackable.reduce((p,d)=>applyDiscount(p,d),base);
      return {price,status:'confirmed',applied:stackable.map(d=>d.discount_type)};
    }
    const exclusive=ds.filter(d=>d.stacking_rule==='exclusive');
    if(exclusive.length){
      const ranked=exclusive.map(d=>({d,price:applyDiscount(base,d)})).sort((a,b)=>a.price-b.price);
      return {price:ranked[0].price,status:'confirmed',applied:[ranked[0].d.discount_type]};
    }
    return {price:base,status:'none',applied:[]};
  }
  function attachDiscounts(snapshot,discounts){
    const normalized=discounts.map(normalizeDiscount);
    const r=priceAfterPersonalDiscounts(snapshot.best_offer_before_personal_discount,normalized);
    return {...snapshot,discounts:normalized,final_price_after_personal_discounts:r.price,discount_status:r.status,applied_discounts:r.applied};
  }
  return {TAXONOMY,RANKING_MODES,DISCOUNT_TYPES,SCHOOL_HOLIDAY_CALENDARS,classifyUkraineHotel,normalizeRankingMode,resolveSchoolHoliday,createSearchSnapshot,normalizeDiscount,priceAfterPersonalDiscounts,attachDiscounts};
});
