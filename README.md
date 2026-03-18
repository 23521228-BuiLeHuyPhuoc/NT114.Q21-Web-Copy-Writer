# AI Copywriter – Website Hỗ Trợ Viết Nội Dung Bằng AI

## Thông Tin Đồ Án

- **Đề tài:** Website hỗ trợ viết nội dung bằng AI (AI Copywriter)
- **Môn học:** NT114.Q21
- **Thực hiện:** Bùi Lê Huy Phước
- **Mô tả:** Xây dựng website tích hợp GPT-4 / Llama để sinh nội dung tự động (blog, quảng cáo, email marketing, mô tả sản phẩm, …). Hệ thống cung cấp API RESTful cho AI model xử lý nội dung trên backend, đồng thời hỗ trợ fine-tuning (tinh chỉnh model) để phù hợp với ngành nghề cụ thể.

---

## 1. Phân Chia Chức Năng Theo Module

> Mỗi module được chia rõ phần **Backend**, **Frontend** và **Database** để dễ phân công và báo cáo tiến độ.

---

### Module 1: Xác Thực & Quản Lý Tài Khoản (Authentication)

**Mô tả:** Đăng ký, đăng nhập (email/password + Google OAuth), quên/đặt lại mật khẩu, xác minh email, quản lý hồ sơ cá nhân.

#### Backend

| API Endpoint | Phương thức | Mô tả |
|-------------|------------|-------|
| `/api/auth/register` | POST | Nhận `name, email, password` → validate bằng **Joi** (email regex, password ≥ 8 ký tự có chữ hoa + số + ký tự đặc biệt) → kiểm tra email trùng → hash password bằng **bcrypt** (salt round 10) → lưu user vào MongoDB → gửi email xác minh qua **Nodemailer** |
| `/api/auth/login` | POST | Nhận `email, password` → validate Joi → tìm user → **bcrypt.compare()** → tạo JWT access token (15 phút) + refresh token (7 ngày) → cập nhật `lastLoginAt` → ghi AuditLog |
| `/api/auth/refresh-token` | POST | Nhận refresh token → verify JWT → tạo access token mới |
| `/api/auth/google` | GET | **Passport** Google OAuth 2.0 → callback → tìm/tạo user theo googleId → tạo JWT → redirect về client |
| `/api/auth/verify-email` | GET | Nhận token từ URL → verify → cập nhật `emailVerified = true` |
| `/api/auth/forgot-password` | POST | Nhận email → validate Joi (email regex) → tìm user → tạo reset token (JWT 1 giờ) → gửi email chứa link reset |
| `/api/auth/reset-password` | POST | Nhận token + password mới → verify token → validate → hash bằng **bcrypt** → cập nhật |
| `/api/users/profile` | GET | Trả thông tin user đang đăng nhập |
| `/api/users/profile` | PUT | Validate Joi → cập nhật tên, avatar (upload ảnh → **Multer** → **Cloudinary** → lưu URL) |
| `/api/users/change-password` | PUT | Nhận password cũ + mới → **bcrypt.compare** → validate Joi (regex) → **bcrypt.hash** → cập nhật |
| `/api/users/usage` | GET | Trả tổng token đã dùng, số nội dung, giới hạn gói |

**Middleware liên quan:** `auth.js` (kiểm tra JWT), `role.js` (phân quyền), `validate.js` (Joi schema), `upload.js` (Multer cho avatar)

#### Frontend

| Trang | Chức năng |
|-------|----------|
| `/login` | Form email + password → validate React Hook Form → gọi API login → lưu JWT → redirect dashboard. Nút đăng nhập Google OAuth. Link quên mật khẩu |
| `/register` | Form tên + email + password + xác nhận → validate (email regex, password ≥ 8 ký tự) → gọi API register → thông báo xác minh email |
| `/forgot-password` | Form nhập email → gọi API → thông báo đã gửi email |
| `/reset-password` | Form password mới + xác nhận → gọi API với token từ URL |
| `/profile` | Xem/cập nhật thông tin: tên, email, avatar (upload ảnh). Đổi mật khẩu. Thống kê sử dụng. Quản lý API key. Cài đặt thông báo |

#### Database (Collections liên quan)

- **Users** – lưu thông tin tài khoản, mật khẩu hash, avatar, role, googleId, trạng thái
- **AuditLogs** – ghi log đăng nhập, thay đổi tài khoản

---

### Module 2: Sinh Nội Dung AI (AI Content Generation) ⭐ _Chức năng chính_

**Mô tả:** Tích hợp GPT-4 (OpenAI API) và Llama (Ollama local) để sinh nội dung tự động. Hỗ trợ nhiều loại nội dung: blog, quảng cáo, email, mô tả sản phẩm, social media, SEO, script, headline. Streaming real-time qua SSE.

#### Backend

