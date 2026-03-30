"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ScreenScroll } from "@/components/layout/screen-scroll";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { PageMeta } from "@/components/shared/page-meta";
import { PlanCard } from "@/components/shared/plan-card";
import { SectionTitle } from "@/components/shared/section-title";
import { SessionCard } from "@/components/shared/session-card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { useQueryParams } from "@/hooks/use-query-params";
import { mockRepositories } from "@/lib/mock/repositories";
import type { ChargingPlan, DeviceStatus } from "@/lib/types/app";
import { cn } from "@/lib/utils/cn";
import { formatCurrencyVnd } from "@/lib/utils/format";
import { useMockApp } from "@/providers/mock-app-provider";

function getSocketBannerContent(t: (key: string) => string, status: DeviceStatus | null) {
  if (status === "completed") {
    return {
      icon: "checkmark.circle.fill" as const,
      text: t("session_completed"),
      className: "border-available bg-available-soft text-available",
      iconColor: "var(--cp-available)"
    };
  }

  if (status === "available") {
    return {
      icon: "checkmark.circle.fill" as const,
      text: t("socket_banner_available"),
      className: "border-available bg-available-soft text-available",
      iconColor: "var(--cp-available)"
    };
  }

  if (status === "charging") {
    return {
      icon: "bolt.fill" as const,
      text: t("socket_banner_used_by_other"),
      className: "border-warning bg-warning-soft text-warning",
      iconColor: "var(--cp-warning)"
    };
  }

  if (status === "faulted") {
    return {
      icon: "exclamationmark.triangle.fill" as const,
      text: t("socket_banner_faulted"),
      className: "border-danger bg-danger-soft text-danger",
      iconColor: "var(--cp-danger)"
    };
  }

  if (status === "offline") {
    return {
      icon: "wifi.slash" as const,
      text: t("socket_banner_offline"),
      className: "border-danger bg-danger-soft text-danger",
      iconColor: "var(--cp-danger)"
    };
  }

  if (status === "checking") {
    return {
      icon: "arrow.triangle.2.circlepath" as const,
      text: t("socket_banner_checking"),
      className: "border-border bg-surface text-muted",
      iconColor: "var(--cp-muted)"
    };
  }

  return null;
}

