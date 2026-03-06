# AI Copywriter – Báo Cáo Đồ Án

## Thông Tin Đồ Án

- **Đề tài:** Website hỗ trợ viết nội dung bằng AI (AI Copywriter)
- **Môn học:** NT114.Q21
- **Thực hiện:** Bùi Lê Huy Phước
- **Mô tả:** Xây dựng website tích hợp GPT-4 / Llama để sinh nội dung tự động (blog, quảng cáo, email marketing, mô tả sản phẩm, …). Hệ thống cung cấp API RESTful cho AI model xử lý nội dung trên backend, đồng thời hỗ trợ fine-tuning (tinh chỉnh model) để phù hợp với ngành nghề cụ thể.

---

## 1. Công Nghệ Sử Dụng

### 1.1 Frontend (Client)

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

### 1.2 Backend (Server)

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

### 1.3 Database & DevOps

| Công nghệ | Vai trò |
|-----------|---------|
| **MongoDB** | Cơ sở dữ liệu NoSQL lưu trữ toàn bộ dữ liệu |
| **MongoDB Atlas** | Hosting MongoDB trên cloud |
| **Docker + Docker Compose** | Container hoá ứng dụng, môi trường phát triển |
| **Vercel** | Deploy frontend (Next.js) |
| **yarn** | Package manager (thay npm) cho cả client và server |

### 1.4 Hướng Tiếp Cận AI

| Hướng | Mô tả |
|-------|-------|
| **Tích hợp GPT-4** | Gọi OpenAI API (ChatCompletion) với system prompt được thiết kế riêng cho từng loại nội dung copywriting |
| **Tích hợp Llama** | Chạy Llama model qua Ollama local, cung cấp lựa chọn model miễn phí cho user |
| **API RESTful cho AI** | Xây dựng endpoint `POST /api/content/generate` nhận yêu cầu, gọi model AI, streaming response về client |
| **Fine-tuning** | Upload dataset huấn luyện → gọi OpenAI Fine-tuning API hoặc fine-tune Llama local → tạo model chuyên biệt theo ngành (bất động sản, thời trang, công nghệ, …) |
| **Prompt Engineering** | Mỗi loại nội dung (blog, quảng cáo, email, …) có system prompt riêng, kết hợp tone giọng + ngôn ngữ + template variables |
| **Streaming (SSE)** | Sử dụng Server-Sent Events để stream nội dung từ AI về client theo thời gian thực |

---

## 2. Cấu Trúc Thư Mục Dự Án

### 2.1 Tổng Quan

```
ai-copywriter/
├── client/                     # Frontend (Next.js)
├── server/                     # Backend (Express.js)
├── docker-compose.yml          # Chạy toàn bộ hệ thống
└── README.md                   # Tài liệu dự án
```

### 2.2 Client (Next.js) – Cấu Trúc Thư Mục

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

**Vai trò từng thư mục chính của Client:**

| Thư mục | Công việc |
|---------|-----------|
| `app/(auth)/` | Chứa trang đăng nhập, đăng ký, quên mật khẩu, đặt lại mật khẩu |
| `app/(public)/` | Chứa landing page, trang liên hệ, bảng giá |
| `app/(user)/` | Chứa dashboard, trang sinh nội dung AI, quản lý nội dung, dự án, template, fine-tune, profile, billing, thông báo |
| `app/(admin)/` | Chứa dashboard admin, quản lý user, nội dung, template, danh mục, gói dịch vụ, thanh toán, model AI, cài đặt hệ thống, audit log |
| `components/ui/` | Chứa các component UI tái sử dụng: Button, Input, Textarea, Select, Modal, Table, Pagination, Card, Badge, Spinner, ... |
| `components/layout/` | Chứa Header (navbar, user menu), Sidebar (menu điều hướng user), AdminSidebar (menu admin), Footer |
| `components/forms/` | Chứa các form phức tạp: form đăng nhập, form sinh nội dung, form tạo template, form upload dataset, ... |
| `components/charts/` | Chứa biểu đồ: UsageChart, RevenueChart, GrowthChart cho dashboard |
| `hooks/` | Chứa custom hooks: useAuth (xác thực), useContent (thao tác nội dung), useDebounce (delay tìm kiếm), usePagination, ... |
| `lib/` | Chứa cấu hình Axios (base URL, token interceptor, error handling), hàm tiện ích dùng chung |
| `services/` | Chứa các lớp gọi API: authService (login, register), contentService (generate, CRUD), adminService (quản lý user, ...) |
| `stores/` | Chứa Zustand store quản lý state: authStore (user đăng nhập), uiStore (sidebar, theme) |
| `types/` | Chứa TypeScript interfaces/types cho User, Content, Template, Project, Plan, ... |
| `constants/` | Chứa hằng số: danh sách content types, tones, languages, route paths |

