export type Locale = "es" | "en" | "pl";
export type PinKind = "obstacle" | "fly_spot";
export type ObstacleType = "construction" | "crane" | "electric_line" | "air_sports" | "park" | "rooftop" | "field" | "beach" | "other";
export declare const OBSTACLE_TYPES: readonly ["construction", "crane", "electric_line", "air_sports", "other"];
export declare const FLY_SPOT_TYPES: readonly ["park", "rooftop", "field", "beach", "other"];
export type AirspaceStatusLabel = "clear" | "limited" | "restricted" | "prohibited";
/** @deprecated Prefer obstacleLabel(type, locale) */
export declare const OBSTACLE_TYPE_LABELS: Record<ObstacleType, string>;
export declare function parseLocale(header: string | null | undefined): Locale;
export declare function obstacleLabel(type: ObstacleType | string, locale?: Locale): string;
export declare function pinKindLabel(kind: PinKind, locale?: Locale): string;
export declare function typesForPinKind(kind: PinKind): readonly ObstacleType[];
export declare function isTypeAllowedForKind(kind: PinKind, type: ObstacleType): boolean;
export declare function statusLabel(status: AirspaceStatusLabel, locale?: Locale): string;
export declare function isObstacleInactive(likes: number, dislikes: number): boolean;
