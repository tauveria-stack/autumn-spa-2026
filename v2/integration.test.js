const assert=require('assert');
const D=require('./domain.js');

const rawHotel={id:'h1',name:'Test Carpathian Spa',location:'Яремче',region:'Івано-Франківська область',group:'Карпати',checkedAt:'2026-09-14T00:00:00Z',url:'https://example.invalid',family:{eligible:true,pricePerNight:6500,total7Nights:45500,priceStatus:'checked',included:'SPA',meals:'breakfast'}};
const snapshot=D.createSearchSnapshot({hotelId:rawHotel.id,profileKind:'family',variant:rawHotel.family,checkedAt:rawHotel.checkedAt,source:rawHotel.url});
assert.equal(snapshot.hotelId,'h1');
assert.equal(snapshot.regular_price,6500);
assert.equal(snapshot.best_offer_before_personal_discount,6500);
assert.deepEqual(D.classifyUkraineHotel(rawHotel),['prykarpattia']);

const discounted=D.attachDiscounts(snapshot,[{discount_type:'birthday',discount_value:10,value_type:'percent',stacking_rule:'exclusive'}]);
assert.equal(discounted.final_price_after_personal_discounts,5850);
assert.equal(discounted.discount_status,'confirmed');

const unresolved=D.attachDiscounts(snapshot,[{discount_type:'combat_veteran',discount_value:10,value_type:'percent',stacking_rule:'needs_confirmation'}]);
assert.equal(unresolved.final_price_after_personal_discounts,6500);
assert.equal(unresolved.discount_status,'needs_confirmation');

console.log('Travel 2.0 integration contract: PASS');