### 2.3 Server (Express.js) – Cấu Trúc Thư Mục

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

**Vai trò từng thư mục chính của Server:**

| Thư mục | Công việc |
|---------|-----------|
| `config/` | Cấu hình kết nối MongoDB (Mongoose), cấu hình Cloudinary, cấu hình Passport (Google OAuth), đọc biến môi trường |
| `models/` | Định nghĩa Mongoose schema cho từng collection: User, Content, Template, Project, Plan, Subscription, Payment, FineTuneJob, Notification, Category, UsageLog, AuditLog, SystemSetting |
| `routes/` | Khai báo endpoint API: auth routes (`/api/auth/*`), content routes (`/api/content/*`), admin routes (`/api/admin/*`), template routes, project routes, fine-tune routes, ... |
| `controllers/` | Xử lý request/response cho từng route: nhận dữ liệu → gọi service → trả kết quả. Ví dụ: `contentController.generate()` nhận prompt → gọi aiService → trả nội dung |
| `services/` | Chứa business logic tách biệt khỏi controller. Gồm: `gptService` (gọi OpenAI API), `llamaService` (gọi Ollama), `aiService` (điều phối chọn model), `fineTuneService` (quản lý fine-tuning), `emailService` (gửi email), `cloudinaryService` (upload/xóa ảnh) |
| `middlewares/` | Chứa middleware: `auth.js` (xác thực JWT), `role.js` (kiểm tra role admin/premium), `validate.js` (validate request bằng Joi schema), `upload.js` (cấu hình Multer cho file upload), `rateLimiter.js` (giới hạn request), `errorHandler.js` (xử lý lỗi tập trung) |
| `validations/` | Chứa Joi schema validate dữ liệu: `authValidation` (email regex, password strength), `contentValidation` (prompt required, type enum), `templateValidation`, `projectValidation`, ... Sử dụng **Regex** để validate format email, phone, URL, ... |
| `utils/` | Chứa hàm tiện ích: `regexPatterns.js` (tập hợp regex dùng chung cho tìm kiếm và validate), `tokenHelper.js` (tạo/verify JWT), `emailSender.js` (gửi email qua Nodemailer), `pagination.js` (helper phân trang) |
| `uploads/` | Thư mục tạm chứa file upload (avatar, dataset CSV/JSON) trước khi Multer + Cloudinary xử lý đẩy lên cloud |

---

## 3. Chi Tiết Công Việc Phía Client (Frontend)

### 3.1 Trang Công Khai

