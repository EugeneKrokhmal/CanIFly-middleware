import type { DroneProfile, MatchedZone } from "./ed318-types.js";
/**
 * Returns true when the zone's vertical band overlaps the planned flight
 * envelope from surface (0) up to the pilot's ceiling AGL.
 */
export declare function altitudeOverlaps(zone: MatchedZone, altitudeAgl: number): boolean;
/**
 * Filter matched zones by drone profile (category, weight class, altitude).
 * Free-band CTR/aerodrome buffers are kept even below their encoded `lower`
 * so the UI can show “clear up to Xm”.
 */
export declare function filterByProfile(zones: MatchedZone[], profile: DroneProfile, altitudeAgl?: number): MatchedZone[];
/**
 * ENAIRE Drones–style map filter: only zones whose vertical band overlaps
 * the configured flight altitude (flight-config height filter). Nationwide
 * population overlays are skipped so they do not wash the whole country.
 */
export declare function filterForMap(zones: MatchedZone[], profile: DroneProfile, altitudeAgl?: number): MatchedZone[];
