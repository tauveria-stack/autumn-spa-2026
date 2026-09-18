import fs from 'node:fs';
import assert from 'node:assert/strict';

const app = fs.readFileSync(new URL('../app-20260914.js', import.meta.url), 'utf8');
const entry = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const bootstrap = fs.readFileSync(new URL('../pearls-bootstrap.js', import.meta.url), 'utf8');
const helikon = JSON.parse(fs.readFileSync(new URL('../hotels-helikon-20260917.json', import.meta.url), 'utf8')).hotels.find(h => h.id === 'helikon-yanoshi');

assert.ok(helikon, 'Helikon canonical record must exist');
assert.match(index, /app\.js\?v=20260918-meal-filter-2/, 'published index must address current app entry');
assert.match(entry, /pearls-bootstrap\.js\?v=20260918-identity-2/, 'entry must address current identity/data bootstrap');
assert.match(entry, /app-20260914\.js\?v=20260918-meal-filter-2/, 'entry must address current meal runtime');
assert.match(bootstrap, /hotels-helikon-20260917\.json/, 'runtime feed chain must include Helikon feed');
assert.match(app, /state\.meals\.size===all\.length&&state\.meals\.has\(k\)\)\{state\.meals=new Set\(\[k\]\)\}/, 'clicking one meal from all-active must isolate it');
assert.match(app, /return\[\{\.\.\.base,_isExplicitOffer:false\},\.\.\.explicit\]/, 'base and explicit offers must both remain candidates');
assert.match(app, /if\(!Object\.prototype\.hasOwnProperty\.call\(o,'value'\)\)delete merged\.value/, 'explicit offer must not inherit base value score');

const couple = helikon.couple.offers.find(o => o.offerId === 'trainer-fullboard-6n-2a');
const family = helikon.family.offers.find(o => o.offerId === 'trainer-fullboard-6n-2a1c-no-sport');
assert.ok(couple && family, 'both Helikon scenario full-board offers must exist');
assert.equal(couple.meals, '3-разове харчування');
assert.equal(couple.actualNights, 6);
assert.equal(couple.actualTotal, 17800);
assert.ok(Math.abs(couple.total7Nights - 20766.6666666667) < 0.01);
assert.equal(family.meals, '3-разове харчування');
assert.equal(family.actualNights, 6);
assert.equal(family.actualTotal, 26700);
assert.equal(family.total7Nights, 31150);
assert.equal(helikon.couple.total7Nights, 15400, 'base no-meal tariff remains distinct');
assert.equal(helikon.couple.meals, 'без харчування');

console.log('PASS Helikon runtime-chain/source regression: entry -> bootstrap -> feed -> meal interaction -> offer economics/value isolation');
