import express from 'express';
import { db } from '../db.js';
import { hashPassword, verifyPassword, generateToken, authMiddleware } from '../auth.js';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'El correo y la contraseña son requeridos.' });
  }

  // --- SUPABASE MODE ---
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: email.toLowerCase(),
        password,
        email_confirm: true
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const userId = data.user.id;
      const token = generateToken({ userId });

      res.status(201).json({
        message: 'Usuario registrado con éxito en la nube.',
        token,
        profile: {
          stage: 'cycle',
          optInSync: false,
          pinEnabled: false
        }
      });
      return;
    } catch (error) {
      console.error('Supabase registration error:', error);
      return res.status(500).json({ error: 'Error al registrar en Supabase.' });
    }
  }

  // --- LOCAL FALLBACK MODE ---
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
      message: 'Usuario registrado con éxito localmente.',
      token,
      profile: {
        stage: newProfile.stage,
        optInSync: newProfile.optInSync,
        pinEnabled: newProfile.pinEnabled
      }
    });
  } catch (error) {
    console.error('Local registration error:', error);
    res.status(500).json({ error: 'Error interno del servidor al registrar.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'El correo y la contraseña son requeridos.' });
  }

  // --- SUPABASE MODE ---
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password
      });

      if (error) {
        return res.status(401).json({ error: 'Credenciales inválidas en la nube.' });
      }

      const userId = data.user.id;
      
      // Fetch profile from perfiles table
      const { data: profile, error: profileError } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', userId)
        .single();

      const profileData = profile || {
        stage: 'cycle',
        opt_in_sync: false,
        pin_enabled: false
      };

      const token = generateToken({ userId });

      res.json({
        message: 'Inicio de sesión exitoso en la nube.',
        token,
        profile: {
          stage: profileData.stage,
          optInSync: profileData.opt_in_sync,
          pinEnabled: profileData.pin_enabled,
          age: profileData.age,
          gestationWeekStart: profileData.gestation_week_start,
          menopauseStartYear: profileData.menopause_start_year
        }
      });
      return;
    } catch (error) {
      console.error('Supabase login error:', error);
      return res.status(500).json({ error: 'Error al iniciar sesión con Supabase.' });
    }
  }

  // --- LOCAL FALLBACK MODE ---
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
  // --- SUPABASE MODE ---
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', req.userId)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Perfil no encontrado en la nube.' });
      }

      res.json({
        userId: data.id,
        stage: data.stage,
        age: data.age,
        gestationWeekStart: data.gestation_week_start,
        menopauseStartYear: data.menopause_start_year,
        optInSync: data.opt_in_sync,
        pinEnabled: data.pin_enabled,
        discreteMode: data.discrete_mode,
        offlineMode: data.offline_mode
      });
      return;
    } catch (error) {
      console.error('Supabase profile get error:', error);
      return res.status(500).json({ error: 'Error al recuperar perfil de la nube.' });
    }
  }

  // --- LOCAL FALLBACK MODE ---
  try {
    const profiles = await db.getProfiles();
    const profile = profiles.find(p => p.userId === req.userId);

    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado.' });
    }

    const { pinCode, ...safeProfile } = profile;
    res.json(safeProfile);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar perfil.' });
  }
});

// Update profile
router.post('/profile', authMiddleware, async (req, res) => {
  const { stage, age, gestationWeekStart, menopauseStartYear, optInSync, pinEnabled, pinCode, discreteMode, offlineMode } = req.body;

  // --- SUPABASE MODE ---
  if (supabase) {
    try {
      const { error } = await supabase
        .from('perfiles')
        .upsert({
          id: req.userId,
          stage,
          age,
          gestation_week_start: gestationWeekStart,
          menopause_start_year: menopauseStartYear,
          opt_in_sync: optInSync,
          pin_enabled: pinEnabled,
          pin_code: pinCode,
          discrete_mode: discreteMode,
          offline_mode: offlineMode,
          updated_at: new Date().toISOString()
        });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ message: 'Perfil actualizado con éxito en la nube.' });
      return;
    } catch (error) {
      console.error('Supabase profile update error:', error);
      return res.status(500).json({ error: 'Error al actualizar perfil en la nube.' });
    }
  }

  // --- LOCAL FALLBACK MODE ---
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
        discreteMode: discreteMode ?? false,
        offlineMode: offlineMode ?? false,
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
        discreteMode: discreteMode !== undefined ? discreteMode : profiles[profileIndex].discreteMode,
        offlineMode: offlineMode !== undefined ? offlineMode : profiles[profileIndex].offlineMode,
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

// Delete account in cascade
router.post('/delete-account', authMiddleware, async (req, res) => {
  const userId = req.userId;

  // --- SUPABASE MODE ---
  if (supabase) {
    try {
      // Deleting auth.users triggers cascade deletes of perfiles, ciclos, daily_logs, etc.
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ message: 'Cuenta y todos los datos asociados eliminados en cascada de la nube de manera definitiva.' });
      return;
    } catch (error) {
      console.error('Supabase delete account error:', error);
      return res.status(500).json({ error: 'Error al eliminar la cuenta de la nube.' });
    }
  }

  // --- LOCAL FALLBACK MODE ---
  try {
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

    await db.commit();

    res.json({ message: 'Cuenta y todos los datos asociados eliminados en cascada de manera definitiva.' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Error al eliminar la cuenta.' });
  }
});

export default router;
