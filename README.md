# AI Copywriter – Website Hỗ Trợ Viết Nội Dung Bằng AI

## 1. Giới Thiệu

**AI Copywriter** là một ứng dụng web hỗ trợ người dùng viết nội dung tự động bằng trí tuệ nhân tạo. Hệ thống tích hợp các mô hình ngôn ngữ lớn (LLM) như **GPT-4** và **Llama** để sinh nội dung chất lượng cao, phù hợp với nhiều ngành nghề khác nhau.

### Mục Tiêu

- Xây dựng nền tảng web cho phép người dùng tạo nội dung tự động (bài viết, quảng cáo, email marketing, mô tả sản phẩm, ...).
- Tích hợp GPT-4 / Llama để sinh nội dung thông minh.
- Xây dựng API RESTful cho AI model để xử lý nội dung trên backend.
- Tích hợp fine-tuning (tinh chỉnh model) để phù hợp với ngành nghề cụ thể.

### Thành Viên

| STT | Họ và Tên | Vai Trò |
|-----|-----------|---------|
| 1   | Bùi Lê Huy Phước | Fullstack Developer (Frontend + Backend + AI Integration) |

---

## 2. Công Nghệ Sử Dụng

### Frontend
| Công nghệ | Mô tả |
|------------|--------|
| **Next.js (React.js)** | Framework React hỗ trợ SSR/SSG, tối ưu SEO |
| **Tailwind CSS** | Utility-first CSS framework cho giao diện responsive |
| **Axios** | HTTP client để gọi API từ frontend |

### Backend
| Công nghệ | Mô tả |
|------------|--------|
| **Node.js** | Runtime JavaScript phía server |
| **Express.js** | Web framework cho Node.js |
| **Mongoose** | ODM cho MongoDB |
| **JWT (jsonwebtoken)** | Xác thực và phân quyền người dùng |

### AI / LLM
| Công nghệ | Mô tả |
|------------|--------|
| **OpenAI API (GPT-4)** | API sinh nội dung chính |
| **Llama (Meta)** | Mô hình mã nguồn mở, hỗ trợ fine-tuning |
| **LangChain.js** | Framework JavaScript hỗ trợ tích hợp LLM cho Node.js |

### Cơ Sở Dữ Liệu
| Công nghệ | Mô tả |
|------------|--------|
| **MongoDB** | NoSQL database lưu trữ dữ liệu người dùng và nội dung |

### DevOps / Khác
| Công nghệ | Mô tả |
|------------|--------|
| **Docker** | Container hóa ứng dụng |
| **Git / GitHub** | Quản lý mã nguồn |
| **Postman** | Kiểm thử API |

---

## 3. Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                   │
│                  Next.js (React.js) Frontend             │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/HTTPS (REST API)
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Auth Module  │  │ Content API  │  │ Fine-tune API │  │
│  │ (JWT)        │  │ (CRUD)       │  │               │  │
│  └─────────────┘  └──────┬───────┘  └───────┬───────┘  │
│                          │                   │          │
│                 ┌────────▼───────────────────▼────────┐ │
│                 │        AI Service Layer             │ │
│                 │  ┌──────────┐  ┌─────────────────┐  │ │
│                 │  │ GPT-4    │  │ Llama (Local/   │  │ │
│                 │  │ (OpenAI) │  │  Cloud)          │  │ │
│                 │  └──────────┘  └─────────────────┘  │ │
│                 └────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    MongoDB Database                      │
│  ┌──────────┐  ┌───────────┐  ┌───────────────────────┐ │
│  │ Users     │  │ Contents  │  │ Fine-tune Configs     │ │
│  └──────────┘  └───────────┘  └───────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Tính Năng Chính

### 4.1 Quản Lý Người Dùng
- Đăng ký / Đăng nhập (JWT Authentication)
- Quản lý hồ sơ cá nhân
- Phân quyền người dùng (Free / Premium)

### 4.2 Sinh Nội Dung AI
- Chọn loại nội dung (bài viết blog, quảng cáo, email, mô tả sản phẩm, bài đăng mạng xã hội, ...)
- Nhập từ khóa / chủ đề / yêu cầu cụ thể
- Chọn tone giọng (chuyên nghiệp, thân thiện, hài hước, ...)
- Chọn ngôn ngữ đầu ra
- Sinh nội dung bằng GPT-4 hoặc Llama
- Chỉnh sửa và lưu nội dung đã sinh

### 4.3 Quản Lý Nội Dung
- Lưu trữ lịch sử nội dung đã tạo
- Tìm kiếm và lọc nội dung
- Xuất nội dung (Copy, PDF, Word)
- Đánh dấu nội dung yêu thích

