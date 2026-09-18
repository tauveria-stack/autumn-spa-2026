# Photo coverage / ownership checkpoint — 2026-09-18

## Root cause
Commit `2a9d8cd1e04ed8fdf28d509ceadc4ac21381e42c` removed the legacy name-keyed provisional photo fallback before the verified active mappings were migrated into canonical stable-ID ownership. The prior checkpoint had already identified 12 active mappings and explicitly said they still required reconciliation/migration. Therefore the published placeholders are a systemic migration regression, not an Osonnia-only defect.

## Repair in this pass
`pearls-bootstrap.js` now owns a centralized `photoById` registry keyed only by canonical stable hotel IDs. Existing `hotel.photo` always wins. A registry photo is injected only into the exact matching ID and is marked `status=resolved`, `heroQuality=accepted`, with migration provenance. No hotel-name matching remains in this repair path.

Restored verified mappings (12):
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

Code commit: `c08609b507b690fd50abdfae7206513e42890e4d`
Cache lineage: `9ad93083d049668d3f07ac277a1505d541b1a241` → `80fffa35aa3905f6ff37cf2968a1ff2f6a8a69be`.

## Osonnia
`osonnya` remains explicit MISSING in canonical runtime data at this checkpoint. Fresh source verification found the official Osonnia site and official gallery/property imagery, but no trustworthy direct image URL was available through the current source interface. Do not invent or guess a media path. This remains visible debt rather than assigning a wrong/unverifiable image.

## Remaining acceptance work
This is a productive systemic repair checkpoint, not final photo-coverage PASS. Exact all-card coverage counts still require enumerating the merged runtime inventory after all 11 feeds and checking actual image loadability. The next photo node is: enumerate merged canonical IDs → classify VALID/MISSING/BROKEN/IDENTITY_RISK → obtain direct provenance-backed images for true MISSING (starting with `osonnya`) → published runtime smoke. Do not revert to name-keyed fallback.