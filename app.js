document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.photo-fallback').forEach(el=>el.textContent='Фото поки відсутнє');
  const price=document.getElementById('priceFilter');if(price)price.value='999999';
  const spa=document.getElementById('spaFilter');if(spa)spa.checked=false;
  const footer=document.querySelector('.footer p');if(footer)footer.textContent='Рейтинг — редакційна оцінка за тишею, SPA, номером, харчуванням, репутацією, співвідношенням ціни та якості й тим, наскільки готель підходить для відпочинку наприкінці жовтня. Ціни перевіряємо саме на 24–31.10.2026, коли це доступно онлайн.';
});
import('./pearls-bootstrap.js?v=20260920-dedupe-chips-2').then(()=>import('./goral-bootstrap.js?v=20260920-strong-discovery-1')).then(()=>import('./vedmezha-bootstrap.js?v=20260920-strong-discovery-1')).then(()=>import('./fb-spa-bootstrap.js?v=20260920-strong-discovery-1')).then(()=>import('./romantik-bootstrap.js?v=20260920-strong-discovery-1')).then(()=>import('./mirotel-bootstrap.js?v=20260919-strong-discovery-1')).then(()=>import('./app-20260914.js?v=20260920-chips-max8-1'));