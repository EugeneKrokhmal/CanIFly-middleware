import { COUNTRIES, GERMANY_COUNTRY, SPAIN_COUNTRY } from "./geo/countries.js";

export const SPAIN_CENTER: [number, number] = SPAIN_COUNTRY.center;
export const GERMANY_CENTER: [number, number] = GERMANY_COUNTRY.center;
export const CZECHIA_CENTER: [number, number] = COUNTRIES.CZ.center;
export const POLAND_CENTER: [number, number] = COUNTRIES.PL.center;
export const DEFAULT_ZOOM = 6;

export const DEFAULT_DRONE_PROFILE = {
  weightClass: "c0" as const,
  operationCategory: "open" as const,
  maxAltitudeAgl: 120,
};

/** Open-category recreational ceiling used for military layer filtering. */
export const OPEN_CATEGORY_CEILING_AGL_M = 120;

export const ED318_SOURCES = {
  aero: {
    id: "aero" as const,
    label: "ZGUAS Aero",
    url: "https://aip.enaire.es/recursos/descargas/ZGUAS/ZGUAS_Aero.zip",
  },
  urbano: {
    id: "urbano" as const,
    label: "ZGUAS Urbano",
    url: "https://aip.enaire.es/recursos/descargas/ZGUAS/ZGUAS_Urbano.zip",
  },
  infra: {
    id: "infra" as const,
    label: "ZGUAS Infraestructuras",
    url: "https://aip.enaire.es/recursos/descargas/ZGUAS/ZGUAS_Infra.zip",
  },
} as const;

export const SERVAIS_FEATURE_SERVER_BASE =
  "https://servais.enaire.es/insignia/rest/services/NSF_SRV/SRV_UAS_ZG_V1/FeatureServer";

/** Official layer IDs on SRV_UAS_ZG_V1 FeatureServer. */
export const SERVAIS_LAYER_IDS = {
  infra: 0,
  aero: 2,
  urbano: 3,
} as const;

export const SERVAIS_MAX_PAGE_SIZE = 2000;

/** ENAIRE Drones ZGUAS fill (FeatureServer pink) — kept light so basemap stays readable. */
export const ENAIRE_ZONE_STYLE = {
  fill: "#ffbebe",
  fillOpacity: 0.22,
  outline: "#ff0000",
  outlineOpacity: 0.55,
  outlineWidth: 0.8,
} as const;

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
} as const;
