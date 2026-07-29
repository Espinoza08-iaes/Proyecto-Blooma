import React from 'react';
import { Droplet, Plus, Watch, Heart } from 'lucide-react';

interface FloatingActionDockProps {
  onLogPeriod: () => void;
  onLogSymptoms: () => void;
  onWearableSync: () => void;
  stage?: 'cycle' | 'pregnancy' | 'menopause';
}

export default function FloatingActionDock({
  onLogPeriod,
  onLogSymptoms,
  onWearableSync,
  stage = 'cycle'
}: FloatingActionDockProps) {
  return (
    <div className="flex justify-center items-center space-x-6 my-6">
      {/* Button 1: Period / Stage log */}
      <button
        type="button"
        onClick={onLogPeriod}
        className="flex flex-col items-center group cursor-pointer"
      >
        <div className="w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-200 group-hover:scale-105 group-active:scale-95 transition-all duration-200">
          <Droplet className="w-6 h-6 fill-white" />
        </div>
        <span className="text-xs font-semibold text-slate-700 mt-2">
          {stage === 'pregnancy' ? 'Pataditas' : stage === 'menopause' ? 'Sofocos' : 'Registrar periodo'}
        </span>
      </button>

      {/* Button 2: Main Symptoms Sheet */}
      <button
        type="button"
        onClick={onLogSymptoms}
        className="flex flex-col items-center group cursor-pointer"
      >
        <div className="w-14 h-14 rounded-full bg-white text-slate-800 border border-slate-200 flex items-center justify-center shadow-lg shadow-slate-100 group-hover:scale-105 group-active:scale-95 transition-all duration-200">
          <Plus className="w-7 h-7 text-slate-800" />
        </div>
        <span className="text-xs font-semibold text-slate-700 mt-2">Síntomas</span>
      </button>

      {/* Button 3: Wearable Sync / Telemetry */}
      <button
        type="button"
        onClick={onWearableSync}
        className="flex flex-col items-center group cursor-pointer"
      >
        <div className="w-14 h-14 rounded-full bg-white text-teal-600 border border-teal-100 flex items-center justify-center shadow-lg shadow-teal-50 group-hover:scale-105 group-active:scale-95 transition-all duration-200">
          <Watch className="w-6 h-6 text-teal-600" />
        </div>
        <span className="text-xs font-semibold text-slate-700 mt-2">Reloj / Anillo</span>
      </button>
    </div>
  );
}
