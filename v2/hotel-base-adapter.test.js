const assert=require('assert');
const A=require('./hotel-base-adapter.js');
assert(A.DEFAULT_SOURCE.includes('/main/hotels.json'),'adapter must read production main hotel base');
assert.deepEqual(A.DEFAULT_COVERAGE,{dateMode:'exact',checkIn:'2026-10-24',checkOut:'2026-10-31'});
const normalized=A.normalizeHotelBase({version:3,updatedAt:'2026-09-14T00:00:00Z',hotels:[{id:'a'}]});
assert.equal(normalized.hotels.length,1);
assert.equal(normalized.sourceVersion,3);
assert.deepEqual(normalized.hotels[0]._sourceCoverage,A.DEFAULT_COVERAGE);
(async()=>{
  let requested=null;
  const fakeFetch=async(url,opts)=>{requested={url,opts};return {ok:true,status:200,json:async()=>({hotels:[{id:'x'}]})}};
  const loaded=await A.loadHotelBase({fetchImpl:fakeFetch});
  assert.equal(requested.url,A.DEFAULT_SOURCE);
  assert.equal(requested.opts.cache,'no-store');
  assert.equal(loaded.hotels[0].id,'x');
  assert.deepEqual(loaded.coverage,A.DEFAULT_COVERAGE);
  await assert.rejects(()=>A.loadHotelBase({fetchImpl:async()=>({ok:false,status:503})}),/503/);
  console.log('Travel 2.0 hotel base adapter/source coverage: PASS');
})().catch(err=>{console.error(err);process.exitCode=1});