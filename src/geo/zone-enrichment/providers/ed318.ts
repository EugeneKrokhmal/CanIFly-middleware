import type {
  Applicability,
  ScheduleEntry,
  UasZoneFeature,
  ZoneApplicability,
  ZoneContact,
  ZoneEnrichment,
  ZoneTimeWindow,
} from "../../ed318-types.js";
import { hasApplicabilityData, pickString, stripHtml } from "../utils.js";

function scheduleEntryToWindow(entry: ScheduleEntry): ZoneTimeWindow {
  return {
    days: entry.day?.length ? [...entry.day] : undefined,
    startTime: pickString(entry.startTime),
    endTime: pickString(entry.endTime),
  };
}

function applicabilityToCommon(app: Applicability): ZoneApplicability {
  const permanent =
    app.permanent != null &&
    ["true", "yes", "1", "permanent"].includes(String(app.permanent).toLowerCase());

  const schedule = app.schedule?.map(scheduleEntryToWindow).filter(
    (w) => w.days?.length || w.startTime || w.endTime,
  );

  const result: ZoneApplicability = {
    permanent: permanent || undefined,
    validFrom: pickString(app.startDateTime),
    validTo: pickString(app.endDateTime),
    schedule: schedule?.length ? schedule : undefined,
  };

  return result;
}

/** Map ED-318 zoneAuthority / applicability into the common enrichment shape. */
export function enrichEd318Feature(feature: UasZoneFeature): ZoneEnrichment | undefined {
  const contacts: ZoneContact[] = (feature.zoneAuthority ?? [])
    .map((za) => ({
      role: pickString(za.purpose) ?? pickString(za.service),
      name: pickString(za.name),
      email: pickString(za.email),
      phone: pickString(za.phone),
    }))
    .filter((c) => c.email || c.phone || c.name);

  const appBlocks = (feature.applicability ?? [])
    .map(applicabilityToCommon)
    .filter(hasApplicabilityData);

  const messageHtml = pickString(feature.message);
  const otherReason = pickString(feature.otherReasonInfo);

  if (
    contacts.length === 0 &&
    appBlocks.length === 0 &&
    !messageHtml &&
    !otherReason
  ) {
    return undefined;
  }

  const applicability =
    appBlocks.length === 1
      ? appBlocks[0]
      : appBlocks.length > 1
        ? {
            schedule: appBlocks.flatMap((a) => a.schedule ?? []),
            validFrom: appBlocks.find((a) => a.validFrom)?.validFrom,
            validTo: appBlocks.find((a) => a.validTo)?.validTo,
            permanent: appBlocks.some((a) => a.permanent),
          }
        : undefined;

  const altitudeNotes = otherReason ? [otherReason] : undefined;

  return {
    contacts,
    applicability: applicability && hasApplicabilityData(applicability)
      ? applicability
      : undefined,
    guidanceHtml: messageHtml,
    guidance: messageHtml ? stripHtml(messageHtml) : undefined,
    publisher: feature.type ? { variant: feature.type } : undefined,
    altitudeNotes,
  };
}
