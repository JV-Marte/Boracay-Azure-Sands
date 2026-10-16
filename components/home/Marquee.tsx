const moments = [
  "White Beach at golden hour",
  "Kitchens in every suite",
  "Paraw sailing off Station 2",
  "A pool for the slow hours",
  "Fiber Wi-Fi and a real desk",
  "Transfers from Caticlan",
  "Balconies that catch the breeze",
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {moments.map((moment, i) => (
        <li key={moment} className="flex items-center">
          <span
            className={
              i % 2 === 0
                ? "text-ink-900"
                : "text-transparent [-webkit-text-stroke:1.5px_var(--color-sand-400)]"
            }
          >
            {moment}
          </span>
          <span className="mx-8 inline-block size-3 rounded-full bg-ocean-400 sm:mx-12" aria-hidden />
        </li>
      ))}
    </ul>
  );
}

/** Infinite typographic marquee. Pauses on hover; static under reduced motion. */
export function Marquee() {
  return (
    <section aria-label="Life at Azure Sands" className="marquee overflow-hidden border-y border-sand-200 py-10 md:py-14">
      <div className="marquee-track flex w-max whitespace-nowrap text-[clamp(2.25rem,5.5vw,4.75rem)] font-medium leading-none tracking-[-0.04em]">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
