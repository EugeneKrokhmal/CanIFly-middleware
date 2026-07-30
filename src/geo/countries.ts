import type { Bbox } from "./bbox.js";

export type CountryId = "ES" | "DE" | "CZ" | "PL";

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

/** Mainland Germany (approx). */
export const GERMANY_COUNTRY: CountryDefinition = {
  id: "DE",
  iso2: "DE",
  iso3: "DEU",
  nameEn: "Germany",
  nameLocal: "Deutschland",
  center: [10.45, 51.16],
  bounds: {
    minLat: 47.27,
    maxLat: 55.1,
    minLng: 5.87,
    maxLng: 15.04,
  },
  official: {
    mapUrl: "https://uas-operations.bund.de/",
    authorityUrl: "https://uas-betrieb.de/geoservices/dipul/wfs",
    authorityName: "dipul / DFS",
  },
};

/** Mainland Czechia (approx). */
export const CZECHIA_COUNTRY: CountryDefinition = {
  id: "CZ",
  iso2: "CZ",
  iso3: "CZE",
  nameEn: "Czechia",
  nameLocal: "Česko",
  center: [14.42, 50.08],
  bounds: {
    minLat: 48.55,
    maxLat: 51.06,
    minLng: 12.09,
    maxLng: 18.86,
  },
  official: {
    mapUrl: "https://dronemap.gov.cz/",
    authorityUrl: "https://aim.rlp.cz/",
    authorityName: "ANS CR",
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
  DE: GERMANY_COUNTRY,
  CZ: CZECHIA_COUNTRY,
  PL: POLAND_COUNTRY,
};

/**
 * Registration order for bbox fan-out. Point resolution uses nearest-centre
 * among AABB hits so DE/CZ/PL border overlaps pick the right country.
 */
export const COUNTRY_IDS: CountryId[] = ["ES", "DE", "CZ", "PL"];

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

function dist2ToCenter(lat: number, lng: number, center: [number, number]): number {
  const dLng = lng - center[0];
  const dLat = lat - center[1];
  return dLng * dLng + dLat * dLat;
}

/** First matching country for a point, or null if outside coverage. */
export function resolveCountry(lat: number, lng: number): CountryId | null {
  const hits = COUNTRY_IDS.filter((id) =>
    pointInBounds(lat, lng, COUNTRIES[id].bounds),
  );
  if (hits.length === 0) return null;
  if (hits.length === 1) return hits[0];

  // AABB overlaps: prefer real-world border heuristics before centre distance.
  if (hits.includes("DE") && hits.includes("CZ")) {
    // Saxony / Upper Lusatia sits in the CZ AABB but is German.
    if (lat >= 50.85 && lng <= 14.3) return "DE";
    return "CZ";
  }
  if (hits.includes("DE") && hits.includes("PL")) {
    // East of ~14.9° mostly Poland once past the Neisse, except DE tip.
    if (lng >= 15.0) return "PL";
    return "DE";
  }
  if (hits.includes("CZ") && hits.includes("PL")) {
    return "CZ";
  }

  return hits.reduce((best, id) =>
    dist2ToCenter(lat, lng, COUNTRIES[id].center) <
    dist2ToCenter(lat, lng, COUNTRIES[best].center)
      ? id
      : best,
  );
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
