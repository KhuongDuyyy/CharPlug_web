# Screen Inventory

## Source-of-Truth Rule
- Web UI is derived from rendered JSX in `ChargePlug_user`, not from model/entity shape.
- Copy precedence is fixed:
  1. JSX text actually rendered by the screen
  2. `constants/i18n.ts` keys that screen already uses
  3. shared reused copy only where the app clearly reuses it
- Mock entities may contain more fields, but web view-models only expose fields listed below.

## Shared Token Sources
- Color and surface tokens: `ChargePlug_user/styles/tokens.shared.js`
- Typography scale and weights: `ChargePlug_user/styles/typography.shared.js`
- Web mirror: `CharPlug_web/lib/design-tokens/tokens.ts`
- Web copy source: `CharPlug_web/lib/constants/i18n.ts`

## Screen Map

### Login
- App route: `app/(auth)/login.tsx`
- Web route: `/login`
- Shared components: `FormField`, auth card shell
- Copy source: `login_*`
- States: idle, field/server error, member loading, visitor loading
- CTAs: `login_button`, `login_visitor_button`, `login_sign_up`
- Modal/sheet: none
- Rendered fields: title, subtitle, email, password, error line, primary CTA, visitor CTA, sign-up line
- Hidden fields: account id, role, token, profile metadata

### Register
- App route: `app/(auth)/register.tsx`
- Web route: `/register`
- Shared components: `FormField`, auth card shell
- Copy source: `register_*`
- States: idle, validation error, submit loading, generic failure
- CTAs: `register_button`, `register_sign_in`
- Modal/sheet: none
- Rendered fields: name, email, phone, password, confirm password, terms line, error line, submit CTA
- Hidden fields: verification payload, internal validation metadata

### Verify Email
- App route: `app/(auth)/verify-email.tsx`
- Web route: `/verify-email`
- Shared components: auth card shell
- Copy source: `verify_*`
- States: idle, resend loading, resend success, resend error, resend cooldown
- CTAs: `verify_resend`, `verify_back_to_login`
- Modal/sheet: none
- Rendered fields: icon, title, message, email, resend CTA, back CTA
- Hidden fields: accountId, cooldown config internals

### Upgrade
- App route: `app/upgrade.tsx`
- Web route: `/upgrade`
- Shared components: `FormField`, auth card shell
- Copy source: `upgrade_*`, reused `register_*`
- States: idle, validation error, submit loading
- CTAs: `upgrade_button`, `verify_back_to_login`
- Modal/sheet: none
- Rendered fields: title, subtitle, name, phone, email, password, confirm, error line, submit CTA
- Hidden fields: visitor session metadata, auth/debug payloads

### Dashboard
- App route: `app/(tabs)/dashboard.tsx`
- Web route: `/dashboard`
- Shared components: `PageTitle`, compact stat card, rating dialog
- Copy source: `dashboard_*`
- States: visitor lock, loading, load error, empty, loaded history, rating update
- CTAs: `dashboard_rate_station`, `dashboard_rated_station`, `dashboard_submit_rating`, `dashboard_auth_cta`
- Modal/sheet: centered rating dialog
- Rendered fields: page title, 3 stats, history cards with station/date/address/energy/time/cost, rating CTA
- Hidden fields: pagination metadata, session ids, station ids, raw filter metadata

### Stations List
- App route: `app/(tabs)/stations.tsx`, `components/stations/station-card.tsx`
- Web route: `/stations`
- Shared components: `PageTitle`, `StationCard`
- Copy source: `stations_*`
- States: loading, error, empty, loaded
- CTAs: sort select, station card open, voucher open, distance CTA
- Modal/sheet: none
- Rendered fields: title, sort label, name, address, optional description, rating, voucher chip(s), availability, distance
- Hidden fields: lat/lng, raw socket metadata, internal voucher ids

### Station Detail
- App route: `screen/StationDetailScreen.tsx`
- Web route: `/stations/[id]`
- Shared components: detail summary card, offer card
- Copy source: `station_detail_*`, reused `stations_*`
- States: loading, error, loaded, offers-focus scroll
- CTAs: back, directions, retry
- Modal/sheet: none
- Rendered fields: back header, station name, address, rating, availability, directions CTA, document blocks, offers
- Hidden fields: lat/lng text, opening hours, internal ids, raw district/ward metadata

