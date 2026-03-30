# Rebuild `CharPlug_web` theo parity với `ChargePlug_user`

## Summary
- Audit source đã khóa: guideline web trong `COLOR_SUMMARY.md`, `FRONTEND_STANDARDS.md`, `Palettecolor.md`; token/copy app trong `styles/tokens.shared.js`, `styles/typography.shared.js`, `constants/i18n.ts`; route/screen thật trong `app/(tabs)`, `app/(auth)`, `screen/`, `components/{account,plans,stations,dashboard}`.
- Kết luận chính: `CharPlug_web` hiện chưa có một Next app usable, nên sẽ rebuild có kiểm soát ngay trong thư mục này. `ChargePlug_user` là source of truth cho mobile layout, copy, field order, UI states và interaction feel; guideline web chỉ dùng để chuẩn hóa token và cấu trúc code.
- Ưu tiên bị khóa cứng cho toàn bộ implementation: `mobile giống app nhất` > `không hiển thị thừa field/text` > `tablet/desktop chỉ tối ưu layout, không đổi phong cách`.
- Defaults đã chốt: hỗ trợ `vi + en`, mặc định `vi`; subview web dùng `hybrid query-param`; không có screenshot pack trong repo nên code + assets hiện có là source of truth.

## Implementation Changes
- **Foundation**
  - Tạo một Next.js App Router + React + TypeScript + Tailwind hoàn chỉnh trong `CharPlug_web`.
  - Thêm `AGENTS.md` ở root web project, ghi rõ các luật bất biến: mobile parity tuyệt đối, cấm field/text thừa, desktop chỉ re-layout, motion bám app, mock data không lộ field thừa, wording bám app, cấm generic dashboard/template styling.
  - Tạo `lib/design-tokens` map trực tiếp từ app: nền/surface/accent/header/tab/title/scan/session semantic colors, typography scale `12/14/16/20/30`, radius `12/16/20/24/28`, spacing rhythm `px-5 pt-5 pb-24 gap-4`, cùng các override đặc thù của station/scan/toast.
  - Dùng một icon wrapper filled nhất quán để giữ feel gần app; favicon/app icon lấy từ `ChargePlug_user/assets/images/*`; không thêm illustration generic nếu app không có.

- **Shell, Nav, Motion**
  - Route chuẩn: `/` -> `/scan`, `/dashboard`, `/plans`, `/scan`, `/stations`, `/stations/[id]`, `/account`, `/login`, `/register`, `/verify-email`, `/upgrade`, `/topup/vietqr`.
  - Query contracts cố định:
    - `/plans?hardwareId&socketIndex&scanToken&focusPlans=1`
    - `/stations/[id]?distanceKm&focusSection=offers`
    - `/account?view=profile|buy-points|history|feedback|support&reset=1`
    - alias support cho `scrollTo=buy-points`
    - `/topup/vietqr?amount&planName&packageId&mode=standard|visitor-plan|visitor-extend`
  - Mobile shell tái hiện app: header gradient/logo, page title + divider gradient, fixed bottom tab với scan CTA nổi ở giữa, preserve tab state, restore scroll position từng tab, back behavior bám app.
  - Breakpoint rules:
    - `360/390/430`: single-column app-faithful.
    - `768`: vẫn giữ shell mobile nhưng cho phép 2 cột ở màn phù hợp.
    - `1024+`: chuyển bottom tab thành side rail/sidebar; chỉ mở rộng layout, không thêm field/copy.
  - Motion rules:
    - tab switch không animate
    - modal/popup fade `150-180ms`
    - sheet slide-up ngắn
    - press state dùng scale/opacity rất nhẹ
    - reduced motion tắt mọi motion không thiết yếu

- **Screen Parity Mapping**
  - Auth: `login`, `register`, `verify-email`, `upgrade` giữ nguyên field set, thứ tự field, inline error, visitor login, resend cooldown, password strength, không thêm helper copy.
  - Dashboard: title, filters, 3 stat cards, session history cards, rating popover, visitor lock/upgrade modal; states chỉ gồm loading, auth required, load failed, empty như app.
  - Stations list: `PageTitle` + sort dropdown, trạng thái location/request/error/no-results, frosted station cards, rating chip, voucher chip, availability, distance, directions CTA; không thêm map hay metadata.
  - Station detail: back header, summary card, description document blocks, offers section, loading/error/retry; desktop chỉ được làm summary sticky hoặc chia cột, không thêm field mới.
  - Scan: permission flow, upload-image fallback, QR parse errors, scan frame overlay, instruction row, retry overlay; không thêm scanner hero/text giải thích dài.
  - Plans: scanned socket card, socket banner states, active/pending/extending/stopping/completed session card, plan list, plan confirm modal, cash partner waiting modal, insufficient balance paths, visitor purchase/extend resume, retry start, stop confirmation.
  - Top-up VietQR: disabled-feature state, create-order error, QR loading/error, info rows đúng app, save QR CTA, pending/paid/expired/failed polling flow, visitor plan/extend return path.
  - Account: main profile card, balance card, theme/language segmented toggles, manage actions, logout, visitor gating; subviews `profile`, `buy-points`, `history`, `feedback`, `support` giữ nguyên field set và behavior của toast/modal/picker.