| API Endpoint | Phương thức | Mô tả |
|-------------|------------|-------|
| `/api/content/generate` | POST | Nhận `type, prompt, tone, language, model, length, temperature` → validate **Joi** (type enum, prompt required, temperature 0-2) → kiểm tra giới hạn token user → **aiService** chọn model (GPT-4 / Llama / fine-tuned) → xây dựng system prompt theo type + tone + language → gọi API (**OpenAI SDK** hoặc **Ollama**) → **streaming response (SSE)** → lưu content vào MongoDB → cập nhật UsageLog |
| `/api/content` | GET | Danh sách nội dung (phân trang, lọc bằng **regex** tìm kiếm, lọc type/projectId/isFavorite) |
| `/api/content/:id` | GET | Chi tiết nội dung |
| `/api/content/:id` | PUT | Cập nhật (lưu version cũ vào mảng versions) |
| `/api/content/:id` | DELETE | Xóa nội dung |
| `/api/content/:id/favorite` | PATCH | Toggle yêu thích |
| `/api/content/:id/tags` | PATCH | Cập nhật mảng tags |
| `/api/content/:id/export` | GET | Xuất file PDF/Word (`?format=pdf` hoặc `docx`) |

**Services chính:**
- `aiService.js` – Điều phối chọn model AI, xây dựng prompt, gọi API
- `gptService.js` – Gọi **OpenAI SDK** (ChatCompletion), streaming response
- `llamaService.js` – Gọi **Ollama** API cho Llama model local
- `promptService.js` – Quản lý system prompt theo loại nội dung + tone + ngôn ngữ

**Kỹ thuật AI:**
- **Prompt Engineering:** Mỗi loại nội dung (blog, quảng cáo, email, …) có system prompt riêng, kết hợp tone giọng + ngôn ngữ + template variables
- **LangChain.js:** Orchestrate model, prompt chaining, output parsing
- **Streaming (SSE):** Server-Sent Events để stream nội dung từ AI về client theo thời gian thực

#### Frontend

| Trang | Chức năng |
|-------|----------|
| `/generate` | **Trang chính.** Form chọn loại nội dung → nhập chủ đề/từ khóa → chọn tone giọng → chọn ngôn ngữ → chọn model AI (GPT-4/Llama/fine-tuned) → tùy chỉnh độ dài + temperature → nhấn "Sinh nội dung". Khu vực kết quả: streaming real-time (SSE), chỉnh sửa trực tiếp, nút Copy/Lưu/Tạo lại |
| `/contents` | Bảng danh sách nội dung (phân trang). Tìm kiếm (regex). Bộ lọc: loại, ngày, dự án, yêu thích. Xem/sửa/xóa/yêu thích/gắn tag. Xuất (Copy/PDF/Word) |
| `/contents/:id` | Hiển thị đầy đủ nội dung. Chỉnh sửa trực tiếp (editor). Lịch sử phiên bản (version history). Thông tin meta: model, tone, ngôn ngữ, token. Xuất file |

#### Database (Collections liên quan)

- **Contents** – nội dung sinh ra, prompt, model, tone, ngôn ngữ, tags, versions, token đã dùng
- **UsageLogs** – ghi log mỗi lần generate: model, token, IP, user agent

---

### Module 3: Fine-tuning Model AI (Tinh Chỉnh Model)

**Mô tả:** Cho phép người dùng upload dataset huấn luyện, tạo job fine-tuning trên GPT-4 (OpenAI Fine-tuning API) hoặc Llama local, theo dõi tiến trình, và sử dụng model đã fine-tune để sinh nội dung chuyên biệt theo ngành nghề (bất động sản, thời trang, công nghệ, …).

#### Backend

| API Endpoint | Phương thức | Mô tả |
|-------------|------------|-------|
| `/api/fine-tune/upload` | POST | **Multer** nhận file CSV/JSON → validate format + kích thước → lưu tạm `uploads/` → đẩy lên **Cloudinary** → trả URL |
| `/api/fine-tune/jobs` | POST | Nhận `baseModel, industry, config` → validate Joi → gọi OpenAI Fine-tuning API hoặc Llama fine-tune script → lưu FineTuneJob (status: pending) → chạy training (background job) |
| `/api/fine-tune/jobs` | GET | Danh sách jobs (lọc theo status) |
| `/api/fine-tune/jobs/:id` | GET | Chi tiết job + trạng thái |
| `/api/fine-tune/models` | GET | Danh sách model đã fine-tune thành công, dùng để chọn khi sinh nội dung |

**Services chính:**
- `fineTuneService.js` – Quản lý quá trình fine-tuning (OpenAI API hoặc Llama local script)
- Chạy training dưới dạng background job, cập nhật status: `pending` → `training` → `completed` / `failed`

#### Frontend

