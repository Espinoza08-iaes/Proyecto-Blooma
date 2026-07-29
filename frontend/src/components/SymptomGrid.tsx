import React from 'react';
import { BatteryLow, Wind, ShieldAlert, Sparkles, CheckCircle2, Ban } from 'lucide-react';

export interface SymptomGridItem {
  id: string;
  label: string;
  emoji?: string;
  icon?: React.ReactNode;
}

interface SymptomGridProps {
  items?: SymptomGridItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const DEFAULT_ITEMS: SymptomGridItem[] = [
  { id: 'cramps', label: 'Cólicos', emoji: '🌺' },
  { id: 'fatigue', label: 'Fatiga', icon: <BatteryLow className="w-5 h-5 text-rose-500" /> },
  { id: 'bloating', label: 'Hinchazón', icon: <Wind className="w-5 h-5 text-purple-500" /> },
  { id: 'tender_breasts', label: 'Pechos sensibles', emoji: '💗' },
  { id: 'back_pain', label: 'Dolor de espalda', emoji: '🦴' },
  { id: 'none', label: 'Ninguno', icon: <Ban className="w-5 h-5 text-slate-400" /> }
];

export default function SymptomGrid({
  items = DEFAULT_ITEMS,
  selectedIds,
  onToggle
}: SymptomGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 my-4">
      {items.map(item => {
        const isSelected = selectedIds.includes(item.id);

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-rose-50 border-rose-400 shadow-md shadow-rose-100 scale-105'
                : 'bg-white border-slate-100 shadow-sm hover:border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-transform ${
              isSelected ? 'bg-rose-500 text-white scale-110' : 'bg-rose-50 text-rose-800'
            }`}>
              {item.emoji ? (
                <span className="text-xl">{item.emoji}</span>
              ) : (
                item.icon
              )}
            </div>

            <span className={`text-xs font-semibold ${isSelected ? 'text-rose-900' : 'text-slate-700'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
