# Legacy photo mapping checkpoint

All 17 name-keyed legacy photo entries in `app.js` were compared with the current published hotel inventory.

Active stable-ID mappings (12):
- Верховель -> `verhovel`
- 7 Днів -> `7-dniv-kamianets`
- VitaPark Сонячний Прованс -> `sonyachnyi-provans-sataniv`
- Dodo spa & hotel -> `dodo-spa-zhytomyr`
- RESPECT Hotel & SPA -> `respect`
- Phoenix Medical Resort -> `phoenix`
- SPA Hotel Гора -> `gora`
- Червона Рута -> `chervona-ruta-shayan`
- RIKKA Khust Thermal Resort -> `rikka`
- Forest House -> `forest-house`
- Чорна скеля -> `chorna-skelya`
- Solva Resort Medical & SPA -> `solva-resort-medical-spa`

Orphan legacy entries not present in the current published inventory (5): Belle Royalle, Kyivska Russ Resort Medical & Spa, Мольфар, Богольвар, Воєводино.

Consequence: only 12 active mappings require reconciliation/migration. The five orphan fallbacks should not remain a production dependency. Canonical `hotel.photo` remains authoritative and a good canonical photo must not be overwritten by a legacy fallback.

Next READY: reconcile the 12 active mappings against canonical photo objects, migrate only useful missing metadata, remove orphan/name-keyed fallback after safe coverage, then continue bounded technical photo debt and smoke the 25-property set.
