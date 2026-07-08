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
