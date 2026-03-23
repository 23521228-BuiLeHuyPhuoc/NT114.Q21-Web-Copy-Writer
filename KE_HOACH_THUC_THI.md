# KẾ HOẠCH THỰC THI CHI TIẾT DỰ ÁN AI COPYWRITER

Tài liệu này là bản kế hoạch triển khai trọn vẹn và **cực kỳ chi tiết**, chia nhỏ khối lượng công việc bám sát 10 Module chức năng và Tính năng Nâng cao (Ngôi sao ⭐) được định nghĩa trong `DOCS.md`. Thiết kế này dành cho việc lập trình thực tế nối tiếp nhau từ Frontend tới Database và Backend.

---

## NGUYÊN TẮC TRIỂN KHAI & MỐC KIỂM SOÁT TỔNG
- [ ] Chỉ được chuyển phase khi phase trước đã đạt **100% checklist bắt buộc** và có bằng chứng (PR, ảnh chụp màn hình, log test, demo video ngắn).
- [ ] Mỗi phase phải có **01 bản tổng kết** gồm: việc đã làm, blockers, việc dở dang, rủi ro mới phát sinh.
- [ ] Mỗi ngày cập nhật tiến độ theo format: `Done hôm qua` → `Kế hoạch hôm nay` → `Blockers`.
- [ ] Tất cả tính năng chạm vào dữ liệu thật đều phải có kế hoạch rollback.

### Mốc thời gian tổng (khuyến nghị)
- [ ] **Tuần 1:** Hoàn thành Phase 1 (UI/UX Figma) + chốt toàn bộ user flow.
- [ ] **Tuần 2:** Hoàn thành Phase 2 (DB + hạ tầng nền tảng).
- [ ] **Tuần 3-4:** Hoàn thành Phase 3 (Backend API + AI Core + Admin APIs).
- [ ] **Tuần 5:** Hoàn thành Phase 4 (Frontend tích hợp đầy đủ APIs).
- [ ] **Tuần 6:** Hoàn thành Phase 5-6 (QA tổng thể + Deploy production + hồ sơ bàn giao).

---

## GIAI ĐOẠN 1: THIẾT KẾ UI/UX TRÊN FIGMA
**Mục tiêu:** Định hình bộ khung hiển thị chuẩn mực và Responsive cho 3 luồng người dùng (Public, User, Admin).
**Thời lượng dự kiến:** 5-7 ngày (40-56 giờ).

### 1.0 Đầu ra bắt buộc (Deliverables)
- [ ] Figma có đầy đủ wireframe low-fidelity + mockup high-fidelity.
- [ ] Prototype có thể click qua toàn bộ luồng: Public → Auth → User Dashboard → Admin.
- [ ] Design tokens (color, typography, spacing, radius, shadows) thống nhất và tái sử dụng.
- [ ] Tài liệu handoff cho Frontend: naming component, trạng thái component, hành vi responsive.

### 1.1 Khởi tạo Design System & Foundation
- [ ] Chọn bảng màu thương hiệu (Primary, Secondary, Background, Text Colors, Border). Đặt biến CSS (Variables).
- [ ] Typography (Font hiển thị). Define Heading (H1-H6) & Body Text.
- [ ] Dựng bộ UI Kit cơ sở (Button các trạng thái, Input Forms, Select Dropdowns, Modal Dialog, Toasts, Switcher, Tooltips).

### 1.2 Thiết Kế Trang Công Khai (Public Pages: `/`)
- [ ] **Landing Page:** 
  - [ ] Hero Banner bắt mắt với câu Slogan sức mạnh AI.
  - [ ] Section Tính năng (Feature Cards: Sinh bài viết, Đa model, Đạo văn...).
  - [ ] Section Bảng Giá (Pricing Table: Free / Pro / Enterprise - 3 cột).
  - [ ] Testimonials & Footer chuyên nghiệp.
- [ ] **Trang Liên hệ (`/contact`):** Form điền email và nội dung thắc mắc.