| Trang | Chức năng |
|-------|----------|
| `/fine-tune` | Upload dataset (kéo thả file JSON/CSV). Tạo job fine-tuning: chọn base model, ngành nghề, tham số (epochs, learning rate). Bảng theo dõi jobs (pending/training/completed/failed). Danh sách model đã fine-tune → chọn sử dụng khi sinh nội dung |

#### Database (Collections liên quan)

- **FineTuneJobs** – thông tin job: modelName, baseModel, industry, status, datasetUrl, config, result
- **UsageLogs** – ghi log fine-tuning

---

### Module 4: Quản Lý Template & Danh Mục

**Mô tả:** Hệ thống template với prompt có biến `{{variable}}` cho phép tái sử dụng. Admin tạo template hệ thống, user tạo template cá nhân. Danh mục phân cấp để tổ chức template.

#### Backend

| API Endpoint | Phương thức | Mô tả |
|-------------|------------|-------|
| `/api/templates` | POST | Tạo template (validate Joi: name required, variables array) |
| `/api/templates` | GET | Danh sách (lọc category/type, tìm kiếm bằng regex) |
| `/api/templates/:id` | PUT | Cập nhật template |
| `/api/templates/:id` | DELETE | Xóa template |
| `/api/templates/:id/render` | POST | Nhận giá trị biến → thay thế `{{variable}}` bằng **regex** replace → trả prompt hoàn chỉnh |
| `/api/admin/categories` | CRUD | CRUD danh mục (validate Joi: name + slug unique, slug regex). Hỗ trợ phân cấp (parentId) |

#### Frontend

| Trang | Chức năng |
|-------|----------|
| `/templates` | Duyệt template hệ thống + cá nhân. Lọc theo danh mục / loại nội dung. Tạo template tùy chỉnh: nhập tên, mô tả, prompt template với `{{variable}}`, khai báo biến. Chọn template → điền biến → sinh nội dung |
| `/admin/templates` | (Admin) CRUD template hệ thống. Phân loại category. Duyệt/ẩn template public |
| `/admin/categories` | (Admin) CRUD danh mục. Phân cấp parent → child. Gán icon |

#### Database (Collections liên quan)

- **Templates** – name, promptTemplate, variables, isSystem, isPublic, categoryId, usageCount
- **Categories** – name, slug, parentId, icon, isActive

---

### Module 5: Quản Lý Dự Án (Projects)

**Mô tả:** Tổ chức nội dung theo dự án. Mỗi user có thể tạo nhiều dự án, gán nội dung vào dự án.

#### Backend

| API Endpoint | Phương thức | Mô tả |
|-------------|------------|-------|
| `/api/projects` | POST | Tạo dự án (validate Joi: name required) |
| `/api/projects` | GET | Danh sách dự án của user |
| `/api/projects/:id` | GET | Chi tiết dự án + danh sách nội dung |
| `/api/projects/:id` | PUT | Cập nhật tên/mô tả |
| `/api/projects/:id` | DELETE | Xóa (cascade xóa liên kết content) |
| `/api/projects/:id/contents` | PATCH | Gán/gỡ content, cập nhật contentCount |

#### Frontend

| Trang | Chức năng |
|-------|----------|
| `/projects` | Danh sách dự án (card/grid). Tạo mới. Hiển thị: số nội dung, ngày tạo |
| `/projects/:id` | Chi tiết dự án + nội dung bên trong. Sửa tên/mô tả. Gán/gỡ nội dung. Lưu trữ (archive) |

#### Database (Collections liên quan)

- **Projects** – userId, name, description, contentCount, isArchived

---

### Module 6: Thanh Toán & Gói Dịch Vụ (Billing & Subscription)

**Mô tả:** Tích hợp Stripe cho thanh toán quốc tế. 3 gói: Free / Pro / Enterprise với giới hạn token và tính năng khác nhau.

#### Backend

| API Endpoint | Phương thức | Mô tả |
|-------------|------------|-------|
| `/api/billing/checkout` | POST | Nhận planId → **Stripe** checkout session → trả redirect URL |
| `/api/billing/webhook` | POST | Nhận event từ Stripe → cập nhật Subscription + Payment |
| `/api/billing/payments` | GET | Lịch sử thanh toán của user |
| `/api/billing/subscription` | GET | Xem gói hiện tại |
| `/api/billing/cancel` | POST | Hủy subscription |

#### Frontend

| Trang | Chức năng |
|-------|----------|
| `/billing` | Hiển thị gói hiện tại + giới hạn. So sánh 3 gói. Nút nâng cấp → Stripe checkout. Lịch sử thanh toán. Quản lý subscription (gia hạn/hủy) |

#### Database (Collections liên quan)

- **Plans** – name, price, tokenLimit, features, allowedModels, maxProjects
- **Subscriptions** – userId, planId, status, stripeSubscriptionId, autoRenew
- **Payments** – userId, amount, stripePaymentIntentId, status, invoiceUrl

---

