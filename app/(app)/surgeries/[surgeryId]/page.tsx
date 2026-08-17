"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, FileText, Lightbulb } from "lucide-react";
import { AuthGate } from "@/components/auth-gate";
import { SurgeryCaseHeader } from "@/components/surgery-case-header";
import { EvolutionTimeline } from "@/components/evolution-timeline";
import { FieldGrid, SurgeryBlock } from "@/components/surgery-block";
import { SurgeryImageManager } from "@/components/surgery-image-manager";
import { SurgeryAttention } from "@/components/surgery-attention";
import { SurgeryFinanceSummary } from "@/components/surgery-finance-summary";
import { Card } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { ProfessionalActivity, Surgery, SurgeryEvolutionEvent } from "@/lib/surgeries/types";

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
  const [professionalActivity, setProfessionalActivity] = useState<ProfessionalActivity | null>(null);
  const [evolutionEvents, setEvolutionEvents] = useState<SurgeryEvolutionEvent[]>([]);
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
      const { data, error: queryError } = await supabaseClient
        .from("surgeries")
        .select("*")
        .eq("id", params.surgeryId)
        .single();

      if (queryError) {
        setError(queryError.message);
        setLoading(false);
        return;
      }

      setSurgery((data ?? null) as Surgery | null);

      const { data: activityData, error: activityError } = await supabaseClient
        .from("professional_activities")
        .select("*")
        .eq("surgery_id", params.surgeryId)
        .maybeSingle();

      if (activityError) console.error("Error cargando actividad profesional:", activityError);
      setProfessionalActivity((activityData ?? null) as ProfessionalActivity | null);
      setLoading(false);
    }

    load();
  }, [params.surgeryId]);

  if (loading) {
    return <Card>Cargando cirugia...</Card>;
  }

  if (error || !surgery) {
    return <Card className="text-sm text-ember">{error || "No se encontro la cirugia."}</Card>;
  }

  return (
    <div className="space-y-6">
      <SurgeryCaseHeader surgery={surgery} evolutionEvents={evolutionEvents} activity={professionalActivity} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <article className="paper-panel rounded-lg px-5 py-6 sm:px-8 lg:px-12 lg:py-10">

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

        <SurgeryBlock title="Equipo quirúrgico">
          <FieldGrid items={[{ label: "Cirujano principal", value: surgery.lead_surgeon || "No registrado" }]} />
        </SurgeryBlock>

        <TextBlock title="Diagnostico" value={surgery.diagnosis} />
        <TextBlock title="Implantes" value={surgery.implants} />
        <TextBlock title="Complicaciones" value={surgery.complications} />
        <div id="evolution" className="scroll-mt-24">
          <SurgeryBlock title="Evolucion / Seguimiento">
            <EvolutionTimeline surgery={surgery} onEventsChange={setEvolutionEvents} />
          </SurgeryBlock>
        </div>
        <SurgeryImageManager surgeryId={surgery.id} />
        <TextBlock title="Observaciones quirurgicas" value={surgery.surgical_observations} />
        <TextBlock title="Que he aprendido hoy" value={surgery.lessons_learned} icon={<Lightbulb className="size-5 text-ember" />} />
        <TextBlock title="Perlas del adjunto" value={surgery.senior_surgeon_pearls} icon={<BookOpen className="size-5 text-moss" />} />
        </article>

        <aside className="order-first space-y-4 xl:order-none xl:sticky xl:top-24 xl:self-start">
          <div id="attention" className="scroll-mt-24">
            <SurgeryAttention surgery={surgery} onChange={setSurgery} />
          </div>
          {surgery.practice_setting !== "public" ? <SurgeryFinanceSummary surgery={surgery} activity={professionalActivity} /> : null}
        </aside>
      </div>
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
