import { TypeMarquee } from "@/components/motion/TypeMarquee";

const moments = [
  "White Beach at golden hour",
  "Kitchens in every suite",
  "Paraw sailing off Station 2",
  "A pool for the slow hours",
  "Fiber Wi-Fi and a real desk",
  "Transfers from Caticlan",
  "Balconies that catch the breeze",
  "A cafe and a gym downstairs",
];

export function Marquee() {
  return (
    <TypeMarquee
      items={moments}
      label="Life at Azure Sands"
      className="border-y border-sand-200 py-10 md:py-14"
      solidClassName="text-ink-900"
      outlineClassName="text-transparent [-webkit-text-stroke:1.5px_var(--color-sand-400)]"
      dotClassName="bg-ocean-400"
    />
  );
}
