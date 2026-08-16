"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, CheckCircle2, CircleDashed, Clock3, CreditCard, FileWarning, Hourglass } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { groupEvolutionEvents, groupProfessionalActivities, matchesSurgeryFilter, type SurgeryFilter } from "@/lib/surgeries/filters";
import { getFinancialSnapshot } from "@/lib/surgeries/finance";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { ProfessionalActivity, Surgery, SurgeryEvolutionEvent } from "@/lib/surgeries/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

const attentionCards: DashboardCard[] = [
  { filter: "overdue", label: "Revisiones atrasadas", description: "Controles pendientes cuya fecha ya ha pasado", icon: Clock3, emphasis: "urgent" },
  { filter: "attention", label: "Requieren atención", description: "Casos marcados para vigilancia o revisión especial", icon: AlertTriangle, emphasis: "urgent" },
  { filter: "upcoming", label: "Próximas revisiones", description: "Siguientes controles pendientes programados", icon: CalendarClock },
  { filter: "incomplete", label: "Casos incompletos", description: "Registros con datos básicos por completar", icon: FileWarning },
  { filter: "followup", label: "En seguimiento", description: "Casos clínicos todavía abiertos", icon: Hourglass }
];

const paymentCards: DashboardCard[] = [
  { filter: "not-invoiced", label: "Sin facturar", description: "Procedimientos aún no facturados", icon: CircleDashed },
  { filter: "unpaid", label: "Pendientes de cobro", description: "Facturados y todavía no cobrados", icon: CreditCard },
  { filter: "paid", label: "Cobradas", description: "Procedimientos marcados como cobrados", icon: CheckCircle2 },
  { filter: "issue", label: "Incidencias", description: "Facturación o cobro que necesita revisión", icon: AlertTriangle, emphasis: "urgent" }
];

type DashboardCard = {
  filter: SurgeryFilter;
  label: string;
  description: string;
  icon: typeof CalendarClock;
  emphasis?: "urgent";
};

export function ActionDashboard() {
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [eventsBySurgery, setEventsBySurgery] = useState<Record<string, SurgeryEvolutionEvent[]>>({});
  const [activitiesBySurgery, setActivitiesBySurgery] = useState<Record<string, ProfessionalActivity>>({});
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
      const { data: surgeryRows, error: surgeryError } = await supabaseClient.from("surgeries").select("*");
      if (surgeryError) {
        setError(surgeryError.message);
        setLoading(false);
        return;
      }

      const loadedSurgeries = (surgeryRows ?? []) as Surgery[];
      setSurgeries(loadedSurgeries);

      if (loadedSurgeries.length > 0) {
        const surgeryIds = loadedSurgeries.map((surgery) => surgery.id);
        const [eventsResult, activitiesResult] = await Promise.all([
          supabaseClient.from("surgery_evolution_events").select("*").in("surgery_id", surgeryIds),
          supabaseClient.from("professional_activities").select("*").in("surgery_id", surgeryIds)
        ]);

        if (eventsResult.error) setError(eventsResult.error.message);
        else setEventsBySurgery(groupEvolutionEvents((eventsResult.data ?? []) as SurgeryEvolutionEvent[]));

        if (activitiesResult.error) console.error("Usando compatibilidad económica legacy:", activitiesResult.error);
        else setActivitiesBySurgery(groupProfessionalActivities((activitiesResult.data ?? []) as ProfessionalActivity[]));
      }

      setLoading(false);
    }

    load();
  }, []);

  const counts = useMemo(
    () =>
      [...attentionCards, ...paymentCards].reduce<Partial<Record<SurgeryFilter, number>>>((result, card) => {
        result[card.filter] = surgeries.filter((surgery) =>
          matchesSurgeryFilter(surgery, eventsBySurgery[surgery.id] ?? [], card.filter, activitiesBySurgery[surgery.id])
        ).length;
        return result;
      }, {}),
    [activitiesBySurgery, eventsBySurgery, surgeries]
  );

  const totals = useMemo(() => {
    const financial = surgeries
      .map((surgery) => getFinancialSnapshot(surgery, activitiesBySurgery[surgery.id]))
      .filter((snapshot) => snapshot != null);

    return {
      expected: sumKnown(financial.map((item) => item.expectedAmount)),
      invoiced: sumKnown(financial.map((item) => item.invoicedAmount)),
      received: sumKnown(financial.map((item) => item.receivedAmount)),
      pending: sumKnown(financial
        .filter((item) => item.status === "invoiced" && item.invoicedAmount != null)
        .map((item) => Math.max(item.invoicedAmount! - (item.receivedAmount ?? 0), 0)))
    };
  }, [activitiesBySurgery, surgeries]);

  if (loading) return <Card>Cargando prioridades...</Card>;
  if (error) return <Card className="text-sm text-ember">{error}</Card>;

  return (
    <div className="space-y-6">
      <section>
        <SectionTitle eyebrow="Prioridad" title="Necesitan atención" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {attentionCards.map((card) => <ActionCard key={card.filter} card={card} count={counts[card.filter] ?? 0} />)}
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Actividad privada" title="Facturación y cobros" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {paymentCards.map((card) => <ActionCard key={card.filter} card={card} count={counts[card.filter] ?? 0} />)}
        </div>
        {Object.values(totals).some((value) => value != null) ? <FinancialTotals totals={totals} /> : null}
      </section>
    </div>
  );
}

function FinancialTotals({ totals }: { totals: Record<"expected" | "invoiced" | "received" | "pending", number | null> }) {
  const items = [
    ["Esperado", totals.expected],
    ["Facturado", totals.invoiced],
    ["Cobrado", totals.received],
    ["Pendiente", totals.pending]
  ] as const;

  return (
    <div className="mt-3 grid gap-2 rounded-lg border border-line bg-white/70 p-3 sm:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="px-2 py-1">
          <p className="text-xs text-graphite">{label}</p>
          <p className="mt-1 text-sm font-semibold text-ink">{value == null ? "Sin importe registrado" : formatCurrency(value)}</p>
        </div>
      ))}
    </div>
  );
}

function sumKnown(values: Array<number | null>) {
  const known = values.filter((value): value is number => value != null);
  return known.length ? known.reduce((total, value) => total + value, 0) : null;
}

function ActionCard({ card, count }: { card: DashboardCard; count: number }) {
  const Icon = card.icon;

  return (
    <Link
      href={`/surgeries?filter=${card.filter}`}
      className={cn(
        "group rounded-lg border bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-cobalt/30 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt",
        card.emphasis === "urgent" && count > 0 ? "border-orange-200 bg-orange-50/70" : "border-line"
      )}
      aria-label={`${card.label}: ${count}. Ver cirugías filtradas`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-ink">{count}</p>
          <p className="mt-2 text-sm font-semibold text-ink">{card.label}</p>
        </div>
        <div className="grid size-9 shrink-0 place-items-center rounded-md bg-mist text-graphite transition group-hover:text-cobalt">
          <Icon className="size-4.5" />
        </div>
      </div>
      <p className="mt-2 text-xs leading-5 text-graphite">{card.description}</p>
    </Link>
  );
}
