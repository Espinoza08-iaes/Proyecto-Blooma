import React, { useState } from 'react';
import { Scale, Edit2, Check } from 'lucide-react';

interface WeightTrackerWidgetProps {
  weightKg: number;
  onChange: (newKg: number) => void;
}

export default function WeightTrackerWidget({
  weightKg = 60,
  onChange
}: WeightTrackerWidgetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(String(weightKg));

  const handleSave = () => {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 20 && num < 300) {
      onChange(num);
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Peso</span>
          {isEditing ? (
            <input
              type="number"
              step="0.1"
              value={val}
              onChange={e => setVal(e.target.value)}
              className="w-20 px-2 py-0.5 border border-indigo-300 rounded text-sm font-bold text-slate-900 focus:outline-none"
            />
          ) : (
            <span className="text-lg font-black text-slate-900">
              {weightKg} <span className="text-xs text-slate-400 font-medium">kg</span>
            </span>
          )}
        </div>
      </div>

      {isEditing ? (
        <button
          type="button"
          onClick={handleSave}
          className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer"
        >
          <Check className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
