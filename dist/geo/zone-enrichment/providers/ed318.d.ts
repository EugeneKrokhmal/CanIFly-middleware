import type { UasZoneFeature, ZoneEnrichment } from "../../ed318-types.js";
/** Map ED-318 zoneAuthority / applicability into the common enrichment shape. */
export declare function enrichEd318Feature(feature: UasZoneFeature): ZoneEnrichment | undefined;
