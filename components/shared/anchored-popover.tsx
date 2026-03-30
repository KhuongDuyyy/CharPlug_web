"use client";

import { useEffect, useMemo, useRef } from "react";

import { cn } from "@/lib/utils/cn";

type AnchorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function AnchoredPopover({
  open,
  anchor,
  onClose,
  children,
  className
}: {
  open: boolean;
  anchor: AnchorRect | null;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [onClose, open]);

  const style = useMemo(() => {
    if (!anchor) return undefined;

    const panelWidth = 320;
    const left = Math.min(
      Math.max(anchor.x + anchor.width - panelWidth, 12),
      window.innerWidth - panelWidth - 12
    );
    const top = Math.min(anchor.y + anchor.height + 10, window.innerHeight - 16);

    return {
      left,
      top
    };
  }, [anchor]);

  if (!open || !anchor || !style) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        ref={panelRef}
        className={cn(
          "absolute w-[min(320px,calc(100vw-24px))] rounded-card border border-border bg-background px-5 py-5 shadow-glass cp-fade-in",
          className
        )}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}
