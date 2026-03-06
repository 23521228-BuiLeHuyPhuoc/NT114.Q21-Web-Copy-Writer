# AI Copywriter – Kế Hoạch Đồ Án

## Thông Tin Đồ Án

- **Đề tài:** Website hỗ trợ viết nội dung bằng AI (AI Copywriter)
- **Môn học:** NT114.Q21
- **Thực hiện:** Bùi Lê Huy Phước
- **Công nghệ chính:** Next.js, Express.js, MongoDB, OpenAI GPT-4 / Llama

---

## 1. Các Chức Năng Cần Làm

### 1.1 Trang Công Khai (Landing Page)

- Trang chủ giới thiệu sản phẩm, tính năng nổi bật, bảng giá gói dịch vụ
- Trang đăng ký / đăng nhập (hỗ trợ đăng nhập bằng Google OAuth)
- Trang quên mật khẩu / đặt lại mật khẩu
- Trang liên hệ / hỗ trợ

### 1.2 Hệ Thống Xác Thực & Phân Quyền

- Đăng ký, đăng nhập, đăng xuất (JWT + Refresh Token)
- Đăng nhập qua Google (OAuth 2.0)
- Xác minh email khi đăng ký
- Quên mật khẩu / đặt lại mật khẩu qua email
- Phân quyền 3 role: **user** (free), **premium**, **admin**
- Middleware bảo vệ route theo role

### 1.3 Dashboard Người Dùng

- Tổng quan: số nội dung đã tạo, số token đã dùng, giới hạn còn lại
- Danh sách nội dung gần đây (truy cập nhanh)
- Biểu đồ thống kê sử dụng theo ngày/tuần/tháng
- Thông báo hệ thống (hết hạn gói, cập nhật tính năng, …)

### 1.4 Sinh Nội Dung AI (Chức Năng Cốt Lõi)

- Chọn loại nội dung: blog, quảng cáo, email marketing, mô tả sản phẩm, bài mạng xã hội, SEO meta, kịch bản video, tiêu đề/slogan
- Nhập chủ đề / từ khóa / mô tả yêu cầu
- Chọn tone giọng (chuyên nghiệp, thân thiện, hài hước, nghiêm túc, sáng tạo, …)
- Chọn ngôn ngữ đầu ra (Tiếng Việt, English, …)
- Chọn model AI (GPT-4, Llama, hoặc model đã fine-tune)
- Tùy chỉnh độ dài nội dung (ngắn / vừa / dài), nhiệt độ sáng tạo (temperature)
- Streaming real-time (hiển thị nội dung sinh dần giống ChatGPT)
- Chỉnh sửa nội dung trực tiếp sau khi sinh
- Tạo lại (regenerate) nội dung
- Lưu nội dung vào dự án / thư mục

### 1.5 Quản Lý Nội Dung

- Danh sách tất cả nội dung đã tạo (phân trang, sắp xếp)
- Tìm kiếm nội dung theo từ khóa, lọc theo loại / ngày tạo / dự án
- Xem chi tiết, chỉnh sửa, xóa nội dung
- Đánh dấu yêu thích (favorite)
- Gắn tag / nhãn cho nội dung
- Xuất nội dung: Copy to Clipboard, PDF, Word (.docx)
- Lịch sử phiên bản nội dung (version history) – xem lại các lần chỉnh sửa

### 1.6 Quản Lý Dự Án (Project)

- Tạo dự án để nhóm các nội dung theo chiến dịch / khách hàng / chủ đề
- CRUD dự án (tạo, sửa, xóa, xem chi tiết)
- Gán nội dung vào dự án
- Xem tổng quan dự án: số nội dung, loại nội dung, ngày tạo

### 1.7 Hệ Thống Template

- Thư viện template có sẵn (hệ thống) cho từng loại nội dung và ngành nghề
- Người dùng tạo template tùy chỉnh riêng
- Template có biến động (variables) – ví dụ: `{{tên_sản_phẩm}}`, `{{giá}}`
- Chọn template → điền biến → sinh nội dung
- Phân loại template theo danh mục (category)
- Đánh giá / xếp hạng template (cho template public)

