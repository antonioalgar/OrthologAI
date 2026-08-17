"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";
import {
  customProcedureFamilies,
  getAvailableProcedureCatalog,
  getProcedureFamilyLabel,
  normalizeProcedureLabel,
  type CustomProcedureFamily,
  type ProcedureDefinition
} from "@/lib/surgeries/procedures";
import type { UserProcedure } from "@/lib/surgeries/types";

export function StructuredProcedureSelector({
  value,
  onChange,
  customProcedures,
  onCreateCustom,
  loading = false
}: {
  value: string[];
  onChange: (keys: string[]) => void;
  customProcedures: UserProcedure[];
  onCreateCustom: (label: string, family: CustomProcedureFamily) => Promise<UserProcedure | null>;
  loading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [customFamily, setCustomFamily] = useState<CustomProcedureFamily>("other");
  const [savingCustom, setSavingCustom] = useState(false);
  const catalog = useMemo(() => getAvailableProcedureCatalog(customProcedures), [customProcedures]);
  const selected = catalog.filter((item) => value.includes(item.key));
  const available = useMemo(() => {
    const normalized = normalizeProcedureLabel(query);
    return catalog.filter((item) =>
      !value.includes(item.key) && (!normalized || normalizeProcedureLabel(`${item.label} ${getProcedureFamilyLabel(item.family)}`).includes(normalized))
    );
  }, [catalog, query, value]);
  const normalizedCustomLabel = normalizeProcedureLabel(customLabel);
  const possibleMatches = catalog.filter((item) => {
    const normalizedExisting = normalizeProcedureLabel(item.label);
    if (!normalizedCustomLabel) return false;
    return normalizedExisting === normalizedCustomLabel
      || (normalizedCustomLabel.length >= 6 && (normalizedExisting.includes(normalizedCustomLabel) || normalizedCustomLabel.includes(normalizedExisting)));
  });
  const exactMatch = possibleMatches.find((item) => normalizeProcedureLabel(item.label) === normalizedCustomLabel);

  async function createAndAdd() {
    if (!customLabel.trim() || savingCustom || exactMatch) return;
    setSavingCustom(true);
    const created = await onCreateCustom(customLabel.trim(), customFamily);
    if (created && !value.includes(created.procedure_key)) onChange([...value, created.procedure_key]);
    if (created) {
      setCustomLabel("");
      setCustomFamily("other");
      setCreating(false);
      setOpen(true);
    }
    setSavingCustom(false);
  }

  function addProcedure(item: ProcedureDefinition) {
    onChange([...value, item.key]);
    setQuery("");
  }

  return (
    <div className="mt-5 border-t border-line pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">Procedimientos estructurados</h3>
          <p className="mt-1 text-xs leading-5 text-graphite">Para logbook y estadísticas. El procedimiento libre se conserva sin cambios.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-xs font-semibold text-ink" onClick={() => { setOpen((current) => !current); setCreating(false); }} disabled={loading}>
          <Plus className="size-3.5" />Añadir procedimiento
        </button>
      </div>

      {selected.length ? <div className="mt-3 flex flex-wrap gap-2">{selected.map((item) => (
        <span key={item.key} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-cobalt">
          {item.label}
          <button type="button" onClick={() => onChange(value.filter((key) => key !== item.key))} aria-label={`Eliminar ${item.label}`} className="rounded-full hover:bg-blue-100"><X className="size-3.5" /></button>
        </span>
      ))}</div> : <p className="mt-3 text-xs text-graphite">Sin procedimientos estructurados asignados.</p>}

      {open ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-line bg-white shadow-soft">
          {!creating ? (
            <>
              <label className="flex items-center gap-2 border-b border-line px-3 py-2 text-sm text-graphite"><Search className="size-4" /><input className="w-full bg-transparent outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar TKA, LCA, meseta..." autoFocus /></label>
              <div className="max-h-72 overflow-y-auto p-2">
                <CatalogSection title="Predefinidos" items={available.filter((item) => item.source === "predefined")} onAdd={addProcedure} />
                <CatalogSection title="Mis procedimientos" items={available.filter((item) => item.source === "custom")} onAdd={addProcedure} />
                {!available.length ? <p className="px-3 py-3 text-sm text-graphite">No hay procedimientos que coincidan.</p> : null}
              </div>
              <div className="border-t border-line p-2"><button type="button" className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-cobalt hover:bg-blue-50" onClick={() => { setCreating(true); setCustomLabel(query); }}><Plus className="size-4" />Crear procedimiento</button></div>
            </>
          ) : (
            <div className="p-4">
              <h4 className="font-semibold text-ink">Crear procedimiento personalizado</h4>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-medium text-graphite">Nombre del procedimiento<input className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-cobalt" value={customLabel} onChange={(event) => setCustomLabel(event.target.value)} placeholder="Ej. RAFI meseta tibial" maxLength={120} autoFocus /></label>
                <label className="text-xs font-medium text-graphite">Familia / categoría<select className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-cobalt" value={customFamily} onChange={(event) => setCustomFamily(event.target.value as CustomProcedureFamily)}>{Object.entries(customProcedureFamilies).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
              </div>
              {possibleMatches.length ? <div className="mt-3 rounded-md border border-orange-200 bg-orange-50 p-3"><p className="text-xs font-semibold text-ember">Posible procedimiento existente</p>{possibleMatches.slice(0, 3).map((item) => <button key={item.key} type="button" className="mt-2 flex w-full items-center justify-between gap-3 text-left text-sm text-ink" onClick={() => { if (!value.includes(item.key)) onChange([...value, item.key]); setCreating(false); setCustomLabel(""); }}><span>{item.label}</span><span className="text-xs font-semibold text-cobalt">Reutilizar</span></button>)}</div> : null}
              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink" onClick={() => { setCreating(false); setCustomLabel(""); }}>Cancelar</button><button type="button" className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white disabled:opacity-50" onClick={createAndAdd} disabled={!customLabel.trim() || savingCustom || Boolean(exactMatch)}>{savingCustom ? "Creando..." : "Crear y añadir"}</button></div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function CatalogSection({ title, items, onAdd }: { title: string; items: ProcedureDefinition[]; onAdd: (item: ProcedureDefinition) => void }) {
  if (!items.length) return null;
  return <section className="mb-2"><p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/70">{title}</p>{items.map((item) => <button key={item.key} type="button" className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-mist" onClick={() => onAdd(item)}><div className="grid size-6 shrink-0 place-items-center rounded-full border border-line text-transparent"><Check className="size-3.5" /></div><div className="min-w-0"><p className="text-sm font-medium text-ink">{item.label}</p><p className="text-xs text-graphite">{getProcedureFamilyLabel(item.family)}</p></div></button>)}</section>;
}
