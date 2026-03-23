# KẾ HOẠCH ĐỒ ÁN NT114

**Tên đề tài:** Xây dựng Website AI Copywriter tích hợp GPT-4/Llama, RESTful API xử lý trên backend và Fine-tuning để tinh chỉnh mô hình với ngành nghề cụ thể

**Sinh viên thực hiện:** Bùi Lê Huy Phước. **MSSV:** 23521228

**Mô tả:** Xây dựng website tích hợp GPT-4 / Llama để sinh nội dung tự động (blog, quảng cáo, email marketing, mô tả sản phẩm, …). Hệ thống cung cấp API RESTful cho AI model xử lý nội dung trên backend, đồng thời hỗ trợ fine-tuning (tinh chỉnh model) để phù hợp với ngành nghề cụ thể. Dự án triển khai **7 tính năng kỹ thuật nâng cao** ⭐ thể hiện kiến thức chuyên sâu về thuật toán, kiến trúc hệ thống, và kỹ thuật lập trình.

---

## 1. Công nghệ sử dụng

### 1.1. Frontend

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

### 1.2. Backend

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
| **Socket.IO** | WebSocket real-time notifications |

### 1.3. Database & DevOps

| Công nghệ | Vai trò |
|-----------|---------|
| **MongoDB** | Cơ sở dữ liệu NoSQL lưu trữ toàn bộ dữ liệu |
| **MongoDB Atlas** | Hosting MongoDB trên cloud |
| **Docker + Docker Compose** | Container hoá ứng dụng, môi trường phát triển |
| **Vercel** | Deploy frontend (Next.js) |
| **Jest** | Testing framework cho backend |

### 1.4. Hướng tiếp cận AI

| Hướng | Mô tả |
|-------|-------|
| **Tích hợp GPT-4** | Gọi OpenAI API (ChatCompletion) với system prompt được thiết kế riêng cho từng loại nội dung copywriting |
| **Tích hợp Llama** | Chạy Llama model qua Ollama local, cung cấp lựa chọn model miễn phí cho user |
| **API RESTful cho AI** | Xây dựng endpoint `POST /api/content/generate` nhận yêu cầu, gọi model AI, streaming response về client |
| **Fine-tuning** | Upload dataset huấn luyện → gọi OpenAI Fine-tuning API hoặc fine-tune Llama local → tạo model chuyên biệt theo ngành (bất động sản, thời trang, công nghệ, …) |
| **Prompt Engineering** | Mỗi loại nội dung (blog, quảng cáo, email, …) có system prompt riêng, kết hợp tone giọng + ngôn ngữ + template variables |
| **Streaming (SSE)** ⭐ | Sử dụng Server-Sent Events để stream nội dung từ AI về client theo thời gian thực |
| **AI Plagiarism Detection** ⭐ | So sánh nội dung bằng 4 thuật toán: Cosine Similarity (TF-IDF), Jaccard Similarity, LCS, Winnowing |
| **NLP Content Analytics** ⭐ | Phân tích nội dung: readability score (Flesch-Kincaid, Coleman-Liau, ARI), keyword density, SEO score |

---

## 2. Cấu trúc thư mục

### 2.1. Tổng quan

```
ai-copywriter/
├── client/                     # Frontend (Next.js)
├── server/                     # Backend (Express.js)
├── docker-compose.yml          # Chạy toàn bộ hệ thống
├── DOCS.md                     # Kế hoạch đồ án (file này)
└── README.md                   # Báo cáo đồ án
```

### 2.2. Client (Next.js)

```
client/
├── public/                     # Tài nguyên tĩnh (favicon, images, fonts)
├── src/
│   ├── app/                    # App Router – chứa tất cả các trang (routes)
│   │   ├── (auth)/             # Nhóm trang xác thực (login, register, forgot-password)
│   │   ├── (public)/           # Nhóm trang công khai (landing page, contact)
│   │   ├── (user)/             # Nhóm trang người dùng (dashboard, generate, contents, ...)
│   │   ├── (admin)/            # Nhóm trang quản trị admin
│   │   ├── generate/           # Trang sinh nội dung AI (SSE streaming)
│   │   ├── plagiarism/         # Trang kiểm tra đạo văn
│   │   ├── seo-analysis/       # Trang phân tích SEO
│   │   ├── templates/          # Trang template engine
│   │   ├── versions/           # Trang quản lý phiên bản
│   │   ├── layout.tsx          # Layout gốc của ứng dụng
│   │   ├── Sidebar.tsx         # Sidebar navigation component
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
├── next.config.mjs             # Cấu hình Next.js
├── tsconfig.json               # Cấu hình TypeScript
├── Dockerfile                  # Docker build cho client
└── package.json                # Dependencies & scripts
```

### 2.3. Server (Express.js)

