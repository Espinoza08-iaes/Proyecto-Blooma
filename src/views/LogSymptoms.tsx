import React, { useState, useEffect } from 'react';
import { db, type DailyLog } from '../db/db';
import { Smile, AlertCircle, Calendar, Thermometer, Flame, Moon, Compass, MessageSquare } from 'lucide-react';

interface LogSymptomsProps {
  stage: 'cycle' | 'pregnancy' | 'menopause';
  onSave: () => void;
}

const moods = [
  { val: 'happy', label: 'Feliz', icon: '😊' },
  { val: 'calm', label: 'Tranquila', icon: '😌' },
  { val: 'anxious', label: 'Ansiosa', icon: '😰' },
  { val: 'sad', label: 'Triste', icon: '😢' },
  { val: 'irritable', label: 'Irritada', icon: '😠' },
  { val: 'tired', label: 'Cansada', icon: '😴' },
] as const;

export default function LogSymptoms({ stage, onSave }: LogSymptomsProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState<DailyLog['mood']>(undefined);
  const [notes, setNotes] = useState('');

  // Cycle specific states
  const [flow, setFlow] = useState<DailyLog['flow']>('none');
  const [pain, setPain] = useState<DailyLog['pain']>('none');
  const [temp, setTemp] = useState<string>('');

  // Menopause specific states
  const [hotFlashes, setHotFlashes] = useState(0);
  const [sleepQuality, setSleepQuality] = useState<DailyLog['sleepQuality']>('good');
  const [anxietyLevel, setAnxietyLevel] = useState(1);

  const [feedback, setFeedback] = useState('');

  // Load existing log for selected date if exists
  useEffect(() => {
    async function loadLog() {
      const existingLog = await db.dailyLogs.get(date);
      if (existingLog) {
        setMood(existingLog.mood);
        setNotes(existingLog.notes || '');
        setFlow(existingLog.flow || 'none');
        setPain(existingLog.pain || 'none');
        setTemp(existingLog.temperature ? String(existingLog.temperature) : '');
        setHotFlashes(existingLog.hotFlashes || 0);
        setSleepQuality(existingLog.sleepQuality || 'good');
        setAnxietyLevel(existingLog.anxietyLevel || 1);
      } else {
        // Reset states
        setMood(undefined);
        setNotes('');
        setFlow('none');
        setPain('none');
        setTemp('');
        setHotFlashes(0);
        setSleepQuality('good');
        setAnxietyLevel(1);
      }
    }
    loadLog();
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const logData: DailyLog = {
      date,
      mood,
      notes: notes.trim() || undefined,
      flow: stage === 'cycle' ? flow : undefined,
      pain: stage === 'cycle' ? pain : undefined,
      temperature: stage === 'cycle' && temp ? Number(temp) : undefined,
      hotFlashes: stage === 'menopause' ? hotFlashes : undefined,
      sleepQuality: stage === 'menopause' ? sleepQuality : undefined,
      anxietyLevel: stage === 'menopause' ? anxietyLevel : undefined,
    };

    await db.dailyLogs.put(logData);
    
    setFeedback('¡Registro guardado con éxito!');
    setTimeout(() => {
      setFeedback('');
      onSave();
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="glass rounded-3xl p-6 shadow-lg border border-brand-earth-100 space-y-6">
        <div className="flex items-center justify-between border-b border-brand-earth-100 pb-3">
          <h1 className="text-xl font-bold text-brand-earth-900">Registro Diario</h1>
          {feedback && (
            <span className="text-xs bg-brand-teal-100 text-brand-teal-800 px-3 py-1 rounded-full font-bold">
              {feedback}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FECHA */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-earth-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-brand-teal-600" />
              Fecha de Registro
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-earth-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-300 bg-white text-brand-earth-900 font-medium"
            />
          </div>

          {/* ESTADO DE ÁNIMO */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-earth-700 uppercase tracking-wider flex items-center gap-1.5">
              <Smile className="h-4 w-4 text-brand-teal-600" />
              Estado de Ánimo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {moods.map((m) => (
                <button
                  key={m.val}
                  type="button"
                  onClick={() => setMood(m.val)}
                  className={`py-3 px-2 rounded-xl border text-center transition-all duration-200 ${
                    mood === m.val
                      ? 'border-brand-teal-500 bg-brand-teal-50 text-brand-teal-900 ring-2 ring-brand-teal-100'
                      : 'border-brand-earth-200 bg-white hover:bg-brand-earth-50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{m.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CAMPOS CICLO MENSTRUAL */}
          {stage === 'cycle' && (
            <div className="space-y-5 border-t border-brand-earth-100 pt-5">
              {/* FLUJO */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-earth-700 uppercase tracking-wider">
                  Flujo Menstrual
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['none', 'light', 'medium', 'heavy'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFlow(f)}
                      className={`py-2 px-1 rounded-lg border text-xs font-bold capitalize transition-all ${
                        flow === f
                          ? 'bg-brand-teal-600 border-brand-teal-700 text-white'
                          : 'bg-white border-brand-earth-200 text-brand-earth-700 hover:bg-brand-earth-50'
                      }`}
                    >
                      {f === 'none' ? 'Ninguno' : f === 'light' ? 'Leve' : f === 'medium' ? 'Medio' : 'Fuerte'}
                    </button>
                  ))}
                </div>
              </div>

              {/* DOLOR */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-earth-700 uppercase tracking-wider">
                  Dolor / Cólicos
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['none', 'mild', 'moderate', 'severe'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPain(p)}
                      className={`py-2 px-1 rounded-lg border text-xs font-bold capitalize transition-all ${
                        pain === p
                          ? 'bg-brand-coral-500 border-brand-coral-600 text-white'
                          : 'bg-white border-brand-earth-200 text-brand-earth-700 hover:bg-brand-earth-50'
                      }`}
                    >
                      {p === 'none' ? 'Sin dolor' : p === 'mild' ? 'Leve' : p === 'moderate' ? 'Medio' : 'Fuerte'}
                    </button>
                  ))}
                </div>
              </div>

              {/* TEMPERATURA BASAL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-earth-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Thermometer className="h-4 w-4 text-brand-teal-600" />
                  Temperatura Basal (°C)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="35"
                  max="40"
                  placeholder="Ej. 36.6"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-earth-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-300 bg-white"
                />
              </div>
            </div>
          )}

          {/* CAMPOS MENOPAUSIA */}
          {stage === 'menopause' && (
            <div className="space-y-5 border-t border-brand-earth-100 pt-5">
              {/* SOFOCOS */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-earth-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-brand-coral-500" />
                  Sofocos / Bochornos por día ({hotFlashes})
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={hotFlashes}
                  onChange={(e) => setHotFlashes(Number(e.target.value))}
                  className="w-full accent-brand-coral-500"
                />
                <div className="flex justify-between text-[10px] text-brand-earth-500 px-1">
                  <span>Ninguno</span>
                  <span>5 sofocos</span>
                  <span>10 o más</span>
                </div>
              </div>

              {/* CALIDAD SUEÑO */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-earth-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Moon className="h-4 w-4 text-brand-teal-600" />
                  Calidad del Sueño
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['good', 'fair', 'poor'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSleepQuality(s)}
                      className={`py-2 px-1 rounded-lg border text-xs font-bold capitalize transition-all ${
                        sleepQuality === s
                          ? 'bg-brand-teal-600 border-brand-teal-700 text-white'
                          : 'bg-white border-brand-earth-200 text-brand-earth-700 hover:bg-brand-earth-50'
                      }`}
                    >
                      {s === 'good' ? 'Bueno' : s === 'fair' ? 'Regular' : 'Malo'}
                    </button>
                  ))}
                </div>
              </div>

              {/* ANSIEDAD */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-earth-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-brand-teal-600" />
                  Nivel de Ansiedad ({anxietyLevel}/10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={anxietyLevel}
                  onChange={(e) => setAnxietyLevel(Number(e.target.value))}
                  className="w-full accent-brand-teal-500"
                />
                <div className="flex justify-between text-[10px] text-brand-earth-500 px-1">
                  <span>Muy bajo</span>
                  <span>Modera</span>
                  <span>Extremo</span>
                </div>
              </div>
            </div>
          )}

          {/* NOTAS */}
          <div className="space-y-2 border-t border-brand-earth-100 pt-5">
            <label className="text-xs font-bold text-brand-earth-700 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-brand-teal-600" />
              Notas Libres
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="¿Cómo te sientes hoy? Escribe algo..."
              className="w-full px-4 py-3 rounded-xl border border-brand-earth-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-300 bg-white text-sm"
            />
          </div>

          {/* GUARDAR */}
          <button
            type="submit"
            className="w-full bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-sm uppercase tracking-wider"
          >
            Guardar Registro
          </button>
        </form>
      </div>
    </div>
  );
}
