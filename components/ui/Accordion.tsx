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
    <div className={cn("divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white", className)}>
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
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium text-stone-900 transition-colors hover:bg-sand-50"
              >
                {item.question}
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-stone-400 transition-transform duration-200",
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
              className="px-5 pb-5 text-[15px] leading-relaxed text-stone-600"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