### 1.3 Thiết Kế Luồng Xác Thực (Auth Pages: `/(auth)`)
- [ ] Màn hình **Đăng nhập (`/login`) & Đăng ký (`/register`)**: Nút Đăng nhập qua Google (OAuth) to rõ rệt, Form Email + Password.
- [ ] Các màn hình phụ: Quên mật khẩu (`/forgot-password`), Nhập mã khôi phục/Link Reset (`/reset-password`).

### 1.4 Thiết Kế Dashboard Người Dùng (User Pages: `/(user)`)
- [ ] **Layout Chính:** Sidebar Menu bên trái, Header Bar (Tìm kiếm, Trạng thái Gói cước, Chuông Thông Báo, Avatar Profile).
- [ ] **Trang `/dashboard`:** Hiển thị 3 chỉ số lớn (Nội dung đã tạo, Token đã tiêu hao, Trạng thái Stripe Plan). Biểu đồ sử dụng hàng tháng (Chart.js / Recharts).
- [ ] **Màn hình AI Sinh Nội Dung (`/generate`):**
  - [ ] Cột bên trái: Select Template, Nhập thông số (Tone, Ngôn ngữ, Temperature, Model: GPT-4/Llama). Khung điền Prompt gốc.
  - [ ] Cột bên phải: Nơi text AI cuộn hiển thị real-time (SSE). Cú pháp Markdown Preview. Các nút Copy, Save to Project, Xuất PDF/Word.
- [ ] **Trang Quản lý Nội Dung (`/contents` & `/contents/:id`):** Bảng danh sách bài viết sinh ra (Kèm chức năng tìm kiếm, Gắn Tag yêu thích, Lịch sử Version).
- [ ] **Trang Thư Viện Templates (`/templates`):** Lưới (Grid) chứa các thẻ prompt xài rỗng, Phân cấp theo Categories (Marketing, SEO, Social, Email).
- [ ] **Trang Quản lý Dự Án (`/projects`):** Folder hóa các Content liên quan về chung một chủ đề.
- [ ] **Trang Fine-Tuning (`/fine-tune`):** Nơi người dùng nạp dữ liệu ngành (Kéo thả file CSV/JSON), và Xem tracking biểu đồ trạng thái % train.
- [ ] **⭐ Màn hình Tính năng Ngôi sao (`/plagiarism-check`):**
  - [ ] Khung nhập văn bản lớn hoặc chọn bài viết cũ.
  - [ ] Layout Report: Vòng tròn % tổng trùng lặp đạo văn. Đoạn text gốc có **highlight đỏ/vàng** ở ngay các vị trí chữ trùng khớp. Danh sách web nguồn hoặc đoạn tương đồng trong Database.
- [ ] **Trang Thanh toán (`/billing`):** Nơi xem gói hiện tại, Nút Upgrade Package (Pop-up Stripe), Lịch sử biên lai.

### 1.5 Thiết Kế Luồng Admin (Admin Pages: `/(admin)`)
- [ ] **Admin Layout:** Sidebar màu sắc riêng biệt để phân biệt tránh nhầm với User.
- [ ] **Admin Dashboard (`/admin`):** Tổng quan toàn App (Lượng tài khoản tăng trưởng trong 7 ngày, tổng doanh thu Stripe thực tế).
- [ ] **Bảng Quản lý Data (`/admin/users`, `/admin/contents`, `/admin/templates`, `/admin/categories`, `/admin/plans`, `/admin/payments`, `/admin/models`):** Cung cấp bộ lưới CRUD đẩy đủ.
- [ ] **Nhật ký Audit & System (`/admin/settings`, `/admin/audit-logs`):** Danh sách hành động thay đổi nhạy cảm để tracking bugs.

### 1.6 Checklist chất lượng UI/UX trước khi chốt
- [ ] Contrast màu chữ/nền đạt chuẩn đọc được (ưu tiên WCAG AA cho phần chính).
- [ ] Trạng thái component đầy đủ: default, hover, active, disabled, loading, error.
- [ ] Bố cục responsive cho 3 kích thước: mobile (<768), tablet (768-1023), desktop (>=1024).
- [ ] Empty state, loading skeleton, error state cho các trang dữ liệu.
- [ ] Quy ước icon + spacing + lưới cột nhất quán toàn hệ thống.

