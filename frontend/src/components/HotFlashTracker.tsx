import React, { useState, useEffect } from 'react';
import { Flame, Thermometer, Plus, Check, Zap } from 'lucide-react';
import { db, type HotFlashLog } from '../db/db';

export default function HotFlashTracker() {
  const [intensity, setIntensity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [logsToday, setLogsToday] = useState<HotFlashLog[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    loadTodayLogs();
  }, []);

  const loadTodayLogs = async () => {
    const list = await db.hotFlashLogs.orderBy('id').reverse().limit(15).toArray();
    setLogsToday(list);
  };

  const handleQuickLog = async () => {
    const newLog: HotFlashLog = {
      timestamp: new Date().toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' }),
      intensity,
      durationMinutes: intensity === 'mild' ? 2 : intensity === 'moderate' ? 4 : 8,
    };

    await db.hotFlashLogs.add(newLog);
    loadTodayLogs();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const totalCountToday = logsToday.length;

  return (
    <div className="blooma-card p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700">
            <Flame className="w-5 h-5 animate-pulse-soft" />
          </div>
          <div>
            <h4 className="font-bold text-brand-earth-900 text-sm">Registro Rápido de Bochorno</h4>
            <p className="text-xs text-brand-earth-500">Mapeador de sofocos y ráfagas térmicas</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-black text-amber-600">{totalCountToday}</div>
          <div className="text-[10px] text-brand-earth-500 font-semibold">Registrados hoy</div>
        </div>
      </div>

      {showToast && (
        <div className="mb-3 p-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold flex items-center space-x-2 animate-pop-in">
          <Check className="w-4 h-4" />
          <span>¡Bochorno registrado con éxito en tu bitácora!</span>
        </div>
      )}

      {/* Intensity Selector */}
      <div className="text-xs font-bold text-brand-earth-700 uppercase tracking-wider mb-2">Selecciona Intensidad:</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          onClick={() => setIntensity('mild')}
          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center space-y-1 ${
            intensity === 'mild'
              ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
              : 'bg-white border-brand-earth-200 text-brand-earth-700 hover:bg-brand-earth-50'
          }`}
        >
          <Thermometer className="w-4 h-4 text-amber-500" />
          <span>Leve</span>
          <span className="text-[9px] opacity-70">~2 min</span>
        </button>

        <button
          onClick={() => setIntensity('moderate')}
          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center space-y-1 ${
            intensity === 'moderate'
              ? 'bg-orange-100 border-orange-300 text-orange-900 shadow-sm'
              : 'bg-white border-brand-earth-200 text-brand-earth-700 hover:bg-brand-earth-50'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Moderada</span>
          <span className="text-[9px] opacity-70">~4 min</span>
        </button>

        <button
          onClick={() => setIntensity('severe')}
          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center space-y-1 ${
            intensity === 'severe'
              ? 'bg-rose-100 border-rose-300 text-rose-900 shadow-sm'
              : 'bg-white border-brand-earth-200 text-brand-earth-700 hover:bg-brand-earth-50'
          }`}
        >
          <Zap className="w-4 h-4 text-rose-500" />
          <span>Severa</span>
          <span className="text-[9px] opacity-70">~8 min</span>
        </button>
      </div>

      {/* 1-Tap Log Button */}
      <button
        onClick={handleQuickLog}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 active-press transition-all uppercase tracking-wider"
      >
        <Plus className="w-4 h-4" />
        <span>REGISTRAR BOCHORNO AHORA (1-TAP)</span>
      </button>

      {/* Recent Log History */}
      {logsToday.length > 0 && (
        <div className="mt-4 border-t border-brand-earth-100 pt-3">
          <div className="text-[10px] font-bold text-brand-earth-500 uppercase tracking-wider mb-2">Registros de hoy</div>
          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {logsToday.map((log) => (
              <div
                key={log.id}
                className="shrink-0 p-2 rounded-xl bg-brand-earth-50 border border-brand-earth-150 text-center text-xs"
              >
                <div className="font-mono text-brand-earth-500 text-[10px]">{log.timestamp}</div>
                <div className={`font-bold capitalize mt-0.5 text-[11px] ${
                  log.intensity === 'mild' ? 'text-amber-600' : log.intensity === 'moderate' ? 'text-orange-600' : 'text-rose-600'
                }`}>
                  {log.intensity}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
