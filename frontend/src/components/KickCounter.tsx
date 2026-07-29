import React, { useState, useEffect } from 'react';
import { Heart, Play, RotateCcw, CheckCircle2, History, Award } from 'lucide-react';
import { db, type KickSession } from '../db/db';

export default function KickCounter() {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [pastSessions, setPastSessions] = useState<KickSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const list = await db.kickSessions.orderBy('id').reverse().limit(10).toArray();
    setPastSessions(list);
  };

  useEffect(() => {
    let timer: any = null;
    if (isActive) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setCount(0);
    setSeconds(0);
    setSessionCompleted(false);
  };

  const handleAddKick = () => {
    if (!isActive) {
      setIsActive(true);
    }
    const newCount = count + 1;
    setCount(newCount);

    if (newCount === 10 && !sessionCompleted) {
      setSessionCompleted(true);
    }
  };

  const handleFinish = async () => {
    setIsActive(false);
    if (count > 0) {
      const minutes = Math.max(1, Math.round(seconds / 60));
      await db.kickSessions.add({
        date: new Date().toLocaleDateString('es-NI', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        count,
        durationMinutes: minutes,
      });
      loadSessions();
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setCount(0);
    setSeconds(0);
    setSessionCompleted(false);
  };

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="blooma-card p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-600">
            <Heart className="w-5 h-5 animate-pulse-soft" />
          </div>
          <div>
            <h4 className="font-bold text-brand-earth-900 text-sm">Contador de Pataditas Fetales</h4>
            <p className="text-xs text-brand-earth-500">Monitoreo de movimientos de tu bebé en el 3er Trimestre</p>
          </div>
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-xs font-bold text-brand-coral-600 hover:underline flex items-center space-x-1"
        >
          <History className="w-3.5 h-3.5" />
          <span>{showHistory ? 'Ver Contador' : 'Historial'}</span>
        </button>
      </div>

      {!showHistory ? (
        <div className="text-center py-2">
          {sessionCompleted && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center space-x-2 animate-pop-in">
              <Award className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">¡Meta alcanzada! 10 movimientos registrados. Tu bebé está activo y saludable.</span>
            </div>
          )}

          {/* Big Interactive Tap Circle */}
          <div className="relative inline-block my-2">
            <button
              onClick={handleAddKick}
              className={`w-36 h-36 rounded-full bg-gradient-to-tr from-brand-coral-500 to-rose-400 text-white shadow-lg shadow-rose-400/30 flex flex-col items-center justify-center transition-all transform active:scale-90 hover:scale-105 group relative overflow-hidden ${
                isActive ? 'ring-4 ring-rose-200' : ''
              }`}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-4xl font-black tracking-tight">{count}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider mt-1 opacity-90">
                {count === 1 ? 'Patadita' : 'Pataditas'}
              </span>
              <span className="text-[9px] opacity-75 mt-0.5">¡Toca aquí!</span>
            </button>

            {isActive && (
              <span className="absolute -inset-2 rounded-full border-2 border-rose-300 animate-ping pointer-events-none" />
            )}
          </div>

          {/* Timer Display */}
          <div className="mt-3 flex items-center justify-center space-x-4">
            <div className="text-sm font-bold text-brand-earth-800 font-mono bg-brand-earth-100 px-3.5 py-1 rounded-xl">
              ⏱ {formatTime(seconds)}
            </div>
            <div className="text-xs text-brand-earth-500">
              Meta médica: 10 pataditas en &lt; 2 horas
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-3 mt-4">
            {!isActive ? (
              <button
                onClick={handleStart}
                className="px-5 py-2.5 rounded-xl bg-brand-teal-600 text-white text-xs font-extrabold shadow-md hover:bg-brand-teal-700 transition-all flex items-center space-x-1.5 active-press uppercase tracking-wider"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Iniciar Sesión</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleFinish}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-all flex items-center space-x-1.5 active-press"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Sesión</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-2.5 rounded-xl bg-brand-earth-100 text-brand-earth-700 text-xs font-semibold hover:bg-brand-earth-200 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* History View */
        <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-1">
          {pastSessions.length === 0 ? (
            <p className="text-xs text-brand-earth-500 italic text-center py-6">No hay sesiones de pataditas guardadas aún.</p>
          ) : (
            pastSessions.map((s) => (
              <div key={s.id} className="p-3 rounded-2xl bg-brand-earth-50 border border-brand-earth-150 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center">
                    {s.count}
                  </div>
                  <div>
                    <div className="font-bold text-brand-earth-900">{s.date}</div>
                    <div className="text-[10px] text-brand-earth-500">Duración: {s.durationMinutes} minutos</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Completada
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
