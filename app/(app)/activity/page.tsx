import { ActivityLogbook } from "@/components/activity-logbook";
import { AuthGate } from "@/components/auth-gate";
import { PageHeader } from "@/components/page-header";

export default function ActivityPage() {
  return (
    <AuthGate>
      <PageHeader eyebrow="Logbook quirúrgico" title="Actividad" description="Qué has hecho como cirujano: casos, roles y procedimientos estructurados." />
      <ActivityLogbook />
    </AuthGate>
  );
}
