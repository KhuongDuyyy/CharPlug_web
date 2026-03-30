"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ScreenScroll } from "@/components/layout/screen-scroll";
import { AccountActionRow } from "@/components/shared/account-action-row";
import { AnchoredPopover } from "@/components/shared/anchored-popover";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { PageMeta } from "@/components/shared/page-meta";
import { PasswordStrengthMeter } from "@/components/shared/password-strength-meter";
import { SectionTitle } from "@/components/shared/section-title";
import { ToastOverlay } from "@/components/shared/toast-overlay";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { useQueryParams } from "@/hooks/use-query-params";
import { formatDateTime } from "@/lib/utils/format";
import { isStrongPassword } from "@/lib/utils/validation";
import { useMockApp } from "@/providers/mock-app-provider";

type Topic = "GENERAL" | "BUG_REPORT" | "IMPROVEMENT" | "FEATURE_REQUEST";
type ChangePasswordField = "currentPassword" | "newPassword" | "confirmPassword";
type ChangePasswordForm = Record<ChangePasswordField, string>;
type ChangePasswordErrors = Partial<Record<ChangePasswordField, string>>;
type FeedbackNotice = {
  message: string;
  title: string;
  tone: "success" | "error";
} | null;

function hasAnyChangePasswordError(errors: ChangePasswordErrors) {
  return Object.values(errors).some(Boolean);
}

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useQueryParams();
  const view = searchParams.get("view") as
    | "profile"
    | "buy-points"
    | "history"
    | "feedback"
    | "support"
    | null;
  const resetRequested = searchParams.get("reset") === "1";
  const {
    authMode,
    balanceVnd,
    changePassword,
    clearToast,
    feedbackState,
    language,
    logout,
    scenario,
    saveProfile,
    submitFeedback,
    setLanguage,
    setTheme,
    supportContact,
    supportFaqs,
    theme,
    toast,
    topupEnabled,
    topupPackages,
    transactions,
    setScrollPosition,
    t,
    user
  } = useMockApp();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [profileName, setProfileName] = useState(user?.name ?? "");
  const [profileAvatarUri, setProfileAvatarUri] = useState<string | null>(user?.avatarUri ?? null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState<ChangePasswordErrors>({});
  const [passwordTouched, setPasswordTouched] = useState<Partial<Record<ChangePasswordField, boolean>>>({});
  const [passwordServerError, setPasswordServerError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [feedbackTopic, setFeedbackTopic] = useState<Topic>("GENERAL");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackNotice, setFeedbackNotice] = useState<FeedbackNotice>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackCountdownNow, setFeedbackCountdownNow] = useState(() => Date.now());
  const [topicAnchor, setTopicAnchor] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [supportContactError, setSupportContactError] = useState("");
  const [supportFaqLoading, setSupportFaqLoading] = useState(false);
  const [supportContactState, setSupportContactState] = useState(supportContact);
  const [supportFaqItems, setSupportFaqItems] = useState(supportFaqs);
  const [openFaqId, setOpenFaqId] = useState<string | null>(supportFaqs[0]?.id ?? null);
  const profileFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setProfileName(user?.name ?? "");
    setProfileAvatarUri(user?.avatarUri ?? null);
  }, [user?.avatarUri, user?.name]);

  useEffect(() => {
    if (!resetRequested || view) {
      return;
    }

    setScrollPosition("account", 0);
    router.replace("/account", { scroll: false });
  }, [resetRequested, router, setScrollPosition, view]);

  useEffect(() => {
    setSupportContactState(supportContact);
  }, [supportContact]);

  useEffect(() => {
    setSupportFaqItems(supportFaqs);
    setOpenFaqId(supportFaqs[0]?.id ?? null);
  }, [supportFaqs]);

  const selectedPackage = useMemo(
    () => topupPackages.find((item) => item.id === selectedPackageId) ?? null,
    [selectedPackageId, topupPackages]
  );

  const validateChangePassword = useMemo(
    () => (values: ChangePasswordForm): ChangePasswordErrors => {
      const next: ChangePasswordErrors = {};

      if (!values.currentPassword.length) {
        next.currentPassword = t("change_password_error_current_required");
      }
      if (!values.newPassword.length) {
        next.newPassword = t("change_password_error_new_required");
      } else if (!isStrongPassword(values.newPassword)) {
        next.newPassword = t("change_password_error_weak");
      }
      if (!values.confirmPassword.length) {
        next.confirmPassword = t("change_password_error_confirm_required");
      } else if (values.confirmPassword !== values.newPassword) {
        next.confirmPassword = t("change_password_error_mismatch");
      }

      return next;
    },
    [t]
  );

  const livePasswordErrors = validateChangePassword(passwordForm);
  const hasProfileChanges =
    profileName.trim() !== (user?.name ?? "") || profileAvatarUri !== (user?.avatarUri ?? null);
  const isChangePasswordDisabled =
    passwordLoading ||
    !passwordForm.currentPassword.length ||
    !passwordForm.newPassword.length ||
    !passwordForm.confirmPassword.length ||
    hasAnyChangePasswordError(livePasswordErrors) ||
    hasAnyChangePasswordError(passwordErrors);
  const lockedUntilMs = feedbackState.lockedUntil
    ? new Date(feedbackState.lockedUntil).getTime()
    : 0;
  const isServerLocked = Boolean(lockedUntilMs && lockedUntilMs > Date.now());
  const lastSubmittedMs = feedbackState.lastSubmittedAt
    ? new Date(feedbackState.lastSubmittedAt).getTime()
    : 0;
  const remainingRateLimitMs = lastSubmittedMs
    ? Math.max(0, 60_000 - (feedbackCountdownNow - lastSubmittedMs))
    : 0;
  const isRateLimited = remainingRateLimitMs > 0;
  const lockedMessage = feedbackState.lockedUntil
    ? t("feedback_locked_message_until", {
        date: new Date(feedbackState.lockedUntil).toLocaleString(
          language === "vi" ? "vi-VN" : "en-US"
        )
      })
    : t("feedback_locked_message_default");
  const rateLimitLabel = useMemo(() => {
    const totalSeconds = Math.max(0, Math.ceil(remainingRateLimitMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const time =
      language === "vi" && seconds === 0
        ? `${minutes} min`
        : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return t("feedback_rate_limit_button", { time });
  }, [language, remainingRateLimitMs, t]);

  useEffect(() => {
    if (!isRateLimited) {
      return;
    }

    const interval = window.setInterval(() => {
      setFeedbackCountdownNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRateLimited]);

  useEffect(() => {
    if (view !== "support") {
      return;
    }

    let active = true;
    setSupportContactError("");
    setSupportFaqLoading(true);

    const contactTimeout = window.setTimeout(() => {
      if (!active) {
        return;
      }

      if (scenario === "support-contact-error") {
        setSupportContactState({
          phone: "",
          zalo: "",
          email: "",
          address: ""
        });
        setSupportContactError(t("support_load_error"));
        return;
      }

      setSupportContactState(supportContact);
    }, 350);

    const faqTimeout = window.setTimeout(() => {
      if (!active) {
        return;
      }

      if (scenario === "support-faq-empty") {
        setSupportFaqItems([]);
      } else {
        setSupportFaqItems(supportFaqs);
      }
      setOpenFaqId((current) => current ?? supportFaqs[0]?.id ?? null);
      setSupportFaqLoading(false);
    }, 500);

    return () => {
      active = false;
      window.clearTimeout(contactTimeout);
      window.clearTimeout(faqTimeout);
    };
  }, [scenario, supportContact, supportFaqs, t, view]);

  useEffect(() => {
    if (!feedbackLoading && !isServerLocked) {
      return;
    }

    setTopicAnchor(null);
  }, [feedbackLoading, isServerLocked]);

  const goRoot = () => router.replace("/account");
  const openView = (nextView: string) => router.push(`/account?view=${nextView}`);
  const guardMember = (nextView: string) => {
    if (
      authMode === "visitor" &&
      (nextView === "profile" || nextView === "buy-points" || nextView === "history")
    ) {
      router.push("/upgrade");
      return;
    }
    openView(nextView);
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordErrors({});
    setPasswordTouched({});
    setPasswordServerError("");
  };

  const saveProfileAction = async () => {
    setProfileLoading(true);
    await saveProfile({ name: profileName, avatarUri: profileAvatarUri });
    setProfileLoading(false);
  };

  const handlePasswordFieldChange =
    (field: ChangePasswordField) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.currentTarget.value;
      setPasswordForm((current) => {
        const next = { ...current, [field]: value };
        if (Object.values(passwordTouched).some(Boolean)) {
          setPasswordErrors(validateChangePassword(next));
        }
        return next;
      });
      setPasswordServerError("");
    };

  const handlePasswordFieldBlur = (field: ChangePasswordField) => {
    setPasswordTouched((current) => ({ ...current, [field]: true }));
    setPasswordErrors(validateChangePassword(passwordForm));
  };

  const changePasswordAction = async () => {
    const nextErrors = validateChangePassword(passwordForm);
    setPasswordErrors(nextErrors);
    setPasswordTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true
    });

    if (hasAnyChangePasswordError(nextErrors)) {
      return;
    }

    setPasswordServerError("");
    setPasswordLoading(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        nextPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });
      setPasswordOpen(false);
      resetPasswordForm();
    } catch (error) {
      if (error instanceof Error && error.message === t("change_password_error_invalid_current")) {
        setPasswordErrors((current) => ({
          ...current,
          currentPassword: t("change_password_error_invalid_current")
        }));
        setPasswordTouched((current) => ({ ...current, currentPassword: true }));
      } else if (error instanceof Error && error.message === t("change_password_error_mismatch")) {
        setPasswordErrors((current) => ({
          ...current,
          confirmPassword: t("change_password_error_mismatch")
        }));
        setPasswordTouched((current) => ({ ...current, confirmPassword: true }));
      } else if (error instanceof Error && error.message === t("change_password_error_weak")) {
        setPasswordErrors((current) => ({
          ...current,
          newPassword: t("change_password_error_weak")
        }));
        setPasswordTouched((current) => ({ ...current, newPassword: true }));
      } else {
        setPasswordServerError(
          error instanceof Error ? error.message : t("change_password_error_generic")
        );
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const openAvatarPicker = () => {
    profileFileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileAvatarUri(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.currentTarget.value = "";
  };

  const submitFeedbackAction = async () => {
    if (isRateLimited) {
      return;
    }

    if (isServerLocked) {
      setFeedbackNotice({
        tone: "error",
        title: t("feedback_locked_title"),
        message: lockedMessage
      });
      return;
    }

    const trimmedContent = feedbackContent.trim();
    if (!trimmedContent) {
      setFeedbackNotice({
        tone: "error",
        title: t("feedback_error_title"),
        message: t("feedback_content_required")
      });
      return;
    }

    setFeedbackLoading(true);
    setFeedbackNotice(null);

    try {
      await submitFeedback({
        topic: feedbackTopic,
        content: trimmedContent
      });
      setFeedbackContent("");
      setFeedbackTopic("GENERAL");
      goRoot();
    } catch (error) {
      setFeedbackNotice({
        tone: "error",
        title: t("feedback_error_title"),
        message:
          error instanceof Error
            ? error.message
            : t("feedback_submit_failed")
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (view === "profile") {
    const initials = (user?.name ?? "NA")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <>
        <PageMeta title={t("profile_title")} />
        <ScreenScroll
          id="account-profile"
          contentClassName="gap-5 px-5 pt-5 pb-10"
        >
          <BackHeader title={t("profile_title")} onBack={goRoot} />
          <input
            ref={profileFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <div className="flex items-center justify-center pt-2">
            <button type="button" onClick={openAvatarPicker} className="cp-press rounded-full">
              {profileAvatarUri ? (
                <img
                  src={profileAvatarUri}
                  alt={user?.name ?? initials}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-on-accent">
                  <Typography variant="heading">{initials}</Typography>
                </div>
              )}
            </button>
          </div>
          <div className="space-y-4 rounded-2xl bg-surface p-4">
            <FormField
              label={t("profile_name")}
              placeholder={t("profile_name_placeholder")}
              value={profileName}
              onChange={(event) => setProfileName(event.currentTarget.value)}
              autoComplete="name"
            />
            <ReadOnlyField label={t("profile_email")} value={user?.email ?? ""} />
            <ReadOnlyField
              label={t("profile_phone")}
              value={user?.phone.trim() || t("profile_phone_placeholder")}
            />
          </div>
          <Button
            disabled={profileLoading || !hasProfileChanges}
            onClick={saveProfileAction}
          >
            {t("profile_save")}
          </Button>
          <button
            onClick={() => setPasswordOpen(true)}
            className="cp-press w-full rounded-2xl bg-surface p-4 text-left"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <Typography className="font-semibold">
                  {t("change_password_title")}
                </Typography>
                <Typography className="text-muted">
                  {t("change_password_action_description")}
                </Typography>
              </div>
              <IconSymbol
                name="chevron.right"
                size={18}
                color="var(--cp-muted)"
              />
            </div>
          </button>
        </ScreenScroll>

        <Dialog
          open={passwordOpen}
          onClose={() => {
            if (passwordLoading) {
              return;
            }
            setPasswordOpen(false);
            resetPasswordForm();
          }}
          variant="bottom"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <Typography variant="heading">
                {t("change_password_title")}
              </Typography>
              <Typography className="text-muted">
                {t("change_password_panel_subtitle")}
              </Typography>
            </div>
            <FormField
              label={t("change_password_current_label")}
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordFieldChange("currentPassword")}
              onBlur={() => handlePasswordFieldBlur("currentPassword")}
              placeholder={t("change_password_current_placeholder")}
              autoComplete="current-password"
              error={passwordTouched.currentPassword ? passwordErrors.currentPassword : null}
            />
            <div className="space-y-2">
              <FormField
                label={t("change_password_new_label")}
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordFieldChange("newPassword")}
                onBlur={() => handlePasswordFieldBlur("newPassword")}
                placeholder={t("change_password_new_placeholder")}
                autoComplete="new-password"
                error={passwordTouched.newPassword ? passwordErrors.newPassword : null}
              />
              {passwordForm.newPassword.length > 0 && !passwordTouched.newPassword ? (
                <PasswordStrengthMeter
                  password={passwordForm.newPassword}
                  hint={t("password_strength_hint")}
                />
              ) : null}
            </div>
            <FormField
              label={t("change_password_confirm_label")}
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordFieldChange("confirmPassword")}
              onBlur={() => handlePasswordFieldBlur("confirmPassword")}
              placeholder={t("change_password_confirm_placeholder")}
              autoComplete="new-password"
              error={passwordTouched.confirmPassword ? passwordErrors.confirmPassword : null}
            />
            {passwordServerError ? (
              <Typography className="text-danger">{passwordServerError}</Typography>
            ) : null}
            <div className="space-y-3">
              <Button
                variant="secondary"
                onClick={() => {
                  if (passwordLoading) {
                    return;
                  }
                  setPasswordOpen(false);
                  resetPasswordForm();
                }}
                disabled={passwordLoading}
              >
                {t("change_password_cancel")}
              </Button>
              <Button onClick={changePasswordAction} disabled={isChangePasswordDisabled}>
                {passwordLoading
                  ? t("change_password_submitting")
                  : t("change_password_submit")}
              </Button>
            </div>
          </div>
        </Dialog>

        <ToastOverlay
          open={Boolean(toast)}
          title={toast?.title ?? ""}
          message={toast?.message}
          tone={toast?.tone ?? "success"}
          onClose={clearToast}
        />
      </>
    );
  }

  if (view === "buy-points") {
    return (
      <>
        <PageMeta title={t("account_buy_points_title")} />
        <ScreenScroll
          id="account-buy-points"
          contentClassName="gap-4 px-5 pt-5 pb-10"
        >
          <BackHeader title={t("account_buy_points_title")} onBack={goRoot} />
          {!topupEnabled ? (
            <div className="space-y-3 rounded-card border border-border bg-surface p-5">
              <Typography variant="heading" className="text-danger">
                {t("topup_unavailable_title")}
              </Typography>
              <Typography className="text-muted">
                {t("topup_unavailable_message")}
              </Typography>
            </div>
          ) : (
            topupPackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackageId(pkg.id)}
                className="cp-press flex w-full items-center justify-between rounded-2xl bg-surface p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">
                    <IconSymbol
                      name="star.fill"
                      size={20}
                      color="var(--cp-accent)"
                    />
                  </div>
                  <Typography className="font-semibold">
                    {t("account_topup_package_label", { label: pkg.priceLabel })}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <Typography variant="heading">
                    {pkg.priceVnd.toLocaleString("vi-VN")}đ
                  </Typography>
                  <IconSymbol
                    name="chevron.right"
                    size={16}
                    color="var(--cp-muted)"
                  />
                </div>
              </button>
            ))
          )}
        </ScreenScroll>

        <ConfirmModal
          open={Boolean(selectedPackage)}
          title={t("account_topup_confirm_title")}
          rows={
            selectedPackage
              ? [
                  {
                    label: t("account_topup_received_amount"),
                    value: `${selectedPackage.priceVnd.toLocaleString("vi-VN")} VND`
                  },
                  {
                    label: t("account_topup_payment_amount"),
                    value: `${selectedPackage.priceVnd.toLocaleString("vi-VN")} VND`
                  }
                ]
              : []
          }
          confirmLabel={t("account_topup_confirm_button")}
          cancelLabel={t("common_cancel")}
          onConfirm={() => {
            if (!selectedPackage) return;
            router.push(
              `/topup/vietqr?amount=${selectedPackage.priceVnd}&packageId=${selectedPackage.id}&mode=standard`
            );
          }}
          onCancel={() => setSelectedPackageId(null)}
        />
      </>
    );
  }

  if (view === "history") {
    const totalTopup = transactions
      .filter((tx) => tx.type === "topup")
      .reduce((sum, tx) => sum + tx.amountVnd, 0);

    return (
      <>
        <PageMeta title={t("account_history_title")} />
        <ScreenScroll
          id="account-history"
          contentClassName="gap-4 px-5 pt-5 pb-10"
        >
          <BackHeader title={t("account_history_title")} onBack={goRoot} />
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              label={t("account_history_total_transactions")}
              value={String(transactions.length)}
              tone="accent"
            />
            <SummaryCard
              label={t("account_history_total_topup")}
              value={totalTopup.toLocaleString("vi-VN")}
              tone="success"
            />
          </div>
          {transactions.length === 0 ? (
            <div className="rounded-card border border-border bg-surface p-4 text-center text-muted">
              {t("account_history_empty")}
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="rounded-2xl bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <Typography className="font-semibold">
                      {tx.type === "spend"
                        ? t("account_history_spend_item", {
                            label: tx.packageLabel
                          })
                        : t("account_history_topup_item", {
                            label: tx.packageLabel
                          })}
                    </Typography>
                    <Typography className="text-muted">
                      {formatDateTime(tx.date, language)}
                    </Typography>
                    {tx.address ? (
                      <Typography className="text-muted">{tx.address}</Typography>
                    ) : null}
                  </div>
                  <Typography
                    className={
                      tx.type === "spend"
                        ? "font-semibold text-info"
                        : "font-semibold text-success"
                    }
                  >
                    {tx.type === "spend" ? "-" : "+"}
                    {tx.amountVnd.toLocaleString("vi-VN")}đ
                  </Typography>
                </div>
              </div>
            ))
          )}
        </ScreenScroll>
      </>
    );
  }

  if (view === "feedback") {
    return (
      <>
        <PageMeta title={t("feedback_title")} />
        <ScreenScroll
          id="account-feedback"
          contentClassName="gap-5 px-5 pt-5 pb-10"
        >
          <BackHeader title={t("feedback_title")} onBack={goRoot} />
          <div className="space-y-2 rounded-card bg-accent-soft p-5">
            <Typography variant="heading" className="text-accent">
              {t("feedback_heading")}
            </Typography>
            <Typography className="text-muted">
              {t("feedback_intro")}
            </Typography>
          </div>

          <div className="space-y-3">
            <Typography className="font-semibold text-muted-light">
              {t("feedback_filter_label")}
            </Typography>
            <button
              disabled={feedbackLoading || isServerLocked}
              onClick={(event) => {
                if (feedbackLoading || isServerLocked) {
                  return;
                }
                const rect = event.currentTarget.getBoundingClientRect();
                setTopicAnchor({
                  x: rect.x,
                  y: rect.y,
                  width: rect.width,
                  height: rect.height
                });
              }}
              className={`cp-press flex w-full items-center justify-between rounded-2xl border px-4 py-3 ${
                topicAnchor
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-surface-alt"
              } ${feedbackLoading || isServerLocked ? "opacity-60" : ""}`}
            >
              <Typography>{topicLabel(feedbackTopic, t)}</Typography>
              <IconSymbol
                name="chevron.right"
                size={16}
                color={topicAnchor ? "var(--cp-foreground)" : "var(--cp-muted)"}
                className="rotate-90"
              />
            </button>
          </div>

          {isServerLocked ? (
            <div className="rounded-2xl border border-danger bg-danger-soft px-4 py-3">
              <Typography className="font-semibold text-danger">{t("feedback_locked_title")}</Typography>
              <Typography className="text-danger">
                {lockedMessage}
              </Typography>
            </div>
          ) : null}

          <FormField
            label={t("feedback_content_label")}
            multiline
            value={feedbackContent}
            onChange={(event) => {
              setFeedbackContent(event.currentTarget.value);
              if (feedbackNotice) {
                setFeedbackNotice(null);
              }
            }}
            onFocus={() => setTopicAnchor(null)}
            placeholder={t("feedback_content_placeholder")}
            disabled={feedbackLoading || isServerLocked}
            maxLength={2000}
          />
          <Typography
            className={`${
              feedbackContent.length >= 1950
                ? "text-danger"
                : feedbackContent.length >= 1800
                  ? "text-warning"
                  : "text-muted"
            }`}
          >
            {t("feedback_content_hint", { count: feedbackContent.length })}
          </Typography>

          {feedbackNotice ? (
            <div
              className={`rounded-2xl border px-4 py-3 ${
                feedbackNotice.tone === "success"
                  ? "border-available bg-available-soft"
                  : "border-danger bg-danger-soft"
              }`}
            >
              <div className="flex items-start gap-2">
                <IconSymbol
                  name={
                    feedbackNotice.tone === "success"
                      ? "checkmark.circle.fill"
                      : "exclamationmark.triangle.fill"
                  }
                  size={16}
                  color={
                    feedbackNotice.tone === "success"
                      ? "var(--cp-available)"
                      : "var(--cp-danger)"
                  }
                />
                <div className="space-y-1">
                  <Typography
                    className={`font-semibold ${
                      feedbackNotice.tone === "success" ? "text-available" : "text-danger"
                    }`}
                  >
                    {feedbackNotice.title}
                  </Typography>
                  <Typography
                    className={
                      feedbackNotice.tone === "success" ? "text-available" : "text-danger"
                    }
                  >
                    {feedbackNotice.message}
                  </Typography>
                </div>
              </div>
            </div>
          ) : null}

          <Button
            disabled={feedbackLoading || isServerLocked || isRateLimited}
            onClick={submitFeedbackAction}
          >
            {isServerLocked
              ? t("feedback_locked_button")
              : isRateLimited
                ? rateLimitLabel
                : feedbackLoading
                  ? t("feedback_submitting")
                  : t("feedback_submit")}
          </Button>
        </ScreenScroll>

        <AnchoredPopover
          open={Boolean(topicAnchor)}
          anchor={topicAnchor}
          onClose={() => setTopicAnchor(null)}
        >
          <div className="space-y-2">
            {(
              ["GENERAL", "BUG_REPORT", "IMPROVEMENT", "FEATURE_REQUEST"] as Topic[]
            ).map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setFeedbackTopic(topic);
                  setTopicAnchor(null);
                }}
                className="cp-press flex w-full items-center justify-between rounded-2xl border border-border px-4 py-3 text-left"
              >
                <Typography>{topicLabel(topic, t)}</Typography>
                {feedbackTopic === topic ? (
                  <IconSymbol
                    name="checkmark"
                    size={16}
                    color="var(--cp-accent)"
                  />
                ) : null}
              </button>
            ))}
          </div>
        </AnchoredPopover>

        <ToastOverlay
          open={Boolean(toast)}
          title={toast?.title ?? ""}
          message={toast?.message}
          tone={toast?.tone ?? "success"}
          onClose={clearToast}
        />
      </>
    );
  }

  if (view === "support") {
    return (
      <>
        <PageMeta title={t("support_title")} />
        <ScreenScroll
          id="account-support"
          contentClassName="gap-4 px-5 pt-5 pb-10"
        >
          <BackHeader title={t("support_title")} onBack={goRoot} />
          {supportContactError ? (
            <div className="rounded-2xl border border-danger bg-danger-soft px-4 py-3">
              <Typography className="text-danger">{supportContactError}</Typography>
            </div>
          ) : null}
          <SectionTitle title={t("support_contact")} icon="phone.fill" />
          <SupportRow
            icon="phone.fill"
            label={t("support_phone")}
            value={supportContactState.phone || "-"}
            tone="success"
            href={supportContactState.phone ? `tel:${supportContactState.phone}` : null}
          />
          <SupportRow
            icon="message.fill"
            label={t("support_zalo")}
            value={supportContactState.zalo || "-"}
            tone="info"
            href={supportContactState.zalo ? `https://zalo.me/${supportContactState.zalo}` : null}
          />
          <SupportRow
            icon="envelope.fill"
            label={t("support_email")}
            value={supportContactState.email || "-"}
            tone="info"
            href={supportContactState.email ? `mailto:${supportContactState.email}` : null}
          />
          <div className="rounded-2xl bg-surface p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-soft">
                <IconSymbol
                  name="location.fill"
                  size={20}
                  color="var(--cp-warning)"
                />
              </div>
              <div className="space-y-1">
                <Typography className="font-semibold">
                  {t("support_address")}
                </Typography>
                <Typography className="text-accent">
                  {supportContactState.address || "-"}
                </Typography>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-accent-soft p-4">
            <Typography className="text-accent">
              {t("support_hours")}
            </Typography>
          </div>
          <SectionTitle
            title={t("support_faq_title")}
            icon="message.fill"
            className="mt-2"
          />
          {supportFaqLoading ? (
            <div className="rounded-2xl bg-surface p-4">
              <Typography className="text-muted">{t("support_faq_loading")}</Typography>
            </div>
          ) : (
            supportFaqItems.length === 0 ? (
              <div className="rounded-2xl bg-surface p-4">
                <Typography className="text-muted">{t("support_faq_empty")}</Typography>
              </div>
            ) : (
              supportFaqItems.map((faq) => {
              const open = openFaqId === faq.id;
              return (
                <div key={faq.id} className="overflow-hidden rounded-2xl bg-surface">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId((current) => (current === faq.id ? null : faq.id))}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                  >
                    <Typography className="font-semibold">{faq.question}</Typography>
                    <IconSymbol
                      name={open ? "chevron.down" : "chevron.right"}
                      size={16}
                      color="var(--cp-muted)"
                    />
                  </button>
                  {open ? (
                    <div className="border-t border-border px-4 py-4">
                      <Typography className="text-muted">{faq.answer}</Typography>
                    </div>
                  ) : null}
                </div>
              );
              })
            )
          )}
        </ScreenScroll>
      </>
    );
  }

  return (
    <>
      <PageMeta title={t("tab_account")} />
      <ScreenScroll
        id="account"
        restoreToken={resetRequested ? "reset" : "default"}
        initialScrollTop={resetRequested ? 0 : undefined}
      >
        <button
          onClick={() => guardMember("profile")}
          className="cp-press flex w-full items-center gap-4 rounded-2xl bg-surface p-4 text-left"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-on-accent">
            {(user?.name ?? "NA").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 space-y-1">
            <Typography as="div" className="font-semibold">
              {user?.name ?? ""}
            </Typography>
            <Typography as="div" className="text-muted">
              {user?.email ?? ""}
            </Typography>
          </div>
          <IconSymbol name="chevron.right" size={18} color="var(--cp-muted)" />
        </button>

        <div className="rounded-card border border-border bg-surface p-5 shadow-soft">
          <div className="space-y-2">
            <Typography className="text-muted">
              {t("account_points_label")}
            </Typography>
            <Typography variant="heading" className="text-success">
              {authMode === "visitor" ? "••••••" : balanceVnd.toLocaleString("vi-VN")}
            </Typography>
          </div>
        </div>

        <SectionTitle title={t("settings_title")} icon="wrench.fill" className="mt-2" />
        <div className="space-y-3 rounded-2xl bg-surface p-4">
          <SegmentedRow
            label={t("setting_theme")}
            options={[
              {
                label: t("theme_light"),
                active: theme === "light",
                onClick: () => setTheme("light")
              },
              {
                label: t("theme_dark"),
                active: theme === "dark",
                onClick: () => setTheme("dark")
              }
            ]}
          />
          <div className="h-px bg-divider" />
          <SegmentedRow
            label={t("setting_language")}
            options={[
              {
                label: t("language_vi"),
                active: language === "vi",
                onClick: () => setLanguage("vi")
              },
              {
                label: t("language_en"),
                active: language === "en",
                onClick: () => setLanguage("en")
              }
            ]}
          />
        </div>

        <SectionTitle title={t("account_manage")} icon="person.fill" className="mt-2" />
        <div className="space-y-3">
          <AccountActionRow
            title={t("account_topup_action_title")}
            description={t("account_topup_action_description")}
            locked={authMode === "visitor"}
            onClick={() => guardMember("buy-points")}
          />
          <AccountActionRow
            title={t("account_history_action_title")}
            description={t("account_history_action_description")}
            locked={authMode === "visitor"}
            onClick={() => guardMember("history")}
          />
          <AccountActionRow
            title={t("account_feedback_action_title")}
            description={t("account_feedback_action_description")}
            onClick={() => openView("feedback")}
          />
          <AccountActionRow
            title={t("account_support_action_title")}
            description={t("account_support_action_description")}
            onClick={() => openView("support")}
          />
        </div>

        <Button variant="danger" onClick={logout}>
          {t("account_logout")}
        </Button>
      </ScreenScroll>

      <ToastOverlay
        open={Boolean(toast)}
        title={toast?.title ?? ""}
        message={toast?.message}
        tone={toast?.tone ?? "success"}
        onClose={clearToast}
      />
    </>
  );
}

