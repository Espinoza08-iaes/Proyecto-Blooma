import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import { Sparkles, AlertTriangle, Moon, Lightbulb, CheckCircle2, HeartPulse, BrainCircuit } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface Insight {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: string;
  title: string;
  message: string;
  suggestion: string;
}

export default function SmartHealthInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCloud, setIsCloud] = useState(false);

  useEffect(() => {
    async function getInsights() {
      setLoading(true);
      const token = localStorage.getItem('blooma_auth_token');

      // 1. TRY CLOUD ENGINE FIRST
      if (token) {
        try {
          const res = await fetch('/api/insights', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.insights && data.insights.length > 0) {
              setInsights(data.insights);
              setIsCloud(true);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Could not reach cloud insights engine, running edge engine:', err);
        }
      }

      // 2. EDGE ENGINE FALLBACK (Local Client-Side AI)
      try {
        const localCycles = await db.cycles.toArray();
        const localDailyLogs = await db.dailyLogs.toArray();
        const localTriage = await db.triageRecords.toArray();
        
        const computedInsights: Insight[] = [];

        // A. Cycle Irregularity Check
        if (localCycles.length >= 3) {
          const sorted = [...localCycles].sort((a, b) => a.startDate.localeCompare(b.startDate));
          const durations: number[] = [];
          
          for (let i = 1; i < sorted.length; i++) {
            const prev = parseISO(sorted[i - 1].startDate);
            const curr = parseISO(sorted[i].startDate);
            const diff = differenceInDays(curr, prev);
            if (diff > 15 && diff < 90) {
              durations.push(diff);
            }
          }

          if (durations.length >= 2) {
            const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
            const sqDiffs = durations.map(d => Math.pow(d - avg, 2));
            const variance = sqDiffs.reduce((a, b) => a + b, 0) / sqDiffs.length;
            const stdDev = Math.sqrt(variance);

            if (stdDev > 4.5) {
              computedInsights.push({
                id: 'cycle_irregularity',
                type: 'warning',
                category: 'Ciclo',
                title: 'Variabilidad de Ciclo Detectada (Edge AI)',
                message: `Tus registros muestran variaciones notables en la duración de tus ciclos (desviación de ±${Math.round(stdDev * 10) / 10} días). Aunque fluctuaciones ocasionales son comunes debido al estrés o alimentación, una variación continua amerita evaluación médica para descartar anomalías como el SOP.`,
                suggestion: 'Te sugerimos mantener un registro detallado del inicio del flujo menstrual para afinar la precisión.'
              });
            } else {
              computedInsights.push({
                id: 'cycle_regularity',
                type: 'success',
                category: 'Ciclo',
                title: 'Estabilidad de Ciclo Optima (Edge AI)',
                message: `Tus ciclos demuestran una excelente consistencia con una desviación estándar de apenas ±${Math.round(stdDev * 10) / 10} días. Esto refleja un ritmo biológico saludable y un perfil hormonal equilibrado.`,
                suggestion: 'Continúa registrando tus síntomas diarios para vigilar cambios en tus fases.'
              });
            }
          }
        }

        // B. Anxiety & Sleep Pattern Analysis
        const recentLogs = [...localDailyLogs]
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 7);

        if (recentLogs.length >= 3) {
          const poorSleepCount = recentLogs.filter(l => l.sleepQuality === 'poor').length;
          const highAnxietyCount = recentLogs.filter(l => l.anxietyLevel && l.anxietyLevel >= 6).length;

          if (poorSleepCount >= 2 && highAnxietyCount >= 2) {
            computedInsights.push({
              id: 'stress_sleep_link',
              type: 'info',
              category: 'Bienestar',
              title: 'Patrón de Ansiedad e Insomnio',
              message: 'El motor local detectó una coincidencia en tu diario: días con altos niveles de ansiedad seguidos de baja calidad de sueño. La elevación de cortisol inhibe la transición al sueño profundo y reparador.',
              suggestion: 'Te recomendamos probar respiraciones guiadas (4-7-8) o limitar la luz azul de pantallas 45 minutos antes de dormir.'
            });
          }
        }

        // C. Obstetric Hazard Triage Check
        if (localTriage.length > 0) {
          const urgentRecords = [...localTriage]
            .filter(t => t.classification === 'urgente' || t.classification === 'vigilar')
            .sort((a, b) => b.date.localeCompare(a.date));

          if (urgentRecords.length > 0) {
            const latestUrgent = urgentRecords[0];
            if (latestUrgent.classification === 'urgente') {
              computedInsights.push({
                id: 'preeclampsia_risk',
                type: 'critical',
                category: 'Obstetricia',
                title: 'Alerta Obstétrica Urgente',
                message: `Tu triaje prenatal del ${latestUrgent.date} muestra signos de alerta importantes. Si tienes dolor de cabeza severo, visión borrosa, zumbidos o dolor estomacal agudo, son síntomas asociados a riesgo de Preeclampsia.`,
                suggestion: 'Busca asistencia médica de urgencia de inmediato o dirígete a la Casa Materna más cercana.'
              });
            } else if (latestUrgent.classification === 'vigilar') {
              computedInsights.push({
                id: 'maternal_watch',
                type: 'warning',
                category: 'Obstetricia',
                title: 'Monitoreo de Signos Gestacionales',
                message: `El triaje clasificado como VIGILAR requiere un seguimiento continuo de tu presión arterial y reposo adecuado.`,
                suggestion: 'Descansa en decúbito lateral izquierdo y programa una revisión prenatal preventiva.'
              });
            }
          }
        }

        // D. Climateric Hot Flashes Check
        const hotFlashesSum = localDailyLogs
          .filter(l => l.hotFlashes !== undefined)
          .slice(0, 14)
          .reduce((acc, curr) => acc + (curr.hotFlashes || 0), 0);

        if (hotFlashesSum >= 15) {
          computedInsights.push({
            id: 'menopause_hot_flashes',
            type: 'info',
            category: 'Menopausia',
            title: 'Sofocos en Aumento',
            message: 'Tus registros indican sofocos repetidos durante las últimas dos semanas, vinculados a la fluctuación estrogénica sobre el termostato cerebral.',
            suggestion: 'Evita condimentos picantes y café por la noche. Usa sábanas ligeras y transpirables.'
          });
        }

        if (computedInsights.length === 0) {
          computedInsights.push({
            id: 'general_welcome',
            type: 'info',
            category: 'General',
            title: 'Calibración de Análisis Activo',
            message: 'Blooma está procesando tus bitácoras de síntomas en segundo plano. A medida que completes tus registros, nuestro motor de datos detectará patrones fisiológicos automáticamente.',
            suggestion: 'Registra diariamente tu estado de ánimo, dolor o flujo para comenzar a recibir métricas.'
          });
        }

        setInsights(computedInsights);
        setIsCloud(false);
      } catch (err) {
        console.error('Failed to run local intelligence engine:', err);
      }
      setLoading(false);
    }

    getInsights();
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-3xl p-6 border border-brand-earth-100 flex items-center justify-center py-10">
        <div className="flex flex-col items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-brand-teal-500 animate-spin" />
          <span className="text-xs font-bold text-brand-earth-550">Analizando registros de salud...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-brand-teal-650" />
          <h3 className="font-extrabold text-brand-earth-900 font-display text-base">Perspectivas Inteligentes de Salud</h3>
        </div>
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
          isCloud 
            ? 'bg-brand-teal-50 text-brand-teal-700 border-brand-teal-200/30' 
            : 'bg-brand-sand-100 text-brand-earth-700 border-brand-earth-200/20'
        }`}>
          {isCloud ? 'Nube AI' : 'Local AI'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {insights.map((insight) => {
          let cardBorder = 'border-brand-earth-100';
          let iconColor = 'text-brand-teal-500';
          let iconBg = 'bg-brand-teal-50';
          let Icon = Lightbulb;

          if (insight.type === 'critical') {
            cardBorder = 'border-brand-coral-200 bg-brand-coral-50/10';
            iconColor = 'text-brand-coral-600';
            iconBg = 'bg-brand-coral-50';
            Icon = HeartPulse;
          } else if (insight.type === 'warning') {
            cardBorder = 'border-amber-200 bg-amber-50/5';
            iconColor = 'text-amber-600';
            iconBg = 'bg-amber-50';
            Icon = AlertTriangle;
          } else if (insight.type === 'success') {
            cardBorder = 'border-emerald-100';
            iconColor = 'text-emerald-600';
            iconBg = 'bg-emerald-50';
            Icon = CheckCircle2;
          } else if (insight.id === 'stress_sleep_link') {
            Icon = Moon;
            iconBg = 'bg-indigo-50';
            iconColor = 'text-indigo-650';
            cardBorder = 'border-indigo-100';
          }

          return (
            <div 
              key={insight.id} 
              className={`glass rounded-2xl p-5 border ${cardBorder} shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.005] relative overflow-hidden`}
            >
              <div className="flex gap-4 items-start">
                <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} flex-shrink-0 mt-0.5`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-earth-550">
                      {insight.category}
                    </span>
                  </div>
                  
                  <h4 className="font-extrabold text-sm text-brand-earth-900 leading-tight">
                    {insight.title}
                  </h4>
                  
                  <p className="text-xs text-brand-earth-650 leading-relaxed font-medium">
                    {insight.message}
                  </p>
                  
                  {insight.suggestion && (
                    <div className="mt-2.5 pt-2 border-t border-brand-earth-100/50 flex gap-1.5 items-start text-[11px] text-brand-earth-600 font-semibold">
                      <Sparkles className="h-3.5 w-3.5 text-brand-teal-500 flex-shrink-0 mt-0.5" />
                      <span>{insight.suggestion}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
