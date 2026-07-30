import type { DroneProfile } from "./ed318-types.js";

export interface Bbox {
  west: number;
  south: number;
  east: number;
  north: number;
}

/** Max span (degrees) for zone bbox queries — prevents country-wide GeoJSON pulls. */
export const MAX_ZONE_BBOX_SPAN_DEG = 8;

export function clampBboxSpan(bbox: Bbox, maxSpan = MAX_ZONE_BBOX_SPAN_DEG): Bbox {
  const lngSpan = bbox.east - bbox.west;
  const latSpan = bbox.north - bbox.south;
  if (lngSpan <= maxSpan && latSpan <= maxSpan) return bbox;

  const midLng = (bbox.west + bbox.east) / 2;
  const midLat = (bbox.south + bbox.north) / 2;
  const halfLng = Math.min(lngSpan, maxSpan) / 2;
  const halfLat = Math.min(latSpan, maxSpan) / 2;
  return {
    west: midLng - halfLng,
    east: midLng + halfLng,
    south: midLat - halfLat,
    north: midLat + halfLat,
  };
}

export function profileQueryParams(
  profile: Pick<DroneProfile, "weightClass" | "maxAltitudeAgl">,
  extra: Record<string, string | number> = {},
): URLSearchParams {
  return new URLSearchParams({
    altitudeAgl: String(profile.maxAltitudeAgl),
    weightClass: profile.weightClass,
    operationCategory: "open",
    ...Object.fromEntries(
      Object.entries(extra).map(([k, v]) => [k, String(v)]),
    ),
  });
}
