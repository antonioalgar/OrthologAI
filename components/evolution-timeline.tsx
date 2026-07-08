"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Circle, Pencil, Plus, Stethoscope } from "lucide-react";
import { getDefaultFirstReview, getEvolutionEvents } from "@/lib/surgeries/evolution";
import type { Surgery, SurgeryEvolutionEvent } from "@/lib/surgeries/types";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type EventForm = {
  id?: string;
  event_type: SurgeryEvolutionEvent["event_type"];
  title: string;
  scheduled_date: string;
  clinical_state: string;
  notes: string;
  next_steps: string;
  status: SurgeryEvolutionEvent["status"];
};

export function EvolutionTimeline({
  surgery,
  onEventsChange
}: {
  surgery: Surgery;
  onEventsChange?: (events: SurgeryEvolutionEvent[]) => void;
}) {
  const [events, setEvents] = useState<SurgeryEvolutionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EventForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const timelineEvents = useMemo(() => getEvolutionEvents(surgery, events), [surgery, events]);
  const firstReview = events.find((event) => event.event_type === "first_review");
  const hasDischarge = events.some((event) => event.event_type === "discharge" && event.status === "completed");

  useEffect(() => {
    let ignore = false;

    async function loadEvents() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("surgery_evolution_events")
        .select("*")
        .eq("surgery_id", surgery.id)
        .order("scheduled_date", { ascending: true });

      if (ignore) return;

      if (error) {
        console.error("Error cargando evolucion de Supabase:", error);
        setMessage(error.message);
        setEvents([]);
        onEventsChange?.([]);
      } else {
        const loadedEvents = (data ?? []) as SurgeryEvolutionEvent[];
        setEvents(loadedEvents);
        onEventsChange?.(loadedEvents);
      }

      setLoading(false);
    }

    loadEvents();
    return () => {
      ignore = true;
    };
  }, [onEventsChange, surgery.id]);

  function configureFirstReview(option: "2w" | "3w" | "1m" | "custom" = "2w") {
    const defaultReview = getDefaultFirstReview(surgery, option === "custom" ? "2w" : option);
    setMessage("");
    setEditing({
      id: firstReview?.id,
      event_type: "first_review",
      title: firstReview?.title ?? (option === "custom" ? "Primera revisión" : defaultReview.title),
      scheduled_date: firstReview?.scheduled_date ?? defaultReview.scheduled_date,
      clinical_state: firstReview?.clinical_state ?? defaultReview.clinical_state,
      notes: firstReview?.notes ?? defaultReview.notes,
      next_steps: firstReview?.next_steps ?? defaultReview.next_steps,
      status: firstReview?.status ?? "pending"
    });
  }

  function addReview() {
    setMessage("");
    setEditing({
      event_type: "review",
      title: "Nueva revisión",
      scheduled_date: new Date().toISOString().slice(0, 10),
      clinical_state: "Revisión clínica",
      notes: "",
      next_steps: "",
      status: "pending"
    });
  }

  function discharge() {
    setMessage("");
    setEditing({
      event_type: "discharge",
      title: "Alta",
      scheduled_date: new Date().toISOString().slice(0, 10),
      clinical_state: "Alta clinica",
      notes: "Caso dado de alta.",
      next_steps: "Seguimiento completado.",
      status: "completed"
    });
  }

  function editEvent(eventId?: string) {
    const event = events.find((item) => item.id === eventId);
    if (!event) return;

    setMessage("");
    setEditing({
      id: event.id,
      event_type: event.event_type,
      title: event.title,
      scheduled_date: event.scheduled_date,
      clinical_state: event.clinical_state ?? "",
      notes: event.notes ?? "",
      next_steps: event.next_steps ?? "",
      status: event.status
    });
  }

  async function saveEvent() {
    if (!editing) return;

    setSaving(true);
    setMessage("");

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      const errorMessage = "Supabase no esta configurado.";
      console.error(errorMessage);
      setMessage(errorMessage);
      setSaving(false);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      const errorMessage = userError?.message ?? "No hay usuario autenticado.";
      console.error("Error guardando evolucion:", userError ?? errorMessage);
      setMessage(errorMessage);
      setSaving(false);
      return;
    }

    const payload = {
      user_id: userData.user.id,
      surgery_id: surgery.id,
      event_type: editing.event_type,
      title: editing.title.trim() || "Revisión",
      scheduled_date: editing.scheduled_date,
      clinical_state: emptyToNull(editing.clinical_state),
      notes: emptyToNull(editing.notes),
      next_steps: emptyToNull(editing.next_steps),
      status: editing.status
    };

    const result = editing.id
      ? await supabase
          .from("surgery_evolution_events")
          .update(payload)
          .eq("id", editing.id)
          .select("*")
          .single()
      : await supabase
          .from("surgery_evolution_events")
          .insert(payload)
          .select("*")
          .single();

    if (result.error) {
      console.error("Error guardando evolucion en Supabase:", result.error);
      setMessage(result.error.message);
      setSaving(false);
      return;
    }

    const saved = result.data as SurgeryEvolutionEvent;
    const nextEvents = editing.id
      ? events.map((event) => (event.id === saved.id ? saved : event))
      : [...events, saved].sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));

    setEvents(nextEvents);
    onEventsChange?.(nextEvents);
    setEditing(null);
    setSaving(false);
  }

  return (
    <div className="rounded-lg border border-line bg-white px-5 py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={actionClass} onClick={() => configureFirstReview()}>
            <Pencil className="size-4" />
            Configurar primera revisión
          </button>
          <button type="button" className={actionClass} onClick={addReview}>
            <Plus className="size-4" />
            + Añadir revisión
          </button>
          {!hasDischarge ? (
            <button type="button" className={actionClass} onClick={discharge}>
              <Stethoscope className="size-4" />
              Dar alta
            </button>
          ) : null}
        </div>
        {loading ? <p className="text-xs text-graphite">Cargando evolucion...</p> : null}
      </div>

      {message ? <p className="mb-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-ember">{message}</p> : null}

      {editing ? (
        <div className="mb-6 rounded-lg border border-line bg-mist/45 p-4">
          {editing.event_type === "first_review" ? (
            <div className="mb-4 flex flex-wrap gap-2">
              <button type="button" className={chipClass} onClick={() => configureFirstReview("2w")}>2 semanas</button>
              <button type="button" className={chipClass} onClick={() => configureFirstReview("3w")}>3 semanas</button>
              <button type="button" className={chipClass} onClick={() => configureFirstReview("1m")}>1 mes</button>
              <button type="button" className={chipClass} onClick={() => configureFirstReview("custom")}>Fecha personalizada</button>
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Título">
              <input className={inputClass} value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} />
            </Field>
            <Field label="Fecha">
              <input className={inputClass} type="date" value={editing.scheduled_date} onChange={(event) => setEditing({ ...editing, scheduled_date: event.target.value })} />
            </Field>
            <Field label="Estado clinico">
              <input className={inputClass} value={editing.clinical_state} onChange={(event) => setEditing({ ...editing, clinical_state: event.target.value })} />
            </Field>
            <Field label="Estado">
              <select className={inputClass} value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as SurgeryEvolutionEvent["status"] })}>
                <option value="pending">Pendiente</option>
                <option value="completed">Completada</option>
              </select>
            </Field>
            <Field label="Notas">
              <textarea className={textareaClass} value={editing.notes} onChange={(event) => setEditing({ ...editing, notes: event.target.value })} />
            </Field>
            <Field label="Próximos pasos">
              <textarea className={textareaClass} value={editing.next_steps} onChange={(event) => setEditing({ ...editing, next_steps: event.target.value })} />
            </Field>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" className="rounded-md border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink" onClick={() => setEditing(null)} disabled={saving}>
              Cancelar
            </button>
            <button type="button" className="rounded-md bg-ink px-3.5 py-2 text-sm font-medium text-white" onClick={saveEvent} disabled={saving}>
              {saving ? "Guardando..." : "Guardar evolución"}
            </button>
          </div>
        </div>
      ) : null}

      <div className="space-y-0">
        {timelineEvents.map((event, index) => {
          const Icon = event.isCompleted ? CheckCircle2 : Circle;

          return (
            <div key={event.key} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-4">
              <div className="relative flex justify-center">
                <span
                  className={cn(
                    "mt-1 grid size-5 place-items-center rounded-full bg-white",
                    event.isCompleted ? "text-moss" : "text-ember"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                {index < timelineEvents.length - 1 ? <span className="absolute bottom-0 top-7 w-px bg-line" /> : null}
              </div>

              <article className={cn("pb-8", index === timelineEvents.length - 1 && "pb-0")}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink">{event.title}</h3>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
                          event.isCompleted ? "bg-green-50 text-moss" : "bg-orange-50 text-ember"
                        )}
                      >
                        {event.isCompleted ? "Completado" : "Pendiente"}
                      </span>
                      {event.isPersisted ? (
                        <button type="button" className="text-xs font-semibold text-cobalt" onClick={() => editEvent(event.id)}>
                          Editar
                        </button>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-graphite">{event.clinicalState}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-sm text-graphite">
                    <CalendarClock className="size-4" />
                    {formatDate(event.date)}
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-sm leading-6">
                  <p className="text-ink">{event.notes}</p>
                  <p className="text-graphite">
                    <span className="font-medium text-ink">Próximos pasos: </span>
                    {event.nextSteps}
                  </p>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}

function emptyToNull(value: string) {
  return value.trim() ? value.trim() : null;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

const actionClass = "inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-cobalt hover:text-cobalt";
const chipClass = "rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-graphite hover:border-cobalt hover:text-ink";
const inputClass = "w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cobalt";
const textareaClass = "min-h-24 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cobalt";
