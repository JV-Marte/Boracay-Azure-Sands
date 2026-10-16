import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-4xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "flex items-center gap-3 text-sm font-medium text-stone-500",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-8 bg-ocean-400" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-4 font-display text-[clamp(2.25rem,4.2vw,3.75rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ink-900 text-balance">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-stone-500 [text-align:inherit]">
          {description}
        </p>
      )}
    </div>
  );
}
