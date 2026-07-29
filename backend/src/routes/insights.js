import express from 'express';
import { db } from '../db.js';
import { authMiddleware } from '../auth.js';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Fetch health insights based on historical records
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.userId;
  let userCycles = [];
  let userDailyLogs = [];
  let userTriage = [];

  // --- 1. FETCH DATA (SUPABASE OR LOCAL) ---
  if (supabase) {
    try {
      const { data: dbCycles } = await supabase
        .from('ciclos')
        .select('*')
        .eq('user_id', userId);
      
      const { data: dbDailyLogs } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId);
      
      const { data: dbTriage } = await supabase
        .from('registros_embarazo')
        .select('*')
        .eq('user_id', userId);

      userCycles = dbCycles ? dbCycles.map(c => ({
        startDate: c.start_date,
        endDate: c.end_date,
        duration: c.duration
      })) : [];

      userDailyLogs = dbDailyLogs ? dbDailyLogs.map(l => ({
        date: l.date,
        mood: l.mood,
        flow: l.flow,
        pain: l.pain,
        temperature: l.temperature,
        hotFlashes: l.hot_flashes,
        sleepQuality: l.sleep_quality,
        anxietyLevel: l.anxiety_level,
        notes: l.notes
      })) : [];

      userTriage = dbTriage ? dbTriage.map(t => ({
        date: t.date,
        gestationWeek: t.gestation_week,
        symptoms: t.symptoms,
        classification: t.classification
      })) : [];
    } catch (err) {
      console.error('Supabase fetch error for insights:', err);
      // fallback to local if Supabase fails
    }
  }

  // Fallback to local if data is empty and not supabase or supabase fetch failed
  if (userCycles.length === 0 && userDailyLogs.length === 0 && userTriage.length === 0) {
    try {
      const localCycles = await db.getCycles();
      const localDailyLogs = await db.getDailyLogs();
      const localTriage = await db.getTriageRecords();

      userCycles = localCycles.filter(c => c.userId === userId);
      userDailyLogs = localDailyLogs.filter(l => l.userId === userId);
      userTriage = localTriage.filter(t => t.userId === userId);
    } catch (err) {
      console.error('Local fetch error for insights:', err);
    }
  }

  // --- 2. ANALYZE AND CALCULATE INSIGHTS ---
  const insights = [];

  // A. Cycle Irregularity / Hormonal Anomaly Detection
  if (userCycles.length >= 3) {
    // Sort and calculate lengths
    const sorted = [...userCycles].sort((a, b) => a.startDate.localeCompare(b.startDate));
    const durations = [];
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].startDate);
      const curr = new Date(sorted[i].startDate);
      const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
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
        insights.push({
          id: 'cycle_irregularity',
          type: 'warning',
          category: 'Ciclo',
          title: 'Detección de irregularidad en tu ciclo',
          message: `Tus ciclos muestran una desviación típica alta (±${Math.round(stdDev * 10) / 10} días). Las fluctuaciones son normales debido a factores de estrés, sueño o alimentación, pero si es recurrente, podría ser indicador de condiciones como el Síndrome de Ovario Poliquístico (SOP). Consulta con tu ginecólogo de confianza.`,
          suggestion: 'Intenta registrar la fecha exacta de inicio del sangrado cada mes para afinar las predicciones.'
        });
      } else {
        insights.push({
          id: 'cycle_regularity',
          type: 'success',
          category: 'Ciclo',
          title: 'Ritmo del ciclo saludable',
          message: `¡Excelente regularidad! Tus registros demuestran un ciclo sumamente predecible, con una variación de apenas ±${Math.round(stdDev * 10) / 10} días. Esto sugiere un equilibrio hormonal estable.`,
          suggestion: 'Sigue registrando tus síntomas diarios para monitorear tu bienestar general.'
        });
      }
    }
  }

  // B. Stress & Sleep Interaction Link
  const recentLogs = [...userDailyLogs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7); // analyze last 7 days

  if (recentLogs.length >= 3) {
    const poorSleepCount = recentLogs.filter(l => l.sleepQuality === 'poor').length;
    const highAnxietyCount = recentLogs.filter(l => l.anxietyLevel && l.anxietyLevel >= 6).length;

    if (poorSleepCount >= 2 && highAnxietyCount >= 2) {
      insights.push({
        id: 'stress_sleep_link',
        type: 'info',
        category: 'Bienestar',
        title: 'Correlación de Estrés y Descanso',
        message: 'Hemos detectado que en la última semana has tenido registros simultáneos de sueño deficiente y niveles altos de ansiedad. El aumento de cortisol (hormona del estrés) reduce la melatonina, dificultando conciliar el sueño profundo.',
        suggestion: 'Considera establecer una rutina digital desconectando pantallas 30 minutos antes de dormir, o realiza estiramientos suaves.'
      });
    }
  }

  // C. Preeclampsia / Obstetric Alert Check (Triage Records)
  if (userTriage.length > 0) {
    const urgentRecords = userTriage.filter(
      t => t.classification === 'urgente' || t.classification === 'vigilar'
    );

    if (urgentRecords.length > 0) {
      // Sort to get latest
      urgentRecords.sort((a, b) => b.date.localeCompare(a.date));
      const latestUrgent = urgentRecords[0];

      if (latestUrgent.classification === 'urgente') {
        insights.push({
          id: 'preeclampsia_risk',
          type: 'critical',
          category: 'Obstetricia',
          title: 'Alerta Obstétrica Crítica',
          message: `El registro de triaje del día ${latestUrgent.date} arrojó una clasificación URGENTE debido a síntomas de alarma ingresados. Si experimentas dolor de cabeza severo, zumbido de oídos, visión borrosa o dolor en la boca del estómago, es de carácter vital buscar atención de emergencia.`,
          suggestion: 'Dirígete de inmediato al Hospital o Centro de Salud más cercano. Si te encuentras lejos, contacta con la Casa Materna de tu cabecera departamental.'
        });
      } else if (latestUrgent.classification === 'vigilar') {
        insights.push({
          id: 'maternal_watch',
          type: 'warning',
          category: 'Obstetricia',
          title: 'Signo de Alarma en Observación',
          message: `Tienes un registro de triaje de clasificación VIGILAR. Monitorea tu presión arterial regularmente y mantente alerta ante cualquier cambio abrupto.`,
          suggestion: 'Coordina una consulta prenatal de seguimiento y descansa de costado izquierdo para mejorar el flujo placentario.'
        });
      }
    }
  }

  // D. Menopause Hot Flashes Alert
  if (userDailyLogs.length > 0) {
    const hotFlashesSum = userDailyLogs
      .filter(l => l.hotFlashes !== undefined)
      .slice(0, 14) // past 2 weeks
      .reduce((acc, curr) => acc + (curr.hotFlashes || 0), 0);

    if (hotFlashesSum >= 15) {
      insights.push({
        id: 'menopause_hot_flashes',
        type: 'info',
        category: 'Climaterio',
        title: 'Control de Sofocos',
        message: 'Has registrado una cantidad frecuente de sofocos en las últimas dos semanas. Las variaciones de estrógenos alteran el termostato corporal del hipotálamo, produciendo estas oleadas térmicas transitorias.',
        suggestion: 'Viste prendas de fibras naturales en capas (algodón), disminuye el consumo de cafeína por la tarde y ventila tu dormitorio antes de acostarte.'
      });
    }
  }

  // General fallback message if no specific insights computed yet
  if (insights.length === 0) {
    insights.push({
      id: 'general_welcome',
      type: 'info',
      category: 'Salud',
      title: 'Monitoreo de Bienestar Activo',
      message: 'Blooma está procesando tus registros. A medida que agregues más información en tu diario de síntomas o registres tus ciclos menstruales, nuestro motor generará análisis de salud específicos sobre tus ritmos hormonales y descanso.',
      suggestion: 'Entra a la pestaña "Registrar" para reportar tu flujo, dolor, estado de ánimo o síntomas de hoy.'
    });
  }

  res.json({
    success: true,
    insights,
    analyzedAt: new Date().toISOString()
  });
});

export default router;