### Scan
- App route: `app/(tabs)/scan.tsx`
- Web route: `/scan`
- Shared components: scanner frame, error overlay
- Copy source: `products_scan_*`, `scan_*`
- States: guest error, permission required, scanning/loading, invalid QR overlay
- CTAs: permission CTA, upload CTA, retry CTA
- Modal/sheet: full-screen error overlay
- Rendered fields: title, frame, short instruction, permission message, permission CTA, upload CTA, error overlay
- Hidden fields: parsed payload, QR debug values, camera diagnostics

### Plans
- App route: `app/(tabs)/plans.tsx`, `components/plans/PlanCard.tsx`
- Web route: `/plans`
- Shared components: `PlanCard`, `SessionCard`, `ConfirmModal`
- Copy source: `plans_*`, `products_*`, `session_*`
- States: no socket, socket ready, active/pending/extending/stopping session, empty plans, insufficient balance
- CTAs: buy plan, buy more, stop, rescan, top-up
- Modal/sheet: buy/extend confirm, insufficient balance confirm, stop confirm
- Rendered fields: socket name/address/status, session status/remaining/energy/power, plan name/price/duration/energy
- Hidden fields: hardware tracking ids, device telemetry, extra summaries, plan descriptions

### Topup VietQR
- App route: `screen/TopUpVietQR.tsx`
- Web route: `/topup/vietqr`
- Shared components: info row, `ConfirmModal`
- Copy source: `topup_vietqr_*`, `topup_unavailable_*`, common buttons
- States: disabled, loading, create-order error, pending, paid, expired, failed
- CTAs: save QR, retry, continue, close
- Modal/sheet: paid confirm modal
- Rendered fields: back header, title, QR, account name, account number, bank name, amount, transfer content, save QR CTA, save hint
- Hidden fields: order id, expiresAt, raw payment status payload

### Account Root
- App route: `app/(tabs)/account.tsx`
- Web route: `/account`
- Shared components: `SectionTitle`, `AccountActionRow`, `ToastOverlay`
- Copy source: `account_*`, `settings_*`, `language_*`, `theme_*`
- States: member, visitor masked balance, toast
- CTAs: profile, buy-points, history, feedback, support, theme toggle, language toggle, logout
- Modal/sheet: toast overlay only
- Rendered fields: avatar/name/email, balance card, settings toggles, 4 action rows, logout
- Hidden fields: role, token, account id, phone on root, debug/session metadata

### Account Profile
- App source: `components/account/profile-section.tsx`
- Web route: `/account?view=profile`
- Shared components: `FormField`, bottom sheet dialog, toast overlay
- Copy source: `account_profile_*`, `change_password_*`, reused auth labels
- States: idle, save loading, password error, password loading, save success, password success
- CTAs: back, save, open password sheet, update password, cancel
- Modal/sheet: bottom sheet password form
- Rendered fields: avatar, editable name, readonly email, readonly phone, save CTA, password entry row
- Hidden fields: role, account id, security logs

### Buy Points
- App source: `components/account/buy-points-section.tsx`
- Web route: `/account?view=buy-points`
- Shared components: package row, `ConfirmModal`
- Copy source: `account_topup_*`, `topup_unavailable_*`
- States: disabled, package list, confirm modal
- CTAs: package row open, confirm, cancel
- Modal/sheet: centered confirm modal
- Rendered fields: package label, price, chevron, 2 confirm rows
- Hidden fields: product ids, internal payment metadata

### History
- App source: `components/account/transaction-history-section.tsx`
- Web route: `/account?view=history`
- Shared components: compact summary card
- Copy source: `account_history_*`
- States: empty, loaded
- CTAs: back only
- Modal/sheet: none
- Rendered fields: total transaction count, total top-up value, row title, date, optional address, signed amount
- Hidden fields: transaction id, raw created timestamp, internal account metadata

### Feedback
- App source: `components/account/feedback-section.tsx`
- Web route: `/account?view=feedback`
- Shared components: topic picker sheet, `ToastOverlay`, `FormField`
- Copy source: `account_feedback_*`, `feedback_*`, topic keys
- States: idle, locked, rate limited, content error, bad-language error, loading, success toast
- CTAs: back, open topic picker, submit
- Modal/sheet: bottom sheet topic picker
- Rendered fields: heading, intro, topic row, content textarea, counter hint, error line, submit CTA
- Hidden fields: moderation counters, strike counts, internal topic codes

### Support
- App source: `components/account/customer-support-section.tsx`
- Web route: `/account?view=support`
- Shared components: contact row, `SectionTitle`
- Copy source: `account_support_*`
- States: loaded
- CTAs: back, hotline, zalo, email
- Modal/sheet: none
- Rendered fields: contact rows, address block, support notice, FAQ accordion
- Hidden fields: FAQ ids, display order, internal support metadata
