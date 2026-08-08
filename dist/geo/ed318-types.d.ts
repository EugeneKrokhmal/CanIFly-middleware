/** ED-318 UAS geographical zone types (EUROCAE ED-318 / ENAIRE AIP). */
export type UasRestriction = "PROHIBITED" | "REQ_AUTHORISATION" | "CONDITIONAL" | "NO_RESTRICTION" | "USPACE" | string;
export type VerticalReference = "AGL" | "AMSL" | "W84" | string;
export type UomDimensions = "M" | "FT" | string;
export type ZoneSource = "aero" | "urbano" | "infra" | "servais" | "fixture" | "pansa" | "anscr" | "dipul" | "geopf" | "dronezoner" | "foca" | "anac" | "austro" | "lfv" | "iaa" | "lgs" | "anslt" | "eans" | "nsat" | "caasi";
export interface ScheduleEntry {
    day: string[];
    startTime?: string;
    endTime?: string;
}
export interface Applicability {
    startDateTime?: string;
    endDateTime?: string;
    permanent?: string;
    schedule?: ScheduleEntry[];
}
export interface ZoneAuthority {
    name?: string;
    email?: string;
    phone?: string;
    purpose?: string;
    service?: string;
}
export interface UasZoneGeometry {
    upperLimit: number;
    lowerLimit: number;
    uomDimensions: UomDimensions;
    upperVerticalReference: VerticalReference;
    lowerVerticalReference: VerticalReference;
    horizontalProjection: GeoJSON.Polygon | GeoJSON.MultiPolygon;
}
export interface UasZoneFeature {
    identifier: string;
    country: string;
    name: string;
    type: string;
    restriction: UasRestriction;
    reason: string[];
    otherReasonInfo?: string;
    applicability?: Applicability[];
    zoneAuthority?: ZoneAuthority[];
    geometry: UasZoneGeometry[];
    message?: string;
}
/** Standalone ED-318 file wrapper used by some national publishers. */
export interface UasZonesFile {
    title?: string;
    description?: string;
    features: UasZoneFeature[];
}
export type WeightClass = "c0" | "c1" | "c2";
export type OperationCategory = "open" | "specific";
export interface DroneProfile {
    weightClass: WeightClass;
    operationCategory: OperationCategory;
    maxAltitudeAgl: number;
}
/** Normalized contact for any national UAS zone provider. */
export interface ZoneContact {
    role?: string;
    name?: string;
    email?: string;
    phone?: string;
    url?: string;
}
/** Time window within zone applicability (schedule or validity). */
export interface ZoneTimeWindow {
    start?: string;
    end?: string;
    days?: string[];
    startTime?: string;
    endTime?: string;
}
/** When a zone applies (permanent, date range, or recurring schedule). */
export interface ZoneApplicability {
    permanent?: boolean;
    validFrom?: string;
    validTo?: string;
    schedule?: ZoneTimeWindow[];
}
/** Provider-specific metadata kept for display and future mappers. */
export interface ZonePublisherMeta {
    variant?: string;
    regulationExemption?: string;
    purpose?: string;
    region?: string;
    category?: string;
    updatedAt?: string;
    extras?: Record<string, string>;
}
/**
 * Enriched zone details in a common shape across ENAIRE, dipul, geopf, pansa, etc.
 * Scalar fields on MatchedZone stay the source of truth for classify/filter logic.
 */
export interface ZoneEnrichment {
    contacts: ZoneContact[];
    applicability?: ZoneApplicability;
    guidance?: string;
    guidanceHtml?: string;
    publisher?: ZonePublisherMeta;
    altitudeNotes?: string[];
}
export interface MatchedZone {
    identifier: string;
    name: string;
    restriction: UasRestriction;
    reason: string[];
    source: ZoneSource;
    /** ISO alpha-2 when known (ES, PL). Used to gate national classify heuristics. */
    country?: string;
    lowerLimitM: number;
    upperLimitM: number;
    lowerRef: VerticalReference;
    upperRef: VerticalReference;
    /** Primary contact (usually first authority email). Kept for backward compatibility. */
    contact?: string;
    message?: string;
    /** Optional provider-specific details normalized to a common format. */
    enrichment?: ZoneEnrichment;
}
export type AirspaceStatus = "clear" | "limited" | "restricted" | "prohibited";
export interface StatusResult {
    status: AirspaceStatus;
    summary: string;
    zones: MatchedZone[];
    evaluatedAt: string;
}
export interface ZoneSliceRecord {
    id: string;
    zoneIdentifier: string;
    name: string;
    source: ZoneSource;
    restriction: UasRestriction;
    reason: string[];
    zoneType: string;
    lowerLimitM: number;
    upperLimitM: number;
    lowerRef: VerticalReference;
    upperRef: VerticalReference;
    properties: UasZoneFeature;
    geomGeoJson: GeoJSON.Polygon | GeoJSON.MultiPolygon;
    validFrom: Date | null;
    validTo: Date | null;
    ingestedAt: Date;
}
export declare const FEET_TO_METERS = 0.3048;
export declare function toMeters(value: number, uom: UomDimensions): number;
