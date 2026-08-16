"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Circle, Pencil, Plus, Stethoscope, Trash2 } from "lucide-react";
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

type SaveAction = "only" | "next_review" | "discharge";

type NextReviewForm = {
  title: string;
  scheduled_date: string;
  notes: string;
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
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [nextReview, setNextReview] = useState<NextReviewForm | null>(null);
  const [pendingDeletion, setPendingDeletion] = useState<SurgeryEvolutionEvent | null>(null);
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
    setNextReview(null);
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
    setNextReview(null);
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
    setNextReview(null);
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
    setNextReview(null);
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

  async function saveEvent(action: SaveAction = "only") {
    if (!editing || saving) return;

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
      status: action === "only" ? editing.status : "completed"
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
    if (action === "next_review") {
      setNextReview({ title: "Próxima revisión", scheduled_date: "", notes: "" });
      setMessage("Evolución guardada. Programa ahora la siguiente revisión.");
      setSaving(false);
      return;
    }
    if (action === "discharge") {
      await completeFollowupWithDischarge(supabase, userData.user.id, nextEvents, saved.id);
      setSaving(false);
      return;
    }
    setMessage("Evolución guardada correctamente.");
    setSaving(false);
  }

  async function createNextReview() {
    if (!nextReview?.scheduled_date || saving) return;
    setSaving(true);
    setMessage("");

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage("Supabase no esta configurado.");
      setSaving(false);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setMessage(userError?.message ?? "No hay usuario autenticado.");
      setSaving(false);
      return;
    }

    const title = nextReview.title.trim() || "Próxima revisión";
    const localDuplicate = events.some(
      (event) =>
        event.event_type === "review" &&
        event.status === "pending" &&
        event.scheduled_date === nextReview.scheduled_date &&
        event.title.trim().toLowerCase() === title.toLowerCase()
    );
    if (localDuplicate) {
      setMessage("Ya existe una revisión pendiente con esa fecha y título.");
      setSaving(false);
      return;
    }

    const { data: existingReviews, error: duplicateLookupError } = await supabase
      .from("surgery_evolution_events")
      .select("id, title")
      .eq("surgery_id", surgery.id)
      .eq("event_type", "review")
      .eq("status", "pending")
      .eq("scheduled_date", nextReview.scheduled_date);
    if (duplicateLookupError) {
      setMessage(duplicateLookupError.message);
      setSaving(false);
      return;
    }
    if ((existingReviews ?? []).some((event) => event.title.trim().toLowerCase() === title.toLowerCase())) {
      setMessage("Ya existe una revisión pendiente con esa fecha y título.");
      setSaving(false);
      return;
    }

    const { data, error } = await supabase
      .from("surgery_evolution_events")
      .insert({
        user_id: userData.user.id,
        surgery_id: surgery.id,
        event_type: "review",
        title,
        scheduled_date: nextReview.scheduled_date,
        clinical_state: "Revisión clínica",
        notes: emptyToNull(nextReview.notes),
        next_steps: null,
        status: "pending"
      })
      .select("*")
      .single();

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    const created = data as SurgeryEvolutionEvent;
    const updatedEvents = [...events, created].sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));
    setEvents(updatedEvents);
    onEventsChange?.(updatedEvents);
    setNextReview(null);
    setMessage("Próxima revisión programada correctamente.");
    setSaving(false);
  }

  async function completeFollowupWithDischarge(
    supabase: NonNullable<ReturnType<typeof createBrowserSupabaseClient>>,
    userId: string,
    currentEvents: SurgeryEvolutionEvent[],
    currentEventId: string
  ) {
    const pendingEvents = currentEvents.filter(
      (event) => event.id !== currentEventId && event.event_type !== "discharge" && event.status === "pending"
    );
    if (
      pendingEvents.length > 0 &&
      !window.confirm(
        `Hay ${pendingEvents.length} revisión(es) pendiente(s). Al dar el alta se cerrarán como canceladas por alta, conservando su historial. ¿Continuar?`
      )
    ) {
      setMessage("La evolución se guardó, pero el alta fue cancelada.");
      return;
    }

    const { data: existingDischarge, error: dischargeLookupError } = await supabase
      .from("surgery_evolution_events")
      .select("*")
      .eq("surgery_id", surgery.id)
      .eq("event_type", "discharge")
      .eq("status", "completed")
      .maybeSingle();
    if (dischargeLookupError) {
      setMessage(dischargeLookupError.message);
      return;
    }

    const closedResults = await Promise.all(
      pendingEvents.map((event) =>
        supabase
          .from("surgery_evolution_events")
          .update({ status: "completed", notes: appendClosureNote(event.notes), next_steps: "Cancelada por alta clínica." })
          .eq("id", event.id)
          .eq("user_id", userId)
          .select("*")
          .single()
      )
    );
    const closureError = closedResults.find((result) => result.error)?.error;
    if (closureError) {
      setMessage(`No se pudieron cerrar las revisiones pendientes: ${closureError.message}`);
      return;
    }

    let dischargeEvent = existingDischarge as SurgeryEvolutionEvent | null;
    if (!dischargeEvent) {
      const { data, error } = await supabase
        .from("surgery_evolution_events")
        .insert({
          user_id: userId,
          surgery_id: surgery.id,
          event_type: "discharge",
          title: "Alta",
          scheduled_date: new Date().toISOString().slice(0, 10),
          clinical_state: "Alta clínica",
          notes: "Caso dado de alta.",
          next_steps: "Seguimiento completado.",
          status: "completed"
        })
        .select("*")
        .single();
      if (error) {
        setMessage(error.message);
        return;
      }
      dischargeEvent = data as SurgeryEvolutionEvent;
    }

    const closedById = new Map(
      closedResults.filter((result) => result.data).map((result) => [
        (result.data as SurgeryEvolutionEvent).id,
        result.data as SurgeryEvolutionEvent
      ])
    );
    const updatedEvents = currentEvents.map((event) => closedById.get(event.id) ?? event);
    if (dischargeEvent && !updatedEvents.some((event) => event.id === dischargeEvent?.id)) updatedEvents.push(dischargeEvent);
    updatedEvents.sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));
    setEvents(updatedEvents);
    onEventsChange?.(updatedEvents);
    setMessage(existingDischarge ? "El caso ya estaba dado de alta." : "Evolución guardada y caso dado de alta.");
  }

  async function deletePendingReview() {
    if (!pendingDeletion || deleting || pendingDeletion.status !== "pending" || pendingDeletion.event_type === "discharge") return;

    setDeleting(true);
    setMessage("");

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage("Supabase no esta configurado.");
      setDeleting(false);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setMessage(userError?.message ?? "No hay usuario autenticado.");
      setDeleting(false);
      return;
    }

    const { data, error } = await supabase
      .from("surgery_evolution_events")
      .delete()
      .eq("id", pendingDeletion.id)
      .eq("surgery_id", surgery.id)
      .eq("user_id", userData.user.id)
      .eq("event_type", pendingDeletion.event_type)
      .eq("status", "pending")
      .select("id");

    if (error) {
      setMessage(error.message);
      setDeleting(false);
      return;
    }
    if (!data?.length) {
      setMessage("La revisión ya no existe o no se puede eliminar.");
      setPendingDeletion(null);
      setDeleting(false);
      return;
    }

    const updatedEvents = events.filter((event) => event.id !== pendingDeletion.id);
    setEvents(updatedEvents);
    onEventsChange?.(updatedEvents);
    if (editing?.id === pendingDeletion.id) setEditing(null);
    setPendingDeletion(null);
    setMessage("Revisión pendiente eliminada. El seguimiento del caso continúa abierto.");
    setDeleting(false);
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

      {pendingDeletion ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50/60 p-4" role="alertdialog" aria-labelledby="delete-review-title" aria-describedby="delete-review-description">
          <div className="flex items-start gap-3">
            <Trash2 className="mt-0.5 size-5 shrink-0 text-ember" />
            <div>
              <h3 id="delete-review-title" className="font-semibold text-ink">¿Eliminar esta revisión programada?</h3>
              <p id="delete-review-description" className="mt-1 text-sm leading-6 text-graphite">
                Se eliminará únicamente esta revisión pendiente. La cirugía y las evoluciones anteriores se conservarán.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" className="rounded-md border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink" onClick={() => setPendingDeletion(null)} disabled={deleting}>
              Cancelar
            </button>
            <button type="button" className="rounded-md bg-red-700 px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-60" onClick={deletePendingReview} disabled={deleting}>
              {deleting ? "Eliminando..." : "Eliminar revisión"}
            </button>
          </div>
        </div>
      ) : null}

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
          <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4 sm:items-end">
            {editing.event_type !== "discharge" && editing.id ? (
              <>
                <button type="button" className="inline-flex w-full items-center justify-center rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white sm:w-auto" onClick={() => saveEvent("next_review")} disabled={saving}>
                  {saving ? "Guardando..." : "Guardar y programar próxima revisión"}
                </button>
                <button type="button" className="inline-flex w-full items-center justify-center rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink sm:w-auto" onClick={() => saveEvent("discharge")} disabled={saving || hasDischarge}>
                  Guardar y dar alta
                </button>
              </>
            ) : null}
            <div className="flex w-full items-center justify-end gap-3">
            <button type="button" className="rounded-md border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink" onClick={() => setEditing(null)} disabled={saving}>
              Cancelar
            </button>
            <button type="button" className="px-2 py-2 text-sm font-semibold text-cobalt" onClick={() => saveEvent("only")} disabled={saving}>
              {saving ? "Guardando..." : "Guardar solamente"}
            </button>
            </div>
          </div>
        </div>
      ) : null}

      {nextReview ? (
        <div className="mb-6 rounded-lg border border-cobalt/20 bg-blue-50/40 p-4">
          <h3 className="font-semibold text-ink">Programar próxima revisión</h3>
          <p className="mt-1 text-sm text-graphite">Elige libremente la fecha del siguiente control.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Fecha">
              <input className={inputClass} type="date" value={nextReview.scheduled_date} onChange={(event) => setNextReview({ ...nextReview, scheduled_date: event.target.value })} required />
            </Field>
            <Field label="Título opcional">
              <input className={inputClass} value={nextReview.title} onChange={(event) => setNextReview({ ...nextReview, title: event.target.value })} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Objetivo / notas breves">
                <textarea className={textareaClass} value={nextReview.notes} onChange={(event) => setNextReview({ ...nextReview, notes: event.target.value })} />
              </Field>
            </div>
          </div>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" className="rounded-md border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink" onClick={() => setNextReview(null)} disabled={saving}>Ahora no</button>
            <button type="button" className="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60" onClick={createNextReview} disabled={saving || !nextReview.scheduled_date}>
              {saving ? "Programando..." : "Programar revisión"}
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
                      {event.isPersisted && event.isPending && event.eventType !== "discharge" && event.date >= todayIsoDate() ? (
                        <button
                          type="button"
                          className="text-xs font-medium text-graphite underline decoration-line underline-offset-4 transition hover:text-ember"
                          onClick={() => {
                            const storedEvent = events.find((item) => item.id === event.id);
                            if (storedEvent) setPendingDeletion(storedEvent);
                          }}
                          disabled={deleting}
                        >
                          Eliminar revisión
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

function appendClosureNote(notes: string | null) {
  const closure = "Revisión cancelada al dar el alta clínica.";
  return notes?.trim() ? `${notes.trim()}\n\n${closure}` : closure;
}

function todayIsoDate() {
  const today = new Date();
  return [today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"), String(today.getDate()).padStart(2, "0")].join("-");
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