### 1.7 Tiêu chí nghiệm thu Phase 1
- [ ] Giảng viên/nhóm xác nhận đầy đủ tất cả màn hình nêu trong plan.
- [ ] Không còn màn hình "chưa quyết định UI".
- [ ] Frontend dev có thể code mà không cần đoán luồng nghiệp vụ.

---

## GIAI ĐOẠN 2: THIẾT KẾ CƠ SỞ DỮ LIỆU & HẠ TẦNG (MONGODB ATLAS)
**Mục tiêu:** Ánh xạ các thực thể của 10 Module thành Mongoose Schemas chuẩn mực. Khởi tạo môi trường bảo mật Cloud.
**Thời lượng dự kiến:** 3-4 ngày (24-32 giờ).

### 2.0 Đầu ra bắt buộc (Deliverables)
- [ ] ERD/Schema map thể hiện quan hệ giữa tất cả collections trọng yếu.
- [ ] Bộ Mongoose models chạy được, có validate field bắt buộc và default values.
- [ ] File `.env.example` đầy đủ biến môi trường cho backend/frontend.
- [ ] Kịch bản seed dữ liệu mẫu (users, plans, templates, categories).

### 2.1 Cài đặt Hạ tầng (Infrastructure)
- [ ] Tạo cluster trên **MongoDB Atlas**, cấp whitelist IP `0.0.0.0/0`.
- [ ] Setup vùng chứa ảnh tĩnh trên **Cloudinary** (để upload Avatars / Files).
- [ ] Setup Cổng SMTP của **Nodemailer** (địa chỉ gửi email tự động).
- [ ] Đăng ký **Stripe Developer Account** lấy Webhook Secret & Publishable Key.
- [ ] Setup Docker & `docker-compose.yml` local phục vụ việc tự động dựng Mongo container cho dev chạy máy cá nhân.

### 2.2 Xây dựng 16 Document Collections (Mongoose Models)
- [ ] **`Users` Collection:** `_id`, `email`, `password` (bcrypt hash), `googleId`, `role` (enum: user/premium/admin), `avatar`, `isVerified`, `timestamps`.
- [ ] **`Contents` Collection:** `userId`, `projectId`, `templateId`, `promptInputs` (JSON Object), `modelUsed`, `outputText` (String lớn), `wordCount`, `tags` (Array), `versions` (Lịch sử sinh lại).
- [ ] **`Templates` Collection:** `name`, `description`, `categoryId`, `systemPrompt` (Chứa biến `{{var}}`), `isSystem` (Boolean), `authorId`.
- [ ] **`Categories` Collection:** `name`, `slug`, `parentId` (Để xử lý danh mục đa cấp phân nhánh).
- [ ] **`Projects` Collection:** `userId`, `name`, `description`, `isArchived`.
- [ ] **`Plans` Collection:** `name` (Free/Pro/Enterprise), `price`, `limits` (Max tokens, models allowed), `stripeProductId`.
- [ ] **`Subscriptions` Collection:** `userId`, `planId`, `stripeSubscriptionId`, `status` (active/canceled), `currentPeriodEnd`.
- [ ] **`Payments` Collection:** Lịch sử build hóa đơn từ Stripe Webhook.
- [ ] **`FineTuneJobs` Collection:** `userId`, `datasetUrl`, `status` (pending, training, completed, failed), `baseModel`, `fineTunedModelId`.
- [ ] **`Notifications` Collection:** `userId`, `title`, `message`, `type` (system, billing, ai), `isRead`.
- [ ] **`UsageLogs` Collection:** Tracking token tiêu thụ (`userId`, `tokenCount`, `model`, `date`).
- [ ] **`SystemSettings` Collection:** Config admin dạng `{ key: String, value: Mixed }`.
- [ ] **`AuditLogs` Collection:** Trace API calls của Admin/System.
- [ ] **⭐ `PlagiarismReports` Collection:** `userId`, `contentId`, `checkText` (đoạn text check), `similarityScore` (giá trị %), `matches` (Mảng chứa các đoạn matched, index bắt đầu, index kết thúc, nguồn tham chiếu).

