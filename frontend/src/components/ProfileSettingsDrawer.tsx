import React, { useState, useEffect } from 'react';
import { X, User, Heart, Lock, Cloud, Sparkles, HelpCircle, ChevronRight, Watch, EyeOff, BarChart2, Shield, RefreshCw, Key, Globe, Languages, MapPin, Navigation, Compass } from 'lucide-react';
import { db, type Profile } from '../db/db';
import { apiRegister, apiLogin } from '../db/supabase';
import BloomaLogo from './BloomaLogo';
import WearableTelemetryModal from './WearableTelemetryModal';
import MinsaSupportModal from './MinsaSupportModal';
import { useTranslation } from '../i18n/useTranslation';
import { CLIMACTERIC_STAGES, type ClimactericStage } from '../services/menopauseService';
import { NICARAGUA_DEPARTMENTS, getCurrentCoordinates, calculateDistanceKm } from '../services/locationService';

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
  const [selectedLanguage, setSelectedLanguage] = useState<'es' | 'miskito' | 'creole'>('es');
  const { t } = useTranslation(selectedLanguage);
  const [activeStage, setActiveStage] = useState<'cycle' | 'pregnancy' | 'menopause'>('cycle');
  const [conceptionMode, setConceptionMode] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [pinCode, setPinCode] = useState('1234');
  const [discreteMode, setDiscreteMode] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<'lotus' | 'sprout' | 'flower' | 'butterfly' | 'sun'>('lotus');
  const [climactericStage, setClimactericStage] = useState<ClimactericStage>('early_perimenopause');
  const [selectedDept, setSelectedDept] = useState('Managua');
  const [selectedMuni, setSelectedMuni] = useState('Managua');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('');

  const PRESET_AVATARS = ['🌸', '🦊', '👑', '🦋', '🌿', '👶', '🌙', '💃', '🍉', '🧘‍♀️', '🦄', '🌷', '🌺', '🎨', '✨'];
  const [selectedEmoji, setSelectedEmoji] = useState('blooma');
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  // Email / Password Form state
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authStatusMsg, setAuthStatusMsg] = useState('');
  const [linkedAccount, setLinkedAccount] = useState<string | null>(null);

  // Modals state
  const [isWearableModalOpen, setIsWearableModalOpen] = useState(false);
  const [isMinsaModalOpen, setIsMinsaModalOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setActiveStage(profile.stage || 'cycle');
      setConceptionMode(profile.conceptionMode || false);
      setSyncEnabled(profile.optInSync || false);
      setPinEnabled(profile.isPinEnabled || false);
      setPinCode(profile.pinCode || '');
      setDiscreteMode(profile.isDiscreteMode || false);
      setSelectedLogo(profile.logoVariant || 'lotus');
      setSelectedLanguage(profile.language || 'es');
      setClimactericStage(profile.climactericStage || 'early_perimenopause');
      setSelectedDept(profile.department || 'Managua');
      setSelectedMuni(profile.municipality || 'Managua');
      setSelectedEmoji(profile.appIcon || 'blooma');
      setCustomAvatar(profile.customAvatarUrl || null);
    }
  }, [profile]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleDepartmentChange = async (deptName: string) => {
    setSelectedDept(deptName);
    const dept = NICARAGUA_DEPARTMENTS.find(d => d.name === deptName);
    const firstMuni = dept?.municipalities[0] || deptName;
    setSelectedMuni(firstMuni);
    if (profile) {
      const updated: Profile = {
        ...profile,
        department: deptName,
        municipality: firstMuni,
        latitude: dept?.capitalCoords.latitude,
        longitude: dept?.capitalCoords.longitude
      };
      await db.profile.put(updated, 'main');
      onProfileUpdate(updated);
    }
  };

  const handleMunicipalityChange = async (muniName: string) => {
    setSelectedMuni(muniName);
    if (profile) {
      const updated: Profile = {
        ...profile,
        municipality: muniName
      };
      await db.profile.put(updated, 'main');
      onProfileUpdate(updated);
    }
  };

  const handleDetectGps = async () => {
    setIsGpsLoading(true);
    setGpsStatus('Localizando coordenadas por satélite...');
    const coords = await getCurrentCoordinates();
    if (coords) {
      let closestDept = NICARAGUA_DEPARTMENTS[0];
      let minDistance = Infinity;
      for (const d of NICARAGUA_DEPARTMENTS) {
        const dist = calculateDistanceKm(coords.latitude, coords.longitude, d.capitalCoords.latitude, d.capitalCoords.longitude);
        if (dist < minDistance) {
          minDistance = dist;
          closestDept = d;
        }
      }
      setSelectedDept(closestDept.name);
      setSelectedMuni(closestDept.municipalities[0]);
      setGpsStatus(`✅ GPS: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)} (${closestDept.name})`);
      if (profile) {
        const updated: Profile = {
          ...profile,
          latitude: coords.latitude,
          longitude: coords.longitude,
          department: closestDept.name,
          municipality: closestDept.municipalities[0]
        };
        await db.profile.put(updated, 'main');
        onProfileUpdate(updated);
      }
    } else {
      setGpsStatus('⚠️ Permiso GPS denegado o satélite no disponible. Selecciona tu departamento manualmente.');
    }
    setIsGpsLoading(false);
  };

  const handleLanguageChange = async (lang: 'es' | 'miskito' | 'creole') => {
    setSelectedLanguage(lang);
    if (profile) {
      const updated: Profile = {
        ...profile,
        language: lang
      };
      await db.profile.put(updated, 'main');
      onProfileUpdate(updated);
    }
  };

  const handleLogoChange = async (logo: 'lotus' | 'sprout' | 'flower' | 'butterfly' | 'sun') => {
    setSelectedLogo(logo);
    if (profile) {
      const updated: Profile = {
        ...profile,
        logoVariant: logo
      };
      await db.profile.put(updated, 'main');
      onProfileUpdate(updated);
    }
  };

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

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setCustomAvatar(base64String);
        setSelectedEmoji('custom');
        if (profile) {
          const updated: Profile = {
            ...profile,
            customAvatarUrl: base64String,
            appIcon: 'custom'
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

  const handleEmailPassRegister = async () => {
    if (!accountEmail || !accountPassword) {
      setAuthStatusMsg('⚠️ Ingresa un correo y contraseña válidos.');
      return;
    }
    if (accountPassword.length < 6) {
      setAuthStatusMsg('⚠️ La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setIsAuthLoading(true);
    setAuthStatusMsg('');
    try {
      await apiRegister(accountEmail, accountPassword);
      setLinkedAccount(accountEmail);
      setAuthStatusMsg('✅ Cuenta vinculada y registrada de forma segura.');
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
    <div className="fixed inset-0 z-[99999] bg-[#FFF9F9] flex flex-col w-screen h-screen min-h-screen overflow-y-auto animate-fade-in relative overflow-x-hidden overscroll-contain">
      
      {/* Background ambient mesh spheres */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-rose-300/40 via-pink-200/30 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-[5%] right-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-purple-300/40 via-indigo-200/30 to-transparent rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-gradient-to-tr from-amber-200/40 via-rose-200/30 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-gradient-to-tr from-teal-200/40 via-emerald-100/30 to-transparent rounded-full blur-3xl animate-float-reverse" />
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

        <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
          {t.settings.title}
        </h2>

        <div className="w-8" />
      </div>

      {/* Content Container Card */}
      <div className="max-w-xl w-full mx-auto my-4 p-6 sm:p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/80 space-y-6 flex-1 mb-20">
        
        {/* Profile Card Header with Custom Avatar Upload */}
        <div className="flex items-center space-x-4 p-4 rounded-3xl bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 border border-rose-100 relative">
          <label className="relative group cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-white shadow-md overflow-hidden border-2 border-slate-200 p-2 flex items-center justify-center">
              {customAvatar ? (
                <img src={customAvatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : selectedEmoji === 'blooma' || selectedEmoji === '🦙' ? (
                <img src="/blooma_isotipo.png" alt="Isotipo Oficial Blooma" className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl">{selectedEmoji}</span>
              )}
            </div>
            <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              {t.settings.changeAvatar}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarFileUpload}
              className="hidden"
            />
          </label>

          <div>
            <h3 className="text-base font-extrabold text-slate-900">{t.settings.userTitle}</h3>
            <span className="text-xs font-bold text-rose-600 block">
              {linkedAccount ? `${t.settings.linkedAccount}: ${linkedAccount}` : t.settings.privateMode}
            </span>
            <label className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800 cursor-pointer block mt-0.5">
              📷 {t.settings.customAvatar}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* SECTION: LENGUAJE E INCLUSIÓN TERRITORIAL (NICARAGUA MULTI-ÉTNICA) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 border border-emerald-100 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-700">
            <Languages className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
              {t.settings.languageSectionTitle}
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t.settings.languageSectionDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {[
              { id: 'es', flag: '🇳🇮', name: 'Español', sub: 'Nicaragua / Comunitario' },
              { id: 'miskito', flag: '🌿', name: 'Miskitu', sub: 'Costa Caribe Norte (RACCN)' },
              { id: 'creole', flag: '🌊', name: 'Creole', sub: 'Costa Caribe Sur (RACCS)' }
            ].map(lang => (
              <button
                key={lang.id}
                type="button"
                onClick={() => handleLanguageChange(lang.id as any)}
                className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center transition-all cursor-pointer ${
                  selectedLanguage === lang.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200 scale-102'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl mb-1">{lang.flag}</span>
                <span className="text-xs font-black text-center">{lang.name}</span>
                <span className={`text-[9px] text-center mt-0.5 line-clamp-1 ${selectedLanguage === lang.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {lang.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION: UBICACIÓN Y RED DE SALUD MINSA */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-slate-50 border border-amber-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-800">
              <MapPin className="w-5 h-5 text-rose-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                {t.settings.locationSectionTitle}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isGpsLoading}
              className="px-3 py-1.5 rounded-xl bg-white text-rose-600 border border-rose-200 font-extrabold text-[11px] shadow-xs hover:bg-rose-50 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Navigation className={`w-3.5 h-3.5 ${isGpsLoading ? 'animate-spin' : ''}`} />
              <span>{isGpsLoading ? t.settings.detectingGps : t.settings.getGpsBtn}</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t.settings.locationSectionDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 block">
                {t.settings.departmentLabel}
              </label>
              <select
                value={selectedDept}
                onChange={e => handleDepartmentChange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-400 cursor-pointer"
              >
                {NICARAGUA_DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 block">
                {t.settings.municipalityLabel}
              </label>
              <select
                value={selectedMuni}
                onChange={e => handleMunicipalityChange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-400 cursor-pointer"
              >
                {NICARAGUA_DEPARTMENTS.find(d => d.name === selectedDept)?.municipalities.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {gpsStatus && (
            <p className="text-[11px] font-semibold text-slate-700 bg-white/70 p-2 rounded-xl border border-amber-100">
              {gpsStatus}
            </p>
          )}
        </div>

        {/* PRESET AVATAR ICON SELECTION GALLERY */}
        <div className="p-4 rounded-3xl bg-pink-50/50 border border-pink-100 space-y-2">
          <span className="text-[10px] font-black uppercase text-pink-700 tracking-wider block">
            {t.settings.avatarCollectionTitle}
          </span>

          <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none">
            <button
              type="button"
              onClick={() => handleSelectPresetAvatar('blooma')}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 p-1.5 ${
                !customAvatar && (selectedEmoji === 'blooma' || selectedEmoji === '🦙')
                  ? 'bg-teal-50 border-2 border-teal-500 shadow-md ring-4 ring-teal-200 scale-110'
                  : 'bg-white text-slate-700 border border-slate-200 hover:scale-105'
              }`}
              title="Isotipo Oficial Blooma (Floral B)"
            >
              <img src="/blooma_isotipo.png" alt="Isotipo Oficial Blooma" className="w-7 h-7 object-contain" />
            </button>

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

        {/* SECTION: EMAIL PASSWORD ACCOUNT BACKUP */}
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center space-x-2 text-rose-600">
            <Cloud className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
              {t.settings.cloudBackupTitle}
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t.settings.cloudBackupDesc}
          </p>

          <div className="pt-2 space-y-2">
            <input
              type="email"
              placeholder={t.settings.emailLabel}
              value={accountEmail}
              onChange={e => setAccountEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800"
            />
            <input
              type="password"
              placeholder={t.settings.passwordLabel}
              value={accountPassword}
              onChange={e => setAccountPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800"
            />
            <button
              type="button"
              onClick={handleEmailPassRegister}
              disabled={isAuthLoading}
              className="w-full py-2.5 rounded-xl bg-rose-500 text-white font-extrabold text-xs shadow-md hover:bg-rose-600 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              {isAuthLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.nav.loading}</span>
                </>
              ) : (
                <span>{t.settings.linkAccountBtn}</span>
              )}
            </button>
          </div>

          {authStatusMsg && (
            <p className="text-xs font-bold mt-2 text-slate-700">{authStatusMsg}</p>
          )}
        </div>

        {/* SECTION: ACCESS SECURITY MODE */}
        <div className="p-5 rounded-3xl bg-rose-50/60 border border-rose-100 space-y-3">
          <div className="flex items-center space-x-2 text-rose-600">
            <Lock className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
              {t.settings.securityTitle}
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t.settings.securityDesc}
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
              <span>{t.settings.noPinDirect}</span>
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
              <span>{t.settings.withPinOption}</span>
            </button>
          </div>
        </div>

        {/* SECTION: MI OBJETIVO PRINCIPAL */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            {t.settings.stageGoalTitle}:
          </h3>

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
                <span className="block font-black">{t.settings.cycleStageName}</span>
                <span className={`text-[10px] font-medium block ${activeStage === 'cycle' && !conceptionMode ? 'text-rose-100' : 'text-slate-400'}`}>
                  {t.settings.cycleStageDesc}
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
                <span className="block font-black">{t.settings.conceptionStageName}</span>
                <span className={`text-[10px] font-medium block ${activeStage === 'cycle' && conceptionMode ? 'text-pink-100' : 'text-slate-400'}`}>
                  {t.settings.conceptionStageDesc}
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
                <span className="block font-black">{t.settings.pregnancyStageName}</span>
                <span className={`text-[10px] font-medium block ${activeStage === 'pregnancy' ? 'text-amber-100' : 'text-slate-400'}`}>
                  {t.settings.pregnancyStageDesc}
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
                <span className="block font-black">{t.settings.menopauseStageName}</span>
                <span className={`text-[10px] font-medium block ${activeStage === 'menopause' ? 'text-teal-100' : 'text-slate-400'}`}>
                  {t.settings.menopauseStageDesc}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* IF MENOPAUSE SELECTED: 5 CLIMACTERIC STAGES SELECTOR */}
        {activeStage === 'menopause' && (
          <div className="p-5 rounded-3xl bg-teal-50/70 border border-teal-100 space-y-3">
            <div className="flex items-center space-x-2 text-teal-800">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-wider">
                {t.settings.climactericSectionTitle}
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              {t.settings.climactericSectionDesc}
            </p>

            <div className="space-y-2 pt-1">
              {(Object.keys(CLIMACTERIC_STAGES) as ClimactericStage[]).map(key => {
                const stg = CLIMACTERIC_STAGES[key];
                const isSelected = climactericStage === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setClimactericStage(key);
                      if (profile) {
                        const updated: Profile = { ...profile, climactericStage: key };
                        db.profile.put(updated, 'main');
                        onProfileUpdate(updated);
                      }
                    }}
                    className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-teal-50/50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-extrabold block">{stg.title}</span>
                      <span className={`text-[10px] block ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                        {stg.ageRange} • {stg.shortBadge}
                      </span>
                    </div>
                    {isSelected && <span className="text-base font-black">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION: BRAND LOGO & APP ICON SELECTOR */}
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center space-x-2 text-teal-700">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
              {t.settings.logoSectionTitle}
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t.settings.logoSectionDesc}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {[
              { id: 'lotus', name: 'Flor de Loto (Oficial)', desc: 'Identidad oficial' },
              { id: 'sprout', name: 'Brote Vital', desc: 'Renacimiento' },
              { id: 'flower', name: 'Flor Sakura', desc: 'Ciclo natural' },
              { id: 'butterfly', name: 'Mariposa', desc: 'Transformación' },
              { id: 'sun', name: 'Sol Matutino', desc: 'Energía y luz' },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLogoChange(item.id as any)}
                className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center transition-all cursor-pointer ${
                  selectedLogo === item.id
                    ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-200 shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BloomaLogo variant={item.id as any} className="w-8 h-8 mb-1.5" />
                <span className="text-[11px] font-bold text-slate-900 text-center">{item.name}</span>
                <span className="text-[9px] text-slate-400 text-center">{item.desc}</span>
              </button>
            ))}
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
                <h4 className="text-xs font-bold text-slate-900">{t.settings.smartwatchOption}</h4>
                <span className="text-[10px] text-slate-400">{t.settings.smartwatchSub}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <EyeOff className="w-5 h-5 text-slate-700" />
              <span className="text-xs font-bold text-slate-900">{t.settings.discreetModeOption}</span>
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

          <div
            onClick={() => setIsMinsaModalOpen(true)}
            className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-slate-700" />
              <span className="text-xs font-bold text-slate-900">{t.settings.minsaSupportOption}</span>
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
            {t.settings.resetAppBtn}
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

      {/* MINSA Institutional Support & Emergency Lines Modal */}
      <MinsaSupportModal
        isOpen={isMinsaModalOpen}
        onClose={() => setIsMinsaModalOpen(false)}
        profile={profile}
      />
    </div>
  );
}
