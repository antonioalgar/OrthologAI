"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarClock } from "lucide-react";
import { ClinicalStatusBadge } from "@/components/clinical-status-badge";
import { Card, SectionTitle } from "@/components/ui/card";
import { getClinicalStatus, getNextEvolutionEvent, needsFollowupAttention } from "@/lib/surgeries/evolution";
import type { Surgery, SurgeryEvolutionEvent } from "@/lib/surgeries/types";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function PendingFollowups() {
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [eventsBySurgery, setEventsBySurgery] = useState<Record<string, SurgeryEvolutionEvent[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const supabaseClient = supabase;

    async function load() {
      const { data: surgeryRows, error: surgeryError } = await supabaseClient
        .from("surgeries")
        .select("*")
        .order("surgery_date", { ascending: false });

      if (surgeryError) {
        setError(surgeryError.message);
        setLoading(false);
        return;
      }

      const loadedSurgeries = (surgeryRows ?? []) as Surgery[];
      setSurgeries(loadedSurgeries);

      if (loadedSurgeries.length === 0) {
        setEventsBySurgery({});
        setLoading(false);
        return;
      }

      const { data: eventRows, error: eventError } = await supabaseClient
        .from("surgery_evolution_events")
        .select("*")
        .in("surgery_id", loadedSurgeries.map((surgery) => surgery.id));

      if (eventError) {
        console.error("Error cargando seguimientos reales:", eventError);
        setEventsBySurgery({});
      } else {
        setEventsBySurgery(groupEvents((eventRows ?? []) as SurgeryEvolutionEvent[]));
      }

      setLoading(false);
    }

    load();
  }, []);

  const pending = useMemo(
    () =>
      surgeries
        .filter((surgery) => needsFollowupAttention(surgery, eventsBySurgery[surgery.id] ?? []))
        .slice(0, 4),
    [eventsBySurgery, surgeries]
  );

  return (
    <Card>
      <SectionTitle eyebrow="Evolucion" title="Seguimientos pendientes" />

      {loading ? <p className="text-sm text-graphite">Cargando seguimientos...</p> : null}
      {error ? <p className="text-sm text-ember">{error}</p> : null}

      {!loading && !error && pending.length === 0 ? (
        <p className="text-sm leading-6 text-graphite">No hay revisiones pendientes ni complicaciones activas.</p>
      ) : null}

      <div className="space-y-3">
        {pending.map((surgery) => {
          const events = eventsBySurgery[surgery.id] ?? [];
          const nextEvent = getNextEvolutionEvent(surgery, events);
          const status = getClinicalStatus(surgery, events);

          return (
            <Link
              key={surgery.id}
              href={`/surgeries/${surgery.id}`}
              className="block rounded-lg border border-line bg-white p-3 transition hover:border-cobalt/30 hover:bg-mist/55"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{surgery.procedure}</p>
                  <p className="mt-1 text-xs text-graphite">
                    {formatShortDate(surgery.surgery_date)}
                    {nextEvent ? ` - proxima revision ${formatMonth(nextEvent.date)}` : " - evolucion incompleta"}
                  </p>
                </div>
                <ArrowRight className="mt-1 size-4 shrink-0 text-cobalt" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ClinicalStatusBadge status={status} />
                {nextEvent ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-graphite">
                    <CalendarClock className="size-3.5" />
                    {nextEvent.title}
                  </span>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

function groupEvents(events: SurgeryEvolutionEvent[]) {
  return events.reduce<Record<string, SurgeryEvolutionEvent[]>>((acc, event) => {
    acc[event.surgery_id] = [...(acc[event.surgery_id] ?? []), event].sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));
    return acc;
  }, {});
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function formatMonth(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    month: "long"
  }).format(new Date(`${value}T00:00:00`));
}
