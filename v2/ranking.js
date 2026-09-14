(function(root,factory){
  const api=factory(root.Travel2Domain || (typeof require==='function'?require('./domain.js'):null));
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.Travel2Ranking=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(D){
  if(!D) throw new Error('Travel2Domain is required');
  const DEFAULT_MAX_SHORTLIST=20;
  const PREF_SIGNALS={quiet:['тихо','тиша','камерн','ліс','природ'],spa:['spa','спа','саун','хамам','парн'],pools:['басейн','аква','терм'],nature:['ліс','гора','природ','річк','парк'],active:['актив','спорт','велосип','похід'],kids:['дитяч','kids','аніма','педагог'],culture:['екскурс','музей','замок','культур'],entertainment:['аніма','розваг','програм','бар','вечір']};
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const shortlistLimit=value=>clamp(Number.isFinite(Number(value))?Math.trunc(Number(value)):DEFAULT_MAX_SHORTLIST,1,100);
  const groupType=p=>(p?.travellers||[]).some(t=>Number(t.age)<18)?'family':'couple';
  function nights(p){if(p?.date?.mode!=='exact') return null;const a=new Date(p.date.checkIn+'T00:00:00Z'),b=new Date(p.date.checkOut+'T00:00:00Z');const n=Math.round((b-a)/86400000);return n>0?n:null}
  const normalizedText=(h,v)=>[h?.name,h?.location,h?.region,h?.group,v?.verdict,...(v?.pros||[]),...(v?.cons||[])].filter(Boolean).join(' ').toLowerCase();
  function preferenceFit(h,v,p){const text=normalizedText(h,v);let weighted=0,total=0;for(const [k,wRaw] of Object.entries(p?.preferences||{})){const w=Number(wRaw)||0;if(!w)continue;total+=w;const hit=(PREF_SIGNALS[k]||[]).some(x=>text.includes(x));weighted+=w*(hit?1:0.35)}return total?weighted/total:0.5}
  function budgetFit(price,budget){price=Number(price)||0;budget=Number(budget)||0;if(!price||!budget)return 0.5;return price<=budget?1:clamp(1-(price-budget)/budget,0,1)}
  function destinationAllowed(hotel,p){const mode=p?.destinationMode||'ukraine';const taxonomy=D.classifyUkraineHotel(hotel);if(mode==='mountains')return taxonomy.some(x=>['prykarpattia','zakarpattia','high_carpathians'].includes(x));if(mode==='ukraine'||mode==='anywhere'||mode==='worldwide')return true;if(mode==='europe'||mode==='sea'||mode==='cruise')return false;return true}
  function adaptHotel(raw,p){const profileKind=groupType(p),variant=raw?.[profileKind];if(!variant?.eligible)return null;const hotel={id:raw.id,name:raw.name,location:raw.location,region:raw.region,group:raw.group,url:raw.url,indoorSpa:!!raw.indoorSpa,thermal:!!raw.thermal};const snapshot=D.createSearchSnapshot({hotelId:raw.id,profileKind,variant,checkedAt:raw.checkedAt||null,source:raw.url||null});const base=Number(variant.score)||0;const bfit=budgetFit(snapshot.regular_price,p?.budgetPerNight);const pfit=preferenceFit(raw,variant,p);const profileScore=clamp(base*0.65+bfit*2+pfit*1.5,0,10);return {hotel,snapshot,variant,profileKind,taxonomy:D.classifyUkraineHotel(hotel),profileScore,budgetFit:bfit,preferenceFit:pfit}}
  function rankHotels(rawHotels,p,options={}){const rankingMode=D.normalizeRankingMode(p?.rankingMode);const maxShortlist=shortlistLimit(options.maxShortlist ?? p?.maxShortlist);return (rawHotels||[]).map(h=>adaptHotel(h,p)).filter(Boolean).filter(x=>destinationAllowed(x.hotel,p)).sort((a,b)=>b.profileScore-a.profileScore || String(a.hotel.name||'').localeCompare(String(b.hotel.name||''),'uk')).slice(0,maxShortlist).map(x=>({...x,rankingMode}))}
  return {DEFAULT_MAX_SHORTLIST,PREF_SIGNALS,shortlistLimit,groupType,nights,preferenceFit,budgetFit,destinationAllowed,adaptHotel,rankHotels};
});
