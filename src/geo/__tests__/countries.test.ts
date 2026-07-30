import { describe, expect, it } from "vitest";
import { resolveCountry } from "../countries.js";

describe("resolveCountry", () => {
  it.each([
    ["Paris", 48.8566, 2.3522, "FR"],
    ["Berlin", 52.52, 13.405, "DE"],
    ["Madrid", 40.4168, -3.7038, "ES"],
    ["Copenhagen", 55.6761, 12.5683, "DK"],
    ["Prague", 50.0755, 14.4378, "CZ"],
    ["Warsaw", 52.2297, 21.0122, "PL"],
  ] as const)("%s → %s", (_name, lat, lng, want) => {
    expect(resolveCountry(lat, lng)).toBe(want);
  });

  it("DE↔FR Rhine / Saarland", () => {
    expect(resolveCountry(48.5734, 7.7521)).toBe("FR"); // Strasbourg
    expect(resolveCountry(48.573, 7.815)).toBe("DE"); // Kehl
    expect(resolveCountry(49.235, 6.996)).toBe("DE"); // Saarbrücken
    expect(resolveCountry(49.119, 6.176)).toBe("FR"); // Metz
    expect(resolveCountry(47.999, 7.842)).toBe("DE"); // Freiburg
  });

  it("ES↔FR Basque / Pyrenees", () => {
    expect(resolveCountry(43.338, -1.789)).toBe("ES"); // Irun
    expect(resolveCountry(43.36, -1.77)).toBe("FR"); // Hendaye
    expect(resolveCountry(43.362, -1.792)).toBe("ES"); // Hondarribia
    expect(resolveCountry(43.388, -1.663)).toBe("FR"); // St-Jean-de-Luz
    expect(resolveCountry(43.263, -2.935)).toBe("ES"); // Bilbao
    expect(resolveCountry(42.6887, 2.8948)).toBe("FR"); // Perpignan
    expect(resolveCountry(42.2671, 2.9613)).toBe("ES"); // Figueres
  });

  it("DE↔CZ / DE↔PL", () => {
    expect(resolveCountry(50.782, 14.215)).toBe("CZ"); // Děčín
    expect(resolveCountry(50.917, 14.155)).toBe("DE"); // Bad Schandau
    expect(resolveCountry(51.152, 14.987)).toBe("DE"); // Görlitz
    expect(resolveCountry(51.149, 15.01)).toBe("PL"); // Zgorzelec
  });

  it("DE↔DK Flensburg / Sønderjylland", () => {
    expect(resolveCountry(55.4038, 10.4024)).toBe("DK"); // Odense
    expect(resolveCountry(54.793, 9.433)).toBe("DE"); // Flensburg
    expect(resolveCountry(55.059, 9.418)).toBe("DK"); // Padborg / border DK side
  });

  it("outside coverage → null", () => {
    expect(resolveCountry(60, 10)).toBeNull();
  });
});
