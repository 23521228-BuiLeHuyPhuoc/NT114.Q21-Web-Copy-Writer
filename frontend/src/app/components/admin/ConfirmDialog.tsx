import { AlertTriangle, Trash2, RotateCcw, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'warning' | 'success';
  loading?: boolean;
}

export function ConfirmDialog({
  open, onClose, onConfirm,
  title, description,
  confirmLabel = 'Xác nhận',
  confirmVariant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  const variantMap = {
    danger:  { btn: 'bg-red-600 hover:bg-red-700 shadow-red-200/60',   icon: <Trash2 className="w-5 h-5" />,      ring: 'bg-red-100',   iconColor: 'text-red-600' },
    warning: { btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200/60', icon: <AlertTriangle className="w-5 h-5" />, ring: 'bg-amber-100', iconColor: 'text-amber-600' },
    success: { btn: 'bg-green-600 hover:bg-green-700 shadow-green-200/60', icon: <RotateCcw className="w-5 h-5" />,  ring: 'bg-green-100', iconColor: 'text-green-600' },
  };
  const v = variantMap[confirmVariant];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className={`w-12 h-12 ${v.ring} rounded-2xl flex items-center justify-center mb-4`}>
          <span className={v.iconColor}>{v.icon}</span>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 pr-6">{title}</h3>
        {description && <p className="text-sm text-gray-500 leading-relaxed mb-6">{description}</p>}

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-10 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 h-10 ${v.btn} text-white rounded-xl text-sm font-bold shadow-md transition-all disabled:opacity-40 flex items-center justify-center gap-1.5`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
