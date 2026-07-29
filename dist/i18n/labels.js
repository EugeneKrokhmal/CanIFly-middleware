export const OBSTACLE_TYPES = [
    "construction",
    "crane",
    "electric_line",
    "air_sports",
    "other",
];
export const FLY_SPOT_TYPES = [
    "park",
    "rooftop",
    "field",
    "beach",
    "other",
];
const OBSTACLE_LABELS = {
    en: {
        construction: "Construction / building",
        crane: "Crane",
        electric_line: "Electric lines",
        air_sports: "Air sports nearby",
        park: "Park",
        rooftop: "Rooftop",
        field: "Field / open area",
        beach: "Beach",
        other: "Other",
    },
    es: {
        construction: "Construcción / edificio",
        crane: "Grúa",
        electric_line: "Líneas eléctricas",
        air_sports: "Deportes aéreos cerca",
        park: "Parque",
        rooftop: "Azotea",
        field: "Campo / zona abierta",
        beach: "Playa",
        other: "Otro",
    },
};
const PIN_KIND_LABELS = {
    en: {
        obstacle: "Obstacle",
        fly_spot: "Fly spot",
    },
    es: {
        obstacle: "Obstáculo",
        fly_spot: "Zona de vuelo",
    },
};
const STATUS_LABELS = {
    en: {
        clear: "Clear",
        limited: "Limited",
        restricted: "Restricted",
        prohibited: "Prohibited",
    },
    es: {
        clear: "Libre",
        limited: "Limitado",
        restricted: "Restringido",
        prohibited: "Prohibido",
    },
};
/** @deprecated Prefer obstacleLabel(type, locale) */
export const OBSTACLE_TYPE_LABELS = OBSTACLE_LABELS.en;
export function parseLocale(header) {
    if (!header)
        return "es";
    const lower = header.toLowerCase();
    if (lower.includes("en") && !lower.startsWith("es"))
        return "en";
    return "es";
}
export function obstacleLabel(type, locale = "es") {
    const labels = OBSTACLE_LABELS[locale] ?? OBSTACLE_LABELS.en;
    return (labels[type] ??
        OBSTACLE_LABELS.en[type] ??
        String(type));
}
export function pinKindLabel(kind, locale = "es") {
    return PIN_KIND_LABELS[locale][kind] ?? PIN_KIND_LABELS.en[kind];
}
export function typesForPinKind(kind) {
    return kind === "fly_spot" ? FLY_SPOT_TYPES : OBSTACLE_TYPES;
}
export function isTypeAllowedForKind(kind, type) {
    return typesForPinKind(kind).includes(type);
}
export function statusLabel(status, locale = "es") {
    return STATUS_LABELS[locale][status] ?? STATUS_LABELS.en[status];
}
export function isObstacleInactive(likes, dislikes) {
    const total = likes + dislikes;
    if (total <= 0)
        return false;
    return dislikes / total > 0.5;
}
