export type Surgery = {
  id: string;
  user_id: string;
  surgery_date: string;
  hospital: string | null;
  lead_surgeon: string | null;
  my_role: string | null;
  payment_amount: number | null;
  is_invoiced: boolean;
  is_paid: boolean;
  practice_setting: PracticeSetting | null;
  patient_identifier: string | null;
  patient_age: number | null;
  patient_sex: string | null;
  patient_bmi: number | null;
  patient_profession: string | null;
  patient_sport: string | null;
  diagnosis: string | null;
  procedure: string;
  implants: string | null;
  complications: string | null;
  attention_required: boolean;
  attention_reason: string | null;
  attention_created_at: string | null;
  attention_resolved_at: string | null;
  surgical_observations: string | null;
  lessons_learned: string | null;
  senior_surgeon_pearls: string | null;
  created_at: string;
  updated_at: string;
};

export type SurgeryFormValues = {
  surgery_date: string;
  hospital: string;
  lead_surgeon: string;
  my_role: string;
  payment_amount: string;
  is_invoiced: boolean;
  is_paid: boolean;
  practice_setting: PracticeSetting | "";
  patient_identifier: string;
  patient_age: string;
  patient_sex: string;
  patient_bmi: string;
  patient_profession: string;
  patient_sport: string;
  diagnosis: string;
  procedure: string;
  implants: string;
  complications: string;
  surgical_observations: string;
  lessons_learned: string;
  senior_surgeon_pearls: string;
};

export type PracticeSetting = "public" | "private";

export type ProfessionalActivityType =
  | "surgery"
  | "consultation"
  | "follow_up"
  | "injection"
  | "prp"
  | "outpatient_procedure"
  | "other";

export type PayerType = "insurance" | "private_patient" | "other";

export type BillingStatus = "not_invoiced" | "invoiced" | "paid" | "issue";

export type ProfessionalActivity = {
  id: string;
  user_id: string;
  surgery_id: string | null;
  activity_type: ProfessionalActivityType;
  activity_date: string;
  payer_type: PayerType | null;
  payer_name: string | null;
  expected_amount: number | null;
  invoiced_amount: number | null;
  received_amount: number | null;
  invoice_date: string | null;
  payment_date: string | null;
  billing_status: BillingStatus;
  billing_notes: string | null;
  currency: "EUR";
  created_at: string;
  updated_at: string;
};

export type ProfessionalActivityFormValues = {
  payer_type: PayerType | "";
  payer_name: string;
  expected_amount: string;
  invoiced_amount: string;
  received_amount: string;
  invoice_date: string;
  payment_date: string;
  billing_status: BillingStatus;
  billing_notes: string;
};

export type SurgeryImage = {
  id: string;
  user_id: string;
  surgery_id: string;
  bucket: string;
  storage_path: string;
  file_name: string | null;
  content_type: string | null;
  file_size: number | null;
  category: string | null;
  caption: string | null;
  created_at: string;
};

export type FieldSuggestion = {
  value: string;
  count: number;
  latest: string;
  favorite?: boolean;
};

export type SurgeryEvolutionEvent = {
  id: string;
  user_id: string;
  surgery_id: string;
  event_type: "first_review" | "review" | "discharge";
  title: string;
  scheduled_date: string;
  clinical_state: string | null;
  notes: string | null;
  next_steps: string | null;
  status: "pending" | "completed";
  created_at: string;
  updated_at: string;
};

export type SurgeryProcedure = {
  id: string;
  user_id: string;
  surgery_id: string;
  procedure_key: string;
  procedure_label: string;
  procedure_family: string;
  created_at: string;
  updated_at: string;
};

export type UserProcedure = {
  id: string;
  user_id: string;
  procedure_key: string;
  label: string;
  normalized_label: string;
  family: string;
  is_active: boolean;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};
