import type { UasRestriction } from "../ed318-types.js";

export function splitDelimitedList(value: unknown, delimiters = /[;,|]/): string[] {
  if (value == null || value === "") return [];
  if (Array.isArray(value)) {
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  }
  return String(value)
    .split(delimiters)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseReasonList(value: unknown): string[] {
  return splitDelimitedList(value, /[,;|]/);
}

export function pickString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value).trim();
  return s.length > 0 ? s : undefined;
}

export function normalizeRestriction(raw: unknown): UasRestriction {
  const value = String(raw ?? "REQ_AUTHORISATION").trim();
  if (value === "REQ_AUTHORIZATION") return "REQ_AUTHORISATION";
  return value as UasRestriction;
}

/** Lightweight HTML → plain text for guidance display. */
export function stripHtml(html: string): string {
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

export function hasApplicabilityData(applicability: {
  permanent?: boolean;
  validFrom?: string;
  validTo?: string;
  schedule?: unknown[];
}): boolean {
  return (
    applicability.permanent === true ||
    Boolean(applicability.validFrom) ||
    Boolean(applicability.validTo) ||
    Boolean(applicability.schedule?.length)
  );
}
