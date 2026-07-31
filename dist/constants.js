import { COUNTRIES, AUSTRIA_COUNTRY, DENMARK_COUNTRY, FRANCE_COUNTRY, GERMANY_COUNTRY, PORTUGAL_COUNTRY, SPAIN_COUNTRY, SWEDEN_COUNTRY, IRELAND_COUNTRY, SWITZERLAND_COUNTRY, } from "./geo/countries.js";
export const SPAIN_CENTER = SPAIN_COUNTRY.center;
export const GERMANY_CENTER = GERMANY_COUNTRY.center;
export const FRANCE_CENTER = FRANCE_COUNTRY.center;
export const DENMARK_CENTER = DENMARK_COUNTRY.center;
export const SWITZERLAND_CENTER = SWITZERLAND_COUNTRY.center;
export const PORTUGAL_CENTER = PORTUGAL_COUNTRY.center;
export const AUSTRIA_CENTER = AUSTRIA_COUNTRY.center;
export const SWEDEN_CENTER = SWEDEN_COUNTRY.center;
export const IRELAND_CENTER = IRELAND_COUNTRY.center;
export const CZECHIA_CENTER = COUNTRIES.CZ.center;
export const POLAND_CENTER = COUNTRIES.PL.center;
export const DEFAULT_ZOOM = 6;
export const DEFAULT_DRONE_PROFILE = {
    weightClass: "c0",
    operationCategory: "open",
    maxAltitudeAgl: 120,
};
/** Open-category recreational ceiling used for military layer filtering. */
export const OPEN_CATEGORY_CEILING_AGL_M = 120;
export const ED318_SOURCES = {
    aero: {
        id: "aero",
        label: "ZGUAS Aero",
        url: "https://aip.enaire.es/recursos/descargas/ZGUAS/ZGUAS_Aero.zip",
    },
    urbano: {
        id: "urbano",
        label: "ZGUAS Urbano",
        url: "https://aip.enaire.es/recursos/descargas/ZGUAS/ZGUAS_Urbano.zip",
    },
    infra: {
        id: "infra",
        label: "ZGUAS Infraestructuras",
        url: "https://aip.enaire.es/recursos/descargas/ZGUAS/ZGUAS_Infra.zip",
    },
};
export const SERVAIS_FEATURE_SERVER_BASE = "https://servais.enaire.es/insignia/rest/services/NSF_SRV/SRV_UAS_ZG_V1/FeatureServer";
/** Official layer IDs on SRV_UAS_ZG_V1 FeatureServer. */
export const SERVAIS_LAYER_IDS = {
    infra: 0,
    aero: 2,
    urbano: 3,
};
export const SERVAIS_MAX_PAGE_SIZE = 2000;
/** ENAIRE Drones ZGUAS fill (FeatureServer pink) — kept light so basemap stays readable. */
export const ENAIRE_ZONE_STYLE = {
    fill: "#ffbebe",
    fillOpacity: 0.22,
    outline: "#ff0000",
    outlineOpacity: 0.55,
    outlineWidth: 0.8,
};
export const STATUS_COLORS = {
    clear: {
        fill: "rgba(0,0,0,0)",
        fillOpacity: 0,
        outline: "rgba(0,0,0,0)",
        badge: "bg-[var(--as-clear)]",
        text: "text-[var(--as-clear)]",
        label: "Clear",
    },
    limited: {
        fill: "#f0d78c",
        fillOpacity: 0.16,
        outline: "#d4b978",
        badge: "bg-[var(--as-clear)]",
        text: "text-[var(--as-clear)]",
        label: "Limited",
    },
    restricted: {
        fill: "#f5a623",
        fillOpacity: 0.24,
        outline: "#e08e0b",
        badge: "bg-[var(--as-restricted)]",
        text: "text-[var(--as-restricted)]",
        label: "Restricted",
    },
    prohibited: {
        fill: "#e05a4a",
        fillOpacity: 0.32,
        outline: "#c13515",
        badge: "bg-[var(--as-prohibited)]",
        text: "text-[var(--as-prohibited)]",
        label: "Prohibited",
    },
};
