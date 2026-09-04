export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface NicaraguaDepartment {
  id: string;
  name: string;
  silais: string;
  capitalCoords: Coordinates;
  municipalities: string[];
}

export const NICARAGUA_DEPARTMENTS: NicaraguaDepartment[] = [
  {
    id: 'managua',
    name: 'Managua',
    silais: 'SILAIS Managua',
    capitalCoords: { latitude: 12.1364, longitude: -86.2514 },
    municipalities: ['Managua', 'Ciudad Sandino', 'Tipitapa', 'Mateare', 'San Rafael del Sur', 'Ticuantepe', 'Villa El Carmen', 'El Crucero', 'San Francisco Libre']
  },
  {
    id: 'matagalpa',
    name: 'Matagalpa',
    silais: 'SILAIS Matagalpa',
    capitalCoords: { latitude: 12.9256, longitude: -85.9178 },
    municipalities: ['Matagalpa', 'Sébaco', 'San Ramón', 'Matiguás', 'Río Blanco', 'Rancho Grande', 'El Tuma - La Dalia', 'San Isidro', 'Ciudad Darío', 'Esquipulas', 'Terrabona', 'San Dionisio', 'Muy Muy']
  },
  {
    id: 'leon',
    name: 'León',
    silais: 'SILAIS León',
    capitalCoords: { latitude: 12.4379, longitude: -86.8780 },
    municipalities: ['León', 'Nagarote', 'La Paz Centro', 'El Sauce', 'Malpaisillo', 'Telica', 'Quezalguaque', 'Santa Rosa del Peñón', 'El Jicaral', 'Achuapa']
  },
  {
    id: 'chinandega',
    name: 'Chinandega',
    silais: 'SILAIS Chinandega',
    capitalCoords: { latitude: 12.6294, longitude: -87.1311 },
    municipalities: ['Chinandega', 'El Viejo', 'Corinto', 'Chichigalpa', 'Posoltega', 'Somotillo', 'Villa Nueva', 'Santo Tomás del Norte', 'Cinco Pinos', 'San Pedro del Norte', 'San Francisco del Norte', 'Puerto Morazán', 'El Realejo']
  },
  {
    id: 'esteli',
    name: 'Estelí',
    silais: 'SILAIS Estelí',
    capitalCoords: { latitude: 13.0919, longitude: -86.3538 },
    municipalities: ['Estelí', 'Condega', 'Pueblo Nuevo', 'San Juan de Limay', 'La Trinidad', 'San Nicolás']
  },
  {
    id: 'masaya',
    name: 'Masaya',
    silais: 'SILAIS Masaya',
    capitalCoords: { latitude: 11.9744, longitude: -86.0942 },
    municipalities: ['Masaya', 'Nindirí', 'Tisma', 'Catarina', 'San Juan de Oriente', 'Niquinohomo', 'Nandasmo', 'Masatepe', 'La Concepción']
  },
  {
    id: 'granada',
    name: 'Granada',
    silais: 'SILAIS Granada',
    capitalCoords: { latitude: 11.9299, longitude: -85.9560 },
    municipalities: ['Granada', 'Nandaime', 'Diriomo', 'Diriá']
  },
  {
    id: 'carazo',
    name: 'Carazo',
    silais: 'SILAIS Carazo',
    capitalCoords: { latitude: 11.8563, longitude: -86.1990 },
    municipalities: ['Jinotepe', 'Diriamba', 'San Marcos', 'Santa Teresa', 'Dolores', 'La Paz de Carazo', 'El Rosario', 'La Conquista']
  },
  {
    id: 'rivas',
    name: 'Rivas',
    silais: 'SILAIS Rivas',
    capitalCoords: { latitude: 11.4372, longitude: -85.8263 },
    municipalities: ['Rivas', 'San Juan del Sur', 'Tola', 'Belén', 'Potosí', 'Buenos Aires', 'San Jorge', 'Altagracia (Ometepe)', 'Moyogalpa (Ometepe)', 'Cárdenas']
  },
  {
    id: 'chontales',
    name: 'Chontales',
    silais: 'SILAIS Chontales',
    capitalCoords: { latitude: 12.0838, longitude: -85.3644 },
    municipalities: ['Juigalpa', 'Acoyapa', 'Santo Tomás', 'Villa Sandino', 'San Pedro de Lóvago', 'La Libertad', 'Santo Domingo', 'Comalapa', 'San Francisco de Cuapa', 'El Coral']
  },
  {
    id: 'boaco',
    name: 'Boaco',
    silais: 'SILAIS Boaco',
    capitalCoords: { latitude: 12.4722, longitude: -85.6586 },
    municipalities: ['Boaco', 'Camoapa', 'San Lorenzo', 'Teustepe', 'Santa Lucía', 'San José de los Remates']
  },
  {
    id: 'jinotega',
    name: 'Jinotega',
    silais: 'SILAIS Jinotega',
    capitalCoords: { latitude: 13.0997, longitude: -86.0022 },
    municipalities: ['Jinotega', 'San Rafael del Norte', 'San Sebastián de Yalí', 'La Concordia', 'Santa María de Pantasma', 'Wiwilí de Jinotega', 'El Cuá', 'San José de Bocay']
  },
  {
    id: 'madriz',
    name: 'Madriz',
    silais: 'SILAIS Madriz',
    capitalCoords: { latitude: 13.4833, longitude: -86.5833 },
    municipalities: ['Somoto', 'Telpaneca', 'San Juan de Río Coco', 'Palacagüina', 'Yalagüina', 'Totogalpa', 'Las Sabanas', 'San Lucas', 'San José de Cusmapa']
  },
  {
    id: 'nueva_segovia',
    name: 'Nueva Segovia',
    silais: 'SILAIS Nueva Segovia',
    capitalCoords: { latitude: 13.6333, longitude: -86.4833 },
    municipalities: ['Ocotal', 'Jalapa', 'El Jícaro', 'Quilalí', 'Murra', 'San Fernando', 'Mozonte', 'Dipilto', 'Ciudad Antigua', 'Macuelizo', 'Santa María', 'Wiwilí de Nueva Segovia']
  },
  {
    id: 'rio_san_juan',
    name: 'Río San Juan',
    silais: 'SILAIS Río San Juan',
    capitalCoords: { latitude: 11.1278, longitude: -84.7786 },
    municipalities: ['San Carlos', 'El Castillo', 'San Miguelito', 'Morrito', 'San Juan de Nicaragua', 'El Almendro']
  },
  {
    id: 'raccn',
    name: 'Costa Caribe Norte (RACCN)',
    silais: 'SILAIS Puerto Cabezas / Las Minas',
    capitalCoords: { latitude: 14.0351, longitude: -83.3888 },
    municipalities: ['Puerto Cabezas (Bilwi)', 'Waspam', 'Siuna', 'Bonanza', 'Rosita', 'Prinzapolka', 'Mulukukú', 'Waslala']
  },
  {
    id: 'raccs',
    name: 'Costa Caribe Sur (RACCS)',
    silais: 'SILAIS Bluefields',
    capitalCoords: { latitude: 12.0137, longitude: -83.7635 },
    municipalities: ['Bluefields', 'Corn Island', 'Laguna de Perlas', 'Kukra Hill', 'El Rama', 'Muelle de los Bueyes', 'Nueva Guinea', 'Bocana de Paiwas', 'Desembocadura de Río Grande', 'El Tortuguero', 'La Cruz de Río Grande', 'El Ayote']
  }
];

/**
 * Calcula la distancia en kilómetros entre dos coordenadas usando la fórmula de Haversine (100% offline)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Redondear a 1 decimal
}

/**
 * Formatea la distancia calculada para visualización amigable en la UI
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `A ${meters} metros`;
  }
  return `A ${distanceKm} km`;
}

/**
 * Obtiene la ubicación GPS actual del dispositivo de forma asíncrona
 */
export function getCurrentCoordinates(): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Geolocalización no disponible o denegada:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 60000
      }
    );
  });
}