```
server/
├── src/
│   ├── config/                 # Cấu hình ứng dụng
│   │   └── index.ts            # Config tập trung (port, DB URI, JWT secret, CORS, ...)
│   ├── models/                 # Mongoose schemas & models
│   │   ├── User.ts             # Model User (name, email, password, role, avatar, ...)
│   │   ├── Content.ts          # Model Content (title, type, prompt, generatedContent, ...)
│   │   └── index.ts            # Export tất cả models
│   ├── routes/                 # Định nghĩa API routes
│   │   ├── auth.ts             # Routes xác thực (/register, /login, /refresh, ...)
│   │   ├── content.ts          # Routes nội dung (/generate, /check-plagiarism, /analyze-seo, ...)
│   │   └── templates.ts        # Routes template (/render, /validate)
│   ├── controllers/            # Xử lý logic từng route
│   ├── services/               # Business logic
│   │   └── advanced/           # ⭐ 7 tính năng nâng cao
│   │       ├── index.ts                # Export tất cả advanced services
│   │       ├── streamingGenerator.ts   # ⭐ SSE Streaming Content Generation
│   │       ├── plagiarismDetector.ts   # ⭐ Plagiarism Detection (4 thuật toán)
│   │       ├── seoAnalyzer.ts          # ⭐ SEO Content Analysis Engine
│   │       ├── contentVersioning.ts    # ⭐ Content Version Control (Myers Diff)
│   │       ├── notificationService.ts  # ⭐ WebSocket Real-time Notifications
│   │       ├── rateLimiter.ts          # ⭐ Sliding Window Rate Limiting
│   │       └── templateEngine.ts       # ⭐ Template Engine (Custom DSL Parser)
│   ├── middlewares/            # Middleware
│   │   ├── auth.ts             # JWT authentication middleware
│   │   └── errorHandler.ts     # Global error handler
│   ├── validations/            # Joi validation schemas
│   ├── utils/                  # Hàm tiện ích (regex patterns, email sender, token generator, ...)
│   └── index.ts                # Entry point – khởi tạo Express, kết nối DB, mount routes
├── src/__tests__/              # Unit tests (Jest)
│   ├── plagiarismDetector.test.ts   # 14 tests
│   ├── seoAnalyzer.test.ts          # 14 tests
│   ├── contentVersioning.test.ts    # 15 tests
│   ├── rateLimiter.test.ts          # 7 tests
│   └── templateEngine.test.ts       # 26 tests
├── jest.config.js              # Cấu hình Jest
├── tsconfig.json               # Cấu hình TypeScript
├── Dockerfile                  # Docker build cho server
└── package.json                # Dependencies & scripts
```

---

## 3. Chi tiết công việc Frontend

### 3.1. Trang Công Khai

| Trang | Route | Chức năng chi tiết |
|-------|-------|-------------------|
| Landing Page | `/` | Hero section giới thiệu AI Copywriter → các tính năng nổi bật (sinh nội dung, nhiều model AI, fine-tuning) → bảng giá 3 gói (Free/Pro/Enterprise) → testimonials → call-to-action đăng ký |
| Đăng nhập | `/login` | Form nhập email + password → validate bằng React Hook Form → gọi `POST /api/auth/login` → lưu JWT token → redirect dashboard. Nút đăng nhập Google OAuth. Link quên mật khẩu |
| Đăng ký | `/register` | Form nhập tên + email + password + xác nhận password → validate (email regex, password ≥ 8 ký tự) → gọi `POST /api/auth/register` → thông báo xác minh email |
| Quên mật khẩu | `/forgot-password` | Form nhập email → gọi `POST /api/auth/forgot-password` → thông báo đã gửi email |
| Đặt lại MK | `/reset-password` | Form nhập password mới + xác nhận → gọi `POST /api/auth/reset-password` với token từ URL |
| Liên hệ | `/contact` | Form liên hệ (tên, email, nội dung) → gọi API gửi email cho admin |

### 3.2. Trang Người Dùng (yêu cầu đăng nhập)

