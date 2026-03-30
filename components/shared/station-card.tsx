import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import type { Station } from "@/lib/types/app";
import { cn } from "@/lib/utils/cn";

export function StationCard({
  station,
  availabilityLabel,
  distanceLabel,
  onOpen,
  onOffers,
  onDirections
}: {
  station: Station;
  availabilityLabel: string;
  distanceLabel: string;
  onOpen: () => void;
  onOffers: () => void;
  onDirections: () => void;
}) {
  const availableCount = station.sockets.filter((socket) => socket.status === "available").length;
  const hasAvailable = availableCount > 0;

  return (
    <button
      onClick={onOpen}
      className="cp-press relative w-full rounded-card border border-border bg-surface px-4 py-4 text-left shadow-soft"
    >
      <div
        className="pointer-events-none absolute left-4 right-4 top-0 h-px rounded-full"
        style={{ background: "var(--cp-accent)" }}
      />
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <Typography as="div" variant="overline" className="truncate font-semibold">
              {station.name}
            </Typography>
            <Typography className="line-clamp-2 text-[color:var(--cp-foreground)]/80">{station.address}</Typography>
          </div>
          <div className="flex items-center gap-1 rounded-full border px-3 py-1.5" style={{ background: "var(--cp-accent-soft)", borderColor: "var(--cp-border)" }}>
            <IconSymbol name="star.fill" size={14} color="var(--cp-accent)" />
            <Typography as="span" className="font-semibold text-accent">
              {station.rating.toFixed(1)}
            </Typography>
          </div>
        </div>

        {station.description ? (
          <Typography className="line-clamp-2 text-[color:var(--cp-foreground)]/70">{station.description}</Typography>
        ) : null}

        {station.vouchers.length > 0 ? (
          <div className="space-y-2">
            {station.vouchers.map((voucher) => (
              <button
                key={voucher.id}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOffers();
                }}
                className="flex w-full items-center gap-2 rounded-[18px] border px-3 py-2 text-left"
                style={{ background: "var(--cp-accent-soft)", borderColor: "var(--cp-border)" }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(244,114,182,0.18)]">
                  <IconSymbol name="tag.fill" size={14} color="var(--cp-accent)" />
                </div>
                <Typography as="span" className="flex-1 font-semibold text-accent">
                  {voucher.label}
                </Typography>
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <div
            className={cn(
              "flex items-center gap-2 rounded-full border px-2.5 py-1.5",
              hasAvailable ? "border-available bg-available-soft" : "border-danger bg-danger-soft"
            )}
          >
            <div className={cn("h-2 w-2 rounded-full", hasAvailable ? "bg-available" : "bg-danger")} />
            <Typography as="span" variant="caption" className={cn("font-semibold", hasAvailable ? "text-available" : "text-danger")}>
              {availabilityLabel}
            </Typography>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDirections();
            }}
            className="flex items-center gap-2 rounded-full border px-3 py-2"
            style={{ background: "var(--cp-accent-soft)", borderColor: "var(--cp-border)" }}
          >
            <IconSymbol name="location.fill" size={16} color="var(--cp-accent)" />
            <Typography as="span" className="font-semibold text-accent">
              {distanceLabel}
            </Typography>
            <IconSymbol name="chevron.right" size={16} color="var(--cp-accent)" />
          </button>
        </div>
      </div>
    </button>
  );
}
