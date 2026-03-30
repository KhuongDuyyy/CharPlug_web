import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import type { ChargingSession } from "@/lib/types/app";
import { formatCountdown } from "@/lib/utils/format";

export function SessionCard({
  session,
  statusLabel,
  tone,
  message,
  pendingStart = false,
  showRetry = false,
  retryLabel,
  retryBusyLabel,
  retryBusy = false,
  onRetry,
  disableStop = false,
  onBuyMore,
  onStop,
  t
}: {
  session: ChargingSession;
  statusLabel: string;
  tone: "stable" | "warning" | "danger";
  message?: string;
  pendingStart?: boolean;
  showRetry?: boolean;
  retryLabel?: string;
  retryBusyLabel?: string;
  retryBusy?: boolean;
  onRetry?: () => void;
  disableStop?: boolean;
  onBuyMore: () => void;
  onStop: () => void;
  t: (key: string) => string;
}) {
  const toneMap = {
    stable: {
      bg: "bg-session-stable-soft",
      border: "border-session-stable",
      text: "text-session-stable",
      icon: "bolt.fill" as const
    },
    warning: {
      bg: "bg-session-warning-soft",
      border: "border-session-warning",
      text: "text-session-warning",
      icon: "clock.fill" as const
    },
    danger: {
      bg: "bg-session-danger-soft",
      border: "border-session-danger",
      text: "text-session-danger",
      icon: "exclamationmark.triangle.fill" as const
    }
  }[tone];

  return (
    <div className={`space-y-3 rounded-card border p-4 shadow-soft ${toneMap.bg} ${toneMap.border}`}>
      <div className="flex items-center justify-between gap-3">
        <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${toneMap.border}`}>
          <IconSymbol name={toneMap.icon} size={16} className={toneMap.text} />
          <Typography as="span" className={`font-semibold ${toneMap.text}`}>
            {statusLabel}
          </Typography>
        </div>
      </div>

      {message ? (
        <Typography className="text-center text-muted">{message}</Typography>
      ) : null}

      {pendingStart ? (
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent text-current" />
          {showRetry && onRetry ? (
            <button
              onClick={onRetry}
              className={`cp-press rounded-xl border px-4 py-2 font-semibold ${toneMap.border} ${toneMap.text}`}
              disabled={retryBusy}
            >
              {retryBusy ? retryBusyLabel ?? t("plans_status_pending") : retryLabel ?? t("session_retry_start_btn")}
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <Row label={t("products_duration")} value={formatCountdown(session.remainingSeconds)} />
          <Row label={t("products_energy")} value={`${session.usedEnergyKwh.toFixed(2)} kWh`} />
          {session.powerWatts ? <Row label={t("session_power")} value={`${session.powerWatts} W`} /> : null}

          {showRetry && onRetry ? (
            <button
              onClick={onRetry}
              className={`cp-press rounded-xl border px-4 py-2 font-semibold ${toneMap.border} ${toneMap.text}`}
              disabled={retryBusy}
            >
              {retryBusy ? retryBusyLabel ?? t("plans_status_pending") : retryLabel ?? t("session_retry_start_btn")}
            </button>
          ) : null}

          <div className="flex gap-3">
            <button onClick={onBuyMore} className="cp-press flex-1 rounded-xl border border-border bg-input px-4 py-2 font-semibold text-foreground">
              {t("explore_buy_more")}
            </button>
            <button
              onClick={onStop}
              disabled={disableStop}
              className="cp-press flex-1 rounded-xl border border-danger bg-input px-4 py-2 font-semibold text-danger disabled:opacity-60"
            >
              {t("session_stop_btn")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Typography className="text-muted">{label}</Typography>
      <Typography as="span" className="font-semibold">
        {value}
      </Typography>
    </div>
  );
}
