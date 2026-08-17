"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, CalendarClock, Hospital, Plus, Search, Stethoscope } from "lucide-react";
import { ClinicalStatusBadge } from "@/components/clinical-status-badge";
import { FinancialStatusBadge } from "@/components/surgery-finance-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  groupEvolutionEvents,
  groupProfessionalActivities,
  isSurgeryFilter,
  matchesSurgeryFilter,
  surgeryFilterLabels,
  type SurgeryFilter
} from "@/lib/surgeries/filters";
import { getNextEvolutionEvent, isEvolutionEventOverdue } from "@/lib/surgeries/evolution";
import { getFinancialSnapshot } from "@/lib/surgeries/finance";
import { getProcedureDefinition, groupSurgeryProcedures } from "@/lib/surgeries/procedures";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { ProfessionalActivity, Surgery, SurgeryEvolutionEvent, SurgeryProcedure } from "@/lib/surgeries/types";
import { cn } from "@/lib/utils";

const visibleFilters: SurgeryFilter[] = [
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
];

export function SurgeriesClient({ compact = false }: { compact?: boolean }) {
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [eventsBySurgery, setEventsBySurgery] = useState<Record<string, SurgeryEvolutionEvent[]>>({});
  const [activitiesBySurgery, setActivitiesBySurgery] = useState<Record<string, ProfessionalActivity>>({});
  const [proceduresBySurgery, setProceduresBySurgery] = useState<Record<string, SurgeryProcedure[]>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SurgeryFilter>("all");
  const [procedureKey, setProcedureKey] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (compact) return;

    function syncFilterFromUrl() {
      const requestedFilter = new URLSearchParams(window.location.search).get("filter");
      const requestedProcedure = new URLSearchParams(window.location.search).get("procedure") ?? "";
      setFilter(isSurgeryFilter(requestedFilter) ? requestedFilter : "all");
      setProcedureKey(getProcedureDefinition(requestedProcedure) ? requestedProcedure : "");
    }

    syncFilterFromUrl();
    window.addEventListener("popstate", syncFilterFromUrl);
    return () => window.removeEventListener("popstate", syncFilterFromUrl);
  }, [compact]);

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

      if (loadedSurgeries.length > 0) {
        const surgeryIds = loadedSurgeries.map((surgery) => surgery.id);
        const [eventsResult, activitiesResult, proceduresResult] = await Promise.all([
          supabaseClient.from("surgery_evolution_events").select("*").in("surgery_id", surgeryIds),
          supabaseClient.from("professional_activities").select("*").in("surgery_id", surgeryIds),
          supabaseClient.from("surgery_procedures").select("*").in("surgery_id", surgeryIds)
        ]);

        if (eventsResult.error) setError(eventsResult.error.message);
        else setEventsBySurgery(groupEvolutionEvents((eventsResult.data ?? []) as SurgeryEvolutionEvent[]));

        if (activitiesResult.error) console.error("Usando compatibilidad económica legacy:", activitiesResult.error);
        else setActivitiesBySurgery(groupProfessionalActivities((activitiesResult.data ?? []) as ProfessionalActivity[]));

        if (proceduresResult.error) console.error("Clasificación estructurada no disponible:", proceduresResult.error);
        else setProceduresBySurgery(groupSurgeryProcedures((proceduresResult.data ?? []) as SurgeryProcedure[]));
      }

      setLoading(false);
    }

    load();
  }, []);

  const filtered = useMemo(
    () =>
      surgeries.filter((surgery) => {
        const text = [
          surgery.procedure,
          surgery.diagnosis,
          surgery.hospital,
          surgery.my_role,
          surgery.patient_identifier,
          surgery.implants,
          surgery.complications,
          surgery.attention_reason,
          surgery.lessons_learned,
          surgery.senior_surgeon_pearls
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return (
          text.includes(search.trim().toLowerCase()) &&
          (!procedureKey || (proceduresBySurgery[surgery.id] ?? []).some((procedure) => procedure.procedure_key === procedureKey)) &&
          (compact || matchesSurgeryFilter(surgery, eventsBySurgery[surgery.id] ?? [], filter, activitiesBySurgery[surgery.id]))
        );
      }),
    [activitiesBySurgery, compact, eventsBySurgery, filter, procedureKey, proceduresBySurgery, search, surgeries]
  );

  function selectFilter(nextFilter: SurgeryFilter) {
    setFilter(nextFilter);
    const url = new URL(window.location.href);
    if (nextFilter === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", nextFilter);
    window.history.pushState({}, "", `${url.pathname}${url.search}`);
  }

  function clearFilters() {
    setSearch("");
    setProcedureKey("");
    const url = new URL(window.location.href);
    url.searchParams.delete("procedure");
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    selectFilter("all");
  }

  if (loading) return <Card>Cargando cirugías...</Card>;
  if (error) return <Card className="text-sm text-ember">{error}</Card>;

  const hasActiveFilters = search.trim().length > 0 || filter !== "all" || Boolean(procedureKey);
  const selectedProcedure = getProcedureDefinition(procedureKey);

  return (
    <Card className="p-0">
      {!compact ? (
        <div className="border-b border-line p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-graphite focus-within:border-cobalt">
              <Search className="size-4" />
              <input
                className="w-full bg-transparent outline-none"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar procedimiento, diagnóstico, hospital..."
              />
            </div>
            <Link href="/surgeries/new">
              <Button className="w-full lg:w-auto">
                <Plus className="size-4" />
                Nueva cirugía
              </Button>
            </Link>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Filtros rápidos">
            {visibleFilters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => selectFilter(item)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt",
                  filter === item
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-graphite hover:border-cobalt/40 hover:text-ink"
                )}
                aria-pressed={filter === item}
              >
                {surgeryFilterLabels[item]}
              </button>
            ))}
          </div>
          {selectedProcedure ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs text-cobalt">
              <span className="font-semibold">Procedimiento: {selectedProcedure.label}</span>
              <button type="button" className="ml-auto font-semibold underline underline-offset-2" onClick={() => {
                setProcedureKey("");
                const url = new URL(window.location.href);
                url.searchParams.delete("procedure");
                window.history.pushState({}, "", `${url.pathname}${url.search}`);
              }}>Quitar filtro</button>
            </div>
          ) : null}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="p-6 text-sm text-graphite">
          {surgeries.length === 0 ? (
            <>
              No hay cirugías todavía.
              <Link href="/surgeries/new" className="ml-2 font-semibold text-cobalt">Registra la primera.</Link>
            </>
          ) : (
            <>
              <p>No hay cirugías que coincidan con estos filtros.</p>
              {hasActiveFilters ? (
                <button type="button" onClick={clearFilters} className="mt-2 font-semibold text-cobalt">Ver todas las cirugías</button>
              ) : null}
            </>
          )}
        </div>
      ) : (
        <div className="divide-y divide-line">
          {filtered.slice(0, compact ? 5 : undefined).map((surgery) => {
            const evolutionEvents = eventsBySurgery[surgery.id] ?? [];
            const nextReview = getNextEvolutionEvent(surgery, evolutionEvents);

            return (
              <Link
                key={surgery.id}
                href={`/surgeries/${surgery.id}`}
                className="grid gap-3 p-4 transition hover:bg-white md:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{surgery.procedure}</h3>
                    <ClinicalStatusBadge surgery={surgery} evolutionEvents={evolutionEvents} />
                    {surgery.attention_required ? (
                      <Badge tone="orange" className="gap-1.5">
                        <AlertTriangle className="size-3" />
                        Requiere atención
                      </Badge>
                    ) : null}
                    {surgery.practice_setting === "private" ? <Badge tone="blue">Privada</Badge> : null}
                    {surgery.practice_setting === "public" ? <Badge>Pública</Badge> : null}
                    <PaymentBadge surgery={surgery} activity={activitiesBySurgery[surgery.id]} />
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-graphite">
                    <span>{formatDate(surgery.surgery_date)}</span>
                    {surgery.hospital ? <span className="inline-flex items-center gap-1.5"><Hospital className="size-3.5" />{surgery.hospital}</span> : null}
                    {surgery.my_role ? <span className="inline-flex items-center gap-1.5"><Stethoscope className="size-3.5" />{surgery.my_role}</span> : null}
                  </div>

                  {nextReview ? (
                    <div className={cn("mt-2 inline-flex items-center gap-1.5 text-xs font-semibold", isEvolutionEventOverdue(nextReview) ? "text-ember" : "text-cobalt")}>
                      <CalendarClock className="size-3.5" />
                      {isEvolutionEventOverdue(nextReview) ? "Revisión atrasada" : "Próxima revisión"}: {formatDate(nextReview.scheduled_date)}
                    </div>
                  ) : null}
                  {surgery.attention_required && surgery.attention_reason ? (
                    <p className="mt-2 max-w-2xl truncate text-xs text-ember" title={surgery.attention_reason}>
                      {surgery.attention_reason}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 self-center text-sm font-semibold text-cobalt">
                  Abrir <ArrowRight className="size-4" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function PaymentBadge({ surgery, activity }: { surgery: Surgery; activity?: ProfessionalActivity }) {
  const financial = getFinancialSnapshot(surgery, activity);
  return financial ? <FinancialStatusBadge status={financial.status} /> : null;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(`${value}T00:00:00`)
  );
}
