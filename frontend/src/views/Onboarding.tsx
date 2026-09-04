import React, { useState } from 'react';
import { db, type Profile } from '../db/db';
import { Shield, Sparkles, Heart, Activity, Check, Languages, Globe, MapPin } from 'lucide-react';
import { CLIMACTERIC_STAGES, type ClimactericStage } from '../services/menopauseService';
import { NICARAGUA_DEPARTMENTS } from '../services/locationService';
import { useTranslation } from '../i18n/useTranslation';

interface OnboardingProps {
  onComplete: (profile: Profile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [stage, setStage] = useState<'cycle' | 'pregnancy' | 'menopause'>('cycle');
  const [language, setLanguage] = useState<'es' | 'miskito' | 'creole'>('es');
  const { t } = useTranslation(language);
  const [climactericStage, setClimactericStage] = useState<ClimactericStage>('early_perimenopause');
  const [department, setDepartment] = useState('Managua');
  const [municipality, setMunicipality] = useState('Managua');
  
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
    const deptCoords = NICARAGUA_DEPARTMENTS.find(d => d.name === department)?.capitalCoords;

    let profileData: Profile = {
      id: 'main',
      stage,
      language,
      department,
      municipality,
      latitude: deptCoords?.latitude,
      longitude: deptCoords?.longitude,
      climactericStage: stage === 'menopause' ? climactericStage : undefined,
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

    // Save profile to local database (Dexie / IndexedDB)
    await db.profile.put(profileData);

    // Seed initial cycle if cycle stage chosen
    if (stage === 'cycle') {
      const duration = avgCycleLength;
      const start = new Date(lastPeriodDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 5);

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
        
        {/* STEP 1: Bienvenida e Idioma */}
        {step === 1 && (
          <div className="space-y-5 flex-1 flex flex-col justify-center animate-page-enter">
            <div className="mx-auto bg-brand-teal-50 h-16 w-16 rounded-2xl flex items-center justify-center text-brand-teal-600 shadow-inner animate-pulse-soft">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-brand-earth-900 leading-none">
                {t.onboarding.welcomeTitle}
              </h1>
              <p className="text-xs text-brand-earth-600 font-medium">
                {t.onboarding.welcomeSubtitle}
              </p>
            </div>

            {/* Language Selector */}
            <div className="space-y-2 pt-1">
              <label className="block text-[11px] font-black uppercase text-slate-500 tracking-wider text-center">
                {t.onboarding.chooseLanguageTitle}:
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'es', flag: '🇳🇮', label: 'Español', desc: 'Nacional' },
                  { id: 'miskito', flag: '🌿', label: 'Miskitu', desc: 'RACCN' },
                  { id: 'creole', flag: '🌊', label: 'Creole', desc: 'RACCS' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLanguage(item.id as any)}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      language === item.id
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-102'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg">{item.flag}</span>
                    <span className="text-xs font-black mt-0.5">{item.label}</span>
                    <span className={`text-[9px] ${language === item.id ? 'text-teal-100' : 'text-slate-400'}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Territorial Location Selector */}
            <div className="space-y-2 pt-1">
              <label className="block text-[11px] font-black uppercase text-slate-500 tracking-wider text-center flex items-center justify-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 inline mr-1" />
                <span>{t.onboarding.territoryTitle}:</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={department}
                  onChange={e => {
                    const newDept = e.target.value;
                    setDepartment(newDept);
                    const firstMuni = NICARAGUA_DEPARTMENTS.find(d => d.name === newDept)?.municipalities[0] || newDept;
                    setMunicipality(firstMuni);
                  }}
                  className="p-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-teal-400 cursor-pointer"
                >
                  {NICARAGUA_DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>

                <select
                  value={municipality}
                  onChange={e => setMunicipality(e.target.value)}
                  className="p-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-teal-400 cursor-pointer"
                >
                  {NICARAGUA_DEPARTMENTS.find(d => d.name === department)?.municipalities.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-brand-earth-50 rounded-2xl p-3 border border-brand-earth-100 text-[11px] leading-relaxed text-brand-earth-700">
              Blooma funciona <strong>100% {t.nav.offlineMode}</strong>.
            </div>
          </div>
        )}

        {/* STEP 2: Selección de etapa */}
        {step === 2 && (
          <div className="space-y-5 flex-1 animate-page-enter">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-brand-earth-900">{t.onboarding.chooseGoalTitle}</h2>
              <p className="text-xs text-brand-earth-600">{t.onboarding.chooseGoalSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Opción Menstruación */}
              <button
                type="button"
                onClick={() => setStage('cycle')}
                className={`flex items-center p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                  stage === 'cycle'
                    ? 'border-brand-teal-500 bg-brand-teal-50/50 shadow-md ring-2 ring-brand-teal-200'
                    : 'border-brand-earth-200 bg-white hover:bg-brand-earth-50/50'
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-3.5 ${
                  stage === 'cycle' ? 'bg-brand-teal-100 text-brand-teal-600' : 'bg-brand-earth-100 text-brand-earth-600'
                }`}>
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-earth-900">{t.settings.cycleStageName}</h3>
                  <p className="text-[11px] text-brand-earth-600">{t.settings.cycleStageDesc}</p>
                </div>
              </button>

              {/* Opción Embarazo */}
              <button
                type="button"
                onClick={() => setStage('pregnancy')}
                className={`flex items-center p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                  stage === 'pregnancy'
                    ? 'border-brand-teal-500 bg-brand-teal-50/50 shadow-md ring-2 ring-brand-teal-200'
                    : 'border-brand-earth-200 bg-white hover:bg-brand-earth-50/50'
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-3.5 ${
                  stage === 'pregnancy' ? 'bg-brand-teal-100 text-brand-teal-600' : 'bg-brand-earth-100 text-brand-earth-600'
                }`}>
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-earth-900">{t.settings.pregnancyStageName}</h3>
                  <p className="text-[11px] text-brand-earth-600">{t.settings.pregnancyStageDesc}</p>
                </div>
              </button>

              {/* Opción Menopausia */}
              <button
                type="button"
                onClick={() => setStage('menopause')}
                className={`flex items-center p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                  stage === 'menopause'
                    ? 'border-brand-teal-500 bg-brand-teal-50/50 shadow-md ring-2 ring-brand-teal-200'
                    : 'border-brand-earth-200 bg-white hover:bg-brand-earth-50/50'
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-3.5 ${
                  stage === 'menopause' ? 'bg-brand-teal-100 text-brand-teal-600' : 'bg-brand-earth-100 text-brand-earth-600'
                }`}>
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-earth-900">{t.settings.menopauseStageName}</h3>
                  <p className="text-[11px] text-brand-earth-600">{t.settings.menopauseStageDesc}</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Configuración específica */}
        {step === 3 && (
          <div className="space-y-5 flex-1 animate-page-enter">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-brand-earth-900">{t.onboarding.step3Title}</h2>
              <p className="text-xs text-brand-earth-600">{t.onboarding.chooseGoalSubtitle}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-earth-700 uppercase tracking-wider mb-1">
                  {t.dashboards.ageLabel}
                </label>
                <input
                  type="number"
                  placeholder="Ej. 30"
                  value={age || ''}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-earth-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-300 bg-white text-xs"
                />
              </div>

              {/* Ajustes de ciclo */}
              {stage === 'cycle' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-brand-earth-700 uppercase tracking-wider mb-1">
                      {t.dashboards.logPeriodAction}
                    </label>
                    <input
                      type="date"
                      value={lastPeriodDate}
                      min={new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setLastPeriodDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-brand-earth-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-300 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-earth-700 uppercase tracking-wider mb-1">
                      {t.dashboards.cycleLengthCardTitle} ({avgCycleLength} {t.dashboards.daysUnit})
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="45"
                      value={avgCycleLength}
                      onChange={(e) => setAvgCycleLength(Number(e.target.value))}
                      className="w-full accent-brand-teal-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-brand-earth-500 px-1">
                      <span>20 {t.dashboards.daysUnit}</span>
                      <span className="font-bold text-brand-teal-700">{t.dashboards.regularBadge} (28)</span>
                      <span>45 {t.dashboards.daysUnit}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Ajustes de embarazo */}
              {stage === 'pregnancy' && (
                <div>
                  <label className="block text-xs font-bold text-brand-earth-700 uppercase tracking-wider mb-1">
                    {t.dashboards.pregnancyWeekBadge} ({gestationWeek})
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="42"
                    value={gestationWeek}
                    onChange={(e) => setGestationWeek(Number(e.target.value))}
                    className="w-full accent-brand-teal-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-brand-earth-500 px-1">
                    <span>Semana 1</span>
                    <span className="font-bold text-brand-teal-700">Semana {gestationWeek}</span>
                    <span>Semana 42</span>
                  </div>
                </div>
              )}

              {/* Ajustes de menopausia con 5 fases STRAW+10 */}
              {stage === 'menopause' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-brand-earth-700 uppercase tracking-wider">
                    {t.settings.climactericSectionTitle}:
                  </label>
                  
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {(Object.keys(CLIMACTERIC_STAGES) as ClimactericStage[]).map(key => {
                      const stg = CLIMACTERIC_STAGES[key];
                      const isSel = climactericStage === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setClimactericStage(key)}
                          className={`w-full p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                            isSel
                              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="font-black block text-xs">{stg.title}</span>
                          <span className={`text-[10px] block ${isSel ? 'text-teal-100' : 'text-slate-400'}`}>
                            {stg.ageRange} • {stg.shortBadge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Seguridad y Privacidad */}
        {step === 4 && (
          <div className="space-y-5 flex-1 animate-page-enter">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-brand-earth-900 flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-brand-teal-600" />
                {t.onboarding.securitySetupTitle}
              </h2>
              <p className="text-xs text-brand-earth-600">
                {t.onboarding.securitySetupSubtitle}
              </p>
            </div>

            <div className="space-y-3">
              {/* Bloqueo PIN */}
              <div className="border border-brand-earth-100 rounded-2xl p-3.5 bg-white space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-brand-earth-900">{t.settings.securityTitle}</h3>
                    <p className="text-[10px] text-brand-earth-600">{t.settings.securityDesc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pinEnabled}
                    onChange={(e) => setPinEnabled(e.target.checked)}
                    className="h-4 w-4 rounded text-brand-teal-600 focus:ring-brand-teal-400 accent-brand-teal-500 cursor-pointer"
                  />
                </div>
                {pinEnabled && (
                  <input
                    type="password"
                    maxLength={4}
                    pattern="\d*"
                    value={pinCode}
                    onChange={(e) => handlePinInput(e.target.value)}
                    placeholder={t.settings.pinCodeLabel}
                    className="w-full px-4 py-2 rounded-xl border border-brand-earth-200 text-center tracking-widest text-base font-bold bg-brand-earth-50 focus:outline-none focus:ring-2 focus:ring-brand-teal-300"
                  />
                )}
              </div>

              {/* Sincronización en la nube */}
              <div className="border border-brand-earth-100 rounded-2xl p-3.5 bg-white space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xs text-brand-earth-900">{t.settings.cloudBackupTitle}</h3>
                    <p className="text-[10px] text-brand-earth-600">{t.settings.cloudBackupDesc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={optInSync}
                    onChange={(e) => setOptInSync(e.target.checked)}
                    className="h-4 w-4 rounded text-brand-teal-600 focus:ring-brand-teal-400 accent-brand-teal-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones inferiores */}
        <div className="mt-6 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-brand-earth-200 text-brand-earth-700 font-bold text-xs hover:bg-brand-earth-100/50 transition-all cursor-pointer"
            >
              {t.nav.back}
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={step === 4 && pinEnabled && pinCode.length !== 4}
            className={`px-7 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all text-white cursor-pointer ${
              step === 4 && pinEnabled && pinCode.length !== 4
                ? 'bg-brand-earth-300 cursor-not-allowed'
                : 'bg-brand-teal-600 hover:bg-brand-teal-700'
            }`}
          >
            {step === 4 ? t.onboarding.startAppBtn : t.nav.next}
          </button>
        </div>

      </div>

    </div>
  );
}
