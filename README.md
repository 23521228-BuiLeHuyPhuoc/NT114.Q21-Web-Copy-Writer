# AI Copywriter – Kế Hoạch Công Việc Đồ Án

## Thông Tin Đồ Án

- **Đề tài:** Website hỗ trợ viết nội dung bằng AI (AI Copywriter)
- **Môn học:** NT114 – Mạng máy tính nâng cao
- **Thực hiện:** Bùi Lê Huy Phước (1 thành viên)
- **Công nghệ:** Node.js (Express), React.js (Next.js), MongoDB, GPT-4 / Llama

---

## Tổng Quan Công Việc

Dự án được chia thành **6 giai đoạn** với tổng cộng **35 công việc chính**. Mỗi công việc được phân rõ phần việc cụ thể, thời gian ước tính, và sản phẩm đầu ra.

| Giai đoạn | Tên | Thời gian | Số công việc |
|-----------|-----|-----------|--------------|
| 1 | Khởi tạo dự án & thiết lập môi trường | Tuần 1–2 | 7 |
| 2 | Xác thực & quản lý người dùng | Tuần 3–4 | 6 |
| 3 | Tích hợp AI & sinh nội dung | Tuần 5–7 | 8 |
| 4 | Quản lý nội dung & template | Tuần 8–9 | 6 |
| 5 | Tích hợp Llama & fine-tuning | Tuần 10–12 | 5 |
| 6 | Kiểm thử, tối ưu & triển khai | Tuần 13–14 | 3 |

---

## Giai Đoạn 1: Khởi Tạo Dự Án & Thiết Lập Môi Trường (Tuần 1–2)

> **Mục tiêu:** Thiết lập toàn bộ nền tảng kỹ thuật, đảm bảo frontend, backend, database chạy được ở môi trường local.

### Công việc 1.1 – Khởi tạo repository & cấu trúc thư mục
- Tạo repo trên GitHub, thiết lập `.gitignore`, nhánh `main` / `dev`
- Tạo cấu trúc thư mục: `client/` (Next.js), `server/` (Express.js)
- **Thời gian:** 1 ngày
- **Sản phẩm:** Repo GitHub với cấu trúc thư mục rõ ràng

### Công việc 1.2 – Khởi tạo frontend (Next.js)
- Chạy `npx create-next-app@latest` với TypeScript, Tailwind CSS, App Router
- Cấu hình `next.config.js`, `tailwind.config.ts`
- Tạo layout chung (`Header`, `Sidebar`, `Footer`)
- **Thời gian:** 2 ngày
- **Sản phẩm:** App Next.js chạy được tại `localhost:3000`

### Công việc 1.3 – Khởi tạo backend (Express.js)
- Tạo project Node.js, cài đặt Express.js, cấu hình cấu trúc MVC
- Tạo file `app.js` (entry point), cấu hình CORS, body-parser, error handler
- Tạo file `.env.example` với các biến môi trường mẫu
- **Thời gian:** 1 ngày
- **Sản phẩm:** Server Express chạy được tại `localhost:5000`

### Công việc 1.4 – Kết nối MongoDB
- Cài đặt Mongoose, viết module kết nối database (`config/db.js`)
- Tạo database `ai-copywriter` trên MongoDB local hoặc MongoDB Atlas
- Kiểm tra kết nối thành công
- **Thời gian:** 1 ngày
- **Sản phẩm:** Backend kết nối thành công với MongoDB

### Công việc 1.5 – Thiết kế database schema
- Thiết kế 4 collection: `Users`, `Contents`, `Templates`, `FineTuneJobs`
- Tạo Mongoose model cho mỗi collection
- Định nghĩa validation, index, virtual fields
- **Thời gian:** 2 ngày
- **Sản phẩm:** 4 file model trong `server/src/models/`

