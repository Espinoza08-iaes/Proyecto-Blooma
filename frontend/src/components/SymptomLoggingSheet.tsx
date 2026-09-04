import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Check, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import TagPill from './TagPill';
import WaterTrackerWidget from './WaterTrackerWidget';
import WeightTrackerWidget from './WeightTrackerWidget';

interface SymptomLoggingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onDateChange: (newDate: string) => void;
  // Current selections
  sexTags?: string[];
  moodTags?: string[];
  symptomTags?: string[];
  dischargeType?: string;
  digestionTags?: string[];
  pregnancyTestResult?: string;
  ovulationTestResult?: string;
  lifestyleTags?: string[];
  waterMl?: number;
  weightKg?: number;
  // Handlers
  onToggleTag: (category: string, tagVal: string) => void;
  onUpdateWater: (newMl: number) => void;
  onUpdateWeight: (newKg: number) => void;
  onSave: () => void;
}

export default function SymptomLoggingSheet({
  isOpen,
  onClose,
  selectedDate,
  onDateChange,
  sexTags = [],
  moodTags = [],
  symptomTags = [],
  dischargeType,
  digestionTags = [],
  pregnancyTestResult,
  ovulationTestResult,
  lifestyleTags = [],
  waterMl = 0,
  weightKg = 60,
  onToggleTag,
  onUpdateWater,
  onUpdateWeight,
  onSave
}: SymptomLoggingSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll when symptom sheet is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in overscroll-contain">
      <div className="bg-slate-50 w-full max-w-2xl h-[88vh] max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border border-slate-200/80">
        
        {/* Drag handle & Header */}
        <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-100 flex flex-col items-center relative">
          <div className="w-12 h-1.5 rounded-full bg-slate-200 mb-3" />

          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Clean Today Date Header */}
          <div className="text-center">
            <span className="text-sm font-black text-slate-900 block capitalize">
              Hoy — {format(new Date(), "d 'de' MMMM", { locale: es })}
            </span>
            <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">
              Bitácora diaria de bienestar
            </span>
          </div>

          <button
            onClick={() => {
              onSave();
              onClose();
            }}
            className="absolute right-4 top-4 text-xs font-extrabold text-rose-600 hover:text-rose-700 cursor-pointer px-3 py-1 rounded-full bg-rose-50 border border-rose-100"
          >
            Guardar
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-white border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar síntoma, estado de ánimo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all"
            />
          </div>
        </div>

        {/* Scrollable Categories Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* CATEGORY 1: Sexo y Deseo Sexual */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Sexo y deseo sexual</h4>
            <div className="flex flex-wrap gap-2">
              <TagPill
                label="Sin relaciones"
                emoji="🚫"
                categoryTheme="pink"
                selected={sexTags.includes('none')}
                onClick={() => onToggleTag('sex', 'none')}
              />
              <TagPill
                label="Sexo protegido"
                emoji="🔒"
                categoryTheme="pink"
                selected={sexTags.includes('protected')}
                onClick={() => onToggleTag('sex', 'protected')}
              />
              <TagPill
                label="Sexo sin protección"
                emoji="🔓"
                categoryTheme="pink"
                selected={sexTags.includes('unprotected')}
                onClick={() => onToggleTag('sex', 'unprotected')}
              />
              <TagPill
                label="Orgasmo"
                emoji="✨"
                categoryTheme="pink"
                selected={sexTags.includes('orgasm')}
                onClick={() => onToggleTag('sex', 'orgasm')}
              />
              <TagPill
                label="Deseo elevado"
                emoji="❤️"
                categoryTheme="pink"
                selected={sexTags.includes('high_drive')}
                onClick={() => onToggleTag('sex', 'high_drive')}
              />
              <TagPill
                label="Deseo neutro"
                emoji="💓"
                categoryTheme="pink"
                selected={sexTags.includes('neutral_drive')}
                onClick={() => onToggleTag('sex', 'neutral_drive')}
              />
            </div>
          </div>

          {/* CATEGORY 2: Estado de Ánimo */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Estado de ánimo</h4>
            <div className="flex flex-wrap gap-2">
              <TagPill
                label="Calmada"
                emoji="😌"
                categoryTheme="yellow"
                selected={moodTags.includes('calm')}
                onClick={() => onToggleTag('mood', 'calm')}
              />
              <TagPill
                label="Feliz"
                emoji="😊"
                categoryTheme="yellow"
                selected={moodTags.includes('happy')}
                onClick={() => onToggleTag('mood', 'happy')}
              />
              <TagPill
                label="Con energía"
                emoji="⚡"
                categoryTheme="yellow"
                selected={moodTags.includes('energetic')}
                onClick={() => onToggleTag('mood', 'energetic')}
              />
              <TagPill
                label="Cambios de humor"
                emoji="😢"
                categoryTheme="yellow"
                selected={moodTags.includes('mood_swings')}
                onClick={() => onToggleTag('mood', 'mood_swings')}
              />
              <TagPill
                label="Irritada"
                emoji="😡"
                categoryTheme="yellow"
                selected={moodTags.includes('irritable')}
                onClick={() => onToggleTag('mood', 'irritable')}
              />
              <TagPill
                label="Ansiosa"
                emoji="😰"
                categoryTheme="yellow"
                selected={moodTags.includes('anxious')}
                onClick={() => onToggleTag('mood', 'anxious')}
              />
            </div>
          </div>

          {/* CATEGORY 3: Síntomas Físicos */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Síntomas Físicos</h4>
            <div className="flex flex-wrap gap-2">
              <TagPill
                label="Todo va bien"
                emoji="👍"
                categoryTheme="purple"
                selected={symptomTags.includes('all_good')}
                onClick={() => onToggleTag('symptom', 'all_good')}
              />
              <TagPill
                label="Cólicos"
                emoji="🌺"
                categoryTheme="purple"
                selected={symptomTags.includes('cramps')}
                onClick={() => onToggleTag('symptom', 'cramps')}
              />
              <TagPill
                label="Pechos sensibles"
                emoji="💗"
                categoryTheme="purple"
                selected={symptomTags.includes('tender_breasts')}
                onClick={() => onToggleTag('symptom', 'tender_breasts')}
              />
              <TagPill
                label="Dolor de cabeza"
                emoji="🤕"
                categoryTheme="purple"
                selected={symptomTags.includes('headache')}
                onClick={() => onToggleTag('symptom', 'headache')}
              />
              <TagPill
                label="Fatiga"
                emoji="🔋"
                categoryTheme="purple"
                selected={symptomTags.includes('fatigue')}
                onClick={() => onToggleTag('symptom', 'fatigue')}
              />
              <TagPill
                label="Hinchazón"
                emoji="🎈"
                categoryTheme="purple"
                selected={symptomTags.includes('bloating')}
                onClick={() => onToggleTag('symptom', 'bloating')}
              />
            </div>
          </div>

          {/* CATEGORY 4: Flujo Vaginal */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Flujo Vaginal</h4>
            <div className="flex flex-wrap gap-2">
              <TagPill
                label="Nada de flujo"
                emoji="💧"
                categoryTheme="lavender"
                selected={dischargeType === 'none'}
                onClick={() => onToggleTag('discharge', 'none')}
              />
              <TagPill
                label="Cremoso"
                emoji="🥛"
                categoryTheme="lavender"
                selected={dischargeType === 'creamy'}
                onClick={() => onToggleTag('discharge', 'creamy')}
              />
              <TagPill
                label="Clara de huevo"
                emoji="🥚"
                categoryTheme="lavender"
                selected={dischargeType === 'egg_white'}
                onClick={() => onToggleTag('discharge', 'egg_white')}
              />
              <TagPill
                label="Manchado leve"
                emoji="🩸"
                categoryTheme="lavender"
                selected={dischargeType === 'spotting'}
                onClick={() => onToggleTag('discharge', 'spotting')}
              />
            </div>
          </div>

          {/* CATEGORY 5: Hidratación y Peso Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <WaterTrackerWidget waterMl={waterMl} onChange={onUpdateWater} />
            <WeightTrackerWidget weightKg={weightKg} onChange={onUpdateWeight} />
          </div>

        </div>

        {/* Footer save action */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex justify-end shrink-0 z-10">
          <button
            type="button"
            onClick={() => {
              onSave();
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm shadow-lg shadow-rose-200 transition-all cursor-pointer active:scale-[0.98]"
          >
            Guardar registro del día
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
