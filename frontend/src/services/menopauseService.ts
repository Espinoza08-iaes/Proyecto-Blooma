export type ClimactericStage = 
  | 'premenopause' 
  | 'early_perimenopause' 
  | 'late_perimenopause' 
  | 'menopause_milestone' 
  | 'postmenopause';

export interface ClimactericStageInfo {
  id: ClimactericStage;
  title: string;
  shortBadge: string;
  ageRange: string;
  biologicalCriteria: string;
  primarySymptoms: string[];
  clinicalPriority: string;
  recommendations: string[];
}

export const CLIMACTERIC_STAGES: Record<ClimactericStage, ClimactericStageInfo> = {
  premenopause: {
    id: 'premenopause',
    title: 'Premenopausia / Transición Inicial',
    shortBadge: 'Fase Inicial (STRAW -3)',
    ageRange: '40 – 45 años',
    biologicalCriteria: 'Ciclos menstruales regulares o con fluctuaciones menores a ±7 días. Niveles de estrógeno variables pero ovulación preservada.',
    primarySymptoms: [
      'Cambios sutiles en la duración del flujo menstrual',
      'Síndrome premenstrual ligeramente más marcado',
      'Primeros cambios leves de humor o energía'
    ],
    clinicalPriority: 'Educación preventiva y monitoreo basal de ciclos menstruales.',
    recommendations: [
      'Mantener registro regular del ciclo en Blooma.',
      'Dieta rica en antioxidantes y magnesio.',
      'Ejercicio aeróbico moderado 150 min/semana.'
    ]
  },
  early_perimenopause: {
    id: 'early_perimenopause',
    title: 'Perimenopausia Temprana',
    shortBadge: 'Transición Activa (STRAW -2)',
    ageRange: '44 – 48 años',
    biologicalCriteria: 'Variabilidad persistente en la duración del ciclo con diferencias mayores a 7 días entre ciclos consecutivos. Elevación intermitente de FSH.',
    primarySymptoms: [
      'Ciclos menstruales irregulares (más cortos o más largos)',
      'Sofocos diurnos ocasionales y sensación de calor repentino',
      'Alteraciones iniciales en la arquitectura del sueño'
    ],
    clinicalPriority: 'Manejo de síntomas vasomotores y regulación del descanso nocturno.',
    recommendations: [
      'Técnicas de respiración pautada TCC ante sofocos.',
      'Control de temperatura en la habitación (18°C–20°C).',
      'Reducción de consumo de cafeína, alcohol y comidas muy picantes.'
    ]
  },
  late_perimenopause: {
    id: 'late_perimenopause',
    title: 'Perimenopausia Tardía',
    shortBadge: 'Fase Avanzada (STRAW -1)',
    ageRange: '47 – 51 años',
    biologicalCriteria: 'Intervalos de amenorrea de 60 días o más (2 o más ciclos saltados). Disminución notable de estradiol y picos elevados de FSH.',
    primarySymptoms: [
      'Sofocos nocturnos frecuentes y sudoraciones frías',
      'Niebla mental transitoria y cambios emocionales marcados',
      'Sensación inicial de sequedad vaginal o molestias pélvicas'
    ],
    clinicalPriority: 'Alivio sintomático integral y resguardo de la salud urogenital.',
    recommendations: [
      'Uso de hidratantes íntimos no hormonales según necesidad.',
      'Ejercicios de Kegel diarios para tonificación del suelo pélvico.',
      'Sesiones de respiración guiada de 5 minutos al despertar.'
    ]
  },
  menopause_milestone: {
    id: 'menopause_milestone',
    title: 'Menopausia Fisiológica (Hito Clínico)',
    shortBadge: 'Hito de los 12 Meses (STRAW 0)',
    ageRange: '48 – 52 años (Promedio en Nicaragua: 49.5)',
    biologicalCriteria: 'Cese completo y definitivo de la menstruación confirmado tras 12 meses consecutivos de amenorrea espontánea sin causas patológicas.',
    primarySymptoms: [
      'Ausencia total de sangrado por 12 meses consecutivos',
      'Estabilización gradual de las fluctuaciones térmicas intensas',
      'Inicio de la fase no reproductiva ovárica definitiva'
    ],
    clinicalPriority: 'Transición del enfoque reproductivo al cuidado cardiovascular, metabólico y óseo.',
    recommendations: [
      'Control médico general de perfil lipídico y glicemia.',
      'Programar Densitometría Ósea basal (DEXA).',
      'Refuerzo de ingesta de Calcio (1,200 mg) y Vitamina D3 (800 UI).'
    ]
  },
  postmenopause: {
    id: 'postmenopause',
    title: 'Postmenopausia Estable',
    shortBadge: 'Salud Plena (STRAW +1/+2)',
    ageRange: '50+ años',
    biologicalCriteria: 'Fase posterior a la menopausia. Niveles estrogénicos bajos pero estables. El riesgo de pérdida de densidad ósea se acelera los primeros 5 años.',
    primarySymptoms: [
      'Disminución progresiva de la frecuencia de sofocos',
      'Mayor susceptibilidad a la resequedad urogenital y pérdida ósea',
      'Mayor importancia del tono muscular y equilibrio'
    ],
    clinicalPriority: 'Prevención activa de osteoporosis, salud cardiovascular y preservación del suelo pélvico.',
    recommendations: [
      'Ejercicios de fuerza y resistencia 3 veces por semana para mineralización ósea.',
      'Exposición solar matutina de 15 minutos para síntesis de Vitamina D.',
      'Continuidad del entrenamiento muscular de suelo pélvico (Kegel).'
    ]
  }
};