| Trang | Route | Chức năng chi tiết |
|-------|-------|-------------------|
| Dashboard | `/dashboard` | Hiển thị card tổng quan: số nội dung đã tạo, token đã dùng / giới hạn, gói hiện tại. Biểu đồ sử dụng theo ngày/tuần/tháng (Chart.js). Danh sách 5 nội dung gần đây. Nút tắt "Tạo nội dung mới". Thông báo hệ thống mới nhất |
| Sinh nội dung AI | `/generate` | **Trang chính của ứng dụng.** Form chọn loại nội dung (blog/quảng cáo/email/sản phẩm/social/SEO/script/headline) → nhập chủ đề/từ khóa/mô tả → chọn tone giọng (professional/casual/friendly/formal/humorous/persuasive/informative/urgent) → chọn ngôn ngữ → chọn model AI (GPT-4/Llama/fine-tuned) → tùy chỉnh độ dài + temperature → nhấn "Sinh nội dung". Khu vực hiển thị kết quả: **SSE streaming real-time** ⭐ (typewriter effect), chỉnh sửa trực tiếp, nút Copy/Lưu/Tạo lại |
| Quản lý nội dung | `/contents` | Bảng danh sách nội dung đã tạo với phân trang. Thanh tìm kiếm theo từ khóa (regex search). Bộ lọc: theo loại, ngày tạo, dự án, yêu thích. Sắp xếp theo ngày tạo/tên. Mỗi item: xem chi tiết, sửa, xóa, đánh dấu yêu thích, gắn tag. Xuất nội dung (Copy/PDF/Word) |
| Chi tiết nội dung | `/contents/:id` | Hiển thị đầy đủ nội dung đã sinh. Chỉnh sửa trực tiếp (editor). Lịch sử phiên bản (version history) – xem/khôi phục phiên bản cũ. Thông tin meta: model, tone, ngôn ngữ, token, ngày tạo. Nút xuất (Copy/PDF/Word) |
| Quản lý dự án | `/projects` | Danh sách dự án dạng card/grid. Tạo dự án mới (tên, mô tả). Mỗi dự án hiển thị: số nội dung, ngày tạo. Click vào → chi tiết dự án |
| Chi tiết dự án | `/projects/:id` | Thông tin dự án + danh sách nội dung trong dự án. Sửa tên/mô tả dự án. Gán/gỡ nội dung. Lưu trữ (archive) dự án |
| Template | `/templates` | Duyệt template hệ thống (admin tạo) và template cá nhân. Lọc theo danh mục (category) / loại nội dung. Tạo template tùy chỉnh: nhập tên, mô tả, prompt template với biến `{{variable}}`, khai báo biến. Chọn template → điền biến → sinh nội dung. **Live preview** ⭐ khi nhập biến |
| Fine-tuning | `/fine-tune` | Upload dataset (kéo thả file JSON/CSV) → Multer upload → Cloudinary/server lưu trữ. Tạo job fine-tuning mới: chọn base model, ngành nghề, tham số (epochs, learning rate). Bảng theo dõi jobs: trạng thái (pending/training/completed/failed). Danh sách model đã fine-tune → chọn sử dụng khi sinh nội dung |
| Kiểm tra đạo văn | `/plagiarism` | Nhập 2 văn bản → chạy 4 thuật toán (Cosine, Jaccard, LCS, Winnowing) → hiển thị kết quả dạng thanh tiến trình cho từng thuật toán + điểm tổng hợp + risk level ⭐ |
| Phân tích SEO | `/seo-analysis` | Nhập nội dung + keyword → phân tích điểm đọc hiểu (gauge chart), mật độ từ khóa (bảng), cấu trúc nội dung, đề xuất tối ưu ⭐ |
| Lịch sử phiên bản | `/versions` | So sánh 2 phiên bản nội dung → hiển thị diff (additions xanh / deletions đỏ) + thống kê thay đổi ⭐ |
| Hồ sơ cá nhân | `/profile` | Xem/cập nhật thông tin: tên, email, avatar (upload ảnh → Multer + Cloudinary). Đổi mật khẩu (nhập mật khẩu cũ + mới). Thống kê sử dụng: token đã dùng, số nội dung, gói hiện tại |
| Thanh toán | `/billing` | Hiển thị gói hiện tại + giới hạn. So sánh 3 gói (Free/Pro/Enterprise). Nút nâng cấp → Stripe checkout. Lịch sử thanh toán. Quản lý subscription (gia hạn/hủy) |
| Thông báo | `/notifications` | Danh sách thông báo (phân trang). Đánh dấu đã đọc / đọc tất cả. Lọc theo loại (system/billing/fine-tune/account). **Real-time** qua WebSocket ⭐ |

### 3.3. Trang Quản Trị Admin (yêu cầu role `admin`)

| Trang | Route | Chức năng chi tiết |
|-------|-------|-------------------|
| Dashboard Admin | `/admin` | Card tổng quan: tổng user, tổng nội dung, tổng doanh thu, user hoạt động hôm nay. Biểu đồ tăng trưởng user theo tháng. Biểu đồ doanh thu theo tháng. Thống kê AI: tổng token tiêu thụ, phân bổ theo model |
| Quản lý User | `/admin/users` | Bảng danh sách user (phân trang). Tìm kiếm theo tên/email (regex search). Lọc theo role/gói/trạng thái. Xem chi tiết user: thông tin, thống kê, lịch sử thanh toán. Hành động: kích hoạt/vô hiệu hóa, đổi role, xóa tài khoản |
| Quản lý nội dung | `/admin/contents` | Bảng tất cả nội dung trên hệ thống. Tìm kiếm, lọc theo loại/user/model. Xóa nội dung vi phạm. Thống kê nội dung theo loại, ngôn ngữ, model |
| Quản lý template | `/admin/templates` | CRUD template hệ thống (template mặc định cho tất cả user). Phân loại theo category. Duyệt/ẩn template do user tạo (nếu public) |
| Quản lý danh mục | `/admin/categories` | CRUD danh mục template. Hỗ trợ phân cấp (parent → child). Gán icon cho danh mục |
| Quản lý gói dịch vụ | `/admin/plans` | Cấu hình gói: tên, giá, giới hạn token, tính năng, model được phép, số dự án tối đa. Bật/tắt gói |
| Quản lý thanh toán | `/admin/payments` | Lịch sử thanh toán toàn hệ thống. Thống kê doanh thu theo tháng/gói. Xử lý hoàn tiền |
| Quản lý Model AI | `/admin/models` | Danh sách model (GPT-4, Llama, fine-tuned). Bật/tắt model. Cấu hình giới hạn token, giá/token cho từng model. Quản lý API key |
| Cài đặt hệ thống | `/admin/settings` | Cấu hình chung: tên site, logo (upload Cloudinary), thông tin liên hệ. Cấu hình email SMTP. Rate limiting. System prompt mặc định. Maintenance mode |
| Nhật ký hệ thống | `/admin/audit-logs` | Bảng log hành động: đăng nhập, đổi role, xóa nội dung, thay đổi cấu hình. Lọc theo thời gian/user/hành động. Xuất log |

