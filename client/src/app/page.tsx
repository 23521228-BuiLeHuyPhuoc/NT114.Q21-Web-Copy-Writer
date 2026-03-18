"use client";

import Link from "next/link";

const features = [
  {
    href: "/generate",
    icon: "✨",
    title: "AI Content Generation",
    subtitle: "Server-Sent Events (SSE) Streaming",
    description:
      "Tạo nội dung theo thời gian thực với SSE streaming. Hỗ trợ nhiều loại nội dung: blog, quảng cáo, email, mô tả sản phẩm, mạng xã hội, SEO, kịch bản, tiêu đề.",
    tags: ["SSE", "Streaming", "NLP", "GPT"],
    color: "from-violet-500 to-indigo-500",
  },
  {
    href: "/seo-analysis",
    icon: "🔍",
    title: "SEO Analysis",
    subtitle: "Multi-metric Content Analysis Engine",
    description:
      "Phân tích nội dung toàn diện: điểm đọc hiểu Flesch-Kincaid, mật độ từ khóa TF-IDF, cấu trúc heading, meta tags, và đề xuất tối ưu hóa.",
    tags: ["Flesch-Kincaid", "TF-IDF", "NLP"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    href: "/plagiarism",
    icon: "🛡️",
    title: "Plagiarism Detection",
    subtitle: "Multi-Algorithm Similarity Analysis",
    description:
      "Kiểm tra đạo văn bằng 4 thuật toán: Cosine Similarity, Jaccard Index, Longest Common Subsequence (LCS), và Fingerprinting (Rabin-Karp).",
    tags: ["Cosine", "Jaccard", "LCS", "Rabin-Karp"],
    color: "from-orange-500 to-red-500",
  },
  {
    href: "/templates",
    icon: "📄",
    title: "Template Engine",
    subtitle: "Custom Template Rendering System",
    description:
      "Hệ thống template tùy chỉnh với biến, vòng lặp, điều kiện, bộ lọc (upper, lower, capitalize, truncate, default, replace, date).",
    tags: ["Template Engine", "Filters", "Loops", "Conditions"],
    color: "from-pink-500 to-rose-500",
  },
  {
    href: "/versions",
    icon: "🕐",
    title: "Version History",
    subtitle: "Diff Algorithm & Version Control",
    description:
      "Quản lý phiên bản nội dung với thuật toán diff. So sánh các phiên bản, xem thay đổi dạng additions/deletions, khôi phục phiên bản cũ.",
    tags: ["Diff Algorithm", "Version Control", "Delta"],
    color: "from-cyan-500 to-blue-500",
  },
  {
    href: "/generate",
    icon: "🧠",
    title: "Multi-Model AI",
    subtitle: "Pluggable AI Provider Architecture",
    description:
      "Kiến trúc provider cho phép chuyển đổi giữa các mô hình AI: OpenAI GPT-4, Google Gemini, Anthropic Claude, và mô hình local Ollama.",
    tags: ["GPT-4", "Gemini", "Claude", "Ollama"],
    color: "from-amber-500 to-yellow-500",
  },
  {
    href: "/seo-analysis",
    icon: "📈",
    title: "Readability Scoring",
    subtitle: "Statistical Text Analysis",
    description:
      "Tính toán chỉ số đọc hiểu bằng công thức Flesch Reading Ease, Gunning Fog Index, và phân tích cấu trúc câu/đoạn văn.",
    tags: ["Flesch", "Gunning Fog", "Statistics"],
    color: "from-lime-500 to-green-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          🤖 AI CopyWriter Dashboard
        </h1>
        <p className="mt-2 text-slate-600 text-lg">
          Ứng dụng tạo nội dung AI với các tính năng nâng cao — Đồ án môn học
          NT114.Q21
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <Link key={i} href={f.href} className="group">
            <div className="bg-white rounded-xl border border-slate-200 p-5 h-full shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${f.color} text-white text-lg mb-3`}
              >
                {f.icon}
              </div>
              <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs font-medium text-indigo-500 mt-0.5 mb-2">
                {f.subtitle}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                {f.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {f.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          🏗️ Kiến trúc hệ thống
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="font-medium text-slate-900 mb-1">Frontend</p>
            <p className="text-slate-600">
              Next.js 14, React 18, TypeScript, Tailwind CSS, App Router
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="font-medium text-slate-900 mb-1">Backend</p>
            <p className="text-slate-600">
              Node.js, Express, SSE Streaming, REST API, JWT Auth
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="font-medium text-slate-900 mb-1">AI / Algorithms</p>
            <p className="text-slate-600">
              OpenAI, Gemini, Cosine Similarity, LCS, TF-IDF, Rabin-Karp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
