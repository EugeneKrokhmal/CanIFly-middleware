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
/** Mainland Germany (approx). */
export const GERMANY_COUNTRY = {
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
/** Mainland Denmark + nearby islands (approx; Dronezoner covers DK). */
export const DENMARK_COUNTRY = {
    id: "DK",
    iso2: "DK",
    iso3: "DNK",
    nameEn: "Denmark",
    nameLocal: "Danmark",
    center: [10.0, 56.0],
    bounds: {
        minLat: 54.5,
        maxLat: 57.8,
        minLng: 7.8,
        maxLng: 15.3,
    },
    official: {
        mapUrl: "https://dronezoner.dk/",
        authorityUrl: "https://dronezoner.eu/API/",
        authorityName: "Trafikstyrelsen / Dronezoner",
    },
};
/** Switzerland + Liechtenstein envelope (FOCA SwissUASGeozones). */
export const SWITZERLAND_COUNTRY = {
    id: "CH",
    iso2: "CH",
    iso3: "CHE",
    nameEn: "Switzerland",
    nameLocal: "Schweiz",
    center: [8.23, 46.8],
    bounds: {
        minLat: 45.8,
        maxLat: 47.85,
        minLng: 5.95,
        maxLng: 10.55,
    },
    official: {
        mapUrl: "https://map.geo.admin.ch/?topic=ech&layers=ch.bazl.einschraenkungen-drohnen",
        authorityUrl: "https://data.geo.admin.ch/ch.bazl.einschraenkungen-drohnen/",
        authorityName: "FOCA / geo.admin.ch",
    },
};
/** Metropolitan France + Corsica (approx; Géopf WFS covers overseas too). */
export const FRANCE_COUNTRY = {
    id: "FR",
    iso2: "FR",
    iso3: "FRA",
    nameEn: "France",
    nameLocal: "France",
    center: [2.35, 46.6],
    bounds: {
        minLat: 41.3,
        maxLat: 51.15,
        minLng: -5.25,
        maxLng: 9.7,
    },
    official: {
        mapUrl: "https://www.geoportail.gouv.fr/donnees/restrictions-pour-drones-de-loisir",
        authorityUrl: "https://data.geopf.fr/wfs/ows?SERVICE=WFS&REQUEST=GetCapabilities",
        authorityName: "DGAC / Géoportail",
    },
};
/** Portugal mainland + Madeira + Azores envelope (ANAC ED-269). */
export const PORTUGAL_COUNTRY = {
    id: "PT",
    iso2: "PT",
    iso3: "PRT",
    nameEn: "Portugal",
    nameLocal: "Portugal",
    center: [-8.0, 39.5],
    bounds: {
        minLat: 32.2,
        maxLat: 42.2,
        minLng: -31.5,
        maxLng: -6.1,
    },
    official: {
        mapUrl: "https://dnt.anac.pt/mapa.html",
        authorityUrl: "https://dnt.anac.pt/json/",
        authorityName: "ANAC",
    },
};
/** Austria (Austro Control Dronespace ED-269). */
export const AUSTRIA_COUNTRY = {
    id: "AT",
    iso2: "AT",
    iso3: "AUT",
    nameEn: "Austria",
    nameLocal: "Österreich",
    center: [14.55, 47.52],
    bounds: {
        minLat: 46.35,
        maxLat: 49.05,
        minLng: 9.45,
        maxLng: 17.2,
    },
    official: {
        mapUrl: "https://dronespace.at/",
        authorityUrl: "https://www.austrocontrol.at/luftfahrtbehoerde/lizenzen__bewilligungen/drohnen/geografische_zonen",
        authorityName: "Austro Control",
    },
};
/** Mainland Czechia (approx). */
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
    DE: GERMANY_COUNTRY,
    FR: FRANCE_COUNTRY,
    DK: DENMARK_COUNTRY,
    CH: SWITZERLAND_COUNTRY,
    PT: PORTUGAL_COUNTRY,
    AT: AUSTRIA_COUNTRY,
    CZ: CZECHIA_COUNTRY,
    PL: POLAND_COUNTRY,
};
/**
 * Registration order for bbox fan-out. Point resolution uses nearest-centre
 * among AABB hits so border overlaps pick the right country.
 */
