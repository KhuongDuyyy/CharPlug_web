import { IconSymbol, type IconSymbolName } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import type { StationDetailBlock, StationTableCellType } from "@/lib/types/app";
import { cn } from "@/lib/utils/cn";
import { formatCurrencyVnd } from "@/lib/utils/format";

function getHeadingClasses(level: 1 | 2 | 3) {
  if (level === 1) return "text-accent";
  if (level === 2) return "text-foreground";
  return "text-muted";
}

function getTableColumnWidth(cellType: StationTableCellType) {
  if (cellType === "currency_vnd") return 144;
  if (cellType === "tag") return 180;
  if (cellType === "multiline") return 240;
  return 160;
}

function getCalloutStyles(variant: "info" | "success" | "warning" | "danger") {
  const map: Record<
    typeof variant,
    {
      container: string;
      title: string;
      body: string;
      icon: IconSymbolName;
      iconColor: string;
    }
  > = {
    info: {
      container: "border-border bg-surface",
      title: "text-accent",
      body: "text-muted",
      icon: "message.fill",
      iconColor: "var(--cp-accent)"
    },
    success: {
      container: "border-available bg-available-soft",
      title: "text-available",
      body: "text-available",
      icon: "checkmark.circle.fill",
      iconColor: "var(--cp-available)"
    },
    warning: {
      container: "border-warning bg-warning-soft",
      title: "text-warning",
      body: "text-warning",
      icon: "exclamationmark.triangle.fill",
      iconColor: "var(--cp-warning)"
    },
    danger: {
      container: "border-danger bg-danger-soft",
      title: "text-danger",
      body: "text-danger",
      icon: "exclamationmark.circle.fill",
      iconColor: "var(--cp-danger)"
    }
  };

  return map[variant];
}

function TableCell({
  cellType,
  value
}: {
  cellType: StationTableCellType;
  value: number | string | string[] | undefined;
}) {
  if (cellType === "currency_vnd" && typeof value === "number") {
    return (
      <Typography as="span" className="font-semibold text-accent">
        {formatCurrencyVnd(value)}
      </Typography>
    );
  }

  if (cellType === "tag") {
    const tags = Array.isArray(value) ? value : value ? [String(value)] : [];
    return (
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  }

  return (
    <Typography className={cn(cellType === "multiline" && "leading-6")}>
      {value ? String(value) : "--"}
    </Typography>
  );
}

function TableBlock({
  block
}: {
  block: Extract<StationDetailBlock, { type: "table" }>;
}) {
  const totalWidth = block.columns.reduce(
    (sum, column) => sum + getTableColumnWidth(column.cellType),
    0
  );

  return (
    <div className="space-y-3 rounded-card bg-surface p-4 shadow-soft">
      {block.title ? (
        <Typography as="h3" variant="overline" className="font-semibold text-accent">
          {block.title}
        </Typography>
      ) : null}

      <div className="overflow-x-auto">
        <div style={{ minWidth: totalWidth }}>
          <div className="flex rounded-t-2xl border border-border bg-accent-soft">
            {block.columns.map((column) => (
              <div
                key={`${block.id}-${column.key}-header`}
                className="border-r border-border px-3 py-3 last:border-r-0"
                style={{ width: getTableColumnWidth(column.cellType) }}
              >
                <Typography as="span" variant="caption" className="font-semibold text-accent">
                  {column.label}
                </Typography>
              </div>
            ))}
          </div>

          {block.rows.length > 0 ? (
            block.rows.map((row, rowIndex) => (
              <div
                key={`${block.id}-row-${rowIndex}`}
                className="flex border-x border-b border-border bg-surface-alt"
              >
                {block.columns.map((column) => (
                  <div
                    key={`${block.id}-${column.key}-${rowIndex}`}
                    className="flex items-center border-r border-border px-3 py-3 last:border-r-0"
                    style={{ width: getTableColumnWidth(column.cellType) }}
                  >
                    <TableCell cellType={column.cellType} value={row[column.key]} />
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="border-x border-b border-border px-3 py-4">
              <Typography className="text-muted">--</Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DocumentRenderer({
  blocks
}: {
  blocks: StationDetailBlock[];
}) {
  return (
    <div className="space-y-3">
      {blocks.map((block) => {
        if (block.type === "heading") {
          return (
            <Typography
              key={block.id}
              as="h3"
              variant="heading"
              className={cn("mt-2", getHeadingClasses(block.level))}
            >
              {block.text}
            </Typography>
          );
        }

        if (block.type === "paragraph") {
          return (
            <div key={block.id} className="rounded-card bg-surface px-5 py-5 shadow-soft">
              <Typography className="leading-6 text-muted">{block.text}</Typography>
            </div>
          );
        }

        if (block.type === "bullet_list" || block.type === "numbered_list") {
          return (
            <div key={block.id} className="space-y-3 rounded-card bg-surface px-5 py-5 shadow-soft">
              {block.items.map((item, index) => (
                <div key={`${block.id}-${index}`} className="flex items-start gap-3">
                  {block.type === "numbered_list" ? (
                    <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                      {index + 1}
                    </div>
                  ) : (
                    <div className="mt-2 h-2.5 w-2.5 rounded-full bg-accent" />
                  )}
                  <Typography className="flex-1 leading-6 text-muted">{item}</Typography>
                </div>
              ))}
            </div>
          );
        }

        if (block.type === "tag_group") {
          return (
            <div key={block.id} className="space-y-3 rounded-card bg-surface px-5 py-5 shadow-soft">
              {block.title ? (
                <Typography as="h3" variant="overline" className="font-semibold text-accent">
                  {block.title}
                </Typography>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {block.tags.map((tag) => (
                  <span
                    key={`${block.id}-${tag}`}
                    className="rounded-full border border-border bg-accent-soft px-3 py-1.5 text-sm font-semibold text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        }

        if (block.type === "table") {
          return <TableBlock key={block.id} block={block} />;
        }

        if (block.type === "callout") {
          const styles = getCalloutStyles(block.variant);
          return (
            <div
              key={block.id}
              className={cn("space-y-3 rounded-card border px-5 py-5", styles.container)}
            >
              <div className="flex items-center gap-2">
                <IconSymbol name={styles.icon} size={18} color={styles.iconColor} />
                {block.title ? (
                  <Typography as="h3" className={cn("font-semibold", styles.title)}>
                    {block.title}
                  </Typography>
                ) : null}
              </div>
              <Typography className={cn("leading-6", styles.body)}>{block.text}</Typography>
            </div>
          );
        }

        if (block.type === "divider") {
          return <div key={block.id} className="h-px bg-divider" />;
        }

        if (block.type === "quote") {
          return (
            <div key={block.id} className="rounded-card border-l-4 border-accent bg-surface px-5 py-5 shadow-soft">
              <Typography className="leading-6 italic text-muted">"{block.text}"</Typography>
              {block.title ? (
                <Typography as="span" variant="caption" className="mt-3 block font-semibold text-accent">
                  {block.title}
                </Typography>
              ) : null}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
