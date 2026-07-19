import React, { useState, useEffect } from 'react';
import { db, type TriageRecord, type MaternalHouse } from '../db/db';
import { Heart, Activity, AlertOctagon, Phone, Info, Check, ShieldAlert, Sparkles, MapPin, Search } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const urgentSymptoms = [
  { id: 'sangrado', label: 'Sangrado vaginal de cualquier cantidad' },
  { id: 'convulsiones', label: 'Convulsiones o desmayos' },
  { id: 'dolor_cabeza_vision', label: 'Dolor de cabeza severo con zumbido de oídos o visión borrosa' },
  { id: 'fiebre_alta', label: 'Fiebre alta persistente (mayor a 38.3°C)' },
  { id: 'liquido', label: 'Salida de líquido por la vagina (ruptura de fuente)' },
];

const watchSymptoms = [
  { id: 'hinchazon', label: 'Hinchazón de cara, manos o pies (edema)' },
  { id: 'dolor_bajo', label: 'Dolor en la boca del estómago o vientre bajo' },
  { id: 'movimientos', label: 'Disminución o ausencia de movimientos del bebé' },
  { id: 'ardor_orinar', label: 'Ardor o dolor persistente al orinar' },
  { id: 'vomito', label: 'Vómito constante que impide retener alimentos' },
];

const normalSymptoms = [
  { id: 'cansancio', label: 'Cansancio o sueño leve' },
  { id: 'miccion_frecuente', label: 'Necesidad de orinar con mayor frecuencia' },
  { id: 'dolor_espalda', label: 'Dolor leve de espalda o pelvis' },
];

