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
  themeColor?: 'earth' | 'orchid' | 'forest' | 'ocean';
  themeTextSize?: 'normal' | 'large';
  appIcon?: string;
  logoVariant?: 'lotus' | 'sprout' | 'flower' | 'butterfly' | 'sun';
  conceptionMode?: boolean;
  customAvatarUrl?: string;
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
  // General
  mood?: 'happy' | 'calm' | 'anxious' | 'sad' | 'irritable' | 'tired';
  notes?: string;
  // Cycle
  flow?: 'none' | 'light' | 'medium' | 'heavy';
  pain?: 'none' | 'mild' | 'moderate' | 'severe';
  temperature?: number; // Basal body temp
  // Menopause
  hotFlashes?: number; // Count (0-10)
  sleepQuality?: 'good' | 'fair' | 'poor';
  anxietyLevel?: number; // Scale (1-10)
  
  // Flo-style Rich Tag Pills & Metrics
  sexTags?: string[]; // e.g. ['protected', 'oral', 'orgasm']
  moodTags?: string[]; // e.g. ['calm', 'energetic', 'mood_swings']
  symptomTags?: string[]; // e.g. ['cramps', 'tender_breasts', 'headache', 'acne']
  dischargeType?: string; // 'creamy' | 'watery' | 'egg_white' | 'spotting'
  digestionTags?: string[]; // ['nausea', 'bloating', 'constipation']
  pregnancyTestResult?: string; // 'none' | 'positive' | 'negative' | 'faint_line'
  ovulationTestResult?: string; // 'none' | 'positive' | 'negative'
  lifestyleTags?: string[]; // ['travel', 'stress', 'meditation', 'kegel']
  waterMl?: number; // Water intake in ml (e.g. 1750)
  weightKg?: number; // Weight in kg (e.g. 60.5)
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

export interface MaternalHouse {
  id?: number;
  name: string;
  department: string;
  municipality: string;
  phone?: string;
  address: string;
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

  constructor() {
    super('BloomaDB');
    this.version(3).stores({
      profile: 'id',
      cycles: '++id, startDate, endDate',
      dailyLogs: 'date',
      triageRecords: '++id, date, classification',
      maternalHouses: '++id, department, name',
      kickSessions: '++id, date',
      contractionLogs: '++id, timestamp',
      hospitalBagItems: '++id, category',
      hotFlashLogs: '++id, timestamp, intensity',
      biometrics: '++id, date, timestamp, sourceDevice',
      savedArticles: 'id, category',
    });
  }
}

export const db = new BloomaDatabase();

// Seed initial data for Casas Maternas (as required by Fase 1 & 3)
export async function seedMaternalHouses() {
  const count = await db.maternalHouses.count();
  if (count > 0) return;

  const houses: MaternalHouse[] = [
    {
      name: 'Casa Materna Gladys Marín',
      department: 'Matagalpa',
      municipality: 'Matagalpa',
      phone: '+505 2772 2012',
      address: 'De la Catedral 2 cuadras al norte, 1 cuadra al este.'
    },
    {
      name: 'Casa Materna Arlen Siu',
      department: 'Managua',
      municipality: 'Managua',
      phone: '+505 2222 4589',
      address: 'Barrio Martha Quezada, del Cine Dorado 1 cuadra abajo.'
    },
    {
      name: 'Casa Materna Mildred Abaunza',
      department: 'Estelí',
      municipality: 'Estelí',
      phone: '+505 2713 4110',
      address: 'Costado oeste de la Clínica Médica Previsional.'
    },
    {
      name: 'Casa Materna María Auxiliadora',
      department: 'Chinandega',
      municipality: 'El Viejo',
      phone: '+505 2342 1102',
      address: 'Frente a la Parroquia El Calvario.'
    },
    {
      name: 'Casa Materna Sor María Romero',
      department: 'Rivas',
      municipality: 'Rivas',
      phone: '+505 2563 3310',
      address: 'De la rotonda de Rivas 150 metros al sur.'
    },
    {
      name: 'Casa Materna Josefa Toledo',
      department: 'Chontales',
      municipality: 'Juigalpa',
      phone: '+505 2512 0450',
      address: 'Frente al Hospital Regional Camilo Ortega.'
    },
    {
      name: 'Casa Materna Concepción Palacios',
      department: 'León',
      municipality: 'León',
      phone: '+505 2311 5014',
      address: 'Del Teatro González 2 cuadras al sur, 1/2 cuadra abajo.'
    },
    {
      name: 'Casa Materna Aurora Ortiz',
      department: 'Masaya',
      municipality: 'Masaya',
      phone: '+505 2522 1980',
      address: 'De las Cuatro Esquinas 1 cuadra al oeste.'
    }
  ];

  await db.maternalHouses.bulkAdd(houses);
}
