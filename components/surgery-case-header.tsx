import Link from "next/link";
import { AlertTriangle, CalendarClock, CalendarDays, Hospital, Pencil, Stethoscope } from "lucide-react";
import { ClinicalStatusBadge } from "@/components/clinical-status-badge";
import { FinancialStatusBadge } from "@/components/surgery-finance-summary";
import { Badge } from "@/components/ui/badge";
import { getClinicalStatus, getNextEvolutionEvent, isEvolutionEventOverdue } from "@/lib/surgeries/evolution";
import { getFinancialSnapshot, getPayerLabel } from "@/lib/surgeries/finance";
import type { ProfessionalActivity, Surgery, SurgeryEvolutionEvent } from "@/lib/surgeries/types";
import { cn } from "@/lib/utils";

export function SurgeryCaseHeader({
  surgery,
  evolutionEvents,
  activity
}: {
  surgery: Surgery;
  evolutionEvents: SurgeryEvolutionEvent[];
  activity?: ProfessionalActivity | null;
}) {
  const clinicalStatus = getClinicalStatus(surgery, evolutionEvents);
  const nextReview = getNextEvolutionEvent(surgery, evolutionEvents);
  const overdue = nextReview ? isEvolutionEventOverdue(nextReview) : false;
  const financial = getFinancialSnapshot(surgery, activity);
  const showFinancial = surgery.practice_setting === "private" || Boolean(activity || surgery.payment_amount != null || surgery.is_invoiced || surgery.is_paid);

  return (
    <header className="mb-9 rounded-xl border border-line bg-white/75 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite/70">Caso quirúrgico</p>
          <h1 className="mt-2 max-w-4xl text-3xl font-semibold tracking-normal text-ink sm:text-5xl">{surgery.procedure}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-graphite sm:text-base">
            {surgery.diagnosis || "Sin diagnóstico registrado"}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-graphite">
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" />{formatDate(surgery.surgery_date)}</span>
            <span className="inline-flex items-center gap-1.5"><Hospital className="size-4" />{surgery.hospital || "Hospital no registrado"}</span>
            <span className="inline-flex items-center gap-1.5"><Stethoscope className="size-4" />{surgery.my_role || "Rol no registrado"}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-xs lg:justify-end">
          <ClinicalStatusBadge status={clinicalStatus} />
          {surgery.attention_required ? <Badge tone="orange" className="gap-1.5"><AlertTriangle className="size-3.5" />Requiere atención</Badge> : null}
          <ActivityBadge surgery={surgery} />
          {showFinancial && financial ? <FinancialStatusBadge status={financial.status} /> : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-line pt-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0 rounded-lg bg-mist/55 px-3.5 py-3">
          <ReviewSummary clinicalStatus={clinicalStatus} nextReview={nextReview} overdue={overdue} />
          {surgery.attention_required && surgery.attention_reason ? (
            <p className="mt-2 flex min-w-0 items-start gap-2 text-sm text-ember">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span className="truncate" title={surgery.attention_reason}>{surgery.attention_reason}</span>
            </p>
          ) : null}
          {surgery.practice_setting === "private" && financial ? (
            <p className="mt-2 text-xs text-graphite">Privada · {getPayerLabel(financial)} · {financialStatusText(financial.status)}</p>
          ) : null}
        </div>

        <nav className="flex flex-col gap-2 sm:flex-row sm:flex-wrap md:justify-end" aria-label="Acciones rápidas del caso">
          <a href="#evolution" className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-3.5 py-2 text-sm font-semibold text-white">
            <CalendarClock className="size-4" />
            {nextReview ? "Ir a seguimiento" : "Registrar evolución"}
          </a>
          <Link href={`/surgeries/${surgery.id}/edit`} className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink">
            <Pencil className="size-4" />Editar
          </Link>
          <a href="#attention" className="inline-flex items-center justify-center gap-2 px-2 py-2 text-sm font-semibold text-cobalt">
            <AlertTriangle className="size-4" />
            {surgery.attention_required ? "Resolver alerta" : "Marcar para atención"}
          </a>
        </nav>
      </div>
    </header>
  );
}

function ActivityBadge({ surgery }: { surgery: Surgery }) {
  if (surgery.practice_setting === "private") return <Badge tone="blue">Privada</Badge>;
  if (surgery.practice_setting === "public") return <Badge>Pública</Badge>;
  return <Badge>Actividad no registrada</Badge>;
}

function ReviewSummary({
  clinicalStatus,
  nextReview,
  overdue
}: {
  clinicalStatus: ReturnType<typeof getClinicalStatus>;
  nextReview?: SurgeryEvolutionEvent;
  overdue: boolean;
}) {
  if (clinicalStatus === "closed") {
    return (
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/70">Seguimiento</p>
        <p className="mt-1 text-sm font-semibold text-moss">Seguimiento finalizado</p>
      </div>
    );
  }
  if (!nextReview) {
    return (
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite/70">Próxima revisión</p>
        <p className="mt-1 text-sm text-graphite">Sin próxima revisión programada</p>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start gap-2", overdue ? "text-ember" : "text-cobalt")}>
      <CalendarClock className="mt-0.5 size-4 shrink-0" />
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{overdue ? "Revisión atrasada" : "Próxima revisión"}</p>
        <p className="mt-1 text-sm font-semibold text-ink">{formatDate(nextReview.scheduled_date)}</p>
        {nextReview.title ? <p className="mt-0.5 text-xs text-graphite">{nextReview.title}</p> : null}
      </div>
    </div>
  );
}

function financialStatusText(status: NonNullable<ReturnType<typeof getFinancialSnapshot>>["status"]) {
  if (status === "paid") return "Cobrada";
  if (status === "invoiced") return "Pendiente de cobro";
  if (status === "issue") return "Incidencia";
  return "Sin facturar";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}
