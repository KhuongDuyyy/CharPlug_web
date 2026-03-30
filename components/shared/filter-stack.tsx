"use client";

import { useEffect, useRef } from "react";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils/cn";

type FilterKey = string | null;

type FilterChip = {
  key: string;
  label: string;
  value: string | null;
  options: string[];
  onSelect: (value: string | null) => void;
};

export function FilterStack({
  chips,
  clearLabel,
  openFilter,
  setOpenFilter
}: {
  chips: FilterChip[];
  clearLabel: string;
  openFilter: FilterKey;
  setOpenFilter: (value: FilterKey) => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openFilter) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [openFilter, setOpenFilter]);

  return (
    <div ref={rootRef} className="relative z-40 space-y-2">
      <div className="grid grid-cols-2 gap-3">
        {chips.map((chip) => {
          const active = openFilter === chip.key || Boolean(chip.value);
          return (
            <div key={chip.key} className="relative min-w-0">
              <button
                type="button"
                onClick={() => setOpenFilter(openFilter === chip.key ? null : chip.key)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border-2 px-3 py-2.5 text-left",
                  active ? "border-accent bg-accent-soft" : "border-border bg-surface-alt"
                )}
              >
                <Typography className={cn("truncate font-medium", active ? "text-foreground" : "text-muted-light")}>
                  {chip.value ?? chip.label}
                </Typography>
                <div className="rotate-90">
                  <IconSymbol
                    name="chevron.right"
                    size={16}
                    color={active ? "var(--cp-foreground)" : "var(--cp-muted)"}
                  />
                </div>
              </button>

              {openFilter === chip.key ? (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-glass">
                  <button
                    type="button"
                    onClick={() => {
                      chip.onSelect(null);
                      setOpenFilter(null);
                    }}
                    className="w-full px-4 py-3 text-left"
                  >
                    <Typography className="text-muted-light">{clearLabel}</Typography>
                  </button>
                  {chip.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        chip.onSelect(option);
                        setOpenFilter(null);
                      }}
                      className="w-full px-4 py-3 text-left"
                    >
                      <Typography>{option}</Typography>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
