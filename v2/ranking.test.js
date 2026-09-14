const assert=require('assert');
const R=require('./ranking.js');

const profile={
  destinationMode:'mountains',rankingMode:'ukraine',budgetPerNight:7000,
  date:{mode:'exact',checkIn:'2026-10-24',checkOut:'2026-10-31'},
  travellers:[{label:'A',age:46},{label:'B',age:50}],
  preferences:{quiet:5,spa:5,pools:4,nature:5,active:1,kids:0,culture:1,entertainment:0}
};
const hotel={
  id:'demo',name:'Demo SPA',location:'Яремче',region:'Івано-Франківська область',group:'Карпати',url:'https://example.test',checkedAt:'2026-09-14T00:00:00Z',indoorSpa:true,
  couple:{eligible:true,pricePerNight:6000,total7Nights:42000,priceStatus:'confirmed',score:8.2,room:'Standard',included:'SPA, басейн',meals:'breakfast',verdict:'Тихий SPA біля природи',pros:['ліс','сауна'],cons:[]},
  family:{eligible:true,pricePerNight:7200,total7Nights:50400,priceStatus:'confirmed',score:7.8,room:'Family',included:'SPA',meals:'breakfast',verdict:'Сімейний варіант',pros:['дитяча кімната'],cons:[]}
};

assert.equal(R.groupType(profile),'couple');
assert.equal(R.nights(profile),7);
assert.equal(R.budgetFit(6000,7000),1);
assert.equal(R.destinationAllowed(hotel,profile),true);
const adapted=R.adaptHotel(hotel,profile);
assert.equal(adapted.snapshot.regular_price,6000);
assert.equal(adapted.snapshot.totalPrice,42000);
assert(adapted.taxonomy.includes('prykarpattia'));
assert(adapted.profileScore>8);
assert(adapted.preferenceFit>0.8);

const family={...profile,travellers:[...profile.travellers,{label:'Child',age:10}]};
const familyAdapted=R.adaptHotel(hotel,family);
assert.equal(familyAdapted.profileKind,'family');
assert.equal(familyAdapted.snapshot.regular_price,7200);
assert.equal(familyAdapted.snapshot.childSupplement,'embedded_or_needs_confirmation');

const sea={...profile,destinationMode:'sea',rankingMode:'sea'};
assert.equal(R.rankHotels([hotel],sea).length,0,'Ukrainian production hotel base must not masquerade as sea inventory');
const ranked=R.rankHotels([hotel],profile);
assert.equal(ranked.length,1);
assert.equal(ranked[0].rankingMode,'ukraine');
assert.equal(ranked[0].hotel.id,'demo');

console.log('Travel 2.0 ranking contract: PASS');
