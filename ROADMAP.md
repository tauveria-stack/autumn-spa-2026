# Autumn SPA / Travel Planner Roadmap

## Current release — finish reliability first
- Keep the current Ukraine hotel search stable, mobile-friendly and data-driven.
- Priorities: verified prices/availability, Booking/Google/Agoda reputation, best available offer, coupon sources, hero photo, exact check time, clear couple vs 2+1 scoring.
- Avoid scope creep and avoid unnecessary GitHub/CI cost.

## Near-term 1.x — useful extensions without rebuilding the product
### Ukraine grouping
Rank hotels separately as:
1. Прикарпаття
2. Закарпаття
3. Високі Карпати
4. Перлини України — strong Ukrainian destinations outside the Carpathian regions

### Hot Deals
- Detect genuinely exceptional offers, not advertising percentages.
- Compare the final price for the same dates, room, guest composition and inclusions against the best normal rate.
- Highlight Hot Deal on the dashboard.
- Hourly monitor is the maximum supported notification frequency; notify quickly when a verified deal is materially better or at risk of disappearing.

### Search parameters instead of hard-coded trip data
- dates or date range
- adults / children / ages
- budget
- regions
- trip type and desired amenities

## Travel 2.0 — universal trip discovery
### Where do you want to go?
Modes:
- Україна
- Європа
- море
- круїз
- гори
- будь-куди / surprise me
- весь світ

### When?
Support:
- exact dates
- flexible date window
- season: winter / spring / summer / autumn
- school holidays: winter / spring / autumn / summer

For school holidays, resolve the current year dynamically from authoritative Kyiv / education guidance and mark dates as approximate where individual schools may set their own calendar.

### Who is travelling?
Dynamic party up to at least five people. Do not hard-code a single family composition into hotel objects. Support saved traveller profiles and quick presets, while keeping ages editable for each search.

### Human preference filters
Use understandable preferences rather than only technical hotel filters. Candidate dimensions:
- тиша ↔ двіж
- затишок / романтика
- SPA / wellness
- басейни / аквапарки
- море / пляж
- парки / лунапарки / розваги
- екскурсії / культура / гастрономія
- гори / природа
- активний ↔ пасивний відпочинок
- дитячий відпочинок
- accessibility / comfortable pace for older travellers

Behind the UI these become weighted scoring factors, not rigid yes/no filters.

### Comparison modes
- Ukraine ranking by itself.
- Worldwide ranking including Ukraine when appropriate.
- Category comparison, e.g. a sea holiday can compare Turkey, Egypt, Greece, Italy, etc., while still allowing the user to exclude or include Ukraine.
- Filters must remain user-adjustable after results are shown.

## Product rule
Do not build 2.0 features until the current hotel-search core is trustworthy. Add low-cost 1.x improvements when they increase decision quality without destabilising the data model or increasing infrastructure cost.