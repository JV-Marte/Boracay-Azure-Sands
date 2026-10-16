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
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-ocean-600">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-3.5 text-base leading-relaxed text-stone-500 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
