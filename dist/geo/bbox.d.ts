import type { DroneProfile } from "./ed318-types.js";
export interface Bbox {
    west: number;
    south: number;
    east: number;
    north: number;
}
/** Max span (degrees) for zone bbox queries — prevents Spain-wide GeoJSON pulls. */
export declare const MAX_ZONE_BBOX_SPAN_DEG = 8;
export declare function clampBboxSpan(bbox: Bbox, maxSpan?: number): Bbox;
export declare function profileQueryParams(profile: Pick<DroneProfile, "weightClass" | "maxAltitudeAgl">, extra?: Record<string, string | number>): URLSearchParams;
