'use client';

import { AdminRoute } from '@/app/_shared/route-guards';
import { AdminCategories } from './Categories';

export default function AdminCategoriesPage() {
  return (
    <AdminRoute path="/admin/categories">
      <AdminCategories />
    </AdminRoute>
  );
}
