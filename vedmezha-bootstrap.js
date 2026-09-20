const previousFetch=window.fetch.bind(window);
window.fetch=async (input,init)=>{
  const url=typeof input==='string'?input:input?.url||'';
  const res=await previousFetch(input,init);
  if(!url.endsWith('hotels-20260914.json')||!res.ok)return res;
  try{
    const [base,hotelRes]=await Promise.all([res.clone().json(),previousFetch('hotels-discovery-20260920-vedmezha-gora.json',{cache:'no-store'}).catch(()=>null)]);
    if(!hotelRes?.ok)return res;
    const doc=await hotelRes.json();
    const byId=new Map((base.hotels||[]).map(h=>[h.id,h]));
    for(const h of (doc.hotels||[])){if(h.id==='vedmezha-gora-yaremche')byId.delete('vedmezha-gora');byId.set(h.id,h);}
    return new Response(JSON.stringify({...base,hotels:[...byId.values()],meta:{...(base.meta||{}),...(doc.meta||{})}}),{status:res.status,headers:{'Content-Type':'application/json'}});
  }catch{return res;}
};
