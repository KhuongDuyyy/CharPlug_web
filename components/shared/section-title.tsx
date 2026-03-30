import { IconSymbol, type IconSymbolName } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils/cn";

export function SectionTitle({
  title,
  icon,
  className
}: {
  title: string;
  icon: IconSymbolName;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface">
        <IconSymbol name={icon} size={14} color="var(--cp-accent)" />
      </div>
      <Typography as="h2" variant="heading" className="text-accent">
        {title}
      </Typography>
    </div>
  );
}
