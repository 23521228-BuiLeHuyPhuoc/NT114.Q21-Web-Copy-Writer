# AI Copywriter – Báo Cáo Đồ Án

## Thông Tin Đồ Án

- **Đề tài:** Website hỗ trợ viết nội dung bằng AI (AI Copywriter)
- **Môn học:** NT114.Q21
- **Thực hiện:** Bùi Lê Huy Phước
- **Mô tả:** Xây dựng website tích hợp GPT-4 / Llama để sinh nội dung tự động (blog, quảng cáo, email marketing, mô tả sản phẩm, …). Hệ thống cung cấp API RESTful cho AI model xử lý nội dung trên backend, đồng thời hỗ trợ fine-tuning (tinh chỉnh model) để phù hợp với ngành nghề cụ thể. Ngoài ra, hệ thống tích hợp **7 tính năng nâng cao** bao gồm:
  - RAG, NLP Analytics, Plagiarism Detection, Elasticsearch, Redis Caching, BullMQ + CI/CD
  - *(Xem chi tiết tại [Mục 7 – Tính Năng Nâng Cao](#7-tính-năng-nâng-cao-advanced-features-))*

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
| **D3.js / word-cloud** | Vẽ word cloud cho keyword analysis |

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
| **BullMQ + Redis** | Message queue xử lý background jobs (fine-tuning, bulk generation, analytics) |
| **Elasticsearch** | Full-text search engine hỗ trợ tiếng Việt (tìm kiếm nội dung, template) |
| **natural / compromise** | Thư viện NLP: tokenization, sentiment analysis, readability scoring |
| **pdf-parse / mammoth** | Trích xuất nội dung từ PDF/DOCX phục vụ RAG pipeline |
| **@pinecone-database/pinecone** | Vector database lưu trữ embeddings cho RAG (Retrieval-Augmented Generation) |
| **openai (Embeddings API)** | Tạo vector embeddings từ text cho semantic search trong RAG |
| **plagiarism-checker / copyscape API** | Kiểm tra đạo văn nội dung AI sinh ra |

### 1.3 Database & DevOps

| Công nghệ | Vai trò |
|-----------|---------|
| **MongoDB** | Cơ sở dữ liệu NoSQL lưu trữ toàn bộ dữ liệu |
| **MongoDB Atlas** | Hosting MongoDB trên cloud |
| **Redis (AWS ElastiCache / local)** | In-memory data store cho caching, session, message queue |
| **Elasticsearch (Elastic Cloud / local)** | Search engine cho full-text search tiếng Việt |
| **Pinecone / Qdrant** | Vector database cho RAG embeddings |
| **Docker + Docker Compose** | Container hoá ứng dụng, môi trường phát triển |
| **Vercel** | Deploy frontend (Next.js) |
| **GitHub Actions** | CI/CD pipeline: lint, test, build, deploy tự động |
| **yarn** | Package manager (thay npm) cho cả client và server |

### 1.4 Hướng Tiếp Cận AI

| Hướng | Mô tả |
|-------|-------|
| **Tích hợp GPT-4** | Gọi OpenAI API (ChatCompletion) với system prompt được thiết kế riêng cho từng loại nội dung copywriting |
| **Tích hợp Llama** | Chạy Llama model qua Ollama local, cung cấp lựa chọn model miễn phí cho user |
| **API RESTful cho AI** | Xây dựng endpoint `POST /api/content/generate` nhận yêu cầu, gọi model AI, streaming response về client |
| **Fine-tuning** | Upload dataset huấn luyện → gọi OpenAI Fine-tuning API hoặc fine-tune Llama local → tạo model chuyên biệt theo ngành (bất động sản, thời trang, công nghệ, …) |
| **RAG (Retrieval-Augmented Generation)** | User upload tài liệu (PDF/DOCX/TXT) → trích xuất text → tạo embeddings (OpenAI Embeddings API) → lưu vào vector database (Pinecone) → khi sinh nội dung, truy vấn semantic search để lấy context liên quan → đưa vào prompt AI → sinh nội dung chính xác dựa trên tài liệu tham khảo |
| **NLP Content Analytics** | Phân tích nội dung đã sinh: readability score (Flesch-Kincaid, Coleman-Liau), sentiment analysis (positive/negative/neutral), keyword density, SEO score, đề xuất cải thiện |
| **AI Plagiarism Detection** | So sánh nội dung sinh ra với cơ sở dữ liệu nội dung đã tạo + web scraping → tính tỉ lệ trùng lặp (cosine similarity trên embeddings) → cảnh báo nếu vượt ngưỡng |
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

### 2.3 Server (Express.js) – Cấu Trúc Thư Mục

```
server/
├── src/
│   ├── config/                 # Cấu hình ứng dụng (database, cloudinary, passport, redis, elasticsearch, ...)
│   ├── models/                 # Mongoose schemas & models (User, Content, Template, Document, ...)
│   ├── routes/                 # Định nghĩa API routes (authRoutes, contentRoutes, ragRoutes, analyticsRoutes, ...)
│   ├── controllers/            # Xử lý logic từng route (authController, contentController, ragController, ...)
│   ├── services/               # Business logic (aiService, ragService, nlpService, plagiarismService, searchService, ...)
│   ├── middlewares/            # Middleware (auth, role, validate, upload, rateLimiter, cache, errorHandler)
│   ├── validations/            # Joi validation schemas (authValidation, contentValidation, ragValidation, ...)
│   ├── jobs/                   # BullMQ job processors (fineTuneJob, embeddingJob, analyticsJob, bulkGenerateJob)
│   ├── utils/                  # Hàm tiện ích (regex patterns, email sender, token generator, ...)
│   └── app.js                  # Entry point – khởi tạo Express, Redis, Elasticsearch, mount routes
├── uploads/                    # Thư mục tạm lưu file upload trước khi đẩy lên Cloudinary
├── .env.example                # Mẫu biến môi trường
├── package.json                # Dependencies & scripts
├── yarn.lock                   # Lock file (yarn)
└── Dockerfile                  # Docker build cho server
```

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
| `/knowledge-base` RAG Knowledge Base | **[TÍNH NĂNG NÂNG CAO]** Upload tài liệu tham khảo (PDF/DOCX/TXT) → hệ thống trích xuất text → tạo embeddings → lưu vào vector database. Quản lý tài liệu: xem, xóa, tìm kiếm. Mỗi tài liệu hiển thị: số chunks, kích thước, ngày upload. Khi sinh nội dung, chọn Knowledge Base để AI tham chiếu tài liệu → RAG pipeline tự động truy vấn context liên quan |
| `/analytics` Content Analytics | **[TÍNH NĂNG NÂNG CAO]** Dashboard phân tích NLP cho nội dung: Readability Score (Flesch-Kincaid, Coleman-Liau index), Sentiment Analysis (biểu đồ positive/negative/neutral), Keyword Density (word cloud + bảng tần suất), SEO Score (meta analysis, heading structure, keyword optimization). So sánh chất lượng giữa các model AI. Đề xuất cải thiện nội dung bằng AI |
| `/plagiarism-check` Plagiarism Detection | **[TÍNH NĂNG NÂNG CAO]** Kiểm tra đạo văn nội dung: paste hoặc chọn nội dung đã tạo → hệ thống tính cosine similarity với database nội dung + web sources → hiển thị tỉ lệ trùng lặp (%), highlight đoạn trùng, nguồn gốc. Lịch sử kiểm tra. Tích hợp nút kiểm tra ngay sau khi sinh nội dung |
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

### 4.6 API RAG – Knowledge Base (`/api/rag`) ⭐ NÂNG CAO

| Công việc | Mô tả |
|-----------|-------|
| Upload tài liệu | `POST /documents` nhận file PDF/DOCX/TXT (qua **Multer**) → **pdf-parse** / **mammoth** trích xuất text → chia thành chunks (mỗi chunk 500 tokens, overlap 100 tokens giữa các chunk liên tiếp) → gọi **OpenAI Embeddings API** (`text-embedding-3-small`) tạo vector embeddings cho mỗi chunk → lưu embeddings vào **Pinecone** vector database → lưu metadata vào MongoDB (collection Documents) → trả kết quả |
| Quản lý tài liệu | `GET /documents` danh sách tài liệu (phân trang), `GET /documents/:id` chi tiết, `DELETE /documents/:id` xóa tài liệu + xóa embeddings trong Pinecone |
| Semantic search | `POST /search` nhận query text → tạo embedding cho query → truy vấn Pinecone (top-k nearest neighbors, cosine similarity) → trả về chunks liên quan nhất kèm relevance score |
| RAG Generation | `POST /generate` nhận prompt + documentIds → truy vấn semantic search → lấy top-k context chunks → xây dựng augmented prompt: `[System] + [Retrieved Context] + [User Prompt]` → gọi AI model (GPT-4/Llama) → streaming response → lưu content với metadata RAG (sourceDocuments, chunks used) |
| Quản lý embeddings | Background job (**BullMQ**) xử lý tạo embeddings cho tài liệu lớn. Retry logic khi API lỗi. Batch processing cho nhiều chunks |

### 4.7 API NLP Content Analytics (`/api/analytics`) ⭐ NÂNG CAO

| Công việc | Mô tả |
|-----------|-------|
| Readability analysis | `POST /readability` nhận content text → tính **Flesch-Kincaid Grade Level**, **Coleman-Liau Index**, **Gunning Fog Index**, **SMOG Index** → trả scores + interpretation (dễ đọc / trung bình / khó đọc) + đề xuất cải thiện |
| Sentiment analysis | `POST /sentiment` nhận content text → **natural** library tokenize + sentiment scoring → trả kết quả: overall sentiment (positive/negative/neutral), confidence score, sentiment breakdown theo đoạn/câu, emotion detection (joy, anger, sadness, ...) |
| Keyword extraction | `POST /keywords` nhận content text → TF-IDF analysis + NLP noun phrase extraction → trả danh sách keywords với frequency, density (%), relevance score. Hỗ trợ cả tiếng Anh và tiếng Việt (dùng regex + dictionary-based segmentation) |
| SEO scoring | `POST /seo-score` nhận content + target keyword → phân tích: keyword density, heading structure (H1-H6), meta description length, internal/external links, image alt text, content length → trả SEO score (0-100) + chi tiết từng tiêu chí + đề xuất tối ưu |
| Content comparison | `POST /compare` nhận 2+ contentIds → so sánh readability, sentiment, keyword overlap, length → trả bảng so sánh + đề xuất version tốt nhất |
| Batch analytics | Background job (**BullMQ**): khi user sinh nội dung mới → tự động chạy analytics → lưu kết quả vào ContentAnalytics collection → hiển thị trên dashboard |

### 4.8 API Plagiarism Detection (`/api/plagiarism`) ⭐ NÂNG CAO

| Công việc | Mô tả |
|-----------|-------|
| Kiểm tra đạo văn | `POST /check` nhận content text → chia thành segments → tạo embeddings → **cosine similarity** so sánh với tất cả embeddings trong database (nội dung đã tạo trước đó) → tìm segments có similarity > threshold (mặc định 0.85, cấu hình qua SystemSettings) → trả kết quả: tổng % trùng lặp, danh sách đoạn trùng kèm nguồn gốc (contentId, userId, createdAt) |
| Web plagiarism check | `POST /check-web` nhận content text → trích xuất key sentences → search Google/Bing API → scrape top results → so sánh similarity → trả nguồn web trùng lặp |
| Lịch sử kiểm tra | `GET /history` danh sách các lần kiểm tra (phân trang). `GET /history/:id` chi tiết kết quả |
| Auto-check on generate | Hook vào content generation flow: sau khi AI sinh nội dung → tự động chạy plagiarism check → lưu kết quả → cảnh báo user nếu tổng tỉ lệ trùng lặp > 20% (ngưỡng cảnh báo, cấu hình qua SystemSettings; khác với segment similarity threshold 85% ở trên – 85% dùng để xác định từng đoạn trùng, 20% là ngưỡng cảnh báo tổng thể) |

### 4.9 API Search – Elasticsearch (`/api/search`) ⭐ NÂNG CAO

| Công việc | Mô tả |
|-----------|-------|
| Full-text search | `GET /contents?q=keyword` → **Elasticsearch** query (multi_match trên title + generatedContent + tags) → hỗ trợ tiếng Việt (ICU analyzer + custom Vietnamese tokenizer) → trả kết quả với highlight matches + relevance score |
| Auto-complete / Suggestions | `GET /suggest?q=partial` → Elasticsearch completion suggester → trả gợi ý tìm kiếm real-time |
| Faceted search | `GET /contents?q=keyword&type=blog&tone=formal` → Elasticsearch aggregations → trả kết quả + facet counts (theo type, tone, language, model) |
| Index sync | Khi content được tạo/sửa/xóa trong MongoDB → **BullMQ** job đồng bộ index Elasticsearch. Bulk reindex API cho admin |
| Search analytics | Ghi log search queries → phân tích top searches, zero-result queries → cải thiện search relevance |

### 4.10 API Người Dùng (`/api/users`)

| Công việc | Mô tả |
|-----------|-------|
| Xem profile | `GET /profile` trả thông tin user đang đăng nhập |
| Cập nhật profile | `PUT /profile` validate Joi → cập nhật tên, avatar (upload ảnh → **Multer** → **Cloudinary** lưu trữ → lưu URL vào DB) |
| Đổi mật khẩu | `PUT /change-password` nhận password cũ + mới → **bcrypt.compare** password cũ → validate password mới bằng Joi (regex pattern) → **bcrypt.hash** → cập nhật |
| Thống kê sử dụng | `GET /usage` trả tổng token dùng, số nội dung, giới hạn gói |

### 4.11 API Thanh Toán (`/api/billing`)

| Công việc | Mô tả |
|-----------|-------|
| Tạo checkout session | `POST /checkout` nhận planId → Stripe.checkout.sessions.create → trả redirect URL |
| Webhook Stripe | `POST /webhook` nhận event từ Stripe → cập nhật Subscription + Payment |
| Lịch sử thanh toán | `GET /payments` danh sách thanh toán của user |
| Quản lý subscription | `GET /subscription` xem gói hiện tại, `POST /cancel` hủy subscription |

### 4.12 API Thông Báo (`/api/notifications`)

| Công việc | Mô tả |
|-----------|-------|
| Lấy thông báo | `GET /` danh sách thông báo (phân trang, lọc theo type/isRead) |
| Đánh dấu đã đọc | `PATCH /:id/read` đánh dấu 1 thông báo, `PATCH /read-all` đánh dấu tất cả |

### 4.13 API Admin (`/api/admin`)

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

### 4.14 Middleware & Tiện Ích

| Thành phần | Mô tả |
|-----------|-------|
| `auth.js` middleware | Kiểm tra JWT token trong header `Authorization: Bearer <token>` → decode → gắn `req.user`. Xử lý: token hết hạn, không hợp lệ, không có token |
| `role.js` middleware | Kiểm tra `req.user.role` có nằm trong danh sách role cho phép không. Ví dụ: `role('admin')` chỉ cho admin truy cập |
| `validate.js` middleware | Nhận **Joi** schema → validate `req.body` / `req.params` / `req.query` → trả lỗi 400 nếu không hợp lệ |
| `upload.js` middleware | Cấu hình **Multer**: storage (disk), file filter (chỉ cho phép image/csv/json), size limit (5MB ảnh, 50MB dataset) |
| `rateLimiter.js` middleware | **express-rate-limit**: giới hạn 100 req/15 phút cho API chung, 10 req/15 phút cho API sinh nội dung (tránh lạm dụng AI) |
| `errorHandler.js` middleware | Bắt tất cả lỗi → format response thống nhất `{ success: false, message, errors }` |
| `cache.js` middleware | **Redis** caching middleware: cache GET responses (TTL configurable), invalidate on POST/PUT/DELETE. Cache key = URL + query params + userId |
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

### Collection: Documents (RAG Knowledge Base) ⭐ NÂNG CAO

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| userId | ObjectId, ref | Người upload |
| fileName | String | Tên file gốc |
| fileType | String, enum | `pdf` / `docx` / `txt` |
| fileSize | Number | Kích thước file (bytes) |
| fileUrl | String | URL file trên Cloudinary / server |
| totalChunks | Number | Số chunks đã chia |
| totalTokens | Number | Tổng số tokens |
| embeddingModel | String | Model dùng tạo embeddings (`text-embedding-3-small`) |
| pineconeNamespace | String | Namespace trong Pinecone (phân tách theo user) |
| status | String, enum | `processing` / `completed` / `failed` |
| metadata | Object | `{ title, author, pageCount, language }` trích xuất từ file |
| createdAt, updatedAt | Date | Timestamps |

### Collection: DocumentChunks (RAG Chunks) ⭐ NÂNG CAO

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| documentId | ObjectId, ref | Tài liệu gốc |
| chunkIndex | Number | Thứ tự chunk |
| content | String | Nội dung text của chunk |
| tokenCount | Number | Số tokens |
| embeddingId | String | ID embedding trong Pinecone |
| metadata | Object | `{ page, section, startChar, endChar }` vị trí trong tài liệu |
| createdAt | Date | Ngày tạo |

### Collection: ContentAnalytics ⭐ NÂNG CAO

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| contentId | ObjectId, ref | Nội dung được phân tích |
| userId | ObjectId, ref | Người sở hữu |
| readability | Object | `{ fleschKincaid, colemanLiau, gunningFog, smog, avgSentenceLength, avgWordLength, interpretation }` |
| sentiment | Object | `{ overall, score, confidence, breakdown: [{ sentence, sentiment, score }], emotions: { joy, anger, sadness, ... } }` |
| keywords | [Object] | `[{ word, frequency, density, relevance }]` |
| seoScore | Object | `{ totalScore, keywordDensity, headingStructure, metaDescription, contentLength, suggestions: [...] }` |
| wordCount | Number | Tổng số từ |
| charCount | Number | Tổng số ký tự |
| analyzedAt | Date | Ngày phân tích |

### Collection: PlagiarismReports ⭐ NÂNG CAO

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| contentId | ObjectId, ref | Nội dung kiểm tra |
| userId | ObjectId, ref | Người kiểm tra |
| overallSimilarity | Number | Tỉ lệ trùng lặp tổng (%) |
| matches | [Object] | `[{ sourceContentId, sourceUserId, segment, similarity, sourceSegment }]` danh sách đoạn trùng |
| webMatches | [Object] | `[{ url, title, segment, similarity }]` nguồn web trùng |
| status | String, enum | `pending` / `completed` / `failed` |
| checkedAt | Date | Ngày kiểm tra |

### Collection: SearchLogs ⭐ NÂNG CAO

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| userId | ObjectId, ref | Người tìm kiếm |
| query | String | Từ khóa tìm kiếm |
| resultCount | Number | Số kết quả trả về |
| filters | Object | Bộ lọc đã áp dụng |
| clickedResults | [Object] | `[{ contentId, position, clickedAt }]` kết quả user click |
| responseTime | Number | Thời gian phản hồi (ms) |
| createdAt | Date | Ngày tìm kiếm |

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
| `/knowledge-base` | RAG Knowledge Base – upload & quản lý tài liệu tham khảo ⭐ |
| `/analytics` | Content Analytics – phân tích NLP nội dung ⭐ |
| `/plagiarism-check` | Plagiarism Detection – kiểm tra đạo văn ⭐ |
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

## 7. Tính Năng Nâng Cao (Advanced Features) ⭐

Các tính năng dưới đây là những thành phần **kỹ thuật khó**, thể hiện chiều sâu của đồ án và đòi hỏi kiến thức chuyên môn cao:

### 7.1 RAG – Retrieval-Augmented Generation

| Khía cạnh | Chi tiết |
|-----------|----------|
| **Vấn đề giải quyết** | AI sinh nội dung chung chung, không dựa trên dữ liệu riêng của doanh nghiệp → cần cơ chế cho AI "đọc" tài liệu tham khảo |
| **Kiến trúc** | Document Upload → Text Extraction (pdf-parse, mammoth) → Chunking (RecursiveCharacterTextSplitter, 500 tokens, overlap 100) → Embedding (OpenAI text-embedding-3-small, 1536 dimensions) → Vector Store (Pinecone) → Query Time: User Prompt → Embedding → Similarity Search (top-k=5, cosine) → Context Injection → LLM Generation |
| **Thách thức kỹ thuật** | Chunking strategy tối ưu (không cắt giữa câu), handling large documents (>50MB hoặc >200,000 tokens), embedding batch processing, vector database indexing performance, context window management (không vượt quá token limit model) |
| **Công nghệ** | OpenAI Embeddings API, Pinecone vector database, LangChain.js (DocumentLoader, TextSplitter, VectorStore, RetrievalQAChain), BullMQ (background embedding jobs) |

### 7.2 NLP Content Analytics Pipeline

| Khía cạnh | Chi tiết |
|-----------|----------|
| **Vấn đề giải quyết** | User không biết chất lượng nội dung AI sinh ra → cần phân tích tự động và đề xuất cải thiện |
| **Kiến trúc** | Content Text → NLP Pipeline: (1) Tokenization → (2) Readability Scoring (Flesch-Kincaid, Coleman-Liau, Gunning Fog, SMOG) → (3) Sentiment Analysis (lexicon-based + ML) → (4) Keyword Extraction (TF-IDF + noun phrase) → (5) SEO Scoring (rule-based) → Analytics Report + AI-powered Suggestions |
| **Thách thức kỹ thuật** | Hỗ trợ đa ngôn ngữ (tiếng Việt + tiếng Anh), Vietnamese word segmentation (không có dấu cách giữa các từ), custom sentiment lexicon cho tiếng Việt, real-time analytics (chạy song song với content generation), batch processing cho analytics dashboard |
| **Công nghệ** | natural (NLP library), compromise (English NLP), custom Vietnamese tokenizer (regex-based), TF-IDF implementation, BullMQ (background analytics jobs) |

### 7.3 AI Plagiarism Detection System

| Khía cạnh | Chi tiết |
|-----------|----------|
| **Vấn đề giải quyết** | AI có thể sinh nội dung trùng lặp với nội dung đã tạo trước đó hoặc nội dung trên web → cần phát hiện và cảnh báo |
| **Kiến trúc** | Content → Segmentation (chia thành đoạn 3-5 câu) → Embedding (OpenAI) → Cosine Similarity Search (so với database embeddings + web scraping) → Threshold Detection (>85% = trùng lặp) → Report Generation (highlight đoạn trùng, nguồn gốc, % tổng) |
| **Thách thức kỹ thuật** | Efficient similarity search trên large-scale data, fuzzy matching (paraphrased content), web scraping reliability, false positive reduction, performance optimization (tránh N×M comparison) |
| **Công nghệ** | OpenAI Embeddings, Pinecone (similarity search), cosine similarity algorithm, web scraping (cheerio + axios), BullMQ (background checking) |

### 7.4 Elasticsearch Full-text Search (Vietnamese Support)

| Khía cạnh | Chi tiết |
|-----------|----------|
| **Vấn đề giải quyết** | MongoDB text search không hỗ trợ tốt tiếng Việt, không có relevance scoring, không auto-complete → cần search engine chuyên dụng |
| **Kiến trúc** | MongoDB (source of truth) → BullMQ sync jobs → Elasticsearch Index (custom Vietnamese analyzer) → Search API (multi_match, completion suggester, aggregations) → Client (auto-complete, faceted search, highlighted results) |
| **Thách thức kỹ thuật** | Vietnamese tokenization (ICU analyzer + custom dictionary), index mapping optimization, real-time sync MongoDB ↔ Elasticsearch (eventual consistency), search relevance tuning (boost fields, function_score), horizontal scaling, zero-downtime reindexing |
| **Công nghệ** | Elasticsearch 8.x, @elastic/elasticsearch (Node.js client), ICU Analysis plugin, BullMQ (index sync), Redis (search cache) |

### 7.5 Redis Caching & Session Management

| Khía cạnh | Chi tiết |
|-----------|----------|
| **Vấn đề giải quyết** | Nhiều API calls tốn thời gian (AI generation, analytics, search) → cần caching để giảm latency. Rate limiting cần distributed counter → Redis |
| **Kiến trúc** | Request → Redis Cache Check (hit → return cached) → miss → Process → Store in Redis (TTL) → Return. Cache invalidation: write-through (update cache on write) + TTL-based expiry |
| **Thách thức kỹ thuật** | Cache invalidation strategy (khi content thay đổi, invalidate related caches), distributed rate limiting (multiple server instances), session management (JWT blacklist for logout), memory management (eviction policies) |
| **Công nghệ** | Redis 7.x, ioredis (Node.js client), express-rate-limit + rate-limit-redis, connect-redis (session store) |

### 7.6 Background Job Processing (BullMQ)

| Khía cạnh | Chi tiết |
|-----------|----------|
| **Vấn đề giải quyết** | Fine-tuning, embedding generation, analytics, email sending là long-running tasks → không thể chạy synchronous trong API request → cần background job queue |
| **Kiến trúc** | API Request → Add Job to Queue (BullMQ + Redis) → Worker Process → Job Completion → Notify via Email. Queues: `embedding-queue`, `analytics-queue`, `fine-tune-queue`, `email-queue`, `search-sync-queue` |
| **Thách thức kỹ thuật** | Job retry logic (exponential backoff), dead letter queue (failed jobs), job prioritization, concurrency control, job progress tracking, horizontal scaling workers |
| **Công nghệ** | BullMQ, Redis (as message broker), Bull Board (monitoring dashboard) |

### 7.7 CI/CD Pipeline (GitHub Actions)

| Khía cạnh | Chi tiết |
|-----------|----------|
| **Vấn đề giải quyết** | Manual deployment dễ lỗi, không có automated testing → cần CI/CD pipeline |
| **Kiến trúc** | Push/PR → GitHub Actions: (1) Lint (ESLint + Prettier) → (2) Unit Tests (Jest) → (3) Integration Tests → (4) Build (Docker) → (5) Deploy (Vercel for frontend, Docker for backend) |
| **Thách thức kỹ thuật** | Multi-stage Docker builds, environment-specific configs, secrets management, parallel job execution, deployment rollback strategy, database migration automation |
| **Công nghệ** | GitHub Actions, Docker multi-stage builds, Jest (testing), ESLint + Prettier (linting), Vercel CLI (frontend deploy) |

---

