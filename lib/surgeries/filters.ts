import {
  getClinicalStatus,
  getNextEvolutionEvent,
  hasOverdueReview,
  isRegistrationIncomplete
} from "@/lib/surgeries/evolution";
import type { Surgery, SurgeryEvolutionEvent } from "@/lib/surgeries/types";

export const surgeryFilterValues = [
  "all",
  "pending",
  "overdue",
  "upcoming",
  "followup",
  "closed",
  "incomplete",
  "not-invoiced",
  "unpaid",
  "paid"
] as const;

export type SurgeryFilter = (typeof surgeryFilterValues)[number];

export const surgeryFilterLabels: Record<SurgeryFilter, string> = {
  all: "Todas",
  pending: "Pendientes",
  overdue: "Revisión atrasada",
  upcoming: "Próximas revisiones",
  followup: "En seguimiento",
  closed: "Alta",
  incomplete: "Incompletas",
  "not-invoiced": "Sin facturar",
  unpaid: "Pendientes de cobro",
  paid: "Cobradas"
};

export function isSurgeryFilter(value: string | null): value is SurgeryFilter {
  return surgeryFilterValues.includes(value as SurgeryFilter);
}

export function matchesSurgeryFilter(
  surgery: Surgery,
  events: SurgeryEvolutionEvent[],
  filter: SurgeryFilter
) {
  const clinicalStatus = getClinicalStatus(surgery, events);
  const nextReview = getNextEvolutionEvent(surgery, events);
  const overdue = hasOverdueReview(events);

  if (filter === "all") return true;
  if (filter === "pending") {
    return isRegistrationIncomplete(surgery) || clinicalStatus === "active_complication" || Boolean(nextReview);
  }
  if (filter === "overdue") return overdue;
  if (filter === "upcoming") return Boolean(nextReview) && !overdue;
  if (filter === "followup") return clinicalStatus === "followup";
  if (filter === "closed") return clinicalStatus === "closed";
  if (filter === "incomplete") return isRegistrationIncomplete(surgery);
  if (filter === "not-invoiced") return !surgery.is_invoiced && !surgery.is_paid;
  if (filter === "unpaid") return surgery.is_invoiced && !surgery.is_paid;
  return surgery.is_paid;
}

export function groupEvolutionEvents(events: SurgeryEvolutionEvent[]) {
  return events.reduce<Record<string, SurgeryEvolutionEvent[]>>((grouped, event) => {
    grouped[event.surgery_id] = [...(grouped[event.surgery_id] ?? []), event].sort((a, b) =>
      a.scheduled_date.localeCompare(b.scheduled_date)
    );
    return grouped;
  }, {});
}