### Module 7: Thông Báo (Notifications)

**Mô tả:** Hệ thống thông báo cho người dùng: thông báo hệ thống, thanh toán, fine-tuning, tài khoản.

#### Backend

| API Endpoint | Phương thức | Mô tả |
|-------------|------------|-------|
| `/api/notifications` | GET | Danh sách thông báo (phân trang, lọc type/isRead) |
| `/api/notifications/:id/read` | PATCH | Đánh dấu đã đọc |
| `/api/notifications/read-all` | PATCH | Đánh dấu tất cả đã đọc |

#### Frontend

| Trang | Chức năng |
|-------|----------|
| `/notifications` | Danh sách thông báo (phân trang). Đánh dấu đã đọc / đọc tất cả. Lọc theo loại (system/billing/fine-tune/account) |

#### Database (Collections liên quan)

- **Notifications** – userId, type, title, message, isRead, link

---

### Module 8: Trang Công Khai & Landing Page

**Mô tả:** Các trang không yêu cầu đăng nhập: giới thiệu sản phẩm, liên hệ.

#### Frontend

| Trang | Chức năng |
|-------|----------|
| `/` Landing Page | Hero section giới thiệu AI Copywriter → tính năng nổi bật (sinh nội dung, nhiều model AI, fine-tuning) → bảng giá 3 gói → testimonials → call-to-action đăng ký |
| `/contact` | Form liên hệ (tên, email, nội dung) → gọi API gửi email cho admin |

#### Backend

- API nhận form liên hệ → **Nodemailer** gửi email cho admin

---

### Module 9: Dashboard Người Dùng

**Mô tả:** Trang tổng quan cá nhân sau khi đăng nhập, hiển thị thống kê và truy cập nhanh.

#### Frontend

| Trang | Chức năng |
|-------|----------|
| `/dashboard` | Card tổng quan: số nội dung đã tạo, token đã dùng / giới hạn, gói hiện tại. Biểu đồ sử dụng theo ngày/tuần/tháng (**Chart.js**). Danh sách 5 nội dung gần đây. Nút tắt "Tạo nội dung mới". Thông báo mới nhất |

#### Backend

- Sử dụng các API từ Module 2 (`/api/content`), Module 6 (`/api/billing`), Module 7 (`/api/notifications`)

---

### Module 10: Quản Trị Admin

**Mô tả:** Bảng điều khiển quản trị toàn bộ hệ thống: quản lý user, nội dung, model AI, thanh toán, cài đặt, nhật ký.

#### Backend

| API Endpoint | Phương thức | Mô tả |
|-------------|------------|-------|
| `/api/admin/stats` | GET | Tổng user, tổng nội dung, doanh thu, user hoạt động |
| `/api/admin/charts/users` | GET | Biểu đồ tăng trưởng user |
| `/api/admin/charts/revenue` | GET | Biểu đồ doanh thu |
| `/api/admin/charts/usage` | GET | Thống kê AI token |
| `/api/admin/users` | GET | Danh sách user (tìm kiếm **regex**, lọc role/gói/trạng thái) |
| `/api/admin/users/:id` | GET | Chi tiết user |
| `/api/admin/users/:id/status` | PATCH | Kích hoạt / vô hiệu hóa |
| `/api/admin/users/:id/role` | PATCH | Đổi role |
| `/api/admin/users/:id` | DELETE | Xóa tài khoản |
| `/api/admin/contents` | GET | Tất cả nội dung hệ thống |
| `/api/admin/contents/:id` | DELETE | Xóa nội dung vi phạm |
| `/api/admin/contents/stats` | GET | Thống kê nội dung |
| `/api/admin/plans` | CRUD | CRUD gói dịch vụ (validate Joi: price ≥ 0, tokenLimit > 0) |
| `/api/admin/payments` | GET | Tất cả thanh toán |
| `/api/admin/payments/:id/refund` | POST | Hoàn tiền |
| `/api/admin/models` | GET | Danh sách model AI |
| `/api/admin/models/:id` | PATCH | Bật/tắt + cấu hình model |
| `/api/admin/settings` | GET | Lấy tất cả cài đặt hệ thống |
| `/api/admin/settings/:key` | PUT | Cập nhật cài đặt (validate Joi) → ghi AuditLog |
| `/api/admin/audit-logs` | GET | Nhật ký hệ thống (lọc thời gian/user/action bằng **regex**) |

#### Frontend

