# Kế Hoạch Thực Hiện – AI Copywriter

> **Đề tài:** Website hỗ trợ viết nội dung bằng AI (AI Copywriter)
> **Môn học:** NT114.Q21 · **Thực hiện:** Bùi Lê Huy Phước

---

## 1. Tổng Quan

Xây dựng website tích hợp **GPT-4 / Llama** để sinh nội dung tự động (blog, quảng cáo, email marketing, mô tả sản phẩm, …). Cung cấp **API RESTful** cho AI model xử lý nội dung trên backend, hỗ trợ **fine-tuning** (tinh chỉnh model) theo ngành nghề cụ thể.

---

## 2. Công Nghệ Sử Dụng

### Frontend

| Công nghệ | Mục đích |
|-----------|----------|
| Next.js 14 (App Router) | Framework React – SSR/SSG, routing |
| TypeScript | Kiểm tra kiểu tĩnh |
| Tailwind CSS | Styling responsive |
| Axios | HTTP client gọi API |
| React Hook Form | Quản lý form |
| Zustand | State management |
| React Query (TanStack) | Caching & fetching server state |
| React Markdown | Render markdown từ AI |
| Chart.js / Recharts | Biểu đồ thống kê |
| React Hot Toast | Thông báo toast |
| next-auth | Xác thực JWT + Google OAuth |

### Backend

| Công nghệ | Mục đích |
|-----------|----------|
| Node.js + Express.js | API RESTful server |
| Mongoose | ODM cho MongoDB |
| bcrypt | Hash mật khẩu |
| Joi + Regex | Validate dữ liệu đầu vào |
| JWT (jsonwebtoken) | Access token / refresh token |
| Multer + Cloudinary | Upload & lưu trữ file/ảnh |
| Nodemailer | Gửi email (xác minh, reset password) |
| OpenAI SDK | Gọi API GPT-4 sinh nội dung |
| Ollama | Chạy Llama model local |
| LangChain.js | Orchestrate AI, prompt chaining |
| Passport (Google OAuth 2.0) | Đăng nhập qua Google |
| Stripe SDK | Thanh toán quốc tế |
| express-rate-limit | Giới hạn request |
| helmet + cors + morgan | Bảo mật & logging |

### Database & DevOps

| Công nghệ | Mục đích |
|-----------|----------|
| MongoDB (Atlas) | Cơ sở dữ liệu NoSQL |
| Docker + Docker Compose | Container hoá ứng dụng |
| Vercel | Deploy frontend |
| yarn | Package manager |

---

## 3. Chức Năng (10 Module)

### Module 1 – Xác Thực & Tài Khoản
- Đăng ký / đăng nhập (email + Google OAuth)
- Quên & đặt lại mật khẩu, xác minh email
- Quản lý hồ sơ cá nhân (avatar, đổi password)
- **API:** `/api/auth/*`, `/api/users/*`
- **DB:** Users, AuditLogs

### Module 2 – Sinh Nội Dung AI ⭐ _(Chức năng chính)_
- Sinh nội dung: blog, quảng cáo, email, sản phẩm, social, SEO, script, headline
- Chọn model (GPT-4 / Llama / fine-tuned), tone, ngôn ngữ, temperature
- Streaming real-time (SSE) từ AI về client
- CRUD nội dung, yêu thích, gắn tag, lịch sử phiên bản, xuất PDF/Word
- **API:** `/api/content/*`
- **DB:** Contents, UsageLogs

### Module 3 – Fine-tuning Model AI
- Upload dataset (CSV/JSON) → Multer → Cloudinary
- Tạo job fine-tuning (OpenAI API hoặc Llama local)
- Theo dõi trạng thái: pending → training → completed/failed
- Sử dụng model đã fine-tune khi sinh nội dung
- **API:** `/api/fine-tune/*`
- **DB:** FineTuneJobs

### Module 4 – Template & Danh Mục
- Template prompt có biến `{{variable}}`, tái sử dụng
- Template hệ thống (admin) + template cá nhân (user)
- Danh mục phân cấp (parent → child)
- **API:** `/api/templates/*`, `/api/admin/categories`
- **DB:** Templates, Categories

