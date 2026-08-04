import type { MatchedZone, UasZoneFeature, ZoneEnrichment, ZoneSource } from "../ed318-types.js";
export interface ZoneProviderContext {
    source: ZoneSource;
    /** Raw attribute bag from a live national API (servAIS, dipul WFS, etc.). */
    rawAttributes?: Record<string, unknown>;
    /** ED-318 feature when loaded from PostGIS or ZIP ingest. */
    feature?: UasZoneFeature;
    /** WFS / GeoJSON feature id when not in attributes (geopf). */
    featureId?: string | number;
}
export declare function attachEnrichment(zone: MatchedZone, enrichment: ZoneEnrichment | undefined): MatchedZone;
/** Attach provider-specific details to an existing MatchedZone. */
export declare function enrichMatchedZone(zone: MatchedZone, ctx: ZoneProviderContext): MatchedZone;
/** Normalize live provider attributes into MatchedZone + common enrichment. */
export declare function buildMatchedZoneFromProvider(ctx: ZoneProviderContext): MatchedZone | null;