| Trang | Chức năng |
|-------|----------|
| `/admin` | Dashboard: tổng user, nội dung, doanh thu, user hoạt động. Biểu đồ tăng trưởng. Thống kê AI token |
| `/admin/users` | Bảng user (phân trang). Tìm kiếm regex. Lọc role/gói/trạng thái. Kích hoạt/vô hiệu/đổi role/xóa |
| `/admin/contents` | Bảng nội dung toàn hệ thống. Tìm kiếm/lọc. Xóa vi phạm. Thống kê |
| `/admin/plans` | Cấu hình gói: tên, giá, giới hạn token, tính năng, model, dự án tối đa. Bật/tắt |
| `/admin/payments` | Lịch sử thanh toán toàn hệ thống. Thống kê doanh thu. Hoàn tiền |
| `/admin/models` | Danh sách model (GPT-4, Llama, fine-tuned). Bật/tắt. Cấu hình token/giá. Quản lý API key |
| `/admin/settings` | Cấu hình: tên site, logo, liên hệ, SMTP, rate limiting, system prompt mặc định, maintenance mode |
| `/admin/audit-logs` | Bảng log hành động. Lọc thời gian/user/hành động. Xuất log |

#### Database (Collections liên quan)

- **SystemSettings** – key/value cài đặt hệ thống
- **AuditLogs** – ghi log hành động admin

---

## 2. Công Nghệ Sử Dụng

### 2.1 Frontend (Client)

| Công nghệ | Vai trò |
|-----------|---------|
| **Next.js 14** (App Router) | Framework React với SSR/SSG, routing, API routes |
| **TypeScript** | Kiểm tra kiểu tĩnh, giảm lỗi runtime |
| **Tailwind CSS** | Utility-first CSS framework, responsive design |
| **Axios** | HTTP client gọi API backend |
| **React Hook Form** | Quản lý form hiệu quả |
| **Zustand** | State management nhẹ cho client |
| **React Query (TanStack Query)** | Caching, fetching, syncing server state |
| **React Markdown** | Render nội dung markdown từ AI |
| **Chart.js / Recharts** | Vẽ biểu đồ thống kê trên dashboard |
| **React Hot Toast** | Hiển thị thông báo toast |
| **next-auth** | Xử lý xác thực phía client (JWT + Google OAuth) |

### 2.2 Backend (Server)

| Công nghệ | Vai trò |
|-----------|---------|
| **Node.js** | Runtime JavaScript phía server |
| **Express.js** | Framework web xây dựng API RESTful |
| **Mongoose** | ODM kết nối và thao tác MongoDB |
| **bcrypt** | Mã hoá (hash) mật khẩu người dùng |
| **Joi** (joi.dev) | Validate dữ liệu đầu vào (request body, params, query) |
| **Regex** | Tìm kiếm nội dung, validate email/phone/URL, lọc dữ liệu |
| **jsonwebtoken (JWT)** | Tạo và xác thực access token / refresh token |
| **Multer** | Middleware xử lý file upload (avatar, dataset fine-tune) |
| **Cloudinary** | Lưu trữ hình ảnh trên cloud (avatar, thumbnail) |
| **Nodemailer** | Gửi email (xác minh tài khoản, đặt lại mật khẩu, thông báo) |
| **OpenAI SDK** | Gọi API GPT-4 để sinh nội dung |
| **Ollama** | Chạy Llama model local cho sinh nội dung |
| **LangChain.js** | Orchestrate AI model, prompt chaining, output parsing |
| **express-rate-limit** | Giới hạn request (chống spam, bảo vệ API) |
| **helmet** | Bảo mật HTTP headers |
| **cors** | Cấu hình Cross-Origin Resource Sharing |
| **morgan** | Logging HTTP request |
| **passport + passport-google-oauth20** | Đăng nhập qua Google OAuth 2.0 |
| **Stripe SDK** | Tích hợp thanh toán quốc tế |

### 2.3 Database & DevOps

| Công nghệ | Vai trò |
|-----------|---------|
| **MongoDB** | Cơ sở dữ liệu NoSQL lưu trữ toàn bộ dữ liệu |
| **MongoDB Atlas** | Hosting MongoDB trên cloud |
| **Docker + Docker Compose** | Container hoá ứng dụng, môi trường phát triển |
| **Vercel** | Deploy frontend (Next.js) |
| **yarn** | Package manager (thay npm) cho cả client và server |

### 2.4 Hướng Tiếp Cận AI

| Hướng | Mô tả |
|-------|-------|
| **Tích hợp GPT-4** | Gọi OpenAI API (ChatCompletion) với system prompt được thiết kế riêng cho từng loại nội dung copywriting |
| **Tích hợp Llama** | Chạy Llama model qua Ollama local, cung cấp lựa chọn model miễn phí cho user |
| **API RESTful cho AI** | Xây dựng endpoint `POST /api/content/generate` nhận yêu cầu, gọi model AI, streaming response về client |
| **Fine-tuning** | Upload dataset huấn luyện → gọi OpenAI Fine-tuning API hoặc fine-tune Llama local → tạo model chuyên biệt theo ngành (bất động sản, thời trang, công nghệ, …) |
| **Prompt Engineering** | Mỗi loại nội dung (blog, quảng cáo, email, …) có system prompt riêng, kết hợp tone giọng + ngôn ngữ + template variables |
| **Streaming (SSE)** | Sử dụng Server-Sent Events để stream nội dung từ AI về client theo thời gian thực |

