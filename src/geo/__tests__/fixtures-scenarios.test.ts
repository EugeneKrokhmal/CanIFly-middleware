import { describe, expect, it } from "vitest";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { classifyStatus } from "@/lib/geo/classify-status";
import { filterByProfile } from "@/lib/geo/filter-by-profile";
import { FIXTURE_TEST_POINTS, FIXTURE_ZONES } from "@/lib/geo/fixtures";
import { zoneFeatureToSlices } from "@/lib/geo/normalize-slices";
import type { MatchedZone } from "@/lib/geo/ed318-types";

function queryFixtures(lat: number, lng: number): MatchedZone[] {
  const pt = point([lng, lat]);
  const matches: MatchedZone[] = [];
  for (const feature of FIXTURE_ZONES) {
    for (const slice of zoneFeatureToSlices(feature, "fixture")) {
      if (booleanPointInPolygon(pt, slice.geomGeoJson)) {
        matches.push({
          identifier: slice.zoneIdentifier,
          name: slice.name,
          restriction: slice.restriction,
          reason: slice.reason,
          source: slice.source,
          lowerLimitM: slice.lowerLimitM,
          upperLimitM: slice.upperLimitM,
          lowerRef: slice.lowerRef,
          upperRef: slice.upperRef,
        });
      }
    }
  }
  return matches;
}

describe("fixture scenarios", () => {
  const openProfile = {
    weightClass: "c0" as const,
    operationCategory: "open" as const,
    maxAltitudeAgl: 120,
  };

  it("marks Madrid CTR as prohibited", () => {
    const { lat, lng } = FIXTURE_TEST_POINTS.prohibited;
    const zones = filterByProfile(queryFixtures(lat, lng), openProfile, 120);
    const result = classifyStatus(zones);
    expect(result.status).toBe("prohibited");
  });

  it("marks Madrid urban as restricted", () => {
    const { lat, lng } = FIXTURE_TEST_POINTS.restricted;
    const zones = filterByProfile(queryFixtures(lat, lng), openProfile, 120);
    const result = classifyStatus(zones);
    expect(result.status).toBe("restricted");
  });

  it("marks rural Castile as clear", () => {
    const { lat, lng } = FIXTURE_TEST_POINTS.clear;
    const zones = filterByProfile(queryFixtures(lat, lng), openProfile, 120);
    const result = classifyStatus(zones);
    expect(result.status).toBe("clear");
  });

  it("filters high military for open recreational at 120m", () => {
    const { lat, lng } = FIXTURE_TEST_POINTS.militaryHigh;
    const raw = queryFixtures(lat, lng);
    expect(raw.length).toBeGreaterThan(0);
    const filtered = filterByProfile(raw, openProfile, 120);
    expect(filtered).toHaveLength(0);
    expect(classifyStatus(filtered).status).toBe("clear");
  });
});
