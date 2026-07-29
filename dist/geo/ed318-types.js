/** ED-318 UAS geographical zone types (EUROCAE ED-318 / ENAIRE AIP). */
export const FEET_TO_METERS = 0.3048;
export function toMeters(value, uom) {
    if (String(uom).toUpperCase() === "FT") {
        return value * FEET_TO_METERS;
    }
    return value;
}
