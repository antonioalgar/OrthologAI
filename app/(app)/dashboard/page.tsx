import Link from "next/link";
import { Plus, Scissors } from "lucide-react";
import { AuthGate } from "@/components/auth-gate";
import { PageHeader } from "@/components/page-header";
import { PendingFollowups } from "@/components/pending-followups";
import { SurgeriesClient } from "@/components/surgeries-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <AuthGate>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Sprint 1"
          title="Registrar, cerrar, volver y seguir viendo tus cirugias."
          description="El Dashboard ya esta orientado a uso real: crear una cirugia, revisar recientes y detectar que falta por completar."
          action={
            <Link href="/surgeries/new">
              <Button>
                <Plus className="size-4" />
                Nueva cirugia
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
                <h2 className="mt-5 text-2xl font-semibold">Que acabas de operar?</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                  Registra el caso con fecha y procedimiento. El resto puede completarse despues.
                </p>
              </div>
              <Link href="/surgeries/new">
                <Button className="bg-white text-ink hover:bg-white">
                  <Plus className="size-4" />
                  Registrar cirugia
                </Button>
              </Link>
            </div>
          </Card>

          <PendingFollowups />
        </div>

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
