# App UI Design Specs

## Mục đích

File này gom toàn bộ typography, spacing, radius, sizing và component density của app. Dùng file này để tái tạo lại nhịp điệu thị giác và độ “nén/thoáng” của giao diện ở app khác.

## Phạm vi áp dụng

- Toàn bộ app shell và các màn hình con.
- Bao gồm typographic scale, khoảng cách, bo góc, kích thước control, kích thước icon well, modal width và các recipe component lặp lại.
- Không lặp lại bảng mã màu. Mọi nhắc tới màu đều tham chiếu semantic role trong `APP_COLOR_GUIDE.md`.

## Cách dùng khi port sang app khác

- Thiết lập typography và spacing trước.
- Sau đó map radius và control size vào design system mới.
- Cuối cùng dựng các component recipe theo đúng hierarchy ở dưới.

## 1. Typography Scale

| Variant | Font size | Line height | Trọng lượng dùng phổ biến | Vai trò |
|---|---|---|---|---|
| xs | 12 | 16 | medium hoặc semibold | micro label, badge nhỏ, countdown hint |
| sm | 14 | 20 | regular hoặc semibold | caption, supporting copy, compact row |
| base | 16 | 24 | regular hoặc semibold | body text chuẩn, button label, input text |
| xl | 20 | 30 | semibold | section heading, page heading |
| logo | 30 | 40 | bold | logo header |

## 2. Variant Mapping

| Variant thiết kế | Scale | Cách dùng |
|---|---|---|
| heading | 20 / 30 | page title, section title lớn, modal title |
| body | 16 / 24 | nội dung chuẩn, label chính, action text |
| caption | 14 / 20 | helper text, sub-note, badge detail |
| overline | 16 / 24, uppercase | meta title, small section label, name trên hero image |

## 3. Spacing Scale

| Token thực tế | Giá trị px | Cách dùng chính |
|---|---|---|
| gap-1 | 4 | spacing siêu nhỏ giữa label và copy ngắn |
| gap-1.5 | 6 | grouping chặt trong form và tag row |
| gap-2 | 8 | icon + text, title + subtitle gần |
| gap-2.5 | 10 | compact spacing cho card nhỏ |
| gap-3 | 12 | row nội bộ, CTA stack, info pair |
| gap-4 | 16 | spacing mặc định giữa section/card |
| gap-5 | 20 | spacing ở form screen hoặc modal stack |
| px-3 | 12 | chip, badge, pill, compact button |
| px-4 | 16 | input, card inner padding, status banner |
| px-5 | 20 | page horizontal padding |
| py-2 | 8 | chip/direction pill compact |
| py-2.5 | 10 | small button, retry action |
| py-3 | 12 | CTA chuẩn trên auth, account, verify |
| py-3.5 | 14 | modal CTA, save QR, segmented actions |
| p-4 | 16 | card padding vừa |
| p-5 | 20 | card padding lớn |
| p-6 | 24 | modal/panel padding lớn |

## 4. Layout Container Specs

| Loại màn hình | Padding ngang | Padding trên | Padding dưới | Gap chuẩn |
|---|---|---|---|---|
| tab screen chính | 20 | 20 | 96 | 16 |
| detail / subview có back button | 20 | 20 | 96 | 16 |
| auth / upgrade form | 20 | 24 | 24 | 16 đến 20 |
| modal panel giữa màn hình | 24 | 24 | 24 | 20 |
| bottom sheet panel | 20 | 20 | 32+ | 16 |

## 5. Radius Scale

| Radius thực tế | Giá trị gần đúng | Dùng cho |
|---|---|---|
| rounded-md | 6 | checkbox nhỏ |
| rounded-lg | 8 | scan error retry button nhỏ |
| rounded-xl | 12 | input, back button, icon tile, compact button |
| rounded-2xl | 16 | list row, summary card, modal action, badge container |
| rounded-3xl | 24 | form card lớn, plan card, panel lớn, success toast card |
| rounded-[18px] | 18 | voucher row ở station card |
| rounded-[20px] | 20 | image inner frame |
| rounded-[24px] | 24 | image gallery block, large nested tile |
| rounded-[28px] | 28 | station card outer shell, topup overlay card family |
| rounded-[32px] | 32 | station hero image shell, bottom sheet top corners |
| rounded-full | pill / circle | avatar, badge, tab scan button, segmented knob |

## 6. Control Size Specs

| Thành phần | Kích thước |
|---|---|
| back button | 40 x 40 |
| close button tròn | 40 x 40 |
| avatar nhỏ account summary | 56 x 56 |
| avatar lớn profile | 96 x 96 |
| section icon bubble | 32 x 32 |
| compact stat icon bubble | 36 x 36 |
| buy-point / support icon tile | 44 x 44 |
| scan center CTA | 64 x 64 |
| status dot | 8 x 8 |
| large success badge circle | 56 x 56 |
| verify email icon circle | 56 x 56 |
| topup success hero icon | 64 x 64 |

## 7. Input And Button Specs

| Thành phần | Spec |
|---|---|
| standard text input | padding ngang 16, padding dọc 12, radius 12 |
| text area feedback | padding 16, radius 24, chiều cao tối thiểu 180 |
| auth primary CTA | cao khoảng 48, radius 12 |
| modal primary CTA | cao khoảng 52, radius 16 |
| modal secondary CTA | cao khoảng 52, radius 16 |
| segmented toggle chip | padding ngang 12, padding dọc 4, radius full |
| filter chip | padding ngang 12, padding dọc 10, radius 16 |
| pill badge | padding ngang 10 đến 12, padding dọc 6 đến 8, radius full |

