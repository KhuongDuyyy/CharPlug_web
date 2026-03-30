"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { PageMeta } from "@/components/shared/page-meta";
import { PageTitle } from "@/components/shared/page-title";
import { mockServices } from "@/lib/mock/services";
import { useMockApp } from "@/providers/mock-app-provider";

type PermissionState = "loading" | "denied" | "granted" | "blocked";

export default function ScanPage() {
  const router = useRouter();
  const fileInputId = useId();
  const { authMode, scenario, setScannedSocket, t } = useMockApp();
  const [permissionState, setPermissionState] = useState<PermissionState>("loading");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setPermissionState("loading");
    setCameraError("");
    setError("");

    const timeout = window.setTimeout(() => {
      setPermissionState("denied");
    }, 650);

    return () => window.clearTimeout(timeout);
  }, []);

  const actionPrimary = useMemo(
    () => permissionState === "blocked" ? t("products_camera_permission_settings_cta") : t("products_camera_permission_cta"),
    [permissionState, t]
  );

  const simulateScan = async () => {
    if (authMode === "guest") {
      setError(t("scan_error_auth"));
      return;
    }

    setLoading(true);
    setError("");
    try {
      const socket = await mockServices.simulateScan(scenario);
      setScannedSocket(socket);
      router.replace(
        `/plans?hardwareId=${socket.hardwareId}&socketIndex=${socket.socketIndex}&scanToken=${Date.now()}`
      );
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("scan_error_invalid_qr"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const name = file.name.toLowerCase();
      await new Promise((resolve) => window.setTimeout(resolve, 850));

      if (name.includes("multiple")) {
        setError(t("scan_error_multiple_qr_in_image"));
        return;
      }

      if (name.includes("noqr") || name.includes("empty")) {
        setError(t("scan_error_no_qr_in_image"));
        return;
      }

      if (name.includes("camera")) {
        setCameraError(t("scan_error_generic"));
        return;
      }

      await simulateScan();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative flex min-h-full flex-1 overflow-hidden">
      <PageMeta title={t("products_scan_title")} />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.30),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.25),rgba(15,23,42,0.65)),linear-gradient(135deg,#1f2937,#0f172a)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative z-10 flex min-h-full flex-1 flex-col px-5 py-4">
        <div className="mt-4 flex items-center justify-center">
          <PageTitle
            title={t("products_scan_title")}
            showDivider={false}
            className="w-full"
            titleClassName="text-center font-semibold text-accent"
          />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative flex h-[min(56vw,260px)] w-[min(56vw,260px)] max-h-[260px] max-w-[260px] items-center justify-center">
            {permissionState === "granted" ? (
              <button
                type="button"
                aria-label={t("products_scan_title")}
                onClick={simulateScan}
                disabled={loading || uploading}
                className="absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.20),rgba(255,255,255,0.04)_52%,transparent_74%)]"
              />
            ) : (
              <div className="absolute inset-0 rounded-[30px] bg-[rgba(255,255,255,0.05)]" />
            )}

            <div className="absolute inset-0 rounded-[30px] shadow-[0_0_0_9999px_rgba(15,23,42,0.60)]" />
            <div className="absolute inset-0 rounded-[30px] border border-[rgba(244,114,182,0.28)]" />

            <Corner className="left-0 top-0" />
            <Corner className="right-0 top-0 rotate-90" />
            <Corner className="bottom-0 right-0 rotate-180" />
            <Corner className="bottom-0 left-0 -rotate-90" />
          </div>

          <div className="mt-6 flex w-full max-w-[280px] flex-col items-center gap-3 text-center">
            {permissionState === "loading" ? (
              <Typography className="text-[rgba(255,255,255,0.76)]">
                {t("products_camera_permission_loading")}
              </Typography>
            ) : permissionState !== "granted" ? (
              <>
                <Typography className="text-[rgba(255,255,255,0.76)]">
                  {t("products_camera_permission_message")}
                </Typography>
                <Button
                  fullWidth
                  onClick={() => {
                    setPermissionState("granted");
                    setCameraError("");
                  }}
                >
                  {actionPrimary}
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-on-accent">
                  <IconSymbol name="qrcode.viewfinder" size={18} color="var(--cp-accent)" />
                  <Typography className="text-[rgba(255,255,255,0.92)]">
                    {loading ? t("scan_loading") : t("products_scan_instruction")}
                  </Typography>
                </div>
                {cameraError ? (
                  <Typography className="text-center text-danger">{cameraError}</Typography>
                ) : null}
              </>
            )}

            <label
              htmlFor={fileInputId}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 text-accent backdrop-blur"
            >
              <IconSymbol name="message.fill" size={16} color="var(--cp-accent)" />
              <Typography as="span" className="font-semibold text-accent">
                {uploading ? t("scan_loading") : t("products_scan_upload")}
              </Typography>
            </label>
            <input
              id={fileInputId}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </div>
      </div>

      {error ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(0,0,0,0.6)] px-5">
          <div className="w-full max-w-xs space-y-3 rounded-3xl bg-surface p-6 text-center shadow-glass">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft">
              <IconSymbol name="exclamationmark.triangle.fill" size={26} color="var(--cp-danger)" />
            </div>
            <Typography className="text-danger">{error}</Typography>
            <Button
              onClick={() => {
                setError("");
                setCameraError("");
              }}
            >
              {t("scan_try_again")}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <div className={`absolute h-12 w-12 ${className ?? ""}`}>
      <div className="h-12 w-12 border-l-[3px] border-t-[3px] border-accent" />
    </div>
  );
}
