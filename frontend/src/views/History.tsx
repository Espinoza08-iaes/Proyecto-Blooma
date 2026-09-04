import React, { useState, useEffect } from 'react';
import { db, type Profile, type Cycle, type DailyLog, type TriageRecord, type KickSession, type ContractionLog, type HotFlashLog } from '../db/db';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, BarChart2, ShieldAlert, Sparkles, Heart, Activity, Shield, Flame, Timer, ChevronRight, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

import DottedTimelineBar from '../components/DottedTimelineBar';

import { useTranslation } from '../i18n/useTranslation';

interface HistoryProps {
  stage: 'cycle' | 'pregnancy' | 'menopause';
  profile?: Profile | null;
}

export default function History({ stage: initialStage, profile }: HistoryProps) {
  const { t } = useTranslation(profile);
  const [activeStage, setActiveStage] = useState<'cycle' | 'pregnancy' | 'menopause'>(initialStage);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [triageRecords, setTriageRecords] = useState<TriageRecord[]>([]);
  const [kickSessions, setKickSessions] = useState<KickSession[]>([]);
  const [contractionLogs, setContractionLogs] = useState<ContractionLog[]>([]);
  const [hotFlashLogs, setHotFlashLogs] = useState<HotFlashLog[]>([]);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  useEffect(() => {
    setActiveStage(initialStage);
  }, [initialStage]);

  useEffect(() => {
    async function loadData() {
      const c = await db.cycles.toArray();
      setCycles(c.sort((a, b) => a.startDate.localeCompare(b.startDate)));

      const l = await db.dailyLogs.toArray();
      setDailyLogs(l.sort((a, b) => a.date.localeCompare(b.date)));

      const t = await db.triageRecords.toArray();
      setTriageRecords(t.sort((a, b) => b.date.localeCompare(a.date)));

      const k = await db.kickSessions.orderBy('id').reverse().toArray();
      setKickSessions(k);

      const cont = await db.contractionLogs.orderBy('id').reverse().toArray();
      setContractionLogs(cont);

      const h = await db.hotFlashLogs.orderBy('id').reverse().toArray();
      setHotFlashLogs(h);
    }
    loadData();
  }, []);

  const chartCycleData = cycles.map((c, i) => ({
    name: `Ciclo ${i + 1}`,
    duracion: c.duration || 28,
    fecha: format(parseISO(c.startDate), 'MMM d, yyyy', { locale: es }),
  }));

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      
      {/* Stage Selector Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveStage('cycle')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeStage === 'cycle'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Bitácora Ciclo</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStage('pregnancy')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeStage === 'pregnancy'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Bitácora Embarazo</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveStage('menopause')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
            activeStage === 'menopause'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Bitácora Menopausia</span>
        </button>
      </div>

      {/* STAGE: CYCLE HISTORY */}
      {activeStage === 'cycle' && (
        <div className="space-y-6">
          
          {/* Current Active Cycle & Dotted Timeline Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Ciclo Actual</span>
                <h3 className="text-xl font-black text-slate-900">46 días acumulados</h3>
                <span className="text-xs text-slate-500">Inicio de período: 10 de junio</span>
              </div>
              <button
                onClick={() => setIsCalendarModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center space-x-1 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>Ver Calendario</span>
              </button>
            </div>

            {/* Dotted Timeline Bar */}
            <DottedTimelineBar
              totalDays={46}
              periodDays={5}
              fertileStart={11}
              fertileEnd={18}
              currentDay={25}
            />
          </div>

          {/* Cycles Area Chart */}
          {cycles.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Tendencia de Duración de Ciclos (días)
                </h3>
              </div>

              <div className="h-48 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartCycleData}>
                    <defs>
                      <linearGradient id="colorDuracion" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E85B75" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#E85B75" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} domain={[15, 45]} tickLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="duracion" stroke="#E85B75" strokeWidth={3} fillOpacity={1} fill="url(#colorDuracion)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Historical List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Historial de Registros</h3>
            {cycles.map((c, idx) => (
              <div key={c.id || idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Ciclo del {format(parseISO(c.startDate), 'd MMMM, yyyy', { locale: es })}
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Duración: {c.duration || 28} días
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  ✓ REGISTRADO
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* STAGE: PREGNANCY HISTORY */}
      {activeStage === 'pregnancy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Registros de Triaje Obstétrico</h3>
            {triageRecords.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No hay evaluaciones de triaje registradas aún.</p>
            ) : (
              triageRecords.map(r => (
                <div key={r.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Semana {r.gestationWeek} • {r.date}</h4>
                    <span className="text-[10px] text-slate-500">{r.symptoms.length} síntomas reportados</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    r.classification === 'urgente'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : r.classification === 'vigilar'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {r.classification}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* STAGE: MENOPAUSE HISTORY */}
      {activeStage === 'menopause' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Historial de Sofocos e Incomodidad Térmica</h3>
            {hotFlashLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No hay eventos de sofocos registrados hoy.</p>
            ) : (
              hotFlashLogs.map(h => (
                <div key={h.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Sofoco {h.intensity}</h4>
                    <span className="text-[10px] text-slate-500">{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold uppercase">
                    {h.intensity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Full Month Calendar Modal (Color-Coded) */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-slate-900">Calendario del Ciclo</h3>
              <button onClick={() => setIsCalendarModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 text-center border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Junio - Julio 2026</span>
              <div className="grid grid-cols-7 gap-1 text-[11px] font-bold text-slate-400 mb-2">
                <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                  <div
                    key={day}
                    className={`h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      day >= 10 && day <= 14
                        ? 'bg-rose-500 text-white' // Period
                        : day >= 19 && day <= 24
                        ? 'text-teal-600 font-black' // Fertile
                        : day === 25
                        ? 'border-2 border-dashed border-teal-500 text-slate-900 font-extrabold' // Today
                        : 'text-slate-600'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsCalendarModalOpen(false)}
              className="w-full py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs"
            >
              Cerrar Calendario
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
