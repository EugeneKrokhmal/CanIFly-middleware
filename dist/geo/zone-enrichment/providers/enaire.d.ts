import type { MatchedZone, ZoneEnrichment, ZoneSource } from "../../ed318-types.js";
export declare function isEnaireSource(source: ZoneSource): boolean;
/** Core MatchedZone fields from ENAIRE servAIS attribute bags. */
export declare function normalizeEnaireAttributes(attrs: Record<string, unknown>, source: ZoneSource): MatchedZone | null;
/** Rich ENAIRE servAIS fields mapped to the common enrichment shape. */
export declare function enrichEnaireAttributes(attrs: Record<string, unknown>): ZoneEnrichment | undefined;