export default function PlansPage() {
  const router = useRouter();
  const params = useQueryParams();
  const {
    activeSession,
    authMode,
    balanceVnd,
    buyPlan,
    plans,
    plansRecoveryLoading,
    retryPendingSessionStart,
    scannedSocket,
    scenario,
    setScannedSocket,
    stopSession,
    visitorTopupIntent,
    queueVisitorTopupIntent,
    resumeVisitorTopupIntent,
    clearVisitorTopupIntent,
    t
  } = useMockApp();
  const [selectedPlan, setSelectedPlan] = useState<ChargingPlan | null>(null);
  const [paymentChoicePlan, setPaymentChoicePlan] = useState<ChargingPlan | null>(null);
  const [buyBusy, setBuyBusy] = useState(false);
  const [retryBusy, setRetryBusy] = useState(false);
  const [stopBusy, setStopBusy] = useState(false);
  const [stopOpen, setStopOpen] = useState(false);
  const [cashPartnerOpen, setCashPartnerOpen] = useState(false);
  const [cashPartnerPlan, setCashPartnerPlan] = useState<ChargingPlan | null>(null);
  const [cashPartnerConfirmed, setCashPartnerConfirmed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [completedFlash, setCompletedFlash] = useState(false);
  const [completedPlanName, setCompletedPlanName] = useState("");
  const plansSectionRef = useRef<HTMLDivElement | null>(null);
  const previousSessionId = useRef<string | null>(activeSession?.id ?? null);
  const previousPlanName = useRef<string>(activeSession?.planName ?? "");

  const hardwareId = params.get("hardwareId");
  const socketIndex = params.get("socketIndex");
  const focusPlans = params.get("focusPlans") === "1";

  const isPendingStart = activeSession?.status === "pending";
  const isExtending = activeSession?.status === "extending";
  const isStopping = activeSession?.status === "stopping";

  useEffect(() => {
    if (!hardwareId || scannedSocket) {
      return;
    }

    const fallback = mockRepositories.getDefaultScannedSocket();
    setScannedSocket({
      ...fallback,
      hardwareId,
      socketIndex: Number(socketIndex ?? fallback.socketIndex)
    });
  }, [hardwareId, scannedSocket, setScannedSocket, socketIndex]);

  useEffect(() => {
    if (!scannedSocket || activeSession || scannedSocket.status !== "available" || plansRecoveryLoading) {
      setChecking(false);
      return;
    }

    setChecking(true);
    const timeout = window.setTimeout(() => setChecking(false), 1300);
    return () => window.clearTimeout(timeout);
  }, [activeSession, plansRecoveryLoading, scannedSocket?.hardwareId, scannedSocket?.socketIndex, scannedSocket?.status]);

  useEffect(() => {
    const previous = previousSessionId.current;
    const current = activeSession?.id ?? null;

    if (previous && !current) {
      setCompletedFlash(true);
      setCompletedPlanName(previousPlanName.current);
      const timeout = window.setTimeout(() => setCompletedFlash(false), 2400);
      previousSessionId.current = current;
      return () => window.clearTimeout(timeout);
    }

    if (activeSession?.planName) {
      previousPlanName.current = activeSession.planName;
    }
    previousSessionId.current = current;
  }, [activeSession]);

  useEffect(() => {
    if (!focusPlans || !plansSectionRef.current) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      plansSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    const timeout = window.setTimeout(() => {
      const nextParams = new URLSearchParams(params.toString());
      nextParams.delete("focusPlans");
      const nextUrl = nextParams.toString() ? `/plans?${nextParams.toString()}` : "/plans";
      router.replace(nextUrl, { scroll: false });
    }, 500);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [focusPlans, params, router]);

  const socketStatus = useMemo<DeviceStatus | null>(() => {
    if (!scannedSocket) return null;
    if (completedFlash) return "completed";
    if (isPendingStart) return "checking";
    if (activeSession?.status === "active" || isExtending) return "charging";
    if (scenario === "plans-faulted") return "faulted";
    if (scannedSocket.status === "faulted" || scannedSocket.status === "offline") {
      return scannedSocket.status;
    }
    if (checking) return "checking";
    return scannedSocket.status;
  }, [activeSession?.status, checking, completedFlash, isExtending, isPendingStart, scannedSocket, scenario]);

  const banner = useMemo(
    () => getSocketBannerContent(t, !activeSession ? socketStatus : null),
    [activeSession, socketStatus, t]
  );

  const activeSessionTone = useMemo(() => {
    if (!activeSession) return "stable" as const;
    if (isStopping) return "danger" as const;
    if (isPendingStart || isExtending) {
      return "warning" as const;
    }
    return "stable" as const;
  }, [activeSession, isExtending, isPendingStart, isStopping]);

  const activeSessionLabel = useMemo(() => {
    if (!activeSession) return "";
    if (isPendingStart && activeSession.startCommandStatus === "created_only") {
      return t("session_status_created_only");
    }
    if (isPendingStart) return t("plans_status_pending");
    if (isExtending) return t("plans_status_extending");
    if (isStopping) return t("plans_status_stopping");
    return t("plans_status_active");
  }, [activeSession, isExtending, isPendingStart, isStopping, t]);

  const activeSessionMessage = useMemo(() => {
    if (!activeSession) return undefined;
    if (isPendingStart && activeSession.startCommandStatus === "created_only") {
      return t("session_created_only_message");
    }
    if (isPendingStart) return t("session_start_waiting_message");
    if (isExtending) return t("session_extend_waiting_message");
    return undefined;
  }, [activeSession, isExtending, isPendingStart, t]);

  const routeVisitorTopup = useCallback(
    (plan: ChargingPlan) => {
      const mode = activeSession ? "visitor-extend" : "visitor-plan";
      const shortfallAmount = Math.max(0, plan.priceVnd - balanceVnd);
      queueVisitorTopupIntent({
        mode,
        plan,
        shortfallAmount
      });
      router.push(
        `/topup/vietqr?amount=${shortfallAmount}&planName=${encodeURIComponent(plan.name)}&mode=${mode}`
      );
    },
    [activeSession, balanceVnd, queueVisitorTopupIntent, router]
  );

  const executePlanPurchase = useCallback(
    async (plan: ChargingPlan, options?: { chargeFromBalance?: boolean }) => {
      setBuyBusy(true);
      try {
        await buyPlan(plan, options);
        setSelectedPlan(null);
        setPaymentChoicePlan(null);
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message === t("plans_error_balance")) {
          if (authMode === "visitor") {
            routeVisitorTopup(plan);
          } else {
            router.push("/account?view=buy-points");
          }
        } else if (message === t("plans_error_scan_required")) {
          router.push("/scan");
        }
        return false;
      } finally {
        setBuyBusy(false);
      }
    },
    [authMode, buyPlan, routeVisitorTopup, router, t]
  );

  useEffect(() => {
    if (authMode !== "visitor" || !visitorTopupIntent || visitorTopupIntent.status !== "ready_to_resume" || buyBusy) {
      return;
    }

    if (visitorTopupIntent.mode === "visitor-plan" && activeSession) {
      clearVisitorTopupIntent();
      return;
    }

    if (visitorTopupIntent.mode === "visitor-extend" && !activeSession) {
      clearVisitorTopupIntent();
      return;
    }

    void executePlanPurchase(visitorTopupIntent.plan);
  }, [
    activeSession,
    authMode,
    buyBusy,
    clearVisitorTopupIntent,
    executePlanPurchase,
    resumeVisitorTopupIntent,
    visitorTopupIntent
  ]);

  useEffect(() => {
    if (!cashPartnerOpen || !cashPartnerPlan) {
      setCashPartnerConfirmed(false);
      return;
    }

    let active = true;
    const timeout = window.setTimeout(async () => {
      if (!active) {
        return;
      }
      setCashPartnerConfirmed(true);
      await executePlanPurchase(cashPartnerPlan, { chargeFromBalance: false });
      if (!active) {
        return;
      }
      setCashPartnerOpen(false);
      setCashPartnerPlan(null);
      setCashPartnerConfirmed(false);
    }, 2600);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [cashPartnerOpen, cashPartnerPlan, executePlanPurchase]);

  const actionConfig = useMemo(() => {
    const disabledAction = {
      disabled: true,
      actionClassName: "border border-border bg-input",
      actionTextClassName: "text-muted",
      showActionIcon: false
    };

    if (!scannedSocket) {
      return {
        label: t("plan_buy_scan_available_socket"),
        ...disabledAction
      };
    }

    if (cashPartnerOpen) {
      return {
        label: t("cash_partner_waiting_title"),
        ...disabledAction
      };
    }

    if (isPendingStart) {
      return {
        label:
          activeSession?.startCommandStatus === "created_only"
            ? t("session_retry_start_btn")
            : t("plans_status_pending"),
        ...disabledAction
      };
    }

    if (isExtending) {
      return {
        label: t("plans_status_extending"),
        ...disabledAction
      };
    }

    if (isStopping) {
      return {
        label: t("plans_status_stopping"),
        ...disabledAction
      };
    }

    if (activeSession) {
      return {
        label: t("explore_buy_more"),
        disabled: buyBusy,
        actionClassName: "bg-accent text-on-accent",
        actionTextClassName: "text-on-accent",
        showActionIcon: true
      };
    }

    if (socketStatus === "available" || socketStatus === "completed") {
      return {
        label: t("products_buy"),
        disabled: buyBusy,
        actionClassName: "bg-accent text-on-accent",
        actionTextClassName: "text-on-accent",
        showActionIcon: true
      };
    }

    const labelMap: Record<Exclude<DeviceStatus, "available" | "completed">, string> = {
      charging: t("socket_banner_used_by_other"),
      checking: t("socket_banner_checking"),
      faulted: t("socket_banner_faulted"),
      offline: t("socket_banner_offline")
    };

    return {
      label: labelMap[socketStatus ?? "checking"],
      ...disabledAction
    };
  }, [activeSession, buyBusy, cashPartnerOpen, isExtending, isPendingStart, isStopping, scannedSocket, socketStatus, t]);

  const handleConfirmPlan = async () => {
    if (!selectedPlan) {
      return;
    }

    if (isPendingStart || isExtending || isStopping || cashPartnerOpen) {
      setSelectedPlan(null);
      return;
    }

    if (!activeSession && socketStatus !== "available" && socketStatus !== "completed") {
      setSelectedPlan(null);
      return;
    }

    if (authMode === "visitor") {
      setPaymentChoicePlan(selectedPlan);
      setSelectedPlan(null);
      return;
    }

    if (!activeSession && balanceVnd < selectedPlan.priceVnd) {
      setPaymentChoicePlan(selectedPlan);
      setSelectedPlan(null);
      return;
    }

    if (activeSession && balanceVnd < selectedPlan.priceVnd) {
      setPaymentChoicePlan(selectedPlan);
      setSelectedPlan(null);
      return;
    }

    await executePlanPurchase(selectedPlan);
  };

  const handleRetryStart = async () => {
    setRetryBusy(true);
    try {
      await retryPendingSessionStart();
    } finally {
      setRetryBusy(false);
    }
  };

  const handleStopSession = async () => {
    setStopBusy(true);
    try {
      await stopSession();
    } finally {
      setStopBusy(false);
      setStopOpen(false);
    }
  };

  return (
    <>
      <PageMeta title={t("tab_products")} />
      <ScreenScroll id="plans">
        {plansRecoveryLoading && !activeSession ? (
          <div className="flex items-center justify-center gap-3 py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <Typography className="text-muted">{t("session_recovery_loading")}</Typography>
          </div>
        ) : null}

        {scannedSocket ? (
          <div className="overflow-hidden rounded-card border border-border bg-surface shadow-soft">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-accent-soft-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <IconSymbol name="ev.charger.fill" size={18} color="var(--cp-accent)" />
                <Typography as="span" className="font-semibold text-accent">
                  {scannedSocket.stationName}
                </Typography>
              </div>

              <div
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5",
                  socketStatus === "available" || socketStatus === "completed"
                    ? "border-available bg-available-soft"
                    : socketStatus === "charging"
                      ? "border-warning bg-warning-soft"
                      : socketStatus === "faulted" || socketStatus === "offline"
                        ? "border-danger bg-danger-soft"
                        : "border-border bg-surface"
                )}
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    socketStatus === "available" || socketStatus === "completed"
                      ? "bg-available"
                      : socketStatus === "charging"
                        ? "bg-warning"
                        : socketStatus === "faulted" || socketStatus === "offline"
                          ? "bg-danger"
                          : "bg-muted"
                  )}
                />
                <Typography
                  as="span"
                  variant="caption"
                  className={cn(
                    "font-semibold",
                    socketStatus === "available" || socketStatus === "completed"
                      ? "text-available"
                      : socketStatus === "charging"
                        ? "text-warning"
                        : socketStatus === "faulted" || socketStatus === "offline"
                          ? "text-danger"
                          : "text-muted"
                  )}
                >
                  {socketStatus === "charging"
                    ? t("plans_socket_in_use")
                    : socketStatus === "available" || socketStatus === "completed"
                      ? t("plans_socket_ready")
                      : socketStatus === "faulted"
                        ? t("socket_banner_faulted")
                        : socketStatus === "offline"
                          ? t("socket_banner_offline")
                          : t("socket_banner_checking")}
                </Typography>
              </div>
            </div>

            <div className="space-y-4 p-4">
              <Typography className="text-muted">{scannedSocket.stationAddress}</Typography>
            </div>
          </div>
        ) : (
          <div className="space-y-4 rounded-card border border-border bg-surface p-5 shadow-soft">
            <Typography className="text-muted">{t("plans_socket_unknown_address")}</Typography>
            <Button variant="secondary" fullWidth={false} onClick={() => router.push("/scan")}>
              {t("plans_rescan")}
            </Button>
          </div>
        )}

        {banner ? (
          <div className={cn("flex items-center gap-3 rounded-2xl border px-4 py-3", banner.className)}>
            <IconSymbol name={banner.icon} size={20} color={banner.iconColor} />
            <Typography className="flex-1">{banner.text}</Typography>
          </div>
        ) : null}

        {activeSession ? (
          <SessionCard
            session={activeSession}
            statusLabel={activeSessionLabel}
            tone={activeSessionTone}
            message={activeSessionMessage}
            pendingStart={isPendingStart}
            showRetry={isPendingStart && activeSession.startCommandStatus === "created_only"}
            retryLabel={t("session_retry_start_btn")}
            retryBusyLabel={t("plans_status_pending")}
            retryBusy={retryBusy}
            onRetry={handleRetryStart}
            disableStop={stopBusy || isStopping}
            onBuyMore={() =>
              plansSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            onStop={() => setStopOpen(true)}
            t={t}
          />
        ) : null}

        {completedFlash ? (
          <div className="space-y-3 rounded-card border border-danger bg-danger-soft p-4 shadow-soft">
            <Typography className="text-center font-semibold text-danger">
              {t("session_completed")}
            </Typography>
            {completedPlanName ? (
              <div className="flex items-center justify-between gap-3">
                <Typography className="text-muted-light">{t("plans_stop_row_session")}</Typography>
                <Typography as="span" className="font-semibold">
                  {completedPlanName}
                </Typography>
              </div>
            ) : null}
          </div>
        ) : null}

        {authMode !== "visitor" ? (
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <Typography className="text-muted">{t("account_points_label")}</Typography>
              <Typography variant="heading" className="text-success">
                {balanceVnd.toLocaleString("vi-VN")}
              </Typography>
            </div>
          </div>
        ) : null}

        <div ref={plansSectionRef}>
          <SectionTitle title={t("plans_section_title")} icon="cart.fill" className="mt-2" />
        </div>

        {plans.length === 0 ? (
          <div className="rounded-card border border-border bg-surface p-4">
            <Typography className="text-muted">{t("plans_empty")}</Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                actionLabel={actionConfig.label}
                actionClassName={actionConfig.actionClassName}
                actionTextClassName={actionConfig.actionTextClassName}
                disabled={actionConfig.disabled}
                showActionIcon={actionConfig.showActionIcon}
                onClick={() => setSelectedPlan(plan)}
                t={t}
              />
            ))}
          </div>
        )}
      </ScreenScroll>

      <ConfirmModal
        open={Boolean(selectedPlan)}
        icon="bolt.fill"
        title={activeSession ? t("plans_confirm_extend_title") : t("plans_confirm_buy_title")}
        rows={
          selectedPlan
            ? [
                { label: t("plans_row_plan"), value: selectedPlan.name },
                { label: t("plans_row_price"), value: formatCurrencyVnd(selectedPlan.priceVnd) },
                {
                  label: t("plans_row_duration"),
                  value: `${selectedPlan.durationMinutes} ${t("time_unit_min")}`
                },
                { label: t("plans_row_energy"), value: `${selectedPlan.energyKwh} kWh` }
              ]
            : []
        }
        confirmLabel={
          activeSession ? t("plans_confirm_extend_button") : t("plans_confirm_buy_button")
        }
        busyLabel={activeSession ? t("plans_status_extending") : t("plans_status_pending")}
        cancelLabel={t("common_cancel")}
        onConfirm={handleConfirmPlan}
        onCancel={() => setSelectedPlan(null)}
        busy={buyBusy}
      />

      <ConfirmModal
        open={stopOpen}
        icon="exclamationmark.triangle.fill"
        title={t("plans_stop_title")}
        description={t("session_stop_confirm")}
        rows={[{ label: t("plans_stop_row_session"), value: activeSession?.planName ?? "--" }]}
        confirmLabel={t("session_stop_confirm_btn")}
        cancelLabel={t("common_cancel")}
        onConfirm={handleStopSession}
        onCancel={() => setStopOpen(false)}
        busy={stopBusy}
        busyLabel={t("plans_status_stopping")}
      />

      <Dialog
        open={Boolean(paymentChoicePlan)}
        onClose={() => setPaymentChoicePlan(null)}
      >
        <div className="space-y-4">
          <div className="space-y-2 text-center">
            <Typography as="h3" variant="heading">
              {t("plan_buy_choose_payment_title")}
            </Typography>
            <Typography className="text-muted">{t("plan_buy_choose_payment_message")}</Typography>
          </div>

          {authMode === "visitor" ? (
            <div className="space-y-3">
              <Button
                onClick={() => {
                  const plan = paymentChoicePlan;
                  setPaymentChoicePlan(null);
                  if (!plan) return;
                  if (balanceVnd < plan.priceVnd) {
                    routeVisitorTopup(plan);
                    return;
                  }
                  void executePlanPurchase(plan);
                }}
              >
                {t("plan_buy_qr_button")}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setCashPartnerPlan(paymentChoicePlan);
                  setPaymentChoicePlan(null);
                  setCashPartnerOpen(true);
                }}
              >
                {t("plan_buy_cash_button")}
              </Button>
              <Button variant="ghost" onClick={() => setPaymentChoicePlan(null)}>
                {t("common_cancel")}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setPaymentChoicePlan(null);
                  router.push("/account?view=buy-points");
                }}
              >
                {t("plan_buy_topup_button")}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setCashPartnerPlan(paymentChoicePlan);
                  setPaymentChoicePlan(null);
                  setCashPartnerOpen(true);
                }}
              >
                {t("plan_buy_cash_button")}
              </Button>
              <Button variant="ghost" onClick={() => setPaymentChoicePlan(null)}>
                {t("common_cancel")}
              </Button>
            </div>
          )}
        </div>
      </Dialog>

      <Dialog
        open={cashPartnerOpen}
        onClose={() => {
          setCashPartnerOpen(false);
          setCashPartnerPlan(null);
          setCashPartnerConfirmed(false);
        }}
      >
        <div className="space-y-5">
          <div className="space-y-3 text-center">
            <Typography as="h3" variant="heading">
              {t("cash_partner_waiting_title")}
            </Typography>
            <Typography className="text-muted">
              {cashPartnerConfirmed ? t("cash_partner_processing_confirmed") : t("cash_partner_waiting_message")}
            </Typography>
          </div>

          {cashPartnerPlan ? (
            <div className="space-y-3 rounded-card bg-surface px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <Typography className="text-muted-light">{t("plans_row_plan")}</Typography>
                <Typography as="span" className="font-semibold">
                  {cashPartnerPlan.name}
                </Typography>
              </div>
              <div className="h-px bg-divider" />
              <div className="flex items-center justify-between gap-3">
                <Typography className="text-muted-light">{t("plans_row_price")}</Typography>
                <Typography as="span" className="font-semibold">
                  {formatCurrencyVnd(cashPartnerPlan.priceVnd)}
                </Typography>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col items-center gap-2 py-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <Typography className="text-center text-muted">{t("cash_partner_waiting_hint")}</Typography>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              setCashPartnerOpen(false);
              setCashPartnerPlan(null);
              setCashPartnerConfirmed(false);
            }}
          >
            {t("cash_partner_waiting_close")}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