### 1.8 Gói Dịch Vụ & Thanh Toán

- Định nghĩa các gói: Free, Pro, Enterprise (khác nhau về giới hạn token, model, tính năng)
- Trang chọn gói & nâng cấp
- Tích hợp thanh toán (Stripe hoặc VNPay / MoMo cho thị trường Việt Nam)
- Quản lý subscription: gia hạn, hủy, đổi gói
- Lịch sử thanh toán
- Hóa đơn tự động (invoice)

### 1.9 Quản Lý Hồ Sơ Người Dùng

- Xem và cập nhật thông tin cá nhân (tên, avatar, email, mật khẩu)
- Thống kê sử dụng chi tiết: token đã dùng, số nội dung, gói hiện tại
- Quản lý API key cá nhân (cho phép gọi API từ bên ngoài)
- Cài đặt thông báo (email notification, in-app notification)

### 1.10 Fine-tuning Model AI

- Upload dataset huấn luyện (JSON/CSV)
- Tạo job fine-tuning (chọn base model, ngành nghề, tham số)
- Theo dõi trạng thái job (pending / training / completed / failed)
- Danh sách model đã fine-tune
- Sử dụng model fine-tuned để sinh nội dung

### 1.11 Hệ Thống Thông Báo

- Thông báo in-app (real-time qua WebSocket hoặc polling)
- Thông báo qua email (xác minh tài khoản, đặt lại mật khẩu, hết hạn gói, fine-tune hoàn thành)
- Quản lý cài đặt thông báo

---

## 2. Trang Quản Trị Admin

### 2.1 Dashboard Admin

- Tổng quan hệ thống: tổng user, tổng nội dung, tổng doanh thu, số user hoạt động
- Biểu đồ tăng trưởng user, nội dung, doanh thu theo thời gian
- Thống kê sử dụng AI: tổng token tiêu thụ, phân bổ theo model

### 2.2 Quản Lý Người Dùng

- Danh sách tất cả user (tìm kiếm, lọc theo role/gói/trạng thái)
- Xem chi tiết user: thông tin, thống kê sử dụng, lịch sử thanh toán
- Kích hoạt / Vô hiệu hóa tài khoản
- Thay đổi role (user → premium → admin)
- Xóa tài khoản

### 2.3 Quản Lý Nội Dung

- Xem tất cả nội dung trên hệ thống
- Tìm kiếm, lọc nội dung
- Xóa nội dung vi phạm
- Thống kê nội dung theo loại, ngôn ngữ, model

### 2.4 Quản Lý Template

- CRUD template hệ thống (template mặc định cho tất cả user)
- Phân loại template theo category
- Duyệt / ẩn template do user tạo (nếu cho phép public)

### 2.5 Quản Lý Gói Dịch Vụ & Thanh Toán

- Cấu hình các gói (giá, giới hạn token, tính năng)
- Xem lịch sử thanh toán toàn hệ thống
- Thống kê doanh thu
- Xử lý yêu cầu hoàn tiền

### 2.6 Quản Lý Model AI

- Danh sách model đang hoạt động (GPT-4, Llama, fine-tuned models)
- Bật / tắt model
- Cấu hình giới hạn token, giá mỗi token cho từng model
- Quản lý API key kết nối với OpenAI / Ollama

### 2.7 Cài Đặt Hệ Thống

- Cấu hình chung: tên website, logo, thông tin liên hệ
- Cấu hình email SMTP (gửi email thông báo)
- Cấu hình rate limiting
- Quản lý prompt mặc định (system prompt cho từng loại nội dung)
- Cấu hình bảo trì (maintenance mode)

### 2.8 Nhật Ký Hệ Thống (Audit Log)

- Ghi lại các hành động quan trọng: đăng nhập, thay đổi role, xóa nội dung, cấu hình hệ thống
- Lọc log theo thời gian, user, hành động
- Xuất log

