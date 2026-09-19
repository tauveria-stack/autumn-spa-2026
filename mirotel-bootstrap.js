const previousFetch=window.fetch.bind(window);
window.fetch=async(input,init)=>{
  const url=typeof input==='string'?input:input?.url||'';
  if(!url.endsWith('hotels-20260914.json')) return previousFetch(input,init);
  const [mergedRes,mirotelRes]=await Promise.all([
    previousFetch(input,init),
    previousFetch('hotels-discovery-20260919-mirotel.json',{cache:'no-store'}).catch(()=>null)
  ]);
  if(!mergedRes.ok)return mergedRes;
  const merged=await mergedRes.json();
  const extra=mirotelRes?.ok?await mirotelRes.json():{hotels:[],meta:{}};
  const byId=new Map((merged.hotels||[]).map(h=>[h.id,h]));
  (extra.hotels||[]).forEach(h=>byId.set(h.id,h));
  return new Response(JSON.stringify({...merged,hotels:[...byId.values()],meta:{...merged.meta,...(extra.meta||{})}}),{status:200,headers:{'Content-Type':'application/json'}});
};