import Dexie, { type Table } from 'dexie';

export interface Profile {
  id?: string;
  stage: 'cycle' | 'pregnancy' | 'menopause';
  pinCode?: string;
  isPinEnabled: boolean;
  isDiscreteMode: boolean;
  isOfflineMode: boolean;
  optInSync: boolean;
  age?: number;
  lastPeriodDate?: string;
  gestationWeekStart?: string; // For pregnancy stage
  menopauseStartYear?: string; // For menopause stage
  climactericStage?: 'premenopause' | 'early_perimenopause' | 'late_perimenopause' | 'menopause_milestone' | 'postmenopause';
  language?: 'es' | 'miskito' | 'creole';
  department?: string;
  municipality?: string;
  latitude?: number;
  longitude?: number;
  assignedFacilityId?: number;
  themeColor?: 'earth' | 'orchid' | 'forest' | 'ocean';
  themeTextSize?: 'normal' | 'large';
  appIcon?: string;
  logoVariant?: 'lotus' | 'sprout' | 'flower' | 'butterfly' | 'sun';
  conceptionMode?: boolean;
  customAvatarUrl?: string;
}

export interface MRSEvaluation {
  id?: number;
  date: string; // YYYY-MM-DD
  somaticScore: number;
  psychologicalScore: number;
  urogenitalScore: number;
  totalScore: number;
  severity: 'leve' | 'moderada' | 'severa';
  climactericStage: 'premenopause' | 'early_perimenopause' | 'late_perimenopause' | 'menopause_milestone' | 'postmenopause';
  answers: Record<string, number>;
}

export interface Cycle {
  id?: number;
  startDate: string; // YYYY-MM-DD
  endDate?: string;  // YYYY-MM-DD
  duration?: number; // Days
  updatedAt?: string;
  deleted?: boolean;
}

export interface BiometricLog {
  id?: number;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO String
  skinTemp?: number; // Cutaneous temperature in Celsius (e.g. 36.6)
  restingHR?: number; // Resting Heart Rate in bpm (e.g. 62)
  hrv?: number; // Heart Rate Variability RMSSD in ms (e.g. 45)
  sleepMinutes?: number; // Total sleep in minutes
  hotFlashesCount?: number; // Detected nocturnal hot flashes
  sourceDevice?: string; // 'apple_watch' | 'galaxy_watch' | 'xiaomi_band' | 'oura_ring' | 'simulator'
  syncedToCloud?: boolean;
}

export interface SavedArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  imageUrl?: string;
  savedAt: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD (Primary Key)
  mood?: 'happy' | 'calm' | 'anxious' | 'sad' | 'irritable' | 'tired';
  notes?: string;
  flow?: 'none' | 'light' | 'medium' | 'heavy';
  pain?: 'none' | 'mild' | 'moderate' | 'severe';
  temperature?: number;
  hotFlashes?: number;
  sleepQuality?: 'good' | 'fair' | 'poor';
  anxietyLevel?: number;
  
  sexTags?: string[];
  moodTags?: string[];
  symptomTags?: string[];
  dischargeType?: string;
  digestionTags?: string[];
  pregnancyTestResult?: string;
  ovulationTestResult?: string;
  lifestyleTags?: string[];
  waterMl?: number;
  weightKg?: number;
  contraceptiveTaken?: boolean;
  
  updatedAt?: string;
  deleted?: boolean;
}

export interface TriageRecord {
  id?: number;
  date: string;
  gestationWeek: number;
  symptoms: string[];
  classification: 'normal' | 'vigilar' | 'urgente';
  notes?: string;
  updatedAt?: string;
  deleted?: boolean;
}

export type FacilityType = 'casa_materna' | 'hospital' | 'centro_salud';

export interface MaternalHouse {
  id?: number;
  name: string;
  department: string;
  municipality: string;
  silais: string;
  type: FacilityType;
  phone?: string;
  address: string;
  latitude: number;
  longitude: number;
  hasEmergency24h?: boolean;
  hasObstetricSurgery?: boolean;
  hasAmbulance?: boolean;
}

export interface KickSession {
  id?: number;
  date: string;
  count: number;
  durationMinutes: number;
  notes?: string;
}

export interface ContractionLog {
  id?: number;
  timestamp: string;
  durationSeconds: number;
  intervalSeconds: number;
}

export interface HospitalBagItem {
  id?: number;
  category: 'mom' | 'baby' | 'partner';
  title: string;
  checked: boolean;
}

export interface HotFlashLog {
  id?: number;
  timestamp: string;
  intensity: 'mild' | 'moderate' | 'severe';
  durationMinutes?: number;
  triggers?: string[];
  notes?: string;
  date?: string;
}

