import type { MatchedZone, UasRestriction, ZoneEnrichment, ZoneSource } from "../../ed318-types.js";
export declare function isGeopfSource(source: ZoneSource): boolean;
export declare function parseGeopfHeightLimitM(limite: string): number | null;
export declare function mapGeopfRestriction(limite: string): UasRestriction;
/** Core MatchedZone fields from Géoportail WFS properties. */
export declare function normalizeGeopfAttributes(attrs: Record<string, unknown>, featureId?: string | number): MatchedZone | null;
/** Map Géoportail WFS properties into the common enrichment shape. */
export declare function enrichGeopfAttributes(attrs: Record<string, unknown>): ZoneEnrichment | undefined;
