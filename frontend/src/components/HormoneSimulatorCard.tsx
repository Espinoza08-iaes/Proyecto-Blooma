import React, { useState } from 'react';
import { Sparkles, Activity, Info, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

interface HormoneSimulatorCardProps {
  currentDay?: number;
}

// Generate 28 days of physiological hormonal curves (Estrogen & Progesterone)
const HORMONE_DATA = Array.from({ length: 28 }, (_, i) => {
  const day = i + 1;
  
  // Estrogen peak before ovulation (around day 12-14)
  let estrogen = 20;
  if (day <= 5) estrogen = 20 + day * 2;
  else if (day <= 13) estrogen = 30 + (day - 5) * 8; // Peak ~94 at day 13
  else if (day <= 16) estrogen = 94 - (day - 13) * 20;
  else if (day <= 22) estrogen = 34 + (day - 16) * 4; // Second smaller peak in luteal phase
  else estrogen = 58 - (day - 22) * 6;

  // Progesterone peak in mid-luteal phase (around day 20-22)
  let progesterone = 5;
  if (day <= 14) progesterone = 5 + Math.sin((day / 14) * Math.PI) * 5;
  else if (day <= 22) progesterone = 10 + (day - 14) * 11; // Peak ~98 at day 22
  else progesterone = 98 - (day - 22) * 15;

  return {
    day: `Día ${day}`,
    dayNum: day,
    estrogen: Math.round(estrogen),
    progesterone: Math.round(progesterone)
  };
});

export default function HormoneSimulatorCard({ currentDay = 14 }: HormoneSimulatorCardProps) {
  const [selectedDay, setSelectedDay] = useState(currentDay);

  const getPhaseInfo = (day: number) => {
    if (day <= 5) {
      return {
        phase: 'Fase Menstrual',
        color: 'text-rose-500 bg-rose-50 border-rose-200',
        badgeColor: 'bg-rose-500',
        desc: 'Estrógeno y Progesterona en niveles mínimos. Es normal sentir menor energía física.',
        tip: 'Prioriza el descanso, alimentos ricos en hierro y té caliente de manzanilla.'
      };
    } else if (day <= 13) {
      return {
        phase: 'Fase Folicular',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        badgeColor: 'bg-amber-500',
        desc: 'El estrógeno asciende progresivamente. Aumento notable de energía, concentración y claridad mental.',
        tip: 'Momento óptimo para ejercicios de fuerza, proyectos creativos e interacción social.'
      };
    } else if (day <= 16) {
      return {
        phase: 'Pico de Ovulación',
        color: 'text-teal-600 bg-teal-50 border-teal-200',
        badgeColor: 'bg-teal-600',
        desc: 'Pico máximo de estrógeno y hormona luteinizante (LH). Ventana de mayor fertilidad fisiológica.',
        tip: 'Piel luminosa y alto nivel de libido natural. Registra cambios en el flujo cervical.'
      };
    } else {
      return {
        phase: 'Fase Lútea',
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        badgeColor: 'bg-purple-600',
        desc: 'La Progesterona domina esta fase para preparar el endometrio. Sensación de introspección y calma.',
        tip: 'Consumo de magnesio, caminatas suaves y estiramientos para prevenir molestias premastruales.'
      };
    }
  };

  const activeInfo = getPhaseInfo(selectedDay);
  const currentData = HORMONE_DATA.find(d => d.dayNum === selectedDay) || HORMONE_DATA[13];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">Simulador Fisiológico Hormonal</h3>
            <p className="text-[10px] text-slate-400 font-medium">Curvas dinámicas de Estrógeno y Progesterona</p>
          </div>
        </div>

        <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border ${activeInfo.color}`}>
          {activeInfo.phase}
        </span>
      </div>

      {/* Interactive Day Selector Slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span>Seleccionar Día del Ciclo:</span>
          <span className="text-purple-600 font-black">Día {selectedDay} de 28</span>
        </div>
        <input
          type="range"
          min={1}
          max={28}
          value={selectedDay}
          onChange={e => setSelectedDay(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>

      {/* Chart */}
      <div className="h-44 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={HORMONE_DATA}>
            <defs>
              <linearGradient id="estrogenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E85B75" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E85B75" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="progGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="dayNum" stroke="#94A3B8" fontSize={10} tickLine={false} />
            <YAxis hide domain={[0, 110]} />
            <Tooltip />
            <Area type="monotone" dataKey="estrogen" name="Estrógeno" stroke="#E85B75" strokeWidth={2.5} fill="url(#estrogenGrad)" />
            <Area type="monotone" dataKey="progesterone" name="Progesterona" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#progGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Hormone Values & Clinical Insight */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Estrógeno</span>
            <span className="text-base font-black text-rose-950">{currentData.estrogen} pg/mL</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-rose-500" />
        </div>

        <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider block">Progesterona</span>
            <span className="text-base font-black text-purple-950">{currentData.progesterone} ng/mL</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-purple-600" />
        </div>
      </div>

      {/* Clinical Guidance Tip */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
        <p className="text-slate-700 leading-relaxed">{activeInfo.desc}</p>
        <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-[11px] pt-1">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
          <span>{activeInfo.tip}</span>
        </div>
      </div>

    </div>
  );
}