### 2.3 Chuẩn hóa dữ liệu & hiệu năng truy vấn
- [ ] Định nghĩa index quan trọng: `Users.email` unique, `Templates.categoryId`, `Contents.userId + createdAt`.
- [ ] Chuẩn hóa timezone (UTC) cho toàn bộ timestamps.
- [ ] Quy chuẩn soft-delete cho collection cần lưu lịch sử (nếu có).
- [ ] Giới hạn kích thước fields lớn (ví dụ `outputText`) và chiến lược phân trang.
- [ ] Kiểm tra migration/seed chạy được nhiều lần không tạo dữ liệu rác trùng lặp.

### 2.4 Tiêu chí nghiệm thu Phase 2
- [ ] Kết nối Atlas ổn định, không còn lỗi auth/network.
- [ ] Toàn bộ model tạo/xóa/sửa thử nghiệm thành công.
- [ ] Dữ liệu seed đủ để frontend/backend test luồng chính.

---

## GIAI ĐOẠN 3: PHÁT TRIỂN BACKEND API VÀ CORE LOGIC (NODE.JS, EXPRESS)
**Mục tiêu:** Lập trình kiến trúc hướng Module (10 Module), bảo mật nghiêm ngặt và xử lý luồng AI bất đồng bộ.
**Thời lượng dự kiến:** 10-14 ngày (80-112 giờ).

### 3.0 Đầu ra bắt buộc (Deliverables)
- [ ] API chạy ổn định theo chuẩn REST + error format thống nhất.
- [ ] Swagger/Postman collection đầy đủ endpoint chính.
- [ ] Auth + phân quyền role hoạt động chính xác trên toàn route cần bảo vệ.
- [ ] Logging + monitoring mức cơ bản cho lỗi runtime quan trọng.

### 3.1 Khởi tạo Project & Pipeline Kiến Trúc Cơ Sở
- [ ] Khởi tạo `app.js` gắn 5 Middleware lá chắn (Helmet, CORS, Morgan, Express.json, URL-encoded).
- [ ] Cấu hình cơ chế Bắt Lỗi (Error Handler) toàn cục để không lộ stack trace lỗi server-side ra ngoài.
- [ ] Xây thư mục Validation bằng `Joi`. Toàn bộ request vào API phải đúng Schema mới cho pass.
- [ ] Xây thư mục Middlewares nghiệp vụ:
  - `auth` (Kiểm tra xem req.headers.authorization có khớp JWT Token k).
  - `role` (Ràng buộc Admin/Premium).
  - `rateLimiter` (100 req/15p cơ bản, 10 req/15p cho API dính tới AI tránh bị DDOS hao tiền).
  - `upload` (Multer kết hợp `multer-storage-cloudinary`).

### 3.2 Lập trình 10 API Modules Vận Hành Chức năng `(backend/src/controllers & routes)`
- [ ] **Module 1 (Xác Thực - Auth):**
  - POST `/api/auth/register`, POST `/api/auth/login`. Set Cookies Refresh Token + Trả AccessJWT qua body.
  - Setup chiến lược (Strategy) `passport-google-oauth20` gán route chuyển hướng (Callback).
  - POST `/api/auth/forgot-password` (Sinh mã Token tạm -> Lưu vào DB -> Gọi Nodemailer gửi URL về Email user).
- [ ] **Module 2 (Sinh Nội Dung - Content AI):**
  - Lập trình **Streaming Response (SSE)** với `res.writeHead(200, { 'Content-Type': 'text/event-stream' })`.
  - Service gọi OpenAI SDK `createChatCompletion({ stream: true })` và lắng nghe event `data`, sau đó `res.write("data: " + chunk)` đẩy liên tiếp về Client. Chừa tuỳ chọn gọi Llama (Local API qua HTTP).
  - Kết thúc luồng gọi hàm lưu DB vào `Contents` và `UsageLogs`.
- [ ] **Module 3 (Fine-tuning AI):**
  - Upload logic file `.csv` chứa cặp `{prompt, completion}`.
  - Khớp file format theo chuẩn OpenAI JSONL -> Gọi API Openai `/fine_tunes` (Hoặc Llama LoRA param tuning) -> Lưu bản ghi `FineTuneJob` (Status: pending).
