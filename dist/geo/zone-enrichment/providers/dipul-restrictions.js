/** Open-category hard no-fly / consent-required facility types (§ 21h Abs. 3). */
const PROHIBITED_TYPES = new Set([
    "FLUGHAFEN",
    "FLUGPLATZ",
    "FLUGBESCHRAENKUNGSGEBIET",
    "MILITAERISCHE_ANLAGE",
    "JUSTIZVOLLZUGSANSTALT",
    "KRANKENHAUS",
    "POLIZEI",
    "SICHERHEITSBEHOERDE",
    "BEHOERDE",
    "DIPLOMATISCHE_VERTRETUNG",
    "INTERNATIONALE_ORGANISATION",
    "INDUSTRIEANLAGE",
    "KRAFTWERK",
    "UMSPANNWERK",
    "BSL-4-LABOR",
    "LABOR",
]);
const CONDITIONAL_TYPES = new Set([
    "WOHNGRUNDSTUECK",
    "FREIBAD",
    "NATIONALPARK",
    "NATURSCHUTZGEBIET",
    "FFH-GEBIET",
    "VOGELSCHUTZGEBIET",
    "BUNDESAUTOBAHN",
    "BUNDESSTRASSE",
    "BAHNANLAGE",
    "BINNENWASSERSTRASSE",
    "SEEWASSERSTRASSE",
    "SCHIFFFAHRTSANLAGE",
    "STROMLEITUNG",
    "WINDKRAFTANLAGE",
]);
/**
 * Map dipul type_code → ED-318-like restriction for open-category UX.
 * Cross-checked against LuftVO § 21h Abs. 3 + dipul Rechtsgrundlagen.
 */
export function mapDipulRestriction(typeCode, legalRef) {
    const t = (typeCode ?? "").toUpperCase().trim();
    const legal = (legalRef ?? "").toUpperCase();
    if (PROHIBITED_TYPES.has(t) ||
        t.includes("FLUGBESCHRAENK") ||
        t.includes("MILITAER") ||
        legal.includes("§ 17") ||
        /ABS\.\s*3\s*\([12]\.?\)/.test(legal)) {
        return "PROHIBITED";
    }
    if (t.includes("TEMPORAER") || legal.includes("ABS. 4")) {
        return "PROHIBITED";
    }
    if (t === "KONTROLLZONE" || t.includes("KONTROLL")) {
        return "REQ_AUTHORISATION";
    }
    if (CONDITIONAL_TYPES.has(t) || t.includes("WOHN") || t.includes("FREIBAD")) {
        return "CONDITIONAL";
    }
    return "REQ_AUTHORISATION";
}
