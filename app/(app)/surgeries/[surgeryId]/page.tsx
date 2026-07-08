"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BadgeEuro, BookOpen, CalendarDays, FileText, Hospital, Lightbulb, Pencil, Scissors, UserRound } from "lucide-react";
import { AuthGate } from "@/components/auth-gate";
import { FieldGrid, SurgeryBlock } from "@/components/surgery-block";
import { SurgeryImageManager } from "@/components/surgery-image-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Surgery } from "@/lib/surgeries/types";
import { formatCurrency } from "@/lib/utils";

export default function SurgeryDetailPage() {
  return (
    <AuthGate>
      <SurgeryDetail />
    </AuthGate>
  );
}

function SurgeryDetail() {
  const params = useParams<{ surgeryId: string }>();
  const [surgery, setSurgery] = useState<Surgery | null>(null);
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
      .eq("id", params.surgeryId)
      .single()
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message);
        setSurgery((data ?? null) as Surgery | null);
        setLoading(false);
      });
  }, [params.surgeryId]);

  if (loading) {
    return <Card>Cargando cirugia...</Card>;
  }

  if (error || !surgery) {
    return <Card className="text-sm text-ember">{error || "No se encontro la cirugia."}</Card>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <article className="paper-panel rounded-lg px-5 py-6 sm:px-8 lg:px-12 lg:py-10">
        <div className="mb-9">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge tone="blue">Cirugia real</Badge>
            {surgery.is_paid ? <Badge tone="green">Cobrado</Badge> : surgery.is_invoiced ? <Badge tone="orange">Facturado</Badge> : <Badge>Sin facturar</Badge>}
          </div>
          <h1 className="max-w-4xl text-3xl font-semibold tracking-normal text-ink sm:text-5xl">{surgery.procedure}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-graphite">{surgery.diagnosis || "Sin diagnostico registrado todavia."}</p>
        </div>

        <SurgeryBlock title="Informacion basica">
          <FieldGrid
            items={[
              { label: "Fecha", value: formatDate(surgery.surgery_date) },
              { label: "Hospital", value: surgery.hospital || "No registrado" },
              { label: "Cirujano principal", value: surgery.lead_surgeon || "No registrado" },
              { label: "Mi rol", value: surgery.my_role || "No registrado" },
              { label: "Pago", value: surgery.payment_amount ? formatCurrency(Number(surgery.payment_amount)) : "No registrado" },
              { label: "Facturado", value: surgery.is_invoiced ? "Si" : "No" },
              { label: "Cobrado", value: surgery.is_paid ? "Si" : "No" }
            ]}
          />
        </SurgeryBlock>

        <SurgeryBlock title="Paciente">
          <FieldGrid
            items={[
              { label: "Identificador", value: surgery.patient_identifier || "No registrado" },
              { label: "Edad", value: surgery.patient_age ? `${surgery.patient_age} anos` : "No registrada" },
              { label: "Sexo", value: surgery.patient_sex || "No registrado" },
              { label: "IMC", value: surgery.patient_bmi ? String(surgery.patient_bmi) : "No registrado" },
              { label: "Profesion", value: surgery.patient_profession || "No registrada" },
              { label: "Deporte", value: surgery.patient_sport || "No registrado" }
            ]}
          />
        </SurgeryBlock>

        <TextBlock title="Diagnostico" value={surgery.diagnosis} />
        <TextBlock title="Procedimiento" value={surgery.procedure} />
        <TextBlock title="Implantes" value={surgery.implants} />
        <TextBlock title="Complicaciones" value={surgery.complications} />
        <SurgeryImageManager surgeryId={surgery.id} />
        <TextBlock title="Observaciones quirurgicas" value={surgery.surgical_observations} />
        <TextBlock title="Que he aprendido hoy" value={surgery.lessons_learned} icon={<Lightbulb className="size-5 text-ember" />} />
        <TextBlock title="Perlas del adjunto" value={surgery.senior_surgeon_pearls} icon={<BookOpen className="size-5 text-moss" />} />
      </article>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Resumen del caso</h2>
            <Link href={`/surgeries/${surgery.id}/edit`}>
              <Button variant="secondary" className="px-3 py-2">
                <Pencil className="size-4" />
                Editar
              </Button>
            </Link>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <SideRow icon={<CalendarDays className="size-4" />} label="Fecha" value={formatDate(surgery.surgery_date)} />
            <SideRow icon={<Hospital className="size-4" />} label="Hospital" value={surgery.hospital || "No registrado"} />
            <SideRow icon={<Scissors className="size-4" />} label="Procedimiento" value={surgery.procedure} />
            <SideRow icon={<UserRound className="size-4" />} label="Rol" value={surgery.my_role || "No registrado"} />
            <SideRow icon={<BadgeEuro className="size-4" />} label="Pago" value={surgery.payment_amount ? formatCurrency(Number(surgery.payment_amount)) : "No registrado"} />
          </div>
        </Card>
      </aside>
    </div>
  );
}

function TextBlock({ title, value, icon }: { title: string; value: string | null; icon?: React.ReactNode }) {
  return (
    <SurgeryBlock title={title}>
      <div className="flex gap-4 rounded-lg border border-line bg-white p-5">
        <div className="pt-1">{icon ?? <FileText className="size-5 text-cobalt" />}</div>
        <p className="whitespace-pre-wrap text-base leading-8 text-ink">{value || "No registrado todavia."}</p>
      </div>
    </SurgeryBlock>
  );
}

function SideRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-line bg-white p-3">
      <div className="pt-0.5 text-graphite">{icon}</div>
      <div>
        <p className="text-xs text-graphite">{label}</p>
        <p className="font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}
