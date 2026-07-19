import express from 'express';
import { db } from '../db.js';
import { authMiddleware } from '../auth.js';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Bidirectional Sync Endpoint
router.post('/', authMiddleware, async (req, res) => {
  const { cycles = [], dailyLogs = [], triageRecords = [] } = req.body;
  const userId = req.userId;

  // --- SUPABASE SYNC MODE ---
  if (supabase) {
    try {
      // 1. Fetch current server status
      const { data: dbCycles = [] } = await supabase
        .from('ciclos')
        .select('*')
        .eq('user_id', userId);

      const { data: dbDailyLogs = [] } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId);

      const { data: dbTriage = [] } = await supabase
        .from('registros_embarazo')
        .select('*')
        .eq('user_id', userId);

      // --- SYNC CYCLES ---
      for (const clientCycle of cycles) {
        const serverMatch = dbCycles.find(c => c.start_date === clientCycle.startDate);

        if (serverMatch) {
          const clientTime = new Date(clientCycle.updatedAt || 0).getTime();
          const serverTime = new Date(serverMatch.updated_at || 0).getTime();

          if (clientCycle.deleted) {
            if (clientTime > serverTime) {
              await supabase
                .from('ciclos')
                .delete()
                .eq('user_id', userId)
                .eq('start_date', clientCycle.startDate);
            }
          } else if (clientTime > serverTime) {
            await supabase
              .from('ciclos')
              .update({
                end_date: clientCycle.endDate,
                duration: clientCycle.duration,
                updated_at: clientCycle.updatedAt || new Date().toISOString()
              })
              .eq('user_id', userId)
              .eq('start_date', clientCycle.startDate);
          }
        } else if (!clientCycle.deleted) {
          await supabase
            .from('ciclos')
            .insert({
              user_id: userId,
              start_date: clientCycle.startDate,
              end_date: clientCycle.endDate,
              duration: clientCycle.duration,
              updated_at: clientCycle.updatedAt || new Date().toISOString()
            });
        }
      }

      // --- SYNC DAILY LOGS ---
      for (const clientLog of dailyLogs) {
        const serverMatch = dbDailyLogs.find(l => l.date === clientLog.date);

        if (serverMatch) {
          const clientTime = new Date(clientLog.updatedAt || 0).getTime();
          const serverTime = new Date(serverMatch.updated_at || 0).getTime();

          if (clientLog.deleted) {
            if (clientTime > serverTime) {
              await supabase
                .from('daily_logs')
                .delete()
                .eq('user_id', userId)
                .eq('date', clientLog.date);
            }
          } else if (clientTime > serverTime) {
            await supabase
              .from('daily_logs')
              .update({
                mood: clientLog.mood,
                notes: clientLog.notes,
                flow: clientLog.flow,
                pain: clientLog.pain,
                temperature: clientLog.temperature,
                hot_flashes: clientLog.hotFlashes,
                sleep_quality: clientLog.sleepQuality,
                anxiety_level: clientLog.anxietyLevel,
                updated_at: clientLog.updatedAt || new Date().toISOString()
              })
              .eq('user_id', userId)
              .eq('date', clientLog.date);
          }
        } else if (!clientLog.deleted) {
          await supabase
            .from('daily_logs')
            .insert({
              user_id: userId,
              date: clientLog.date,
              mood: clientLog.mood,
              notes: clientLog.notes,
              flow: clientLog.flow,
              pain: clientLog.pain,
              temperature: clientLog.temperature,
              hot_flashes: clientLog.hotFlashes,
              sleep_quality: clientLog.sleepQuality,
              anxiety_level: clientLog.anxietyLevel,
              updated_at: clientLog.updatedAt || new Date().toISOString()
            });
        }
      }

      // --- SYNC TRIAGE RECORDS ---
      for (const clientTriage of triageRecords) {
        const serverMatch = dbTriage.find(t => t.date === clientTriage.date);

        if (serverMatch) {
          const clientTime = new Date(clientTriage.updatedAt || 0).getTime();
          const serverTime = new Date(serverMatch.updated_at || 0).getTime();

          if (clientTriage.deleted) {
            if (clientTime > serverTime) {
              await supabase
                .from('registros_embarazo')
                .delete()
                .eq('user_id', userId)
                .eq('date', clientTriage.date);
            }
          } else if (clientTime > serverTime) {
            await supabase
              .from('registros_embarazo')
              .update({
                gestation_week: clientTriage.gestationWeek,
                symptoms: clientTriage.symptoms,
                classification: clientTriage.classification,
                notes: clientTriage.notes,
                updated_at: clientTriage.updatedAt || new Date().toISOString()
              })
              .eq('user_id', userId)
              .eq('date', clientTriage.date);
          }
        } else if (!clientTriage.deleted) {
          await supabase
            .from('registros_embarazo')
            .insert({
              user_id: userId,
              date: clientTriage.date,
              gestation_week: clientTriage.gestationWeek,
              symptoms: clientTriage.symptoms,
              classification: clientTriage.classification,
              notes: clientTriage.notes,
              updated_at: clientTriage.updatedAt || new Date().toISOString()
            });
        }
      }

      // Fetch fresh sets from Supabase
      const { data: freshCycles = [] } = await supabase
        .from('ciclos')
        .select('*')
        .eq('user_id', userId);

      const { data: freshDailyLogs = [] } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId);

      const { data: freshTriage = [] } = await supabase
        .from('registros_embarazo')
        .select('*')
        .eq('user_id', userId);

      // Map back to camelCase local models
      res.json({
        cycles: freshCycles.map(c => ({
          id: c.id,
          startDate: c.start_date,
          endDate: c.end_date,
          duration: c.duration,
          updatedAt: c.updated_at
        })),
        dailyLogs: freshDailyLogs.map(l => ({
          id: l.id,
          date: l.date,
          mood: l.mood,
          notes: l.notes,
          flow: l.flow,
          pain: l.pain,
          temperature: l.temperature,
          hotFlashes: l.hot_flashes,
          sleepQuality: l.sleep_quality,
          anxietyLevel: l.anxiety_level,
          updatedAt: l.updated_at
        })),
        triageRecords: freshTriage.map(t => ({
          id: t.id,
          date: t.date,
          gestationWeek: t.gestation_week,
          symptoms: t.symptoms,
          classification: t.classification,
          notes: t.notes,
          updatedAt: t.updated_at
        })),
        timestamp: new Date().toISOString()
      });
      return;
    } catch (error) {
      console.error('Supabase Sync error:', error);
      return res.status(500).json({ error: 'Error durante la sincronización con la nube.' });
    }
  }

  // --- LOCAL FALLBACK MODE ---
  try {
    const serverCycles = await db.getCycles();
    const serverDailyLogs = await db.getDailyLogs();
    const serverTriageRecords = await db.getTriageRecords();

    // Sync Cycles
    for (const clientCycle of cycles) {
      const serverMatchIndex = serverCycles.findIndex(
        c => c.userId === userId && c.startDate === clientCycle.startDate
      );

      if (serverMatchIndex !== -1) {
        const serverCycle = serverCycles[serverMatchIndex];
        const clientTime = new Date(clientCycle.updatedAt || 0).getTime();
        const serverTime = new Date(serverCycle.updatedAt || 0).getTime();

        if (clientCycle.deleted) {
          if (clientTime > serverTime) {
            serverCycles.splice(serverMatchIndex, 1);
          }
        } else if (clientTime > serverTime) {
          serverCycles[serverMatchIndex] = {
            ...serverCycle,
            endDate: clientCycle.endDate,
            duration: clientCycle.duration,
            updatedAt: clientCycle.updatedAt || new Date().toISOString()
          };
        }
      } else if (!clientCycle.deleted) {
        serverCycles.push({
          userId,
          startDate: clientCycle.startDate,
          endDate: clientCycle.endDate,
          duration: clientCycle.duration,
          updatedAt: clientCycle.updatedAt || new Date().toISOString()
        });
      }
    }

    // Sync Daily Logs
    for (const clientLog of dailyLogs) {
      const serverMatchIndex = serverDailyLogs.findIndex(
        l => l.userId === userId && l.date === clientLog.date
      );

      if (serverMatchIndex !== -1) {
        const serverLog = serverDailyLogs[serverMatchIndex];
        const clientTime = new Date(clientLog.updatedAt || 0).getTime();
        const serverTime = new Date(serverLog.updatedAt || 0).getTime();

        if (clientLog.deleted) {
          if (clientTime > serverTime) {
            serverDailyLogs.splice(serverMatchIndex, 1);
          }
        } else if (clientTime > serverTime) {
          serverDailyLogs[serverMatchIndex] = {
            ...serverLog,
            mood: clientLog.mood,
            notes: clientLog.notes,
            flow: clientLog.flow,
            pain: clientLog.pain,
            temperature: clientLog.temperature,
            hotFlashes: clientLog.hotFlashes,
            sleepQuality: clientLog.sleepQuality,
            anxietyLevel: clientLog.anxietyLevel,
            updatedAt: clientLog.updatedAt || new Date().toISOString()
          };
        }
      } else if (!clientLog.deleted) {
        serverDailyLogs.push({
          userId,
          date: clientLog.date,
          mood: clientLog.mood,
          notes: clientLog.notes,
          flow: clientLog.flow,
          pain: clientLog.pain,
          temperature: clientLog.temperature,
          hotFlashes: clientLog.hotFlashes,
          sleepQuality: clientLog.sleepQuality,
          anxietyLevel: clientLog.anxietyLevel,
          updatedAt: clientLog.updatedAt || new Date().toISOString()
        });
      }
    }

    // Sync Triage Records
    for (const clientTriage of triageRecords) {
      const serverMatchIndex = serverTriageRecords.findIndex(
        t => t.userId === userId && t.date === clientTriage.date
      );

      if (serverMatchIndex !== -1) {
        const serverTriage = serverTriageRecords[serverMatchIndex];
        const clientTime = new Date(clientTriage.updatedAt || 0).getTime();
        const serverTime = new Date(serverTriage.updatedAt || 0).getTime();

        if (clientTriage.deleted) {
          if (clientTime > serverTime) {
            serverTriageRecords.splice(serverMatchIndex, 1);
          }
        } else if (clientTime > serverTime) {
          serverTriageRecords[serverMatchIndex] = {
            ...serverTriage,
            gestationWeek: clientTriage.gestationWeek,
            symptoms: clientTriage.symptoms,
            classification: clientTriage.classification,
            notes: clientTriage.notes,
            updatedAt: clientTriage.updatedAt || new Date().toISOString()
          };
        }
      } else if (!clientTriage.deleted) {
        serverTriageRecords.push({
          userId,
          date: clientTriage.date,
          gestationWeek: clientTriage.gestationWeek,
          symptoms: clientTriage.symptoms,
          classification: clientTriage.classification,
          notes: clientTriage.notes,
          updatedAt: clientTriage.updatedAt || new Date().toISOString()
        });
      }
    }

    await db.commit();

    const freshCycles = serverCycles.filter(c => c.userId === userId);
    const freshDailyLogs = serverDailyLogs.filter(l => l.userId === userId);
    const freshTriageRecords = serverTriageRecords.filter(t => t.userId === userId);

    res.json({
      cycles: freshCycles,
      dailyLogs: freshDailyLogs,
      triageRecords: freshTriageRecords,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Error durante la sincronización de datos.' });
  }
});

export default router;
