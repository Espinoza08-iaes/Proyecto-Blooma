import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar as CalendarIcon, Info } from 'lucide-react';

interface FullCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditPeriodDates?: () => void;
}

export default function FullCalendarModal({ isOpen, onClose, onEditPeriodDates }: FullCalendarModalProps) {
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  // Lock body scroll when calendar modal is active
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

  const monthsList = [
    {
      name: 'junio',
      year: 2026,
      daysInMonth: 30,
      startOffset: 1, // Monday
      periodStart: 10,
      periodEnd: 14,
      fertileStart: 19,
      fertileEnd: 24,
      today: null
    },
    {
      name: 'julio',
      year: 2026,
      daysInMonth: 31,
      startOffset: 3, // Wednesday
      periodStart: 10,
      periodEnd: 14,
      fertileStart: 19,
      fertileEnd: 24,
      today: 25
    },
    {
      name: 'agosto',
      year: 2026,
      daysInMonth: 31,
      startOffset: 6, // Saturday
      periodStart: 8,
      periodEnd: 12,
      fertileStart: 16,
      fertileEnd: 21,
      today: null
    }
  ];

  const FULL_YEAR_2026 = [
    { name: 'Enero', days: 31, offset: 4, periodStart: 12, periodEnd: 16, fertileStart: 21, fertileEnd: 26 },
    { name: 'Febrero', days: 28, offset: 0, periodStart: 9, periodEnd: 13, fertileStart: 18, fertileEnd: 23 },
    { name: 'Marzo', days: 31, offset: 0, periodStart: 9, periodEnd: 13, fertileStart: 18, fertileEnd: 23 },
    { name: 'Abril', days: 30, offset: 3, periodStart: 6, periodEnd: 10, fertileStart: 15, fertileEnd: 20 },
    { name: 'Mayo', days: 31, offset: 5, periodStart: 4, periodEnd: 8, fertileStart: 13, fertileEnd: 18 },
    { name: 'Junio', days: 30, offset: 1, periodStart: 1, periodEnd: 5, fertileStart: 10, fertileEnd: 15 },
    { name: 'Julio', days: 31, offset: 3, periodStart: 10, periodEnd: 14, fertileStart: 19, fertileEnd: 24, today: 25 },
    { name: 'Agosto', days: 31, offset: 6, periodStart: 8, periodEnd: 12, fertileStart: 16, fertileEnd: 21 },
    { name: 'Septiembre', days: 30, offset: 2, periodStart: 5, periodEnd: 9, fertileStart: 14, fertileEnd: 19 },
    { name: 'Octubre', days: 31, offset: 4, periodStart: 3, periodEnd: 7, fertileStart: 12, fertileEnd: 17 },
    { name: 'Noviembre', days: 30, offset: 0, periodStart: 1, periodEnd: 5, fertileStart: 10, fertileEnd: 15 },
    { name: 'Diciembre', days: 31, offset: 2, periodStart: 1, periodEnd: 5, fertileStart: 9, fertileEnd: 14 },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-[#FFF9F9] flex flex-col w-screen h-screen min-h-screen overflow-y-auto animate-fade-in relative overflow-x-hidden overscroll-contain pb-24">
      
      {/* Background ambient mesh elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-rose-200/40 via-pink-100/30 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-[5%] right-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-purple-200/40 via-indigo-100/30 to-transparent rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-gradient-to-tr from-amber-100/40 via-rose-100/30 to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Top Header Bar */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Mes | Año Toggle */}
        <div className="bg-slate-100 p-1 rounded-full flex space-x-1 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mes
          </button>
          <button
            type="button"
            onClick={() => setViewMode('year')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'year' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Año
          </button>
        </div>

        <div className="w-8" />
      </div>

      {/* VIEW MODE: MONTH (3-Month Scroll View) */}
      {viewMode === 'month' && (
        <>
          {/* Sticky Weekday Headers (D L M M J V S) */}
          <div className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-16 z-20 py-2.5 shadow-xs">
            <div className="max-w-xl mx-auto grid grid-cols-7 text-center text-xs font-black text-slate-400">
              <span>D</span>
              <span>L</span>
              <span>M</span>
              <span>M</span>
              <span>J</span>
              <span>V</span>
              <span>S</span>
            </div>
          </div>

          {/* Desktop Card Container for Months */}
          <div className="max-w-xl w-full mx-auto my-4 p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/80 space-y-8 flex-1 mb-12">
            {monthsList.map((m, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-center text-base font-black text-slate-900 capitalize tracking-tight">
                  {m.name} {m.year}
                </h3>

                <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
                  {/* Empty offset padding */}
                  {Array.from({ length: m.startOffset }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {/* Month Days */}
                  {Array.from({ length: m.daysInMonth }, (_, i) => i + 1).map(day => {
                    const isPeriod = day >= m.periodStart && day <= m.periodEnd;
                    const isFertile = day >= m.fertileStart && day <= m.fertileEnd;
                    const isToday = m.today === day;

                    return (
                      <div key={day} className="flex flex-col items-center justify-center relative">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isPeriod
                              ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                              : isFertile
                              ? 'text-teal-600 font-extrabold'
                              : isToday
                              ? 'border-2 border-dashed border-teal-500 text-slate-900 font-black'
                              : 'text-slate-700'
                          }`}
                        >
                          {day}
                        </div>
                        {isToday && (
                          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-tighter mt-0.5">
                            HOY
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Visual Legend */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-around text-[11px] text-slate-600 font-medium">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span>Periodo Menstrual</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-500 inline-block" />
                <span>Ventana Fértil</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full border-2 border-dashed border-teal-500 inline-block" />
                <span>Día Actual</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* VIEW MODE: YEAR (12-Month Annual Overview) */}
      {viewMode === 'year' && (
        <div className="max-w-4xl w-full mx-auto my-4 p-4 sm:p-6 space-y-6 flex-1 mb-12">
          
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Año 2026 — Panorámica del Ciclo</h2>
            <p className="text-xs text-slate-500">Proyección y registro continuo de 12 meses</p>
          </div>

          {/* 12 Months Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FULL_YEAR_2026.map((m, idx) => (
              <div key={idx} className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider text-center">
                  {m.name}
                </h4>

                {/* Weekday micro header */}
                <div className="grid grid-cols-7 text-[9px] font-bold text-slate-400 text-center">
                  <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
                </div>

                {/* Mini days grid */}
                <div className="grid grid-cols-7 gap-y-1 text-center text-[10px]">
                  {Array.from({ length: m.offset }).map((_, i) => (
                    <div key={`off-${i}`} />
                  ))}
                  {Array.from({ length: m.days }, (_, i) => i + 1).map(day => {
                    const isPeriod = day >= m.periodStart && day <= m.periodEnd;
                    const isFertile = day >= m.fertileStart && day <= m.fertileEnd;
                    const isToday = m.today === day;

                    return (
                      <div
                        key={day}
                        className={`h-6 flex items-center justify-center rounded-full font-semibold ${
                          isPeriod
                            ? 'bg-rose-500 text-white font-bold'
                            : isFertile
                            ? 'bg-teal-50 text-teal-700 font-bold'
                            : isToday
                            ? 'border border-teal-500 font-black text-teal-800'
                            : 'text-slate-600'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-around text-xs text-slate-600 font-medium">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span>Días de Periodo</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-teal-100 border border-teal-300 inline-block" />
              <span>Ventana de Fertilidad</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full border-2 border-teal-500 inline-block" />
              <span>Día de Hoy</span>
            </div>
          </div>

        </div>
      )}

      {/* Bottom Floating Action Pill */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center z-30 px-4 pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            if (onEditPeriodDates) onEditPeriodDates();
            onClose();
          }}
          className="px-8 py-3.5 rounded-full bg-rose-500 text-white font-extrabold text-xs shadow-xl shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95 cursor-pointer"
        >
          Editar fechas de periodo
        </button>
      </div>

    </div>,
    document.body
  );
}