// Escala de Evaluación del Climaterio MRS (Menopause Rating Scale - OMS / MINSA)
export interface MRSQuestion {
  id: string;
  category: 'somatic' | 'psychological' | 'urogenital';
  question: string;
  description: string;
}

export const MRS_QUESTIONS: MRSQuestion[] = [
  // Somática
  {
    id: 'mrs_1',
    category: 'somatic',
    question: '1. Sofocos y Sudoraciones',
    description: 'Episodios repentinos de calor intenso en cara, cuello o pecho acompañados de sudor.'
  },
  {
    id: 'mrs_2',
    category: 'somatic',
    question: '2. Molestias Cardíacas',
    description: 'Palpitaciones, latidos acelerados o sensación de opresión sin causa aparente.'
  },
  {
    id: 'mrs_3',
    category: 'somatic',
    question: '3. Trastornos del Sueño',
    description: 'Dificultad para conciliar el sueño, despertares nocturnos o sensación de descanso no reparador.'
  },
  {
    id: 'mrs_4',
    category: 'somatic',
    question: '4. Molestias Musculares y Articulares',
    description: 'Dolores o rigidez en coyunturas, espalda, hombros o rodillas.'
  },
  // Psicológica
  {
    id: 'mrs_5',
    category: 'psychological',
    question: '5. Estado de Ánimo Decaído o Depresivo',
    description: 'Sentimientos de tristeza, desgana, ganas de llorar o falta de motivación.'
  },
  {
    id: 'mrs_6',
    category: 'psychological',
    question: '6. Irritabilidad y Cambios de Humor',
    description: 'Sentirse nerviosa, enojarse con facilidad o poca tolerancia a situaciones cotidianas.'
  },
  {
    id: 'mrs_7',
    category: 'psychological',
    question: '7. Ansiedad e Inquietud',
    description: 'Sensación de angustia interior, tensión constante o sobresaltos.'
  },
  {
    id: 'mrs_8',
    category: 'psychological',
    question: '8. Cansancio Físico y Mental (Niebla Cerebral)',
    description: 'Agotamiento general, olvidos frecuentes o dificultad para concentrarse.'
  },
  // Urogenital
  {
    id: 'mrs_9',
    category: 'urogenital',
    question: '9. Problemas Sexuales',
    description: 'Disminución del deseo sexual (libido) o molestias/dolor durante las relaciones.'
  },
  {
    id: 'mrs_10',
    category: 'urogenital',
    question: '10. Molestias Urinarias / Vejiga',
    description: 'Necesidad urgente de orinar, escapes leves al toser o reír, o mayor frecuencia.'
  },
  {
    id: 'mrs_11',
    category: 'urogenital',
    question: '11. Sequedad Vaginal',
    description: 'Sensación de ardor, tirantez o picor en la zona íntima.'
  }
];

