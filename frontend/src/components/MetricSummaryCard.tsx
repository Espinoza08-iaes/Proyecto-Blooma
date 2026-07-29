import React from 'react';
import { Info, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface MetricSummaryCardProps {
  title: string;
  value: string | number;
  unit?: string;
  statusBadge?: 'NORMAL' | 'VIGILAR' | 'REGULAR' | 'VARIABLE';
  infoTooltip?: string;
}

export default function MetricSummaryCard({
  title,
  value,
  unit,
  statusBadge = 'NORMAL',
  infoTooltip
}: MetricSummaryCardProps) {
  const getBadgeStyle = () => {
    switch (statusBadge) {
      case 'NORMAL':
      case 'REGULAR':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'VIGILAR':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'VARIABLE':
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-slate-500 line-clamp-1">{title}</span>
        {infoTooltip && (
          <button
            type="button"
            title={infoTooltip}
            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="my-1">
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {value} {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
        </h3>
      </div>

      <div className="mt-2 flex items-center">
        <span
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getBadgeStyle()}`}
        >
          {statusBadge === 'NORMAL' || statusBadge === 'REGULAR' ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-3 h-3 text-amber-600" />
          )}
          <span>{statusBadge}</span>
        </span>
      </div>
    </div>
  );
}
