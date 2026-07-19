import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Retrieve Casas Maternas list (public lookup directory)
router.get('/', async (req, res) => {
  const { department } = req.query;

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
