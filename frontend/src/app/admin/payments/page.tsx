'use client';

import { AdminRoute } from '@/app/_shared/route-guards';
import { AdminPayments } from './Payments';

export default function AdminPaymentsPage() {
  return (
    <AdminRoute path="/admin/payments">
      <AdminPayments />
    </AdminRoute>
  );
}
