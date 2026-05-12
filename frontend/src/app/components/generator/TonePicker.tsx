import { Card } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { TONES } from '@/mocks/generator';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function TonePicker({ value, onChange }: Props) {
  return (
    <Card className="p-4">
      <Label className="text-sm font-semibold text-gray-700 mb-3 block">Tone giọng văn</Label>
      <div className="grid grid-cols-2 gap-2">
        {TONES.map(t => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all overflow-hidden ${value === t.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <span className="text-base flex-shrink-0">{t.emoji}</span>
            <div className="min-w-0 overflow-hidden">
              <p className={`text-xs font-medium truncate ${value === t.id ? 'text-green-700' : 'text-gray-700'}`}>{t.name}</p>
              <p className="text-xs text-gray-400 hidden sm:block truncate">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