| Trang | Chức năng chi tiết |
|-------|-------------------|
| `/` Landing Page | Hero section giới thiệu AI Copywriter → các tính năng nổi bật (sinh nội dung, nhiều model AI, fine-tuning) → bảng giá 3 gói (Free/Pro/Enterprise) → testimonials → call-to-action đăng ký |
| `/login` Đăng nhập | Form nhập email + password → validate bằng React Hook Form → gọi `POST /api/auth/login` → lưu JWT token → redirect dashboard. Nút đăng nhập Google OAuth. Link quên mật khẩu |
| `/register` Đăng ký | Form nhập tên + email + password + xác nhận password → validate (email regex, password ≥ 8 ký tự) → gọi `POST /api/auth/register` → thông báo xác minh email |
| `/forgot-password` Quên MK | Form nhập email → gọi `POST /api/auth/forgot-password` → thông báo đã gửi email |
| `/reset-password` Đặt lại MK | Form nhập password mới + xác nhận → gọi `POST /api/auth/reset-password` với token từ URL |
| `/contact` Liên hệ | Form liên hệ (tên, email, nội dung) → gọi API gửi email cho admin |

### 3.2 Trang Người Dùng (Yêu cầu đăng nhập)

| Trang | Chức năng chi tiết |
|-------|-------------------|
| `/dashboard` Dashboard | Hiển thị card tổng quan: số nội dung đã tạo, token đã dùng / giới hạn, gói hiện tại. Biểu đồ sử dụng theo ngày/tuần/tháng (Chart.js). Danh sách 5 nội dung gần đây (truy cập nhanh). Nút tắt "Tạo nội dung mới". Thông báo hệ thống mới nhất |
| `/generate` Sinh nội dung AI | **Trang chính của ứng dụng.** Form chọn loại nội dung (blog/quảng cáo/email/sản phẩm/social/SEO/script/headline) → nhập chủ đề/từ khóa/mô tả → chọn tone giọng → chọn ngôn ngữ → chọn model AI (GPT-4/Llama/fine-tuned) → tùy chỉnh độ dài + temperature → nhấn "Sinh nội dung". Khu vực hiển thị kết quả: streaming real-time (SSE), chỉnh sửa trực tiếp, nút Copy/Lưu/Tạo lại. Chọn lưu vào dự án |
| `/contents` Quản lý nội dung | Bảng danh sách nội dung đã tạo với phân trang. Thanh tìm kiếm theo từ khóa (regex search). Bộ lọc: theo loại, ngày tạo, dự án, yêu thích. Sắp xếp theo ngày tạo/tên. Mỗi item: xem chi tiết, sửa, xóa, đánh dấu yêu thích, gắn tag. Xuất nội dung (Copy/PDF/Word) |
| `/contents/:id` Chi tiết nội dung | Hiển thị đầy đủ nội dung đã sinh. Chỉnh sửa trực tiếp (editor). Lịch sử phiên bản (version history) – xem/khôi phục phiên bản cũ. Thông tin meta: model, tone, ngôn ngữ, token, ngày tạo. Nút xuất (Copy/PDF/Word) |
| `/projects` Quản lý dự án | Danh sách dự án dạng card/grid. Tạo dự án mới (tên, mô tả). Mỗi dự án hiển thị: số nội dung, ngày tạo. Click vào → chi tiết dự án |
| `/projects/:id` Chi tiết dự án | Thông tin dự án + danh sách nội dung trong dự án. Sửa tên/mô tả dự án. Gán/gỡ nội dung. Lưu trữ (archive) dự án |
| `/templates` Thư viện template | Duyệt template hệ thống (admin tạo) và template cá nhân. Lọc theo danh mục (category) / loại nội dung. Tạo template tùy chỉnh: nhập tên, mô tả, prompt template với biến `{{variable}}`, khai báo biến. Chọn template → điền biến → sinh nội dung |
| `/fine-tune` Fine-tuning | Upload dataset (kéo thả file JSON/CSV) → Multer upload → Cloudinary/server lưu trữ. Tạo job fine-tuning mới: chọn base model, ngành nghề, tham số (epochs, learning rate). Bảng theo dõi jobs: trạng thái (pending/training/completed/failed). Danh sách model đã fine-tune → chọn sử dụng khi sinh nội dung |
| `/profile` Hồ sơ cá nhân | Xem/cập nhật thông tin: tên, email, avatar (upload ảnh → Multer + Cloudinary). Đổi mật khẩu (nhập mật khẩu cũ + mới). Thống kê sử dụng: token đã dùng, số nội dung, gói hiện tại. Quản lý API key cá nhân. Cài đặt thông báo |
| `/billing` Thanh toán | Hiển thị gói hiện tại + giới hạn. So sánh 3 gói (Free/Pro/Enterprise). Nút nâng cấp → Stripe checkout. Lịch sử thanh toán. Quản lý subscription (gia hạn/hủy) |
| `/notifications` Thông báo | Danh sách thông báo (phân trang). Đánh dấu đã đọc / đọc tất cả. Lọc theo loại (system/billing/fine-tune/account) |

