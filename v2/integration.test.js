const assert=require('assert');
const fs=require('fs');
const D=require('./domain.js');
const R=require('./ranking.js');

const html=fs.readFileSync(__dirname+'/index.html','utf8');
const app=fs.readFileSync(__dirname+'/app.js','utf8');
assert(html.indexOf('domain.js')>=0,'domain.js must be loaded');
assert(html.indexOf('domain.js')<html.indexOf('ranking.js'),'domain.js must load before ranking.js');
assert(html.indexOf('ranking.js')<html.indexOf('app.js'),'ranking.js must load before app.js');
assert(!app.includes('.slice(0,12)'),'UI must not impose a hidden TOP-12 cap');
assert(!app.includes('shortlistLimit'),'UI must not reintroduce a shortlist-limit compatibility path');
assert(app.includes("$('results').innerHTML=ranked.map"),'UI must render the complete ranked result set returned by ranking engine');

const hotel={id:'demo',name:'Demo',location:'Яремче',region:'Івано-Франківська область',group:'Карпати',url:'https://example.test',checkedAt:'2026-09-14T00:00:00Z'};
const variant={eligible:true,pricePerNight:6000,total7Nights:42000,priceStatus:'confirmed',room:'Standard',included:'SPA',meals:'breakfast',score:8};
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

const profile={destinationMode:'ukraine',rankingMode:'ukraine',travellers:[{age:35}],budgetPerNight:7000,preferences:{spa:5},maxShortlist:20};
const many=Array.from({length:55},(_,i)=>({id:`h${i}`,name:`Hotel ${String(i).padStart(2,'0')}`,location:'Яремче',region:'Івано-Франківська область',group:'Карпати',couple:{...variant,score:10-i/100},family:{...variant,score:10-i/100}}));
const ranked=R.rankHotels(many,profile);
assert.equal(ranked.length,55,'all qualifying candidates must survive ranking regardless of legacy maxShortlist');
assert(ranked[0].profileScore>=ranked[54].profileScore,'full result set must remain ranking ordered');
assert.equal(R.rankHotels(many,{...profile,maxShortlist:7}).length,55,'legacy maxShortlist must not cap candidate data');
console.log('Travel 2.0 integration contract: PASS');
