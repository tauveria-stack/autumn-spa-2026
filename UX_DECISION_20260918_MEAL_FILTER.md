# Meal-filter interaction correction — 2026-09-18

Status: accepted from repeated USER_PROBE and implemented as successor decision to `UX_SPEC_20260917.md` §5.

## Problem
All four meal classes are active by default. The previous implementation treated a click on an already-active `Триразове` button as exclusion of full board. Repeated user probes described the same action as “set/select the three-meal filter”, so the UI behavior inverted the user's operational intent and made Hotel Helikon disappear.

## Interaction rule
- All meal classes remain active by default.
- When all meal classes are active and the user clicks one meal class, that click means **focus/select this class**: it becomes the sole active meal class.
- After the set is narrowed, meal buttons continue to support multi-select inclusion/exclusion.
- Exact tariff classes remain unchanged; breakfast/half-board/full-board do not imply one another.
- Filtering still operates on tariffs and returns one card per physical hotel.

## Main-price invariant
The scenario base tariff is always a candidate alongside explicit alternative offers. The main displayed tariff is the cheapest compatible tariff among the currently active meal classes. Explicit offers without their own `value` must not inherit another tariff's value score.

## Helikon regression fixture
For `helikon-yanoshi`:
- all meal classes active → cheapest compatible base RO tariff may be selected;
- click `Триразове` from the all-active default → full board becomes the sole active class and Helikon must remain visible;
- couple full-board comparison value: confirmed 17,800 UAH / 6 nights; normalized 7-night comparison ≈20,767 UAH;
- family 2+1 without sports component: 26,700 UAH / 6 nights; normalized comparison 31,150 UAH;
- normalized values are comparison-only, not confirmed bookable 7-night tariffs.
