import type { UasRestriction } from "../../ed318-types.js";
/** Map PANSA zone type / name / text → ED-318-like restriction. */
export declare function mapPansaRestriction(attrs: Record<string, unknown>): UasRestriction;
export declare function pansaReasonsFromAttrs(attrs: Record<string, unknown>): string[];
export declare function pickPansaDescription(attrs: Record<string, unknown>): string | undefined;
export declare function formatPansaActivityFromAttrs(attrs: Record<string, unknown>): string | undefined;
