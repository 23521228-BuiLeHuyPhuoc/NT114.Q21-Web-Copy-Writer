import { useState } from 'react';
import { PublicNavbar } from '@/app/components/PublicNavbar';
import { PublicFooter } from '@/app/components/PublicFooter';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Search, Clock, ArrowRight, BookOpen, TrendingUp, Cpu, Wand2 } from 'lucide-react';

const CATEGORIES = [
  { label: 'Tất cả', id: 'all' },
  { label: 'Hướng dẫn AI', id: 'ai' },
  { label: 'Copywriting', id: 'copy' },
  { label: 'Marketing', id: 'marketing' },
  { label: 'Case Study', id: 'case' },
  { label: 'Tin tức', id: 'news' },
];

const POSTS = [
  {
    id: 1, cat: 'ai', catLabel: 'Hướng dẫn AI',
    title: 'GPT-4o vs Llama 3.1: Model nào phù hợp cho copywriting Việt Nam?',
    excerpt: 'Phân tích chi tiết điểm mạnh, điểm yếu và tình huống sử dụng phù hợp nhất của từng model AI cho copywriter Việt Nam.',
    author: 'Lê Thu Hằng', authorRole: 'CTO CopyPro',
    date: '22/03/2026', readTime: '8 phút đọc',
    img: 'https://images.unsplash.com/photo-1562577308-9e66f0c65ce5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    featured: true,
  },
  {
    id: 2, cat: 'copy', catLabel: 'Copywriting',
    title: '10 công thức copywriting không bao giờ lỗi thời — áp dụng ngay với AI',
    excerpt: 'Từ AIDA đến PAS, những công thức copywriting kinh điển vẫn hoạt động hoàn hảo khi kết hợp với AI. Hướng dẫn thực chiến.',
    author: 'Phạm Thị Lan', authorRole: 'Head of Marketing',
    date: '20/03/2026', readTime: '6 phút đọc',
    img: 'https://images.unsplash.com/photo-1763833294545-e38e4fab1961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    featured: false,
  },
  {
    id: 3, cat: 'case', catLabel: 'Case Study',
    title: 'Shopviet tăng CTR 40% chỉ sau 2 tháng dùng CopyPro',
    excerpt: 'Case study chi tiết về cách một doanh nghiệp e-commerce tối ưu toàn bộ copy sản phẩm bằng AI và đạt kết quả vượt kỳ vọng.',
    author: 'Nguyễn Minh Trí', authorRole: 'CEO CopyPro',
    date: '18/03/2026', readTime: '12 phút đọc',
    img: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    featured: false,
  },
  {
    id: 4, cat: 'ai', catLabel: 'Hướng dẫn AI',
    title: 'Fine-tuning LLM cho ngành bất động sản: Hướng dẫn từng bước',
    excerpt: 'Cách thu thập dữ liệu training, chuẩn bị dataset và fine-tune GPT-4o để tạo copy bất động sản đúng tone thương hiệu.',
    author: 'Hoàng Văn Đức', authorRole: 'Lead AI Engineer',
    date: '15/03/2026', readTime: '15 phút đọc',
    img: 'https://images.unsplash.com/photo-1758873268663-5a362616b5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    featured: false,
  },
  {
    id: 5, cat: 'marketing', catLabel: 'Marketing',
    title: 'Email marketing năm 2026: AI đã thay đổi mọi thứ như thế nào?',
    excerpt: 'Phân tích xu hướng email marketing với AI: personalization tự động, subject line tối ưu, và tỷ lệ mở email tăng vượt bậc.',
    author: 'Phạm Thị Lan', authorRole: 'Head of Marketing',
    date: '12/03/2026', readTime: '7 phút đọc',
    img: 'https://images.unsplash.com/photo-1719845788637-57ff1e230578?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    featured: false,
  },
  {
    id: 6, cat: 'news', catLabel: 'Tin tức',
    title: 'CopyPro ra mắt API v2.0 — Tốc độ nhanh hơn 3x, giá rẻ hơn 40%',
    excerpt: 'Phiên bản API mới với latency trung bình dưới 1 giây, hỗ trợ streaming response, và mô hình giá hoàn toàn mới.',
    author: 'Lê Thu Hằng', authorRole: 'CTO CopyPro',
    date: '10/03/2026', readTime: '4 phút đọc',
    img: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    featured: false,
  },
];

const TRENDING = [
  { title: 'Top 5 prompt template cho Facebook Ads hiệu quả', reads: '4.2K' },
  { title: 'Cách viết landing page chuyển đổi cao bằng AI', reads: '3.8K' },
  { title: 'So sánh 10 công cụ AI copywriting phổ biến 2026', reads: '3.1K' },
  { title: 'Hướng dẫn RESTful API CopyPro từ A-Z', reads: '2.7K' },
];

