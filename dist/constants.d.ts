export declare const SPAIN_CENTER: [number, number];
export declare const DEFAULT_ZOOM = 6;
export declare const DEFAULT_DRONE_PROFILE: {
    weightClass: "c0";
    operationCategory: "open";
    maxAltitudeAgl: number;
};
/** Open-category recreational ceiling used for military layer filtering. */
export declare const OPEN_CATEGORY_CEILING_AGL_M = 120;
export declare const ED318_SOURCES: {
    readonly aero: {
        readonly id: "aero";
        readonly label: "ZGUAS Aero";
        readonly url: "https://aip.enaire.es/recursos/descargas/ZGUAS/ZGUAS_Aero.zip";
    };
    readonly urbano: {
        readonly id: "urbano";
        readonly label: "ZGUAS Urbano";
        readonly url: "https://aip.enaire.es/recursos/descargas/ZGUAS/ZGUAS_Urbano.zip";
    };
    readonly infra: {
        readonly id: "infra";
        readonly label: "ZGUAS Infraestructuras";
        readonly url: "https://aip.enaire.es/recursos/descargas/ZGUAS/ZGUAS_Infra.zip";
    };
};
export declare const SERVAIS_FEATURE_SERVER_BASE = "https://servais.enaire.es/insignia/rest/services/NSF_SRV/SRV_UAS_ZG_V1/FeatureServer";
/** Official layer IDs on SRV_UAS_ZG_V1 FeatureServer. */
export declare const SERVAIS_LAYER_IDS: {
    readonly infra: 0;
    readonly aero: 2;
    readonly urbano: 3;
};
export declare const SERVAIS_MAX_PAGE_SIZE = 2000;
export declare const SPAIN_BOUNDS: {
    readonly minLat: 27;
    readonly maxLat: 44.5;
    readonly minLng: -19;
    readonly maxLng: 5.5;
};
/** ENAIRE Drones ZGUAS fill (FeatureServer pink) — kept light so basemap stays readable. */
export declare const ENAIRE_ZONE_STYLE: {
    readonly fill: "#ffbebe";
    readonly fillOpacity: 0.22;
    readonly outline: "#ff0000";
    readonly outlineOpacity: 0.55;
    readonly outlineWidth: 0.8;
};
export declare const STATUS_COLORS: {
    readonly clear: {
        readonly fill: "rgba(0,0,0,0)";
        readonly fillOpacity: 0;
        readonly outline: "rgba(0,0,0,0)";
        readonly badge: "bg-[var(--as-clear)]";
        readonly text: "text-[var(--as-clear)]";
        readonly label: "Clear";
    };
    readonly limited: {
        readonly fill: "#f0d78c";
        readonly fillOpacity: 0.16;
        readonly outline: "#d4b978";
        readonly badge: "bg-[var(--as-clear)]";
        readonly text: "text-[var(--as-clear)]";
        readonly label: "Limited";
    };
    readonly restricted: {
        readonly fill: "#f5a623";
        readonly fillOpacity: 0.24;
        readonly outline: "#e08e0b";
        readonly badge: "bg-[var(--as-restricted)]";
        readonly text: "text-[var(--as-restricted)]";
        readonly label: "Restricted";
    };
    readonly prohibited: {
        readonly fill: "#e05a4a";
        readonly fillOpacity: 0.32;
        readonly outline: "#c13515";
        readonly badge: "bg-[var(--as-prohibited)]";
        readonly text: "text-[var(--as-prohibited)]";
        readonly label: "Prohibited";
    };
};
