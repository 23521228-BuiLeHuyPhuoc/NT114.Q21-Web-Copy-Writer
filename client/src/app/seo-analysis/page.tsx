"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface KeywordAnalysis {
  keyword: string;
  count: number;
  density: number;
  prominence: number;
}

interface SeoResult {
  overallScore: number;
  readability: {
    fleschReadingEase: number;
    fleschKincaidGrade: number;
    gunningFogIndex: number;
    avgSentenceLength: number;
    avgWordLength: number;
  };
  keywords: KeywordAnalysis[];
  structure: {
    hasH1: boolean;
    headingCount: number;
    paragraphCount: number;
    hasMetaDescription: boolean;
    hasImages: boolean;
    internalLinks: number;
    externalLinks: number;
  };
  contentMetrics: {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    avgWordsPerSentence: number;
    uniqueWords: number;
    vocabularyRichness: number;
  };
  suggestions: { type: string; message: string; priority: string }[];
}

const mockSeoResult: SeoResult = {
  overallScore: 72,
  readability: {
    fleschReadingEase: 65.2,
    fleschKincaidGrade: 8.4,
    gunningFogIndex: 10.1,
    avgSentenceLength: 15.3,
    avgWordLength: 4.8,
  },
  keywords: [
    { keyword: "ai", count: 8, density: 3.2, prominence: 85 },
    { keyword: "content", count: 6, density: 2.4, prominence: 70 },
    { keyword: "copywriter", count: 4, density: 1.6, prominence: 60 },
    { keyword: "seo", count: 3, density: 1.2, prominence: 45 },
    { keyword: "analysis", count: 2, density: 0.8, prominence: 30 },
  ],
  structure: {
    hasH1: true,
    headingCount: 4,
    paragraphCount: 6,
    hasMetaDescription: false,
    hasImages: false,
    internalLinks: 2,
    externalLinks: 1,
  },
  contentMetrics: {
    wordCount: 250,
    sentenceCount: 18,
    paragraphCount: 6,
    avgWordsPerSentence: 13.9,
    uniqueWords: 145,
    vocabularyRichness: 0.58,
  },
  suggestions: [
    {
      type: "keyword",
      message: "Tăng mật độ từ khóa chính lên 2-3%",
      priority: "high",
    },
    {
      type: "structure",
      message: "Thêm meta description cho nội dung",
      priority: "high",
    },
    {
      type: "readability",
      message: "Điểm Flesch Reading Ease ở mức trung bình, cân nhắc đơn giản hóa câu",
      priority: "medium",
    },
    {
      type: "content",
      message: "Thêm hình ảnh để tăng tính trực quan",
      priority: "medium",
    },
    {
      type: "links",
      message: "Tăng số lượng internal links để cải thiện SEO",
      priority: "low",
    },
  ],
};