### 3.3 Trang Quản Trị Admin (Yêu cầu role `admin`)

| Trang | Chức năng chi tiết |
|-------|-------------------|
| `/admin` Dashboard Admin | Card tổng quan: tổng user, tổng nội dung, tổng doanh thu, user hoạt động hôm nay. Biểu đồ tăng trưởng user theo tháng. Biểu đồ doanh thu theo tháng. Thống kê AI: tổng token tiêu thụ, phân bổ theo model (GPT-4 vs Llama) |
| `/admin/users` Quản lý User | Bảng danh sách user (phân trang). Tìm kiếm theo tên/email (regex search). Lọc theo role/gói/trạng thái. Xem chi tiết user: thông tin, thống kê, lịch sử thanh toán. Hành động: kích hoạt/vô hiệu hóa, đổi role, xóa tài khoản |
| `/admin/contents` Quản lý nội dung | Bảng tất cả nội dung trên hệ thống. Tìm kiếm, lọc theo loại/user/model. Xóa nội dung vi phạm. Thống kê nội dung theo loại, ngôn ngữ, model |
| `/admin/templates` Quản lý template | CRUD template hệ thống (template mặc định cho tất cả user). Phân loại theo category. Duyệt/ẩn template do user tạo (nếu public) |
| `/admin/categories` Quản lý danh mục | CRUD danh mục template. Hỗ trợ phân cấp (parent → child). Gán icon cho danh mục |
| `/admin/plans` Quản lý gói dịch vụ | Cấu hình gói: tên, giá, giới hạn token, tính năng, model được phép, số dự án tối đa. Bật/tắt gói |
| `/admin/payments` Quản lý thanh toán | Lịch sử thanh toán toàn hệ thống. Thống kê doanh thu theo tháng/gói. Xử lý hoàn tiền |
| `/admin/models` Quản lý Model AI | Danh sách model (GPT-4, Llama, fine-tuned). Bật/tắt model. Cấu hình giới hạn token, giá/token cho từng model. Quản lý API key (OpenAI, Ollama endpoint) |
| `/admin/settings` Cài đặt hệ thống | Cấu hình chung: tên site, logo (upload Cloudinary), thông tin liên hệ. Cấu hình email SMTP. Rate limiting. Quản lý system prompt mặc định cho từng loại nội dung. Maintenance mode |
| `/admin/audit-logs` Nhật ký hệ thống | Bảng log hành động: đăng nhập, đổi role, xóa nội dung, thay đổi cấu hình. Lọc theo thời gian/user/hành động. Xuất log |

---

## 4. Chi Tiết Công Việc Phía Server (Backend)

### 4.1 API Xác Thực (`/api/auth`)

