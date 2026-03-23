# KẾ HOẠCH ĐỒ ÁN NT114

**Tên đề tài:** Xây dựng Website AI Copywriter tích hợp GPT-4/Llama, RESTful API xử lý trên backend và Fine-tuning để tinh chỉnh mô hình với ngành nghề cụ thể

**Sinh viên thực hiện:** Bùi Lê Huy Phước. **MSSV:** 23521228

---

## 1. Công nghệ sử dụng

| Frontend | Backend | Database | Hướng tiếp cận AI |
|----------|---------|----------|-------------------|
| Next.js | Node.js | Cloudinary | Tích hợp GPT-4 |
| TypeScript | Express.js | MongoDB | Tích hợp Llama |
| Tailwind CSS | Mongoose | MongoDB Atlas | API RESTful cho AI |
| Axios | Bcrypt | Docker + Docker Compose | Fine-tuning |
| React Hook Form | Joi.dev | Redis | Streaming (SSE) |
| React Query | Regex | | |
| React Markdown | JWT | | |
| Chart.js | Multer | | AI Plagiarism Detection ⭐ |
| React Hot Toast | Nodemailer | | |
| Next-auth | OpenAI SDK | | |
| Zustand | Ollama | | |
| | Express-rate-limit | | |
| | passport + passport-google-oauth20 | | |
| | helmet | | |
| | cors | | |
| | morgan | | |
| | yarn | | |
| | Stripe SDK | | |
| | plagiarism-checker ⭐ | | |

---

## 2. Cấu trúc thư mục

### 2.1. Tổng quan

```
ai-copywriter/
├── frontend/                     # Frontend (Next.js)
├── backend/                     # Backend (Express.js)
├── docker-compose.yml
└── README.md
```

### 2.2. Frontend

```
frontend/
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

### 2.3. Backend

```
backend/
├── src/
│   ├── config/                 # Cấu hình ứng dụng (database, cloudinary, passport, ...)
│   ├── models/                 # Mongoose schemas & models (User, Content, Template, ...)
│   ├── routes/                 # Định nghĩa API routes (authRoutes, contentRoutes, ...)
│   ├── controllers/            # Xử lý logic từng route (authController, contentController, ...)
│   ├── services/               # Business logic (aiService, plagiarismService, ...)
│   ├── middlewares/            # Middleware (auth, role, validate, upload, rateLimiter, errorHandler)
│   ├── validations/            # Joi validation schemas (authValidation, contentValidation, ...)
│   ├── utils/                  # Hàm tiện ích (regex patterns, email sender, token generator, ...)
│   └── app.js                  # Entry point – khởi tạo Express, mount routes
├── uploads/                    # Thư mục tạm lưu file upload trước khi đẩy lên Cloudinary
├── .env.example                # Mẫu biến môi trường
├── package.json                # Dependencies & scripts
├── yarn.lock                   # Lock file (yarn)
└── Dockerfile                  # Docker build cho server
```

### 2.4. Database (MongoDB)

| Collection | Mô tả |
|------------|-------|
| Users | Tài khoản, role, avatar, googleId |
| Contents | Nội dung AI sinh ra, prompt, model, tags, versions |
| Templates | Prompt template có biến, phân loại |
| Categories | Danh mục phân cấp cho template |
| Projects | Dự án nhóm nội dung |
| Plans | Gói dịch vụ (Free/Pro/Enterprise) |
| Subscriptions | Đăng ký gói của user |
| Payments | Lịch sử thanh toán Stripe |
| FineTuneJobs | Job fine-tuning model AI |
| Notifications | Thông báo cho user |
| UsageLogs | Log sử dụng AI (token, model) |
| AuditLogs | Log hành động hệ thống |
| SystemSettings | Cài đặt hệ thống (key/value) |
| PlagiarismReports ⭐ | Báo cáo kiểm tra đạo văn (similarity %, matches, web sources) |

---

## 3. Chi tiết công việc frontend

### 3.1. Trang công khai

| Route | Trang |
|-------|-------|
| `/` | Landing page (giới thiệu, tính năng, bảng giá) |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/forgot-password` | Quên mật khẩu |
| `/reset-password` | Đặt lại mật khẩu |
| `/contact` | Liên hệ |

