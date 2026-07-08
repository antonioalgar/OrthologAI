import { cn } from "@/lib/utils";

const tones = {
  neutral: "border-line bg-white text-graphite",
  blue: "border-blue-200 bg-blue-50 text-cobalt",
  green: "border-green-200 bg-green-50 text-moss",
  orange: "border-orange-200 bg-orange-50 text-ember",
  red: "border-red-200 bg-red-50 text-red-700",
  dark: "border-ink bg-ink text-white"
};

export function Badge({
  children,
  tone = "neutral",
  className
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
