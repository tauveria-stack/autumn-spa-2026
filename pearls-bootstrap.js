const nativeFetch=window.fetch.bind(window);
window.fetch=async (input,init)=>{
  const url=typeof input==='string'?input:input?.url||'';
  if(!url.endsWith('hotels-20260914.json')) return nativeFetch(input,init);
  const [baseRes,pearlsRes]=await Promise.all([
    nativeFetch(input,init),
    nativeFetch('hotels-pearls-20260914.json',{cache:'no-store'}).catch(()=>null)
  ]);
  if(!baseRes.ok||!pearlsRes?.ok)return baseRes;
  const base=await baseRes.json();
  const pearls=await pearlsRes.json();
  const byId=new Map((base.hotels||[]).map(h=>[h.id,h]));
  (pearls.hotels||[]).forEach(h=>byId.set(h.id,h));
  return new Response(JSON.stringify({...base,hotels:[...byId.values()],meta:{...base.meta,...pearls.meta}}),{
    status:200,
    headers:{'Content-Type':'application/json'}
  });
};
