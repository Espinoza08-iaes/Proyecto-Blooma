import React, { useState, useEffect } from 'react';
import { db, seedMaternalHouses, type Profile } from './db/db';
import Onboarding from './views/Onboarding';
import Settings from './views/Settings';
import LogSymptoms from './views/LogSymptoms';
import CycleDashboard from './views/CycleDashboard';
import PregnancyDashboard from './views/PregnancyDashboard';
import MenopauseDashboard from './views/MenopauseDashboard';
import History from './views/History';
import { Shield, Sparkles, Heart, Activity, Check, Settings as SettingsIcon, Calendar, ClipboardList, Database, Wifi, WifiOff } from 'lucide-react';
import BloomaLogo from './components/BloomaLogo';

import { syncLocalDataWithServer } from './db/supabase';

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Security PIN state
  const [pinVerified, setPinVerified] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active view router
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'history' | 'settings'>('dashboard');
  
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
    // Seed houses and load profile
    async function initApp() {
      await seedMaternalHouses();
      const userProfile = await db.profile.get('main');
      if (userProfile) {
        setProfile(userProfile);
        // If PIN is not enabled, automatically verify
        if (!userProfile.isPinEnabled) {
          setPinVerified(true);
        }
      }
      setLoading(false);
    }
    initApp();

    // Listeners for network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply personalization styles to document element
  useEffect(() => {
    if (!profile) return;
    
    // 1. Manage theme color class on body
    const bodyEl = document.body;
    bodyEl.classList.remove('theme-earth', 'theme-orchid', 'theme-forest', 'theme-ocean');
    const activeTheme = profile.themeColor || 'earth';
    bodyEl.classList.add(`theme-${activeTheme}`);

    // 2. Manage text size class on body
    if (profile.themeTextSize === 'large') {
      bodyEl.classList.add('text-large');
    } else {
      bodyEl.classList.remove('text-large');
    }

    // 3. Dynamic Favicon updater matching selected theme color
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

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile && inputPin === profile.pinCode) {
      setPinVerified(true);
      setPinError(false);
    } else {
      setPinError(true);
      setInputPin('');
      // Vibrate if available on mobile
      if (navigator.vibrate) navigator.vibrate(200);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-earth-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-teal-500 border-t-transparent mx-auto" />
          <p className="text-sm font-bold text-brand-earth-700 uppercase tracking-wider">Cargando Blooma...</p>
        </div>
      </div>
    );
  }

  // ONBOARDING
  if (!profile) {
    return (
      <div className="min-h-screen bg-brand-earth-50 flex items-center justify-center">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  // PIN ENTRY PAD (Lock screen)
  if (profile.isPinEnabled && !pinVerified) {
    return (
      <div className="min-h-screen bg-brand-earth-50 flex flex-col justify-center items-center px-4 py-8">
        <div className="max-w-md w-full glass rounded-3xl p-8 shadow-2xl border border-brand-earth-100 flex flex-col items-center justify-between min-h-[500px] animate-pop-in">
          
          <div className="text-center space-y-3 pt-6">
            <div className="mx-auto h-16 w-16 bg-brand-teal-50 text-brand-teal-600 rounded-full flex items-center justify-center shadow-md animate-pulse-soft">
              <Shield className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black text-brand-earth-900">Aplicación Bloqueada</h2>
            <p className="text-xs text-brand-earth-600">Por favor ingresa tu código PIN de seguridad.</p>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-4 my-8">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`h-4.5 w-4.5 rounded-full border-2 border-brand-earth-300 transition-all duration-150 ${
                  inputPin.length > idx 
                    ? 'bg-brand-teal-600 border-brand-teal-700 scale-110' 
                    : 'bg-white'
                }`}
              />
            ))}
          </div>

          {pinError && (
            <span className="text-xs text-brand-coral-600 font-bold bg-brand-coral-50 px-3 py-1 rounded-full border border-brand-coral-200 animate-bounce mb-2">
              PIN incorrecto. Inténtalo de nuevo.
            </span>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handlePinDigitClick(num)}
                className="h-14 rounded-2xl bg-white border border-brand-earth-200 hover:bg-brand-earth-50 text-brand-earth-900 font-extrabold text-xl flex items-center justify-center transition-all shadow-sm active-press"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setInputPin('')}
              className="h-14 rounded-2xl bg-brand-earth-100 hover:bg-brand-earth-200 text-brand-earth-700 font-bold text-xs uppercase flex items-center justify-center transition-all shadow-sm active-press"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => handlePinDigitClick('0')}
              className="h-14 rounded-2xl bg-white border border-brand-earth-200 hover:bg-brand-earth-50 text-brand-earth-900 font-extrabold text-xl flex items-center justify-center transition-all shadow-sm active-press"
            >
              0
            </button>
            <button
              type="button"
              onClick={handlePinBackspace}
              className="h-14 rounded-2xl bg-brand-earth-100 hover:bg-brand-earth-200 text-brand-earth-700 font-bold text-lg flex items-center justify-center transition-all shadow-sm active-press"
            >
              ⌫
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-earth-50 via-white to-brand-teal-50/10 flex flex-col justify-between">
      
      {/* HEADER */}
      <header className="glass sticky top-0 z-40 border-b border-brand-earth-100/40 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 active-press cursor-pointer">
            <BloomaLogo variant={profile?.appIcon || 'sprout'} className="h-7 w-7 text-brand-teal-650 animate-pulse-soft" />
            <span className="font-black text-xl text-brand-earth-900 tracking-tight font-display">Blooma</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Stage Indicator Badge */}
            <span className="text-[10px] font-extrabold uppercase bg-brand-teal-150 text-brand-teal-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-brand-teal-200/30">
              {profile.stage === 'cycle' && (
                <>
                  <Activity className="h-3.5 w-3.5 text-brand-teal-700" />
                  Ciclo
                </>
              )}
              {profile.stage === 'pregnancy' && (
                <>
                  <Heart className="h-3.5 w-3.5 text-brand-coral-500 fill-brand-coral-500" />
                  Embarazo
                </>
              )}
              {profile.stage === 'menopause' && (
                <>
                  <Shield className="h-3.5 w-3.5 text-indigo-650" />
                  Menopausia
                </>
              )}
            </span>

            {/* Offline Status */}
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border ${
              isOnline 
                ? 'bg-brand-teal-50 text-brand-teal-650 border-brand-teal-200/20' 
                : 'bg-brand-sand-200 text-brand-sand-700 border-brand-sand-300/30'
            }`}>
              {isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-brand-teal-500" />
                  En línea
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-brand-sand-500" />
                  Local
                </>
              )}
            </span>
          </div>
        </div>
      </header>

      {/* VIEW CONTROLLER (Responsive Grid) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR (Desktop only) */}
          <aside className="hidden md:flex md:col-span-4 lg:col-span-3 flex-col gap-5 sticky top-20">
            {/* Profile widget */}
            <div className="glass rounded-3xl p-5 border border-brand-earth-100/80 shadow-md card-hover space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-teal-400 to-brand-teal-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                  {profile.age || '?'}
                </div>
                <div>
                  <h3 className="font-extrabold text-brand-earth-900 leading-tight text-sm">Usuario de Blooma</h3>
                  <span className="text-[10px] text-brand-teal-700 font-extrabold uppercase tracking-wider">
                    {profile.stage === 'cycle' ? 'Ciclo Menstrual' : profile.stage === 'pregnancy' ? 'Embarazo Activo' : 'Menopausia'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-brand-earth-100/60 pt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-brand-earth-500 font-medium">Edad:</span>
                  <span className="font-bold text-brand-earth-900">{profile.age ? `${profile.age} años` : 'No especificada'}</span>
                </div>
                {profile.stage === 'pregnancy' && profile.gestationWeekStart && (
                  <div className="flex justify-between items-center">
                    <span className="text-brand-earth-500 font-medium">Inicio Gestación:</span>
                    <span className="font-bold text-brand-earth-900">{profile.gestationWeekStart}</span>
                  </div>
                )}
                {profile.stage === 'menopause' && profile.menopauseStartYear && (
                  <div className="flex justify-between items-center">
                    <span className="text-brand-earth-500 font-medium">Año de Transición:</span>
                    <span className="font-bold text-brand-earth-900">{profile.menopauseStartYear}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick summary widget */}
            <div className="glass rounded-3xl p-5 border border-brand-earth-100/80 shadow-md card-hover space-y-2.5">
              <h4 className="font-extrabold text-brand-earth-900 text-[10px] uppercase tracking-wider">Resumen de Etapa</h4>
              <p className="text-xs text-brand-earth-600 leading-relaxed">
                {profile.stage === 'cycle' 
                  ? 'Registra tus síntomas diariamente. Esto ayuda al modelo a predecir tu periodo menstrual y ventana fértil con mayor precisión.'
                  : profile.stage === 'pregnancy'
                  ? 'Monitorea tus síntomas de riesgo con el triaje automatizado y localiza Casas Maternas regionales para asistencia preventiva.'
                  : 'Registra tus calores súbitos y calidad del sueño para dar seguimiento a los patrones de tu transición biológica.'}
              </p>
            </div>
          </aside>

          {/* MAIN PAGE (Central Content) */}
          <section className="col-span-1 md:col-span-8 lg:col-span-6 space-y-6">
            {activeTab === 'dashboard' && (
              <div className="animate-page-enter">
                {profile.stage === 'cycle' && <CycleDashboard />}
                {profile.stage === 'pregnancy' && <PregnancyDashboard />}
                {profile.stage === 'menopause' && <MenopauseDashboard />}
              </div>
            )}
            
            {activeTab === 'log' && (
              <div className="animate-page-enter">
                <LogSymptoms stage={profile.stage} onSave={() => setActiveTab('dashboard')} />
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="animate-page-enter">
                <History stage={profile.stage} />
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="animate-page-enter">
                <Settings 
                  profile={profile} 
                  onProfileUpdate={(updated) => setProfile(updated)} 
                  onResetApp={handleReset} 
                  authToken={authToken}
                  onTokenUpdate={setAuthToken}
                />
              </div>
            )}
          </section>

          {/* RIGHT SIDEBAR (Desktop/Large screen only) */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-5 sticky top-20">
            {/* Wellness tip */}
            <div className="glass rounded-3xl p-5 border border-brand-earth-100/80 shadow-md card-hover space-y-3">
              <div className="flex items-center gap-2 text-brand-teal-600">
                <Sparkles className="h-4.5 w-4.5 animate-pulse-soft" />
                <h4 className="font-extrabold text-brand-earth-900 text-[10px] uppercase tracking-wider">Consejo del Día</h4>
              </div>
              <p className="text-xs text-brand-earth-650 leading-relaxed">
                Beber suficiente agua, regular tu ciclo de descanso y caminar 30 minutos al día ayuda notablemente a balancear tus hormonas y aliviar dolores físicos.
              </p>
            </div>

            {/* Assistance hotline */}
            <div className="glass rounded-3xl p-5 border border-brand-coral-100/80 shadow-md card-hover bg-brand-coral-50/10 space-y-3">
              <h4 className="font-extrabold text-brand-coral-800 text-[10px] uppercase tracking-wider">Línea de Asistencia</h4>
              <p className="text-xs text-brand-earth-600 leading-relaxed">
                Ante cualquier síntoma de alarma grave o una emergencia obstétrica, puedes llamar gratis a nivel nacional:
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <a href="tel:102" className="flex items-center justify-between text-xs font-bold text-brand-coral-750 bg-white hover:bg-brand-coral-50 border border-brand-coral-100 py-2 px-3 rounded-xl transition-all shadow-sm active-press">
                  <span>Línea Materna MINSA</span>
                  <span>102</span>
                </a>
                <a href="tel:118" className="flex items-center justify-between text-xs font-bold text-brand-earth-700 bg-white hover:bg-brand-earth-50 border border-brand-earth-200 py-2 px-3 rounded-xl transition-all shadow-sm active-press">
                  <span>Cruz Roja</span>
                  <span>118</span>
                </a>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* RESPONSIVE BOTTOM NAVIGATION (Floating Dock with sliding active indicator) */}
      <nav className="fixed bottom-5 left-4 right-4 md:max-w-md md:mx-auto rounded-2xl glass shadow-xl border border-brand-earth-150/40 z-45 bg-white/70 backdrop-blur-md">
        {(() => {
          const tabs = [
            { id: 'dashboard' as const, label: 'Hoy', icon: Calendar },
            { id: 'log' as const, label: 'Registrar', icon: ClipboardList },
            { id: 'history' as const, label: 'Bitácora', icon: Database },
            { id: 'settings' as const, label: 'Ajustes', icon: SettingsIcon }
          ];
          const activeIndex = tabs.findIndex(t => t.id === activeTab);
          
          return (
            <div className="relative grid grid-cols-4 py-2.5 px-2 text-center items-center">
              {/* Sliding Pill Background Indicator */}
              <div 
                className="absolute top-1.5 bottom-1.5 rounded-xl bg-brand-teal-500/10 border border-brand-teal-500/15 transition-all duration-300 ease-out -z-10"
                style={{
                  width: 'calc(25% - 12px)',
                  left: `calc(${activeIndex * 25}% + 6px)`,
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
                    className={`relative flex flex-col items-center justify-center py-1 transition-all active-press ${
                      isActive ? 'text-brand-teal-700 font-extrabold scale-105' : 'text-brand-earth-500 hover:text-brand-earth-700'
                    }`}
                  >
                    <Icon className={`h-5 w-5 transition-all duration-300 ${isActive ? 'scale-110 text-brand-teal-600 rotate-3' : ''}`} />
                    <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">{tab.label}</span>
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