### 4.4 Fine-tuning Model
- Tạo cấu hình fine-tuning theo ngành nghề
- Upload dữ liệu huấn luyện (dataset)
- Theo dõi tiến trình fine-tuning
- Sử dụng model đã fine-tune để sinh nội dung chuyên ngành

### 4.5 Template Nội Dung
- Thư viện template có sẵn cho từng loại nội dung
- Tạo template tùy chỉnh
- Chia sẻ template

---

## 5. Thiết Kế API RESTful

### 5.1 Authentication

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/refresh-token` | Làm mới access token |
| GET | `/api/auth/me` | Lấy thông tin người dùng hiện tại |

### 5.2 Content Generation

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/content/generate` | Sinh nội dung mới bằng AI |
| GET | `/api/content` | Lấy danh sách nội dung đã tạo |
| GET | `/api/content/:id` | Lấy chi tiết một nội dung |
| PUT | `/api/content/:id` | Cập nhật nội dung |
| DELETE | `/api/content/:id` | Xóa nội dung |

### 5.3 Templates

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/templates` | Lấy danh sách template |
| POST | `/api/templates` | Tạo template mới |
| GET | `/api/templates/:id` | Lấy chi tiết template |
| PUT | `/api/templates/:id` | Cập nhật template |
| DELETE | `/api/templates/:id` | Xóa template |

### 5.4 Fine-tuning

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/fine-tune/create` | Tạo job fine-tuning mới |
| GET | `/api/fine-tune/jobs` | Lấy danh sách jobs |
| GET | `/api/fine-tune/jobs/:id` | Lấy trạng thái job |
| POST | `/api/fine-tune/upload-dataset` | Upload dữ liệu huấn luyện |
| GET | `/api/fine-tune/models` | Lấy danh sách model đã fine-tune |

