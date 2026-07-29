import React, { useState } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FullCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditPeriodDates?: () => void;
}

export default function FullCalendarModal({ isOpen, onClose, onEditPeriodDates }: FullCalendarModalProps) {
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

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

  return (
    <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-rose-100/80 via-purple-50/50 to-slate-100 flex flex-col w-screen h-screen min-h-screen overflow-y-auto animate-fade-in relative overflow-x-hidden">
      
      {/* Ambient background blur elements for desktop */}
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

      {/* Top Header Bar */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Mes | Año Toggle (Flo Style Image 2) */}
        <div className="bg-slate-100/80 p-1 rounded-full flex space-x-1 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mes
          </button>
          <button
            type="button"
            onClick={() => setViewMode('year')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'year' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Año
          </button>
        </div>

        <div className="w-8" />
      </div>

      {/* Sticky Weekday Headers (D L M M J V S) */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-16 z-10 py-2.5">
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
      <div className="max-w-xl w-full mx-auto my-4 p-6 sm:p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/80 space-y-8 flex-1 mb-24">
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
      </div>

      {/* Bottom Floating Action Pill (Flo Style Image 2) */}
      <div className="fixed bottom-6 inset-x-0 flex justify-center z-30 px-4">
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

    </div>
  );
}
