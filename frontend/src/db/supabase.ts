import { db } from './db';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Authentication APIs
export async function apiRegister(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al registrar.');
  return data;
}

export async function apiLogin(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al iniciar sesión.');
  return data;
}

export async function apiGetProfile(token: string) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al recuperar perfil.');
  return data;
}

export async function apiUpdateProfile(token: string, profileData: any) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al actualizar perfil.');
  return data;
}

export async function apiDeleteAccount(token: string) {
  const response = await fetch(`${API_URL}/auth/delete-account`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Error al eliminar cuenta.');
  return data;
}

// Bidirectional Synchronization Manager
export async function syncLocalDataWithServer(token: string) {
  try {
    // 1. Fetch current local data
    const localCycles = await db.cycles.toArray();
    const localLogs = await db.dailyLogs.toArray();
    const localTriage = await db.triageRecords.toArray();

    // 2. Transmit local snapshot to server for LWW merge
    const response = await fetch(`${API_URL}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        cycles: localCycles,
        dailyLogs: localLogs,
        triageRecords: localTriage
      })
    });

    if (!response.ok) {
      throw new Error(`Sync fallido: ${response.statusText}`);
    }

    const serverData = await response.json();

    // 3. Update Dexie tables with unified merged data
    await db.transaction('rw', db.cycles, db.dailyLogs, db.triageRecords, async () => {
      // Repopulate local tables with clean merged snapshots
      await db.cycles.clear();
      if (serverData.cycles && serverData.cycles.length > 0) {
        await db.cycles.bulkAdd(serverData.cycles);
      }

      await db.dailyLogs.clear();
      if (serverData.dailyLogs && serverData.dailyLogs.length > 0) {
        await db.dailyLogs.bulkAdd(serverData.dailyLogs);
      }

      await db.triageRecords.clear();
      if (serverData.triageRecords && serverData.triageRecords.length > 0) {
        await db.triageRecords.bulkAdd(serverData.triageRecords);
      }
    });

    console.log('Local database successfully synchronized with cloud.');
    return { success: true };
  } catch (error: any) {
    console.error('Sincronización fallida:', error);
    return { success: false, error: error.message };
  }
}
