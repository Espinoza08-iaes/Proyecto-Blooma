import React, { useState } from 'react';
import { db, type Profile } from '../db/db';
import { Shield, Bell, Database, Trash2, Download, RefreshCw, LifeBuoy, LogOut, KeyRound, Mail, Palette, Type, ChevronRight, Watch, Lock, EyeOff } from 'lucide-react';
import { apiLogin, apiRegister, syncLocalDataWithServer, apiDeleteAccount, apiUpdateProfile } from '../db/supabase';

interface SettingsProps {
  profile: Profile;
  onProfileUpdate: (updated: Profile) => void;
  onResetApp: () => void;
  authToken: string | null;
  onTokenUpdate: (token: string | null) => void;
}

export default function Settings({ profile, onProfileUpdate, onResetApp, authToken, onTokenUpdate }: SettingsProps) {
  const [pinEnabled, setPinEnabled] = useState(profile.isPinEnabled);
  const [pinCode, setPinCode] = useState(profile.pinCode || '');
  const [discreteMode, setDiscreteMode] = useState(profile.isDiscreteMode);
  const [optInSync, setOptInSync] = useState(profile.optInSync);
  const [activeStage, setActiveStage] = useState(profile.stage);
  
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [syncing, setSyncing] = useState(false);

  const saveSettings = async (updates: Partial<Profile>) => {
    const updatedProfile = { ...profile, ...updates };
    await db.profile.put(updatedProfile);
    onProfileUpdate(updatedProfile);
    
    setFeedbackMsg('Ajustes guardados.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleStageChange = async (newStage: 'cycle' | 'pregnancy' | 'menopause') => {
    setActiveStage(newStage);
    await saveSettings({ stage: newStage });
  };

  const handlePinToggle = (checked: boolean) => {
    setPinEnabled(checked);
    if (!checked) {
      saveSettings({ isPinEnabled: false, pinCode: undefined });
    }
  };

  const handlePinChange = (val: string) => {
    if (/^\d*$/.test(val) && val.length <= 4) {
      setPinCode(val);
      if (val.length === 4) {
        saveSettings({ isPinEnabled: true, pinCode: val });
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold text-center">
          {feedbackMsg}
        </div>
      )}

      {/* User Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 text-white flex items-center justify-center text-2xl shadow-md">
            🌸
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {authToken ? 'Cuenta Blooma Conectada' : 'Modo Privado Local'}
            </h3>
            <span className="text-xs text-slate-500">
              {authToken ? email || 'Usuario Supabase' : 'Tus datos nunca abandonan tu dispositivo'}
            </span>
          </div>
        </div>

        <button
          onClick={() => saveSettings({ isDiscreteMode: !discreteMode })}
          className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-600 font-extrabold text-xs border border-rose-100 cursor-pointer"
        >
          {discreteMode ? 'Modo Discreto Activo' : 'Editar Datos'}
        </button>
      </div>

      {/* Flo Goal Selector Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Mi objetivo principal</h4>
        
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleStageChange('cycle')}
            className={`px-4 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeStage === 'cycle'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Seguir mi ciclo
          </button>

          <button
            type="button"
            onClick={() => handleStageChange('pregnancy')}
            className={`px-4 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeStage === 'pregnancy'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Acompañar mi embarazo
          </button>

          <button
            type="button"
            onClick={() => handleStageChange('menopause')}
            className={`px-4 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeStage === 'menopause'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Gestionar mi menopausia
          </button>
        </div>
      </div>

      {/* Grouped App Settings List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
        
        {/* Row 1: Wearables */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Reloj y Anillo Inteligente</h4>
              <span className="text-[10px] text-slate-500">Android Health Connect, Apple HealthKit o BLE</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Row 2: Security & PIN */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Seguridad y Código PIN de 4 dígitos</h4>
              <span className="text-[10px] text-slate-500">
                {pinEnabled ? 'PIN de 4 dígitos activado' : 'Protección de acceso desactivada'}
              </span>
            </div>
          </div>
          
          <input
            type="checkbox"
            checked={pinEnabled}
            onChange={e => handlePinToggle(e.target.checked)}
            className="rounded text-rose-500 focus:ring-rose-400 cursor-pointer"
          />
        </div>

        {pinEnabled && (
          <div className="p-4 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Ingresar PIN:</span>
            <input
              type="password"
              maxLength={4}
              value={pinCode}
              onChange={e => handlePinChange(e.target.value)}
              placeholder="1234"
              className="w-20 px-3 py-1 bg-white border border-slate-200 rounded-lg text-center text-sm font-bold text-slate-900"
            />
          </div>
        )}

        {/* Row 3: Discrete Mode */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Modo Discreto de Interfaz</h4>
              <span className="text-[10px] text-slate-500">Oculta términos médicos explícitos en pantalla</span>
            </div>
          </div>

          <input
            type="checkbox"
            checked={discreteMode}
            onChange={e => {
              setDiscreteMode(e.target.checked);
              saveSettings({ isDiscreteMode: e.target.checked });
            }}
            className="rounded text-purple-600 focus:ring-purple-400 cursor-pointer"
          />
        </div>

        {/* Row 4: Help & Support */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Ayuda, Casas Maternas y MINSA</h4>
              <span className="text-[10px] text-slate-500">Recursos de salud y emergencia</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

      </div>

      {/* Reset Data Button */}
      <div className="pt-4 text-center">
        <button
          onClick={onResetApp}
          className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
        >
          Borrar datos locales y reiniciar app
        </button>
      </div>

    </div>
  );
}
