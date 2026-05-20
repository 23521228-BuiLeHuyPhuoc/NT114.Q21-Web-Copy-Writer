'use client';

import { AdminRoute } from '@/app/_shared/route-guards';
import { AdminSettings } from './Settings';

export default function AdminSettingsPage() {
  return (
    <AdminRoute path="/admin/settings">
      <AdminSettings />
    </AdminRoute>
  );
}