## 8. Shell Metrics

| Thành phần shell | Spec |
|---|---|
| header min height | 96 |
| header content height | 44 |
| header min top padding | 16 + safe area |
| header bottom padding | 12 |
| tab bar horizontal padding | 16 |
| tab bar top padding | 4 |
| tab bar bottom padding | tối thiểu 12 + safe area |
| scan CTA offset | nổi lên khoảng 16 |

## 9. Screen-Specific Large Element Specs

| Thành phần | Spec |
|---|---|
| station card cover | cao 188 |
| station detail hero cover | tỉ lệ 16:9 |
| scan frame | tối đa 240, căn giữa |
| scan action button width | tối đa 280 |
| modal width giữa màn hình | khoảng 83% đến 85% màn hình, max small |
| centered success overlay card | max width small, radius 24 đến 28 |
| bottom sheet change password | bo góc trên 32, cao tối đa khoảng 88% viewport |

## 10. Component Recipes

### Form card

- Nền `surface`.
- Radius 24.
- Padding 20.
- Gap nội bộ 16.
- Label dùng cấp muted-light.
- Input dùng radius 12, padding 16 x 12.
- Primary CTA đặt cuối card, full width.

### Settings segmented toggle

- Vỏ ngoài là pill full, nền `surface-alt`.
- Mỗi lựa chọn là chip full-radius bên trong.
- Lựa chọn active dùng `accent`.
- Lựa chọn inactive dùng foreground hoặc muted-light.
- Dùng cho theme và language switch trong account.

### Section header

- Có icon bubble tròn hoặc rounded 2xl.
- Icon bubble thường 32 x 32.
- Heading dùng cỡ 20 / 30 hoặc meta overline tùy ngữ cảnh.
- Có thể đi kèm divider gradient hoặc action bên phải.

### Modal panel giữa màn hình

- Rộng khoảng 5/6 đến 85% màn hình.
- Max width small để không bị quá ngang trên tablet nhỏ.
- Padding 24.
- Radius 24.
- CTA stack 2 nút chiều dọc.
- Scrim tối khoảng 0.5 opacity.

### Bottom sheet panel

- Neo ở đáy màn hình.
- Bo tròn góc trên 32.
- Dùng background chính của app, không dùng surface.
- Nội dung bên trong vẫn đi theo card/input spec chuẩn.

### Inline notice

- Radius 16.
- Padding 16 ngang, 12 dọc.
- Có icon trái, nội dung giữa, action hoặc dismiss bên phải.
- Dùng tone theo semantic state.

### List card

- Nền `surface`.
- Radius 16 hoặc 24 tùy mức độ quan trọng.
- Padding 16.
- Với rich card như station card dùng radius 28 và cover image riêng.

### Status badge

- Dạng pill full-radius.
- Padding ngang 10 đến 12, padding dọc 6 đến 8.
- Có dot 8 x 8 nếu là availability.
- Text thường dùng size 14 / 20 hoặc 12 / 16, semibold.

### Primary button

- Nền `accent`.
- Chữ `on-accent`.
- Semibold.
- Radius 12 ở form, radius 16 ở modal hoặc CTA lớn.

### Secondary button

- Nền `surface` hoặc `surface-alt`.
- Có border chuẩn.
- Chữ foreground hoặc accent tùy ưu tiên.

### Destructive button

- Nền `danger` nếu là hành động hủy mạnh.
- Nếu chỉ là warning panel, dùng `danger-soft` + text `danger`.

## 11. Density And Hierarchy Rules

- App ưu tiên card-based layout, không dùng màn hình quá trống.
- Mỗi màn hình thường có 3 lớp mật độ:
  - shell spacing rộng
  - section spacing vừa
  - row spacing chặt
- Màn hình auth và feedback thoáng hơn.
- Màn hình station, plans và account dùng mật độ trung bình để hiển thị nhiều thông tin nhưng vẫn mềm.
- Modal và overlay có density chặt hơn màn hình chính, nhưng vẫn giữ padding lớn để không bị “hộp thoại kỹ thuật”.

## 12. Điều Không Nên Thay Đổi Khi Muốn Giữ Đúng Chất Giao Diện

- Không giảm page horizontal padding xuống dưới 20.
- Không thay radius card chính từ 24 về 12.
- Không thu nhỏ heading xuống dưới 20 / 30.
- Không biến primary CTA thành nút quá thấp; mức hiện tại khoảng 48 đến 52 là hợp lý.
- Không biến station card thành layout vuông cứng; card này cần radius lớn và chất liệu mềm hơn phần còn lại.
- Không làm tab bar phẳng hoàn toàn; scan CTA nổi là một điểm nhận diện mạnh.

## Checklist Khi Port Sang App Khác

- Typography có đủ 4 cấp chính và logo size riêng.
- Page container giữ padding 20 ngang.
- Section gap chính giữ khoảng 16.
- Input, button, card đều giữ nhịp radius 12 / 16 / 24.
- Back button và icon tile giữ cỡ 40 / 44 để cảm giác điều khiển nhất quán.
- Scan CTA vẫn là nút tròn 64.
- Modal trung tâm và bottom sheet không dùng chung hình khối.
- Auth, plans, station, account vẫn giữ đúng density tương đối như app hiện tại.
