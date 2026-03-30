import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export function ErrorBlock({
  text,
  actionLabel,
  onRetry
}: {
  text: string;
  actionLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="space-y-3 rounded-3xl border border-danger bg-danger-soft px-4 py-4">
      <Typography className="text-danger">{text}</Typography>
      {actionLabel && onRetry ? (
        <Button variant="secondary" fullWidth={false} onClick={onRetry} className="border-danger text-danger">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