- **Field/Text Parity và Mock Architecture**
  - Tạo inventory copy từ `constants/i18n.ts` + actual render sites; mọi text trên web phải đi từ inventory này, không được lấy từ mock model hay tự bịa helper text.
  - Mỗi màn có `ScreenViewModel` riêng chỉ chứa field thật sự được render; raw mock entity có thể nhiều field hơn nhưng component không được nhận trực tiếp.
  - Mock stack chuẩn:
    - `lib/mock/data`
    - `lib/mock/scenarios`
    - `lib/mock/repositories`
    - `lib/mock/services`
  - Service layer phải giả lập đủ success/loading/error/empty/timeout/recovery; dev-only scenario switcher để ở route riêng hoặc sau `?mockPanel=1`, không lộ trong UI chính.
  - Shared UI system trong `components/ui`, `components/layout`, `components/shared`, `features/*` phải cover button/input/badge/card/tab/list/sheet/dialog/empty/error/loading/plan/session/history/account primitives theo style app.

## Public Interfaces / Types
- `AppTheme = 'light' | 'dark'`, `AppLocale = 'vi' | 'en'`
- Domain mock types: `MockUser`, `MockVisitor`, `MockStation`, `MockSocket`, `MockPlan`, `MockSession`, `MockTransaction`, `MockTopupOrder`, `MockFeedbackStatus`
- View-model types: `DashboardViewModel`, `StationCardViewModel`, `StationDetailViewModel`, `ScanViewModel`, `PlansViewModel`, `TopupViewModel`, `AccountViewModel`
- URL/state types: `PlansRouteState`, `AccountViewState`, `TopupRouteState`, `StationDetailRouteState`
- `MockScenarioKey` và `MockScenarioState` để điều khiển các flow mock mà không làm lộ field thừa ra UI

## Test Plan
- So parity mobile ở `360`, `390`, `430`: shell, tab bar, scan CTA, spacing, field order, button size, badge density, modals/sheets/toasts, copy length.
- So responsive ở `768`, `1024`, `1280`, `1440`: layout đẹp hơn nhưng không thêm field/text; desktop rail chỉ đổi navigation layout.
- Chạy đầy đủ states theo route: visitor login, upgrade, scan valid/invalid, station detail retry, plan buy, insufficient balance, visitor topup resume, active/pending/extending/stopping/completed session, feedback locked/rate-limited/success, support FAQ loading/empty.
- Verify browser/back persistence: `/account?view=*`, `/plans?...`, `/stations/[id]?focusSection=offers`, topup return path, tab revisit giữ state, scroll restore hợp lý, modal open/close không giật.
- Verify reduced motion, focus states, heading structure, keyboard nav cơ bản mà không thêm text thừa.

## Assumptions and Defaults
- `CharPlug_web` sẽ được dựng mới từ đầu trong chính thư mục hiện tại vì chưa có source Next usable.
- Không có screenshot/reference riêng trong repo; code app và asset hiện có là source of truth.
- `vi + en` được support từ v1; `vi` là mặc định và là chuẩn parity chính.
- Account subviews dùng hybrid query-param để browser back/state persistence tự nhiên nhưng vẫn giữ feel “subview trong tab”.
- Không nối API/auth/payment/MQTT/SignalR thật; toàn bộ side effect là mock và thay thế được về sau.

# Plan V2: Rebuild `CharPlug_web` với parity kiểm soát được

## Summary
- Bản này thay thế hoàn toàn plan trước và siết thêm 10 điểm mới: screen inventory theo file nguồn, acceptance criteria pass/fail theo từng màn, safe-area/mobile browser behavior, font parity, asset parity, desktop density lock, state persistence matrix, parity review artifacts, route contract rõ ràng, và luật source-of-truth từ render logic thật.
- Ưu tiên bất biến cho toàn bộ migration:
  1. mobile giống app nhất
  2. không thừa field/text
  3. tablet/desktop chỉ re-layout, không đổi phong cách, không tăng content density
- `CharPlug_web` hiện coi như repo đích gần trống; sẽ được dựng mới thành Next.js App Router + React + TypeScript + Tailwind trong chính thư mục đó.
- Shared source of truth:
  - Copy: [i18n.ts](c:/Users/khuon/ChargePlug/ChargePlug_user/constants/i18n.ts)
  - Color tokens: [tokens.shared.js](c:/Users/khuon/ChargePlug/ChargePlug_user/styles/tokens.shared.js)
  - Typography tokens: [typography.shared.js](c:/Users/khuon/ChargePlug/ChargePlug_user/styles/typography.shared.js)
  - Typography mapping: [Typography.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/ui/Typography.tsx)
  - App shell/navigation feel: [app/_layout.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/_layout.tsx), [tabs _layout.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/(tabs)/_layout.tsx), [auth _layout.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/(auth)/_layout.tsx)

