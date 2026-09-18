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

## Remaining explicit photo debt — bounded source resolution CLOSED
Two canonical records remain intentionally explicit `MISSING`; this is accepted visible debt, not a hidden mapping failure:
- `underhill-resort-spa-pidhiria` — official `https://underhill-resort.com.ua/` and `/hotel/` re-verified 2026-09-18. They unambiguously identify UNDERHILL Resort & Spa Hotel at Pidhiria/Fermerska 2 and expose hotel/room imagery, but the available indexed evidence does not expose a stable direct attributable hero asset URL suitable for canonical binding. Keep `MISSING` rather than guess or scrape an unverified asset.
- `lybid-plaza-khmelnytskyi` — official `https://lybid-plaza.ua/` re-verified 2026-09-18 and identifies the hotel at Kamianetska 21, Khmelnytskyi. The official complex gallery mixes hotel, restaurant, nightclub, entertainment and retail imagery; the previously extracted candidate was a LUX nightclub asset. No category-safe direct hotel hero URL was established in the bounded source pass. Keep `MISSING` rather than risk cross-venue ownership.

Decision: do not spend additional cycles mining opaque page assets. Both IDs satisfy acceptance as explicit evidenced `MISSING`; source-resolution subnode is CLOSED. Reopen only on new decisive attributable asset evidence.

## Known resolved source-owned photos outside recovery registry
Current feeds also contain canonical resolved photos including `derenivska-kupil`, `bukovyna-chernivtsi`, `lh-hotel-spa-lviv`, `sribni-leleky-lutsk`, `verkhovyna-resort-kamianytsia`, and `helikon-yanoshi`; leave untouched unless loadability proves broken.

## Published/direct-asset loadability smoke — 2026-09-18
Targeted decisive probes of repaired official assets:
- `osonnya` — PASS: direct official JPEG loaded and visibly depicts Osonnia property.
- `aquapark-alligator-ternopil` — PASS: direct official JPEG loaded and visibly depicts HOTEL ALLIGATOR / aquapark complex.
- `nikoletta-hotel-spa-polyanytsia` — INCONCLUSIVE in the current web probe: the direct WEBP endpoint was not accessible through the probe tool. This is not evidence that the browser/runtime URL is broken; keep it pending browser/runtime loadability verification rather than misclassify it.

No cross-ID substitution was observed in the two successful targeted probes. This is partial smoke evidence only; it does not replace the all-card runtime gate.

## Current systemic coverage status
- Canonical-ID recovery/source resolutions in registry: **15** (12 verified legacy + Osonnia + Nikoletta + Alligator).
- Explicit canonical `MISSING`: **2** (`underhill-resort-spa-pidhiria`, `lybid-plaza-khmelnytskyi`), both evidence-backed and intentionally visible.
- No evidence of wrong-property substitution or duplicate name-keyed fallback in the active repair path.
- Exact merged-runtime total / exact VALID count still requires executable enumeration of all merged records; do not infer from UI filter counts.

Next acceptance gate: execute merged canonical enumeration plus remaining published runtime loadability/no-cross-ID smoke. Photo node closes when exact totals/classification are persisted and no hidden broken/wrong-property mapping remains.