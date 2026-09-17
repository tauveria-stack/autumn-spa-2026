const nativeFetch=window.fetch.bind(window);
window.fetch=async (input,init)=>{
  const url=typeof input==='string'?input:input?.url||'';
  if(!url.endsWith('hotels-20260914.json')) return nativeFetch(input,init);
  const [baseRes,pearlsRes,lowPriceRes,discoveryRes,latestDiscoveryRes,volynDiscoveryRes,bukovelDiscoveryRes,westernDiscoveryRes,ternopilDiscoveryRes,westernPearlRes,helikonRes]=await Promise.all([
    nativeFetch(input,init),
    nativeFetch('hotels-pearls-20260914.json',{cache:'no-store'}).catch(()=>null),
    nativeFetch('hotels-lowprice-20260916.json',{cache:'no-store'}).catch(()=>null),
    nativeFetch('hotels-discovery-20260916.json',{cache:'no-store'}).catch(()=>null),
    nativeFetch('hotels-discovery-20260916-1145.json',{cache:'no-store'}).catch(()=>null),
    nativeFetch('hotels-discovery-20260916-1542.json',{cache:'no-store'}).catch(()=>null),
    nativeFetch('hotels-discovery-20260916-1940.json',{cache:'no-store'}).catch(()=>null),
    nativeFetch('hotels-discovery-20260916-2039.json',{cache:'no-store'}).catch(()=>null),
    nativeFetch('hotels-discovery-20260916-2138.json',{cache:'no-store'}).catch(()=>null),
    nativeFetch('hotels-discovery-20260916-2237.json',{cache:'no-store'}).catch(()=>null),
    nativeFetch('hotels-helikon-20260917.json',{cache:'no-store'}).catch(()=>null)
  ]);
  if(!baseRes.ok)return baseRes;
  const base=await baseRes.json();
  const pearls=pearlsRes?.ok?await pearlsRes.json():{hotels:[],meta:{}};
  const lowPrice=lowPriceRes?.ok?await lowPriceRes.json():{hotels:[],meta:{}};
  const discovery=discoveryRes?.ok?await discoveryRes.json():{hotels:[],meta:{}};
  const latestDiscovery=latestDiscoveryRes?.ok?await latestDiscoveryRes.json():{hotels:[],meta:{}};
  const volynDiscovery=volynDiscoveryRes?.ok?await volynDiscoveryRes.json():{hotels:[],meta:{}};
  const bukovelDiscovery=bukovelDiscoveryRes?.ok?await bukovelDiscoveryRes.json():{hotels:[],meta:{}};
  const westernDiscovery=westernDiscoveryRes?.ok?await westernDiscoveryRes.json():{hotels:[],meta:{}};
  const ternopilDiscovery=ternopilDiscoveryRes?.ok?await ternopilDiscoveryRes.json():{hotels:[],meta:{}};
  const westernPearl=westernPearlRes?.ok?await westernPearlRes.json():{hotels:[],meta:{}};
  const helikon=helikonRes?.ok?await helikonRes.json():{hotels:[],meta:{}};
  const byId=new Map((base.hotels||[]).map(h=>[h.id,h]));
  (pearls.hotels||[]).forEach(h=>byId.set(h.id,h));
  (lowPrice.hotels||[]).forEach(h=>byId.set(h.id,h));
  (discovery.hotels||[]).forEach(h=>byId.set(h.id,h));
  (latestDiscovery.hotels||[]).forEach(h=>byId.set(h.id,h));
  (volynDiscovery.hotels||[]).forEach(h=>byId.set(h.id,h));
  (bukovelDiscovery.hotels||[]).forEach(h=>byId.set(h.id,h));
  (westernDiscovery.hotels||[]).forEach(h=>byId.set(h.id,h));
  (ternopilDiscovery.hotels||[]).forEach(h=>byId.set(h.id,h));
  (westernPearl.hotels||[]).forEach(h=>byId.set(h.id,h));
  (helikon.hotels||[]).forEach(h=>byId.set(h.id,h));

  // Canonical physical-property identity: the older `chervona-ruta` record and the
  // richer `chervona-ruta-shayan` record describe the same Chervona Ruta in Shayan.
  // Keep only the newer canonical record so result counts, meal/filter support and
  // rankings cannot be inflated by a duplicate property.
  if(byId.has('chervona-ruta-shayan')) byId.delete('chervona-ruta');

  return new Response(JSON.stringify({...base,hotels:[...byId.values()],meta:{...base.meta,...pearls.meta,...lowPrice.meta,...discovery.meta,...latestDiscovery.meta,...volynDiscovery.meta,...bukovelDiscovery.meta,...westernDiscovery.meta,...ternopilDiscovery.meta,...westernPearl.meta,...helikon.meta}}),{
    status:200,
    headers:{'Content-Type':'application/json'}
  });
};

const applyValueBadges=()=>{
  document.querySelectorAll('.hotel-card').forEach(card=>{
    const verdict=card.querySelector('.verdict')?.textContent||'';
    const chips=card.querySelector('.chips');
    if(!chips)return;
    if(verdict.startsWith('Низька ціна')&&!chips.querySelector('[data-low-price]')){
      const badge=document.createElement('span');
      badge.className='chip good';
      badge.dataset.lowPrice='1';
      badge.textContent='Низька ціна';
      chips.prepend(badge);
    }
  });
};
document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.getElementById('hotelGrid');
  if(grid)new MutationObserver(applyValueBadges).observe(grid,{childList:true,subtree:true});
  applyValueBadges();
});
