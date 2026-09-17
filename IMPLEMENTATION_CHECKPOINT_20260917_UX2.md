# Implementation checkpoint — UX2
Date: 2026-09-17
Spec: `UX_SPEC_20260917.md`

## Durable change
- Fixed the known physical-property duplication of Chervona Ruta in the production merge layer.
- `chervona-ruta` (older/stale identity) and `chervona-ruta-shayan` describe the same physical hotel in Shayan.
- When the canonical `chervona-ruta-shayan` record is present, the merge now removes the stale `chervona-ruta` record before returning the published dataset.
- This prevents duplicate cards and prevents the stale record from falsely increasing hotel count or support counts for meal/wellness filters.

## Resulting dataset invariant
- Current merged feed should expose 25 physical properties rather than 26 records representing 25 properties.
- Canonical retained identity: `chervona-ruta-shayan`.
- The stale record remains in its historical source feed for provenance but is not published by the merge layer.

## Commit
- `7723a4bc03d536ed1d31f0503b0584cc3726a575` — production merge deduplication.

## Next READY
1. Re-run merged-feed/UI smoke against the new 25-property invariant.
2. Canonicalize structured wellness evidence (pool / sauna / hammam / jacuzzi / gym) without UNKNOWN→NO.
3. Canonicalize tariff arrays for hotels with multiple evidenced meal plans; keep current scenario price as fallback where only one plan is evidenced.
4. Continue stable-ID photo migration and retire name-keyed provisional photo entries as canonical records become complete.
