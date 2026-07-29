import React, { useState, useEffect } from 'react';
import { Timer, Play, Square, AlertTriangle, RotateCcw } from 'lucide-react';
import { db, type ContractionLog } from '../db/db';

export default function ContractionTimer() {
  const [isContracting, setIsContracting] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [lastEndTime, setLastEndTime] = useState<number | null>(null);
  const [logs, setLogs] = useState<ContractionLog[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const list = await db.contractionLogs.orderBy('id').reverse().limit(10).toArray();
    setLogs(list);
  };

  useEffect(() => {
    let timer: any = null;
    if (isContracting) {
      timer = setInterval(() => {
        setCurrentDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isContracting]);

  const handleToggleContraction = async () => {
    const now = Date.now();

    if (!isContracting) {
      setIsContracting(true);
      setCurrentDuration(0);
    } else {
      setIsContracting(false);
      const interval = lastEndTime ? Math.round((now - lastEndTime) / 1000) : 0;
      setLastEndTime(now);

      await db.contractionLogs.add({
        timestamp: new Date().toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        durationSeconds: currentDuration,
        intervalSeconds: interval,
      });

      loadLogs();
    }
  };

  const handleClearHistory = async () => {
    await db.contractionLogs.clear();
    setLogs([]);
    setLastEndTime(null);
  };

  const check511Rule = () => {
    if (logs.length < 3) return false;
    const recent = logs.slice(0, 3);
    const avgDuration = recent.reduce((a, b) => a + b.durationSeconds, 0) / 3;
    const avgInterval = recent.reduce((a, b) => a + b.intervalSeconds, 0) / 3;

    return avgDuration >= 45 && avgInterval > 0 && avgInterval <= 330;
  };

  const is511Active = check511Rule();

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <div className={`blooma-card p-5 relative overflow-hidden transition-all ${is511Active ? 'border-amber-400 bg-amber-50/40' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`p-2.5 rounded-2xl ${is511Active ? 'bg-amber-500 text-white animate-bounce' : 'bg-red-100 text-red-600'}`}>
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-brand-earth-900 text-sm">Cronómetro de Contracciones</h4>
            <p className="text-xs text-brand-earth-500">Mide duración y frecuencia para trabajo de parto</p>
          </div>
        </div>

        {logs.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-[11px] font-semibold text-brand-earth-500 hover:text-brand-earth-800 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* 5-1-1 Rule Urgency Banner */}
      {is511Active && (
        <div className="mb-4 p-3.5 rounded-2xl bg-amber-500 text-white shadow-lg animate-urgency-pulse flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-xs">¡ALERTA DE TRABAJO DE PARTO (Regla 5-1-1)!</div>
            <div className="text-[11px] opacity-95 mt-0.5">
              Tus contracciones son constantes (cada 5 min y duran 1 min). Es momento de acudir a tu **Hospital** o **Casa Materna** más cercana.
            </div>
          </div>
        </div>
      )}

      {/* Big Action Button */}
      <div className="text-center py-2">
        <button
          onClick={handleToggleContraction}
          className={`w-full py-3.5 rounded-2xl font-extrabold text-xs tracking-wider uppercase shadow-md flex items-center justify-center space-x-3 transition-all active-press ${
            isContracting
              ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
              : 'bg-brand-coral-500 text-white hover:bg-brand-coral-600'
          }`}
        >
          {isContracting ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>DETENER CONTRACCIÓN ({formatSeconds(currentDuration)})</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>REGISTRAR INICIO DE CONTRACCIÓN</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-brand-earth-500 mt-2">
          {isContracting ? 'Toma aire despacio mientras registras la duración' : 'Presiona el botón exactamente cuando comience la molestia o endurecimiento abdominal'}
        </p>
      </div>

      {/* Recent Contraction Logs */}
      {logs.length > 0 && (
        <div className="mt-4 border-t border-brand-earth-100 pt-3">
          <div className="text-[10px] font-bold text-brand-earth-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Últimas Contracciones</span>
            <span>Duración / Frecuencia</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
            {logs.map((log, index) => (
              <div key={log.id || index} className="p-2.5 rounded-xl bg-brand-earth-50 border border-brand-earth-150 flex items-center justify-between">
                <span className="font-mono font-bold text-brand-earth-700">{log.timestamp}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-brand-coral-600">
                    ⏱ {formatSeconds(log.durationSeconds)}
                  </span>
                  {log.intervalSeconds > 0 && (
                    <span className="text-[10px] text-brand-earth-500 font-semibold">
                      (hace {formatSeconds(log.intervalSeconds)})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
