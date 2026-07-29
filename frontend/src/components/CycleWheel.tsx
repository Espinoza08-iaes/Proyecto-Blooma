import React from 'react';
import { Sparkles, Calendar, Heart, ShieldAlert } from 'lucide-react';

interface CycleWheelProps {
  currentDay: number;
  avgLength: number;
  periodDuration: number;
  fertileStartDay: number;
  fertileEndDay: number;
  isDelayed: boolean;
  delayDays: number;
  themeColor: string;
}

export default function CycleWheel({
  currentDay,
  avgLength = 28,
  periodDuration = 5,
  fertileStartDay = 10,
  fertileEndDay = 15,
  isDelayed = false,
  delayDays = 0,
  themeColor = 'earth'
}: CycleWheelProps) {
  // SVG Config
  const size = 260;
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Determine current phase details
  let phaseName = 'Fase Folicular';
  let phaseColorClass = 'text-brand-earth-500';
  let phaseBgClass = 'bg-brand-earth-100';
  let phaseDesc = 'Tu cuerpo se prepara para la ovulación.';
  let fertilityLevel = 'Baja';
  let fertilityColor = 'text-brand-earth-600 bg-brand-earth-50';

  if (isDelayed) {
    phaseName = 'Retraso del Período';
    phaseColorClass = 'text-brand-coral-500 animate-pulse-soft';
    phaseBgClass = 'bg-brand-coral-50';
    phaseDesc = `Tu período tiene un retraso de ${delayDays} ${delayDays === 1 ? 'día' : 'días'}.`;
    fertilityLevel = 'Baja';
    fertilityColor = 'text-brand-coral-600 bg-brand-coral-50';
  } else if (currentDay <= periodDuration) {
    phaseName = 'Menstruación';
    phaseColorClass = 'text-brand-coral-500';
    phaseBgClass = 'bg-brand-coral-50';
    phaseDesc = 'Fase menstrual de tu ciclo.';
    fertilityLevel = 'Muy Baja';
    fertilityColor = 'text-brand-coral-600 bg-brand-coral-50';
  } else if (currentDay >= fertileStartDay && currentDay <= fertileEndDay) {
    phaseName = 'Ventana Fértil';
    phaseColorClass = 'text-brand-teal-600';
    phaseBgClass = 'bg-brand-teal-50';
    phaseDesc = 'Aproximándose a la ovulación. Alta probabilidad de concepción.';
    fertilityLevel = 'Alta';
    fertilityColor = 'text-brand-teal-700 bg-brand-teal-100';
  } else if (currentDay > fertileEndDay) {
    phaseName = 'Fase Lútea';
    phaseColorClass = 'text-purple-600';
    phaseBgClass = 'bg-purple-50';
    phaseDesc = 'Preparación hormonal para el próximo ciclo.';
    fertilityLevel = 'Baja';
    fertilityColor = 'text-purple-700 bg-purple-100';
  }

  // Calculate sector lengths for the circular timeline
  const periodProgress = (periodDuration / avgLength) * circumference;
  const follicularProgress = ((fertileStartDay - 1 - periodDuration) / avgLength) * circumference;
  const fertileProgress = ((fertileEndDay - fertileStartDay + 1) / avgLength) * circumference;
  const lutealProgress = ((avgLength - fertileEndDay) / avgLength) * circumference;

  // Rotation angles for sections
  const periodRotation = -90;
  const follicularRotation = periodRotation + (periodDuration / avgLength) * 360;
  const fertileRotation = follicularRotation + ((fertileStartDay - 1 - periodDuration) / avgLength) * 360;
  const lutealRotation = fertileRotation + ((fertileEndDay - fertileStartDay + 1) / avgLength) * 360;

  // Active indicator dot coordinates
  const activeDayNorm = isDelayed ? avgLength : Math.min(currentDay, avgLength);
  const activeAngle = ((activeDayNorm - 0.5) / avgLength) * 360 - 90; // center of the day segment
  const activeAngleRad = (activeAngle * Math.PI) / 180;
  const dotX = center + radius * Math.cos(activeAngleRad);
  const dotY = center + radius * Math.sin(activeAngleRad);

  // Array of total day marks to render outer ticks/dots
  const totalDaysArray = Array.from({ length: avgLength }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      
      {/* Dynamic Wheel container */}
      <div className="relative" style={{ width: size, height: size }}>
        
        {/* Ambient background glow that shifts colors slightly */}
        <div className={`absolute inset-6 rounded-full blur-3xl opacity-20 -z-10 transition-colors duration-1000 ${
          isDelayed ? 'bg-brand-coral-400' :
          currentDay <= periodDuration ? 'bg-brand-coral-400' :
          currentDay >= fertileStartDay && currentDay <= fertileEndDay ? 'bg-brand-teal-400' : 'bg-indigo-400'
        }`} />
        
        {/* SVG Circle Drawing */}
        <svg width={size} height={size} className="select-none">
          {/* Base shadow ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(0,0,0,0.02)"
            strokeWidth={strokeWidth + 2}
          />
          
          {/* Segment 1: Menstruation (Coral) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--color-earth-400, #ff8787)" // coral-400 / earth-400
            strokeWidth={strokeWidth}
            strokeDasharray={`${periodProgress} ${circumference - periodProgress}`}
            transform={`rotate(${periodRotation} ${center} ${center})`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Segment 2: Follicular (Neutral Warm) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--color-earth-200, #e3d5ca)" // light neutral
            strokeWidth={strokeWidth - 2}
            strokeDasharray={`${follicularProgress} ${circumference - follicularProgress}`}
            transform={`rotate(${follicularRotation} ${center} ${center})`}
            className="transition-all duration-500"
          />

          {/* Segment 3: Fertile (Teal/Turquoise) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--color-primary-400, #2dd4bf)" // Teal primary
            strokeWidth={strokeWidth}
            strokeDasharray={`${fertileProgress} ${circumference - fertileProgress}`}
            transform={`rotate(${fertileRotation} ${center} ${center})`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Segment 4: Luteal (Lavender/Indigo) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#d6c6e7" // soft lavender
            strokeWidth={strokeWidth - 2}
            strokeDasharray={`${lutealProgress} ${circumference - lutealProgress}`}
            transform={`rotate(${lutealRotation} ${center} ${center})`}
            className="transition-all duration-500"
          />

          {/* Outer Day ticks */}
          {totalDaysArray.map((dayNum) => {
            const angle = (dayNum / avgLength) * 360 - 90;
            const angleRad = (angle * Math.PI) / 180;
            const startR = radius + 11;
            const endR = radius + 15;
            const x1 = center + startR * Math.cos(angleRad);
            const y1 = center + startR * Math.sin(angleRad);
            const x2 = center + endR * Math.cos(angleRad);
            const y2 = center + endR * Math.sin(angleRad);
            
            const isDotActive = dayNum === currentDay && !isDelayed;
            
            return (
              <line
                key={dayNum}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isDotActive ? 'var(--color-primary-500)' : 'rgba(0,0,0,0.12)'}
                strokeWidth={isDotActive ? 3.5 : 1.5}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Current day indicator pulse */}
          <circle
            cx={dotX}
            cy={dotY}
            r={strokeWidth * 0.7}
            fill="white"
            stroke={isDelayed ? 'var(--color-earth-400)' : 'var(--color-primary-500)'}
            strokeWidth={3}
            className="shadow-md transition-all duration-500 animate-pulse-soft"
          />
        </svg>

        {/* Center content box */}
        <div className="absolute inset-8 rounded-full bg-white/90 backdrop-blur-sm border border-brand-earth-100/50 shadow-inner flex flex-col items-center justify-center text-center p-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-earth-500">
            {isDelayed ? 'Retraso' : `Día ${currentDay}`}
          </span>
          
          <h3 className={`text-2xl font-black mt-1 font-display tracking-tight leading-none ${phaseColorClass}`}>
            {isDelayed ? `+${delayDays} ${delayDays === 1 ? 'Día' : 'Días'}` : phaseName}
          </h3>

          <div className="w-10 h-0.5 my-2.5 rounded bg-brand-earth-200/60" />
          
          <p className="text-[10.5px] text-brand-earth-600 font-medium px-2 leading-relaxed">
            {phaseDesc}
          </p>

          <span className={`mt-2.5 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${fertilityColor}`}>
            Fértilidad: {fertilityLevel}
          </span>
        </div>
      </div>

      {/* Wellness Insight Pills */}
      <div className="flex gap-2 w-full justify-center text-[11px] font-semibold text-brand-earth-700">
        <div className="flex items-center gap-1 bg-white/80 border border-brand-earth-100 rounded-full px-3 py-1.5 shadow-sm">
          <Calendar className="h-3.5 w-3.5 text-brand-teal-500" />
          <span>Faltan {isDelayed ? 0 : Math.max(0, avgLength - currentDay)} días</span>
        </div>
        <div className="flex items-center gap-1 bg-white/80 border border-brand-earth-100 rounded-full px-3 py-1.5 shadow-sm">
          <Heart className="h-3.5 w-3.5 text-brand-coral-500" />
          <span>Etapa {themeColor === 'earth' ? 'Ciclo' : themeColor}</span>
        </div>
      </div>
    </div>
  );
}