export const COUNTRY_IDS = [
    "ES",
    "DE",
    "FR",
    "DK",
    "CH",
    "PT",
    "AT",
    "CZ",
    "PL",
];
export function pointInBounds(lat, lng, bounds) {
    return (lat >= bounds.minLat &&
        lat <= bounds.maxLat &&
        lng >= bounds.minLng &&
        lng <= bounds.maxLng);
}
function dist2ToCenter(lat, lng, center) {
    const dLng = lng - center[0];
    const dLat = lat - center[1];
    return dLng * dLng + dLat * dLat;
}
/** Approximate Rhine centerline lng for the DE/FR border (Basel → Lauterbourg). */
function rhineDeFrLng(lat) {
    if (lat < 48.2)
        return 7.58;
    if (lat < 48.5)
        return 7.58 + ((lat - 48.2) * (7.72 - 7.58)) / 0.3;
    if (lat < 49.0)
        return 7.72 + ((lat - 48.5) * (8.18 - 7.72)) / 0.5;
    return 8.18;
}
/** First matching country for a point, or null if outside coverage. */
export function resolveCountry(lat, lng) {
    const hits = COUNTRY_IDS.filter((id) => pointInBounds(lat, lng, COUNTRIES[id].bounds));
    if (hits.length === 0)
        return null;
    if (hits.length === 1)
        return hits[0];
    // AABB overlaps: prefer real-world border heuristics before centre distance.
    // CH before DE↔FR Rhine — Basel sits in all three AABBs.
    if (hits.includes("CH") && (hits.includes("DE") || hits.includes("FR"))) {
        // Core CH / LI south of the High Rhine; German Konstanz tip east of ~9.05°.
        if (lat <= 47.58)
            return "CH";
        if (hits.includes("DE") && lng >= 9.05 && lat >= 47.65)
            return "DE";
        if (hits.includes("FR") && lng <= 6.15 && lat >= 46.7)
            return "FR";
        if (lat <= 47.72 && lng <= 9.0)
            return "CH";
    }
    // AT before DE/CZ centre-distance — Innsbruck / Vienna AABB overlaps.
    if (hits.includes("AT") && hits.includes("DE")) {
        if (lat <= 47.55)
            return "AT";
        if (lat >= 48.3)
            return "DE";
        return lng >= 12.8 ? "AT" : "DE";
    }
    if (hits.includes("AT") && hits.includes("CH")) {
        // Vorarlberg east of ~9.7°; Swiss Rhine valley west.
        if (lng >= 9.7)
            return "AT";
        return "CH";
    }
    if (hits.includes("AT") && hits.includes("CZ")) {
        if (lat >= 48.75)
            return "CZ";
        return "AT";
    }
    if (hits.includes("ES") && hits.includes("PT")) {
        // Madeira / Porto Santo
        if (lat >= 32.2 && lat <= 33.3 && lng >= -17.5 && lng <= -16.0)
            return "PT";
        // Azores
        if (lat >= 36.8 && lat <= 39.9 && lng <= -24.0)
            return "PT";
        // Galicia (ES) north of Minho; western Iberia → PT
        if (lat >= 42.0)
            return "ES";
        if (lng <= -6.9)
            return "PT";
        return "ES";
    }
    if (hits.includes("DE") && hits.includes("FR")) {
        // West of the Rhine → France, except the Saarland wedge (DE west of Rhine).
        // East of the Rhine → Germany. Rhine lng approx Basel → Lauterbourg.
        const rhineLng = rhineDeFrLng(lat);
        if (lng >= rhineLng)
            return "DE";
        // Saarland sits west of the Rhine but is German.
        if (lat >= 49.1 && lng >= 6.5)
            return "DE";
        return "FR";
    }
    if (hits.includes("ES") && hits.includes("FR")) {
        // Atlantic Basque / Bidassoa tip (Irun ES vs Hendaye FR) before the
        // coarse Pyrenees latitude split used further east.
        if (lng < -1.0) {
            // Hendaye / Côte Basque sits just north-east of Irun.
            if (lat >= 43.35 && lng >= -1.78)
                return "FR";
            if (lat <= 43.34 || lng <= -1.78)
                return "ES";
            return "FR";
        }
        // South of ~42.5° / Pyrenees spine → Spain for shared AABB tips.
        if (lat <= 42.6)
            return "ES";
        return "FR";
    }
    if (hits.includes("DE") && hits.includes("CZ")) {
        // Saxony / Upper Lusatia sits in the CZ AABB but is German.
        if (lat >= 50.85 && lng <= 14.3)
            return "DE";
        return "CZ";
    }
    if (hits.includes("DE") && hits.includes("PL")) {
        // East of ~14.9° mostly Poland once past the Neisse, except DE tip.
        if (lng >= 15.0)
            return "PL";
        return "DE";
    }
    if (hits.includes("DE") && hits.includes("DK")) {
        // Flensburg / Sønderjylland: north of ~54.87° → Denmark; south → Germany.
        // Also keep Sylt / North Frisian German islands (DE) west of ~8.5° when
        // south of that latitude band.
        if (lat >= 54.9)
            return "DK";
        if (lat <= 54.8)
            return "DE";
        return lng >= 9.2 ? "DK" : "DE";
    }
    if (hits.includes("CZ") && hits.includes("PL")) {
        return "CZ";
    }
    return hits.reduce((best, id) => dist2ToCenter(lat, lng, COUNTRIES[id].center) <
        dist2ToCenter(lat, lng, COUNTRIES[best].center)
        ? id
        : best);
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
