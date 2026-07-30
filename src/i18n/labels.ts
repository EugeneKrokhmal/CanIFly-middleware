export type Locale = "es" | "en" | "de" | "pl" | "cs";

export type PinKind = "obstacle" | "fly_spot";

export type ObstacleType =
  | "construction"
  | "crane"
  | "electric_line"
  | "air_sports"
  | "park"
  | "rooftop"
  | "field"
  | "beach"
  | "other";

export const OBSTACLE_TYPES = [
  "construction",
  "crane",
  "electric_line",
  "air_sports",
  "other",
] as const satisfies readonly ObstacleType[];

export const FLY_SPOT_TYPES = [
  "park",
  "rooftop",
  "field",
  "beach",
  "other",
] as const satisfies readonly ObstacleType[];

export type AirspaceStatusLabel =
  | "clear"
  | "limited"
  | "restricted"
  | "prohibited";

const OBSTACLE_LABELS: Record<Locale, Record<ObstacleType, string>> = {
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
  de: {
    construction: "Baustelle / Gebäude",
    crane: "Kran",
    electric_line: "Stromleitungen",
    air_sports: "Luftsport in der Nähe",
    park: "Park",
    rooftop: "Dach",
    field: "Feld / offenes Gelände",
    beach: "Strand",
    other: "Sonstiges",
  },
  pl: {
    construction: "Budowa / budynek",
    crane: "Dźwig",
    electric_line: "Linie energetyczne",
    air_sports: "Sporty powietrzne w pobliżu",
    park: "Park",
    rooftop: "Dach",
    field: "Pole / otwarty teren",
    beach: "Plaża",
    other: "Inne",
  },
  cs: {
    construction: "Stavba / budova",
    crane: "Jeřáb",
    electric_line: "Elektrická vedení",
    air_sports: "Letecké sporty v okolí",
    park: "Park",
    rooftop: "Střecha",
    field: "Pole / otevřený terén",
    beach: "Pláž",
    other: "Jiné",
  },
};

const PIN_KIND_LABELS: Record<Locale, Record<PinKind, string>> = {
  en: {
    obstacle: "Obstacle",
    fly_spot: "Fly spot",
  },
  es: {
    obstacle: "Obstáculo",
    fly_spot: "Zona de vuelo",
  },
  de: {
    obstacle: "Hindernis",
    fly_spot: "Flugort",
  },
  pl: {
    obstacle: "Przeszkoda",
    fly_spot: "Miejsce do lotu",
  },
  cs: {
    obstacle: "Překážka",
    fly_spot: "Místo k letu",
  },
};

const STATUS_LABELS: Record<Locale, Record<AirspaceStatusLabel, string>> = {
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
  de: {
    clear: "Frei",
    limited: "Begrenzt",
    restricted: "Eingeschränkt",
    prohibited: "Verboten",
  },
  pl: {
    clear: "Wolna",
    limited: "Ograniczona",
    restricted: "Zastrzeżona",
    prohibited: "Zakazana",
  },
  cs: {
    clear: "Volná",
    limited: "Omezená",
    restricted: "Restringovaná",
    prohibited: "Zakázaná",
  },
};

/** @deprecated Prefer obstacleLabel(type, locale) */
export const OBSTACLE_TYPE_LABELS = OBSTACLE_LABELS.en;

export function parseLocale(header: string | null | undefined): Locale {
  if (!header) return "es";
  const lower = header.toLowerCase();
  if (lower.includes("cs") || lower.includes("cz")) return "cs";
  if (lower.includes("pl")) return "pl";
  if (lower.startsWith("de") || lower.includes("de-") || lower.includes("de,"))
    return "de";
  if (lower.includes("en") && !lower.startsWith("es")) return "en";
  return "es";
}

export function obstacleLabel(
  type: ObstacleType | string,
  locale: Locale = "es",
): string {
  const labels = OBSTACLE_LABELS[locale] ?? OBSTACLE_LABELS.en;
  return (
    labels[type as ObstacleType] ??
    OBSTACLE_LABELS.en[type as ObstacleType] ??
    String(type)
  );
}

export function pinKindLabel(kind: PinKind, locale: Locale = "es"): string {
  return PIN_KIND_LABELS[locale][kind] ?? PIN_KIND_LABELS.en[kind];
}

export function typesForPinKind(kind: PinKind): readonly ObstacleType[] {
  return kind === "fly_spot" ? FLY_SPOT_TYPES : OBSTACLE_TYPES;
}

export function isTypeAllowedForKind(
  kind: PinKind,
  type: ObstacleType,
): boolean {
  return (typesForPinKind(kind) as readonly string[]).includes(type);
}

export function statusLabel(
  status: AirspaceStatusLabel,
  locale: Locale = "es",
): string {
  return STATUS_LABELS[locale][status] ?? STATUS_LABELS.en[status];
}

export function isObstacleInactive(likes: number, dislikes: number): boolean {
  const total = likes + dislikes;
  if (total <= 0) return false;
  return dislikes / total > 0.5;
}
