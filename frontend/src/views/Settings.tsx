import React, { useState } from 'react';
import { db, type Profile } from '../db/db';
import { Shield, Bell, Database, Trash2, Download, RefreshCw, LifeBuoy, LogOut, KeyRound, Mail } from 'lucide-react';
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
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Authentication states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [syncing, setSyncing] = useState(false);

  // Update profile in DB when toggles change
  const saveSettings = async (updates: Partial<Profile>) => {
    const updatedProfile = { ...profile, ...updates };
    await db.profile.put(updatedProfile);
    onProfileUpdate(updatedProfile);
    
    setFeedbackMsg('Ajustes guardados.');
    setTimeout(() => setFeedbackMsg(''), 3000);

    // Auto-update on cloud if logged in
    if (authToken) {
      try {
        await apiUpdateProfile(authToken, {
          stage: updatedProfile.stage,
          age: updatedProfile.age,
          gestationWeekStart: updatedProfile.gestationWeekStart,
          menopauseStartYear: updatedProfile.menopauseStartYear,
          optInSync: updatedProfile.optInSync,
          pinEnabled: updatedProfile.isPinEnabled,
          pinCode: updatedProfile.pinCode,
          discreteMode: updatedProfile.isDiscreteMode,
          offlineMode: updatedProfile.isOfflineMode
        });
      } catch (err) {
        console.error('Error auto-syncing profile updates:', err);
      }
    }
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

  // Auth execution
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!email || !password) {
      setAuthError('Por favor ingresa todos los campos.');
      return;
    }
    try {
      if (authMode === 'login') {
        const res = await apiLogin(email, password);
        onTokenUpdate(res.token);
        localStorage.setItem('blooma_auth_token', res.token);
        setFeedbackMsg('Inicio de sesión exitoso.');
        
        // Save sync state
        const updatedProfile = { ...profile, optInSync: true };
        await db.profile.put(updatedProfile);
        onProfileUpdate(updatedProfile);
        setOptInSync(true);
      } else {
        const res = await apiRegister(email, password);
        onTokenUpdate(res.token);
        localStorage.setItem('blooma_auth_token', res.token);
        setFeedbackMsg('Cuenta creada con éxito.');
        
        const updatedProfile = { ...profile, optInSync: true };
        await db.profile.put(updatedProfile);
        onProfileUpdate(updatedProfile);
        setOptInSync(true);
      }
      setTimeout(() => setFeedbackMsg(''), 3000);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Error en la autenticación.');
    }
  };

  const handleSyncNow = async () => {
    if (!authToken) return;
    setSyncing(true);
    setFeedbackMsg('Sincronizando...');
    const res = await syncLocalDataWithServer(authToken);
    setSyncing(false);
    if (res.success) {
      setFeedbackMsg('¡Sincronización completada!');
    } else {
      setFeedbackMsg('Error al sincronizar.');
    }
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleLogout = () => {
    onTokenUpdate(null);
    localStorage.removeItem('blooma_auth_token');
    saveSettings({ optInSync: false });
    setOptInSync(false);
    setFeedbackMsg('Sesión cerrada de la nube.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleDeleteData = async () => {
    if (confirm('¿Estás absolutamente segura de que deseas borrar todos tus datos? Esta acción eliminará permanentemente tus registros de este dispositivo y de la nube si estuviese sincronizado.')) {
      setIsDeleting(true);
      try {
        if (authToken) {
          await apiDeleteAccount(authToken);
          onTokenUpdate(null);
          localStorage.removeItem('blooma_auth_token');
        }
      } catch (err) {
        console.error('Error deleting cloud account:', err);
      }
      await db.dailyLogs.clear();
      await db.cycles.clear();
      await db.triageRecords.clear();
      await db.profile.clear();
      setIsDeleting(false);
      onResetApp();
    }
  };

  const handleExportCSV = async () => {
    try {
      const logs = await db.dailyLogs.toArray();
      const cycles = await db.cycles.toArray();
      const triage = await db.triageRecords.toArray();

      let csvContent = 'data:text/csv;charset=utf-8,\n';
      
      csvContent += '--- REGISTROS DIARIOS ---\n';
      csvContent += 'Fecha,Animo,Flujo,Dolor,TemperaturaBasal,Sofocos,CalidadSuenio,Ansiedad,Notas\n';
      logs.forEach(log => {
        csvContent += `${log.date},${log.mood || ''},${log.flow || ''},${log.pain || ''},${log.temperature || ''},${log.hotFlashes || ''},${log.sleepQuality || ''},${log.anxietyLevel || ''},"${(log.notes || '').replace(/"/g, '""')}"\n`;
      });

      csvContent += '\n--- HISTORIAL DE CICLOS ---\n';
      csvContent += 'ID,FechaInicio,FechaFin,Duracion\n';
      cycles.forEach(c => {
        csvContent += `${c.id || ''},${c.startDate},${c.endDate || ''},${c.duration || ''}\n`;
      });

      csvContent += '\n--- REGISTROS DE TRIAJE EMBARAZO ---\n';
      csvContent += 'Fecha,SemanaGestacion,Clasificacion,Sintomas\n';
      triage.forEach(t => {
        csvContent += `${t.date},${t.gestationWeek},${t.classification},"${t.symptoms.join('; ')}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `blooma_datos_exportados_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setFeedbackMsg('Archivo CSV descargado.');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Error al exportar datos.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-page-enter">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-earth-900 font-display">Ajustes y Privacidad</h1>
        {feedbackMsg && (
          <span className="text-xs bg-brand-teal-100 text-brand-teal-700 px-3 py-1 rounded-full font-medium transition-all shadow-sm">
            {feedbackMsg}
          </span>
        )}
      </div>

      {/* CAMBIO DE ETAPA */}
      <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4 card-hover">
        <div className="flex items-center gap-3 border-b border-brand-earth-100 pb-3">
          <LifeBuoy className="h-5 w-5 text-brand-teal-600" />
          <h2 className="font-bold text-brand-earth-900">Etapa de Vida Activa</h2>
        </div>
        <p className="text-xs text-brand-earth-600 leading-relaxed">
          Puedes cambiar de etapa en cualquier momento. Tus datos anteriores no se borrarán y la aplicación se adaptará para mostrarte las funciones de tu nueva etapa.
        </p>
        <div className="grid grid-cols-3 gap-3 pt-2">
          {(['cycle', 'pregnancy', 'menopause'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStageChange(s)}
              className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all active-press ${
                activeStage === s
                  ? 'bg-brand-teal-600 border-brand-teal-700 text-white shadow-sm'
                  : 'bg-white border-brand-earth-200 text-brand-earth-700 hover:bg-brand-earth-50'
              }`}
            >
              {s === 'cycle' ? 'Ciclo Menstrual' : s === 'pregnancy' ? 'Embarazo' : 'Menopausia'}
            </button>
          ))}
        </div>
      </section>

      {/* SEGURIDAD & PIN */}
      <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4 card-hover">
        <div className="flex items-center gap-3 border-b border-brand-earth-100 pb-3">
          <Shield className="h-5 w-5 text-brand-teal-600" />
          <h2 className="font-bold text-brand-earth-900">Bloqueo de Acceso</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-brand-earth-900">Activar PIN de Bloqueo</h3>
            <p className="text-xs text-brand-earth-600">Bloquea la aplicación tras 2 minutos de inactividad.</p>
          </div>
          <input
            type="checkbox"
            checked={pinEnabled}
            onChange={(e) => handlePinToggle(e.target.checked)}
            className="h-5 w-5 rounded text-brand-teal-600 accent-brand-teal-500 cursor-pointer"
          />
        </div>
        {pinEnabled && (
          <div className="pt-2">
            <label className="block text-xs font-bold text-brand-earth-700 uppercase tracking-wider mb-1">
              Editar PIN de 4 dígitos
            </label>
            <input
              type="password"
              maxLength={4}
              value={pinCode}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder="Ingresa un PIN de 4 dígitos"
              className="w-full max-w-[200px] px-4 py-2 rounded-xl border border-brand-earth-200 text-center tracking-widest font-bold bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-300"
            />
          </div>
        )}
      </section>

      {/* NOTIFICACIONES DISCRETAS */}
      <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4 card-hover">
        <div className="flex items-center gap-3 border-b border-brand-earth-100 pb-3">
          <Bell className="h-5 w-5 text-brand-teal-600" />
          <h2 className="font-bold text-brand-earth-900">Notificaciones y Alertas</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-brand-earth-900">Modo Discreto</h3>
            <p className="text-xs text-brand-earth-600">
              Oculta nombres explícitos en pantalla de bloqueo. Ej: "Actualización disponible" en lugar de "Predicción de periodo".
            </p>
          </div>
          <input
            type="checkbox"
            checked={discreteMode}
            onChange={(e) => {
              setDiscreteMode(e.target.checked);
              saveSettings({ isDiscreteMode: e.target.checked });
            }}
            className="h-5 w-5 rounded text-brand-teal-600 accent-brand-teal-500 cursor-pointer"
          />
        </div>
      </section>

      {/* CLOUD SYNC */}
      <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4 card-hover">
        <div className="flex items-center gap-3 border-b border-brand-earth-100 pb-3">
          <Database className="h-5 w-5 text-brand-teal-600" />
          <h2 className="font-bold text-brand-earth-900">Almacenamiento y Sincronización</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-brand-earth-900">Sincronización en la Nube</h3>
            <p className="text-xs text-brand-earth-600">
              Sincroniza tus datos de forma cifrada cuando haya internet para respaldarlos en tu cuenta.
            </p>
          </div>
          <input
            type="checkbox"
            checked={optInSync}
            onChange={(e) => {
              const checked = e.target.checked;
              setOptInSync(checked);
              if (!checked) {
                saveSettings({ optInSync: false });
                if (authToken) handleLogout();
              }
            }}
            className="h-5 w-5 rounded text-brand-teal-600 accent-brand-teal-500 cursor-pointer"
          />
        </div>

        {/* Auth form if optInSync is checked but no auth token exists */}
        {optInSync && !authToken && (
          <div className="pt-4 border-t border-brand-earth-100 space-y-4 animate-pop-in">
            <div className="flex bg-brand-earth-50 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'login' ? 'bg-white shadow-sm text-brand-teal-700' : 'text-brand-earth-600'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'register' ? 'bg-white shadow-sm text-brand-teal-700' : 'text-brand-earth-600'
                }`}
              >
                Crear Cuenta
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authError && (
                <p className="text-xs bg-brand-coral-50 text-brand-coral-700 p-2 rounded-xl border border-brand-coral-100 font-medium">
                  {authError}
                </p>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-brand-earth-400" />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-brand-earth-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-300"
                />
              </div>

              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-brand-earth-400" />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-brand-earth-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-brand-teal-600 hover:bg-brand-teal-700 text-white shadow-md active-press transition-all"
              >
                {authMode === 'login' ? 'Conectar' : 'Registrar y Conectar'}
              </button>
            </form>
          </div>
        )}

        {/* Sync actions if logged in */}
        {optInSync && authToken && (
          <div className="pt-4 border-t border-brand-earth-100 flex items-center justify-between gap-3 animate-pop-in">
            <div className="text-xs text-brand-earth-600">
              Cuenta vinculada y activa
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={syncing}
                className="flex items-center gap-1 py-2 px-3 rounded-lg text-xs font-bold bg-brand-teal-100 text-brand-teal-800 hover:bg-brand-teal-200 transition-all active-press"
              >
                <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Sincronizando...' : 'Sincronizar ahora'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 py-2 px-3 rounded-lg text-xs font-bold bg-brand-earth-100 text-brand-earth-700 hover:bg-brand-earth-200 transition-all active-press"
              >
                <LogOut className="h-3 w-3" />
                Desconectar
              </button>
            </div>
          </div>
        )}
      </section>

      {/* EXPORTAR & ELIMINAR */}
      <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4 card-hover">
        <div className="flex items-center gap-3 border-b border-brand-earth-100 pb-3">
          <Trash2 className="h-5 w-5 text-brand-coral-500" />
          <h2 className="font-bold text-brand-earth-900">Acciones de Datos</h2>
        </div>
        <p className="text-xs text-brand-earth-600 leading-relaxed">
          Puedes respaldar tus datos en un archivo local plano (CSV) o eliminarlos permanentemente del dispositivo de forma instantánea.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-brand-teal-55 border border-brand-teal-200 text-brand-teal-800 hover:bg-brand-teal-100 transition-all active-press"
          >
            <Download className="h-4 w-4" />
            Exportar Historial (CSV)
          </button>
          
          <button
            type="button"
            onClick={handleDeleteData}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-brand-coral-50 border border-brand-coral-200 text-brand-coral-800 hover:bg-brand-coral-100 transition-all active-press"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Borrando...' : 'Eliminar todos mis datos'}
          </button>
        </div>
      </section>
    </div>
  );
}
