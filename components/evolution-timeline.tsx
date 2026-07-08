import { CalendarClock, CheckCircle2, Circle } from "lucide-react";
import { getEvolutionEvents } from "@/lib/surgeries/evolution";
import type { Surgery } from "@/lib/surgeries/types";
import { cn } from "@/lib/utils";

export function EvolutionTimeline({ surgery }: { surgery: Surgery }) {
  const events = getEvolutionEvents(surgery);

  return (
    <div className="rounded-lg border border-line bg-white px-5 py-6">
      <div className="space-y-0">
        {events.map((event, index) => {
          const Icon = event.isCompleted ? CheckCircle2 : Circle;

          return (
            <div key={event.key} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-4">
              <div className="relative flex justify-center">
                <span
                  className={cn(
                    "mt-1 grid size-5 place-items-center rounded-full bg-white",
                    event.isCompleted ? "text-moss" : "text-ember"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                {index < events.length - 1 ? <span className="absolute bottom-0 top-7 w-px bg-line" /> : null}
              </div>

              <article className={cn("pb-8", index === events.length - 1 && "pb-0")}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink">{event.title}</h3>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
                          event.isCompleted ? "bg-green-50 text-moss" : "bg-orange-50 text-ember"
                        )}
                      >
                        {event.isCompleted ? "Completado" : "Pendiente"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-graphite">{event.clinicalState}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-sm text-graphite">
                    <CalendarClock className="size-4" />
                    {formatDate(event.date)}
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-sm leading-6">
                  <p className="text-ink">{event.notes}</p>
                  <p className="text-graphite">
                    <span className="font-medium text-ink">Proximos pasos: </span>
                    {event.nextSteps}
                  </p>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}
