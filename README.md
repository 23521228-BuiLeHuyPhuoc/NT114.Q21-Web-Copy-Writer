# KẾ HOẠCH THỰC THI ĐỒ ÁN – AI COPYWRITER (NT114)

> Tài liệu này mô tả chi tiết **kế hoạch công việc** từ Figma → Database → Backend → Frontend → Tích hợp → Deploy.
> Nội dung kỹ thuật tham chiếu từ **DOCS.md** (kế hoạch đồ án chính).

**Tên đề tài:** Xây dựng Website AI Copywriter tích hợp GPT-4/Llama, RESTful API xử lý trên backend và Fine-tuning để tinh chỉnh mô hình với ngành nghề cụ thể

**Sinh viên:** Bùi Lê Huy Phước – **MSSV:** 23521228

**Tính năng nâng cao duy nhất:** AI Plagiarism Detection ⭐ – So sánh nội dung bằng cosine similarity trên embeddings → phát hiện đoạn trùng lặp → cảnh báo nếu vượt ngưỡng.

---

## Mục lục

1. [Tổng quan giai đoạn](#1-tổng-quan-giai-đoạn)
2. [Giai đoạn 1 – Thiết kế Figma](#2-giai-đoạn-1--thiết-kế-figma)
3. [Giai đoạn 2 – Thiết kế Database](#3-giai-đoạn-2--thiết-kế-database)
4. [Giai đoạn 3 – Dựng Backend (Express.js)](#4-giai-đoạn-3--dựng-backend-expressjs)
5. [Giai đoạn 4 – Dựng Frontend (Next.js)](#5-giai-đoạn-4--dựng-frontend-nextjs)
6. [Giai đoạn 5 – Tích hợp AI & Plagiarism Detection ⭐](#6-giai-đoạn-5--tích-hợp-ai--plagiarism-detection-)
7. [Giai đoạn 6 – Docker, Deploy & Hoàn thiện](#7-giai-đoạn-6--docker-deploy--hoàn-thiện)

---

## 1. Tổng quan giai đoạn

| Giai đoạn | Tên | Mô tả ngắn | Thời lượng dự kiến |
|-----------|-----|-------------|-------------------|
| 1 | Thiết kế Figma | Wireframe + UI toàn bộ trang | 1–2 tuần |
| 2 | Thiết kế Database | Schema MongoDB, quan hệ, index | 3–4 ngày |
| 3 | Dựng Backend | Express.js API, middleware, routes | 3–4 tuần |
| 4 | Dựng Frontend | Next.js pages, components, API call | 3–4 tuần |
| 5 | Tích hợp AI & Plagiarism ⭐ | GPT-4, Llama, SSE, Fine-tuning, Plagiarism Detection | 2–3 tuần |
| 6 | Docker, Deploy & Hoàn thiện | Containerize, test, deploy, viết báo cáo | 1–2 tuần |

---

## 2. Giai đoạn 1 – Thiết kế Figma

### 2.1. Chuẩn bị Design System

| # | Công việc | Chi tiết |
|---|-----------|----------|
| 1 | Tạo project Figma | Tạo project "AI Copywriter", thêm các page theo nhóm |
| 2 | Định nghĩa Color Palette | Primary, secondary, accent, neutral, success/warning/error |
| 3 | Định nghĩa Typography | Font family, font sizes (h1–h6, body, caption), line-height |
| 4 | Tạo component library | Button (primary, secondary, ghost, danger), Input, Textarea, Select, Checkbox, Radio, Toggle, Badge, Avatar, Card, Modal, Table, Pagination, Toast, Tabs |
| 5 | Tạo icon set | Chọn bộ icon (Lucide/Heroicons), đưa vào Figma components |
| 6 | Tạo layout grid | 12-column grid, spacing scale (4px base), breakpoints (sm/md/lg/xl) |

### 2.2. Wireframe & UI – Trang công khai

| # | Trang | Công việc thiết kế |
|---|-------|--------------------|
| 1 | Landing page (`/`) | Hero section (headline + CTA), Features grid (6 tính năng), Bảng giá (3 gói Free/Pro/Enterprise), Testimonials, Footer |
| 2 | Đăng nhập (`/login`) | Form email + password, nút "Login with Google", link quên mật khẩu, link đăng ký |
| 3 | Đăng ký (`/register`) | Form tên + email + password + xác nhận password, nút "Register with Google" |
| 4 | Quên mật khẩu (`/forgot-password`) | Form nhập email, thông báo gửi mail |
| 5 | Đặt lại mật khẩu (`/reset-password`) | Form password mới + xác nhận, thông báo thành công |
| 6 | Liên hệ (`/contact`) | Form tên + email + message, thông tin liên hệ |

### 2.3. Wireframe & UI – Trang người dùng

| # | Trang | Công việc thiết kế |
|---|-------|--------------------|
| 1 | Layout chung | Sidebar (menu items + avatar + gói hiện tại), Header (search + notifications + profile dropdown), Main content area |
| 2 | Dashboard (`/dashboard`) | Card thống kê (nội dung đã tạo, token đã dùng, gói hiện tại), Biểu đồ sử dụng (7 ngày/30 ngày), Danh sách nội dung gần đây, Thông báo mới nhất |
| 3 | Sinh nội dung (`/generate`) | Form: chọn loại nội dung (blog/quảng cáo/email/...), chọn model (GPT-4/Llama/fine-tuned), chọn tone + ngôn ngữ, nhập prompt, nút Generate. Khu vực kết quả: hiển thị streaming text, nút Copy/Save/Regenerate |
| 4 | Quản lý nội dung (`/contents`) | Bảng danh sách (title, type, model, date, tags), Bộ lọc (type, project, favorite), Tìm kiếm, Phân trang |
| 5 | Chi tiết nội dung (`/contents/:id`) | Hiển thị nội dung đầy đủ, Thông tin meta (model, token, date), Nút Edit/Delete/Favorite/Export (PDF/Word), Lịch sử phiên bản, Gắn tag |
| 6 | Quản lý dự án (`/projects`) | Danh sách dự án (card grid), Tạo/sửa/xóa dự án, Trạng thái (active/archived) |
| 7 | Chi tiết dự án (`/projects/:id`) | Thông tin dự án, Danh sách nội dung thuộc dự án, Thêm/gỡ nội dung |
| 8 | Thư viện template (`/templates`) | Grid template cards, Phân loại theo category, Tìm kiếm, Template hệ thống (admin) + template cá nhân (user), Nút sử dụng template → điền biến → generate |
| 9 | Fine-tuning (`/fine-tune`) | Upload dataset (CSV/JSON), Tạo job fine-tuning, Bảng theo dõi jobs (pending/training/completed/failed), Chọn model đã fine-tune khi generate |
| 10 | **Plagiarism Check (`/plagiarism-check`) ⭐** | **Nhập/paste nội dung cần kiểm tra hoặc chọn content có sẵn**, **Nút "Kiểm tra đạo văn"**, **Kết quả: % similarity tổng, danh sách đoạn trùng (highlight), nguồn gốc (nội dung nào trong DB / web)**, **Mức cảnh báo: Safe (<30%) / Warning (30-85%) / Danger (>85%)**, **Lịch sử kiểm tra** |
| 11 | Hồ sơ cá nhân (`/profile`) | Avatar (upload), Thông tin cá nhân, Đổi mật khẩu, Thống kê sử dụng |
| 12 | Thanh toán (`/billing`) | Gói hiện tại, So sánh 3 gói, Nút nâng cấp → Stripe Checkout, Lịch sử thanh toán |
| 13 | Thông báo (`/notifications`) | Danh sách thông báo, Đánh dấu đã đọc / đọc tất cả, Lọc theo loại |

### 2.4. Wireframe & UI – Trang Admin

| # | Trang | Công việc thiết kế |
|---|-------|--------------------|
| 1 | Dashboard admin (`/admin`) | Card tổng quan (users, contents, revenue), Biểu đồ tăng trưởng |
| 2 | Quản lý user (`/admin/users`) | Bảng user (name, email, role, plan, status), CRUD user, Đổi role |
| 3 | Quản lý nội dung (`/admin/contents`) | Bảng nội dung toàn hệ thống, Xem chi tiết, Xóa |
| 4 | Quản lý template (`/admin/templates`) | CRUD template hệ thống, Gán category |
| 5 | Quản lý danh mục (`/admin/categories`) | CRUD danh mục phân cấp (parent → child) |
| 6 | Quản lý gói dịch vụ (`/admin/plans`) | CRUD gói Free/Pro/Enterprise, Cấu hình giới hạn |
| 7 | Quản lý thanh toán (`/admin/payments`) | Bảng lịch sử thanh toán toàn hệ thống |
| 8 | Quản lý model AI (`/admin/models`) | Danh sách model, Trạng thái, Cấu hình |
| 9 | Cài đặt hệ thống (`/admin/settings`) | Key-value settings, Bật/tắt tính năng |
| 10 | Nhật ký hệ thống (`/admin/audit-logs`) | Bảng audit log (user, action, timestamp, details) |

### 2.5. Thiết kế Responsive & Export

| # | Công việc | Chi tiết |
|---|-----------|----------|
| 1 | Responsive breakpoints | Kiểm tra responsive trên Desktop (1440px), Tablet (768px), Mobile (375px) cho mỗi trang |
| 2 | Prototype tương tác | Tạo Figma prototype: luồng đăng ký → đăng nhập → generate → plagiarism check ⭐ |
| 3 | Export assets | Export logo, icons SVG, hình ảnh cần dùng |
| 4 | Handoff cho dev | Đánh dấu spacing, color tokens, component specs cho lập trình |

---

## 3. Giai đoạn 2 – Thiết kế Database

### 3.1. Thiết kế Schema MongoDB

| # | Collection | Việc cần làm |
|---|------------|-------------|
| 1 | **Users** | Thiết kế schema: `name, email, password (hashed), role (user/premium/admin), avatar, googleId, isVerified, resetPasswordToken, refreshToken, plan (ref Plans), createdAt, updatedAt` |
| 2 | **Contents** | Schema: `userId (ref Users), title, content, contentType (enum: blog/ad/email/product/social/seo/script/headline), model (enum: gpt-4/llama/fine-tuned), prompt, tone, language, temperature, tags[], versions[] (lịch sử phiên bản), isFavorite, projectId (ref Projects), tokenUsed, createdAt, updatedAt` |
| 3 | **Templates** | Schema: `name, description, promptTemplate (chứa {{variable}}), variables[], categoryId (ref Categories), isSystem (boolean), createdBy (ref Users), createdAt, updatedAt` |
| 4 | **Categories** | Schema: `name, slug, description, parentId (ref Categories, cho phân cấp), order, createdAt` |
| 5 | **Projects** | Schema: `userId (ref Users), name, description, status (active/archived), createdAt, updatedAt` |
| 6 | **Plans** | Schema: `name (Free/Pro/Enterprise), price, tokenLimit, modelAccess[], maxProjects, features[], stripePriceId, createdAt` |
| 7 | **Subscriptions** | Schema: `userId (ref Users), planId (ref Plans), stripeSubscriptionId, status (active/canceled/expired), startDate, endDate, createdAt` |
| 8 | **Payments** | Schema: `userId (ref Users), subscriptionId (ref Subscriptions), amount, currency, stripePaymentId, status (succeeded/failed/refunded), createdAt` |
| 9 | **FineTuneJobs** | Schema: `userId (ref Users), datasetUrl, modelName, baseModel, status (pending/training/completed/failed), openaiJobId, progress, completedAt, createdAt` |
| 10 | **Notifications** | Schema: `userId (ref Users), type (system/billing/fine-tune/account), title, message, isRead, createdAt` |
| 11 | **UsageLogs** | Schema: `userId (ref Users), contentId (ref Contents), model, tokenUsed, action (generate/regenerate), createdAt` |
| 12 | **AuditLogs** | Schema: `userId (ref Users), action, resource, resourceId, details, ip, createdAt` |
| 13 | **SystemSettings** | Schema: `key (unique), value, description, updatedBy (ref Users), updatedAt` |
| 14 | **PlagiarismReports ⭐** | Schema: `userId (ref Users), contentId (ref Contents), inputText, overallSimilarity (%), matches[] {sourceContentId, sourceSnippet, matchedSnippet, similarity, sourceType (database/web)}, riskLevel (safe/warning/danger), checkedAt, createdAt` |

### 3.2. Thiết kế Index & Quan hệ

| # | Công việc | Chi tiết |
|---|-----------|----------|
| 1 | Đánh index | `Users.email` (unique), `Contents.userId + createdAt`, `Contents.contentType`, `Templates.categoryId`, `Projects.userId`, `Subscriptions.userId`, `UsageLogs.userId + createdAt`, `PlagiarismReports.userId` |
| 2 | Xác định populate paths | Users → Subscription → Plan, Content → User, Content → Project, Template → Category → Parent, PlagiarismReport → Content → User |
| 3 | Viết seed data | Tạo script seed: 1 admin, 3 Plans (Free/Pro/Enterprise), 5–10 system templates, 3–5 categories, sample system settings |

### 3.3. Tạo file models

| # | File | Việc cần làm |
|---|------|-------------|
| 1 | `backend/src/models/User.js` | Tạo Mongoose schema + model + pre-save hook (hash password) + methods (comparePassword) |
| 2 | `backend/src/models/Content.js` | Tạo schema + model + virtuals (version count) |
| 3 | `backend/src/models/Template.js` | Tạo schema + model |
| 4 | `backend/src/models/Category.js` | Tạo schema + model + static (getTree) |
| 5 | `backend/src/models/Project.js` | Tạo schema + model |
| 6 | `backend/src/models/Plan.js` | Tạo schema + model |
| 7 | `backend/src/models/Subscription.js` | Tạo schema + model |
| 8 | `backend/src/models/Payment.js` | Tạo schema + model |
| 9 | `backend/src/models/FineTuneJob.js` | Tạo schema + model |
| 10 | `backend/src/models/Notification.js` | Tạo schema + model |
| 11 | `backend/src/models/UsageLog.js` | Tạo schema + model |
| 12 | `backend/src/models/AuditLog.js` | Tạo schema + model |
| 13 | `backend/src/models/SystemSetting.js` | Tạo schema + model |
| 14 | `backend/src/models/PlagiarismReport.js` ⭐ | Tạo schema + model cho báo cáo đạo văn |
| 15 | `backend/src/models/index.js` | Export tất cả models |

---

## 4. Giai đoạn 3 – Dựng Backend (Express.js)

### 4.1. Khởi tạo project

| # | Công việc | Chi tiết |
|---|-----------|----------|
| 1 | Init project | `mkdir backend && cd backend && yarn init -y` |
| 2 | Cài dependencies | `yarn add express mongoose bcrypt jsonwebtoken joi multer cloudinary nodemailer cors helmet morgan express-rate-limit passport passport-google-oauth20 openai ollama langchain stripe dotenv` |
| 3 | Cài devDependencies | `yarn add -D nodemon` |
| 4 | Tạo cấu trúc thư mục | `src/config/`, `src/models/`, `src/routes/`, `src/controllers/`, `src/services/`, `src/middlewares/`, `src/validations/`, `src/utils/` |
| 5 | Tạo `src/app.js` | Khởi tạo Express, kết nối MongoDB, mount middleware (helmet, cors, morgan, rateLimiter), mount routes, error handler |
| 6 | Tạo `.env.example` | Liệt kê biến môi trường: `PORT, MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OPENAI_API_KEY, CLOUDINARY_*, STRIPE_*, SMTP_*` |
| 7 | Tạo `Dockerfile` | Multi-stage build cho backend |

### 4.2. Middleware & Bảo mật

| # | File | Việc cần làm |
|---|------|-------------|
| 1 | `src/middlewares/auth.js` | Xác thực JWT: verify access token từ header `Authorization: Bearer <token>`, decode userId, gắn `req.user` |
| 2 | `src/middlewares/role.js` | Kiểm tra role: `requireRole('admin')`, `requireRole('premium')` |
| 3 | `src/middlewares/validate.js` | Middleware nhận Joi schema, validate `req.body` / `req.params` / `req.query`, trả lỗi 400 nếu không hợp lệ |
| 4 | `src/middlewares/upload.js` | Cấu hình Multer: lưu tạm vào `uploads/`, giới hạn file size, filter file type |
| 5 | `src/middlewares/rateLimiter.js` | Rate limiting: 100 req/15 phút (chung), 10 req/15 phút (AI generate) |
| 6 | `src/middlewares/errorHandler.js` | Global error handler: catch lỗi, format response `{success: false, message, errors}` |

### 4.3. Validation schemas (Joi)

| # | File | Việc cần làm |
|---|------|-------------|
| 1 | `src/validations/authValidation.js` | Validate: register (name, email, password), login (email, password), forgotPassword (email), resetPassword (token, newPassword) |
| 2 | `src/validations/contentValidation.js` | Validate: generate (contentType, model, prompt, tone, language, temperature), update (title, content, tags) |
| 3 | `src/validations/templateValidation.js` | Validate: create/update (name, promptTemplate, variables, categoryId) |
| 4 | `src/validations/projectValidation.js` | Validate: create/update (name, description) |
| 5 | `src/validations/adminValidation.js` | Validate: updateUser (role, plan), CRUD plan, CRUD category, system settings |
| 6 | `src/validations/plagiarismValidation.js` ⭐ | Validate: check (text hoặc contentId), check-web (text) |

### 4.4. Utils & Config

| # | File | Việc cần làm |
|---|------|-------------|
| 1 | `src/config/database.js` | Kết nối MongoDB Atlas qua Mongoose |
| 2 | `src/config/cloudinary.js` | Cấu hình Cloudinary SDK |
| 3 | `src/config/passport.js` | Cấu hình Google OAuth strategy |
| 4 | `src/config/stripe.js` | Cấu hình Stripe SDK |
| 5 | `src/utils/regex.js` | Regex patterns: email, phone, URL, slug, password (8+ ký tự, chữ hoa, chữ thường, số), tìm kiếm an toàn |
| 6 | `src/utils/email.js` | Hàm gửi email qua Nodemailer: sendVerificationEmail, sendResetPasswordEmail, sendNotificationEmail |
| 7 | `src/utils/token.js` | Hàm tạo JWT: generateAccessToken (15 phút), generateRefreshToken (7 ngày) |

### 4.5. Controllers & Routes – Module 1 (Xác Thực)

| # | Việc cần làm | API Endpoint |
|---|-------------|-------------|
| 1 | Đăng ký | `POST /api/auth/register` → validate → hash password → tạo user → gửi email xác minh → trả token |
| 2 | Đăng nhập | `POST /api/auth/login` → validate → tìm user → so sánh password → trả access + refresh token |
| 3 | Refresh token | `POST /api/auth/refresh-token` → verify refresh token → trả access token mới |
| 4 | Quên mật khẩu | `POST /api/auth/forgot-password` → validate email → tạo reset token → gửi email |
| 5 | Đặt lại mật khẩu | `POST /api/auth/reset-password` → verify token → hash password mới → cập nhật |
| 6 | Xác minh email | `GET /api/auth/verify-email/:token` → verify → cập nhật isVerified |
| 7 | Google OAuth | `GET /api/auth/google` → passport redirect. `GET /api/auth/google/callback` → tạo/tìm user → trả token |
| 8 | Lấy profile | `GET /api/users/me` → auth → trả thông tin user |
| 9 | Cập nhật profile | `PUT /api/users/me` → auth → validate → cập nhật name, avatar |
| 10 | Đổi mật khẩu | `PUT /api/users/me/password` → auth → verify old password → hash new → cập nhật |
| 11 | Upload avatar | `POST /api/users/me/avatar` → auth → multer → cloudinary upload → cập nhật avatarUrl |

### 4.6. Controllers & Routes – Module 2 (Sinh Nội Dung AI)

| # | Việc cần làm | API Endpoint |
|---|-------------|-------------|
| 1 | Sinh nội dung (SSE) | `POST /api/content/generate` → auth → validate → rateLimiter → gọi AI service (GPT-4/Llama) → **streaming SSE response** → lưu content → log usage |
| 2 | Lấy danh sách nội dung | `GET /api/content` → auth → query (type, project, favorite, search, page, limit) → populate user → trả paginated list |
| 3 | Lấy chi tiết nội dung | `GET /api/content/:id` → auth → kiểm tra ownership → populate → trả content |
| 4 | Cập nhật nội dung | `PUT /api/content/:id` → auth → validate → lưu version cũ vào versions[] → cập nhật |
| 5 | Xóa nội dung | `DELETE /api/content/:id` → auth → kiểm tra ownership → xóa |
| 6 | Toggle yêu thích | `PATCH /api/content/:id/favorite` → auth → toggle isFavorite |
| 7 | Gắn/gỡ tag | `PATCH /api/content/:id/tags` → auth → cập nhật tags[] |
| 8 | Xuất nội dung | `GET /api/content/:id/export?format=pdf|word` → auth → tạo file → trả download |

### 4.7. Controllers & Routes – Module 3 (Fine-tuning)

| # | Việc cần làm | API Endpoint |
|---|-------------|-------------|
| 1 | Upload dataset | `POST /api/fine-tune/upload` → auth → multer → validate (CSV/JSON) → cloudinary upload → trả URL |
| 2 | Tạo fine-tune job | `POST /api/fine-tune/jobs` → auth → validate → gọi OpenAI Fine-tuning API hoặc Llama local → tạo FineTuneJob |
| 3 | Danh sách jobs | `GET /api/fine-tune/jobs` → auth → trả list jobs của user |
| 4 | Chi tiết job | `GET /api/fine-tune/jobs/:id` → auth → trả chi tiết + progress |
| 5 | Danh sách model đã train | `GET /api/fine-tune/models` → auth → trả list model completed |

### 4.8. Controllers & Routes – Module 4 (Template & Danh Mục)

| # | Việc cần làm | API Endpoint |
|---|-------------|-------------|
| 1 | Danh sách template | `GET /api/templates` → auth → query (category, search, isSystem) → trả list |
| 2 | Chi tiết template | `GET /api/templates/:id` → auth → trả template + variables |
| 3 | Tạo template cá nhân | `POST /api/templates` → auth → validate → tạo template (isSystem=false) |
| 4 | Cập nhật template | `PUT /api/templates/:id` → auth → kiểm tra ownership → cập nhật |
| 5 | Xóa template | `DELETE /api/templates/:id` → auth → kiểm tra ownership → xóa |
| 6 | CRUD danh mục (admin) | `POST/GET/PUT/DELETE /api/admin/categories` → auth → requireRole('admin') → CRUD |

### 4.9. Controllers & Routes – Module 5, 6, 7 (Dự Án, Thanh Toán, Thông Báo)

| # | Việc cần làm | API Endpoint |
|---|-------------|-------------|
| 1 | CRUD dự án | `POST/GET/PUT/DELETE /api/projects/*` → auth → CRUD project + gán/gỡ content |
| 2 | Archive dự án | `PATCH /api/projects/:id/archive` → auth → toggle status |
| 3 | Stripe checkout | `POST /api/billing/checkout` → auth → tạo Stripe Checkout Session → trả URL |
| 4 | Stripe webhook | `POST /api/billing/webhook` → verify Stripe signature → cập nhật Subscription/Payment |
| 5 | Lấy subscription | `GET /api/billing/subscription` → auth → trả subscription hiện tại |
| 6 | Lịch sử thanh toán | `GET /api/billing/payments` → auth → trả list payments |
| 7 | Lấy thông báo | `GET /api/notifications` → auth → query (type, isRead, page) → trả list |
| 8 | Đánh dấu đã đọc | `PATCH /api/notifications/:id/read` → auth → cập nhật isRead |
| 9 | Đọc tất cả | `PATCH /api/notifications/read-all` → auth → cập nhật tất cả |

### 4.10. Controllers & Routes – Module 10 (Admin)

| # | Việc cần làm | API Endpoint |
|---|-------------|-------------|
| 1 | Dashboard stats | `GET /api/admin/stats` → trả tổng user, content, revenue, biểu đồ data |
| 2 | Quản lý user | `GET/PUT/DELETE /api/admin/users/*` → list, update role/plan, deactivate |
| 3 | Quản lý nội dung | `GET/DELETE /api/admin/contents/*` → list toàn hệ thống, xóa |
| 4 | Quản lý template hệ thống | `POST/PUT/DELETE /api/admin/templates/*` → CRUD template isSystem=true |
| 5 | Quản lý gói dịch vụ | `POST/PUT/DELETE /api/admin/plans/*` → CRUD plans |
| 6 | Quản lý thanh toán | `GET /api/admin/payments` → list tất cả payments |
| 7 | Quản lý model AI | `GET/PUT /api/admin/models` → list, cấu hình model |
| 8 | Cài đặt hệ thống | `GET/PUT /api/admin/settings` → get/update key-value settings |
| 9 | Nhật ký hệ thống | `GET /api/admin/audit-logs` → list audit logs + filter |

### 4.11. AI Service

| # | File | Việc cần làm |
|---|------|-------------|
| 1 | `src/services/aiService.js` | Hàm `generateContent(model, prompt, systemPrompt, options)`: nếu model=gpt-4 → gọi OpenAI ChatCompletion (stream=true), nếu model=llama → gọi Ollama API (stream=true), nếu model=fine-tuned → gọi OpenAI với model ID. Trả về readable stream |
| 2 | `src/services/promptService.js` | Hàm `buildSystemPrompt(contentType, tone, language)`: tạo system prompt riêng cho từng loại nội dung (blog, quảng cáo, email marketing, mô tả sản phẩm, social media, SEO, script, headline) |
| 3 | `src/services/streamingService.js` | Hàm `streamToSSE(aiStream, res)`: pipe AI response stream → SSE format `data: {chunk}\n\n` → client. Xử lý done event, error event |

### 4.12. Controllers & Routes – Plagiarism Detection ⭐

| # | Việc cần làm | API Endpoint |
|---|-------------|-------------|
| 1 | Tạo `src/services/plagiarismService.js` | **Hàm `checkPlagiarism(text)`:** (1) Tách text thành segments (theo đoạn/câu), (2) Tạo embeddings cho mỗi segment bằng OpenAI Embeddings API, (3) Lấy tất cả content embeddings trong DB, (4) Tính cosine similarity giữa mỗi segment với mỗi DB content segment, (5) Nếu similarity > threshold (mặc định 85%) → đánh dấu là trùng lặp, (6) Tổng hợp kết quả: overall similarity %, danh sách matches, risk level |
| 2 | Tạo `src/services/embeddingService.js` | **Hàm `getEmbedding(text)`:** Gọi OpenAI Embeddings API (`text-embedding-ada-002`) → trả vector. **Hàm `cosineSimilarity(vecA, vecB)`:** Tính cosine similarity giữa 2 vectors. **Hàm `segmentText(text)`:** Tách text thành các đoạn/câu để so sánh |
| 3 | Kiểm tra plagiarism (DB) | `POST /api/plagiarism/check` → auth → validate (text hoặc contentId) → gọi plagiarismService.checkPlagiarism → lưu PlagiarismReport → trả kết quả |
| 4 | Kiểm tra plagiarism (web) | `POST /api/plagiarism/check-web` → auth → validate → gọi web scraping/search → so sánh embeddings → trả kết quả |
| 5 | Lịch sử kiểm tra | `GET /api/plagiarism/history` → auth → trả list PlagiarismReports của user |

---

## 5. Giai đoạn 4 – Dựng Frontend (Next.js)

### 5.1. Khởi tạo project

| # | Công việc | Chi tiết |
|---|-----------|----------|
| 1 | Init Next.js | `npx create-next-app@latest frontend --typescript --tailwind --app --src-dir` |
| 2 | Cài dependencies | `yarn add axios react-hook-form zustand @tanstack/react-query react-markdown chart.js react-chartjs-2 react-hot-toast next-auth @stripe/stripe-js` |
| 3 | Cấu hình Axios | Tạo `src/lib/api.ts`: base URL, interceptor gắn token, interceptor refresh token khi 401 |
| 4 | Cấu hình Zustand | Tạo `src/stores/authStore.ts` (user, token, login, logout), `src/stores/uiStore.ts` (sidebar, theme) |
| 5 | Cấu hình React Query | Provider trong `layout.tsx`, default options (staleTime, retry) |
| 6 | Cấu hình next-auth | Setup Google provider, JWT callback, session callback |

### 5.2. Tạo UI Components

| # | Component | Việc cần làm |
|---|-----------|-------------|
| 1 | `components/ui/Button.tsx` | Variants: primary, secondary, ghost, danger. Sizes: sm, md, lg. Loading state |
| 2 | `components/ui/Input.tsx` | Label, placeholder, error message, icon prefix/suffix |
| 3 | `components/ui/Textarea.tsx` | Auto-resize, character count |
| 4 | `components/ui/Select.tsx` | Options, placeholder, error |
| 5 | `components/ui/Modal.tsx` | Overlay, close button, title, body, footer |
| 6 | `components/ui/Table.tsx` | Headers, rows, sorting, loading skeleton |
| 7 | `components/ui/Card.tsx` | Title, body, footer, variants |
| 8 | `components/ui/Badge.tsx` | Variants: success, warning, danger, info, neutral |
| 9 | `components/ui/Pagination.tsx` | Page numbers, prev/next, page size selector |
| 10 | `components/ui/Toast.tsx` | Tích hợp react-hot-toast, variants |
| 11 | `components/ui/Tabs.tsx` | Tab list, tab panels |
| 12 | `components/ui/Avatar.tsx` | Image, fallback initials, sizes |
| 13 | `components/ui/Loading.tsx` | Spinner, skeleton variants |

### 5.3. Tạo Layout Components

| # | Component | Việc cần làm |
|---|-----------|-------------|
| 1 | `components/layout/Header.tsx` | Logo, search bar, notification bell (badge count), profile dropdown |
| 2 | `components/layout/Sidebar.tsx` | Menu items (Dashboard, Generate, Contents, Projects, Templates, Fine-tune, Plagiarism ⭐, Profile, Billing), active state, collapse toggle, gói hiện tại |
| 3 | `components/layout/Footer.tsx` | Links, copyright |
| 4 | `components/layout/AdminSidebar.tsx` | Menu admin items, active state |
| 5 | `app/layout.tsx` | Root layout: providers (QueryClient, Zustand, next-auth), Toaster |
| 6 | `app/(user)/layout.tsx` | User layout: Header + Sidebar + main content |
| 7 | `app/(admin)/layout.tsx` | Admin layout: Header + AdminSidebar + main content |
| 8 | `app/(auth)/layout.tsx` | Auth layout: centered card, no sidebar |
| 9 | `app/(public)/layout.tsx` | Public layout: public header + footer |

### 5.4. Tạo Form Components

| # | Component | Việc cần làm |
|---|-----------|-------------|
| 1 | `components/forms/LoginForm.tsx` | React Hook Form: email, password, submit, Google login button |
| 2 | `components/forms/RegisterForm.tsx` | React Hook Form: name, email, password, confirmPassword, Google register |
| 3 | `components/forms/ForgotPasswordForm.tsx` | React Hook Form: email, submit |
| 4 | `components/forms/ResetPasswordForm.tsx` | React Hook Form: newPassword, confirmPassword |
| 5 | `components/forms/GenerateForm.tsx` | Content type select, model select, tone, language, temperature slider, prompt textarea, submit |
| 6 | `components/forms/ProfileForm.tsx` | Name input, avatar upload, change password section |
| 7 | `components/forms/TemplateForm.tsx` | Name, description, prompt template (textarea), variable chips, category select |
| 8 | `components/forms/ProjectForm.tsx` | Name, description |
| 9 | `components/forms/PlagiarismForm.tsx` ⭐ | Textarea nhập nội dung HOẶC select content có sẵn, nút "Kiểm tra đạo văn" |

### 5.5. Tạo Services (API calls)

| # | File | Việc cần làm |
|---|------|-------------|
| 1 | `src/services/authService.ts` | register, login, refreshToken, forgotPassword, resetPassword, googleLogin |
| 2 | `src/services/contentService.ts` | generate (SSE), getList, getById, update, delete, toggleFavorite, updateTags, export |
| 3 | `src/services/templateService.ts` | getList, getById, create, update, delete |
| 4 | `src/services/projectService.ts` | getList, getById, create, update, delete, addContent, removeContent, archive |
| 5 | `src/services/fineTuneService.ts` | uploadDataset, createJob, getJobs, getJob, getModels |
| 6 | `src/services/billingService.ts` | checkout, getSubscription, getPayments |
| 7 | `src/services/notificationService.ts` | getList, markRead, markAllRead |
| 8 | `src/services/adminService.ts` | getStats, getUsers, updateUser, deleteUser, CRUD plans, CRUD categories, ... |
| 9 | `src/services/plagiarismService.ts` ⭐ | check, checkWeb, getHistory |

### 5.6. Tạo Pages – Trang công khai

| # | Route file | Việc cần làm |
|---|-----------|-------------|
| 1 | `app/(public)/page.tsx` | Landing page: hero, features, pricing, testimonials, CTA |
| 2 | `app/(auth)/login/page.tsx` | LoginForm, redirect nếu đã đăng nhập |
| 3 | `app/(auth)/register/page.tsx` | RegisterForm, redirect nếu đã đăng nhập |
| 4 | `app/(auth)/forgot-password/page.tsx` | ForgotPasswordForm |
| 5 | `app/(auth)/reset-password/page.tsx` | ResetPasswordForm, nhận token từ URL |
| 6 | `app/(public)/contact/page.tsx` | Form liên hệ |

### 5.7. Tạo Pages – Trang người dùng

| # | Route file | Việc cần làm |
|---|-----------|-------------|
| 1 | `app/(user)/dashboard/page.tsx` | Fetch stats, render cards + Chart.js biểu đồ + recent contents + notifications |
| 2 | `app/(user)/generate/page.tsx` | GenerateForm + khu vực kết quả streaming (EventSource → append text real-time) + nút Save/Copy/Regenerate |
| 3 | `app/(user)/contents/page.tsx` | Fetch contents list (React Query), Table + filter + search + pagination |
| 4 | `app/(user)/contents/[id]/page.tsx` | Fetch content detail, hiển thị nội dung, meta, edit/delete/favorite/export, version history |
| 5 | `app/(user)/projects/page.tsx` | Fetch projects, Card grid, CRUD modal |
| 6 | `app/(user)/projects/[id]/page.tsx` | Fetch project detail + contents trong project |
| 7 | `app/(user)/templates/page.tsx` | Fetch templates, Grid cards, filter by category, search, create modal |
| 8 | `app/(user)/fine-tune/page.tsx` | Upload zone, create job form, jobs table (status badges) |
| 9 | **`app/(user)/plagiarism-check/page.tsx` ⭐** | **PlagiarismForm: nhập text hoặc chọn content → gọi API check → hiển thị kết quả (% tổng, highlight đoạn trùng, nguồn, mức cảnh báo). Tab lịch sử: bảng các lần kiểm tra trước** |
| 10 | `app/(user)/profile/page.tsx` | ProfileForm + avatar upload + change password |
| 11 | `app/(user)/billing/page.tsx` | Current plan card, pricing comparison, upgrade button → Stripe checkout, payment history table |
| 12 | `app/(user)/notifications/page.tsx` | Notification list, mark read, filter by type |

### 5.8. Tạo Pages – Trang Admin

| # | Route file | Việc cần làm |
|---|-----------|-------------|
| 1 | `app/(admin)/admin/page.tsx` | Dashboard: stat cards + growth charts |
| 2 | `app/(admin)/admin/users/page.tsx` | Users table, search, filter, edit role/plan |
| 3 | `app/(admin)/admin/contents/page.tsx` | All contents table, search, delete |
| 4 | `app/(admin)/admin/templates/page.tsx` | System templates CRUD |
| 5 | `app/(admin)/admin/categories/page.tsx` | Categories tree CRUD |
| 6 | `app/(admin)/admin/plans/page.tsx` | Plans CRUD |
| 7 | `app/(admin)/admin/payments/page.tsx` | All payments table |
| 8 | `app/(admin)/admin/models/page.tsx` | AI models config |
| 9 | `app/(admin)/admin/settings/page.tsx` | System settings key-value editor |
| 10 | `app/(admin)/admin/audit-logs/page.tsx` | Audit logs table + filter |

### 5.9. Xử lý SSE Streaming trên Frontend

| # | Công việc | Chi tiết |
|---|-----------|----------|
| 1 | Tạo hook `useSSE` | Custom hook: nhận URL + body → fetch with EventSource hoặc fetch API (ReadableStream) → emit chunks → append vào state → handle done/error |
| 2 | Tích hợp vào GenerateForm | Khi submit → gọi `useSSE` → hiển thị text đang được stream → khi done → enable Save/Copy buttons |
| 3 | Hiệu ứng typing | Hiển thị cursor nhấp nháy khi đang stream, scroll auto xuống cuối |

---

## 6. Giai đoạn 5 – Tích hợp AI & Plagiarism Detection ⭐

### 6.1. Tích hợp GPT-4 & Llama

| # | Công việc | Chi tiết |
|---|-----------|----------|
| 1 | Kết nối OpenAI API | Cấu hình OpenAI SDK, test gọi ChatCompletion stream |
| 2 | Kết nối Ollama | Cài Ollama local, pull model Llama, test gọi API stream |
| 3 | Prompt Engineering | Viết system prompt cho 8 loại nội dung × 3+ tone × 2+ ngôn ngữ |
| 4 | Fine-tuning pipeline | Test tạo fine-tune job qua OpenAI API, theo dõi status, sử dụng model |

### 6.2. Xây dựng Plagiarism Detection Engine ⭐

| # | Công việc | Chi tiết |
|---|-----------|----------|
| 1 | **Embedding Service** | Tích hợp OpenAI Embeddings API (`text-embedding-ada-002`): nhận text → trả vector 1536 chiều |
| 2 | **Text Segmentation** | Viết hàm tách text thành segments (theo câu hoặc đoạn ~100-200 từ) để so sánh chi tiết |
| 3 | **Cosine Similarity** | Implement hàm tính cosine similarity: `cos(A,B) = (A·B) / (‖A‖ × ‖B‖)`. Input: 2 vectors → output: similarity score (0–1) |
| 4 | **Database Search** | Lấy tất cả content trong DB → tạo embeddings (hoặc sử dụng embeddings đã cache) → so sánh từng segment của input với từng segment trong DB |
| 5 | **Threshold Detection** | Nếu similarity > 85% → đánh dấu trùng. Tính overall similarity = trung bình weighted các segment matches |
| 6 | **Risk Level** | Safe: overall < 30%, Warning: 30–85%, Danger: > 85% |
| 7 | **Report Generation** | Tạo PlagiarismReport: overall %, danh sách matches (sourceContent, matchedSnippet, similarity %), risk level |
| 8 | **Web Check (mở rộng)** | Sử dụng Google Custom Search API → lấy top kết quả → scrape nội dung → so sánh embeddings |
| 9 | **Hiển thị kết quả Frontend** | Highlight đoạn trùng (màu đỏ/vàng), tooltip hiện nguồn, thanh progress similarity, badge risk level |
| 10 | **Cache embeddings** | Khi content được tạo → tự động tạo embeddings → lưu (Redis hoặc MongoDB field) → tái sử dụng khi check plagiarism |

---

## 7. Giai đoạn 6 – Docker, Deploy & Hoàn thiện

### 7.1. Docker & Docker Compose

| # | Công việc | Chi tiết |
|---|-----------|----------|
| 1 | Viết `backend/Dockerfile` | `FROM node:18-alpine`, `WORKDIR /app`, `COPY package*.json`, `RUN yarn install`, `COPY .`, `EXPOSE 5000`, `CMD ["yarn", "start"]` |
| 2 | Viết `frontend/Dockerfile` | Multi-stage: build stage + production stage, `EXPOSE 3000` |
| 3 | Viết `docker-compose.yml` | Services: frontend (port 3000), backend (port 5000), mongo (port 27017). Volumes, networks, environment variables |
| 4 | Test docker-compose | `docker-compose up --build` → kiểm tra tất cả services chạy + kết nối được |

### 7.2. Test & Sửa lỗi

| # | Công việc | Chi tiết |
|---|-----------|----------|
| 1 | Test luồng đăng ký/đăng nhập | Đăng ký email → xác minh → đăng nhập → profile → đổi mật khẩu. Google OAuth login |
| 2 | Test sinh nội dung | Chọn model → chọn loại → nhập prompt → generate → xem streaming → save → list |
| 3 | Test fine-tuning | Upload dataset → tạo job → theo dõi → sử dụng model |
| 4 | Test template | Tạo template → dùng template → generate với template |
| 5 | Test dự án | CRUD project → gán content → archive |
| 6 | Test thanh toán | Chọn gói → Stripe checkout → webhook → cập nhật subscription |
| 7 | **Test plagiarism ⭐** | **Nhập text → check → xem kết quả (% similarity, highlights, risk level). Check web. Xem history** |
| 8 | Test admin | Dashboard stats → CRUD users/templates/categories/plans → audit logs |
| 9 | Test responsive | Kiểm tra trên Desktop / Tablet / Mobile cho các trang chính |
| 10 | Fix bugs | Sửa tất cả lỗi phát hiện |

### 7.3. Deploy

| # | Công việc | Chi tiết |
|---|-----------|----------|
| 1 | Deploy MongoDB | Sử dụng MongoDB Atlas (free tier) → lấy connection string |
| 2 | Deploy Backend | Deploy lên Railway / Render / VPS. Set environment variables |
| 3 | Deploy Frontend | Deploy lên Vercel. Cấu hình `NEXT_PUBLIC_API_URL` |
| 4 | Setup domain (optional) | Gắn custom domain nếu có |
| 5 | Test production | Kiểm tra toàn bộ luồng trên production |

### 7.4. Viết báo cáo & Chuẩn bị bảo vệ

| # | Công việc | Chi tiết |
|---|-----------|----------|
| 1 | Viết báo cáo đồ án | Theo mẫu: Giới thiệu, Phân tích yêu cầu, Thiết kế, Triển khai, Kết quả, Kết luận |
| 2 | Chuẩn bị slide | Slide thuyết trình: tổng quan, demo, kỹ thuật nổi bật (Plagiarism Detection ⭐, SSE streaming, Fine-tuning) |
| 3 | Quay video demo | Record demo các tính năng chính + Plagiarism Detection ⭐ |
| 4 | Chuẩn bị Q&A | Chuẩn bị trả lời câu hỏi về kiến trúc, thuật toán cosine similarity, kỹ thuật streaming |
