/** Max span (degrees) for zone bbox queries — prevents Spain-wide GeoJSON pulls. */
export const MAX_ZONE_BBOX_SPAN_DEG = 8;
export function clampBboxSpan(bbox, maxSpan = MAX_ZONE_BBOX_SPAN_DEG) {
    const lngSpan = bbox.east - bbox.west;
    const latSpan = bbox.north - bbox.south;
    if (lngSpan <= maxSpan && latSpan <= maxSpan)
        return bbox;
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
export function profileQueryParams(profile, extra = {}) {
    return new URLSearchParams({
        altitudeAgl: String(profile.maxAltitudeAgl),
        weightClass: profile.weightClass,
        operationCategory: "open",
        ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])),
    });
}
