import { toMeters } from "../../ed318-types.js";
import { hasApplicabilityData, normalizeRestriction, parseReasonList, pickString, splitDelimitedList, stripHtml, } from "../utils.js";
const ENAIRE_SOURCES = new Set(["aero", "urbano", "infra", "servais"]);
export function isEnaireSource(source) {
    return ENAIRE_SOURCES.has(source);
}
/** Core MatchedZone fields from ENAIRE servAIS attribute bags. */
export function normalizeEnaireAttributes(attrs, source) {
    const identifier = String(attrs.identifier ?? attrs.Identifier ?? attrs.OBJECTID ?? "").trim();
    if (!identifier)
        return null;
    const restrictionRaw = attrs.restriction ?? attrs.Restriction ?? attrs.type ?? attrs.Type;
    const restriction = normalizeRestriction(restrictionRaw);
    const reason = parseReasonList(attrs.reasons ?? attrs.reason ?? attrs.Reason);
    const uom = String(attrs.uom ?? attrs.uomDimensions ?? "M");
    const lower = Number(attrs.lower ?? attrs.lowerLimit ?? 0);
    const upper = Number(attrs.upper ?? attrs.upperLimit ?? 120);
    const emails = splitDelimitedList(attrs.email);
    const phones = splitDelimitedList(attrs.phone);
    return {
        identifier,
        name: String(attrs.name ?? attrs.Name ?? identifier),
        restriction,
        reason,
        source,
        country: "ES",
        lowerLimitM: toMeters(lower, uom),
        upperLimitM: toMeters(upper, uom),
        lowerRef: String(attrs.lowerReference ?? attrs.lowerVerticalReference ?? "AGL"),
        upperRef: String(attrs.upperReference ?? attrs.upperVerticalReference ?? "AGL"),
        contact: emails[0] ?? phones[0],
        message: pickString(attrs.message),
    };
}
function buildEnaireContacts(attrs) {
    const emails = splitDelimitedList(attrs.email);
    const phones = splitDelimitedList(attrs.phone);
    const contactName = pickString(attrs.contactName);
    const siteUrl = pickString(attrs.siteURL);
    const count = Math.max(emails.length, phones.length, contactName || siteUrl ? 1 : 0);
    if (count === 0)
        return [];
    const contacts = [];
    for (let i = 0; i < count; i++) {
        const email = emails[i];
        const phone = phones[i];
        if (!email && !phone && i > 0)
            continue;
        contacts.push({
            role: pickString(attrs.purpose) ?? "authority",
            name: i === 0 ? contactName : undefined,
            email,
            phone,
            url: i === 0 ? siteUrl : undefined,
        });
    }
    return contacts;
}
function buildEnaireApplicability(attrs) {
    const dayRaw = pickString(attrs.day);
    const schedule = [];
    if (dayRaw && dayRaw.toUpperCase() !== "ANY") {
        schedule.push({
            days: splitDelimitedList(dayRaw, /[,;|/\s]+/),
            startTime: pickString(attrs.startTime),
            endTime: pickString(attrs.endTime),
        });
    }
    const applicability = {
        permanent: dayRaw?.toUpperCase() === "ANY" || (!dayRaw && !pickString(attrs.validFrom)),
        validFrom: pickString(attrs.validFrom) ??
            pickString(attrs.startDateTime) ??
            pickString(attrs.creationDateTime),
        validTo: pickString(attrs.validTo) ?? pickString(attrs.endDateTime),
        schedule: schedule.length > 0 ? schedule : undefined,
    };
    return hasApplicabilityData(applicability) ? applicability : undefined;
}
function buildEnairePublisher(attrs) {
    const meta = {
        variant: pickString(attrs.variant),
        regulationExemption: pickString(attrs.regulationExemption),
        purpose: pickString(attrs.purpose),
        region: pickString(attrs.region),
        category: pickString(attrs.extendedProperties),
        updatedAt: pickString(attrs.updateDateTime),
    };
    const extras = {};
    const issued = pickString(attrs.issued);
    const provider = pickString(attrs.provider);
    const originator = pickString(attrs.originator);
    const gfid = pickString(attrs.GFID);
    if (issued)
        extras.issued = issued;
    if (provider)
        extras.provider = provider;
    if (originator)
        extras.originator = originator;
    if (gfid)
        extras.gfid = gfid;
    if (Object.keys(extras).length > 0)
        meta.extras = extras;
    const hasMeta = Object.values(meta).some((v) => v != null && (typeof v !== "object" || Object.keys(v).length > 0));
    return hasMeta ? meta : undefined;
}
function buildEnaireAltitudeNotes(attrs) {
    const notes = [];
    const technical = pickString(attrs.technicalLimitation);
    const restrictionConditions = pickString(attrs.restrictionConditions);
    const otherReason = pickString(attrs.otherReasonInfo);
    if (technical)
        notes.push(technical);
    if (restrictionConditions)
        notes.push(restrictionConditions);
    if (otherReason)
        notes.push(otherReason);
    return notes.length > 0 ? notes : undefined;
}
/** Rich ENAIRE servAIS fields mapped to the common enrichment shape. */
export function enrichEnaireAttributes(attrs) {
    const contacts = buildEnaireContacts(attrs);
    const messageHtml = pickString(attrs.message);
    const applicability = buildEnaireApplicability(attrs);
    const publisher = buildEnairePublisher(attrs);
    const altitudeNotes = buildEnaireAltitudeNotes(attrs);
    if (contacts.length === 0 &&
        !messageHtml &&
        !applicability &&
        !publisher &&
        !altitudeNotes) {
        return undefined;
    }
    return {
        contacts,
        applicability,
        guidanceHtml: messageHtml,
        guidance: messageHtml ? stripHtml(messageHtml) : undefined,
        publisher,
        altitudeNotes,
    };
}
