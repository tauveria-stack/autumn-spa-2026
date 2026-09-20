const previousFetch=window.fetch.bind(window);
window.fetch=async (input,init)=>{
  const url=typeof input==='string'?input:input?.url||'';
  const res=await previousFetch(input,init);
  if(!url.endsWith('hotels-20260914.json')||!res.ok)return res;
  try{
    const [base,fomichRes]=await Promise.all([res.clone().json(),previousFetch('hotels-discovery-20260920-fomich-residence.json',{cache:'no-store'}).catch(()=>null)]);
    if(!fomichRes?.ok)return res;
    const discovered=await fomichRes.json();
    const byId=new Map((base.hotels||[]).map(h=>[h.id,h]));
    for(const raw of (discovered.hotels||[])){
      const h={...raw};
      if(h.id==='fomich-residence'){
        h.photo={status:'resolved',heroQuality:'accepted',src:'https://app.fomich.ua/storage/2026/3/16/01KKVDT8DF81R8FBB5BCZBWMZ9.jpg',alt:'Fomich Residence — готель у Буковелі',source:'офіційний сайт Fomich Hotels & Residences',provenance:'official exact-property gallery image verified 2026-09-20'};
        h.features={...(h.features||{}),pool:true,sauna:true,hammam:true,jacuzzi:true};
        h.couple={...(h.couple||{}),meals:'сніданок включено',pros:[...(h.couple?.pros||[]),'критий басейн','сауна','хамам','джакузі','соляна кімната','сніданок включено','природа / гірські краєвиди']};
        h.family={...(h.family||{}),meals:'сніданок включено',pros:[...(h.family?.pros||[]),'критий басейн','сауна','хамам','джакузі','соляна кімната','сніданок включено','природа / гірські краєвиди']};
        h.reputation={...(h.reputation||{}),bookingScore:9.5};
      }
      byId.set(h.id,h);
    }
    return new Response(JSON.stringify({...base,hotels:[...byId.values()],meta:{...(base.meta||{}),updatedAt:'2026-09-20T23:47:00+03:00'}}),{status:res.status,headers:{'Content-Type':'application/json'}});
  }catch{return res;}
};
