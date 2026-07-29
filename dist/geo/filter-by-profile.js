import { OPEN_CATEGORY_CEILING_AGL_M } from "../constants.js";
import { isFreeBandZone, isNationalPopulationAdvisory, } from "./classify-status.js";
function reasonsIncludeMilitary(reasons) {
    return reasons.some((r) => String(r).toUpperCase().includes("MILITARY"));
}
function isLowRiskResidential(zone) {
    const reasons = zone.reason.map((r) => String(r).toUpperCase());
    const type = String(zone.restriction).toUpperCase();
    if (reasons.some((r) => r.includes("PRIVACY") || r.includes("NATURE"))) {
        return type !== "PROHIBITED";
    }
    if (zone.source === "urbano" && type === "CONDITIONAL") {
        return true;
    }
    return false;
}
/**
 * Returns true when the zone's vertical band overlaps the planned flight
 * envelope from surface (0) up to the pilot's ceiling AGL.
 */
export function altitudeOverlaps(zone, altitudeAgl) {
    const lower = zone.lowerLimitM;
    const upper = zone.upperLimitM;
    const flightTop = Math.max(0, altitudeAgl);
    const flightBottom = 0;
    return flightTop >= lower && flightBottom <= upper;
}
function passesWeightAndMilitary(zone, profile, ceiling) {
    if (profile.operationCategory === "open" &&
        reasonsIncludeMilitary(zone.reason) &&
        zone.lowerRef.toUpperCase() === "AGL" &&
        zone.lowerLimitM > ceiling &&
        !isFreeBandZone(zone)) {
        return false;
    }
    if (profile.weightClass === "c0" && isLowRiskResidential(zone)) {
        const r = String(zone.restriction).toUpperCase();
        if (r === "CONDITIONAL") {
            return false;
        }
    }
    return true;
}
/**
 * Filter matched zones by drone profile (category, weight class, altitude).
 * Free-band CTR/aerodrome buffers are kept even below their encoded `lower`
 * so the UI can show “clear up to Xm”.
 */
export function filterByProfile(zones, profile, altitudeAgl = profile.maxAltitudeAgl) {
    const ceiling = profile.operationCategory === "open"
        ? Math.min(profile.maxAltitudeAgl, OPEN_CATEGORY_CEILING_AGL_M)
        : profile.maxAltitudeAgl;
    return zones.filter((zone) => {
        if (!altitudeOverlaps(zone, altitudeAgl) && !isFreeBandZone(zone)) {
            return false;
        }
        return passesWeightAndMilitary(zone, profile, ceiling);
    });
}
/**
 * ENAIRE Drones–style map filter: only zones whose vertical band overlaps
 * the configured flight altitude (flight-config height filter). Nationwide
 * population overlays are skipped so they do not wash the whole country.
 */
export function filterForMap(zones, profile, altitudeAgl = profile.maxAltitudeAgl) {
    const ceiling = profile.operationCategory === "open"
        ? Math.min(profile.maxAltitudeAgl, OPEN_CATEGORY_CEILING_AGL_M)
        : profile.maxAltitudeAgl;
    return zones.filter((zone) => {
        if (isNationalPopulationAdvisory(zone))
            return false;
        if (!altitudeOverlaps(zone, altitudeAgl))
            return false;
        return passesWeightAndMilitary(zone, profile, ceiling);
    });
}
