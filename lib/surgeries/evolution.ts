import type { Surgery, SurgeryEvolutionEvent } from "@/lib/surgeries/types";

export type ClinicalStatus = "incomplete" | "followup" | "closed" | "active_complication";

export type EvolutionEvent = {
  key: string;
  id?: string;
  eventType: "initial" | SurgeryEvolutionEvent["event_type"];
  title: string;
  date: string;
  clinicalState: string;
  notes: string;
  nextSteps: string;
  isCompleted: boolean;
  isPending: boolean;
  isPersisted: boolean;
};

export const clinicalStatusLabels: Record<ClinicalStatus, string> = {
  incomplete: "Incompleta",
  followup: "En seguimiento",
  closed: "Cerrada / alta",
  active_complication: "Complicacion activa"
};

export function getClinicalStatus(surgery: Surgery, evolutionEvents: SurgeryEvolutionEvent[] = []): ClinicalStatus {
  if (hasActiveComplication(surgery)) return "active_complication";
  if (isRegistrationIncomplete(surgery)) return "incomplete";
  if (hasDischargeEvent(evolutionEvents) || hasExplicitDischarge(surgery)) return "closed";
  return "followup";
}

export function getClinicalStatusDescription(status: ClinicalStatus) {
  if (status === "incomplete") return "Faltan datos basicos de la cirugia.";
  if (status === "active_complication") return "Hay una complicacion o problema que requiere control.";
  if (status === "closed") return "Seguimiento completado o caso dado de alta.";
  return "Cirugia realizada con revisiones pendientes.";
}

export function getEvolutionEvents(surgery: Surgery, evolutionEvents: SurgeryEvolutionEvent[] = []): EvolutionEvent[] {
  const surgeryDate = parseDate(surgery.surgery_date);
  const status = getClinicalStatus(surgery, evolutionEvents);
  const storedEvents = evolutionEvents
    .map(toTimelineEvent)
    .sort((a, b) => a.date.localeCompare(b.date));

  return [
    {
      key: "initial",
      eventType: "initial",
      title: "Cirugía inicial",
      date: toIsoDate(surgeryDate),
      clinicalState: status === "incomplete" ? "Registro pendiente de completar" : "Acto quirurgico registrado",
      notes: surgery.surgical_observations || surgery.diagnosis || "Pendiente de ampliar notas clinicas.",
      nextSteps: status === "incomplete" ? "Completar datos basicos del caso." : "Configurar primera revisión.",
      isCompleted: true,
      isPending: false,
      isPersisted: false
    },
    ...(storedEvents.length ? storedEvents : [getFallbackFirstReview(surgery)])
  ];
}

export function getNextEvolutionEvent(surgery: Surgery, evolutionEvents: SurgeryEvolutionEvent[] = []) {
  return getEvolutionEvents(surgery, evolutionEvents)
    .filter((event) => event.eventType !== "discharge")
    .find((event) => event.isPending);
}

export function needsFollowupAttention(surgery: Surgery, evolutionEvents: SurgeryEvolutionEvent[] = []) {
  const status = getClinicalStatus(surgery, evolutionEvents);
  return status === "followup" || status === "active_complication" || status === "incomplete" || Boolean(getNextEvolutionEvent(surgery, evolutionEvents));
}

export function getDefaultFirstReview(surgery: Surgery, option: "2w" | "3w" | "1m" = "2w") {
  const surgeryDate = parseDate(surgery.surgery_date);
  const date = option === "2w" ? addDays(surgeryDate, 14) : option === "3w" ? addDays(surgeryDate, 21) : addMonths(surgeryDate, 1);
  const title = option === "2w" ? "Revisión 2 semanas" : option === "3w" ? "Revisión 3 semanas" : "Revisión 1 mes";

  return {
    title,
    scheduled_date: toIsoDate(date),
    clinical_state: "Primera revision",
    notes: "Valorar herida, dolor, movilidad inicial y tolerancia a la rehabilitacion.",
    next_steps: "Registrar hallazgos y decidir siguiente control.",
    status: "pending" as const
  };
}

function toTimelineEvent(event: SurgeryEvolutionEvent): EvolutionEvent {
  return {
    key: event.id,
    id: event.id,
    eventType: event.event_type,
    title: event.title,
    date: event.scheduled_date,
    clinicalState: event.clinical_state || (event.event_type === "discharge" ? "Alta clinica" : "Revision clinica"),
    notes: event.notes || "Sin notas registradas.",
    nextSteps: event.next_steps || (event.status === "completed" ? "Sin proximos pasos registrados." : "Pendiente de definir."),
    isCompleted: event.status === "completed",
    isPending: event.status !== "completed",
    isPersisted: true
  };
}

function getFallbackFirstReview(surgery: Surgery): EvolutionEvent {
  const event = getDefaultFirstReview(surgery);

  return {
    key: "fallback-first-review",
    eventType: "first_review",
    title: "Primera revisión",
    date: event.scheduled_date,
    clinicalState: event.clinical_state,
    notes: event.notes,
    nextSteps: event.next_steps,
    isCompleted: false,
    isPending: true,
    isPersisted: false
  };
}

function isRegistrationIncomplete(surgery: Surgery) {
  return !surgery.surgery_date || !surgery.procedure || !surgery.diagnosis || !surgery.hospital || !surgery.my_role;
}

function hasActiveComplication(surgery: Surgery) {
  return Boolean(surgery.complications?.trim());
}

function hasDischargeEvent(evolutionEvents: SurgeryEvolutionEvent[]) {
  return evolutionEvents.some((event) => event.event_type === "discharge" && event.status === "completed");
}

function hasExplicitDischarge(surgery: Surgery) {
  const searchable = [
    surgery.surgical_observations,
    surgery.lessons_learned,
    surgery.senior_surgeon_pearls
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return [
    "alta clinica",
    "alta medica",
    "dado de alta",
    "caso cerrado",
    "seguimiento completado",
    "cierre clinico"
  ].some((phrase) => searchable.includes(phrase));
}

function parseDate(value: string) {
  return startOfDay(new Date(`${value}T00:00:00`));
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function toIsoDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}
