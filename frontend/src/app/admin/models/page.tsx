'use client';

import { AdminRoute } from '@/app/_shared/route-guards';
import { AdminModelManagement } from './ModelManagement';

export default function AdminModelsPage() {
  return (
    <AdminRoute path="/admin/models">
      <AdminModelManagement />
    </AdminRoute>
  );
}
