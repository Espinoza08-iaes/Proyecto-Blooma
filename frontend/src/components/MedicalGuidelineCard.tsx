import React from 'react';
import { BookOpen, ShieldCheck, ExternalLink } from 'lucide-react';

interface MedicalGuidelineCardProps {
  title?: string;
  statusText: string;
  explanation: string;
  sourceCitation: string;
  doctorName?: string;
  doctorRole?: string;
}

export default function MedicalGuidelineCard({
  title = 'Según guías médicas y recursos',
  statusText,
  explanation,
  sourceCitation,
  doctorName = 'Dra. Elena Ramos',
  doctorRole = 'Especialista en Ginecología y Salud Femenina MINSA'
}: MedicalGuidelineCardProps) {
  return (
    <div className="my-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="flex items-center space-x-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-teal-600" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Doctor / Specialist Avatar Illustration */}
        <div className="sm:col-span-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-teal-50/60 border border-teal-100/60 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-300 flex items-center justify-center shadow-md mb-2">
            <span className="text-2xl">👩‍⚕️</span>
          </div>
          <span className="text-xs font-bold text-slate-800">{doctorName}</span>
          <span className="text-[10px] text-slate-500 line-clamp-2 leading-tight">{doctorRole}</span>
        </div>

        {/* Text Content */}
        <div className="sm:col-span-2 space-y-2">
          <span className="text-xs font-semibold text-slate-500">Tu estado de salud es considerado</span>
          <h3 className="text-2xl font-black text-emerald-600 tracking-tight">{statusText}</h3>
          
          <p className="text-xs text-slate-600 leading-relaxed">
            {explanation}
          </p>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 leading-normal italic">
              1. {sourceCitation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
