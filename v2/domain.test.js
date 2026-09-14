const assert=require('node:assert/strict');
const D=require('./domain.js');

assert.deepEqual(D.classifyUkraineHotel({location:'Яремче, Івано-Франківська область'}),['prykarpattia']);
assert.deepEqual(D.classifyUkraineHotel({location:'Кваси, Закарпатська область'}).sort(),['high_carpathians','zakarpattia'].sort());
assert.deepEqual(D.classifyUkraineHotel({location:'Київ'}),['pearls_ukraine']);
assert.equal(D.normalizeRankingMode('sea'),'sea');
assert.equal(D.normalizeRankingMode('unknown'),'ukraine');

const snap=D.createSearchSnapshot({hotelId:'h1',profileKind:'family',variant:{pricePerNight:5000,total7Nights:35000,priceStatus:'known'}});
assert.equal(snap.regular_price,5000);
assert.equal(snap.best_offer_before_personal_discount,5000);
assert.equal(snap.final_price_after_personal_discounts,5000);
assert.equal(snap.price_status,'known');

const offerSnap=D.createSearchSnapshot({hotelId:'h2',profileKind:'couple',variant:{regularPricePerNight:7000,bestOfferPerNight:5600,totalPrice:39200,priceStatus:'estimate'}});
assert.equal(offerSnap.regular_price,7000);
assert.equal(offerSnap.best_offer_before_personal_discount,5600);
assert.equal(offerSnap.final_price_after_personal_discounts,5600);
assert.equal(offerSnap.totalPrice,39200);
assert.equal(offerSnap.price_status,'estimate');

const exclusive=D.attachDiscounts(snap,[
  {discount_type:'birthday',discount_value:10,stacking_rule:'exclusive'},
  {discount_type:'combat_veteran',discount_value:15,stacking_rule:'exclusive'}
]);
assert.equal(exclusive.final_price_after_personal_discounts,4250);
assert.deepEqual(exclusive.applied_discounts,['combat_veteran']);

const stacked=D.attachDiscounts(snap,[
  {discount_type:'birthday',discount_value:10,stacking_rule:'stackable'},
  {discount_type:'combat_veteran',discount_value:10,stacking_rule:'stackable'}
]);
assert.equal(stacked.final_price_after_personal_discounts,4050);

const discountedOffer=D.attachDiscounts(offerSnap,[{discount_type:'birthday',discount_value:10,stacking_rule:'stackable'}]);
assert.equal(discountedOffer.regular_price,7000);
assert.equal(discountedOffer.best_offer_before_personal_discount,5600);
assert.equal(discountedOffer.final_price_after_personal_discounts,5040);

const uncertain=D.attachDiscounts(snap,[{discount_type:'birthday',discount_value:10,stacking_rule:'needs_confirmation'}]);
assert.equal(uncertain.final_price_after_personal_discounts,5000);
assert.equal(uncertain.discount_status,'needs_confirmation');

console.log('Travel 2.0 domain/pricing-layer tests: PASS');
