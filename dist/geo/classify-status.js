/** Nationwide urban/population overlays — advisory only for open recreational (Spain). */
const NATIONAL_POPULATION_IDS = new Set([
    "NPDRID",
    "NPRIAS",
    "NPILLA",
    "NPLONA",
]);
function isSpainZone(zone) {
    const c = (zone.country ?? "").toUpperCase();
    if (c === "ES" || c === "ESP")
        return true;
    // Legacy Spain layers omit country; treat ENAIRE sources as Spain.
    return (zone.source === "aero" ||
        zone.source === "urbano" ||
        zone.source === "infra" ||
        zone.source === "servais");
}
function restrictionRank(restriction) {
    const r = String(restriction).toUpperCase();
    if (r === "PROHIBITED")
        return 100;
    if (r.includes("PROHIB") || r.includes("FORBIDDEN"))
        return 95;
    if (r === "REQ_AUTHORISATION" || r === "REQ_AUTHORIZATION")
        return 60;
    if (r === "CONDITIONAL")
        return 50;
    if (r === "USPACE")
        return 40;
    if (r === "NO_RESTRICTION")
        return 0;
    return 30;
}
function cleanName(zone) {
    return (zone.name || zone.identifier)
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
/** Surface aerodrome / hospital ban — no flight without coordination (Spain). */
export function isHardNoFlyZone(zone) {
    if (!isSpainZone(zone))
        return false;
    const id = zone.identifier.toUpperCase().replace(/\s+/g, "");
    const msg = (zone.message ?? "").toUpperCase();
    if (/^[A-Z]{4}0$/.test(id))
        return true;
    if (msg.includes("NO PERMITIDO EL VUELO"))
        return true;
    return false;
}
export function isNationalPopulationAdvisory(zone) {
    if (!isSpainZone(zone))
        return false;
    const id = zone.identifier.toUpperCase().replace(/\s+/g, "");
    if (NATIONAL_POPULATION_IDS.has(id))
        return true;
    if (zone.source === "urbano" &&
        zoneReasons(zone).some((r) => r.toUpperCase().includes("POPULATION")) &&
        !(zone.message ?? "").trim()) {
        return true;
    }
    return false;
}
/**
 * ENAIRE often encodes a free VLOS / no-coordination ceiling in `lower`
 * (e.g. CTR 60m, LEBB45 45m). Flying below that is effectively clear-with-limits.
 */
export function isFreeBandZone(zone) {
    if (!isSpainZone(zone))
        return false;
    if (isHardNoFlyZone(zone) || isNationalPopulationAdvisory(zone))
        return false;
    if (!(zone.lowerLimitM > 0))
        return false;
    const msg = (zone.message ?? "").toLowerCase();
    return (msg.includes("están permitidas las operaciones vlos") ||
        msg.includes("permitidas las operaciones vlos") ||
        msg.includes("no es necesario coordinar"));
}
/** Free ceiling in metres AGL from free-band zones (tightest / minimum). */
export function freeBandCeilingM(zones) {
    const bands = zones.filter(isFreeBandZone).map((z) => z.lowerLimitM);
    if (bands.length === 0)
        return null;
    return Math.min(...bands);
}
function zoneReasons(zone) {
    const raw = zone.reason;
    if (Array.isArray(raw))
        return raw.map(String);
    if (typeof raw === "string" && raw.length > 0) {
        return raw
            .split(/[,;|]/)
            .map((s) => s.trim())
            .filter(Boolean);
    }
    return [];
}
function isMilitary(zone) {
    return zoneReasons(zone).some((r) => r.toUpperCase().includes("MILITARY"));
}
/** Map/sidebar visual severity for a single zone polygon. */
export function zoneVisualStatus(zone) {
    if (isNationalPopulationAdvisory(zone))
        return "clear";
    if (isFreeBandZone(zone))
        return "limited";
    const rank = restrictionRank(zone.restriction);
    if (rank >= 90)
        return "prohibited";
    if ((isHardNoFlyZone(zone) || isMilitary(zone)) && rank >= 50) {
        return "prohibited";
    }
    if (rank >= 30)
        return "restricted";
    return "clear";
}
function zonePriorityBoost(zone) {
    if (isHardNoFlyZone(zone))
        return 40;
    if (isMilitary(zone))
        return 20;
    if (isFreeBandZone(zone))
        return 5;
    if (isNationalPopulationAdvisory(zone))
        return -50;
    return 0;
}
function statusPriority(status) {
    if (status === "prohibited")
        return 4;
    if (status === "restricted")
        return 3;
    if (status === "limited")
        return 2;
    return 1;
}
function formatAltitudeBand(zone) {
    const msg = zone.message ?? "";
    const fl = msg.match(/FL\s*(\d+)/i);
    const upperRef = (zone.upperRef ?? zone.lowerRef ?? "AGL").toUpperCase();
    if (fl && (upperRef === "AMSL" || zone.upperLimitM >= 5000)) {
        return `${Math.round(zone.lowerLimitM)}m ${zone.lowerRef}–FL${fl[1]}`;
    }
    return `${Math.round(zone.lowerLimitM)}–${Math.round(zone.upperLimitM)}m ${zone.lowerRef}`;
}
function buildSummary(status, zones, advisory, freeLimit) {
    if (status === "clear") {
        if (advisory.length > 0) {
            return "No hard airspace restrictions at this altitude. Nationwide population/urban rules (AESA) may still apply — check open-category limits.";
        }
        return "No applicable UAS geographical restrictions at this location and altitude.";
    }
    if (status === "limited" && freeLimit != null) {
        const names = zones
            .filter(isFreeBandZone)
            .map(cleanName)
            .filter(Boolean)
            .slice(0, 2)
            .join(", ");
        return `Clear to fly up to ~${Math.round(freeLimit)}m AGL without prior coordination — auth/coordination required above${names ? ` (${names})` : ""}.`;
    }
    const top = zones[0];
    const band = formatAltitudeBand(top);
    const name = cleanName(top);
    const msg = (top.message ?? "").toLowerCase();
    if (status === "prohibited") {
        return `Flight prohibited without coordination — ${name} (${band}).`;
    }
    if (isSpainZone(top) &&
        msg.includes("están permitidas las operaciones vlos") &&
        top.lowerLimitM > 0) {
        return `Restricted — VLOS up to ${Math.round(top.lowerLimitM)}m often allowed outside aerodrome zones; auth above (${name}).`;
    }
    if (isSpainZone(top) &&
        msg.includes("no es necesario coordinar") &&
        top.lowerLimitM > 0) {
        return `Restricted — below ~${Math.round(top.lowerLimitM)}m usually free of aerodrome coordination; auth above (${name}).`;
    }
    const restriction = String(top.restriction).toUpperCase();
    if (restriction.includes("AUTHORI")) {
        return `Authorization / coordination may be required — ${name} (${band}).`;
    }
    if (restriction === "CONDITIONAL") {
        return `Restricted with conditions — ${name} (${band}).`;
    }
    return `Restricted — ${name} (${band}).`;
}
/**
 * Collapse overlapping matched zones into a single human-readable status.
 * Highest severity wins (prohibited > restricted > limited > clear).
 */
export function classifyStatus(zones, options = {}) {
    const ceilingAgl = options.ceilingAgl ?? 120;
    if (zones.length === 0) {
        return {
            status: "clear",
            summary: buildSummary("clear", [], [], null),
            zones: [],
            evaluatedAt: new Date().toISOString(),
        };
    }
    const advisory = zones.filter(isNationalPopulationAdvisory);
    const driving = zones.filter((z) => !isNationalPopulationAdvisory(z));
    const freeLimit = freeBandCeilingM(driving);
    if (driving.length === 0) {
        return {
            status: "clear",
            summary: buildSummary("clear", [], advisory, null),
            zones: advisory,
            evaluatedAt: new Date().toISOString(),
        };
    }
    // Only free-band CTR/aerodrome buffers.
    if (driving.every(isFreeBandZone) && freeLimit != null) {
        const ordered = [...driving].sort((a, b) => a.lowerLimitM - b.lowerLimitM);
        // Free ceiling at/above planned flight → effectively clear for this profile.
        if (freeLimit >= ceilingAgl) {
            return {
                status: "clear",
                summary: `Clear for open flights up to ${ceilingAgl}m AGL (zone free band ~${Math.round(freeLimit)}m).`,
                zones: [...ordered, ...advisory],
                evaluatedAt: new Date().toISOString(),
            };
        }
        return {
            status: "limited",
            summary: buildSummary("limited", ordered, advisory, freeLimit),
            zones: [...ordered, ...advisory],
            evaluatedAt: new Date().toISOString(),
        };
    }
    const scored = driving
        .map((zone) => ({
        zone,
        status: zoneVisualStatus(zone),
        rank: restrictionRank(zone.restriction) + zonePriorityBoost(zone),
    }))
        .sort((a, b) => {
        const p = statusPriority(b.status) - statusPriority(a.status);
        if (p !== 0)
            return p;
        return b.rank - a.rank;
    });
    const overall = scored[0].status;
    const contributing = scored
        .filter((s) => s.status !== "clear")
        .map((s) => s.zone);
    const ordered = contributing.length > 0 ? contributing : scored.map((s) => s.zone);
    return {
        status: overall,
        summary: buildSummary(overall, ordered, advisory, freeLimit),
        zones: [...ordered, ...advisory],
        evaluatedAt: new Date().toISOString(),
    };
}