---

## 3. Cấu Trúc Thư Mục Dự Án

### 3.1 Tổng Quan

```
ai-copywriter/
├── client/                     # Frontend (Next.js)
├── server/                     # Backend (Express.js)
├── docker-compose.yml          # Chạy toàn bộ hệ thống
└── README.md                   # Tài liệu dự án
```

### 3.2 Client (Next.js)

```
client/
├── public/                     # Tài nguyên tĩnh (favicon, images, fonts)
├── src/
│   ├── app/                    # App Router – chứa tất cả các trang (routes)
│   │   ├── (auth)/             # Nhóm trang xác thực (login, register, forgot-password)
│   │   ├── (public)/           # Nhóm trang công khai (landing page, contact)
│   │   ├── (user)/             # Nhóm trang người dùng (dashboard, generate, contents, ...)
│   │   ├── (admin)/            # Nhóm trang quản trị admin
│   │   ├── layout.tsx          # Layout gốc của ứng dụng
│   │   └── globals.css         # CSS toàn cục (Tailwind imports)
│   ├── components/             # React components tái sử dụng
│   │   ├── ui/                 # Component UI cơ bản (Button, Input, Modal, Table, Card, ...)
│   │   ├── layout/             # Component layout (Header, Sidebar, Footer, AdminSidebar)
│   │   ├── forms/              # Component form (LoginForm, RegisterForm, GenerateForm, ...)
│   │   └── charts/             # Component biểu đồ thống kê
│   ├── hooks/                  # Custom React hooks (useAuth, useContent, useDebounce, ...)
│   ├── lib/                    # Thư viện tiện ích
│   │   ├── api.ts              # Cấu hình Axios instance, interceptors
│   │   ├── auth.ts             # Hàm xử lý xác thực (getToken, refreshToken, ...)
│   │   └── utils.ts            # Hàm tiện ích dùng chung (formatDate, truncate, ...)
│   ├── services/               # Lớp gọi API backend (authService, contentService, adminService, ...)
│   ├── stores/                 # Zustand stores (authStore, uiStore, ...)
│   ├── types/                  # TypeScript type definitions (User, Content, Template, ...)
│   └── constants/              # Hằng số (content types, tones, languages, routes, ...)
├── tailwind.config.ts          # Cấu hình Tailwind CSS
├── next.config.js              # Cấu hình Next.js
├── tsconfig.json               # Cấu hình TypeScript
├── package.json                # Dependencies & scripts
└── yarn.lock                   # Lock file (yarn)
```

### 3.3 Server (Express.js)

```
server/
├── src/
│   ├── config/                 # Cấu hình ứng dụng (database, cloudinary, passport, ...)
│   ├── models/                 # Mongoose schemas & models (User, Content, Template, ...)
│   ├── routes/                 # Định nghĩa API routes (authRoutes, contentRoutes, adminRoutes, ...)
│   ├── controllers/            # Xử lý logic từng route (authController, contentController, ...)
│   ├── services/               # Business logic (aiService, gptService, llamaService, fineTuneService, ...)
│   ├── middlewares/            # Middleware (auth, role, validate, upload, rateLimiter, errorHandler)
│   ├── validations/            # Joi validation schemas (authValidation, contentValidation, ...)
│   ├── utils/                  # Hàm tiện ích (regex patterns, email sender, token generator, ...)
│   └── app.js                  # Entry point – khởi tạo Express, kết nối DB, mount routes
├── uploads/                    # Thư mục tạm lưu file upload trước khi đẩy lên Cloudinary
├── .env.example                # Mẫu biến môi trường
├── package.json                # Dependencies & scripts
├── yarn.lock                   # Lock file (yarn)
└── Dockerfile                  # Docker build cho server
```

---

## 4. Middleware & Tiện Ích Backend

| Thành phần | Mô tả |
|-----------|-------|
| `auth.js` middleware | Kiểm tra JWT token trong header `Authorization: Bearer <token>` → decode → gắn `req.user`. Xử lý: token hết hạn, không hợp lệ, không có token |
| `role.js` middleware | Kiểm tra `req.user.role` có nằm trong danh sách role cho phép không. Ví dụ: `role('admin')` chỉ cho admin truy cập |
| `validate.js` middleware | Nhận **Joi** schema → validate `req.body` / `req.params` / `req.query` → trả lỗi 400 nếu không hợp lệ |
| `upload.js` middleware | Cấu hình **Multer**: storage (disk), file filter (chỉ cho phép image/csv/json), size limit (5MB ảnh, 50MB dataset) |
| `rateLimiter.js` middleware | **express-rate-limit**: giới hạn 100 req/15 phút cho API chung, 10 req/15 phút cho API sinh nội dung (tránh lạm dụng AI) |
| `errorHandler.js` middleware | Bắt tất cả lỗi → format response thống nhất `{ success: false, message, errors }` |
| **Regex patterns** (`utils/`) | `EMAIL_REGEX` validate email, `PHONE_REGEX` validate SĐT, `URL_REGEX` validate URL, `SLUG_REGEX` validate slug, `SEARCH_REGEX(keyword)` tạo regex tìm kiếm không dấu, `PASSWORD_REGEX` validate password strength |
| **Cloudinary** (`services/`) | Upload ảnh avatar/logo lên Cloudinary → trả `secure_url`. Xóa ảnh cũ khi cập nhật. Tự động resize/optimize |

