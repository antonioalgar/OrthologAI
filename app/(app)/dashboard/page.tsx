import Link from "next/link";
import { Clock, Database, Plus, Search, Scissors } from "lucide-react";
import { AuthGate } from "@/components/auth-gate";
import { PageHeader } from "@/components/page-header";
import { SurgeriesClient } from "@/components/surgeries-client";
import { Button } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <AuthGate>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Sprint 1"
          title="Registrar, cerrar, volver y seguir viendo tus cirugías."
          description="El Dashboard ya está orientado a uso real: crear una cirugía, revisar recientes y detectar qué falta por completar."
          action={
            <Link href="/surgeries/new">
              <Button>
                <Plus className="size-4" />
                Nueva cirugía
              </Button>
            </Link>
          }
        />

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="bg-ink text-white">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <div className="grid size-11 place-items-center rounded-lg bg-white/10">
                  <Scissors className="size-5" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold">¿Qué acabas de operar?</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                  Registra el caso con fecha y procedimiento. El resto puede completarse después.
                </p>
              </div>
              <Link href="/surgeries/new">
                <Button className="bg-white text-ink hover:bg-white">
                  <Plus className="size-4" />
                  Registrar cirugía
                </Button>
              </Link>
            </div>
          </Card>

          <Card>
            <SectionTitle eyebrow="Pendientes" title="Lo mínimo que revisar" />
            <div className="space-y-3">
              <PendingRow icon={<Clock className="size-4" />} label="Cirugías incompletas" value="Revisar desde el listado" />
              <PendingRow icon={<Database className="size-4" />} label="Datos persistentes" value="Supabase + RLS" />
              <PendingRow icon={<Search className="size-4" />} label="Buscar casos" value="Por procedimiento, diagnóstico o implante" />
            </div>
          </Card>
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite/70">Recientes</p>
              <h2 className="text-lg font-semibold text-ink">Últimas cirugías</h2>
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

function PendingRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-white p-3">
      <div className="grid size-9 place-items-center rounded-md bg-mist text-graphite">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-xs text-graphite">{value}</p>
      </div>
    </div>
  );
}