## New In This Revision
- Thêm screen inventory có source-of-truth file path theo từng màn.
- Thêm acceptance criteria pass/fail cho từng màn quan trọng.
- Khóa chiến lược `dvh`/safe-area/mobile browser/keyboard/scroll owner.
- Chốt font parity: app không load custom font, web dùng system stack gần native nhất.
- Chốt asset parity: icon set filled/rounded theo `IconSymbol`, cấm generic illustration.
- Khóa mạnh desktop rule: chỉ re-layout, không thêm panel/metadata/overview/note.
- Bổ sung matrix state persistence: query params vs local state vs shared store vs reset rules.
- Bổ sung parity review artifacts phải tạo sau implement.
- Dọn route plan thành canonical contract duy nhất.
- Ghi rõ luật nền: UI phải dựng từ JSX/render sites trước, model/type chỉ là nguồn phụ.

## Source-of-Truth Rule
- Source of truth cho UI là render logic thật trong app, không phải entity/type/interface.
- Quy trình bắt buộc cho từng màn:
  1. đọc route file và screen/component render thực tế
  2. liệt kê field/text/CTA/state thật sự xuất hiện
  3. tạo web view-model chỉ chứa đúng tập field đó
  4. mới map mock entity vào view-model
- Cấm tuyệt đối:
  - render thêm field vì field đó có trong model
  - thêm helper copy/caption/note để “đầy giao diện”
  - suy diễn UI từ API schema trước khi đọc JSX
- `AGENTS.md` trong web project sẽ khóa lại đúng các luật này.

## Canonical Route Contract
| Route web | Type | Canonical behavior | Back/redirect rule |
|---|---|---|---|
| `/` | redirect | luôn chuyển sang `/scan` | `replace` |
| `/login` | non-tab | unauth only | authenticated thì `replace('/scan')` |
| `/register` | non-tab | unauth only | submit xong `replace('/verify-email?...')` hoặc `replace('/login')` |
| `/verify-email?email&accountId` | non-tab | unauth only | CTA back `replace('/login')` |
| `/upgrade` | non-tab | visitor only | nếu không auth: `replace('/login')`; nếu không còn visitor: `replace('/scan')` |
| `/dashboard` | tab | tab root | re-enter giữ scroll/filter |
| `/plans?hardwareId&socketIndex&scanToken&focusPlans=1` | tab | tab root | scan success dùng `replace`; `focusPlans=1` chỉ scroll tới plan section |
| `/scan` | tab | tab root | mỗi lần focus reset trạng thái scan |
| `/stations` | tab | tab root | giữ sort/scroll khi back từ detail |
| `/stations/[id]?distanceKm&focusSection=offers` | non-tab | detail route | browser back về list; fallback `/stations` |
| `/account?view=profile|buy-points|history|feedback|support&reset=1` | tab | tab root + subview | back ưu tiên đóng `view` trước khi rời tab |
| `/topup/vietqr?amount&planName&packageId&mode=standard|visitor-plan|visitor-extend` | non-tab | payment route | paid xong visitor flow `replace('/plans?focusPlans=1')`; standard flow `replace('/account?reset=1')` |
- Không đưa `/modal` của app vào web public v1 vì đó là route demo, không phải flow sản phẩm.
- `scrollTo=buy-points` chỉ là alias tạm để tương thích nội bộ; canonical là `view=buy-points`.
- Re-tap tab `account` khi đang ở `/account` sẽ xóa `view` và áp dụng `reset=1`, bám behavior app.

## Screen Inventory
Mặc định mọi màn lấy copy từ [i18n.ts](c:/Users/khuon/ChargePlug/ChargePlug_user/constants/i18n.ts) và token từ [tokens.shared.js](c:/Users/khuon/ChargePlug/ChargePlug_user/styles/tokens.shared.js) + [typography.shared.js](c:/Users/khuon/ChargePlug/ChargePlug_user/styles/typography.shared.js). Chỉ liệt kê thêm file override khi màn có style/behavior đặc thù.