export interface BirthPlan {
  id?: number;
  transferWeek: number; // e.g. 34
  transportType: 'ambulancia' | 'panga' | 'vehiculo' | 'carreta' | 'a_pie';
  companionName: string;
  companionPhone?: string;
  communityMidwife?: string; // Partera comunitaria
  communityHealthWorker?: string; // Brigadista de salud
  emergencyFundReady: boolean;
  bloodType?: string;
  targetFacilityId?: number;
  notes?: string;
  updatedAt?: string;
}

export interface PrenatalAppointment {
  id?: number;
  date: string;
  gestationWeek: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  weightKg?: number;
  uterineHeightCm?: number;
  fetalHeartRateBpm?: number;
  ironFolicSupplement: boolean;
  facilityName?: string;
  notes?: string;
  nextAppointmentDate?: string;
}

class BloomaDatabase extends Dexie {
  profile!: Table<Profile, string>;
  cycles!: Table<Cycle, number>;
  dailyLogs!: Table<DailyLog, string>;
  triageRecords!: Table<TriageRecord, number>;
  maternalHouses!: Table<MaternalHouse, number>;
  kickSessions!: Table<KickSession, number>;
  contractionLogs!: Table<ContractionLog, number>;
  hospitalBagItems!: Table<HospitalBagItem, number>;
  hotFlashLogs!: Table<HotFlashLog, number>;
  biometrics!: Table<BiometricLog, number>;
  savedArticles!: Table<SavedArticle, string>;
  mrsEvaluations!: Table<MRSEvaluation, number>;
  birthPlans!: Table<BirthPlan, number>;
  prenatalAppointments!: Table<PrenatalAppointment, number>;

  constructor() {
    super('BloomaDB');
    this.version(5).stores({
      profile: 'id',
      cycles: '++id, startDate, endDate',
      dailyLogs: 'date',
      triageRecords: '++id, date, classification',
      maternalHouses: '++id, department, municipality, type, silais',
      kickSessions: '++id, date',
      contractionLogs: '++id, timestamp',
      hospitalBagItems: '++id, category',
      hotFlashLogs: '++id, timestamp, intensity',
      biometrics: '++id, date, timestamp, sourceDevice',
      savedArticles: 'id, category',
      mrsEvaluations: '++id, date, severity, climactericStage',
      birthPlans: '++id, transferWeek, targetFacilityId',
      prenatalAppointments: '++id, date, gestationWeek',
    });
  }
}

export const db = new BloomaDatabase();

/**
 * Seed inicial ampliado con el Directorio Nacional de Salud MINSA
 * (Casas Maternas y Hospitales de Referencia Obstétrica en los 15 departamentos y 2 regiones autónomas)
 */