export default function PregnancyDashboard() {
  const [gestationWeeks, setGestationWeeks] = useState(14);
  const [selectedDept, setSelectedDept] = useState('Todos');
  const [houses, setHouses] = useState<MaternalHouse[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  
  // Triage modal / wizard state
  const [showTriage, setShowTriage] = useState(false);
  const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);
  const [triageResult, setTriageResult] = useState<TriageRecord | null>(null);

  // Load houses
  useEffect(() => {
    async function loadData() {
      const data = await db.maternalHouses.toArray();
      setHouses(data);
      const depts = ['Todos', ...new Set(data.map(h => h.department))];
      setDepartments(depts);

      // Load profile to compute gestation weeks
      const profile = await db.profile.get('main');
      if (profile && profile.gestationWeekStart) {
        const diffMs = Date.now() - new Date(profile.gestationWeekStart).getTime();
        const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        // Add default initial onboarding week (e.g. 12)
        const currentWeeks = Math.min(42, Math.max(1, 12 + diffWeeks));
        setGestationWeeks(currentWeeks);
      }
    }
    loadData();
  }, []);

  const handleCheckboxChange = (id: string) => {
    setCheckedSymptoms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const evaluateTriage = async () => {
    let classification: TriageRecord['classification'] = 'normal';

    const hasUrgent = urgentSymptoms.some(s => checkedSymptoms.includes(s.id));
    const hasWatch = watchSymptoms.some(s => checkedSymptoms.includes(s.id));

    if (hasUrgent) {
      classification = 'urgente';
    } else if (hasWatch) {
      classification = 'vigilar';
    }

    const record: TriageRecord = {
      date: new Date().toISOString().split('T')[0],
      gestationWeek: gestationWeeks,
      symptoms: checkedSymptoms,
      classification
    };

    await db.triageRecords.add(record);
    setTriageResult(record);
  };

  const resetTriage = () => {
    setCheckedSymptoms([]);
    setTriageResult(null);
    setShowTriage(false);
  };

  const filteredHouses = selectedDept === 'Todos'
    ? houses
    : houses.filter(h => h.department === selectedDept);

  // Size of baby analogy based on week
  const getBabySizeAnalogy = (week: number) => {
    if (week <= 8) return { name: 'Semilla de frambuesa', size: '2 cm', icon: '🍓' };
    if (week <= 12) return { name: 'Limón verde', size: '5 cm', icon: '🍋' };
    if (week <= 16) return { name: 'Aguacate mediano', size: '11 cm', icon: '🥑' };
    if (week <= 20) return { name: 'Plátano maduro', size: '25 cm', icon: '🍌' };
    if (week <= 25) return { name: 'Mazorca de maíz', size: '30 cm', icon: '🌽' };
    if (week <= 30) return { name: 'Melón pequeño', size: '38 cm', icon: '🍈' };
    if (week <= 35) return { name: 'Piña dulce', size: '45 cm', icon: '🍍' };
    return { name: 'Sandía de jardín', size: '50 cm', icon: '🍉' };
  };

  const baby = getBabySizeAnalogy(gestationWeeks);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* RUEDA DE PROGRESO */}
      <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 bg-brand-teal-500/10 h-32 w-32 rounded-full blur-3xl -z-10" />

        <div className="flex items-center gap-6">
          {/* Radial visual */}
          <div className="relative h-28 w-28 rounded-full border-4 border-brand-teal-100 flex items-center justify-center bg-white shadow-inner flex-shrink-0">
            <div className="absolute inset-2 border border-brand-teal-200 rounded-full flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold text-brand-earth-500 uppercase tracking-wider">Semana</span>
              <span className="text-3xl font-extrabold text-brand-teal-600">{gestationWeeks}</span>
            </div>
            {/* SVG circle stroke overlay for indicator */}
            <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="52"
                fill="transparent"
                stroke="#14b8a6"
                strokeWidth="4"
                strokeDasharray="326.7"
                strokeDashoffset={326.7 - (326.7 * (gestationWeeks / 40))}
                className="transition-all duration-500"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <span className="text-xs bg-brand-teal-100 text-brand-teal-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block">
              Gestación Activa
            </span>
            <h2 className="text-xl font-bold text-brand-earth-900">Tu bebé tiene el tamaño de un/a:</h2>
            <p className="text-lg font-bold text-brand-teal-700 flex items-center gap-2">
              <span className="text-2xl">{baby.icon}</span>
              {baby.name} <span className="text-xs font-normal text-brand-earth-500">({baby.size} aprox.)</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTriage(true)}
          className="bg-brand-coral-500 hover:bg-brand-coral-600 text-white font-bold py-3 px-6 rounded-2xl shadow-md flex items-center gap-2 text-sm transition-all"
        >
          <ShieldAlert className="h-4 w-4" />
          Evaluar Síntomas (Triaje)
        </button>
      </section>

      {/* EVALUADOR DE TRIAJE MODAL */}
      {showTriage && (
        <div className="fixed inset-0 bg-brand-earth-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl border border-brand-earth-200">
            
            {!triageResult ? (
              <>
                <div className="flex items-center justify-between border-b border-brand-earth-100 pb-3">
                  <h3 className="font-extrabold text-brand-earth-900 flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-brand-coral-500" />
                    Triaje de Síntomas Obstetras
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowTriage(false)}
                    className="text-brand-earth-500 hover:text-brand-earth-700 text-sm font-bold"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="bg-brand-sand-100 text-xs text-brand-earth-700 p-3 rounded-xl border border-brand-earth-100 leading-relaxed">
                  <strong>Instrucción Clínica:</strong> Selecciona todos los síntomas que presentes. El algoritmo clasificará tu nivel de urgencia.
                </div>

                {/* Sección Urgentes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-brand-coral-600 uppercase tracking-wider">
                    ⚠️ Señales de Alerta Críticas (Urgente)
                  </h4>
                  <div className="space-y-2 bg-brand-coral-50/50 p-3 rounded-xl border border-brand-coral-100">
                    {urgentSymptoms.map(s => (
                      <label key={s.id} className="flex items-start gap-2.5 text-xs text-brand-earth-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkedSymptoms.includes(s.id)}
                          onChange={() => handleCheckboxChange(s.id)}
                          className="h-4.5 w-4.5 rounded border-brand-coral-300 text-brand-coral-600 accent-brand-coral-500 mt-0.5"
                        />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sección Vigilancia */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-brand-earth-700 uppercase tracking-wider">
                    🔍 Síntomas de Cuidado (Vigilar)
                  </h4>
                  <div className="space-y-2 bg-brand-earth-50 p-3 rounded-xl border border-brand-earth-100">
                    {watchSymptoms.map(s => (
                      <label key={s.id} className="flex items-start gap-2.5 text-xs text-brand-earth-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkedSymptoms.includes(s.id)}
                          onChange={() => handleCheckboxChange(s.id)}
                          className="h-4.5 w-4.5 rounded border-brand-earth-300 text-brand-teal-600 accent-brand-teal-500 mt-0.5"
                        />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sección Normales */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-brand-earth-500 uppercase tracking-wider">
                    ✓ Cambios Comunes (Normales)
                  </h4>
                  <div className="space-y-2 bg-white/50 p-3 rounded-xl border border-brand-earth-100">
                    {normalSymptoms.map(s => (
                      <label key={s.id} className="flex items-start gap-2.5 text-xs text-brand-earth-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkedSymptoms.includes(s.id)}
                          onChange={() => handleCheckboxChange(s.id)}
                          className="h-4.5 w-4.5 rounded border-brand-earth-200 text-brand-earth-400 accent-brand-earth-500 mt-0.5"
                        />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={evaluateTriage}
                  className="w-full bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider"
                >
                  Evaluar y Clasificar
                </button>
              </>
            ) : (
              // Vista Resultados
              <div className="space-y-6 text-center py-4">
                <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center shadow-md">
                  {triageResult.classification === 'urgente' && (
                    <div className="h-16 w-16 bg-brand-coral-100 text-brand-coral-600 rounded-full flex items-center justify-center animate-bounce">
                      <AlertOctagon className="h-10 w-10" />
                    </div>
                  )}
                  {triageResult.classification === 'vigilar' && (
                    <div className="h-16 w-16 bg-brand-earth-100 text-brand-earth-600 rounded-full flex items-center justify-center">
                      <AlertOctagon className="h-10 w-10 text-brand-earth-500" />
                    </div>
                  )}
                  {triageResult.classification === 'normal' && (
                    <div className="h-16 w-16 bg-brand-teal-100 text-brand-teal-600 rounded-full flex items-center justify-center">
                      <Check className="h-10 w-10" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-brand-earth-500">Clasificación Clinica</span>
                  <h3 className={`text-2xl font-black uppercase ${
                    triageResult.classification === 'urgente'
                      ? 'text-brand-coral-600'
                      : triageResult.classification === 'vigilar'
                      ? 'text-brand-earth-600'
                      : 'text-brand-teal-600'
                  }`}>
                    {triageResult.classification === 'urgente'
                      ? 'Atención Médica Inmediata'
                      : triageResult.classification === 'vigilar'
                      ? 'Vigilancia Médica'
                      : 'Normal / Estable'}
                  </h3>
                </div>

                <div className="bg-brand-earth-50/50 p-4 rounded-2xl border border-brand-earth-100 text-xs text-brand-earth-700 text-left leading-relaxed space-y-2">
                  {triageResult.classification === 'urgente' && (
                    <>
                      <p className="font-bold text-brand-coral-700">⚠️ ¡Alerta Roja!</p>
                      <p>
                        Presentas síntomas que requieren revisión obstétrica inmediata en un hospital o centro de salud. No esperes a mañana. Busca transporte de inmediato.
                      </p>
                      <p>
                        <strong>Si estás en zona rural, contacta o dirígete a la Casa Materna más cercana</strong> para recibir albergue o coordinación de traslado.
                      </p>
                    </>
                  )}
                  {triageResult.classification === 'vigilar' && (
                    <>
                      <p className="font-bold text-brand-earth-700">🔍 Cuidado Moderado</p>
                      <p>
                        Se recomienda programar una cita médica en las próximas 24-48 horas o consultar con tu partera o médico habitual para descartar cualquier complicación latente.
                      </p>
                      <p>
                        Mantén reposo relativo, hidrátate bien y vigila si los síntomas empeoran o cambian a nivel urgente.
                      </p>
                    </>
                  )}
                  {triageResult.classification === 'normal' && (
                    <>
                      <p className="font-bold text-brand-teal-700">✓ Estado Estable</p>
                      <p>
                        Tus síntomas registrados se consideran dentro de los cambios fisiológicos esperados durante el embarazo.
                      </p>
                      <p>
                        <strong>Consejo:</strong> Sigue asistiendo a tus citas prenatales programadas y continúa con tu alimentación equilibrada.
                      </p>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={resetTriage}
                  className="w-full bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider"
                >
                  Entendido
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* DIRECTORIO CASAS MATERNAS */}
      <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-earth-100 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-brand-teal-600" />
            <h3 className="font-bold text-brand-earth-900">Casas Maternas del País</h3>
          </div>
          
          <div className="flex items-center gap-1 bg-white border border-brand-earth-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Search className="h-3 w-3 text-brand-earth-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
          {filteredHouses.length > 0 ? (
            filteredHouses.map(h => (
              <div
                key={h.id}
                className="bg-white/80 border border-brand-earth-100/50 rounded-2xl p-4 flex justify-between items-center gap-4 hover:shadow-sm transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-brand-teal-50 text-brand-teal-700 px-2 py-0.5 rounded-full font-bold uppercase">
                      {h.department}
                    </span>
                    <span className="text-[10px] bg-brand-earth-50 text-brand-earth-600 px-2 py-0.5 rounded-full font-bold">
                      {h.municipality}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-brand-earth-900">{h.name}</h4>
                  <p className="text-xs text-brand-earth-600 leading-tight">{h.address}</p>
                </div>

                {h.phone && (
                  <a
                    href={`tel:${h.phone.replace(/\s+/g, '')}`}
                    className="bg-brand-teal-50 hover:bg-brand-teal-100 text-brand-teal-700 p-3 rounded-full transition-all border border-brand-teal-200/50 flex-shrink-0"
                    title={`Llamar a ${h.name}`}
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-brand-earth-500 text-center py-6">No se encontraron casas maternas en esta región.</p>
          )}
        </div>
      </section>

    </div>
  );
}
