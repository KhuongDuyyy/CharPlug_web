"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { PageMeta } from "@/components/shared/page-meta";
import { useQueryParams } from "@/hooks/use-query-params";
import { mockServices } from "@/lib/mock/services";
import { useMockApp } from "@/providers/mock-app-provider";

export default function VerifyEmailPage() {
  const params = useQueryParams();
  const { t } = useMockApp();
  const email = params.get("email") ?? t("verify_email_fallback");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      await mockServices.resendVerification();
      setMessage(t("verify_success"));
      setCooldown(30);
      const interval = window.setInterval(() => {
        setCooldown((current) => {
          if (current <= 1) {
            window.clearInterval(interval);
            return 0;
          }
          return current - 1;
        });
      }, 1000);
    } catch {
      setMessage(t("verify_error_resend"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title={t("verify_title")} />
      <div className="space-y-5 rounded-card border border-border bg-surface px-5 py-6 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
          <IconSymbol name="envelope.fill" size={28} color="var(--cp-accent)" />
        </div>
        <div className="space-y-2">
          <Typography as="h1" variant="heading" className="text-accent">
            {t("verify_title")}
          </Typography>
          <Typography className="text-muted">
            {t("verify_message")} <span className="font-semibold text-foreground">{email}</span>
          </Typography>
        </div>

        {message ? (
          <Typography className={message === t("verify_success") ? "text-available" : "text-danger"}>
            {message}
          </Typography>
        ) : null}

        <div className="space-y-3">
          <Button onClick={handleResend} disabled={loading || cooldown > 0}>
            {cooldown > 0
              ? t("verify_resend_cooldown", { seconds: cooldown })
              : loading
                ? t("verify_resending")
                : t("verify_resend")}
          </Button>
          <Link href="/login" className="inline-flex justify-center font-semibold text-accent">
            {t("verify_back_to_login")}
          </Link>
        </div>
      </div>
    </>
  );
}
