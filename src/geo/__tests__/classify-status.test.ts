import { describe, expect, it } from "vitest";
import { classifyStatus } from "@/lib/geo/classify-status";
import { filterByProfile } from "@/lib/geo/filter-by-profile";
import type { MatchedZone } from "@/lib/geo/ed318-types";

function zone(partial: Partial<MatchedZone> & Pick<MatchedZone, "identifier" | "restriction">): MatchedZone {
  return {
    name: partial.name ?? partial.identifier,
    reason: partial.reason ?? [],
    source: partial.source ?? "fixture",
    lowerLimitM: partial.lowerLimitM ?? 0,
    upperLimitM: partial.upperLimitM ?? 120,
    lowerRef: partial.lowerRef ?? "AGL",
    upperRef: partial.upperRef ?? "AGL",
    ...partial,
  };
}

describe("classifyStatus", () => {
  it("returns clear when no zones", () => {
    const result = classifyStatus([]);
    expect(result.status).toBe("clear");
    expect(result.zones).toHaveLength(0);
  });

  it("returns prohibited for PROHIBITED restriction", () => {
    const result = classifyStatus([
      zone({ identifier: "P1", restriction: "PROHIBITED", name: "CTR" }),
      zone({ identifier: "R1", restriction: "REQ_AUTHORISATION", name: "Urban" }),
    ]);
    expect(result.status).toBe("prohibited");
    expect(result.summary).toMatch(/prohibited/i);
  });

  it("returns restricted for REQ_AUTHORISATION", () => {
    const result = classifyStatus([
      zone({ identifier: "R1", restriction: "REQ_AUTHORISATION", name: "Urban" }),
    ]);
    expect(result.status).toBe("restricted");
    expect(result.summary).toMatch(/authorization/i);
  });

  it("treats military auth zones as prohibited", () => {
    const result = classifyStatus([
      zone({
        identifier: "M1",
        restriction: "REQ_AUTHORISATION",
        reason: ["MILITARY"],
        name: "MIL Zone",
      }),
    ]);
    expect(result.status).toBe("prohibited");
  });

  it("keeps CTR auth as limited (clear with height cap), not restricted", () => {
    const result = classifyStatus([
      zone({
        identifier: "LEBB_CT",
        name: "CTR BILBAO",
        restriction: "REQ_AUTHORISATION",
        reason: ["AIR_TRAFFIC"],
        lowerLimitM: 60,
        upperLimitM: 305,
        message:
          "Están permitidas las operaciones VLOS a una altura máxima de 60m fuera de las ZGUAS generales por razón de la seguridad operacional en el entorno de los aeródromos.",
      }),
    ]);
    expect(result.status).toBe("limited");
    expect(result.summary).toMatch(/Clear to fly up to ~60m/i);
  });

  it("uses the tightest free band when CTR and LEBB45 overlap", () => {
    const result = classifyStatus([
      zone({
        identifier: "LEBB_CT",
        name: "CTR BILBAO",
        restriction: "REQ_AUTHORISATION",
        reason: ["AIR_TRAFFIC"],
        lowerLimitM: 60,
        upperLimitM: 305,
        message:
          "Están permitidas las operaciones VLOS a una altura máxima de 60m fuera de las ZGUAS.",
      }),
      zone({
        identifier: "LEBB45",
        name: "BILBAO",
        restriction: "REQ_AUTHORISATION",
        reason: ["AIR_TRAFFIC"],
        lowerLimitM: 45,
        upperLimitM: 900,
        message:
          "Por debajo de 45m medidos desde el punto de referencia del aeródromo (41m) no es necesario coordinar la operación.",
      }),
      zone({
        identifier: "NPDRID",
        restriction: "REQ_AUTHORISATION",
        reason: ["POPULATION"],
        source: "urbano",
        message: "",
      }),
    ]);
    expect(result.status).toBe("limited");
    expect(result.summary).toMatch(/~45m/i);
  });

  it("prefers aerodrome ops zone in prohibited summary", () => {
    const result = classifyStatus([
      zone({
        identifier: "LEBB AT",
        name: "ATZ BILBAO",
        restriction: "REQ_AUTHORISATION",
        reason: ["AIR_TRAFFIC"],
        lowerLimitM: 60,
        upperLimitM: 914,
      }),
      zone({
        identifier: "LEBB0",
        name: "BILBAO",
        restriction: "REQ_AUTHORISATION",
        reason: ["AIR_TRAFFIC"],
        lowerLimitM: 0,
        upperLimitM: 900,
        message: "NO permitido el vuelo a drones excepto coordinación.",
      }),
    ]);
    expect(result.status).toBe("prohibited");
    expect(result.zones[0].identifier).toBe("LEBB0");
  });

  it("does not treat nationwide NPDRID alone as restricted", () => {
    const result = classifyStatus([
      zone({
        identifier: "NPDRID",
        name: "",
        restriction: "REQ_AUTHORISATION",
        reason: ["POPULATION"],
        source: "urbano",
        lowerLimitM: 0,
        upperLimitM: 900,
        message: "",
      }),
    ]);
    expect(result.status).toBe("clear");
    expect(result.summary).toMatch(/population|urban/i);
    expect(result.zones.map((z) => z.identifier)).toContain("NPDRID");
  });

  it("lets aero free-band zones drive limited status while keeping NPDRID as advisory", () => {
    const result = classifyStatus([
      zone({
        identifier: "NPDRID",
        restriction: "REQ_AUTHORISATION",
        reason: ["POPULATION"],
        source: "urbano",
        message: "",
      }),
      zone({
        identifier: "LEBB_CT",
        name: "CTR BILBAO",
        restriction: "REQ_AUTHORISATION",
        reason: ["AIR_TRAFFIC"],
        lowerLimitM: 60,
        upperLimitM: 305,
        message:
          "Están permitidas las operaciones VLOS a una altura máxima de 60m fuera de las ZGUAS.",
      }),
    ]);
    expect(result.status).toBe("limited");
    expect(result.zones[0].identifier).toBe("LEBB_CT");
    expect(result.zones.at(-1)?.identifier).toBe("NPDRID");
  });
});

