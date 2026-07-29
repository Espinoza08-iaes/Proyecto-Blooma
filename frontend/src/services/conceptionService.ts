export interface FertilityPrediction {
  cycleDay: number;
  conceptionProbability: number; // 0 - 100%
  chanceCategory: 'Baja' | 'Media' | 'Alta' | 'Muy Alta (Ovulación)';
  cervicalMucusIdeal: string;
  isOvulationDay: boolean;
  recommendedPregnancyTestDate: string; // YYYY-MM-DD
}

/**
 * Calculates daily conception probability based on cycle day and average cycle length.
 */
export function calculateFertilityWindow(currentDay: number, cycleLength = 28): FertilityPrediction {
  const estimatedOvulationDay = Math.round(cycleLength - 14); // Usually day 14 in a 28-day cycle
  const diff = currentDay - estimatedOvulationDay;

  let conceptionProbability = 5;
  let chanceCategory: FertilityPrediction['chanceCategory'] = 'Baja';
  let cervicalMucusIdeal = 'Seco o poco espeso';
  let isOvulationDay = false;

  if (diff === 0) {
    conceptionProbability = 90;
    chanceCategory = 'Muy Alta (Ovulación)';
    cervicalMucusIdeal = 'Clara de Huevo (Transparente, Elástico y Abundante)';
    isOvulationDay = true;
  } else if (diff === -1 || diff === -2) {
    conceptionProbability = 75;
    chanceCategory = 'Alta';
    cervicalMucusIdeal = 'Acuoso y Elástico';
  } else if (diff === -3 || diff === -4 || diff === -5) {
    conceptionProbability = 45;
    chanceCategory = 'Media';
    cervicalMucusIdeal = 'Cremoso o Ligeramente Elástico';
  } else if (diff === 1) {
    conceptionProbability = 30;
    chanceCategory = 'Media';
    cervicalMucusIdeal = 'Espeso';
  } else {
    conceptionProbability = 5;
    chanceCategory = 'Baja';
    cervicalMucusIdeal = 'Seco o escaso';
  }

  // Calculate recommended test date (14 days post-ovulation)
  const today = new Date();
  const daysUntilTest = Math.max(1, (estimatedOvulationDay + 14) - currentDay);
  const testDate = new Date(today.getTime() + daysUntilTest * 24 * 60 * 60 * 1000);

  return {
    cycleDay: currentDay,
    conceptionProbability,
    chanceCategory,
    cervicalMucusIdeal,
    isOvulationDay,
    recommendedPregnancyTestDate: testDate.toISOString().split('T')[0]
  };
}

export const CONCEPTION_GUIDELINES = [
  {
    id: 'folic_acid',
    title: 'Ácido Fólico Diario (400 µg)',
    description: 'El MINSA y la OMS recomiendan iniciar el consumo de ácido fólico al menos 1 a 3 meses antes de concebir para prevenir defectos del tubo neural.',
    category: 'Nutrición Prenatal'
  },
  {
    id: 'tcb_tracking',
    title: 'Temperatura Corporal Basal (TCB)',
    description: 'Toma tu temperatura cutánea al despertar antes de levantarte. Un pico constante de +0.3°C a +0.5°C confirma que la ovulación ya ocurrió.',
    category: 'Biomarcadores'
  },
  {
    id: 'cervical_mucus',
    title: 'Flujo Cervical tipo "Clara de Huevo"',
    description: 'El moco fértil es transparente, elástico y resbaladizo. Facilita la supervivencia y movilidad de los espermatozoides hasta por 5 días.',
    category: 'Fisiología'
  },
  {
    id: 'lh_surge',
    title: 'Pruebas de Ovulación en Orina (LH)',
    description: 'Las tiras reactivas detectan el pico de hormona luteinizante 24-36 horas antes de que el óvulo sea liberado.',
    category: 'Pruebas'
  }
];
