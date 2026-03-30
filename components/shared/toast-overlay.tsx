"use client";

import { useEffect } from "react";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";

export function ToastOverlay({
  open,
  title,
  message,
  tone,
  onClose
}: {
  open: boolean;
  title: string;
  message?: string;
  tone: "success" | "danger";
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const timeout = window.setTimeout(onClose, 2600);
    return () => window.clearTimeout(timeout);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <button
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(15,23,42,0.08)] px-5 dark:bg-[rgba(2,6,23,0.34)]"
      onClick={onClose}
    >
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface-full px-5 py-5 shadow-glass">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className={`flex h-14 w-14 items-center justify-center rounded-full ${tone === "success" ? "bg-available" : "bg-danger"}`}>
            <IconSymbol name={tone === "success" ? "checkmark.circle.fill" : "exclamationmark.triangle.fill"} size={24} color="white" />
          </div>
          <div className="space-y-1">
            <Typography variant="body" className={tone === "success" ? "font-semibold text-available" : "font-semibold text-danger"}>
              {title}
            </Typography>
            {message ? <Typography>{message}</Typography> : null}
          </div>
        </div>
      </div>
    </button>
  );
}
