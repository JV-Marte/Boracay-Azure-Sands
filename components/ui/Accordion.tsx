"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className={cn("divide-y divide-sand-200 border-y border-sand-200", className)}>
      {items.map((item, i) => {
        const open = openIndex === i;
        const headerId = `${baseId}-h-${i}`;
        const panelId = `${baseId}-p-${i}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium text-ink-900 transition-colors hover:text-ocean-700"
              >
                {item.question}
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-stone-400 transition-transform duration-300",
                    open && "rotate-180 text-ocean-600",
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!open}
              className="max-w-2xl pb-7 text-base leading-relaxed text-stone-600"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
