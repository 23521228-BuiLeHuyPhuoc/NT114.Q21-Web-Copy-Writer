import { Trash2, RotateCcw, X, Flame } from 'lucide-react';

interface TrashItem {
  id: number | string;
  label: string;
  subLabel?: string;
  deletedAt: string;
}

interface TrashBinProps {
  open: boolean;
  onClose: () => void;
  items: TrashItem[];
  onRestore: (id: number | string) => void;
  onPermanentDelete: (id: number | string) => void;
  entityName?: string;
  loading?: string | null; // id being processed
}

export function TrashBin({
  open, onClose, items, onRestore, onPermanentDelete,
  entityName = 'mục', loading,
}: TrashBinProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Thùng rác</p>
              <p className="text-xs text-gray-500">{items.length} {entityName} đã xoá</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auto-delete notice */}
        {items.length > 0 && (
          <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2.5 items-start">
            <Flame className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Các mục trong thùng rác sẽ bị <span className="font-semibold">xoá vĩnh viễn sau 30 ngày</span>.
            </p>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-gray-300" />
              </div>
              <p className="font-semibold text-gray-400">Thùng rác trống</p>
              <p className="text-xs text-gray-400 mt-1">Không có {entityName} nào bị xoá</p>
            </div>
          ) : (
            items.map(item => {
              const isLoading = loading === String(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-700 truncate">{item.label}</p>
                      {item.subLabel && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{item.subLabel}</p>
                      )}
                      <p className="text-[11px] text-gray-400 mt-1">
                        Đã xoá lúc <span className="font-medium">{item.deletedAt}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onRestore(item.id)}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 h-8 border border-green-200 text-green-700 hover:bg-green-50 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
                    >
                      {isLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          Khôi phục
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onPermanentDelete(item.id)}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-1.5 h-8 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      Xoá vĩnh viễn
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
