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
    <div className="min-h-screen bg-brand-earth-50 flex flex-col justify-between">
      
      {/* HEADER */}
      <header className="glass sticky top-0 z-40 border-b border-brand-earth-100/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 active-press cursor-pointer">
            <span className="text-2xl animate-pulse-soft">🌱</span>
            <span className="font-extrabold text-lg text-brand-earth-900 tracking-tight">Blooma</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Stage Indicator Badge */}
            <span className="text-[10px] font-extrabold uppercase bg-brand-teal-100 text-brand-teal-800 px-3 py-1 rounded-full flex items-center gap-1">
              {profile.stage === 'cycle' && (
                <>
                  <Activity className="h-3 w-3" />
                  Ciclo
                </>
              )}
              {profile.stage === 'pregnancy' && (
                <>
                  <Heart className="h-3 w-3" />
                  Embarazo
                </>
              )}
              {profile.stage === 'menopause' && (
                <>
                  <Shield className="h-3 w-3" />
                  Menopausia
                </>
              )}
            </span>

            {/* Offline Status */}
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 ${
              isOnline 
                ? 'bg-brand-teal-50 text-brand-teal-650' 
                : 'bg-brand-sand-200 text-brand-sand-700'
            }`}>
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3" />
                  En línea
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  Local
                </>
              )}
            </span>
          </div>
        </div>
      </header>

      {/* VIEW CONTROLLER */}
      <main className="flex-1 w-full max-w-4xl mx-auto pb-24 md:pb-6 px-4">
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
      </main>

      {/* RESPONSIVE BOTTOM NAVIGATION (Fixed at bottom for mobile, styled beautifully) */}
      <nav className="glass fixed bottom-0 left-0 right-0 border-t border-brand-earth-100 shadow-lg md:max-w-md md:mx-auto md:bottom-4 md:rounded-3xl z-40">
        <div className="grid grid-cols-4 py-2 px-1 text-center">
          
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 transition-all active-press ${
              activeTab === 'dashboard' ? 'text-brand-teal-600 scale-105 font-bold' : 'text-brand-earth-500 hover:text-brand-earth-700'
            }`}
          >
            <Calendar className={`h-5 w-5 transition-transform duration-200 ${activeTab === 'dashboard' ? 'scale-110' : ''}`} />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Hoy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('log')}
            className={`flex flex-col items-center justify-center py-1 transition-all active-press ${
              activeTab === 'log' ? 'text-brand-teal-600 scale-105 font-bold' : 'text-brand-earth-500 hover:text-brand-earth-700'
            }`}
          >
            <ClipboardList className={`h-5 w-5 transition-transform duration-200 ${activeTab === 'log' ? 'scale-110' : ''}`} />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Registrar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center py-1 transition-all active-press ${
              activeTab === 'history' ? 'text-brand-teal-600 scale-105 font-bold' : 'text-brand-earth-500 hover:text-brand-earth-700'
            }`}
          >
            <Database className={`h-5 w-5 transition-transform duration-200 ${activeTab === 'history' ? 'scale-110' : ''}`} />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Bitácora</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center py-1 transition-all active-press ${
              activeTab === 'settings' ? 'text-brand-teal-600 scale-105 font-bold' : 'text-brand-earth-500 hover:text-brand-earth-700'
            }`}
          >
            <SettingsIcon className={`h-5 w-5 transition-transform duration-200 ${activeTab === 'settings' ? 'scale-110' : ''}`} />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Ajustes</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
