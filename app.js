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
    'SPA Hotel «Гора»':{src:'https://gorahotel.com/wp-content/uploads/2026/05/home-slide-1.jpg',alt:'SPA Hotel «Гора» — готельний комплекс у Поляниці',source:'офіційний сайт'}
  };
  // Existing images that are attractive but do not identify the property are suppressed until replaced.
  const rejectCurrentHero=new Set(['Kyivska Russ Resort Medical & Spa','Воєводино']);

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
import('./app-20260914.js?v=20260914-3');
