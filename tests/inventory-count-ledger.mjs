import fs from 'node:fs';
import assert from 'node:assert/strict';

const feeds = [
  'hotels-20260914.json',
  'hotels-pearls-20260914.json',
  'hotels-lowprice-20260916.json',
  'hotels-discovery-20260916.json',
  'hotels-discovery-20260916-1145.json',
  'hotels-discovery-20260916-1542.json',
  'hotels-discovery-20260916-1940.json',
  'hotels-discovery-20260916-2039.json',
  'hotels-discovery-20260916-2138.json',
  'hotels-discovery-20260916-2237.json',
  'hotels-helikon-20260917.json'
];

const rows = [];
for (const file of feeds) {
  const data = JSON.parse(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'));
  for (const hotel of data.hotels || []) rows.push({ file, id: hotel.id, name: hotel.name, location: hotel.location, url: hotel.url });
}

const occurrences = new Map();
for (const row of rows) {
  if (!row.id) throw new Error(`Missing stable id in ${row.file}: ${row.name || '<unnamed>'}`);
  const list = occurrences.get(row.id) || [];
  list.push(row);
  occurrences.set(row.id, list);
}

const byId = new Map();
for (const row of rows) byId.set(row.id, row);
const exactIdOverlays = [...occurrences.entries()].filter(([, list]) => list.length > 1);

// Canonical physical-property migrations supported by stronger identity evidence.
const migrations = [
  { oldId: 'chervona-ruta', canonicalId: 'chervona-ruta-shayan', reason: 'same physical Shayan property; established migration' },
  { oldId: 'solva', canonicalId: 'solva-resort-medical-spa', reason: 'same Polyana property; official site/contact evidence' }
];
const appliedMigrations = [];
for (const migration of migrations) {
  if (byId.has(migration.canonicalId) && byId.has(migration.oldId)) {
    byId.delete(migration.oldId);
    appliedMigrations.push(migration);
  }
}

assert.ok(byId.has('helikon-yanoshi'), 'Helikon must be present in canonical merged inventory');
assert.ok(!byId.has('solva') || !byId.has('solva-resort-medical-spa'), 'Solva physical property must not survive as two cards');
assert.ok(!byId.has('chervona-ruta') || !byId.has('chervona-ruta-shayan'), 'Chervona Ruta Shayan must not survive as two cards');

const ledger = {
  feedCount: feeds.length,
  rawRowsAcrossFeeds: rows.length,
  uniqueStableIdsBeforePhysicalMigrations: occurrences.size,
  exactIdOverlayCount: exactIdOverlays.length,
  exactIdOverlays: exactIdOverlays.map(([id, list]) => ({ id, occurrences: list.map(x => x.file) })),
  appliedPhysicalMigrations: appliedMigrations,
  canonicalPhysicalPropertyCountAfterKnownMigrations: byId.size,
  canonicalIds: [...byId.keys()].sort()
};

console.log(JSON.stringify(ledger, null, 2));
