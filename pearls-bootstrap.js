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

  // Canonical photo ownership registry. This restores previously verified photos by
  // stable physical-property ID after the unsafe name-keyed fallback was removed.
  // Existing canonical hotel.photo always wins; registry entries never cross IDs.
  const photoById={
    'verhovel':{src:'https://media.joinup.travel/storage/hotel/33107/photos/otel-2.jpg',alt:'Готель Верховель у Верховині — головний корпус',source:'Join UP!'},
    '7-dniv-kamianets':{src:'https://img.hotels24.ua/photos/partner_hotel/hotel_main/0/49/4999/Otel-7-dney-Kamenec-Podolskiy-foto-4999z600.jpg',alt:'Готель 7 Днів у Кам’янці-Подільському — головний корпус',source:'Hotels24.ua'},
    'sonyachnyi-provans-sataniv':{src:'https://optimahotels.com.ua/media/images/hotels/hotelphoto-c5e24c93-afd9-4e1b-9fec-2f152a5ca867.JPEG',alt:'VitaPark Сонячний Прованс — головний корпус у Сатанові',source:'Optima Hotels and Resorts'},
    'dodo-spa-zhytomyr':{src:'https://q-xx.bstatic.com/xdata/images/hotel/max500/506252655.jpg?k=8e10f20fdc7193567afce81fca52a1c547863aa6e5df577693d45e6b210227e3&o=',alt:'Dodo spa & hotel — номер готелю у Житомирі',source:'Booking.com'},
    'respect':{src:'https://www.respecthotel.com.ua/wp-content/uploads/2026/07/zagal-1920x800-2.webp',alt:'RESPECT Hotel & SPA у Східниці',source:'офіційний сайт'},
    'phoenix':{src:'https://phoenix-sh.com.ua/wp-content/uploads/2026/08/rooms2.webp',alt:'Phoenix Medical Resort — готельні шале та територія',source:'офіційний сайт'},
    'gora':{src:'https://img.hotels24.ua/photos/partner_hotel/facility/150/15075/1507560/1507560z600.jpg',alt:'SPA Hotel «Гора» — готельний комплекс, басейн і ліс',source:'Hotels24.ua'},
    'chervona-ruta-shayan':{src:'https://img.hotels24.ua/photos/partner_hotel/facility/150/15091/1509125/Otel-Chervona-Ruta-Shayan-snjat-1509125z600.jpg',alt:'Червона Рута — котедж, басейн і територія',source:'Hotels24.ua'},
    'rikka':{src:'https://img.hotels24.ua/photos/partner_hotel/facility/150/15068/1506821/Otel-Rikka-Khust-Thermal-Resort-Hust-snjat-1506821z600.jpg',alt:'RIKKA Khust Thermal Resort — корпус і термальний басейн',source:'Hotels24.ua'},
    'forest-house':{src:'https://img.hotels24.ua/photos/partner_hotel/facility/149/14987/1498780/Gostinica-Forest-House-Migovo-foto-1498780z600.jpg',alt:'Forest House — вхідна частина комплексу',source:'Hotels24.ua'},
    'chorna-skelya':{src:'https://img.hotels24.ua/photos/partner_hotel/facility/141/14178/1417816/Otel-Chorna-Skelya-Vinogradov-ceny-1417816z600.jpg',alt:'Чорна скеля — готельний комплекс і басейни',source:'Hotels24.ua'},
    'solva-resort-medical-spa':{src:'https://solvahotel.com/wp-content/uploads/2025/04/frontpage-hero-slide-desktop-1-upd.jpg',alt:'Solva Resort Medical & SPA — головний корпус комплексу',source:'офіційний сайт'}
  };
  for(const [id,p] of Object.entries(photoById)){
    const h=byId.get(id);
    if(h&&!h.photo) h.photo={status:'resolved',heroQuality:'accepted',...p,provenance:'migrated verified legacy mapping 2026-09-18'};
  }

  // Canonical physical-property identity migrations. These pairs are supported by
  // stronger property evidence (same locality + official site/contact), not by name.
  // Keep the richer/newer stable-ID record so counts and rankings represent one property.
  if(byId.has('chervona-ruta-shayan')) byId.delete('chervona-ruta');
  if(byId.has('solva-resort-medical-spa')) byId.delete('solva');

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