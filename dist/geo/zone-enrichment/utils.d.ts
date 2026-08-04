import type { UasRestriction } from "../ed318-types.js";
export declare function splitDelimitedList(value: unknown, delimiters?: RegExp): string[];
export declare function parseReasonList(value: unknown): string[];
export declare function pickString(value: unknown): string | undefined;
export declare function normalizeRestriction(raw: unknown): UasRestriction;
/** Lightweight HTML → plain text for guidance display. */
export declare function stripHtml(html: string): string;
export declare function hasApplicabilityData(applicability: {
    permanent?: boolean;
    validFrom?: string;
    validTo?: string;
    schedule?: unknown[];
}): boolean;
