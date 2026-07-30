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
export const SPAIN_COUNTRY: CountryDefinition = {
  id: "ES",
  iso2: "ES",
  iso3: "ESP",
  nameEn: "Spain",
  nameLocal: "España",
  center: [-3.7, 40.4],
  bounds: {
    minLat: 27.0,
    maxLat: 44.5,
    minLng: -19.0,
    maxLng: 5.5,
  },
  official: {
    mapUrl: "https://drones.enaire.es/",
    authorityUrl: "https://www.seguridadaerea.gob.es/",
    authorityName: "AESA / ENAIRE",
  },
};

/** Mainland Poland (approx). */
export const POLAND_COUNTRY: CountryDefinition = {
  id: "PL",
  iso2: "PL",
  iso3: "POL",
  nameEn: "Poland",
  nameLocal: "Polska",
  center: [21.01, 52.23],
  bounds: {
    minLat: 49.0,
    maxLat: 54.9,
    minLng: 14.0,
    maxLng: 24.2,
  },
  official: {
    mapUrl: "https://dronemap.pansa.pl/",
    authorityUrl: "https://www.pansa.pl/",
    authorityName: "PANSA",
  },
};

export const COUNTRIES: Record<CountryId, CountryDefinition> = {
  ES: SPAIN_COUNTRY,
  PL: POLAND_COUNTRY,
};

export const COUNTRY_IDS = Object.keys(COUNTRIES) as CountryId[];

export function pointInBounds(
  lat: number,
  lng: number,
  bounds: CountryBounds,
): boolean {
  return (
    lat >= bounds.minLat &&
    lat <= bounds.maxLat &&
    lng >= bounds.minLng &&
    lng <= bounds.maxLng
  );
}

/** First matching country for a point, or null if outside coverage. */
export function resolveCountry(lat: number, lng: number): CountryId | null {
  for (const id of COUNTRY_IDS) {
    if (pointInBounds(lat, lng, COUNTRIES[id].bounds)) return id;
  }
  return null;
}

/** Countries whose bounds intersect the bbox (AABB). */
export function countriesForBbox(bbox: Bbox): CountryId[] {
  return COUNTRY_IDS.filter((id) => {
    const b = COUNTRIES[id].bounds;
    return !(
      bbox.east < b.minLng ||
      bbox.west > b.maxLng ||
      bbox.north < b.minLat ||
      bbox.south > b.maxLat
    );
  });
}

/** Union envelope of all registered countries. */
export function coverageBounds(): CountryBounds {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (const id of COUNTRY_IDS) {
    const b = COUNTRIES[id].bounds;
    minLat = Math.min(minLat, b.minLat);
    maxLat = Math.max(maxLat, b.maxLat);
    minLng = Math.min(minLng, b.minLng);
    maxLng = Math.max(maxLng, b.maxLng);
  }
  return { minLat, maxLat, minLng, maxLng };
}

export function inCoverageHint(lat: number, lng: number): boolean {
  return resolveCountry(lat, lng) != null;
}
