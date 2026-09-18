# Photo coverage / ownership checkpoint — 2026-09-18

## Root cause
Commit `2a9d8cd1e04ed8fdf28d509ceadc4ac21381e42c` removed the legacy name-keyed provisional photo fallback before the verified active mappings were migrated into canonical stable-ID ownership. The prior checkpoint had already identified 12 active mappings and explicitly said they still required reconciliation/migration. Therefore the published placeholders are a systemic migration regression, not an Osonnia-only defect.

## Repair completed
`pearls-bootstrap.js` owns a centralized `photoById` registry keyed only by canonical stable hotel IDs. Existing resolved canonical `hotel.photo` wins. A registry asset can replace an explicit `photo.status=missing` only for the exact matching canonical ID and only after attributable provenance is verified. No hotel-name matching remains.

Restored verified legacy mappings (12): `verhovel`, `7-dniv-kamianets`, `sonyachnyi-provans-sataniv`, `dodo-spa-zhytomyr`, `respect`, `phoenix`, `gora`, `chervona-ruta-shayan`, `rikka`, `forest-house`, `chorna-skelya`, `solva-resort-medical-spa`.
Original migration repair: `c08609b507b690fd50abdfae7206513e42890e4d`.

## Official-source resolutions
- `osonnya`: `https://osonnya.com/upload/medialibrary/4ce/q4p97o0hy0ts5k3uvn8ygp8oghdkbxn9.jpg` — official Osonnia property site. Commits `e3784ae95eba3ee1ce98c18a41df7415b97bfb99`, cache `5d3a146854b947bbe8e6b1f8dc66920248f28323`.
- `nikoletta-hotel-spa-polyanytsia`: `https://nikoletta-hotel.com/wp-content/uploads/2026/09/nikoletta-hero-winter.webp` — direct image exposed by the official Nikoletta Hotel & SPA Polyanytsia page; image visibly carries Nikoletta property signage and official page identifies address 151B Karpatska St, Polyanytsia.
- `aquapark-alligator-ternopil`: `https://alligator.te.ua/aligator.org.ua/userfiles/image/%D0%9F%D0%B0%D0%BD%D0%BE%D1%80%D0%B0%D0%BC%D0%B0_%D0%B4%D0%BE%202%20%D0%BC%D0%B1.jpg` — direct image linked from the official Hotel Alligator page; panorama visibly shows HOTEL ALLIGATOR and the aquapark entrance.
Nikoletta + Alligator canonical-ID repair commit: `eaa159a3df41ba396dd474e3019ca30d329d1642`.

## Remaining explicit photo debt
Two canonical records remain explicit MISSING after this pass:
- `underhill-resort-spa-pidhiria` — official property/hotel/SPA pages verified, but a stable direct attributable image URL was not resolved in this bounded pass. Keep MISSING rather than guess.
- `lybid-plaza-khmelnytskyi` — official Lybid Plaza site and gallery verified; gallery contains mixed hotel/restaurant/nightclub/entertainment images and the first extracted asset was a LUX nightclub image, so it is unsafe to assign without category-specific attribution. Keep MISSING rather than risk cross-venue ownership.

## Known resolved source-owned photos outside recovery registry
Current feeds also contain canonical resolved photos including `derenivska-kupil`, `bukovyna-chernivtsi`, `lh-hotel-spa-lviv`, `sribni-leleky-lutsk`, `verkhovyna-resort-kamianytsia`, and `helikon-yanoshi`; leave untouched unless loadability proves broken.

## Current systemic coverage status
- Canonical-ID recovery/source resolutions in registry: **15** (12 verified legacy + Osonnia + Nikoletta + Alligator).
- Explicit canonical `MISSING` remaining: **2** (`underhill-resort-spa-pidhiria`, `lybid-plaza-khmelnytskyi`).
- No evidence in this pass of wrong-property substitution or duplicate name-keyed fallback in the active repair path.
- Exact merged-runtime total / exact VALID count still requires executable enumeration of all merged records; do not infer from UI filter counts.

Next: resolve Underhill/Lybid only if attribution is decisive, then execute merged canonical enumeration plus published runtime loadability/no-cross-ID smoke and close with exact counts. Never revert to name-keyed fallback.