### 3.2. Trang người dùng

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
| `/plagiarism-check` ⭐ | Plagiarism Detection – kiểm tra đạo văn nội dung AI |
| `/profile` | Hồ sơ cá nhân & cài đặt |
| `/billing` | Gói dịch vụ & thanh toán |
| `/notifications` | Thông báo |

### 3.3. Trang Admin

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

## 4. Middleware/Bảo mật

1. **JWT Authentication** – access token (15 phút) + refresh token (7 ngày)
2. **Role-based Access** – phân quyền user / premium / admin
3. **Joi Validation** – validate toàn bộ input (body, params, query)
4. **Regex Patterns** – validate email, phone, URL, slug, password, tìm kiếm
5. **Rate Limiting** – 100 req/15 phút (chung), 10 req/15 phút (AI generate)
6. **Helmet + CORS** – bảo mật HTTP headers
7. **Multer + Cloudinary** – upload file an toàn, lưu trữ cloud

---

## 5. Hướng tiếp cận AI

| Kỹ thuật | Mô tả |
|----------|-------|
| GPT-4 (OpenAI API) | Sinh nội dung chất lượng cao qua ChatCompletion |
| Llama (Ollama local) | Model miễn phí chạy local |
| Fine-tuning | Tinh chỉnh model theo ngành nghề cụ thể |
| Prompt Engineering | System prompt riêng cho từng loại nội dung + tone + ngôn ngữ |
| LangChain.js | Orchestrate model, prompt chaining, output parsing |
| Streaming (SSE) | Server-Sent Events trả nội dung real-time |
| AI Plagiarism Detection ⭐ | So sánh nội dung bằng cosine similarity trên embeddings → phát hiện đoạn trùng lặp → cảnh báo nếu vượt ngưỡng |

---

## 6. Module Chức năng (10 module)

### Module 1 – Xác Thực & Tài Khoản

+ Đăng ký / đăng nhập (email + Google OAuth)
+ Quên & đặt lại mật khẩu, xác minh email
+ Quản lý hồ sơ cá nhân (avatar, đổi password)
+ API: `/api/auth/*`, `/api/users/*`
+ DB: Users, AuditLogs

### Module 2 – Sinh Nội Dung AI

+ Sinh nội dung: blog, quảng cáo, email, sản phẩm, social, SEO, script, headline
+ Chọn model (GPT-4 / Llama / fine-tuned), tone, ngôn ngữ, temperature
+ Streaming real-time (SSE) từ AI về client
+ CRUD nội dung, yêu thích, gắn tag, lịch sử phiên bản, xuất PDF/Word
+ API: `/api/content/*`
+ DB: Contents, UsageLogs

### Module 3 – Fine-tuning Model AI

+ Upload dataset (CSV/JSON) → Multer → Cloudinary
+ Tạo job fine-tuning (OpenAI API hoặc Llama local)
+ Theo dõi trạng thái: pending → training → completed/failed
+ Sử dụng model đã fine-tune khi sinh nội dung
+ API: `/api/fine-tune/*`
+ DB: FineTuneJobs

### Module 4 – Template & Danh Mục

+ Template prompt có biến `{{variable}}`, tái sử dụng
+ Template hệ thống (admin) + template cá nhân (user)
+ Danh mục phân cấp (parent → child)
+ API: `/api/templates/*`, `/api/admin/categories`
+ DB: Templates, Categories

### Module 5 – Quản Lý Dự Án

+ Tạo dự án, gán nội dung vào dự án, lưu trữ (archive)
+ API: `/api/projects/*`
+ DB: Projects

### Module 6 – Thanh Toán & Gói Dịch Vụ

