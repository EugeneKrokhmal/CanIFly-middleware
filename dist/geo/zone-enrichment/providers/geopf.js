import { pickString } from "../utils.js";
export function isGeopfSource(source) {
    return source === "geopf";
}
export function parseGeopfHeightLimitM(limite) {
    const m = limite.match(/(\d+)\s*m/i);
    return m ? Number(m[1]) : null;
}
export function mapGeopfRestriction(limite) {
    const t = limite.toLowerCase();
    if (t.includes("interdit") || t.includes("prohib"))
        return "PROHIBITED";
    if (t.includes("hauteur") || t.includes("maximale"))
        return "CONDITIONAL";
    if (!t.trim() || t === "none" || t === "null")
        return "CONDITIONAL";
    return "REQ_AUTHORISATION";
}
/** Core MatchedZone fields from Géoportail WFS properties. */
export function normalizeGeopfAttributes(attrs, featureId) {
    const limite = String(attrs.limite ?? "").trim();
    const remarque = String(attrs.remarque ?? "").trim();
    const identifier = String(featureId ?? (limite || remarque || "")).trim();
    if (!identifier)
        return null;
    const heightM = parseGeopfHeightLimitM(limite);
    const restriction = mapGeopfRestriction(limite);
    const name = limite.replace(/\s*\*\s*$/, "").trim() ||
        remarque.slice(0, 80) ||
        "Zone UAS France";
    return {
        identifier,
        name,
        restriction,
        reason: [
            ...(limite ? [limite] : []),
            ...(restriction === "PROHIBITED" ? ["PROHIBITED"] : []),
        ],
        source: "geopf",
        country: "FR",
        lowerLimitM: 0,
        upperLimitM: heightM != null && heightM > 0 ? heightM : 120,
        lowerRef: "AGL",
        upperRef: "AGL",
        message: remarque || limite || undefined,
    };
}
function buildGeopfPublisher(limite) {
    const trimmed = limite.replace(/\s*\*\s*$/, "").trim();
    if (!trimmed)
        return undefined;
    return {
        variant: trimmed,
        category: trimmed,
    };
}
/** Map Géoportail WFS properties into the common enrichment shape. */
export function enrichGeopfAttributes(attrs) {
    const limite = String(attrs.limite ?? "").trim();
    const remarque = pickString(attrs.remarque);
    const publisher = buildGeopfPublisher(limite);
    if (!limite && !remarque && !publisher)
        return undefined;
    const heightM = parseGeopfHeightLimitM(limite);
    const altitudeNotes = heightM != null && heightM > 0 ? [`Height limit: ${heightM} m AGL`] : undefined;
    return {
        contacts: [],
        guidance: remarque ?? (limite || undefined),
        publisher,
        altitudeNotes,
    };
}
