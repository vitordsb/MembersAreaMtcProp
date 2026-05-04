"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function Carousel({ title, subtitle, children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Anterior"
            className="rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-2)] p-1.5 text-neutral-300 hover:border-[color:var(--color-border)] hover:text-neutral-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Próximo"
            className="rounded-md border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-2)] p-1.5 text-neutral-300 hover:border-[color:var(--color-border)] hover:text-neutral-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {children}
      </div>
    </section>
  );
}