+ 3 gói: Free / Pro / Enterprise (giới hạn token, model, dự án)
+ Tích hợp Stripe: checkout, webhook, quản lý subscription
+ API: `/api/billing/*`
+ DB: Plans, Subscriptions, Payments

### Module 7 – Thông Báo

+ Thông báo hệ thống, thanh toán, fine-tuning, tài khoản
+ Gửi email thông báo qua Nodemailer
+ Đánh dấu đã đọc / đọc tất cả
+ API: `/api/notifications/*`
+ DB: Notifications

### Module 8 – Trang Công Khai

+ Landing page: giới thiệu, tính năng, bảng giá, testimonials
+ Trang liên hệ (gửi email qua Nodemailer)

### Module 9 – Dashboard Người Dùng

+ Thống kê: nội dung đã tạo, token đã dùng, gói hiện tại
+ Biểu đồ sử dụng (Chart.js), nội dung gần đây, thông báo

### Module 10 – Quản Trị Admin

+ Dashboard: tổng user, nội dung, doanh thu, biểu đồ tăng trưởng
+ Quản lý: user, nội dung, template, danh mục, gói dịch vụ, thanh toán, model AI
+ Cài đặt hệ thống, nhật ký audit log
+ API: `/api/admin/*`
+ DB: SystemSettings, AuditLogs

---

## 7. Tính Năng Nâng Cao (Advanced Features) ⭐

### 7.1 AI Plagiarism Detection System

+ **Vấn đề:** AI có thể sinh nội dung trùng lặp → cần phát hiện và cảnh báo
+ **Kiến trúc:** Content → Segmentation → Embedding → Cosine Similarity Search (database + web scraping) → Threshold Detection (>85%) → Report (highlight đoạn trùng, nguồn gốc, % tổng)
+ **API:** `/api/plagiarism/*` (check, check-web, history)
+ **DB:** PlagiarismReports

---

## 8. Kế Hoạch Công Việc Chi Tiết

### Giai đoạn 1 – Thiết kế UI/UX (Figma)

| # | Công việc | Chi tiết | Output |
|---|-----------|----------|--------|
| 1.1 | Thiết kế Design System | Định nghĩa color palette, typography (font, size), spacing, border-radius, shadow. Tạo component library: Button, Input, Card, Modal, Table, Badge, Avatar, Toast | Figma Design System file |
| 1.2 | Wireframe trang công khai | Wireframe cho: Landing page, Login, Register, Forgot Password, Contact | Wireframe low-fidelity |
| 1.3 | Wireframe trang người dùng | Wireframe cho: Dashboard, Generate (trang chính), Contents list, Content detail, Projects, Templates, Fine-tune, Plagiarism Check ⭐, Profile, Billing, Notifications | Wireframe low-fidelity |
| 1.4 | Wireframe trang Admin | Wireframe cho: Admin Dashboard, Users, Contents, Templates, Categories, Plans, Payments, Models, Settings, Audit Logs | Wireframe low-fidelity |
| 1.5 | UI Design high-fidelity | Chuyển wireframe → thiết kế chi tiết. Responsive: Desktop (1440px), Tablet (768px), Mobile (375px). Dark mode / Light mode | Figma mockup hoàn chỉnh |
| 1.6 | Prototype & User Flow | Tạo interactive prototype cho các luồng chính: đăng ký → đăng nhập → sinh nội dung → kiểm tra đạo văn → thanh toán | Figma prototype có click-through |

### Giai đoạn 2 – Thiết kế Database

| # | Công việc | Chi tiết | Output |
|---|-----------|----------|--------|
| 2.1 | ERD Diagram | Vẽ Entity-Relationship Diagram cho 14 collections (Users, Contents, Templates, Categories, Projects, Plans, Subscriptions, Payments, FineTuneJobs, Notifications, UsageLogs, AuditLogs, SystemSettings, PlagiarismReports) | ERD file (draw.io / dbdiagram.io) |
| 2.2 | Mongoose Schemas | Định nghĩa schema chi tiết cho từng collection: field name, type, required, unique, default, ref, index, enum, timestamps | Code: `backend/src/models/*.js` |
| 2.3 | Indexes & Relations | Thiết kế index cho các trường tìm kiếm thường xuyên (email, slug, createdAt). Định nghĩa populate paths (User → Subscription → Plan, Content → User, ...) | Document index strategy |
| 2.4 | Seed Data | Tạo seed script: admin account, 3 plans (Free/Pro/Enterprise), system templates, categories, system settings | Code: `backend/src/seeds/` |

