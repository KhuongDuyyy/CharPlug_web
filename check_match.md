Ghi chú phạm vi

Báo cáo này là re-audit sau P0 parity-fix pass mới nhất, không còn là audit pre-implement ban đầu.
Mục tiêu của file này là cập nhật độ hoàn thiện thực tế của `CharPlug_web` so với `ChargePlug_user` theo code hiện tại.

Nguồn đánh giá:
- `plans.md`
- render/state logic hiện tại của `CharPlug_web`
- source of truth từ `ChargePlug_user`
- shared components, mock/provider state, route contracts, và parity artifacts trong repo

Giới hạn:
- Không có pixel-diff hay browser-inspection trực tiếp trong môi trường này
- Visual/runtime được chấm chủ yếu theo render structure, state branch, CTA order, và interaction composition
- Đánh giá ưu tiên mobile parity trước

Thời điểm audit: 2026-03-30

Phần A - Tóm tắt điều hành

Trạng thái so với `plans.md`

- Phase 1 / P0: đã hoàn thành ở cả 5 cụm theo đúng thứ tự yêu cầu
- Phase 2 / P1: mới hoàn thành một phần
- Phase 3 / P2: phần lớn vẫn pending

Điểm parity hiện tại

- Parity tổng thể: 7.5/10
- Text/copy: 7.5/10
- Field/content: 7.4/10
- Visual style: 7.6/10
- Layout: 7.5/10
- Motion/interaction: 7.0/10
- Responsive: 7.3/10

Đánh giá ngắn

Web đã vượt qua trạng thái "foundation đúng hướng nhưng vẫn parity gap đỏ" của audit cũ.
P0 đã được sửa thật ở tầng component và state, không chỉ là chạm vào bề mặt.
Tuy vậy, hiện tại vẫn chưa ở mức polish-only: phần còn lại tập trung vào realtime fidelity, một số state nuance, và P1/P2 visual-interaction detail.

10 mismatch còn lớn nhất

1. Plans đã có branch density đúng hướng, nhưng vẫn chưa đạt full realtime/session/socket parity của app.
2. Topup VietQR đã có state matrix inline, nhưng vẫn mock-backed, chưa đạt full polling/session-expired nuance như app.
3. Dashboard đã có filter stack và rating popover, nhưng refresh/filter composition vẫn gọn hơn app.
4. Scan đã có camera-first shell, nhưng settings-path và camera/upload pipeline vẫn chưa sâu như app.
5. Verify Email vẫn cooldown 30s thay vì 60s và chưa accountId-aware như app.
6. Auth/Profile đã có field-level validation cơ bản, nhưng bottom-sheet/toast/native nuance vẫn chưa sát app.
7. Stations list đã có location/request/denied/route-error branches, nhưng vẫn chưa có route-service fidelity và refresh rhythm đầy đủ.
8. Feedback đã có locked/rate-limit/bad-language branches, nhưng feedback status vẫn là provider/mock state, chưa fetch-status parity.
9. Loading/error/empty vẫn chưa de-genericize hết ở một số màn P1/P2.
10. Buy Points, History, Account Root, và icon sweep cuối vẫn còn P2 visual nuance.

5 ưu tiên tiếp theo nên sửa

1. Plans realtime / reconnect / recovery nuance
2. Topup VietQR realtime + polling + session fidelity
3. Dashboard filter semantics + refresh logic parity
4. Scan settings path + deeper permission/camera flow parity
5. Cross-screen de-genericize loading/error/empty và modal/sheet nuance

Phần B - Báo cáo theo từng màn

Login
Source: app /login -> web /login
Parity score: 7.8/10
Match tốt ở: auth shell đã có global brand header, placeholder đã đúng, remembered email hydrate đã có, login loading và visitor loading đã tách riêng.
Improved in this pass: mobile auth shell không còn centered web card feel.
Remaining gaps: inline validation và state copy vẫn mỏng hơn app; heading emphasis vẫn hơi web-hơn-app.
Severity: Medium
Fix priority: P2

Register
Source: app /register -> web /register
Parity score: 7.3/10
Match tốt ở: field order đúng hướng, placeholder đúng app, touched errors, live disable logic, password strength/hint, terms row, email/phone exists mapping đã có.
Improved in this pass: gap field-level parity đã được đóng phần lớn.
Remaining gaps: verify-success flow vẫn mock-backed; một số server nuance và auth shell polish vẫn chưa bằng app.
Severity: Medium
Fix priority: P2

Verify Email
Source: app /verify-email -> web /verify-email
Parity score: 6.5/10
Match tốt ở: centered card, resend CTA, back-to-login CTA, auth shell context tốt hơn nhờ brand header chung.
Improved in this pass: visual shell đúng hướng hơn audit cũ.
Remaining gaps: cooldown vẫn 30s thay vì 60s; chưa accountId-aware; feedback/error composition vẫn đơn giản hơn app.
Severity: Medium
Fix priority: P1

