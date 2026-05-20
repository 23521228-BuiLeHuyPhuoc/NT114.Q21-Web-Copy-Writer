'use client';

import { AdminRoute } from '@/app/_shared/route-guards';
import { AdminContents } from './Contents';

export default function AdminContentsPage() {
  return (
    <AdminRoute path="/admin/contents">
      <AdminContents />
    </AdminRoute>
  );
}