function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onBack}
        className="cp-press flex h-10 w-10 items-center justify-center rounded-xl bg-surface"
      >
        <IconSymbol name="chevron.left" size={20} color="var(--cp-accent)" />
      </button>
      <Typography as="h1" variant="heading">
        {title}
      </Typography>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Typography className="font-semibold text-muted-light">{label}</Typography>
      <div className="rounded-xl border border-border bg-surface-alt px-4 py-3">
        <Typography className="text-muted">{value}</Typography>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "accent" | "success";
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        tone === "accent" ? "bg-accent-soft" : "bg-success-soft"
      }`}
    >
      <Typography className="text-muted-light">{label}</Typography>
      <Typography variant="heading">{value}</Typography>
    </div>
  );
}

function SegmentedRow({
  label,
  options
}: {
  label: string;
  options: Array<{ label: string; active: boolean; onClick: () => void }>;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Typography className="font-semibold">{label}</Typography>
      <div className="flex rounded-full bg-surface-alt p-1">
        {options.map((option) => (
          <button
            key={option.label}
            onClick={option.onClick}
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              option.active ? "bg-accent text-on-accent" : "text-muted-light"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SupportRow({
  icon,
  label,
  tone,
  value,
  href
}: {
  icon: "phone.fill" | "message.fill" | "envelope.fill";
  label: string;
  tone: "success" | "info";
  value: string;
  href: string | null;
}) {
  const toneClass =
    tone === "success"
      ? {
          background: "bg-success-soft",
          color: "var(--cp-success)"
        }
      : {
          background: "bg-info-soft",
          color: "var(--cp-info)"
        };
  const content = (
    <>
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClass.background}`}
      >
        <IconSymbol name={icon} size={20} color={toneClass.color} />
      </div>
      <div className="flex-1 space-y-1">
        <Typography className="font-semibold">{label}</Typography>
        <Typography className="text-accent">{value}</Typography>
      </div>
      <IconSymbol name="chevron.right" size={16} color="var(--cp-muted)" />
    </>
  );

  if (!href) {
    return (
      <div
        aria-disabled="true"
        className="flex items-center gap-4 rounded-2xl bg-surface p-4"
      >
        {content}
      </div>
    );
  }

  return (
    <a href={href} className="cp-press flex items-center gap-4 rounded-2xl bg-surface p-4">
      {content}
    </a>
  );
}

function topicLabel(
  topic: Topic,
  t: (
    key:
      | "feedback_option_general"
      | "feedback_option_bug_report"
      | "feedback_option_improvement"
      | "feedback_option_feature_request"
  ) => string
) {
  if (topic === "BUG_REPORT") return t("feedback_option_bug_report");
  if (topic === "IMPROVEMENT") return t("feedback_option_improvement");
  if (topic === "FEATURE_REQUEST") return t("feedback_option_feature_request");
  return t("feedback_option_general");
}
