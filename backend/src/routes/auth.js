import express from 'express';
import { db } from '../db.js';
import { hashPassword, verifyPassword, generateToken, authMiddleware } from '../auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'El correo y la contraseña son requeridos.' });
  }

  try {
    const users = await db.getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    const { hash, salt } = hashPassword(password);
    const userId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      hash,
      salt,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Initialize default profile
    const profiles = await db.getProfiles();
    const newProfile = {
      userId,
      stage: 'cycle',
      optInSync: false,
      pinEnabled: false,
      pinCode: '',
      updatedAt: new Date().toISOString()
    };
    profiles.push(newProfile);

    await db.commit();

    const token = generateToken({ userId });
    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      token,
      profile: {
        stage: newProfile.stage,
        optInSync: newProfile.optInSync,
        pinEnabled: newProfile.pinEnabled
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error interno del servidor al registrar.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'El correo y la contraseña son requeridos.' });
  }

  try {
    const users = await db.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !verifyPassword(password, user.hash, user.salt)) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const profiles = await db.getProfiles();
    const profile = profiles.find(p => p.userId === user.id) || {
      userId: user.id,
      stage: 'cycle',
      optInSync: false,
      pinEnabled: false,
      pinCode: ''
    };

    const token = generateToken({ userId: user.id });

    res.json({
      message: 'Inicio de sesión exitoso.',
      token,
      profile: {
        stage: profile.stage,
        optInSync: profile.optInSync,
        pinEnabled: profile.pinEnabled,
        age: profile.age,
        gestationWeekStart: profile.gestationWeekStart,
        menopauseStartYear: profile.menopauseStartYear
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error interno en el inicio de sesión.' });
  }
});

// Get profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const profiles = await db.getProfiles();
    const profile = profiles.find(p => p.userId === req.userId);

    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado.' });
    }

    // Don't send raw pin code back if you want, but for sync or validation we can strip or keep it
    const { pinCode, ...safeProfile } = profile;
    res.json(safeProfile);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar perfil.' });
  }
});

// Update profile
router.post('/profile', authMiddleware, async (req, res) => {
  const { stage, age, gestationWeekStart, menopauseStartYear, optInSync, pinEnabled, pinCode } = req.body;

  try {
    const profiles = await db.getProfiles();
    let profileIndex = profiles.findIndex(p => p.userId === req.userId);

    if (profileIndex === -1) {
      const newProfile = {
        userId: req.userId,
        stage: stage || 'cycle',
        age,
        gestationWeekStart,
        menopauseStartYear,
        optInSync: optInSync ?? false,
        pinEnabled: pinEnabled ?? false,
        pinCode: pinCode || '',
        updatedAt: new Date().toISOString()
      };
      profiles.push(newProfile);
    } else {
      profiles[profileIndex] = {
        ...profiles[profileIndex],
        stage: stage !== undefined ? stage : profiles[profileIndex].stage,
        age: age !== undefined ? age : profiles[profileIndex].age,
        gestationWeekStart: gestationWeekStart !== undefined ? gestationWeekStart : profiles[profileIndex].gestationWeekStart,
        menopauseStartYear: menopauseStartYear !== undefined ? menopauseStartYear : profiles[profileIndex].menopauseStartYear,
        optInSync: optInSync !== undefined ? optInSync : profiles[profileIndex].optInSync,
        pinEnabled: pinEnabled !== undefined ? pinEnabled : profiles[profileIndex].pinEnabled,
        pinCode: pinCode !== undefined ? pinCode : profiles[profileIndex].pinCode,
        updatedAt: new Date().toISOString()
      };
    }

    await db.commit();
    res.json({ message: 'Perfil actualizado con éxito.' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Error al actualizar perfil.' });
  }
});

// Delete account in cascade (local-first safety guarantee)
router.post('/delete-account', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Remove user
    const users = await db.getUsers();
    db.data.users = users.filter(u => u.id !== userId);

    // 2. Remove profile
    const profiles = await db.getProfiles();
    db.data.profiles = profiles.filter(p => p.userId !== userId);

    // 3. Remove cycles
    const cycles = await db.getCycles();
    db.data.cycles = cycles.filter(c => c.userId !== userId);

    // 4. Remove daily logs
    const dailyLogs = await db.getDailyLogs();
    db.data.dailyLogs = dailyLogs.filter(d => d.userId !== userId);

    // 5. Remove triage records
    const triageRecords = await db.getTriageRecords();
    db.data.triageRecords = triageRecords.filter(t => t.userId !== userId);

    // Save changes
    await db.commit();

    res.json({ message: 'Cuenta y todos los datos asociados eliminados en cascada de manera definitiva.' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Error al eliminar la cuenta.' });
  }
});

export default router;
