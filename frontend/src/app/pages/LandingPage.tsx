import { useNavigate, Link } from 'react-router-dom';
import { PublicNavbar } from '@/app/components/PublicNavbar';
import { PublicFooter } from '@/app/components/PublicFooter';
import { AIDemoSection } from '@/app/components/AIDemoSection';
import { HeroGeneratorDemo } from '@/app/components/HeroGeneratorDemo';
import { Badge } from '@/app/components/ui/badge';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import {
  Sparkles, Wand2, FileText, TrendingUp, ShoppingBag, Home,
  Cpu, Utensils, Stethoscope, GraduationCap, Star, CheckCircle2,
  ArrowRight, Zap, Shield, Users, Brain, Key, ChevronRight,
  Play, BarChart3, Globe, DollarSign, Shirt, Plane,
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────────────── */

const HERO_IMG = 'https://images.unsplash.com/photo-1749006590639-e749e6b7d84c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200';
const TEAM_IMG = 'https://images.unsplash.com/photo-1758518731468-98e90ffd7430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900';

const FEATURES = [
  {
    icon: Wand2,
    title: 'AI Generator đa model',
    desc: 'GPT-4o, Llama 3.1 70B và model Fine-tuned của riêng bạn — chọn AI phù hợp từng ngữ cảnh.',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    tag: 'Core',
  },
  {
    icon: Brain,
    title: 'Fine-tuning Studio',
    desc: 'Huấn luyện AI theo giọng văn thương hiệu. Cung cấp ví dụ, AI học và copy đúng "tone of voice" của bạn.',
    color: 'from-teal-500 to-cyan-600',
    bg: 'bg-teal-50',
    tag: 'Độc quyền',
  },
  {
    icon: FileText,
    title: '100+ Template chuyên ngành',
    desc: 'Từ Facebook Ad, Email Marketing đến Landing Page — mỗi template được tối ưu cho từng ngành.',
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50',
    tag: 'Phổ biến',
  },
  {
    icon: Key,
    title: 'RESTful API mạnh mẽ',
    desc: 'Tích hợp CopyPro vào ứng dụng, CMS, hay workflow tự động hóa của bạn qua API chuẩn.',
    color: 'from-green-600 to-teal-600',
    bg: 'bg-green-50',
    tag: 'Developer',
  },
  {
    icon: Zap,
    title: 'Streaming tức thời',
    desc: 'Kết quả hiển thị theo từng từ như ChatGPT — không chờ đợi, trải nghiệm mượt mà.',
    color: 'from-yellow-500 to-green-500',
    bg: 'bg-yellow-50',
    tag: 'UX',
  },
  {
    icon: Shield,
    title: 'Bảo mật & Riêng tư',
    desc: 'Dữ liệu mã hóa AES-256, không dùng để train model. Llama 3.1 self-hosted cho nhu cầu bảo mật tuyệt đối.',
    color: 'from-slate-500 to-green-600',
    bg: 'bg-slate-50',
    tag: 'Enterprise',
  },
];

const INDUSTRIES = [
  { icon: ShoppingBag, name: 'E-commerce', color: 'text-green-700', bg: 'bg-green-100' },
  { icon: Home,        name: 'Bất Động Sản', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  { icon: Cpu,         name: 'Công Nghệ',    color: 'text-teal-700',   bg: 'bg-teal-100' },
  { icon: Utensils,    name: 'F&B',          color: 'text-orange-700', bg: 'bg-orange-100' },
  { icon: Stethoscope, name: 'Y Tế',         color: 'text-red-700',    bg: 'bg-red-100' },
  { icon: GraduationCap, name: 'Giáo Dục',  color: 'text-blue-700',   bg: 'bg-blue-100' },
  { icon: DollarSign,  name: 'Tài Chính',   color: 'text-violet-700', bg: 'bg-violet-100' },
  { icon: Shirt,       name: 'Thời Trang',  color: 'text-pink-700',   bg: 'bg-pink-100' },
  { icon: Globe,       name: 'Du Lịch',     color: 'text-sky-700',    bg: 'bg-sky-100' },
  { icon: Plane,       name: 'Logistics',   color: 'text-indigo-700', bg: 'bg-indigo-100' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Chọn ngành & loại nội dung', desc: 'Chọn từ 10+ ngành nghề và 8 loại copy: tiêu đề, mô tả, email, landing page, social...', icon: FileText },
  { step: '02', title: 'Nhập thông tin sản phẩm', desc: 'Tên sản phẩm, từ khóa, đối tượng mục tiêu. Càng chi tiết, copy càng chính xác.', icon: Wand2 },
  { step: '03', title: 'AI tạo đa phiên bản', desc: 'Chọn model (GPT-4o / Llama / Fine-tuned), tone giọng, số phiên bản. Kết quả trong 2-3 giây.', icon: Brain },
  { step: '04', title: 'Chỉnh sửa & sử dụng', desc: 'Chỉnh sửa trực tiếp, đánh giá chất lượng AI, copy và xuất bản ngay.', icon: CheckCircle2 },
];

const TESTIMONIALS = [
  {
    name: 'Trần Minh Khoa', role: 'CEO – Shopviet.vn',
    content: 'CopyPro giúp team marketing tạo nội dung cho 500+ SKU chỉ trong 1 tuần. CTR tăng 40%, doanh thu tháng sau tăng 28%. Đây là công cụ không thể thiếu.',
    rating: 5, avatar: 'TK', bg: 'from-green-600 to-emerald-700',
  },
  {
    name: 'Lê Thị Hương', role: 'Marketing Director – PropVN',
    content: 'Fine-tuning với giọng văn thương hiệu là killer feature. Mỗi copy đều đúng tone sang trọng của bất động sản cao cấp. Team sales yêu thích từ ngày 1.',
    rating: 5, avatar: 'LH', bg: 'from-teal-600 to-green-700',
  },
  {
    name: 'Phạm Đức Anh', role: 'Co-founder – TechStart VN',
    content: 'API integration chạy trong buổi sáng. Giờ toàn bộ pipeline marketing của chúng tôi được tự động hóa. ROI đạt 340% sau 6 tháng.',
    rating: 5, avatar: 'PA', bg: 'from-emerald-600 to-teal-700',
  },
];

const STATS = [
  { value: '2,000+', label: 'Doanh nghiệp tin dùng', icon: Users },
  { value: '500K+', label: 'Copy đã tạo', icon: BarChart3 },
  { value: '15+', label: 'Ngành nghề', icon: Globe },
  { value: '< 2 giây', label: 'Thời gian tạo copy', icon: Zap },
];

/* ─── Component ─────────────────────────────────────────────────── */

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <PublicNavbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-28 md:pt-36 pb-28 md:pb-36">
        {/* Background — own overflow-hidden so gradients don't leak */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-green-950 to-gray-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(34,197,94,0.18),transparent)]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          {/* Announcement bar */}
          <div className="flex justify-center mb-10">
            <Link to="/blog" className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/40 backdrop-blur rounded-full px-5 py-2 text-sm text-green-300 hover:bg-green-900/60 transition-colors">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
              Ra mắt API v2.0 — Nhanh hơn 3x, rẻ hơn 40%
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Two-column layout — 5/7 split gives demo more breathing room */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left: Text content */}
            <div className="text-center lg:text-left lg:col-span-5">
              <h1 className="text-white mb-6 leading-[1.08]">
                Nền tảng AI Copywriting{' '}
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  tích hợp GPT-4o &amp; Llama 3.1
                </span>
                {' '}cho doanh nghiệp Việt
              </h1>
              <p className="text-gray-400 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
                Tạo headline, email, landing page và social post chuyên nghiệp trong vài giây. Fine-tune AI theo giọng văn thương hiệu. Tích hợp qua RESTful API.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <button
                  onClick={() => navigate('/register')}
                  className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-2xl px-8 py-4 font-bold text-base transition-all shadow-xl shadow-green-900/40 hover:shadow-green-900/60 hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5" />
                  Dùng thử miễn phí 14 ngày
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="inline-flex items-center gap-2.5 bg-white/15 border border-white/30 text-white rounded-2xl px-8 py-4 font-semibold text-base transition-all hover:bg-white/25 backdrop-blur"
                >
                  <Play className="w-4 h-4" />
                  Xem demo
                </button>
              </div>

              {/* Social proof strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                  <span className="text-gray-400 text-sm ml-1">4.9 / 5</span>
                </div>
                <span className="text-gray-700">·</span>
                <span className="text-gray-400 text-sm"><span className="text-white font-semibold">2,000+</span> doanh nghiệp</span>
                <span className="text-gray-700">·</span>
                <span className="text-gray-400 text-sm">Không cần thẻ tín dụng</span>
              </div>
            </div>

            {/* Right: Hero animated demo */}
            <div className="w-full min-w-0 lg:col-span-7">
              <HeroGeneratorDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center">
                  <div className="inline-flex bg-green-100 p-3 rounded-2xl mb-3">
                    <Icon className="w-5 h-5 text-green-700" />
                  </div>
                  <p className="text-gray-900 tracking-tight">{s.value}</p>
                  <p className="text-gray-500 mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── AI DEMO ─── */}
      <AIDemoSection />

      {/* ─── FEATURES ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-5 bg-green-100 text-green-700 border-0 px-4 py-1.5 text-sm">Tính năng</Badge>
            <h2 className="text-gray-900 mb-5">
              Tất cả những gì bạn cần để tạo copy marketing đỉnh cao
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Từ AI Generator đến Fine-tuning Studio, RESTful API đến Template Library — một nền tảng, mọi nhu cầu copy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white rounded-3xl p-7 border border-gray-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-50 transition-all duration-300"
                >
                  <div className={`inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-gray-900">{f.title}</h3>
                    <Badge className={`${f.bg} text-green-700 border-0 text-xs flex-shrink-0 ml-2`}>{f.tag}</Badge>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  <div className="mt-5">
                    <button
                      onClick={() => navigate('/register')}
                      className="text-green-700 text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Khám phá ngay <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-5 bg-green-100 text-green-700 border-0 px-4 py-1.5 text-sm">Quy trình</Badge>
              <h2 className="text-gray-900 mb-5">
                4 bước — từ ý tưởng đến copy hoàn chỉnh
              </h2>
              <p className="text-gray-500 text-lg mb-12 leading-relaxed">
                Không cần học copywriting. Chỉ cần thông tin về sản phẩm của bạn — AI sẽ lo phần còn lại, theo đúng cách một chuyên gia sẽ làm.
              </p>
              <div className="space-y-8">
                {HOW_IT_WORKS.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="flex gap-5">
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200">
                          <span className="text-white text-sm font-bold">{step.step}</span>
                        </div>
                        {i < HOW_IT_WORKS.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-green-200 to-transparent mt-2 min-h-8" />}
                      </div>
                      <div className="pb-8">
                        <h4 className="text-gray-900 mb-1.5">{step.title}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => navigate('/register')}
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl px-7 py-3.5 font-bold text-sm transition-all shadow-lg shadow-green-200"
              >
                Thử ngay miễn phí <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: image with floating card — use pb to give space for the floating card */}
            <div className="relative pb-8 lg:pb-10">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={TEAM_IMG}
                  alt="Team using CopyPro"
                  className="w-full h-[480px] lg:h-[520px] object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5 pointer-events-none" />
              {/* Floating result card — stays inside on mobile, pops out on lg */}
              <div className="absolute bottom-0 left-4 lg:-bottom-2 lg:-left-8 bg-white rounded-2xl shadow-2xl p-4 lg:p-5 border border-gray-100 w-[200px] lg:max-w-xs lg:w-auto">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                  <span className="text-xs font-semibold text-green-700">AI đang tạo copy...</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "🔥 FLASH SALE 48H! Giảm đến 70% – Cơ hội vàng không thể bỏ lỡ!"
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">GPT-4o</Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">⭐ 94%</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INDUSTRIES ─── */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-700 relative overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-14">
            <Badge className="mb-5 bg-white/15 text-white border-white/20 px-4 py-1.5 text-sm">Ngành nghề</Badge>
            <h2 className="text-white mb-4">Tối ưu cho mọi lĩnh vực kinh doanh</h2>
            <p className="text-green-100 text-lg max-w-2xl mx-auto leading-relaxed">
              CopyPro hiểu sâu đặc thù từng ngành — terminology, tone, và pain point của khách hàng mục tiêu.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
            {INDUSTRIES.map((ind) => {
              const Icon = ind.icon;
              return (
                <div
                  key={ind.name}
                  className="bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl px-4 py-5 flex flex-col items-center gap-3 cursor-pointer transition-all hover:-translate-y-0.5 group"
                >
                  <div className="bg-white/20 group-hover:bg-white/30 p-3 rounded-xl transition-colors">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white text-sm font-semibold text-center leading-tight">{ind.name}</span>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-green-200 text-sm mb-6">+ 5 ngành nghề khác đang cập nhật</p>
            <Link to="/pricing">
              <button className="inline-flex items-center gap-2 bg-white text-green-700 rounded-2xl px-8 py-4 font-bold text-sm hover:bg-green-50 transition-colors shadow-xl">
                Xem toàn bộ tính năng <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <Badge className="mb-5 bg-yellow-100 text-yellow-700 border-0 px-4 py-1.5 text-sm">Phản hồi</Badge>
            <h2 className="text-gray-900 mb-4">
              Hàng nghìn marketer đã tăng trưởng cùng CopyPro
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="relative bg-white rounded-3xl p-7 border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.content}"</p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${t.bg} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPARISON ─── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-5 bg-green-100 text-green-700 border-0 px-4 py-1.5 text-sm">So sánh</Badge>
            <h2 className="text-gray-900 mb-4">CopyPro vs Cách thủ công</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Viết thủ công', icon: '😓', color: 'border-red-200 bg-red-50',
                points: [
                  { text: '3-5 giờ để viết 1 landing page', bad: true },
                  { text: 'Phụ thuộc cảm hứng của copywriter', bad: true },
                  { text: 'Chi phí freelancer 500K-2M/bài', bad: true },
                  { text: 'Khó test nhiều phiên bản', bad: true },
                  { text: 'Không thể scale nhanh', bad: true },
                ],
              },
              {
                title: 'CopyPro AI', icon: '🚀', color: 'border-green-300 bg-green-50',
                points: [
                  { text: 'Landing page hoàn chỉnh trong 3 phút', bad: false },
                  { text: 'Nhất quán 24/7, không phụ thuộc cảm hứng', bad: false },
                  { text: 'Tiết kiệm 80-90% chi phí sản xuất', bad: false },
                  { text: 'Test nhiều phiên bản với 1 click', bad: false },
                  { text: 'Scale không giới hạn cùng API', bad: false },
                ],
              },
            ].map((col) => (
              <div key={col.title} className={`rounded-3xl p-7 border-2 ${col.color}`}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{col.icon}</span>
                  <h3 className="text-gray-900">{col.title}</h3>
                </div>
                <ul className="space-y-3">
                  {col.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      {p.bad
                        ? <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-red-600">✕</span>
                        : <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      }
                      <span className={p.bad ? 'text-gray-600' : 'text-gray-800 font-medium'}>{p.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-green-950 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(34,197,94,0.15),transparent)]" />

        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <Badge className="mb-6 bg-green-900/50 text-green-300 border border-green-700/40 px-4 py-1.5 text-sm">
            Sẵn sàng?
          </Badge>
          <h2 className="text-white mb-5">
            Sẵn sàng tạo copy{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              chuyên nghiệp
            </span>{' '}
            bằng AI?
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            14 ngày miễn phí · Không cần thẻ tín dụng · Hủy bất kỳ lúc nào.<br />
            Tham gia cùng 2,000+ doanh nghiệp Việt Nam đang dùng CopyPro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-2xl px-9 py-4 font-bold text-base transition-all shadow-xl shadow-green-900/50 hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              Bắt đầu miễn phí
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link to="/pricing">
              <button className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/80 hover:text-white hover:bg-white/8 rounded-2xl px-9 py-4 font-semibold text-base transition-all w-full sm:w-auto">
                Xem bảng giá
              </button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
            {['Không cần thẻ tín dụng', 'Setup trong 2 phút', 'Hủy bất kỳ lúc nào', 'Hỗ trợ tiếng Việt'].map(t => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}