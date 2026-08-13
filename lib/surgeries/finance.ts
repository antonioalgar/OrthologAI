import type {
  BillingStatus,
  ProfessionalActivity,
  ProfessionalActivityFormValues,
  Surgery
} from "@/lib/surgeries/types";

export type FinancialSnapshot = {
  status: BillingStatus;
  payerType: ProfessionalActivity["payer_type"];
  payerName: string | null;
  expectedAmount: number | null;
  invoicedAmount: number | null;
  receivedAmount: number | null;
  invoiceDate: string | null;
  paymentDate: string | null;
  billingNotes: string | null;
  source: "professional_activity" | "legacy";
};

export const billingStatusLabels: Record<BillingStatus, string> = {
  not_invoiced: "Sin facturar",
  invoiced: "Pendiente de cobro",
  paid: "Cobrada",
  issue: "Incidencia"
};

export const payerTypeLabels = {
  insurance: "Aseguradora",
  private_patient: "Paciente privado",
  other: "Otro"
} as const;

export function getFinancialSnapshot(
  surgery: Surgery,
  activity?: ProfessionalActivity | null
): FinancialSnapshot | null {
  if (surgery.practice_setting === "public") return null;

  if (activity) {
    return {
      status: activity.billing_status,
      payerType: activity.payer_type,
      payerName: activity.payer_name,
      expectedAmount: toNullableNumber(activity.expected_amount),
      invoicedAmount: toNullableNumber(activity.invoiced_amount),
      receivedAmount: toNullableNumber(activity.received_amount),
      invoiceDate: activity.invoice_date,
      paymentDate: activity.payment_date,
      billingNotes: activity.billing_notes,
      source: "professional_activity"
    };
  }

  return {
    status: surgery.is_paid ? "paid" : surgery.is_invoiced ? "invoiced" : "not_invoiced",
    payerType: null,
    payerName: null,
    expectedAmount: toNullableNumber(surgery.payment_amount),
    invoicedAmount: null,
    receivedAmount: null,
    invoiceDate: null,
    paymentDate: null,
    billingNotes: null,
    source: "legacy"
  };
}

export function getLegacyPaymentFlags(
  values: ProfessionalActivityFormValues,
  currentSurgery?: Surgery
) {
  if (values.billing_status === "paid") return { is_invoiced: true, is_paid: true };
  if (values.billing_status === "invoiced") return { is_invoiced: true, is_paid: false };
  if (values.billing_status === "not_invoiced") return { is_invoiced: false, is_paid: false };

  const hasPaymentEvidence = Boolean(values.payment_date || values.received_amount);
  const hasInvoiceEvidence = Boolean(values.invoice_date || values.invoiced_amount || hasPaymentEvidence);
  return {
    is_invoiced: hasInvoiceEvidence || currentSurgery?.is_invoiced || false,
    is_paid: hasPaymentEvidence || currentSurgery?.is_paid || false
  };
}

export function professionalActivityToFormValues(
  activity: ProfessionalActivity | null,
  surgery: Surgery
): ProfessionalActivityFormValues {
  const snapshot = getFinancialSnapshot(surgery, activity);

  return {
    payer_type: activity?.payer_type ?? "",
    payer_name: activity?.payer_name ?? "",
    expected_amount: snapshot?.expectedAmount == null ? "" : String(snapshot.expectedAmount),
    invoiced_amount: activity?.invoiced_amount == null ? "" : String(activity.invoiced_amount),
    received_amount: activity?.received_amount == null ? "" : String(activity.received_amount),
    invoice_date: activity?.invoice_date ?? "",
    payment_date: activity?.payment_date ?? "",
    billing_status: snapshot?.status ?? "not_invoiced",
    billing_notes: activity?.billing_notes ?? ""
  };
}

export function getPayerLabel(snapshot: FinancialSnapshot) {
  return snapshot.payerName || (snapshot.payerType ? payerTypeLabels[snapshot.payerType] : "Pagador no registrado");
}

function toNullableNumber(value: number | null) {
  return value == null ? null : Number(value);
}
