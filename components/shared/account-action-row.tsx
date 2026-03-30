import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils/cn";

export function AccountActionRow({
  title,
  description,
  locked,
  onClick
}: {
  title: string;
  description: string;
  locked?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "cp-press flex w-full items-center justify-between rounded-2xl bg-surface p-4 text-left",
        locked && "opacity-70"
      )}
    >
      <div className="flex-1 space-y-1 pr-3">
        <Typography as="div" className="font-semibold">
          {title}
        </Typography>
        <Typography as="div" className="text-muted">
          {description}
        </Typography>
      </div>
      <IconSymbol name="chevron.right" size={18} color="var(--cp-muted)" />
    </button>
  );
}
