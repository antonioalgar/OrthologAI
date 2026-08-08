import Link from "next/link";
import { Plus } from "lucide-react";
import { ActionDashboard } from "@/components/action-dashboard";
import { AuthGate } from "@/components/auth-gate";
import { PageHeader } from "@/components/page-header";
import { SurgeriesClient } from "@/components/surgeries-client";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <AuthGate>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Tu actividad"
          title="Lo importante, de un vistazo."
          description="Revisa lo que necesita atención y entra directamente en la lista de casos correspondiente."
          action={
            <Link href="/surgeries/new">
              <Button>
                <Plus className="size-4" />
                Nueva cirugia
              </Button>
            </Link>
          }
        />

        <ActionDashboard />

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite/70">Recientes</p>
              <h2 className="text-lg font-semibold text-ink">Ultimas cirugias</h2>
            </div>
            <Link href="/surgeries" className="text-sm font-semibold text-cobalt">
              Ver registro
            </Link>
          </div>
          <SurgeriesClient compact />
        </section>
      </div>
    </AuthGate>
  );
}
