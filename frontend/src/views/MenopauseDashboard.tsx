import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import { Shield, Sparkles, BookOpen, ChevronLeft, ChevronRight, Activity, Bone } from 'lucide-react';
import SmartHealthInsights from '../components/SmartHealthInsights';

const tccSlides = [
  {
    title: 'Control de Sofocos (TCC)',
    category: 'Manejo Térmico',
    desc: 'La Terapia Cognitivo-Conductual ha probado reducir el impacto de los bochornos. Cuando sientas que inicia:',
    points: [
      'Practica la respiración abdominal lenta: inspira en 5 segundos, retén 2, exhala en 5.',
      'Identifica pensamientos catastróficos ("no lo soporto") y reemplázalos por racionales ("esto pasará en 2 minutos").',
      'Mantén un diario de factores desencadenantes (café, comidas picantes, ropa sintética).'
    ]
  },
  {
    title: 'Higiene del Sueño en la Transición',
    category: 'Descanso y Reparación',
    desc: 'Los cambios hormonales perturban los ciclos circadianos. Optimiza tu descanso nocturno:',
    points: [
      'Mantén tu habitación fresca (18-20°C es ideal para evitar sudoraciones nocturnas).',
      'Evita pantallas led al menos 1 hora antes de dormir (la luz azul inhibe la melatonina).',
      'Establece un horario fijo para acostarte y levantarte, incluso los fines de semana.'
    ]
  },
  {
    title: 'Mente Activa & Bienestar Físico',
    category: 'Regulación del Humor',
    desc: 'La perimenopausia genera fluctuaciones de humor debido al declive estrogénico:',
    points: [
      'Dedica 10 minutos a meditación guiada o caminata lenta en la naturaleza.',
      'Conversa abiertamente con tu pareja o círculo cercano sobre cómo te sientes. El aislamiento empeora los síntomas.',
      'El ejercicio aeróbico regular es un antidepresivo natural y estabilizador del sistema endocrino.'
    ]
  }
];

