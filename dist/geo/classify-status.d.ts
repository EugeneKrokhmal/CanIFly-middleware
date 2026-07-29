import type { MatchedZone, StatusResult } from "./ed318-types.js";
/** Surface aerodrome / hospital ban — no flight without coordination. */
export declare function isHardNoFlyZone(zone: MatchedZone): boolean;
export declare function isNationalPopulationAdvisory(zone: MatchedZone): boolean;
/**
 * ENAIRE often encodes a free VLOS / no-coordination ceiling in `lower`
 * (e.g. CTR 60m, LEBB45 45m). Flying below that is effectively clear-with-limits.
 */
export declare function isFreeBandZone(zone: MatchedZone): boolean;
/** Free ceiling in metres AGL from free-band zones (tightest / minimum). */
export declare function freeBandCeilingM(zones: MatchedZone[]): number | null;
/**
 * Collapse overlapping matched zones into a single human-readable status.
 * Highest severity wins (prohibited > restricted > limited > clear).
 */
export declare function classifyStatus(zones: MatchedZone[], options?: {
    ceilingAgl?: number;
}): StatusResult;
