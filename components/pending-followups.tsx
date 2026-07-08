"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarClock } from "lucide-react";
import { ClinicalStatusBadge } from "@/components/clinical-status-badge";
import { Card, SectionTitle } from "@/components/ui/card";
import { getClinicalStatus, getNextEvolutionEvent, needsFollowupAttention } from "@/lib/surgeries/evolution";
import type { Surgery } from "@/lib/surgeries/types";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function PendingFollowups() {
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from("surgeries")
      .select("*")
      .order("surgery_date", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message);
        setSurgeries((data ?? []) as Surgery[]);
        setLoading(false);
      });
  }, []);

  const pending = useMemo(
    () => surgeries.filter((surgery) => needsFollowupAttention(surgery)).slice(0, 4),
    [surgeries]
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
          const nextEvent = getNextEvolutionEvent(surgery);
          const status = getClinicalStatus(surgery);

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
