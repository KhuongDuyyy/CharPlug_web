"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils/cn";
import { useMockApp } from "@/providers/mock-app-provider";

export function Dialog({
  open,
  onClose,
  children,
  variant = "center",
  className
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  variant?: "center" | "bottom";
  className?: string;
}) {
  const { t } = useMockApp();

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 cp-fade-in">
      <button
        aria-label={t("common_close")}
        className="absolute inset-0 h-full w-full bg-[rgba(15,23,42,0.24)]"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute left-1/2 w-[calc(100%-24px)] max-w-md -translate-x-1/2 rounded-sheet border border-border bg-background shadow-glass",
          variant === "center" ? "top-1/2 -translate-y-1/2 px-5 py-5" : "bottom-0 cp-slide-up rounded-b-none px-5 pb-[max(20px,var(--cp-safe-bottom))] pt-5",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
