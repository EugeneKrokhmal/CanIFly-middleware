import type { UasRestriction } from "../../ed318-types.js";
import { pickString } from "../utils.js";

function pickDescription(desc: unknown): string | undefined {
  if (!desc) return undefined;
  if (typeof desc === "string") return pickString(desc);
  if (typeof desc === "object" && desc) {
    const d = desc as { en?: string; pl?: string };
    return pickString(d.en) ?? pickString(d.pl);
  }
  return undefined;
}

/** Map PANSA zone type / name / text → ED-318-like restriction. */
export function mapPansaRestriction(attrs: Record<string, unknown>): UasRestriction {
  const t = String(attrs.type ?? "").toUpperCase();
  const n = String(attrs.name ?? "").toUpperCase().replace(/\s+/g, " ");
  const msg = (pickDescription(attrs.description) ?? "").toUpperCase();
  const restrictionRaw = pickString(attrs.restriction);

  if (restrictionRaw) {
    const r = restrictionRaw.toUpperCase();
    if (r.includes("PROHIB")) return "PROHIBITED";
    if (r.includes("AUTHORI") || r.includes("AUTH")) return "REQ_AUTHORISATION";
    if (r.includes("COND")) return "CONDITIONAL";
  }

  if (t === "DRAP" || n.startsWith("DRA-P") || n.startsWith("DRAP")) {
    return "PROHIBITED";
  }
  if (t === "DRAR" || n.startsWith("DRA-R") || n.startsWith("DRAR")) {
    return "REQ_AUTHORISATION";
  }
  if (t === "DRAI" || n.startsWith("DRA-I") || n.startsWith("DRAI")) {
    return "CONDITIONAL";
  }
  if (["P", "EPP"].includes(t) || msg.includes("PROHIBITED")) {
    return "PROHIBITED";
  }
  if (
    [
      "CTR",
      "CTR1KM",
      "CTR6KM",
      "MCTR",
      "MCTR2KM",
      "ATZ",
      "ATZ1KM",
      "ATZ6KM",
      "R",
      "EPR",
      "TRA",
      "TSA",
      "D",
      "EPD",
      "RMZ",
      "ADIZ",
      "TMA",
      "MTMA",
    ].includes(t)
  ) {
    return "REQ_AUTHORISATION";
  }
  return "CONDITIONAL";
}

export function pansaReasonsFromAttrs(attrs: Record<string, unknown>): string[] {
  const t = String(attrs.type ?? "").toUpperCase();
  if (t.startsWith("DRA")) return ["UAS_GEOGRAPHIC_ZONE"];
  if (
    [
      "CTR",
      "CTR1KM",
      "CTR6KM",
      "MCTR",
      "MCTR2KM",
      "ATZ",
      "ATZ1KM",
      "ATZ6KM",
      "TMA",
      "MTMA",
    ].includes(t)
  ) {
    return ["AIR_TRAFFIC"];
  }
  if (["TSA", "TRA", "D", "R", "P", "MRT"].includes(t)) return ["OTHER"];
  return ["OTHER"];
}

function formatPansaActivity(acts: unknown): string | undefined {
  if (!acts || typeof acts !== "object") return undefined;
  const a = acts as Record<string, unknown>;
  if (a.H24 === true || a.h24 === true) return "Zone active H24";
  if (typeof a.text === "string" && a.text.trim()) return a.text.trim();
  return undefined;
}

export function pickPansaDescription(attrs: Record<string, unknown>): string | undefined {
  return pickDescription(attrs.description);
}

export function formatPansaActivityFromAttrs(
  attrs: Record<string, unknown>,
): string | undefined {
  return formatPansaActivity(attrs.acts);
}