### Công việc 1.6 – Cấu hình Docker
- Viết `Dockerfile` cho frontend và backend
- Viết `docker-compose.yml` (gồm app + MongoDB)
- Kiểm tra chạy được toàn bộ hệ thống bằng `docker-compose up`
- **Thời gian:** 1 ngày
- **Sản phẩm:** File `docker-compose.yml`, hệ thống chạy được qua Docker

### Công việc 1.7 – Thiết lập công cụ phát triển
- Cấu hình ESLint, Prettier cho cả frontend và backend
- Cài đặt `nodemon` cho backend hot-reload
- Thiết lập Postman collection cho API testing
- **Thời gian:** 1 ngày
- **Sản phẩm:** Môi trường dev hoàn chỉnh, sẵn sàng phát triển

---

## Giai Đoạn 2: Xác Thực & Quản Lý Người Dùng (Tuần 3–4)

> **Mục tiêu:** Hoàn thành hệ thống đăng ký, đăng nhập, phân quyền để bảo vệ các API phía sau.

### Công việc 2.1 – Xây dựng API đăng ký & đăng nhập
- `POST /api/auth/register` – Đăng ký (hash password bằng bcrypt)
- `POST /api/auth/login` – Đăng nhập (trả về JWT access token + refresh token)
- `POST /api/auth/refresh-token` – Làm mới token
- Xử lý validation (email hợp lệ, password đủ mạnh)
- **Thời gian:** 2 ngày
- **Sản phẩm:** 3 API auth hoạt động, test bằng Postman

### Công việc 2.2 – Xây dựng middleware xác thực JWT
- Viết middleware `auth.js` kiểm tra token trong header `Authorization`
- Xử lý các trường hợp: token hết hạn, token không hợp lệ, không có token
- **Thời gian:** 1 ngày
- **Sản phẩm:** Middleware bảo vệ các route cần xác thực

### Công việc 2.3 – Xây dựng API quản lý người dùng
- `GET /api/auth/me` – Lấy thông tin user hiện tại
- `GET /api/users/profile` – Xem profile
- `PUT /api/users/profile` – Cập nhật profile (tên, avatar)
- `GET /api/users/usage` – Xem thống kê sử dụng (số lần sinh nội dung)
- **Thời gian:** 2 ngày
- **Sản phẩm:** 4 API user hoạt động

### Công việc 2.4 – Tạo giao diện đăng ký / đăng nhập
- Trang `/login` – Form đăng nhập (email + password)
- Trang `/register` – Form đăng ký (tên + email + password)
- Lưu token vào cookie/localStorage, redirect sau khi đăng nhập
- Xử lý hiển thị lỗi validation
- **Thời gian:** 2 ngày
- **Sản phẩm:** 2 trang auth với UI hoàn chỉnh

### Công việc 2.5 – Tạo giao diện profile người dùng
- Trang `/profile` – Hiển thị thông tin user, form cập nhật
- Hiển thị thống kê sử dụng (tổng nội dung đã tạo, giới hạn tháng)
- **Thời gian:** 1 ngày
- **Sản phẩm:** Trang profile

### Công việc 2.6 – Phân quyền người dùng
- Định nghĩa 3 role: `free`, `premium`, `admin`
- Giới hạn số lần sinh nội dung cho user `free` (ví dụ: 10 lần/tháng)
- Viết middleware kiểm tra quyền truy cập
- **Thời gian:** 1 ngày
- **Sản phẩm:** Hệ thống phân quyền hoạt động

---

## Giai Đoạn 3: Tích Hợp AI & Sinh Nội Dung (Tuần 5–7)

> **Mục tiêu:** Tích hợp GPT-4, xây dựng trang sinh nội dung – chức năng cốt lõi của ứng dụng.

### Công việc 3.1 – Tích hợp OpenAI API (GPT-4)
- Cài đặt thư viện `openai`
- Viết service `gptService.js` gọi API ChatCompletion
- Xử lý prompt engineering: xây dựng system prompt + user prompt theo loại nội dung
- Xử lý error (rate limit, token limit, API down)
- **Thời gian:** 2 ngày
- **Sản phẩm:** Service gọi GPT-4 hoạt động, test được qua script

