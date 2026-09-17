# Autumn SPA — empirical filter analysis

Date: 2026-09-17
Scope: current production merge in `pearls-bootstrap.js`; 10 feeds; no new discovery.

## 1. Exact merged inventory

The production merge contains **26 unique stable IDs**. This is the exact result of applying the current `Map(id)` merge order.

IDs:
`respect`, `forest-house`, `phoenix`, `chervona-ruta`, `rikka`, `gora`, `chorna-skelya`, `ivory`, `rado-hotel-spa`, `perlyna-resort-sokyrno`, `karpaty-migovo`, `derenivska-kupil`, `chervona-ruta-shayan`, `solva-resort-medical-spa`, `7-dniv-kamianets`, `verhovel`, `bukovyna-chernivtsi`, `lh-hotel-spa-lviv`, `sonyachnyi-provans-sataniv`, `dodo-spa-zhytomyr`, `sribni-leleky-lutsk`, `nikoletta-hotel-spa-polyanytsia`, `underhill-resort-spa-pidhiria`, `lybid-plaza-khmelnytskyi`, `aquapark-alligator-ternopil`, `verkhovyna-resort-kamianytsia`.

Important identity defect found: **`chervona-ruta` and `chervona-ruta-shayan` are the same physical property represented by two stable IDs with conflicting/older meal/SPA semantics.** The UI currently therefore has 26 records but only 25 physical properties. This should be deduplicated in canonical migration; do not use the stale duplicate to invent extra filter support.

## 2. Lightweight feature matrix — evidence already in records

Method: count a feature as YES only when current canonical record text/top-level fields explicitly evidence it. Absence of a mention is **UNKNOWN**, not NO. This deliberately avoids re-researching all hotels before producing a useful UI decision.

| Feature | Explicit YES / 26 records | Unknown/not explicit | UI decision now |
|---|---:|---:|---|
| Indoor SPA / indoor pool context (`indoorSpa`) | 25 | 0 unknown + 1 explicit false stale duplicate | FILTER; very relevant for late October |
| Sauna / Finnish sauna / sauna complex | 20 | 6 | FILTER |
| Hammam / Turkish/Roman steam room | 15 | 11 | FILTER |
| Jacuzzi / hydromassage pool | 12 | 14 | FILTER |
| Gym / fitness room | 6 | 20 | FILTER, but lower priority than water/steam features |
| Salt room | 3 | 23 | CARD DETAIL for now; not worth permanent top-level filter yet |
| Chan / vat | 0 explicit in current records | 26 | OMIT as filter now; re-evaluate only if canonical data later shows repeated evidence |
| Broad child facilities / club / room / strong child infrastructure | 9 | 17 | FILTER (`Для дітей`) because it materially changes 2+1 choice |
| Aquapark / water slides | 2 | 24 | CARD DETAIL / possibly a small rare-trip-defining filter only if UX has room; not core |
| Excursions/organized trips actually included in package | 1 | 25 | CARD DETAIL; do not make a global filter for one hotel |

These are **explicit-evidence counts**, not claims that the remaining hotels lack the feature. Before implementing strict exclusion filters, canonical feature fields should be populated so UNKNOWN is not treated as NO.

## 3. Food — categories actually evidenced

Using the current couple tariff/record as the primary trip scenario, with multi-plan availability noted separately:

- **Сніданок**: 20 records explicitly use breakfast as the primary/current meal plan.
- **Без харчування**: 1 current canonical record (`derenivska-kupil`) uses RO as the base tariff; another meal tariff is available.
- **Дворазове**: 2 records explicitly show two meals in their current primary record (`ivory`: breakfast+dinner; stale `chervona-ruta`: lunch+dinner). `sonyachnyi-provans-sataniv` additionally documents an optional breakfast+dinner tariff, so it should support multiple meal-plan tags when canonicalized.
- **Триразове**: 1 record (`chervona-ruta-shayan`) explicitly has breakfast+lunch+dinner in the current 7-night package.
- **All Inclusive**: **0 records**. Therefore **DO NOT SHOW an All Inclusive filter**.
- Meal plan unknown/depends on exact tariff: at least 2 records (`bukovyna-chernivtsi`, `lybid-plaza-khmelnytskyi`).

Food filter semantics: show only evidenced categories. All evidenced categories active by default. Toggle removes that exact tariff class. No `Неважливо`. No semantic supersets. A hotel with genuinely multiple bookable meal plans may carry multiple exact categories.

## 4. Evidence-based filter architecture

### Top of page
1. **Осінній SPA · 24–31 жовтня**.
2. **Останні оновлення** — human-facing feed with direct links to affected hotel cards; `Усі оновлення` expands history.
3. Global scenario switch: **`Удвох` | `З дитиною · 10 років`**. This is not a filter; it changes price, eligibility, score/value and ordering.

### Editorial selections
Keep intentionally short and separate from factual filters:
- **Найкращий SPA**
- **Рідкісні знахідки**

Do not manufacture a third button for symmetry. None selected = all hotels; selected editorial tags combine as explicit constraints.

### Sorting
- **Рейтинг ↓** (default)
- **Ціна / якість ↓**
- **Вартість ↑**

### Filters
**Регіон** — all current tourist-zone/region choices active initially; click to exclude. Use visible ✓ / ✕, not color alone. Final tourist-zone normalization should follow canonical region cleanup rather than raw oblast strings.

**Харчування** — only categories present in data: `Без харчування` · `Сніданок` · `Дворазове` · `Триразове`. All active initially. **No All Inclusive** at current dataset state.

**Велнес** — no requirements selected initially; selected requirements combine with AND. Core justified by current evidence: `Критий басейн` · `Сауна` · `Хамам` · `Джакузі` · `Тренажерна зала`. `Соляна кімната` stays on cards for now (3 explicit records). `Чан` omitted (0 explicit records). `Теренкур` remains removed by user decision.

**Для відпочинку** — keep tiny: `Для дітей` is justified (9 explicit records). `Аквапарк / гірки` is only 2 explicit records, so default recommendation is card detail rather than permanent filter. `Екскурсії в пакеті` is 1 explicit record and should be card detail, not a filter.

**Вартість 7 ночей** — one maximum slider for the active scenario; right endpoint = `Без ліміту`. No minimum slider.

## 5. Implementation guardrails discovered by this analysis

1. Do not implement strict amenity exclusion from prose search. Add canonical structured feature fields first or explicitly preserve UNKNOWN so it does not behave as NO.
2. Deduplicate the two Chervona Ruta IDs before deriving production counts/categories.
3. Meal plans belong to tariff/scenario evidence and may be multi-valued when multiple actual tariffs exist.
4. `indoorSpa` is too broad to stand in for `Критий басейн`; canonical fields should distinguish pool, sauna, hammam, jacuzzi, gym, salt room, etc.
5. The analysis supports a **small UI**, not a feature catalogue: frequent + decision-relevant = filter; rare = card detail; zero = omit.

## 6. Immediate next READY work

Return to bounded Phase A without losing this result: deduplicate Chervona Ruta identity; map the 17 legacy `provisionalPhotos` entries to stable IDs; resolve UNDERHILL/Nikoletta/Lybid/Alligator and Kyivska Russ photo debt; then remove name-keyed photo dependency and smoke the 25 physical-property canonical set. In parallel, when feature fields are canonicalized, convert the explicit-evidence matrix above into structured booleans/enums without turning UNKNOWN into NO.
