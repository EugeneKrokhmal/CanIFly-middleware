import { describe, expect, it } from "vitest";
import { filterForMap, altitudeOverlaps } from "../filter-by-profile.js";
import type { DroneProfile, MatchedZone } from "../ed318-types.js";

const openProfile: DroneProfile = {
  weightClass: "c0",
  operationCategory: "open",
  maxAltitudeAgl: 120,
};

function zone(
  partial: Partial<MatchedZone> & Pick<MatchedZone, "identifier">,
): MatchedZone {
  return {
    name: partial.name ?? partial.identifier,
    restriction: partial.restriction ?? "REQ_AUTHORISATION",
    reason: partial.reason ?? ["AIR_TRAFFIC"],
    source: partial.source ?? "aero",
    lowerLimitM: partial.lowerLimitM ?? 0,
    upperLimitM: partial.upperLimitM ?? 120,
    lowerRef: partial.lowerRef ?? "AGL",
    upperRef: partial.upperRef ?? "AGL",
    message: partial.message,
    ...partial,
  };
}

describe("filterForMap (ENAIRE altitude logic)", () => {
  it("hides zones whose floor is above the flight ceiling", () => {
    const ctr = zone({
      identifier: "LEBB_CT",
      lowerLimitM: 60,
      upperLimitM: 305,
      message:
        "Están permitidas las operaciones VLOS a una altura máxima de 60m",
    });
    expect(filterForMap([ctr], openProfile, 45)).toHaveLength(0);
    expect(filterForMap([ctr], openProfile, 120)).toHaveLength(1);
  });

  it("keeps surface hard bans at low ceilings", () => {
    const hard = zone({
      identifier: "LEBB0",
      lowerLimitM: 0,
      upperLimitM: 900,
      message: "NO permitido el vuelo a drones excepto coordinación.",
    });
    expect(filterForMap([hard], openProfile, 45)).toHaveLength(1);
  });

  it("excludes nationwide population advisory overlays", () => {
    const np = zone({
      identifier: "NPDRID",
      source: "urbano",
      reason: ["POPULATION"],
      message: "",
    });
    expect(filterForMap([np], openProfile, 120)).toHaveLength(0);
  });
});

describe("altitudeOverlaps", () => {
  it("detects vertical band intersection", () => {
    const z = zone({ identifier: "X", lowerLimitM: 45, upperLimitM: 900 });
    expect(altitudeOverlaps(z, 30)).toBe(false);
    expect(altitudeOverlaps(z, 45)).toBe(true);
    expect(altitudeOverlaps(z, 120)).toBe(true);
  });
});