### 5.5 User

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/users/profile` | Lấy thông tin profile |
| PUT | `/api/users/profile` | Cập nhật profile |
| GET | `/api/users/usage` | Xem thống kê sử dụng |

---

## 6. Thiết Kế Cơ Sở Dữ Liệu (MongoDB)

### 6.1 Collection: Users

```json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "string (hashed)",
  "name": "string",
  "role": "string (free | premium | admin)",
  "usage": {
    "totalGenerated": "number",
    "monthlyLimit": "number",
    "currentMonthUsage": "number"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 6.2 Collection: Contents

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "title": "string",
  "type": "string (blog | ad | email | product | social)",
  "prompt": "string",
  "generatedContent": "string",
  "model": "string (gpt-4 | llama)",
  "tone": "string",
  "language": "string",
  "isFavorite": "boolean",
  "metadata": {
    "wordCount": "number",
    "tokensUsed": "number"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 6.3 Collection: Templates

```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "type": "string",
  "promptTemplate": "string",
  "variables": ["string"],
  "isPublic": "boolean",
  "createdBy": "ObjectId (ref: Users)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 6.4 Collection: FineTuneJobs

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "modelName": "string",
  "baseModel": "string (gpt-3.5-turbo | llama)",
  "industry": "string",
  "status": "string (pending | training | completed | failed)",
  "datasetPath": "string",
  "config": {
    "epochs": "number",
    "learningRate": "number",
    "batchSize": "number"
  },
  "result": {
    "modelId": "string",
    "accuracy": "number",
    "trainingTime": "number"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 7. Cấu Trúc Thư Mục Dự Án

```
NT114.Q21-Web-Copy-Writer/
├── client/                     # Frontend (Next.js)
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── (auth)/         # Auth pages (login, register)
│   │   │   ├── dashboard/      # Dashboard page
│   │   │   ├── generate/       # Content generation page
│   │   │   ├── history/        # Content history page
│   │   │   ├── fine-tune/      # Fine-tuning management page
│   │   │   ├── templates/      # Templates page
│   │   │   └── layout.tsx      # Root layout
│   │   ├── components/         # Reusable components
│   │   │   ├── ui/             # UI components
│   │   │   ├── forms/          # Form components
│   │   │   └── layout/         # Layout components
│   │   ├── lib/                # Utilities & configs
│   │   │   ├── api.ts          # API client (Axios)
│   │   │   └── auth.ts         # Auth utilities
│   │   └── types/              # TypeScript types
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── server/                     # Backend (Express.js)
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   │   ├── db.js           # MongoDB connection
│   │   │   └── env.js          # Environment variables
│   │   ├── controllers/        # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── contentController.js
│   │   │   ├── templateController.js
│   │   │   └── fineTuneController.js
│   │   ├── middlewares/        # Express middlewares
│   │   │   ├── auth.js         # JWT authentication
│   │   │   ├── rateLimit.js    # Rate limiting
│   │   │   └── validate.js     # Request validation
│   │   ├── models/             # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Content.js
│   │   │   ├── Template.js
│   │   │   └── FineTuneJob.js
│   │   ├── routes/             # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── contentRoutes.js
│   │   │   ├── templateRoutes.js
│   │   │   └── fineTuneRoutes.js
│   │   ├── services/           # Business logic
│   │   │   ├── aiService.js    # AI model integration
│   │   │   ├── gptService.js   # GPT-4 specific logic
│   │   │   ├── llamaService.js # Llama specific logic
│   │   │   └── fineTuneService.js
│   │   └── app.js              # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml          # Docker configuration
├── .gitignore
└── README.md
```

---

## 8. Kế Hoạch Thực Hiện

> **Thời gian dự kiến:** 14 tuần (1 người thực hiện)

### Giai Đoạn 1: Khởi Tạo Dự Án & Nền Tảng (Tuần 1–2)

- [ ] Khởi tạo repository và cấu trúc thư mục
- [ ] Cài đặt và cấu hình Next.js (frontend)
- [ ] Cài đặt và cấu hình Express.js (backend)
- [ ] Kết nối MongoDB (Mongoose)
- [ ] Cấu hình Docker cho môi trường phát triển
- [ ] Thiết kế database schema

### Giai Đoạn 2: Xác Thực & Quản Lý Người Dùng (Tuần 3–4)

- [ ] Xây dựng API đăng ký / đăng nhập (JWT)
- [ ] Xây dựng middleware xác thực
- [ ] Tạo giao diện đăng ký / đăng nhập
- [ ] Quản lý hồ sơ người dùng
- [ ] Phân quyền (Free / Premium)

### Giai Đoạn 3: Tích Hợp AI & Sinh Nội Dung (Tuần 5–7)

- [ ] Tích hợp OpenAI API (GPT-4)
- [ ] Xây dựng AI Service Layer
- [ ] Xây dựng API sinh nội dung (`/api/content/generate`)
- [ ] Tạo giao diện trang sinh nội dung
- [ ] Hỗ trợ nhiều loại nội dung (blog, quảng cáo, email, ...)
- [ ] Chọn tone giọng và ngôn ngữ

### Giai Đoạn 4: Quản Lý Nội Dung & Template (Tuần 8–9)

- [ ] Xây dựng CRUD API cho nội dung
- [ ] Tạo giao diện lịch sử nội dung
- [ ] Chức năng tìm kiếm và lọc
- [ ] Xuất nội dung (Copy / PDF)
- [ ] Xây dựng hệ thống template
- [ ] Tạo thư viện template có sẵn

### Giai Đoạn 5: Tích Hợp Llama & Fine-tuning (Tuần 10–12)

- [ ] Tích hợp Llama model
- [ ] Xây dựng API fine-tuning
- [ ] Tạo giao diện quản lý fine-tuning
- [ ] Upload và xử lý dataset
- [ ] Theo dõi tiến trình fine-tuning
- [ ] Sử dụng model đã fine-tune

### Giai Đoạn 6: Tối Ưu & Hoàn Thiện (Tuần 13–14)

- [ ] Tối ưu hiệu suất (caching, rate limiting)
- [ ] Responsive design cho mobile
- [ ] Kiểm thử toàn bộ hệ thống
- [ ] Viết tài liệu hướng dẫn sử dụng
- [ ] Deploy lên môi trường production
- [ ] Bug fixing và cải thiện UX

---

## 9. Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống

- **Node.js** >= 18.x
- **npm** >= 9.x hoặc **yarn** >= 1.22.x
- **MongoDB** >= 6.x
- **Docker** (khuyến nghị)

### Cài Đặt

```bash
# Clone repository
git clone https://github.com/23521228-BuiLeHuyPhuoc/NT114.Q21-Web-Copy-Writer.git
cd NT114.Q21-Web-Copy-Writer

# Cài đặt dependencies cho backend
cd server
npm install

# Cài đặt dependencies cho frontend
cd ../client
npm install
```

### Cấu Hình Biến Môi Trường

Tạo file `.env` trong thư mục `server/`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-copywriter

# JWT
JWT_SECRET=your-jwt-secret-key  # Thay bằng chuỗi ngẫu nhiên mạnh, ví dụ: openssl rand -hex 64
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Llama
LLAMA_API_URL=http://localhost:11434
```

### Chạy Dự Án

```bash
# Chạy backend (development)
cd server
npm run dev

# Chạy frontend (development)
cd client
npm run dev
```

### Chạy Với Docker

```bash
docker-compose up -d
```

---

## 10. Tài Liệu Tham Khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Meta Llama](https://llama.meta.com/)
- [LangChain Documentation](https://js.langchain.com/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

---

## 11. License

MIT License – Xem file [LICENSE](LICENSE) để biết thêm chi tiết.