---

## 3. Thiết Kế Database (MongoDB)

### Collection: Users

| Trường | Mô tả |
|--------|-------|
| email, password (hashed) | Thông tin đăng nhập |
| name, avatar | Thông tin cá nhân |
| role | `user` / `premium` / `admin` |
| emailVerified | Đã xác minh email chưa |
| googleId | ID đăng nhập Google (nếu có) |
| subscriptionId (ref) | Gói dịch vụ hiện tại |
| apiKey | API key cá nhân |
| notificationSettings | Cài đặt thông báo |
| isActive | Tài khoản hoạt động / bị khóa |
| lastLoginAt | Lần đăng nhập cuối |

### Collection: Subscriptions

| Trường | Mô tả |
|--------|-------|
| userId (ref) | User sở hữu |
| planId (ref) | Gói dịch vụ |
| status | `active` / `canceled` / `expired` |
| currentPeriodStart, currentPeriodEnd | Chu kỳ hiện tại |
| paymentMethod | Phương thức thanh toán |
| autoRenew | Tự động gia hạn |

### Collection: Plans

| Trường | Mô tả |
|--------|-------|
| name | Tên gói (Free, Pro, Enterprise) |
| price, currency, billingCycle | Giá và chu kỳ thanh toán |
| tokenLimit | Giới hạn token / tháng |
| features | Danh sách tính năng |
| allowedModels | Model AI được phép sử dụng |
| maxProjects | Số dự án tối đa |
| isActive | Gói có đang bán không |

### Collection: Payments

| Trường | Mô tả |
|--------|-------|
| userId (ref), subscriptionId (ref) | User và subscription |
| amount, currency | Số tiền |
| paymentMethod, transactionId | Thông tin giao dịch |
| status | `pending` / `completed` / `failed` / `refunded` |
| invoiceUrl | Link hóa đơn |

### Collection: Projects

| Trường | Mô tả |
|--------|-------|
| userId (ref) | Người tạo |
| name, description | Thông tin dự án |
| contentCount | Số nội dung trong dự án |
| isArchived | Đã lưu trữ |

### Collection: Contents

| Trường | Mô tả |
|--------|-------|
| userId (ref), projectId (ref) | Người tạo và dự án |
| title | Tiêu đề nội dung |
| type | `blog` / `ad` / `email` / `product` / `social` / `seo` / `script` / `headline` |
| prompt | Yêu cầu đầu vào của user |
| generatedContent | Nội dung AI đã sinh |
| model | Model AI đã sử dụng |
| tone, language | Tone giọng và ngôn ngữ |
| templateId (ref) | Template đã dùng (nếu có) |
| tags | Danh sách tag |
| isFavorite | Đánh dấu yêu thích |
| tokensUsed | Số token đã dùng |
| versions | Mảng lưu lịch sử các phiên bản chỉnh sửa |

### Collection: Templates

| Trường | Mô tả |
|--------|-------|
| name, description | Thông tin template |
| type | Loại nội dung |
| category | Danh mục (ngành nghề) |
| promptTemplate | Nội dung prompt có biến động |
| variables | Danh sách biến (tên, mô tả, giá trị mặc định) |
| isSystem | Template hệ thống (admin tạo) hay user tạo |
| isPublic | Công khai hay riêng tư |
| createdBy (ref) | Người tạo |
| rating, usageCount | Đánh giá và số lần sử dụng |

### Collection: Categories

| Trường | Mô tả |
|--------|-------|
| name, slug, description | Thông tin danh mục |
| parentId (ref) | Danh mục cha (hỗ trợ phân cấp) |
| icon | Icon hiển thị |
| isActive | Đang sử dụng |

### Collection: FineTuneJobs

| Trường | Mô tả |
|--------|-------|
| userId (ref) | Người tạo |
| modelName, baseModel | Tên model và model gốc |
| industry | Ngành nghề |
| status | `pending` / `training` / `completed` / `failed` |
| datasetPath | Đường dẫn file dataset |
| config (epochs, learningRate, batchSize) | Tham số huấn luyện |
| result (modelId, accuracy, trainingTime) | Kết quả |

