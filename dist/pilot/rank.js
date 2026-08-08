/**
 * Pilot progression — aviation ranks by effective hours
 * (airtime + achievements / activity). Thresholds match the epaulette chart.
 */
/** Rank ladder — thresholds match the aviation epaulette chart. */
export const PILOT_RANKS = [
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
];
export const MAX_RANK_INDEX = PILOT_RANKS[PILOT_RANKS.length - 1].index;
/** Hours equivalent granted per earned achievement badge. */
export const BADGE_HOURS_BONUS = 4;
export function hoursFromDurationS(totalDurationS) {
    return Math.max(0, totalDurationS) / 3600;
}
/**
 * Effective rank-hours: real airtime plus activity / achievement boosts.
 * Ladder thresholds are still read as “hours” on the chart.
 */
export function effectiveRankHours(stats) {
    const airtimeHours = hoursFromDurationS(stats.totalDurationS);
    const distanceKm = Math.max(0, stats.totalDistanceM) / 1000;
    const bonusHours = Math.max(0, stats.flightCount) * 0.35 +
        distanceKm * 0.04 +
        Math.max(0, stats.pinCount) * 0.6 +
        Math.max(0, stats.flySpotCount) * 1.25 +
        Math.max(0, stats.badgeCount) * BADGE_HOURS_BONUS +
        (stats.hasOperator ? 5 : 0);
    const hours = airtimeHours + bonusHours;
    return { airtimeHours, bonusHours, hours };
}
export function rankDefById(id) {
    return PILOT_RANKS.find((r) => r.id === id) ?? PILOT_RANKS[0];
}
export function rankFromHours(hours) {
    const safeHours = Math.max(0, hours);
    let rank = PILOT_RANKS[0];
    for (const candidate of PILOT_RANKS) {
        if (safeHours >= candidate.minHours)
            rank = candidate;
    }
    const next = PILOT_RANKS.find((r) => r.index === rank.index + 1) ?? null;
    const hoursIntoRank = safeHours - rank.minHours;
    const hoursForNext = next ? next.minHours - rank.minHours : 0;
    const progress = !next || hoursForNext <= 0
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
export function computePilotProgress(stats) {
    const scored = effectiveRankHours(stats);
    return {
        ...rankFromHours(scored.hours),
        airtimeHours: scored.airtimeHours,
        bonusHours: scored.bonusHours,
    };
}
export function computePilotXp(stats) {
    return Math.round(effectiveRankHours(stats).hours * 100);
}
export function levelFromXp(xp) {
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
