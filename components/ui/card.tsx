import { cn } from "@/lib/utils";

export function Card({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("paper-panel rounded-lg p-5", className)}>{children}</section>;
}

export function SectionTitle({
  eyebrow,
  title,
  action
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-graphite/70">{eyebrow}</p> : null}
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}