| Công việc | Mô tả |
|-----------|-------|
| Đăng ký | Nhận `name, email, password` → validate bằng **Joi** (email regex, password ≥ 8 ký tự có chữ hoa + số + ký tự đặc biệt) → kiểm tra email trùng → hash password bằng **bcrypt** (salt round 10) → lưu user vào MongoDB → gửi email xác minh qua Nodemailer → trả về thông báo |
| Đăng nhập | Nhận `email, password` → validate Joi → tìm user theo email → so sánh password bằng **bcrypt.compare()** → tạo JWT access token (15 phút) + refresh token (7 ngày) → cập nhật `lastLoginAt` → ghi AuditLog → trả token |
| Refresh token | Nhận refresh token → verify → tạo access token mới |
| Đăng nhập Google | Passport Google OAuth 2.0 → callback → tìm/tạo user theo googleId → tạo JWT → redirect về client |
| Xác minh email | Nhận token từ URL → verify → cập nhật `emailVerified = true` |
| Quên mật khẩu | Nhận email → validate Joi (email regex) → tìm user → tạo reset token (JWT 1 giờ) → gửi email chứa link reset |
| Đặt lại mật khẩu | Nhận token + password mới → verify token → validate password bằng Joi → hash bằng **bcrypt** → cập nhật password |

### 4.2 API Sinh Nội Dung AI (`/api/content`)

| Công việc | Mô tả |
|-----------|-------|
| Sinh nội dung | Nhận `type, prompt, tone, language, model, length, temperature` → validate bằng **Joi** (type enum, prompt required, temperature 0-2) → kiểm tra giới hạn token user → **aiService** chọn model (GPT-4/Llama/fine-tuned) → xây dựng system prompt theo type + tone + language → gọi API (OpenAI hoặc Ollama) → **streaming response (SSE)** về client → lưu content vào MongoDB → cập nhật UsageLog → trả kết quả |
| CRUD nội dung | `GET /` lấy danh sách (phân trang, lọc bằng **regex** tìm kiếm từ khóa, lọc theo type/projectId/isFavorite), `GET /:id` chi tiết, `PUT /:id` cập nhật (lưu version cũ vào mảng versions), `DELETE /:id` xóa |
| Đánh dấu yêu thích | `PATCH /:id/favorite` toggle isFavorite |
| Gắn tag | `PATCH /:id/tags` cập nhật mảng tags |
| Xuất nội dung | `GET /:id/export?format=pdf\|docx` sinh file PDF/Word và trả về |

### 4.3 API Template (`/api/templates`)

| Công việc | Mô tả |
|-----------|-------|
| CRUD template | Tạo template mới (validate bằng Joi: name required, variables array), lấy danh sách (lọc theo category/type, tìm kiếm bằng regex), cập nhật, xóa |
| Template variables | Khi user chọn template → trả về danh sách variables → user điền giá trị → thay thế biến trong promptTemplate (dùng **regex** replace `{{variable}}`) → sinh nội dung |
| Template hệ thống vs user | `isSystem = true` chỉ admin tạo/sửa/xóa. `isPublic = true` cho phép user khác sử dụng |

### 4.4 API Dự Án (`/api/projects`)

| Công việc | Mô tả |
|-----------|-------|
| CRUD dự án | Tạo dự án (validate Joi: name required), lấy danh sách, cập nhật, xóa (cascade xóa liên kết content). Mỗi dự án thuộc 1 user |
| Gán nội dung | Gán/gỡ content vào project, cập nhật contentCount |

### 4.5 API Fine-tuning (`/api/fine-tune`)

| Công việc | Mô tả |
|-----------|-------|
| Upload dataset | **Multer** nhận file CSV/JSON → validate format + kích thước → lưu tạm `uploads/` → đẩy lên **Cloudinary** (hoặc lưu server) → trả URL |
| Tạo job fine-tuning | Nhận `baseModel, industry, config` → validate Joi → gọi OpenAI Fine-tuning API hoặc Llama fine-tune script → lưu FineTuneJob (status: pending) → chạy training (background job) → cập nhật status |
| Theo dõi job | `GET /jobs` danh sách jobs, `GET /jobs/:id` chi tiết + trạng thái |
| Danh sách model fine-tuned | `GET /models` trả về model đã fine-tune thành công, dùng để chọn khi sinh nội dung |

