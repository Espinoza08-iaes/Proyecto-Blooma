export interface PregnancyMilestone {
  week: number;
  lengthCm: number;
  weightGrams: number;
  sizeComparison: string;
  sizeCategory: 'fruta' | 'vegetal' | 'semilla';
  description: string;
  keyDevMilestone: string;
  symptomsToWatch: string[];
  minsaTip: string;
}

export const PREGNANCY_MILESTONES: PregnancyMilestone[] = [
  {
    week: 4,
    lengthCm: 0.2,
    weightGrams: 0.5,
    sizeComparison: 'Semilla de amapola',
    sizeCategory: 'semilla',
    description: 'El blastocisto se implanta en la pared uterina. Se forman las primeras capas celulares.',
    keyDevMilestone: 'Inicio de la implantación uterina.',
    symptomsToWatch: ['Manchado leve de implantación', 'Sensibilidad mamaria ligera'],
    minsaTip: 'Inicia el consumo diario de ácido fólico recomendado por el MINSA.'
  },
  {
    week: 8,
    lengthCm: 1.6,
    weightGrams: 1.0,
    sizeComparison: 'Frambuesa',
    sizeCategory: 'fruta',
    description: 'Los brazos y piernas están creciendo. El corazón late rápidamente a unas 150 pulsaciones por minuto.',
    keyDevMilestone: 'Formación inicial de dedos y rasgos faciales.',
    symptomsToWatch: ['Náuseas matutinas', 'Fatiga recurrente', 'Cambios de humor'],
    minsaTip: 'Acude a tu primera consulta prenatal en tu Centro de Salud de comunidad.'
  },
  {
    week: 12,
    lengthCm: 5.4,
    weightGrams: 14.0,
    sizeComparison: 'Limón criollo',
    sizeCategory: 'fruta',
    description: 'Todos los órganos principales y las extremidades están presentes. Los reflejos del bebé comienzan a desarrollarse.',
    keyDevMilestone: 'Uñas formadas y perfil facial definido.',
    symptomsToWatch: ['Disminución progresiva de náuseas', 'Aumento de energía'],
    minsaTip: 'Verifica tu esquema de vacunación materna con el equipo del MINSA.'
  },
  {
    week: 16,
    lengthCm: 11.6,
    weightGrams: 100.0,
    sizeComparison: 'Aguacate',
    sizeCategory: 'fruta',
    description: 'Los ojos pueden realizar movimientos lentos. La espalda y el cuello se fortalecen.',
    keyDevMilestone: 'Capacidad de escuchar sonidos externos y latidos de mamá.',
    symptomsToWatch: ['Aumento de apetito', 'Congestión nasal o sangrado de encías'],
    minsaTip: 'Realiza caminatas leves diarias de 20 minutos.'
  },
  {
    week: 18,
    lengthCm: 21.8,
    weightGrams: 225.0,
    sizeComparison: 'Pimiento (Chiltoma)',
    sizeCategory: 'vegetal',
    description: 'Tu bebé está creciendo y ganando peso rápidamente. Sus cuerdas vocales se desarrollan y realiza movimientos activos.',
    keyDevMilestone: 'Sensación de primeros pataditas (avivamiento).',
    symptomsToWatch: ['Dolor ligero de espalda', 'Retención leve de líquidos'],
    minsaTip: 'Mantén una hidratación constante de 2.5 litros de agua al día.'
  },
  {
    week: 24,
    lengthCm: 30.0,
    weightGrams: 600.0,
    sizeComparison: 'Elote (Maíz tierno)',
    sizeCategory: 'vegetal',
    description: 'La piel se vuelve menos transparente a medida que se acumula grasa. Sus pulmones desarrollan los alvéolos.',
    keyDevMilestone: 'Patrones de sueño y vigilia detectables.',
    symptomsToWatch: ['Acidez estomacal', 'Calambres nocturnos en piernas'],
    minsaTip: 'Conoce la Casa Materna más cercana a tu comunidad para emergencias.'
  },
  {
    week: 32,
    lengthCm: 42.4,
    weightGrams: 1700.0,
    sizeComparison: 'Melón piña',
    sizeCategory: 'fruta',
    description: 'Las uñas de los pies han crecido del todo. Practica movimientos respiratorios con el diafragma.',
    keyDevMilestone: 'El bebé suele acomodarse en posición cefálica.',
    symptomsToWatch: ['Contracciones Braxton Hicks', 'Presión pélvica'],
    minsaTip: 'Prepara tu maleta hospitalaria para el parto.'
  },
  {
    week: 36,
    lengthCm: 47.4,
    weightGrams: 2600.0,
    sizeComparison: 'Papaya',
    sizeCategory: 'fruta',
    description: 'El bebé gana unos 28 gramos de grasa al día. Su agarre con las manos se vuelve firme.',
    keyDevMilestone: 'Desarrollo pulmonar casi completo para el nacimiento.',
    symptomsToWatch: ['Ganas frecuentes de orinar', 'Hinchazón de tobillos'],
    minsaTip: 'Identifica los síntomas de inicio de labor de parto de Urgencia.'
  },
  {
    week: 40,
    lengthCm: 51.2,
    weightGrams: 3400.0,
    sizeComparison: 'Sandía',
    sizeCategory: 'fruta',
    description: 'El bebé está completamente desarrollado y listo para nacer en cualquier momento.',
    keyDevMilestone: 'Término completo listo para el alumbramiento.',
    symptomsToWatch: ['Contracciones regulares cada 5 minutos', 'Ruptura de fuente'],
    minsaTip: 'Preséntate de inmediato al Centro de Salud o Casa Materna MINSA.'
  }
];