export default function MenopauseDashboard() {
  const [monthsSincePeriod, setMonthsSincePeriod] = useState(14);
  const [activeSlide, setActiveSlide] = useState(0);

  // Osteoporosis Checklist
  const [ostChecklist, setOstChecklist] = useState({
    calcium: false,
    weightExercise: false,
    sunExposure: false,
    boneDensityScan: false,
    familyHistory: false,
  });

  useEffect(() => {
    async function loadData() {
      const profile = await db.profile.get('main');
      if (profile && profile.menopauseStartYear) {
        // Compute mockup time or mock values for demonstration
        setMonthsSincePeriod(16);
      }
    }
    loadData();
  }, []);

  const handleCheckboxChange = (key: keyof typeof ostChecklist) => {
    setOstChecklist(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      // Save checklist or track state
      return updated;
    });
  };

  const nextSlide = () => {
    setActiveSlide(prev => (prev === tccSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide(prev => (prev === 0 ? tccSlides.length - 1 : prev - 1));
  };

  const isPostmenopause = monthsSincePeriod >= 12;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* TRANSICIÓN STATUS CARD */}
      <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in-up delay-75 card-hover">
        <div className="absolute top-0 right-0 bg-brand-teal-500/10 h-32 w-32 rounded-full blur-3xl -z-10" />

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs bg-brand-teal-100 text-brand-teal-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse-soft">
            <Sparkles className="h-3.5 w-3.5" />
            Estado Climaterio
          </span>
          <h2 className="text-2xl font-black text-brand-earth-900">
            {isPostmenopause ? 'Postmenopausia Estable' : 'Perimenopausia / Transición'}
          </h2>
          <p className="text-xs text-brand-earth-600 leading-relaxed max-w-sm">
            {monthsSincePeriod} meses desde tu último período menstrual. Se considera menopausia clínica tras 12 meses consecutivos de amenorrea.
          </p>
        </div>

        <div className="bg-white/80 border border-brand-earth-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center min-w-[140px] shadow-sm flex-shrink-0 transition-transform duration-300 hover:scale-105">
          <span className="text-[10px] font-bold text-brand-earth-500 uppercase tracking-wider">Fase Biológica</span>
          <span className="text-sm font-extrabold text-brand-teal-700">
            {isPostmenopause ? 'Fase Completada' : 'Fase Activa'}
          </span>
        </div>
      </section>

      {/* CBT / TCC CAROUSEL */}
      <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4 animate-fade-in-up delay-150">
        <div className="flex items-center justify-between border-b border-brand-earth-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-teal-600 animate-pulse-soft" />
            <h3 className="font-bold text-brand-earth-900">Acompañamiento Cognitivo (TCC)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              className="p-1.5 rounded-lg border border-brand-earth-200 bg-white hover:bg-brand-earth-50 transition-all active-press"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-brand-earth-600">
              {activeSlide + 1} / {tccSlides.length}
            </span>
            <button
              type="button"
              onClick={nextSlide}
              className="p-1.5 rounded-lg border border-brand-earth-200 bg-white hover:bg-brand-earth-50 transition-all active-press"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Slide Content with key-based re-animation */}
        <div key={activeSlide} className="min-h-[160px] flex flex-col justify-between space-y-3 animate-page-enter">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase bg-brand-teal-50 text-brand-teal-700 px-2.5 py-0.5 rounded-full">
              {tccSlides[activeSlide].category}
            </span>
            <h4 className="font-bold text-base text-brand-earth-900 pt-1">
              {tccSlides[activeSlide].title}
            </h4>
            <p className="text-xs text-brand-earth-600 leading-relaxed">
              {tccSlides[activeSlide].desc}
            </p>
          </div>
          <ul className="space-y-1.5 text-xs text-brand-earth-700 pl-4 list-disc">
            {tccSlides[activeSlide].points.map((p, i) => (
              <li key={i} className="leading-tight">{p}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* OSTEOPOROSIS CHECKLIST */}
      <section className="glass rounded-3xl p-6 shadow-md border border-brand-earth-100 space-y-4 animate-fade-in-up delay-200 card-hover">
        <div className="flex items-center gap-2 border-b border-brand-earth-100 pb-3">
          <Bone className="h-5 w-5 text-brand-teal-600 animate-pulse-soft" />
          <h3 className="font-bold text-brand-earth-900">Prevención de Osteoporosis</h3>
        </div>
        <p className="text-xs text-brand-earth-600 leading-relaxed">
          El estrógeno protege la densidad ósea. Su reducción en la menopausia eleva el riesgo de osteoporosis. Completa este checklist para evaluar tu prevención activa:
        </p>

        <div className="space-y-2.5 pt-1">
          <label className="flex items-start gap-3 text-xs text-brand-earth-800 cursor-pointer active-press hover:bg-brand-earth-50/50 p-1.5 rounded-xl transition-colors">
            <input
              type="checkbox"
              checked={ostChecklist.calcium}
              onChange={() => handleCheckboxChange('calcium')}
              className="h-4.5 w-4.5 rounded border-brand-earth-300 text-brand-teal-600 accent-brand-teal-500 mt-0.5 cursor-pointer"
            />
            <div>
              <span className="font-bold block">Consumo Diario de Calcio</span>
              <span className="text-[10px] text-brand-earth-500">¿Consumes lácteos, ajonjolí, almendras o suplementos de calcio?</span>
            </div>
          </label>

          <label className="flex items-start gap-3 text-xs text-brand-earth-800 cursor-pointer active-press hover:bg-brand-earth-50/50 p-1.5 rounded-xl transition-colors">
            <input
              type="checkbox"
              checked={ostChecklist.weightExercise}
              onChange={() => handleCheckboxChange('weightExercise')}
              className="h-4.5 w-4.5 rounded border-brand-earth-300 text-brand-teal-600 accent-brand-teal-500 mt-0.5 cursor-pointer"
            />
            <div>
              <span className="font-bold block">Ejercicios de Fuerza o Resistencia</span>
              <span className="text-[10px] text-brand-earth-500">Al menos 3 veces por semana (caminar, peso corporal, yoga terapéutico).</span>
            </div>
          </label>

          <label className="flex items-start gap-3 text-xs text-brand-earth-800 cursor-pointer active-press hover:bg-brand-earth-50/50 p-1.5 rounded-xl transition-colors">
            <input
              type="checkbox"
              checked={ostChecklist.sunExposure}
              onChange={() => handleCheckboxChange('sunExposure')}
              className="h-4.5 w-4.5 rounded border-brand-earth-300 text-brand-teal-600 accent-brand-teal-500 mt-0.5 cursor-pointer"
            />
            <div>
              <span className="font-bold block">Exposición al Sol (Vitamina D)</span>
              <span className="text-[10px] text-brand-earth-500">10-15 minutos diarios fuera de horas pico de radiación solar.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 text-xs text-brand-earth-800 cursor-pointer active-press hover:bg-brand-earth-50/50 p-1.5 rounded-xl transition-colors">
            <input
              type="checkbox"
              checked={ostChecklist.boneDensityScan}
              onChange={() => handleCheckboxChange('boneDensityScan')}
              className="h-4.5 w-4.5 rounded border-brand-earth-300 text-brand-teal-600 accent-brand-teal-500 mt-0.5 cursor-pointer"
            />
            <div>
              <span className="font-bold block">Densitometría Ósea al Día</span>
              <span className="text-[10px] text-brand-earth-500">Si eres mayor de 50 años, ¿has agendado o te has realizado este examen?</span>
            </div>
          </label>
        </div>
      </section>

      {/* SMART HEALTH INSIGHTS */}
      <div className="animate-fade-in-up delay-250">
        <SmartHealthInsights />
      </div>

    </div>
  );
}
