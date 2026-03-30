"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ScreenScroll } from "@/components/layout/screen-scroll";
import { PageMeta } from "@/components/shared/page-meta";
import { PageTitle } from "@/components/shared/page-title";
import { StationCard } from "@/components/shared/station-card";
import { StationSortDropdown } from "@/components/shared/station-sort-dropdown";
import { Typography } from "@/components/ui/typography";
import { mockServices } from "@/lib/mock/services";
import type { Station, StationSort } from "@/lib/types/app";
import { useMockApp } from "@/providers/mock-app-provider";

function sortStationsByName(list: Station[]) {
  return [...list].sort((left, right) => left.name.localeCompare(right.name, "vi"));
}

export default function StationsPage() {
  const router = useRouter();
  const { scenario, t } = useMockApp();
  const [sort, setSort] = useState<StationSort>("distance");
  const [stations, setStations] = useState<Station[]>([]);
  const [loadingStations, setLoadingStations] = useState(true);
  const [stationsLoadError, setStationsLoadError] = useState("");
  const [routeErrorNotice, setRouteErrorNotice] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    let active = true;

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocationDenied(true);
      setLoadingLocation(false);
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!active) {
          return;
        }

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationDenied(false);
        setLoadingLocation(false);
      },
      () => {
        if (!active) {
          return;
        }

        setUserLocation(null);
        setLocationDenied(true);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30_000,
        timeout: 5_000
      }
    );

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoadingStations(true);
    setStationsLoadError("");

    mockServices
      .fetchStations(sort, scenario)
      .then((result) => {
        if (!active) {
          return;
        }

        setStations(
          locationDenied && sort === "distance" ? sortStationsByName(result) : result
        );
        setRouteErrorNotice(
          scenario === "stations-route-error" && userLocation
            ? t("stations_route_error_generic")
            : ""
        );
      })
      .catch((nextError) => {
        if (!active) {
          return;
        }

        setStationsLoadError(
          nextError instanceof Error ? nextError.message : t("stations_loading")
        );
      })
      .finally(() => {
        if (active) {
          setLoadingStations(false);
        }
      });

    return () => {
      active = false;
    };
  }, [locationDenied, scenario, sort, t, userLocation]);

  const sortOptions = useMemo(
    () => [
      {
        key: "distance" as const,
        title: t("stations_sort_nearest_title"),
        subtitle: t("stations_sort_nearest_subtitle"),
        iconName: "location.fill" as const
      },
      {
        key: "voucher" as const,
        title: t("stations_sort_best_offer_title"),
        subtitle: t("stations_sort_best_offer_subtitle"),
        iconName: "tag.fill" as const
      },
      {
        key: "rating" as const,
        title: t("stations_sort_highest_rating_title"),
        subtitle: t("stations_sort_highest_rating_subtitle"),
        iconName: "star.fill" as const
      }
    ],
    [t]
  );

  return (
    <ScreenScroll id="stations">
      <PageMeta title={t("stations_title")} />
      <PageTitle
        title={t("stations_title")}
        right={
          <StationSortDropdown
            options={sortOptions}
            value={sort}
            onChange={setSort}
          />
        }
      />

      <div className="space-y-3 px-2">
        {loadingLocation ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <Typography className="text-muted">{t("stations_requesting_location")}</Typography>
          </div>
        ) : null}

        {loadingStations ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <Typography className="text-muted">{t("stations_refresh")}</Typography>
          </div>
        ) : null}

        {locationDenied && !loadingLocation ? (
          <Typography className="text-muted">{t("stations_location_denied")}</Typography>
        ) : null}

        {stationsLoadError ? (
          <Typography className="text-danger">{stationsLoadError}</Typography>
        ) : null}

        {routeErrorNotice ? (
          <Typography className="text-danger">{routeErrorNotice}</Typography>
        ) : null}
      </div>

      {!stationsLoadError && stations.length === 0 && !loadingStations ? (
        <div className="flex items-center justify-center px-2 py-10">
          <Typography className="text-muted">{t("stations_no_results")}</Typography>
        </div>
      ) : null}

      {!stationsLoadError && stations.length > 0 ? (
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 xl:grid-cols-2">
          {stations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              availabilityLabel={t("stations_available_count", {
                available: station.sockets.filter((socket) => socket.status === "available").length,
                total: station.sockets.length
              })}
              distanceLabel={
                !loadingLocation && !locationDenied && userLocation && station.distanceKm !== null
                  ? t("stations_km", { value: station.distanceKm.toFixed(1) })
                  : "--"
              }
              onOpen={() => router.push(`/stations/${station.id}`)}
              onOffers={() => router.push(`/stations/${station.id}?focusSection=offers`)}
              onDirections={() =>
                window.open(
                  `https://maps.google.com/?q=${encodeURIComponent(station.address)}`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            />
          ))}
        </div>
      ) : null}
    </ScreenScroll>
  );
}
