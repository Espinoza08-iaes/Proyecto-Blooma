import React, { useState } from 'react';
import { Activity, Info, Zap, Flame } from 'lucide-react';

interface HormoneCurveProps {
  currentDay?: number;
  cycleLength?: number;
}

export default function HormoneCurve({ currentDay = 14, cycleLength = 28 }: HormoneCurveProps) {
  const [selectedHormone, setSelectedHormone] = useState<'all' | 'estrogen' | 'progesterone'>('all');
  
  // Calculate relative day percentage (0 to 100)
  const clampedDay = Math.min(Math.max(1, currentDay), cycleLength);
  const dayPercent = ((clampedDay - 1) / (cycleLength - 1)) * 100;

  // Generate SVG path for Estrogen
  const estrogenPath = "M 0,75 Q 30,75 50,65 T 90,50 Q 110,15 130,20 Q 150,80 180,60 Q 220,40 260,60 Q 280,75 300,75";
  
  // Generate SVG path for Progesterone
  const progesteronePath = "M 0,85 L 140,85 Q 180,85 200,30 Q 230,20 250,45 Q 270,75 300,85";

  return (
    <div className="blooma-card p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-brand-teal-50 text-brand-teal-700">
            <Activity className="w-5 h-5 animate-pulse-soft" />
          </div>
          <div>
            <h4 className="font-bold text-brand-earth-900 text-sm">Simulador Fisiológico Hormonal</h4>
            <p className="text-xs text-brand-earth-500">Día {clampedDay} del ciclo — Niveles estimados de Estrógeno y Progesterona</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={() => setSelectedHormone('all')}
            className={`px-2.5 py-1 rounded-full font-bold transition-all ${
              selectedHormone === 'all'
                ? 'bg-brand-teal-600 text-white shadow-sm'
                : 'bg-brand-earth-100 text-brand-earth-700 hover:bg-brand-earth-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setSelectedHormone('estrogen')}
            className={`px-2.5 py-1 rounded-full font-bold transition-all ${
              selectedHormone === 'estrogen'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-brand-earth-100 text-brand-earth-700 hover:bg-brand-earth-200'
            }`}
          >
            Estrógeno
          </button>
          <button
            onClick={() => setSelectedHormone('progesterone')}
            className={`px-2.5 py-1 rounded-full font-bold transition-all ${
              selectedHormone === 'progesterone'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-brand-earth-100 text-brand-earth-700 hover:bg-brand-earth-200'
            }`}
          >
            Progesterona
          </button>
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div className="relative w-full h-36 mt-2 bg-brand-earth-50/70 rounded-2xl p-2 border border-brand-earth-150">
        {/* Phase background bands */}
        <div className="absolute inset-0 flex rounded-2xl overflow-hidden opacity-30 pointer-events-none">
          <div className="w-[18%] bg-brand-coral-200" title="Menstruación" />
          <div className="w-[32%] bg-emerald-100" title="Fase Folicular" />
          <div className="w-[14%] bg-brand-teal-200" title="Ovulación" />
          <div className="w-[36%] bg-purple-150" title="Fase Lútea" />
        </div>

        <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="estrogenGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#fb7185" stopOpacity="1" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="progesteroneGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#d97706" stopOpacity="1" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="25" x2="300" y2="25" stroke="#e3d5ca" strokeDasharray="3 3" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="#e3d5ca" strokeDasharray="3 3" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="300" y2="75" stroke="#e3d5ca" strokeDasharray="3 3" strokeWidth="0.5" />

          {/* Estrogen Line */}
          {(selectedHormone === 'all' || selectedHormone === 'estrogen') && (
            <path
              d={estrogenPath}
              fill="none"
              stroke="url(#estrogenGlow)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          )}

          {/* Progesterone Line */}
          {(selectedHormone === 'all' || selectedHormone === 'progesterone') && (
            <path
              d={progesteronePath}
              fill="none"
              stroke="url(#progesteroneGlow)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          )}

          {/* Vertical Current Day Indicator Line */}
          <line
            x1={(dayPercent / 100) * 300}
            y1="5"
            x2={(dayPercent / 100) * 300}
            y2="95"
            stroke="#0d9488"
            strokeWidth="2.5"
            strokeDasharray="2 2"
            className="animate-pulse"
          />
          
          {/* Current Day Pointer Dot */}
          <circle
            cx={(dayPercent / 100) * 300}
            cy="50"
            r="5"
            fill="#0d9488"
            stroke="#ffffff"
            strokeWidth="2"
            className="shadow-md"
          />
        </svg>

        {/* Floating Day Label badge */}
        <div 
          className="absolute -top-3 -translate-x-1/2 bg-brand-teal-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md z-20 pointer-events-none"
          style={{ left: `${Math.min(Math.max(dayPercent, 8), 92)}%` }}
        >
          Hoy (Día {clampedDay})
        </div>
      </div>

      {/* Legend & Insights */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-150 flex items-start space-x-2">
          <Zap className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-rose-800">Estrógeno</div>
            <div className="text-[11px] text-rose-700 leading-tight">
              {clampedDay <= 14 ? 'En ascenso: Mayor energía, enfoque mental y vitalidad.' : 'Nivel moderado: Mantiene estabilidad metabólica.'}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-150 flex items-start space-x-2">
          <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-800">Progesterona</div>
            <div className="text-[11px] text-amber-700 leading-tight">
              {clampedDay > 14 ? 'Predominante: Eleva la temperatura basal e induce calma.' : 'Nivel basal: Prepara el folículo para el nuevo ciclo.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
