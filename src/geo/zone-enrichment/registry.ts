import type {
  MatchedZone,
  UasZoneFeature,
  ZoneEnrichment,
  ZoneSource,
} from "../ed318-types.js";
import { enrichEd318Feature } from "./providers/ed318.js";
import {
  enrichDipulAttributes,
  isDipulSource,
  normalizeDipulAttributes,
} from "./providers/dipul.js";
import {
  enrichEnaireAttributes,
  isEnaireSource,
  normalizeEnaireAttributes,
} from "./providers/enaire.js";
import {
  enrichGeopfAttributes,
  isGeopfSource,
  normalizeGeopfAttributes,
} from "./providers/geopf.js";
import {
  enrichPansaAttributes,
  isPansaSource,
  normalizePansaAttributes,
} from "./providers/pansa.js";

export interface ZoneProviderContext {
  source: ZoneSource;
  /** Raw attribute bag from a live national API (servAIS, dipul WFS, etc.). */
  rawAttributes?: Record<string, unknown>;
  /** ED-318 feature when loaded from PostGIS or ZIP ingest. */
  feature?: UasZoneFeature;
  /** WFS / GeoJSON feature id when not in attributes (geopf). */
  featureId?: string | number;
}

function primaryContact(enrichment: ZoneEnrichment): string | undefined {
  for (const c of enrichment.contacts) {
    if (c.email) return c.email;
  }
  for (const c of enrichment.contacts) {
    if (c.phone) return c.phone;
  }
  return undefined;
}

export function attachEnrichment(
  zone: MatchedZone,
  enrichment: ZoneEnrichment | undefined,
): MatchedZone {
  if (!enrichment) return zone;

  return {
    ...zone,
    contact: zone.contact ?? primaryContact(enrichment),
    message: zone.message ?? enrichment.guidanceHtml ?? enrichment.guidance,
    enrichment,
  };
}

function resolveEnrichment(ctx: ZoneProviderContext): ZoneEnrichment | undefined {
  if (!ctx.rawAttributes) {
    if (ctx.feature) return enrichEd318Feature(ctx.feature);
    return undefined;
  }

  if (isEnaireSource(ctx.source)) {
    return enrichEnaireAttributes(ctx.rawAttributes);
  }
  if (isDipulSource(ctx.source)) {
    return enrichDipulAttributes(ctx.rawAttributes);
  }
  if (isGeopfSource(ctx.source)) {
    return enrichGeopfAttributes(ctx.rawAttributes);
  }
  if (isPansaSource(ctx.source)) {
    return enrichPansaAttributes(ctx.rawAttributes);
  }

  if (ctx.feature) return enrichEd318Feature(ctx.feature);
  return undefined;
}

function normalizeFromProvider(ctx: ZoneProviderContext): MatchedZone | null {
  const { source, rawAttributes, featureId } = ctx;
  if (!rawAttributes) return null;

  if (isEnaireSource(source)) {
    return normalizeEnaireAttributes(rawAttributes, source);
  }
  if (isDipulSource(source)) {
    return normalizeDipulAttributes(rawAttributes);
  }
  if (isGeopfSource(source)) {
    return normalizeGeopfAttributes(rawAttributes, featureId);
  }
  if (isPansaSource(source)) {
    return normalizePansaAttributes(rawAttributes);
  }

  return null;
}

/** Attach provider-specific details to an existing MatchedZone. */
export function enrichMatchedZone(
  zone: MatchedZone,
  ctx: ZoneProviderContext,
): MatchedZone {
  return attachEnrichment(zone, resolveEnrichment(ctx));
}

/** Normalize live provider attributes into MatchedZone + common enrichment. */
export function buildMatchedZoneFromProvider(
  ctx: ZoneProviderContext,
): MatchedZone | null {
  const zone = normalizeFromProvider(ctx);
  if (!zone) return null;
  return enrichMatchedZone(zone, ctx);
}
