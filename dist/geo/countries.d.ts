import type { Bbox } from "./bbox.js";
export type CountryId = "ES" | "PL";
export interface CountryBounds {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}
export interface CountryDefinition {
    id: CountryId;
    /** ISO 3166-1 alpha-2 */
    iso2: CountryId;
    /** ISO 3166-1 alpha-3 used in ED-318 country fields */
    iso3: string;
    nameEn: string;
    nameLocal: string;
    /** MapLibre center [lng, lat] */
    center: [number, number];
    bounds: CountryBounds;
    official: {
        mapUrl: string;
        authorityUrl: string;
        authorityName: string;
    };
}
/** Spain including Canaries (same envelope as legacy SPAIN_BOUNDS). */
export declare const SPAIN_COUNTRY: CountryDefinition;
/** Mainland Poland (approx). */
export declare const POLAND_COUNTRY: CountryDefinition;
export declare const COUNTRIES: Record<CountryId, CountryDefinition>;
export declare const COUNTRY_IDS: CountryId[];
export declare function pointInBounds(lat: number, lng: number, bounds: CountryBounds): boolean;
/** First matching country for a point, or null if outside coverage. */
export declare function resolveCountry(lat: number, lng: number): CountryId | null;
/** Countries whose bounds intersect the bbox (AABB). */
export declare function countriesForBbox(bbox: Bbox): CountryId[];
/** Union envelope of all registered countries. */
export declare function coverageBounds(): CountryBounds;
export declare function inCoverageHint(lat: number, lng: number): boolean;
