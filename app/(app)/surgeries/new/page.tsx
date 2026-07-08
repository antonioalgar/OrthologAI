import { AuthGate } from "@/components/auth-gate";
import { PageHeader } from "@/components/page-header";
import { SurgeryForm } from "@/components/surgery-form";

export default function NewSurgeryPage() {
  return (
    <AuthGate>
      <PageHeader
        eyebrow="Nueva cirugía"
        title="Registra una cirugía real en menos de dos minutos."
        description="Solo fecha y procedimiento son obligatorios. Todo lo demás puede quedar como contexto útil para revisar después."
      />
      <SurgeryForm />
    </AuthGate>
  );
}