### 4.6 API Người Dùng (`/api/users`)

| Công việc | Mô tả |
|-----------|-------|
| Xem profile | `GET /profile` trả thông tin user đang đăng nhập |
| Cập nhật profile | `PUT /profile` validate Joi → cập nhật tên, avatar (upload ảnh → **Multer** → **Cloudinary** lưu trữ → lưu URL vào DB) |
| Đổi mật khẩu | `PUT /change-password` nhận password cũ + mới → **bcrypt.compare** password cũ → validate password mới bằng Joi (regex pattern) → **bcrypt.hash** → cập nhật |
| Thống kê sử dụng | `GET /usage` trả tổng token dùng, số nội dung, giới hạn gói |

### 4.7 API Thanh Toán (`/api/billing`)

| Công việc | Mô tả |
|-----------|-------|
| Tạo checkout session | `POST /checkout` nhận planId → Stripe.checkout.sessions.create → trả redirect URL |
| Webhook Stripe | `POST /webhook` nhận event từ Stripe → cập nhật Subscription + Payment |
| Lịch sử thanh toán | `GET /payments` danh sách thanh toán của user |
| Quản lý subscription | `GET /subscription` xem gói hiện tại, `POST /cancel` hủy subscription |

### 4.8 API Thông Báo (`/api/notifications`)

| Công việc | Mô tả |
|-----------|-------|
| Lấy thông báo | `GET /` danh sách thông báo (phân trang, lọc theo type/isRead) |
| Đánh dấu đã đọc | `PATCH /:id/read` đánh dấu 1 thông báo, `PATCH /read-all` đánh dấu tất cả |

### 4.9 API Admin (`/api/admin`)

| Công việc | Mô tả |
|-----------|-------|
| Dashboard | `GET /stats` trả tổng user, tổng nội dung, doanh thu, user hoạt động. `GET /charts/users` tăng trưởng user. `GET /charts/revenue` doanh thu. `GET /charts/usage` thống kê AI token |
| Quản lý user | `GET /users` danh sách (tìm kiếm bằng **regex**, lọc role/gói/trạng thái), `GET /users/:id` chi tiết, `PATCH /users/:id/status` kích hoạt/vô hiệu, `PATCH /users/:id/role` đổi role, `DELETE /users/:id` xóa |
| Quản lý nội dung | `GET /contents` tất cả nội dung, `DELETE /contents/:id` xóa vi phạm, `GET /contents/stats` thống kê |
| Quản lý template | CRUD template hệ thống (`isSystem = true`) |
| Quản lý danh mục | CRUD categories (validate Joi: name + slug unique, slug regex) |
| Quản lý gói | CRUD plans (validate Joi: price ≥ 0, tokenLimit > 0) |
| Quản lý thanh toán | `GET /payments` tất cả thanh toán, `POST /payments/:id/refund` hoàn tiền |
| Quản lý model | `GET /models` danh sách, `PATCH /models/:id` bật/tắt + cấu hình |
| Cài đặt hệ thống | `GET /settings` lấy tất cả, `PUT /settings/:key` cập nhật (validate Joi) → ghi AuditLog |
| Audit log | `GET /audit-logs` lấy log (lọc theo thời gian/user/action bằng **regex**) |

### 4.10 Middleware & Tiện Ích