- [ ] **Module 4 & 5 (Template & Project):**
  - Viết Full RESTful CRUD Controller (GET, GET BY ID, POST, PUT, DELETE, PATCH ARCHIVE).
- [ ] **Module 6 (Thanh toán Billing):**
  - Tích hợp hàm `stripe.checkout.sessions.create` bắn Link trả tiền.
  - Cấu hình Route đặc biệt (Không parse JSON) `/api/billing/webhook` để bắt Stripe Webhook Event `checkout.session.completed` -> Cập nhật Role User thành Premium.
- [ ] **Module 7 (Thông Báo - Notifications):**
  - GET / POST / PATCH `isRead: true` theo cấu trúc danh sách kẹp Phân trang (Pagination).
- [ ] **Module 8 (Trang Mở Public):**
  - GET Public APIs cho Landing page lấy tổng quan thống kê nếu cần (hoặc form contact).

### 3.2.1 Checklist chi tiết bắt buộc cho từng module API
- [ ] Có validator đầu vào cho POST/PUT/PATCH (không nhận payload rác).
- [ ] Có middleware xác thực/phân quyền đúng vai trò.
- [ ] Có xử lý lỗi theo mã phù hợp: `400/401/403/404/409/429/500`.
- [ ] Có log tối thiểu cho lỗi nghiệp vụ và lỗi hệ thống.
- [ ] Có kiểm tra phân trang + lọc + sắp xếp cho API danh sách.
- [ ] Có quy tắc đặt tên route/controller/service thống nhất.

### 3.3 ⭐ Lập trình Module Ngôi sao - AI Plagiarism (Kiểm Tra Đạo Văn)
- [ ] **Thuật Toán Vectorizing:**
  - Viết service nhận vào chuỗi String văn bản lớn -> Dùng hàm `split()` băm nhỏ đoạn văn thành câu (Sentences) hoặc Chunk (Window size).
  - Nạp các đoạn đó vào OpenAI embedding API `text-embedding-3-small` để biến text thành ma trận Vector số thực.
- [ ] **Thuật Toán Cosine Similarity:**
  - Lập trình hàm Toán học nhân vô hướng 2 Vector chia cho tích độ dài Vector để chấm điểm giống nhau (0 đến 1).
  - Quét (Scan) Vector văn bản mới trúng với các Vector văn bản đã có nằm trong Database. Nếu kết quả `>0.85 (85%)` -> Phất cờ "Nghi vấn đạo văn trùng lặp".
- [ ] **Xây API Output `POST /api/plagiarism/check`:**
  - Nhận text -> Test -> Đóng gói mảng Data trả về Client cấu trúc: Mảng chứa index bù trừ `[{ start: 10, end: 50, matchScore: 92% }]`. Lưu vào DB `PlagiarismReports`.

### 3.4 Module Quản Trị Hệ Thống (Admin APIs)
- [ ] Viết Queries Mongoose siêu tốc dùng `.aggregate()` để tính tổng Doanh Thu nhóm theo Date, hay tổng User Signup đếm theo Tháng cho cái Dashboard Chart.
- [ ] Viết CRUD cho System Templates, Model Cấu Hình, quản lý Khóa/Mở Khóa Account.

### 3.5 Luồng kiểm thử API trong quá trình phát triển
- [ ] Viết test case thủ công trên Postman cho từng endpoint mới trước khi merge.
- [ ] Test token hết hạn và token giả trên toàn bộ route yêu cầu auth.
- [ ] Test id không tồn tại/format sai để tránh crash server.
- [ ] Test webhook Stripe bằng payload giả lập + kiểm tra chữ ký (signature verify).
- [ ] Test SSE stream ngắt giữa chừng (client disconnect) để không rò rỉ tài nguyên.

### 3.6 Tiêu chí nghiệm thu Phase 3
- [ ] Hoàn thiện đầy đủ endpoint cốt lõi cho Auth/Content/Template/Project/Billing/Plagiarism/Admin.
- [ ] Luồng generate content + lưu DB + usage logs chạy xuyên suốt.
- [ ] Không còn lỗi chặn tiến độ frontend integration.

