const nativeFetch=window.fetch.bind(window);
window.fetch=async (input,init)=>{
  const url=typeof input==='string'?input:input?.url||'';
  if(!url.endsWith('hotels-20260914.json')) return nativeFetch(input,init);
  const [baseRes,pearlsRes,lowPriceRes,discoveryRes,latestDiscoveryRes,volynDiscoveryRes,bukovelDiscoveryRes,westernDiscoveryRes,ternopilDiscoveryRes,westernPearlRes,helikonRes]=await Promise.all([
    nativeFetch(input,init),nativeFetch('hotels-pearls-20260914.json',{cache:'no-store'}).catch(()=>null),nativeFetch('hotels-lowprice-20260916.json',{cache:'no-store'}).catch(()=>null),nativeFetch('hotels-discovery-20260916.json',{cache:'no-store'}).catch(()=>null),nativeFetch('hotels-discovery-20260916-1145.json',{cache:'no-store'}).catch(()=>null),nativeFetch('hotels-discovery-20260916-1542.json',{cache:'no-store'}).catch(()=>null),nativeFetch('hotels-discovery-20260916-1940.json',{cache:'no-store'}).catch(()=>null),nativeFetch('hotels-discovery-20260916-2039.json',{cache:'no-store'}).catch(()=>null),nativeFetch('hotels-discovery-20260916-2138.json',{cache:'no-store'}).catch(()=>null),nativeFetch('hotels-discovery-20260916-2237.json',{cache:'no-store'}).catch(()=>null),nativeFetch('hotels-helikon-20260917.json',{cache:'no-store'}).catch(()=>null)
  ]);
  if(!baseRes.ok)return baseRes;
  const base=await baseRes.json();
  const docs=await Promise.all([pearlsRes,lowPriceRes,discoveryRes,latestDiscoveryRes,volynDiscoveryRes,bukovelDiscoveryRes,westernDiscoveryRes,ternopilDiscoveryRes,westernPearlRes,helikonRes].map(async r=>r?.ok?await r.json():{hotels:[],meta:{}}));
  const byId=new Map((base.hotels||[]).map(h=>[h.id,h])); docs.forEach(d=>(d.hotels||[]).forEach(h=>byId.set(h.id,h)));
  const photoById={
    'verhovel':{src:'https://img.hotels24.ua/photos/partner_hotel/hotel_main/0/39/3995/Otel-Verhovel-Verhovina-foto-3995z600.jpg',alt:'Готель Верховель у Верховині — головний корпус',source:'Hotels24.ua'},
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
    'solva-resort-medical-spa':{src:'https://solvahotel.com/wp-content/uploads/2025/04/frontpage-hero-slide-desktop-1-upd.jpg',alt:'Solva Resort Medical & SPA — головний корпус комплексу',source:'офіційний сайт'},
    'osonnya':{src:'https://osonnya.com/upload/medialibrary/4ce/q4p97o0hy0ts5k3uvn8ygp8oghdkbxn9.jpg',alt:'Осоння Карпати RESORT MEDICAL & SPA — корпус, басейн і територія',source:'офіційний сайт Осоння Карпати'},
    'nikoletta-hotel-spa-polyanytsia':{src:'https://nikoletta-hotel.com/wp-content/uploads/2026/09/nikoletta-hero-winter.webp',alt:'Nikoletta Hotel & SPA у Поляниці — головний корпус',source:'офіційний сайт Nikoletta Hotel & SPA'},
    'aquapark-alligator-ternopil':{src:'https://alligator.te.ua/aligator.org.ua/userfiles/image/%D0%9F%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%B4%D0%BE%202%20%D0%BC%D0%B1.jpg',alt:'Hotel Alligator у Тернополі — готельний комплекс та аквапарк',source:'офіційний сайт ТОК Алігатор'},
    'underhill-resort-spa-pidhiria':{src:'https://cdn.karpaty.rocks/s3fs-public/photo/hotels24/underhill_resort_spa_hotel_1.jpg',alt:'UNDERHILL Resort & Spa Hotel у Підгір’ї — номер готелю',source:'Karpaty.rocks / Hotels24 attributable property photo'},
    'lybid-plaza-khmelnytskyi':{src:'https://green.vsitury.com.ua/uploads/posts/2016-05/1464183148_object_tb87.jpg',alt:'Готель Либідь Плаза у Хмельницькому — денний фасад комплексу',source:'Vsitury / hotel property photo; human visual acceptance 2026-09-18'},
    'ivory':{src:'https://ivoryresortandspa.com/wp-content/uploads/2025/11/lux-main.webp',alt:'IVORY Resort & Spa — готельний номер із брендованими рушниками',source:'офіційний сайт IVORY Resort & Spa; hotel page asset verified 2026-09-19'},
    'rado-hotel-spa':{src:'https://radohotel.com.ua/system/images/files/000/000/294/original/IMG_8617___.jpg?1781806260=',alt:'RADO Hotel & Spa — фасад із вивіскою готелю',source:'офіційний сайт RADO Hotel & Spa; property image verified 2026-09-19'},
    'perlyna-resort-sokyrno':{src:'https://perlyna.biz/storage/media/01JWE9VBGYDA9ZF1WZ1JX8JVDV.jpg',alt:'Perlyna Resort у Сокирній — готельний номер',source:'офіційний сайт Perlyna Resort; room image verified 2026-09-19'},
    'karpaty-migovo':{src:'https://cdn.prod.website-files.com/665075b486e43029b8555c71/66a25072608b3f0e066b7412_%D0%97%D0%B0%D0%B3%D0%B0%D0%BB%D1%8C%D0%BD%D0%B8%D0%B9%20%D0%BF%D0%BB%D0%B0%D0%BD.avif',alt:'Карпати Мигово — котеджі готельного комплексу серед карпатського лісу',source:'офіційний сайт Карпати Мигово; image asset exposed on canonical property page verified 2026-09-19'}
  };
  for(const [id,p] of Object.entries(photoById)){const h=byId.get(id);if(h&&(!h.photo||h.photo.status==='missing'))h.photo={status:'resolved',heroQuality:'accepted',...p,provenance:'stable canonical-ID mapping; attributable source verified'};}
  if(byId.has('chervona-ruta-shayan'))byId.delete('chervona-ruta'); if(byId.has('solva-resort-medical-spa'))byId.delete('solva');
  const mergedMeta=Object.assign({},base.meta,...docs.map(d=>d.meta||{}));
  return new Response(JSON.stringify({...base,hotels:[...byId.values()],meta:mergedMeta}),{status:200,headers:{'Content-Type':'application/json'}});
};
const applyValueBadges=()=>{document.querySelectorAll('.hotel-card').forEach(card=>{const verdict=card.querySelector('.verdict')?.textContent||'';const chips=card.querySelector('.chips');if(!chips)return;if(verdict.startsWith('Низька ціна')&&!chips.querySelector('[data-low-price]')){const badge=document.createElement('span');badge.className='chip good';badge.dataset.lowPrice='1';badge.textContent='Низька ціна';chips.prepend(badge);}});};
document.addEventListener('DOMContentLoaded',()=>{const grid=document.getElementById('hotelGrid');if(grid)new MutationObserver(applyValueBadges).observe(grid,{childList:true,subtree:true});applyValueBadges();});