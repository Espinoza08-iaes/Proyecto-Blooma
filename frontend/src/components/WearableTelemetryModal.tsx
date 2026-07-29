import React, { useState } from 'react';
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

  if (!isOpen) return null;

  const handleSyncNow = () => {
    setIsSyncing(true);
    setSyncStatus(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('✅ Sincronización biométrica completada con éxito.');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/80 space-y-5 max-h-[90vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Watch className="w-6 h-6" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Sincronía de Reloj y Anillo Inteligente</h3>
              <span className="text-[10px] text-slate-400 block">HealthConnect • Apple HealthKit • BLE Direct</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 cursor-pointer">
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
              <span className="text-[10px] font-bold text-rose-300">
                {conceptionMode ? 'Pico Térmico Lúteo' : 'Temp Cutánea Nocturna'}
              </span>
              <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-300">
                <span>❤️ 64 BPM</span>
                <span>•</span>
                <span>⚡ 58ms HRV</span>
              </div>
            </>
          )}

          {stage === 'pregnancy' && (
            <>
              <span className="text-3xl font-black text-amber-300">76 BPM</span>
              <span className="text-[10px] font-bold text-slate-300">Ritmo Cardíaco Materno</span>
              <div className="flex items-center space-x-2 mt-2 text-[10px] text-emerald-300">
                <span>😴 7h 45m Sueño</span>
              </div>
            </>
          )}

          {stage === 'menopause' && (
            <>
              <span className="text-2xl font-black text-teal-300">3 Sofocos</span>
              <span className="text-[10px] font-bold text-slate-300">Detectados Anoche</span>
              <div className="flex items-center space-x-2 mt-1 text-[10px] text-teal-200">
                <span>🌡️ Autodetectado GSR</span>
              </div>
            </>
          )}

          <div className="mt-2 flex items-center space-x-1 text-[8px] font-bold text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sincronizado hoy 07:15 AM</span>
          </div>
        </div>

        {/* Device Selection & Telemetry Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Selecciona tu Dispositivo:</h4>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setSelectedDevice('apple')}
              className={`p-3 rounded-2xl border font-bold flex items-center space-x-2 cursor-pointer transition-all ${
                selectedDevice === 'apple' ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Smartphone className="w-4 h-4 text-slate-900" />
              <span>Apple Watch / HealthKit</span>
            </button>

            <button
              onClick={() => setSelectedDevice('android')}
              className={`p-3 rounded-2xl border font-bold flex items-center space-x-2 cursor-pointer transition-all ${
                selectedDevice === 'android' ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Android Health Connect</span>
            </button>

            <button
              onClick={() => setSelectedDevice('oura')}
              className={`p-3 rounded-2xl border font-bold flex items-center space-x-2 cursor-pointer transition-all ${
                selectedDevice === 'oura' ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Watch className="w-4 h-4 text-indigo-600" />
              <span>Oura Ring (Anillo)</span>
            </button>

            <button
              onClick={() => setSelectedDevice('garmin')}
              className={`p-3 rounded-2xl border font-bold flex items-center space-x-2 cursor-pointer transition-all ${
                selectedDevice === 'garmin' ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Garmin / Fitbit BLE</span>
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
    </div>
  );
}