---

## GIAI ĐOẠN 4: PHÁT TRIỂN FRONTEND TÍCH HỢP (NEXT.JS)
**Mục tiêu:** Cài đặt giao diện Responsive theo Figma, gắn kết các API logic để thành ứng dụng nguyên khối linh hoạt.
**Thời lượng dự kiến:** 7-10 ngày (56-80 giờ).

### 4.0 Đầu ra bắt buộc (Deliverables)
- [ ] Toàn bộ route chính có giao diện hoàn chỉnh, không còn trang trắng/placeholder.
- [ ] Tích hợp API theo đúng luồng nghiệp vụ và hiển thị trạng thái loading/error rõ ràng.
- [ ] Route guard hoạt động đúng cho user/admin/guest.
- [ ] Trải nghiệm sinh nội dung streaming mượt, không giật lag ở mức sử dụng thông thường.

### 4.1 Khởi tạo Next.js Foundation State
- [ ] Hoàn tất Config Tailwind trong `tailwind.config.ts`.
- [ ] Config thư viện gọi HTTP (như Axios) tại `src/lib/api.ts` -> Bắt Interceptor Auth dính kèm chuỗi JWT vào request.
- [ ] Cấu hình `Zustand` Stores nạp phiên người dùng (Session data của User).
- [ ] Code vỏ bao (Root Layout `layout.tsx`) có Provide trạng thái xác thực và Toasts báo hiệu.

### 4.2 Thiết lập Routing App Router Bóc Tách
- [ ] Build khung (Layout) riêng biệt: 
  - `app/(auth)/layout.tsx` (Có background form mượt).
  - `app/(user)/layout.tsx` (Có bọc bảo vệ Hook HOC chặn nếu không có Token `useAuth Guard`, có Menu ngang/dọc).
  - `app/(admin)/layout.tsx` (Chặn Guard bắt buộc `role === 'admin'`).

### 4.3 Phát triển Khối Chức Năng Cốt Lõi Frontend
- [ ] **Cánh Cửa Xác Thực (Auth Screen):** Trói biến Form qua Thư viện quản lý Validate (`react-hook-form` + `yup/zod`), ấn POST đẩy Backend lưu Token Cookie + LocalStorage.
- [ ] **Màn Sinh Chữ AI Trực Tuyến (`/generate` Screen):**
  - [ ] Gọi API Load danh sách Templates gán vô thẻ `<select>`.
  - [ ] Gắn thư viện `fetch` hoặc `EventSource` nguyên thủy để đón gói tin (Chunk Packets) từ **SSE Streaming** API. Cứ mỗi lần Server trả ký tự, nối thêm vòng lặp vào biến State UI (Tạo hiệu ứng gõ lốc cốc).
  - [ ] Render nội dung đầu ra bằng Thư viện `react-markdown` để nó biến kí tự `**đậm**`, `## Heading`, code syntax thành thẻ HTML chuẩn xác.
- [ ] **Dashboard Người Dùng & Quản Lý:** Gọi API Get đắp Data hiển thị Bảng `<table>` hoặc Biểu đồ D3/Chart.js `<Canvas>`. Có chức năng Paginations phân trang 10 bài/trang.
- [ ] **Màn hình Checkout Billing:** Chèn Loading Spinner lúc gọi gọi Webhook kết nối Server Stripe. Sang cổng thanh toán Stripe. Trả về màn Success.

### 4.4 ⭐ Tích hợp UI Module Ngôi sao - Plagiarism Detection
- [ ] Dựng màn hình `/plagiarism-check`. Gắn Form nhập Text. 
- [ ] Khi API trả về mảng Report (`matches`), lập trình hàm bóc tách văn bản:
  - Cắt lấy chuỗi String ở vị trí Index báo trùng -> Bọc (Wrap) nó vào thẻ `<mark class="bg-red-300">` hoặc tooltip báo mức %. Cực kỳ mượt để user nhận ra chỗ nào đi copy ở trên văn bản.

