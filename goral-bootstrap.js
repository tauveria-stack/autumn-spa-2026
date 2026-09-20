const previousFetch=window.fetch.bind(window);
window.fetch=async (input,init)=>{
  const url=typeof input==='string'?input:input?.url||'';
  const res=await previousFetch(input,init);
  if(!url.endsWith('hotels-20260914.json')||!res.ok)return res;
  try{
    const [base,goralRes]=await Promise.all([res.clone().json(),previousFetch('hotels-discovery-20260920-goral.json',{cache:'no-store'}).catch(()=>null)]);
    if(!goralRes?.ok)return res;
    const goral=await goralRes.json();
    const byId=new Map((base.hotels||[]).map(h=>[h.id,h]));
    for(const h of (goral.hotels||[])){
      if(h.id==='goral-hotel-spa')h.photo={status:'resolved',heroQuality:'accepted',src:'https://goralhotel.com.ua/app/uploads/2025/11/image-81-of-529.jpg',alt:'Goral Hotel & Spa — критий SPA-басейн',source:'офіційний сайт Goral Hotel & Spa',provenance:'official exact-property SPA image verified 2026-09-20'};
      byId.set(h.id,h);
    }
    return new Response(JSON.stringify({...base,hotels:[...byId.values()],meta:{...(base.meta||{}),...(goral.meta||{})}}),{status:res.status,headers:{'Content-Type':'application/json'}});
  }catch{return res;}
};
