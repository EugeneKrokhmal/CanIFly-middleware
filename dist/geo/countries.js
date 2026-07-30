/** Spain including Canaries (same envelope as legacy SPAIN_BOUNDS). */
export const SPAIN_COUNTRY = {
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
/** Mainland Czechia (approx). Listed before Poland so AABB overlap prefers CZ. */
export const CZECHIA_COUNTRY = {
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
export const POLAND_COUNTRY = {
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
export const COUNTRIES = {
    ES: SPAIN_COUNTRY,
    CZ: CZECHIA_COUNTRY,
    PL: POLAND_COUNTRY,
};
/** Explicit order: CZ before PL for southern-border AABB ties. */
export const COUNTRY_IDS = ["ES", "CZ", "PL"];
export function pointInBounds(lat, lng, bounds) {
    return (lat >= bounds.minLat &&
        lat <= bounds.maxLat &&
        lng >= bounds.minLng &&
        lng <= bounds.maxLng);
}
/** First matching country for a point, or null if outside coverage. */
export function resolveCountry(lat, lng) {
    for (const id of COUNTRY_IDS) {
        if (pointInBounds(lat, lng, COUNTRIES[id].bounds))
            return id;
    }
    return null;
}
/** Countries whose bounds intersect the bbox (AABB). */
export function countriesForBbox(bbox) {
    return COUNTRY_IDS.filter((id) => {
        const b = COUNTRIES[id].bounds;
        return !(bbox.east < b.minLng ||
            bbox.west > b.maxLng ||
            bbox.north < b.minLat ||
            bbox.south > b.maxLat);
    });
}
/** Union envelope of all registered countries. */
export function coverageBounds() {
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
export function inCoverageHint(lat, lng) {
    return resolveCountry(lat, lng) != null;
}
