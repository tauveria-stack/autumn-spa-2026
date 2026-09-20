const previousFetch=window.fetch.bind(window);
window.fetch=async (input,init)=>{
  const url=typeof input==='string'?input:input?.url||'';
  const res=await previousFetch(input,init);
  if(!url.endsWith('hotels-20260914.json')||!res.ok)return res;
  try{
    const [base,taorRes]=await Promise.all([res.clone().json(),previousFetch('hotels-discovery-20260920-taor.json',{cache:'no-store'}).catch(()=>null)]);
    if(!taorRes?.ok)return res;
    const taor=await taorRes.json();
    const byId=new Map((base.hotels||[]).map(h=>[h.id,h]));
    for(const h of (taor.hotels||[])){
      if(h.id==='taor-karpaty')h.photo={status:'resolved',heroQuality:'accepted',src:'https://taor.com.ua/wp-content/uploads/2025/09/photo-119-scaled.jpg',alt:'TAOR Karpaty Resort & Spa — територія комплексу в Карпатах',source:'офіційний сайт TAOR Karpaty Resort & Spa',provenance:'official exact-property grounds image verified 2026-09-20'};
      byId.set(h.id,h);
    }
    if(byId.has('taor-karpaty'))byId.delete('taor');
    return new Response(JSON.stringify({...base,hotels:[...byId.values()],meta:{...(base.meta||{}),...(taor.meta||{})}}),{status:res.status,headers:{'Content-Type':'application/json'}});
  }catch{return res;}
};