---

## 5. Thiết Kế Database (MongoDB)

### Collection: Users

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| name | String | Tên hiển thị |
| email | String, unique | Email đăng nhập (validate bằng regex) |
| password | String | Mật khẩu đã hash bằng **bcrypt** |
| avatar | String | URL ảnh đại diện trên **Cloudinary** |
| role | String, enum | `user` / `premium` / `admin` |
| emailVerified | Boolean | Đã xác minh email |
| googleId | String | ID đăng nhập Google OAuth |
| subscriptionId | ObjectId, ref | Gói dịch vụ hiện tại |
| apiKey | String | API key cá nhân |
| notificationSettings | Object | Cài đặt thông báo (email, inApp) |
| isActive | Boolean | Tài khoản hoạt động / bị khóa |
| lastLoginAt | Date | Lần đăng nhập cuối |
| createdAt, updatedAt | Date | Timestamps |

### Collection: Subscriptions

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| userId | ObjectId, ref | User sở hữu |
| planId | ObjectId, ref | Gói dịch vụ |
| status | String, enum | `active` / `canceled` / `expired` |
| currentPeriodStart | Date | Bắt đầu chu kỳ |
| currentPeriodEnd | Date | Kết thúc chu kỳ |
| stripeSubscriptionId | String | ID subscription trên Stripe |
| autoRenew | Boolean | Tự động gia hạn |
| createdAt, updatedAt | Date | Timestamps |

### Collection: Plans

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| name | String | Tên gói (Free, Pro, Enterprise) |
| price | Number | Giá |
| currency | String | Đơn vị tiền (USD, VND) |
| billingCycle | String, enum | `monthly` / `yearly` |
| tokenLimit | Number | Giới hạn token / tháng |
| features | [String] | Danh sách tính năng |
| allowedModels | [String] | Model AI được phép sử dụng |
| maxProjects | Number | Số dự án tối đa |
| isActive | Boolean | Gói có đang bán |
| stripePriceId | String | ID price trên Stripe |

### Collection: Payments

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| userId | ObjectId, ref | User |
| subscriptionId | ObjectId, ref | Subscription |
| amount | Number | Số tiền |
| currency | String | Đơn vị tiền |
| paymentMethod | String | Phương thức (card, banking) |
| stripePaymentIntentId | String | ID giao dịch Stripe |
| status | String, enum | `pending` / `completed` / `failed` / `refunded` |
| invoiceUrl | String | Link hóa đơn |
| createdAt | Date | Ngày thanh toán |

### Collection: Projects

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| userId | ObjectId, ref | Người tạo |
| name | String | Tên dự án |
| description | String | Mô tả |
| contentCount | Number | Số nội dung |
| isArchived | Boolean | Đã lưu trữ |
| createdAt, updatedAt | Date | Timestamps |

### Collection: Contents

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| userId | ObjectId, ref | Người tạo |
| projectId | ObjectId, ref | Thuộc dự án (nullable) |
| title | String | Tiêu đề nội dung |
| type | String, enum | `blog` / `ad` / `email` / `product` / `social` / `seo` / `script` / `headline` |
| prompt | String | Yêu cầu đầu vào |
| generatedContent | String | Nội dung AI sinh ra |
| model | String | Model AI đã dùng (gpt-4, llama, fine-tuned-xxx) |
| tone | String | Tone giọng |
| language | String | Ngôn ngữ |
| templateId | ObjectId, ref | Template đã dùng (nullable) |
| tags | [String] | Danh sách tag |
| isFavorite | Boolean | Yêu thích |
| tokensUsed | Number | Số token tiêu thụ |
| versions | [Object] | Lịch sử phiên bản `[{ content, editedAt }]` |
| createdAt, updatedAt | Date | Timestamps |

### Collection: Templates

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| name | String | Tên template |
| description | String | Mô tả |
| type | String, enum | Loại nội dung |
| categoryId | ObjectId, ref | Danh mục |
| promptTemplate | String | Nội dung prompt có biến `{{variable}}` |
| variables | [Object] | `[{ name, description, defaultValue }]` |
| isSystem | Boolean | Template hệ thống (admin tạo) |
| isPublic | Boolean | Công khai |
| createdBy | ObjectId, ref | Người tạo |
| rating | Number | Đánh giá trung bình |
| usageCount | Number | Số lần sử dụng |
| createdAt, updatedAt | Date | Timestamps |

