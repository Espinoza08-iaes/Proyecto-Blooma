import React, { useState, useEffect } from 'react';
import { db, type TriageRecord, type MaternalHouse, type Profile } from '../db/db';
import { Heart, Activity, AlertOctagon, Phone, Info, Check, ShieldAlert, Sparkles, MapPin, Search, Baby, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import HeroDial from '../components/HeroDial';
import FloatingActionDock from '../components/FloatingActionDock';
import MetricSummaryCard from '../components/MetricSummaryCard';
import MedicalGuidelineCard from '../components/MedicalGuidelineCard';
import WearableSyncCard from '../components/WearableSyncCard';
import KickCounter from '../components/KickCounter';
import ContractionTimer from '../components/ContractionTimer';
import HospitalBag from '../components/HospitalBag';
import { getPregnancyMilestone } from '../services/pregnancyService';

const urgentSymptoms = [
  { id: 'sangrado', label: 'Sangrado vaginal de cualquier cantidad' },
  { id: 'convulsiones', label: 'Convulsiones o desmayos' },
  { id: 'dolor_cabeza_vision', label: 'Dolor de cabeza severo con zumbido de oídos o visión borrosa' },
  { id: 'fiebre_alta', label: 'Fiebre alta persistente (mayor a 38.3°C)' },
  { id: 'liquido', label: 'Salida de líquido por la vagina (ruptura de fuente)' },
];

const watchSymptoms = [
  { id: 'hinchazon', label: 'Hinchazón de cara, manos o pies (edema)' },
  { id: 'dolor_bajo', label: 'Dolor en la boca del estómago o vientre bajo' },
  { id: 'movimientos', label: 'Disminución o ausencia de movimientos del bebé' },
  { id: 'ardor_orinar', label: 'Ardor o dolor persistente al orinar' },
  { id: 'vomito', label: 'Vómito constante que impide retener alimentos' },
];

import ProfileSettingsDrawer from '../components/ProfileSettingsDrawer';
import { Calendar as CalendarIcon } from 'lucide-react';

interface PregnancyDashboardProps {
  profile: Profile | null;
  onOpenDrawer?: () => void;
  onOpenCalendar?: () => void;
}

export default function PregnancyDashboard({ profile, onOpenDrawer, onOpenCalendar }: PregnancyDashboardProps) {
  const [gestationWeeks, setGestationWeeks] = useState(18);
  const [gestationDays, setGestationDays] = useState(1);
  const [selectedDept, setSelectedDept] = useState('Todos');
  const [houses, setHouses] = useState<MaternalHouse[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  
  // Triage modal state
  const [showTriage, setShowTriage] = useState(false);
  const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);
  const [triageResult, setTriageResult] = useState<TriageRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Active sub-tool modals
  const [activeTool, setActiveTool] = useState<'none' | 'kicks' | 'contractions' | 'bag'>('none');

  useEffect(() => {
    async function loadData() {
      const data = await db.maternalHouses.toArray();
      setHouses(data);
      const depts = ['Todos', ...new Set(data.map(h => h.department))];
      setDepartments(depts);

      if (profile?.gestationWeekStart) {
        const diffMs = Date.now() - new Date(profile.gestationWeekStart).getTime();
        const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        const currentWeeks = Math.min(42, Math.max(1, 12 + diffWeeks));
        setGestationWeeks(currentWeeks);
      }
    }
    loadData();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setCheckedSymptoms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const evaluateTriage = async () => {
    let classification: TriageRecord['classification'] = 'normal';

    const hasUrgent = urgentSymptoms.some(s => checkedSymptoms.includes(s.id));
    const hasWatch = watchSymptoms.some(s => checkedSymptoms.includes(s.id));

    if (hasUrgent) {
      classification = 'urgente';
    } else if (hasWatch) {
      classification = 'vigilar';
    }

    const record: TriageRecord = {
      date: new Date().toISOString().split('T')[0],
      gestationWeek: gestationWeeks,
      symptoms: checkedSymptoms,
      classification
    };

    await db.triageRecords.add(record);
    setTriageResult(record);
  };

  const milestone = getPregnancyMilestone(gestationWeeks);
  const filteredHouses = selectedDept === 'Todos' ? houses : houses.filter(h => h.department === selectedDept);
  const today = new Date();

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative min-h-screen bg-gradient-to-b from-amber-50/50 via-rose-50/20 to-slate-50">
      
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
      
      {/* Hero Dial Gestacional Adaptativo */}
      <HeroDial
        stage="pregnancy"
        gestationWeek={gestationWeeks}
        gestationDay={gestationDays}
        onViewPregnancyDetails={() => setActiveTool('bag')}
      />

      {/* Floating 3-Button Action Dock */}
      <FloatingActionDock
        stage="pregnancy"
        onLogPeriod={() => setActiveTool('kicks')}
        onLogSymptoms={() => setShowTriage(true)}
        onWearableSync={() => {}}
      />

      {/* Telemetry Sync Card */}
      <WearableSyncCard />

      {/* Double Column Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <MetricSummaryCard
          title="Edad Gestacional"
          value={gestationWeeks}
          unit="semanas"
          statusBadge="NORMAL"
          infoTooltip="Calculada desde tu fecha probable de concepción."
        />
        <MetricSummaryCard
          title="Casas Maternas MINSA"
          value={filteredHouses.length}
          unit="disponibles"
          statusBadge="REGULAR"
          infoTooltip="Red de Casas Maternas para canalización inmediata."
        />
      </div>

      {/* Fetal Size & Milestone Detail Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Baby className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Hito Semanal: Semana {milestone.week}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-1 p-4 rounded-2xl bg-amber-50 text-center border border-amber-100">
            <span className="text-4xl block mb-1">🫑</span>
            <span className="text-xs font-bold text-amber-950 block">Tamaño de un</span>
            <span className="text-sm font-extrabold text-amber-900">{milestone.sizeComparison}</span>
            <span className="text-[10px] text-amber-800 block mt-1">
              ~{milestone.lengthCm} cm | ~{milestone.weightGrams} g
            </span>
          </div>

          <div className="sm:col-span-2 space-y-2">
            <h4 className="text-base font-bold text-slate-900">{milestone.keyDevMilestone}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{milestone.description}</p>
            <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 font-medium">
              💡 <strong>Consejo MINSA:</strong> {milestone.minsaTip}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Triage Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-rose-200 block">MINSA Nicaragua</span>
          <h3 className="text-lg font-black tracking-tight">Triaje Clínico de Emergencia</h3>
          <p className="text-xs text-rose-100 max-w-xs mt-1">
            Clasifica tus síntomas en Normal, Vigilar o Urgente en 1 minuto.
          </p>
        </div>

        <button
          onClick={() => setShowTriage(true)}
          className="px-4 py-2.5 rounded-full bg-white text-rose-600 text-xs font-extrabold shadow-md hover:bg-rose-50 transition-all active:scale-95 cursor-pointer"
        >
          Evaluar ahora
        </button>
      </div>

      {/* Clinical Advisory Card */}
      <MedicalGuidelineCard
        title="Protocolo de Atención Materna MINSA"
        statusText="Control Gestacional Adecuado"
        explanation="Las consultas prenatales mensuales garantizan el monitoreo de presión arterial, peso y bienestar fetal."
        sourceCitation="Norma Técnica N° 011. Protocolo de Atención Obstétrica MINSA Nicaragua."
      />

      {/* Interactive Pregnancy Sub-Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTool('kicks')}
          className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Contador de Pataditas</h4>
            <span className="text-[10px] text-slate-500">Sesión de 10 movimientos</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTool('contractions')}
          className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Cronómetro de Contracciones</h4>
            <span className="text-[10px] text-slate-500">Mide intervalo y duración</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTool('bag')}
          className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Maleta Hospitalaria</h4>
            <span className="text-[10px] text-slate-500">Checklist Mamá y Bebé</span>
          </div>
        </button>
      </div>

      {/* Directory of Casas Maternas MINSA */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Directorio de Casas Maternas</h3>
            <p className="text-xs text-slate-500">Canalización y refugio maternal del MINSA.</p>
          </div>

          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700 border-none focus:ring-2 focus:ring-rose-400"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {filteredHouses.map(h => (
            <div key={h.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{h.name}</h4>
                <span className="text-[10px] font-medium text-slate-500 flex items-center mt-0.5">
                  <MapPin className="w-3 h-3 text-rose-500 mr-1 inline" />
                  {h.municipality}, {h.department}
                </span>
              </div>
              {h.phone && (
                <a
                  href={`tel:${h.phone}`}
                  className="p-2 rounded-full bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sub-tool modals */}
      {activeTool === 'kicks' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 relative">
            <button onClick={() => setActiveTool('none')} className="absolute top-4 right-4 p-1 text-slate-400">
              <Check className="w-5 h-5" />
            </button>
            <KickCounter />
          </div>
        </div>
      )}

      {activeTool === 'contractions' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 relative">
            <button onClick={() => setActiveTool('none')} className="absolute top-4 right-4 p-1 text-slate-400">
              <Check className="w-5 h-5" />
            </button>
            <ContractionTimer />
          </div>
        </div>
      )}

      {activeTool === 'bag' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 relative">
            <button onClick={() => setActiveTool('none')} className="absolute top-4 right-4 p-1 text-slate-400">
              <Check className="w-5 h-5" />
            </button>
            <HospitalBag />
          </div>
        </div>
      )}

      {/* Emergency Triage Modal */}
      {showTriage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900">Triaje Obstétrico MINSA</h3>
            <p className="text-xs text-slate-500">Selecciona todos los síntomas que presentes actualmente:</p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-600 block uppercase">Signos de Urgencia Roja</span>
              {urgentSymptoms.map(s => (
                <label key={s.id} className="flex items-center space-x-2 text-xs text-slate-800 p-2 rounded-xl bg-rose-50 border border-rose-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedSymptoms.includes(s.id)}
                    onChange={() => handleCheckboxChange(s.id)}
                    className="rounded text-rose-600"
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-600 block uppercase">Signos de Vigilancia Amarilla</span>
              {watchSymptoms.map(s => (
                <label key={s.id} className="flex items-center space-x-2 text-xs text-slate-800 p-2 rounded-xl bg-amber-50 border border-amber-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedSymptoms.includes(s.id)}
                    onChange={() => handleCheckboxChange(s.id)}
                    className="rounded text-amber-600"
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>

            <div className="flex space-x-3 pt-4">
              <button onClick={() => setShowTriage(false)} className="w-1/2 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                Cancelar
              </button>
              <button onClick={evaluateTriage} className="w-1/2 py-2.5 rounded-full bg-rose-500 text-white font-bold text-xs shadow-md">
                Evaluar Síntomas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
