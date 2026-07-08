"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { PageHeader } from "@/components/page-header";
import { SurgeryForm } from "@/components/surgery-form";
import { Card } from "@/components/ui/card";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Surgery } from "@/lib/surgeries/types";

export default function EditSurgeryPage() {
  return (
    <AuthGate>
      <EditSurgery />
    </AuthGate>
  );
}

function EditSurgery() {
  const params = useParams<{ surgeryId: string }>();
  const [surgery, setSurgery] = useState<Surgery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from("surgeries")
      .select("*")
      .eq("id", params.surgeryId)
      .single()
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message);
        setSurgery((data ?? null) as Surgery | null);
        setLoading(false);
      });
  }, [params.surgeryId]);

  if (loading) {
    return <Card>Cargando cirugia...</Card>;
  }

  if (error || !surgery) {
    return <Card className="text-sm text-ember">{error || "No se encontro la cirugia."}</Card>;
  }

  return (
    <>
      <PageHeader
        eyebrow="Editar cirugia"
        title={surgery.procedure}
        description="Modifica los datos del caso sin alterar sus imagenes asociadas."
      />
      <SurgeryForm mode="edit" initialSurgery={surgery} />
    </>
  );
}
