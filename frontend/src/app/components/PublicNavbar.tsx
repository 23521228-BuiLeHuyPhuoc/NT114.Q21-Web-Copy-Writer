import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Sparkles, Menu, X, ChevronDown,
  Wand2, Brain, FileText, Key,
  Users, Target, BookOpen, BarChart3,
  MessageSquare, Phone, Award, Shield,
} from 'lucide-react';

const PRODUCTS = [
  { icon: Wand2, label: 'AI Generator', desc: 'Tạo copy với GPT-4o & Llama 3.1', href: '/login' },
  { icon: Brain, label: 'Fine-tuning Studio', desc: 'Huấn luyện AI theo thương hiệu', href: '/login' },
  { icon: FileText, label: 'Template Library', desc: '100+ mẫu copy tối ưu chuyên ngành', href: '/login' },
  { icon: Key, label: 'RESTful API', desc: 'Tích hợp vào ứng dụng của bạn', href: '/login' },
];

const RESOURCES = [
  { icon: BookOpen, label: 'Blog & Hướng dẫn', desc: 'Kiến thức copywriting & AI', href: '/blog' },
  { icon: BarChart3, label: 'Case Studies', desc: 'Kết quả thực tế từ khách hàng', href: '/about#cases' },
  { icon: MessageSquare, label: 'Community', desc: 'Cộng đồng marketer Việt Nam', href: '/blog' },
];

interface DropdownProps {
  label: string;
  items: { icon: any; label: string; desc: string; href: string }[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function Dropdown({ label, items, open, onToggle, onClose }: DropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 text-[0.9rem] font-semibold transition-colors py-2 px-1 text-inherit hover:text-green-400"
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            <div className="p-2">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={onClose}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-green-50 transition-colors group"
                  >
                    <div className="bg-green-100 group-hover:bg-green-200 p-2 rounded-lg flex-shrink-0 transition-colors">
                      <Icon className="w-4 h-4 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (key: string) =>
    setOpenDropdown(prev => (prev === key ? null : key));

  const navLinks = [
    { label: 'Giới thiệu', href: '/about' },
    { label: 'Bảng giá', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Liên hệ', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl shadow-md shadow-green-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-[1.35rem] font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                CopyPro
              </span>
              <Badge className="bg-green-100 text-green-700 border-0 text-[10px] px-1.5 py-0 h-4">AI</Badge>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className={`hidden lg:flex items-center gap-1 ${scrolled ? 'text-gray-600' : 'text-white/90'}`}>
            <Dropdown
              label="Sản phẩm"
              items={PRODUCTS}
              open={openDropdown === 'products'}
              onToggle={() => toggleDropdown('products')}
              onClose={() => setOpenDropdown(null)}
            />
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={`text-[0.9rem] font-semibold px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === l.href
                    ? scrolled ? 'text-green-700 bg-green-50' : 'text-white bg-white/15'
                    : scrolled ? 'text-gray-600 hover:text-green-700 hover:bg-green-50/60' : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Dropdown
              label="Tài nguyên"
              items={RESOURCES}
              open={openDropdown === 'resources'}
              onToggle={() => toggleDropdown('resources')}
              onClose={() => setOpenDropdown(null)}
            />
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              className={`text-[0.9rem] font-semibold transition-colors ${scrolled ? 'text-gray-600 hover:text-green-700 hover:bg-green-50' : 'text-white/90 hover:text-white hover:bg-white/15'}`}
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Button>
            <Button
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-5 shadow-md shadow-green-200/60 text-[0.9rem]"
              onClick={() => navigate('/register')}
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Dùng thử miễn phí
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-xl w-9 h-9 transition-colors ${scrolled ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-white/60 hover:text-white hover:bg-white/15'}`}
              onClick={() => navigate('/admin/login')}
              title="Admin Login"
            >
              <Shield className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className={`lg:hidden p-2 rounded-xl transition-colors ${scrolled ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-white/15 text-white'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-5 py-5 space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Sản phẩm</p>
            {PRODUCTS.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} to={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 transition-colors">
                  <div className="bg-green-100 p-1.5 rounded-lg"><Icon className="w-4 h-4 text-green-700" /></div>
                  <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-gray-100 my-3" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Công ty</p>
            {navLinks.map((l) => (
              <Link key={l.href} to={l.href} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                {l.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-4 mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full rounded-xl text-sm" onClick={() => navigate('/login')}>Đăng nhập</Button>
              <Button className="w-full rounded-xl text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white" onClick={() => navigate('/register')}>Đăng ký</Button>
            </div>
            <div className="mt-2">
              <Button variant="ghost" className="w-full rounded-xl text-xs text-gray-400 hover:text-gray-600" onClick={() => navigate('/admin/login')}>
                <Shield className="w-3.5 h-3.5 mr-1.5" /> Đăng nhập Admin
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}