"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FieldSuggestion } from "@/lib/surgeries/types";

export function Combobox({
  label,
  value,
  onChange,
  suggestions,
  placeholder,
  required,
  className
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: FieldSuggestion[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suggestions
      .filter((item) => !q || item.value.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, suggestions]);

  return (
    <label className={cn("relative block text-sm font-medium text-ink", className)}>
      {label} {required ? <span className="text-ember">*</span> : null}
      <div className="relative mt-2">
        <input
          className="w-full rounded-md border border-line bg-white px-3 py-2 pr-9 text-sm outline-none focus:border-cobalt"
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={(event) => {
            onChange(event.target.value);
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setQuery(value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded text-graphite hover:bg-mist"
          onClick={() => setOpen((current) => !current)}
          aria-label={`Abrir sugerencias de ${label}`}
        >
          <ChevronDown className="size-4" />
        </button>
      </div>

      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-lg border border-line bg-white shadow-soft">
          <div className="flex items-center gap-2 border-b border-line px-3 py-2 text-xs text-graphite">
            <Search className="size-3.5" />
            Historial de tus cirugias
          </div>
          {filtered.length > 0 ? (
            <div className="max-h-64 overflow-auto p-1">
              {filtered.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-mist"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(item.value);
                    setQuery(item.value);
                    setOpen(false);
                  }}
                >
                  {item.favorite ? <Star className="size-3.5 fill-amber-400 text-amber-500" /> : null}
                  <span className="min-w-0 flex-1 truncate">{item.value}</span>
                  {value === item.value ? <Check className="size-4 text-moss" /> : null}
                  <span className="text-xs text-graphite">{item.count}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="px-3 py-3 text-sm text-graphite">Sin sugerencias todavia.</p>
          )}
        </div>
      ) : null}
    </label>
  );
}
