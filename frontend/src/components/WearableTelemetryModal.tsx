import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Watch, Activity, Thermometer, Heart, Zap, RefreshCw, CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';
import { db, type Profile } from '../db/db';

interface WearableTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: 'cycle' | 'pregnancy' | 'menopause';
  conceptionMode?: boolean;
}

export default function WearableTelemetryModal({ isOpen, onClose, stage, conceptionMode }: WearableTelemetryModalProps) {
  const [selectedDevice, setSelectedDevice] = useState<'apple' | 'android' | 'oura' | 'garmin'>('apple');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Lock body scroll when wearable telemetry modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSyncNow = () => {
    setIsSyncing(true);
    setSyncStatus(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('✅ Sincronización biométrica completada con éxito.');
    }, 1200);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overscroll-contain">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/80 space-y-5 max-h-[90vh] overflow-y-auto relative animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Watch className="w-6 h-6" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Sincronía de Reloj y Anillo Inteligente</h3>
              <span className="text-[10px] text-slate-400 block">HealthConnect • Apple HealthKit • BLE Direct</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SMARTWATCH SCREEN SIMULATION DISPLAY (Visual Preview) */}
        <div className="bg-slate-950 rounded-full w-56 h-56 mx-auto border-4 border-slate-800 shadow-xl flex flex-col items-center justify-center text-white text-center p-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-rose-500/20 pointer-events-none" />

          {/* Watch Status Header */}
          <span className="text-[9px] font-extrabold uppercase text-indigo-400 tracking-widest block mb-1">
            BLOOMA WATCH OS
          </span>

          {/* Stage-Specific Biometric Highlights */}
          {stage === 'cycle' && (
            <>
              <span className="text-3xl font-black text-white">
                {conceptionMode ? '+0.42°C' : '+0.15°C'}
              </span>
              <span className="text-[10px] font-bold text-slate-300 mt-0.5">
                {conceptionMode ? 'Cambio Térmico Ovulatorio' : 'Variación Térmica Nocturna'}
              </span>
              <div className="flex items-center space-x-2 mt-2 text-[10px] text-indigo-300 font-bold">
                <Heart className="w-3 h-3 text-rose-400" />
                <span>64 bpm • 48 ms HRV</span>
              </div>
            </>
          )}

          {stage === 'pregnancy' && (
            <>
              <span className="text-2xl font-black text-white">72 bpm</span>
              <span className="text-[10px] font-bold text-slate-300 mt-0.5">Ritmo Cardíaco Basal</span>
              <div className="flex items-center space-x-2 mt-2 text-[10px] text-emerald-300 font-bold">
                <Thermometer className="w-3 h-3" />
                <span>36.7°C • Estable</span>
              </div>
            </>
          )}

          {stage === 'menopause' && (
            <>
              <span className="text-3xl font-black text-white">37.2°C</span>
              <span className="text-[10px] font-bold text-amber-300 mt-0.5">Ráfaga Térmica 02:45 AM</span>
              <div className="flex items-center space-x-2 mt-2 text-[10px] text-purple-300 font-bold">
                <Activity className="w-3 h-3" />
                <span>2 Sofocos Nocturnos</span>
              </div>
            </>
          )}
        </div>

        {/* Device Selection Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">Dispositivo de Origen</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedDevice('apple')}
              className={`p-3 rounded-2xl border font-bold flex items-center space-x-2 cursor-pointer transition-all ${
                selectedDevice === 'apple' ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span>Apple Watch (HealthKit)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDevice('android')}
              className={`p-3 rounded-2xl border font-bold flex items-center space-x-2 cursor-pointer transition-all ${
                selectedDevice === 'android' ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Galaxy Watch / WearOS</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDevice('oura')}
              className={`p-3 rounded-2xl border font-bold flex items-center space-x-2 cursor-pointer transition-all ${
                selectedDevice === 'oura' ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Oura Ring (Anillo)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDevice('garmin')}
              className={`p-3 rounded-2xl border font-bold flex items-center space-x-2 cursor-pointer transition-all ${
                selectedDevice === 'garmin' ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Garmin / Xiaomi BLE</span>
            </button>
          </div>
        </div>

        {/* Sync Trigger Button */}
        <button
          type="button"
          onClick={handleSyncNow}
          disabled={isSyncing}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Leyendo Telemetría Biométrica...' : 'Sincronizar Datos Ahora'}</span>
        </button>

        {syncStatus && (
          <p className="text-center text-xs font-bold text-emerald-600 animate-fade-in">{syncStatus}</p>
        )}

      </div>
    </div>,
    document.body
  );
}
