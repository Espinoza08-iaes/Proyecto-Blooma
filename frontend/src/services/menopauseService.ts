export interface TCCCard {
  id: string;
  category: 'sofocos' | 'sueño' | 'ansiedad' | 'osteoporosis';
  title: string;
  subtitle: string;
  durationMinutes: number;
  steps: string[];
  scientificRationale: string;
}

export const TCC_CARDS: TCCCard[] = [
  {
    id: 'tcc-sofocos-1',
    category: 'sofocos',
    title: 'Respiración Pautada para Mitigar Sofocos',
    subtitle: 'Técnica de Desaceleración Vagal',
    durationMinutes: 5,
    steps: [
      'Inhala profundamente por la nariz contando 5 segundos.',
      'Sostén el aire suavemente durante 2 segundos.',
      'Exhala de forma constante por la boca contando 5 segundos.',
      'Repite durante 5 minutos al sentir el primer destello de calor.'
    ],
    scientificRationale: 'La respiración lenta a 6 respiraciones/minuto reduce la reactividad del sistema nervioso simpático, disminuyendo la amplitud del sofoco en un 52%.'
  },
  {
    id: 'tcc-sueno-1',
    category: 'sueño',
    title: 'Control de Estímulos Nocturnos y Temperatura',
    subtitle: 'Re-acondicionamiento de la Habitación',
    durationMinutes: 3,
    steps: [
      'Mantén la temperatura del dormitorio entre 18°C y 20°C.',
      'Utiliza pijamas de algodón transpirable o fibra natural.',
      'Si despiertas por un sofoco nocturno, bebe medio vaso de agua fresca sin encender luces intensas.'
    ],
    scientificRationale: 'Evitar la iluminación brillante preserva los niveles de melatonina circulante, facilitando el re-inicio del ciclo de sueño profundo.'
  },
  {
    id: 'tcc-ansiedad-1',
    category: 'ansiedad',
    title: 'Reestructuración Cognitiva de la Niebla Mental',
    subtitle: 'Aceptación y Enfoque Gradual',
    durationMinutes: 4,
    steps: [
      'Escribe en una nota las 3 tareas clave del día sin intentar abarcar todo.',
      'Recuerda que las fluctuaciones de estrógeno son temporales y no afectan tu capacidad cognitiva real.',
      'Tómate una pausa de 3 minutos para estirar el cuello y hombros.'
    ],
    scientificRationale: 'Reducir la carga de memoria de trabajo disminuye la secreción de cortisol y la sensación de abrumamiento.'
  },
  {
    id: 'tcc-osteo-1',
    category: 'osteoporosis',
    title: 'Fortalecimiento Óseo y Prevención',
    subtitle: 'Pauta de Ejercicio de Impacto Moderado',
    durationMinutes: 15,
    steps: [
      'Realiza caminatas a paso ligero o ejercicios de resistencia 3 veces por semana.',
      'Asegura una ingesta de 1,200 mg de Calcio y 800 UI de Vitamina D3 al día.',
      'Consulta con tu médico sobre la Densitometría Ósea anual a partir de los 50 años.'
    ],
    scientificRationale: 'El impacto mecánico moderado estimula los osteoblastos para fijar minerales en la matriz ósea.'
  }
];

export function calculateThermalComfortIndex(
  hotFlashesToday: number,
  sleepQuality: 'good' | 'fair' | 'poor',
  skinTempAvg?: number
): {
  score: number; // 0-100 (100 = Comfort total)
  status: 'Óptimo' | 'Moderado' | 'Atención Requerida';
  recommendation: string;
} {
  let score = 100;
  
  // Deduct based on hot flashes count
  score -= hotFlashesToday * 12;

  // Deduct based on sleep quality
  if (sleepQuality === 'fair') score -= 15;
  if (sleepQuality === 'poor') score -= 30;

  // Deduct if nocturnal skin temp is elevated (>36.7 °C)
  if (skinTempAvg && skinTempAvg > 36.7) {
    score -= 10;
  }

  score = Math.max(10, Math.min(100, score));

  if (score >= 80) {
    return {
      score,
      status: 'Óptimo',
      recommendation: 'Tu equilibrio térmico y de descanso se mantiene estable hoy.'
    };
  } else if (score >= 50) {
    return {
      score,
      status: 'Moderado',
      recommendation: 'Has experimentado ligera inestabilidad térmica. Revisa tus tarjetas de TCC de respiración.'
    };
  }

  return {
    score,
    status: 'Atención Requerida',
    recommendation: 'Varias fluctuaciones térmicas detectadas. Te sugerimos realizar la sesión de respiración pautada de 5 min.'
  };
}