Upgrade
Source: app /upgrade -> web /upgrade
Parity score: 7.3/10
Match tốt ở: auth shell đúng hướng, dùng upgrade keys, email optional đúng bản chất app, field-level validation và phone/email exists mapping đã có.
Improved in this pass: không còn mượn register wording hay centered card generic.
Remaining gaps: visual nuance và server-specific edge cases vẫn gọn hơn app; sheet/toast feel chưa sát app.
Severity: Medium
Fix priority: P2

Dashboard
Source: app /dashboard -> web /dashboard
Parity score: 7.0/10
Match tốt ở: filter stack đã trở lại, visitor masking/overlay đã có, rating đã là anchored popover, stat/history composition gần app hơn trước.
Improved in this pass: mobile hierarchy không còn sparse/web-like như audit cũ.
Remaining gaps: filter semantics và refresh logic vẫn là bản rút gọn; section-level loading/error/empty vẫn chưa dày bằng app.
Severity: High
Fix priority: P1

Stations List
Source: app /stations -> web /stations
Parity score: 7.2/10
Match tốt ở: requesting-location, location-denied, route-error notice, station card base, directions CTA mở maps, description clamp, sort dropdown parity-first đã có.
Improved in this pass: top control area và state rhythm gần app hơn rõ.
Remaining gaps: route error vẫn scenario-driven; refresh behavior và route-service fidelity vẫn chưa bằng app.
Severity: Medium
Fix priority: P2

Station Detail
Source: app /stations/[id] -> web /stations/[id]
Parity score: 7.4/10
Match tốt ở: header wording đã quay về generic title, document renderer đã hỗ trợ heading/paragraph/list/tag/table/callout/divider/quote, content flow không còn article-card generic.
Improved in this pass: đây là một trong những màn tiến bộ rõ nhất của toàn web.
Remaining gaps: block styling vẫn còn approximation; loading/error/retry và offers fallback vẫn chưa app-exact.
Severity: Medium
Fix priority: P2

Scan
Source: app /scan -> web /scan
Parity score: 6.8/10
Match tốt ở: camera-first feel, immersive shell, corner frame overlay, permission CTA, upload-image fallback, parse/camera error overlay đã có.
Improved in this pass: không còn dashed mock demo box.
Remaining gaps: chưa có camera thật; settings path và deeper permission/camera pipeline vẫn đơn giản hơn app.
Severity: High
Fix priority: P1

Plans
Source: app /plans -> web /plans
Parity score: 7.3/10
Match tốt ở: recovery loading, created-only retry, socket banners available/charging/faulted/offline/checking/completed, pending/extending/stopping detail copy, visitor branch, cash-partner waiting modal, action tone theo socket state đã có.
Improved in this pass: màn gap lớn nhất của web đã được kéo lên rõ rệt, không còn là state model rút gọn như audit cũ.
Remaining gaps: vẫn là mock-backed state machine; realtime reconnect, timeout, fail, và một số resume nuance vẫn chưa dày như app.
Severity: High
Fix priority: P1

Topup VietQR
Source: app /topup/vietqr -> web /topup/vietqr
Parity score: 7.1/10
Match tốt ở: create-order, waiting/checking, paid, expired, failed, session-expired, create-order-error branches đã có; success flow đã quay về inline status evolution.
Improved in this pass: đã bỏ auto-paid confirm modal sai bản chất; flow giờ đúng hướng app hơn rõ.
Remaining gaps: polling/realtime vẫn mock-backed; timeout/session nuance và order lifecycle vẫn chưa đạt mức app-faithful.
Severity: High
Fix priority: P1

Account Root
Source: app /account -> web /account
Parity score: 6.9/10
Match tốt ở: profile card, balance card, theme/language segmented toggles, action rows, logout vẫn là cụm gần app nhất.
Improved in this pass: icon feel và shell feel tốt hơn nhờ system parity-first mới.
Remaining gaps: visitor lock, upgrade modal, feedback-success nuance, và toast semantics vẫn còn giản lược.
Severity: Medium
Fix priority: P2

Account Profile
Source: app profile -> web /account?view=profile
Parity score: 7.1/10
Match tốt ở: avatar picker, editable name, readonly email/phone, save disable logic, change-password flow, strength hint, invalid-current/weak/mismatch mapping đã có.
Improved in this pass: gap profile field-level parity đã được đóng phần lớn.
Remaining gaps: password dialog vẫn chưa đạt native bottom-sheet feel; save/toast nuance vẫn chưa sát app.
Severity: Medium
Fix priority: P2

