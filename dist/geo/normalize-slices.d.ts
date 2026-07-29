import type { UasZoneFeature, ZoneSliceRecord, ZoneSource } from "./ed318-types.js";
/**
 * Convert GeoJSON Polygon/MultiPolygon to WKT (lon lat order, EPSG:4326).
 */
export declare function geoJsonToWkt(geom: GeoJSON.Polygon | GeoJSON.MultiPolygon): string;
/**
 * Explode an ED-318 feature into one ZoneSliceRecord per geometry slice.
 */
export declare function zoneFeatureToSlices(feature: UasZoneFeature, source: ZoneSource, ingestedAt?: Date): ZoneSliceRecord[];
/**
 * Map an ArcGIS / GeoJSON Feature into a UasZoneFeature for shared ingest path.
 */
export declare function arcgisFeatureToUasZone(feature: GeoJSON.Feature, fallbackId: string): UasZoneFeature | null;
