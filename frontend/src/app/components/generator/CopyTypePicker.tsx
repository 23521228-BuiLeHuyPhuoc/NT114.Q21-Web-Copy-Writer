import { Card } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { COPY_TYPES } from '@/mocks/generator';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function CopyTypePicker({ value, onChange }: Props) {
  return (
    <Card className="p-4">
      <Label className="text-sm font-semibold text-gray-700 mb-3 block">Loại nội dung</Label>
      <div className="grid grid-cols-2 gap-2">
        {COPY_TYPES.map(ct => {
          const Icon = ct.icon;
          return (
            <button
              key={ct.id}
              onClick={() => onChange(ct.id)}
              className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${value === ct.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${value === ct.id ? 'text-green-600' : 'text-gray-500'}`} />
              <div>
                <p className={`text-xs font-medium leading-tight ${value === ct.id ? 'text-green-700' : 'text-gray-700'}`}>{ct.name}</p>
                <p className="text-xs text-gray-400 leading-tight hidden sm:block">{ct.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
