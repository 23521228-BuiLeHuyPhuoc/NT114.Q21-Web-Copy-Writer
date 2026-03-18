"use client";

import { useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Version {
  id: string;
  versionNumber: number;
  content: string;
  createdAt: string;
  wordCount: number;
}

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber?: number;
}

interface DiffResult {
  additions: number;
  deletions: number;
  changes: DiffLine[];
}

const CONTENT_ID = "demo-content-001";

// Local diff implementation used when backend is unavailable
function computeLocalDiff(oldText: string, newText: string): DiffResult {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");

  const m = oldLines.length;
  const n = newLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const changes: DiffLine[] = [];
  let i = m,
    j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      changes.unshift({
        type: "unchanged",
        content: oldLines[i - 1],
        lineNumber: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      changes.unshift({
        type: "added",
        content: newLines[j - 1],
        lineNumber: j,
      });
      j--;
    } else {
      changes.unshift({
        type: "removed",
        content: oldLines[i - 1],
        lineNumber: i,
      });
      i--;
    }
  }

  return {
    additions: changes.filter((c) => c.type === "added").length,
    deletions: changes.filter((c) => c.type === "removed").length,
    changes,
  };
}

export default function VersionsPage() {
  const [content, setContent] = useState(
    "# AI CopyWriter\n\nĐây là nội dung ban đầu.\n\nHệ thống quản lý phiên bản cho phép theo dõi mọi thay đổi.",
  );
  const [versions, setVersions] = useState<Version[]>([
    {
      id: "v-init",
      versionNumber: 1,
      content:
        "# AI CopyWriter\n\nĐây là nội dung ban đầu.\n\nHệ thống quản lý phiên bản cho phép theo dõi mọi thay đổi.",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      wordCount: 18,
    },
  ]);
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [selectedV1, setSelectedV1] = useState<number>(0);
  const [selectedV2, setSelectedV2] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  const handleSave = useCallback(async () => {
    if (!content.trim()) {
      setError("Nội dung không được trống");
      return;
    }

    setLoading(true);
    setError("");
    setSaveMsg("");

    try {
      const res = await fetch(
        `${API_URL}/api/content/${CONTENT_ID}/version`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        },
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const newVersion: Version = data.data || data;
      setVersions((prev) => [...prev, newVersion]);
      setSaveMsg("✅ Đã lưu phiên bản mới!");
    } catch {
      // fallback: save locally
      const newVersion: Version = {
        id: `v-${Date.now()}`,
        versionNumber: versions.length + 1,
        content,
        createdAt: new Date().toISOString(),
        wordCount: content.split(/\s+/).filter(Boolean).length,
      };
      setVersions((prev) => [...prev, newVersion]);
      setSaveMsg("✅ Đã lưu (local mode)!");
    } finally {
      setLoading(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  }, [content, versions.length]);

  const handleCompare = useCallback(
    async (v1Idx: number, v2Idx: number) => {
      if (v1Idx === v2Idx) {
        setDiff(null);
        return;
      }

      setSelectedV1(v1Idx);
      setSelectedV2(v2Idx);
      setLoading(true);

      const ver1 = versions[v1Idx];
      const ver2 = versions[v2Idx];

      try {
        const res = await fetch(
          `${API_URL}/api/content/${CONTENT_ID}/versions/compare?v1=${ver1.versionNumber}&v2=${ver2.versionNumber}`,
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setDiff(data.data || data);
      } catch {
        // local diff
        setDiff(computeLocalDiff(ver1.content, ver2.content));
      } finally {
        setLoading(false);
      }
    },
    [versions],
  );

  const handleRestore = (version: Version) => {
    setContent(version.content);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          🕐 Version History
        </h1>
        <p className="text-slate-600 mt-1">
          Quản lý phiên bản nội dung với{" "}
          <span className="font-medium text-cyan-600">
            Diff Algorithm (LCS-based)
          </span>
        </p>
        <div className="mt-2 bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-sm text-cyan-800">
          <strong>🔬 Thuật toán:</strong> Sử dụng Longest Common Subsequence
          (LCS) với quy hoạch động O(m×n) để tính diff giữa hai phiên bản.
          Backtrack qua bảng DP để xác định dòng added (thêm), removed (xóa),
          unchanged (giữ nguyên).
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Editor */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">✏️ Text Editor</h3>
            <div className="flex items-center gap-2">
              {saveMsg && (
                <span className="text-sm text-emerald-600">{saveMsg}</span>
              )}
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "⏳" : "💾"} Save Version
              </button>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
          />
          <div className="mt-2 text-xs text-slate-500">
            {content.split(/\s+/).filter(Boolean).length} từ •{" "}
            {content.length} ký tự • {content.split("\n").length} dòng
          </div>
        </div>

        {/* Version List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-3">
            📋 Versions ({versions.length})
          </h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {versions.map((v, idx) => (
              <div
                key={v.id}
                className="bg-slate-50 rounded-lg p-3 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-800">
                    v{v.versionNumber}
                  </span>
                  <span className="text-xs text-slate-500">
                    {v.wordCount} từ
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  {formatDate(v.createdAt)}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleRestore(v)}
                    className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded hover:bg-cyan-200 transition-colors"
                  >
                    ↩️ Restore
                  </button>
                  {idx > 0 && (
                    <button
                      onClick={() => handleCompare(idx - 1, idx)}
                      className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition-colors"
                    >
                      🔀 Diff
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {versions.length >= 2 && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <p className="text-xs text-slate-600 mb-2 font-medium">
                So sánh tùy chọn:
              </p>
              <div className="flex gap-2">
                <select
                  value={selectedV1}
                  onChange={(e) => setSelectedV1(Number(e.target.value))}
                  className="flex-1 text-xs rounded border border-slate-300 px-2 py-1.5 bg-white"
                >
                  {versions.map((v, i) => (
                    <option key={v.id} value={i}>
                      v{v.versionNumber}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-400 self-center">vs</span>
                <select
                  value={selectedV2}
                  onChange={(e) => setSelectedV2(Number(e.target.value))}
                  className="flex-1 text-xs rounded border border-slate-300 px-2 py-1.5 bg-white"
                >
                  {versions.map((v, i) => (
                    <option key={v.id} value={i}>
                      v{v.versionNumber}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleCompare(selectedV1, selectedV2)}
                disabled={selectedV1 === selectedV2}
                className="mt-2 w-full text-xs bg-indigo-600 text-white py-1.5 rounded font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                🔀 Compare
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      {/* Diff Viewer */}
      {diff && (
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">
              🔀 Diff Viewer — v{versions[selectedV1]?.versionNumber} → v
              {versions[selectedV2]?.versionNumber}
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-emerald-600 font-medium">
                +{diff.additions} additions
              </span>
              <span className="text-red-600 font-medium">
                -{diff.deletions} deletions
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 overflow-hidden font-mono text-sm">
            {diff.changes.map((line, i) => (
              <div
                key={i}
                className={`flex ${
                  line.type === "added"
                    ? "bg-emerald-50"
                    : line.type === "removed"
                      ? "bg-red-50"
                      : "bg-white"
                }`}
              >
                <div className="w-10 text-right pr-2 py-0.5 text-xs text-slate-400 select-none border-r border-slate-200 shrink-0">
                  {line.lineNumber || ""}
                </div>
                <div className="w-6 text-center py-0.5 shrink-0">
                  {line.type === "added" && (
                    <span className="text-emerald-600 font-bold">+</span>
                  )}
                  {line.type === "removed" && (
                    <span className="text-red-600 font-bold">−</span>
                  )}
                </div>
                <div
                  className={`flex-1 py-0.5 px-2 ${
                    line.type === "added"
                      ? "text-emerald-800"
                      : line.type === "removed"
                        ? "text-red-800 line-through"
                        : "text-slate-700"
                  }`}
                >
                  {line.content || "\u00A0"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
