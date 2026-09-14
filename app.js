document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.photo-fallback').forEach(el=>el.textContent='Фото поки відсутнє');
  const price=document.getElementById('priceFilter');
  if(price) price.value='999999';
  const spa=document.getElementById('spaFilter');
  if(spa) spa.checked=false;
  const footer=document.querySelector('.footer p');
  if(footer) footer.textContent='Рейтинг — редакційна оцінка за тишею, SPA, номером, харчуванням, репутацією, співвідношенням ціни та якості й тим, наскільки готель підходить для відпочинку наприкінці жовтня. Ціни перевіряємо саме на 24–31.10.2026, коли це доступно онлайн.';

  // Hero policy: the first image must identify the hotel/complex, not merely show scenery.
  // Temporary overrides are allowed only when the image is tied to the exact property and represents it.
  const provisionalPhotos={
    'RESPECT Hotel & SPA':{src:'https://www.respecthotel.com.ua/wp-content/uploads/2026/07/zagal-1920x800-2.webp',alt:'RESPECT Hotel & SPA у Східниці',source:'офіційний сайт'},
    'Belle Royalle':{src:'https://img.hotels24.ua/photos/partner_hotel/facility/117/11701/1170170/Otel-Belle-Royalle-Mukachevo-snjat-1170170z600.jpg',alt:'Belle Royalle — корпус готелю та територія',source:'Hotels24.ua'},
    'Phoenix Medical Resort':{src:'https://phoenix-sh.com.ua/wp-content/uploads/2026/08/rooms2.webp',alt:'Phoenix Medical Resort — готельні шале та територія',source:'офіційний сайт'},
    'Kyivska Russ Resort Medical & Spa':{src:'https://img.hotels24.ua/photos/partner_hotel/facility/127/12702/1270207/Gostinica-Kyivska-Russ-Resort-Medical-Spa-Shodnica-snjat-1270207z600.jpg',alt:'Kyivska Russ Resort Medical & Spa — корпус і басейн',source:'Hotels24.ua'},
    'SPA Hotel «Гора»':{src:'https://img.hotels24.ua/photos/partner_hotel/facility/150/15075/1507560/1507560z600.jpg',alt:'SPA Hotel «Гора» — готельний комплекс, басейн і ліс',source:'Hotels24.ua'},
    'Червона Рута':{src:'https://img.hotels24.ua/photos/partner_hotel/facility/150/15091/1509125/Otel-Chervona-Ruta-Shayan-snjat-1509125z600.jpg',alt:'Червона Рута — котедж, басейн і територія',source:'Hotels24.ua'},
    'RIKKA Khust Thermal Resort':{src:'https://img.hotels24.ua/photos/partner_hotel/facility/150/15068/1506821/Otel-Rikka-Khust-Thermal-Resort-Hust-snjat-1506821z600.jpg',alt:'RIKKA Khust Thermal Resort — корпус і термальний басейн',source:'Hotels24.ua'},
    'Forest House':{src:'https://img.hotels24.ua/photos/partner_hotel/facility/149/14987/1498780/Gostinica-Forest-House-Migovo-foto-1498780z600.jpg',alt:'Forest House — вхідна частина комплексу',source:'Hotels24.ua'},
    'Чорна скеля':{src:'https://img.hotels24.ua/photos/partner_hotel/facility/141/14178/1417816/Otel-Chorna-Skelya-Vinogradov-ceny-1417816z600.jpg',alt:'Чорна скеля — готельний комплекс і басейни',source:'Hotels24.ua'},
    'Solva Resort Medical & SPA':{src:'https://solvahotel.com/wp-content/uploads/2025/04/frontpage-hero-slide-desktop-1-upd.jpg',alt:'Solva Resort Medical & SPA — головний корпус комплексу',source:'офіційний сайт'},
    'Воєводино':{src:'https://voevodyno.com/wp-content/uploads/2026/08/vasya.shtefaniak-29-optimized.jpg',alt:'Воєводино — корпус комплексу восени',source:'офіційний сайт'}
  };
  const rejectCurrentHero=new Set();

  const applyProvisionalPhotos=()=>{
    document.querySelectorAll('.hotel-card').forEach(card=>{
      const name=card.querySelector('.hotel-name')?.textContent?.trim();
      const media=card.querySelector('.hotel-media');
      const img=card.querySelector('.hotel-photo');
      const source=card.querySelector('.photo-source');
      if(!media||!img||!source)return;
      if(rejectCurrentHero.has(name)){
        img.removeAttribute('src');
        img.alt='';
        media.classList.remove('has-photo');
        source.textContent='Фото поки відсутнє';
      }
      const photo=provisionalPhotos[name];
      if(!photo)return;
      img.alt=photo.alt;
      img.onload=()=>media.classList.add('has-photo');
      img.onerror=()=>{media.classList.remove('has-photo');source.textContent='Фото поки відсутнє'};
      img.src=photo.src;
      source.textContent='Фото: '+photo.source;
    });
  };
  new MutationObserver(applyProvisionalPhotos).observe(document.getElementById('hotelGrid'),{childList:true});
  applyProvisionalPhotos();
});
import('./app-20260914.js?v=20260914-4');