---

## 4. Chi tiết công việc Backend

### 4.1. API Xác Thực (`/api/auth`)

| Endpoint | Method | Mô tả chi tiết |
|----------|--------|----------------|
| `/register` | POST | Nhận `name, email, password` → validate bằng **Joi** (email regex, password ≥ 8 ký tự có chữ hoa + số + ký tự đặc biệt) → kiểm tra email trùng → hash password bằng **bcrypt** (salt round 10) → lưu user vào MongoDB → gửi email xác minh qua Nodemailer → trả về thông báo |
| `/login` | POST | Nhận `email, password` → validate Joi → tìm user theo email → so sánh password bằng **bcrypt.compare()** → tạo JWT access token (15 phút) + refresh token (7 ngày) → cập nhật `lastLoginAt` → ghi AuditLog → trả token |
| `/refresh` | POST | Nhận refresh token → verify → tạo access token mới |
| `/google` | GET | Passport Google OAuth 2.0 → callback → tìm/tạo user theo googleId → tạo JWT → redirect về client |
| `/verify-email` | GET | Nhận token từ URL → verify → cập nhật `emailVerified = true` |
| `/forgot-password` | POST | Nhận email → validate Joi (email regex) → tìm user → tạo reset token (JWT 1 giờ) → gửi email chứa link reset |
| `/reset-password` | POST | Nhận token + password mới → verify token → validate password bằng Joi → hash bằng **bcrypt** → cập nhật password |

### 4.2. API Sinh Nội Dung AI (`/api/content`)

| Endpoint | Method | Mô tả chi tiết |
|----------|--------|----------------|
| `/generate` | POST | Nhận `type, prompt, tone, language, model, length, temperature` → validate bằng **Joi** → kiểm tra giới hạn token user → chọn model (GPT-4/Llama/fine-tuned) → xây dựng system prompt theo type + tone + language → gọi API (OpenAI hoặc Ollama) → **SSE streaming response** ⭐ về client → lưu content vào MongoDB → cập nhật UsageLog |
| `/` | GET | Lấy danh sách (phân trang, lọc bằng **regex** tìm kiếm từ khóa, lọc theo type/projectId/isFavorite) |
| `/:id` | GET | Chi tiết nội dung |
| `/:id` | PUT | Cập nhật nội dung (lưu version cũ vào mảng versions) |
| `/:id` | DELETE | Xóa nội dung |
| `/:id/favorite` | PATCH | Toggle isFavorite |
| `/:id/tags` | PATCH | Cập nhật mảng tags |
| `/:id/export` | GET | Xuất nội dung (query `?format=pdf\|docx`) → sinh file PDF/Word và trả về |
| `/check-plagiarism` | POST | ⭐ Kiểm tra đạo văn bằng 4 thuật toán → trả kết quả similarity |
| `/analyze-seo` | POST | ⭐ Phân tích SEO: readability, keyword density, structure |
| `/:id/version` | POST | ⭐ Lưu phiên bản mới (Myers Diff) |
| `/:id/versions/compare` | GET | ⭐ So sánh 2 phiên bản (diff output) |

### 4.3. API Template (`/api/templates`)

| Endpoint | Method | Mô tả chi tiết |
|----------|--------|----------------|
| `/` | GET | Lấy danh sách template (lọc theo category/type, tìm kiếm bằng regex) |
| `/` | POST | Tạo template mới (validate Joi: name required, variables array) |
| `/:id` | PUT | Cập nhật template |
| `/:id` | DELETE | Xóa template |
| `/render` | POST | ⭐ Render template: nhận template string + variables → **Custom DSL Parser** xử lý biến, điều kiện, vòng lặp, filters → trả kết quả |
| `/validate` | POST | ⭐ Validate cú pháp template: kiểm tra lỗi cú pháp DSL trước khi render |

### 4.4. API Dự Án (`/api/projects`)

| Endpoint | Method | Mô tả chi tiết |
|----------|--------|----------------|
| `/` | GET | Lấy danh sách dự án |
| `/` | POST | Tạo dự án (validate Joi: name required) |
| `/:id` | PUT | Cập nhật dự án |
| `/:id` | DELETE | Xóa dự án (cascade xóa liên kết content) |
| `/:id/contents` | POST | Gán/gỡ content vào project, cập nhật contentCount |

### 4.5. API Fine-tuning (`/api/fine-tune`)

| Endpoint | Method | Mô tả chi tiết |
|----------|--------|----------------|
| `/upload` | POST | **Multer** nhận file CSV/JSON → validate format + kích thước → lưu tạm `uploads/` → đẩy lên **Cloudinary** → trả URL |
| `/jobs` | POST | Tạo job fine-tuning: nhận `baseModel, industry, config` → validate Joi → gọi OpenAI Fine-tuning API hoặc Llama fine-tune script → lưu FineTuneJob (status: pending) → chạy training (background) → cập nhật status |
| `/jobs` | GET | Danh sách jobs |
| `/jobs/:id` | GET | Chi tiết job + trạng thái |
| `/models` | GET | Danh sách model đã fine-tune thành công |