### Collection: Categories

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| name | String | Tên danh mục |
| slug | String, unique | Slug URL (validate bằng regex) |
| description | String | Mô tả |
| parentId | ObjectId, ref | Danh mục cha (phân cấp) |
| icon | String | Icon hiển thị |
| isActive | Boolean | Đang sử dụng |
| createdAt, updatedAt | Date | Timestamps |

### Collection: FineTuneJobs

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| userId | ObjectId, ref | Người tạo |
| modelName | String | Tên model tùy chỉnh |
| baseModel | String | Model gốc (gpt-4, llama) |
| industry | String | Ngành nghề |
| status | String, enum | `pending` / `training` / `completed` / `failed` |
| datasetUrl | String | URL file dataset (Cloudinary) |
| config | Object | `{ epochs, learningRate, batchSize }` |
| result | Object | `{ modelId, accuracy, trainingTime }` |
| createdAt, updatedAt | Date | Timestamps |

### Collection: Notifications

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| userId | ObjectId, ref | Người nhận |
| type | String, enum | `system` / `billing` / `fine-tune` / `account` |
| title | String | Tiêu đề |
| message | String | Nội dung |
| isRead | Boolean | Đã đọc |
| link | String | Link liên quan |
| createdAt | Date | Ngày tạo |

### Collection: UsageLogs

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| userId | ObjectId, ref | User |
| action | String, enum | `generate` / `regenerate` / `fine-tune` |
| model | String | Model đã dùng |
| tokensUsed | Number | Số token |
| contentId | ObjectId, ref | Nội dung liên quan |
| ip | String | Địa chỉ IP |
| userAgent | String | Thông tin trình duyệt |
| createdAt | Date | Ngày ghi log |

### Collection: AuditLogs

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| userId | ObjectId, ref | Người thực hiện |
| action | String | Hành động (`user.login`, `user.role_change`, `content.delete`, `system.config_update`) |
| targetType | String | Loại đối tượng (`user`, `content`, `setting`) |
| targetId | ObjectId | ID đối tượng |
| details | Object | Chi tiết bổ sung |
| ip | String | Địa chỉ IP |
| createdAt | Date | Ngày ghi log |

### Collection: SystemSettings

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| key | String, unique | Tên cấu hình (`site_name`, `smtp_host`, `maintenance_mode`, …) |
| value | Mixed | Giá trị |
| description | String | Mô tả |
| updatedBy | ObjectId, ref | Admin cập nhật cuối |
| updatedAt | Date | Lần cập nhật cuối |

---

## 6. Tổng Hợp Routes (Giao Diện)

### Trang Công Khai

| Route | Module |
|-------|--------|
| `/` | Module 8 – Landing page |
| `/login` | Module 1 – Đăng nhập |
| `/register` | Module 1 – Đăng ký |
| `/forgot-password` | Module 1 – Quên mật khẩu |
| `/reset-password` | Module 1 – Đặt lại mật khẩu |
| `/contact` | Module 8 – Liên hệ |

### Trang Người Dùng (yêu cầu đăng nhập)

| Route | Module |
|-------|--------|
| `/dashboard` | Module 9 – Dashboard tổng quan |
| `/generate` | Module 2 – Sinh nội dung AI ⭐ |
| `/contents` | Module 2 – Quản lý nội dung |
| `/contents/:id` | Module 2 – Chi tiết nội dung |
| `/projects` | Module 5 – Quản lý dự án |
| `/projects/:id` | Module 5 – Chi tiết dự án |
| `/templates` | Module 4 – Thư viện template |
| `/fine-tune` | Module 3 – Quản lý fine-tuning |
| `/profile` | Module 1 – Hồ sơ cá nhân |
| `/billing` | Module 6 – Gói dịch vụ & thanh toán |
| `/notifications` | Module 7 – Thông báo |

### Trang Admin (yêu cầu role `admin`)

| Route | Module |
|-------|--------|
| `/admin` | Module 10 – Dashboard admin |
| `/admin/users` | Module 10 – Quản lý user |
| `/admin/contents` | Module 10 – Quản lý nội dung |
| `/admin/templates` | Module 4 + 10 – Quản lý template hệ thống |
| `/admin/categories` | Module 4 + 10 – Quản lý danh mục |
| `/admin/plans` | Module 10 – Quản lý gói dịch vụ |
| `/admin/payments` | Module 10 – Quản lý thanh toán |
| `/admin/models` | Module 10 – Quản lý model AI |
| `/admin/settings` | Module 10 – Cài đặt hệ thống |
| `/admin/audit-logs` | Module 10 – Nhật ký hệ thống |

---