Buy Points
Source: app buy points -> web /account?view=buy-points
Parity score: 7.5/10
Match tốt ở: package row structure, confirm flow, spacing và content density vẫn gần app.
Improved in this pass: icon/modality feel đồng bộ hơn với system mới.
Remaining gaps: confirm modal nuance và disabled top-up handling vẫn chưa bằng app.
Severity: Medium
Fix priority: P2

Transaction History
Source: app history -> web /account?view=history
Parity score: 6.7/10
Match tốt ở: summary cards, transaction rows, amount color semantics vẫn đúng hướng.
Improved in this pass: tổng thể bớt web-generic hơn nhờ icon/layout system mới.
Remaining gaps: section title/icon parity, row composition, và empty state vẫn phẳng hơn app.
Severity: Medium
Fix priority: P2

Feedback
Source: app feedback -> web /account?view=feedback
Parity score: 7.2/10
Match tốt ở: anchored topic picker, locked notice, rate-limit countdown, bad-language notice, auth-required, submit loading, success-return qua root toast, và exact feedback option keys đã có.
Improved in this pass: đây không còn là interaction web-generic như audit cũ.
Remaining gaps: feedback status vẫn mock/provider-driven thay vì fetch status; một số notice nuance và transition feel vẫn gọn hơn app.
Severity: Medium
Fix priority: P2

Support
Source: app support -> web /account?view=support
Parity score: 7.1/10
Match tốt ở: custom FAQ accordion, contact-error, FAQ loading, FAQ empty, và disabled contact rows đã có.
Improved in this pass: browser-native feel đã được bỏ; state matrix chính đã trở lại.
Remaining gaps: visual rhythm và async nuance vẫn đơn giản hơn app; contact/fetch behavior vẫn mock-backed.
Severity: Medium
Fix priority: P2

Phần C - Trạng thái cross-screen

Những gì đã được sửa đúng hướng trong pass này

- Icon system đã bỏ feel outline generic; web hiện dùng filled/native-like mapping gần app hơn rõ.
- Auth shell đã có branded header và scroll owner đúng hướng app; không còn centered standalone card feel.
- Plans, Topup, Register/Upgrade/Profile, Stations, Feedback, Support đã được sửa ở tầng state branch thật sự.
- Station Detail đã có document renderer parity-first thay vì patch màn hình lẻ.
- Dashboard rating và Feedback topic picker đã quay về anchored popover thay vì centered dialog generic.
- Support FAQ đã bỏ browser-native interaction.
- Scan đã có immersive scanner composition thay vì dashed demo box.

Những gì vẫn còn là cross-screen gap

- Loading/error/empty vẫn chưa de-genericize hết ở các màn P1/P2.
- Bottom-sheet/modal/toast family đã tốt hơn, nhưng vẫn chưa map hết native nuance của app.
- Realtime fidelity vẫn là gap lớn nhất còn lại ở Plans và Topup.
- Wording parity đã mở rộng nhiều, nhưng vẫn chưa khóa hết toàn bộ sentence variants của app.
- Motion hiện an toàn và tiết chế, nhưng chưa có parity sâu theo từng màn.

Phần D - Ảnh chụp nhanh theo Definition of Done

Những điểm đã đạt trong pass này

- Plans không còn là state model rút gọn kiểu audit cũ.
- Topup không còn auto-paid modal flow sai bản chất.
- Auth/Profile đã có field-level validation parity baseline.
- Stations đã có requesting-location / denied / route-error flows.
- Feedback/Support đã có state matrix chính thay vì interaction generic.
- Station detail đã có document renderer parity-first.
- Scan không còn là mock scanner box.
- Auth shell và icon system đã quay về đúng direction parity-first.

Những điểm chưa đạt hoàn toàn

- Plans chưa đạt full app-faithful realtime state machine.
- Topup chưa đạt full backend-faithful polling/session lifecycle.
- Dashboard và Scan vẫn còn P1 branch depth.
- Verify Email vẫn lệch cooldown/accountId.
- Loading/error/empty vẫn chưa được section-specific hóa hoàn toàn trên toàn web.

Phần E - Kết luận cuối

So với audit cũ, `CharPlug_web` đã tăng parity rõ rệt và không còn nằm ở vùng "parity-red".
P0 đã được chốt ở đúng 5 cụm ưu tiên, và phần lớn mismatch nặng nhất đã không còn là blocker mức độ cũ.

Tuy vậy, đây vẫn chưa phải polish-only build.
Trạng thái hiện tại nên được xem là:

`late parity pass / early polish threshold`

Nói cách khác:
- product feel đã gần app hơn rõ
- state branch chính đã trở lại trên nhiều màn
- nhưng backlog còn lại vẫn là parity backlog, không chỉ là visual polish backlog

Kết luận ngắn:
web hiện tại đã đủ gần app hơn một cách rõ ràng và có thể tiếp tục vào P1/P2,
nhưng vẫn cần thêm một pass nữa để khóa realtime nuance, loading/error composition, và native interaction detail.