### 4.6. API Người Dùng (`/api/users`)

| Endpoint | Method | Mô tả chi tiết |
|----------|--------|----------------|
| `/profile` | GET | Trả thông tin user đang đăng nhập |
| `/profile` | PUT | Validate Joi → cập nhật tên, avatar (upload ảnh → **Multer** → **Cloudinary** → lưu URL) |
| `/change-password` | PUT | Nhận password cũ + mới → **bcrypt.compare** password cũ → validate password mới bằng Joi (regex pattern) → **bcrypt.hash** → cập nhật |
| `/usage` | GET | Trả tổng token dùng, số nội dung, giới hạn gói |

### 4.7. API Thanh Toán (`/api/billing`)

| Endpoint | Method | Mô tả chi tiết |
|----------|--------|----------------|
| `/checkout` | POST | Nhận planId → Stripe.checkout.sessions.create → trả redirect URL |
| `/webhook` | POST | Nhận event từ Stripe → cập nhật Subscription + Payment |
| `/payments` | GET | Danh sách thanh toán của user |
| `/subscription` | GET | Xem gói hiện tại |
| `/cancel` | POST | Hủy subscription |

### 4.8. API Thông Báo (`/api/notifications`)

| Endpoint | Method | Mô tả chi tiết |
|----------|--------|----------------|
| `/` | GET | Danh sách thông báo (phân trang, lọc theo type/isRead) |
| `/:id/read` | PATCH | Đánh dấu 1 thông báo đã đọc |
| `/read-all` | PATCH | Đánh dấu tất cả đã đọc |
| *WebSocket* | — | ⭐ Socket.IO real-time: `notification:new`, `notification:read`, presence tracking (online/offline) |

### 4.9. API Admin (`/api/admin`)

| Endpoint | Method | Mô tả chi tiết |
|----------|--------|----------------|
| `/stats` | GET | Tổng user, tổng nội dung, doanh thu, user hoạt động |
| `/charts/users` | GET | Biểu đồ tăng trưởng user theo tháng |
| `/charts/revenue` | GET | Biểu đồ doanh thu theo tháng |
| `/charts/usage` | GET | Thống kê AI token tiêu thụ |
| `/users` | GET | Danh sách user (tìm kiếm bằng **regex**, lọc role/gói/trạng thái) |
| `/users/:id` | GET | Chi tiết user |
| `/users/:id/status` | PATCH | Kích hoạt/vô hiệu hóa |
| `/users/:id/role` | PATCH | Đổi role |
| `/users/:id` | DELETE | Xóa tài khoản |
| `/contents` | GET | Tất cả nội dung hệ thống |
| `/contents/:id` | DELETE | Xóa nội dung vi phạm |
| `/contents/stats` | GET | Thống kê nội dung theo loại, ngôn ngữ, model |
| `/payments` | GET | Tất cả thanh toán |
| `/payments/:id/refund` | POST | Hoàn tiền |
| `/models` | GET | Danh sách model AI |
| `/models/:id` | PATCH | Bật/tắt + cấu hình model |
| `/settings` | GET | Lấy tất cả cài đặt |
| `/settings/:key` | PUT | Cập nhật cài đặt → ghi AuditLog |
| `/audit-logs` | GET | Lấy log (lọc theo thời gian/user/action bằng **regex**) |

### 4.10. Middleware & Tiện Ích

| Thành phần | Mô tả chi tiết |
|-----------|----------------|
| `auth.ts` middleware | Kiểm tra JWT token trong header `Authorization: Bearer <token>` → decode → gắn `req.user`. Xử lý: token hết hạn, không hợp lệ, không có token |
| `role.js` middleware | Kiểm tra `req.user.role` có nằm trong danh sách role cho phép không. Ví dụ: `role('admin')` chỉ cho admin truy cập |
| `validate.js` middleware | Nhận **Joi** schema → validate `req.body` / `req.params` / `req.query` → trả lỗi 400 nếu không hợp lệ |
| `upload.js` middleware | Cấu hình **Multer**: storage (disk), file filter (chỉ cho phép image/csv/json), size limit (5MB ảnh, 50MB dataset) |
| `rateLimiter.ts` ⭐ | **Sliding Window Rate Limiting**: 100 req/15 phút (API chung), 10 req/15 phút (AI generate), 5 req/15 phút (Auth) |
| `errorHandler.ts` | Bắt tất cả lỗi → format response thống nhất `{ success: false, message, errors }` |
| **Regex patterns** | `EMAIL_REGEX`, `PHONE_REGEX`, `URL_REGEX`, `SLUG_REGEX`, `SEARCH_REGEX(keyword)`, `PASSWORD_REGEX` |

---

## 5. Thiết kế Database (MongoDB)

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

### Collection: Projects

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| userId | ObjectId, ref | Người tạo |
| name | String | Tên dự án |
| description | String | Mô tả |
| contentCount | Number | Số nội dung |
| isArchived | Boolean | Đã lưu trữ |
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

