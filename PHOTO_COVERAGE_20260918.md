# Photo coverage / ownership checkpoint — 2026-09-18

## Root cause
Commit `2a9d8cd1e04ed8fdf28d509ceadc4ac21381e42c` removed the legacy name-keyed provisional photo fallback before the verified active mappings were migrated into canonical stable-ID ownership. The prior checkpoint had already identified 12 active mappings and explicitly said they still required reconciliation/migration. Therefore the published placeholders are a systemic migration regression, not an Osonnia-only defect.

## Repair in this pass
`pearls-bootstrap.js` owns a centralized `photoById` registry keyed only by canonical stable hotel IDs. Existing `hotel.photo` always wins. A registry photo is injected only into the exact matching ID and is marked `status=resolved`, `heroQuality=accepted`, with migration provenance. No hotel-name matching remains in this repair path.

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
`osonnya` is no longer an unresolved source-debt item. The official Osonnia property page `/company/` exposes a hero image link for the physical resort; following that image link yields the direct official media URL:

`https://osonnya.com/upload/medialibrary/4ce/q4p97o0hy0ts5k3uvn8ygp8oghdkbxn9.jpg`

The image visibly depicts the Osonnia resort complex, pool and grounds and is hosted on the official `osonnya.com` domain. It is now bound only to canonical ID `osonnya` in `photoById`; no name fallback is used.

Osonnia code commit: `e3784ae95eba3ee1ce98c18a41df7415b97bfb99`.
Cache-bust commit: `5d3a146854b947bbe8e6b1f8dc66920248f28323` (`app-entry.js` loads `pearls-bootstrap.js?v=20260918-2`).

## Current systemic coverage status
Known repaired/resolved canonical-ID mappings this photo-recovery sequence: **13** (12 migrated verified legacy + Osonnia official-source resolution).

This is still not final all-card photo-coverage PASS. Exact merged-runtime totals require enumeration across all 11 feeds and actual loadability classification for every canonical ID. Remaining node: enumerate merged canonical IDs → classify VALID/MISSING/BROKEN/IDENTITY_RISK → source-repair any additional true MISSING → published runtime smoke. Do not revert to name-keyed fallback.