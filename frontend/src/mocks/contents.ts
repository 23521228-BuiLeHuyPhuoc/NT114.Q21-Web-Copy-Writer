export const MOCK_CONTENT = {
  id: '1',
  title: 'Facebook Ad – Flash Sale Hè 2026',
  type: 'Tiêu Đề Quảng Cáo',
  industry: 'E-commerce',
  model: 'GPT-4o',
  quality: 92,
  words: 45,
  tokens: 380,
  latency: '1.8s',
  tone: 'Khẩn cấp',
  createdAt: '23/03/2026 14:30',
  updatedAt: '23/03/2026 15:00',
  status: 'published',
  project: 'Campaign Hè 2026',
  content: `FLASH SALE HÈ 2026! Giảm sốc đến 70% toàn bộ sản phẩm mùa hè.

Chỉ trong 24 giờ – Mua ngay kẻo hết!

✅ Hàng chính hãng 100%
✅ Freeship toàn quốc đơn từ 299K
✅ Đổi trả miễn phí 30 ngày

🔥 Ưu đãi này CHỈ CÓ MỘT LẦN trong năm!
👉 Đặt hàng ngay: [Link]

#FlashSale #MuaHè #GiảmGiáSốc`,
  versions: [
    { id: 1, label: 'Phiên bản 1', quality: 92, selected: true },
    { id: 2, label: 'Phiên bản 2', quality: 88, selected: false },
    { id: 3, label: 'Phiên bản 3', quality: 85, selected: false },
  ],
};

export const MOCK_CONTENTS = [
  { id: '1', title: 'Facebook Ad – Flash Sale Hè 2026', type: 'headline', industry: 'E-commerce', model: 'GPT-4o', quality: 92, words: 45, createdAt: '23/03/2026 14:30', status: 'published', project: 'Campaign Hè 2026' },
  { id: '2', title: 'Landing Page – Căn Hộ The Grand', type: 'landing', industry: 'Bất Động Sản', model: 'Llama 3.1', quality: 95, words: 320, createdAt: '23/03/2026 11:15', status: 'draft', project: 'BĐS Q2' },
  { id: '3', title: 'Email Marketing – Ra Mắt SaaS V2', type: 'email', industry: 'Công Nghệ', model: 'Fine-tuned', quality: 91, words: 180, createdAt: '22/03/2026 16:45', status: 'published', project: 'SaaS Launch' },
  { id: '4', title: 'Social Post – Khai Trương Nhà Hàng', type: 'social', industry: 'Ẩm Thực', model: 'GPT-4o', quality: 87, words: 120, createdAt: '21/03/2026 18:00', status: 'archived', project: null },
  { id: '5', title: 'SEO Content – Khóa Học Online', type: 'seo', industry: 'Giáo Dục', model: 'GPT-4o', quality: 90, words: 250, createdAt: '20/03/2026 10:30', status: 'published', project: 'EduTech' },
  { id: '6', title: 'Mô Tả SP – Áo Thun Premium', type: 'description', industry: 'Thời Trang', model: 'Llama 3.1', quality: 88, words: 95, createdAt: '19/03/2026 14:00', status: 'draft', project: null },
  { id: '7', title: 'CTA – Đăng Ký Khám Sức Khỏe', type: 'cta', industry: 'Y Tế', model: 'GPT-4o', quality: 93, words: 30, createdAt: '18/03/2026 09:20', status: 'published', project: 'Healthcare Q1' },
  { id: '8', title: 'Review – App Tài Chính Cá Nhân', type: 'review', industry: 'Tài Chính', model: 'Fine-tuned', quality: 89, words: 150, createdAt: '17/03/2026 11:00', status: 'draft', project: null },
];

export const CONTENTS_STATUS_MAP: Record<string, { label: string; color: string }> = {
  published: { label: 'Đã xuất bản', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Nháp', color: 'bg-yellow-100 text-yellow-700' },
  archived: { label: 'Lưu trữ', color: 'bg-gray-100 text-gray-600' },
};
