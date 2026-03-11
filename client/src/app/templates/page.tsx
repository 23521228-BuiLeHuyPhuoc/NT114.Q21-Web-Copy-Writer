"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const sampleTemplate = `Xin chào {{name | capitalize}},

Cảm ơn bạn đã đặt hàng tại {{company | upper}}.

Chi tiết đơn hàng #{{orderId}}:
{% for item in items %}
  - {{item.name}}: {{item.price | default:"Liên hệ"}} VND (x{{item.qty}})
{% endfor %}

{% if discount %}
  🎉 Bạn được giảm giá {{discount}}%!
{% endif %}

Tổng cộng: {{total}} VND
Ngày đặt: {{orderDate | date:"DD/MM/YYYY"}}

Trân trọng,
{{company}} Team`;

const sampleVariables = JSON.stringify(
  {
    name: "nguyễn văn a",
    company: "ai copywriter",
    orderId: "VN-2024-001",
    items: [
      { name: "Gói Premium", price: "599000", qty: 1 },
      { name: "Add-on SEO", price: "199000", qty: 2 },
      { name: "Template Pack", price: null, qty: 1 },
    ],
    discount: 15,
    total: "847150",
    orderDate: "2024-12-15T10:30:00Z",
  },
  null,
  2,
);

const mockRendered = `Xin chào Nguyễn Văn A,

Cảm ơn bạn đã đặt hàng tại AI COPYWRITER.

Chi tiết đơn hàng #VN-2024-001:

  - Gói Premium: 599000 VND (x1)

  - Add-on SEO: 199000 VND (x2)

  - Template Pack: Liên hệ VND (x1)


  🎉 Bạn được giảm giá 15%!


Tổng cộng: 847150 VND
Ngày đặt: 15/12/2024

Trân trọng,
ai copywriter Team`;

const filters = [
  {
    name: "upper",
    desc: "Chuyển thành chữ HOA",
    example: '{{name | upper}} → "NGUYỄN VĂN A"',
  },
  {
    name: "lower",
    desc: "Chuyển thành chữ thường",
    example: '{{name | lower}} → "nguyễn văn a"',
  },
  {
    name: "capitalize",
    desc: "Viết hoa chữ cái đầu mỗi từ",
    example: '{{name | capitalize}} → "Nguyễn Văn A"',
  },
  {
    name: "truncate:N",
    desc: "Cắt chuỗi tối đa N ký tự",
    example: '{{text | truncate:50}} → "Đây là đoạn văn bản..."',
  },
  {
    name: "default:value",
    desc: "Giá trị mặc định nếu null/undefined",
    example: '{{price | default:"Liên hệ"}} → "Liên hệ"',
  },
  {
    name: "replace:a:b",
    desc: "Thay thế chuỗi a bằng b",
    example: '{{text | replace:" ":"_"}} → "hello_world"',
  },
  {
    name: 'date:"format"',
    desc: "Định dạng ngày tháng",
    example: '{{date | date:"DD/MM/YYYY"}} → "15/12/2024"',
  },
];

const syntaxGuide = [
  { syntax: "{{variable}}", desc: "Hiển thị giá trị biến" },
  { syntax: "{{var | filter}}", desc: "Áp dụng filter lên biến" },
  { syntax: "{% for item in list %}", desc: "Vòng lặp qua mảng" },
  { syntax: "{% endfor %}", desc: "Kết thúc vòng lặp" },
  { syntax: "{% if condition %}", desc: "Điều kiện if" },
  { syntax: "{% endif %}", desc: "Kết thúc điều kiện" },
  { syntax: "{{item.property}}", desc: "Truy cập thuộc tính đối tượng" },
];

export default function TemplatesPage() {
  const [template, setTemplate] = useState(sampleTemplate);
  const [variables, setVariables] = useState(sampleVariables);
  const [rendered, setRendered] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [demoMode, setDemoMode] = useState(false);

  const validateJson = (str: string): boolean => {
    try {
      JSON.parse(str);
      setJsonError("");
      return true;
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : "JSON không hợp lệ");
      return false;
    }
  };

  const handleRender = async () => {
    if (!template.trim()) {
      setError("Vui lòng nhập template");
      return;
    }

    if (!validateJson(variables)) return;

    setLoading(true);
    setError("");
    setDemoMode(false);

    try {
      const res = await fetch(`${API_URL}/api/templates/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template,
          variables: JSON.parse(variables),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRendered(data.data?.rendered || data.rendered || data.data || "");
    } catch (err) {
      console.warn("API unavailable, using demo mode:", err);
      setDemoMode(true);
      setRendered(mockRendered);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          📄 Template Engine
        </h1>
        <p className="text-slate-600 mt-1">
          Hệ thống template tùy chỉnh với{" "}
          <span className="font-medium text-pink-600">
            biến, vòng lặp, điều kiện và bộ lọc (filters)
          </span>
        </p>
        <div className="mt-2 bg-pink-50 border border-pink-200 rounded-lg p-3 text-sm text-pink-800">
          <strong>🔬 Kỹ thuật:</strong> Custom template engine sử dụng regex
          parsing và recursive descent để xử lý nested loops, conditions.
          Filters được implement dưới dạng pipeline pattern: value | filter1 |
          filter2.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Template Editor */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-2">
            ✏️ Template Editor
          </h3>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={18}
            spellCheck={false}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none bg-slate-50"
          />
        </div>

        {/* Variables */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-2">
            📦 Variables (JSON)
          </h3>
          <textarea
            value={variables}
            onChange={(e) => {
              setVariables(e.target.value);
              validateJson(e.target.value);
            }}
            rows={18}
            spellCheck={false}
            className={`w-full rounded-lg border px-3 py-2 text-sm font-mono focus:ring-2 resize-none bg-slate-50 ${
              jsonError
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-slate-300 focus:ring-pink-500 focus:border-pink-500"
            }`}
          />
          {jsonError && (
            <p className="mt-1 text-xs text-red-600">❌ {jsonError}</p>
          )}
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-800">👁️ Preview</h3>
            {demoMode && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                Demo
              </span>
            )}
          </div>
          <div className="flex-1 rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm whitespace-pre-wrap font-mono min-h-[300px] overflow-y-auto">
            {rendered || (
              <span className="text-slate-400">
                Nhấn &ldquo;Render&rdquo; để xem kết quả...
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleRender}
        disabled={loading}
        className="mt-4 w-full bg-pink-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-pink-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "⏳ Đang render..." : "🚀 Render Template"}
      </button>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      {/* Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-3">
            🔧 Available Filters
          </h3>
          <div className="space-y-2">
            {filters.map((f) => (
              <div key={f.name} className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-0.5">
                  <code className="text-xs bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded font-mono">
                    {f.name}
                  </code>
                  <span className="text-sm text-slate-700">{f.desc}</span>
                </div>
                <p className="text-xs text-slate-500 font-mono">{f.example}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Syntax Guide */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-3">
            📖 Template Syntax Guide
          </h3>
          <div className="space-y-2">
            {syntaxGuide.map((s) => (
              <div
                key={s.syntax}
                className="flex items-center gap-3 bg-slate-50 rounded-lg p-3"
              >
                <code className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-mono shrink-0">
                  {s.syntax}
                </code>
                <span className="text-sm text-slate-600">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
