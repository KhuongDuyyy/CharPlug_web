import { Typography } from "@/components/ui/typography";

export function LoadingBlock({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-border bg-surface px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <Typography>{text}</Typography>
      </div>
    </div>
  );
}
