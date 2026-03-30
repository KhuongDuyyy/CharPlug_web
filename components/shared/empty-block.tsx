import { Typography } from "@/components/ui/typography";

export function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-border bg-surface px-4 py-8 text-center">
      <Typography className="text-muted">{text}</Typography>
    </div>
  );
}
