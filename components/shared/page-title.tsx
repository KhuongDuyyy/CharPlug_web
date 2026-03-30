import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils/cn";

export function PageTitle({
  title,
  right,
  className,
  titleClassName,
  showDivider = true
}: {
  title: string;
  right?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  showDivider?: boolean;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <Typography as="h1" variant="heading" className={cn("truncate text-accent", titleClassName)}>
            {title}
          </Typography>
        </div>
        {right}
      </div>
      {showDivider ? (
        <div className="h-0.5 overflow-hidden rounded-full bg-[linear-gradient(90deg,var(--cp-accent),transparent)]" />
      ) : null}
    </div>
  );
}
