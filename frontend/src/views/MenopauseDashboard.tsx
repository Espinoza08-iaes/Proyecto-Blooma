import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db, type Profile, type DailyLog, type MRSEvaluation } from '../db/db';
import { Shield, Sparkles, BookOpen, ChevronLeft, ChevronRight, Activity, Bone, Thermometer, Wind, Calendar as CalendarIcon, X, Brain, Heart, CheckCircle2, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import HeroDial from '../components/HeroDial';
import FloatingActionDock from '../components/FloatingActionDock';
import MetricSummaryCard from '../components/MetricSummaryCard';
import MedicalGuidelineCard from '../components/MedicalGuidelineCard';
import WearableSyncCard from '../components/WearableSyncCard';
import WearableTelemetryModal from '../components/WearableTelemetryModal';
import SymptomLoggingSheet from '../components/SymptomLoggingSheet';
import HotFlashTracker from '../components/HotFlashTracker';
import KegelTimer from '../components/KegelTimer';
import MRSEvaluationModal from '../components/MRSEvaluationModal';
import { useTranslation } from '../i18n/useTranslation';
import {
  TCC_CARDS,
  calculateThermalComfortIndex,
  CLIMACTERIC_STAGES,
  type ClimactericStage
} from '../services/menopauseService';

interface MenopauseDashboardProps {
  profile: Profile | null;
  onOpenDrawer?: () => void;
  onOpenCalendar?: () => void;
}

export default function MenopauseDashboard({ profile, onOpenDrawer, onOpenCalendar }: MenopauseDashboardProps) {
  const { t } = useTranslation(profile);
  const [activeStageKey, setActiveStageKey] = useState<ClimactericStage>(
    profile?.climactericStage || 'early_perimenopause'
  );
  const [hotFlashesToday, setHotFlashesToday] = useState(2);
  const [sleepQuality, setSleepQuality] = useState<'good' | 'fair' | 'poor'>('good');
  const [activeTCCIndex, setActiveTCCIndex] = useState(0);
  const [lastMRSEval, setLastMRSEval] = useState<MRSEvaluation | null>(null);
  
  // Modals state
  const [isTCCModalOpen, setIsTCCModalOpen] = useState(false);
  const [isWearableModalOpen, setIsWearableModalOpen] = useState(false);
  const [isSymptomSheetOpen, setIsSymptomSheetOpen] = useState(false);
  const [isMRSModalOpen, setIsMRSModalOpen] = useState(false);

  // Daily log state for symptoms sheet
  const [selectedLogDate, setSelectedLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeLog, setActiveLog] = useState<DailyLog | undefined>(undefined);

  // Osteoporosis Checklist
  const [ostChecklist, setOstChecklist] = useState({
    calcium: true,
    weightExercise: true,
    sunExposure: false,
    boneDensityScan: false,
  });

  // Lock body scroll when any modal in menopause is active
  useEffect(() => {
    const isAnyModalOpen = isTCCModalOpen || isWearableModalOpen || isSymptomSheetOpen || isMRSModalOpen;
    if (isAnyModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isTCCModalOpen, isWearableModalOpen, isSymptomSheetOpen, isMRSModalOpen]);

  useEffect(() => {
    async function loadData() {
      if (profile?.climactericStage) {
        setActiveStageKey(profile.climactericStage);
      }
      // Load latest MRS Evaluation
      const evaluations = await db.mrsEvaluations.orderBy('date').reverse().limit(1).toArray();
      if (evaluations.length > 0) {
        setLastMRSEval(evaluations[0]);
      }
    }
    loadData();
  }, [profile]);

  const handleStageChange = async (newStage: ClimactericStage) => {
    setActiveStageKey(newStage);
    if (profile) {
      const updated: Profile = {
        ...profile,
        climactericStage: newStage
      };
      await db.profile.put(updated, 'main');
    }
  };

  const handleCheckboxChange = (key: keyof typeof ostChecklist) => {
    setOstChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const comfort = calculateThermalComfortIndex(hotFlashesToday, sleepQuality);
  const today = new Date();
  const currentStageInfo = CLIMACTERIC_STAGES[activeStageKey] || CLIMACTERIC_STAGES.early_perimenopause;

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
          <div className="absolute top-0 right-0 w-3 h-3 bg-teal-500 rounded-full border-2 border-white" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-extrabold text-slate-900 capitalize">
            {format(today, 'd MMMM', { locale: es })}
          </h2>
          <span className="text-[10px] font-bold text-teal-700 block">
            {currentStageInfo.shortBadge}
          </span>
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
        profile={profile}
        hotFlashesToday={hotFlashesToday}
        sleepQuality={sleepQuality}
        onOpenTCC={() => setIsTCCModalOpen(true)}
      />

      {/* Floating 3-Button Action Dock */}
      <FloatingActionDock
        stage="menopause"
        profile={profile}
        onLogPeriod={() => setHotFlashesToday(prev => prev + 1)}
        onLogSymptoms={() => setIsSymptomSheetOpen(true)}
        onWearableSync={() => setIsWearableModalOpen(true)}
      />

      {/* CLIMACTERIC STAGE SELECTOR (5 Phases: STRAW+10 / MINSA) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              {t.menopause.stagesTitle}
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
            {currentStageInfo.ageRange}
          </span>
        </div>

        {/* 5 Stages Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(CLIMACTERIC_STAGES) as ClimactericStage[]).map(key => {
            const stg = CLIMACTERIC_STAGES[key];
            const isActive = activeStageKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleStageChange(key)}
                className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200 scale-102'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-100'
                }`}
              >
                <span className={`text-[10px] font-extrabold uppercase block ${isActive ? 'text-teal-100' : 'text-slate-400'}`}>
                  {stg.shortBadge}
                </span>
                <span className="text-xs font-bold block mt-0.5 line-clamp-1">
                  {stg.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Clinical Insight Card */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-2.5">
          <div className="flex items-start justify-between">
            <h4 className="text-xs font-black text-slate-900">{currentStageInfo.title}</h4>
            <span className="text-[10px] font-extrabold text-teal-800 bg-white px-2 py-0.5 rounded-full border border-teal-200">
              Prioridad: {currentStageInfo.clinicalPriority}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {currentStageInfo.biologicalCriteria}
          </p>

          <div className="pt-2 border-t border-teal-100/80 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-900 block">
              Pautas Clínicas Recomendadas (MINSA / OMS):
            </span>
            <ul className="space-y-1">
              {currentStageInfo.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start space-x-1.5 text-xs text-slate-700">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* MRS CLINICAL EVALUATION CARD (OMS / MINSA Menopause Rating Scale) */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-6 text-white shadow-lg shadow-teal-200/50 space-y-4 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white backdrop-blur-sm">
              Protocolo Estandarizado OMS / MINSA
            </span>
            <Activity className="w-5 h-5 text-teal-100" />
          </div>

          <h3 className="text-base font-black leading-tight">
            {t.menopause.mrsAssessmentTitle}
          </h3>
          
          <p className="text-xs text-teal-50 leading-relaxed">
            {t.menopause.mrsAssessmentDesc}
          </p>

          {lastMRSEval && (
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between text-xs mt-3">
              <div>
                <span className="text-[10px] text-teal-100 block">Último Resultado ({lastMRSEval.date}):</span>
                <span className="font-extrabold text-white text-sm">{lastMRSEval.totalScore} / 44 pts • {lastMRSEval.severity.toUpperCase()}</span>
              </div>
              <div className="text-right text-[11px] text-teal-100">
                <span>Som: {lastMRSEval.somaticScore} | Psi: {lastMRSEval.psychologicalScore} | Uro: {lastMRSEval.urogenitalScore}</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMRSModalOpen(true)}
            className="w-full py-3 mt-2 rounded-2xl bg-white text-teal-900 font-extrabold text-xs shadow-md hover:bg-teal-50 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Activity className="w-4 h-4 text-teal-700" />
            <span>{lastMRSEval ? 'Repetir Evaluación MRS' : t.menopause.startMrsTest}</span>
          </button>
        </div>
      </div>

      {/* Telemetry Sync Card for Nocturnal Hot Flash & Sleep Tracking */}
      <WearableSyncCard />

      {/* Double Column Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <MetricSummaryCard
          title={t.menopause.hotFlashesLogged}
          value={hotFlashesToday}
          unit="eventos"
          statusBadge={hotFlashesToday > 3 ? 'VIGILAR' : 'NORMAL'}
          infoTooltip="Detectados automáticamente por sensores o ingresados manualmente."
        />
        <MetricSummaryCard
          title={t.menopause.comfortScore}
          value={comfort.score}
          unit="/100"
          statusBadge={comfort.status === 'Óptimo' ? 'NORMAL' : 'VIGILAR'}
          infoTooltip="Evaluación combinada de temperatura cutánea y calidad de sueño."
        />
      </div>

      {/* TCC Interactive Card Carousel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              {t.menopause.tccTitle}
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
        statusText={currentStageInfo.title}
        explanation={currentStageInfo.clinicalPriority}
        sourceCitation="OMS & MINSA Nicaragua. Guía para la atención integral a la mujer en la menopausia."
      />

      {/* Osteoporosis Risk & Prevention Checklist */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Bone className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            {t.menopause.boneHealthTitle}
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
              Densitometría Ósea anual programada (a partir de los 50 años)
            </span>
          </label>
        </div>
      </div>

      {/* Manual Trackers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HotFlashTracker />
        <KegelTimer />
      </div>

      {/* PORTALIZED MODALS */}

      {/* 1. TCC Breathing Modal */}
      {isTCCModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overscroll-contain">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-scale-up relative">
            <button
              type="button"
              onClick={() => setIsTCCModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto animate-pulse">
              <Wind className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Sesión de Respiración Pautada (5 min)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inhala suavemente durante 5 segundos, retén el aire 2 segundos y exhala en 5 segundos. Esta técnica disminuye el estímulo térmico y la frecuencia de sofocos.
            </p>
            <button
              type="button"
              onClick={() => setIsTCCModalOpen(false)}
              className="w-full py-3 rounded-full bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-700 transition-all cursor-pointer"
            >
              Completar Sesión
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* 2. MRS Evaluation Modal */}
      <MRSEvaluationModal
        isOpen={isMRSModalOpen}
        onClose={() => setIsMRSModalOpen(false)}
        profile={profile}
        onEvaluationCompleted={(evalRec) => {
          setLastMRSEval(evalRec);
        }}
      />

      {/* 3. Smartwatch & Ring Telemetry Modal */}
      <WearableTelemetryModal
        isOpen={isWearableModalOpen}
        onClose={() => setIsWearableModalOpen(false)}
        stage="menopause"
      />

      {/* 4. Daily Symptom Logging Sheet */}
      <SymptomLoggingSheet
        isOpen={isSymptomSheetOpen}
        onClose={() => setIsSymptomSheetOpen(false)}
        selectedDate={selectedLogDate}
        onDateChange={setSelectedLogDate}
        sexTags={activeLog?.sexTags}
        moodTags={activeLog?.moodTags}
        symptomTags={activeLog?.symptomTags}
        dischargeType={activeLog?.dischargeType}
        digestionTags={activeLog?.digestionTags}
        waterMl={activeLog?.waterMl}
        weightKg={activeLog?.weightKg}
        onToggleTag={() => {}}
        onUpdateWater={() => {}}
        onUpdateWeight={() => {}}
        onSave={async () => {}}
      />

    </div>
  );
}
