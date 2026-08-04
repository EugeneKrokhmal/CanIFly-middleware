export function splitDelimitedList(value, delimiters = /[;,|]/) {
    if (value == null || value === "")
        return [];
    if (Array.isArray(value)) {
        return value.map(String).map((s) => s.trim()).filter(Boolean);
    }
    return String(value)
        .split(delimiters)
        .map((s) => s.trim())
        .filter(Boolean);
}
export function parseReasonList(value) {
    return splitDelimitedList(value, /[,;|]/);
}
export function pickString(value) {
    if (value == null)
        return undefined;
    const s = String(value).trim();
    return s.length > 0 ? s : undefined;
}
export function normalizeRestriction(raw) {
    const value = String(raw ?? "REQ_AUTHORISATION").trim();
    if (value === "REQ_AUTHORIZATION")
        return "REQ_AUTHORISATION";
    return value;
}
/** Lightweight HTML → plain text for guidance display. */
export function stripHtml(html) {
    return html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]+/g, " ")
        .trim();
}
export function hasApplicabilityData(applicability) {
    return (applicability.permanent === true ||
        Boolean(applicability.validFrom) ||
        Boolean(applicability.validTo) ||
        Boolean(applicability.schedule?.length));
}