function ScoreCircle({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "text-emerald-500"
      : score >= 60
        ? "text-amber-500"
        : "text-red-500";
  const strokeColor =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${color}`}>{score}</span>
        <span className="text-xs text-slate-500">/ 100</span>
      </div>
    </div>
  );
}

function ProgressBar({
  value,
  max = 100,
  label,
  suffix = "",
}: {
  value: number;
  max?: number;
  label: string;
  suffix?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-800">
          {typeof value === "number" ? value.toFixed(1) : value}
          {suffix}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function SeoAnalysisPage() {
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState("");
  const [result, setResult] = useState<SeoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError("Vui lòng nhập nội dung để phân tích");
      return;
    }

    setLoading(true);
    setError("");
    setDemoMode(false);

    try {
      const res = await fetch(`${API_URL}/api/content/analyze-seo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data.data || data);
    } catch (err) {
      console.warn("API unavailable, using demo mode:", err);
      setDemoMode(true);
      setResult(mockSeoResult);
    } finally {
      setLoading(false);
    }
  };

  const priorityColor: Record<string, string> = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">🔍 SEO Analysis</h1>
        <p className="text-slate-600 mt-1">
          Phân tích nội dung toàn diện với{" "}
          <span className="font-medium text-emerald-600">
            Flesch-Kincaid, TF-IDF, Gunning Fog Index
          </span>
        </p>
        <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800">
          <strong>🔬 Thuật toán:</strong> Flesch Reading Ease = 206.835 −
          1.015(words/sentences) − 84.6(syllables/words). TF-IDF đánh giá tầm
          quan trọng từ khóa. Gunning Fog = 0.4[(words/sentences) +
          100(complex_words/words)].
        </div>
      </div>

      {/* Input */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              📝 Nội dung cần phân tích
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dán nội dung bài viết, blog post, hoặc landing page vào đây..."
              rows={6}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                🎯 Từ khóa mục tiêu
              </label>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="ai, copywriter, seo (cách nhau bởi dấu phẩy)"
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-emerald-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors mt-auto"
            >
              {loading ? "⏳ Đang phân tích..." : "🔍 Phân tích SEO"}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            ❌ {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {demoMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
              ⚠️ Đang hiển thị dữ liệu demo (backend không khả dụng)
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Overall Score */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col items-center">
              <h3 className="font-semibold text-slate-800 mb-3">
                📊 Điểm tổng thể
              </h3>
              <ScoreCircle score={result.overallScore} />
              <p className="mt-2 text-sm text-slate-500">
                {result.overallScore >= 80
                  ? "Tốt"
                  : result.overallScore >= 60
                    ? "Trung bình"
                    : "Cần cải thiện"}
              </p>
            </div>

            {/* Readability */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-semibold text-slate-800 mb-3">
                📖 Readability
              </h3>
              <div className="space-y-3">
                <ProgressBar
                  label="Flesch Reading Ease"
                  value={result.readability.fleschReadingEase}
                />
                <ProgressBar
                  label="Flesch-Kincaid Grade"
                  value={result.readability.fleschKincaidGrade}
                  max={20}
                />
                <ProgressBar
                  label="Gunning Fog Index"
                  value={result.readability.gunningFogIndex}
                  max={20}
                />
                <ProgressBar
                  label="Avg Sentence Length"
                  value={result.readability.avgSentenceLength}
                  max={30}
                  suffix=" words"
                />
              </div>
            </div>

            {/* Content Metrics */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-semibold text-slate-800 mb-3">
                📏 Content Metrics
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Số từ", result.contentMetrics.wordCount],
                  ["Số câu", result.contentMetrics.sentenceCount],
                  ["Số đoạn", result.contentMetrics.paragraphCount],
                  [
                    "TB từ/câu",
                    result.contentMetrics.avgWordsPerSentence.toFixed(1),
                  ],
                  ["Từ duy nhất", result.contentMetrics.uniqueWords],
                  [
                    "Độ phong phú",
                    (result.contentMetrics.vocabularyRichness * 100).toFixed(0) +
                      "%",
                  ],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between">
                    <span className="text-slate-600">{label}</span>
                    <span className="font-medium text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Keyword Analysis */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-3">
              🎯 Keyword Analysis (TF-IDF)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 text-slate-600 font-medium">
                      Từ khóa
                    </th>
                    <th className="text-center py-2 px-3 text-slate-600 font-medium">
                      Số lần
                    </th>
                    <th className="text-center py-2 px-3 text-slate-600 font-medium">
                      Mật độ
                    </th>
                    <th className="text-left py-2 px-3 text-slate-600 font-medium">
                      Prominence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.keywords.map((kw) => (
                    <tr
                      key={kw.keyword}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-2 px-3 font-medium text-slate-800">
                        {kw.keyword}
                      </td>
                      <td className="py-2 px-3 text-center">{kw.count}</td>
                      <td className="py-2 px-3 text-center">
                        {kw.density.toFixed(1)}%
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${kw.prominence}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 w-8">
                            {kw.prominence}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Structure Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-semibold text-slate-800 mb-3">
                🏗️ Structure Analysis
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  [
                    "H1 Tag",
                    result.structure.hasH1,
                    result.structure.hasH1 ? "✅" : "❌",
                  ],
                  [
                    "Headings",
                    true,
                    `${result.structure.headingCount} found`,
                  ],
                  [
                    "Paragraphs",
                    true,
                    `${result.structure.paragraphCount} found`,
                  ],
                  [
                    "Meta Description",
                    result.structure.hasMetaDescription,
                    result.structure.hasMetaDescription ? "✅" : "❌ Missing",
                  ],
                  [
                    "Images",
                    result.structure.hasImages,
                    result.structure.hasImages ? "✅" : "❌ Missing",
                  ],
                  [
                    "Internal Links",
                    true,
                    String(result.structure.internalLinks),
                  ],
                  [
                    "External Links",
                    true,
                    String(result.structure.externalLinks),
                  ],
                ].map(([label, ok, display]) => (
                  <div
                    key={String(label)}
                    className="flex justify-between items-center py-1"
                  >
                    <span className="text-slate-600">{String(label)}</span>
                    <span
                      className={`font-medium ${ok ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {String(display)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-semibold text-slate-800 mb-3">
                💡 Đề xuất cải thiện
              </h3>
              <div className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 bg-slate-50 rounded-lg p-3"
                  >
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${priorityColor[s.priority] || "bg-slate-100 text-slate-600"}`}
                    >
                      {s.priority}
                    </span>
                    <p className="text-sm text-slate-700">{s.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
