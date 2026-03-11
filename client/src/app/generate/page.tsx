"use client";

import { useState, useRef, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const contentTypes = [
  { value: "blog", label: "📝 Blog Post" },
  { value: "ad", label: "📢 Advertisement" },
  { value: "email", label: "📧 Email" },
  { value: "product", label: "🛍️ Product Description" },
  { value: "social", label: "📱 Social Media" },
  { value: "seo", label: "🔍 SEO Content" },
  { value: "script", label: "🎬 Script" },
  { value: "headline", label: "📰 Headlines" },
];

const tones = [
  "professional",
  "casual",
  "friendly",
  "formal",
  "humorous",
  "persuasive",
  "informative",
  "urgent",
];

const models = [
  { value: "openai", label: "OpenAI GPT-4" },
  { value: "gemini", label: "Google Gemini" },
  { value: "claude", label: "Anthropic Claude" },
  { value: "ollama", label: "Ollama (Local)" },
];

// Mock SSE data used when backend is unavailable
const mockContent = `# Nội dung được tạo bởi AI CopyWriter

Đây là nội dung mẫu được tạo ở chế độ demo (không cần backend).

## Giới thiệu

AI CopyWriter sử dụng công nghệ **Server-Sent Events (SSE)** để truyền tải nội dung theo thời gian thực. Khi kết nối với backend, bạn sẽ thấy nội dung xuất hiện từng từ một — giống như ChatGPT.

## Tính năng nổi bật

1. **Streaming thời gian thực**: Nội dung được truyền qua SSE protocol
2. **Đa mô hình AI**: Hỗ trợ GPT-4, Gemini, Claude, Ollama
3. **Nhiều loại nội dung**: Blog, quảng cáo, email, sản phẩm, mạng xã hội
4. **Tùy chỉnh tone**: Chuyên nghiệp, thân thiện, hài hước, thuyết phục

## Kết luận

Đây là bản demo. Kết nối backend để trải nghiệm đầy đủ tính năng SSE streaming.`;

export default function GeneratePage() {
  const [contentType, setContentType] = useState("blog");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [model, setModel] = useState("openai");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const simulateStreaming = useCallback(async (text: string) => {
    const words = text.split("");
    const total = words.length;
    setOutput("");
    for (let i = 0; i < total; i++) {
      await new Promise((r) => setTimeout(r, 12));
      setOutput((prev) => prev + words[i]);
      setProgress(Math.round(((i + 1) / total) * 100));
    }
    setLoading(false);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Vui lòng nhập prompt");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");
    setProgress(0);
    setDemoMode(false);

    try {
      abortRef.current = new AbortController();

      const response = await fetch(`${API_URL}/api/content/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: contentType,
          prompt,
          tone,
          model,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream");

      const decoder = new TextDecoder();
      let totalChunks = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              setProgress(100);
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setOutput((prev) => prev + parsed.content);
                totalChunks++;
                setProgress(Math.min(95, totalChunks * 2));
              }
              if (parsed.error) {
                setError(parsed.error);
              }
            } catch {
              // plain text SSE
              setOutput((prev) => prev + data);
              totalChunks++;
              setProgress(Math.min(95, totalChunks * 2));
            }
          }
        }
      }

      setProgress(100);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;

      console.warn("API unavailable, using demo mode:", err);
      setDemoMode(true);
      setError("");
      await simulateStreaming(mockContent);
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          ✨ AI Content Generation
        </h1>
        <p className="text-slate-600 mt-1">
          Tạo nội dung với{" "}
          <span className="font-medium text-indigo-600">
            Server-Sent Events (SSE) Streaming
          </span>{" "}
          — Nội dung xuất hiện theo thời gian thực, từng token một
        </p>
        <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-800">
          <strong>🔬 Thuật toán:</strong> SSE protocol cho phép server push dữ
          liệu liên tục qua HTTP connection. Client sử dụng ReadableStream API
          để xử lý từng chunk dữ liệu, tạo hiệu ứng typewriter.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-slate-800">⚙️ Cấu hình</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Loại nội dung
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {contentTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                AI Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {models.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tone / Giọng văn
            </label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    tone === t
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Mô tả nội dung bạn muốn tạo..."
              rows={6}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "⏳ Đang tạo..." : "✨ Generate"}
            </button>
            {loading && (
              <button
                onClick={handleStop}
                className="px-4 bg-red-500 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-red-600 transition-colors"
              >
                ⏹ Stop
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              ❌ {error}
            </div>
          )}
        </div>

        {/* Output panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">📄 Kết quả</h3>
            {demoMode && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                Demo Mode
              </span>
            )}
          </div>

          {/* Progress bar */}
          {loading && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Đang streaming...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="min-h-[300px] max-h-[500px] overflow-y-auto rounded-lg bg-slate-50 border border-slate-200 p-4">
            {output ? (
              <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {output}
                {loading && (
                  <span className="inline-block w-2 h-4 bg-indigo-500 ml-0.5 animate-pulse" />
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Nội dung sẽ xuất hiện ở đây...
              </div>
            )}
          </div>

          {output && !loading && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {output.length} ký tự • {output.split(/\s+/).length} từ
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                📋 Copy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