### 4.5 Checklist hoàn thiện trải nghiệm người dùng
- [ ] Mọi form đều có validate realtime + thông báo lỗi dễ hiểu.
- [ ] Có confirm dialog cho hành động nguy hiểm (xóa, hủy, downgrade).
- [ ] Có toast thông báo thành công/thất bại nhất quán.
- [ ] Không còn warning lớn trong console ở các trang chính.
- [ ] Kiểm tra kỹ routing back/forward và giữ trạng thái hợp lý.

### 4.6 Tiêu chí nghiệm thu Phase 4
- [ ] Demo trọn luồng user: đăng nhập → generate → lưu nội dung → kiểm tra đạo văn → thanh toán.
- [ ] Demo trọn luồng admin: đăng nhập admin → quản trị dữ liệu → xem dashboard.
- [ ] UI responsive đạt yêu cầu trên mobile/tablet/desktop.

---

## GIAI ĐOẠN 5: KIỂM THỬ XUYÊN SUỐT (TESTING & QA)
**Mục tiêu:** Săn Bug trước ngày đem đi nghiệm thu Đồ Án.
**Thời lượng dự kiến:** 3-5 ngày (24-40 giờ).

- [ ] **Test Luồng Đăng nhập (Auth Flow):** Dùng JWT hết hạn xem Web có phát hiện lỗi 401 tự đá văng ra /login hay tự refresh thành công.
- [ ] **Test Giới hạn (Rate Limit Security):** Mở hai Tab ấn Spam nút Sinh AI điên cuồng 20 lần xem Server có block 429 Too Many Requests không.
- [ ] **Test Ngôi Sao (Plagiarism Accuracy):** Chuẩn bị 1 bài văn A. Copy hệt bài đó đổi đúng 2 chữ để làm bài B. Test nút kiểm tra xem tỉ lệ xuất đúng >95% và chĩa đúng vùng chữ không.
- [ ] **Kiểm tra UI/UX:** Test Grid Bootstrap/Tailwind trên chế độ giả lập Mobile/Tablet để đảm bảo các Sidebar không phá vỡ Layout nội dung AI.
- [ ] Fix triệt để Console Errors báo vàng/đỏ của Thư viện React.

### 5.1 Test matrix chi tiết (bắt buộc)
- [ ] **Functional Test:** theo từng module (Auth, Content, Project, Template, Billing, Admin, Plagiarism).
- [ ] **Integration Test:** frontend gọi backend thực tế với dữ liệu seed.
- [ ] **Regression Test:** sau mỗi bugfix quan trọng phải rerun luồng chính.
- [ ] **Performance Test cơ bản:** kiểm tra thời gian phản hồi endpoint trọng điểm khi tải tăng.
- [ ] **Security Test cơ bản:** thử input độc hại, thử truy cập route không quyền, kiểm tra rò rỉ thông tin lỗi.

### 5.2 Tiêu chí đóng bug trước khi sang deploy
- [ ] Tất cả bug mức Critical/High phải về 0.
- [ ] Bug mức Medium phải có workaround rõ ràng hoặc fix xong trước demo.
- [ ] Luồng demo chấm đồ án chạy thông suốt không cần thao tác thủ công ngoài plan.

---

## GIAI ĐOẠN 6: ĐÓNG GÓI CHUẨN ĐỒ ÁN VÀ DEPLOY PRODUCTION
**Mục tiêu:** Dựng Môi trường Online Live demo để giảng viên có thể theo đường Link chấm điểm trực tiếp.
**Thời lượng dự kiến:** 2-3 ngày (16-24 giờ).

### 6.1 Môi Trường Git & Docker Nội Bộ
- [ ] Gắn file `.gitignore`, khóa `.env` tuyệt đối không up lên Github.
- [ ] Kiểm tra Script `docker-compose up` tự build Image Server thành công kết nối MongoDB chạy ở `localhost:27017` hoàn hảo.

