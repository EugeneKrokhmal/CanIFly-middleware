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
export type PilotRankId = "student" | "amateur" | "private" | "first_officer" | "senior_first_officer" | "captain" | "flight_captain" | "senior_flight_captain" | "commercial_captain" | "instructor";
export type RankInsignia = {
    style: "bars";
    metal: "silver" | "gold";
    count: 1 | 2 | 3 | 4;
} | {
    style: "command";
    chevrons: 1 | 2;
    stars: 1 | 2;
};
export type PilotRankDef = {
    id: PilotRankId;
    /** Inclusive lower bound in effective rank-hours. */
    minHours: number;
    index: number;
    insignia: RankInsignia;
};
/** Rank ladder — thresholds match the aviation epaulette chart. */
export declare const PILOT_RANKS: readonly PilotRankDef[];
export declare const MAX_RANK_INDEX: number;
/** Hours equivalent granted per earned achievement badge. */
export declare const BADGE_HOURS_BONUS = 4;
export declare function hoursFromDurationS(totalDurationS: number): number;
/**
 * Effective rank-hours: real airtime plus activity / achievement boosts.
 * Ladder thresholds are still read as “hours” on the chart.
 */
export declare function effectiveRankHours(stats: PilotRankStats): {
    airtimeHours: number;
    bonusHours: number;
    hours: number;
};
export declare function rankDefById(id: PilotRankId): PilotRankDef;
export declare function rankFromHours(hours: number): {
    rank: PilotRankDef;
    hours: number;
    hoursIntoRank: number;
    hoursForNext: number;
    progress: number;
    next: PilotRankDef | null;
};
export declare function computePilotProgress(stats: PilotRankStats): {
    airtimeHours: number;
    bonusHours: number;
    rank: PilotRankDef;
    hours: number;
    hoursIntoRank: number;
    hoursForNext: number;
    progress: number;
    next: PilotRankDef | null;
};
export declare function computePilotXp(stats: PilotRankStats): number;
export declare function levelFromXp(xp: number): {
    level: number;
    xp: number;
    xpIntoLevel: number;
    xpForNext: number;
    progress: number;
};
