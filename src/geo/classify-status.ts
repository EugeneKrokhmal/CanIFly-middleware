import type {
  AirspaceStatus,
  MatchedZone,
  StatusResult,
  UasRestriction,
} from "./ed318-types.js";

/** Nationwide urban/population overlays — advisory only for open recreational (Spain). */
const NATIONAL_POPULATION_IDS = new Set([
  "NPDRID",
  "NPRIAS",
  "NPILLA",
  "NPLONA",
]);

function isSpainZone(zone: MatchedZone): boolean {
  const c = (zone.country ?? "").toUpperCase();
  if (c === "ES" || c === "ESP") return true;
  // Legacy Spain layers omit country; treat ENAIRE sources as Spain.
  return (
    zone.source === "aero" ||
    zone.source === "urbano" ||
    zone.source === "infra" ||
    zone.source === "servais"
  );
}

function isGermanyZone(zone: MatchedZone): boolean {
  const c = (zone.country ?? "").toUpperCase();
  return c === "DE" || c === "DEU" || zone.source === "dipul";
}

function isCzechiaZone(zone: MatchedZone): boolean {
  const c = (zone.country ?? "").toUpperCase();
  return c === "CZ" || c === "CZE" || zone.source === "anscr";
}

function isFranceZone(zone: MatchedZone): boolean {
  const c = (zone.country ?? "").toUpperCase();
  return c === "FR" || c === "FRA" || zone.source === "geopf";
}

function isDenmarkZone(zone: MatchedZone): boolean {
  const c = (zone.country ?? "").toUpperCase();
  return c === "DK" || c === "DNK" || zone.source === "dronezoner";
}

function isSwitzerlandZone(zone: MatchedZone): boolean {
  const c = (zone.country ?? "").toUpperCase();
  return (
    c === "CH" ||
    c === "CHE" ||
    c === "LI" ||
    c === "LIE" ||
    zone.source === "foca"
  );
}

function isPortugalZone(zone: MatchedZone): boolean {
  const c = (zone.country ?? "").toUpperCase();
  return c === "PT" || c === "PRT" || zone.source === "anac";
}

function isAustriaZone(zone: MatchedZone): boolean {
  const c = (zone.country ?? "").toUpperCase();
  return c === "AT" || c === "AUT" || zone.source === "austro";
}

function isSwedenZone(zone: MatchedZone): boolean {
  const c = (zone.country ?? "").toUpperCase();
  return c === "SE" || c === "SWE" || zone.source === "lfv";
}

function restrictionRank(restriction: UasRestriction): number {
  const r = String(restriction).toUpperCase();
  if (r === "PROHIBITED") return 100;
  if (r.includes("PROHIB") || r.includes("FORBIDDEN")) return 95;
  if (r === "REQ_AUTHORISATION" || r === "REQ_AUTHORIZATION") return 60;
  if (r === "CONDITIONAL") return 50;
  if (r === "USPACE") return 40;
  if (r === "NO_RESTRICTION") return 0;
  return 30;
}

