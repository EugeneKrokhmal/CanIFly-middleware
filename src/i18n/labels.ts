export type Locale = "es" | "en";

export type ObstacleType =
  | "construction"
  | "crane"
  | "electric_line"
  | "air_sports"
  | "other";

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
    other: "Other",
  },
  es: {
    construction: "Construcción / edificio",
    crane: "Grúa",
    electric_line: "Líneas eléctricas",
    air_sports: "Deportes aéreos cerca",
    other: "Otro",
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
};

/** @deprecated Prefer obstacleLabel(type, locale) */
export const OBSTACLE_TYPE_LABELS = OBSTACLE_LABELS.en;

export function parseLocale(header: string | null | undefined): Locale {
  if (!header) return "es";
  const lower = header.toLowerCase();
  if (lower.includes("en") && !lower.startsWith("es")) return "en";
  return "es";
}

export function obstacleLabel(
  type: ObstacleType,
  locale: Locale = "es",
): string {
  return OBSTACLE_LABELS[locale][type] ?? OBSTACLE_LABELS.en[type];
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
