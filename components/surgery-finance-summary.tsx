import Link from "next/link";
import { AlertTriangle, BadgeEuro, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { billingStatusLabels, getFinancialSnapshot, getPayerLabel } from "@/lib/surgeries/finance";
import type { BillingStatus, ProfessionalActivity, Surgery } from "@/lib/surgeries/types";
import { formatCurrency } from "@/lib/utils";

export function FinancialStatusBadge({ status }: { status: BillingStatus }) {
  const tone = status === "paid" ? "green" : status === "invoiced" ? "orange" : status === "issue" ? "red" : "neutral";
  return <Badge tone={tone}>{billingStatusLabels[status]}</Badge>;
}

export function SurgeryFinanceSummary({ surgery, activity }: { surgery: Surgery; activity?: ProfessionalActivity | null }) {
  if (surgery.practice_setting === "public") {
    return (
      <Card>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite/70">Actividad</p>
        <p className="mt-2 font-semibold text-ink">Pública</p>
      </Card>
    );
  }

  const snapshot = getFinancialSnapshot(surgery, activity);
  if (!snapshot) return null;

  const hasEconomicSignal = Boolean(
    activity || surgery.payment_amount != null || surgery.is_invoiced || surgery.is_paid || surgery.practice_setting === "private"
  );
  if (!hasEconomicSignal) return null;

  const pendingAmount = snapshot.invoicedAmount == null
    ? null
    : Math.max(snapshot.invoicedAmount - (snapshot.receivedAmount ?? 0), 0);

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite/70">Actividad privada</p>
          <p className="mt-2 font-semibold text-ink">{getPayerLabel(snapshot)}</p>
          {surgery.practice_setting == null ? <p className="mt-1 text-xs text-graphite">Actividad histórica por clasificar</p> : null}
        </div>
        <BadgeEuro className="size-5 text-cobalt" />
      </div>

      <div className="mt-4 space-y-2 border-y border-line py-4 text-sm">
        <AmountRow label="Esperado" value={snapshot.expectedAmount} />
        <AmountRow label="Facturado" value={snapshot.invoicedAmount} />
        <AmountRow label="Cobrado" value={snapshot.receivedAmount} />
        {snapshot.status === "invoiced" ? <AmountRow label="Pendiente" value={pendingAmount} /> : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <FinancialStatusBadge status={snapshot.status} />
          {snapshot.status === "issue" ? <AlertTriangle className="size-4 text-ember" /> : null}
          {getStatusDate(snapshot.status, snapshot.invoiceDate, snapshot.paymentDate) ? (
            <span className="text-xs text-graphite">{formatDate(getStatusDate(snapshot.status, snapshot.invoiceDate, snapshot.paymentDate)!)}</span>
          ) : null}
        </div>
        <Link href={`/surgeries/${surgery.id}/edit#financial`}>
          <Button variant="secondary" className="px-3 py-2">
            <Pencil className="size-4" />
            Actualizar
          </Button>
        </Link>
      </div>

      {snapshot.billingNotes ? <p className="mt-3 rounded-md bg-orange-50 p-3 text-xs leading-5 text-ember">{snapshot.billingNotes}</p> : null}
    </Card>
  );
}

function AmountRow({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-graphite">{label}</span>
      <span className="font-semibold text-ink">{value == null ? "Sin importe registrado" : formatCurrency(value)}</span>
    </div>
  );
}

function getStatusDate(status: BillingStatus, invoiceDate: string | null, paymentDate: string | null) {
  if (status === "paid") return paymentDate;
  if (status === "invoiced") return invoiceDate;
  return null;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}
