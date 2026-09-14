(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.Travel2HotelBase=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const DEFAULT_SOURCE='https://raw.githubusercontent.com/tauveria-stack/autumn-spa-2026/main/hotels.json';
  function normalizeHotelBase(payload){
    const hotels=Array.isArray(payload?.hotels)?payload.hotels:[];
    return {hotels,sourceVersion:payload?.version??null,sourceUpdatedAt:payload?.updatedAt??null};
  }
  async function loadHotelBase({source=DEFAULT_SOURCE,fetchImpl=globalThis.fetch}={}){
    if(typeof fetchImpl!=='function') throw new Error('Hotel base fetch unavailable');
    const response=await fetchImpl(source,{cache:'no-store'});
    if(!response||!response.ok) throw new Error(`Hotel base request failed: ${response?.status??'unknown'}`);
    const payload=await response.json();
    const normalized=normalizeHotelBase(payload);
    if(!normalized.hotels.length) throw new Error('Hotel base is empty or invalid');
    return {...normalized,source};
  }
  return {DEFAULT_SOURCE,normalizeHotelBase,loadHotelBase};
});