export function BlogPage() {
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = POSTS.filter(p => {
    const matchCat = cat === 'all' || p.cat === cat;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  const catColor: Record<string, string> = {
    ai: 'bg-blue-100 text-blue-700',
    copy: 'bg-green-100 text-green-700',
    marketing: 'bg-orange-100 text-orange-700',
    case: 'bg-emerald-100 text-emerald-700',
    news: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-950 via-green-950 to-gray-950">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <Badge className="mb-5 bg-green-900/50 text-green-300 border border-green-700/40 px-4 py-1.5">
            📚 Kiến thức & Góc nhìn
          </Badge>
          <h1 className="text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Blog CopyPro
          </h1>
          <p className="text-gray-400 text-base mb-8">
            Hướng dẫn chuyên sâu về AI copywriting, chiến lược marketing và case study thực tế từ đội ngũ chuyên gia.
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-500 rounded-xl backdrop-blur"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="sticky top-[70px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  cat === c.id
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured */}
            {featured && (
              <article className="group cursor-pointer rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all">
                <div className="overflow-hidden h-64">
                  <ImageWithFallback
                    src={featured.img}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={`${catColor[featured.cat]} border-0 text-xs`}>{featured.catLabel}</Badge>
                    <Badge className="bg-yellow-100 text-yellow-700 border-0 text-xs">✨ Nổi bật</Badge>
                  </div>
                  <h2 className="text-gray-900 mb-3 group-hover:text-green-700 transition-colors" style={{ fontSize: '1.35rem' }}>
                    {featured.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                        {featured.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{featured.author}</p>
                        <p className="text-xs text-gray-500">{featured.date} · {featured.readTime}</p>
                      </div>
                    </div>
                    <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                      Đọc ngay <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
            )}

            {/* Rest */}
            <div className="grid md:grid-cols-2 gap-6">
              {rest.map(post => (
                <article
                  key={post.id}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all"
                >
                  <div className="overflow-hidden h-44">
                    <ImageWithFallback
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <Badge className={`${catColor[post.cat]} border-0 text-xs mb-3`}>{post.catLabel}</Badge>
                    <h3 className="text-gray-900 mb-2 group-hover:text-green-700 transition-colors" style={{ fontSize: '1rem', lineHeight: '1.4' }}>
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-[10px] font-bold">
                          {post.author.charAt(0)}
                        </div>
                        <p className="text-xs text-gray-500">{post.author}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />{post.readTime}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <BookOpen className="w-14 h-14 mx-auto mb-4 opacity-30" />
                <p className="font-medium">Không tìm thấy bài viết phù hợp</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Trending */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-gray-900 mb-5 flex items-center gap-2" style={{ fontSize: '1rem' }}>
                <TrendingUp className="w-4 h-4 text-green-600" /> Đọc nhiều nhất
              </h3>
              <div className="space-y-4">
                {TRENDING.map((t, i) => (
                  <div key={i} className="flex gap-4 cursor-pointer group">
                    <span
                      className="text-2xl font-bold flex-shrink-0"
                      style={{ fontFamily: 'Space Grotesk', color: i === 0 ? '#16a34a' : '#d1d5db', letterSpacing: '-0.03em' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors leading-tight">{t.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{t.reads} lượt đọc</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
              <Wand2 className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-white mb-2" style={{ fontSize: '1.1rem' }}>Nhận bài viết mới nhất</h3>
              <p className="text-green-100 text-sm mb-4 leading-relaxed">
                Mỗi tuần một bài hướng dẫn chuyên sâu về AI copywriting. Miễn phí.
              </p>
              <Input
                placeholder="Email của bạn"
                className="bg-white/20 border-white/30 text-white placeholder:text-green-200 mb-3 rounded-xl"
              />
              <button className="w-full bg-white text-green-700 rounded-xl py-2.5 text-sm font-bold hover:bg-green-50 transition-colors">
                Đăng ký ngay →
              </button>
            </div>

            {/* Quick links */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2" style={{ fontSize: '1rem' }}>
                <Cpu className="w-4 h-4 text-green-600" /> Tài nguyên nhanh
              </h3>
              {[
                { label: 'Tài liệu API đầy đủ', href: '/login' },
                { label: 'Template library miễn phí', href: '/login' },
                { label: 'Video hướng dẫn', href: '#' },
                { label: 'Cộng đồng Facebook', href: '#' },
              ].map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 text-sm text-gray-700 hover:text-green-700 transition-colors"
                >
                  {l.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