| Màn | App route -> Web route | Source of truth render files | Field thực sự render | Field/model tuyệt đối không render | State / CTA / modal |
|---|---|---|---|---|---|
| Login | `/login` -> `/login` | [login.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/(auth)/login.tsx), [FormField.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/ui/FormField.tsx) | title, subtitle, email, password, inline error, login CTA, visitor CTA, sign-up link | token, role, session info, account metadata | idle, field error, login loading, visitor loading; CTA login/visitor/sign up; không modal |
| Register | `/register` -> `/register` | [register.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/(auth)/register.tsx) | name, email, phone, password, confirm, terms, field errors, password strength, server error, submit CTA, sign-in link | accountId, verification internals, debug validation info | idle, field error, submit loading; CTA register/sign in |
| Verify email | `/verify-email` -> `/verify-email` | [verify-email.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/(auth)/verify-email.tsx) | icon, title, message, email, resend CTA with cooldown, feedback/error, back-to-login CTA | raw cooldown config, accountId display, auth/debug metadata | resend busy, cooldown, success, error |
| Upgrade visitor | `/upgrade` -> `/upgrade` | [upgrade.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/upgrade.tsx) | title, subtitle, fullname, phone, email, password, confirm, inline errors, submit CTA, go-back link | visitor token, appInstanceKey, role/access token/server internals | idle, field error, submit loading, server error |
| Dashboard | `/dashboard` -> `/dashboard` | [dashboard.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/(tabs)/dashboard.tsx), [StatCard.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/dashboard/StatCard.tsx), [SessionHistoryCard.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/dashboard/SessionHistoryCard.tsx) | page title, filters, 3 stat cards, history cards: station name, formatted date, address, energy, time, points, rate CTA | history.page/pageSize/totalItems, selected month/year raw values, sessionId/stationId display | loading, auth required, load failed, empty, visitor lock, rating popover, upgrade modal |
| Stations list | `/stations` -> `/stations` | [stations.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/(tabs)/stations.tsx), [station-card.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/stations/station-card.tsx), [sort-dropdown.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/stations/sort-dropdown.tsx) | title, sort control, station name, address, optional description, rating, vouchers, availability, distance, directions CTA | lat/lng, socket array, voucher score/id, station internal id in card | location requesting, loading, location denied, load error, route error, no-results |
| Station detail | `/stations/[id]` -> `/stations/[id]` | [StationDetailScreen.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/screen/StationDetailScreen.tsx) | back, title, name, address, rating, available/total sockets combined label, distance CTA, description/document blocks, offers label/description, retry CTA | ward/district/city, coverPhotoUrl, opening/closing, is24h, lat/lng raw text, table keys/internal IDs not rendered by block | loading, load error, retry, offers focus scroll |
| Scan | `/scan` -> `/scan` | [scan.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/(tabs)/scan.tsx) | title, scanner frame, instruction, permission message, permission CTA, upload-image CTA, error overlay, retry CTA | parsed QR payload preview, hardwareId/socketIndex debug values, camera diagnostics | permission loading/denied, active scan, upload loading, invalid/no-multi QR errors |
| Plans / session | `/plans` -> `/plans` | [plans.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/(tabs)/plans.tsx), [PlanCard.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/plans/PlanCard.tsx), [PlanConfirmModal.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/plans/PlanConfirmModal.tsx), [CashPartnerConfirmModal.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/plans/CashPartnerConfirmModal.tsx) | scanned socket name/address/status, socket banner, active session badge/status, remaining duration, energy, optional power, buy more, stop CTA, plan name/popular/price/duration/energy/buy CTA, confirm rows | plan.description, socket maxWattage/lastSeen/statusConfidence/stationId, session ids/command tracking, device metadata | recovery loading, available/charging/error/offline banners, pending start, created-only retry, extending, stopping, completed flash, insufficient balance, visitor lock, confirm modal, cash waiting modal, stop confirm alert |
| Topup VietQR | `/topup/vietqr` -> `/topup/vietqr` | [vietqr.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/topup/vietqr.tsx), [TopUpVietQR.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/screen/TopUpVietQR.tsx) | back, title, QR, account name, account number, bank name, amount, transfer content, save QR CTA, save hint, order error block | orderId/topupId/paymentTopupId, expiresAt, status raw string, payment transaction id | feature disabled, create order error, QR loading/error, pending/paid/expired/failed flow, save loading |
| Account root | `/account` -> `/account` | [account.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/app/(tabs)/account.tsx), [upgrade-account-modal.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/shared/upgrade-account-modal.tsx) | avatar/name/email card, balance card, theme toggle, language toggle, action rows, logout CTA | accountId, role, token, phone on root, transaction metadata | visitor lock, feedback lock alert, topup disabled path, upgrade modal, success toast |
| Account profile | subview -> `/account?view=profile` | [profile-section.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/account/profile-section.tsx) | back, avatar, editable name, readonly email, readonly phone, save CTA, change-password entry, password sheet fields | accountId, role, token, audit timestamps | unsaved changes, save success alert, password sheet, password success toast, field errors |
| Buy points | subview -> `/account?view=buy-points` | [buy-points-section.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/account/buy-points-section.tsx), [confirm-purchase-modal.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/account/confirm-purchase-modal.tsx) | back, package label, price, chevron, confirm modal rows | package id/internal product metadata | package list, confirm loading, confirm/cancel modal |
| Transaction history | subview -> `/account?view=history` | [transaction-history-section.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/account/transaction-history-section.tsx) | back, total transactions, total points, row title/date/address optional/amount | transaction id, createdAt raw ISO, accountId | empty state |
| Feedback | subview -> `/account?view=feedback` | [feedback-section.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/account/feedback-section.tsx) | back, title, heading, intro, topic picker, content textarea, char hint, notices, submit CTA | accountId, badWordStrikeCount, remainingAttempts, lockThreshold counters, moderation/debug payload | locked, rate-limited countdown, submit loading, success return toast, bad-language error, topic picker modal |
| Support | subview -> `/account?view=support` | [customer-support-section.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/account/customer-support-section.tsx) | back, contact cards phone/zalo/email/address, support hours notice, FAQ section, FAQ q/a accordion | faq id/languageCode/displayOrder, backend contact ids | contact error, FAQ loading, FAQ empty |

