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
}

export interface Cycle {
  id?: number;
  startDate: string; // YYYY-MM-DD
  endDate?: string;  // YYYY-MM-DD
  duration?: number; // Days
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
}

export interface TriageRecord {
  id?: number;
  date: string;
  gestationWeek: number;
  symptoms: string[];
  classification: 'normal' | 'vigilar' | 'urgente';
  notes?: string;
}

export interface MaternalHouse {
  id?: number;
  name: string;
  department: string;
  municipality: string;
  phone?: string;
  address: string;
}

class BloomaDatabase extends Dexie {
  profile!: Table<Profile, string>;
  cycles!: Table<Cycle, number>;
  dailyLogs!: Table<DailyLog, string>;
  triageRecords!: Table<TriageRecord, number>;
  maternalHouses!: Table<MaternalHouse, number>;

  constructor() {
    super('BloomaDB');
    this.version(1).stores({
      profile: 'id',
      cycles: '++id, startDate, endDate',
      dailyLogs: 'date',
      triageRecords: '++id, date, classification',
      maternalHouses: '++id, department, name',
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
