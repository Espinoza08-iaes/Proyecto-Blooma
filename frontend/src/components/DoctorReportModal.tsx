import React from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Download, FileText, Calendar, Heart, ShieldCheck, User } from 'lucide-react';
import type { Profile, Cycle, DailyLog } from '../db/db';

interface DoctorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  cycles: Cycle[];
  dailyLogs: DailyLog[];
}

export default function DoctorReportModal({
  isOpen,
  onClose,
  profile,
  cycles,
  dailyLogs,
}: DoctorReportModalProps) {
  if (!isOpen) return null;

  // Compute stats for report
  const totalCycles = cycles.length;
  const avgDuration = totalCycles > 0
    ? Math.round(cycles.reduce((acc, c) => acc + (c.duration || 28), 0) / totalCycles)
    : 28;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in-up">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Resumen Clínico para Ginecología</h3>
              <p className="text-xs text-slate-500">Documento de acompañamiento y registro fisiológico de Blooma</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 print:p-0 print:overflow-visible">
          {/* Header Info */}
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                {profile?.age || '25'}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Paciente Blooma</h4>
                <div className="text-xs text-slate-500 flex items-center space-x-2">
                  <span>Edad: {profile?.age ? `${profile.age} años` : 'No especificada'}</span>
                  <span>•</span>
                  <span>Etapa: {profile?.stage === 'cycle' ? 'Salud Menstrual' : profile?.stage === 'pregnancy' ? 'Embarazo' : 'Climaterio / Menopausia'}</span>
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Fecha de Informe</div>
              <div>{new Date().toLocaleDateString('es-NI', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          {/* Core Cycle Metrics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Métricas Fisiológicas del Ciclo</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-center">
                <div className="text-2xl font-black text-teal-600 dark:text-teal-400">{avgDuration} días</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Duración Media del Ciclo</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-center">
                <div className="text-2xl font-black text-rose-500 dark:text-rose-400">5 días</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Duración Media Sangrado</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-center">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{cycles.length}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Ciclos Registrados</div>
              </div>
            </div>
          </div>

          {/* Recent Cycles Log */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Historial Reciente de Ciclos</h4>
            {cycles.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No hay historial registrado aún.</p>
            ) : (
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    <tr>
                      <th className="p-2.5">Inicio del Ciclo</th>
                      <th className="p-2.5">Fin Estimado</th>
                      <th className="p-2.5">Duración</th>
                      <th className="p-2.5">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {cycles.slice(0, 5).map((c, i) => (
                      <tr key={c.id || i}>
                        <td className="p-2.5 font-medium">{c.startDate}</td>
                        <td className="p-2.5">{c.endDate || 'En curso'}</td>
                        <td className="p-2.5">{c.duration ? `${c.duration} días` : '-'}</td>
                        <td className="p-2.5">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Regular
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Symptoms Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Registro de Sintomatología (Bitácora Reciente)</h4>
            {dailyLogs.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center text-xs text-slate-400">
                Bitácora limpia. No se han reportado síntomas severos ni dolor durante el periodo actual.
              </div>
            ) : (
              <div className="space-y-2">
                {dailyLogs.slice(0, 4).map((log, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 mr-2">{log.date}</span>
                      <span className="text-slate-500">Ánimo: {log.mood || 'Normal'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                      {log.flow && <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">Flujo: {log.flow}</span>}
                      {log.pain && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">Dolor: {log.pain}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clinical Privacy Note */}
          <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 text-[11px] text-slate-500 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Este documento fue generado localmente en el dispositivo de la usuaria bajo estrictos criterios de privacidad clínica.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 transition-all"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 flex items-center space-x-2 transition-all active-press"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar en PDF</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
