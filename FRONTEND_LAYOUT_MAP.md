# App Frontend Layout Map

## Mục đích

File này mô tả bố cục UI tổng thể của app: app shell, điều hướng, cấu trúc từng màn hình và các pattern bố cục dùng lặp lại. Dùng file này khi cần dựng lại flow giao diện ở app khác mà vẫn giữ gần đúng trải nghiệm hiện tại.

## Phạm vi áp dụng

- App shell và điều hướng gốc.
- Toàn bộ auth flow.
- 5 tab chính: dashboard, plans, scan, stations, account.
- Detail/flow screens: station detail, topup QR.
- Account subviews: profile, buy points, transaction history, support, feedback.
- Modal và overlay chính.

## Cách dùng khi port sang app khác

- Dựng app shell trước.
- Sau đó dựng navigation hierarchy.
- Cuối cùng dựng từng screen theo section order bên dưới.
- Khi muốn rút gọn UI, giữ nguyên order section và loại container trước, rồi mới tinh giản chi tiết bên trong.

## 1. App Shell

### Global shell structure

1. Nền toàn app là gradient background toàn màn hình.
2. Header logo cố định nằm trên cùng, luôn hiện ở đa số màn hình.
3. Nội dung màn hình bắt đầu phía dưới header cố định.
4. Safe area được xử lý ở root, tab screens không ăn vào đáy.
5. Tab bar tùy biến nằm dưới cùng, scan là nút nổi ở giữa.

### Header shell

- Header là một dải cố định toàn chiều ngang.
- Có gradient riêng, border đáy và shadow nhẹ.
- Nội dung header chỉ gồm logo ở giữa.
- Header không chứa action screen-specific.

### Tab bar shell

- Có 5 điểm điều hướng: dashboard, plans, scan, stations, account.
- 4 tab thường nằm sát đáy.
- Tab scan là nút tròn nổi lên cao hơn mặt tab bar.
- Tab active có nền riêng, viền riêng và label đổi màu.

## 2. Global Layout Rules

### Scroll behavior

- Phần lớn màn hình chính dùng scroll dọc một cột.
- Tab screens dùng pull-to-refresh scroll container.
- Detail screens và account subviews dùng scroll thường.
- Vertical scroll indicator thường bị ẩn.

### Content container pattern

- Màn hình tab và màn hình detail thường dùng:
  - horizontal padding 20
  - top padding 20
  - bottom padding lớn để không đụng tab bar
  - section gap 16

### Screen family distinction

| Loại màn hình | Đặc trưng layout |
|---|---|
| auth screen | card-centered content, form-first, ít section |
| tab screen | list of sections/card blocks, có pull to refresh |
| detail screen | có back button đầu trang, sau đó là content stack |
| modal center | panel giữa màn hình, scrim toàn màn hình |
| bottom sheet | panel trồi từ dưới lên, bo góc trên lớn |
| overlay success/error | card nổi phía trên toàn app, có scrim riêng |

### Khi dùng từng kiểu bố cục

- Dùng full-screen form cho login, register, upgrade, feedback.
- Dùng card-stack screen cho dashboard, stations, plans, account.
- Dùng detail-scroll screen cho station detail và topup QR.
- Dùng center modal cho confirm actions.
- Dùng bottom-fixed feeling cho tab bar và bottom sheet change password.

## 3. Navigation Map

### Root level

- Root shell chứa:
  - header logo cố định
  - tab navigator
  - auth stack
  - modal screen
  - upgrade screen
  - global overlays

### Auth group

- `login`
- `register`
- `verify email`

### Main tab group

- `dashboard`
- `plans`
- `scan`
- `stations`
- `account`

### Secondary flow screens

- `station detail`
- `topup vietqr`
- `upgrade`

### In-tab full-screen account subviews

- `buy points`
- `transaction history`
- `feedback`
- `customer support`
- `profile`

## 4. Auth Screen Layouts

### Login

Section order:

1. Title block
2. Subtitle block
3. Form card
4. Email field
5. Password field
6. Error text nếu có
7. Primary login CTA
8. Secondary visitor CTA
9. Link sang register

Pattern chính:

- Màn hình form đơn.
- Một card lớn chứa gần như toàn bộ nội dung tương tác.
- CTA chính và CTA phụ xếp dọc.

### Register

Section order:

1. Title
2. Subtitle
3. Form card
4. Name
5. Email
6. Phone
7. Password + strength hint
8. Confirm password
9. Terms row
10. Error block
11. Primary submit
12. Link về login

Pattern chính:

- Dài hơn login nhưng vẫn là single-card form.
- Nội dung đi từ thông tin cá nhân sang xác nhận điều khoản.