## Acceptance Criteria Per Screen
| Screen | Mobile 390px pass nếu | Bắt buộc hiển thị | Tuyệt đối không hiển thị | Bắt buộc có state/CTA/modal | Tablet/desktop được phép | Tablet/desktop không được phép |
|---|---|---|---|---|---|---|
| Login | card width, spacing, title/subtitle, 2 CTA và sign-up line nhìn như app | email, password, login, visitor, sign-up | token/session/help paragraphs thêm | field errors, 2 loading states | căn card giữa màn hình rộng | thêm benefits, marketing copy |
| Register | field order và mật độ giống app | 6 field, terms, strength bar, register, sign-in | extra profile fields, long password tips | field/server errors, loading | card rộng hơn | thêm wizard/sidebar info |
| Verify email | card compact, icon + email + resend giống app | title, message, email, resend, back | accountId/raw cooldown config | resend busy/cooldown/error | card centered | thêm “why verify” paragraphs |
| Upgrade | form density và footer link như app | fullname, phone, email, password, confirm | visitor metadata | validation + loading | card centered | thêm extra benefits/comparison |
| Dashboard | title, filters, 3 stat cards, history list và visitor lock feel như app | 3 stats, history cards, rate CTA | pagination/meta counts/session ids | loading/error/empty/rating popover/upgrade modal | grid lại stats hoặc sticky history header | thêm analytics panel/overview note |
| Stations list | frosted cards, sort control, spacing và text density như app | name, address, desc optional, rating, vouchers, availability, distance | map preview, socket counts, lat/lng text | location/load/error/no-results | 2-column card grid | thêm sidebar map/metadata |
| Station detail | summary card và document blocks giống app | name/address/rating/availability/distance/document/offers | opening hours, ward/city, cover image nếu app không render | loading/error/retry | 2-column summary+content | thêm overview sidebar mới |
| Scan | scan frame, CTA, overlay error và copy rất ngắn như app | title, instruction, permission CTA, upload CTA, retry | parsed payload/debug data | permission/loading/error overlay | frame có thể centered rộng hơn | thêm scanner illustration/text dài |
| Plans | socket card, session card, plan cards và confirm modal giống app | socket status, session rows, plan name/price/duration/energy | plan description, device metadata, tracking ids | pending/retry/extend/stop/confirm/cash waiting | cột phụ chỉ được tái bố trí chính các block đang có | thêm summary analytics/status explanation panel |
| Topup | QR 1:1, info rows và save CTA giống app | QR, 5 info rows, save CTA/hint | order ids/status raw/expiresAt | disabled/error/loading/pending/paid/failed | card rộng hơn, QR + info split 2 cột | thêm payment instruction paragraphs ngoài app |
| Account root | profile/balance/settings/actions/logout giống app | avatar/name/email, balance, theme/lang, action rows, logout | account id/role/phone/debug info | upgrade modal, feedback lock alert, success toast | 2-column layout cho action blocks | thêm profile summary/sidebar notes |
| Profile | back, avatar, readonly blocks và password sheet giống app | name/email/phone/save/change password | role/id/security metadata | save success, password sheet/errors/toast | panel rộng hơn | thêm profile completeness/info text |
| Buy points | package rows đơn giản như app | package label, price, chevron | package ids/descriptions | confirm modal | grid 2 cột nếu vẫn giữ đúng row content | thêm benefit bullets |
| History | row density và summary cards giống app | total tx, total points, row title/date/address/amount | tx id/raw timestamps | empty state | hybrid cards/table chỉ nếu không thêm cột mới | thêm filters/analytics blocks |
| Feedback | title/intro/topic/content/submit mật độ như app | topic picker, textarea, hint, submit | strike counts/threshold numbers/debug | lock, rate limit, bad-language, success return | panel rộng hơn | thêm moderation explanation copy |
| Support | contact cards + FAQ accordion đúng app | phone/zalo/email/address/hours/faq | faq ids/display order/internal notes | contact error, faq loading/empty | 2-column contact + faq | thêm docs/help center marketing content |

## Safe-Area + Mobile Browser Strategy
- Web mobile shell dùng `height: var(--cp-vh, 100dvh)` với fallback `100vh`; trên iOS Safari/Chrome Android sẽ cập nhật `--cp-vh` từ `visualViewport.height` để tránh nhảy do browser bar.
- Safe area CSS vars:
  - `--cp-safe-top: env(safe-area-inset-top, 0px)`
  - `--cp-safe-bottom: env(safe-area-inset-bottom, 0px)`
- Header padding top = `max(16px, --cp-safe-top)`.
- Bottom tab padding bottom = `max(12px, --cp-safe-bottom)`; scan CTA neo vào tab bar container, không neo trực tiếp vào viewport bottom.
- Mỗi route có đúng 1 scroll owner trên mobile; shell không scroll. Scroll owner là `main` của màn, bám pattern app `px-5 pt-5 pb-[tabbar-safe] gap-4`.
- Sticky footer/CTA chỉ dùng ở màn cần thiết và luôn tính `safe-bottom`; không đặt fixed footer độc lập nếu route đã có bottom tab.
- Modal/sheet:
  - max-height = `calc(var(--cp-vh, 100dvh) - var(--cp-safe-top) - 16px)`
  - bottom padding = `max(16px, --cp-safe-bottom)`
  - mobile default là bottom sheet; desktop mới cho phép center modal nếu app không bị phá feel.
