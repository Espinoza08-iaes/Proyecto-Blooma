import React, { useState, useEffect } from 'react';
import { X, User, Heart, Lock, Cloud, Sparkles, HelpCircle, ChevronRight, Watch, EyeOff, BarChart2, Shield, RefreshCw, Key } from 'lucide-react';
import { db, type Profile } from '../db/db';
import { apiGoogleAuth, apiRegister, apiLogin } from '../db/supabase';

import WearableTelemetryModal from './WearableTelemetryModal';

interface ProfileSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onProfileUpdate: (updated: Profile) => void;
  onResetApp: () => void;
}

export default function ProfileSettingsDrawer({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
  onResetApp
}: ProfileSettingsDrawerProps) {
  const [activeStage, setActiveStage] = useState<'cycle' | 'pregnancy' | 'menopause'>('cycle');
  const [conceptionMode, setConceptionMode] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pinCode, setPinCode] = useState('1234');
  const [discreteMode, setDiscreteMode] = useState(false);
  const PRESET_AVATARS = ['🦙', '🌸', '🦊', '👑', '🦋', '🌿', '👶', '🌙', '💃', '🍉', '🧘‍♀️', '🦄', '🌷', '🌺', '🎨', '✨'];
  const [selectedEmoji, setSelectedEmoji] = useState('🦙');
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  const handleSelectPresetAvatar = async (emoji: string) => {
    setSelectedEmoji(emoji);
    setCustomAvatar(null);
    if (profile) {
      const updated: Profile = {
        ...profile,
        appIcon: emoji,
        customAvatarUrl: undefined
      };
      await db.profile.put(updated, 'main');
      onProfileUpdate(updated);
    }
  };

  // Wearable Telemetry modal state
  const [isWearableModalOpen, setIsWearableModalOpen] = useState(false);

  // Account Linking Form state
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [linkedAccount, setLinkedAccount] = useState<string | null>(null);
  const [authStatusMsg, setAuthStatusMsg] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setActiveStage(profile.stage || 'cycle');
      setConceptionMode(profile.conceptionMode || false);
      setSyncEnabled(profile.optInSync || false);
      setPinEnabled(profile.isPinEnabled || false);
      setPinCode(profile.pinCode || '1234');
      setDiscreteMode(profile.isDiscreteMode || false);
      setSelectedEmoji(profile.appIcon || '🦙');
      setCustomAvatar(profile.customAvatarUrl || null);
    }
  }, [profile]);

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Url = reader.result as string;
        setCustomAvatar(base64Url);
        if (profile) {
          const updated: Profile = {
            ...profile,
            customAvatarUrl: base64Url
          };
          await db.profile.put(updated, 'main');
          onProfileUpdate(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleGoalChange = async (stage: 'cycle' | 'pregnancy' | 'menopause', isConception = false) => {
    setActiveStage(stage);
    setConceptionMode(isConception);

    if (profile) {
      const updated: Profile = {
        ...profile,
        stage,
        conceptionMode: isConception
      };

      await db.profile.put(updated, 'main');
      onProfileUpdate(updated);
    }
  };

  const handleAccessModeChange = async (usePin: boolean) => {
    setPinEnabled(usePin);

    if (profile) {
      const updated: Profile = {
        ...profile,
        isPinEnabled: usePin,
        pinCode: usePin ? (pinCode || '1234') : ''
      };

      await db.profile.put(updated, 'main');
      onProfileUpdate(updated);
    }
  };

  const handleGoogleAuth = async () => {
    setIsAuthLoading(true);
    setAuthStatusMsg('');
    try {
      // Simulate / Execute Google OAuth API Call
      const res = await apiGoogleAuth('google_token_oauth_simulated');
      setLinkedAccount('Google Account (conectado)');
      setAuthStatusMsg('✅ Cuenta de Google vinculada con éxito.');
      setSyncEnabled(true);
      if (profile) {
        const updated: Profile = { ...profile, optInSync: true };
        await db.profile.put(updated, 'main');
        onProfileUpdate(updated);
      }
    } catch (err: any) {
      setAuthStatusMsg(`❌ ${err.message || 'Error al conectar con Google.'}`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleEmailPassRegister = async () => {
    if (!accountEmail || !accountPassword) {
      setAuthStatusMsg('⚠️ Ingresa un correo y contraseña válidos.');
      return;
    }
    setIsAuthLoading(true);
    setAuthStatusMsg('');
    try {
      await apiRegister(accountEmail, accountPassword);
      setLinkedAccount(accountEmail);
      setAuthStatusMsg('✅ Cuenta vinculada y registrada en Supabase.');
      setSyncEnabled(true);
      if (profile) {
        const updated: Profile = { ...profile, optInSync: true };
        await db.profile.put(updated, 'main');
        onProfileUpdate(updated);
      }
    } catch (err: any) {
      setAuthStatusMsg(`❌ ${err.message || 'Error al vincular cuenta.'}`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-rose-100/80 via-purple-50/50 to-slate-100 flex flex-col w-screen h-screen min-h-screen overflow-y-auto animate-fade-in relative overflow-x-hidden">
      
      {/* Background ambient mesh spheres for desktop symmetry */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-rose-300/40 via-pink-200/30 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-[5%] right-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-purple-300/40 via-indigo-200/30 to-transparent rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-gradient-to-tr from-amber-200/40 via-rose-200/30 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-gradient-to-tr from-teal-200/40 via-emerald-100/30 to-transparent rounded-full blur-3xl animate-float-reverse" />

        {/* Organic Floral SVG Watermarks */}
        <svg className="absolute top-16 left-10 w-72 h-72 text-rose-300/25 mix-blend-multiply hidden xl:block" viewBox="0 0 200 200" fill="currentColor">
          <path d="M100,20 C120,60 160,80 200,100 C160,120 120,140 100,180 C80,140 40,120 0,100 C40,80 80,60 100,20 Z" />
        </svg>

        <svg className="absolute bottom-16 right-10 w-80 h-80 text-purple-300/25 mix-blend-multiply hidden xl:block" viewBox="0 0 200 200" fill="currentColor">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M100,30 C130,70 170,100 100,170 C30,100 70,70 100,30 Z" />
        </svg>
      </div>

      {/* Top Bar Header */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Ajustes y Cuenta Blooma</h2>

        <div className="w-8" />
      </div>

      {/* Content Container Card (Glassmorphic Container on Laptop & Mobile) */}
      <div className="max-w-xl w-full mx-auto my-4 p-6 sm:p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/80 space-y-6 flex-1 mb-20">
        
        {/* Profile Card Header with Custom Avatar Upload */}
        <div className="flex items-center space-x-4 p-4 rounded-3xl bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 border border-rose-100 relative">
          <label className="relative group cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-purple-500 text-white flex items-center justify-center text-2xl shadow-md overflow-hidden border-2 border-white">
              {customAvatar ? (
                <img src={customAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{selectedEmoji}</span>
              )}
            </div>
            <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Cambiar
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarFileUpload}
              className="hidden"
            />
          </label>

          <div>
            <h3 className="text-base font-extrabold text-slate-900">Usuario de Blooma</h3>
            <span className="text-xs font-bold text-rose-600 block">
              {linkedAccount ? `Cuenta: ${linkedAccount}` : 'Modo Privado Off-grid (Sin cuenta requerida)'}
            </span>
            <label className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800 cursor-pointer block mt-0.5">
              📷 Cargar Foto de Perfil Personalizada
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* PRESET AVATAR ICON SELECTION GALLERY */}
        <div className="p-4 rounded-3xl bg-pink-50/50 border border-pink-100 space-y-2">
          <span className="text-[10px] font-black uppercase text-pink-700 tracking-wider block">
            Colección de Iconos de Perfil Predefinidos:
          </span>

          <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none">
            {PRESET_AVATARS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelectPresetAvatar(emoji)}
                className={`w-10 h-10 rounded-2xl text-lg flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                  !customAvatar && selectedEmoji === emoji
                    ? 'bg-rose-500 text-white shadow-md ring-4 ring-rose-200 scale-110'
                    : 'bg-white text-slate-700 border border-slate-200 hover:scale-105'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 1: GOOGLE OAUTH & EMAIL PASSWORD LINKING */}
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center space-x-2 text-rose-600">
            <Cloud className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">Vincular Cuenta (Google o Contraseña)</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Puedes decidir si deseas vincular una cuenta de Google con tu contraseña para respaldar en Supabase o mantener tus datos 100% locales en tu dispositivo.
          </p>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isAuthLoading}
            className="w-full py-3 rounded-2xl bg-white border border-slate-300 text-slate-800 font-extrabold text-xs shadow-sm hover:bg-slate-100 flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-98"
          >
            <span className="text-base">🌐</span>
            <span>Vincular con Cuenta de Google</span>
          </button>

          <div className="pt-2 space-y-2">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={accountEmail}
              onChange={e => setAccountEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800"
            />
            <input
              type="password"
              placeholder="Contraseña de acceso"
              value={accountPassword}
              onChange={e => setAccountPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800"
            />
            <button
              type="button"
              onClick={handleEmailPassRegister}
              disabled={isAuthLoading}
              className="w-full py-2.5 rounded-xl bg-rose-500 text-white font-extrabold text-xs shadow-md hover:bg-rose-600 transition-all cursor-pointer"
            >
              Registrar / Vincular por Correo y Contraseña
            </button>
          </div>

          {authStatusMsg && (
            <p className="text-xs font-bold mt-2 text-slate-700">{authStatusMsg}</p>
          )}
        </div>

        {/* SECTION 2: ACCESS SECURITY MODE (WITH OR WITHOUT PASSWORD/PIN) */}
        <div className="p-5 rounded-3xl bg-rose-50/60 border border-rose-100 space-y-3">
          <div className="flex items-center space-x-2 text-rose-600">
            <Lock className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">Modo de Acceso a la Aplicación</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Decide si deseas solicitar un PIN / Contraseña de acceso cada vez que se abra la app o permitir entrada directa sin contraseña.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleAccessModeChange(false)}
              className={`p-3 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-1 ${
                !pinEnabled
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg">🔓</span>
              <span>Sin Contraseña (Entrada Directa)</span>
            </button>

            <button
              type="button"
              onClick={() => handleAccessModeChange(true)}
              className={`p-3 rounded-2xl text-xs font-extrabold border transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-1 ${
                pinEnabled
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg">🔒</span>
              <span>Con PIN / Contraseña de 4 dígitos</span>
            </button>
          </div>
        </div>

        {/* SECTION 3: MI OBJETIVO PRINCIPAL */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">MI OBJETIVO PRINCIPAL:</h3>

          <div className="grid grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={() => handleGoalChange('cycle', false)}
              className={`p-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-3 text-left border ${
                activeStage === 'cycle' && !conceptionMode
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-xl">🌸</span>
              <div>
                <span className="block font-black">Seguir mi ciclo</span>
                <span className={`text-[10px] font-medium block ${activeStage === 'cycle' && !conceptionMode ? 'text-rose-100' : 'text-slate-400'}`}>
                  Monitoreo de periodo y predicciones habituales
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleGoalChange('cycle', true)}
              className={`p-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-3 text-left border ${
                activeStage === 'cycle' && conceptionMode
                  ? 'bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-xl">👶</span>
              <div>
                <span className="block font-black">Planificar embarazo</span>
                <span className={`text-[10px] font-medium block ${activeStage === 'cycle' && conceptionMode ? 'text-pink-100' : 'text-slate-400'}`}>
                  Ventana fértil, ovulación e indicadores de concepción
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleGoalChange('pregnancy', false)}
              className={`p-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-3 text-left border ${
                activeStage === 'pregnancy'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-xl">🤰</span>
              <div>
                <span className="block font-black">Monitorear embarazo</span>
                <span className={`text-[10px] font-medium block ${activeStage === 'pregnancy' ? 'text-amber-100' : 'text-slate-400'}`}>
                  Semanas gestacionales y triaje obstétrico MINSA
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleGoalChange('menopause', false)}
              className={`p-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-3 text-left border ${
                activeStage === 'menopause'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-xl">🌿</span>
              <div>
                <span className="block font-black">Gestionar menopausia</span>
                <span className={`text-[10px] font-medium block ${activeStage === 'menopause' ? 'text-teal-100' : 'text-slate-400'}`}>
                  Sofocos, TCC y confort térmico
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Grouped Settings Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          
          <div
            onClick={() => setIsWearableModalOpen(true)}
            className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Watch className="w-5 h-5 text-indigo-600" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Reloj y Anillo Inteligente</h4>
                <span className="text-[10px] text-slate-400">Android Health Connect, Apple HealthKit o BLE</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <EyeOff className="w-5 h-5 text-slate-700" />
              <span className="text-xs font-bold text-slate-900">Modo discreto (Ocultar términos explícitos)</span>
            </div>
            <input
              type="checkbox"
              checked={discreteMode}
              onChange={e => {
                setDiscreteMode(e.target.checked);
                if (profile) {
                  const updated = { ...profile, isDiscreteMode: e.target.checked };
                  db.profile.put(updated, 'main');
                  onProfileUpdate(updated);
                }
              }}
              className="rounded text-rose-500 focus:ring-rose-400 cursor-pointer"
            />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-slate-700" />
              <span className="text-xs font-bold text-slate-900">Ayuda y Soporte Clínico MINSA</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

        </div>

        {/* Reset App Action */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => {
              onResetApp();
              onClose();
            }}
            className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
          >
            Reiniciar aplicación y datos locales
          </button>
        </div>

      </div>

      {/* Smartwatch / Ring Telemetry Modal */}
      <WearableTelemetryModal
        isOpen={isWearableModalOpen}
        onClose={() => setIsWearableModalOpen(false)}
        stage={activeStage}
        conceptionMode={conceptionMode}
      />
    </div>
  );
}
