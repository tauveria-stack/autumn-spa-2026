const assert=require('assert');
const fs=require('fs');
const D=require('./domain.js');

const html=fs.readFileSync(__dirname+'/index.html','utf8');
assert(html.indexOf('domain.js')>=0,'domain.js must be loaded');
assert(html.indexOf('domain.js')<html.indexOf('app.js'),'domain.js must load before app.js');

const hotel={id:'demo',name:'Demo',location:'Яремче',region:'Івано-Франківська область',group:'Карпати',url:'https://example.test',checkedAt:'2026-09-14T00:00:00Z'};
const variant={eligible:true,pricePerNight:6000,total7Nights:42000,priceStatus:'confirmed',room:'Standard',included:'SPA',meals:'breakfast'};
const snapshot=D.createSearchSnapshot({hotelId:hotel.id,profileKind:'couple',variant,checkedAt:hotel.checkedAt,source:hotel.url});
assert.equal(snapshot.hotelId,'demo');
assert.equal(snapshot.regular_price,6000);
assert.equal(snapshot.best_offer_before_personal_discount,6000);
assert.equal(snapshot.final_price_after_personal_discounts,6000);
assert.equal(snapshot.totalPrice,42000);
assert.equal(snapshot.room,'Standard');
assert.equal(snapshot.source,'https://example.test');
assert(D.classifyUkraineHotel(hotel).includes('prykarpattia'));
assert.equal(D.normalizeRankingMode('sea'),'sea');
assert.equal(D.normalizeRankingMode('invalid'),'ukraine');

const confirmed=D.attachDiscounts(snapshot,[{discount_type:'birthday',discount_value:10,value_type:'percent',stacking_rule:'exclusive'}]);
assert.equal(confirmed.final_price_after_personal_discounts,5400);
assert.equal(confirmed.discount_status,'confirmed');
const pending=D.attachDiscounts(snapshot,[{discount_type:'birthday',discount_value:10,value_type:'percent',stacking_rule:'needs_confirmation'}]);
assert.equal(pending.final_price_after_personal_discounts,6000);
assert.equal(pending.discount_status,'needs_confirmation');
console.log('Travel 2.0 integration contract: PASS');
