import React from 'react';
import { Info, Sparkles, AlertCircle, Heart, Thermometer, ShieldCheck } from 'lucide-react';
import { getPregnancyMilestone } from '../services/pregnancyService';
import { calculateThermalComfortIndex } from '../services/menopauseService';

interface HeroDialProps {
  stage: 'cycle' | 'pregnancy' | 'menopause';
  // Cycle props
  cycleDay?: number;
  cycleLength?: number;
  isDelayed?: boolean;
  delayedDays?: number;
  confidenceScore?: number; // 0-100
  onEditPeriodDates?: () => void;

  // Pregnancy props
  gestationWeek?: number;
  gestationDay?: number;
  onViewPregnancyDetails?: () => void;

  // Menopause props
  hotFlashesToday?: number;
  sleepQuality?: 'good' | 'fair' | 'poor';
  skinTemp?: number;
  onOpenTCC?: () => void;
}

export default function HeroDial({
  stage,
  cycleDay = 1,
  cycleLength = 28,
  isDelayed = false,
  delayedDays = 0,
  confidenceScore = 92,
  onEditPeriodDates,
  gestationWeek = 18,
  gestationDay = 1,
  onViewPregnancyDetails,
  hotFlashesToday = 0,
  sleepQuality = 'good',
  skinTemp,
  onOpenTCC
}: HeroDialProps) {

  // --- CYCLE STAGE DIAL ---
  if (stage === 'cycle') {
    if (isDelayed && delayedDays > 0) {
      return (
        <div className="w-full max-w-sm mx-auto my-4 transition-all duration-500 animate-fade-in">
          <div className="relative rounded-full aspect-square p-6 flex flex-col items-center justify-center text-center shadow-xl border border-indigo-100 bg-gradient-to-br from-slate-100 via-indigo-50/80 to-sky-100 text-slate-900">
            <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-900 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Modo Retraso Sereno</span>
            </div>

            <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Retraso de</span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 my-1 tracking-tight">
              {delayedDays} {delayedDays === 1 ? 'día' : 'días'}
            </h1>
            <p className="text-xs text-slate-600 max-w-[200px] mb-4">
              Ciclo actual acumulado: {cycleDay} días. La variabilidad es normal.
            </p>

            <button
              onClick={onEditPeriodDates}
              className="px-4 py-2 rounded-full bg-white text-indigo-900 text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 border border-indigo-100 cursor-pointer"
            >
              Registrar periodo
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-sm mx-auto my-4 transition-all duration-500 animate-fade-in">
        <div className="relative rounded-full aspect-square p-6 flex flex-col items-center justify-center text-center shadow-xl border border-rose-100 bg-gradient-to-br from-rose-400 via-rose-500 to-pink-500 text-white">
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-100" />
            <span>Confianza Algorítmica: {confidenceScore}%</span>
          </div>

          <span className="text-sm font-medium text-rose-100 uppercase tracking-wider">Periodo</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white my-1 tracking-tight">
            Día {cycleDay}
          </h1>
          <p className="text-xs text-rose-100 mb-4">
            Duración estimada del ciclo: {cycleLength} días
          </p>

          <button
            onClick={onEditPeriodDates}
            className="px-4 py-2 rounded-full bg-white text-rose-600 text-xs font-bold shadow-md hover:bg-rose-50 transition-all active:scale-95 cursor-pointer"
          >
            Editar fechas de periodo
          </button>
        </div>
      </div>
    );
  }

  // --- PREGNANCY STAGE DIAL ---
  if (stage === 'pregnancy') {
    const milestone = getPregnancyMilestone(gestationWeek);

    return (
      <div className="w-full max-w-sm mx-auto my-4 transition-all duration-500 animate-fade-in">
        <div className="relative rounded-full aspect-square p-6 flex flex-col items-center justify-center text-center shadow-xl border border-amber-100 bg-gradient-to-br from-amber-200 via-orange-300 to-amber-400 text-slate-900">
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white/40 text-amber-950 text-xs font-semibold backdrop-blur-sm mb-1">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            <span>Desarrollo Fetal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-amber-950 mt-1 mb-0.5 tracking-tight">
            {gestationWeek} semanas
          </h1>
          <span className="text-xs font-bold text-amber-900 mb-2">
            + {gestationDay} {gestationDay === 1 ? 'día' : 'días'}
          </span>

          <div className="my-2 p-2 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 max-w-[210px] shadow-sm">
            <p className="text-xs font-bold text-amber-950">
              Tamaño de un {milestone.sizeComparison}
            </p>
            <span className="text-[11px] text-amber-900 block mt-0.5">
              ~{milestone.lengthCm} cm | ~{milestone.weightGrams} g
            </span>
          </div>

          <button
            onClick={onViewPregnancyDetails}
            className="mt-2 px-4 py-2 rounded-full bg-amber-950 text-amber-50 text-xs font-bold shadow-md hover:bg-amber-900 transition-all active:scale-95 cursor-pointer"
          >
            Detalles del desarrollo
          </button>
        </div>
      </div>
    );
  }

  // --- MENOPAUSE STAGE DIAL ---
  const comfort = calculateThermalComfortIndex(hotFlashesToday, sleepQuality, skinTemp);

  return (
    <div className="w-full max-w-sm mx-auto my-4 transition-all duration-500 animate-fade-in">
      <div className="relative rounded-full aspect-square p-6 flex flex-col items-center justify-center text-center shadow-xl border border-teal-100 bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-600 text-white">
        <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm mb-2">
          <Thermometer className="w-3.5 h-3.5 text-teal-100" />
          <span>Confort Térmico: {comfort.status}</span>
        </div>

        <span className="text-xs font-medium text-teal-100 uppercase tracking-wide">Índice de Bienestar</span>
        <h1 className="text-4xl sm:text-5xl font-black text-white my-1 tracking-tight">
          {comfort.score} / 100
        </h1>
        
        <p className="text-xs text-teal-50 max-w-[210px] mb-3 leading-tight">
          {hotFlashesToday} sofocos hoy • Sueño: {sleepQuality === 'good' ? 'Reparador' : 'Regular'}
        </p>

        <button
          onClick={onOpenTCC}
          className="px-4 py-2 rounded-full bg-white text-teal-800 text-xs font-bold shadow-md hover:bg-teal-50 transition-all active:scale-95 cursor-pointer"
        >
          Sesión TCC de respiración
        </button>
      </div>
    </div>
  );
}
