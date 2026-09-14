(function(root,factory){
  const api=factory(root.Travel2Domain || (typeof require==='function'?require('./domain.js'):null));
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.Travel2Ranking=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(D){
  if(!D) throw new Error('Travel2Domain is required');
  const DEFAULT_MAX_SHORTLIST=20;
  const PREF_SIGNALS={
    quiet:['тихо','тиша','камерн','ліс','природ'],
    coziness:['затиш','камерн','бутик','шале','котедж','домашн'],
    spa:['spa','спа','саун','хамам','парн'],
    waterparks:['аквапарк','водн','гірк'],
    pools:['басейн','терм'],
    amusement:['лунапарк','атракціон','розважальн','ігров'],
    nature:['ліс','гора','природ','річк','парк'],
    mountains:['гора','карпат','полонин','хребет','підйомник'],
    active:['актив','спорт','велосип','похід','лижі','рафт'],
    calm:['спокійн','релакс','відпочинок','усаміт','тиша'],
    kids:['дитяч','kids','аніма','педагог'],
    culture:['екскурс','музей','замок','культур'],
    entertainment:['аніма','розваг','програм','бар','вечір','двіж']
  };
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const shortlistLimit=value=>clamp(Number.isFinite(Number(value))?Math.trunc(Number(value)):DEFAULT_MAX_SHORTLIST,1,100);
  const groupType=p=>(p?.travellers||[]).some(t=>Number(t.age)<18)?'family':'couple';
  function requestedDuration(p){const n=Math.trunc(Number(p?.durationNights));return Number.isFinite(n)&&n>=1&&n<=30?n:null}
  function nights(p){if(p?.date?.mode!=='exact')return requestedDuration(p);const a=new Date(p.date.checkIn+'T00:00:00Z'),b=new Date(p.date.checkOut+'T00:00:00Z');const n=Math.round((b-a)/86400000);return n>0?n:null}
  const normalizedText=(h,v)=>[h?.name,h?.location,h?.region,h?.group,v?.verdict,...(v?.pros||[]),...(v?.cons||[])].filter(Boolean).join(' ').toLowerCase();
  function preferenceFit(h,v,p){const text=normalizedText(h,v);let weighted=0,total=0;for(const [k,wRaw] of Object.entries(p?.preferences||{})){const w=Number(wRaw)||0;if(!w)continue;total+=w;const hit=(PREF_SIGNALS[k]||[]).some(x=>text.includes(x));weighted+=w*(hit?1:0.35)}return total?weighted/total:0.5}
  function budgetFit(price,budget){price=Number(price)||0;budget=Number(budget)||0;if(!price||!budget)return 0.5;return price<=budget?1:clamp(1-(price-budget)/budget,0,1)}
  function selectedGeography(p){return [...new Set((Array.isArray(p?.geography)?p.geography:[]).filter(k=>D.TAXONOMY[k]))]}
  function geographyAllowed(hotel,p){const wanted=selectedGeography(p);if(!wanted.length)return true;const actual=D.classifyUkraineHotel(hotel);return wanted.some(k=>actual.includes(k))}
  function destinationAllowed(hotel,p){
    const mode=p?.destinationMode||'ukraine',taxonomy=D.classifyUkraineHotel(hotel);
    if(mode==='europe'||mode==='sea'||mode==='cruise')return false;
    if(mode==='mountains'&&!taxonomy.some(x=>['prykarpattia','zakarpattia','high_carpathians'].includes(x)))return false;
    if(!['ukraine','mountains','anywhere','worldwide'].includes(mode))return true;
    return geographyAllowed(hotel,p);
  }
  function exactCoverageNights(coverage){
    if(coverage?.dateMode!=='exact'||!coverage.checkIn||!coverage.checkOut)return null;
    const a=new Date(coverage.checkIn+'T00:00:00Z'),b=new Date(coverage.checkOut+'T00:00:00Z');
    const n=Math.round((b-a)/86400000);
    return Number.isFinite(n)&&n>0?n:null;
  }
  function profileYear(p){
    const explicit=Math.trunc(Number(p?.date?.year));
    if(explicit>=2020&&explicit<=2100)return explicit;
    for(const value of [p?.date?.checkIn,p?.date?.flexFrom]){
      const year=Math.trunc(Number(String(value||'').slice(0,4)));
      if(year>=2020&&year<=2100)return year;
    }
    return null;
  }
  function seasonCoverageMatches(p,coverage){
    if(coverage?.dateMode!=='exact')return false;
    const duration=requestedDuration(p),coverageNights=exactCoverageNights(coverage),year=profileYear(p);
    if(!duration||coverageNights!==duration||!year)return false;
    const months={winter:[12,1,2],spring:[3,4,5],summer:[6,7,8],autumn:[9,10,11]}[p?.date?.season];
    if(!months)return false;
    const start=new Date(coverage.checkIn+'T00:00:00Z'),end=new Date(coverage.checkOut+'T00:00:00Z');
    if(Number.isNaN(start.getTime())||Number.isNaN(end.getTime()))return false;
    return start.getUTCFullYear()===year&&end.getUTCFullYear()===year&&months.includes(start.getUTCMonth()+1)&&months.includes(end.getUTCMonth()+1);
  }
  function coverageMatchesProfile(p,coverage){
    if(!coverage)return true;
    if(coverage.dateMode!=='exact')return false;
    const mode=p?.date?.mode;
    if(mode==='exact')return p.date.checkIn===coverage.checkIn&&p.date.checkOut===coverage.checkOut;
    if(mode==='flexible'){
      const from=p.date.flexFrom,to=p.date.flexTo,duration=requestedDuration(p),coverageNights=exactCoverageNights(coverage);
      if(!from||!to||!duration||coverageNights!==duration)return false;
      return coverage.checkIn>=from&&coverage.checkOut<=to;
    }
    if(mode==='season')return seasonCoverageMatches(p,coverage);
    return false;
  }
  function constrainSnapshotToCoverage(snapshot,p,coverage){
    if(coverageMatchesProfile(p,coverage))return {...snapshot,coverageStatus:'matched'};
    return {...snapshot,availability:'needs_confirmation',source_regular_price:snapshot.regular_price,regular_price:null,best_offer_before_personal_discount:null,final_price_after_personal_discounts:null,totalPrice:null,coverageStatus:'date_mismatch'};
  }
  function selectedPersonalDiscountTypes(p){
    return [...new Set((Array.isArray(p?.personalDiscountTypes)?p.personalDiscountTypes:[]).filter(t=>D.DISCOUNT_TYPES.includes(t)))];
  }
  function matchingPersonalDiscounts(raw,p){
    const selected=selectedPersonalDiscountTypes(p);
    if(!selected.length)return [];
    const discounts=Array.isArray(raw?.personalDiscounts)?raw.personalDiscounts:[];
    return discounts.filter(d=>selected.includes(d?.discount_type));
  }
  function adaptHotel(raw,p){
    const profileKind=groupType(p),variant=raw?.[profileKind];if(!variant?.eligible)return null;
    const hotel={id:raw.id,name:raw.name,location:raw.location,region:raw.region,group:raw.group,url:raw.url,indoorSpa:!!raw.indoorSpa,thermal:!!raw.thermal};
    const created=D.createSearchSnapshot({hotelId:raw.id,profileKind,variant,checkedAt:raw.checkedAt||null,source:raw.url||null});
    const discounted=D.attachDiscounts(created,matchingPersonalDiscounts(raw,p));
    const snapshot=constrainSnapshotToCoverage(discounted,p,raw?._sourceCoverage||null);
    const effectivePrice=snapshot.discount_status==='confirmed'?snapshot.final_price_after_personal_discounts:snapshot.best_offer_before_personal_discount||snapshot.regular_price;
    const base=Number(variant.score)||0,bfit=budgetFit(effectivePrice,p?.budgetPerNight),pfit=preferenceFit(raw,variant,p),profileScore=clamp(base*0.65+bfit*2+pfit*1.5,0,10);
    return {hotel,snapshot,variant,profileKind,taxonomy:D.classifyUkraineHotel(hotel),profileScore,budgetFit:bfit,preferenceFit:pfit};
  }
  function rankHotels(rawHotels,p,options={}){const rankingMode=D.normalizeRankingMode(p?.rankingMode);const maxShortlist=shortlistLimit(options.maxShortlist ?? p?.maxShortlist);return (rawHotels||[]).map(h=>adaptHotel(h,p)).filter(Boolean).filter(x=>destinationAllowed(x.hotel,p)).sort((a,b)=>b.profileScore-a.profileScore || String(a.hotel.name||'').localeCompare(String(b.hotel.name||''),'uk')).slice(0,maxShortlist).map(x=>({...x,rankingMode}))}
  return {DEFAULT_MAX_SHORTLIST,PREF_SIGNALS,shortlistLimit,groupType,requestedDuration,nights,preferenceFit,budgetFit,selectedGeography,geographyAllowed,destinationAllowed,exactCoverageNights,profileYear,seasonCoverageMatches,coverageMatchesProfile,constrainSnapshotToCoverage,selectedPersonalDiscountTypes,matchingPersonalDiscounts,adaptHotel,rankHotels};
});
