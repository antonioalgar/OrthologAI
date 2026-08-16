import {
  getClinicalStatus,
  getNextEvolutionEvent,
  hasOverdueReview,
  isRegistrationIncomplete
} from "@/lib/surgeries/evolution";
import type { Surgery, SurgeryEvolutionEvent } from "@/lib/surgeries/types";
import type { ProfessionalActivity } from "@/lib/surgeries/types";
import { getFinancialSnapshot } from "@/lib/surgeries/finance";

export const surgeryFilterValues = [
  "all",
  "pending",
  "overdue",
  "attention",
  "upcoming",
  "followup",
  "closed",
  "incomplete",
  "not-invoiced",
  "unpaid",
  "paid",
  "issue",
  "private",
  "public"
] as const;

export type SurgeryFilter = (typeof surgeryFilterValues)[number];

export const surgeryFilterLabels: Record<SurgeryFilter, string> = {
  all: "Todas",
  pending: "Pendientes",
  overdue: "Revisión atrasada",
  attention: "Requieren atención",
  upcoming: "Próximas revisiones",
  followup: "En seguimiento",
  closed: "Alta",
  incomplete: "Incompletas",
  "not-invoiced": "Sin facturar",
  unpaid: "Pendientes de cobro",
  paid: "Cobradas",
  issue: "Incidencia",
  private: "Privadas",
  public: "Públicas"
};

export function isSurgeryFilter(value: string | null): value is SurgeryFilter {
  return surgeryFilterValues.includes(value as SurgeryFilter);
}

export function matchesSurgeryFilter(
  surgery: Surgery,
  events: SurgeryEvolutionEvent[],
  filter: SurgeryFilter,
  activity?: ProfessionalActivity | null
) {
  const clinicalStatus = getClinicalStatus(surgery, events);
  const nextReview = getNextEvolutionEvent(surgery, events);
  const overdue = hasOverdueReview(events);

  if (filter === "all") return true;
  if (filter === "pending") {
    return isRegistrationIncomplete(surgery) || clinicalStatus === "active_complication" || Boolean(nextReview);
  }
  if (filter === "overdue") return overdue;
  if (filter === "attention") return surgery.attention_required === true;
  if (filter === "upcoming") return Boolean(nextReview) && !overdue;
  if (filter === "followup") return clinicalStatus === "followup";
  if (filter === "closed") return clinicalStatus === "closed";
  if (filter === "incomplete") return isRegistrationIncomplete(surgery);
  if (filter === "private") return surgery.practice_setting === "private";
  if (filter === "public") return surgery.practice_setting === "public";

  const financial = getFinancialSnapshot(surgery, activity);
  if (filter === "not-invoiced") return financial?.status === "not_invoiced";
  if (filter === "unpaid") return financial?.status === "invoiced";
  if (filter === "paid") return financial?.status === "paid";
  return financial?.status === "issue";
}

export function groupEvolutionEvents(events: SurgeryEvolutionEvent[]) {
  return events.reduce<Record<string, SurgeryEvolutionEvent[]>>((grouped, event) => {
    grouped[event.surgery_id] = [...(grouped[event.surgery_id] ?? []), event].sort((a, b) =>
      a.scheduled_date.localeCompare(b.scheduled_date)
    );
    return grouped;
  }, {});
}

export function groupProfessionalActivities(activities: ProfessionalActivity[]) {
  return activities.reduce<Record<string, ProfessionalActivity>>((grouped, activity) => {
    if (activity.surgery_id) grouped[activity.surgery_id] = activity;
    return grouped;
  }, {});
}
