import { hasApplicabilityData, pickString } from "../utils.js";
import { formatPansaActivityFromAttrs, mapPansaRestriction, pansaReasonsFromAttrs, pickPansaDescription, } from "./pansa-restrictions.js";
export function isPansaSource(source) {
    return source === "pansa";
}
/** Core MatchedZone fields from PANSA DroneMap zone payloads. */
export function normalizePansaAttributes(attrs) {
    const identifier = String(attrs.name ?? attrs.uid ?? "").trim();
    if (!identifier)
        return null;
    const lower = Number(attrs.min ?? 0);
    const upper = Number(attrs.max ?? 120);
    const description = pickPansaDescription(attrs);
    const activity = formatPansaActivityFromAttrs(attrs);
    const message = activity && description
        ? `${activity}\n\n${description}`
        : activity ?? description;
    return {
        identifier,
        name: String(attrs.othername ?? attrs.name ?? identifier),
        restriction: mapPansaRestriction(attrs),
        reason: pansaReasonsFromAttrs(attrs),
        source: "pansa",
        country: "PL",
        lowerLimitM: Number.isFinite(lower) ? lower : 0,
        upperLimitM: Number.isFinite(upper) ? upper : 120,
        lowerRef: "AGL",
        upperRef: "AGL",
        contact: pickString(attrs.contact),
        message,
    };
}
function buildPansaApplicability(attrs) {
    const start = pickString(attrs.start);
    const end = pickString(attrs.stop);
    if (!start && !end)
        return undefined;
    const applicability = {
        permanent: false,
        validFrom: start,
        validTo: end,
    };
    return hasApplicabilityData(applicability) ? applicability : undefined;
}
function buildPansaPublisher(attrs) {
    const typeCode = pickString(attrs.type);
    const uid = pickString(attrs.uid);
    const source = pickString(attrs.source);
    const extras = {};
    if (uid)
        extras.uid = uid;
    if (source)
        extras.source = source;
    const meta = {
        variant: typeCode,
        category: typeCode,
        extras: Object.keys(extras).length > 0 ? extras : undefined,
    };
    return typeCode || uid || source ? meta : undefined;
}
/** Map PANSA zone payloads into the common enrichment shape. */
export function enrichPansaAttributes(attrs) {
    const contact = pickString(attrs.contact);
    const description = pickPansaDescription(attrs);
    const activity = formatPansaActivityFromAttrs(attrs);
    const applicability = buildPansaApplicability(attrs);
    const publisher = buildPansaPublisher(attrs);
    const contacts = contact ? [{ role: "authority", email: contact.includes("@") ? contact : undefined, phone: contact.includes("@") ? undefined : contact }] : [];
    if (contacts.length === 0 &&
        !description &&
        !activity &&
        !applicability &&
        !publisher) {
        return undefined;
    }
    const guidance = activity && description
        ? `${activity}\n\n${description}`
        : activity ?? description;
    return {
        contacts,
        applicability,
        guidance,
        publisher,
    };
}
