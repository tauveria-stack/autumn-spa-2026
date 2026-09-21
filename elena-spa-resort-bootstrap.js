const previousFetch=window.fetch.bind(window);
window.fetch=async (input,init)=>{
  const url=typeof input==='string'?input:input?.url||'';
  const res=await previousFetch(input,init);
  if(!url.endsWith('hotels-20260914.json')||!res.ok)return res;
  try{
    const [base,elenaRes]=await Promise.all([res.clone().json(),previousFetch('hotels-discovery-20260921-elena-spa-resort.json',{cache:'no-store'}).catch(()=>null)]);
    if(!elenaRes?.ok)return res;
    const discovered=await elenaRes.json();
    const byId=new Map((base.hotels||[]).map(h=>[h.id,h]));
    for(const raw of (discovered.hotels||[])){
      const h={...raw};
      if(h.id==='elena-spa-resort'){
        h.photo={status:'resolved',heroQuality:'accepted',src:'https://bukovel-elena.com.ua/wp-content/uploads/2023/07/hero8.jpg',alt:'Elena Spa Resort — готельний комплекс у Поляниці',source:'офіційний сайт Elena Hotel',provenance:'official exact-property hero image verified 2026-09-21'};
        h.features={...(h.features||{}),pool:true,kidsPool:true,sauna:true,hammam:true,jacuzzi:true,kidsRoom:true,breakfast:true,restaurant:true};
        h.couple={...(h.couple||{}),meals:'сніданок',pros:['критий басейн 18×6 м','хамам','джакузі','сауни','сніданок включено','тихе розташування / природа']};
        h.family={...(h.family||{}),meals:'сніданок',pros:['критий басейн 18×6 м','критий дитячий басейн','дитяча кімната','хамам','джакузі','сніданок включено']};
      }
      byId.set(h.id,h);
    }
    return new Response(JSON.stringify({...base,hotels:[...byId.values()],meta:{...(base.meta||{}),updatedAt:'2026-09-21T14:45:00+03:00'}}),{status:res.status,headers:{'Content-Type':'application/json'}});
  }catch{return res;}
};
