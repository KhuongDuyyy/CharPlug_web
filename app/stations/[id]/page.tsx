"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ScreenScroll } from "@/components/layout/screen-scroll";
import { DocumentRenderer } from "@/components/shared/document-renderer";
import { PageMeta } from "@/components/shared/page-meta";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { useSafeBack } from "@/hooks/use-safe-back";
import { useQueryParams } from "@/hooks/use-query-params";
import { mockServices } from "@/lib/mock/services";
import { useMockApp } from "@/providers/mock-app-provider";

export default function StationDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useQueryParams();
  const { scenario, t } = useMockApp();
  const router = useRouter();
  const goBack = useSafeBack("/stations");
  const offersRef = useRef<HTMLDivElement | null>(null);
  const focusOffers = searchParams.get("focusSection") === "offers";
  const [state, setState] = useState<{
    loading: boolean;
    error: string;
    station: Awaited<ReturnType<typeof mockServices.fetchStationDetail>> | null;
  }>({
    loading: true,
    error: "",
    station: null
  });

  useEffect(() => {
    let active = true;
    setState({ loading: true, error: "", station: null });
    mockServices
      .fetchStationDetail(params.id, scenario, t)
      .then((station) => {
        if (!active) return;
        setState({ loading: false, error: "", station });
      })
      .catch((error) => {
        if (!active) return;
        setState({
          loading: false,
          error: error instanceof Error ? error.message : t("station_detail_load_error"),
          station: null
        });
      });
    return () => {
      active = false;
    };
  }, [params.id, scenario, t]);

  useEffect(() => {
    if (!focusOffers || !offersRef.current || state.loading || state.error) {
      return;
    }
    offersRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusOffers, state.error, state.loading]);

  const availabilityLabel = useMemo(() => {
    if (!state.station) return "--";
    const available = state.station.sockets.filter((socket) => socket.status === "available").length;
    return t("stations_available_count", { available, total: state.station.sockets.length });
  }, [state.station, t]);

  const hasAvailable = useMemo(
    () => state.station?.sockets.some((socket) => socket.status === "available") ?? false,
    [state.station]
  );

  const distanceLabel = useMemo(() => {
    const queryDistance = searchParams.get("distanceKm");
    if (queryDistance) {
      return t("stations_km", { value: Number(queryDistance).toFixed(1) });
    }

    if (state.station?.distanceKm != null) {
      return t("stations_km", { value: state.station.distanceKm.toFixed(1) });
    }

    return "--";
  }, [searchParams, state.station?.distanceKm, t]);

  const documentBlocks = state.station?.document?.blocks ?? [];
  const fallbackDescription = state.station?.description?.trim() || t("station_detail_description_empty");

  return (
    <ScreenScroll
      id={`station-${params.id}`}
      contentClassName="gap-5 px-5 pt-5 pb-10 lg:grid lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start lg:gap-6"
    >
      <PageMeta title={state.station?.name ?? t("station_detail_title")} />

      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="cp-press flex h-10 w-10 items-center justify-center rounded-xl bg-surface"
          >
            <IconSymbol name="chevron.left" size={20} color="var(--cp-accent)" />
          </button>
          <Typography as="h1" variant="heading" className="flex-1">
            {t("station_detail_title")}
          </Typography>
        </div>

        {state.loading ? (
          <div className="flex items-center justify-center gap-3 py-16">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <Typography className="text-muted">{t("station_detail_loading")}</Typography>
          </div>
        ) : null}

        {!state.loading && state.error ? (
          <div className="space-y-4 rounded-card bg-surface p-5 shadow-soft">
            <Typography className="text-danger">{state.error}</Typography>
            <Button fullWidth={false} onClick={() => router.refresh()}>
              {t("station_detail_retry")}
            </Button>
          </div>
        ) : null}

        {state.station ? (
          <>
            <div className="relative overflow-hidden rounded-card border border-border bg-surface px-4 py-4 shadow-soft">
              <div className="absolute left-4 right-4 top-0 h-px rounded-full bg-[rgba(244,114,182,0.30)]" />
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <Typography as="div" variant="overline" className="font-semibold">
                      {state.station.name}
                    </Typography>
                    <Typography className="leading-[22px] text-[color:var(--cp-foreground)]/80">
                      {state.station.address}
                    </Typography>
                  </div>

                  <div className="flex items-center gap-1 rounded-full border border-border bg-accent-soft px-3 py-1.5">
                    <IconSymbol name="star.fill" size={14} color="var(--cp-accent)" />
                    <Typography as="span" className="font-semibold text-accent">
                      {state.station.rating.toFixed(1)}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`flex items-center gap-2 rounded-full border px-2.5 py-1.5 ${
                      hasAvailable ? "border-available bg-available-soft" : "border-danger bg-danger-soft"
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full ${hasAvailable ? "bg-available" : "bg-danger"}`} />
                    <Typography
                      as="span"
                      variant="caption"
                      className={`font-semibold ${hasAvailable ? "text-available" : "text-danger"}`}
                    >
                      {availabilityLabel}
                    </Typography>
                  </div>

                  <button
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/?q=${encodeURIComponent(state.station?.address ?? "")}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    className="cp-press flex items-center gap-2 rounded-full border border-border bg-[rgba(255,252,255,0.96)] px-3 py-2"
                  >
                    <IconSymbol name="location.fill" size={16} color="var(--cp-accent)" />
                    <Typography as="span" className="font-semibold text-accent">
                      {distanceLabel}
                    </Typography>
                    <IconSymbol name="chevron.right" size={16} color="var(--cp-accent)" />
                  </button>
                </div>
              </div>
            </div>

            <SectionTitle title={t("station_detail_description_title")} icon="message.fill" />
            {documentBlocks.length > 0 ? (
              <DocumentRenderer blocks={documentBlocks} />
            ) : (
              <div className="rounded-card bg-surface px-5 py-5 shadow-soft">
                <Typography className="leading-6 text-muted">{fallbackDescription}</Typography>
              </div>
            )}
          </>
        ) : null}
      </div>

      {state.station ? (
        <div ref={offersRef} className="space-y-4 lg:pt-[58px]">
          <SectionTitle title={t("station_detail_offers")} icon="tag.fill" />
          {state.station.vouchers.length === 0 ? (
            <div className="rounded-card bg-surface p-5 shadow-soft">
              <Typography className="text-muted">--</Typography>
            </div>
          ) : (
            <div className="space-y-3 rounded-card bg-surface p-5 shadow-soft">
              {state.station.vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="rounded-2xl border border-border bg-accent-soft-2 px-4 py-4"
                >
                  <div className="space-y-1.5">
                    <Typography className="font-semibold">{voucher.label}</Typography>
                    <Typography className="text-muted">
                      {voucher.description?.trim() || t("station_detail_offer_fallback")}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </ScreenScroll>
  );
}
