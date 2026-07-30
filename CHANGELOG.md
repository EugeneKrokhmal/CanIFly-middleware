# Changelog

## Unreleased

### Added
- Country registry entry `DE` (Germany / dipul) with DE↔CZ / DE↔PL border heuristics
- Hard no-fly heuristics for German aerodromes (FLUGHAFEN / FLUGPLATZ / ED-R) and Czech inner AD zones (LKR314B/D/F)

### Changed
- `zoneVisualStatus` / military detection recognise German `MILITAER` and Czech `VOJENSK` reasons

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
