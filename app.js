document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.photo-fallback').forEach(el=>el.textContent='Фото поки відсутнє');
  const price=document.getElementById('priceFilter');
  if(price) price.value='999999';
  const spa=document.getElementById('spaFilter');
  if(spa) spa.checked=false;
  const footer=document.querySelector('.footer p');
  if(footer) footer.textContent='Рейтинг — редакційна оцінка за тишею, SPA, номером, харчуванням, репутацією, співвідношенням ціни та якості й тим, наскільки готель підходить для відпочинку наприкінці жовтня. Ціни перевіряємо саме на 24–31.10.2026, коли це доступно онлайн.';

  const provisionalPhotos={
    'RESPECT Hotel & SPA':{src:'https://www.respecthotel.com.ua/wp-content/uploads/2026/07/zagal-1920x800-2.webp',alt:'RESPECT Hotel & SPA у Східниці'},
    'SPA Hotel «Гора»':{src:'https://gorahotel.com/wp-content/uploads/2026/05/home-slide-1.jpg',alt:'SPA Hotel «Гора» — панорамний басейн і Карпати'}
  };
  const applyProvisionalPhotos=()=>{
    document.querySelectorAll('.hotel-card').forEach(card=>{
      const name=card.querySelector('.hotel-name')?.textContent?.trim();
      const photo=provisionalPhotos[name];
      if(!photo)return;
      const media=card.querySelector('.hotel-media');
      const img=card.querySelector('.hotel-photo');
      const source=card.querySelector('.photo-source');
      if(!media||!img||!source)return;
      img.alt=photo.alt;
      img.onload=()=>media.classList.add('has-photo');
      img.onerror=()=>{media.classList.remove('has-photo');source.textContent='Фото поки відсутнє'};
      img.src=photo.src;
      source.textContent='Фото: офіційний сайт';
    });
  };
  new MutationObserver(applyProvisionalPhotos).observe(document.getElementById('hotelGrid'),{childList:true});
  applyProvisionalPhotos();
});
import('./app-20260914.js?v=20260914-2');