### Module 5 – Quản Lý Dự Án
- Tạo dự án, gán nội dung vào dự án, lưu trữ (archive)
- **API:** `/api/projects/*`
- **DB:** Projects

### Module 6 – Thanh Toán & Gói Dịch Vụ
- 3 gói: Free / Pro / Enterprise (giới hạn token, model, dự án)
- Tích hợp Stripe: checkout, webhook, quản lý subscription
- **API:** `/api/billing/*`
- **DB:** Plans, Subscriptions, Payments

### Module 7 – Thông Báo
- Thông báo hệ thống, thanh toán, fine-tuning, tài khoản
- Đánh dấu đã đọc / đọc tất cả
- **API:** `/api/notifications/*`
- **DB:** Notifications

### Module 8 – Trang Công Khai
- Landing page: giới thiệu, tính năng, bảng giá, testimonials
- Trang liên hệ (gửi email qua Nodemailer)

### Module 9 – Dashboard Người Dùng
- Thống kê: nội dung đã tạo, token đã dùng, gói hiện tại
- Biểu đồ sử dụng (Chart.js), nội dung gần đây, thông báo

### Module 10 – Quản Trị Admin
- Dashboard: tổng user, nội dung, doanh thu, biểu đồ tăng trưởng
- Quản lý: user, nội dung, template, danh mục, gói dịch vụ, thanh toán, model AI
- Cài đặt hệ thống, nhật ký audit log
- **API:** `/api/admin/*`
- **DB:** SystemSettings, AuditLogs

---

## 4. Cấu Trúc Thư Mục

```
ai-copywriter/
├── client/                  # Frontend – Next.js 14
│   └── src/
│       ├── app/             # Routes (auth, public, user, admin)
│       ├── components/      # UI, layout, forms, charts
│       ├── hooks/           # Custom hooks
│       ├── lib/             # Axios, auth, utils
│       ├── services/        # Gọi API backend
│       ├── stores/          # Zustand stores
│       ├── types/           # TypeScript types
│       └── constants/       # Hằng số
├── server/                  # Backend – Express.js
│   └── src/
│       ├── config/          # DB, cloudinary, passport
│       ├── models/          # Mongoose schemas
│       ├── routes/          # API routes
│       ├── controllers/     # Xử lý logic
│       ├── services/        # AI, GPT, Llama, fine-tune
│       ├── middlewares/     # Auth, role, validate, upload, rate limit
│       ├── validations/     # Joi schemas
│       ├── utils/           # Regex, email, token
│       └── app.js           # Entry point
├── docker-compose.yml
└── README.md
```

---

## 5. Database – 13 Collections

| Collection | Mô tả |
|-----------|-------|
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

---

## 6. Hướng Tiếp Cận AI

| Kỹ thuật | Mô tả |
|----------|-------|
| GPT-4 (OpenAI API) | Sinh nội dung chất lượng cao qua ChatCompletion |
| Llama (Ollama local) | Model miễn phí chạy local |
| Fine-tuning | Tinh chỉnh model theo ngành nghề cụ thể |
| Prompt Engineering | System prompt riêng cho từng loại nội dung + tone + ngôn ngữ |
| LangChain.js | Orchestrate model, prompt chaining, output parsing |
| Streaming (SSE) | Server-Sent Events trả nội dung real-time |

---

## 7. Middleware & Bảo Mật

- **JWT Authentication** – access token (15 phút) + refresh token (7 ngày)
- **Role-based Access** – phân quyền user / premium / admin
- **Joi Validation** – validate toàn bộ input (body, params, query)
- **Regex Patterns** – validate email, phone, URL, slug, password, tìm kiếm
- **Rate Limiting** – 100 req/15 phút (chung), 10 req/15 phút (AI generate)
- **Helmet + CORS** – bảo mật HTTP headers
- **Multer + Cloudinary** – upload file an toàn, lưu trữ cloud
- **Error Handler** – response format thống nhất
