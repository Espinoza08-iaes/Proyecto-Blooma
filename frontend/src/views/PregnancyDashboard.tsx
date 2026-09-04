import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db, type TriageRecord, type MaternalHouse, type Profile, type DailyLog } from '../db/db';
import { Heart, Activity, AlertOctagon, Phone, Info, Check, ShieldAlert, Sparkles, MapPin, Search, Baby, Clock, X, Building2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import HeroDial from '../components/HeroDial';
import FloatingActionDock from '../components/FloatingActionDock';
import MetricSummaryCard from '../components/MetricSummaryCard';
import MedicalGuidelineCard from '../components/MedicalGuidelineCard';
import WearableSyncCard from '../components/WearableSyncCard';
import WearableTelemetryModal from '../components/WearableTelemetryModal';
import SymptomLoggingSheet from '../components/SymptomLoggingSheet';
import KickCounter from '../components/KickCounter';
import ContractionTimer from '../components/ContractionTimer';
import HospitalBag from '../components/HospitalBag';
import { getPregnancyMilestone } from '../services/pregnancyService';
import { useTranslation } from '../i18n/useTranslation';
import { calculateDistanceKm, formatDistance, NICARAGUA_DEPARTMENTS } from '../services/locationService';

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

interface PregnancyDashboardProps {
  profile: Profile | null;
  onOpenDrawer?: () => void;
  onOpenCalendar?: () => void;
}

export default function PregnancyDashboard({ profile, onOpenDrawer, onOpenCalendar }: PregnancyDashboardProps) {
  const { t } = useTranslation(profile);
  const [gestationWeeks, setGestationWeeks] = useState(18);
  const [gestationDays, setGestationDays] = useState(1);
  const [selectedDept, setSelectedDept] = useState('Todos');
  const [selectedType, setSelectedType] = useState<'all' | 'casa_materna' | 'hospital'>('all');
  const [houses, setHouses] = useState<MaternalHouse[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  
  // Triage modal state
  const [showTriage, setShowTriage] = useState(false);
  const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);
  const [triageResult, setTriageResult] = useState<TriageRecord | null>(null);

  // Active sub-tool modals
  const [activeTool, setActiveTool] = useState<'none' | 'kicks' | 'contractions' | 'bag'>('none');
  const [isWearableModalOpen, setIsWearableModalOpen] = useState(false);
  const [isSymptomSheetOpen, setIsSymptomSheetOpen] = useState(false);

  // Daily log state for symptoms sheet
  const [selectedLogDate, setSelectedLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeLog, setActiveLog] = useState<DailyLog | undefined>(undefined);

  // Lock body scroll when any modal in pregnancy is active
  useEffect(() => {
    const isAnyModalOpen = showTriage || activeTool !== 'none' || isWearableModalOpen || isSymptomSheetOpen;
    if (isAnyModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showTriage, activeTool, isWearableModalOpen, isSymptomSheetOpen]);

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
  }, [profile]);

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

  // Coordenadas base de la usuaria (GPS o capital de departamento)
  const userLat = profile?.latitude || NICARAGUA_DEPARTMENTS.find(d => d.name === (profile?.department || 'Managua'))?.capitalCoords.latitude || 12.1364;
  const userLng = profile?.longitude || NICARAGUA_DEPARTMENTS.find(d => d.name === (profile?.department || 'Managua'))?.capitalCoords.longitude || -86.2514;

  const housesWithDistance = houses.map(h => ({
    ...h,
    distanceKm: calculateDistanceKm(userLat, userLng, h.latitude, h.longitude)
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  const filteredHouses = housesWithDistance.filter(h => {
    const matchesDept = selectedDept === 'Todos' || h.department === selectedDept;
    const matchesType = selectedType === 'all' || h.type === selectedType;
    return matchesDept && matchesType;
  });

  const assignedHouse = housesWithDistance.find(h => h.id === profile?.assignedFacilityId);
  const nearestMaternalHouse = assignedHouse || housesWithDistance.find(h => h.type === 'casa_materna') || housesWithDistance[0] || null;

  const milestone = getPregnancyMilestone(gestationWeeks);
  const today = new Date();

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative min-h-screen bg-gradient-to-b from-amber-50/50 via-rose-50/20 to-slate-50">
      
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
        profile={profile}
        gestationWeek={gestationWeeks}
        gestationDay={gestationDays}
        onViewPregnancyDetails={() => setActiveTool('bag')}
      />

      {/* Floating 3-Button Action Dock */}
      <FloatingActionDock
        stage="pregnancy"
        profile={profile}
        onLogPeriod={() => setActiveTool('kicks')}
        onLogSymptoms={() => setIsSymptomSheetOpen(true)}
        onWearableSync={() => setIsWearableModalOpen(true)}
      />

      {/* Telemetry Sync Card */}
      <WearableSyncCard />

      {/* ALERTA PREVENTIVA MINSA: SEMANA 32 (8° MES) */}
      {gestationWeeks >= 32 && (
        <div className="rounded-3xl p-6 bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white shadow-xl space-y-4 border border-amber-200/50 animate-pop-in">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black tracking-wider uppercase">
              MINSA • {t.obstetricAlerts.maternalHouse.toUpperCase()} (SEMANA {gestationWeeks})
            </span>
            <span className="text-2xl">🏡</span>
          </div>

          <div>
            <h3 className="text-lg font-black tracking-tight leading-snug">
              {t.obstetricAlerts.week32Notice}
            </h3>
            <p className="text-xs text-amber-50/90 leading-relaxed mt-1">
              {t.obstetricAlerts.week32Desc}
            </p>
          </div>

          {nearestMaternalHouse && (
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-amber-200 block">
                    {profile?.assignedFacilityId === nearestMaternalHouse.id ? 'Tu Casa Materna Asignada' : 'Casa Materna Más Cercana'} ({nearestMaternalHouse.department}):
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-[9px] font-black">
                    📍 {formatDistance(nearestMaternalHouse.distanceKm)}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-white">{nearestMaternalHouse.name}</h4>
                <span className="text-[11px] text-amber-100 flex items-center mt-0.5">
                  <MapPin className="w-3 h-3 mr-1 inline shrink-0" />
                  {nearestMaternalHouse.address} • {nearestMaternalHouse.silais}
                </span>
              </div>

              {nearestMaternalHouse.phone && (
                <a
                  href={`tel:${nearestMaternalHouse.phone}`}
                  className="px-4 py-2.5 rounded-full bg-white text-rose-600 font-extrabold text-xs shadow-md hover:bg-amber-50 transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.obstetricAlerts.callMaternalHouse}</span>
                </a>
              )}
            </div>
          )}

          {/* Guaranteed Rights Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px] font-bold text-white/90">
            <div className="p-2 rounded-xl bg-white/10 flex items-center space-x-1.5">
              <span>✨</span>
              <span>Alojamiento y comida gratuita</span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 flex items-center space-x-1.5">
              <span>👩‍👧</span>
              <span>Acompañamiento familiar o partera</span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 flex items-center space-x-1.5">
              <span>🏥</span>
              <span>Monitoreo prenatal 24/7</span>
            </div>
          </div>
        </div>
      )}

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
          title="Red MINSA Próxima"
          value={filteredHouses.length}
          unit="centros"
          statusBadge="REGULAR"
          infoTooltip="Casas Maternas y Hospitales georreferenciados ordenados por proximidad."
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

      {/* Directory of Casas Maternas & Hospitales MINSA (Georreferenciado) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Red Territorial de Salud MINSA</h3>
            <p className="text-xs text-slate-500">Establecimientos georreferenciados ordenados por cercanía a tu ubicación.</p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as any)}
              className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700 border-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
            >
              <option value="all">Todos los Tipos</option>
              <option value="casa_materna">🏡 Casas Maternas</option>
              <option value="hospital">🏥 Hospitales (Quirófano)</option>
            </select>

            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700 border-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {filteredHouses.map(h => (
            <div key={h.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-base">{h.type === 'hospital' ? '🏥' : '🏡'}</span>
                  <h4 className="text-xs font-extrabold text-slate-900">{h.name}</h4>
                </div>
                
                <span className="text-[10px] font-medium text-slate-500 flex items-center">
                  <MapPin className="w-3 h-3 text-rose-500 mr-1 inline shrink-0" />
                  {h.municipality}, {h.department} • <strong className="ml-1 text-slate-700">{h.silais}</strong>
                </span>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[9px]">
                    📍 {formatDistance(h.distanceKm)}
                  </span>
                  {h.hasObstetricSurgery && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[9px]">
                      ✂️ Quirófano / Cesárea 24h
                    </span>
                  )}
                  {h.hasAmbulance && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-[9px]">
                      🚑 Ambulancia
                    </span>
                  )}
                </div>
              </div>

              {h.phone && (
                <a
                  href={`tel:${h.phone}`}
                  className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-xs hover:bg-emerald-600 transition-colors shrink-0 ml-3 cursor-pointer"
                  title="Llamar a este establecimiento"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PORTALIZED MODALS */}

      {/* 1. Kick Counter Modal */}
      {activeTool === 'kicks' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overscroll-contain">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
              <h3 className="font-extrabold text-slate-900 text-base">Contador de Pataditas Fetales</h3>
              <button
                type="button"
                onClick={() => setActiveTool('none')}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <KickCounter />
          </div>
        </div>,
        document.body
      )}

      {/* 2. Contraction Timer Modal */}
      {activeTool === 'contractions' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overscroll-contain">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
              <h3 className="font-extrabold text-slate-900 text-base">Cronómetro de Contracciones</h3>
              <button
                type="button"
                onClick={() => setActiveTool('none')}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ContractionTimer />
          </div>
        </div>,
        document.body
      )}

      {/* 3. Hospital Bag Modal */}
      {activeTool === 'bag' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overscroll-contain">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
              <h3 className="font-extrabold text-slate-900 text-base">Maleta Hospitalaria MINSA</h3>
              <button
                type="button"
                onClick={() => setActiveTool('none')}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <HospitalBag />
          </div>
        </div>,
        document.body
      )}

      {/* 4. Emergency Triage Modal */}
      {showTriage && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overscroll-contain">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">{t.obstetricAlerts.dangerSignsTitle}</h3>
                <p className="text-[11px] text-slate-500">{t.obstetricAlerts.dangerSignsSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTriage(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-600 block uppercase">Signos de Urgencia Roja</span>
              {urgentSymptoms.map(s => (
                <label key={s.id} className="flex items-center space-x-2 text-xs text-slate-800 p-2.5 rounded-xl bg-rose-50 border border-rose-100 cursor-pointer hover:bg-rose-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={checkedSymptoms.includes(s.id)}
                    onChange={() => handleCheckboxChange(s.id)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-600 block uppercase">Signos de Vigilancia Amarilla</span>
              {watchSymptoms.map(s => (
                <label key={s.id} className="flex items-center space-x-2 text-xs text-slate-800 p-2.5 rounded-xl bg-amber-50 border border-amber-100 cursor-pointer hover:bg-amber-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={checkedSymptoms.includes(s.id)}
                    onChange={() => handleCheckboxChange(s.id)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>

            {triageResult && (
              <div className={`p-4 rounded-2xl text-xs font-bold ${
                triageResult.classification === 'urgente'
                  ? 'bg-rose-600 text-white'
                  : triageResult.classification === 'vigilar'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {triageResult.classification === 'urgente' && '🚨 URGENTE: Acude de inmediato al centro de salud o Casa Materna más cercana.'}
                {triageResult.classification === 'vigilar' && '⚠️ VIGILAR: Programa una consulta con tu médico en las próximas 24 horas.'}
                {triageResult.classification === 'normal' && '✅ NORMAL: No se detectan signos de alarma. Continúa con tus controles prenatales regulares.'}
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowTriage(false)}
                className="w-1/2 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={evaluateTriage}
                className="w-1/2 py-2.5 rounded-full bg-rose-500 text-white font-bold text-xs shadow-md hover:bg-rose-600 transition-colors cursor-pointer"
              >
                Evaluar Síntomas
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 5. Smartwatch & Smart Ring Telemetry Modal */}
      <WearableTelemetryModal
        isOpen={isWearableModalOpen}
        onClose={() => setIsWearableModalOpen(false)}
        stage="pregnancy"
      />

      {/* 6. Daily Symptom Logging Sheet */}
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
