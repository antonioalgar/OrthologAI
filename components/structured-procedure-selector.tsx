"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";
import { procedureFamilies, procedureTaxonomy } from "@/lib/surgeries/procedures";

export function StructuredProcedureSelector({ value, onChange, loading = false }: { value: string[]; onChange: (keys: string[]) => void; loading?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = procedureTaxonomy.filter((item) => value.includes(item.key));
  const available = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return procedureTaxonomy.filter((item) =>
      !value.includes(item.key) && (!normalized || `${item.label} ${procedureFamilies[item.family]}`.toLowerCase().includes(normalized))
    );
  }, [query, value]);

  return (
    <div className="mt-5 border-t border-line pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">Procedimientos estructurados</h3>
          <p className="mt-1 text-xs leading-5 text-graphite">Para logbook y estadísticas. El procedimiento libre se conserva sin cambios.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-xs font-semibold text-ink" onClick={() => setOpen((current) => !current)} disabled={loading}>
          <Plus className="size-3.5" />
          Añadir procedimiento
        </button>
      </div>

      {selected.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {selected.map((item) => (
            <span key={item.key} className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-cobalt">
              {item.label}
              <button type="button" onClick={() => onChange(value.filter((key) => key !== item.key))} aria-label={`Eliminar ${item.label}`} className="rounded-full hover:bg-blue-100">
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : <p className="mt-3 text-xs text-graphite">Sin procedimientos estructurados asignados.</p>}

      {open ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-line bg-white shadow-soft">
          <label className="flex items-center gap-2 border-b border-line px-3 py-2 text-sm text-graphite">
            <Search className="size-4" />
            <input className="w-full bg-transparent outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar TKA, LCA, menisco..." autoFocus />
          </label>
          <div className="max-h-72 overflow-y-auto p-2">
            {available.length ? available.map((item) => (
              <button key={item.key} type="button" className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-mist" onClick={() => { onChange([...value, item.key]); setQuery(""); }}>
                <div className="grid size-6 shrink-0 place-items-center rounded-full border border-line text-transparent"><Check className="size-3.5" /></div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{item.label}</p>
                  <p className="text-xs text-graphite">{procedureFamilies[item.family]}</p>
                </div>
              </button>
            )) : <p className="px-3 py-4 text-sm text-graphite">No hay más procedimientos que coincidan.</p>}
          </div>
        </div>
      ) : null}
    </div>
  );
}
