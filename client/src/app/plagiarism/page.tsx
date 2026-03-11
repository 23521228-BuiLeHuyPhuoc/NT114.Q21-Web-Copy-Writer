"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface MatchedSegment {
  text: string;
  sourceStart: number;
  sourceEnd: number;
  comparisonStart: number;
  comparisonEnd: number;
}

interface PlagiarismResult {
  overallScore: number;
  algorithms: {
    cosine: { score: number; description: string };
    jaccard: { score: number; description: string };
    lcs: { score: number; description: string };
    fingerprint: { score: number; description: string };
  };
  riskLevel: string;
  matchedSegments: MatchedSegment[];
  summary: string;
}

const mockResult: PlagiarismResult = {
  overallScore: 42.5,
  algorithms: {
    cosine: {
      score: 0.55,
      description:
        "Cosine Similarity đo góc giữa hai vector TF-IDF trong không gian đa chiều",
    },
    jaccard: {
      score: 0.38,
      description:
        "Jaccard Index = |A ∩ B| / |A ∪ B|, đo tỷ lệ từ chung giữa hai văn bản",
    },
    lcs: {
      score: 0.41,
      description:
        "Longest Common Subsequence tìm chuỗi con chung dài nhất bằng quy hoạch động O(m×n)",
    },
    fingerprint: {
      score: 0.36,
      description:
        "Rabin-Karp Fingerprinting sử dụng rolling hash để phát hiện đoạn trùng lặp",
    },
  },
  riskLevel: "medium",
  matchedSegments: [
    {
      text: "trí tuệ nhân tạo đang thay đổi cách chúng ta sáng tạo nội dung",
      sourceStart: 0,
      sourceEnd: 60,
      comparisonStart: 10,
      comparisonEnd: 70,
    },
    {
      text: "công nghệ AI giúp tối ưu hóa quy trình viết",
      sourceStart: 80,
      sourceEnd: 120,
      comparisonStart: 90,
      comparisonEnd: 130,
    },
  ],
  summary:
    "Phát hiện mức tương đồng trung bình giữa hai văn bản. Có 2 đoạn trùng lặp đáng chú ý.",
};

function AlgorithmBar({
  name,
  score,
  description,
}: {
  name: string;
  score: number;
  description: string;
}) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 70
      ? "from-red-500 to-red-400"
      : pct >= 40
        ? "from-amber-500 to-amber-400"
        : "from-emerald-500 to-emerald-400";

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-800">{name}</span>
        <span className="text-sm font-bold text-slate-900">{pct}%</span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}

