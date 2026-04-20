# App Color Guide

## Mục đích

File này là nguồn màu chuẩn duy nhất của app. Dùng file này khi cần dựng lại giao diện ở app khác mà vẫn giữ đúng cảm giác thị giác, độ ưu tiên màu và cách phân bố màu giữa các màn hình.

## Phạm vi áp dụng

- Toàn bộ app shell, auth, 5 tab chính, station detail, topup QR, account subviews, modal và overlay.
- Áp dụng cho cả light mode và dark mode.
- Tập trung vào semantic role và vị trí sử dụng, không mô tả code.

## Cách dùng khi port sang app khác

- Giữ nguyên semantic role trước, sau đó mới map vào design system mới.
- Nếu app mới không có token system, dùng trực tiếp bảng màu bên dưới.
- Chỉ dùng mục “special local colors” cho các khu vực giàu trình bày như station card, station detail, scan overlay và success overlay.

## 1. Core Palette

| Semantic role | Light | Dark | Vai trò chính | Dùng ưu tiên cho |
|---|---|---|---|---|
| background | `#F8FAFC` | `#0F172A` | nền canvas toàn app | nền màn hình, nền shell |
| background-via | `#F8FAFC` | `#0F172A` | lớp trung gian của background gradient | nền shell |
| background-to | `#F8FAFC` | `#0F172A` | lớp cuối của background gradient | nền shell |
| surface | `#FFFFFF` | `rgba(31, 41, 55, 0.90)` | mặt card chính | card, panel, popup body |
| surface-alt | `#FFF5F9` | `#111827` | mặt phụ mềm hơn | chip, toggle nền phụ, panel phụ |
| surface-full | `#FFF5F9` | `#1F2937` | mặt solid dày hơn | overlay card, toast card, glass-like panel |
| foreground | `#1F2937` | `#F9FAFB` | text chính | heading, body quan trọng |
| muted | `#6B7280` | `#9CA3AF` | text phụ | subtitle, supporting text |
| muted-light | `#9CA3AF` | `#6B7280` | text nhạt hơn | placeholder, hint, inactive label |
| accent | `#F472B6` | `#60A5FA` | màu hành động chính | primary CTA, active icon, highlight |
| accent-soft | `rgba(236, 72, 153, 0.10)` | `rgba(96, 165, 250, 0.12)` | accent nền nhẹ | chip active, icon well, soft panel |
| accent-soft-2 | `rgba(236, 72, 153, 0.06)` | `rgba(96, 165, 250, 0.08)` | accent nền rất nhẹ | header strip, tertiary fill |
| border | `#F3E8EE` | `#334155` | viền chuẩn | card, input, modal, row divider mạnh |
| border-focus | `#F9A8D4` | `#93C5FD` | viền focus/accent | focus ring, selected state |
| divider | `#E5E7EB` | `#1F2937` | phân tách mảnh | line divider, table divider |
| input | `#FFFFFF` | `rgba(31, 41, 55, 0.90)` | nền input | text field, text area |
| input-border | `#F3E8EE` | `#334155` | viền input | input, editable cell |
| input-placeholder | `#9CA3AF` | `#6B7280` | placeholder | form field |
| on-accent | `#FFFFFF` | `#FFFFFF` | chữ trên nền accent | CTA chính |
| on-accent-muted | `#6B7280` | `#9CA3AF` | text sáng nhưng giảm ưu tiên | scan instruction phụ, overlay copy nhẹ |
| on-accent-border | `#F9A8D4` | `#93C5FD` | viền phụ đi cùng accent | secondary accent button |
| shadow-base | `#1F2937` | `#0F172A` | shadow gốc | shadow card, modal, overlay |
| logo-fixed | `#B4A3F0` | `#B4A3F0` | màu logo cố định | logo header |

## 2. Header, Gradient, Navigation

