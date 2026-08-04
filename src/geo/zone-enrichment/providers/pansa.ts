import type {
  MatchedZone,
  ZoneApplicability,
  ZoneEnrichment,
  ZonePublisherMeta,
  ZoneSource,
} from "../../ed318-types.js";
import { hasApplicabilityData, pickString } from "../utils.js";
import {
  formatPansaActivityFromAttrs,
  mapPansaRestriction,
  pansaReasonsFromAttrs,
  pickPansaDescription,
} from "./pansa-restrictions.js";

export function isPansaSource(source: ZoneSource): boolean {
  return source === "pansa";
}

/** Core MatchedZone fields from PANSA DroneMap zone payloads. */
export function normalizePansaAttributes(
  attrs: Record<string, unknown>,
): MatchedZone | null {
  const identifier = String(attrs.name ?? attrs.uid ?? "").trim();
  if (!identifier) return null;

  const lower = Number(attrs.min ?? 0);
  const upper = Number(attrs.max ?? 120);
  const description = pickPansaDescription(attrs);
  const activity = formatPansaActivityFromAttrs(attrs);
  const message =
    activity && description
      ? `${activity}\n\n${description}`
      : activity ?? description;

  return {
    identifier,
    name: String(attrs.othername ?? attrs.name ?? identifier),
    restriction: mapPansaRestriction(attrs),
    reason: pansaReasonsFromAttrs(attrs),
    source: "pansa",
    country: "PL",
    lowerLimitM: Number.isFinite(lower) ? lower : 0,
    upperLimitM: Number.isFinite(upper) ? upper : 120,
    lowerRef: "AGL",
    upperRef: "AGL",
    contact: pickString(attrs.contact),
    message,
  };
}

function buildPansaApplicability(
  attrs: Record<string, unknown>,
): ZoneApplicability | undefined {
  const start = pickString(attrs.start);
  const end = pickString(attrs.stop);
  if (!start && !end) return undefined;

  const applicability: ZoneApplicability = {
    permanent: false,
    validFrom: start,
    validTo: end,
  };
  return hasApplicabilityData(applicability) ? applicability : undefined;
}

function buildPansaPublisher(attrs: Record<string, unknown>): ZonePublisherMeta | undefined {
  const typeCode = pickString(attrs.type);
  const uid = pickString(attrs.uid);
  const source = pickString(attrs.source);
  const extras: Record<string, string> = {};
  if (uid) extras.uid = uid;
  if (source) extras.source = source;

  const meta: ZonePublisherMeta = {
    variant: typeCode,
    category: typeCode,
    extras: Object.keys(extras).length > 0 ? extras : undefined,
  };

  return typeCode || uid || source ? meta : undefined;
}

/** Map PANSA zone payloads into the common enrichment shape. */
export function enrichPansaAttributes(
  attrs: Record<string, unknown>,
): ZoneEnrichment | undefined {
  const contact = pickString(attrs.contact);
  const description = pickPansaDescription(attrs);
  const activity = formatPansaActivityFromAttrs(attrs);
  const applicability = buildPansaApplicability(attrs);
  const publisher = buildPansaPublisher(attrs);

  const contacts = contact ? [{ role: "authority", email: contact.includes("@") ? contact : undefined, phone: contact.includes("@") ? undefined : contact }] : [];

  if (
    contacts.length === 0 &&
    !description &&
    !activity &&
    !applicability &&
    !publisher
  ) {
    return undefined;
  }

  const guidance =
    activity && description
      ? `${activity}\n\n${description}`
      : activity ?? description;

  return {
    contacts,
    applicability,
    guidance,
    publisher,
  };
}