### Verify email

Section order:

1. Trung tâm màn hình
2. Icon mail tròn
3. Title
4. Message
5. Email đang xác minh
6. Feedback text
7. Resend CTA
8. Back to login

Pattern chính:

- One-card centered state screen.
- Ít input, thiên về message + action.

### Upgrade visitor

Section order:

1. Title
2. Subtitle
3. Form card
4. Full name
5. Phone
6. Email
7. Password
8. Confirm password
9. Error block
10. Submit CTA
11. Continue as guest text link

Pattern chính:

- Cùng family với register.
- Form card full-width trong viewport scroll.

## 5. Main Tab Layouts

### Dashboard

Section order:

1. Page title
2. Filter bar
3. Stat card row hoặc stat card stack
4. History section title
5. Error/loading/empty state nếu có
6. Session history cards
7. Rating popover overlay
8. Refresh failure toast

Pattern chính:

- Screen overview dạng summary-first.
- Section đầu là filter + stat.
- Section sau là danh sách lịch sử.

Khác biệt nổi bật:

- Stat cards có thể đổi từ 1 hàng sang 1 cột tùy chiều rộng.
- Có lock overlay cho visitor.

### Stations

Section order:

1. Page title
2. Sort dropdown ở góc phải title row
3. Inline notice về location nếu có
4. Loading location
5. Loading stations
6. Error or route notice
7. Empty state
8. Danh sách station cards
9. Refresh failure toast

Pattern chính:

- Danh sách card dày thông tin.
- Section đầu là title + sorting.
- Nội dung chính là station card stack.

Khác biệt nổi bật:

- Card giàu hình ảnh và chip hơn các màn hình khác.
- Dùng nhiều frosted CTA cục bộ.

### Scan

Section order:

1. Full-screen camera/container
2. Overlay tối toàn màn hình
3. Scanner frame ở giữa
4. Page title trên cao
5. Instruction block dưới frame
6. Camera permission state nếu chưa cấp quyền
7. Upload image CTA
8. Error dialog overlay nếu quét lỗi

Pattern chính:

- Màn hình immersive.
- Không theo card-stack thông thường.
- Title và action nổi trên nền camera.

Khác biệt nổi bật:

- Dùng scanner frame với cutout.
- Nút scan ở tab bar dẫn vào một màn hình có bố cục hoàn toàn khác 4 tab còn lại.

### Plans

Section order:

1. Recovery loading nếu đang khôi phục session
2. Socket info card
3. Socket status banner
4. Active session card nếu có
5. Completed flash banner nếu có
6. Balance card
7. Plans section title
8. Empty state hoặc danh sách plan cards
9. Refresh failure toast
10. Plan confirm modal
11. Cash partner waiting modal

Pattern chính:

- Đây là màn hình nghiệp vụ dày nhất.
- Layout ưu tiên trạng thái của socket/session trước, danh sách plan sau.

Khác biệt nổi bật:

- Một màn hình chứa cả monitor card, status banner, wallet snapshot và plan purchase.
- Khi có active session, phần trạng thái chiếm ưu tiên thị giác cao nhất.

### Account

Section order:

1. Profile summary row
2. Wallet summary card
3. Settings section title
4. Theme segmented control
5. Language segmented control
6. Manage section title
7. Action rows: buy points, history, feedback, support
8. Logout CTA
9. Refresh failure toast
10. Success overlay nếu vừa gửi feedback thành công
11. Upgrade modal nếu visitor bị chặn

Pattern chính:

- Screen chia thành profile, settings, actions.
- Nhiều row dẫn vào subview full-screen.

Khác biệt nổi bật:

- Một tab nhưng chứa nhiều entrypoint sang subflows khác nhau.
- Có lock behavior cho visitor và lock riêng cho feedback rate limit.

## 6. Detail / Flow Screen Layouts

### Station detail

Section order:

1. Back button + page title
2. Loading state hoặc error state
3. Hero block
4. Rich text / amenities / service list / voucher rail / table / image blocks
5. Fallback content nếu document rỗng

Pattern chính:

- Detail page dạng content document.
- Các block xếp dọc, có thể rất khác nhau nhưng vẫn dùng cùng card family.

Khác biệt nổi bật:

- Hero block rất giàu trình bày.
- Có gallery section, table, callout và service list trong cùng một flow.

### Topup VietQR

Section order:

1. Back button + title
2. Error card nếu tạo order lỗi
3. QR card lớn ở giữa
4. Info card chứa account name, number, bank, amount, transfer content
5. Save QR CTA
6. Hint text
7. Thành công sẽ kích hoạt success overlay toàn app

