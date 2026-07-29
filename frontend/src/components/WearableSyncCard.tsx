import React, { useState, useEffect } from 'react';
import { Watch, RefreshCw, CheckCircle2, BatteryCharging, Zap, Thermometer, Activity, Moon } from 'lucide-react';
import {
  getWearableStatus,
  connectWearableDevice,
  disconnectWearableDevice,
  syncLatestBiometrics,
  getLatestBiometrics,
  type WearableDeviceStatus
} from '../services/healthSyncService';
import type { BiometricLog } from '../db/db';

interface WearableSyncCardProps {
  onBiometricsUpdated?: () => void;
}

export default function WearableSyncCard({ onBiometricsUpdated }: WearableSyncCardProps) {
  const [status, setStatus] = useState<WearableDeviceStatus>({
    connected: false,
    deviceName: 'Cargando...',
    deviceType: 'none',
    permissionsGranted: false,
  });
  const [biometrics, setBiometrics] = useState<BiometricLog | undefined>(undefined);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const st = await getWearableStatus();
    setStatus(st);
    const bio = await getLatestBiometrics();
    setBiometrics(bio);
  }

  const handleToggleSync = async () => {
    setIsSyncing(true);
    if (status.connected) {
      // Sync fresh telemetry
      const freshBio = await syncLatestBiometrics(status.deviceType);
      setBiometrics(freshBio);
    } else {
      // Connect to Simulator by default for demonstration
      const newSt = await connectWearableDevice('simulator');
      setStatus(newSt);
      const freshBio = await getLatestBiometrics();
      setBiometrics(freshBio);
    }
    setIsSyncing(false);
    if (onBiometricsUpdated) onBiometricsUpdated();
  };

  const handleDisconnect = async () => {
    const newSt = await disconnectWearableDevice();
    setStatus(newSt);
    setBiometrics(undefined);
  };

  return (
    <div className="my-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
      {/* Background ambient light glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center">
            <Watch className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>{status.deviceName}</span>
              {status.connected && <CheckCircle2 className="w-4 h-4 text-teal-400 inline" />}
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">
              {status.connected
                ? `Última sincr: ${status.lastSyncTimestamp ? new Date(status.lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hoy'}`
                : 'Paso 1: Sincronizar reloj/anillo'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleSync}
          disabled={isSyncing}
          className="px-3.5 py-1.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center space-x-1 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{status.connected ? 'Sincronizar' : 'Vincular'}</span>
        </button>
      </div>

      {/* Telemetry Metrics Display Grid */}
      {status.connected && biometrics ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 relative z-10">
          
          {/* Metric 1: Skin Temp */}
          <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/60">
            <div className="flex items-center space-x-1 text-rose-400 text-[10px] font-bold uppercase mb-1">
              <Thermometer className="w-3.5 h-3.5" />
              <span>Temp Cutánea</span>
            </div>
            <span className="text-xl font-black text-white">
              {biometrics.skinTemp ?? 36.6}°C
            </span>
            <span className="text-[9px] text-emerald-400 block mt-0.5 font-medium">
              {biometrics.skinTemp && biometrics.skinTemp > 36.7 ? '▲ Elevada (Post-Ovulación)' : 'Basal normal'}
            </span>
          </div>

          {/* Metric 2: Resting HR */}
          <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/60">
            <div className="flex items-center space-x-1 text-teal-400 text-[10px] font-bold uppercase mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Pulso Reposo</span>
            </div>
            <span className="text-xl font-black text-white">
              {biometrics.restingHR ?? 62} <span className="text-xs text-slate-400 font-normal">bpm</span>
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">Frecuencia estable</span>
          </div>

          {/* Metric 3: HRV */}
          <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/60">
            <div className="flex items-center space-x-1 text-sky-400 text-[10px] font-bold uppercase mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>HRV (Variabilidad)</span>
            </div>
            <span className="text-xl font-black text-white">
              {biometrics.hrv ?? 48} <span className="text-xs text-slate-400 font-normal">ms</span>
            </span>
            <span className="text-[9px] text-sky-300 block mt-0.5 font-medium">Estrés adaptativo bajo</span>
          </div>

          {/* Metric 4: Sleep Duration */}
          <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/60">
            <div className="flex items-center space-x-1 text-indigo-400 text-[10px] font-bold uppercase mb-1">
              <Moon className="w-3.5 h-3.5" />
              <span>Sueño Nocturno</span>
            </div>
            <span className="text-xl font-black text-white">
              {biometrics.sleepMinutes ? Math.floor(biometrics.sleepMinutes / 60) : 7}h{' '}
              {biometrics.sleepMinutes ? biometrics.sleepMinutes % 60 : 20}m
            </span>
            <span className="text-[9px] text-indigo-300 block mt-0.5 font-medium">Sueño reparador</span>
          </div>

        </div>
      ) : (
        <div className="my-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-center">
          <p className="text-xs text-slate-300 mb-2">
            Blooma se conecta con **Android Health Connect**, **Apple HealthKit** y **Smart Rings BLE** para medir tu temperatura nocturna y pulso automáticamente.
          </p>
          <span className="text-[10px] font-bold text-teal-400 block uppercase tracking-wider">
            Toca "Vincular" para activar el simulador biométrico de prueba
          </span>
        </div>
      )}

      {status.connected && (
        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
          <span className="flex items-center space-x-1">
            <BatteryCharging className="w-3 h-3 text-emerald-400 inline" />
            <span>Batería reloj: {status.batteryLevel ?? 90}%</span>
          </span>
          <button
            onClick={handleDisconnect}
            className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
          >
            Desconectar dispositivo
          </button>
        </div>
      )}
    </div>
  );
}
