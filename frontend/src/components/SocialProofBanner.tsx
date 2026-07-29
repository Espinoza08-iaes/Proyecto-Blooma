import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface SocialProofBannerProps {
  text: string;
  source?: string;
}

export default function SocialProofBanner({
  text,
  source = 'Respaldado por el equipo médico del MINSA y guías de la OMS'
}: SocialProofBannerProps) {
  return (
    <div className="w-full my-3 p-3 rounded-2xl bg-teal-50/80 border border-teal-100/80 flex items-start space-x-2.5 animate-fade-in">
      <div className="p-1 rounded-full bg-teal-500 text-white shrink-0 mt-0.5 shadow-sm">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
      <div>
        <p className="text-xs text-teal-950 font-semibold leading-relaxed">
          {text}
        </p>
        <span className="text-[10px] text-teal-700 block font-medium mt-0.5 italic">
          {source}
        </span>
      </div>
    </div>
  );
}