export function calculateMRSScores(answers: Record<string, number>): {
  somaticScore: number;
  psychologicalScore: number;
  urogenitalScore: number;
  totalScore: number;
  severity: 'leve' | 'moderada' | 'severa';
  summaryText: string;
  recommendedAction: string;
} {
  let somatic = 0;
  let psychological = 0;
  let urogenital = 0;

  MRS_QUESTIONS.forEach(q => {
    const val = answers[q.id] || 0;
    if (q.category === 'somatic') somatic += val;
    if (q.category === 'psychological') psychological += val;
    if (q.category === 'urogenital') urogenital += val;
  });

  const total = somatic + psychological + urogenital;

  let severity: 'leve' | 'moderada' | 'severa' = 'leve';
  let summaryText = 'Impacto leve o asintomático.';
  let recommendedAction = 'Continúa con tus hábitos saludables de nutrición, descanso y actividad física.';

  if (total >= 17 || somatic >= 9 || psychological >= 9 || urogenital >= 6) {
    severity = 'severa';
    summaryText = 'Impacto severo en la calidad de vida.';
    recommendedAction = 'Te recomendamos consultar con tu médico o ginecólogo del centro de salud MINSA para evaluar opciones terapéuticas personalizadas.';
  } else if (total >= 9 || somatic >= 5 || psychological >= 5 || urogenital >= 4) {
    severity = 'moderada';
    summaryText = 'Impacto moderado en tu bienestar.';
    recommendedAction = 'Aplica las pautas de Terapia Cognitivo-Conductual, ejercicios de Kegel y ajuste nutricional sugeridos en la app.';
  }

  return {
    somaticScore: somatic,
    psychologicalScore: psychological,
    urogenitalScore: urogenital,
    totalScore: total,
    severity,
    summaryText,
    recommendedAction
  };
}

export interface TCCCard {
  id: string;
  category: 'sofocos' | 'sueño' | 'ansiedad' | 'osteoporosis' | 'urogenital';
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
      'Mantén la temperatura del dormitorio fresca (18°C a 20°C).',
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
      'Recuerda que las fluctuaciones hormonales son fisiológicas y no representan un deterioro cognitivo.',
      'Tómate una pausa de 3 minutos para estirar el cuello y hombros.'
    ],
    scientificRationale: 'Reducir la carga de memoria de trabajo disminuye la secreción de cortisol y la sensación de abrumamiento.'
  },
  {
    id: 'tcc-osteo-1',
    category: 'osteoporosis',
    title: 'Fortalecimiento Óseo y Prevención',
    subtitle: 'Pauta de Impacto Moderado y Fuerza',
    durationMinutes: 15,
    steps: [
      'Realiza caminatas a paso ligero o ejercicios con pesas ligeras 3 veces por semana.',
      'Asegura una ingesta de 1,200 mg de Calcio y 800 UI de Vitamina D3 al día.',
      'Consulta con tu médico sobre la Densitometría Ósea (DEXA) a partir de los 50 años.'
    ],
    scientificRationale: 'El impacto mecánico moderado estimula los osteoblastos para fijar minerales en la matriz ósea.'
  },
  {
    id: 'tcc-urogenital-1',
    category: 'urogenital',
    title: 'Cuidado del Suelo Pélvico y Confort Íntimo',
    subtitle: 'Técnica de Acondicionamiento Pélvico',
    durationMinutes: 5,
    steps: [
      'Realiza 3 series de 10 contracciones de Kegel (contraer 3 seg, relajar 3 seg).',
      'Utiliza lubricantes o geles hidratantes con base acuosa o ácido hialurónico.',
      'Evita jabones perfumados que alteren el pH vaginal.'
    ],
    scientificRationale: 'El fortalecimiento muscular del periné previene la incontinencia de esfuerzo y estimula el flujo vascular urogenital.'
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