export async function seedMaternalHouses() {
  const count = await db.maternalHouses.count();
  if (count > 0) return;

  const facilities: MaternalHouse[] = [
    // MANAGUA
    {
      name: 'Casa Materna Arlen Siu',
      department: 'Managua',
      municipality: 'Managua',
      silais: 'SILAIS Managua',
      type: 'casa_materna',
      phone: '+505 2222 4589',
      address: 'Barrio Martha Quezada, del Cine Dorado 1 cuadra abajo.',
      latitude: 12.1465,
      longitude: -86.2785,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    {
      name: 'Hospital Materno Infantil Bertha Calderón Roque',
      department: 'Managua',
      municipality: 'Managua',
      silais: 'SILAIS Managua',
      type: 'hospital',
      phone: '+505 2265 0191',
      address: 'De la rotonda El Zumen 500 metros al sur.',
      latitude: 12.1287,
      longitude: -86.2941,
      hasEmergency24h: true,
      hasObstetricSurgery: true,
      hasAmbulance: true
    },
    // MATAGALPA
    {
      name: 'Casa Materna Gladys Marín',
      department: 'Matagalpa',
      municipality: 'Matagalpa',
      silais: 'SILAIS Matagalpa',
      type: 'casa_materna',
      phone: '+505 2772 2012',
      address: 'De la Catedral 2 cuadras al norte, 1 cuadra al este.',
      latitude: 12.9281,
      longitude: -85.9189,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    {
      name: 'Hospital Regional César Amador Molina',
      department: 'Matagalpa',
      municipality: 'Matagalpa',
      silais: 'SILAIS Matagalpa',
      type: 'hospital',
      phone: '+505 2772 3215',
      address: 'Salida a Managua, frente al Complejo Judicial.',
      latitude: 12.9152,
      longitude: -85.9298,
      hasEmergency24h: true,
      hasObstetricSurgery: true,
      hasAmbulance: true
    },
    // ESTELÍ
    {
      name: 'Casa Materna Mildred Abaunza',
      department: 'Estelí',
      municipality: 'Estelí',
      silais: 'SILAIS Estelí',
      type: 'casa_materna',
      phone: '+505 2713 4110',
      address: 'Costado oeste de la Clínica Médica Previsional.',
      latitude: 13.0894,
      longitude: -86.3562,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    {
      name: 'Hospital Regional San Juan de Dios',
      department: 'Estelí',
      municipality: 'Estelí',
      silais: 'SILAIS Estelí',
      type: 'hospital',
      phone: '+505 2713 6300',
      address: 'Costado noreste de la ciudad de Estelí.',
      latitude: 13.0987,
      longitude: -86.3489,
      hasEmergency24h: true,
      hasObstetricSurgery: true,
      hasAmbulance: true
    },
    // CHINANDEGA
    {
      name: 'Casa Materna María Auxiliadora',
      department: 'Chinandega',
      municipality: 'El Viejo',
      silais: 'SILAIS Chinandega',
      type: 'casa_materna',
      phone: '+505 2342 1102',
      address: 'Frente a la Parroquia El Calvario.',
      latitude: 12.6631,
      longitude: -87.1682,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    {
      name: 'Hospital Departamental Dr. Mauricio Abdalah',
      department: 'Chinandega',
      municipality: 'Chinandega',
      silais: 'SILAIS Chinandega',
      type: 'hospital',
      phone: '+505 2341 2210',
      address: 'Carretera Chinandega - El Viejo Km 136.',
      latitude: 12.6450,
      longitude: -87.1420,
      hasEmergency24h: true,
      hasObstetricSurgery: true,
      hasAmbulance: true
    },
    // LEÓN
    {
      name: 'Casa Materna Concepción Palacios',
      department: 'León',
      municipality: 'León',
      silais: 'SILAIS León',
      type: 'casa_materna',
      phone: '+505 2311 5014',
      address: 'Del Teatro González 2 cuadras al sur, 1/2 cuadra abajo.',
      latitude: 12.4350,
      longitude: -86.8790,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    {
      name: 'Hospital Escuela Oscar Danilo Rosales Argüello (HEODRA)',
      department: 'León',
      municipality: 'León',
      silais: 'SILAIS León',
      type: 'hospital',
      phone: '+505 2311 6020',
      address: 'Frente al Parque San Juan.',
      latitude: 12.4412,
      longitude: -86.8725,
      hasEmergency24h: true,
      hasObstetricSurgery: true,
      hasAmbulance: true
    },
    // MASAYA
    {
      name: 'Casa Materna Aurora Ortiz',
      department: 'Masaya',
      municipality: 'Masaya',
      silais: 'SILAIS Masaya',
      type: 'casa_materna',
      phone: '+505 2522 1980',
      address: 'De las Cuatro Esquinas 1 cuadra al oeste.',
      latitude: 11.9721,
      longitude: -86.0965,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    {
      name: 'Hospital Departamental Humberto Alvarado Vásquez',
      department: 'Masaya',
      municipality: 'Masaya',
      silais: 'SILAIS Masaya',
      type: 'hospital',
      phone: '+505 2522 2810',
      address: 'Costado este de la ciudad de Masaya.',
      latitude: 11.9680,
      longitude: -86.0850,
      hasEmergency24h: true,
      hasObstetricSurgery: true,
      hasAmbulance: true
    },
    // RIVAS
    {
      name: 'Casa Materna Sor María Romero',
      department: 'Rivas',
      municipality: 'Rivas',
      silais: 'SILAIS Rivas',
      type: 'casa_materna',
      phone: '+505 2563 3310',
      address: 'De la rotonda de Rivas 150 metros al sur.',
      latitude: 11.4360,
      longitude: -85.8270,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    {
      name: 'Hospital Departamental Gaspar García Laviana',
      department: 'Rivas',
      municipality: 'Rivas',
      silais: 'SILAIS Rivas',
      type: 'hospital',
      phone: '+505 2563 3700',
      address: 'Carretera Panamericana Sur Km 112.',
      latitude: 11.4420,
      longitude: -85.8310,
      hasEmergency24h: true,
      hasObstetricSurgery: true,
      hasAmbulance: true
    },
    // CHONTALES
    {
      name: 'Casa Materna Josefa Toledo',
      department: 'Chontales',
      municipality: 'Juigalpa',
      silais: 'SILAIS Chontales',
      type: 'casa_materna',
      phone: '+505 2512 0450',
      address: 'Frente al Hospital Regional Camilo Ortega.',
      latitude: 12.0815,
      longitude: -85.3670,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    {
      name: 'Hospital Escuela Asunción de Juigalpa',
      department: 'Chontales',
      municipality: 'Juigalpa',
      silais: 'SILAIS Chontales',
      type: 'hospital',
      phone: '+505 2512 2480',
      address: 'Costado suroeste de la ciudad de Juigalpa.',
      latitude: 12.0860,
      longitude: -85.3620,
      hasEmergency24h: true,
      hasObstetricSurgery: true,
      hasAmbulance: true
    },
    // JINOTEGA
    {
      name: 'Casa Materna Blanca Arauz',
      department: 'Jinotega',
      municipality: 'Jinotega',
      silais: 'SILAIS Jinotega',
      type: 'casa_materna',
      phone: '+505 2782 2240',
      address: 'Barrio Panorama, del cementerio 1 cuadra al este.',
      latitude: 13.0950,
      longitude: -86.0080,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    {
      name: 'Hospital Departamental Victoria Motta',
      department: 'Jinotega',
      municipality: 'Jinotega',
      silais: 'SILAIS Jinotega',
      type: 'hospital',
      phone: '+505 2782 2315',
      address: 'Salida a San Rafael del Norte.',
      latitude: 13.1040,
      longitude: -86.0010,
      hasEmergency24h: true,
      hasObstetricSurgery: true,
      hasAmbulance: true
    },
    // COSTA CARIBE NORTE (RACCN)
    {
      name: 'Casa Materna Bilwi - Puerto Cabezas',
      department: 'Costa Caribe Norte (RACCN)',
      municipality: 'Puerto Cabezas (Bilwi)',
      silais: 'SILAIS Puerto Cabezas',
      type: 'casa_materna',
      phone: '+505 2792 2234',
      address: 'Barrio San Luis, frente a Escuela Normal Gran Ducado.',
      latitude: 14.0380,
      longitude: -83.3910,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    {
      name: 'Hospital Regional Nuevo Amanecer de Bilwi',
      department: 'Costa Caribe Norte (RACCN)',
      municipality: 'Puerto Cabezas (Bilwi)',
      silais: 'SILAIS Puerto Cabezas',
      type: 'hospital',
      phone: '+505 2792 2310',
      address: 'Barrio Peter Ferrera, Bilwi.',
      latitude: 14.0320,
      longitude: -83.3850,
      hasEmergency24h: true,
      hasObstetricSurgery: true,
      hasAmbulance: true
    },
    {
      name: 'Casa Materna Waspam Río Coco',
      department: 'Costa Caribe Norte (RACCN)',
      municipality: 'Waspam',
      silais: 'SILAIS Puerto Cabezas',
      type: 'casa_materna',
      phone: '+505 2794 0012',
      address: 'Del muelle municipal 2 cuadras al este.',
      latitude: 14.7410,
      longitude: -83.9720,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    // COSTA CARIBE SUR (RACCS)
    {
      name: 'Casa Materna Bluefields',
      department: 'Costa Caribe Sur (RACCS)',
      municipality: 'Bluefields',
      silais: 'SILAIS Bluefields',
      type: 'casa_materna',
      phone: '+505 2572 2310',
      address: 'Barrio Beholden, contiguo al Hospital Regional.',
      latitude: 12.0150,
      longitude: -83.7650,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    {
      name: 'Hospital Regional Dr. Ernesto Sequeira Blanco',
      department: 'Costa Caribe Sur (RACCS)',
      municipality: 'Bluefields',
      silais: 'SILAIS Bluefields',
      type: 'hospital',
      phone: '+505 2572 2390',
      address: 'Barrio Beholden, frente al Parque Central.',
      latitude: 12.0110,
      longitude: -83.7620,
      hasEmergency24h: true,
      hasObstetricSurgery: true,
      hasAmbulance: true
    },
    // RÍO SAN JUAN
    {
      name: 'Casa Materna San Carlos Río San Juan',
      department: 'Río San Juan',
      municipality: 'San Carlos',
      silais: 'SILAIS Río San Juan',
      type: 'casa_materna',
      phone: '+505 2583 0210',
      address: 'Del Malecón de San Carlos 1 cuadra al norte.',
      latitude: 11.1290,
      longitude: -84.7800,
      hasEmergency24h: true,
      hasAmbulance: true
    },
    {
      name: 'Hospital Departamental Dr. Luis Felipe Moncada',
      department: 'Río San Juan',
      municipality: 'San Carlos',
      silais: 'SILAIS Río San Juan',
      type: 'hospital',
      phone: '+505 2583 0340',
      address: 'Salida a Managua Km 285.',
      latitude: 11.1350,
      longitude: -84.7720,
      hasEmergency24h: true,
      hasObstetricSurgery: true,
      hasAmbulance: true
    }
  ];

  await db.maternalHouses.bulkAdd(facilities);
}
