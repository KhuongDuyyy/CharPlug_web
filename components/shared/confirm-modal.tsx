"use client";

import { IconSymbol, type IconSymbolName } from "@/components/ui/icon-symbol";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";

export function ConfirmModal({
  open,
  title,
  description,
  rows,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = "center",
  busy = false,
  busyLabel,
  icon
}: {
  open: boolean;
  title: string;
  description?: string;
  rows: Array<{ label: string; value: string }>;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "center" | "bottom";
  busy?: boolean;
  busyLabel?: string;
  icon?: IconSymbolName;
}) {
  return (
    <Dialog open={open} onClose={onCancel} variant={variant}>
      <div className="space-y-5">
        <div className="space-y-3 text-center">
          {icon ? (
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
              <IconSymbol name={icon} size={22} color="var(--cp-accent)" />
            </div>
          ) : null}
          <Typography as="h3" variant="heading">
            {title}
          </Typography>
          {description ? <Typography className="text-muted">{description}</Typography> : null}
        </div>

        <div className="space-y-3 rounded-card bg-surface px-4 py-4">
          {rows.map((row, index) => (
            <div key={`${row.label}-${index}`} className="space-y-3">
              {index > 0 ? <div className="h-px bg-divider" /> : null}
              <div className="flex items-center justify-between gap-4">
                <Typography className="text-muted-light">{row.label}</Typography>
                <Typography as="span" className="text-right font-semibold">
                  {row.value}
                </Typography>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <Button onClick={onConfirm} disabled={busy}>
            {busy ? busyLabel ?? confirmLabel : confirmLabel}
          </Button>
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
