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
  const textOf=h=>[h?.name,h?.location,h?.region,h?.group].filter(Boolean).join(' ').toLowerCase();
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
  function createSearchSnapshot({hotelId,profileKind,variant={},checkedAt=null,source=null}){
    const regular=Number(variant.pricePerNight)||null;
    return {
      schemaVersion:1,hotelId,profileKind,
      availability:variant.priceStatus==='unknown'?'needs_confirmation':'candidate',
      regular_price:regular,
      best_offer_before_personal_discount:regular,
      final_price_after_personal_discounts:regular,
      totalPrice:Number(variant.total7Nights)||null,
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
  return {TAXONOMY,RANKING_MODES,DISCOUNT_TYPES,classifyUkraineHotel,normalizeRankingMode,createSearchSnapshot,normalizeDiscount,priceAfterPersonalDiscounts,attachDiscounts};
});
