"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AlertCircle, LogIn } from "lucide-react";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = hasSupabaseConfig();

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setUser(data.session?.user ?? null);
      })
      .finally(() => setLoading(false));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (!configured) {
    return (
      <SetupPanel
        title="Supabase no esta configurado"
        description="Anade tus variables en .env.local y ejecuta la migracion SQL incluida para empezar a guardar cirugias reales."
        showSetupSteps
      />
    );
  }

  if (loading) {
    return <div className="paper-panel rounded-lg p-6 text-sm text-graphite">Cargando sesion...</div>;
  }

  if (!user) {
    return (
      <SetupPanel
        title="Inicia sesion para usar OrthoLog AI"
        description="Supabase esta configurado correctamente. Este navegador necesita iniciar sesion porque el acceso por IP no comparte la sesion de localhost."
        action={
          <Link href="/login">
            <Button>
              <LogIn className="size-4" />
              Entrar
            </Button>
          </Link>
        }
      />
    );
  }

  return children;
}

function SetupPanel({
  title,
  description,
  showSetupSteps = false,
  action
}: {
  title: string;
  description: string;
  showSetupSteps?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <Card className="mx-auto mt-10 max-w-2xl">
      <div className="flex gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-orange-50 text-ember">
          <AlertCircle className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-ink">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-graphite">{description}</p>
          {showSetupSteps ? (
            <div className="mt-5 rounded-lg border border-line bg-mist p-4 text-sm text-graphite">
              <p className="font-semibold text-ink">Pasos necesarios:</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>Copia `.env.example` a `.env.local`.</li>
                <li>Rellena `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.</li>
                <li>Ejecuta `supabase/migrations/0001_sprint1_surgeries.sql` en Supabase SQL Editor.</li>
              </ol>
            </div>
          ) : null}
          {action ? <div className="mt-5">{action}</div> : null}
        </div>
      </div>
    </Card>
  );
}
