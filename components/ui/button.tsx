import { cn } from "@/lib/utils";

export function Button({
  children,
  variant = "primary",
  className
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition hover:-translate-y-0.5",
        variant === "primary" && "bg-ink text-white shadow-soft",
        variant === "secondary" && "border border-line bg-white text-ink",
        variant === "ghost" && "text-graphite hover:bg-white",
        className
      )}
    >
      {children}
    </button>
  );
}
