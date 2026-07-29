import React, { useState, useEffect } from 'react';
import { HeartPulse, Play, Square } from 'lucide-react';

export default function KegelTimer() {
  const [activeMode, setActiveMode] = useState<'kegel' | 'breathing'>('kegel');
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'contract' | 'relax'>('contract');
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [repsDone, setRepsDone] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (activeMode === 'kegel') {
              if (phase === 'contract') {
                setPhase('relax');
                return 5;
              } else {
                setPhase('contract');
                setRepsDone((r) => r + 1);
                return 5;
              }
            } else {
              if (phase === 'contract') {
                setPhase('relax');
                return 7;
              } else {
                setPhase('contract');
                setRepsDone((r) => r + 1);
                return 4;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, phase, activeMode]);

  const handleStart = () => {
    setIsRunning(true);
    setPhase('contract');
    setSecondsLeft(activeMode === 'kegel' ? 5 : 4);
    setRepsDone(0);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div className="blooma-card p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
            <HeartPulse className="w-5 h-5 animate-pulse-soft" />
          </div>
          <div>
            <h4 className="font-bold text-brand-earth-900 text-sm">Entrenamiento de Suelo Pélvico & Respiración</h4>
            <p className="text-xs text-brand-earth-500">Ejercicios Kegel guiados y relajación anti-sofocos</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={() => { setActiveMode('kegel'); setIsRunning(false); }}
            className={`px-2.5 py-1 rounded-full font-bold transition-all ${
              activeMode === 'kegel'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-brand-earth-100 text-brand-earth-700 hover:bg-brand-earth-200'
            }`}
          >
            Kegel
          </button>
          <button
            onClick={() => { setActiveMode('breathing'); setIsRunning(false); }}
            className={`px-2.5 py-1 rounded-full font-bold transition-all ${
              activeMode === 'breathing'
                ? 'bg-brand-teal-600 text-white shadow-sm'
                : 'bg-brand-earth-100 text-brand-earth-700 hover:bg-brand-earth-200'
            }`}
          >
            Respiración 4-7-8
          </button>
        </div>
      </div>

      {/* Visual Animation Circle */}
      <div className="py-4 flex flex-col items-center justify-center">
        <div
          className={`w-32 h-32 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 shadow-lg ${
            isRunning
              ? phase === 'contract'
                ? 'bg-purple-600 scale-105 shadow-purple-400/40'
                : 'bg-brand-teal-500 scale-95 shadow-brand-teal-400/40'
              : 'bg-brand-earth-400'
          }`}
        >
          <span className="text-3xl font-black">{isRunning ? secondsLeft : 'GO'}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-90">
            {isRunning
              ? activeMode === 'kegel'
                ? phase === 'contract' ? 'Contraer' : 'Relajar'
                : phase === 'contract' ? 'Inhalar' : 'Exhalar'
              : 'Listo'}
          </span>
        </div>

        <div className="mt-3 text-xs text-brand-earth-600 font-semibold">
          Repeticiones completadas: <span className="text-purple-600 font-extrabold">{repsDone}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-center space-x-3">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 active-press transition-all uppercase tracking-wider"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Comenzar Ejercicio</span>
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-6 py-2.5 rounded-xl bg-brand-earth-800 text-white text-xs font-extrabold shadow-md flex items-center space-x-2 active-press transition-all uppercase tracking-wider"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Pausar</span>
          </button>
        )}
      </div>
    </div>
  );
}
