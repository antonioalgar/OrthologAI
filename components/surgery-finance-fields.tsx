"use client";

import { AlertTriangle, Building2, Landmark, UserRound } from "lucide-react";
import { billingStatusLabels, payerTypeLabels } from "@/lib/surgeries/finance";
import type {
  BillingStatus,
  PracticeSetting,
  ProfessionalActivityFormValues
} from "@/lib/surgeries/types";
import { cn } from "@/lib/utils";

export function SurgeryFinanceFields({
  practiceSetting,
  onPracticeSettingChange,
  values,
  onChange,
  loading = false
}: {
  practiceSetting: PracticeSetting | "";
  onPracticeSettingChange: (value: PracticeSetting) => void;
  values: ProfessionalActivityFormValues;
  onChange: (values: ProfessionalActivityFormValues) => void;
  loading?: boolean;
}) {
  function update<K extends keyof ProfessionalActivityFormValues>(
    key: K,
    value: ProfessionalActivityFormValues[K]
  ) {
    onChange({ ...values, [key]: value });
  }

  function setStatus(status: BillingStatus) {
    const today = new Date().toISOString().slice(0, 10);
    const invoicedAmount = values.invoiced_amount || values.expected_amount;

    onChange({
      ...values,
      billing_status: status,
      invoiced_amount: status === "invoiced" || status === "paid" ? invoicedAmount : values.invoiced_amount,
      received_amount: status === "paid" ? values.received_amount || invoicedAmount : values.received_amount,
      invoice_date: status === "invoiced" || status === "paid" ? values.invoice_date || today : values.invoice_date,
      payment_date: status === "paid" ? values.payment_date || today : values.payment_date
    });
  }

  return (
    <section id="financial" className="paper-panel rounded-lg p-5">
      <h2 className="text-lg font-semibold">Actividad privada</h2>
      <p className="mt-1 text-sm text-graphite">Clasifica la actividad y muestra solo la gestión económica que necesites.</p>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-ink">Actividad</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <ChoiceButton
            active={practiceSetting === "public"}
            icon={<Landmark className="size-4" />}
            label="Pública"
            onClick={() => onPracticeSettingChange("public")}
          />
          <ChoiceButton
            active={practiceSetting === "private"}
            icon={<Building2 className="size-4" />}
            label="Privada"
            onClick={() => onPracticeSettingChange("private")}
          />
        </div>
        {!practiceSetting ? <p className="mt-2 text-xs text-graphite">Los casos anteriores permanecen sin clasificar hasta que los revises.</p> : null}
      </div>

      {loading ? <p className="mt-4 text-sm text-graphite">Cargando gestión económica...</p> : null}

      {practiceSetting === "public" ? (
        <p className="mt-4 rounded-lg border border-line bg-mist/45 p-4 text-sm text-graphite">
          Actividad pública. No es necesario completar información de facturación o cobro.
        </p>
      ) : null}

      {practiceSetting === "private" && !loading ? (
        <div className="mt-6 space-y-6 border-t border-line pt-6">
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Pagador</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <ChoiceButton compact active={values.payer_type === "insurance"} icon={<Building2 className="size-4" />} label={payerTypeLabels.insurance} onClick={() => update("payer_type", "insurance")} />
              <ChoiceButton compact active={values.payer_type === "private_patient"} icon={<UserRound className="size-4" />} label={payerTypeLabels.private_patient} onClick={() => update("payer_type", "private_patient")} />
              <ChoiceButton compact active={values.payer_type === "other"} label={payerTypeLabels.other} onClick={() => update("payer_type", "other")} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nombre de aseguradora / pagador">
              <input className={inputClass} value={values.payer_name} onChange={(event) => update("payer_name", event.target.value)} placeholder="Ej. Sanitas" />
            </Field>
            <Field label="Honorario previsto (€)">
              <input className={inputClass} type="number" min="0" step="0.01" value={values.expected_amount} onChange={(event) => update("expected_amount", event.target.value)} />
            </Field>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">Estado</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(["not_invoiced", "invoiced", "paid", "issue"] as BillingStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatus(status)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition",
                    values.billing_status === status ? "border-ink bg-ink text-white" : "border-line bg-white text-graphite hover:border-cobalt/40"
                  )}
                >
                  {billingStatusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          {values.billing_status === "invoiced" || values.billing_status === "paid" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Importe facturado (€)">
                <input className={inputClass} type="number" min="0" step="0.01" value={values.invoiced_amount} onChange={(event) => update("invoiced_amount", event.target.value)} />
              </Field>
              <Field label="Fecha factura">
                <input className={inputClass} type="date" value={values.invoice_date} onChange={(event) => update("invoice_date", event.target.value)} />
              </Field>
            </div>
          ) : null}

          {values.billing_status === "paid" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Importe cobrado (€)">
                <input className={inputClass} type="number" min="0" step="0.01" value={values.received_amount} onChange={(event) => update("received_amount", event.target.value)} />
              </Field>
              <Field label="Fecha cobro">
                <input className={inputClass} type="date" value={values.payment_date} onChange={(event) => update("payment_date", event.target.value)} />
              </Field>
            </div>
          ) : null}

          {values.billing_status === "issue" ? (
            <Field label="Incidencia breve">
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-3 size-4 text-ember" />
                <textarea
                  className="min-h-24 w-full rounded-md border border-orange-200 bg-orange-50/40 py-2 pl-10 pr-3 text-sm outline-none focus:border-ember"
                  value={values.billing_notes}
                  onChange={(event) => update("billing_notes", event.target.value)}
                  placeholder="Ej. Falta autorización de la aseguradora"
                />
              </div>
            </Field>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function ChoiceButton({ active, icon, label, onClick, compact = false }: { active: boolean; icon?: React.ReactNode; label: string; onClick: () => void; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition",
        compact ? "shrink-0 px-3 py-2" : "px-4 py-3",
        active ? "border-cobalt bg-blue-50 text-cobalt" : "border-line bg-white text-graphite hover:border-cobalt/40"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-ink">{label}<div className="mt-2">{children}</div></label>;
}

const inputClass = "w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cobalt";
