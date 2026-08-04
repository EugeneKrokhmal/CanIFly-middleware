import { toMeters } from "../../ed318-types.js";
import { hasApplicabilityData, pickString, } from "../utils.js";
import { mapDipulRestriction } from "./dipul-restrictions.js";
export function isDipulSource(source) {
    return source === "dipul";
}
function pickDipulName(attrs) {
    const raw = attrs.generated_name_EN ??
        attrs.generated_name_en ??
        attrs.name ??
        attrs.generated_name_DE ??
        attrs.generated_name_de;
    if (Array.isArray(raw))
        return String(raw[0] ?? "").trim();
    return String(raw ?? "").trim();
}
function verticalRef(raw) {
    const ref = String(raw ?? "AGL").toUpperCase();
    return ref === "MSL" || ref === "AMSL" ? "AMSL" : "AGL";
}
/** Core MatchedZone fields from dipul WFS property bags. */
export function normalizeDipulAttributes(attrs) {
    const nameFromProps = pickDipulName(attrs);
    const identifier = String(attrs.external_reference ?? nameFromProps ?? "").trim();
    if (!identifier)
        return null;
    const name = nameFromProps || identifier;
    const typeCode = pickString(attrs.type_code);
    const legalRef = pickString(attrs.legal_ref);
    const lowerUnit = String(attrs.lower_limit_unit ?? "m");
    const upperUnit = String(attrs.upper_limit_unit ?? lowerUnit);
    const lowerRaw = Number(attrs.lower_limit_altitude ?? 0);
    const upperRaw = attrs.upper_limit_altitude != null
        ? Number(attrs.upper_limit_altitude)
        : 120;
    return {
        identifier,
        name,
        restriction: mapDipulRestriction(typeCode, legalRef),
        reason: [
            ...(typeCode ? [typeCode] : []),
            ...(legalRef ? [legalRef] : []),
        ],
        source: "dipul",
        country: "DE",
        lowerLimitM: toMeters(lowerRaw, lowerUnit),
        upperLimitM: toMeters(upperRaw, upperUnit),
        lowerRef: verticalRef(attrs.lower_limit_alt_ref),
        upperRef: verticalRef(attrs.upper_limit_alt_ref ?? attrs.lower_limit_alt_ref),
        message: legalRef,
    };
}
function buildDipulPublisher(attrs) {
    const typeCode = pickString(attrs.type_code);
    const nameEn = pickString(attrs.generated_name_EN ?? attrs.generated_name_en);
    const nameDe = pickString(attrs.generated_name_DE ?? attrs.generated_name_de);
    const externalRef = pickString(attrs.external_reference);
    const extras = {};
    if (externalRef)
        extras.externalReference = externalRef;
    if (nameEn)
        extras.nameEn = nameEn;
    if (nameDe)
        extras.nameDe = nameDe;
    const meta = {
        variant: typeCode,
        category: typeCode?.replace(/_/g, " "),
        extras: Object.keys(extras).length > 0 ? extras : undefined,
    };
    const hasMeta = Boolean(meta.variant) ||
        Boolean(meta.category) ||
        Boolean(meta.extras && Object.keys(meta.extras).length > 0);
    return hasMeta ? meta : undefined;
}
function buildDipulApplicability(attrs) {
    const startTime = pickString(attrs.start_time);
    const endTime = pickString(attrs.end_time);
    if (!startTime && !endTime)
        return undefined;
    const applicability = {
        permanent: false,
        validFrom: startTime,
        validTo: endTime,
    };
    return hasApplicabilityData(applicability) ? applicability : undefined;
}
/**
 * Map dipul WFS properties into the common enrichment shape.
 * Contact fields are not published in dipul GeoJSON today — reserved for future layers.
 */
export function enrichDipulAttributes(attrs) {
    const legalRef = pickString(attrs.legal_ref);
    const publisher = buildDipulPublisher(attrs);
    const applicability = buildDipulApplicability(attrs);
    if (!legalRef && !publisher && !applicability) {
        return undefined;
    }
    return {
        contacts: [],
        applicability,
        guidance: legalRef,
        publisher,
    };
}
