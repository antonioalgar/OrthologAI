import { cn } from "@/lib/utils";

export function SurgeryBlock({
  title,
  children,
  className
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-t border-line py-7 first:border-t-0 first:pt-0", className)}>
      <h2 className="mb-4 text-xl font-semibold tracking-normal text-ink">{title}</h2>
      {children}
    </section>
  );
}

export function FieldGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-line bg-white/70 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-graphite/60">{item.label}</p>
          <p className="mt-1 text-sm font-medium text-ink">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
