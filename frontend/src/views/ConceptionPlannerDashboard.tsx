import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db, type Profile, type DailyLog } from '../db/db';
import { Sparkles, Calendar as CalendarIcon, Heart, Zap, ShieldCheck, Activity, Check, Thermometer, TestTube, HelpCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import FloatingActionDock from '../components/FloatingActionDock';
import MetricSummaryCard from '../components/MetricSummaryCard';
import MedicalGuidelineCard from '../components/MedicalGuidelineCard';
import WearableSyncCard from '../components/WearableSyncCard';
import WearableTelemetryModal from '../components/WearableTelemetryModal';
import HormoneSimulatorCard from '../components/HormoneSimulatorCard';
import SymptomLoggingSheet from '../components/SymptomLoggingSheet';
import { calculateFertilityWindow, CONCEPTION_GUIDELINES } from '../services/conceptionService';
import { useTranslation } from '../i18n/useTranslation';

interface ConceptionPlannerDashboardProps {
  profile: Profile | null;
  onOpenDrawer?: () => void;
  onOpenCalendar?: () => void;
}

export default function ConceptionPlannerDashboard({ profile, onOpenDrawer, onOpenCalendar }: ConceptionPlannerDashboardProps) {
  const { t } = useTranslation(profile);
  const [cycleDay, setCycleDay] = useState(14);
  const [isLoggingSheetOpen, setIsLoggingSheetOpen] = useState(false);
  const [isWearableModalOpen, setIsWearableModalOpen] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  // Conception Questionnaire Form state
  const [questionnaireData, setQuestionnaireData] = useState({
    monthsTrying: '3-6 meses',
    takingFolicAcid: true,
    usesLHStrips: true,
    regularCycles: true
  });

  // Daily log state for fertility metrics
  const [selectedLogDate, setSelectedLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeLog, setActiveLog] = useState<DailyLog | undefined>(undefined);

  // Lock body scroll when any modal in conception planner is open
  useEffect(() => {
    const isAnyModalOpen = showQuestionnaire || isLoggingSheetOpen || isWearableModalOpen;
    if (isAnyModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showQuestionnaire, isLoggingSheetOpen, isWearableModalOpen]);

  useEffect(() => {
    async function loadData() {
      const logsData = await db.dailyLogs.toArray();
      if (logsData.length > 0) {
        setCycleDay(14);
      }
    }
    loadData();
  }, []);

  const fertility = calculateFertilityWindow(cycleDay, 28);
  const today = new Date();

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative min-h-screen bg-gradient-to-b from-pink-50/70 via-rose-50/40 to-slate-50">
      
      {/* Background Ambient Mesh */}
      <div className="absolute top-0 inset-x-0 h-96 overflow-hidden pointer-events-none -z-10">
        <div className="w-[140%] -left-[20%] h-80 rounded-[100%] bg-pink-300 opacity-40 blur-3xl" />
      </div>

      {/* TOP HEADER BAR (Left Avatar | Center Date | Right Calendar) */}
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
          <div className="absolute top-0 right-0 w-3 h-3 bg-pink-500 rounded-full border-2 border-white" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase text-pink-600 tracking-wider block">Planificación de Embarazo</span>
          <h2 className="text-sm font-extrabold text-slate-900 capitalize">
            {format(today, 'd MMMM', { locale: es })}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => { if (onOpenCalendar) onOpenCalendar(); }}
          className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-white transition-all shadow-sm cursor-pointer"
        >
          <CalendarIcon className="w-5 h-5 text-slate-800" />
        </button>
      </header>

      {/* Hero Dial de Concepción / Fertilidad */}
      <div className="bg-gradient-to-b from-pink-500 to-rose-600 rounded-full w-72 h-72 mx-auto flex flex-col items-center justify-center text-white text-center shadow-xl shadow-pink-200 border-4 border-white/40 relative overflow-hidden p-6 animate-pulse-subtle">
        
        <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-1">
          Día {cycleDay} • {fertility.chanceCategory}
        </span>

        <h2 className="text-4xl font-black tracking-tight my-1">
          {fertility.conceptionProbability}%
        </h2>

        <span className="text-xs font-bold text-pink-100 max-w-[180px] leading-tight block">
          Probabilidad de Concepción Hoy
        </span>

        <button
          type="button"
          onClick={() => setShowQuestionnaire(true)}
          className="mt-3 px-4 py-1.5 rounded-full bg-white text-rose-600 text-xs font-extrabold shadow-md hover:bg-pink-50 transition-all cursor-pointer"
        >
          Ajustar Plan de Fertilidad
        </button>
      </div>

      {/* Floating 3-Button Action Dock */}
      <FloatingActionDock
        stage="cycle"
        profile={profile}
        onLogPeriod={() => setIsLoggingSheetOpen(true)}
        onLogSymptoms={() => setIsLoggingSheetOpen(true)}
        onWearableSync={() => setIsWearableModalOpen(true)}
      />

      {/* Pregnancy Test Countdown Card */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-pink-600">
          <TestTube className="w-5 h-5" />
          <h3 className="text-sm font-black text-slate-900">Calculadora de Test de Embarazo</h3>
        </div>

        <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-pink-700 block">Día Óptimo para Test β-hCG</span>
            <h4 className="text-base font-black text-pink-950">{fertility.recommendedPregnancyTestDate}</h4>
          </div>
          <span className="px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-extrabold shadow-sm">
            En ~12 días
          </span>
        </div>
      </div>

      {/* Double Column Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <MetricSummaryCard
          title="Moco Cervical Fértil"
          value="Clara Huevo"
          unit=""
          statusBadge="NORMAL"
          infoTooltip="Moco elástico y transparente que facilita la fertilización."
        />
        <MetricSummaryCard
          title="Pico de Ovulación LH"
          value="Estimado en 24h"
          unit=""
          statusBadge="NORMAL"
          infoTooltip="Pico de hormona luteinizante antes del despliegue folicular."
        />
      </div>

      {/* Interactive Hormonal Simulator Card */}
      <HormoneSimulatorCard currentDay={cycleDay} />

      {/* Preconception Clinical Guidelines (MINSA & OMS) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-rose-600">
          <Heart className="w-5 h-5 fill-rose-500" />
          <h3 className="text-sm font-black text-slate-900">Guía Clínica de Concepción MINSA / OMS</h3>
        </div>

        <div className="space-y-3">
          {CONCEPTION_GUIDELINES.map(g => (
            <div key={g.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-rose-600 tracking-wider block">{g.category}</span>
              <h4 className="text-xs font-black text-slate-900">{g.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{g.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry Sync Card */}
      <WearableSyncCard />

      {/* PORTALIZED MODALS */}

      {/* 1. Conception Questionnaire Modal */}
      {showQuestionnaire && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overscroll-contain">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-scale-up relative">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Plan de Concepción Personalizado</h3>
              <button
                type="button"
                onClick={() => setShowQuestionnaire(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">¿Tiempo buscando concebir?</label>
                <select
                  value={questionnaireData.monthsTrying}
                  onChange={e => setQuestionnaireData(prev => ({ ...prev, monthsTrying: e.target.value }))}
                  className="w-full p-2.5 rounded-xl bg-slate-100 font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="< 3 meses">Menos de 3 meses</option>
                  <option value="3-6 meses">Entre 3 y 6 meses</option>
                  <option value="6-12 meses">Entre 6 y 12 meses</option>
                  <option value="> 12 meses">Más de 12 meses</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-between">
                <span className="font-bold text-slate-800">¿Tomas suplemento de Ácido Fólico (400 µg)?</span>
                <input
                  type="checkbox"
                  checked={questionnaireData.takingFolicAcid}
                  onChange={e => setQuestionnaireData(prev => ({ ...prev, takingFolicAcid: e.target.checked }))}
                  className="rounded text-pink-600 focus:ring-pink-500 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-between">
                <span className="font-bold text-slate-800">¿Utilizas tiras de ovulación o reloj inteligente?</span>
                <input
                  type="checkbox"
                  checked={questionnaireData.usesLHStrips}
                  onChange={e => setQuestionnaireData(prev => ({ ...prev, usesLHStrips: e.target.checked }))}
                  className="rounded text-pink-600 focus:ring-pink-500 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowQuestionnaire(false)}
              className="w-full py-3 rounded-full bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-200 hover:bg-rose-600 transition-all cursor-pointer"
            >
              Guardar y Optimizar Algoritmo
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* 2. Wearable Telemetry Modal */}
      <WearableTelemetryModal
        isOpen={isWearableModalOpen}
        onClose={() => setIsWearableModalOpen(false)}
        stage="cycle"
        conceptionMode={true}
      />

      {/* 3. Symptom Logging Sheet Modal */}
      <SymptomLoggingSheet
        isOpen={isLoggingSheetOpen}
        onClose={() => setIsLoggingSheetOpen(false)}
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