### Collection: PlagiarismReports ⭐

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| contentId | ObjectId, ref | Nội dung được kiểm tra |
| userId | ObjectId, ref | Người yêu cầu |
| overallScore | Number | Điểm tổng hợp (0-100%) |
| algorithms | Object | `{ cosine, jaccard, lcs, winnowing }` – điểm từng thuật toán |
| riskLevel | String, enum | `low` / `medium` / `high` / `critical` |
| matchedSegments | [Object] | `[{ text, source, similarity }]` đoạn trùng lặp |
| createdAt | Date | Ngày kiểm tra |

---

## 6. Module Chức năng (10 module)

### Module 1 – Xác Thực & Tài Khoản

+ Đăng ký / đăng nhập (email + Google OAuth)
+ Quên & đặt lại mật khẩu, xác minh email
+ Quản lý hồ sơ cá nhân (avatar, đổi password)
+ JWT access token (15 phút) + refresh token (7 ngày)
+ API: `/api/auth/*`, `/api/users/*`
+ DB: Users, AuditLogs

### Module 2 – Sinh Nội Dung AI

+ Sinh nội dung: blog, quảng cáo, email, sản phẩm, social, SEO, script, headline
+ Chọn model (GPT-4 / Llama / fine-tuned), tone, ngôn ngữ, temperature
+ **Streaming real-time (SSE)** ⭐ từ AI về client (typewriter effect, 20-80ms/word)
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
+ **Custom DSL Parser** ⭐: hỗ trợ `{{#if}}`, `{{#each}}`, `{{var | filter}}`
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
+ **WebSocket real-time** ⭐ qua Socket.IO (room-based, presence tracking)
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

Dự án triển khai **7 tính năng kỹ thuật nâng cao**, thể hiện kiến thức chuyên sâu về thuật toán, kiến trúc hệ thống, và kỹ thuật lập trình:

### 7.1. Real-time Streaming Content Generation (SSE) — ⭐⭐⭐⭐⭐

**Vấn đề:** User phải chờ AI sinh xong toàn bộ nội dung → trải nghiệm kém, không biết hệ thống có đang xử lý hay không.

**Giải pháp:** Triển khai Server-Sent Events (SSE) để stream nội dung AI theo thời gian thực, hiển thị từng từ một (giống ChatGPT).

+ **Kỹ thuật:** Server-Sent Events (SSE), EventEmitter pattern, back-pressure handling
+ **File:** `server/src/services/advanced/streamingGenerator.ts`
+ **API:** `POST /api/content/generate` → SSE stream
+ **Chi tiết triển khai:**
  - Stream nội dung word-by-word với delay thực tế (20-80ms mỗi từ)
  - Hỗ trợ 8 loại nội dung: blog, quảng cáo, email, mô tả sản phẩm, social media, SEO, script, headline
  - Progress tracking và abort/cancel mid-stream
  - Connection management với auto-cleanup khi client disconnect
  - Client sử dụng `ReadableStream` API để nhận từng chunk → tạo hiệu ứng typewriter trên UI

### 7.2. Plagiarism Detection Engine (4 thuật toán) — ⭐⭐⭐⭐⭐

**Vấn đề:** AI có thể sinh nội dung trùng lặp hoặc sao chép → cần phát hiện và cảnh báo người dùng.

**Giải pháp:** Engine phát hiện đạo văn sử dụng 4 thuật toán NLP/Text Similarity, tính điểm tổng hợp bằng weighted average.

+ **File:** `server/src/services/advanced/plagiarismDetector.ts`
+ **API:** `POST /api/content/check-plagiarism`
+ **Thuật toán chi tiết:**
  1. **Cosine Similarity (TF-IDF):** Xây dựng TF-IDF vectors cho 2 văn bản → tính cosine angle giữa 2 vectors. Công thức: `cos(θ) = (A · B) / (||A|| × ||B||)`. Ưu điểm: hiệu quả với văn bản dài, không phụ thuộc độ dài.
  2. **Jaccard Similarity (N-gram):** Tách văn bản thành tập hợp n-gram (bigram, trigram) → tính tỷ lệ giao/hợp. Công thức: `J(A,B) = |A ∩ B| / |A ∪ B|`. Ưu điểm: phát hiện sao chép có thay đổi nhỏ.
  3. **Longest Common Subsequence (LCS):** Thuật toán Dynamic Programming tìm chuỗi con chung dài nhất. Độ phức tạp: O(m × n) thời gian, tối ưu space O(min(m,n)). Ưu điểm: phát hiện sao chép có thêm/bớt từ.
  4. **Winnowing Algorithm (Document Fingerprinting):** Tạo fingerprint cho document bằng rolling hash (Rabin-Karp) + sliding window. So sánh fingerprint sets. Ưu điểm: hiệu quả với văn bản rất dài, sử dụng bởi MOSS (Stanford).
+ **Kết quả:** Điểm tổng hợp (weighted average: Cosine 30%, Jaccard 25%, LCS 25%, Winnowing 20%), risk level (low/medium/high/critical), matched segments
+ **Tests:** 14 unit tests

### 7.3. SEO Content Analysis Engine — ⭐⭐⭐⭐⭐

