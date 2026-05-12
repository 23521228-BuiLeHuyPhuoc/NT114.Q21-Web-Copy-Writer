import {
  LayoutDashboard, Users, FileText, ScrollText,
  Tag, Crown, DollarSign, Cpu, Settings, Shield,
} from 'lucide-react';

/* ── Admin role types ─────────────────────────────────────────── */
export type AdminRole =
  | 'super_admin'
  | 'content_manager'
  | 'user_manager'
  | 'finance_manager'
  | 'ai_engineer'
  | 'analyst';

/* ── Route permission keys ────────────────────────────────────── */
export type AdminPermission =
  | 'dashboard'
  | 'users'
  | 'contents'
  | 'templates'
  | 'categories'
  | 'plans'
  | 'payments'
  | 'models'
  | 'settings'
  | 'audit_logs';

/* ── Role definitions ─────────────────────────────────────────── */
export interface AdminRoleDef {
  label: string;
  description: string;
  color: string;        // badge bg
  textColor: string;    // badge text
  borderColor: string;  // badge border
  dotColor: string;     // dot indicator
  permissions: AdminPermission[];
}

export const ADMIN_ROLES: Record<AdminRole, AdminRoleDef> = {
  super_admin: {
    label: 'Super Admin',
    description: 'Toàn quyền truy cập và quản lý toàn bộ hệ thống',
    color: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    dotColor: 'bg-purple-500',
    permissions: [
      'dashboard', 'users', 'contents', 'templates',
      'categories', 'plans', 'payments', 'models',
      'settings', 'audit_logs',
    ],
  },
  content_manager: {
    label: 'Content Manager',
    description: 'Quản lý nội dung, template và danh mục',
    color: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    dotColor: 'bg-blue-500',
    permissions: ['dashboard', 'contents', 'templates', 'categories'],
  },
  user_manager: {
    label: 'User Manager',
    description: 'Quản lý tài khoản và hồ sơ người dùng',
    color: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    dotColor: 'bg-green-500',
    permissions: ['dashboard', 'users'],
  },
  finance_manager: {
    label: 'Finance Manager',
    description: 'Quản lý gói dịch vụ, thanh toán và doanh thu',
    color: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
    permissions: ['dashboard', 'plans', 'payments'],
  },
  ai_engineer: {
    label: 'AI Engineer',
    description: 'Cấu hình và vận hành mô hình AI & Fine-tuning',
    color: 'bg-cyan-100',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-200',
    dotColor: 'bg-cyan-500',
    permissions: ['dashboard', 'models'],
  },
  analyst: {
    label: 'Analyst',
    description: 'Xem báo cáo, audit log và phân tích dữ liệu',
    color: 'bg-rose-100',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    dotColor: 'bg-rose-500',
    permissions: ['dashboard', 'audit_logs'],
  },
};

/* ── Menu items with required permission ──────────────────────── */
export const ADMIN_MENU_ITEMS = [
  { label: 'Dashboard',      icon: LayoutDashboard, path: '/admin',              permission: 'dashboard'  as AdminPermission },
  { label: 'Quản Lý Users',  icon: Users,           path: '/admin/users',        permission: 'users'      as AdminPermission },
  { label: 'Nội Dung',       icon: FileText,        path: '/admin/contents',     permission: 'contents'   as AdminPermission },
  { label: 'Templates',      icon: ScrollText,      path: '/admin/templates',    permission: 'templates'  as AdminPermission },
  { label: 'Danh Mục',       icon: Tag,             path: '/admin/categories',   permission: 'categories' as AdminPermission },
  { label: 'Gói Dịch Vụ',   icon: Crown,           path: '/admin/plans',        permission: 'plans'      as AdminPermission },
  { label: 'Thanh Toán',     icon: DollarSign,      path: '/admin/payments',     permission: 'payments'   as AdminPermission },
  { label: 'Model AI',       icon: Cpu,             path: '/admin/models',       permission: 'models'     as AdminPermission },
  { label: 'Cài Đặt',        icon: Settings,        path: '/admin/settings',     permission: 'settings'   as AdminPermission },
  { label: 'Nhật Ký',        icon: Shield,          path: '/admin/audit-logs',   permission: 'audit_logs' as AdminPermission },
];

/* ── Permission route map ─────────────────────────────────────── */
export const PERMISSION_ROUTE_MAP: Record<string, AdminPermission> = {
  '/admin':              'dashboard',
  '/admin/users':        'users',
  '/admin/contents':     'contents',
  '/admin/templates':    'templates',
  '/admin/categories':   'categories',
  '/admin/plans':        'plans',
  '/admin/payments':     'payments',
  '/admin/models':       'models',
  '/admin/settings':     'settings',
  '/admin/audit-logs':   'audit_logs',
};

/* ── Helper: check if role has permission ─────────────────────── */
export function hasPermission(adminRole: AdminRole | undefined, permission: AdminPermission): boolean {
  if (!adminRole) return false;
  return ADMIN_ROLES[adminRole]?.permissions.includes(permission) ?? false;
}

/* ── Helper: get role definition ─────────────────────────────── */
export function getAdminRoleDef(adminRole: AdminRole | undefined): AdminRoleDef | null {
  if (!adminRole) return null;
  return ADMIN_ROLES[adminRole] ?? null;
}