- Keyboard:
  - route form (`login/register/upgrade/profile password/feedback`) khi keyboard mở sẽ tăng `scroll-padding-bottom` theo `visualViewport` delta
  - nếu bottom tab đang hiện trên route có input focus, tab bar được translate ra ngoài viewport để tránh che field, rồi trả lại khi blur
  - không để body scroll; chỉ route scroll owner nhận keyboard adjustments

## Font Parity
- App không load custom font; thực tế đang dùng font hệ thống native. Web sẽ bám hướng này thay vì tự chọn font brand khác.
- Font family web:
  - `--font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Roboto, "Segoe UI", system-ui, sans-serif`
  - `--font-display` dùng cùng stack để giữ parity với app
- Mapping cố định:
  - body/button default: `16/24`
  - caption: `14/20`
  - xs/helper: `12/16`
  - heading: `20/30`
  - logo: `30/40`, `font-weight: 700`, `letter-spacing: 0.2px`
  - overline: `16/24`, uppercase, tracking rộng theo app
- Không scale gần đúng bằng mắt; Tailwind theme sẽ map đúng line-height tokens trên.
- Nếu browser không có SF/Roboto, fallback là system UI gần native nhất; không nạp Google Font mới.

## Asset Parity
- Source of truth cho icon semantics là [icon-symbol.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/ui/icon-symbol.tsx) và [icon-symbol.ios.tsx](c:/Users/khuon/ChargePlug/ChargePlug_user/components/ui/icon-symbol.ios.tsx).
- Web icon wrapper sẽ map cùng icon ids và giữ mặc định `filled/rounded`, không dùng outline generic trừ khi source app dùng outline.
- Logo/app icons lấy từ:
  - [icon.png](c:/Users/khuon/ChargePlug/ChargePlug_user/assets/images/icon.png)
  - [favicon.png](c:/Users/khuon/ChargePlug/ChargePlug_user/assets/images/favicon.png)
  - [android-icon-foreground.png](c:/Users/khuon/ChargePlug/ChargePlug_user/assets/images/android-icon-foreground.png)
- QR assets luôn giữ aspect ratio `1:1`; không crop.
- App hiện không có illustration/banner/plan art riêng cho screen content; web v1 cũng không được tự thêm illustration generic để “đẹp hơn”.
- Nếu thiếu asset cho một icon hiếm, fallback là custom SVG trong cùng visual weight, không đổi sang icon set outline khác hệ.

## Desktop / Tablet Density Lock
- Rule mặc định: chỉ đổi layout, không đổi nội dung.
- Được phép:
  - chuyển từ 1 cột sang 2 cột
  - sticky một block đã tồn tại ở mobile
  - side rail chứa đúng navigation hoặc block đã có ở mobile
- Không được phép tự thêm:
  - metadata sidebar
  - overview panel
  - analytics block
  - status explanation panel
  - note/explanation/helper paragraphs dài hơn app
  - badge phụ hoặc caption phụ
- Nếu có nhu cầu thêm một khối ngoài app, phải chứng minh khối đó là re-placement của nội dung đã có sẵn ở mobile, không phải content mới.

## State Persistence Strategy
- Query params:
  - `account view/reset`
  - `plans hardwareId/socketIndex/scanToken/focusPlans`
  - `stations detail distanceKm/focusSection`
  - `verify-email email/accountId`
  - `topup amount/planName/packageId/mode`
- Shared store/context:
  - app settings: theme/language
  - auth mock session
  - wallet mock balance/plans/transactions
  - scanned socket
  - active charging session
  - visitor pending purchase/extend
  - mock scenario selector
  - per-route scroll positions for `dashboard`, `stations`, `plans`, `account`
- Local component state:
  - form inputs
  - open/close dropdown, popover, confirm modal, topic picker
  - loading/error notices
  - selected plan/package before confirm
- Giữ khi back:
  - tab đang chọn
  - scan context đã persisted sang plans
  - account subview `view`
  - filter/sort/scroll của `dashboard`, `stations`, `plans`, `account`
- Reset khi re-enter:
  - `scan` reset toàn bộ state scan mỗi lần focus
  - `account` reset subview khi re-tap tab hoặc `reset=1`
  - transient modal open state luôn reset khi route unmount
  - auth form errors reset khi route đổi
- Modal/sheet deep-link:
  - không deep-link modal/sheet
  - chỉ screen/subview là shareable qua URL
  - modal state chỉ local, để tránh browser back làm lệch feel app

## Implementation Structure
- `app/`
  - App Router routes đúng contract trên
- `components/ui`
  - primitives parity-first
- `components/layout`
  - shell, mobile tab bar, desktop rail, safe-area wrappers
- `components/shared`
  - page title, icon section title, feature lock, empty/error/loading, sheets/dialogs/toasts
- `features/auth|dashboard|stations|scan|plans|topup|account`
  - mỗi feature có `view-model.ts`, `components.tsx`, `state.ts`
