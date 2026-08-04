import { describe, expect, it } from "vitest";
import {
  buildMatchedZoneFromProvider,
  enrichDipulAttributes,
  enrichEnaireAttributes,
  enrichGeopfAttributes,
  normalizeDipulAttributes,
  normalizeEnaireAttributes,
  normalizeGeopfAttributes,
  normalizePansaAttributes,
} from "../zone-enrichment/index.js";

const LEBZ45_ATTRS: Record<string, unknown> = {
  identifier: "LEBZ45",
  country: "ESP",
  regulationExemption: "No",
  type: "REQ_AUTHORIZATION",
  name: "BADAJOZ/Talavera La Real",
  reasons: "AIR_TRAFFIC",
  message:
    "Se encuentra en la Zona geográfica de UAS General por razón de la seguridad operacional de <elem>BADAJOZ/Talavera La Real </elem>, LEBZ.<p> Por debajo de 45m medidos desde el punto de referencia del aeródromo (185m), no es necesario coordinar la operación. <p><font color=\"#dc143c\"> Por encima de 45m, medidos desde el punto de referencia del aeródromo (185m), NO permitido el vuelo a drones excepto coordinación con el Aeródromo.</font></p><p> <b>Contacto:</b>  TEL: <font color=\"#009fda\">+34-924 209 500</font> ; TEL: <font color=\"#009fda\">+34-924 210 406</font> ;Email: <font color=\"#009fda\">cecoabjz@aena.es</font>  ;Email: <font color=\"#009fda\">preparacion_vuelos_ala23@ea.mde.es</font>  </p>",
  variant: "COMMON",
  extendedProperties: "Aeródromo",
  purpose: "AUTHORIZATION",
  email: "cecoabjz@aena.es;preparacion_vuelos_ala23@ea.mde.es",
  phone: "+34-924 209 500;+34-924 210 406",
  lower: 45.0,
  lowerReference: "AGL",
  upper: 900.0,
  upperReference: "AGL",
  uom: "M",
  day: "ANY",
  updateDateTime: "2026-06-08T10:30:46",
  creationDateTime: "2025-10-01T12:13:44",
  GFID: "8FD7DF17-DFBE-49D7-A883-60FB314FDAE0",
};

describe("ENAIRE zone enrichment", () => {
  it("normalizes servAIS attributes into MatchedZone", () => {
    const zone = normalizeEnaireAttributes(LEBZ45_ATTRS, "aero");
    expect(zone).not.toBeNull();
    expect(zone!.identifier).toBe("LEBZ45");
    expect(zone!.restriction).toBe("REQ_AUTHORISATION");
    expect(zone!.lowerLimitM).toBe(45);
    expect(zone!.upperLimitM).toBe(900);
    expect(zone!.contact).toBe("cecoabjz@aena.es");
    expect(zone!.reason).toEqual(["AIR_TRAFFIC"]);
  });

  it("maps servAIS attributes to common enrichment", () => {
    const enrichment = enrichEnaireAttributes(LEBZ45_ATTRS);
    expect(enrichment).toBeDefined();
    expect(enrichment!.contacts).toHaveLength(2);
    expect(enrichment!.contacts[0].email).toBe("cecoabjz@aena.es");
    expect(enrichment!.contacts[0].phone).toBe("+34-924 209 500");
    expect(enrichment!.contacts[1].email).toBe("preparacion_vuelos_ala23@ea.mde.es");
    expect(enrichment!.publisher?.variant).toBe("COMMON");
    expect(enrichment!.publisher?.category).toBe("Aeródromo");
    expect(enrichment!.applicability?.permanent).toBe(true);
    expect(enrichment!.guidance).toContain("BADAJOZ");
    expect(enrichment!.guidanceHtml).toContain("<p>");
  });

  it("builds enriched zone through provider registry", () => {
    const zone = buildMatchedZoneFromProvider({
      source: "aero",
      rawAttributes: LEBZ45_ATTRS,
    });
    expect(zone).not.toBeNull();
    expect(zone!.enrichment?.contacts).toHaveLength(2);
    expect(zone!.contact).toBe("cecoabjz@aena.es");
    expect(zone!.message).toContain("LEBZ");
  });
});