### Công việc 3.2 – Xây dựng AI Service Layer
- Tạo `aiService.js` – lớp trung gian điều phối giữa các model (GPT-4, Llama)
- Thiết kế interface chung: `generateContent(prompt, options)` → trả về kết quả
- Hỗ trợ chuyển đổi model linh hoạt
- **Thời gian:** 1 ngày
- **Sản phẩm:** AI Service Layer hoàn chỉnh

### Công việc 3.3 – Xây dựng API sinh nội dung
- `POST /api/content/generate` – Nhận yêu cầu từ user, gọi AI, trả về nội dung
- Tham số đầu vào: `type`, `prompt`, `tone`, `language`, `model`
- Lưu kết quả vào database (collection `Contents`)
- Cập nhật thống kê sử dụng của user
- **Thời gian:** 2 ngày
- **Sản phẩm:** API sinh nội dung hoạt động end-to-end

### Công việc 3.4 – Tạo giao diện trang sinh nội dung
- Trang `/generate` – Giao diện chính của ứng dụng
- Form nhập: chọn loại nội dung, nhập chủ đề/từ khóa, chọn tone, chọn ngôn ngữ
- Khu vực hiển thị kết quả với khả năng chỉnh sửa trực tiếp
- Nút Copy, Lưu, Tạo lại
- **Thời gian:** 3 ngày
- **Sản phẩm:** Trang sinh nội dung với UI/UX hoàn chỉnh

### Công việc 3.5 – Hỗ trợ nhiều loại nội dung
- Định nghĩa 6 loại: Blog, Quảng cáo, Email marketing, Mô tả sản phẩm, Bài mạng xã hội, SEO meta
- Mỗi loại có prompt template riêng phù hợp
- Giao diện chọn loại nội dung dạng card/grid
- **Thời gian:** 2 ngày
- **Sản phẩm:** 6 loại nội dung với prompt template tương ứng

### Công việc 3.6 – Hỗ trợ chọn tone giọng & ngôn ngữ
- Danh sách tone: Chuyên nghiệp, Thân thiện, Hài hước, Nghiêm túc, Sáng tạo
- Danh sách ngôn ngữ: Tiếng Việt, English, và các ngôn ngữ phổ biến khác
- Tích hợp vào prompt khi gọi AI
- **Thời gian:** 1 ngày
- **Sản phẩm:** Dropdown chọn tone + ngôn ngữ trên giao diện

### Công việc 3.7 – Hiệu ứng streaming (real-time)
- Sử dụng Server-Sent Events (SSE) hoặc streaming response
- Nội dung AI hiện dần từng từ trên giao diện (giống ChatGPT)
- Hiển thị trạng thái loading phù hợp
- **Thời gian:** 2 ngày
- **Sản phẩm:** Trải nghiệm sinh nội dung real-time

### Công việc 3.8 – Tạo trang Dashboard
- Trang `/dashboard` – Trang chủ sau khi đăng nhập
- Hiển thị: thống kê sử dụng, nội dung gần đây, shortcut tạo nội dung mới
- Biểu đồ thống kê đơn giản (số nội dung theo ngày/tuần)
- **Thời gian:** 2 ngày
- **Sản phẩm:** Trang dashboard

---

## Giai Đoạn 4: Quản Lý Nội Dung & Template (Tuần 8–9)

> **Mục tiêu:** Hoàn thiện CRUD nội dung, tìm kiếm/lọc, hệ thống template để tái sử dụng.

### Công việc 4.1 – Xây dựng CRUD API nội dung
- `GET /api/content` – Lấy danh sách nội dung (phân trang, lọc theo type/ngày)
- `GET /api/content/:id` – Xem chi tiết
- `PUT /api/content/:id` – Cập nhật (chỉnh sửa nội dung đã sinh)
- `DELETE /api/content/:id` – Xóa nội dung
- Hỗ trợ đánh dấu yêu thích (`isFavorite`)
- **Thời gian:** 2 ngày
- **Sản phẩm:** 4 API CRUD nội dung

