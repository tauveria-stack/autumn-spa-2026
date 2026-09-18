# Photo coverage / ownership checkpoint — 2026-09-18

## Root cause
Commit `2a9d8cd1e04ed8fdf28d509ceadc4ac21381e42c` removed the legacy name-keyed provisional photo fallback before the verified active mappings were migrated into canonical stable-ID ownership. The prior checkpoint had already identified 12 active mappings and explicitly said they still required reconciliation/migration. Therefore the published placeholders are a systemic migration regression, not an Osonnia-only defect.

## Repair completed
`pearls-bootstrap.js` owns a centralized `photoById` registry keyed only by canonical stable hotel IDs. Existing `hotel.photo` always wins. A registry photo is injected only into the exact matching ID. No hotel-name matching remains in this repair path.

Restored verified legacy mappings (12):
- `verhovel`
- `7-dniv-kamianets`
- `sonyachnyi-provans-sataniv`
- `dodo-spa-zhytomyr`
- `respect`
- `phoenix`
- `gora`
- `chervona-ruta-shayan`
- `rikka`
- `forest-house`
- `chorna-skelya`
- `solva-resort-medical-spa`

Original migration repair: `c08609b507b690fd50abdfae7206513e42890e4d`.

## Osonnia resolved from official provenance
`osonnya` is resolved from the official Osonnia property site. Direct official media URL:
`https://osonnya.com/upload/medialibrary/4ce/q4p97o0hy0ts5k3uvn8ygp8oghdkbxn9.jpg`

It is bound only to canonical ID `osonnya` in `photoById`; no name fallback is used.
Osonnia code commit: `e3784ae95eba3ee1ce98c18a41df7415b97bfb99`.
Cache-bust commit: `5d3a146854b947bbe8e6b1f8dc66920248f28323`.

## Explicit unresolved photo debt found in current runtime feeds
A feed-by-feed audit of the current 11-source merge chain identified four canonical records that explicitly declare `photo.status=missing` and `heroQuality=needs_review`:

- `nikoletta-hotel-spa-polyanytsia` — official property site and SPA gallery verified; direct stable attributable hero URL still unresolved.
- `underhill-resort-spa-pidhiria` — official property site and SPA page verified; direct stable attributable hero URL still unresolved.
- `lybid-plaza-khmelnytskyi` — source record explicitly remains photo-missing; official property gallery/SPA is the required provenance path.
- `aquapark-alligator-ternopil` — source record explicitly remains photo-missing; official property/Booking gallery is the required provenance path.

Nikoletta and Underhill official pages were re-verified on 2026-09-18 before this checkpoint. Their property identity and gallery existence are not in doubt; only a stable direct image asset is missing. Do not assign a guessed or visually plausible image.

## Known resolved source-owned photos outside the 13 recovery mappings
Current feeds also contain canonical resolved photos that already own their image directly, including `derenivska-kupil`, `bukovyna-chernivtsi`, `lh-hotel-spa-lviv`, `sribni-leleky-lutsk`, `verkhovyna-resort-kamianytsia`, and `helikon-yanoshi`; these must remain untouched unless loadability proves broken.

## Current systemic coverage status
- Recovery mappings repaired/resolved in this sequence: **13** (12 migrated verified legacy + Osonnia official-source resolution).
- Explicit canonical `MISSING` records currently evidenced: **4** (`nikoletta-hotel-spa-polyanytsia`, `underhill-resort-spa-pidhiria`, `lybid-plaza-khmelnytskyi`, `aquapark-alligator-ternopil`).
- No evidence in this pass of a wrong-property substitution or duplicate name-keyed fallback in the active repair path.
- Exact merged-runtime total / exact VALID count still requires executable enumeration of all merged records; do not infer it from UI filter counts.

Next: resolve the four explicit MISSING records from attributable sources where possible, then perform published runtime loadability/no-cross-ID smoke and close with exact merged-runtime counts. Do not revert to name-keyed fallback.