# Changelog

## [0.2.0] — 2026-07-30

### Added
- Country registry (`ES`, `PL`) with bbox coverage helpers: `resolveCountry`, `countriesForBbox`, `inCoverageHint`, `coverageBounds`
- `ZoneSource` value `"pansa"` for Poland UAS zones
- Optional `MatchedZone.country`

### Changed
- Spain-only classify heuristics gated behind Spain zone checks so Poland/PANSA zones do not inherit Spanish free-band / NP* rules

## [0.1.0]

Initial shared schemas, geo helpers, and ED-318 types.
