import React, { useState, useEffect } from 'react';
import { db, type Profile } from '../db/db';
import { Shield, Sparkles, BookOpen, ChevronLeft, ChevronRight, Activity, Bone, Thermometer, Wind, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import HeroDial from '../components/HeroDial';
import FloatingActionDock from '../components/FloatingActionDock';
import MetricSummaryCard from '../components/MetricSummaryCard';
import MedicalGuidelineCard from '../components/MedicalGuidelineCard';
import WearableSyncCard from '../components/WearableSyncCard';
import HotFlashTracker from '../components/HotFlashTracker';
import KegelTimer from '../components/KegelTimer';
import ProfileSettingsDrawer from '../components/ProfileSettingsDrawer';
import { TCC_CARDS, calculateThermalComfortIndex, type TCCCard } from '../services/menopauseService';

interface MenopauseDashboardProps {
  profile: Profile | null;
  onOpenDrawer?: () => void;
  onOpenCalendar?: () => void;
}

export default function MenopauseDashboard({ profile, onOpenDrawer, onOpenCalendar }: MenopauseDashboardProps) {
  const [monthsSincePeriod, setMonthsSincePeriod] = useState(14);
  const [hotFlashesToday, setHotFlashesToday] = useState(2);
  const [sleepQuality, setSleepQuality] = useState<'good' | 'fair' | 'poor'>('good');
  const [activeTCCIndex, setActiveTCCIndex] = useState(0);
  const [isTCCModalOpen, setIsTCCModalOpen] = useState(false);

  // Osteoporosis Checklist
  const [ostChecklist, setOstChecklist] = useState({
    calcium: true,
    weightExercise: true,
    sunExposure: false,
    boneDensityScan: false,
  });

  useEffect(() => {
    async function loadData() {
      if (profile?.menopauseStartYear) {
        setMonthsSincePeriod(14);
      }
    }
    loadData();
  }, [profile]);

  const handleCheckboxChange = (key: keyof typeof ostChecklist) => {
    setOstChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isPostmenopause = monthsSincePeriod >= 12;
  const comfort = calculateThermalComfortIndex(hotFlashesToday, sleepQuality);
  const today = new Date();

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative min-h-screen bg-gradient-to-b from-teal-50/50 via-slate-50 to-slate-50">
      
      {/* TOP HEADER BAR (Flo Style: Left Avatar | Center Date | Right Calendar) */}
      <header className="flex items-center justify-between pt-2 px-2">
        <button
          type="button"
          onClick={() => { if (onOpenDrawer) onOpenDrawer(); }}
          className="relative group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-white text-slate-700 flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-all overflow-hidden border-2 border-slate-200 p-1">
            {profile?.customAvatarUrl ? (
              <img src={profile.customAvatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : profile?.appIcon === 'blooma' || !profile?.appIcon || profile?.appIcon === '🦙' ? (
              <img src="/blooma_isotipo.png" alt="Isotipo Oficial Blooma" className="w-full h-full object-contain" />
            ) : (
              <span>{profile?.appIcon}</span>
            )}
          </div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-extrabold text-slate-900 capitalize">
            {format(today, 'd MMMM', { locale: es })}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => { if (onOpenCalendar) onOpenCalendar(); }}
          className="w-10 h-10 rounded-2xl bg-white/80 border border-slate-200/80 flex items-center justify-center text-slate-700 shadow-sm cursor-pointer"
        >
          <CalendarIcon className="w-5 h-5 text-slate-800" />
        </button>
      </header>
      
      {/* Hero Dial Adaptativo de Confort Térmico */}
      <HeroDial
        stage="menopause"
        hotFlashesToday={hotFlashesToday}
        sleepQuality={sleepQuality}
        onOpenTCC={() => setIsTCCModalOpen(true)}
      />

      {/* Floating 3-Button Action Dock */}
      <FloatingActionDock
        stage="menopause"
        onLogPeriod={() => setHotFlashesToday(prev => prev + 1)}
        onLogSymptoms={() => setIsTCCModalOpen(true)}
        onWearableSync={() => {}}
      />

      {/* Telemetry Sync Card for Nocturnal Hot Flash & Sleep Tracking */}
      <WearableSyncCard />

      {/* Double Column Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <MetricSummaryCard
          title="Sofocos Registrados Hoy"
          value={hotFlashesToday}
          unit="eventos"
          statusBadge={hotFlashesToday > 3 ? 'VIGILAR' : 'NORMAL'}
          infoTooltip="Detectados automáticamente o ingresados manualmente."
        />
        <MetricSummaryCard
          title="Índice de Confort"
          value={comfort.score}
          unit="/100"
          statusBadge={comfort.status === 'Óptimo' ? 'NORMAL' : 'VIGILAR'}
          infoTooltip="Evaluación combinada de temperatura cutánea y sueño."
        />
      </div>

      {/* TCC Interactive Card Carousel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Terapia Cognitivo-Conductual (TCC)
            </h3>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTCCIndex(prev => (prev === 0 ? TCC_CARDS.length - 1 : prev - 1))}
              className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTCCIndex(prev => (prev === TCC_CARDS.length - 1 ? 0 : prev + 1))}
              className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active TCC Card */}
        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
            {TCC_CARDS[activeTCCIndex].subtitle} • {TCC_CARDS[activeTCCIndex].durationMinutes} min
          </span>

          <h4 className="text-base font-black text-slate-900">{TCC_CARDS[activeTCCIndex].title}</h4>

          <ul className="space-y-2">
            {TCC_CARDS[activeTCCIndex].steps.map((step, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                <span className="w-4 h-4 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-teal-100 text-[10px] text-teal-900 font-medium italic">
            💡 <strong>Respaldo Científico:</strong> {TCC_CARDS[activeTCCIndex].scientificRationale}
          </div>
        </div>
      </div>

      {/* Clinical Guideline Card */}
      <MedicalGuidelineCard
        title="Protocolo Climaterio y Salud Menopáusica MINSA"
        statusText={isPostmenopause ? 'Postmenopausia Fisiológica Estable' : 'Perimenopausia Activa'}
        explanation="La preservación de masa ósea y salud cardiovascular es prioritaria durante esta etapa mediante nutrición y ejercicio de resistencia."
        sourceCitation="OMS & MINSA Nicaragua. Guía para la atención integral a la mujer en la menopausia."
      />

      {/* Osteoporosis Risk & Prevention Checklist */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Bone className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Prevención de Osteoporosis & Salud Ósea
          </h3>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <input
              type="checkbox"
              checked={ostChecklist.calcium}
              onChange={() => handleCheckboxChange('calcium')}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs font-semibold text-slate-800">
              Ingesta diaria adecuada de Calcio (1,200 mg) y Vitamina D3
            </span>
          </label>

          <label className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <input
              type="checkbox"
              checked={ostChecklist.weightExercise}
              onChange={() => handleCheckboxChange('weightExercise')}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs font-semibold text-slate-800">
              Caminata ligera o ejercicio de resistencia 3 veces por semana
            </span>
          </label>

          <label className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <input
              type="checkbox"
              checked={ostChecklist.sunExposure}
              onChange={() => handleCheckboxChange('sunExposure')}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs font-semibold text-slate-800">
              Exposición solar moderada de 15 minutos en la mañana
            </span>
          </label>

          <label className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
            <input
              type="checkbox"
              checked={ostChecklist.boneDensityScan}
              onChange={() => handleCheckboxChange('boneDensityScan')}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs font-semibold text-slate-800">
              Densitometría Ósea anual programada
            </span>
          </label>
        </div>
      </div>

      {/* Manual Trackers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HotFlashTracker />
        <KegelTimer />
      </div>

      {/* TCC Breathing Modal */}
      {isTCCModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto animate-pulse">
              <Wind className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Sesión de Respiración Pautada (5 min)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inhala suavemente durante 5 segundos, retén el aire 2 segundos y exhala en 5 segundos. Esta técnica disminuye el estímulo térmico.
            </p>
            <button
              onClick={() => setIsTCCModalOpen(false)}
              className="w-full py-3 rounded-full bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-700 cursor-pointer"
            >
              Completar Sesión
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