Pattern chính:

- Detail transaction screen một cột.
- QR là phần tử hero trung tâm.

Khác biệt nổi bật:

- Có nhiều trạng thái kỹ thuật hơn nhưng giao diện vẫn cố giữ card-based.

## 7. Account Subview Layouts

### Buy points

Section order:

1. Back button + title
2. Danh sách package rows

Pattern chính:

- Full-screen list subview.
- Mỗi row là một package card compact.

### Transaction history

Section order:

1. Back button + title
2. Hai summary cards
3. Section title
4. Empty state hoặc transaction rows

Pattern chính:

- Summary + list.

### Customer support

Section order:

1. Back button + title
2. Error panel nếu có
3. Contact section title
4. Phone card
5. Zalo card
6. Email card
7. Address card
8. Support hours panel
9. FAQ section title
10. Loading/empty FAQ state
11. FAQ accordion items

Pattern chính:

- Contact methods trước, FAQ sau.
- Card list với nhiều icon row đồng nhất.

### Feedback

Section order:

1. Back button + title
2. Intro card
3. Topic selector
4. Text area lớn
5. Counter hint
6. Feedback notice nếu có
7. Submit button
8. Topic picker modal nổi nếu mở

Pattern chính:

- Form screen chuyên dụng.
- Một phần là sheet-like dropdown, phần còn lại là long-form input.

Khác biệt nổi bật:

- Có lock state theo server.
- Có notice panel inline trong flow form.

### Profile

Section order:

1. Back button + title
2. Avatar block
3. Profile information card
4. Save profile CTA
5. Change password row
6. Bottom sheet change password nếu mở
7. Success overlay nếu đổi mật khẩu xong

Pattern chính:

- Summary info + action row.
- Change password không mở sang screen mới mà mở thành bottom sheet.

## 8. Modal And Overlay Map

### Upgrade modal

- Center modal.
- Title, message, confirm CTA, cancel CTA.
- Dùng cho visitor lock.

### Confirm purchase modal

- Center modal.
- Hiển thị package info và payment amount.
- 2 CTA dọc.

### Plan confirm modal

- Center modal.
- Hiển thị plan name, duration, energy, price.
- Dùng chung cho buy mới và extend.

### Cash partner waiting modal

- Center modal.
- Tập trung vào title, giá trị giao dịch và trạng thái chờ.

### Session rating popover

- Floating panel neo gần anchor.
- Không phải modal toàn màn hình.
- Dùng để rate session trực tiếp từ dashboard.

### Refresh failure toast

- Overlay nhỏ nổi phía trên.
- Chỉ báo lỗi refresh.

### Success overlays

- Feedback success overlay.
- Change password success overlay.
- Topup success notification overlay.

### Low warning overlay

- Banner nổi bên dưới header.
- Dành cho low package/session warning.

## 9. Repeated Layout Patterns

| Pattern | Dùng ở đâu |
|---|---|
| back button + heading row | detail screens, account subviews |
| page title + right action | dashboard, stations |
| section title with icon | account, transaction history, plans |
| card stack | dashboard, plans, account, station detail |
| one-card form | login, register, upgrade, verify |
| row list with chevron | buy points, support, account actions |
| overlay scrim + centered card | most modal and success overlays |
| bottom sheet with large top radius | profile change password |

## 10. Những Điểm Cần Giữ Nếu Muốn Tái Tạo Gần Giống

- Header logo luôn là shell riêng, không gộp vào từng screen.
- Tab bar phải có scan CTA nổi ở giữa.
- Màn hình chính đều đi theo card stack mềm, không dùng layout phẳng kiểu table.
- Station-related screens giữ chất liệu giàu hình ảnh, frosted CTA và radius lớn.
- Plans screen luôn ưu tiên session/socket state lên trên danh sách plan.
- Account là hub điều hướng nội bộ, không chỉ là màn hình cài đặt đơn thuần.
- Success flows thường kết thúc bằng overlay nổi thay vì text nhỏ trong màn hình.

## Checklist Khi Port Sang App Khác

- App shell có header cố định và content nằm dưới header.
- Navigation hierarchy vẫn tách auth, tabs, detail screens và account subviews.
- Dashboard vẫn là overview-first, plans vẫn là status-first, stations vẫn là list-first.
- Scan vẫn giữ bố cục immersive riêng.
- Station detail vẫn theo document block layout.
- Account subflows vẫn đi theo full-screen subview hoặc modal phù hợp.
- Modal center, bottom sheet và overlay success được tách rõ, không dùng chung một kiểu panel cho tất cả.
- Mỗi màn hình vẫn giữ đúng thứ tự section chính như bản hiện tại.
