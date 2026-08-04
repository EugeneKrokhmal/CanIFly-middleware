import type { UasRestriction } from "../../ed318-types.js";
/**
 * Map dipul type_code → ED-318-like restriction for open-category UX.
 * Cross-checked against LuftVO § 21h Abs. 3 + dipul Rechtsgrundlagen.
 */
export declare function mapDipulRestriction(typeCode: string | undefined, legalRef?: string): UasRestriction;
