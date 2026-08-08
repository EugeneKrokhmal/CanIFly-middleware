/**
 * Pilot progression — aviation ranks by effective hours
 * (airtime + achievements / activity). Thresholds match the epaulette chart.
 */

export type PilotRankStats = {
  flightCount: number;
  totalDistanceM: number;
  totalDurationS: number;
  pinCount: number;
  flySpotCount: number;
  badgeCount: number;
  hasOperator: boolean;
};

export type PilotRankId =
  | "student"
  | "amateur"
  | "private"
  | "first_officer"
  | "senior_first_officer"
  | "captain"
  | "flight_captain"
  | "senior_flight_captain"
  | "commercial_captain"
  | "instructor";

export type RankInsignia =
  | { style: "bars"; metal: "silver" | "gold"; count: 1 | 2 | 3 | 4 }
  | { style: "command"; chevrons: 1 | 2; stars: 1 | 2 };

export type PilotRankDef = {
  id: PilotRankId;
  /** Inclusive lower bound in effective rank-hours. */
  minHours: number;
  index: number;
  insignia: RankInsignia;
};

/** Rank ladder — thresholds match the aviation epaulette chart. */
export const PILOT_RANKS: readonly PilotRankDef[] = [
  {
    id: "student",
    minHours: 0,
    index: 1,
    insignia: { style: "bars", metal: "silver", count: 1 },
  },
  {
    id: "amateur",
    minHours: 20,
    index: 2,
    insignia: { style: "bars", metal: "silver", count: 2 },
  },
  {
    id: "private",
    minHours: 40,
    index: 3,
    insignia: { style: "bars", metal: "silver", count: 3 },
  },
  {
    id: "first_officer",
    minHours: 70,
    index: 4,
    insignia: { style: "bars", metal: "gold", count: 2 },
  },
  {
    id: "senior_first_officer",
    minHours: 100,
    index: 5,
    insignia: { style: "bars", metal: "gold", count: 3 },
  },
  {
    id: "captain",
    minHours: 140,
    index: 6,
    insignia: { style: "bars", metal: "gold", count: 4 },
  },
  {
    id: "flight_captain",
    minHours: 200,
    index: 7,
    insignia: { style: "command", chevrons: 1, stars: 1 },
  },
  {
    id: "senior_flight_captain",
    minHours: 300,
    index: 8,
    insignia: { style: "command", chevrons: 2, stars: 1 },
  },
  {
    id: "commercial_captain",
    minHours: 400,
    index: 9,
    insignia: { style: "command", chevrons: 1, stars: 2 },
  },
  {
    id: "instructor",
    minHours: 500,
    index: 10,
    insignia: { style: "command", chevrons: 2, stars: 2 },
  },
] as const;

export const MAX_RANK_INDEX = PILOT_RANKS[PILOT_RANKS.length - 1]!.index;

/** Hours equivalent granted per earned achievement badge. */
export const BADGE_HOURS_BONUS = 4;

export function hoursFromDurationS(totalDurationS: number): number {
  return Math.max(0, totalDurationS) / 3600;
}

/**
 * Effective rank-hours: real airtime plus activity / achievement boosts.
 * Ladder thresholds are still read as “hours” on the chart.
 */
export function effectiveRankHours(stats: PilotRankStats): {
  airtimeHours: number;
  bonusHours: number;
  hours: number;
} {
  const airtimeHours = hoursFromDurationS(stats.totalDurationS);
  const distanceKm = Math.max(0, stats.totalDistanceM) / 1000;
  const bonusHours =
    Math.max(0, stats.flightCount) * 0.35 +
    distanceKm * 0.04 +
    Math.max(0, stats.pinCount) * 0.6 +
    Math.max(0, stats.flySpotCount) * 1.25 +
    Math.max(0, stats.badgeCount) * BADGE_HOURS_BONUS +
    (stats.hasOperator ? 5 : 0);
  const hours = airtimeHours + bonusHours;
  return { airtimeHours, bonusHours, hours };
}

export function rankDefById(id: PilotRankId): PilotRankDef {
  return PILOT_RANKS.find((r) => r.id === id) ?? PILOT_RANKS[0]!;
}

export function rankFromHours(hours: number): {
  rank: PilotRankDef;
  hours: number;
  hoursIntoRank: number;
  hoursForNext: number;
  progress: number;
  next: PilotRankDef | null;
} {
  const safeHours = Math.max(0, hours);
  let rank = PILOT_RANKS[0]!;
  for (const candidate of PILOT_RANKS) {
    if (safeHours >= candidate.minHours) rank = candidate;
  }
  const next =
    PILOT_RANKS.find((r) => r.index === rank.index + 1) ?? null;
  const hoursIntoRank = safeHours - rank.minHours;
  const hoursForNext = next ? next.minHours - rank.minHours : 0;
  const progress =
    !next || hoursForNext <= 0
      ? 1
      : Math.min(1, hoursIntoRank / hoursForNext);
  return {
    rank,
    hours: safeHours,
    hoursIntoRank,
    hoursForNext,
    progress,
    next,
  };
}

export function computePilotProgress(stats: PilotRankStats) {
  const scored = effectiveRankHours(stats);
  return {
    ...rankFromHours(scored.hours),
    airtimeHours: scored.airtimeHours,
    bonusHours: scored.bonusHours,
  };
}

export function computePilotXp(stats: PilotRankStats): number {
  return Math.round(effectiveRankHours(stats).hours * 100);
}

export function levelFromXp(xp: number): {
  level: number;
  xp: number;
  xpIntoLevel: number;
  xpForNext: number;
  progress: number;
} {
  const hours = Math.max(0, xp) / 100;
  const p = rankFromHours(hours);
  return {
    level: p.rank.index,
    xp: Math.round(p.hours * 100),
    xpIntoLevel: Math.round(p.hoursIntoRank * 100),
    xpForNext: Math.round(p.hoursForNext * 100),
    progress: p.progress,
  };
}