### Công việc 4.2 – Tạo giao diện lịch sử nội dung
- Trang `/history` – Danh sách nội dung đã tạo (dạng bảng/card)
- Chức năng: tìm kiếm theo từ khóa, lọc theo loại/ngày, sắp xếp
- Phân trang
- Xem chi tiết, chỉnh sửa, xóa từng nội dung
- **Thời gian:** 2 ngày
- **Sản phẩm:** Trang lịch sử nội dung

### Công việc 4.3 – Xuất nội dung
- Nút Copy to Clipboard
- Xuất ra file PDF (sử dụng thư viện `jspdf` hoặc `html2pdf`)
- Xuất ra file Word (.docx)
- **Thời gian:** 1 ngày
- **Sản phẩm:** 3 chức năng xuất nội dung

### Công việc 4.4 – Xây dựng CRUD API template
- `GET /api/templates` – Danh sách template (public + của user)
- `POST /api/templates` – Tạo template mới
- `PUT /api/templates/:id` – Cập nhật template
- `DELETE /api/templates/:id` – Xóa template
- **Thời gian:** 2 ngày
- **Sản phẩm:** 4 API CRUD template

### Công việc 4.5 – Tạo thư viện template có sẵn
- Tạo 10–15 template mẫu cho các ngành nghề phổ biến
- Ví dụ: "Mô tả sản phẩm thời trang", "Email chào hàng B2B", "Bài blog công nghệ"
- Seed data vào database
- **Thời gian:** 1 ngày
- **Sản phẩm:** Bộ template mẫu

### Công việc 4.6 – Tạo giao diện quản lý template
- Trang `/templates` – Duyệt thư viện template, tạo template tùy chỉnh
- Chọn template → điền biến → sinh nội dung
- **Thời gian:** 2 ngày
- **Sản phẩm:** Trang quản lý template

---

## Giai Đoạn 5: Tích Hợp Llama & Fine-tuning (Tuần 10–12)

> **Mục tiêu:** Tích hợp mô hình Llama mã nguồn mở, xây dựng hệ thống fine-tuning theo ngành nghề.

### Công việc 5.1 – Tích hợp Llama model
- Cài đặt Ollama hoặc sử dụng Llama API endpoint
- Viết service `llamaService.js` tương tự `gptService.js`
- Tích hợp vào AI Service Layer, cho phép user chọn model
- So sánh kết quả GPT-4 vs Llama
- **Thời gian:** 3 ngày
- **Sản phẩm:** Llama model hoạt động song song với GPT-4

### Công việc 5.2 – Xây dựng API fine-tuning
- `POST /api/fine-tune/upload-dataset` – Upload file dữ liệu huấn luyện (JSON/CSV)
- `POST /api/fine-tune/create` – Tạo job fine-tuning mới
- `GET /api/fine-tune/jobs` – Danh sách jobs
- `GET /api/fine-tune/jobs/:id` – Trạng thái job (pending / training / completed / failed)
- `GET /api/fine-tune/models` – Danh sách model đã fine-tune
- Xử lý file upload bằng `multer`
- **Thời gian:** 4 ngày
- **Sản phẩm:** 5 API fine-tuning

### Công việc 5.3 – Xây dựng fine-tuning service
- Viết `fineTuneService.js` – gọi OpenAI Fine-tuning API hoặc huấn luyện Llama local
- Xử lý format dữ liệu (chuyển đổi dataset sang format yêu cầu)
- Cơ chế queue xử lý fine-tuning job (tránh chạy đồng thời)
- **Thời gian:** 4 ngày
- **Sản phẩm:** Service fine-tuning hoạt động

