(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.Travel2HotelBase=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const DEFAULT_SOURCE='https://raw.githubusercontent.com/tauveria-stack/autumn-spa-2026/main/hotels.json';
  const DEFAULT_COVERAGE={dateMode:'exact',checkIn:'2026-10-24',checkOut:'2026-10-31'};
  function normalizeHotelBase(payload,{coverage=DEFAULT_COVERAGE}={}){
    const hotels=(Array.isArray(payload?.hotels)?payload.hotels:[]).map(h=>({...h,_sourceCoverage:{...coverage}}));
    return {hotels,sourceVersion:payload?.version??null,sourceUpdatedAt:payload?.updatedAt??null,coverage:{...coverage}};
  }
  async function loadHotelBase({source=DEFAULT_SOURCE,fetchImpl=globalThis.fetch,coverage=DEFAULT_COVERAGE}={}){
    if(typeof fetchImpl!=='function') throw new Error('Hotel base fetch unavailable');
    const response=await fetchImpl(source,{cache:'no-store'});
    if(!response||!response.ok) throw new Error(`Hotel base request failed: ${response?.status??'unknown'}`);
    const payload=await response.json();
    const normalized=normalizeHotelBase(payload,{coverage});
    if(!normalized.hotels.length) throw new Error('Hotel base is empty or invalid');
    return {...normalized,source};
  }
  return {DEFAULT_SOURCE,DEFAULT_COVERAGE,normalizeHotelBase,loadHotelBase};
});