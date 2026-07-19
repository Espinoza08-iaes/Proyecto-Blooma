import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

// Create a safe client. If credentials are not set, it won't crash the application
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Sincronización local a remota (ejemplo conceptual para el pitch)
export async function syncLocalDataToSupabase(
  tableName: string,
  localData: any[]
) {
  if (!supabase) {
    console.warn('Supabase no está configurado. Operación omitida.');
    return { success: false, error: 'No configurado' };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    // Insert or upsert data with user ID
    const userId = session.user.id;
    const dataWithUser = localData.map(item => ({
      ...item,
      user_id: userId,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from(tableName)
      .upsert(dataWithUser, { onConflict: 'id' });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error(`Error de sincronización en la tabla ${tableName}:`, error);
    return { success: false, error: error.message };
  }
}
