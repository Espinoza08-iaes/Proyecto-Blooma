import React, { useState, useEffect } from 'react';
import { db, seedMaternalHouses, type Profile } from './db/db';
import Onboarding from './views/Onboarding';
import LogSymptoms from './views/LogSymptoms';
import CycleDashboard from './views/CycleDashboard';
import PregnancyDashboard from './views/PregnancyDashboard';
import MenopauseDashboard from './views/MenopauseDashboard';
import ConceptionPlannerDashboard from './views/ConceptionPlannerDashboard';
import History from './views/History';
import ProfileSettingsDrawer from './components/ProfileSettingsDrawer';
import FullCalendarModal from './components/FullCalendarModal';
import { Sparkles, Calendar, ClipboardList, Database } from 'lucide-react';

import { syncLocalDataWithServer } from './db/supabase';

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Security PIN state
  const [pinVerified, setPinVerified] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active view router (3 tabs: dashboard, log, history)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'history'>('dashboard');
  
  // Network connection status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Cloud Auth token
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('blooma_auth_token'));

  // Background cloud synchronization effect
  useEffect(() => {
    if (profile?.optInSync && authToken && isOnline) {
      console.log('Iniciando sincronización automática en segundo plano...');
      syncLocalDataWithServer(authToken)
        .then(res => {
          if (res.success) {
            console.log('Sincronización en segundo plano exitosa.');
          }
        });
    }
  }, [profile?.optInSync, authToken, isOnline, activeTab]);

  useEffect(() => {
    async function initApp() {
      await seedMaternalHouses();
      const userProfile = await db.profile.get('main');
      if (userProfile) {
        setProfile(userProfile);
        if (!userProfile.isPinEnabled) {
          setPinVerified(true);
        }
      }
      setLoading(false);
    }
    initApp();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!profile) return;
    
    const bodyEl = document.body;
    bodyEl.classList.remove('theme-earth', 'theme-orchid', 'theme-forest', 'theme-ocean');
    const activeTheme = profile.themeColor || 'earth';
    bodyEl.classList.add(`theme-${activeTheme}`);

    if (profile.themeTextSize === 'large') {
      bodyEl.classList.add('text-large');
    } else {
      bodyEl.classList.remove('text-large');
    }

    const faviconEl = document.querySelector("link[rel='icon']");
    if (faviconEl) {
      faviconEl.setAttribute('href', `/favicon-${activeTheme}.svg`);
    }
  }, [profile?.themeColor, profile?.themeTextSize]);

  const handleOnboardingComplete = (newProfile: Profile) => {
    setProfile(newProfile);
    setPinVerified(true);
  };

  const handleReset = () => {
    setProfile(null);
    setPinVerified(false);
    setInputPin('');
    setActiveTab('dashboard');
  };

  const handlePinDigitClick = (num: string) => {
    if (inputPin.length < 4) {
      const nextPin = inputPin + num;
      setInputPin(nextPin);
      if (nextPin.length === 4 && profile) {
        if (nextPin === profile.pinCode) {
          setPinVerified(true);
          setPinError(false);
        } else {
          setPinError(true);
          setInputPin('');
          if (navigator.vibrate) navigator.vibrate(200);
        }
      }
    }
  };

  const handlePinBackspace = () => {
    setInputPin(prev => prev.slice(0, -1));
  };

  // Enable physical keyboard / Numpad input for PIN code
  useEffect(() => {
    if (!profile?.isPinEnabled || pinVerified) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handlePinDigitClick(e.key);
      } else if (e.key === 'Backspace') {
        handlePinBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profile?.isPinEnabled, pinVerified, inputPin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <span className="text-xs font-bold text-slate-500">Cargando Blooma...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (profile.isPinEnabled && !pinVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl text-center space-y-6">
          <div>
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-3">
              🌸
            </div>
            <h2 className="text-lg font-black text-slate-900">Blooma Protegida</h2>
            <p className="text-xs text-slate-500 mt-1">Ingresa tu código PIN de 4 dígitos</p>
          </div>

          <div className="flex justify-center space-x-3">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  inputPin.length > i ? 'bg-rose-500 border-rose-500 scale-110' : 'border-slate-300'
                }`}
              />
            ))}
          </div>

          {pinError && (
            <p className="text-xs font-bold text-rose-600 animate-shake">PIN incorrecto. Intenta de nuevo.</p>
          )}

          <div className="grid grid-cols-3 gap-3 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handlePinDigitClick(num)}
                className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-lg flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                {num}
              </button>
            ))}
            <div />
            <button
              type="button"
              onClick={() => handlePinDigitClick('0')}
              className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-lg flex items-center justify-center cursor-pointer active:scale-95 transition-all"
            >
              0
            </button>
            <button
              type="button"
              onClick={handlePinBackspace}
              className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center cursor-pointer active:scale-95 transition-all"
            >
              ⌫
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100/70 via-purple-50/50 to-slate-100 flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Dynamic Multi-Point Ambient Mesh Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        {/* Coral Rose Orb */}
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-rose-300/40 via-pink-200/30 to-transparent rounded-full blur-3xl animate-float-slow" />
        
        {/* Lavender Indigo Orb */}
        <div className="absolute top-[5%] right-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-purple-300/40 via-indigo-200/30 to-transparent rounded-full blur-3xl animate-float-reverse" />
        
        {/* Sunset Peach Orb */}
        <div className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-gradient-to-tr from-amber-200/40 via-rose-200/30 to-transparent rounded-full blur-3xl animate-float-slow" />
        
        {/* Mint Teal Orb */}
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-gradient-to-tr from-teal-200/40 via-emerald-100/30 to-transparent rounded-full blur-3xl animate-float-reverse" />

        {/* Organic Floral SVG Watermarks */}
        <svg className="absolute top-12 left-8 w-64 h-64 text-rose-300/20 mix-blend-multiply hidden xl:block" viewBox="0 0 200 200" fill="currentColor">
          <path d="M100,20 C120,60 160,80 200,100 C160,120 120,140 100,180 C80,140 40,120 0,100 C40,80 80,60 100,20 Z" />
        </svg>

        <svg className="absolute bottom-20 right-12 w-80 h-80 text-purple-300/20 mix-blend-multiply hidden xl:block" viewBox="0 0 200 200" fill="currentColor">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M100,30 C130,70 170,100 100,170 C30,100 70,70 100,30 Z" />
        </svg>
      </div>
      
      {/* Root Level Full-Screen Profile Drawer */}
      <ProfileSettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        profile={profile}
        onProfileUpdate={updated => setProfile(updated)}
        onResetApp={handleReset}
      />

      {/* Root Level Full-Screen Calendar Modal (Wall to Wall) */}
      <FullCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />

      {/* VIEW CONTROLLER (Responsive Layout) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR (Desktop only) */}
          <aside className="hidden md:flex md:col-span-4 lg:col-span-3 flex-col gap-5 sticky top-6 pt-4">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white text-slate-700 flex items-center justify-center font-extrabold text-sm shadow-sm overflow-hidden border-2 border-slate-200 p-1">
                  {profile.customAvatarUrl ? (
                    <img src={profile.customAvatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : profile.appIcon === 'blooma' || !profile.appIcon || profile.appIcon === '🦙' ? (
                    <img src="/blooma_isotipo.png" alt="Isotipo Oficial Blooma" className="w-full h-full object-contain" />
                  ) : (
                    <span>{profile.appIcon}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 leading-tight text-sm">Usuario de Blooma</h3>
                  <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wider">
                    {profile.stage === 'cycle'
                      ? profile.conceptionMode ? 'Planificar Embarazo' : 'Ciclo Menstrual'
                      : profile.stage === 'pregnancy'
                      ? 'Embarazo Activo'
                      : 'Menopausia'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Edad:</span>
                  <span className="font-bold text-slate-900">{profile.age ? `${profile.age} años` : 'No especificada'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-2.5">
              <h4 className="font-extrabold text-slate-900 text-[10px] uppercase tracking-wider">Resumen de Etapa</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {profile.stage === 'cycle' 
                  ? profile.conceptionMode
                    ? 'Monitoreo de ovulación y ventana fértil optimizada para concepción.'
                    : 'Registra tus síntomas diariamente para predecir tu periodo y ventana fértil.'
                  : profile.stage === 'pregnancy'
                  ? 'Monitorea tus síntomas con el triaje automatizado del MINSA.'
                  : 'Registra tus calores súbitos y descanso nocturno.'}
              </p>
            </div>
          </aside>

          {/* MAIN PAGE (Central Content) */}
          <section className="col-span-1 md:col-span-8 lg:col-span-6 space-y-6">
            {activeTab === 'dashboard' && (
              <div className="animate-page-enter">
                {profile.stage === 'cycle' && (
                  profile.conceptionMode ? (
                    <ConceptionPlannerDashboard
                      profile={profile}
                      onOpenDrawer={() => setIsDrawerOpen(true)}
                      onOpenCalendar={() => setIsCalendarOpen(true)}
                    />
                  ) : (
                    <CycleDashboard
                      profile={profile}
                      onOpenDrawer={() => setIsDrawerOpen(true)}
                      onOpenCalendar={() => setIsCalendarOpen(true)}
                    />
                  )
                )}
                {profile.stage === 'pregnancy' && (
                  <PregnancyDashboard
                    profile={profile}
                    onOpenDrawer={() => setIsDrawerOpen(true)}
                    onOpenCalendar={() => setIsCalendarOpen(true)}
                  />
                )}
                {profile.stage === 'menopause' && (
                  <MenopauseDashboard
                    profile={profile}
                    onOpenDrawer={() => setIsDrawerOpen(true)}
                    onOpenCalendar={() => setIsCalendarOpen(true)}
                  />
                )}
              </div>
            )}
            
            {activeTab === 'log' && (
              <div className="animate-page-enter pt-4">
                <LogSymptoms stage={profile.stage} onSave={() => setActiveTab('dashboard')} />
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="animate-page-enter pt-4">
                <History stage={profile.stage} />
              </div>
            )}
          </section>

          {/* RIGHT SIDEBAR (Desktop only) */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-5 sticky top-6 pt-4">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-teal-600">
                <Sparkles className="h-4.5 w-4.5" />
                <h4 className="font-extrabold text-slate-900 text-[10px] uppercase tracking-wider">Consejo del Día</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Beber suficiente agua y caminar 30 minutos al día ayuda a regular el balance hormonal.
              </p>
            </div>

            <div className="bg-rose-50/80 backdrop-blur-md rounded-3xl p-5 border border-rose-100 shadow-md space-y-3">
              <h4 className="font-extrabold text-rose-800 text-[10px] uppercase tracking-wider">Línea de Asistencia MINSA</h4>
              <div className="flex flex-col gap-1.5 pt-1">
                <a href="tel:102" className="flex items-center justify-between text-xs font-bold text-rose-700 bg-white border border-rose-200 py-2 px-3 rounded-xl shadow-sm">
                  <span>Línea Materna MINSA</span>
                  <span>102</span>
                </a>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* RESPONSIVE BOTTOM NAVIGATION (3 TABS: HOY | REGISTRAR | BITÁCORA) */}
      <nav className="fixed bottom-4 left-4 right-4 md:max-w-md md:mx-auto rounded-2xl bg-white/90 backdrop-blur-md shadow-2xl border border-slate-200/80 z-40">
        {(() => {
          const tabs = [
            { id: 'dashboard' as const, label: 'Hoy', icon: Calendar },
            { id: 'log' as const, label: 'Registrar', icon: ClipboardList },
            { id: 'history' as const, label: 'Bitácora', icon: Database },
          ];
          const activeIndex = tabs.findIndex(t => t.id === activeTab);
          
          return (
            <div className="relative grid grid-cols-3 py-2.5 px-2 text-center items-center">
              <div 
                className="absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white transition-all duration-300 ease-out -z-10 shadow-md shadow-rose-200"
                style={{
                  width: 'calc(33.33% - 12px)',
                  left: `calc(${activeIndex * 33.33}% + 6px)`,
                }}
              />

              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
                      isActive ? 'text-white font-extrabold scale-105' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 transition-transform" />
                    <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })()}
      </nav>

    </div>
  );
}
