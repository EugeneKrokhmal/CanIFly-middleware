import type {
  UasZoneFeature,
  UasZoneGeometry,
  ZoneSliceRecord,
  ZoneSource,
} from "./ed318-types.js";
import { toMeters } from "./ed318-types.js";

function newId(): string {
  return globalThis.crypto.randomUUID();
}

function ensureMultiPolygon(
  geom: GeoJSON.Polygon | GeoJSON.MultiPolygon,
): GeoJSON.MultiPolygon {
  if (geom.type === "MultiPolygon") return geom;
  return {
    type: "MultiPolygon",
    // Polygon coords are Position[][]; MultiPolygon needs an extra array level.
    coordinates: [geom.coordinates],
  };
}

/**
 * Convert GeoJSON Polygon/MultiPolygon to WKT (lon lat order, EPSG:4326).
 */
export function geoJsonToWkt(
  geom: GeoJSON.Polygon | GeoJSON.MultiPolygon,
): string {
  const mp = ensureMultiPolygon(geom);
  const polys = mp.coordinates
    .map((poly) => {
      const rings = poly
        .map((ring) => {
          const pts = ring.map(([lng, lat]) => `${lng} ${lat}`).join(", ");
          return `(${pts})`;
        })
        .join(", ");
      return `(${rings})`;
    })
    .join(", ");
  return `MULTIPOLYGON(${polys})`;
}

function parseApplicabilityDates(
  feature: UasZoneFeature,
): { validFrom: Date | null; validTo: Date | null } {
  const app = feature.applicability?.[0];
  if (!app) return { validFrom: null, validTo: null };
  return {
    validFrom: app.startDateTime ? new Date(app.startDateTime) : null,
    validTo: app.endDateTime ? new Date(app.endDateTime) : null,
  };
}

function normalizeGeometrySlice(
  g: UasZoneGeometry,
): Omit<
  ZoneSliceRecord,
  | "id"
  | "zoneIdentifier"
  | "name"
  | "source"
  | "restriction"
  | "reason"
  | "zoneType"
  | "properties"
  | "validFrom"
  | "validTo"
  | "ingestedAt"
> | null {
  const proj = g.horizontalProjection;
  if (!proj || (proj.type !== "Polygon" && proj.type !== "MultiPolygon")) {
    return null;
  }
  return {
    lowerLimitM: toMeters(g.lowerLimit, g.uomDimensions),
    upperLimitM: toMeters(g.upperLimit, g.uomDimensions),
    lowerRef: g.lowerVerticalReference,
    upperRef: g.upperVerticalReference,
    geomGeoJson: ensureMultiPolygon(proj),
  };
}

/**
 * Explode an ED-318 feature into one ZoneSliceRecord per geometry slice.
 */
export function zoneFeatureToSlices(
  feature: UasZoneFeature,
  source: ZoneSource,
  ingestedAt: Date = new Date(),
): ZoneSliceRecord[] {
  const { validFrom, validTo } = parseApplicabilityDates(feature);
  const slices: ZoneSliceRecord[] = [];

  for (const g of feature.geometry ?? []) {
    const normalized = normalizeGeometrySlice(g);
    if (!normalized) continue;
    slices.push({
      id: newId(),
      zoneIdentifier: feature.identifier,
      name: feature.name,
      source,
      restriction: feature.restriction,
      reason: feature.reason ?? [],
      zoneType: feature.type ?? "COMMON",
      properties: feature,
      validFrom,
      validTo,
      ingestedAt,
      ...normalized,
    });
  }

  return slices;
}

/**
 * Map an ArcGIS / GeoJSON Feature into a UasZoneFeature for shared ingest path.
 */
export function arcgisFeatureToUasZone(
  feature: GeoJSON.Feature,
  fallbackId: string,
): UasZoneFeature | null {
  const props = (feature.properties ?? {}) as Record<string, unknown>;
  const geom = feature.geometry;
  if (
    !geom ||
    (geom.type !== "Polygon" && geom.type !== "MultiPolygon")
  ) {
    return null;
  }

  const identifier = String(
    props.identifier ??
      props.Identifier ??
      props.OBJECTID ??
      props.FID ??
      fallbackId,
  );
  const name = String(props.name ?? props.Name ?? props.NOMBRE ?? identifier);
  const restriction = String(
    props.restriction ??
      props.Restriction ??
      props.RESTRICTION ??
      "REQ_AUTHORISATION",
  );
  const reasonRaw = props.reason ?? props.Reason ?? props.REASON;
  const reason = Array.isArray(reasonRaw)
    ? reasonRaw.map(String)
    : reasonRaw
      ? [String(reasonRaw)]
      : [];

  return {
    identifier,
    country: String(props.country ?? "ESP"),
    name,
    type: String(props.type ?? props.Type ?? "COMMON"),
    restriction,
    reason,
    message: props.message ? String(props.message) : undefined,
    geometry: [
      {
        upperLimit: Number(props.upperLimit ?? props.UpperLimit ?? 120),
        lowerLimit: Number(props.lowerLimit ?? props.LowerLimit ?? 0),
        uomDimensions: String(props.uomDimensions ?? "M"),
        upperVerticalReference: String(
          props.upperVerticalReference ?? "AGL",
        ),
        lowerVerticalReference: String(
          props.lowerVerticalReference ?? "AGL",
        ),
        horizontalProjection: geom,
      },
    ],
  };
}