### Giai đoạn 3 – Backend (Express.js API)

| # | Công việc | Chi tiết | Output |
|---|-----------|----------|--------|
| 3.1 | Khởi tạo project | Setup Express + TypeScript, cấu hình ESLint/Prettier, cài đặt dependencies, cấu hình `.env`, kết nối MongoDB | Project chạy được `yarn dev` |
| 3.2 | Middleware core | Implement: JWT auth, role-based access, Joi validation middleware, error handler, rate limiter, helmet, cors, morgan | Code: `backend/src/middlewares/` |
| 3.3 | Module 1 – Auth API | `POST /register`, `POST /login`, `POST /refresh-token`, `POST /forgot-password`, `POST /reset-password`, `GET /verify-email`, `GET /google`, `GET /google/callback` | API Auth hoàn chỉnh |
| 3.4 | Module 2 – Content API | `POST /generate` (SSE streaming), `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id`, `PATCH /:id/favorite`, `PATCH /:id/tags`, `GET /:id/export` | API Content hoàn chỉnh |
| 3.5 | Module 3 – Fine-tune API | `POST /upload-dataset`, `POST /create-job`, `GET /jobs`, `GET /jobs/:id`, `GET /models` | API Fine-tune hoàn chỉnh |
| 3.6 | Module 4 – Template API | CRUD templates, CRUD categories (admin), `GET /templates/system`, `GET /templates/user` | API Template hoàn chỉnh |
| 3.7 | Module 5 – Project API | CRUD projects, `POST /:id/contents` (gán nội dung), `PATCH /:id/archive` | API Project hoàn chỉnh |
| 3.8 | Module 6 – Billing API | `POST /checkout` (Stripe), `POST /webhook` (Stripe webhook), `GET /subscription`, `GET /payments` | API Billing hoàn chỉnh |
| 3.9 | Module 7 – Notification API | `GET /`, `PATCH /:id/read`, `PATCH /read-all`, Nodemailer email service | API Notification hoàn chỉnh |
| 3.10 | Module 10 – Admin API | Dashboard stats, CRUD users/contents/templates/categories/plans/payments/models/settings, audit logs | API Admin hoàn chỉnh |
| 3.11 | AI Plagiarism Detection ⭐ | `POST /api/plagiarism/check` – so sánh nội dung bằng cosine similarity trên embeddings, `POST /api/plagiarism/check-web` – kiểm tra với web, `GET /api/plagiarism/history` | API Plagiarism hoàn chỉnh |
| 3.12 | Validation schemas | Joi schemas cho toàn bộ routes: authValidation, contentValidation, templateValidation, ... Regex patterns cho email, phone, URL, slug, password | Code: `backend/src/validations/` |
| 3.13 | Upload & Cloud | Multer config (avatar 5MB, dataset 50MB), Cloudinary upload/delete service | Code: `backend/src/services/cloudinaryService.js` |

### Giai đoạn 4 – Frontend (Next.js)

