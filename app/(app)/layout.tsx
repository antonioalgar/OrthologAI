import { AppShell } from "@/components/app-shell";

export default function ProtectedPrototypeLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
