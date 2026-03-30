"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { PageMeta } from "@/components/shared/page-meta";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Typography } from "@/components/ui/typography";
import { useSafeBack } from "@/hooks/use-safe-back";
import {
  isStrongPassword,
  isValidEmail,
  isValidVietnamesePhone
} from "@/lib/utils/validation";
import { useMockApp } from "@/providers/mock-app-provider";

type UpgradeField = "fullName" | "phone" | "email" | "password" | "confirmPassword";
type UpgradeForm = Record<UpgradeField, string>;
type UpgradeErrors = Partial<Record<UpgradeField, string>>;
type UpgradeTouched = Partial<Record<UpgradeField, boolean>>;

function hasAnyError(errors: UpgradeErrors) {
  return Object.values(errors).some(Boolean);
}

export default function UpgradePage() {
  const router = useRouter();
  const { authMode, upgradeVisitor, t } = useMockApp();
  const goBack = useSafeBack("/scan");
  const [form, setForm] = useState<UpgradeForm>({
    confirmPassword: "",
    email: "",
    fullName: "",
    password: "",
    phone: ""
  });
  const [errors, setErrors] = useState<UpgradeErrors>({});
  const [touched, setTouched] = useState<UpgradeTouched>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSubmitDisabled = hasAnyError(errors) || Boolean(serverError);

  useEffect(() => {
    if (authMode === "guest") {
      router.replace("/login");
      return;
    }
    if (authMode !== "visitor") {
      router.replace("/scan");
    }
  }, [authMode, router]);

  const validate = useMemo(
    () => (values: UpgradeForm): UpgradeErrors => {
      const next: UpgradeErrors = {};

      if (!values.fullName.trim() || values.fullName.trim().length < 2) {
        next.fullName = t("upgrade_error_name_min");
      }
      if (!values.phone.trim()) {
        next.phone = t("upgrade_error_phone_required");
      } else if (!isValidVietnamesePhone(values.phone.trim())) {
        next.phone = t("upgrade_error_phone_invalid");
      }
      if (values.email.trim() && !isValidEmail(values.email.trim().toLowerCase())) {
        next.email = t("upgrade_error_email_invalid");
      }
      if (!values.password) {
        next.password = t("upgrade_error_password_required");
      } else if (!isStrongPassword(values.password)) {
        next.password = t("upgrade_error_password_weak");
      }
      if (!values.confirmPassword) {
        next.confirmPassword = t("upgrade_error_confirm_required");
      } else if (values.confirmPassword !== values.password) {
        next.confirmPassword = t("upgrade_error_password_mismatch");
      }

      return next;
    },
    [t]
  );

  const runFieldValidation = (field: UpgradeField, nextForm?: UpgradeForm) => {
    const nextErrors = validate(nextForm ?? form);
    setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
  };

  const handleChange =
    (field: UpgradeField) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.currentTarget.value;
      setForm((current) => {
        const next = { ...current, [field]: value };
        if (touched[field]) {
          runFieldValidation(field, next);
        }
        return next;
      });
      setServerError("");
    };

  const handleBlur = (field: UpgradeField) => {
    setTouched((current) => ({ ...current, [field]: true }));
    runFieldValidation(field);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setTouched({
      confirmPassword: true,
      email: true,
      fullName: true,
      password: true,
      phone: true
    });

    if (hasAnyError(nextErrors)) {
      return;
    }

    setServerError("");
    setLoading(true);

    try {
      await upgradeVisitor({
        confirmPassword: form.confirmPassword,
        email: form.email.trim() ? form.email.trim().toLowerCase() : undefined,
        fullName: form.fullName.trim(),
        password: form.password,
        phone: form.phone.trim()
      });
      router.replace("/scan");
    } catch (error) {
      if (error instanceof Error && error.message === "upgrade_error_phone_exists") {
        setErrors((current) => ({ ...current, phone: t("upgrade_error_phone_exists") }));
      } else if (error instanceof Error && error.message === "upgrade_error_email_exists") {
        setErrors((current) => ({ ...current, email: t("upgrade_error_email_exists") }));
      } else if (error instanceof Error && error.message === "upgrade_error_password_mismatch") {
        setErrors((current) => ({
          ...current,
          confirmPassword: t("upgrade_error_password_mismatch")
        }));
      } else if (error instanceof Error && error.message === "upgrade_error_session_invalid") {
        setServerError(t("upgrade_error_session_invalid"));
      } else {
        setServerError(
          error instanceof Error ? error.message : t("upgrade_error_generic")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-screen flex min-h-screen flex-col bg-background">
      <PageMeta title={t("upgrade_title")} />
      <header className="border-b border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,241,246,0.82),rgba(252,231,243,0.50))] px-5 pb-4 pt-[max(16px,var(--cp-safe-top))]">
        <div className="mx-auto flex max-w-[430px] items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface">
            <Image src="/icon.png" alt="ChargePlug" width={44} height={44} className="h-11 w-11 object-cover" />
          </div>
          <Typography as="div" variant="logo" className="text-[color:#B4A3F0]">
            ChargePlug
          </Typography>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-10 pt-5">
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-md space-y-5 rounded-card border border-border bg-surface px-5 py-6 shadow-soft"
        >
          <div className="space-y-1 text-center">
            <Typography as="h1" variant="heading">
              {t("upgrade_title")}
            </Typography>
            <Typography className="text-muted">{t("upgrade_subtitle")}</Typography>
          </div>

          <div className="space-y-4">
            <FormField
              label={t("upgrade_fullname_label")}
              placeholder={t("upgrade_fullname_placeholder")}
              value={form.fullName}
              onChange={handleChange("fullName")}
              onBlur={() => handleBlur("fullName")}
              autoComplete="name"
              error={touched.fullName ? errors.fullName : null}
            />
            <FormField
              label={t("upgrade_phone_label")}
              type="tel"
              placeholder={t("upgrade_phone_placeholder")}
              value={form.phone}
              onChange={handleChange("phone")}
              onBlur={() => handleBlur("phone")}
              autoComplete="tel"
              inputMode="tel"
              error={touched.phone ? errors.phone : null}
            />
            <FormField
              label={t("upgrade_email_label")}
              type="email"
              placeholder={t("upgrade_email_placeholder")}
              value={form.email}
              onChange={handleChange("email")}
              onBlur={() => handleBlur("email")}
              autoComplete="email"
              inputMode="email"
              error={touched.email ? errors.email : null}
            />
            <FormField
              label={t("upgrade_password_label")}
              type="password"
              placeholder={t("upgrade_password_placeholder")}
              value={form.password}
              onChange={handleChange("password")}
              onBlur={() => handleBlur("password")}
              autoComplete="new-password"
              error={touched.password ? errors.password : null}
            />
            <FormField
              label={t("upgrade_confirm_password_label")}
              type="password"
              placeholder={t("upgrade_confirm_password_placeholder")}
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              autoComplete="new-password"
              error={touched.confirmPassword ? errors.confirmPassword : null}
            />
          </div>

          {serverError ? <Typography className="text-danger">{serverError}</Typography> : null}

          <div className="space-y-3">
            <Button type="submit" disabled={loading || isSubmitDisabled}>
              {loading ? t("upgrade_processing") : t("upgrade_button")}
            </Button>
            <div className="flex items-center justify-center gap-1">
              <Typography className="text-muted">{t("upgrade_continue_guest")}</Typography>
              <button
                type="button"
                onClick={goBack}
                className="font-semibold text-accent"
              >
                {t("upgrade_go_back")}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
