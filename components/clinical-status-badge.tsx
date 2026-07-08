import type { ComponentType } from "react";
import { AlertCircle, CheckCircle2, CircleDashed, Hourglass, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  clinicalStatusLabels,
  getClinicalStatus,
  getClinicalStatusDescription,
  type ClinicalStatus
} from "@/lib/surgeries/evolution";
import type { Surgery } from "@/lib/surgeries/types";

const statusConfig: Record<
  ClinicalStatus,
  {
    tone: "neutral" | "green" | "orange" | "red";
    icon: ComponentType<{ className?: string }>;
    label: string;
  }
> = {
  incomplete: { tone: "neutral", icon: CircleDashed, label: clinicalStatusLabels.incomplete },
  followup: { tone: "orange", icon: Hourglass, label: clinicalStatusLabels.followup },
  closed: { tone: "green", icon: CheckCircle2, label: clinicalStatusLabels.closed },
  active_complication: { tone: "red", icon: TriangleAlert, label: clinicalStatusLabels.active_complication }
};

export function ClinicalStatusBadge({ surgery, status }: { surgery?: Surgery; status?: ClinicalStatus }) {
  const clinicalStatus = status ?? (surgery ? getClinicalStatus(surgery) : "incomplete");
  const config = statusConfig[clinicalStatus];
  const Icon = config.icon;

  return (
    <Badge tone={config.tone} className="gap-1.5">
      <Icon className="size-3.5" />
      {config.label}
    </Badge>
  );
}

export function ClinicalStatusSummary({ surgery }: { surgery: Surgery }) {
  const status = getClinicalStatus(surgery);
  const config = statusConfig[status];
  const Icon = status === "incomplete" ? AlertCircle : config.icon;

  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-md bg-mist text-graphite">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-graphite/70">Estado clinico</p>
          <div className="mt-2">
            <ClinicalStatusBadge status={status} />
          </div>
          <p className="mt-3 text-sm leading-6 text-graphite">{getClinicalStatusDescription(status)}</p>
        </div>
      </div>
    </div>
  );
}
