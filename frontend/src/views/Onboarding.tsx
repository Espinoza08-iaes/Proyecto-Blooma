import React, { useState } from 'react';
import { db, type Profile } from '../db/db';
import { Shield, Sparkles, Heart, Activity, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: Profile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [stage, setStage] = useState<'cycle' | 'pregnancy' | 'menopause'>('cycle');
  
  // Cycle details
  const [avgCycleLength, setAvgCycleLength] = useState(28);
  const [lastPeriodDate, setLastPeriodDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Pregnancy details
  const [gestationWeek, setGestationWeek] = useState(12);
  
  // Menopause details
  const [menopauseMonths, setMenopauseMonths] = useState(12);

  // Security details
  const [pinEnabled, setPinEnabled] = useState(true);
  const [pinCode, setPinCode] = useState('');
  const [optInSync, setOptInSync] = useState(false);
  const [age, setAge] = useState<number | undefined>(undefined);

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    let profileData: Profile = {
      id: 'main',
      stage,
      isPinEnabled: pinEnabled && pinCode.length === 4,
      pinCode: pinEnabled && pinCode.length === 4 ? pinCode : undefined,
      isDiscreteMode: false,
      isOfflineMode: false,
      optInSync,
      age: age ? Number(age) : undefined,
      lastPeriodDate: stage === 'cycle' ? lastPeriodDate : undefined,
      gestationWeekStart: stage === 'pregnancy' ? new Date().toISOString() : undefined,
      menopauseStartYear: stage === 'menopause' ? new Date().getFullYear().toString() : undefined
    };

    // Save profile to database
    await db.profile.put(profileData);

    // Seed initial cycle if cycle stage chosen
    if (stage === 'cycle') {
      const duration = avgCycleLength;
      const start = new Date(lastPeriodDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 5); // Default 5 days period

      await db.cycles.add({
        startDate: lastPeriodDate,
        endDate: end.toISOString().split('T')[0],
        duration: duration
      });
    }

    onComplete(profileData);
  };

  const handlePinInput = (val: string) => {
    if (/^\d*$/.test(val) && val.length <= 4) {
      setPinCode(val);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-8 flex flex-col justify-center min-h-[85vh]">
      {/* Indicator */}
      <div className="flex justify-center items-center space-x-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === i ? 'w-8 bg-brand-teal-500' : 'w-2 bg-brand-earth-200'
            }`}
          />
        ))}
      </div>

      <div className="glass rounded-3xl p-8 shadow-xl border border-brand-earth-100 flex-1 flex flex-col justify-between animate-pop-in">
        
        {/* STEP 1: Bienvenida */}
        {step === 1 && (
          <div className="space-y-6 flex-1 flex flex-col justify-center animate-page-enter">
            <div className="mx-auto bg-brand-teal-50 h-20 w-20 rounded-2xl flex items-center justify-center text-brand-teal-600 shadow-inner animate-pulse-soft">
              <Sparkles className="h-10 w-10" />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-brand-earth-900 leading-none">
                Proyecto Blooma
              </h1>
              <p className="text-sm text-brand-earth-600">
                Tu compañera de salud íntima, privada y local-first.
              </p>
            </div>
            <div className="bg-brand-earth-50 rounded-2xl p-4 border border-brand-earth-100 text-sm leading-relaxed text-brand-earth-700 hover:shadow-inner transition-shadow duration-300">
              Blooma está diseñada para funcionar <strong>completamente offline</strong>. Tus datos médicos sensibles nunca abandonan tu dispositivo, protegiéndote contra la vigilancia de datos íntimos.
            </div>
          </div>
        )}

        {/* STEP 2: Selección de etapa */}
        {step === 2 && (
          <div className="space-y-6 flex-1 animate-page-enter">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-brand-earth-900">¿En qué etapa te encuentras?</h2>
              <p className="text-sm text-brand-earth-600">Personalizaremos la aplicación para tus necesidades.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Opción Menstruación */}
              <button
                type="button"
                onClick={() => setStage('cycle')}
                className={`flex items-center p-4 rounded-2xl border text-left transition-all duration-300 active-press ${
                  stage === 'cycle'
                    ? 'border-brand-teal-500 bg-brand-teal-50/50 shadow-md ring-2 ring-brand-teal-200'
                    : 'border-brand-earth-200 bg-white hover:bg-brand-earth-50/50 card-hover'
                }`}
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                  stage === 'cycle' ? 'bg-brand-teal-100 text-brand-teal-600' : 'bg-brand-earth-100 text-brand-earth-600'
                }`}>
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-earth-900">Ciclo Menstrual</h3>
                  <p className="text-xs text-brand-earth-600">Monitoreo del periodo, días fértiles y síntomas asociados.</p>
                </div>
              </button>

              {/* Opción Embarazo */}
              <button
                type="button"
                onClick={() => setStage('pregnancy')}
                className={`flex items-center p-4 rounded-2xl border text-left transition-all duration-300 active-press ${
                  stage === 'pregnancy'
                    ? 'border-brand-teal-500 bg-brand-teal-50/50 shadow-md ring-2 ring-brand-teal-200'
                    : 'border-brand-earth-200 bg-white hover:bg-brand-earth-50/50 card-hover'
                }`}
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                  stage === 'pregnancy' ? 'bg-brand-teal-100 text-brand-teal-600' : 'bg-brand-earth-100 text-brand-earth-600'
                }`}>
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-earth-900">Embarazo</h3>
                  <p className="text-xs text-brand-earth-600">Triaje de síntomas de riesgo, control de semanas y Casas Maternas.</p>
                </div>
              </button>

              {/* Opción Menopausia */}
              <button
                type="button"
                onClick={() => setStage('menopause')}
                className={`flex items-center p-4 rounded-2xl border text-left transition-all duration-300 active-press ${
                  stage === 'menopause'
                    ? 'border-brand-teal-500 bg-brand-teal-50/50 shadow-md ring-2 ring-brand-teal-200'
                    : 'border-brand-earth-200 bg-white hover:bg-brand-earth-50/50 card-hover'
                }`}
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                  stage === 'menopause' ? 'bg-brand-teal-100 text-brand-teal-600' : 'bg-brand-earth-100 text-brand-earth-600'
                }`}>
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-earth-900">Menopausia y Climaterio</h3>
                  <p className="text-xs text-brand-earth-600">Registro de sofocos, bienestar óseo y apoyo cognitivo-conductual.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Configuración específica */}
        {step === 3 && (
          <div className="space-y-6 flex-1 animate-page-enter">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-brand-earth-900">Cuéntanos un poco más</h2>
              <p className="text-sm text-brand-earth-600">Estos datos nos ayudan a calibrar tus estimaciones.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-earth-700 uppercase tracking-wider mb-1">
                  Tu edad (Opcional)
                </label>
                <input
                  type="number"
                  placeholder="Ej. 28"
                  value={age || ''}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-earth-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-300 bg-white transition-all"
                />
              </div>

              {/* Ajustes de ciclo */}
              {stage === 'cycle' && (
                <>
                  <div className="animate-fade-in-up delay-75">
                    <label className="block text-xs font-bold text-brand-earth-700 uppercase tracking-wider mb-1">
                      ¿Cuándo empezó tu último periodo?
                    </label>
                    <input
                      type="date"
                      value={lastPeriodDate}
                      onChange={(e) => setLastPeriodDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-brand-earth-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-300 bg-white transition-all"
                    />
                  </div>
                  <div className="animate-fade-in-up delay-150">
                    <label className="block text-xs font-bold text-brand-earth-700 uppercase tracking-wider mb-1">
                      Duración promedio del ciclo ({avgCycleLength} días)
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="45"
                      value={avgCycleLength}
                      onChange={(e) => setAvgCycleLength(Number(e.target.value))}
                      className="w-full accent-brand-teal-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-brand-earth-500 px-1">
                      <span>20 días</span>
                      <span className="font-bold text-brand-teal-700">Regular (28)</span>
                      <span>45 días</span>
                    </div>
                  </div>
                </>
              )}

              {/* Ajustes de embarazo */}
              {stage === 'pregnancy' && (
                <div className="animate-fade-in-up delay-75">
                  <label className="block text-xs font-bold text-brand-earth-700 uppercase tracking-wider mb-1">
                    ¿En qué semana de embarazo te encuentras? ({gestationWeek} semanas)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="42"
                    value={gestationWeek}
                    onChange={(e) => setGestationWeek(Number(e.target.value))}
                    className="w-full accent-brand-teal-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-brand-earth-500 px-1">
                    <span>1 semana</span>
                    <span className="font-bold text-brand-teal-700">Semana {gestationWeek}</span>
                    <span>42 semanas</span>
                  </div>
                </div>
              )}

              {/* Ajustes de menopausia */}
              {stage === 'menopause' && (
                <div className="animate-fade-in-up delay-75">
                  <label className="block text-xs font-bold text-brand-earth-700 uppercase tracking-wider mb-1">
                    ¿Cuántos meses llevas sin periodo menstrual regular? ({menopauseMonths} meses)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={menopauseMonths}
                    onChange={(e) => setMenopauseMonths(Number(e.target.value))}
                    className="w-full accent-brand-teal-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-brand-earth-500 px-1">
                    <span>1 mes</span>
                    <span className="font-bold text-brand-teal-700">{menopauseMonths} meses</span>
                    <span>5 años (60)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Seguridad y Privacidad */}
        {step === 4 && (
          <div className="space-y-6 flex-1 animate-page-enter">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-brand-earth-900 flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-brand-teal-600 animate-pulse-soft" />
                Seguridad e Intimidad
              </h2>
              <p className="text-sm text-brand-earth-600">
                Tus datos son personales y confidenciales.
              </p>
            </div>

            <div className="space-y-4">
              {/* Bloqueo PIN */}
              <div className="border border-brand-earth-100 rounded-2xl p-4 bg-white space-y-3 shadow-sm hover:shadow transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-brand-earth-900">Bloqueo por PIN de acceso</h3>
                    <p className="text-xs text-brand-earth-600">Protege tu app de miradas no deseadas.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pinEnabled}
                    onChange={(e) => setPinEnabled(e.target.checked)}
                    className="h-5 w-5 rounded text-brand-teal-600 focus:ring-brand-teal-400 accent-brand-teal-500 cursor-pointer transition-all"
                  />
                </div>
                {pinEnabled && (
                  <input
                    type="password"
                    maxLength={4}
                    pattern="\d*"
                    value={pinCode}
                    onChange={(e) => handlePinInput(e.target.value)}
                    placeholder="Ingresa un PIN de 4 dígitos"
                    className="w-full px-4 py-3 rounded-xl border border-brand-earth-200 text-center tracking-widest text-lg font-bold bg-brand-earth-50 focus:outline-none focus:ring-2 focus:ring-brand-teal-300 animate-fade-in-up"
                  />
                )}
              </div>

              {/* Sincronización en la nube */}
              <div className="border border-brand-earth-100 rounded-2xl p-4 bg-white space-y-3 shadow-sm hover:shadow transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-brand-earth-900">Sincronización en la nube (Opt-in)</h3>
                    <p className="text-xs text-brand-earth-600">Tus datos se guardan en la nube cifrados (Requiere Supabase).</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={optInSync}
                    onChange={(e) => setOptInSync(e.target.checked)}
                    className="h-5 w-5 rounded text-brand-teal-600 focus:ring-brand-teal-400 accent-brand-teal-500 cursor-pointer transition-all"
                  />
                </div>
                <div className="text-[11px] text-brand-earth-500 bg-brand-earth-50 p-2 rounded-lg leading-relaxed">
                  <strong>Recomendado:</strong> Mantenerlo desactivado para una privacidad 100% local. Si decides activarlo, tus datos se guardan usando políticas estrictas de seguridad (RLS).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones inferiores */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-xl border border-brand-earth-200 text-brand-earth-700 font-medium hover:bg-brand-earth-100/50 active-press transition-all duration-200"
            >
              Atrás
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={step === 4 && pinEnabled && pinCode.length !== 4}
            className={`px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg active-press transition-all text-white ${
              step === 4 && pinEnabled && pinCode.length !== 4
                ? 'bg-brand-earth-300 cursor-not-allowed'
                : 'bg-brand-teal-600 hover:bg-brand-teal-700'
            }`}
          >
            {step === 4 ? 'Empezar' : 'Siguiente'}
          </button>
        </div>

      </div>

    </div>
  );
}