| # | Công việc | Chi tiết | Output |
|---|-----------|----------|--------|
| 4.1 | Khởi tạo project | Setup Next.js (App Router) + TypeScript, Tailwind CSS, cấu hình Axios instance, Zustand store, React Query provider | Project chạy được `yarn dev` |
| 4.2 | Layout & Navigation | Layout gốc (Header, Sidebar, Footer), AdminSidebar, responsive navigation, dark/light mode toggle | Components layout |
| 4.3 | UI Components | Button, Input, Select, Textarea, Modal, Table, Card, Badge, Avatar, Toast, Loading, Pagination, EmptyState | Component library |
| 4.4 | Trang công khai | Landing page (hero, features, pricing, testimonials, CTA), Login, Register, Forgot Password, Reset Password, Contact | 6 trang public |
| 4.5 | Auth flow | Đăng ký → xác minh email → đăng nhập (email + Google) → lưu JWT → auto refresh token → protected routes | Auth hoàn chỉnh |
| 4.6 | Trang Generate (chính) | Form chọn loại nội dung, tone, ngôn ngữ, model, temperature → SSE streaming hiển thị real-time → lưu/copy/tạo lại | Trang Generate |
| 4.7 | Trang Contents | Danh sách nội dung (bảng + phân trang), tìm kiếm, lọc (loại, dự án, yêu thích), chi tiết, sửa, xóa, xuất | Trang Contents |
| 4.8 | Trang Projects | Danh sách dự án (card grid), tạo/sửa/xóa dự án, chi tiết dự án (nội dung bên trong), archive | Trang Projects |
| 4.9 | Trang Templates | Duyệt template (hệ thống + cá nhân), lọc theo category, tạo template custom, preview | Trang Templates |
| 4.10 | Trang Fine-tune | Upload dataset (drag & drop), tạo job, theo dõi trạng thái, danh sách model đã train | Trang Fine-tune |
| 4.11 | Trang Plagiarism Check ⭐ | Nhập nội dung hoặc chọn content có sẵn → gọi API kiểm tra → hiển thị kết quả: % tổng, highlight đoạn trùng, nguồn, risk level | Trang Plagiarism |
| 4.12 | Trang Profile | Xem/sửa thông tin cá nhân, upload avatar, đổi mật khẩu, thống kê sử dụng | Trang Profile |
| 4.13 | Trang Billing | So sánh gói, thanh toán Stripe, lịch sử giao dịch, quản lý subscription | Trang Billing |
| 4.14 | Trang Dashboard | Card thống kê, biểu đồ sử dụng (Chart.js), nội dung gần đây, thông báo mới | Trang Dashboard |
| 4.15 | Trang Notifications | Danh sách thông báo, đánh dấu đã đọc, lọc theo loại | Trang Notifications |
| 4.16 | Trang Admin | Dashboard admin (stats, charts), quản lý user/content/template/category/plan/payment/model/settings/audit-log | 10 trang Admin |

### Giai đoạn 5 – Tích hợp & Testing

| # | Công việc | Chi tiết | Output |
|---|-----------|----------|--------|
| 5.1 | Kết nối Frontend ↔ Backend | Kết nối toàn bộ API calls từ frontend → backend. Xử lý loading, error states, toast messages | Full-stack hoạt động |
| 5.2 | Docker Compose | Viết `docker-compose.yml` chạy frontend + backend + MongoDB cùng lúc | 1 lệnh `docker-compose up` |
| 5.3 | Test chức năng | Test thủ công toàn bộ user flows: đăng ký → đăng nhập → sinh nội dung → kiểm tra đạo văn → thanh toán → admin | Checklist test |
| 5.4 | Fix bugs & polish | Sửa lỗi, cải thiện UX, responsive check, performance | Ứng dụng hoàn chỉnh |

### Giai đoạn 6 – Deploy & Báo cáo

| # | Công việc | Chi tiết | Output |
|---|-----------|----------|--------|
| 6.1 | Deploy Backend | Deploy lên cloud server (Railway / Render / VPS). Cấu hình environment variables, MongoDB Atlas | Backend live URL |
| 6.2 | Deploy Frontend | Deploy lên Vercel. Cấu hình `NEXT_PUBLIC_API_URL` trỏ về backend | Frontend live URL |
| 6.3 | Viết báo cáo đồ án | Viết báo cáo theo mẫu: giới thiệu, phân tích, thiết kế, triển khai, kết quả, kết luận | File báo cáo Word/PDF |
| 6.4 | Chuẩn bị demo | Chuẩn bị slide thuyết trình, demo live ứng dụng, quay video demo | Slide + Video |
