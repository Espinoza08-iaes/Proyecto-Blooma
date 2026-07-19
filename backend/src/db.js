import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, '..', 'db.json');

// Initial maternal houses seed data
const initialMaternalHouses = [
  {
    id: 1,
    name: 'Casa Materna Gladys Marín',
    department: 'Matagalpa',
    municipality: 'Matagalpa',
    phone: '+505 2772 2012',
    address: 'De la Catedral 2 cuadras al norte, 1 cuadra al este.'
  },
  {
    id: 2,
    name: 'Casa Materna Arlen Siu',
    department: 'Managua',
    municipality: 'Managua',
    phone: '+505 2222 4589',
    address: 'Barrio Martha Quezada, del Cine Dorado 1 cuadra abajo.'
  },
  {
    id: 3,
    name: 'Casa Materna Mildred Abaunza',
    department: 'Estelí',
    municipality: 'Estelí',
    phone: '+505 2713 4110',
    address: 'Costado oeste de la Clínica Médica Previsional.'
  },
  {
    id: 4,
    name: 'Casa Materna María Auxiliadora',
    department: 'Chinandega',
    municipality: 'El Viejo',
    phone: '+505 2342 1102',
    address: 'Frente a la Parroquia El Calvario.'
  },
  {
    id: 5,
    name: 'Casa Materna Sor María Romero',
    department: 'Rivas',
    municipality: 'Rivas',
    phone: '+505 2563 3310',
    address: 'De la rotonda de Rivas 150 metros al sur.'
  },
  {
    id: 6,
    name: 'Casa Materna Josefa Toledo',
    department: 'Chontales',
    municipality: 'Juigalpa',
    phone: '+505 2512 0450',
    address: 'Frente al Hospital Regional Camilo Ortega.'
  },
  {
    id: 7,
    name: 'Casa Materna Concepción Palacios',
    department: 'León',
    municipality: 'León',
    phone: '+505 2311 5014',
    address: 'Del Teatro González 2 cuadras al sur, 1/2 cuadra abajo.'
  },
  {
    id: 8,
    name: 'Casa Materna Aurora Ortiz',
    department: 'Masaya',
    municipality: 'Masaya',
    phone: '+505 2522 1980',
    address: 'De las Cuatro Esquinas 1 cuadra al oeste.'
  }
];

class JsonDatabase {
  constructor() {
    this.data = {
      users: [],
      profiles: [],
      cycles: [],
      dailyLogs: [],
      triageRecords: [],
      maternalHouses: []
    };
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      const fileData = await fs.readFile(DB_FILE, 'utf8');
      this.data = JSON.parse(fileData);
      
      // Ensure maternal houses are seeded if empty
      if (!this.data.maternalHouses || this.data.maternalHouses.length === 0) {
        this.data.maternalHouses = initialMaternalHouses;
        await this.save();
      }
    } catch (error) {
      // If db.json doesn't exist, create it with seed data
      this.data.maternalHouses = initialMaternalHouses;
      await this.save();
    }

    this.initialized = true;
    console.log('Database initialized successfully.');
  }

  async save() {
    await fs.writeFile(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
  }

  // Collections accessors
  async getUsers() {
    await this.init();
    return this.data.users;
  }

  async getProfiles() {
    await this.init();
    return this.data.profiles;
  }

  async getCycles() {
    await this.init();
    return this.data.cycles;
  }

  async getDailyLogs() {
    await this.init();
    return this.data.dailyLogs;
  }

  async getTriageRecords() {
    await this.init();
    return this.data.triageRecords;
  }

  async getMaternalHouses() {
    await this.init();
    return this.data.maternalHouses;
  }

  // Common CRUD actions helper
  async commit() {
    await this.save();
  }
}

export const db = new JsonDatabase();
