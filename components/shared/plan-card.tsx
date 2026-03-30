import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { formatCurrencyVnd, formatDuration } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { ChargingPlan } from "@/lib/types/app";

export function PlanCard({
  plan,
  actionLabel,
  actionClassName,
  actionTextClassName,
  disabled,
  showActionIcon = true,
  onClick,
  t
}: {
  plan: ChargingPlan;
  actionLabel: string;
  actionClassName?: string;
  actionTextClassName?: string;
  disabled?: boolean;
  showActionIcon?: boolean;
  onClick: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="space-y-3 rounded-card border border-border bg-surface p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-success-soft">
          <IconSymbol name="bolt.fill" size={22} color="var(--cp-success)" />
        </div>
        <div className="flex-1 space-y-1">
          <Typography as="div" className="font-semibold">
            {plan.name}
          </Typography>
          {plan.isPopular ? <Typography as="div" className="text-accent">★ {t("plan_popular")}</Typography> : null}
        </div>
        <Typography as="div">{formatCurrencyVnd(plan.priceVnd)}</Typography>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2 rounded-2xl border border-border bg-input p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-info-soft">
              <IconSymbol name="clock.fill" size={16} color="var(--cp-info)" />
            </div>
            <Typography as="span" className="text-muted-light">
              {t("products_duration")}
            </Typography>
          </div>
          <Typography>{formatDuration(plan.durationMinutes, t)}</Typography>
        </div>
        <div className="space-y-2 rounded-2xl border border-border bg-input p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-success-soft">
              <IconSymbol name="bolt.fill" size={16} color="var(--cp-success)" />
            </div>
            <Typography as="span" className="text-muted-light">
              {t("products_energy")}
            </Typography>
          </div>
          <Typography>{plan.energyKwh} kWh</Typography>
        </div>
      </div>

      <button
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "cp-press flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-semibold disabled:opacity-60",
          actionClassName ?? "bg-accent text-on-accent"
        )}
      >
        {showActionIcon ? <IconSymbol name="bolt.fill" size={18} color="white" /> : null}
        <span className={actionTextClassName}>{actionLabel}</span>
      </button>
    </div>
  );
}
