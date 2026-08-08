# Changelog

## Unreleased

### Added
- Pilot rank progression (`src/pilot/rank.ts`): epaulette ladder Student → Instructor, `effectiveRankHours`, `computePilotProgress`
- Country registry entry `LV` (Latvia / LGS) with SE↔LV Baltic AABB tip heuristic
- `ZoneSource` value `"lgs"`; hard no-fly for PROHIBITED / ATZ / CTR / Riga airport zones
- Country registry entry `IE` (Ireland / IAA) — no border overlap with current coverage
- `ZoneSource` value `"iaa"`; hard no-fly for PROHIBITED / CTR / prison / airport Red zones
- Country registry entry `SE` (Sweden / LFV Drönarkarta) with DK↔SE Øresund border heuristic
- `ZoneSource` value `"lfv"`; hard no-fly for CTR / ATZ / TIZ / RWY5K / heliport buffers
- Country registry entries `PT` (Portugal / ANAC) and `AT` (Austria / Austro Control) with ES↔PT and AT↔DE/CH/CZ border heuristics
- `ZoneSource` values `"anac"` / `"austro"`; hard no-fly for Portuguese PROHIBITED/emergency and Austrian AIR_TRAFFIC zones
- Country registry entry `CH` (Switzerland / FOCA) with CH↔DE / CH↔FR border heuristics
- `ZoneSource` value `"foca"`; hard no-fly for AIR_TRAFFIC / aerodrome Swiss zones
- Country registry entry `DK` (Denmark / Dronezoner) with DE↔DK Flensburg border heuristics
- `ZoneSource` value `"dronezoner"`; hard no-fly for Rød / airport / HEMS / military Danish zones
- German UI locale (`de`) for labels / status / pin kinds
- French UI locale (`fr`) for labels / status / pin kinds
- Harden `statusLabel` / `pinKindLabel` when locale is missing from the maps
- Country registry entry `FR` (France / Géoportail) with DE↔FR and ES↔FR border heuristics
- Country registry entry `DE` (Germany / dipul) with DE↔CZ / DE↔PL border heuristics
- Hard no-fly heuristics for German aerodromes (FLUGHAFEN / FLUGPLATZ / ED-R) and Czech inner AD zones (LKR314B/D/F)

### Changed
- `zoneVisualStatus` / military detection recognise German `MILITAER` and Czech `VOJENSK` reasons
- DE↔FR border: Rhine centerline + Saarland wedge (was a fixed lng≥7.7 that mis-tagged Strasbourg)
- ES↔FR border: Atlantic Basque Bidassoa tip (Irun/Hendaye) before Pyrenees latitude split

## [0.3.0] — 2026-07-30

### Added
- Country registry entry `CZ` (Czechia / ANS CR) with bounds ordered before Poland for AABB ties
- `ZoneSource` value `"anscr"` for Czech UAS zones (live aimgis tag)

## [0.2.0] — 2026-07-30

### Added
- Country registry (`ES`, `PL`) with bbox coverage helpers: `resolveCountry`, `countriesForBbox`, `inCoverageHint`, `coverageBounds`
- `ZoneSource` value `"pansa"` for Poland UAS zones
- Optional `MatchedZone.country`

### Changed
- Spain-only classify heuristics gated behind Spain zone checks so Poland/PANSA zones do not inherit Spanish free-band / NP* rules

## [0.1.0]

Initial shared schemas, geo helpers, and ED-318 types.
