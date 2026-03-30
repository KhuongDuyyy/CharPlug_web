"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { useSafeBack } from "@/hooks/use-safe-back";
import { PageMeta } from "@/components/shared/page-meta";
import { useQueryParams } from "@/hooks/use-query-params";
import { mockServices } from "@/lib/mock/services";
import type { TopupMode, TopupOrder, TopupStatus } from "@/lib/types/app";
import { useMockApp } from "@/providers/mock-app-provider";

export default function TopupVietQrPage() {
  const router = useRouter();
  const params = useQueryParams();
  const { completeTopup, scenario, topupEnabled, t } = useMockApp();
  const amount = Number(params.get("amount") ?? 0);
  const planName = params.get("planName") ?? "";
  const packageId = params.get("packageId") ?? undefined;
  const mode = (params.get("mode") ?? "standard") as TopupMode;
  const goBack = useSafeBack(
    mode === "visitor-plan" || mode === "visitor-extend"
      ? "/plans?focusPlans=1"
      : "/account?view=buy-points"
  );
  const [status, setStatus] = useState<TopupStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [order, setOrder] = useState<TopupOrder | null>(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [qrError, setQrError] = useState(false);
  const hasAppliedTopup = useRef(false);

  useEffect(() => {
    setQrLoading(true);
    setQrError(false);
  }, [order?.orderId]);

  useEffect(() => {
    if (!topupEnabled) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setOrderError(null);
    setOrder(null);
    setStatus("pending");
    hasAppliedTopup.current = false;

    const createOrder = async () => {
      if (!amount) {
        setOrderError(t("topup_vietqr_create_order_error"));
        setLoading(false);
        return;
      }

      try {
        let nextOrder = await mockServices.createTopupOrder(amount, mode, planName, packageId, scenario);

        if (!nextOrder.transferContent.trim()) {
          const statusData = await mockServices.getTopupOrderStatus(nextOrder.orderId);
          if (statusData?.transferContent.trim()) {
            nextOrder = { ...nextOrder, transferContent: statusData.transferContent.trim() };
          }
        }

        if (!nextOrder.transferContent.trim()) {
          if (!active) return;
          setOrderError(t("topup_vietqr_transfer_content_missing"));
          return;
        }

        if (!active) return;

        setOrder(nextOrder);
        setStatus("pending");
      } catch (nextError) {
        if (!active) return;

        if (nextError instanceof Error && nextError.message === "mock_topup_session_expired") {
          setOrderError(t("topup_vietqr_session_expired_retry"));
          return;
        }

        if (nextError instanceof Error && nextError.message === "mock_topup_invalid_session") {
          setOrderError(t("topup_vietqr_invalid_session"));
          return;
        }

        setOrderError(
          nextError instanceof Error && nextError.message !== "mock_topup_create_error"
            ? nextError.message
            : t("topup_vietqr_create_order_error")
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void createOrder();

    return () => {
      active = false;
    };
  }, [amount, mode, packageId, planName, scenario, t, topupEnabled]);

  const applyPaid = useCallback(
    (payload?: {
      amountVnd?: number;
      orderId?: string;
      transferContent?: string;
    }) => {
      if (!order || hasAppliedTopup.current) {
        return;
      }

      hasAppliedTopup.current = true;
      setStatus("paid");
      completeTopup({
        ...order,
        amountVnd: payload?.amountVnd ?? order.amountVnd,
        orderId: payload?.orderId ?? order.orderId,
        transferContent: payload?.transferContent?.trim() || order.transferContent,
        status: "paid"
      });

      if (mode === "visitor-plan" || mode === "visitor-extend") {
        router.replace("/plans?focusPlans=1");
      }
    },
    [completeTopup, mode, order, router]
  );

  useEffect(() => {
    if (!topupEnabled || !order || status === "paid") {
      return;
    }

    return mockServices.subscribeTopupPaid(order.orderId, (payload) => {
      applyPaid({
        amountVnd: payload.amountVnd,
        orderId: payload.orderId,
        transferContent: payload.transferContent
      });
    });
  }, [applyPaid, order, status, topupEnabled]);

  useEffect(() => {
    if (!topupEnabled || !order || status === "paid" || status === "expired" || status === "failed") {
      return;
    }

    let active = true;
    let attempts = 0;
    const maxAttempts = 30;
    const interval = window.setInterval(async () => {
      attempts += 1;
      if (attempts > maxAttempts) {
        window.clearInterval(interval);
        return;
      }

      const nextStatus = await mockServices.getTopupOrderStatus(order.orderId);
      if (!active || !nextStatus) {
        return;
      }

      if (!order.transferContent.trim() && nextStatus.transferContent.trim()) {
        setOrder((current) =>
          current
            ? {
                ...current,
                transferContent: nextStatus.transferContent.trim()
              }
            : current
        );
      }

      if (nextStatus.isPaid || nextStatus.status === "paid") {
        window.clearInterval(interval);
        applyPaid({
          amountVnd: nextStatus.amountVnd,
          orderId: nextStatus.orderId,
          transferContent: nextStatus.transferContent
        });
        return;
      }

      if (nextStatus.status === "expired" || nextStatus.status === "failed") {
        setStatus(nextStatus.status);
        setOrderError(
          t(nextStatus.status === "expired" ? "topup_vietqr_expired" : "topup_vietqr_failed")
        );
        window.clearInterval(interval);
      }
    }, 4000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [applyPaid, order, status, topupEnabled]);

  const saveQr = () => {
    if (!order) return;
    const link = document.createElement("a");
    link.href = order.qrPayload;
    link.download = `${order.orderId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="cp-screen min-h-screen bg-background">
      <PageMeta title={t("topup_vietqr_title")} />
      <div className="cp-scroll mx-auto flex min-h-screen max-w-[720px] flex-col gap-4 overflow-y-auto px-5 pb-10 pt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="cp-press flex h-10 w-10 items-center justify-center rounded-xl bg-surface"
          >
            <IconSymbol name="chevron.left" size={20} color="var(--cp-accent)" />
          </button>
          <Typography as="h1" variant="heading">
            {t("topup_vietqr_title")}
          </Typography>
        </div>

        {!topupEnabled ? (
          <div className="space-y-3 rounded-card bg-surface p-5 shadow-soft">
            <Typography variant="heading" className="text-danger">
              {t("topup_disabled_title")}
            </Typography>
            <Typography className="text-muted">{t("topup_disabled_message")}</Typography>
            <Button fullWidth={false} onClick={() => router.replace("/account?reset=1")}>
              {t("common_ok")}
            </Button>
          </div>
        ) : (
          <>
            {orderError ? (
              <div className="rounded-2xl bg-surface p-4 shadow-soft">
                <Typography className="text-danger">{orderError}</Typography>
              </div>
            ) : null}

            <div className="rounded-card bg-surface p-5 shadow-soft">
              <div className="flex items-center justify-center rounded-card bg-white p-4">
                {loading ? (
                  <div className="flex h-[320px] w-full max-w-[400px] items-center justify-center rounded-2xl bg-surface-alt">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  </div>
                ) : qrError ? (
                  <div className="flex h-[320px] w-full max-w-[400px] items-center justify-center rounded-2xl bg-surface-alt px-6 text-center">
                    <Typography className="text-danger">{t("topup_vietqr_qr_load_error")}</Typography>
                  </div>
                ) : order ? (
                  <div className="relative w-full max-w-[400px]">
                    {qrLoading ? (
                      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-surface-alt">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                      </div>
                    ) : null}
                    <img
                      src={order.qrPayload}
                      alt={order.orderId}
                      className="block h-auto w-full"
                      onLoad={() => setQrLoading(false)}
                      onError={() => {
                        setQrLoading(false);
                        setQrError(true);
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex h-[320px] w-full max-w-[400px] items-center justify-center rounded-2xl bg-surface-alt">
                    <Typography className="text-muted">{t("topup_vietqr_loading")}</Typography>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 rounded-card bg-surface p-5 shadow-soft">
              <InfoRow label={t("topup_vietqr_account_name")} value={order?.accountName || t("topup_vietqr_loading")} />
              <InfoRow label={t("topup_vietqr_account_number")} value={order?.accountNumber || t("topup_vietqr_loading")} />
              <InfoRow label={t("topup_vietqr_bank_name")} value={order?.bankName || t("topup_vietqr_loading")} />
              <InfoRow label={t("topup_vietqr_amount")} value={`${amount.toLocaleString("vi-VN")} VND`} />
              <InfoRow
                label={t("topup_vietqr_transfer_content")}
                value={order?.transferContent || t("topup_vietqr_loading")}
              />
            </div>

            <div className="space-y-2">
              <Button onClick={saveQr} disabled={!order}>
                {t("topup_vietqr_save_qr")}
              </Button>
              <Typography className="text-center text-muted-light">
                {t("topup_vietqr_save_qr_hint")}
              </Typography>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Typography className="text-muted-light">{label}</Typography>
      <div className="max-w-[58%] rounded-xl bg-surface-alt px-3 py-2">
        <Typography as="span" className="font-semibold">
          {value}
        </Typography>
      </div>
    </div>
  );
}
