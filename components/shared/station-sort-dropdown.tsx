"use client";

import { useMemo, useState } from "react";

import { AnchoredPopover } from "@/components/shared/anchored-popover";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import type { StationSort } from "@/lib/types/app";
import { cn } from "@/lib/utils/cn";

type StationSortOption = {
  iconName: "location.fill" | "tag.fill" | "star.fill";
  key: StationSort;
  subtitle: string;
  title: string;
};

export function StationSortDropdown({
  onChange,
  options,
  value
}: {
  onChange: (value: StationSort) => void;
  options: StationSortOption[];
  value: StationSort;
}) {
  const [anchor, setAnchor] = useState<{
    height: number;
    width: number;
    x: number;
    y: number;
  } | null>(null);

  const activeOption = useMemo(
    () => options.find((option) => option.key === value) ?? options[0],
    [options, value]
  );

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setAnchor({
            height: rect.height,
            width: rect.width,
            x: rect.x,
            y: rect.y
          });
        }}
        className="cp-press flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2"
      >
        <IconSymbol name={activeOption.iconName} size={16} color="var(--cp-accent)" />
        <Typography as="span" className="font-semibold text-muted">
          {activeOption.title}
        </Typography>
        <IconSymbol name="chevron.down" size={16} color="var(--cp-muted)" />
      </button>

      <AnchoredPopover
        open={Boolean(anchor)}
        anchor={anchor}
        onClose={() => setAnchor(null)}
      >
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => {
                onChange(option.key);
                setAnchor(null);
              }}
              className="cp-press flex w-full items-start justify-between gap-3 rounded-2xl border border-border px-4 py-3 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft">
                  <IconSymbol name={option.iconName} size={16} color="var(--cp-accent)" />
                </div>
                <div className="space-y-1">
                  <Typography className="font-semibold">{option.title}</Typography>
                  <Typography className="text-muted">{option.subtitle}</Typography>
                </div>
              </div>
              <div
                className={cn(
                  "mt-1 h-2.5 w-2.5 rounded-full",
                  option.key === value ? "bg-accent" : "bg-border"
                )}
              />
            </button>
          ))}
        </div>
      </AnchoredPopover>
    </>
  );
}
