"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Surgery } from "@/lib/surgeries/types";

export function SurgeryAttention({ surgery, onChange }: { surgery: Surgery; onChange: (surgery: Surgery) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function markForAttention() {
    if (saving) return;
    setSaving(true);
    setMessage("");

    const now = new Date().toISOString();
    const updated = await updateAttention({
      attention_required: true,
      attention_reason: reason.trim() || null,
      attention_created_at: now,
      attention_resolved_at: null
    });

    if (updated) {
      onChange(updated);
      setShowForm(false);
      setReason("");
    }
    setSaving(false);
  }

  async function resolveAttention() {
    if (saving) return;
    setSaving(true);
    setMessage("");

    const updated = await updateAttention({
      attention_required: false,
      attention_resolved_at: new Date().toISOString()
    });

    if (updated) onChange(updated);
    setSaving(false);
  }

  async function updateAttention(values: Partial<Surgery>) {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage("Supabase no está configurado.");
      return null;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setMessage(userError?.message ?? "No hay usuario autenticado.");
      return null;
    }

    const { data, error } = await supabase
      .from("surgeries")
      .update(values)
      .eq("id", surgery.id)
      .eq("user_id", userData.user.id)
      .select("*")
      .single();

    if (error) {
      setMessage(error.message);
      return null;
    }

    return data as Surgery;
  }

  if (surgery.attention_required) {
    return (
      <Card className="border-orange-200 bg-orange-50/60">
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-md bg-white text-ember">
            <AlertTriangle className="size-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ember">Requiere atención</p>
            {surgery.attention_reason ? <p className="mt-2 text-sm leading-6 text-ink">{surgery.attention_reason}</p> : <p className="mt-2 text-sm text-graphite">Sin motivo registrado.</p>}
          </div>
        </div>
        {message ? <p className="mt-3 text-xs text-red-700">{message}</p> : null}
        <button type="button" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-moss disabled:opacity-60" onClick={resolveAttention} disabled={saving}>
          <CheckCircle2 className="size-4" />
          {saving ? "Resolviendo..." : "Resolver alerta"}
        </button>
      </Card>
    );
  }

  return (
    <Card>
      {!showForm ? (
        <button type="button" className="inline-flex w-full items-center gap-2 text-left text-sm font-semibold text-ink" onClick={() => { setShowForm(true); setMessage(""); }}>
          <AlertTriangle className="size-4 text-graphite" />
          Marcar para atención
        </button>
      ) : (
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-ember" />
            <h2 className="font-semibold text-ink">Marcar para atención</h2>
          </div>
          <label className="mt-3 block text-xs font-medium text-graphite">
            Motivo opcional
            <textarea
              className="mt-2 min-h-20 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-cobalt"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Ej. Vigilar herida"
              maxLength={240}
            />
          </label>
          {message ? <p className="mt-2 text-xs text-red-700">{message}</p> : null}
          <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" className="rounded-md border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink disabled:opacity-60" onClick={() => { setShowForm(false); setReason(""); setMessage(""); }} disabled={saving}>Cancelar</button>
            <button type="button" className="rounded-md bg-ink px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-60" onClick={markForAttention} disabled={saving}>{saving ? "Guardando..." : "Guardar alerta"}</button>
          </div>
        </div>
      )}
    </Card>
  );
}
