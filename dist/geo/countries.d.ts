import type { Bbox } from "./bbox.js";
export type CountryId = "ES" | "DE" | "FR" | "DK" | "CH" | "PT" | "AT" | "CZ" | "PL" | "SE" | "IE" | "LV";
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
/** Mainland Germany (approx). */
export declare const GERMANY_COUNTRY: CountryDefinition;
/** Mainland Denmark + nearby islands (approx; Dronezoner covers DK). */
export declare const DENMARK_COUNTRY: CountryDefinition;
/** Switzerland + Liechtenstein envelope (FOCA SwissUASGeozones). */
export declare const SWITZERLAND_COUNTRY: CountryDefinition;
/** Metropolitan France + Corsica (approx; Géopf WFS covers overseas too). */
export declare const FRANCE_COUNTRY: CountryDefinition;
/** Portugal mainland + Madeira + Azores envelope (ANAC ED-269). */
export declare const PORTUGAL_COUNTRY: CountryDefinition;
/** Austria (Austro Control Dronespace ED-269). */
export declare const AUSTRIA_COUNTRY: CountryDefinition;
/** Mainland Czechia (approx). */
export declare const CZECHIA_COUNTRY: CountryDefinition;
/** Mainland Poland (approx). */
export declare const POLAND_COUNTRY: CountryDefinition;
/** Sweden mainland + Gotland / Öland (LFV Drönarkarta WFS). */
export declare const SWEDEN_COUNTRY: CountryDefinition;
/** Ireland incl. nearby islands (IAA UAS geographical zones GeoJSON). */
export declare const IRELAND_COUNTRY: CountryDefinition;
/** Latvia (LGS / drz.lv ED-269 UAS geozones). */
export declare const LATVIA_COUNTRY: CountryDefinition;
export declare const COUNTRIES: Record<CountryId, CountryDefinition>;
/**
 * Registration order for bbox fan-out. Point resolution uses nearest-centre
 * among AABB hits so border overlaps pick the right country.
 */
export declare const COUNTRY_IDS: CountryId[];
export declare function pointInBounds(lat: number, lng: number, bounds: CountryBounds): boolean;
/** First matching country for a point, or null if outside coverage. */
export declare function resolveCountry(lat: number, lng: number): CountryId | null;
/** Countries whose bounds intersect the bbox (AABB). */
export declare function countriesForBbox(bbox: Bbox): CountryId[];
/** Union envelope of all registered countries. */
export declare function coverageBounds(): CountryBounds;
export declare function inCoverageHint(lat: number, lng: number): boolean;
