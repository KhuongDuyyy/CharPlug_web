# Mobile Parity Notes

- Shell follows app priority: branded gradient header, content in a single scroll owner, fixed bottom tab, center floating scan CTA.
- Repeated components are unified before screen composition: `PageTitle`, `FormField`, `StationCard`, `PlanCard`, `SessionCard`, `AccountActionRow`, `ConfirmModal`, `ToastOverlay`.
- Station cards keep the rich rounded composition instead of collapsing into generic list rows.
- Plans/account/topup use short rows and compact copy to avoid web-only density.
- Error/loading blocks stay short and inline, matching app tone more than dashboard-style banners.
- Safe-area and mobile browser handling are locked in shell/provider:
  - dynamic viewport height via `--cp-vh`
  - safe top/bottom via `env(safe-area-inset-*)`
  - bottom tab and scan CTA anchored above mobile browser chrome
- Mobile parity preserved most strongly on:
  - header chrome + tab shell
  - station cards
  - plan/session composition
  - account subview density
