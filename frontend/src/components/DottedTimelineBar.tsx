import React from 'react';

interface DottedTimelineBarProps {
  totalDays?: number;
  periodDays?: number;
  fertileStart?: number;
  fertileEnd?: number;
  currentDay?: number;
}

export default function DottedTimelineBar({
  totalDays = 28,
  periodDays = 5,
  fertileStart = 11,
  fertileEnd = 16,
  currentDay = 14
}: DottedTimelineBarProps) {
  const dots = Array.from({ length: Math.min(totalDays, 35) }, (_, i) => i + 1);

  const getDotStyle = (day: number) => {
    if (day <= periodDays) {
      return 'bg-rose-500 shadow-sm shadow-rose-200 ring-2 ring-rose-200'; // Menstruation
    }
    if (day >= fertileStart && day <= fertileEnd) {
      return 'bg-teal-400 shadow-sm shadow-teal-100'; // Fertile / Ovulation
    }
    if (day > fertileEnd && day <= currentDay) {
      return 'bg-slate-700'; // Luteal / Delayed up to today
    }
    return 'bg-slate-200'; // Future expected days
  };

  return (
    <div className="w-full my-3">
      <div className="flex items-center justify-between overflow-x-auto py-2 space-x-1.5 no-scrollbar">
        {dots.map(day => (
          <div key={day} className="flex flex-col items-center group relative">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-200 ${getDotStyle(day)} ${
                day === currentDay ? 'scale-125 ring-2 ring-offset-1 ring-slate-900' : ''
              }`}
            />
            {day % 5 === 0 && (
              <span className="text-[9px] font-medium text-slate-400 mt-1">d{day}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-4 mt-2 text-[10px] text-slate-500 font-medium">
        <span className="inline-flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Periodo</span>
        </span>
        <span className="inline-flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span>Fértil</span>
        </span>
        <span className="inline-flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-slate-700"></span>
          <span>Lútea / Retraso</span>
        </span>
      </div>
    </div>
  );
}
