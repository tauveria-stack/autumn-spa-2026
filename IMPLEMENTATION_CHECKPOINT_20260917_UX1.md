# Implementation checkpoint — UX1
Date: 2026-09-17
Spec: `UX_SPEC_20260917.md`

## Implemented in first coherent slice
- New page header `Осінній SPA` for 24–31 October, with meaningful-update date/time slot.
- Global scenario switch `Удвох` / `З дитиною · 10 років`.
- `Для дітей` quick selector is hidden in couple mode and appears only in 2+1; switching to 2+1 does NOT activate it and does not pre-filter other hotels.
- Quick selectors: Best SPA / Rare finds / Mountain stay / optional Kids.
- Sorting controls: integral rating, value, total cost.
- Oblast-based multi-toggle region filter, all current oblasts active initially.
- Exact meal-class toggle UI, all active initially. Existing single-plan records are classified conservatively; unknown meal evidence is not treated as NO.
- Wellness requirement controls. Strict exclusion only occurs on canonical explicit NO; UNKNOWN is retained. Existing `indoorSpa` can support pool presence until richer canonical feature fields are populated; other missing structured features remain UNKNOWN.
- 7-night maximum range from zero to unlimited endpoint; no fixed 20k floor.
- Dynamic `Знайдено N готелів` result count.
- Card hierarchy moved price high: 7-night total, price/night, meal context, selective `Ціна / якість` badge.
- Independent Booking reputation row supports score + review count from current structured reputation data.
- Child-specific card information remains absent in couple mode.
- Canonical photo remains first-path; existing provisional photo layer is still legacy debt and was not expanded.

## Deliberately not faked
- No prose-search implementation for sauna/hammam/jacuzzi/gym strict filtering. Missing structured evidence stays UNKNOWN.
- No fabricated Google Maps points; map link is rendered only when a verified maps URL exists in the record.
- No invented alternative tariff totals. The UI has a slot for alternatives, but records need canonical multi-tariff data first.
- No automatic SPA-fee addition to accommodation total.

## Commits
- `e3cc7e887f564ff4057e617e761b635bfbb27f7f` — page/control/card hierarchy.
- `2341e936617afbc2a2a8d829b97de0cff0c4b6a4` — scenario/filter/sort/card behavior.
- `d14cd148175d0b594ff01a661d3cd16b95eecbc5` — styling.

## Next READY
1. Smoke live render and fix regressions.
2. Deduplicate Chervona Ruta physical identity before counts/filter support are trusted.
3. Canonicalize structured wellness fields and multi-tariff meal records without UNKNOWN→NO.
4. Continue Phase A photo migration: remove name-keyed provisional photo dependency after stable-ID migration.
5. Add verified map/address and richer independent reputation fields as evidence is collected.
