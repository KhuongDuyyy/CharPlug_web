# Acceptance Checklist

## Global Pass / Fail
- Pass only if mobile `390px` keeps app-like rhythm: same short copy, compact hierarchy, rounded card language, fixed bottom tab, centered scan CTA.
- Fail if any page exposes metadata, helper paragraphs, debug labels, analytics blocks, or extra sections not present in app render sites.
- Fail if tablet/desktop adds new content instead of redistributing existing mobile blocks.

## Per Screen

### Login
- Must show: title, subtitle, email, password, login CTA, visitor CTA, sign-up line.
- Must not show: marketing copy, benefits list, forgot-password section not in app.
- Wording locked: `login_*`.
- States required: idle, invalid login, member loading, visitor loading.

### Register
- Must show: 5 inputs, terms line, submit CTA, sign-in line.
- Must not show: address, avatar, company, long password helper block.
- Wording locked: `register_*`.
- States required: validation errors, generic submit failure, submit loading.

### Verify Email
- Must show: icon, title, message, email, resend CTA, back CTA.
- Must not show: account id, verification debug state.
- Wording locked: `verify_*`.
- States required: resend loading, success, failure, cooldown.

### Upgrade
- Must show: title, subtitle, 5 inputs, submit CTA, back CTA.
- Must not show: visitor benefits matrix or comparison block.
- Wording locked: `upgrade_*` plus reused register labels.
- States required: validation error and submit loading.

### Dashboard
- Must show: title, 3 stat cards, history cards, rate CTA/dialog.
- Must not show: graphs, side analytics, extra overview summary.
- Wording locked: `dashboard_*`.
- States required: visitor lock, loading, load error, empty, rating update.

### Stations
- Must show: title, sort select, station card with name/address/description/rating/voucher/availability/distance.
- Must not show: map panel, raw socket list, lat/lng text.
- Wording locked: `stations_*`.
- States required: loading, load error, empty.

### Station Detail
- Must show: back header, summary block, directions CTA, document blocks, offers section.
- Must not show: opening hours panel, internal ids, coverage/debug metadata.
- Wording locked: `station_detail_*`.
- States required: loading, load error, retry.

### Scan
- Must show: title, frame, short instruction, permission CTA, upload CTA, error overlay.
- Must not show: scanner hero copy, parsed QR payload preview, camera diagnostics.
- Wording locked: `products_scan_*`, `scan_*`.
- States required: guest error, permission required, loading, invalid QR overlay.

### Plans
- Must show: socket card, optional session card, balance row for member, plan cards, 3 confirm modals.
- Must not show: device metadata, telemetry, plan description block, analytics.
- Wording locked: `plans_*`, `products_*`, `session_*`.
- States required: no socket, active/pending/extending/stopping session, empty plans, insufficient balance.

### Topup VietQR
- Must show: back header, QR, 5 info rows, save CTA, save hint, paid confirm modal.
- Must not show: raw order status, order id, countdown panel, tutorial paragraphs beyond app pattern.
- Wording locked: `topup_vietqr_*`, `common_*`.
- States required: disabled, loading, create-order error, pending, paid.

### Account Root
- Must show: profile card, balance card, theme toggle, language toggle, 4 action rows, logout.
- Must not show: role, account id, extra profile metadata.
- Wording locked: `account_*`, `settings_*`, `theme_*`, `language_*`.
- States required: member, visitor masked balance, toast overlay.

### Profile
- Must show: avatar, editable name, readonly email, readonly phone, save CTA, password row, password sheet.
- Must not show: role, security history, profile completeness.
- Wording locked: `account_profile_*`, `change_password_*`.
- States required: save loading, password validation, password success.

### Buy Points
- Must show: package rows, chevron, confirm modal with 2 rows.
- Must not show: benefits grid, package feature bullets.
- Wording locked: `account_topup_*`.
- States required: disabled, package list, confirm modal.

### History
- Must show: 2 summary cards, rows with title/date/address?/amount.
- Must not show: filters, export buttons, table columns not in app.
- Wording locked: `account_history_*`.
- States required: empty, loaded.

### Feedback
- Must show: heading, intro, topic row, textarea, counter, submit CTA, topic sheet.
- Must not show: moderation explanation section, internal counters.
- Wording locked: `account_feedback_*`, `feedback_*`.
- States required: locked/rate-limited path, content error, loading, success toast.

### Support
- Must show: contact rows, address card, support notice, FAQ accordion.
- Must not show: docs center links, marketing help center sections.
- Wording locked: `account_support_*`.
- States required: loaded FAQ/contact content.
