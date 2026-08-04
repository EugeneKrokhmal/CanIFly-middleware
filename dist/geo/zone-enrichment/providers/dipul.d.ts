import type { MatchedZone, ZoneEnrichment, ZoneSource } from "../../ed318-types.js";
export declare function isDipulSource(source: ZoneSource): boolean;
/** Core MatchedZone fields from dipul WFS property bags. */
export declare function normalizeDipulAttributes(attrs: Record<string, unknown>): MatchedZone | null;
/**
 * Map dipul WFS properties into the common enrichment shape.
 * Contact fields are not published in dipul GeoJSON today — reserved for future layers.
 */
export declare function enrichDipulAttributes(attrs: Record<string, unknown>): ZoneEnrichment | undefined;
