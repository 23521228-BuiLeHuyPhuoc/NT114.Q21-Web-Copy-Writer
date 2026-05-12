import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export const REVENUE_DATA = [
  { month: 'T10', revenue: 28.5 }, { month: 'T11', revenue: 32.1 },
  { month: 'T12', revenue: 38.4 }, { month: 'T1', revenue: 35.2 },
  { month: 'T2', revenue: 41.6 }, { month: 'T3', revenue: 45.2 },
];

export const MOCK_PAYMENTS = [
  { id: 'PAY-001', user: 'Nguyễn Văn A', email: 'customer@copypro.vn', amount: 299000, plan: 'Pro', method: 'Visa', status: 'success', date: '23/03/2026 14:30' },
  { id: 'PAY-002', user: 'Trần Thị B', email: 'tranb@email.com', amount: 799000, plan: 'Business', method: 'MoMo', status: 'success', date: '23/03/2026 11:15' },
  { id: 'PAY-003', user: 'Lê Văn C', email: 'lec@email.com', amount: 299000, plan: 'Pro', method: 'VNPAY', status: 'pending', date: '22/03/2026 16:45' },
  { id: 'PAY-004', user: 'Phạm Đức D', email: 'phamd@email.com', amount: 299000, plan: 'Pro', method: 'Visa', status: 'failed', date: '22/03/2026 09:20' },
  { id: 'PAY-005', user: 'Hoàng Thị E', email: 'hoange@email.com', amount: 799000, plan: 'Business', method: 'Bank Transfer', status: 'success', date: '21/03/2026 18:00' },
  { id: 'PAY-006', user: 'Vũ Minh F', email: 'vuf@email.com', amount: 299000, plan: 'Pro', method: 'MoMo', status: 'success', date: '20/03/2026 10:30' },
];

export const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  success: { label: 'Thành công', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  pending: { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  failed: { label: 'Thất bại', color: 'bg-red-100 text-red-700', icon: XCircle },
};
