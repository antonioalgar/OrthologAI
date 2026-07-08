import { BadgeEuro, Brain, Hospital, Microscope, Scissors } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { ActivityAreaChart, BillingBarChart, LearningBarChart, ProcedurePieChart } from "@/components/stats-charts";
import { Card, SectionTitle } from "@/components/ui/card";

const statOverview = [
  { label: "Procedimientos distintos", value: "42", delta: "+6 este año", icon: Scissors },
  { label: "Hospitales", value: "5", delta: "2 principales", icon: Hospital },
  { label: "Facturación media", value: "892 €", delta: "+8% trimestre", icon: BadgeEuro },
  { label: "Implantes únicos", value: "68", delta: "37 Triathlon", icon: Microscope }
];

export default function StatsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Estadísticas"
        title="La evolución de tu experiencia quirúrgica."
        description="Gráficos simulados para validar cómo se verá la lectura longitudinal de actividad, implantes, facturación y aprendizaje."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statOverview.map((item) => <StatCard key={item.label} {...item} />)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <SectionTitle eyebrow="Actividad" title="Cirugías por mes" />
          <ActivityAreaChart />
        </Card>
        <Card>
          <SectionTitle eyebrow="Procedimientos" title="Distribución quirúrgica" />
          <ProcedurePieChart />
        </Card>
        <Card>
          <SectionTitle eyebrow="Facturación" title="Ingresos simulados" />
          <BillingBarChart />
        </Card>
        <Card>
          <SectionTitle eyebrow="Aprendizaje" title="Aprendizajes registrados" />
          <LearningBarChart />
        </Card>
      </div>

      <Card className="mt-6">
        <SectionTitle eyebrow="Implantes" title="Lectura simulada por familia" />
        <div className="grid gap-3 md:grid-cols-3">
          {["Stryker Triathlon", "SwiveLock", "TomoFix"].map((implant, index) => (
            <div key={implant} className="rounded-lg border border-line bg-white p-5">
              <Brain className="mb-4 size-5 text-cobalt" />
              <p className="font-semibold">{implant}</p>
              <p className="mt-2 text-sm leading-6 text-graphite">
                {index === 0 ? "37 casos registrados, principalmente artroplastia primaria." : index === 1 ? "Usado en reconstrucciones MPFL y técnicas deportivas." : "Relacionado con osteotomías y MAT medial."}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