### Công việc 5.4 – Tạo giao diện quản lý fine-tuning
- Trang `/fine-tune` – Quản lý toàn bộ fine-tuning
- Form upload dataset (kéo thả file)
- Form tạo job mới (chọn base model, ngành nghề, tham số)
- Bảng theo dõi trạng thái các jobs (real-time cập nhật)
- Danh sách model đã fine-tune, nút sử dụng để sinh nội dung
- **Thời gian:** 3 ngày
- **Sản phẩm:** Trang fine-tuning

### Công việc 5.5 – Sử dụng model đã fine-tune
- Cho phép user chọn model đã fine-tune khi sinh nội dung
- Hiển thị danh sách model fine-tuned trong dropdown trên trang `/generate`
- Gắn nhãn ngành nghề cho mỗi model
- **Thời gian:** 1 ngày
- **Sản phẩm:** Tích hợp model fine-tuned vào luồng sinh nội dung

---

## Giai Đoạn 6: Kiểm Thử, Tối Ưu & Triển Khai (Tuần 13–14)

> **Mục tiêu:** Đảm bảo chất lượng, tối ưu hiệu suất, và triển khai ứng dụng.

### Công việc 6.1 – Kiểm thử & sửa lỗi
- Kiểm thử từng API bằng Postman (functional testing)
- Kiểm thử giao diện trên nhiều trình duyệt (Chrome, Firefox, Safari)
- Kiểm thử responsive trên mobile/tablet
- Kiểm thử luồng end-to-end: đăng ký → đăng nhập → sinh nội dung → lưu → xuất
- Sửa tất cả bug phát hiện được
- **Thời gian:** 4 ngày
- **Sản phẩm:** Ứng dụng hoạt động ổn định, không lỗi nghiêm trọng

### Công việc 6.2 – Tối ưu hiệu suất & bảo mật
- Thêm rate limiting (`express-rate-limit`) cho các API nhạy cảm
- Caching response AI bằng Redis hoặc in-memory cache
- Tối ưu query MongoDB (thêm index cho các trường thường tìm kiếm)
- Validate và sanitize toàn bộ input (chống XSS, injection)
- Helmet.js cho HTTP security headers
- **Thời gian:** 2 ngày
- **Sản phẩm:** Hệ thống bảo mật và nhanh hơn

### Công việc 6.3 – Triển khai & viết tài liệu
- Deploy backend lên VPS hoặc dịch vụ cloud (Railway, Render, AWS)
- Deploy frontend lên Vercel
- Deploy MongoDB lên MongoDB Atlas
- Cấu hình domain, HTTPS
- Viết tài liệu hướng dẫn sử dụng cho người dùng
- Cập nhật README với hướng dẫn cài đặt chi tiết
- **Thời gian:** 3 ngày
- **Sản phẩm:** Ứng dụng live trên internet, tài liệu hoàn chỉnh

---

## Tổng Kết Thời Gian

| Giai đoạn | Công việc | Thời gian |
|-----------|-----------|-----------|
| GĐ 1 – Khởi tạo & môi trường | 7 công việc | 9 ngày (Tuần 1–2) |
| GĐ 2 – Xác thực & người dùng | 6 công việc | 9 ngày (Tuần 3–4) |
| GĐ 3 – AI & sinh nội dung | 8 công việc | 15 ngày (Tuần 5–7) |
| GĐ 4 – Nội dung & template | 6 công việc | 10 ngày (Tuần 8–9) |
| GĐ 5 – Llama & fine-tuning | 5 công việc | 15 ngày (Tuần 10–12) |
| GĐ 6 – Kiểm thử & triển khai | 3 công việc | 9 ngày (Tuần 13–14) |
| **Tổng** | **35 công việc** | **~67 ngày (~14 tuần)** |

---

## Ghi Chú

- Dự án do **1 người thực hiện**, nên mỗi giai đoạn cần hoàn thành tuần tự.
- Ưu tiên hoàn thành **Giai đoạn 1–3** trước để có sản phẩm chạy được sớm nhất (MVP).
- Có thể điều chỉnh thời gian linh hoạt tùy tiến độ thực tế.
- Nên commit code thường xuyên và viết commit message rõ ràng.
