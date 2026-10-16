import { cn } from "@/lib/utils";

interface TypeMarqueeProps {
  items: readonly string[];
  /** Accessible name for the strip. */
  label: string;
  className?: string;
  /** Type size and tracking for the moving row. */
  textClassName?: string;
  /** Even items render solid, odd items outlined. */
  solidClassName: string;
  outlineClassName: string;
  dotClassName: string;
}

function Row({
  items,
  hidden,
  solidClassName,
  outlineClassName,
  dotClassName,
}: Omit<TypeMarqueeProps, "label" | "className" | "textClassName"> & { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={item} className="flex items-center">
          <span className={i % 2 === 0 ? solidClassName : outlineClassName}>{item}</span>
          <span
            className={cn("mx-8 inline-block size-3 shrink-0 rounded-full sm:mx-12", dotClassName)}
            aria-hidden
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * Infinite typographic marquee. The row is rendered twice and the track slides
 * by half its width, so the loop is seamless. Pauses on hover; static under
 * reduced motion (see .marquee-track in globals.css).
 */
export function TypeMarquee({
  items,
  label,
  className,
  textClassName = "text-[clamp(2.25rem,5.5vw,4.75rem)] font-medium leading-none tracking-[-0.04em]",
  ...rowProps
}: TypeMarqueeProps) {
  return (
    <section aria-label={label} className={cn("marquee overflow-hidden", className)}>
      <div className={cn("marquee-track flex w-max whitespace-nowrap", textClassName)}>
        <Row items={items} {...rowProps} />
        <Row items={items} hidden {...rowProps} />
      </div>
    </section>
  );
}