| Khu vực | Light | Dark | Vai trò |
|---|---|---|---|
| header background from | `#FFFFFF` | `#0F172A` | đầu gradient header |
| header background via | `#FFF1F6` | `#1E293B` | giữa gradient header |
| header background to | `#FCE7F3` | `#334155` | cuối gradient header |
| header border | `#F3E8EE` | `#334155` | viền đáy header |
| header shadow | `rgba(244, 114, 182, 0.15)` | `rgba(96, 165, 250, 0.20)` | bóng header |
| header orb 1 | `#F472B6` | `#60A5FA` | điểm glow trang trí |
| header orb 2 | `#EC4899` | `#A78BFA` | điểm glow trang trí |
| title gradient from | `#EC4899` | `#60A5FA` | đầu line/title gradient |
| title gradient to | `#F472B6` | `#3B82F6` | cuối line/title gradient |
| scan gradient from | `#F472B6` | `#60A5FA` | nút scan nổi |
| scan gradient to | `#F9A8D4` | `#93C5FD` | nút scan nổi |
| tab bar background | `rgba(255, 255, 255, 1)` | `rgba(15, 23, 42, 1)` | nền tab bar |
| tab bar background to | `rgba(255, 255, 255, 1)` | `rgba(30, 41, 59, 1)` | gradient tab bar dark |
| tab active fill | `rgba(244, 114, 182, 0.15)` | `rgba(96, 165, 250, 0.20)` | nền icon tab active |
| tab active border | `#F9A8D4` | `#93C5FD` | viền icon tab active |
| tab inactive | `#9CA3AF` | `#6B7280` | icon và label inactive |
| tab top line A | `#F9A8D4` | `#93C5FD` | line trên tab bar |
| tab top line B | none | `#C4B5FD` | lớp thứ hai của line dark |

## 3. Semantic State Palette

| State | Light | Dark | Dùng cho |
|---|---|---|---|
| available | `#16A34A` | `#4ADE80` | socket available, success badge |
| available-soft | `rgba(34, 197, 94, 0.12)` | `rgba(74, 222, 128, 0.18)` | nền success mềm |
| success | `#EC4899` | `#60A5FA` | success accent cấp hệ thống |
| success-soft | `rgba(236, 72, 153, 0.12)` | `rgba(96, 165, 250, 0.15)` | nền success mềm hệ thống |
| warning | `#F472B6` | `#93C5FD` | warning nhẹ, accent warning |
| info | `#EC4899` | `#60A5FA` | info accent |
| info-soft | `rgba(236, 72, 153, 0.12)` | `rgba(96, 165, 250, 0.15)` | info panel mềm |
| danger | `#EF4444` | `#EF4444` | lỗi, hủy, destructive CTA |
| danger-soft | `rgba(253, 237, 237, 0.90)` | `rgba(58, 30, 30, 0.90)` | nền lỗi mềm |
| session-stable | `#15803D` | `#4ADE80` | session đang tốt |
| session-warning | `#EA580C` | `#FB923C` | session gần hết |
| session-danger | `#DC2626` | `#F87171` | session lỗi hoặc dừng |

## 4. Functional Mapping Theo Thành Phần

| Thành phần | Màu chính | Màu phụ | Ghi chú sử dụng |
|---|---|---|---|
| app shell | background, header gradient, logo-fixed | header border, header shadow | shell luôn giữ header gradient cố định |
| page title | accent + title gradient | foreground | heading màu accent, divider dùng gradient |
| primary button | accent + on-accent | shadow-base nếu có bóng | login, register, confirm, retry, scan CTA |
| secondary button | surface hoặc surface-alt | border, foreground hoặc accent | cancel, upload image, open detail nhẹ |
| destructive button | danger + on-accent | danger-soft cho panel liên quan | logout, stop session |
| input field | input, input-border | input-placeholder, foreground | form auth, profile, feedback |
| section card | surface | border, muted | đa số card của dashboard, account, plans |
| soft chip/pill | accent-soft hoặc surface-alt | accent, muted-light | filter chip, selected toggle, info chip |
| status badge available | available-soft | available | station availability |
| status badge warning | warning soft nội bộ | warning | charging by other, near-end |
| status badge danger | danger-soft | danger | error, offline, invalid state |
| modal panel | background hoặc surface-full | border, shadow-base | confirm modal, upgrade modal |
| toast/success overlay | surface-full | available, on-accent, shadow-base | profile success, topup success |
| tab active item | tab active fill + tab active border | accent | icon tab active |
| tab inactive item | transparent | nav inactive | icon/label khi không chọn |
| scan screen | shadow-base scrim + scan gradient | on-accent-muted, danger | camera overlay và CTA |

## 5. Screen / Component Mapping

### App shell

| Khu vực | Role màu nên dùng |
|---|---|
| nền toàn app | background |
| header gradient | header background from / via / to |
| logo | logo-fixed |
| header border | header border |
| header shadow | header shadow |

### Auth screens

| Khu vực | Role màu nên dùng |
|---|---|
| form card | surface |
| field label | muted-light |
| field text | foreground |
| field placeholder | input-placeholder |
| field border | input-border |
| primary submit | accent + on-accent |
| secondary action | surface + border + foreground |
| error text | danger |
| helper/subtitle | muted |

