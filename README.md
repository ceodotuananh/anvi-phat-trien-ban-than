# ANVI – Phát triển bản thân

Ứng dụng web giúp rèn luyện bản thân mỗi ngày theo ba trụ cột **Thân – Tâm – Tuệ**.

## Tính năng

- **Báo cáo tổng hợp**: toàn cảnh mọi hạng mục theo ngày / tuần / tháng / tùy chỉnh, so sánh tăng trưởng với kỳ trước, AI tổng hợp và phân tích vấn đề chung.
- **Nhật ký thói quen**: thói quen phân loại Thân, Tâm, Tuệ với chỉ tiêu số lượng; bảng lịch tháng nằm cùng hàng với từng thói quen.
- **Quản lý nghiệp**: mục tiêu tuần được ghim, kế hoạch và nhật ký gieo hạt cho Khách hàng, Đối tác, Đồng nghiệp, Thế giới, Gia đình/bạn bè.
- **Nhật ký biết ơn**: 10 điều biết ơn mỗi ngày, nút "Biết ơn", chuỗi ngày liên tiếp và tổng kết nội dung.
- **Order vũ trụ**: công việc, kết quả mong muốn, nguồn lực, thực tế.
- **Nhật ký ngày**: làm tốt, chưa làm được, bài học, cảm xúc; AI tổng hợp và gợi ý định hướng.
- **Video ý nghĩa**: kho video YouTube chia nhóm Thân, Tâm, Tuệ kèm tóm tắt.
- **Châm ngôn & nguyên tắc sống**: banner động lực hiện popup khi mở trang.

## Cấu trúc

```
index.html                  Toàn bộ ứng dụng (HTML + CSS + JavaScript, không cần build)
assets/logo-anvi-trang.png  Logo bản âm (trắng) dùng trên menu
assets/logo-anvi-goc.png    Logo gốc màu xanh
```

## Chạy thử

Mở trực tiếp `index.html` bằng trình duyệt, hoặc chạy một máy chủ tĩnh:

```bash
python3 -m http.server 8080
# mở http://localhost:8080
```

## Đưa lên mạng bằng GitHub Pages

Vào **Settings → Pages**, chọn nhánh `main`, thư mục `/ (root)` rồi bấm **Save**. Sau ít phút trang chạy tại
`https://<tên-tài-khoản>.github.io/anvi-phat-trien-ban-than/`.

## Lưu trữ dữ liệu

- Khi chạy trong Claude (claude.ai artifact): dữ liệu đồng bộ theo tài khoản và có AI phân tích.
- Khi chạy độc lập (GitHub Pages, máy cá nhân): dữ liệu lưu trong trình duyệt (localStorage) của máy đang dùng; tính năng AI tạm ẩn vì cần kết nối dịch vụ AI riêng. Tiêu đề video YouTube được tự lấy ở chế độ này.
