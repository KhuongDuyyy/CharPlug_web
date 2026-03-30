"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Typography } from "@/components/ui/typography";
import { PageMeta } from "@/components/shared/page-meta";
import { useMockApp } from "@/providers/mock-app-provider";

export default function LoginPage() {
  const router = useRouter();
  const { authMode, loginMember, continueAsVisitor, t } = useMockApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visitorLoading, setVisitorLoading] = useState(false);

  useEffect(() => {
    const remembered = window.localStorage.getItem("charplug-remembered-email");
    if (remembered) {
      setEmail(remembered);
    }
  }, []);

  useEffect(() => {
    if (authMode !== "guest") {
      router.replace("/scan");
    }
  }, [authMode, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError(t("register_error_required"));
      return;
    }

    if (!password.trim()) {
      setPasswordError(t("register_error_required"));
      return;
    }

    setLoading(true);
    try {
      await loginMember(email, password);
      window.localStorage.setItem("charplug-remembered-email", email.trim());
      router.replace("/scan");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : t("login_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleVisitor = async () => {
    setError("");
    setVisitorLoading(true);
    await continueAsVisitor();
    router.replace("/scan");
  };

  return (
    <>
      <PageMeta title={t("login_title")} />
      <form onSubmit={handleSubmit} className="space-y-5 rounded-card border border-border bg-surface px-5 py-6 shadow-soft">
        <div className="space-y-2">
          <Typography as="h1" variant="heading" className="text-accent">
            {t("login_title")}
          </Typography>
          <Typography className="text-muted">{t("login_subtitle")}</Typography>
        </div>

        <div className="space-y-4">
          <FormField
            label={t("login_email")}
            type="email"
            placeholder={t("login_email_placeholder")}
            value={email}
            error={emailError}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <FormField
            label={t("login_password")}
            type="password"
            placeholder={t("login_password_placeholder")}
            value={password}
            error={passwordError}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </div>

        {error ? <Typography className="text-danger">{error}</Typography> : null}

        <div className="space-y-3">
          <Button type="submit" disabled={loading || visitorLoading}>
            {loading ? t("login_processing") : t("login_button")}
          </Button>
          <Button type="button" variant="secondary" disabled={loading || visitorLoading} onClick={handleVisitor}>
            {visitorLoading ? t("login_visitor_processing") : t("login_visitor_button")}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Typography className="text-muted">{t("login_no_account")}</Typography>
          <Link href="/register" className="font-semibold text-accent">
            {t("login_sign_up")}
          </Link>
        </div>
      </form>
    </>
  );
}
