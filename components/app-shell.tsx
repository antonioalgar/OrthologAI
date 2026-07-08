"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Command, LogOut, Plus, Search, Sparkles } from "lucide-react";
import { navItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase?.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-black/5 bg-porcelain/80 px-4 py-5 backdrop-blur-2xl lg:block">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
          <div className="grid size-10 place-items-center rounded-lg bg-ink text-white shadow-soft">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">OrthoLog AI</p>
            <p className="text-xs text-graphite">Segundo cerebro quirúrgico</p>
          </div>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                  active ? "bg-white text-ink shadow-hairline" : "text-graphite hover:bg-white/70 hover:text-ink"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-4 bottom-5 rounded-lg border border-line bg-white/80 p-4">
          <p className="text-sm font-semibold">Sprint 1</p>
          <p className="mt-1 text-xs leading-5 text-graphite">
            Foco actual: registrar cirugías reales y volver a encontrarlas.
          </p>
          <button onClick={signOut} className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-cobalt">
            <LogOut className="size-3.5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-black/5 bg-porcelain/78 backdrop-blur-2xl lg:ml-72">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="grid size-9 place-items-center rounded-lg bg-ink text-white">
              <Sparkles className="size-4" />
            </div>
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-white/80 px-3 py-2 text-sm text-graphite">
            <Search className="size-4 shrink-0" />
            <span className="truncate">Buscar cirugías, perlas, implantes...</span>
            <kbd className="ml-auto hidden rounded border border-line px-1.5 py-0.5 text-[11px] sm:inline-flex">
              ⌘K
            </kbd>
          </div>
          <button className="hidden rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink sm:inline-flex">
            <Command className="mr-2 size-4" />
            Comando
          </button>
          <button className="grid size-10 place-items-center rounded-md border border-line bg-white text-graphite">
            <Bell className="size-4" />
          </button>
          <Link href="/surgeries/new" className="grid size-10 place-items-center rounded-md bg-ink text-white shadow-soft">
            <Plus className="size-4" />
          </Link>
        </div>
      </header>

      <main className="pb-24 lg:ml-72">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</div>
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1 rounded-xl border border-line bg-white/90 p-1 shadow-soft backdrop-blur-xl lg:hidden">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium",
                active ? "bg-ink text-white" : "text-graphite"
              )}
            >
              <Icon className="size-4" />
              <span className="max-w-full truncate">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