- `lib/design-tokens`
  - app token mirror + CSS vars + font stack + safe-area helpers
- `lib/mock`
  - data, scenarios, repositories, services
- `lib/types`
  - raw mock entities + route/view-model types
- `providers`
  - mock app state, app settings, persistence provider
- Root web project thêm `AGENTS.md` và `docs/parity/`

## Parity Review Artifacts
- Sau implement phải tạo:
  - `docs/parity/screen-inventory.md`
  - `docs/parity/acceptance-checklist.md`
  - `docs/parity/mobile-parity-notes.md`
  - `docs/parity/tablet-desktop-deltas.md`
  - `docs/parity/assumptions.md`
  - `docs/parity/screenshots/390/*`
  - `docs/parity/screenshots/768/*`
  - `docs/parity/screenshots/1280/*`
- Mỗi màn trong parity notes phải ghi:
  - điểm giữ sát app trên mobile
  - điểm cố ý re-layout ở tablet/desktop
  - assumption dùng vì app chưa đủ rõ
  - vấn đề parity còn lại nếu có

## Test Plan
- Visual pass ở `360`, `390`, `430`, `768`, `1024`, `1280`, `1440`.
- So sánh field/text parity theo screen inventory; bất kỳ field ngoài inventory là fail.
- So sánh behavior:
  - auth redirect
  - scan success dùng `replace`
  - account subview back
  - account re-tap reset
  - plans focus scroll
  - topup paid redirect
  - visitor pending purchase/extend resume
- So sánh mobile browser behavior:
  - browser bar co giãn không làm tab bar/scan CTA lệch
  - safe area đúng trên notch devices
  - keyboard không che form/textarea/sheet footer
- Verify reduced motion, focus states, keyboard nav cơ bản mà không thêm text thừa.

## Assumptions
- Không có screenshot pack trong repo; source of truth là code render thật + asset hiện có.
- App hiện dùng system font native, không có custom font product font cần import sang web.
- `vi + en` được support từ v1; `vi` là mặc định và là chuẩn parity chính.
- `/modal` không đưa vào web v1 vì không phải flow sản phẩm chính.
- Nếu một field chỉ tồn tại trong model mà không có evidence render trong JSX, mặc định là hidden.


# Plan V3: Parity-First Rebuild For `CharPlug_web`

## Summary
- `ChargePlug_user` remains the only UI source of truth. Web implementation must reproduce the same product feel on mobile, not just the same flows.
- Priority order is now locked for every implementation decision:
  1. mobile giống app nhất
  2. không thừa field/text
  3. component parity giữa các màn
  4. motion/error/loading parity
  5. tablet/desktop chỉ re-layout, không đổi phong cách
- `CharPlug_web` will be rebuilt as a parity-first Next.js App Router app with shared components created before screen rollout, not screen-by-screen ad hoc clones.

## What Was Added In This Revision
- `Component parity first` is added in **Parity-First Component System**.
- `No hidden redesign` is added in **Design Governance**.
- `Copy source precedence` is added in **Source-of-Truth and Copy**.
- `Motion audit per screen` is added in **Screen Inventory and Motion Matrix**.
- `Mock visibility lock` is added in **Mock Architecture and Dev Isolation**.
- `Error/loading parity` is added in **State, Loading, and Error Parity**.
- `Final implementation priority` is elevated into **Summary** and **Design Governance**.

## Source-of-Truth and Copy
- UI source-of-truth order is locked:
  1. JSX/render sites actually used by the screen
  2. `t()` keys that those screens actually call from [i18n.ts](/c:/Users/khuon/ChargePlug/ChargePlug_user/constants/i18n.ts)
  3. shared copy only when the screen clearly reuses it
- Type/interface/model is secondary only. It may inform mock shapes, but it must never decide what gets rendered.
- Web view-models must be built from rendered fields first, then mapped from mock entities.
- No wording rewrites, no “better copy”, no helper text, no captions, no notes, no metadata unless the app renders them.
- Inventory rows from V2 stay mandatory for all major screens and gain two extra columns:
  - `Copy precedence source`
  - `Evidence that hidden fields stay hidden`

## Parity-First Component System
- Build these shared parity-first components before assembling final screens:
  - `PageTitle` from [page-title.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/components/shared/page-title.tsx)
  - `SectionTitle` from [icon-section-title.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/components/shared/icon-section-title.tsx)
  - `FormField` and input rows from [FormField.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/components/ui/FormField.tsx)
  - `StationCard` from [station-card.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/components/stations/station-card.tsx)
  - `PlanCard` from [PlanCard.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/components/plans/PlanCard.tsx)
  - `SessionCard` extracted from [plans.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/app/(tabs)/plans.tsx) + [SessionDetailRow.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/components/plans/SessionDetailRow.tsx)
  - `AccountActionRow` extracted from [account.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/app/(tabs)/account.tsx)
  - `ConfirmModal` family from [PlanConfirmModal.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/components/plans/PlanConfirmModal.tsx), [confirm-purchase-modal.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/components/account/confirm-purchase-modal.tsx), [CashPartnerConfirmModal.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/components/plans/CashPartnerConfirmModal.tsx)
  - `ToastOverlay` family from [profile-section.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/components/account/profile-section.tsx) and [account.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/app/(tabs)/account.tsx)
  - `LoadingBlock`, `EmptyBlock`, `ErrorBlock` from real screen patterns in [dashboard.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/app/(tabs)/dashboard.tsx), [stations.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/app/(tabs)/stations.tsx), [StationDetailScreen.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/screen/StationDetailScreen.tsx), [TopUpVietQR.tsx](/c:/Users/khuon/ChargePlug/ChargePlug_user/screen/TopUpVietQR.tsx)
