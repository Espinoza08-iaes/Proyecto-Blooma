import React, { useState, useEffect } from 'react';
import { db, type Cycle, type Profile } from '../db/db';
import { Calendar as CalendarIcon, Flame, Heart, AlertCircle, Info, Sparkles, ChevronRight } from 'lucide-react';
import { addDays, format, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import CycleWheel from '../components/CycleWheel';

export default function CycleDashboard() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({
    avgLength: 28,
    stdDev: 0,
    confidence: 'Baja',
  });
  const [nextPeriodDate, setNextPeriodDate] = useState<Date | null>(null);
  const [fertileRange, setFertileRange] = useState<{ start: Date; end: Date } | null>(null);

  // Load cycles and calculate predictions
  useEffect(() => {
    async function loadData() {
      const data = await db.cycles.toArray();
      setCycles(data);
      calculateStats(data);

      const userProfile = await db.profile.get('main');
      if (userProfile) {
        setProfile(userProfile);
      }
    }
    loadData();
  }, []);

  const calculateStats = (cyclesList: Cycle[]) => {
    if (cyclesList.length === 0) {
      // Default fallback
      const today = new Date();
      setNextPeriodDate(addDays(today, 14));
      setFertileRange({ start: addDays(today, 8), end: addDays(today, 13) });
      setStats({ avgLength: 28, stdDev: 0, confidence: 'Baja (Sin registros)' });
      return;
    }

    // Sort by startDate
    const sorted = [...cyclesList].sort((a, b) => a.startDate.localeCompare(b.startDate));
    
    // Calculate durations between consecutive cycles
    const durations: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const prev = parseISO(sorted[i - 1].startDate);
      const curr = parseISO(sorted[i].startDate);
      const diff = differenceInDays(curr, prev);
      if (diff > 15 && diff < 90) { // filter outliers
        durations.push(diff);
      }
    }

    // Also include explicit durations if defined
    sorted.forEach(c => {
      if (c.duration && c.duration > 15 && c.duration < 90) {
        durations.push(c.duration);
      }
    });

    const uniqueDurations = [...new Set(durations)].filter(Boolean);

    if (uniqueDurations.length === 0) {
      // Pre-seeded onboarding cycle
      const lastCycle = sorted[sorted.length - 1];
      const start = parseISO(lastCycle.startDate);
      const next = addDays(start, 28);
      setNextPeriodDate(next);
      setFertileRange({ start: addDays(next, -16), end: addDays(next, -11) });
      setStats({ avgLength: 28, stdDev: 0, confidence: 'Baja (Pocos datos)' });
      return;
    }

    // Median calculation
    uniqueDurations.sort((a, b) => a - b);
    const mid = Math.floor(uniqueDurations.length / 2);
    const median = uniqueDurations.length % 2 !== 0 
      ? uniqueDurations[mid] 
      : (uniqueDurations[mid - 1] + uniqueDurations[mid]) / 2;

    // Standard deviation
    const avg = uniqueDurations.reduce((a, b) => a + b, 0) / uniqueDurations.length;
    const sqDiffs = uniqueDurations.map(d => Math.pow(d - avg, 2));
    const variance = sqDiffs.reduce((a, b) => a + b, 0) / sqDiffs.length;
    const stdDev = Math.sqrt(variance);

    // Confidence Level
    let confidence = 'Alta';
    if (uniqueDurations.length < 3) {
      confidence = 'Baja (Registros insuficientes)';
    } else if (stdDev > 5) {
      confidence = 'Media-Baja (Ciclo muy irregular)';
    } else if (stdDev > 3) {
      confidence = 'Media';
    }

    setStats({
      avgLength: Math.round(median),
      stdDev: Math.round(stdDev * 10) / 10,
      confidence
    });

    const lastCycle = sorted[sorted.length - 1];
    const lastStart = parseISO(lastCycle.startDate);
    const nextPeriod = addDays(lastStart, Math.round(median));
    setNextPeriodDate(nextPeriod);

    // Fertile window: Ovulation is approx nextPeriod - 14 days
    // Fertile window is approx 5 days before ovulation and day of ovulation
    const ovulation = addDays(nextPeriod, -14);
    setFertileRange({
      start: addDays(ovulation, -5),
      end: ovulation
    });
  };

  // Helper to check what kind of day it is
  const getDayStatus = (d: Date) => {
    const formatted = format(d, 'yyyy-MM-dd');
    
    // Check if period day
    const isPeriod = cycles.some(c => {
      if (!c.endDate) return c.startDate === formatted;
      return formatted >= c.startDate && formatted <= c.endDate;
    });
    if (isPeriod) return 'period';

    // Check if predicted period day
    if (nextPeriodDate) {
      const predStart = format(nextPeriodDate, 'yyyy-MM-dd');
      const predEnd = format(addDays(nextPeriodDate, 5), 'yyyy-MM-dd');
      if (formatted >= predStart && formatted <= predEnd) return 'predicted-period';
    }

    // Check if fertile day
    if (fertileRange) {
      const startStr = format(fertileRange.start, 'yyyy-MM-dd');
      const endStr = format(fertileRange.end, 'yyyy-MM-dd');
      if (formatted >= startStr && formatted <= endStr) return 'fertile';
    }

    return 'normal';
  };

  // Generate calendar days for current month
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7; // Monday-first
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays: Date[] = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarDays.push(new Date(year, month, -startDayOffset + i + 1));
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }
  // fill grid of 35 or 42
  const totalCells = calendarDays.length <= 35 ? 35 : 42;
  const remaining = totalCells - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push(new Date(year, month + 1, i));
  }

  // Calculate current cycle day details for the CycleWheel
  const sortedCycles = [...cycles].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const lastCycle = sortedCycles[sortedCycles.length - 1];

  let currentDay = 15; // default center of cycle
  let isDelayed = false;
  let delayDays = 0;
  let periodDuration = 5;
  let fertileStartDay = 10;
  let fertileEndDay = 15;

  if (lastCycle) {
    const lastStart = parseISO(lastCycle.startDate);
    const dStart = new Date(lastStart.getFullYear(), lastStart.getMonth(), lastStart.getDate());
    const dToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = differenceInDays(dToday, dStart);
    currentDay = diffDays + 1;

    if (lastCycle.endDate) {
      periodDuration = differenceInDays(parseISO(lastCycle.endDate), lastStart) + 1;
    } else if (lastCycle.duration) {
      periodDuration = lastCycle.duration;
    }

    if (currentDay > stats.avgLength) {
      isDelayed = true;
      delayDays = currentDay - stats.avgLength;
    }

    fertileStartDay = Math.max(1, stats.avgLength - 19);
    fertileEndDay = Math.max(1, stats.avgLength - 14);
  }

  return (
    <div className="max-w-4xl mx-auto px-2 py-4 space-y-6">
      
      {/* HERO SECTION WITH CYCLE WHEEL & SUMMARY CARD */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* LEFT COLUMN: THE GORGEOUS INTERACTIVE WHEEL */}
        <div className="md:col-span-5 flex justify-center py-2 animate-pop-in">
          <CycleWheel
            currentDay={currentDay}
            avgLength={stats.avgLength}
            periodDuration={periodDuration}
            fertileStartDay={fertileStartDay}
            fertileEndDay={fertileEndDay}
            isDelayed={isDelayed}
            delayDays={delayDays}
            themeColor={profile?.themeColor || 'earth'}
          />
        </div>

        {/* RIGHT COLUMN: PREDICTION DATA CARD */}
        <div className="md:col-span-7 space-y-4 animate-fade-in-up delay-75">
          <div className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 relative overflow-hidden card-hover">
            <div className="absolute top-0 right-0 bg-brand-teal-500/10 h-32 w-32 rounded-full blur-3xl -z-10" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs bg-brand-teal-100 text-brand-teal-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse-soft">
                  <Sparkles className="h-3.5 w-3.5" />
                  Próxima Predicción
                </span>
                
                <div className="bg-white/80 border border-brand-earth-100 px-3 py-1 rounded-full text-[10px] font-bold text-brand-earth-500 uppercase tracking-wider shadow-sm">
                  Confianza: <span className="text-brand-teal-700 font-extrabold">{stats.confidence}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-brand-earth-900 font-display">
                  {nextPeriodDate 
                    ? format(nextPeriodDate, "eeee, d 'de' MMMM", { locale: es }) 
                    : 'Cargando...'}
                </h2>
                <p className="text-xs text-brand-earth-650 font-medium">
                  Período estimado basado en tu duración media de <span className="font-bold text-brand-teal-700">{stats.avgLength} días</span>.
                </p>
              </div>

              {stats.stdDev > 0 && (
                <div className="text-[11px] text-brand-earth-500 flex items-center gap-1">
                  <span>Regularidad:</span>
                  <span className="font-bold bg-brand-earth-100 text-brand-earth-700 px-2 py-0.5 rounded">Desviación de ±{stats.stdDev} días</span>
                </div>
              )}
            </div>

            {stats.confidence.includes('Baja') && (
              <div className="mt-4 flex items-start gap-2 text-xs bg-brand-sand-100 text-brand-earth-700 p-3 rounded-xl border border-brand-earth-150/50">
                <AlertCircle className="h-4 w-4 text-brand-earth-600 flex-shrink-0 mt-0.5" />
                <p className="leading-normal">
                  <strong>Nota de Precisión:</strong> Para darte predicciones personalizadas y confiables necesitamos que registres al menos 3 ciclos. El sistema por ahora calcula según tus datos iniciales.
                </p>
              </div>
            )}
          </div>

          {/* QUICK BIOLOGICAL INFO */}
          <div className="glass rounded-3xl p-5 border border-brand-earth-100 flex items-start gap-4 card-hover">
            <div className="bg-brand-teal-50 h-10 w-10 rounded-xl flex items-center justify-center text-brand-teal-600 flex-shrink-0">
              <Info className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-brand-earth-900 text-sm">Fisiología del Ciclo</h4>
              <p className="text-xs text-brand-earth-600 leading-relaxed">
                Durante la fase fértil, tu estrógeno aumenta, lo que suele otorgarte mayor energía y resistencia física. Es un momento idóneo para actividades de alta intensidad y socialización.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* CALENDARIO */}
      <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4 animate-fade-in-up delay-150">
        <div className="flex items-center justify-between border-b border-brand-earth-100 pb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-brand-teal-600" />
            <h3 className="font-extrabold text-brand-earth-900 capitalize font-display">
              {format(today, 'MMMM yyyy', { locale: es })}
            </h3>
          </div>
          <span className="text-[11px] bg-brand-earth-100 text-brand-earth-700 px-3 py-1 rounded-full font-bold">
            Hoy: {format(today, 'd/MM/yy')}
          </span>
        </div>

        {/* Grid Calendario */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {/* Días de la semana */}
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
            <span key={idx} className="text-xs font-bold text-brand-earth-500 py-1 uppercase tracking-wider">
              {day}
            </span>
          ))}

          {/* Días del mes */}
          {calendarDays.map((dateItem, idx) => {
            const status = getDayStatus(dateItem);
            const isCurrentMonth = dateItem.getMonth() === month;
            const isToday = format(dateItem, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
            
            let bgClass = 'hover:bg-brand-earth-100/50 active-press cursor-pointer';
            let textClass = isCurrentMonth ? 'text-brand-earth-900 font-medium' : 'text-brand-earth-400';
            
            if (status === 'period') {
              bgClass = 'bg-brand-coral-500 text-white font-bold shadow-sm active-press cursor-pointer';
            } else if (status === 'predicted-period') {
              bgClass = 'bg-brand-coral-100 text-brand-coral-800 font-bold border border-dashed border-brand-coral-300 active-press cursor-pointer';
            } else if (status === 'fertile') {
              bgClass = 'bg-brand-teal-100 text-brand-teal-900 font-bold border border-brand-teal-200 active-press cursor-pointer';
            }

            return (
              <div
                key={idx}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-xs transition-all ${bgClass} ${textClass}`}
              >
                <span className="font-semibold">{dateItem.getDate()}</span>
                {isToday && (
                  <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${status === 'period' ? 'bg-white' : 'bg-brand-teal-600'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 pt-3 border-t border-brand-earth-100 text-xs justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-brand-coral-500 rounded-md block shadow-sm" />
            <span className="text-brand-earth-700 font-medium">Período registrado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-brand-coral-100 border border-dashed border-brand-coral-300 rounded-md block" />
            <span className="text-brand-earth-700 font-medium">Período estimado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 bg-brand-teal-100 border border-brand-teal-200 rounded-md block" />
            <span className="text-brand-earth-700 font-medium">Ventana fértil</span>
          </div>
        </div>
      </section>

    </div>
  );
}