### Collection: Notifications

| Trường | Mô tả |
|--------|-------|
| userId (ref) | Người nhận |
| type | `system` / `billing` / `fine-tune` / `account` |
| title, message | Nội dung thông báo |
| isRead | Đã đọc chưa |
| link | Link liên quan (nếu có) |

### Collection: UsageLogs

| Trường | Mô tả |
|--------|-------|
| userId (ref) | User |
| action | `generate` / `regenerate` / `fine-tune` |
| model | Model đã dùng |
| tokensUsed | Số token |
| contentId (ref) | Nội dung liên quan |
| ip, userAgent | Thông tin request |

### Collection: AuditLogs

| Trường | Mô tả |
|--------|-------|
| userId (ref) | Người thực hiện |
| action | Hành động (`user.login`, `user.role_change`, `content.delete`, `system.config_update`, …) |
| targetType, targetId | Đối tượng bị tác động |
| details | Chi tiết bổ sung |
| ip | Địa chỉ IP |

### Collection: SystemSettings

| Trường | Mô tả |
|--------|-------|
| key | Tên cấu hình (`site_name`, `smtp_host`, `maintenance_mode`, …) |
| value | Giá trị |
| description | Mô tả |
| updatedBy (ref) | Admin cập nhật lần cuối |

---

## 4. Giao Diện Cần Xây Dựng

### Trang Công Khai
- `/` – Landing page (giới thiệu, tính năng, bảng giá)
- `/login` – Đăng nhập
- `/register` – Đăng ký
- `/forgot-password` – Quên mật khẩu
- `/reset-password` – Đặt lại mật khẩu
- `/contact` – Liên hệ

### Trang Người Dùng (yêu cầu đăng nhập)
- `/dashboard` – Dashboard tổng quan
- `/generate` – Sinh nội dung AI
- `/contents` – Quản lý nội dung (danh sách, tìm kiếm, lọc)
- `/contents/:id` – Chi tiết nội dung
- `/projects` – Quản lý dự án
- `/projects/:id` – Chi tiết dự án
- `/templates` – Thư viện template
- `/fine-tune` – Quản lý fine-tuning
- `/profile` – Hồ sơ cá nhân & cài đặt
- `/billing` – Gói dịch vụ & thanh toán
- `/notifications` – Thông báo

### Trang Admin (yêu cầu role admin)
- `/admin` – Dashboard admin
- `/admin/users` – Quản lý user
- `/admin/contents` – Quản lý nội dung
- `/admin/templates` – Quản lý template hệ thống
- `/admin/categories` – Quản lý danh mục
- `/admin/plans` – Quản lý gói dịch vụ
- `/admin/payments` – Quản lý thanh toán
- `/admin/models` – Quản lý model AI
- `/admin/settings` – Cài đặt hệ thống
- `/admin/audit-logs` – Nhật ký hệ thống

---

## 5. Công Nghệ Sử Dụng

| Phần | Công nghệ |
|------|-----------|
| Frontend | Next.js (React), TypeScript, Tailwind CSS, Axios |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| AI | OpenAI API (GPT-4), Llama (Ollama), LangChain.js |
| Xác thực | JWT, Google OAuth 2.0 |
| Thanh toán | Stripe / VNPay |
| Real-time | Server-Sent Events (SSE) / WebSocket |
| File upload | Multer |
| Email | Nodemailer + SMTP |
| DevOps | Docker, Docker Compose, Vercel, MongoDB Atlas |

---

## 6. Ghi Chú

- Dự án do 1 người thực hiện.
- Ưu tiên hoàn thành **xác thực → sinh nội dung → quản lý nội dung** trước (MVP).
- Trang admin và thanh toán phát triển sau khi các chức năng cốt lõi ổn định.
- Database cần đánh index phù hợp cho các trường tìm kiếm và lọc thường xuyên.
