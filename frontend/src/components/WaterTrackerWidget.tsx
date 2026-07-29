import React from 'react';
import { GlassWater, Plus, Minus } from 'lucide-react';

interface WaterTrackerWidgetProps {
  waterMl: number; // e.g. 1500
  targetMl?: number; // e.g. 2250
  onChange: (newMl: number) => void;
}

export default function WaterTrackerWidget({
  waterMl = 0,
  targetMl = 2250,
  onChange
}: WaterTrackerWidgetProps) {
  const handleAdd = () => {
    onChange(Math.min(4000, waterMl + 250));
  };

  const handleSub = () => {
    onChange(Math.max(0, waterMl - 250));
  };

  const liters = (waterMl / 1000).toFixed(2);
  const targetLiters = (targetMl / 1000).toFixed(2);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
          <GlassWater className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Agua</span>
          <span className="text-lg font-black text-slate-900">
            {liters} <span className="text-xs text-slate-400 font-medium">/ {targetLiters} L</span>
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          type="button"
          onClick={handleSub}
          className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer active:scale-95"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleAdd}
          className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors shadow-sm cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
