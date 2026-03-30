# Motion / Loading / Error Audit

## Global
- Tab navigation: no generic page-enter animation.
- Press feedback: subtle `scale(0.992)` and opacity only.
- Reduced motion: CSS shortens or disables non-essential transitions.
- Loading default: compact spinner block or inline loading label, not dashboard skeleton theatre.
- Error default: short inline card or centered overlay, not long web banners.

## Per Screen Matrix

### Login / Register / Upgrade
- Route transition: simple stack-like replace/push, no decorative animation.
- Press feedback: button press only.
- Loading: spinner state inside primary CTA label.
- Error: inline text directly under fields/actions.
- Modal type: none.

### Verify Email
- Route transition: same as auth flow.
- Press feedback: button/link press only.
- Loading: resend CTA changes label, no extra spinner panel.
- Error: inline text block in card body.
- Modal type: none.

### Dashboard
- Route transition: none.
- Press feedback: card/button press only.
- Loading: compact spinner block under section header.
- Error: compact error card in history section.
- Modal type: centered rating dialog on mobile and desktop.

### Stations
- Route transition: none on tab root.
- Press feedback: station card press and voucher/distance CTA press only.
- Loading: compact spinner block under title.
- Error: compact error card.
- Modal type: none.

### Station Detail
- Route transition: browser back/push only.
- Press feedback: back/directions press only.
- Loading: compact spinner block in content area.
- Error: compact error card with retry CTA.
- Modal type: none.

### Scan
- Route transition: none.
- Press feedback: CTA press only.
- Loading: CTA label swap during fake scan.
- Error: centered dark overlay with short message and single retry CTA.
- Modal type: full-screen overlay, not dialog card anchored to desktop conventions.

### Plans
- Route transition: none.
- Press feedback: card/button press only.
- Loading: busy state stays inside confirm CTA or session mutation timing.
- Error: insufficient balance handled by confirm modal, scan-missing/login handled by route change.
- Modal type: centered confirm modal family.

### Topup VietQR
- Route transition: push from account/plans, replace on success return.
- Press feedback: save CTA and back button only.
- Loading: compact spinner block while order is created.
- Error: compact retry card.
- Modal type: centered paid confirm modal.

### Account Root / Subviews
- Route transition: subview via query param, back closes subview first.
- Press feedback: row press and toggle press only.
- Loading: save/submit button label change.
- Error: inline text within profile or feedback subview.
- Modal type:
  - Profile password: bottom sheet
  - Feedback topic picker: bottom sheet
  - Buy points: centered confirm modal
  - Toasts: centered overlay, not top-right web toast
