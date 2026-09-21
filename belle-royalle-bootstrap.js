const previousFetch=window.fetch.bind(window);
window.fetch=async (input,init)=>{
  const url=typeof input==='string'?input:input?.url||'';
  const res=await previousFetch(input,init);
  if(!url.endsWith('hotels-20260914.json')||!res.ok)return res;
  try{
    const [base,belleRes]=await Promise.all([res.clone().json(),previousFetch('hotels-discovery-20260921-belle-royalle.json',{cache:'no-store'}).catch(()=>null)]);
    if(!belleRes?.ok)return res;
    const discovered=await belleRes.json();
    const byId=new Map((base.hotels||[]).map(h=>[h.id,h]));
    for(const h of (discovered.hotels||[]))byId.set(h.id,h);
    return new Response(JSON.stringify({...base,hotels:[...byId.values()],meta:{...(base.meta||{}),updatedAt:'2026-09-21T19:03:00+03:00'}}),{status:res.status,headers:{'Content-Type':'application/json'}});
  }catch{return res;}
};
