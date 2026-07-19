import React, { useState, useEffect } from 'react';
import { db, type Cycle, type DailyLog, type TriageRecord } from '../db/db';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, BarChart2, ShieldAlert, Sparkles, Heart, Activity } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface HistoryProps {
  stage: 'cycle' | 'pregnancy' | 'menopause';
}

export default function History({ stage }: HistoryProps) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [triageRecords, setTriageRecords] = useState<TriageRecord[]>([]);

  useEffect(() => {
    async function loadData() {
      const c = await db.cycles.toArray();
      setCycles(c.sort((a, b) => a.startDate.localeCompare(b.startDate)));

      const l = await db.dailyLogs.toArray();
      setDailyLogs(l.sort((a, b) => a.date.localeCompare(b.date)));

      const t = await db.triageRecords.toArray();
      setTriageRecords(t.sort((a, b) => b.date.localeCompare(a.date))); // Newest first
    }
    loadData();
  }, []);

  // Format cycle data for Recharts
  const chartCycleData = cycles.map((c, i) => ({
    name: `Ciclo ${i + 1}`,
    duracion: c.duration || 28,
    fecha: format(parseISO(c.startDate), 'MMM d, yyyy', { locale: es }),
  }));

  // Format menopause data for Recharts
  const chartMenoData = dailyLogs
    .filter(l => l.hotFlashes !== undefined || l.anxietyLevel !== undefined)
    .map(l => ({
      fecha: format(parseISO(l.date), 'MMM d', { locale: es }),
      sofocos: l.hotFlashes || 0,
      ansiedad: l.anxietyLevel || 1,
    }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* SECCIÓN CHARTS ADAPTATIVO */}
      {stage === 'cycle' && (
        <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-earth-100 pb-3">
            <BarChart2 className="h-5 w-5 text-brand-teal-600" />
            <h3 className="font-bold text-brand-earth-900">Historial de Duración de Ciclos</h3>
          </div>
          {chartCycleData.length > 0 ? (
            <div className="h-[240px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartCycleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDur" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1e0d6" />
                  <XAxis dataKey="name" stroke="#8c593f" />
                  <YAxis stroke="#8c593f" />
                  <Tooltip contentStyle={{ background: '#faf8f5', borderRadius: '12px', border: '1px solid #e3d5ca' }} />
                  <Area type="monotone" dataKey="duracion" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorDur)" name="Duración (días)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-brand-earth-500 text-center py-12">No hay suficientes ciclos registrados para mostrar gráficas.</p>
          )}
        </section>
      )}

      {stage === 'menopause' && (
        <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-earth-100 pb-3">
            <BarChart2 className="h-5 w-5 text-brand-coral-500" />
            <h3 className="font-bold text-brand-earth-900">Métricas de Síntomas Diarios</h3>
          </div>
          {chartMenoData.length > 0 ? (
            <div className="h-[240px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartMenoData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSof" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1e0d6" />
                  <XAxis dataKey="fecha" stroke="#8c593f" />
                  <YAxis stroke="#8c593f" />
                  <Tooltip contentStyle={{ background: '#faf8f5', borderRadius: '12px', border: '1px solid #e3d5ca' }} />
                  <Area type="monotone" dataKey="sofocos" stroke="#ff6b6b" strokeWidth={2} fillOpacity={1} fill="url(#colorSof)" name="Sofocos registrados" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-brand-earth-500 text-center py-12">No hay suficientes registros de síntomas de menopausia.</p>
          )}
        </section>
      )}

      {/* HISTORIAL DE TRIAJE OBSTETRA */}
      {stage === 'pregnancy' && (
        <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-earth-100 pb-3">
            <ShieldAlert className="h-5 w-5 text-brand-coral-500" />
            <h3 className="font-bold text-brand-earth-900">Registro Histórico de Triajes</h3>
          </div>

          <div className="space-y-3">
            {triageRecords.length > 0 ? (
              triageRecords.map(t => (
                <div
                  key={t.id}
                  className="bg-white/80 border border-brand-earth-100 rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-earth-500 block font-semibold">
                      {format(parseISO(t.date), "eeee, d 'de' MMMM", { locale: es })}
                    </span>
                    <span className="text-xs font-bold text-brand-earth-700 block">
                      Semana {t.gestationWeek} de gestación
                    </span>
                    <p className="text-[11px] text-brand-earth-600 leading-tight">
                      <strong>Síntomas:</strong> {t.symptoms.length > 0 ? t.symptoms.join(', ') : 'Ninguno'}
                    </p>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full flex-shrink-0 border ${
                    t.classification === 'urgente'
                      ? 'bg-brand-coral-50 border-brand-coral-200 text-brand-coral-700'
                      : t.classification === 'vigilar'
                      ? 'bg-brand-earth-50 border-brand-earth-200 text-brand-earth-700'
                      : 'bg-brand-teal-50 border-brand-teal-200 text-brand-teal-700'
                  }`}>
                    {t.classification}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-brand-earth-500 text-center py-8">Aún no has realizado ninguna evaluación de triaje obstétrico.</p>
            )}
          </div>
        </section>
      )}

      {/* DIARIO DE NOTAS Y REGISTROS */}
      <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4">
        <div className="flex items-center gap-2 border-b border-brand-earth-100 pb-3">
          <Calendar className="h-5 w-5 text-brand-teal-600" />
          <h3 className="font-bold text-brand-earth-900">Historial Diario</h3>
        </div>

        <div className="space-y-3">
          {dailyLogs.length > 0 ? (
            dailyLogs.slice().reverse().map(l => (
              <div
                key={l.date}
                className="bg-white/80 border border-brand-earth-100 rounded-2xl p-4 space-y-2 hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-center border-b border-brand-earth-100/50 pb-1.5">
                  <span className="text-xs font-bold text-brand-earth-900">
                    {format(parseISO(l.date), "d 'de' MMMM, yyyy", { locale: es })}
                  </span>
                  {l.mood && (
                    <span className="text-sm" title={`Ánimo: ${l.mood}`}>
                      {l.mood === 'happy' ? '😊' : l.mood === 'calm' ? '😌' : l.mood === 'anxious' ? '😰' : l.mood === 'sad' ? '😢' : l.mood === 'irritable' ? '😠' : '😴'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-earth-700">
                  {l.flow && (
                    <div>
                      <strong className="text-brand-earth-500">Flujo:</strong> <span className="capitalize">{l.flow === 'none' ? 'ninguno' : l.flow === 'light' ? 'leve' : l.flow === 'medium' ? 'medio' : 'fuerte'}</span>
                    </div>
                  )}
                  {l.pain && (
                    <div>
                      <strong className="text-brand-earth-500">Dolor:</strong> <span className="capitalize">{l.pain === 'none' ? 'sin dolor' : l.pain === 'mild' ? 'leve' : l.pain === 'moderate' ? 'medio' : 'fuerte'}</span>
                    </div>
                  )}
                  {l.temperature && (
                    <div>
                      <strong className="text-brand-earth-500">Temperatura:</strong> {l.temperature} °C
                    </div>
                  )}
                  {l.hotFlashes !== undefined && (
                    <div>
                      <strong className="text-brand-earth-500">Sofocos:</strong> {l.hotFlashes} por día
                    </div>
                  )}
                  {l.sleepQuality && (
                    <div>
                      <strong className="text-brand-earth-500">Sueño:</strong> <span className="capitalize">{l.sleepQuality === 'good' ? 'bueno' : l.sleepQuality === 'fair' ? 'regular' : 'malo'}</span>
                    </div>
                  )}
                </div>

                {l.notes && (
                  <p className="text-xs text-brand-earth-650 bg-brand-earth-50/50 p-2.5 rounded-xl border border-brand-earth-100/50 leading-normal italic">
                    "{l.notes}"
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-brand-earth-500 text-center py-8">No has registrado ningún síntoma diario aún.</p>
          )}
        </div>
      </section>

    </div>
  );
}