### Dashboard

| Khu vực | Role màu nên dùng |
|---|---|
| stat card nền | surface |
| stat icon well | accent-soft hoặc stat icon local token |
| history card | surface + border |
| rating action | accent-soft + accent |
| empty/loading/error state | surface + muted hoặc danger |

### Stations

| Khu vực | Role màu nên dùng |
|---|---|
| filter chip inactive | surface-alt + border |
| filter chip active | filter-active + accent border |
| station card nền | surface |
| station status | available/danger badge pair |
| direction CTA | accent-soft local treatment hoặc frosted local treatment |

### Scan

| Khu vực | Role màu nên dùng |
|---|---|
| scrim | shadow-base với opacity cao |
| scanner frame | scan gradient start color |
| scanner border | local frame border override |
| primary camera permission CTA | scan gradient + on-accent |
| upload CTA | surface-alt hoặc surface + accent border |
| error dialog | surface + danger |

### Plans

| Khu vực | Role màu nên dùng |
|---|---|
| socket info card | surface + border |
| active session card | session tone theo state |
| plan card | surface + border |
| balance card | surface + success |
| plan confirm modal | background/surface + accent |

### Account

| Khu vực | Role màu nên dùng |
|---|---|
| profile summary card | surface |
| wallet summary | surface + success |
| settings segmented toggle | surface-alt nền, accent cho active chip |
| action rows | surface |
| logout | danger + on-accent |
| success toast | surface-full + available |

### Station detail

| Khu vực | Role màu nên dùng |
|---|---|
| content cards | surface |
| feature chips | accent-soft |
| table header | accent-soft |
| voucher rail | accent-soft-2 + local frosted treatment |
| back button | surface + accent |

### Topup QR

| Khu vực | Role màu nên dùng |
|---|---|
| QR container | surface |
| information card | surface |
| save QR CTA | accent + on-accent |
| loading state | accent |
| topup success overlay | success / accent + surface-full |

## 6. Special Local Colors

Các màu dưới đây là ngoại lệ có chủ đích cho khu vực giàu trình bày. Không dùng chúng làm màu hệ thống cho toàn app.

| Màu | Khu vực | Vai trò |
|---|---|---|
| `#5B556B` | station list, station detail | address text light |
| `#CBD5E1` | station list, station detail | address text dark |
| `#6F667C` | station list | description text light |
| `#A8B5C8` | station list | description text dark |
| `#DB2777` | station card, station detail | shadow hồng cho chip/voucher/directions |
| `rgba(255, 252, 255, 0.96)` | station card, station detail | frosted light action chip |
| `rgba(96, 165, 250, 0.10)` | station card, station detail | frosted dark action chip |
| `rgba(244, 114, 182, 0.30)` | station card, station detail | top highlight line light |
| `rgba(96, 165, 250, 0.22)` | station card, station detail, scan | top highlight / frame border dark |
| `rgba(244, 114, 182, 0.28)` | scan | frame border light |
| `rgba(0, 0, 0, 0.60)` | scan error overlay | error scrim |
| `rgba(15, 23, 42, 0.08)` | account success toast | scrim light |
| `rgba(2, 6, 23, 0.34)` | account success toast | scrim dark |
| `rgba(248, 250, 252, 0.58)` | topup success overlay | scrim light |
| `rgba(15, 23, 42, 0.42)` | topup success overlay | scrim dark |

## 7. Mức độ ưu tiên khi áp dụng màu

1. Dùng semantic role trong core palette.
2. Nếu cần hiệu ứng mềm hơn, dùng accent-soft, surface-alt hoặc semantic soft background.
3. Chỉ dùng special local colors cho station, scan, overlay và các khu vực được ghi rõ ở trên.
4. Không đảo vai trò giữa accent, success và danger. App hiện tại dùng accent để dẫn hướng, success để xác nhận, danger để hủy và lỗi.

## Checklist Khi Port Sang App Khác

- Có đủ 2 mode light và dark với đúng semantic role.
- Header vẫn giữ gradient riêng, không dùng cùng nền với content.
- Tab bar có active fill riêng và scan CTA nổi riêng.
- Primary CTA luôn dùng accent + on-accent.
- Form, card, modal, list row đều dùng surface/surface-alt đúng cấp.
- Badge trạng thái dùng semantic state, không dùng accent thay cho success hoặc danger.
- Station card và station detail vẫn giữ các màu ngoại lệ nếu muốn tái tạo đúng chất liệu hiện tại.
- Overlay thành công và overlay lỗi có scrim riêng, không dùng chung với card thông thường.
