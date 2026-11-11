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
- **Những mục tiêu lớn**: tạo hạng mục mục tiêu (tài chính, sức khoẻ, sự nghiệp…) và các mục tiêu con có ô đánh dấu hoàn thành, hạn hoàn thành; thống kê tỉ lệ hoàn thành.
- **Trợ lý AI**: nút "✨ AI phân tích" ở từng hạng mục trong Báo cáo tổng hợp, kết quả hiện trong một khung chat cố định, có thể hỏi tiếp.
- **Tài khoản**: đăng ký, đăng nhập bằng email và mật khẩu (Supabase Auth), đổi mật khẩu, quên mật khẩu. Mỗi người dùng có dữ liệu riêng, đồng bộ trên mọi trình duyệt khi đăng nhập.

## Cấu trúc

```
index.html               Giao diện (HTML + CSS)
src/app.js               Logic ứng dụng, lưu trữ và đăng nhập
src/supabase.js          Khởi tạo Supabase client từ biến môi trường
api/ai.js                Hàm máy chủ Vercel gọi Claude API cho trợ lý AI
vercel.json              Cấu hình thời gian chạy tối đa của hàm AI
public/assets/           Logo (được copy nguyên vẹn khi build)
supabase/migrations/     SQL tạo bảng và chính sách bảo mật (RLS)
.env.example             Mẫu biến môi trường
```

## Chạy thử trên máy

Yêu cầu Node.js 20.19 trở lên.

```bash
npm install
cp .env.example .env        # rồi điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY
npm run dev                 # mở địa chỉ hiển thị trong terminal (thường là http://localhost:5173)
```

Đóng gói bản tĩnh để đưa lên mạng: `npm run build` (kết quả nằm trong thư mục `dist/`).

## Thiết lập Supabase (làm một lần)

1. Tạo project trên supabase.com, lấy **Project URL** và **anon public key** tại *Project Settings → API*. Không dùng khoá `service_role`.
2. Mở **SQL Editor**, dán toàn bộ nội dung `supabase/migrations/20261020000000_init.sql` rồi chạy. Lệnh này tạo bảng `user_data` và `growth_habits`, đồng thời bật RLS để mỗi người chỉ thấy dữ liệu của mình.
3. Vào *Authentication → Sign In / Providers → Email*: bật **Email**. Tắt **Confirm email** nếu muốn đăng ký và đăng nhập ngay, không cần xác nhận qua email.
4. Vào *Authentication → URL Configuration*: đặt **Site URL** và thêm địa chỉ của trang (ví dụ `https://anvi.netlify.app`) vào **Redirect URLs**. Cần để chức năng "Quên mật khẩu" hoạt động.

### Bảng `growth_habits`

| Cột | Ý nghĩa |
|---|---|
| `id` | Khoá chính |
| `user_id` | Chủ tài khoản (tham chiếu `auth.users`) |
| `habit_name` | Tên thói quen |
| `is_completed` | Đã đạt chỉ tiêu trong ngày hay chưa |
| `target_date` | Ngày ghi nhận |
| `created_at` | Thời điểm tạo dòng |

Mỗi thói quen có tối đa một dòng cho mỗi ngày (ràng buộc duy nhất theo `user_id`, `habit_name`, `target_date`).

## Đưa lên mạng bằng Vercel

1. Vào https://vercel.com, đăng nhập bằng GitHub, bấm **Add New → Project** và chọn kho `anvi-phat-trien-ban-than`.
2. Vercel tự nhận diện Vite. Kiểm tra: **Build Command** là `npm run build`, **Output Directory** là `dist`.
3. Mục **Environment Variables**: thêm `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` (chọn cả Production và Preview).
4. Bấm **Deploy**. Mỗi nhánh được đẩy lên sẽ có một địa chỉ preview riêng; nhánh `main` là bản chính thức.
5. Sau khi có địa chỉ, vào Supabase **Authentication → URL Configuration** và đặt **Site URL** là địa chỉ đó, đồng thời thêm vào **Redirect URLs**.

Vì Vite nhúng biến môi trường vào bản build, đổi biến trên Vercel thì phải **Redeploy** lại.

Chỉ cần hai biến trên. Khoá anon là khoá công khai; không đưa khoá `service_role` vào bất kỳ đâu.

## Trợ lý AI (Claude API)

Trợ lý AI chạy qua hàm máy chủ `api/ai.js` trên Vercel. Hàm này kiểm tra người dùng đã đăng nhập Supabase rồi mới gọi Claude, nên khoá API không bao giờ lộ ra trình duyệt.

1. Tạo khoá API tại https://console.anthropic.com (mục **API Keys**). Đây là tài khoản API tính phí theo lượng dùng, tách biệt với gói Claude.ai.
2. Trên Vercel: **Settings → Environment Variables**, thêm `ANTHROPIC_API_KEY` (không có tiền tố `VITE_`). Hàm AI dùng lại `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` để xác thực người dùng.
3. **Redeploy** để áp dụng.

- Mô hình: `claude-opus-5-5`, effort `medium`, có bật mô hình dự phòng phía máy chủ khi câu trả lời bị bộ lọc an toàn từ chối.
- Chạy thử trên máy: `npm run dev` không có `/api`; dùng `npx vercel dev` để chạy cả giao diện lẫn hàm AI.
- Khi mở trang bên trong Claude (artifact), trợ lý dùng kết nối AI sẵn có của Claude.

## Lưu trữ dữ liệu

- Dữ liệu chính lưu trên Supabase: bảng `user_data` (toàn bộ cấu hình và nhật ký) và `growth_habits` (lịch sử thói quen theo ngày).
- Lần đăng nhập đầu tiên trên một trình duyệt, nếu tài khoản chưa có dữ liệu trên máy chủ, ứng dụng sẽ chuyển dữ liệu cũ đang lưu trong trình duyệt (localStorage) lên tài khoản đó. Chỉ thực hiện một lần cho mỗi trình duyệt.
- Mật khẩu do Supabase quản lý và băm, ứng dụng không lưu mật khẩu.
- Đăng ký không cần xác nhận email: tắt **Confirm email** trong Supabase (Authentication → Sign In / Providers → Email) thì đăng ký xong vào được ngay.
