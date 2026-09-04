import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Activity, Heart, Sparkles, Brain, CheckCircle2, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { db, type MRSEvaluation, type Profile } from '../db/db';
import { MRS_QUESTIONS, calculateMRSScores, type ClimactericStage } from '../services/menopauseService';

interface MRSEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onEvaluationCompleted?: (evalRecord: MRSEvaluation) => void;
}

export default function MRSEvaluationModal({
  isOpen,
  onClose,
  profile,
  onEvaluationCompleted
}: MRSEvaluationModalProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<'somatic' | 'psychological' | 'urogenital'>('somatic');
  const [isCompleted, setIsCompleted] = useState(false);
  const [savedResult, setSavedResult] = useState<MRSEvaluation | null>(null);

  // Lock body scroll
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

  const handleScoreChange = (qId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [qId]: score }));
  };

  const currentQuestions = MRS_QUESTIONS.filter(q => q.category === activeCategory);
  const totalAnswered = Object.keys(answers).length;
  const isAllAnswered = totalAnswered >= MRS_QUESTIONS.length;

  const currentScores = calculateMRSScores(answers);

  const handleSaveEvaluation = async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const climStage: ClimactericStage = profile?.climactericStage || 'early_perimenopause';

    const record: MRSEvaluation = {
      date: todayStr,
      somaticScore: currentScores.somaticScore,
      psychologicalScore: currentScores.psychologicalScore,
      urogenitalScore: currentScores.urogenitalScore,
      totalScore: currentScores.totalScore,
      severity: currentScores.severity,
      climactericStage: climStage,
      answers
    };

    const id = await db.mrsEvaluations.add(record);
    record.id = id;
    setSavedResult(record);
    setIsCompleted(true);
    if (onEvaluationCompleted) onEvaluationCompleted(record);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overscroll-contain">
      <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50 via-emerald-50 to-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-200">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Evaluación del Climaterio (MRS)</h3>
              <p className="text-xs text-slate-500 font-medium">Menopause Rating Scale — OMS & MINSA</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {!isCompleted ? (
            <>
              {/* Category Tab Switcher */}
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveCategory('somatic')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    activeCategory === 'somatic'
                      ? 'bg-white text-teal-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Somático ({MRS_QUESTIONS.filter(q => q.category === 'somatic' && answers[q.id] !== undefined).length}/4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('psychological')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    activeCategory === 'psychological'
                      ? 'bg-white text-teal-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Psicológico ({MRS_QUESTIONS.filter(q => q.category === 'psychological' && answers[q.id] !== undefined).length}/4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory('urogenital')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    activeCategory === 'urogenital'
                      ? 'bg-white text-teal-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Urogenital ({MRS_QUESTIONS.filter(q => q.category === 'urogenital' && answers[q.id] !== undefined).length}/3)</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {currentQuestions.map(q => {
                  const currentVal = answers[q.id] ?? 0;
                  return (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{q.question}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{q.description}</p>
                      </div>

                      {/* Likert Scale Buttons (0: Ninguno to 4: Muy Severo) */}
                      <div className="grid grid-cols-5 gap-1.5 pt-1">
                        {[
                          { val: 0, label: 'Ninguno' },
                          { val: 1, label: 'Leve' },
                          { val: 2, label: 'Moderado' },
                          { val: 3, label: 'Severo' },
                          { val: 4, label: 'Muy Severo' }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => handleScoreChange(q.id, opt.val)}
                            className={`py-2 px-1 rounded-xl text-[10px] font-extrabold flex flex-col items-center justify-center transition-all cursor-pointer ${
                              answers[q.id] === opt.val
                                ? 'bg-teal-600 text-white shadow-md scale-102'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300'
                            }`}
                          >
                            <span className="text-xs">{opt.val}</span>
                            <span className="truncate w-full text-center">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Subtotal Bar */}
              <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-100 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800">
                    Puntaje Acumulado MRS
                  </span>
                  <p className="text-xs font-bold text-slate-900">
                    {currentScores.totalScore} / 44 pts • Impacto {currentScores.severity.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-teal-700 font-semibold">
                    Respondidas: {totalAnswered} / {MRS_QUESTIONS.length}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEvaluation}
                  className="flex-1 py-3 rounded-2xl bg-teal-600 text-white font-black text-xs shadow-md shadow-teal-200 hover:bg-teal-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Evaluación</span>
                </button>
              </div>
            </>
          ) : (
            /* Results View */
            <div className="text-center space-y-5 py-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Evaluación Guardada en Local (IndexedDB)
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Puntaje Total: {savedResult?.totalScore} / 44 pts
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Clasificación Clínica: <strong className="uppercase text-teal-700">{savedResult?.severity}</strong>
                </p>
              </div>

              {/* Sub-scores breakdown */}
              <div className="grid grid-cols-3 gap-3 text-left">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block">Somático</span>
                  <span className="text-base font-black text-slate-800">{savedResult?.somaticScore} pts</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block">Psicológico</span>
                  <span className="text-base font-black text-slate-800">{savedResult?.psychologicalScore} pts</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block">Urogenital</span>
                  <span className="text-base font-black text-slate-800">{savedResult?.urogenitalScore} pts</span>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-left space-y-1.5">
                <div className="flex items-center space-x-2 text-teal-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Recomendación Personalizada:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentScores.recommendedAction}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-teal-600 text-white font-extrabold text-xs shadow-md shadow-teal-200 hover:bg-teal-700 transition-all cursor-pointer"
              >
                Volver al Panel de Menopausia
              </button>
            </div>
          )}

        </div>

      </div>
    </div>,
    document.body
  );
}