**Vấn đề:** Nội dung AI sinh ra cần được tối ưu SEO để đạt ranking cao trên Google.

**Giải pháp:** Engine phân tích SEO toàn diện sử dụng nhiều công thức readability và NLP.

+ **File:** `server/src/services/advanced/seoAnalyzer.ts`
+ **API:** `POST /api/content/analyze-seo`
+ **Công thức Readability:**
  1. **Flesch-Kincaid Grade Level:** `0.39 × (words/sentences) + 11.8 × (syllables/words) - 15.59` — Trả về grade level cần thiết để đọc hiểu văn bản
  2. **Flesch Reading Ease:** `206.835 - 1.015 × (words/sentences) - 84.6 × (syllables/words)` — Điểm 0-100, càng cao càng dễ đọc (60-70 = tối ưu cho SEO)
  3. **Coleman-Liau Index:** `0.0588 × L - 0.296 × S - 15.8` (L = avg letters per 100 words, S = avg sentences per 100 words)
  4. **Automated Readability Index (ARI):** `4.71 × (chars/words) + 0.5 × (words/sentences) - 21.43`
+ **Phân tích khác:**
  - Keyword density analysis với TF-IDF ranking
  - Co-occurrence analysis cho gợi ý keyword liên quan
  - Content structure analysis (headings, lists, links, images)
  - Passive voice detection, transition word analysis
  - Vocabulary richness (unique words / total words ratio)
+ **Tests:** 14 unit tests

### 7.4. Content Version Control with Diff — ⭐⭐⭐⭐

**Vấn đề:** User chỉnh sửa nội dung nhiều lần → cần quản lý phiên bản, so sánh thay đổi, khôi phục phiên bản cũ.

**Giải pháp:** Hệ thống quản lý phiên bản nội dung giống Git, sử dụng Myers Diff Algorithm.

+ **File:** `server/src/services/advanced/contentVersioning.ts`
+ **API:** `POST /api/content/:id/version`, `GET /api/content/:id/versions/compare`
+ **Thuật toán chi tiết:**
  - **Myers Diff Algorithm** (thuật toán diff của Git): Tìm shortest edit script giữa 2 version bằng cách tìm đường đi ngắn nhất trên edit graph. Độ phức tạp: O(ND) trong đó N = tổng độ dài 2 chuỗi, D = edit distance.
  - **Three-way Merge:** Merge 2 branch content từ common base, detect conflicts tự động
  - **Delta Storage:** Chỉ lưu diff (additions/deletions) thay vì full content → tiết kiệm bộ nhớ
  - **Unified Diff Format:** Tạo output diff giống `git diff` (lines bắt đầu bằng `+` / `-`)
+ **Tests:** 15 unit tests

### 7.5. WebSocket Real-time Notifications — ⭐⭐⭐⭐

**Vấn đề:** Thông báo polling (HTTP request mỗi vài giây) tốn tài nguyên, không real-time.

**Giải pháp:** Hệ thống thông báo real-time bidirectional sử dụng Socket.IO.

+ **File:** `server/src/services/advanced/notificationService.ts`
+ **Kỹ thuật chi tiết:**
  - User-specific notification channels (room-based): mỗi user join room riêng `user:{userId}`
  - Broadcast notifications (admin → all users): gửi thông báo hệ thống
  - Project collaboration rooms: nhiều user cùng xem 1 dự án
  - Presence tracking (online/offline status): theo dõi user đang online
  - WebSocket event rate limiting (30 events/10s/socket): chống spam
  - Authentication middleware cho WebSocket connections: verify JWT token
  - Automatic reconnection và connection management: xử lý mất kết nối

### 7.6. Sliding Window Rate Limiting Algorithm — ⭐⭐⭐⭐

**Vấn đề:** Fixed window rate limiting có vấn đề burst tại ranh giới 2 windows (user gửi tối đa request ở cuối window cũ + đầu window mới).

**Giải pháp:** Triển khai thuật toán Sliding Window, chính xác hơn fixed window.

+ **File:** `server/src/services/advanced/rateLimiter.ts`
+ **Thuật toán chi tiết:**
  - **Công thức:** `effectiveCount = previousWindowCount × overlapPercentage + currentWindowCount`
  - `overlapPercentage = (windowMs - elapsedInCurrentWindow) / windowMs`
  - Amortized O(1) time complexity, O(n) space (n = số key)
+ **Tính năng:**
  - Standard rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
  - Configurable key generator, skip failed requests
  - Auto-cleanup expired entries (setInterval mỗi window period)
  - Per-key reset capability
  - 3 pre-configured limiters:
    - **API limiter:** 100 requests / 15 phút
    - **AI Generation limiter:** 10 requests / 15 phút
    - **Auth limiter:** 5 requests / 15 phút
+ **Tests:** 7 unit tests

### 7.7. Template Engine with Custom DSL Parser — ⭐⭐⭐⭐⭐

**Vấn đề:** Template đơn giản (replace `{{variable}}`) không đủ cho nội dung phức tạp cần logic (if/else, loops, filters).

**Giải pháp:** Mini programming language implementation với full lexer, parser, và evaluator pipeline.

