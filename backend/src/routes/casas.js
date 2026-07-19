import express from 'express';
import { db } from '../db.js';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Retrieve Casas Maternas list (public lookup directory)
router.get('/', async (req, res) => {
  const { department } = req.query;

  // --- SUPABASE MODE ---
  if (supabase) {
    try {
      let query = supabase.from('casas_maternas').select('*');

      if (department && department !== 'Todos') {
        query = query.ilike('department', department.toString());
      }

      const { data, error } = await query;

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.json(data);
    } catch (error) {
      console.error('Supabase Casas Maternas error:', error);
      return res.status(500).json({ error: 'Error al recuperar Casas Maternas de la nube.' });
    }
  }

  // --- LOCAL FALLBACK MODE ---
  try {
    const houses = await db.getMaternalHouses();
    
    if (department && department !== 'Todos') {
      const filtered = houses.filter(
        h => h.department.toLowerCase() === department.toString().toLowerCase()
      );
      return res.json(filtered);
    }

    res.json(houses);
  } catch (error) {
    console.error('Error fetching Casas Maternas:', error);
    res.status(500).json({ error: 'Error al recuperar el directorio de Casas Maternas.' });
  }
});

export default router;
