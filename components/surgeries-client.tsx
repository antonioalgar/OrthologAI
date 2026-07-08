"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Surgery } from "@/lib/surgeries/types";
import { formatCurrency } from "@/lib/utils";

export function SurgeriesClient({ compact = false }: { compact?: boolean }) {
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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

  const filtered = surgeries.filter((surgery) => {
    const text = [
      surgery.procedure,
      surgery.diagnosis,
      surgery.hospital,
      surgery.implants,
      surgery.complications,
      surgery.lessons_learned,
      surgery.senior_surgeon_pearls
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return text.includes(search.toLowerCase());
  });

  if (loading) {
    return <Card>Cargando cirugías...</Card>;
  }

  if (error) {
    return <Card className="text-sm text-ember">{error}</Card>;
  }

  return (
    <Card className="p-0">
      {!compact ? (
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-graphite">
            <Search className="size-4" />
            <input
              className="w-full bg-transparent outline-none"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar procedimiento, diagnóstico, implante..."
            />
          </div>
          <Link href="/surgeries/new">
            <Button>
              <Plus className="size-4" />
              Nueva cirugía
            </Button>
          </Link>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="p-6 text-sm text-graphite">
          No hay cirugías todavía.
          <Link href="/surgeries/new" className="ml-2 font-semibold text-cobalt">
            Registra la primera.
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {filtered.slice(0, compact ? 5 : undefined).map((surgery) => (
            <Link
              key={surgery.id}
              href={`/surgeries/${surgery.id}`}
              className="grid gap-3 p-4 transition hover:bg-white md:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-ink">{surgery.procedure}</h3>
                  <Badge tone={surgery.is_paid ? "green" : surgery.is_invoiced ? "orange" : "neutral"}>
                    {surgery.is_paid ? "Cobrado" : surgery.is_invoiced ? "Facturado" : "Sin facturar"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-graphite">
                  {formatDate(surgery.surgery_date)}
                  {surgery.hospital ? ` · ${surgery.hospital}` : ""}
                  {surgery.my_role ? ` · ${surgery.my_role}` : ""}
                </p>
                <p className="mt-2 text-sm text-graphite">
                  {surgery.diagnosis || "Sin diagnóstico registrado"}
                  {surgery.payment_amount ? ` · ${formatCurrency(Number(surgery.payment_amount))}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-cobalt">
                Abrir
                <ArrowRight className="size-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}
