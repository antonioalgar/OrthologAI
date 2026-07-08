"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createBrowserSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const configured = hasSupabaseConfig();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage("Faltan variables de Supabase.");
      setLoading(false);
      return;
    }

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-ink text-white">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="font-semibold">OrthoLog AI</p>
            <p className="text-sm text-graphite">Registro quirúrgico personal</p>
          </div>
        </Link>

        <h1 className="text-2xl font-semibold">{mode === "login" ? "Entrar" : "Crear cuenta"}</h1>
        <p className="mt-2 text-sm leading-6 text-graphite">
          Sprint 1 usa Supabase Auth para que tus cirugías queden asociadas a tu usuario.
        </p>

        {!configured ? (
          <div className="mt-6 rounded-lg border border-line bg-mist p-4 text-sm text-graphite">
            Configura primero `.env.local` con las variables de Supabase.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Email
              <input
                className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 outline-none focus:border-cobalt"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label className="block text-sm font-medium">
              Contraseña
              <input
                className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 outline-none focus:border-cobalt"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
              />
            </label>
            {message ? <p className="text-sm text-ember">{message}</p> : null}
            <Button className="w-full" variant="primary">
              {loading ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
            </Button>
          </form>
        )}

        <button
          className="mt-5 text-sm font-medium text-cobalt"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Crear cuenta nueva" : "Ya tengo cuenta"}
        </button>
      </Card>
    </main>
  );
}
