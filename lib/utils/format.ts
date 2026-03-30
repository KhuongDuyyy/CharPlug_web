export function formatCurrencyVnd(amount: number) {
  return `${Math.round(amount).toLocaleString("vi-VN")} VND`;
}

export function formatCompactVnd(amount: number) {
  return Math.round(amount).toLocaleString("vi-VN");
}

export function formatDuration(minutes: number, t: (key: string) => string) {
  if (minutes < 60) {
    return `${minutes} ${t("time_unit_min")}`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0
    ? `${hours} ${t("time_unit_hour")} ${mins} ${t("time_unit_min")}`
    : `${hours} ${t("time_unit_hour")}`;
}

export function formatDateTime(date: string, locale: "vi" | "en" = "vi") {
  const parsed = new Date(date);
  return parsed.toLocaleString(locale === "vi" ? "vi-VN" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function formatCountdown(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
