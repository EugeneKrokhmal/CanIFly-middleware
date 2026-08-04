import type { MatchedZone, ZoneEnrichment, ZoneSource } from "../../ed318-types.js";
export declare function isPansaSource(source: ZoneSource): boolean;
/** Core MatchedZone fields from PANSA DroneMap zone payloads. */
export declare function normalizePansaAttributes(attrs: Record<string, unknown>): MatchedZone | null;
/** Map PANSA zone payloads into the common enrichment shape. */
export declare function enrichPansaAttributes(attrs: Record<string, unknown>): ZoneEnrichment | undefined;
