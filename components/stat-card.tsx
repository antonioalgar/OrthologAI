import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon
}: {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-graphite">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
          <p className="mt-1 text-xs font-medium text-moss">{delta}</p>
        </div>
        <div className="grid size-10 place-items-center rounded-lg bg-mist text-ink">
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}
