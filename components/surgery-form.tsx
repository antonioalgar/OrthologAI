"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { buildFieldSuggestions, type SuggestionField } from "@/lib/surgeries/history";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { FieldSuggestion, Surgery, SurgeryFormValues } from "@/lib/surgeries/types";

const initialValues: SurgeryFormValues = {
  surgery_date: "",
  hospital: "",
  lead_surgeon: "",
  my_role: "",
  payment_amount: "",
  is_invoiced: false,
  is_paid: false,
  patient_identifier: "",
  patient_age: "",
  patient_sex: "",
  patient_bmi: "",
  patient_profession: "",
  patient_sport: "",
  diagnosis: "",
  procedure: "",
  implants: "",
  complications: "",
  surgical_observations: "",
  lessons_learned: "",
  senior_surgeon_pearls: ""
};

export function SurgeryForm({
  initialSurgery,
  mode = "create"
}: {
  initialSurgery?: Surgery;
  mode?: "create" | "edit";
}) {
  const router = useRouter();
  const [values, setValues] = useState(() => (initialSurgery ? surgeryToFormValues(initialSurgery) : initialValues));
  const [previousSurgeries, setPreviousSurgeries] = useState<Surgery[]>([]);
  const [favorites, setFavorites] = useState<Record<string, string[]>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadHistory() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) return;

      const { data: surgeries } = await supabase
        .from("surgeries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (!ignore && surgeries) {
        setPreviousSurgeries(surgeries as Surgery[]);
      }

      const { data: favoriteRows } = await supabase
        .from("user_field_preferences")
        .select("field_name,value")
        .eq("is_favorite", true);

      if (!ignore && favoriteRows) {
        setFavorites(
          favoriteRows.reduce<Record<string, string[]>>((acc, row) => {
            acc[row.field_name] = [...(acc[row.field_name] ?? []), row.value];
            return acc;
          }, {})
        );
      }
    }

    loadHistory();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (initialSurgery) {
      setValues(surgeryToFormValues(initialSurgery));
      return;
    }

    setValues((current) =>
      current.surgery_date
        ? current
        : {
            ...current,
            surgery_date: new Date().toISOString().slice(0, 10)
          }
    );
  }, [initialSurgery]);

  const suggestions = useMemo(() => {
    const fields: SuggestionField[] = [
      "hospital",
      "procedure",
      "diagnosis",
      "lead_surgeon",
      "my_role",
      "implants",
      "patient_sport",
      "complications",
      "senior_surgeon_pearls",
      "lessons_learned"
    ];

    return fields.reduce<Record<SuggestionField, FieldSuggestion[]>>((acc, field) => {
      acc[field] = buildFieldSuggestions(previousSurgeries, field, favorites[field] ?? []);
      return acc;
    }, {} as Record<SuggestionField, FieldSuggestion[]>);
  }, [favorites, previousSurgeries]);

  function update<K extends keyof SurgeryFormValues>(key: K, value: SurgeryFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function appendText(key: "implants" | "complications" | "lessons_learned" | "senior_surgeon_pearls", value: string) {
    update(key, values[key] ? `${values[key]}\n${value}` : value);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setError("Supabase no esta configurado.");
      setSaving(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login");
      return;
    }

    const payload = {
      user_id: userData.user.id,
      surgery_date: values.surgery_date,
      hospital: emptyToNull(values.hospital),
      lead_surgeon: emptyToNull(values.lead_surgeon),
      my_role: emptyToNull(values.my_role),
      payment_amount: values.payment_amount ? Number(values.payment_amount) : null,
      is_invoiced: values.is_invoiced,
      is_paid: values.is_paid,
      patient_identifier: emptyToNull(values.patient_identifier),
      patient_age: values.patient_age ? Number(values.patient_age) : null,
      patient_sex: emptyToNull(values.patient_sex),
      patient_bmi: values.patient_bmi ? Number(values.patient_bmi) : null,
      patient_profession: emptyToNull(values.patient_profession),
      patient_sport: emptyToNull(values.patient_sport),
      diagnosis: emptyToNull(values.diagnosis),
      procedure: values.procedure.trim(),
      implants: emptyToNull(values.implants),
      complications: emptyToNull(values.complications),
      surgical_observations: emptyToNull(values.surgical_observations),
      lessons_learned: emptyToNull(values.lessons_learned),
      senior_surgeon_pearls: emptyToNull(values.senior_surgeon_pearls)
    };

    const result =
      mode === "edit" && initialSurgery
        ? await supabase
            .from("surgeries")
            .update(payload)
            .eq("id", initialSurgery.id)
            .eq("user_id", userData.user.id)
            .select("id")
            .single()
        : await supabase.from("surgeries").insert(payload).select("id").single();
    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    router.push(`/surgeries/${result.data.id}`);
    router.refresh();
  }

  async function deleteSurgery() {
    if (!initialSurgery) return;

    setDeleting(true);
    setToast(null);

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      const message = "Supabase no esta configurado.";
      console.error(message);
      setToast({ tone: "error", message });
      setDeleting(false);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error obteniendo usuario antes de eliminar cirugia:", userError);
      setToast({ tone: "error", message: userError.message });
      setDeleting(false);
      return;
    }

    if (!userData.user) {
      setDeleting(false);
      router.push("/login");
      return;
    }

    const result = await supabase
      .from("surgeries")
      .delete()
      .eq("id", initialSurgery.id)
      .select("id")
      .single();

    if (result.error) {
      console.error("Error eliminando cirugia en Supabase:", result.error);
      setToast({ tone: "error", message: result.error.message });
      setDeleting(false);
      return;
    }

    setToast({ tone: "success", message: "Cirugía eliminada correctamente." });
    setDeleteDialogOpen(false);
    setDeleting(false);

    window.setTimeout(() => {
      router.push("/surgeries");
      router.refresh();
    }, 700);
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="paper-panel rounded-lg p-5">
        <h2 className="text-lg font-semibold">Datos minimos</h2>
        <p className="mt-1 text-sm text-graphite">
          {mode === "edit" ? "Actualiza solo lo que haya cambiado." : "Con estos campos ya puedes guardar una cirugia util."}
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Fecha" required>
            <input className={inputClass} type="date" value={values.surgery_date} onChange={(event) => update("surgery_date", event.target.value)} required />
          </Field>
          <Combobox label="Procedimiento" required value={values.procedure} onChange={(value) => update("procedure", value)} suggestions={suggestions.procedure} placeholder="Ej. Revision LCA" />
          <Combobox label="Hospital" value={values.hospital} onChange={(value) => update("hospital", value)} suggestions={suggestions.hospital} placeholder="Ej. Hospital Vithas Madrid" />
          <Combobox label="Mi rol" value={values.my_role} onChange={(value) => update("my_role", value)} suggestions={suggestions.my_role} placeholder="Primer cirujano, ayudante..." />
        </div>
      </section>

      <section className="paper-panel rounded-lg p-5">
        <h2 className="text-lg font-semibold">Contexto clinico</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Combobox label="Diagnostico" value={values.diagnosis} onChange={(value) => update("diagnosis", value)} suggestions={suggestions.diagnosis} placeholder="Ej. Rotura iterativa LCA" />
          <Combobox label="Cirujano principal" value={values.lead_surgeon} onChange={(value) => update("lead_surgeon", value)} suggestions={suggestions.lead_surgeon} />
          <Field label="Identificador paciente">
            <input className={inputClass} value={values.patient_identifier} onChange={(event) => update("patient_identifier", event.target.value)} placeholder="Anonimizado" />
          </Field>
          <Field label="Edad">
            <input className={inputClass} type="number" value={values.patient_age} onChange={(event) => update("patient_age", event.target.value)} />
          </Field>
          <Field label="Sexo">
            <input className={inputClass} value={values.patient_sex} onChange={(event) => update("patient_sex", event.target.value)} />
          </Field>
          <Field label="IMC">
            <input className={inputClass} type="number" step="0.1" value={values.patient_bmi} onChange={(event) => update("patient_bmi", event.target.value)} />
          </Field>
          <Field label="Profesion">
            <input className={inputClass} value={values.patient_profession} onChange={(event) => update("patient_profession", event.target.value)} />
          </Field>
          <Combobox label="Deporte" value={values.patient_sport} onChange={(value) => update("patient_sport", value)} suggestions={suggestions.patient_sport} />
        </div>
      </section>

      <section className="paper-panel rounded-lg p-5">
        <h2 className="text-lg font-semibold">Experiencia quirurgica</h2>
        <div className="mt-5 grid gap-4">
          <Field label="Implantes">
            <textarea className={textareaClass} value={values.implants} onChange={(event) => update("implants", event.target.value)} placeholder="Marca, modelo, talla..." />
            <SuggestionChips suggestions={suggestions.implants} onPick={(value) => appendText("implants", value)} />
          </Field>
          <Field label="Complicaciones">
            <textarea className={textareaClass} value={values.complications} onChange={(event) => update("complications", event.target.value)} placeholder="Si no hubo, puedes dejarlo en blanco" />
            <SuggestionChips suggestions={suggestions.complications} onPick={(value) => appendText("complications", value)} />
          </Field>
          <Field label="Observaciones quirurgicas">
            <textarea className={textareaClass} value={values.surgical_observations} onChange={(event) => update("surgical_observations", event.target.value)} placeholder="Que ocurrio objetivamente durante la cirugia" />
          </Field>
          <Field label="Que he aprendido hoy">
            <textarea className={textareaClass} value={values.lessons_learned} onChange={(event) => update("lessons_learned", event.target.value)} placeholder="Una frase util basta" />
            <SuggestionChips suggestions={suggestions.lessons_learned} onPick={(value) => appendText("lessons_learned", value)} />
          </Field>
          <Field label="Perlas del adjunto">
            <textarea className={textareaClass} value={values.senior_surgeon_pearls} onChange={(event) => update("senior_surgeon_pearls", event.target.value)} />
            <SuggestionChips suggestions={suggestions.senior_surgeon_pearls} onPick={(value) => appendText("senior_surgeon_pearls", value)} />
          </Field>
        </div>
      </section>

      <section className="paper-panel rounded-lg p-5">
        <h2 className="text-lg font-semibold">Facturacion simple</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Field label="Pago">
            <input className={inputClass} type="number" step="0.01" value={values.payment_amount} onChange={(event) => update("payment_amount", event.target.value)} />
          </Field>
          <label className="flex items-center gap-3 rounded-lg border border-line bg-white p-4 text-sm font-medium">
            <input type="checkbox" checked={values.is_invoiced} onChange={(event) => update("is_invoiced", event.target.checked)} />
            Facturado
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-line bg-white p-4 text-sm font-medium">
            <input type="checkbox" checked={values.is_paid} onChange={(event) => update("is_paid", event.target.checked)} />
            Cobrado
          </label>
        </div>
      </section>

      {error ? <p className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-ember">{error}</p> : null}

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button className="shadow-soft">
          <Save className="size-4" />
          {saving ? "Guardando..." : mode === "edit" ? "Guardar cambios" : "Guardar cirugia"}
        </Button>
      </div>

      {mode === "edit" ? (
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-medium text-red-700 transition hover:-translate-y-0.5 hover:bg-red-100"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="size-4" />
            Eliminar cirugía
          </button>
        </div>
      ) : null}

      {deleteDialogOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" role="alertdialog" aria-modal="true" aria-labelledby="delete-surgery-title">
          <div className="w-full max-w-md rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 id="delete-surgery-title" className="text-lg font-semibold text-ink">
              ¿Eliminar esta cirugía?
            </h2>
            <p className="mt-2 text-sm leading-6 text-graphite">
              Esta acción eliminará permanentemente la cirugía y no se puede deshacer.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink transition hover:-translate-y-0.5"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-red-700 px-3.5 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={deleteSurgery}
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Eliminar cirugía"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div
          className={`fixed bottom-5 right-5 z-50 max-w-sm rounded-lg border px-4 py-3 text-sm shadow-soft ${
            toast.tone === "success" ? "border-green-200 bg-green-50 text-moss" : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="status"
        >
          {toast.message}
        </div>
      ) : null}
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label} {required ? <span className="text-ember">*</span> : null}
      <div className="mt-2">{children}</div>
    </label>
  );
}

function SuggestionChips({ suggestions, onPick }: { suggestions: FieldSuggestion[]; onPick: (value: string) => void }) {
  if (!suggestions.length) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {suggestions.slice(0, 5).map((item) => (
        <button
          key={item.value}
          type="button"
          className="rounded-full border border-line bg-white px-2.5 py-1 text-xs text-graphite hover:border-cobalt hover:text-ink"
          onClick={() => onPick(item.value)}
        >
          {item.value}
        </button>
      ))}
    </div>
  );
}

function emptyToNull(value: string) {
  return value.trim() ? value.trim() : null;
}

function surgeryToFormValues(surgery: Surgery): SurgeryFormValues {
  return {
    surgery_date: surgery.surgery_date,
    hospital: surgery.hospital ?? "",
    lead_surgeon: surgery.lead_surgeon ?? "",
    my_role: surgery.my_role ?? "",
    payment_amount: surgery.payment_amount == null ? "" : String(surgery.payment_amount),
    is_invoiced: surgery.is_invoiced,
    is_paid: surgery.is_paid,
    patient_identifier: surgery.patient_identifier ?? "",
    patient_age: surgery.patient_age == null ? "" : String(surgery.patient_age),
    patient_sex: surgery.patient_sex ?? "",
    patient_bmi: surgery.patient_bmi == null ? "" : String(surgery.patient_bmi),
    patient_profession: surgery.patient_profession ?? "",
    patient_sport: surgery.patient_sport ?? "",
    diagnosis: surgery.diagnosis ?? "",
    procedure: surgery.procedure,
    implants: surgery.implants ?? "",
    complications: surgery.complications ?? "",
    surgical_observations: surgery.surgical_observations ?? "",
    lessons_learned: surgery.lessons_learned ?? "",
    senior_surgeon_pearls: surgery.senior_surgeon_pearls ?? ""
  };
}

const inputClass = "w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cobalt";
const textareaClass = "min-h-28 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-cobalt";