describe("filterByProfile", () => {
  const militaryHigh = zone({
    identifier: "MIL-HIGH",
    restriction: "PROHIBITED",
    reason: ["MILITARY"],
    lowerLimitM: 500,
    upperLimitM: 5000,
    lowerRef: "AGL",
    upperRef: "AGL",
  });

  const urban = zone({
    identifier: "URB",
    restriction: "REQ_AUTHORISATION",
    reason: ["SECURITY"],
    lowerLimitM: 0,
    upperLimitM: 120,
    source: "urbano",
  });

  const conditionalNature = zone({
    identifier: "PARK",
    restriction: "CONDITIONAL",
    reason: ["NATURE"],
    lowerLimitM: 0,
    upperLimitM: 120,
    source: "urbano",
  });

  it("hides high-altitude military for open category at 120m", () => {
    const filtered = filterByProfile(
      [militaryHigh, urban],
      { weightClass: "c0", operationCategory: "open", maxAltitudeAgl: 120 },
      120,
    );
    expect(filtered.map((z) => z.identifier)).toEqual(["URB"]);
  });

  it("keeps military high when altitude overlaps in specific category", () => {
    const filtered = filterByProfile(
      [militaryHigh],
      { weightClass: "c2", operationCategory: "specific", maxAltitudeAgl: 600 },
      600,
    );
    expect(filtered).toHaveLength(1);
  });

  it("keeps zones that intersect the planned 0…ceiling envelope", () => {
    // Ceiling 200 still flies through the urban 0–120 band.
    const filtered = filterByProfile(
      [urban],
      { weightClass: "c1", operationCategory: "open", maxAltitudeAgl: 120 },
      200,
    );
    expect(filtered).toHaveLength(1);
  });

  it("drops zones entirely above the planned ceiling", () => {
    const filtered = filterByProfile(
      [militaryHigh],
      { weightClass: "c1", operationCategory: "open", maxAltitudeAgl: 120 },
      120,
    );
    expect(filtered).toHaveLength(0);
  });

  it("applies C0 leniency to conditional nature zones", () => {
    const filtered = filterByProfile(
      [conditionalNature, urban],
      { weightClass: "c0", operationCategory: "open", maxAltitudeAgl: 120 },
      60,
    );
    expect(filtered.map((z) => z.identifier)).toEqual(["URB"]);
  });

  it("keeps conditional zones for C1", () => {
    const filtered = filterByProfile(
      [conditionalNature],
      { weightClass: "c1", operationCategory: "open", maxAltitudeAgl: 120 },
      60,
    );
    expect(filtered).toHaveLength(1);
  });
});