function HighlightedText({
  text,
  segments,
  field,
}: {
  text: string;
  segments: MatchedSegment[];
  field: "source" | "comparison";
}) {
  if (!segments.length) {
    return <span>{text}</span>;
  }

  const ranges = segments
    .map((s) =>
      field === "source"
        ? { start: s.sourceStart, end: s.sourceEnd }
        : { start: s.comparisonStart, end: s.comparisonEnd },
    )
    .sort((a, b) => a.start - b.start);

  const parts: { text: string; highlighted: boolean }[] = [];
  let cursor = 0;

  for (const range of ranges) {
    const start = Math.max(range.start, cursor);
    const end = Math.min(range.end, text.length);

    if (start > cursor) {
      parts.push({ text: text.slice(cursor, start), highlighted: false });
    }
    if (end > start) {
      parts.push({ text: text.slice(start, end), highlighted: true });
    }
    cursor = end;
  }

  if (cursor < text.length) {
    parts.push({ text: text.slice(cursor), highlighted: false });
  }

  return (
    <span>
      {parts.map((p, i) =>
        p.highlighted ? (
          <mark key={i} className="bg-red-200 text-red-900 px-0.5 rounded">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </span>
  );
}

export default function PlagiarismPage() {
  const [sourceText, setSourceText] = useState("");
  const [comparisonText, setComparisonText] = useState("");
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  const handleCheck = async () => {
    if (!sourceText.trim() || !comparisonText.trim()) {
      setError("Vui lòng nhập cả hai văn bản");
      return;
    }

    setLoading(true);
    setError("");
    setDemoMode(false);

    try {
      const res = await fetch(`${API_URL}/api/content/check-plagiarism`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText,
          comparisonText,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data.data || data);
    } catch (err) {
      console.warn("API unavailable, using demo mode:", err);
      setDemoMode(true);
      setResult(mockResult);
    } finally {
      setLoading(false);
    }
  };

  const riskBadge: Record<string, string> = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          🛡️ Plagiarism Detection
        </h1>
        <p className="text-slate-600 mt-1">
          Kiểm tra đạo văn với{" "}
          <span className="font-medium text-orange-600">
            4 thuật toán phân tích tương đồng
          </span>
        </p>
        <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
          <strong>🔬 Thuật toán:</strong> (1) Cosine Similarity — vector space
          model với TF-IDF. (2) Jaccard Index — tỷ lệ giao/hợp tập từ. (3) LCS
          — quy hoạch động O(m×n). (4) Rabin-Karp Fingerprinting — rolling hash
          phát hiện đoạn trùng.
        </div>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            📄 Văn bản gốc
          </label>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Nhập hoặc dán văn bản gốc vào đây..."
            rows={8}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            📋 Văn bản so sánh
          </label>
          <textarea
            value={comparisonText}
            onChange={(e) => setComparisonText(e.target.value)}
            placeholder="Nhập hoặc dán văn bản cần kiểm tra vào đây..."
            rows={8}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
        </div>
      </div>

      <button
        onClick={handleCheck}
        disabled={loading}
        className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-orange-700 disabled:opacity-50 transition-colors mb-6"
      >
        {loading ? "⏳ Đang phân tích..." : "🛡️ Kiểm tra đạo văn"}
      </button>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {demoMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
              ⚠️ Đang hiển thị dữ liệu demo (backend không khả dụng)
            </div>
          )}

          {/* Overall Score + Risk Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
              <h3 className="font-semibold text-slate-800 mb-2">
                📊 Điểm tương đồng
              </h3>
              <div className="text-5xl font-bold text-slate-900">
                {result.overallScore.toFixed(1)}
                <span className="text-lg text-slate-400">%</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
              <h3 className="font-semibold text-slate-800 mb-2">
                ⚠️ Mức rủi ro
              </h3>
              <span
                className={`inline-block text-lg font-bold px-4 py-2 rounded-full ${riskBadge[result.riskLevel] || "bg-slate-100 text-slate-700"}`}
              >
                {result.riskLevel.toUpperCase()}
              </span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-center">
              <h3 className="font-semibold text-slate-800 mb-2">
                🔗 Đoạn trùng
              </h3>
              <div className="text-5xl font-bold text-slate-900">
                {result.matchedSegments.length}
              </div>
            </div>
          </div>

          {/* Algorithm Scores */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-4">
              🧮 Chi tiết thuật toán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AlgorithmBar
                name="Cosine Similarity"
                score={result.algorithms.cosine.score}
                description={result.algorithms.cosine.description}
              />
              <AlgorithmBar
                name="Jaccard Index"
                score={result.algorithms.jaccard.score}
                description={result.algorithms.jaccard.description}
              />
              <AlgorithmBar
                name="Longest Common Subsequence"
                score={result.algorithms.lcs.score}
                description={result.algorithms.lcs.description}
              />
              <AlgorithmBar
                name="Rabin-Karp Fingerprinting"
                score={result.algorithms.fingerprint.score}
                description={result.algorithms.fingerprint.description}
              />
            </div>
          </div>

          {/* Matched Segments */}
          {result.matchedSegments.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-semibold text-slate-800 mb-4">
                🔍 Đoạn trùng lặp (Highlighted)
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Văn bản gốc
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm leading-relaxed">
                    <HighlightedText
                      text={sourceText || "Văn bản gốc..."}
                      segments={result.matchedSegments}
                      field="source"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Văn bản so sánh
                  </p>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm leading-relaxed">
                    <HighlightedText
                      text={comparisonText || "Văn bản so sánh..."}
                      segments={result.matchedSegments}
                      field="comparison"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {result.matchedSegments.map((seg, i) => (
                  <div
                    key={i}
                    className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm"
                  >
                    <span className="font-medium text-red-800">
                      Match #{i + 1}:
                    </span>{" "}
                    <span className="text-red-700">
                      &ldquo;{seg.text}&rdquo;
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-700">
            <strong>📝 Tóm tắt:</strong> {result.summary}
          </div>
        </div>
      )}
    </div>
  );
}
