"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ScreenScroll } from "@/components/layout/screen-scroll";
import { AnchoredPopover } from "@/components/shared/anchored-popover";
import { FilterStack } from "@/components/shared/filter-stack";
import { PageMeta } from "@/components/shared/page-meta";
import { PageTitle } from "@/components/shared/page-title";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { mockServices } from "@/lib/mock/services";
import { formatCurrencyVnd, formatDateTime, formatDuration } from "@/lib/utils/format";
import { useMockApp } from "@/providers/mock-app-provider";

type AnchorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

export default function DashboardPage() {
  const router = useRouter();
  const { authMode, language, rateSession, scenario, sessionHistory, t } = useMockApp();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [history, setHistory] = useState(sessionHistory);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [ratingAnchor, setRatingAnchor] = useState<AnchorRect>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");

    mockServices
      .fetchDashboard(scenario)
      .then((data) => {
        if (!active) return;
        setHistory(data.history);
      })
      .catch((error) => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : t("dashboard_load_failed"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [scenario, sessionHistory, t]);

  const stationOptions = useMemo(
    () => Array.from(new Set(history.map((item) => item.stationName))),
    [history]
  );
  const provinceOptions = useMemo(() => ["Hà Nội"], []);

  const monthOptions = useMemo(
    () =>
      Array.from(
        new Set(
          history.map((item) =>
            new Date(item.endedAt).toLocaleString(language === "vi" ? "vi-VN" : "en-US", {
              month: "long"
            })
          )
        )
      ),
    [history, language]
  );

  const yearOptions = useMemo(
    () => Array.from(new Set(history.map((item) => String(new Date(item.endedAt).getFullYear())))),
    [history]
  );

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const date = new Date(item.endedAt);
      const monthLabel = date.toLocaleString(language === "vi" ? "vi-VN" : "en-US", {
        month: "long"
      });
      const yearLabel = String(date.getFullYear());

      if (selectedStation && item.stationName !== selectedStation) return false;
      if (selectedProvince && !item.address.includes(selectedProvince)) return false;
      if (selectedMonth && monthLabel !== selectedMonth) return false;
      if (selectedYear && yearLabel !== selectedYear) return false;
      return true;
    });
  }, [history, language, selectedMonth, selectedProvince, selectedStation, selectedYear]);

  const stats = useMemo(() => {
    return filteredHistory.reduce(
      (acc, item) => {
        acc.totalEnergyKwh += item.energyKwh;
        acc.totalMinutes += item.durationMinutes;
        acc.totalSessions += 1;
        return acc;
      },
      { totalEnergyKwh: 0, totalMinutes: 0, totalSessions: 0 }
    );
  }, [filteredHistory]);

  const selectedHistory = useMemo(
    () => filteredHistory.find((item) => item.id === selectedId) ?? null,
    [filteredHistory, selectedId]
  );

  const visitorLocked = authMode === "visitor";

  return (
    <>
      <ScreenScroll id="dashboard">
        <PageMeta title={t("dashboard_overview")} />
        <PageTitle
          title={t("dashboard_overview")}
          right={
            visitorLocked ? (
              <div className="rounded-full border border-border bg-surface px-3 py-1.5">
                <Typography as="span" variant="caption" className="font-semibold text-muted">
                  ****
                </Typography>
              </div>
            ) : null
          }
        />

        <div className="relative space-y-3">
          <div className={visitorLocked ? "pointer-events-none opacity-70" : ""}>
            <FilterStack
              clearLabel={t("filter_clear")}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
              chips={[
                {
                  key: "station",
                  label: t("filter_ward"),
                  value: selectedStation,
                  options: stationOptions,
                  onSelect: setSelectedStation
                },
                {
                  key: "month",
                  label: t("filter_month"),
                  value: selectedMonth,
                  options: monthOptions,
                  onSelect: setSelectedMonth
                },
                {
                  key: "province",
                  label: t("filter_province"),
                  value: selectedProvince,
                  options: provinceOptions,
                  onSelect: setSelectedProvince
                },
                {
                  key: "year",
                  label: t("filter_year"),
                  value: selectedYear,
                  options: yearOptions,
                  onSelect: setSelectedYear
                }
              ]}
            />

            <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
              <StatCard
                label={t("dashboard_stat_total_kwh")}
                value={visitorLocked ? "****" : stats.totalEnergyKwh.toFixed(1)}
                icon="bolt.fill"
                iconBg="bg-success-soft"
                iconColor="var(--cp-success)"
              />
              <StatCard
                label={t("dashboard_stat_total_time")}
                value={visitorLocked ? "****" : formatDuration(stats.totalMinutes, t)}
                icon="clock.fill"
                iconBg="bg-info-soft"
                iconColor="var(--cp-info)"
              />
              <StatCard
                label={t("dashboard_stat_sessions")}
                value={visitorLocked ? "****" : String(stats.totalSessions)}
                icon="ev.charger.fill"
                iconBg="bg-accent-soft"
                iconColor="var(--cp-accent)"
              />
            </div>
          </div>

          {visitorLocked ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-card bg-[rgba(248,250,252,0.72)] px-5 backdrop-blur-sm">
              <Button fullWidth={false} onClick={() => router.push("/upgrade")}>
                {t("dashboard_auth_cta")}
              </Button>
            </div>
          ) : null}
        </div>

        <div className="mt-3 space-y-4">
          <SectionTitle title={t("dashboard_charge_history")} icon="clock.fill" />

          <div className="relative space-y-3">
            {visitorLocked ? (
              <div className="rounded-card border border-border bg-surface p-6">
                <div className="min-h-[168px]" />
              </div>
            ) : loadError ? (
              <div className="rounded-card border border-border bg-surface p-4">
                <Typography className="text-muted">{loadError}</Typography>
              </div>
            ) : loading ? (
              <div className="rounded-card border border-border bg-surface p-4">
                <Typography className="text-muted">{t("dashboard_loading")}</Typography>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="rounded-card border border-border bg-surface p-4">
                <Typography className="text-muted">{t("dashboard_empty")}</Typography>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.id} className="space-y-2 rounded-card border border-border bg-surface p-4 shadow-soft">
                  <div className="flex items-center justify-between gap-3">
                    <Typography as="div" variant="overline" className="font-semibold">
                      {item.stationName}
                    </Typography>
                    <button
                      type="button"
                      onClick={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        setRatingAnchor({
                          x: rect.x,
                          y: rect.y,
                          width: rect.width,
                          height: rect.height
                        });
                        setSelectedId(item.id);
                        setRating(item.rating ?? 5);
                      }}
                      className="cp-press rounded-xl bg-accent-soft px-3 py-2"
                    >
                      <Typography as="span" className="font-semibold text-accent">
                        {item.rating ? `${item.rating}★` : t("dashboard_rate_station")}
                      </Typography>
                    </button>
                  </div>

                  <Typography className="text-muted">{formatDateTime(item.endedAt, language)}</Typography>

                  <div className="flex items-start gap-2">
                    <div className="pt-1">
                      <IconSymbol name="location.fill" size={14} color="var(--cp-muted)" />
                    </div>
                    <Typography className="flex-1 text-muted">{item.address}</Typography>
                  </div>

                  <div className="h-px bg-divider" />

                  <div className="flex flex-wrap gap-2">
                    <Metric label={t("dashboard_energy")} value={`${item.energyKwh.toFixed(1)} kWh`} />
                    <Metric label={t("dashboard_time")} value={formatDuration(item.durationMinutes, t)} />
                    <Metric label={t("dashboard_points")} value={formatCurrencyVnd(item.amountVnd)} fullWidth />
                  </div>
                </div>
              ))
            )}

            {visitorLocked ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center rounded-card bg-[rgba(248,250,252,0.72)] px-5 backdrop-blur-sm">
                <Button fullWidth={false} onClick={() => router.push("/upgrade")}>
                  {t("dashboard_auth_cta")}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </ScreenScroll>

      <AnchoredPopover
        open={Boolean(selectedHistory && ratingAnchor)}
        anchor={ratingAnchor}
        onClose={() => {
          setSelectedId(null);
          setRatingAnchor(null);
        }}
      >
        {selectedHistory ? (
          <div className="space-y-4">
            <Typography as="h3" variant="heading">
              {selectedHistory.stationName}
            </Typography>
            <Typography className="text-muted">
              {selectedHistory.rating ? t("dashboard_your_rating") : t("dashboard_rating_prompt")}
            </Typography>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)} className="cp-press">
                  <IconSymbol
                    name="star.fill"
                    size={22}
                    color={value <= rating ? "var(--cp-accent)" : "var(--cp-muted-light)"}
                  />
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  rateSession(selectedHistory.id, rating);
                  setHistory((current) =>
                    current.map((item) => (item.id === selectedHistory.id ? { ...item, rating } : item))
                  );
                  setSelectedId(null);
                  setRatingAnchor(null);
                }}
              >
                {t("dashboard_submit_rating")}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedId(null);
                  setRatingAnchor(null);
                }}
              >
                {t("common_cancel")}
              </Button>
            </div>
          </div>
        ) : null}
      </AnchoredPopover>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor
}: {
  label: string;
  value: string;
  icon: "bolt.fill" | "clock.fill" | "ev.charger.fill";
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="min-h-[156px] rounded-2xl border border-border bg-surface p-4">
      <div className="flex h-full flex-col justify-between gap-3">
        <div className="space-y-2">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
            <IconSymbol name={icon} size={18} color={iconColor} />
          </div>
          <Typography as="div" variant="overline" className="text-muted-light">
            {label}
          </Typography>
        </div>
        <Typography variant="heading">{value}</Typography>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  fullWidth = false
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`rounded-xl border border-border bg-surface-alt p-3 ${fullWidth ? "basis-full" : "min-w-[110px] flex-1"}`}>
      <Typography as="div" variant="overline" className="text-muted-light">
        {label}
      </Typography>
      <Typography as="div" className="font-semibold">
        {value}
      </Typography>
    </div>
  );
}
