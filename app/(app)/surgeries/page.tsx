import { AuthGate } from "@/components/auth-gate";
import { PageHeader } from "@/components/page-header";
import { SurgeriesClient } from "@/components/surgeries-client";

export default function SurgeriesPage() {
  return (
    <AuthGate>
      <PageHeader
        eyebrow="Registro quirúrgico"
        title="Tus cirugías reales, persistidas."
        description="Listado funcional conectado a Supabase. En este sprint buscamos utilidad diaria antes que filtros avanzados."
      />
      <SurgeriesClient />
    </AuthGate>
  );
}
