document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.photo-fallback').forEach(el=>el.textContent='Фото поки відсутнє');
  const price=document.getElementById('priceFilter');
  if(price) price.value='999999';
  const spa=document.getElementById('spaFilter');
  if(spa) spa.checked=false;
});
import('./app-20260914.js?v=20260914-2');