### 6.2 Chuẩn Bị Hosting Đưa Lên Mạng
- [ ] **Database Remote (Mongo Atlas):** Backup data mồi, Config Network IPs cho cả Internet có thể trỏ tới Server.
- [ ] **Triển Khai Backend Node.js:** Sử dụng dịch vụ như Render.com, Railway.app hoặc Máy Ảo DigitalOcean (Setup PM2 chạy ngầm `app.js`). Trỏ domain Back-end (Vd: `api.aicopywriter.com`). Cài cắm Environmental Variables.
- [ ] **Triển Khai Frontend Next.js:** Connect repo vào **Vercel** trực tiếp. Inject Environment URLs (link API). Chờ Vercel Build gán vào Domain chính mang đi nộp đồ án.
- [ ] **Smoke Test Cuối Cùng:** Sử dụng tài khoản Guest nãy chạy thử End-to-End Test sinh 1 bài viết -> Thấy mượt là hoàn thành Đồ Án Xuất Sắc.

### 6.3 Checklist go-live cực chi tiết
- [ ] Verify tất cả biến môi trường production đã set đúng tên và đúng giá trị.
- [ ] Bật HTTPS và kiểm tra mixed content (không còn gọi HTTP không an toàn).
- [ ] Thiết lập domain + DNS + kiểm tra TTL propagation.
- [ ] Bật cơ chế backup định kỳ cho database trước ngày demo.
- [ ] Cấu hình giám sát lỗi runtime (log backend + frontend).
- [ ] Chuẩn bị ít nhất 02 tài khoản demo (user thường, admin) hoạt động sẵn.
- [ ] Chuẩn bị kịch bản fallback nếu production lỗi (deploy lại bản stable gần nhất).

### 6.4 Bộ hồ sơ bàn giao trước nghiệm thu
- [ ] Link source code + hướng dẫn chạy local.
- [ ] Link production + tài khoản demo.
- [ ] Danh sách tính năng đã hoàn thành bám theo 10 modules + các sao ⭐.
- [ ] Nhật ký thay đổi (changelog ngắn) và giới hạn còn tồn tại (nếu có).
- [ ] Slide/ghi chú demo theo thứ tự thao tác 5-10 phút.

---

## GIAI ĐOẠN 7: QUẢN TRỊ RỦI RO, KPI VÀ CƠ CHẾ PHỤC HỒI
**Mục tiêu:** Chủ động xử lý sự cố kỹ thuật và giữ dự án đúng tiến độ.
**Thời lượng áp dụng:** xuyên suốt toàn bộ dự án.

### 7.1 Danh sách rủi ro chính + phương án đối phó
- [ ] **Rủi ro API AI timeout/rate limit:** dùng retry có giới hạn + queue ưu tiên + fallback model.
- [ ] **Rủi ro DB chậm khi dữ liệu tăng:** bổ sung index + tối ưu query + phân trang bắt buộc.
- [ ] **Rủi ro webhook billing miss event:** lưu idempotency key + cơ chế replay events.
- [ ] **Rủi ro deploy lỗi sát ngày demo:** freeze code trước demo tối thiểu 24h + chỉ nhận hotfix critical.
- [ ] **Rủi ro thành viên quá tải:** tách việc theo ưu tiên MoSCoW (Must/Should/Could/Won't).

### 7.2 KPI theo dõi chất lượng triển khai
- [ ] Tỷ lệ hoàn thành checklist theo phase đạt >= 90% trước mốc deadline.
- [ ] API lỗi 5xx trong môi trường demo < 1%.
- [ ] Độ trễ phản hồi luồng generate ở mức chấp nhận được cho demo.
- [ ] Tỷ lệ pass smoke test cuối mỗi lần deploy = 100%.
- [ ] Số bug critical tồn đọng trước ngày nghiệm thu = 0.

### 7.3 Quy trình xử lý sự cố nhanh (Incident Runbook)
- [ ] Bước 1: Xác định phạm vi ảnh hưởng (module, user role, thời điểm).
- [ ] Bước 2: Khóa thay đổi mới, giữ trạng thái ổn định hệ thống.
- [ ] Bước 3: Thu thập log và tái hiện lỗi trong môi trường staging.
- [ ] Bước 4: Hotfix tối thiểu, test lại luồng chính, deploy lại.
- [ ] Bước 5: Tổng kết nguyên nhân gốc (RCA) và thêm test/phòng vệ để tránh tái diễn.