const DIPUL_AIRPORT_ATTRS: Record<string, unknown> = {
  legal_ref: "§ 21h, Abs. 3 (2.) LuftVO",
  generated_name_EN: "Neubrandenburg",
  generated_name_DE: "Neubrandenburg",
  lower_limit_unit: "m",
  external_reference: "1PCFQKA",
  name: "Neubrandenburg",
  lower_limit_altitude: 0,
  lower_limit_alt_ref: "AGL",
  type_code: "FLUGHAFEN",
};

const DIPUL_TEMPORARY_ATTRS: Record<string, unknown> = {
  external_reference: "TMP-001",
  legal_ref: "§ 21h, Abs. 4 LuftVO",
  start_time: "2026-06-01T08:00:00Z",
  end_time: "2026-06-30T20:00:00Z",
  name: "Event restriction",
  type_code: "TEMPORAERE_BETRIEBSEINSCHRAENKUNG",
  generated_name_en: "Temporary ops limit",
  generated_name_de: "Temporäre Betriebseinschränkung",
  lower_limit_altitude: 0,
  upper_limit_altitude: 120,
};

describe("dipul zone enrichment", () => {
  it("maps airport WFS properties to common enrichment", () => {
    const enrichment = enrichDipulAttributes(DIPUL_AIRPORT_ATTRS);
    expect(enrichment).toBeDefined();
    expect(enrichment!.guidance).toBe("§ 21h, Abs. 3 (2.) LuftVO");
    expect(enrichment!.publisher?.variant).toBe("FLUGHAFEN");
    expect(enrichment!.publisher?.extras?.externalReference).toBe("1PCFQKA");
    expect(enrichment!.contacts).toEqual([]);
  });

  it("maps temporary restriction validity windows", () => {
    const enrichment = enrichDipulAttributes(DIPUL_TEMPORARY_ATTRS);
    expect(enrichment?.applicability?.validFrom).toBe("2026-06-01T08:00:00Z");
    expect(enrichment?.applicability?.validTo).toBe("2026-06-30T20:00:00Z");
    expect(enrichment?.applicability?.permanent).toBe(false);
  });

  it("builds full dipul zone via provider registry", () => {
    const zone = buildMatchedZoneFromProvider({
      source: "dipul",
      rawAttributes: DIPUL_AIRPORT_ATTRS,
    });
    expect(zone?.restriction).toBe("PROHIBITED");
    expect(zone?.enrichment?.guidance).toContain("LuftVO");
  });
});

describe("geopf zone enrichment", () => {
  it("normalizes and enriches Géoportail properties", () => {
    const attrs = {
      limite: "Hauteur maximale de vol de 50 m *",
      remarque: "Article L. 613-10 du code de l'aviation civile",
    };
    const zone = normalizeGeopfAttributes(attrs, "fr-1");
    expect(zone?.identifier).toBe("fr-1");
    expect(zone?.upperLimitM).toBe(50);
    expect(zone?.restriction).toBe("CONDITIONAL");

    const enrichment = enrichGeopfAttributes(attrs);
    expect(enrichment?.guidance).toContain("aviation civile");
    expect(enrichment?.altitudeNotes?.[0]).toContain("50");
  });
});

describe("pansa zone enrichment", () => {
  it("normalizes and enriches PANSA payloads", () => {
    const attrs = {
      uid: "abc-123",
      name: "EPWA CTR",
      type: "CTR",
      min: 0,
      max: 120,
      contact: "info@pansa.pl",
      description: { en: "Controlled zone", pl: "Strefa kontrolowana" },
      start: "2026-01-01T00:00:00Z",
      stop: "2026-12-31T23:59:59Z",
      acts: { H24: true },
    };
    const zone = normalizePansaAttributes(attrs);
    expect(zone?.restriction).toBe("REQ_AUTHORISATION");
    expect(zone?.contact).toBe("info@pansa.pl");

    const built = buildMatchedZoneFromProvider({
      source: "pansa",
      rawAttributes: attrs,
    });
    expect(built?.enrichment?.contacts[0]?.email).toBe("info@pansa.pl");
    expect(built?.enrichment?.applicability?.validFrom).toBe(
      "2026-01-01T00:00:00Z",
    );
    expect(built?.message).toContain("H24");
  });
});