export function getPregnancyMilestone(gestationWeek: number): PregnancyMilestone {
  const roundedWeek = Math.max(1, Math.min(40, Math.round(gestationWeek)));
  
  // Find exact match or closest preceding milestone
  const found = PREGNANCY_MILESTONES.slice().reverse().find(m => m.week <= roundedWeek);
  if (found) return found;
  
  return PREGNANCY_MILESTONES[0];
}

export function classifyPregnancySymptoms(symptoms: string[]): {
  classification: 'normal' | 'vigilar' | 'urgente';
  title: string;
  description: string;
  actionRecommendation: string;
} {
  const urgentSymptoms = [
    'sangrado_vaginal',
    'perdida_liquido',
    'dolor_intenso_abdomen',
    'fiebre_alta',
    'vision_borrosa_dolor_cabeza',
    'ausencia_pataditas'
  ];

  const watchSymptoms = [
    'hinchazon_marcada',
    'dolor_orinar',
    'nauseas_severas',
    'contracciones_irregulares'
  ];

  const hasUrgent = symptoms.some(s => urgentSymptoms.includes(s));
  if (hasUrgent) {
    return {
      classification: 'urgente',
      title: 'Atención Médica Inmediata de Urgencia',
      description: 'Has seleccionado signos de alarma obstétrica de nivel rojo (MINSA). No te quedes en casa.',
      actionRecommendation: 'Dirígete de inmediato al Hospital o Casa Materna más cercana.'
    };
  }

  const hasWatch = symptoms.some(s => watchSymptoms.includes(s));
  if (hasWatch) {
    return {
      classification: 'vigilar',
      title: 'Evaluación y Monitoreo Cercano',
      description: 'Presentas síntomas que requieren seguimiento y evaluación por personal de salud.',
      actionRecommendation: 'Contacta a tu enfermera de comunidad o programa una visita a tu Centro de Salud.'
    };
  }

  return {
    classification: 'normal',
    title: 'Síntomas Fisiológicos Habituales',
    description: 'Los síntomas reportados corresponden al curso esperable del desarrollo gestacional.',
    actionRecommendation: 'Mantén tu hidratación, descanso y controles prenatales según tu calendario.'
  };
}
