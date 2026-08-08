"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, CircleDashed, Clock3, CreditCard, FileWarning, Hourglass } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { groupEvolutionEvents, matchesSurgeryFilter, type SurgeryFilter } from "@/lib/surgeries/filters";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Surgery, SurgeryEvolutionEvent } from "@/lib/surgeries/types";
import { cn } from "@/lib/utils";

const attentionCards: DashboardCard[] = [
  { filter: "overdue", label: "Revisiones atrasadas", description: "Controles pendientes cuya fecha ya ha pasado", icon: Clock3, emphasis: "urgent" },
  { filter: "upcoming", label: "Próximas revisiones", description: "Siguientes controles pendientes programados", icon: CalendarClock },
  { filter: "incomplete", label: "Casos incompletos", description: "Registros con datos básicos por completar", icon: FileWarning },
  { filter: "followup", label: "En seguimiento", description: "Casos clínicos todavía abiertos", icon: Hourglass }
];

const paymentCards: DashboardCard[] = [
  { filter: "not-invoiced", label: "Sin facturar", description: "Procedimientos aún no facturados", icon: CircleDashed },
  { filter: "unpaid", label: "Pendientes de cobro", description: "Facturados y todavía no cobrados", icon: CreditCard },
  { filter: "paid", label: "Cobradas", description: "Procedimientos marcados como cobrados", icon: CheckCircle2 }
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
        const { data: eventRows, error: eventError } = await supabaseClient
          .from("surgery_evolution_events")
          .select("*")
          .in("surgery_id", loadedSurgeries.map((surgery) => surgery.id));

        if (eventError) setError(eventError.message);
        else setEventsBySurgery(groupEvolutionEvents((eventRows ?? []) as SurgeryEvolutionEvent[]));
      }

      setLoading(false);
    }

    load();
  }, []);

  const counts = useMemo(
    () =>
      [...attentionCards, ...paymentCards].reduce<Partial<Record<SurgeryFilter, number>>>((result, card) => {
        result[card.filter] = surgeries.filter((surgery) =>
          matchesSurgeryFilter(surgery, eventsBySurgery[surgery.id] ?? [], card.filter)
        ).length;
        return result;
      }, {}),
    [eventsBySurgery, surgeries]
  );

  if (loading) return <Card>Cargando prioridades...</Card>;
  if (error) return <Card className="text-sm text-ember">{error}</Card>;

  return (
    <div className="space-y-6">
      <section>
        <SectionTitle eyebrow="Prioridad" title="Necesitan atención" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {attentionCards.map((card) => <ActionCard key={card.filter} card={card} count={counts[card.filter] ?? 0} />)}
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="Actividad privada" title="Facturación y cobros" />
        <div className="grid gap-3 sm:grid-cols-3">
          {paymentCards.map((card) => <ActionCard key={card.filter} card={card} count={counts[card.filter] ?? 0} />)}
        </div>
      </section>
    </div>
  );
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
