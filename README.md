# `@canifly/middleware`

Shared **TypeScript library** for CanIFly: Zod API schemas, UAS/ED-318 types, bbox helpers, **airspace status classification**, profile/map filters, and **EN/ES domain labels**.

Consumed by:

- [`CanIFly-api`](https://github.com/EugeneKrokhmal/CanIFly-api) — validate requests, classify status, filter zones
- [`CanIFly`](https://github.com/EugeneKrokhmal/CanIFly) — types, constants, labels, client-side helpers where needed

This package has **no Nest/Hono/Next dependency** — only Zod (+ Vitest for tests).

---

## Why a separate package?

| Goal | Approach |
|------|----------|
| One classification brain | `classifyStatus` and related predicates live here so API and tests never disagree |
| Contract stability | `pointStatusQuerySchema` and friends define the HTTP query shape once |
| i18n for domain terms | Status / obstacle labels in ES+EN without pulling Next into the API |
| Fast unit tests | Geo scenarios run in Vitest without spinning up PostGIS or Next |

Local install (sibling folders):

```json
"@canifly/middleware": "file:../CanIFly-middleware"
```

After changing source, rebuild so consumers see updates:

```bash
npm run build
```

(`prepare` may build on `npm install` when wired that way.)

---

## Technical decisions

### Status model

Outputs a single **`AirspaceStatus`**: typically Clear / Limited / Restricted / Prohibited (see types), plus matched zones and optional free-band ceiling.

Important domain rules (Spain / ENAIRE-oriented):

- **Hard no-fly** — surface aerodrome-style IDs (`XXXX0`) and explicit “NO PERMITIDO EL VUELO” messaging
- **National population advisories** (`NPDRID`, `NPRIAS`, …) treated as advisory for Open recreational, not automatic hard bans
- **Free VLOS bands** — many CTR-style zones encode “operations allowed below N m without coordination” via `lowerLimitM` + message text; flying under that ceiling is treated as limited/clear-with-ceiling rather than full restriction
- **Restriction ranking** — PROHIBITED > authorisation / conditional / USPACE > none, then combined with profile altitude overlap

See `src/geo/classify-status.ts` for the full algorithm.

### Profile filtering

- `filterByProfile` — altitude / weight / category overlap for **status** evaluation
- `filterForMap` — thinner set for **map paint** so the basemap stays readable
- `openCategoryCeiling` — clamps requested AGL to Open-category recreational ceiling (120 m default constant)

### Geometry helpers

- ArcGIS / ED-318 feature → internal `UasZone` slices (`normalize-slices`, `arcgisFeatureToUasZone`)
- Bbox clamp (`clampBboxSpan`) to avoid huge FeatureServer pulls
- WGS84 only; Spain coverage constants in `constants.ts` (`SPAIN_BOUNDS`, `SPAIN_CENTER`, servAIS layer IDs, ZGUAS ZIP URLs)

### Obstacle inactivity

```ts
isObstacleInactive(likes, dislikes) // dislikes / total > 0.5
```

Shared so map dimming and API agree.

### Packaging

- `"type": "module"` — ESM `dist/`
- Exports map: `"."` → `dist/index.js` + `.d.ts`
- Consumers transpile or resolve via `transpilePackages` (Next) / Node ESM (API)

---

## Project structure

```
CanIFly-middleware/
├── src/
│   ├── index.ts                 # public barrel
│   ├── constants.ts             # Spain bounds, ED318 sources, servAIS, map colors
│   ├── api/schemas.ts           # Zod: status query, profiles, obstacles, …
│   ├── geo/
│   │   ├── ed318-types.ts       # UasZone, MatchedZone, AirspaceStatus, …
│   │   ├── classify-status.ts   # Clear / Limited / Restricted / Prohibited
│   │   ├── filter-by-profile.ts # status + map filters
│   │   ├── normalize-slices.ts  # ArcGIS/ED-318 → internal geometry
│   │   ├── bbox.ts
│   │   └── __tests__/           # Vitest scenarios
│   └── i18n/labels.ts           # statusLabel, obstacleLabel, parseLocale, …
├── dist/                        # build output (committed or built in CI)
├── package.json
└── tsconfig.json
```

### Public exports (barrel)

From `src/index.ts`:

- `constants`
- `api/schemas`
- `geo/ed318-types`, `bbox`, `classify-status`, `filter-by-profile`, `normalize-slices`
- `i18n/labels`

---

## Setup

```bash
npm install
npm run build
npm test
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | `tsc` → `dist/` |
| `npm test` | Vitest unit tests for classification / map filter scenarios |

### Peer usage example (API)

```ts
import {
  pointStatusQuerySchema,
  openCategoryCeiling,
  classifyStatus,
  parseLocale,
  type DroneProfile,
} from "@canifly/middleware";
```

---

## Relationship to other repos

```
@canifly/middleware  ←── types & rules ──►  CanIFly-api
         ▲                                    │
         │                                    │ HTTP JSON
         └── labels / constants ──►  CanIFly ─┘
```

Do **not** put secrets, DB clients, or MapLibre code here. Keep this package pure and testable.

---

## Related

- [CanIFly](https://github.com/EugeneKrokhmal/CanIFly) — web
- [CanIFly-api](https://github.com/EugeneKrokhmal/CanIFly-api) — API
