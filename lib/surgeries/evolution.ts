import type { Surgery } from "@/lib/surgeries/types";

export type ClinicalStatus = "incomplete" | "followup" | "closed" | "active_complication";

export type EvolutionEvent = {
  key: string;
  title: string;
  date: string;
  clinicalState: string;
  notes: string;
  nextSteps: string;
  isCompleted: boolean;
  isPending: boolean;
};

export const clinicalStatusLabels: Record<ClinicalStatus, string> = {
  incomplete: "Incompleta",
  followup: "En seguimiento",
  closed: "Cerrada",
  active_complication: "Complicacion activa"
};

export function getClinicalStatus(surgery: Surgery): ClinicalStatus {
  if (hasActiveComplication(surgery)) return "active_complication";
  if (isRegistrationIncomplete(surgery)) return "incomplete";
  if (hasExplicitDischarge(surgery)) return "closed";
  return "followup";
}

export function getClinicalStatusDescription(status: ClinicalStatus) {
  if (status === "incomplete") return "Faltan datos basicos de la cirugia.";
  if (status === "active_complication") return "Hay una complicacion o problema que requiere control.";
  if (status === "closed") return "Seguimiento completado o caso dado de alta.";
  return "Cirugia realizada con revisiones pendientes.";
}

export function getEvolutionEvents(surgery: Surgery, today = new Date()): EvolutionEvent[] {
  const surgeryDate = parseDate(surgery.surgery_date);
  const status = getClinicalStatus(surgery);
  const normalizedToday = startOfDay(today);
  const hasComplication = status === "active_complication";

  const events = [
    {
      key: "initial",
      title: "Cirugia inicial",
      date: surgeryDate,
      clinicalState: status === "incomplete" ? "Registro pendiente de completar" : "Acto quirurgico registrado",
      notes: surgery.surgical_observations || surgery.diagnosis || "Pendiente de ampliar notas clinicas.",
      nextSteps: status === "incomplete" ? "Completar datos basicos del caso." : "Planificar primera revision."
    },
    {
      key: "2w",
      title: "Revision 2 semanas",
      date: addDays(surgeryDate, 14),
      clinicalState: "Control precoz",
      notes: "Revisar herida, dolor, movilidad inicial y tolerancia a la rehabilitacion.",
      nextSteps: "Registrar hallazgos y confirmar evolucion esperada."
    },
    {
      key: "6w",
      title: "Revision 6 semanas",
      date: addDays(surgeryDate, 42),
      clinicalState: "Control funcional",
      notes: "Valorar rango de movilidad, carga, fuerza y adherencia al plan.",
      nextSteps: "Ajustar rehabilitacion y programar control a 3 meses."
    },
    {
      key: "3m",
      title: "Revision 3 meses",
      date: addMonths(surgeryDate, 3),
      clinicalState: "Evolucion intermedia",
      notes: "Comparar funcion con objetivos esperados y documentar incidencias.",
      nextSteps: "Mantener seguimiento o escalar si hay desviaciones."
    },
    {
      key: "6m",
      title: "Revision 6 meses",
      date: addMonths(surgeryDate, 6),
      clinicalState: "Control de cierre",
      notes: "Valorar resultado clinico, limitaciones residuales y satisfaccion.",
      nextSteps: "Decidir alta clinica o seguimiento adicional."
    },
    {
      key: "discharge",
      title: "Alta",
      date: addMonths(surgeryDate, 6),
      clinicalState: status === "closed" ? "Alta registrada" : "Alta pendiente",
      notes: status === "closed" ? "Caso marcado como cerrado o dado de alta en las notas actuales." : "Pendiente de marcar alta real.",
      nextSteps: status === "closed" ? "Conservar caso como referencia." : "Anadir campo de alta o evento real en Supabase."
    }
  ];

  return events.map((event) => {
    const eventDay = startOfDay(event.date);
    const isCompleted =
      status === "closed" || event.key === "initial" || (!hasComplication && eventDay.getTime() < normalizedToday.getTime());

    return {
      ...event,
      date: toIsoDate(event.date),
      isCompleted,
      isPending: !isCompleted
    };
  });
}

export function getNextEvolutionEvent(surgery: Surgery, today = new Date()) {
  return getEvolutionEvents(surgery, today).find((event) => event.isPending);
}

export function needsFollowupAttention(surgery: Surgery, today = new Date()) {
  const status = getClinicalStatus(surgery);
  return status === "followup" || status === "active_complication" || status === "incomplete" || Boolean(getNextEvolutionEvent(surgery, today));
}

function isRegistrationIncomplete(surgery: Surgery) {
  return !surgery.surgery_date || !surgery.procedure || !surgery.diagnosis || !surgery.hospital || !surgery.my_role;
}

function hasActiveComplication(surgery: Surgery) {
  return Boolean(surgery.complications?.trim());
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
