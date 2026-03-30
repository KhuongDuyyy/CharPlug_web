"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { mockRepositories } from "@/lib/mock/repositories";
import { useMockApp } from "@/providers/mock-app-provider";

const scenarioLabelMap = {
  default: "dev_scenario_default",
  visitor: "dev_scenario_visitor",
  "empty-dashboard": "dev_scenario_empty_dashboard",
  "station-offline": "dev_scenario_station_offline",
  "stations-route-error": "dev_scenario_stations_route_error",
  "active-session": "dev_scenario_active_session",
  "plans-created-only": "dev_scenario_plans_created_only",
  "plans-faulted": "dev_scenario_plans_faulted",
  "topup-create-error": "dev_scenario_topup_create_error",
  "topup-session-expired": "dev_scenario_topup_session_expired",
  "topup-paid": "dev_scenario_topup_paid",
  "topup-expired": "dev_scenario_topup_expired",
  "topup-failed": "dev_scenario_topup_failed",
  "feedback-locked": "dev_scenario_feedback_locked",
  "support-contact-error": "dev_scenario_support_contact_error",
  "support-faq-empty": "dev_scenario_support_faq_empty",
  "insufficient-balance": "dev_scenario_insufficient_balance",
  "topup-disabled": "dev_scenario_topup_disabled"
} as const;

export default function MockDevPage() {
  const { applyScenario, scenario, setLanguage, setTheme, theme, language, t } = useMockApp();
  const scenarios = mockRepositories.getScenarioKeys();

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-5 px-5 py-8">
      <Typography as="h1" variant="heading">
        {t("dev_mock_title")}
      </Typography>

      <div className="space-y-3 rounded-card border border-border bg-surface p-5">
        <Typography className="font-semibold">{t("dev_theme_label")}</Typography>
        <div className="flex gap-3">
          <Button
            variant={theme === "light" ? "primary" : "secondary"}
            fullWidth={false}
            onClick={() => setTheme("light")}
          >
            {t("dev_theme_light")}
          </Button>
          <Button
            variant={theme === "dark" ? "primary" : "secondary"}
            fullWidth={false}
            onClick={() => setTheme("dark")}
          >
            {t("dev_theme_dark")}
          </Button>
        </div>
      </div>

      <div className="space-y-3 rounded-card border border-border bg-surface p-5">
        <Typography className="font-semibold">{t("dev_language_label")}</Typography>
        <div className="flex gap-3">
          <Button
            variant={language === "vi" ? "primary" : "secondary"}
            fullWidth={false}
            onClick={() => setLanguage("vi")}
          >
            {t("language_vi")}
          </Button>
          <Button
            variant={language === "en" ? "primary" : "secondary"}
            fullWidth={false}
            onClick={() => setLanguage("en")}
          >
            {t("language_en")}
          </Button>
        </div>
      </div>

      <div className="space-y-3 rounded-card border border-border bg-surface p-5">
        <Typography className="font-semibold">{t("dev_scenario_label")}</Typography>
        <div className="grid gap-3 md:grid-cols-2">
          {scenarios.map((item) => (
            <Button
              key={item}
              variant={scenario === item ? "primary" : "secondary"}
              onClick={() => applyScenario(item)}
            >
              {t(scenarioLabelMap[item])}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
