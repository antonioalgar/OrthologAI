"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BriefcaseMedical, ClipboardList, Stethoscope, Users } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { getProcedureFamilyLabel, normalizedRole, surgeryMatchesActivityFilters } from "@/lib/surgeries/procedures";
import type { Surgery, SurgeryProcedure } from "@/lib/surgeries/types";

type Filters = {
  period: "current" | "previous" | "all";
  role: "all" | "lead" | "assistant";
  setting: "all" | "public" | "private";
  hospital: string;
};

const initialFilters: Filters = { period: "current", role: "all", setting: "all", hospital: "" };

export function ActivityLogbook() {
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [procedures, setProcedures] = useState<SurgeryProcedure[]>([]);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [classificationAvailable, setClassificationAvailable] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) { setLoading(false); return; }
    const client = supabase;

    async function load() {
      const { data: surgeryRows, error: surgeryError } = await client.from("surgeries").select("*").order("surgery_date", { ascending: false });
      if (surgeryError) { setError(surgeryError.message); setLoading(false); return; }
      const loaded = (surgeryRows ?? []) as Surgery[];
      setSurgeries(loaded);

      if (loaded.length) {
        const { data: procedureRows, error: proceduresError } = await client
          .from("surgery_procedures")
          .select("*")
          .in("surgery_id", loaded.map((surgery) => surgery.id));
        if (proceduresError) {
          console.error("Clasificación estructurada pendiente de migración:", proceduresError);
          setClassificationAvailable(false);
        } else setProcedures((procedureRows ?? []) as SurgeryProcedure[]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const hospitals = useMemo(() => [...new Set(surgeries.map((surgery) => surgery.hospital).filter((item): item is string => Boolean(item)))].sort(), [surgeries]);
  const filteredSurgeries = useMemo(() => surgeries.filter((surgery) => surgeryMatchesActivityFilters(surgery, filters)), [filters, surgeries]);
  const filteredIds = useMemo(() => new Set(filteredSurgeries.map((surgery) => surgery.id)), [filteredSurgeries]);
  const filteredProcedures = useMemo(() => procedures.filter((procedure) => filteredIds.has(procedure.surgery_id)), [filteredIds, procedures]);
  const procedureSummaries = useMemo(() => Object.values(filteredProcedures.reduce<Record<string, { key: string; label: string; family: string; count: number }>>((result, procedure) => {
    const current = result[procedure.procedure_key];
    result[procedure.procedure_key] = current
      ? { ...current, count: current.count + 1 }
      : { key: procedure.procedure_key, label: procedure.procedure_label, family: procedure.procedure_family, count: 1 };
    return result;
  }, {})).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)), [filteredProcedures]);

  if (loading) return <Card>Cargando actividad quirúrgica...</Card>;
  if (error) return <Card className="text-sm text-ember">{error}</Card>;

  const currentYear = new Date().getFullYear();
  const leadCases = filteredSurgeries.filter((surgery) => normalizedRole(surgery.my_role) === "lead").length;
  const assistantCases = filteredSurgeries.filter((surgery) => normalizedRole(surgery.my_role) === "assistant").length;
  const classifiedCaseIds = new Set(filteredProcedures.map((procedure) => procedure.surgery_id));
  const unclassifiedCases = filteredSurgeries.filter((surgery) => !classifiedCaseIds.has(surgery.id)).length;

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={ClipboardList} label="Casos quirúrgicos" value={filteredSurgeries.length} />
          <Metric icon={Stethoscope} label="Cirujano principal" value={leadCases} />
          <Metric icon={Users} label="Ayudante" value={assistantCases} />
          <Metric icon={BriefcaseMedical} label="Procedimientos registrados" value={filteredProcedures.length} />
        </div>
        <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-line pt-3 text-xs text-graphite">
          <p>Un caso puede contener varios procedimientos; ambos totales se muestran por separado.</p>
          <p>{unclassifiedCases} {unclassifiedCases === 1 ? "caso sin clasificar" : "casos sin clasificar"}</p>
        </div>
      </Card>

      <Card>
        <SectionTitle eyebrow="Filtros" title="Acotar actividad" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterGroup label="Periodo">
            <FilterButtons value={filters.period} options={[["current", `Este año (${currentYear})`], ["previous", `Año anterior (${currentYear - 1})`], ["all", "Todo"]]} onChange={(period) => setFilters({ ...filters, period })} />
          </FilterGroup>
          <FilterGroup label="Rol">
            <FilterButtons value={filters.role} options={[["all", "Todos"], ["lead", "Cirujano principal"], ["assistant", "Ayudante"]]} onChange={(role) => setFilters({ ...filters, role })} />
          </FilterGroup>
          <FilterGroup label="Actividad">
            <FilterButtons value={filters.setting} options={[["all", "Todas"], ["public", "Pública"], ["private", "Privada"]]} onChange={(setting) => setFilters({ ...filters, setting })} />
          </FilterGroup>
          <label className="text-xs font-semibold text-graphite">Hospital
            <select className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-cobalt" value={filters.hospital} onChange={(event) => setFilters({ ...filters, hospital: event.target.value })}>
              <option value="">Todos</option>
              {hospitals.map((hospital) => <option key={hospital} value={hospital}>{hospital}</option>)}
            </select>
          </label>
        </div>
      </Card>

      <section>
        <SectionTitle eyebrow="Logbook" title="Procedimientos" />
        {!classificationAvailable ? (
          <Card className="text-sm text-graphite">La clasificación estructurada estará disponible cuando se aplique la migración 0006. Los casos existentes se conservan sin cambios.</Card>
        ) : procedureSummaries.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {procedureSummaries.map((item) => (
              <Link key={item.key} href={`/surgeries?procedure=${encodeURIComponent(item.key)}`} className="group flex items-center justify-between gap-4 rounded-lg border border-line bg-white/90 p-4 shadow-sm transition hover:border-cobalt/30 hover:shadow-soft">
                <div><p className="font-semibold text-ink">{item.label}</p><p className="mt-1 text-xs text-graphite">{getProcedureFamilyLabel(item.family)}</p></div>
                <div className="flex items-center gap-3"><span className="text-2xl font-semibold text-ink">{item.count}</span><ArrowRight className="size-4 text-cobalt" /></div>
              </Link>
            ))}
          </div>
        ) : <Card className="text-sm text-graphite">No hay procedimientos estructurados para estos filtros.</Card>}
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof ClipboardList; label: string; value: number }) {
  return <div className="rounded-lg bg-mist/55 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite/70">{label}</p><Icon className="size-4 text-cobalt" /></div><p className="mt-3 text-3xl font-semibold text-ink">{value}</p></div>;
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="text-xs font-semibold text-graphite">{label}</p><div className="mt-2 flex flex-wrap gap-1.5">{children}</div></div>;
}

function FilterButtons<T extends string>({ value, options, onChange }: { value: T; options: Array<[T, string]>; onChange: (value: T) => void }) {
  return options.map(([key, label]) => <button key={key} type="button" className={value === key ? "rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white" : "rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-graphite"} onClick={() => onChange(key)}>{label}</button>);
}