+ **File:** `server/src/services/advanced/templateEngine.ts`
+ **API:** `POST /api/templates/render`, `POST /api/templates/validate`
+ **Pipeline xử lý (Compiler concepts):**
  1. **Lexical Analysis (Tokenizer):** Quét template string → tách thành tokens (TEXT, VARIABLE, IF, ELSE, ENDIF, EACH, ENDEACH, ...)
  2. **Syntax Analysis (Parser):** Tokens → Abstract Syntax Tree (AST). Xây dựng cây cú pháp với TextNode, VariableNode, IfNode, EachNode
  3. **Evaluation:** Duyệt AST → resolve variables, đánh giá conditions, thực thi loops, áp dụng filters → trả kết quả string
+ **Tính năng DSL:**
  - **Variable interpolation:** `{{variable}}`, `{{user.name}}` (dot notation cho nested objects)
  - **Conditionals:** `{{#if condition}}...{{else}}...{{/if}}` — hỗ trợ truthy/falsy check
  - **Loops:** `{{#each items as item}}...{{/each}}` với biến meta `@index`, `@first`, `@last`
  - **Filters/Pipes:** `{{variable | uppercase}}`, `{{title | slug}}`, `{{content | truncate}}`
  - **10 built-in filters:** uppercase, lowercase, capitalize, trim, truncate (100 chars), slug, reverse, wordcount, sentencecase, striphtml
+ **Tests:** 26 unit tests

---

## 8. Tổng hợp Tests

| Tính năng | File test | Số tests | Trạng thái |
|-----------|-----------|----------|------------|
| Plagiarism Detection (4 thuật toán) | `plagiarismDetector.test.ts` | 14 | ✅ Pass |
| SEO Analysis (4 công thức readability) | `seoAnalyzer.test.ts` | 14 | ✅ Pass |
| Content Versioning (Myers Diff) | `contentVersioning.test.ts` | 15 | ✅ Pass |
| Rate Limiter (Sliding Window) | `rateLimiter.test.ts` | 7 | ✅ Pass |
| Template Engine (Custom DSL) | `templateEngine.test.ts` | 26 | ✅ Pass |
| **Tổng cộng** | | **76 tests** | **✅ All Pass** |

---

## 9. Hướng dẫn chạy dự án

### Chạy bằng Docker Compose (khuyên dùng)
```bash
docker-compose up -d         # Khởi chạy MongoDB + Server + Client
# Server: http://localhost:5000
# Client: http://localhost:3000
```

### Chạy thủ công

```bash
# Terminal 1 – Backend
cd server
npm install
npm run dev          # Development mode (port 5000)
npm test             # Chạy 76 tests
npm run build        # Build production

# Terminal 2 – Frontend
cd client
npm install
npm run dev          # Development mode (port 3000)
npm run build        # Build production
```

### Biến môi trường (server)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-copywriter
JWT_SECRET=<secret>
JWT_REFRESH_SECRET=<refresh-secret>
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
OPENAI_API_KEY=<api-key>          # Cho GPT-4
OLLAMA_BASE_URL=http://localhost:11434  # Cho Llama local
```

---

## 10. Kế hoạch thực hiện

### Giai đoạn 1 — Nền tảng (Tuần 1-3)
- [x] Thiết kế kiến trúc hệ thống, cấu trúc thư mục
- [x] Cài đặt project (Next.js, Express.js, TypeScript, Docker Compose)
- [x] Thiết kế Database MongoDB (13 collections)
- [ ] Module 1: Xác thực (JWT, Google OAuth, bcrypt, Joi validation)
- [ ] Module 8: Trang công khai (Landing page, Contact)

### Giai đoạn 2 — Core Features (Tuần 4-7)
- [ ] Module 2: Sinh nội dung AI (GPT-4, Llama, prompt engineering)
- [x] ⭐ Tính năng 1: SSE Streaming real-time
- [ ] Module 3: Fine-tuning model AI (upload dataset, training jobs)
- [ ] Module 4: Template & Danh mục
- [x] ⭐ Tính năng 7: Template Engine (Custom DSL Parser)

### Giai đoạn 3 — Advanced Features (Tuần 8-11)
- [x] ⭐ Tính năng 2: Plagiarism Detection (4 thuật toán)
- [x] ⭐ Tính năng 3: SEO Content Analysis Engine
- [x] ⭐ Tính năng 4: Content Version Control (Myers Diff)
- [x] ⭐ Tính năng 5: WebSocket Notifications (Socket.IO)
- [x] ⭐ Tính năng 6: Sliding Window Rate Limiting

### Giai đoạn 4 — Business & Admin (Tuần 12-14)
- [ ] Module 5: Quản lý dự án
- [ ] Module 6: Thanh toán Stripe
- [ ] Module 7: Thông báo (email + real-time)
- [ ] Module 9: Dashboard người dùng (Chart.js)
- [ ] Module 10: Quản trị Admin

### Giai đoạn 5 — Hoàn thiện (Tuần 15-16)
- [x] Viết unit tests (76 tests, 5 test suites)
- [ ] UI/UX polish, responsive design
- [ ] Performance optimization
- [ ] Deploy (Vercel + cloud server)
- [ ] Viết báo cáo đồ án

---
