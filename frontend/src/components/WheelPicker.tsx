import React from 'react';

interface WheelPickerProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit: string;
  onChange: (newVal: number) => void;
}

export default function WheelPicker({
  label,
  value,
  min = 1,
  max = 100,
  unit,
  onChange
}: WheelPickerProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="flex flex-col items-center my-4">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{label}</span>
      
      {/* Scroll wheel box */}
      <div className="relative w-full max-w-xs bg-slate-100 rounded-2xl p-2 border border-slate-200 shadow-inner flex items-center justify-center">
        {/* Highlight framing lines */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-10 border-y-2 border-rose-400 pointer-events-none rounded-sm" />

        <div className="h-36 overflow-y-auto snap-y snap-mandatory no-scrollbar text-center py-12 w-full">
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => onChange(opt)}
              className={`h-10 flex items-center justify-center snap-center text-lg font-bold transition-all cursor-pointer ${
                opt === value
                  ? 'text-slate-900 text-2xl font-black scale-110'
                  : 'text-slate-400 text-sm opacity-60'
              }`}
            >
              {opt} <span className="text-xs ml-1 font-normal text-slate-500">{unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
