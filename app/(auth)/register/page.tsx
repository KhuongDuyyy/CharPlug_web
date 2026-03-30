"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { PasswordStrengthMeter } from "@/components/shared/password-strength-meter";
import { PageMeta } from "@/components/shared/page-meta";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils/cn";
import {
  isStrongPassword,
  isValidEmail,
  isValidVietnamesePhone
} from "@/lib/utils/validation";
import { useMockApp } from "@/providers/mock-app-provider";

type RegisterField =
  | "name"
  | "email"
  | "phone"
  | "password"
  | "confirmPassword"
  | "terms";

type RegisterForm = {
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  termsAccepted: boolean;
};

type RegisterErrors = Partial<Record<RegisterField, string>>;
type RegisterTouched = Partial<Record<RegisterField, boolean>>;

function hasAnyError(errors: RegisterErrors) {
  return Object.values(errors).some(Boolean);
}

export default function RegisterPage() {
  const router = useRouter();
  const { registerMember, t } = useMockApp();
  const [form, setForm] = useState<RegisterForm>({
    confirmPassword: "",
    email: "",
    name: "",
    password: "",
    phone: "",
    termsAccepted: false
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [touched, setTouched] = useState<RegisterTouched>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSubmitDisabled = hasAnyError(errors) || Boolean(serverError);

  const validate = useMemo(
    () => (values: RegisterForm): RegisterErrors => {
      const next: RegisterErrors = {};

      if (!values.name.trim() || values.name.trim().length < 2) {
        next.name = t("register_error_required");
      }
      if (!values.email.trim()) {
        next.email = t("register_error_required");
      } else if (!isValidEmail(values.email.trim().toLowerCase())) {
        next.email = t("register_error_email_invalid");
      }
      if (!values.phone.trim()) {
        next.phone = t("register_error_required");
      } else if (!isValidVietnamesePhone(values.phone.trim())) {
        next.phone = t("register_error_phone_invalid");
      }
      if (!values.password) {
        next.password = t("register_error_required");
      } else if (!isStrongPassword(values.password)) {
        next.password = t("register_error_password_weak");
      }
      if (!values.confirmPassword) {
        next.confirmPassword = t("register_error_required");
      } else if (values.confirmPassword !== values.password) {
        next.confirmPassword = t("register_error_password_mismatch");
      }
      if (!values.termsAccepted) {
        next.terms = t("register_error_terms_required");
      }

      return next;
    },
    [t]
  );

  const runFieldValidation = (field: RegisterField, nextForm?: RegisterForm) => {
    const nextErrors = validate(nextForm ?? form);
    setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
  };

  const handleChange =
    (field: Exclude<RegisterField, "terms">) =>
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

  const handleBlur = (field: RegisterField) => {
    setTouched((current) => ({ ...current, [field]: true }));
    runFieldValidation(field);
  };

  const toggleTerms = () => {
    setForm((current) => {
      const next = { ...current, termsAccepted: !current.termsAccepted };
      if (touched.terms) {
        runFieldValidation("terms", next);
      }
      return next;
    });
    setServerError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setTouched({
      confirmPassword: true,
      email: true,
      name: true,
      password: true,
      phone: true,
      terms: true
    });

    if (hasAnyError(nextErrors)) {
      return;
    }

    setServerError("");
    setLoading(true);

    try {
      const normalizedEmail = form.email.trim().toLowerCase();
      const result = await registerMember({
        email: normalizedEmail,
        name: form.name.trim(),
        password: form.password,
        phone: form.phone.trim()
      });
      router.replace(
        `/verify-email?email=${encodeURIComponent(normalizedEmail)}&accountId=${encodeURIComponent(result.accountId)}`
      );
    } catch (error) {
      if (error instanceof Error && error.message === "register_error_email_exists") {
        setErrors((current) => ({ ...current, email: t("register_error_email_exists") }));
      } else if (error instanceof Error && error.message === "register_error_phone_exists") {
        setErrors((current) => ({ ...current, phone: t("register_error_phone_exists") }));
      } else {
        setServerError(
          error instanceof Error ? error.message : t("register_error_generic")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title={t("register_title")} />
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-card border border-border bg-surface px-5 py-6 shadow-soft"
      >
        <div className="space-y-1 text-center">
          <Typography as="h1" variant="heading">
            {t("register_title")}
          </Typography>
          <Typography className="text-muted">{t("register_subtitle")}</Typography>
        </div>

        <div className="space-y-4">
          <FormField
            label={t("register_name_label")}
            placeholder={t("register_name_placeholder")}
            value={form.name}
            onChange={handleChange("name")}
            onBlur={() => handleBlur("name")}
            autoComplete="name"
            error={touched.name ? errors.name : null}
          />
          <FormField
            label={t("register_email_label")}
            type="email"
            placeholder={t("register_email_placeholder")}
            value={form.email}
            onChange={handleChange("email")}
            onBlur={() => handleBlur("email")}
            autoComplete="email"
            inputMode="email"
            error={touched.email ? errors.email : null}
          />
          <FormField
            label={t("register_phone_label")}
            type="tel"
            placeholder={t("register_phone_placeholder")}
            value={form.phone}
            onChange={handleChange("phone")}
            onBlur={() => handleBlur("phone")}
            autoComplete="tel"
            inputMode="tel"
            error={touched.phone ? errors.phone : null}
          />
          <div className="space-y-2">
            <FormField
              label={t("register_password_label")}
              type="password"
              placeholder={t("register_password_placeholder")}
              value={form.password}
              onChange={handleChange("password")}
              onBlur={() => handleBlur("password")}
              autoComplete="new-password"
              error={touched.password ? errors.password : null}
            />
            {form.password.length > 0 && !touched.password ? (
              <PasswordStrengthMeter
                password={form.password}
                hint={t("password_strength_hint")}
              />
            ) : null}
          </div>
          <FormField
            label={t("register_confirm_password_label")}
            type="password"
            placeholder={t("register_confirm_password_placeholder")}
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            onBlur={() => handleBlur("confirmPassword")}
            autoComplete="new-password"
            error={touched.confirmPassword ? errors.confirmPassword : null}
          />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={toggleTerms}
            onBlur={() => handleBlur("terms")}
            className="flex items-start gap-2 text-left"
            role="checkbox"
            aria-checked={form.termsAccepted}
            aria-label={t("register_terms_link")}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border border-border bg-transparent text-xs font-semibold",
                form.termsAccepted && "border-transparent bg-accent text-on-accent"
              )}
            >
              {form.termsAccepted ? "✓" : ""}
            </span>
            <Typography className="flex-1 text-muted-light">
              {t("register_terms_prefix")}{" "}
              <span className="font-semibold text-accent">{t("register_terms_link")}</span>{" "}
              {t("register_and")}{" "}
              <span className="font-semibold text-accent">{t("register_privacy_link")}</span>
            </Typography>
          </button>

          {touched.terms && errors.terms ? (
            <Typography className="text-danger">{errors.terms}</Typography>
          ) : null}
        </div>

        {serverError ? <Typography className="text-danger">{serverError}</Typography> : null}

        <div className="space-y-3">
          <Button type="submit" disabled={loading || isSubmitDisabled}>
            {loading ? t("register_registering") : t("register_button")}
          </Button>
          <div className="flex items-center justify-center gap-1">
            <Typography className="text-muted">{t("register_has_account")}</Typography>
            <Link href="/login" className="font-semibold text-accent">
              {t("register_sign_in")}
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