| Thành phần | Mô tả |
|-----------|-------|
| `auth.js` middleware | Kiểm tra JWT token trong header `Authorization: Bearer <token>` → decode → gắn `req.user`. Xử lý: token hết hạn, không hợp lệ, không có token |
| `role.js` middleware | Kiểm tra `req.user.role` có nằm trong danh sách role cho phép không. Ví dụ: `role('admin')` chỉ cho admin truy cập |
| `validate.js` middleware | Nhận **Joi** schema → validate `req.body` / `req.params` / `req.query` → trả lỗi 400 nếu không hợp lệ |
| `upload.js` middleware | Cấu hình **Multer**: storage (disk), file filter (chỉ cho phép image/csv/json), size limit (5MB ảnh, 50MB dataset) |
| `rateLimiter.js` middleware | **express-rate-limit**: giới hạn 100 req/15 phút cho API chung, 10 req/15 phút cho API sinh nội dung (tránh lạm dụng AI) |
| `errorHandler.js` middleware | Bắt tất cả lỗi → format response thống nhất `{ success: false, message, errors }` |
| **Regex patterns** (`utils/`) | `EMAIL_REGEX` validate email, `PHONE_REGEX` validate SĐT, `URL_REGEX` validate URL, `SLUG_REGEX` validate slug, `SEARCH_REGEX(keyword)` tạo regex tìm kiếm không dấu từ keyword input, `PASSWORD_REGEX` validate password strength |
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

## 6. Giao Diện (Routes) Tổng Hợp

### Trang Công Khai
| Route | Trang |
|-------|-------|
| `/` | Landing page (giới thiệu, tính năng, bảng giá) |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/forgot-password` | Quên mật khẩu |
| `/reset-password` | Đặt lại mật khẩu |
| `/contact` | Liên hệ |

### Trang Người Dùng (yêu cầu đăng nhập)
| Route | Trang |
|-------|-------|
| `/dashboard` | Dashboard tổng quan |
| `/generate` | Sinh nội dung AI (trang chính) |
| `/contents` | Quản lý nội dung |
| `/contents/:id` | Chi tiết nội dung |
| `/projects` | Quản lý dự án |
| `/projects/:id` | Chi tiết dự án |
| `/templates` | Thư viện template |
| `/fine-tune` | Quản lý fine-tuning |
| `/profile` | Hồ sơ cá nhân & cài đặt |
| `/billing` | Gói dịch vụ & thanh toán |
| `/notifications` | Thông báo |

### Trang Admin (yêu cầu role `admin`)
| Route | Trang |
|-------|-------|
| `/admin` | Dashboard admin |
| `/admin/users` | Quản lý user |
| `/admin/contents` | Quản lý nội dung |
| `/admin/templates` | Quản lý template hệ thống |
| `/admin/categories` | Quản lý danh mục |
| `/admin/plans` | Quản lý gói dịch vụ |
| `/admin/payments` | Quản lý thanh toán |
| `/admin/models` | Quản lý model AI |
| `/admin/settings` | Cài đặt hệ thống |
| `/admin/audit-logs` | Nhật ký hệ thống |

---

## 7. Ghi Chú

- **Package manager:** Sử dụng **yarn** cho cả client và server (thay npm).
- **Mã hoá mật khẩu:** Sử dụng **bcrypt** (salt round 10) để hash password trước khi lưu vào MongoDB.
- **Validate dữ liệu:** Sử dụng **Joi** (joi.dev) cho tất cả API endpoint; kết hợp **Regex** cho validate format (email, phone, URL, slug, password pattern) và tìm kiếm nội dung.
- **Lưu trữ hình ảnh:** **Multer** nhận file upload → **Cloudinary** lưu trữ trên cloud → trả về `secure_url` lưu vào database.
- **AI approach:** Xây dựng RESTful API cho AI model. GPT-4 qua OpenAI SDK, Llama qua Ollama local. Sử dụng LangChain.js để orchestrate prompt chaining. Hỗ trợ fine-tuning qua OpenAI API hoặc Llama local training.
- **Streaming:** Sử dụng Server-Sent Events (SSE) để stream nội dung từ AI về client theo thời gian thực.
- Dự án do 1 người thực hiện.
- Ưu tiên hoàn thành **xác thực → sinh nội dung → quản lý nội dung** trước (MVP).
- Trang admin và thanh toán phát triển sau khi các chức năng cốt lõi ổn định.