function cleanName(zone: MatchedZone): string {
  return (zone.name || zone.identifier)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Surface aerodrome / hospital ban — no flight without coordination. */
export function isHardNoFlyZone(zone: MatchedZone): boolean {
  if (isSpainZone(zone)) {
    const id = zone.identifier.toUpperCase().replace(/\s+/g, "");
    const msg = (zone.message ?? "").toUpperCase();
    if (/^[A-Z]{4}0$/.test(id)) return true;
    if (msg.includes("NO PERMITIDO EL VUELO")) return true;
    return false;
  }
  if (isGermanyZone(zone)) {
    const reasons = zoneReasons(zone).map((r) => r.toUpperCase());
    if (
      reasons.some(
        (r) =>
          r === "FLUGHAFEN" ||
          r === "FLUGPLATZ" ||
          r.includes("FLUGBESCHRAENK") ||
          r.includes("MILITAER"),
      )
    ) {
      return true;
    }
    const msg = (zone.message ?? "").toUpperCase();
    // § 21h Abs. 3 Nr. 1 (airfield) / Nr. 2 (airport)
    if (/ABS\.\s*3\s*\([12]\.?\)/.test(msg)) return true;
    if (msg.includes("§ 17")) return true;
    return false;
  }
  if (isCzechiaZone(zone)) {
    const reasons = zoneReasons(zone).map((r) => r.toUpperCase());
    const name = `${zone.name} ${zone.identifier}`.toUpperCase();
    if (
      reasons.some(
        (r) =>
          r.includes("AD_PERIMETER") ||
          r.includes("INNER_AD") ||
          /\bLKR314[BDF]\b/.test(r) ||
          /\bLKP\d/.test(r) ||
          r === "MILITARY" ||
          r.includes("VOJENSK"),
      )
    ) {
      return true;
    }
    if (
      name.includes("VNITŘNÍ ZÓNA") ||
      name.includes("VNITRNI ZONA") ||
      name.includes("ZAKÁZ") ||
      /\bLKR314[BDF]\b/.test(name)
    ) {
      return true;
    }
    return false;
  }
  if (isFranceZone(zone)) {
    const blob = `${zone.name} ${zone.message ?? ""} ${zoneReasons(zone).join(" ")}`.toUpperCase();
    return blob.includes("INTERDIT") || blob.includes("PROHIB");
  }
  if (isDenmarkZone(zone)) {
    const reasons = zoneReasons(zone).map((r) => r.toUpperCase());
    // Farve 1 = Rød (flyvesikring); airports / HEMS / military also hard.
    if (reasons.some((r) => r === "FARVE:1" || r === "ROD" || r === "RØD")) {
      return true;
    }
    const blob = `${zone.name} ${zone.identifier} ${reasons.join(" ")}`.toUpperCase();
    return (
      blob.includes("LUFTHAVN") ||
      blob.includes("AIRPORT") ||
      blob.includes("MILITÆR") ||
      blob.includes("MILITAER") ||
      blob.includes("HEMS")
    );
  }
  if (isSwitzerlandZone(zone)) {
    const reasons = zoneReasons(zone).map((r) => r.toUpperCase());
    // FOCA marks aerodromes / CTR as AIR_TRAFFIC (still REQ_AUTHORISATION in JSON).
    if (reasons.some((r) => r === "AIR_TRAFFIC" || r.includes("AIR_TRAFFIC"))) {
      return true;
    }
    const blob = `${zone.name} ${zone.identifier}`.toUpperCase();
    return (
      blob.includes("AIRPORT") ||
      blob.includes("CTR ") ||
      /^CTR\d/.test(blob) ||
      /\bLS[A-Z]{2}\b/.test(blob)
    );
  }
  if (isPortugalZone(zone)) {
    if (String(zone.restriction).toUpperCase() === "PROHIBITED") return true;
    const reasons = zoneReasons(zone).map((r) => r.toUpperCase());
    if (
      reasons.some(
        (r) =>
          r === "AIR_TRAFFIC" ||
          r === "EMERGENCY" ||
          r.includes("MILITARY") ||
          r.includes("SECURITY"),
      )
    ) {
      return true;
    }
    const msg = (zone.message ?? "").toUpperCase();
    return msg.includes("PROIBID") || msg.includes("PROHIBIT");
  }
  if (isAustriaZone(zone)) {
    if (String(zone.restriction).toUpperCase() === "PROHIBITED") return true;
    const reasons = zoneReasons(zone).map((r) => r.toUpperCase());
    return reasons.some(
      (r) =>
        r === "AIR_TRAFFIC" ||
        r.includes("MILITARY") ||
        r.includes("MILITAER"),
    );
  }
  if (isSwedenZone(zone)) {
    if (String(zone.restriction).toUpperCase() === "PROHIBITED") return true;
    const reasons = zoneReasons(zone).map((r) => r.toUpperCase());
    // CTR / ATZ / TIZ / runway & heliport buffers — open category needs ATC.
    if (
      reasons.some(
        (r) =>
          r === "CTR" ||
          r === "ATZ" ||
          r === "TIZ" ||
          r === "RW-5K" ||
          r === "RWY5K" ||
          r === "HKP1K" ||
          r === "HKP" ||
          r.includes("MILITARY") ||
          r.includes("MILITÄR") ||
          r.includes("MILITAER"),
      )
    ) {
      return true;
    }
    const blob = `${zone.name} ${zone.identifier}`.toUpperCase();
    return (
      blob.includes(" CTR") ||
      blob.endsWith("CTR") ||
      blob.includes("ARLANDA") ||
      blob.includes("BROMMA") ||
      blob.includes("LANDVETTER")
    );
  }
  return false;
}

export function isNationalPopulationAdvisory(zone: MatchedZone): boolean {
  if (!isSpainZone(zone)) return false;
  const id = zone.identifier.toUpperCase().replace(/\s+/g, "");
  if (NATIONAL_POPULATION_IDS.has(id)) return true;
  if (
    zone.source === "urbano" &&
    zoneReasons(zone).some((r) => r.toUpperCase().includes("POPULATION")) &&
    !(zone.message ?? "").trim()
  ) {
    return true;
  }
  return false;
}

/**
 * ENAIRE often encodes a free VLOS / no-coordination ceiling in `lower`
 * (e.g. CTR 60m, LEBB45 45m). Flying below that is effectively clear-with-limits.
 */
export function isFreeBandZone(zone: MatchedZone): boolean {
  if (!isSpainZone(zone)) return false;
  if (isHardNoFlyZone(zone) || isNationalPopulationAdvisory(zone)) return false;
  if (!(zone.lowerLimitM > 0)) return false;
  const msg = (zone.message ?? "").toLowerCase();
  return (
    msg.includes("están permitidas las operaciones vlos") ||
    msg.includes("permitidas las operaciones vlos") ||
    msg.includes("no es necesario coordinar")
  );
}

/** Free ceiling in metres AGL from free-band zones (tightest / minimum). */
export function freeBandCeilingM(zones: MatchedZone[]): number | null {
  const bands = zones.filter(isFreeBandZone).map((z) => z.lowerLimitM);
  if (bands.length === 0) return null;
  return Math.min(...bands);
}

function zoneReasons(zone: MatchedZone): string[] {
  const raw = zone.reason as unknown;
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string" && raw.length > 0) {
    return raw
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function isMilitary(zone: MatchedZone): boolean {
  return zoneReasons(zone).some((r) => {
    const u = r.toUpperCase();
    return (
      u.includes("MILITARY") ||
      u.includes("MILITAER") ||
      u.includes("VOJENSK")
    );
  });
}

/** Map/sidebar visual severity for a single zone polygon. */
export function zoneVisualStatus(zone: MatchedZone): AirspaceStatus {
  if (isNationalPopulationAdvisory(zone)) return "clear";
  if (isFreeBandZone(zone)) return "limited";

  const rank = restrictionRank(zone.restriction);
  if (rank >= 90) return "prohibited";
  if ((isHardNoFlyZone(zone) || isMilitary(zone)) && rank >= 50) {
    return "prohibited";
  }
  if (rank >= 30) return "restricted";
  return "clear";
}

function zonePriorityBoost(zone: MatchedZone): number {
  if (isHardNoFlyZone(zone)) return 40;
  if (isMilitary(zone)) return 20;
  if (isFreeBandZone(zone)) return 5;
  if (isNationalPopulationAdvisory(zone)) return -50;
  return 0;
}

function statusPriority(status: AirspaceStatus): number {
  if (status === "prohibited") return 4;
  if (status === "restricted") return 3;
  if (status === "limited") return 2;
  return 1;
}

function formatAltitudeBand(zone: MatchedZone): string {
  const msg = zone.message ?? "";
  const fl = msg.match(/FL\s*(\d+)/i);
  const upperRef = (zone.upperRef ?? zone.lowerRef ?? "AGL").toUpperCase();
  if (fl && (upperRef === "AMSL" || zone.upperLimitM >= 5000)) {
    return `${Math.round(zone.lowerLimitM)}m ${zone.lowerRef}–FL${fl[1]}`;
  }
  return `${Math.round(zone.lowerLimitM)}–${Math.round(zone.upperLimitM)}m ${zone.lowerRef}`;
}

function buildSummary(
  status: AirspaceStatus,
  zones: MatchedZone[],
  advisory: MatchedZone[],
  freeLimit: number | null,
): string {
  if (status === "clear") {
    if (advisory.length > 0) {
      return "No hard airspace restrictions at this altitude. Nationwide population/urban rules (AESA) may still apply — check open-category limits.";
    }
    return "No applicable UAS geographical restrictions at this location and altitude.";
  }

  if (status === "limited" && freeLimit != null) {
    const names = zones
      .filter(isFreeBandZone)
      .map(cleanName)
      .filter(Boolean)
      .slice(0, 2)
      .join(", ");
    return `Clear to fly up to ~${Math.round(freeLimit)}m AGL without prior coordination — auth/coordination required above${names ? ` (${names})` : ""}.`;
  }

  const top = zones[0];
  const band = formatAltitudeBand(top);
  const name = cleanName(top);
  const msg = (top.message ?? "").toLowerCase();

  if (status === "prohibited") {
    return `Flight prohibited without coordination — ${name} (${band}).`;
  }

  if (
    isSpainZone(top) &&
    msg.includes("están permitidas las operaciones vlos") &&
    top.lowerLimitM > 0
  ) {
    return `Restricted — VLOS up to ${Math.round(top.lowerLimitM)}m often allowed outside aerodrome zones; auth above (${name}).`;
  }
  if (
    isSpainZone(top) &&
    msg.includes("no es necesario coordinar") &&
    top.lowerLimitM > 0
  ) {
    return `Restricted — below ~${Math.round(top.lowerLimitM)}m usually free of aerodrome coordination; auth above (${name}).`;
  }

  const restriction = String(top.restriction).toUpperCase();
  if (restriction.includes("AUTHORI")) {
    return `Authorization / coordination may be required — ${name} (${band}).`;
  }
  if (restriction === "CONDITIONAL") {
    return `Restricted with conditions — ${name} (${band}).`;
  }
  return `Restricted — ${name} (${band}).`;
}

/**
 * Collapse overlapping matched zones into a single human-readable status.
 * Highest severity wins (prohibited > restricted > limited > clear).
 */
export function classifyStatus(
  zones: MatchedZone[],
  options: { ceilingAgl?: number } = {},
): StatusResult {
  const ceilingAgl = options.ceilingAgl ?? 120;

  if (zones.length === 0) {
    return {
      status: "clear",
      summary: buildSummary("clear", [], [], null),
      zones: [],
      evaluatedAt: new Date().toISOString(),
    };
  }

  const advisory = zones.filter(isNationalPopulationAdvisory);
  const driving = zones.filter((z) => !isNationalPopulationAdvisory(z));
  const freeLimit = freeBandCeilingM(driving);

  if (driving.length === 0) {
    return {
      status: "clear",
      summary: buildSummary("clear", [], advisory, null),
      zones: advisory,
      evaluatedAt: new Date().toISOString(),
    };
  }

  // Only free-band CTR/aerodrome buffers.
  if (driving.every(isFreeBandZone) && freeLimit != null) {
    const ordered = [...driving].sort(
      (a, b) => a.lowerLimitM - b.lowerLimitM,
    );
    // Free ceiling at/above planned flight → effectively clear for this profile.
    if (freeLimit >= ceilingAgl) {
      return {
        status: "clear",
        summary: `Clear for open flights up to ${ceilingAgl}m AGL (zone free band ~${Math.round(freeLimit)}m).`,
        zones: [...ordered, ...advisory],
        evaluatedAt: new Date().toISOString(),
      };
    }
    return {
      status: "limited",
      summary: buildSummary("limited", ordered, advisory, freeLimit),
      zones: [...ordered, ...advisory],
      evaluatedAt: new Date().toISOString(),
    };
  }

  const scored = driving
    .map((zone) => ({
      zone,
      status: zoneVisualStatus(zone),
      rank: restrictionRank(zone.restriction) + zonePriorityBoost(zone),
    }))
    .sort((a, b) => {
      const p = statusPriority(b.status) - statusPriority(a.status);
      if (p !== 0) return p;
      return b.rank - a.rank;
    });

  const overall = scored[0].status;
  const contributing = scored
    .filter((s) => s.status !== "clear")
    .map((s) => s.zone);

  const ordered =
    contributing.length > 0 ? contributing : scored.map((s) => s.zone);

  return {
    status: overall,
    summary: buildSummary(overall, ordered, advisory, freeLimit),
    zones: [...ordered, ...advisory],
    evaluatedAt: new Date().toISOString(),
  };
}
