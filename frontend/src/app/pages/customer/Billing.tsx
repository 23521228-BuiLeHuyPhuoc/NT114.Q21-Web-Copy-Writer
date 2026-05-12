import { useState } from 'react';
import { Layout } from '@/app/components/Layout';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Crown, Zap, Building2, CheckCircle2, X,
  CreditCard, Calendar, TrendingUp, Download,
  FileText, Clock, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CURRENT_PLAN = {
  name: 'Pro', price: 299000, renewDate: '23/04/2026',
  copyUsed: 312, copyLimit: 500, apiCalls: 1250, apiLimit: 5000,
};

const PLANS = [
  {
    id: 'free', name: 'Miễn Phí', price: 0, icon: Zap, color: 'border-gray-200',
    features: ['30 copy/tháng', '2 model AI (GPT-3.5, Llama 8B)', '5 templates', 'Không có API'],
    limits: ['Không có fine-tuning', 'Không kiểm tra đạo văn'],
  },
  {
    id: 'pro', name: 'Pro', price: 299000, icon: Crown, color: 'border-green-500 ring-2 ring-green-100',
    features: ['500 copy/tháng', 'Tất cả model AI', '100+ templates', 'API 5,000 calls/tháng', 'Fine-tuning 3 models', 'Kiểm tra đạo văn 100 lần', 'Hỗ trợ ưu tiên'],
    limits: [],
    popular: true,
  },
  {
    id: 'business', name: 'Business', price: 799000, icon: Building2, color: 'border-gray-200',
    features: ['Unlimited copy', 'Tất cả model AI', 'Unlimited templates', 'API 50,000 calls/tháng', 'Fine-tuning unlimited', 'Kiểm tra đạo văn unlimited', 'Hỗ trợ 24/7 + SLA', 'Custom model training', 'Whitelabel API'],
    limits: [],
  },
];

const INVOICES = [
  { id: 'INV-2026-003', date: '23/03/2026', amount: 299000, status: 'paid', plan: 'Pro', method: 'Visa ****4242' },
  { id: 'INV-2026-002', date: '23/02/2026', amount: 299000, status: 'paid', plan: 'Pro', method: 'Visa ****4242' },
  { id: 'INV-2026-001', date: '23/01/2026', amount: 199000, status: 'paid', plan: 'Pro (ưu đãi)', method: 'MoMo' },
];

export function CustomerBilling() {
  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Gói Dịch Vụ & Thanh Toán</h1>
          <p className="text-gray-600">Quản lý gói đăng ký, thanh toán và hóa đơn</p>
        </div>

        <Tabs defaultValue="plan">
          <TabsList className="mb-6">
            <TabsTrigger value="plan">Gói hiện tại</TabsTrigger>
            <TabsTrigger value="plans">Nâng cấp</TabsTrigger>
            <TabsTrigger value="invoices">Hóa đơn</TabsTrigger>
          </TabsList>

          {/* Current plan */}
          <TabsContent value="plan">
            <Card className="p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Gói {CURRENT_PLAN.name}</h2>
                    <p className="text-sm text-gray-600">Gia hạn ngày {CURRENT_PLAN.renewDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-700">{(CURRENT_PLAN.price).toLocaleString('vi-VN')}₫</p>
                  <p className="text-xs text-gray-500">/tháng</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Copy đã tạo</span>
                    <span className="font-semibold">{CURRENT_PLAN.copyUsed}/{CURRENT_PLAN.copyLimit}</span>
                  </div>
                  <Progress value={(CURRENT_PLAN.copyUsed / CURRENT_PLAN.copyLimit) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">API calls</span>
                    <span className="font-semibold">{CURRENT_PLAN.apiCalls.toLocaleString()}/{CURRENT_PLAN.apiLimit.toLocaleString()}</span>
                  </div>
                  <Progress value={(CURRENT_PLAN.apiCalls / CURRENT_PLAN.apiLimit) * 100} className="h-2" />
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Phương thức thanh toán</h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Visa ****4242</p>
                  <p className="text-xs text-gray-500">Hết hạn 12/2028</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">Thay đổi</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Plans */}
          <TabsContent value="plans">
            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.map(plan => {
                const Icon = plan.icon;
                return (
                  <Card key={plan.id} className={`p-6 relative ${plan.color}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white border-0 px-3">Đang dùng</Badge>
                    )}
                    <div className="text-center mb-6">
                      <div className="inline-flex bg-green-100 p-3 rounded-xl mb-3">
                        <Icon className="w-6 h-6 text-green-700" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {plan.price === 0 ? 'Miễn phí' : `${plan.price.toLocaleString('vi-VN')}₫`}
                        {plan.price > 0 && <span className="text-sm text-gray-500 font-normal">/tháng</span>}
                      </p>
                    </div>
                    <div className="space-y-2 mb-6">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{f}</span>
                        </div>
                      ))}
                      {plan.limits.map((l, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                          <span className="text-gray-400">{l}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className={`w-full ${plan.popular ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => toast.success(plan.popular ? 'Đây là gói hiện tại!' : 'Đang chuyển trang thanh toán...')}
                    >
                      {plan.popular ? 'Gói hiện tại' : plan.price === 0 ? 'Chọn miễn phí' : 'Nâng cấp'}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Invoices */}
          <TabsContent value="invoices">
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Lịch sử hóa đơn</h3>
              <div className="space-y-3">
                {INVOICES.map(inv => (
                  <div key={inv.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border">
                    <div className="bg-green-100 p-2 rounded-lg"><FileText className="w-4 h-4 text-green-600" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{inv.id}</p>
                      <p className="text-xs text-gray-500">{inv.date} · {inv.plan} · {inv.method}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{inv.amount.toLocaleString('vi-VN')}₫</span>
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">Đã thanh toán</Badge>
                    <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
