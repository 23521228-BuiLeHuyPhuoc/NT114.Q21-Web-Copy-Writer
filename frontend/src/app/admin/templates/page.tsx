'use client';

import { AdminRoute } from '@/app/_shared/route-guards';
import { AdminTemplates } from './Templates';

export default function AdminTemplatesPage() {
  return (
    <AdminRoute path="/admin/templates">
      <AdminTemplates />
    </AdminRoute>
  );
}
