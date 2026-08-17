import type { Surgery, SurgeryProcedure } from "@/lib/surgeries/types";

export const procedureFamilies = {
  knee_arthroplasty: "Artroplastia de rodilla",
  ligaments: "Ligamentos",
  meniscus: "Menisco",
  osteotomy: "Osteotomía",
  cartilage: "Cartílago",
  other: "Otros"
} as const;

export type ProcedureFamily = keyof typeof procedureFamilies;

export type ProcedureDefinition = {
  key: string;
  label: string;
  family: ProcedureFamily;
};

export const procedureTaxonomy: ProcedureDefinition[] = [
  { key: "knee_tka_primary", label: "TKA primaria", family: "knee_arthroplasty" },
  { key: "knee_tka_revision", label: "TKA revisión", family: "knee_arthroplasty" },
  { key: "knee_uka", label: "UKA", family: "knee_arthroplasty" },
  { key: "knee_pfa", label: "PFA", family: "knee_arthroplasty" },
  { key: "knee_acl_primary", label: "ACL primaria", family: "ligaments" },
  { key: "knee_acl_revision", label: "ACL revisión", family: "ligaments" },
  { key: "knee_pcl", label: "PCL", family: "ligaments" },
  { key: "knee_plc", label: "PLC", family: "ligaments" },
  { key: "knee_multiligament", label: "Multiligamento", family: "ligaments" },
  { key: "knee_mpfl", label: "MPFL / estabilización patelofemoral", family: "ligaments" },
  { key: "knee_meniscectomy", label: "Meniscectomía", family: "meniscus" },
  { key: "knee_meniscal_repair", label: "Sutura meniscal", family: "meniscus" },
  { key: "knee_mat", label: "MAT", family: "meniscus" },
  { key: "knee_hto", label: "HTO", family: "osteotomy" },
  { key: "knee_dfo", label: "DFO", family: "osteotomy" },
  { key: "knee_slope_osteotomy", label: "Osteotomía tibial de pendiente / deflexora", family: "osteotomy" },
  { key: "knee_other_osteotomy", label: "Otra osteotomía", family: "osteotomy" },
  { key: "knee_cartilage_procedure", label: "Procedimiento de cartílago", family: "cartilage" },
  { key: "knee_oca", label: "OCA / injerto osteocondral", family: "cartilage" },
  { key: "knee_other_cartilage", label: "Otro procedimiento de cartílago", family: "cartilage" },
  { key: "other_procedure", label: "Otro procedimiento", family: "other" }
];

export function getProcedureDefinition(key: string) {
  return procedureTaxonomy.find((item) => item.key === key);
}

export function groupSurgeryProcedures(rows: SurgeryProcedure[]) {
  return rows.reduce<Record<string, SurgeryProcedure[]>>((grouped, row) => {
    grouped[row.surgery_id] = [...(grouped[row.surgery_id] ?? []), row];
    return grouped;
  }, {});
}

export function normalizedRole(role: string | null): "lead" | "assistant" | "other" {
  const value = normalizeText(role ?? "");
  if (value.includes("ayudante") || value.includes("assistant")) return "assistant";
  if (value.includes("principal") || value.includes("primer cirujano") || value.includes("first surgeon")) return "lead";
  return "other";
}

export function surgeryMatchesActivityFilters(
  surgery: Surgery,
  filters: { period: "current" | "previous" | "all"; role: "all" | "lead" | "assistant"; setting: "all" | "public" | "private"; hospital: string },
  currentYear = new Date().getFullYear()
) {
  const surgeryYear = Number(surgery.surgery_date.slice(0, 4));
  if (filters.period === "current" && surgeryYear !== currentYear) return false;
  if (filters.period === "previous" && surgeryYear !== currentYear - 1) return false;
  if (filters.role !== "all" && normalizedRole(surgery.my_role) !== filters.role) return false;
  if (filters.setting !== "all" && surgery.practice_setting !== filters.setting) return false;
  if (filters.hospital && surgery.hospital !== filters.hospital) return false;
  return true;
}

function normalizeText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