- Rule: no production screen is allowed to ship with a one-off version of these repeated patterns unless the app itself has a clearly different variant.

## Design Governance
- No hidden redesign is allowed under the names `cleanup`, `optimization`, `better UX`, `web polish`, or `refactor`.
- Forbidden changes:
  - hierarchy changes
  - spacing rhythm changes
  - information density changes
  - copy tone changes
  - interaction model changes
  - CTA emphasis changes
  - card composition changes
- Allowed changes:
  - re-layout for tablet/desktop
  - responsive fitting
  - technical adaptations for browser behavior
- Desktop/tablet rule is now stricter:
  - only redistribute existing mobile content
  - never add metadata sidebars, overview panels, analytics blocks, explanation panels, or longer notes
  - if unsure, do not add

## Screen Inventory and Motion Matrix
- The V2 inventory remains required for:
  - login
  - register
  - verify-email
  - upgrade
  - dashboard
  - stations list
  - station detail
  - scan
  - plans/session
  - topup VietQR
  - account root
  - account profile
  - buy points
  - transaction history
  - feedback
  - support
- Each inventory row must now include these extra columns:
  - `Shared component dependency`
  - `Route transition behavior`
  - `Press feedback behavior`
  - `Loading presentation`
  - `Error presentation`
  - `Modal type on mobile`
  - `Desktop modal adaptation rule`
  - `Reduced-motion fallback`
- Motion audit defaults by screen type:
  - Tab screens: no navigation animation, subtle press opacity/scale only, no generic page-enter animation
  - Auth screens: stack fade around `180ms`, inline spinner in CTA, no extra motion
  - Confirm dialogs: centered fade, no bounce
  - Bottom sheets: slide-up only where app behaves like a sheet, especially profile password flow
  - Scan: no decorative motion, only scanner frame/static overlays and error overlay
  - Topup: QR image transition can stay very subtle, loading is spinner-first
  - Feedback topic picker and dashboard rating popover: anchored popover feel, minimal fade only
- Loading parity rule:
  - default to spinner or compact inline text block because that is what the app predominantly uses
  - no global skeleton system unless a screen has direct app evidence for it
- Error parity rule:
  - keep the same placement class as app: inline block, inline text, or centered state
  - do not convert short inline errors into large web banners
  - do not add explanatory paragraphs

## State, Loading, and Error Parity
- Persistence matrix from V2 stays, plus these locks:
  - component-local state must not leak into URL unless app behavior benefits from browser back parity
  - modal open state is never canonical URL state
  - scan state always resets on refocus
  - account subview state persists via query param but internal modal/picker state does not
- Scroll, keyboard, safe-area, and `dvh` rules from V2 remain mandatory and unchanged.
- Each major screen acceptance checklist must explicitly state:
  - which loading form is allowed
  - which error form is allowed
  - what is forbidden to add in those states

## Mock Architecture and Dev Isolation
- All mock/scenario/debug tooling is isolated from parity review UI.
- Dev tools may exist only in a dev-only route such as `/_dev/mock`, excluded from the main shell and disabled in production.
- Forbidden in parity review routes:
  - mock badges
  - debug labels
  - scenario chips
  - floating mock panels
  - shell-level dev switchers
- Main screen view-models must never expose raw mock-only fields to render components.

## Routes and Implementation Order
- Canonical route contract from V2 remains unchanged.
- Implementation order is now fixed:
  1. tokens, font stack, safe-area shell, route contract
  2. parity-first shared components
  3. auth and shell tabs
  4. stations, scan, plans/session, topup
  5. account root and subviews
  6. parity review artifacts and acceptance verification
- No screen may skip ahead of the shared component layer if it depends on a repeated UI pattern already identified above.

## Review and Acceptance
- Existing parity artifacts from V2 remain required and gain two more docs:
  - `docs/parity/component-parity-checklist.md`
  - `docs/parity/motion-loading-error-audit.md`
- Review must verify:
  - mobile feels like the same product as the app
  - repeated components stay visually consistent across screens
  - no hidden redesign occurred
  - no field/text outside the inventory appears
  - loading/error/motion follow audited screen-specific rules

## Assumptions
- No screenshot pack exists in repo, so audited render code and existing assets remain source-of-truth.
- App uses system-native font behavior, so web parity should use a native-feeling system stack rather than introducing a new branded web font.
- If a repeated pattern in the app turns out to have a true variant, the web may add a variant prop only after the shared parity-first base component exists.

text được viết tại i18n
mock data được để chung 1 file(text của mock không viết vào i18n)